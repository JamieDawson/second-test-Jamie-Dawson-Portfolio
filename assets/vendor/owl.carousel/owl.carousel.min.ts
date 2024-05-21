/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!function(a: any, b: any, c: any, d: any) {
    function e(b: any, c: any) {
        this.settings = null;
        this.options = a.extend({}, e.Defaults, c);
        this.$element = a(b);
        this._handlers = {};
        this._plugins = {};
        this._supress = {};
        this._current = null;
        this._speed = null;
        this._coordinates = [];
        this._breakpoint = null;
        this._width = null;
        this._items = [];
        this._clones = [];
        this._mergers = [];
        this._widths = [];
        this._invalidated = {};
        this._pipe = [];
        this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null };
        this._states = { current: {}, tags: { initializing: ["busy"], animating: ["busy"], dragging: ["interacting"] } };
        a.each(["onResize", "onThrottledResize"], a.proxy(function(b: any, c: any) {
            this._handlers[c] = a.proxy(this[c], this);
        }, this));
        a.each(e.Plugins, a.proxy(function(a: any, b: any) {
            this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this));
        a.each(e.Workers, a.proxy(function(b: any, c: any) {
            this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this));
        this.setup();
        this.initialize();
    }

    e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: b,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    };

    e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    };

    e.Type = {
        Event: "event",
        State: "state"
    };

    e.Plugins = {};

    e.Workers = [
        {
            filter: ["width", "settings"],
            run: function() {
                this._width = this.$element.width();
            }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function(a: any) {
9                 a.current = this._items && this._items[this.relative(this._current)];
9             }
9         },
9         {
9             filter: ["items", "settings"],
9             run: function() {
9                 this.$stage.children(".cloned").remove();
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function(a: any) {
9                 var b = this.settings.margin || "",
9                     c = !this.settings.autoWidth,
9                     d = this.settings.rtl,
9                     e = { width: "auto", "margin-left": d ? b : "", "margin-right": d ? "" : b };
9                 !c && this.$stage.children().css(e);
9                 a.css = e;
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function(a: any) {
9                 var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
9                     c = null,
9                     d = this._items.length,
9                     e = !this.settings.autoWidth,
9                     f = [];
9                 for (a.items = { merge: !1, width: b }; d--;) {
9                     c = this._mergers[d];
9                     c = this.settings.mergeFit && Math.min(c, this.settings.items) || c;
9                     a.items.merge = c > 1 || a.items.merge;
9                     f[d] = e ? b * c : this._items[d].width();
9                 }
9                 this._widths = f;
9             }
9         },
9         {
9             filter: ["items", "settings"],
9             run: function() {
9                 var b = [],
9                     c = this._items,
9                     d = this.settings,
9                     e = Math.max(2 * d.items, 4),
9                     f = 2 * Math.ceil(c.length / 2),
9                     g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
9                     h = "",
9                     i = "";
9                 for (g /= 2; g > 0;) {
9                     b.push(this.normalize(b.length / 2, !0));
9                     h += c[b[b.length - 1]][0].outerHTML;
9                     b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0));
9                     i = c[b[b.length - 1]][0].outerHTML + i;
9                     g -= 1;
9                 }
9                 this._clones = b;
9                 a(h).addClass("cloned").appendTo(this.$stage);
9                 a(i).addClass("cloned").prependTo(this.$stage);
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function() {
9                 for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) {
9                     d = f[c - 1] || 0;
9                     e = this._widths[this.relative(c)] + this.settings.margin;
9                     f.push(d + e * a);
9                 }
9                 this._coordinates = f;
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function() {
9                 var a = this.settings.stagePadding,
9                     b = this._coordinates,
9                     c = { width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a, "padding-left": a || "", "padding-right": a || "" };
9                 this.$stage.css(c);
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function(a: any) {
9                 var b = this._coordinates.length,
9                     c = !this.settings.autoWidth,
9                     d = this.$stage.children();
9                 if (c && a.items.merge) for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
9                 else c && (a.css.width = a.items.width, d.css(a.css));
9             }
9         },
9         {
9             filter: ["items"],
9             run: function() {
9                 this._coordinates.length < 1 && this.$stage.removeAttr("style");
9             }
9         },
9         {
9             filter: ["width", "items", "settings"],
9             run: function(a: any) {
9                 a.current = a.current ? this.$stage.children().index(a.current) : 0;
9                 a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current));
9                 this.reset(a.current);
9             }
9         },
9         {
9             filter: ["position"],
9             run: function() {
9                 this.animate(this.coordinates(this._current));
9             }
9         },
9         {
9             filter: ["width", "position", "items", "settings"],
9             run: function() {
9                 var a, b, c, d, e = this.settings.rtl ? 1 : -1,
9                     f = 2 * this.settings.stagePadding,
9                     g = this.coordinates(this.current()) + f,
9                     h = g + this.width() * e,
9                     i = [];
9                 for (c = 0, d = this._coordinates.length; c < d; c++) {
9                     a = this._coordinates[c - 1] || 0;
9                     b = Math.abs(this._coordinates[c]) + f * e;
9                     (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
9                 }
9                 this.$stage.children(".active").removeClass("active");
9                 this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active");
9                 this.$stage.children(".center").removeClass("center");
9                 this.settings.center && this.$stage.children().eq(this.current()).addClass("center");
9             }
9         }
9     ];
9 
9     e.prototype.initializeStage = function() {
9         this.$stage = this.$element.find("." + this.settings.stageClass);
9         this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ">", { class: this.settings.stageClass }).wrap(a("<div/>", { class: this.settings.stageOuterClass })), this.$element.append(this.$stage.parent()));
9     };
9 
9     e.prototype.initializeItems = function() {
9         var b = this.$element.find(".owl-item");
9         if (b.length) return this._items = b.get().map(function(b: any) { return a(b); }), this._mergers = this._items.map(function() { return 1; }), void this.refresh();
9         this.replace(this.$element.children().not(this.$stage.parent()));
9         this.isVisible() ? this.refresh() : this.invalidate("width");
9         this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
9     };
9 
9     e.prototype.initialize = function() {
9         if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
9             var a, b, c;
9             a = this.$element.find("img");
9             b = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d;
9             c = this.$element.children(b).width();
9             a.length && c <= 0 && this.preloadAutoWidthImages(a);
9         }
9         this.initializeStage();
9         this.initializeItems();
9         this.registerEventHandlers();
9         this.leave("initializing");
9         this.trigger("initialized");
9     };
9 
9     e.prototype.isVisible = function() {
9         return !this.settings.checkVisibility || this.$element.is(":visible");
9     };
9 
9     e.prototype.setup = function() {
9         var b = this.viewport(),
9             c = this.options.responsive,
9             d = -1,
9             e = null;
9         c ? (a.each(c, function(a: any) { a <= b && a > d && (d = Number(a)); }), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options);
9         this.trigger("change", { property: { name: "settings", value: e } });
9         this._breakpoint = d;
9         this.settings = e;
9         this.invalidate("settings");
9         this.trigger("changed", { property: { name: "settings", value: this.settings } });
9     };
9 
9     e.prototype.optionsLogic = function() {
9         this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1);
9     };
9 
9     e.prototype.prepare = function(b: any) {
9         var c = this.trigger("prepare", { content: b });
9         return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", { content: c.data }), c.data;
9     };
9 
9     e.prototype.update = function() {
9         for (var b = 0, c = this._pipe.length, d = a.proxy(function(a: any) { return this[a]; }, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
9         this._invalidated = {};
9         !this.is("valid") && this.enter("valid");
9     };
9 
9     e.prototype.width = function(a: any) {
9         switch (a = a || e.Width.Default) {
9             case e.Width.Inner:
9             case e.Width.Outer:
9                 return this._width;
9             default:
9                 return this._width - 2 * this.settings.stagePadding + this.settings.margin;
9         }
9     };
9 
9     e.prototype.refresh = function() {
9         this.enter("refreshing");
9         this.trigger("refresh");
9         this.setup();
9         this.optionsLogic();
9         this.$element.addClass(this.options.refreshClass);
9         this.update();
9         this.$element.removeClass(this.options.refreshClass);
9         this.leave("refreshing");
9         this.trigger("refreshed");
9     };
9 
9     e.prototype.onThrottledResize = function() {
9         b.clearTimeout(this.resizeTimer);
9         this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
9     };
9 
9     e.prototype.onResize = function() {
9         return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))));
9     };
9 
9     e.prototype.registerEventHandlers = function() {
9         a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this));
9         !1 !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize);
9         this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function() { return !1; }));
9         this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)));
9     };
9 
9     e.prototype.onDragStart = function(b: any) {
9         var d = null;
9         3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = { x: d[16 === d.length ? 12 : 4], y: d[16 ===33629 d.length ? 13 : 5] }) : (d = this.$stage.position(), d = { x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left, y: d.top }), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function(b) {
9 var d = this.difference(this._drag.pointer, this.pointer(b));
9 a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this));
9 Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"));
9 }, this)));
9     };
9 
9     e.prototype.onDragMove = function(a: any) {
9         var b = null,
9             c = null,
9             d = null,
9             e = this.difference(this._drag.pointer, this.pointer(a)),
9             f = this.difference(this._drag.stage.start, e);
9         this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x));
9     };
9 
9     e.prototype.onDragEnd = function(b: any) {
9         var d = this.difference(this._drag.pointer, this.pointer(b)),
9             e = this._drag.stage.current,
9             f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
9         a(c).off(".owl.core");
9         this.$element.removeClass(this.options.grabClass);
9         (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function() { return !1; }));
9         this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
9     };
9 
9     e.prototype.closest = function(b: any, c: any) {
9         var e = -1,
9             f = 30,
9             g = this.width(),
9             h = this.coordinates();
9         return this.settings.freeDrag || a.each(h, a.proxy(function(a, i) {
9             return "left" === c && b > i - f && b < i + f ? e = a : "right" === c && b > i - g - f && b < i - g + f ? e = a + 1 : this.op(b, "<", i) && this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) && (e = "left" === c ? a + 1 : a), -1 === e;
9         }, this)), this.settings.loop || (this.op(b, ">", h[this.minimum()]) ? e = b = this.minimum() : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())), e;
9     };
9 
9     e.prototype.animate = function(b: any) {
9         var c = this.speed() > 0;
9         this.is("animating") && this.onTransitionEnd();
9         c && (this.enter("animating"), this.trigger("translate"));
9         a.support.transform3d && a.support.transition ? this.$stage.css({ transform: "translate3d(" + b + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "") }) : c ? this.$stage.animate({ left: b + "px" }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({ left: b + "px" });
9     };
9 
9     e.prototype.is = function(a: any) {
9         return this._states.current[a] && this._states.current[a] > 0;
9     };
9 
9     e.prototype.current = function(a: any) {
9         if (a === d) return this._current;
9         if (0 === this._items.length) return d;
9         if (a = this.normalize(a), this._current !== a) {
9             var b = this.trigger("change", { property: { name: "position", value: a } });
9             b.data !== d && (a = this.normalize(b.data));
9             this._current = a;
9             this.invalidate("position");
9             this.trigger("changed", { property: { name: "position", value: this._current } });
9         }
9         return this._current;
9     };
9 
9     e.prototype.invalidate = function(b: any) {
9         return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function(a, b) { return b; });
9     };
9 
9     e.prototype.reset = function(a: any) {
9         (a = this.normalize(a)) !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]));
9     };
9 
9     e.prototype.normalize = function(a: any, b: any) {
9         var c = this._items.length,
9             e = b ? 0 : this._clones.length;
9         return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a;
9     };
9 
9     e.prototype.relative = function(a: any) {
9         return a -= this._clones.length / 2, this.normalize(a, !0);
9     };
9 
9     e.prototype.maximum = function(a: any) {
9         var b, c, d, e = this.settings,
9             f = this._coordinates.length;
9         if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
9         else if (e.autoWidth || e.merge) {
9             if (b = this._items.length) for (c = this._items[--b].width(), d = this.$element.width(); b-- && !((c += this._items[b].width() + this.settings.margin) > d););
9             f = b + 1;
9         } else f = e.center ? this._items.length - 1 : this._items.length - e.items;
9         return a && (f -= this._clones.length / 2), Math.max(f, 0);
9     };
9 
9     e.prototype.minimum = function(a: any) {
9         return a ? 0 : this._clones.length / 2;
9     };
9 
9     e.prototype.items = function(a: any) {
9         return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a]);
9     };
9 
9     e.prototype.mergers = function(a: any) {
9         return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a]);
9     };
9 
9     e.prototype.clones = function(b: any) {
9         var c = this._clones.length / 2,
9             e = c + this._items.length,
9             f = function(a: any) { return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2; };
9         return b === d ? a.map(this._clones, function(a, b) { return f(b); }) : a.map(this._clones, function(a, c) { return a === b ? f(c) : null; });
9     };
9 
9     e.prototype.speed = function(a: any) {
9         return a !== d && (this._speed = a), this._speed;
9     };
9 
9     e.prototype.coordinates = function(b: any) {
9         var c, e = 1,
9             f = b - 1;
9         return b === d ? a.map(this._coordinates, a.proxy(function(a, b) { return this.coordinates(b); }, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c));
9     };
9 
9     e.prototype.duration = function(a: any, b: any, c: any) {
9         return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed);
9     };
9 
9     e.prototype.to = function(a: any, b: any) {
9         var c = this.current(),
9             d = null,
9             e = a - this.relative(c),
9             f = (e > 0) - (e < 0),
9             g = this._items.length,
9             h = this.minimum(),
9             i = this.maximum();
9         this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), a = c + e, (d = ((a - h) % g + g) % g + h) !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a));
9         this.speed(this.duration(c, a, b));
9         this.current(a);
9         this.isVisible() && this.update();
9     };
9 
9     e.prototype.next = function(a: any) {
9         a = a || !1;
9         this.to(this.relative(this.current()) + 1, a);
9     };
9 
9     e.prototype.prev = function(a: any) {
9         a = a || !1;
9         this.to(this.relative(this.current()) - 1, a);
9     };
9 
9     e.prototype.onTransitionEnd = function(a: any) {
9         if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
9         this.leave("animating");
9         this.trigger("translated");
9     };
9 
9     e.prototype.viewport = function() {
9         var d;
9         return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d;
9     };
9 
9     e.prototype.replace = function(b: any) {
9         this.$stage.empty();
9         this._items = [];
9         b && (b = b instanceof jQuery ? b : a(b));
9         this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector));
9         b.filter(function() { return 1 === this.nodeType; }).each(a.proxy(function(a, b) { b = this.prepare(b); this.$stage.append(b); this._items.push(b); this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1); }, this));
9         this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
9         this.invalidate("items");
9     };
9 
9     e.prototype.add = function(b: any, c: any) {
9         var e = this.relative(this._current);
9         c = c === d ? this._items.length : this.normalize(c, !0);
9         b = b instanceof jQuery ? b : a(b);
9         this.trigger("add", { content: b, position: c });
9         b = this.prepare(b);
9         0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1));
9         this._items[e] && this.reset(this._items[e].index());
9         this.invalidate("items");
9         this.trigger("added", { content: b, position: c });
9     };
9 
9     e.prototype.remove = function(a: any) {
9         (a = this.normalize(a, !0)) !== d && (this.trigger("remove", { content: this._items[a], position: a }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", { content: null, position: a }));
9     };
9 
9     e.prototype.preloadAutoWidthImages = function(b: any) {
9         b.each(a.proxy(function(b, c) {
9             this.enter("pre-loading");
9             c = a(c);
9             a(new Image).one("load", a.proxy(function(a) {
9                 c.attr("src", a.target.src);
9                 c.css("opacity", 1);
9                 this.leave("pre-loading");
9                 !this.is("pre-loading") && !this.is("initializing") && this.refresh();
9             }, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"));
9         }, this));
9     };
9 
9     e.prototype.destroy = function() {
9         this.$element.off(".owl.core");
9         this.$stage.off(".owl.core");
9         a(c).off(".owl.core");
9         !1 !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
9         for (var d in this._plugins) this._plugins[d].destroy();
9         this.$stage.children(".cloned").remove();
9         this.$stage.unwrap();
9         this.$stage.children().contents().unwrap();
9         this.$stage.children().unwrap();
9         this.$stage.remove();
9         this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel");
9     };
9 
9     e.prototype.op = function(a: any, b: any, c: any) {
9         var d = this.settings.rtl;
9         switch (b) {
9             case "<":
9                 return d ? a > c : a < c;
9             case ">":
9                 return d ? a < c : a > c;
9             case ">=":
9                 return d ? a <= c : a >= c;
9             case "<=":
9                 return d ? a >= c : a <= c;
9         }
9     };
9 
9     e.prototype.on = function(a: any, b: any, c: any, d: any) {
9         a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c);
9     };
9 
9    1234     e.prototype.off = function(a: any, b: any, c: any, d: any) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c);
    };

    e.prototype.trigger = function(b: any, c: any, d: any, f: any, g: any) {
        var h = { item: { count: this._items.length, index: this.current() } },
            i = a.camelCase(a.grep(["on", b, d], function(a) { return a; }).join("-").toLowerCase()),
            j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({ relatedTarget: this }, h, c));
        return this._supress[b] || (a.each(this._plugins, function(a, b) { b.onTrigger && b.onTrigger(j); }), this.register({ type: e.Type.Event, name: b }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j;
    };

    e.prototype.enter = function(b: any) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function(a, b) { this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++; }, this));
    };

    e.prototype.leave = function(b: any) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function(a, b) { this._states.current[b]--; }, this));
    };

    e.prototype.register = function(b: any) {
        if (b.type === e.Type.Event) {
            if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
                var c = a.event.special[b.name]._default;
                a.event.special[b.name]._default = function(a) { return !c || !c.apply || a.namespace && -1 !== a.namespace.indexOf("owl") ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments); };
                a.event.special[b.name].owl = !0;
            }
        } else b.type === e.Type.State && (this._states.tags[b.name] ? this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags) : this._states.tags[b.name] = b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function(c, d) { return a.inArray(c, this._states.tags[b.name]) === d; }, this)));
    };

    e.prototype.suppress = function(b: any) {
        a.each(b, a.proxy(function(a, b) { this._supress[b] = !0; }, this));
    };

    e.prototype.release = function(b: any) {
        a.each(b, a.proxy(function(a, b) { delete this._supress[b]; }, this));
    };

    e.prototype.pointer = function(a: any) {
        var c = { x: null, y: null };
        return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c;
    };

    e.prototype.isNumeric = function(a: any) {
        return !isNaN(parseFloat(a));
    };

    e.prototype.difference = function(a: any, b: any) {
        return { x: a.x - b.x, y: a.y - b.y };
    };

    a.fn.owlCarousel = function(b: any) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var d = a(this),
                f = d.data("owl.carousel");
            f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function(b, c) { f.register({ type: e.Type.Event, name: c }), f.$element.on(c + ".owl.carousel.core", a.proxy(function(a) { a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c])); }, f)); }));
            "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
        });
    };

    a.fn.owlCarousel.Constructor = e;
}(window.Zepto || window.jQuery, window, document);

