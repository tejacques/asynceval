(function (window) {

    window.async = function (fn) {

        var awaitRegex = /(return)?(var)?\s+(\w+)\s*=\s*await\((.+)\);/i;
        var returnRegex = /return(\s+(.+));/i;

        var fullFnString = fn.toString();
        var fnHeader = fullFnString.substring(0, fullFnString.indexOf("{") + 1);
        var fnRest = fullFnString.substring(fnHeader.length, fullFnString.length - 1);
        var awaitCount = 0;

        // open encapsulating parens
        var fnStr = "(";

        // write functions header
        fnStr += fnHeader;

        // open promise
        fnStr += "return new Promise(function(resolve, reject) {";

        // transform await calls
        //console.log("fnRest, len=" + fnRest.length, fnRest);
        var match, matchAwait, matchReturn, loopCount = 0;
        while ((matchAwait = awaitRegex.exec(fnRest),
                matchReturn = returnRegex.exec(fnRest),
                match = ((matchAwait && matchReturn)
                        ? matchReturn.index < matchAwait.index ? matchReturn : matchAwait
                        : matchAwait || matchReturn))) {
            // write out the part before the match
            var before = fnRest.substring(0, match.index);
            fnStr += before;
            fnRest = fnRest.substring(match.index + match[0].length);

            if (matchAwait === match) {
                var isReturn = !!match[1];
                var isVar = !!match[2];
                var varName = match[3];
                var promise = match[4];

                if (isReturn) {
                    // it's a return
                    fnStr += promise + ".then(resolve,reject);return;";
                } else if (isVar) {
                    // it's a variable decl
                    fnStr += promise + ".then(function(" + varName + "){";
                    awaitCount++;
                }
            } else {
                var returnVal = match[1];

                fnStr += "resolve(" + returnVal + ");return;";
            }
        }

        // write out the remainder of the function
        fnStr += fnRest;

        // close awaits
        for (var i = 0; i < awaitCount; i++) {
            fnStr += "}, reject);";
        }

        // close promise
        fnStr += "});";

        // close function
        fnStr += "}";

        // close encapsulating parens
        fnStr += ")";

        return fnStr;
    };

    window.async.delay = function (timeout) {
        return new Promise(function (resolve) {
            setTimeout(resolve, timeout);
        });
    };

})(window);