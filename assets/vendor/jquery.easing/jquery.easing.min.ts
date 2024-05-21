(function(factory: (jQuery: JQueryStatic) => void) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function($: JQueryStatic) {
            return factory($);
        });
    } else if (typeof module === "object" && typeof module.exports === "object") {
        exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(function($: JQueryStatic) {
    $.easing.jswing = $.easing.swing;
    const pow = Math.pow,
          sqrt = Math.sqrt,
          sin = Math.sin,
          cos = Math.cos,
          PI = Math.PI,
          c1 = 1.70158,
          c2 = c1 * 1.525,
          c3 = c1 + 1,
          c4 = 2 * PI / 3,
          c5 = 2 * PI / 4.5;

    function bounceOut(x: number): number {
        const n1 = 7.5625,
              d1 = 2.75;
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + .75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + .9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + .984375;
        }
    }

    $.extend($.easing, {
        def: "easeOutQuad",
        swing: function(x: number): number {
            return $.easing[$.easing.def](x);
        },
        easeInQuad: function(x: number): number {
            return x * x;
        },
        easeOutQuad: function(x: number): number {
            return 1 - (1 - x) * (1 - x);
        },
        easeInOutQuad: function(x: number): number {
            return x < .5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
        },
        easeInCubic: function(x: number): number {
            return x * x * x;
        },
        easeOutCubic: function(x: number): number {
            return 1 - pow(1 - x, 3);
        },
        easeInOutCubic: function(x: number): number {
            return x < .5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
        },
        easeInQuart: function(x: number): number {
            return x * x * x * x;
        },
        easeOutQuart: function(x: number): number {
            return 1 - pow(1 - x, 4);
        },
        easeInOutQuart: function(x: number): number {
            return x < .5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
        },
        easeInQuint: function(x: number): number {
            return x * x * x * x * x;
        },
        easeOutQuint: function(x: number): number {
            return 1 - pow(1 - x, 5);
        },
        easeInOutQuint: function(x: number): number {
            return x < .5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
        },
        easeInSine: function(x: number): number {
            return 1 - cos(x * PI / 2);
        },
        easeOutSine: function(x: number): number {
            return sin(x * PI / 2);
        },
        easeInOutSine: function(x: number): number {
            return -(cos(PI * x) - 1) / 2;
        },
        easeInExpo: function(x: number): number {
            return x === 0 ? 0 : pow(2, 10 * x - 10);
        },
        easeOutExpo: function(x: number): number {
            return x === 1 ? 1 : 1 - pow(2, -10 * x);
        },
        easeInOutExpo: function(x: number): number {
            return x === 0 ? 0 : x === 1 ? 1 : x < .5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2;
        },
        easeInCirc: function(x: number): number {
            return 1 - sqrt(1 - pow(x, 2));
        },
        easeOutCirc: function(x: number): number {
            return sqrt(1 - pow(x - 1, 2));
        },
        easeInOutCirc: function(x: number): number {
            return x < .5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
        },
        easeInElastic: function(x: number): number {
            return x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
        },
        easeOutElastic: function(x: number): number {
            return x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - .75) * c4) + 1;
        },
        easeInOutElastic: function(x: number): number {
            return x === 0 ? 0 : x === 1 ? 1 : x < .5 ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2 : pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5) / 2 + 1;
        },
        easeInBack: function(x: number): number {
            return c3 * x * x * x - c1 * x * x;
        },
        easeOutBack: function(x: number): number {
            return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
        },
        easeInOutBack: function(x: number): number {
            return x < .5 ? pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
        },
        easeInBounce: function(x: number): number {
            return 1 - bounceOut(1 - x);
        },
        easeOutBounce: bounceOut,
        easeInOutBounce: function(x: number): number {
            return x < .5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
        }
    });
});