// AutoRefresh Plugin
!function(a: any, b: any, c: any, d: any) {
    var e = function(b: any) {
        this._core = b;
        this._interval = null;
        this._visible = null;
        this._handlers = { "initialized.owl.carousel": a.proxy(function(a) { a.namespace && this._core.settings.autoRefresh && this.watch(); }, this) };
        this._core.options = a.extend({}, e.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };

    e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 };

    e.prototype.watch = function() {
        this._interval || (this._visible = this._core.isVisible(), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval));
    };

    e.prototype.refresh = function() {
        this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh());
    };

    e.prototype.destroy = function() {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
    };

    a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e;
}(window.Zepto || window.jQuery, window, document);

// Lazy Plugin
!function(a: any, b: any, c: any, d: any) {
    var e = function(b: any) {
        this._core = b;
        this._loaded = [];
9         this._handlers = { "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function(b) {
9             if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) {
9                 var c = this._core.settings,
9                     e = c.center && Math.ceil(c.items / 2) || c.items,
9                     f = c.center && -1 * e || 0,
9                     g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f,
9                     h = this._core.clones().length,
9                     i = a.proxy(function(a, b) { this.load(b); }, this);
9                 for (c.lazyLoadEager > 0 && (e += c.lazyLoadEager, c.loop && (g -= c.lazyLoadEager, e++)); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++;
9             }
9         }, this) };
9         this._core.options = a.extend({}, e.Defaults, this._core.options);
9         this._core.$element.on(this._handlers);
9     };
9 
9     e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 };
9 
9     e.prototype.load = function(c: any) {
9         var d = this._core.$stage.children().eq(c),
9             e = d && d.find(".owl-lazy");
9         !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function(c, d) {
9             var e, f = a(d),
9                 g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src") || f.attr("data-srcset");
9             this._core.trigger("load", { element: f, url: g }, "lazy");
9             f.is("img") ? f.one("load.owl.lazy", a.proxy(function() { f.css("opacity", 1), this._core.trigger("loaded", { element: f, url: g }, "lazy"); }, this)).attr("src", g) : f.is("source") ? f.one("load.owl.lazy", a.proxy(function() { this._core.trigger("loaded", { element: f, url: g }, "lazy"); }, this)).attr("srcset", g) : (e = new Image, e.onload = a.proxy(function() { f.css({ "background-image": 'url("' + g + '")', opacity: "1" }), this._core.trigger("loaded", { element: f, url: g }, "lazy"); }, this), e.src = g);
9         }, this)), this._loaded.push(d.get(0)));
9     };
9 
9     e.prototype.destroy = function() {
9         var a, b;
9         for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
9         for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
9     };
9 
9     a.fn.owlCarousel.Constructor.Plugins.Lazy = e;
9 }(window.Zepto || window.jQuery, window, document);
9 
9 // AutoHeight Plugin
9 !function(a: any, b: any, c: any, d: any) {
9     var e = function(c: any) {
9         this._core = c;
9         this._previousHeight = null;
9         this._handlers = { "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function(a) { a.namespace && this._core.settings.autoHeight && this.update(); }, this), "changed.owl.carousel": a.proxy(function(a) { a.namespace && this._core.settings.autoHeight && "position" === a.property.name && this.update(); }, this), "loaded.owl.lazy": a.proxy(function(a) { a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update(); }, this) };
9         this._core.options = a.extend({}, e.Defaults, this._core.options);
9         this._core.$element.on(this._handlers);
9         this._intervalId = null;
9         var d = this;
9         a(b).on("load", function() { d._core.settings.autoHeight && d.update(); });
9         a(b).resize(function() { d._core.settings.autoHeight && (null != d._intervalId && clearTimeout(d._intervalId), d._intervalId = setTimeout(function() { d.update(); }, 250)); });
9     };
9 
9     e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" };
9 
9     e.prototype.update = function() {
9         var b = this._core._current,
9             c = b + this._core.settings.items,
9             d = this._core.settings.lazyLoad,
9             e = this._core.$stage.children().toArray().slice(b, c),
9             f = [],
9             g = 0;
9         a.each(e, function(b, c) { f.push(a(c).height()); });
9         g = Math.max.apply(null, f);
9         g <= 1 && d && this._previousHeight && (g = this._previousHeight);
9         this._previousHeight = g;
9         this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass);
9     };
9 
9     e.prototype.destroy = function() {
9         var a, b;
9         for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
9         for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
9     };
9 
9     a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e;
9 }(window.Zepto || window.jQuery, window, document);
9 
9 // Video Plugin
9 !function(a: any, b: any, c: any, d: any) {
9     var e = function(b: any) {
9         this._core = b;
9         this._videos = {};
9         this._playing = null;
9         this._handlers = { "initialized.owl.carousel": a.proxy(function(a) { a.namespace && this._core.register({ type: "state", name: "playing", tags: ["interacting"] }); }, this), "resize.owl.carousel": a.proxy(function(a) { a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault(); }, this), "refreshed.owl.carousel": a.proxy(function(a) { a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove(); }, this), "changed.owl.carousel": a.proxy(function(a) { a.namespace && "position" === a.property.name && this._playing && this.stop(); }, this), "prepared.owl.carousel": a.proxy(function(b) { if (b.namespace) { var c = a(b.content).find(".owl-video"); c.length && (c.css("display", "none"), this.fetch(c, a(b.content))); } }, this) };
9         this._core.options = a.extend({}, e.Defaults, this._core.options);
9         this._core.$element.on(this._handlers);
9         this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(a) { this.play(a); }, this));
9     };
9 
9     e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 };
9 
9     e.prototype.fetch = function(a: any, b: any) {
9         var c = function() { return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"; }(),
9             d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
9             e = a.attr("data-width") || this._core.settings.videoWidth,
9             f = a.attr("data-height") || this._core.settings.videoHeight,
9             g = a.attr("href");
9         if (!g) throw new Error("Missing video URL.");
9         if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
9         else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
9         else {
9             if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
9             c = "vzaar";
9         }
9         d = d[6];
9         this._videos[g] = { type: c, id: d, width: e, height: f };
9         b.attr("data-video", g);
9         this.thumbnail(a, this._videos[g]);
9     };
9 
9     e.prototype.thumbnail = function(b: any, c: any) {
9         var d, e, f, g = c.width && c.height ? "width:" + c.width + "px;height:" + c.height + "px;" : "",
9             h = b.find("img"),
9             i = "src",
9             j = "",
9             k = this._core.settings,
9             l = function(c: any) { e = '<div class="owl-video-play-icon"></div>'; d = k.lazyLoad ? a("<div/>", { class: "owl-video-tn " + j, srcType: c }) : a("<div/>", { class: "owl-video-tn", style: "opacity:1;background-image:url(" + c + ")" }); b.after(d); b.after(e); };
9         if (b.wrap(a("<div/>", { class: "owl-video-wrapper",1234 style: g }));
this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy");
h.length ? (l(h.attr(i)), h.remove()) : "youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
type: "GET",
url: "//vimeo.com/api/v2/video/" + c.id + ".json",
jsonp: "callback",
dataType: "jsonp",
success: function(a: any) {
f = a[0].thumbnail_large;
l(f);
}
}) : "vzaar" === c.type && a.ajax({
type: "GET",
url: "//vzaar.com/api/videos/" + c.id + ".json",
jsonp: "callback",
dataType: "jsonp",
success: function(a: any) {
f = a.framegrab_url;
l(f);
}
});
};

