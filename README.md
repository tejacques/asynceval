asynceval
===========

Write es7-style async functions in es5

How do I get it?
----------------

asynceval will soon be available through Bower/NPM

What is it?
-----------

asynceval is a small library for creating es7-style async functions.

How do I use it?
----------------

Using asynceval is fairly simple. You'll need an es6-promise polyfill or native support, and then all you need to do is add a script tag on your page serving asynceval.js before other javascript that uses it, and you're good to go.

```.js
(function () {

    var promiseValue = Promise.resolve(10);

    // async function
    var asyncValueAfter = eval(async(function (x, y) {
        await async.delay(y);
        return x;
    }));

    // promise-style equivalent to above
    var promiseValueAfter = function(x, y) {
        return new Promise(function(resolve, reject) {
            async.delay(y).then(function() {
                resolve(x);
            });
        });
    };

    // more complex example
    var asyncfn = eval(async(function (time) {
        var x = await(promiseValue);
        var y = await(asyncValueAfter(20, time));

        console.log(x + y);
        return x + y;
    }));

    // true es7 async function syntax
    var es7asyncfn = async function(time) {
        var x = await promiseValue;
        var y = await asyncValueAfter(20, time);

        console.log(x + y);
        return x + y;
    };

    asyncfn(1000); // returns a promise with the value of 30, and prints 30 after 1 second
    asyncfn(2000); // returns a promise with the value of 30, and prints 30 after 2 seconds
    asyncfn(3000); // returns a promise with the value of 30, and prints 30 after 3 seconds
})();
```

Why was it made?
----------------

asynceval.js was made for funsies and to show how flexible and extensible JavaScript is, that you can add essentially new language features to it.
