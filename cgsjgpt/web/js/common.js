//高度自适应
$(window).resize(function (e) {
    $(".loginbox").height($(window).height());
    $(".main").height($(window).height() - $(".header").height() - $(".footer").height() - 1);
    $(".left").height($(".main").height());
    $(".right").height($(".main").height());
    $(".rightdown").height($(".right").height() - 27);
    $("#iframe").height($(window).height() - $(".header").height() - $(".footer").height() - 29);
}).resize();

/*
//顶部菜单显示隐藏
$(".menuup").click(function(){
  $(".headdown").slideUp("fast");
});
$(".nav li").click(function(){
	//alert($(".nav .selected").size());		
  $(".nav .selected").removeClass();
  $("a",this).addClass("selected");
  $(".headdown").slideDown("fast");
});
//
$(".menuright").hide();
//左侧菜单收缩
$(".menuleft").click(function(){
   $(".left").hide();
   $(".menuright").show();
});
//左侧菜单展开
$(".menuright").click(function(){
   $(".left").show();
   $(".menuright").hide();
});
*/
//IE7下菜单背景BUG
$(".menuson li a").css("width", $(".menuson").width());

//隔行换色
//$('.simpletable tbody tr:even').addClass('even');

/**

     * 对象合并polyfill

     * */

function zyEs6AssignPolyfill() {

    if (!Object.assign) {

        Object.defineProperty(Object, "assign", {

            enumerable: false,

            configurable: true,

            writable: true,

            value: function (target, firstSource) {

                "use strict";

                if (target === undefined || target === null)

                    throw new TypeError("Cannot convert first argument to object");

                var to = Object(target);

                for (var i = 1; i < arguments.length; i++) {

                    var nextSource = arguments[i];

                    if (nextSource === undefined || nextSource === null) continue;

                    var keysArray = Object.keys(Object(nextSource));

                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {

                        var nextKey = keysArray[nextIndex];

                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

                        if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];

                    }

                }

                return to;

            }

        });

    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (func, thisArg) {
            'use strict';
            if (!((typeof func === 'Function' || typeof func === 'function') && this))
                throw new TypeError();

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;
            if (thisArg === undefined) {
                while (++i !== len) {
                    // checks to see if the key was set
                    if (i in this) {
                        if (func(t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            }
            else {
                while (++i !== len) {
                    // checks to see if the key was set
                    if (i in this) {
                        if (func.call(thisArg, t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            }

            res.length = c; // shrink down array to proper size
            return res;
        };
    }
    if (!Array.prototype.find) {
        Array.prototype.find = function (func, thisArg) {
            'use strict';
            if (!((typeof func === 'Function' || typeof func === 'function') && this))
                throw new TypeError();

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    if (func.call(thisArg, t[i], i, t)) {
                        return t[i];
                    }
                }
            }
            return undefined;
        };
    }
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find_bak) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function (predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
}
zyEs6AssignPolyfill();