e.prototype.stop = function() {
this._core.trigger("stop", null, "video");
this._playing.find(".owl-video-frame").remove();
this._playing.removeClass("owl-video-playing");
this._playing = null;
this._core.leave("playing");
this._core.trigger("stopped", null, "video");
};

e.prototype.play = function(b: any) {
var c, d = a(b.target),
e = d.closest("." + this._core.settings.itemClass),
f = this._videos[e.attr("data-video")],
g = f.width || "100%",
h = f.height || this._core.$stage.height();
this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), c = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), c.attr("height", h), c.attr("width", g), "youtube" === f.type ? c.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id) : "vimeo" === f.type ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1") : "vzaar" === f.type && c.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"), a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"));
};

e.prototype.isInFullScreen = function() {
var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
return b && a(b).parent().hasClass("owl-video-frame");
};

e.prototype.destroy = function() {
var a, b;
this._core.$element.off("click.owl.video");
for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
};

a.fn.owlCarousel.Constructor.Plugins.Video = e;
}(window.Zepto || window.jQuery, window, document);

// Animate Plugin
!function(a: any, b: any, c: any, d: any) {
var e = function(b: any) {
this._core = b;
this._call = null;
this._time = 0;
this._timeout = 0;
this._paused = !0;
this._handlers = {
"changed.owl.carousel": a.proxy(function(a) {
a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._paused && (this._time = 0);
}, this),
"initialized.owl.carousel": a.proxy(function(a) {
a.namespace && this._core.settings.autoplay && this.play();
}, this),
"play.owl.autoplay": a.proxy(function(a, b, c) {
a.namespace && this.play(b, c);
}, this),
"stop.owl.autoplay": a.proxy(function(a) {
a.namespace && this.stop();
}, this),
"mouseover.owl.autoplay": a.proxy(function() {
this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
}, this),
"mouseleave.owl.autoplay": a.proxy(function() {
this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play();
}, this),
"touchstart.owl.core": a.proxy(function() {
this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
}, this),
"touchend.owl.core": a.proxy(function() {
this._core.settings.autoplayHoverPause && this.play();
}, this)
};
this._core.$element.on(this._handlers);
this._core.options = a.extend({}, e.Defaults, this._core.options);
};

e.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 };

