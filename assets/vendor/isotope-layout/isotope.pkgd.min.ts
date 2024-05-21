/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("jquery-bridget/jquery-bridget", ["jquery"], function(i: any) {
            return e(t, i);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(t, require("jquery"));
    } else {
        t.jQueryBridget = e(t, t.jQuery);
    }
}(window, function(t: any, e: any) {
    "use strict";

    function i(i: string, s: any, a: any) {
        function u(t: any, e: any, o: any) {
            let n: any;
            const s = `$().${i}("${e}")`;
            t.each(function(t: any, u: any) {
                const h = a.data(u, i);
                if (!h) {
                    r(`${i} not initialized. Cannot call methods, i.e. ${s}`);
                    return;
                }
                const d = h[e];
                if (!d || e.charAt(0) === "_") {
                    r(`${s} is not a valid method`);
                    return;
                }
                const l = d.apply(h, o);
                n = n === undefined ? l : n;
            });
            return n !== undefined ? n : t;
        }

        function h(t: any, e: any) {
            t.each(function(t: any, o: any) {
                let n = a.data(o, i);
                if (n) {
                    n.option(e);
                    n._init();
                } else {
                    n = new s(o, e);
                    a.data(o, i, n);
                }
            });
        }

        a = a || e || t.jQuery;
        if (a) {
            if (!s.prototype.option) {
                s.prototype.option = function(t: any) {
                    if (a.isPlainObject(t)) {
                        this.options = a.extend(true, this.options, t);
                    }
                };
            }
            a.fn[i] = function(t: any) {
                if (typeof t === "string") {
                    const e = n.call(arguments, 1);
                    return u(this, t, e);
                }
                h(this, t);
                return this;
            };
            o(a);
        }
    }

    function o(t: any) {
        if (!t || (t && !t.bridget)) {
            t.bridget = i;
        }
    }

    const n = Array.prototype.slice;
    const s = t.console;
    const r = typeof s === "undefined" ? function() {} : function(t: any) {
        s.error(t);
    };

    return o(e || t.jQuery), i;
}), function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("ev-emitter/ev-emitter", e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e();
    } else {
        t.EvEmitter = e();
    }
}("undefined" !== typeof window ? window : this, function() {
    function t() {}

    const e = t.prototype;

    e.on = function(t: string, e: Function) {
        if (t && e) {
            const i = this._events = this._events || {};
            const o = i[t] = i[t] || [];
            if (o.indexOf(e) === -1) {
                o.push(e);
            }
            return this;
        }
    };

    e.once = function(t: string, e: Function) {
        if (t && e) {
            this.on(t, e);
            const i = this._onceEvents = this._onceEvents || {};
            const o = i[t] = i[t] || {};
            o[e] = true;
            return this;
        }
    };

    e.off = function(t: string, e: Function) {
        const i = this._events && this._events[t];
        if (i && i.length) {
            const o = i.indexOf(e);
            if (o !== -1) {
                i.splice(o, 1);
            }
            return this;
        }
    };

    e.emitEvent = function(t: string, e: any[]) {
        let i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0);
            e = e || [];
            const o = this._onceEvents && this._onceEvents[t];
            for (let n = 0; n < i.length; n++) {
                const s = i[n];
                const r = o && o[s];
                if (r) {
                    this.off(t, s);
                    delete o[s];
                }
                s.apply(this, e);
            }
            return this;
        }
    };

    e.allOff = function() {
        delete this._events;
        delete this._onceEvents;
    };

    return t;
}), function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("get-size/get-size", e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e();
    } else {
        t.getSize = e();
    }
}(window, function() {
    "use strict";

    function t(t: string) {
        const e = parseFloat(t);
        const i = t.indexOf("%") === -1 && !isNaN(e);
        return i && e;
    }

    function e() {}

    function i() {
        const t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        };
        for (let e = 0; e < h; e++) {
            const i = u[e];
            t[i] = 0;
        }
        return t;
    }

    function o(t: any) {
        const e = getComputedStyle(t);
        if (!e) {
            a(`Style returned ${e}. Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1`);
        }
        return e;
    }

    function n() {
        if (!d) {
            d = true;
            const e = document.createElement("div");
            e.style.width = "200px";
            e.style.padding = "1px 2px 3px 4px";
            e.style.borderStyle = "solid";
            e.style.borderWidth = "1px 2px 3px 4px";
            e.style.boxSizing = "border-box";
            const i = document.body || document.documentElement;
            i.appendChild(e);
            const n = o(e);
            r = Math.round(t(n.width)) === 200;
            s.isBoxSizeOuter = r;
            i.removeChild(e);
        }
    }

    function s(e: any) {
        if (n(), typeof e === "string") {
            e = document.querySelector(e);
        }
        if (e && typeof e === "object" && e.nodeType) {
            const s = o(e);
            if (s.display === "none") {
                return i();
            }
            const a: any = {};
            a.width = e.offsetWidth;
            a.height = e.offsetHeight;
            const d = a.isBorderBox = s.boxSizing === "border-box";
            for (let l = 0; l < h; l++) {
                const f = u[l];
                const c = s[f];
                const m = parseFloat(c);
                a[f] = isNaN(m) ? 0 : m;
            }
            const p = a.paddingLeft + a.paddingRight;
            const y = a.paddingTop + a.paddingBottom;
            const g = a.marginLeft + a.marginRight;
            const v = a.marginTop + a.marginBottom;
            const _ = a.borderLeftWidth + a.borderRightWidth;
            const z = a.borderTopWidth + a.borderBottomWidth;
            const I = d && r;
            const x = t(s.width);
            if (x !== false) {
                a.width = x + (I ? 0 : p + _);
            }
            const S = t(s.height);
            if (S !== false) {
                a.height = S + (I ? 0 : y + z);
            }
            a.innerWidth = a.width - (p + _);
            a.innerHeight = a.height - (y + z);
            a.outerWidth = a.width + g;
            a.outerHeight = a.height + v;
            return a;
        }
    }

    let r: boolean;
    const a = typeof console === "undefined" ? e : function(t: any) {
        console.error(t);
    };
    const u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth"
    ];
    const h = u.length;
    let d = false;

    return s;
}), function(t: any, e: any) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("desandro-matches-selector/matches-selector", e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e();
    } else {
        t.matchesSelector = e();
    }
}(window, function() {
    "use strict";

    const t = (function() {
        const t = window.Element.prototype;
        if (t.matches) {
            return "matches";
        }
        if (t.matchesSelector) {
            return "matchesSelector";
        }
        const e = ["webkit", "moz", "ms", "o"];
        for (let i = 0; i < e.length; i++) {
            const o = e[i];
            const n = `${o}MatchesSelector`;
            if (t[n]) {
                return n;
            }
        }
    })();

    return function(e: any, i: any) {
        return e[t](i);
    };
}), function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(i: any) {
            return e(t, i);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(t, require("desandro-matches-selector"));
    } else {
        t.fizzyUIUtils = e(t, t.matchesSelector);
    }
}(window, function(t: any, e: any) {
    const i: any = {};

    i.extend = function(t: any, e: any) {
        for (const i in e) {
            t[i] = e[i];
        }
        return t;
    };

    i.modulo = function(t: number, e: number) {
        return (t % e + e) % e;
    };

    const o = Array.prototype.slice;

    i.makeArray = function(t: any) {
        if (Array.isArray(t)) {
            return t;
        }
        if (t === null || t === undefined) {
            return [];
        }
        const e = typeof t === "object" && typeof t.length === "number";
        return e ? o.call(t) : [t];
    };

    i.removeFrom = function(t: any[], e: any) {
        const i = t.indexOf(e);
        if (i !== -1) {
            t.splice(i, 1);
        }
    };

    i.getParent = function(t: any, i: any) {
        while (t.parentNode && t !== document.body) {
            t = t.parentNode;
            if (e(t, i)) {
                return t;
            }
        }
    };

    i.getQueryElement = function(t: any) {
        return typeof t === "string" ? document.querySelector(t) : t;
    };

    i.handleEvent = function(t: any) {
        const e = `on${t.type}`;
        if (this[e]) {
            this[e](t);
        }
    };

    i.filterFindElements = function(t: any, o: any) {
        t = i.makeArray(t);
        const n: any[] = [];
        t.forEach(function(t: any) {
            if (t instanceof HTMLElement) {
                if (!o) {
                    n.push(t);
                    return;
                }
                if (e(t, o)) {
                    n.push(t);
                }
                const i = t.querySelectorAll(o);
                for (let s = 0; s < i.length; s++) {
                    n.push(i[s]);
                }
            }
        });
        return n;
    };

    i.debounceMethod = function(t: any, e: string, i: number) {
        i = i || 100;
        const o = t.prototype[e];
        const n = `${e}Timeout`;
        t.prototype[e] = function() {
            const t = this[n];
            clearTimeout(t);
            const e = arguments;
            const s = this;
            this[n] = setTimeout(function() {
                o.apply(s, e);
                delete s[n];
            }, i);
        };
    };

    i.docReady = function(t: any) {
        const e = document.readyState;
        if (e === "complete" || e === "interactive") {
            setTimeout(t);
        } else {
            document.addEventListener("DOMContentLoaded", t);
        }
    };

    i.toDashed = function(t: string) {
        return t.replace(/(.)([A-Z])/g, function(t: string, e: string, i: string) {
            return `${e}-${i}`;
        }).toLowerCase();
    };

    const n = t.console;

    i.htmlInit = function(e: any, o: string) {
        i.docReady(function() {
            const s = i.toDashed(o);
            const r = `data-${s}`;
            const a = document.querySelectorAll(`[${r}]`);
            const u = document.querySelectorAll(`.js-${s}`);
            const h = i.makeArray(a).concat(i.makeArray(u));
            const d = `${r}-options`;
            const l = t.jQuery;
            h.forEach(function(t: any) {
                let i: any;
                const s = t.getAttribute(r) || t.getAttribute(d);
                try {
                    i = s && JSON.parse(s);
                } catch (a) {
                    if (n) {
                        n.error(`Error parsing ${r} on ${t.className}: ${a}`);
                    }
                    return;
                }
                const u = new e(t, i);
                if (l) {
                    l.data(t, o, u);
                }
            });
        });
    };

    return i;
}), function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("ev-emitter"), require("get-size"));
    } else {
        t.Outlayer = {};
        t.Outlayer.Item = e(t.EvEmitter, t.getSize);
    }
}(window, function(t: any, e: any) {
    "use strict";

    function i(t: any) {
        for (const e in t) {
            return false;
        }
        return true;
    }

    function o(t: any, e: any) {
        if (t) {
            this.element = t;
            this.layout = e;
            this.position = { x: 0, y: 0 };
            this._create();
        }
    }

    function n(t: string) {
        return t.replace(/([A-Z])/g, function(t: string) {
            return `-${t.toLowerCase()}`;
        });
    }

    const s = document.documentElement.style;
    const r = typeof s.transition === "string" ? "transition" : "WebkitTransition";
    const a = typeof s.transform === "string" ? "transform" : "WebkitTransform";
    const u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend"
    }[r];
    const h = {
        transform: a,
        transition: r,
        transitionDuration: `${r}Duration`,
        transitionProperty: `${r}Property`,
        transitionDelay: `${r}Delay`
    };
    const d = o.prototype = Object.create(t.prototype);
    d.constructor = o;
    d._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        };
        this.css({ position: "absolute" });
    };
    d.handleEvent = function(t: any) {
        const e = `on${t.type}`;
        if (this[e]) {
            this[e](t);
        }
    };
    d.getSize = function() {
        this.size = e(this.element);
    };
    d.css = function(t: any) {
        const e = this.element.style;
        for (const i in t) {
            const o = h[i] || i;
            e[o] = t[i];
        }
    };
    d.getPosition = function() {
        const t = getComputedStyle(this.element);
        const e = this.layout._getOption("originLeft");
        const i = this.layout._getOption("originTop");
        const o = t[e ? "left" : "right"];
        const n = t[i ? "top" : "bottom"];
        let s = parseFloat(o);
        let r = parseFloat(n);
        const a = this.layout.size;
        if (o.indexOf("%") !== -1) {
            s = (s / 100) * a.width;
        }
        if (n.indexOf("%") !== -1) {
            r = (r / 100) * a.height;
        }
        s = isNaN(s) ? 0 : s;
        r = isNaN(r) ? 0 : r;
        s -= e ? a.paddingLeft : a.paddingRight;
        r -= i ? a.paddingTop : a.paddingBottom;
        this.position.x = s;
        this.position.y = r;
    };
    d.layoutPosition = function() {
        const t = this        const t = this.layout.size;
        const e: any = {};
        const i = this.layout._getOption("originLeft");
        const o = this.layout._getOption("originTop");
        const n = i ? "paddingLeft" : "paddingRight";
        const s = i ? "left" : "right";
        const r = i ? "right" : "left";
        const a = this.position.x + t[n];
        e[s] = this.getXValue(a);
        e[r] = "";
        const u = o ? "paddingTop" : "paddingBottom";
        const h = o ? "top" : "bottom";
        const d = o ? "bottom" : "top";
        const l = this.position.y + t[u];
        e[h] = this.getYValue(l);
        e[d] = "";
        this.css(e);
        this.emitEvent("layout", [this]);
    };
    d.getXValue = function(t: number) {
        const e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? `${(t / this.layout.size.width) * 100}%` : `${t}px`;
    };
    d.getYValue = function(t: number) {
        const e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? `${(t / this.layout.size.height) * 100}%` : `${t}px`;
    };
    d._transitionTo = function(t: number, e: number) {
        this.getPosition();
        const i = this.position.x;
        const o = this.position.y;
        const n = t === this.position.x && e === this.position.y;
        if (this.setPosition(t, e), n && !this.isTransitioning) return void this.layoutPosition();
        const s = t - i;
        const r = e - o;
        const a: any = {};
        a.transform = this.getTranslate(s, r);
        this.transition({
            to: a,
            onTransitionEnd: { transform: this.layoutPosition },
            isCleaning: !0
        });
    };
    d.getTranslate = function(t: number, e: number) {
        const i = this.layout._getOption("originLeft");
        const o = this.layout._getOption("originTop");
        return `translate3d(${i ? t : -t}px, ${o ? e : -e}px, 0)`;
    };
    d.goTo = function(t: number, e: number) {
        this.setPosition(t, e);
        this.layoutPosition();
    };
    d.moveTo = d._transitionTo;
    d.setPosition = function(t: number, e: number) {
        this.position.x = parseFloat(t.toString());
        this.position.y = parseFloat(e.toString());
    };
    d._nonTransition = function(t: any) {
        this.css(t.to);
        t.isCleaning && this._removeStyles(t.to);
        for (const e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
    };
    d.transition = function(t: any) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
        const e = this._transn;
        for (const i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            const o = this.element.offsetHeight;
            o;
        }
        this.enableTransition(t.to);
        this.css(t.to);
        this.isTransitioning = !0;
    };
    const l = "opacity," + n(a);
    d.enableTransition = function() {
        if (!this.isTransitioning) {
            const t = this.layout.options.transitionDuration;
            const e = typeof t === "number" ? `${t}ms` : t;
            this.css({
                transitionProperty: l,
                transitionDuration: e,
                transitionDelay: this.staggerDelay || 0
            });
            this.element.addEventListener(u, this, !1);
        }
    };
    d.onwebkitTransitionEnd = function(t: any) {
        this.ontransitionend(t);
    };
    d.onotransitionend = function(t: any) {
        this.ontransitionend(t);
    };
    const f = { "-webkit-transform": "transform" };
    d.ontransitionend = function(t: any) {
        if (t.target === this.element) {
            const e = this._transn;
            const o = f[t.propertyName] || t.propertyName;
            delete e.ingProperties[o];
            if (i(e.ingProperties)) this.disableTransition();
            if (o in e.clean) {
                this.element.style[t.propertyName] = "";
                delete e.clean[o];
            }
            if (o in e.onEnd) {
                const n = e.onEnd[o];
                n.call(this);
                delete e.onEnd[o];
            }
            this.emitEvent("transitionEnd", [this]);
        }
    };
    d.disableTransition = function() {
        this.removeTransitionStyles();
        this.element.removeEventListener(u, this, !1);
        this.isTransitioning = !1;
    };
    d._removeStyles = function(t: any) {
        const e: any = {};
        for (const i in t) e[i] = "";
        this.css(e);
    };
    const c = {
        transitionProperty: "",
        transitionDuration: "",
        transitionDelay: ""
    };
    d.removeTransitionStyles = function() {
        this.css(c);
    };
    d.stagger = function(t: number) {
        t = isNaN(t) ? 0 : t;
        this.staggerDelay = `${t}ms`;
    };
    d.removeElem = function() {
        this.element.parentNode.removeChild(this.element);
        this.css({ display: "" });
        this.emitEvent("remove", [this]);
    };
    d.remove = function() {
        return r && parseFloat(this.layout.options.transitionDuration)
            ? (this.once("transitionEnd", function() {
                  this.removeElem();
              }),
              void this.hide())
            : void this.removeElem();
    };
    d.reveal = function() {
        delete this.isHidden;
        this.css({ display: "" });
        const t = this.layout.options;
        const e: any = {};
        const i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd;
        this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        });
    };
    d.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal");
    };
    d.getHideRevealTransitionEndProperty = function(t: string) {
        const e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (const i in e) return i;
    };
    d.hide = function() {
        this.isHidden = !0;
        this.css({ display: "" });
        const t = this.layout.options;
        const e: any = {};
        const i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd;
        this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        });
    };
    d.onHideTransitionEnd = function() {
        this.isHidden && (this.css({ display: "none" }), this.emitEvent("hide"));
    };
    d.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        });
    };
    return o;
}),
function(t: any, e: any) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i: any, o: any, n: any, s: any) {
            return e(t, i, o, n, s);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item"));
    } else {
        t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item);
    }
}(window, function(t: any, e: any, i: any, o: any, n: any) {
    "use strict";

    function s(t: any, e: any) {
        const i = o.getQueryElement(t);
        if (!i) {
            u && u.error(`Bad element for ${this.constructor.namespace}: ${i || t}`);
            return;
        }
        this.element = i;
        h && (this.$element = h(this.element));
        this.options = o.extend({}, this.constructor.defaults);
        this.option(e);
        const n = ++l;
        this.element.outlayerGUID = n;
        f[n] = this;
        this._create();
        const s = this._getOption("initLayout");
        s && this.layout();
    }

    function r(t: any) {
        function e() {
            t.apply(this, arguments);
        }
        e.prototype = Object.create(t.prototype);
        e.prototype.constructor = e;
        return e;
    }

    function a(t: any) {
        if (typeof t === "number") return t;
        const e = t.match(/(^\d*\.?\d*)(\w*)/);
        const i = e && e[1];
        const o = e && e[2];
        if (!i.length) return 0;
        const n = parseFloat(i);
        const s = m[o] || 1;
        return n * s;
    }

    const u = t.console;
    const h = t.jQuery;
    const d = function() {};
    let l = 0;
    const f: any = {};
    s.namespace = "outlayer";
    s.Item = n;
    s.defaults = {
        containerStyle: { position: "relative" },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
        visibleStyle: { opacity: 1, transform: "scale(1)" }
    };
    const c = s.prototype;
    o.extend(c, e.prototype);
    c.option = function(t: any) {
        o.extend(this.options, t);
    };
    c._getOption = function(t: string) {
        const e = this.constructor.compatOptions[t];
        return e && this.options[e] !== undefined ? this.options[e] : this.options[t];
    };
    s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    };
    c._create = function() {
        this.reloadItems();
        this.stamps = [];
        this.stamp(this.options.stamp);
        o.extend(this.element.style, this.options.containerStyle);
        const t = this._getOption("resize");
        t && this.bindResize();
    };
    c.reloadItems = function() {
        this.items = this._itemize(this.element.children);
    };
    c._itemize = function(t: any) {
        const e = this._filterFindItemElements(t);
        const i = this.constructor.Item;
        const o: any[] = [];
        for (let n = 0; n < e.length; n++) {
            const s = e[n];
            const r = new i(s, this);
            o.push(r);
        }
        return o;
    };
    c._filterFindItemElements = function(t: any) {
        return o.filterFindElements(t, this.options.itemSelector);
    };
    c.getItemElements = function() {
        return this.items.map(function(t: any) {
            return t.element;
        });
    };
    c.layout = function() {
        this._resetLayout();
        this._manageStamps();
        const t = this._getOption("layoutInstant");
        const e = t !== undefined ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e);
        this._isLayoutInited = !0;
    };
    c._init = c.layout;
    c._resetLayout = function() {
        this.getSize();
    };
    c.getSize = function() {
        this.size = i(this.element);
    };
    c._getMeasurement = function(t: string, e: string) {
        const o = this.options[t];
        let n;
        if (o) {
            if (typeof o === "string") {
                n = this.element.querySelector(o);
            } else if (o instanceof HTMLElement) {
                n = o;
            }
            this[t] = n ? i(n)[e] : o;
        } else {
            this[t] = 0;
        }
    };
    c.layoutItems = function(t: any, e: boolean) {
        t = this._getItemsForLayout(t);
        this._layoutItems(t, e);
        this._postLayout();
    };
    c._getItemsForLayout = function(t: any) {
        return t.filter(function(t: any) {
            return !t.isIgnored;
        });
    };
    c._layoutItems = function(t: any, e: boolean) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            const i: any[] = [];
            t.forEach(function(t: any) {
                const o = this._getItemLayoutPosition(t);
                o.item = t;
                o.isInstant = e || t.isLayoutInstant;
                i.push(o);
            }, this);
            this._processLayoutQueue(i);
        }
    };
    c._getItemLayoutPosition = function() {
        return { x: 0, y: 0 };
    };
    c._processLayoutQueue = function(t: any) {
        this.updateStagger();
        t.forEach(function(t: any, e: number) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
        }, this);
    };
    c.updateStagger = function() {
        const t = this.options.stagger;
        this.stagger = t === null || t === undefined ? 0 : a(t);
    };
    c._positionItem = function(t: any, e: number, i: number, o: boolean, n: number) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i));
    };
    c._postLayout = function() {
        this.resizeContainer();
    };
    c.resizeContainer = function() {
        const t = this._getOption("resizeContainer");
        if (t) {
            const e = this._getContainerSize();
            if (e) {
                this._setContainerMeasure(e.width, !0);
                this._setContainerMeasure(e.height, !1);
            }
        }
    };
    c._getContainerSize = d;
    c._setContainerMeasure = function(t: number, e: boolean) {
        if (t !== undefined) {
            const i = this.size;
            if (i.isBorderBox) {
                t += e
                    ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth
                    : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth;
            }
            t = Math.max(t, 0);
            this.element.style[e ? "width" : "height"] = `${t}px`;
        }
    };
    c._emitCompleteOnItems = function(t: string, e: any) {
        function i() {
            n.dispatchEvent(`${t}Complete`, null, [e]);
        }
        function o() {
            r++;
            r === s && i();
        }
        const n = this;
        const s = e.length;
        if (!e || !s) return void i();
        let r = 0;
        e.forEach(function(e: any) {
            e.once(t, o);
        });
    };
    c.dispatchEvent = function(t: string, e: any, i: any) {
        const o = e ? [e].concat(i) : i;
        this.emitEvent(t, o);
        if (h) {
            if (this.$element = this.$element || h(this.element), e) {
                const n = h.Event(e);
                n.type = t;
                this.$element.trigger(n, i);
            } else {
                this.$element.trigger(t, i);
            }
        }
    };
    c.ignore = function(t: any) {
        const e = this.getItem(t);
        if (e) {
            e.isIgnored = !0;
        }
    };
    c.unignore = function(t: any) {
        const e = this.getItem(t);
        if (e) {
            delete e.isIgnored;
        }
    };
    c.stamp = function(t: any) {
        t = this._find(t);
        if (t) {
            this.stamps = this.stamps.concat(t);
            t.forEach(this.ignore, this);
        }
    };
    c.unstamp = function(t: any) {
        t = this._find(t);
        if (t) {
            t.forEach(function(t: any) {
                o.removeFrom(this.stamps, t);
                this.unignore(t);
            }, this);
        }
    };
    c._find = function(t: any) {
        if (t) {
            if (typeof t === "string") {
                t = this.element.querySelectorAll(t);
            }
            return o.makeArray(t);
        }
    };
    c._manageStamps = function() {
        if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            this.stamps.forEach(this._manageStamp, this);
        }
    };
    c._getBoundingRect = function() {
        const t = this.element.getBoundingClientRect();
        const e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        };
    };
    c._manageStamp    = d;
    c._getElementOffset = function(t: any) {
        const e = t.getBoundingClientRect();
        const o = this._boundingRect;
        const n = i(t);
        const s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom
        };
        return s;
    };
    c.handleEvent = o.handleEvent;
    c.bindResize = function() {
        t.addEventListener("resize", this);
        this.isResizeBound = !0;
    };
    c.unbindResize = function() {
        t.removeEventListener("resize", this);
        this.isResizeBound = !1;
    };
    c.onresize = function() {
        this.resize();
    };
    o.debounceMethod(s, "onresize", 100);
    c.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
    };
    c.needsResizeLayout = function() {
        const t = i(this.element);
        const e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth;
    };
    c.addItems = function(t: any) {
        const e = this._itemize(t);
        if (e.length) {
            this.items = this.items.concat(e);
        }
        return e;
    };
    c.appended = function(t: any) {
        const e = this.addItems(t);
        if (e.length) {
            this.layoutItems(e, !0);
            this.reveal(e);
        }
    };
    c.prepended = function(t: any) {
        const e = this._itemize(t);
        if (e.length) {
            const i = this.items.slice(0);
            this.items = e.concat(i);
            this._resetLayout();
            this._manageStamps();
            this.layoutItems(e, !0);
            this.reveal(e);
            this.layoutItems(i);
        }
    };
    c.reveal = function(t: any) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            const e = this.updateStagger();
            t.forEach(function(t: any, i: number) {
                t.stagger(i * e);
                t.reveal();
            });
        }
    };
    c.hide = function(t: any) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            const e = this.updateStagger();
            t.forEach(function(t: any, i: number) {
                t.stagger(i * e);
                t.hide();
            });
        }
    };
    c.revealItemElements = function(t: any) {
        const e = this.getItems(t);
        this.reveal(e);
    };
    c.hideItemElements = function(t: any) {
        const e = this.getItems(t);
        this.hide(e);
    };
    c.getItem = function(t: any) {
        for (let e = 0; e < this.items.length; e++) {
            const i = this.items[e];
            if (i.element === t) {
                return i;
            }
        }
    };
    c.getItems = function(t: any) {
        t = o.makeArray(t);
        const e: any[] = [];
        t.forEach(function(t: any) {
            const i = this.getItem(t);
            if (i) {
                e.push(i);
            }
        }, this);
        return e;
    };
    c.remove = function(t: any) {
        const e = this.getItems(t);
        this._emitCompleteOnItems("remove", e);
        if (e && e.length) {
            e.forEach(function(t: any) {
                t.remove();
                o.removeFrom(this.items, t);
            }, this);
        }
    };
    c.destroy = function() {
        const t = this.element.style;
        t.height = "";
        t.position = "";
        t.width = "";
        this.items.forEach(function(t: any) {
            t.destroy();
        });
        this.unbindResize();
        const e = this.element.outlayerGUID;
        delete f[e];
        delete this.element.outlayerGUID;
        h && h.removeData(this.element, this.constructor.namespace);
    };
    s.data = function(t: any) {
        t = o.getQueryElement(t);
        const e = t && t.outlayerGUID;
        return e && f[e];
    };
    s.create = function(t: string, e: any) {
        const i = r(s);
        i.defaults = o.extend({}, s.defaults);
        o.extend(i.defaults, e);
        i.compatOptions = o.extend({}, s.compatOptions);
        i.namespace = t;
        i.data = s.data;
        i.Item = r(n);
        o.htmlInit(i, t);
        h && h.bridget && h.bridget(t, i);
        return i;
    };
    const m: any = {
        ms: 1,
        s: 1e3
    };
    return s.Item = n, s;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("isotope-layout/js/item", ["outlayer/outlayer"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("outlayer"));
    } else {
        t.Isotope = t.Isotope || {};
        t.Isotope.Item = e(t.Outlayer);
    }
}(window, function(t: any) {
    "use strict";

    function e() {
        t.Item.apply(this, arguments);
    }

    const i = e.prototype = Object.create(t.Item.prototype);
    const o = i._create;
    i._create = function() {
        this.id = this.layout.itemGUID++;
        o.call(this);
        this.sortData = {};
    };
    i.updateSortData = function() {
        if (!this.isIgnored) {
            this.sortData.id = this.id;
            this.sortData["original-order"] = this.id;
            this.sortData.random = Math.random();
            const t = this.layout.options.getSortData;
            const e = this.layout._sorters;
            for (const i in t) {
                const o = e[i];
                this.sortData[i] = o(this.element, this);
            }
        }
    };
    const n = i.destroy;
    i.destroy = function() {
        n.apply(this, arguments);
        this.css({ display: "" });
    };
    return e;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("isotope-layout/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("get-size"), require("outlayer"));
    } else {
        t.Isotope = t.Isotope || {};
        t.Isotope.LayoutMode = e(t.getSize, t.Outlayer);
    }
}(window, function(t: any, e: any) {
    "use strict";

    function i(t: any) {
        this.isotope = t;
        if (t) {
            this.options = t.options[this.namespace];
            this.element = t.element;
            this.items = t.filteredItems;
            this.size = t.size;
        }
    }

    const o = i.prototype;
    const n = [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption"
    ];
    n.forEach(function(t: string) {
        o[t] = function() {
            return e.prototype[t].apply(this.isotope, arguments);
        };
    });
    o.needsVerticalResizeLayout = function() {
        const e = t(this.isotope.element);
        const i = this.isotope.size && e;
        return i && e.innerHeight !== this.isotope.size.innerHeight;
    };
    o._getMeasurement = function() {
        this.isotope._getMeasurement.apply(this, arguments);
    };
    o.getColumnWidth = function() {
        this.getSegmentSize("column", "Width");
    };
    o.getRowHeight = function() {
        this.getSegmentSize("row", "Height");
    };
    o.getSegmentSize = function(t: string, e: string) {
        const i = `${t}${e}`;
        const o = `outer${e}`;
        this._getMeasurement(i, o);
        if (!this[i]) {
            const n = this.getFirstItemSize();
            this[i] = (n && n[o]) || this.isotope.size[`inner${e}`];
        }
    };
    o.getFirstItemSize = function() {
        const e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
    };
    o.layout = function() {
        this.isotope.layout.apply(this.isotope, arguments);
    };
    o.getSize = function() {
        this.isotope.getSize();
        this.size = this.isotope.size;
    };
    i.modes = {};
    i.create = function(t: string, e: any) {
        function n() {
            i.apply(this, arguments);
        }
        n.prototype = Object.create(o);
        n.prototype.constructor = n;
        if (e) {
            n.options = e;
        }
        n.prototype.namespace = t;
        i.modes[t] = n;
        return n;
    };
    return i;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("masonry-layout/masonry", ["outlayer/outlayer", "get-size/get-size"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("outlayer"), require("get-size"));
    } else {
        t.Masonry = e(t.Outlayer, t.getSize);
    }
}(window, function(t: any, e: any) {
    const i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    const o = i.prototype;
    o._resetLayout = function() {
        this.getSize();
        this._getMeasurement("columnWidth", "outerWidth");
        this._getMeasurement("gutter", "outerWidth");
        this.measureColumns();
        this.colYs = [];
        for (let t = 0; t < this.cols; t++) {
            this.colYs.push(0);
        }
        this.maxY = 0;
        this.horizontalColIndex = 0;
    };
    o.measureColumns = function() {
        this.getContainerWidth();
        if (!this.columnWidth) {
            const t = this.items[0];
            const i = t && t.element;
            this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        const o = this.columnWidth += this.gutter;
        const n = this.containerWidth + this.gutter;
        const s = n / o;
        const r = o - (n % o);
        const a = r && r < 1 ? "round" : "floor";
        this.cols = Math.max(Math[a](s), 1);
    };
    o.getContainerWidth = function() {
        const t = this._getOption("fitWidth");
        const i = t ? this.element.parentNode : this.element;
        const o = e(i);
        this.containerWidth = o && o.innerWidth;
    };
    o._getItemLayoutPosition = function(t: any) {
        t.getSize();
        const e = t.size.outerWidth % this.columnWidth;
        const i = e && e < 1 ? "round" : "ceil";
        const o = Math[i](t.size.outerWidth / this.columnWidth);
        const n = Math.min(o, this.cols);
        const s = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition";
        const r = this[s](n, t);
        const a = {
            x: this.columnWidth * r.col,
            y: r.y
        };
        const u = r.y + t.size.outerHeight;
        const h = n + r.col;
        for (let d = r.col; d < h; d++) {
            this.colYs[d] = u;
        }
        return a;
    };
    o._getTopColPosition = function(t: number) {
        const e = this._getTopColGroup(t);
        const i = Math.min.apply(Math, e);
        return {
            col: e.indexOf(i),
            y: i
        };
    };
    o._getTopColGroup = function(t: number) {
        if (t < 2) {
            return this.colYs;
        }
        const e: any[] = [];
        const i = this.cols + 1 - t;
        for (let o = 0; o < i; o++) {
            e[o] = this._getColGroupY(o, t);
        }
        return e;
    };
    o._getColGroupY = function(t: number, e: number) {
        if (e < 2) {
            return this.colYs[t];
        }
        const i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
    };
    o._getHorizontalColPosition = function(t: number, e: any) {
        const i = this.horizontalColIndex % this.cols;
        const o = t > 1 && i + t > this.cols;
        const n = o ? 0 : i;
        const s = e.size.outerWidth && e.size.outerHeight;
        this.horizontalColIndex = s ? n + t : this.horizontalColIndex;
        return {
            col: n,
            y: this._getColGroupY(n, t)
        };
    };
    o._manageStamp = function(t: any) {
        const i = e(t);
        const o = this._getElementOffset(t);
        const n = this._getOption("originLeft");
        const s = n ? o.left : o.right;
        const r = s + i.outerWidth;
        const a = Math.floor(s / this.columnWidth);
        const u = Math.max(0, a);
        const h = Math.floor(r / this.columnWidth);
        const d = h - (r % this.columnWidth ? 0 : 1);
        const l = Math.min(this.cols - 1, d);
        const f = this._getOption("originTop");
        const c = (f ? o.top : o.bottom) + i.outerHeight;
        for (let m = u; m <= l; m++) {
            this.colYs[m] = Math.max(c, this.colYs[m]);
        }
    };
    o._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        const t = {
            height: this.maxY
        };
        if (this._getOption("fitWidth")) {
            t.width = this._getContainerFitWidth();
        }
        return t;
    };
    o._getContainerFitWidth = function() {
        let t = 0;
        for (let e = this.cols; --e && this.colYs[e] === 0; ) {
            t++;
        }
        return (this.cols - t) * this.columnWidth - this.gutter;
    };
    o.needsResizeLayout = function() {
        const t = this.containerWidth;
        this.getContainerWidth();
        return t !== this.containerWidth;
    };
    return i;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("isotope-layout/js/layout-modes/masonry", ["../layout-mode", "masonry-layout/masonry"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("../layout-mode"), require("masonry-layout"));
    } else {
        e(t.Isotope.LayoutMode, t.Masonry);
    }
}(window, function(t: any, e: any) {
    "use strict";

    const i = t.create("masonry");
    const o = i.prototype;
    const n = {
        _getElementOffset: !0,
        layout: !0,
        _getMeasurement: !0
    };
    for (const s in e.prototype) {
        if (!n[s]) {
            o[s] = e.prototype[s];
        }
    }
    const r = o.measureColumns;
    o.measureColumns = function() {
        this.items = this.isotope.filteredItems;
        r.call(this);
    };
    const a = o._getOption;
    o._getOption = function(t: string) {
        if (t === "fitWidth") {
            return this.options.isFitWidth !== undefined ? this.options.isFitWidth : this.options.fitWidth;
        }
        return a.apply(this.isotope, arguments);
    };
    return i;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e);
    } else if (typeof exports === "object") {
        module.exports = e(require("../layout-mode"));
    } else {
        e(t.Isotope.LayoutMode);
    }
}(window, function(t: any) {
    "use strict";

    const e = t.create("fitRows");
    const i = e.prototype;
    i._resetLayout = function() {
        this.x = 0;
        this.y = 0;
        this.maxY = 0;
        this._getMeasurement("gutter", "outerWidth");
    };
    i._getItemLayoutPosition = function(t: any) {
        t.getSize();
        const e = t.size.outerWidth + this.gutter;
        const i = this.isotope.size.innerWidth + this.gutter;
        if (this.x !== 0 && e + this.x > i) {
            this.x = 0;
            this.y = this.maxY;
        }
        const o = {
            x: this.x,
            y: this.y
        };
        this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight);
        this.x += e;
        return o;
    };
    i._getContainerSize = function() {
        return {
            height: this.maxY
        };
    };
    return e;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e);
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(require("../layout-mode"));
    } else {
        e(t.Isotope.LayoutMode);
    }
}(window, function(t: any)``` 
{
    "use strict";

    const e = t.create("vertical", { horizontalAlignment: 0 });
    const i = e.prototype;
    i._resetLayout = function() {
        this.y = 0;
    };
    i._getItemLayoutPosition = function(t: any) {
        t.getSize();
        const e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment;
        const i = this.y;
        this.y += t.size.outerHeight;
        return { x: e, y: i };
    };
    i._getContainerSize = function() {
        return { height: this.y };
    };
    return e;
}),
function(t: any, e: any) {
    if (typeof define === "function" && define.amd) {
        define([
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope-layout/js/item",
            "isotope-layout/js/layout-mode",
            "isotope-layout/js/layout-modes/masonry",
            "isotope-layout/js/layout-modes/fit-rows",
            "isotope-layout/js/layout-modes/vertical"
        ], function(i: any, o: any, n: any, s: any, r: any, a: any) {
            return e(t, i, o, n, s, r, a);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = e(
            t,
            require("outlayer"),
            require("get-size"),
            require("desandro-matches-selector"),
            require("fizzy-ui-utils"),
            require("isotope-layout/js/item"),
            require("isotope-layout/js/layout-mode"),
            require("isotope-layout/js/layout-modes/masonry"),
            require("isotope-layout/js/layout-modes/fit-rows"),
            require("isotope-layout/js/layout-modes/vertical")
        );
    } else {
        t.Isotope = e(
            t,
            t.Outlayer,
            t.getSize,
            t.matchesSelector,
            t.fizzyUIUtils,
            t.Isotope.Item,
            t.Isotope.LayoutMode
        );
    }
}(window, function(t: any, e: any, i: any, o: any, n: any, s: any, r: any) {
    function a(t: any, e: any) {
        return function(i: any, o: any) {
            for (let n = 0; n < t.length; n++) {
                const s = t[n];
                const r = i.sortData[s];
                const a = o.sortData[s];
                if (r > a || r < a) {
                    const u = e[s] !== undefined ? e[s] : e;
                    const h = u ? 1 : -1;
                    return (r > a ? 1 : -1) * h;
                }
            }
            return 0;
        };
    }

    const u = t.jQuery;
    const h = String.prototype.trim
        ? function(t: string) {
              return t.trim();
          }
        : function(t: string) {
              return t.replace(/^\s+|\s+$/g, "");
          };
    const d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: true,
        sortAscending: true
    });
    d.Item = s;
    d.LayoutMode = r;
    const l = d.prototype;
    l._create = function() {
        this.itemGUID = 0;
        this._sorters = {};
        this._getSorters();
        e.prototype._create.call(this);
        this.modes = {};
        this.filteredItems = this.items;
        this.sortHistory = ["original-order"];
        for (const t in r.modes) {
            this._initLayoutMode(t);
        }
    };
    l.reloadItems = function() {
        this.itemGUID = 0;
        e.prototype.reloadItems.call(this);
    };
    l._itemize = function() {
        const t = e.prototype._itemize.apply(this, arguments);
        for (let i = 0; i < t.length; i++) {
            const o = t[i];
            o.id = this.itemGUID++;
        }
        this._updateItemsSortData(t);
        return t;
    };
    l._initLayoutMode = function(t: string) {
        const e = r.modes[t];
        const i = this.options[t] || {};
        this.options[t] = e.options ? n.extend(e.options, i) : i;
        this.modes[t] = new e(this);
    };
    l.layout = function() {
        if (!this._isLayoutInited && this._getOption("initLayout")) {
            this.arrange();
        } else {
            this._layout();
        }
    };
    l._layout = function() {
        const t = this._getIsInstant();
        this._resetLayout();
        this._manageStamps();
        this.layoutItems(this.filteredItems, t);
        this._isLayoutInited = true;
    };
    l.arrange = function(t: any) {
        this.option(t);
        this._getIsInstant();
        const e = this._filter(this.items);
        this.filteredItems = e.matches;
        this._bindArrangeComplete();
        this._isInstant ? this._noTransition(this._hideReveal, [e]) : this._hideReveal(e);
        this._sort();
        this._layout();
    };
    l._init = l.arrange;
    l._hideReveal = function(t: any) {
        this.reveal(t.needReveal);
        this.hide(t.needHide);
    };
    l._getIsInstant = function() {
        const t = this._getOption("layoutInstant");
        const e = t !== undefined ? t : !this._isLayoutInited;
        this._isInstant = e;
        return e;
    };
    l._bindArrangeComplete = function() {
        function t() {
            e && i && o && n.dispatchEvent("arrangeComplete", null, [n.filteredItems]);
        }
        let e, i, o;
        const n = this;
        this.once("layoutComplete", function() {
            e = true;
            t();
        });
        this.once("hideComplete", function() {
            i = true;
            t();
        });
        this.once("revealComplete", function() {
            o = true;
            t();
        });
    };
    l._filter = function(t: any) {
        const e = this.options.filter || "*";
        const i: any[] = [];
        const o: any[] = [];
        const n: any[] = [];
        const s = this._getFilterTest(e);
        for (let r = 0; r < t.length; r++) {
            const a = t[r];
            if (!a.isIgnored) {
                const u = s(a);
                if (u) {
                    i.push(a);
                }
                if (u && a.isHidden) {
                    o.push(a);
                } else if (!u && !a.isHidden) {
                    n.push(a);
                }
            }
        }
        return { matches: i, needReveal: o, needHide: n };
    };
    l._getFilterTest = function(t: any) {
        if (u && this.options.isJQueryFiltering) {
            return function(e: any) {
                return u(e.element).is(t);
            };
        }
        if (typeof t === "function") {
            return function(e: any) {
                return t(e.element);
            };
        }
        return function(e: any) {
            return o(e.element, t);
        };
    };
    l.updateSortData = function(t: any) {
        let e;
        if (t) {
            t = n.makeArray(t);
            e = this.getItems(t);
        } else {
            e = this.items;
        }
        this._getSorters();
        this._updateItemsSortData(e);
    };
    l._getSorters = function() {
        const t = this.options.getSortData;
        for (const e in t) {
            const i = t[e];
            this._sorters[e] = f(i);
        }
    };
    l._updateItemsSortData = function(t: any) {
        const e = t && t.length;
        for (let i = 0; i < e; i++) {
            const o = t[i];
            o.updateSortData();
        }
    };
    const f = (function() {
        function t(t: any) {
            if (typeof t !== "string") {
                return t;
            }
            const i = h(t).split(" ");
            const o = i[0];
            const n = o.match(/^\[(.+)\]$/);
            const s = n && n[1];
            const r = e(s, o);
            const a = d.sortDataParsers[i[1]];
            return t = a
                ? function(t: any) {
                      return t && a(r(t));
                  }
                : function(t: any) {
                      return t && r(t);
                  };
        }
        function e(t: any, e: any) {
            return t
                ? function(e: any) {
                      return e.getAttribute(t);
                  }
                : function(t: any) {
                      const i = t.querySelector(e);
                      return i && i.textContent;
                  };
        }
        return t;
    })();
    d.sortDataParsers = {
        parseInt: function(t: any) {
            return parseInt(t, 10);
        },
        parseFloat: function(t: any) {
            return parseFloat(t);
        }
    };
    l._sort = function() {
        if (this.options.sortBy) {
            const t = n.makeArray(this.options.sortBy);
            if (!this._getIsSameSortBy(t)) {
                this.sortHistory = t.concat(this.sortHistory);
            }
            const e = a(this.sortHistory, this.options.sortAscending);
            this.filteredItems.sort(e);
        }
    };
    l._getIsSameSortBy = function(t: any) {
        for (let e = 0; e < t.length; e++) {
            if (t[e] !== this.sortHistory[e]) {
                return false;
            }
        }
        return true;
    };
    l._mode = function() {
        const t = this.options.layoutMode;
        const e = this.modes[t];
        if (!e) {
            throw new Error(`No layout mode: ${t}`);
        }
        e.options = this.options[t];
        return e;
    };
    l._resetLayout = function() {
        e.prototype._resetLayout.call(this);
        this._mode()._resetLayout();
    };
    l._getItemLayoutPosition = function(t: any) {
        return this._mode()._getItemLayoutPosition(t);
    };
    l._manageStamp = function(t: any) {
        this._mode()._manageStamp(t);
    };
    l._getContainerSize = function() {
        return this._mode()._getContainerSize();
    };
    l.needsResizeLayout = function() {
        return this._mode().needsResizeLayout();
    };
    l.appended = function(t: any) {
        const e = this.addItems(t);
        if (e.length) {
            const i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i);
        }
    };
    l.prepended = function(t: any) {
        const e = this._itemize(t);
        if (e.length) {
            this._resetLayout();
            this._manageStamps();
            const i = this._filterRevealAdded(e);
            this.layoutItems(this.filteredItems);
            this.filteredItems = i.concat(this.filteredItems);
            this.items = e.concat(this.items);
        }
    };
    l._filterRevealAdded = function(t: any) {
        const e = this._filter(t);
        this.hide(e.needHide);
        this.reveal(e.matches);
        this.layoutItems(e.matches, true);
        return e.matches;
    };
    l.insert = function(t: any) {
        const e = this.addItems(t);
        if (e.length) {
            for (let i = 0; i < e.length; i++) {
                const o = e[i];
                this.element.appendChild(o.element);
            }
            const n = this._filter(e).matches;
            for (let i = 0; i < e.length; i++) {
                e[i].isLayoutInstant = true;
            }
            this.arrange();
            for (let i = 0; i < e.length; i++) {
                delete e[i].isLayoutInstant;
            }
            this.reveal(n);
        }
    };
    const c = l.remove;
    l.remove = function(t: any) {
        t = n.makeArray(t);
        const e = this.getItems(t);
        c.call(this, t);
        for (let i = 0; i < e.length; i++) {
            const o = e[i];
            n.removeFrom(this.filteredItems, o);
        }
    };
    l.shuffle = function() {
        for (let t = 0; t < this.items.length; t++) {
            const e = this.items[t];
            e.sortData.random = Math.random();
        }
        this.options.sortBy = "random";
        this._sort();
        this._layout();
    };
    l._noTransition = function(t: any, e: any) {
        const i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        const o = t.apply(this, e);
        this.options.transitionDuration = i;
        return o;
    };
    l.getFilteredItemElements = function() {
        return this.filteredItems.map(function(t: any) {
            return t.element;
        });
    };
    return d;
});