e.prototype._next = function(d: any) {
this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read());
this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed);
9 };
9 
9 e.prototype.read = function() {
9 return (new Date).getTime() - this._time;
9 };
9 
9 e.prototype.play = function(c: any, d: any) {
9 var e;
9 this._core.is("rotating") || this._core.enter("rotating");
9 c = c || this._core.settings.autoplayTimeout;
9 e = Math.min(this._time % (this._timeout || c), c);
9 this._paused ? (this._time = this.read(), this._paused = !1) : b.clearTimeout(this._call);
9 this._time += this.read() % c - e;
9 this._timeout = c;
9 this._call = b.setTimeout(a.proxy(this._next, this, d), c - e);
9 };
9 
9 e.prototype.stop = function() {
9 this._core.is("rotating") && (this._time = 0, this._paused = !0, b.clearTimeout(this._call), this._core.leave("rotating"));
9 };
9 
9 e.prototype.pause = function() {
9 this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, b.clearTimeout(this._call));
9 };
9 
9 e.prototype.destroy = function() {
9 var a, b;
9 this.stop();
9 for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
9 for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
9 };
9 
9 a.fn.owlCarousel.Constructor.Plugins.autoplay = e;
9 }(window.Zepto || window.jQuery, window, document);
9 
9 // Navigation Plugin
9 !function(a: any, b: any, c: any, d: any) {
9 "use strict";
9 var e = function(b: any) {
9 this._core = b;
9 this._initialized = !1;
9 this._pages = [];
9 this._controls = {};
9 this._templates = [];
9 this.$element = this._core.$element;
9 this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to };
9 this._handlers = {
9 "prepared.owl.carousel": a.proxy(function(b) {
9 b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
9 }, this),
9 "added.owl.carousel": a.proxy(function(a) {
9 a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop());
9 }, this),
9 "remove.owl.carousel": a.proxy(function(a) {
9 a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1);
9 }, this),
9 "changed.owl.carousel": a.proxy(function(a) {
9 a.namespace && "position" == a.property.name && this.draw();
9 }, this),
9 "initialized.owl.carousel": a.proxy(function(a) {
9 a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"));
9 }, this),
9 "refreshed.owl.carousel": a.proxy(function(a) {
9 a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"));
9 }, this)
9 };
9 this._core.options = a.extend({}, e.Defaults, this._core.options);
9 this.$element.on(this._handlers);
9 };
9 
9 e.Defaults = { nav: !1, navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'], navSpeed: !1, navElement: 'button type="button" role="presentation"', navContainer: !1, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: !0, dotsEach: !1, dotsData: !1, dotsSpeed: !1, dotsContainer: !1 };
9 
9 e.prototype.initialize = function() {
9 var b, c = this._core.settings;
9 this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled");
9 this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function(a) { this.prev(c.navSpeed); }, this));
9 this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function(a) { this.next(c.navSpeed); }, this));
9 c.dotsData || (this._templates = [a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]);
9 this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled");
9 this._controls.$absolute.on("click", "button", a.proxy(function(b) {
9 var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
9 b.preventDefault();
9 this.to(d, c.dotsSpeed);
9 }, this));
9 for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
9 };
9 
9 e.prototype.destroy = function() {
9 var a, b, c, d, e;
9 e = this._core.settings;
9 for (a in this._handlers) this.$element.off(a, this._handlers[a]);
9 for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[b].html("") : this._controls[b].remove();
9 for (d in this.overides) this._core[d] = this._overrides[d];
9 for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
9 };
9 
9 e.prototype.update = function() {
9 var a, b, c, d = this._core.clones().length / 2,
9 e = d + this._core.items().length,
9 f = this._core.maximum(!0),
9 g = this._core.settings,
9 h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
9 if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy) for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
9 if (b >= h || 0 === b) {
9 if (this._pages.push({ start: Math.min(f, a - d), end: a - d + h - 1 }), Math.min(f, a - d) === f) break;
9 b = 0, ++c;
9 }
9 b += this._core.mergers(this._core.relative(a));
9 }
9 };
9 
9 e.prototype.draw = function() {
9 var b, c = this._core.settings,
9 d = this._core.items().length <= c.items,
9 e = this._core.relative(this._core.current()),
9 f = c.loop || c.rewind;
9 this._controls.$relative.toggleClass("disabled", !c.nav || d);
9 c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0)));
9 this._controls.$absolute.toggleClass("disabled", !c.dots || d);
9 c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"));
9 };
9 
9 e.prototype.onTrigger = function(b: any) {
9 var c = this._core.settings;
9 b.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items) };
9 };
9 
9 e.prototype.current = function() {
9 var b = this._core.relative(this._core.current());
9 return a.grep(this._pages, a.proxy(function(a, c) { return a.start <= b && a.end >= b; }, this)).pop();
9 };
9 
9 e.prototype.getPosition = function(b: any) {
9 var c, d, e = this._core.settings;
9 return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c;
9 };
9 
9 e.prototype.next = function(b: any) {
9 a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
9 };
9 
9 e.prototype.prev = function(b: any) {
9 a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
9 };
9 
9 e.prototype.to = function(b: any, c: any, d: any) {
9 var e;
9 !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c);
9 };
9 
9 a.fn.owlCarousel.Constructor.Plugins.Navigation = e;
9 }(window.Zepto || window.jQuery, window, document);
9 
9 // Hash Plugin
9 !function(a: any, b: any, c: any, d: any) {
9 "use strict";
9 var e = function(c: any) {
9 this._core = c;
9 this._hashes = {};
9 this.$element = this._core.$element;
9 this._handlers = {
9 "initialized.owl.carousel": a.proxy(function(c) {
9 c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation");
9 }, this),
9 "prepared.owl.carousel": a.proxy(function(b) {
9 if (b26429 .namespace) {
9 var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
9 if (!c) return;
9 this._hashes[c] = b.content;
9 }
9 }, this),
9 "changed.owl.carousel": a.proxy(function(c) {
9 if (c.namespace && "position" === c.property.name) {
9 var d = this._core.items(this._core.relative(this._core.current())),
9 e = a.map(this._hashes, function(a, b) {
9 return a === d ? b : null;
9 }).join();
9 if (!e || b.location.hash.slice(1) === e) return;
9 b.location.hash = e;
9 }
9 }, this)
9 };
9 this._core.options = a.extend({}, e.Defaults, this._core.options);
9 this.$element.on(this._handlers);
9 a(b).on("hashchange.owl.navigation", a.proxy(function(a) {
9 var c = b.location.hash.substring(1),
9 e = this._core.$stage.children(),
9 f = this._hashes[c] && e.index(this._hashes[c]);
9 f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0);
9 }, this));
9 };
9 
9 e.Defaults = {
9 URLhashListener: !1
9 };
9 
9 e.prototype.destroy = function() {
9 var c, d;
9 a(b).off("hashchange.owl.navigation");
9 for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
9 for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null);
9 };
9 
9 a.fn.owlCarousel.Constructor.Plugins.Hash = e;
9 }(window.Zepto || window.jQuery, window, document);
9 
9 // Support Plugin
9 !function(a: any, b: any, c: any, d: any) {
9 function e(b: any, c: any) {
9 var e = !1,
9 f = b.charAt(0).toUpperCase() + b.slice(1);
9 return a.each((b + " " + h.join(f + " ") + f).split(" "), function(a, b) {
9 if (g[b] !== d) return e = !c || b, !1;
9 }), e;
9 }
9 
9 function f(a: any) {
9 return e(a, !0);
9 }
9 
9 var g = a("<support>").get(0).style,
9 h = "Webkit Moz O ms".split(" "),
9 i = {
9 transition: {
9 end: {
9 WebkitTransition: "webkitTransitionEnd",
9 MozTransition: "transitionend",
9 OTransition: "oTransitionEnd",
9 transition: "transitionend"
9 }
9 },
9 animation: {
9 end: {
9 WebkitAnimation: "webkitAnimationEnd",
9 MozAnimation: "animationend",
9 OAnimation: "oAnimationEnd",
9 animation: "animationend"
9 }
9 }
9 },
9 j = {
9 csstransforms: function() {
9 return !!e("transform");
9 },
9 csstransforms3d: function() {
9 return !!e("perspective");
9 },
9 csstransitions: function() {
9 return !!e("transition");
9 },
9 cssanimations: function() {
9 return !!e("animation");
9 }
9 };
9 
9 j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]);
9 j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]);
9 j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d());
9 }(window.Zepto || window.jQuery, window, document);