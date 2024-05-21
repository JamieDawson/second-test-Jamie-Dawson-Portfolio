/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function() {
    "use strict";

    enum Axis {
        Horizontal = "horizontal",
        Vertical = "vertical"
    }

    interface WaypointOptions {
        element: HTMLElement;
        handler: Function;
        context?: Window | HTMLElement;
        continuous?: boolean;
        enabled?: boolean;
        group?: string;
        horizontal?: boolean;
        offset?: number | string | (() => number);
    }

    class Waypoint {
        static adapters: any[] = [];
        static defaults: WaypointOptions = {
            context: window,
            continuous: true,
            enabled: true,
            group: "default",
            horizontal: false,
            offset: 0
        };
        static offsetAliases: { [key: string]: () => number } = {
            "bottom-in-view": function() {
                return this.context.innerHeight() - this.adapter.outerHeight();
            },
            "right-in-view": function() {
                return this.context.innerWidth() - this.adapter.outerWidth();
            }
        };

        static Context: any;
        static Group: any;
        static Adapter: any;

        key: string;
        options: WaypointOptions;
        element: HTMLElement;
        adapter: any;
        callback: Function;
        axis: Axis;
        enabled: boolean;
        triggerPoint: number | null;
        group: any;
        context: any;

        constructor(options: WaypointOptions) {
            if (!options) throw new Error("No options passed to Waypoint constructor");
            if (!options.element) throw new Error("No element option passed to Waypoint constructor");
            if (!options.handler) throw new Error("No handler option passed to Waypoint constructor");

            this.key = "waypoint-" + Waypoint.e;
            this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options);
            this.element = this.options.element;
            this.adapter = new Waypoint.Adapter(this.element);
            this.callback = options.handler;
            this.axis = this.options.horizontal ? Axis.Horizontal : Axis.Vertical;
            this.enabled = this.options.enabled;
            this.triggerPoint = null;
            this.group = Waypoint.Group.findOrCreate({ name: this.options.group, axis: this.axis });
            this.context = Waypoint.Context.findOrCreateByElement(this.options.context);
            Waypoint.offsetAliases[this.options.offset] && (this.options.offset = Waypoint.offsetAliases[this.options.offset]);
            this.group.add(this);
            this.context.add(this);
            Waypoint.i[this.key] = this;
            Waypoint.e += 1;
        }

        static e: number = 0;
        static i: { [key: string]: Waypoint } = {};

        queueTrigger(trigger: any) {
            this.group.queueTrigger(this, trigger);
        }

        trigger(trigger: any) {
            this.enabled && this.callback && this.callback.apply(this, trigger);
        }

        destroy() {
            this.context.remove(this);
            this.group.remove(this);
            delete Waypoint.i[this.key];
        }

        disable() {
            this.enabled = false;
            return this;
        }

        enable() {
            this.context.refresh();
            this.enabled = true;
            return this;
        }

        next() {
            return this.group.next(this);
        }

        previous() {
            return this.group.previous(this);
        }

        static invokeAll(method: string) {
            const allWaypoints = Object.values(Waypoint.i);
            for (const waypoint of allWaypoints) {
                waypoint[method]();
            }
        }

        static destroyAll() {
            Waypoint.invokeAll("destroy");
        }

        static disableAll() {
            Waypoint.invokeAll("disable");
        }

        static enableAll() {
            Waypoint.Context.refreshAll();
            for (const key in Waypoint.i) {
                Waypoint.i[key].enabled = true;
            }
            return this;
        }

        static refreshAll() {
            Waypoint.Context.refreshAll();
        }

        static viewportHeight() {
            return window.innerHeight || document.documentElement.clientHeight;
        }

        static viewportWidth() {
            return document.documentElement.clientWidth;
        }
    }

    window.Waypoint = Waypoint;
}();

!function() {
    "use strict";

    class Context {
        element: HTMLElement | Window;
        Adapter: any;
        adapter: any;
        key: string;
        didScroll: boolean;
        didResize: boolean;
        oldScroll: { x: number, y: number };
        waypoints: { vertical: { [key: string]: any }, horizontal: { [key: string]: any } };

        constructor(element: HTMLElement | Window) {
            this.element = element;
            this.Adapter = Waypoint.Adapter;
            this.adapter = new this.Adapter(element);
            this.key = "waypoint-context-" + Context.i;
            this.didScroll = false;
            this.didResize = false;
            this.oldScroll = { x: this.adapter.scrollLeft(), y: this.adapter.scrollTop() };
            this.waypoints = { vertical: {}, horizontal: {} };
            (element as any).waypointContextKey = this.key;
            Context.o[this.key] = this;
            Context.i += 1;
            if (!Context.windowContext) {
                Context.windowContext = new Context(window);
            }
            this.createThrottledScrollHandler();
            this.createThrottledResizeHandler();
        }

        static i: number = 0;
        static o: { [key: string]: Context } = {};
        static windowContext: Context | null = null;

        add(waypoint: any) {
            const axis = waypoint.options.horizontal ? "horizontal" : "vertical";
            this.waypoints[axis][waypoint.key] = waypoint;
            this.refresh();
        }

        checkEmpty() {
            const horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal);
            const verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical);
            const isWindow = this.element == this.element.window;
            if (horizontalEmpty && verticalEmpty && !isWindow) {
                this.adapter.off(".waypoints");
                delete Context.o[this.key];
            }
        }

        createThrottledResizeHandler() {
            const handleResize = () => {
                this.handleResize();
                this.didResize = false;
            };
            this.adapter.on("resize.waypoints", () => {
                if (!this.didResize) {
                    this.didResize = true;
                    Waypoint.requestAnimationFrame(handleResize);
                }
            });
        }

        createThrottledScrollHandler() {
            const handleScroll = () => {
                this.handleScroll();
                this.didScroll = false;
            };
            this.adapter.on("scroll.waypoints", () => {
                if (!this.didScroll || Waypoint.isTouch) {
                    this.didScroll = true;
                    Waypoint.requestAnimationFrame(handleScroll);
                }
            });
        }

        handleResize() {
            Context.refreshAll();
        }

        handleScroll() {
            const triggers: { [key: string]: any } = {};
            const scrollData = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };

            for (const axis in scrollData) {
                const data = scrollData[axis];
                const isForward = data.newScroll > data.oldScroll;
                const direction = isForward ? data.forward : data.backward;

                for (const key in this.waypoints[axis]) {
                    const waypoint = this.waypoints[axis][key];
                    if (waypoint.triggerPoint !== null) {
                        const wasBeforeTrigger = data.oldScroll < waypoint.triggerPoint;
                        const isAfterTrigger = data.newScroll >= waypoint.triggerPoint;
                        const crossedForward = wasBeforeTrigger && isAfterTrigger;
                        const crossedBackward = !wasBeforeTrigger && !isAfterTrigger;

                        if (crossedForward || crossedBackward) {
                            waypoint.queueTrigger(direction);
                            triggers[waypoint.group.id] = waypoint.group;
                        }
                    }
                }
            }

            for (const groupId in triggers) {
                triggers[groupId].flushTriggers();
            }

            this.oldScroll = {
                x: scrollData.horizontal.newScroll,
                y: scrollData.vertical.newScroll
            };
        }

        innerHeight() {
            return this.element == this.element.window ? Waypoint.viewportHeight() : this.adapter.innerHeight();
        }

        remove(waypoint: any) {
            delete this.waypoints[waypoint.axis][waypoint.key];
            this.checkEmpty();
        }

        innerWidth() {
            return this.element == this.element.window ? Waypoint.viewportWidth() : this.adapter.innerWidth();
        }

        destroy() {
            const allWaypoints = [];
            for (const axis in this.waypoints) {
                for (const key in this.waypoints[axis]) {
                    allWaypoints.push(this.waypoints[axis][key]);
                }
            }
            for (const waypoint of allWaypoints) {
                waypoint.destroy();
            }
        }

        refresh() {
            const isWindow = this.element == this.element.window;
            const contextOffset = isWindow ? undefined : this.adapter.offset();
            const scrollData = {
                horizontal: {
                    contextOffset: isWindow ? 0 : contextOffset.left,
                    contextScroll: isWindow ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left"
                },
                vertical: {
                    contextOffset: isWindow ? 0 : contextOffset.top,
                    contextScroll: isWindow ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top"
                }
            };

            this.handleScroll();

            for (const axis in scrollData) {
                const data = scrollData[axis];
                for (const key in this.waypoints[axis]) {
                    const waypoint = this.waypoints[axis][key];
                    let offset = waypoint.options.offset;
                    const wasTriggered = waypoint.triggerPoint !== null;
                    let elementOffset = 0;

                    if (waypoint.element !== waypoint.element.window) {
                        elementOffset = waypoint.adapter.offset()[data.offsetProp];
                    }

                    if (typeof offset === "function") {
                        offset = offset.apply(waypoint);
                    } else if (typeof offset === "string") {
                        offset = parseFloat(offset);
                        if (waypoint.options.offset.indexOf("%") > -1) {
                            offset = Math.ceil(data.contextDimension * offset / 100);
                        }
                    }

                    const contextScroll = data.contextScroll - data.contextOffset;
                    waypoint.triggerPoint = Math.floor(elementOffset + contextScroll - offset);

                    const wasBeforeTrigger = data.oldScroll < waypoint.triggerPoint;
                    const isAfterTrigger = waypoint.triggerPoint >= data.oldScroll;
                    const crossedForward = wasBeforeTrigger && isAfterTrigger;
                    const crossedBackward = !wasBeforeTrigger && !isAfterTrigger;

                    if (!wasTriggered && crossedForward) {
                        waypoint.queueTrigger(data.backward);
                        triggers[waypoint.group.id] = waypoint.group;
                    } else if (!wasTriggered && crossedBackward) {
                        waypoint.queueTrigger(data.forward);
                        triggers[waypoint.group.id] = waypoint.group;
                    } else if (wasTriggered && data.oldScroll >= waypoint.triggerPoint) {
                        waypoint.queueTrigger(data.forward);
                        triggers[waypoint.group.id] = waypoint.group;
                    }
                }
            }

            Waypoint.requestAnimationFrame(() => {
                for (const groupId in triggers) {
                    triggers[groupId].flushTriggers();
                }
            });

            return this;
        }

        static findOrCreateByElement(element: HTMLElement | Window) {
            return Context.findByElement(element) || new Context(element);
        }

        static refreshAll() {
            for (const key in Context.o) {
                Context.o[key].refresh();
            }
        }

        static findByElement(element: HTMLElement | Window) {
            return Context.o[(element as any).waypointContextKey];
        }
    }

    window.onload = function() {
        const originalOnload = window.onload;
        if (originalOnload) {
            originalOnload();
        }
        Context.refreshAll();
    };

    Waypoint.requestAnimationFrame = function(callback: FrameRequestCallback) {
        const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(callback: FrameRequestCallback) {
            window.setTimeout(callback, 1000 / 60);
        };
        requestAnimationFrame.call(window, callback);
    };

    Waypoint.Context = Context;
}();

!function() {
    "use strict";

    class Group {
        name: string;
        axis: Axis;
        id: string;
        waypoints: any[];
        triggerQueues: { [key: string]: any[] };

        constructor(options: { name: string, axis: Axis }) {
            this.name = options.name;
            this.axis = options.axis;
            this.id = this.name + "-" + this.axis;
            this.waypoints = [];
            this.clearTriggerQueues();
            Group.o[this.axis][this.name] = this;
        }

        static o: { [key: string]: { [key: string]: Group } } = { vertical: {}, horizontal: {} };

        add(waypoint: any) {
            this.waypoints.push(waypoint);
        }

        clearTriggerQueues() {
            this.triggerQueues = { up: [], down: [], left: [], right: [] };
        }

        flushTriggers() {
            for (const direction in this.triggerQueues) {
                const queue = this.triggerQueues[direction];
                const isReverse = direction === "up" || direction === "left";
                queue.sort(isReverse ? Group.sortReverse : Group.sortForward);

                for (let i = 0; i < queue.length; i++) {
                    const waypoint = queue[i];
                    if (waypoint.options.continuous || i === queue.length - 1) {
                        waypoint.trigger([direction]);
                    }
                }
            }
            this.clearTriggerQueues();
        }

        next(waypoint: any) {
            this.waypoints.sort(Group.sortForward);
            const index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
            const isLast = index === this.waypoints.length - 1;
            return isLast ? null : this.waypoints[index + 1];
        }

        previous(waypoint: any) {
            this.waypoints.sort(Group.sortForward);
            const index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
            return index ? this.waypoints[index - 1] : null;
        }

        queueTrigger(waypoint: any, direction: string) {
            this.triggerQueues[direction].push(waypoint);
        }

        remove(waypoint: any) {
            const index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
            if (index > -1) {
                this.waypoints.splice(index, 1);
            }
        }

        first() {
            return this.waypoints[0];
        }

        last() {
            return this.waypoints[this.waypoints.length - 1];
        }

        static findOrCreate(options: { name: string, axis: Axis }) {
            return Group.o[options.axis][options.name] || new Group(options);
        }

        static sortForward(a: any, b: any) {
            return a.triggerPoint - b.triggerPoint;
        }

        static sortReverse(a: any, b: any) {
            return b.triggerPoint - a.triggerPoint;
        }
    }

    Waypoint.Group = Group;
}();

!function() {
    "use strict";

    class Adapter {
        $element: any;

        constructor(element: any) {
            this.$element = jQuery(element);
        }

        static extend(...args: any[]) {
            return jQuery.extend(...args);
        }

        static inArray(element: any, array: any[]) {
            return jQuery.inArray(element, array);
        }

        static isEmptyObject(obj: any) {
            return jQuery.isEmptyObject(obj);
        }

        innerHeight() {
            return this.$element.innerHeight();
        }

        innerWidth() {
            return this.$element.innerWidth();
        }

        off(...args: any[]) {
            return this.$element.off(...args);
        }

        offset() {
            return this.$element.offset();
        }

        on(...args: any[]) {
            return this.$element.on(...args);
        }

        outerHeight() {
            return this.$element.outerHeight();
        }

        outerWidth() {
            return this.$element.outerWidth();
        }

        scrollLeft() {
            return this.$element.scrollLeft();
        }

        scrollTop() {
            return this.$element.scrollTop();
        }
    }

    Waypoint.adapters.push({ name: "jquery", Adapter: Adapter });
    Waypoint.Adapter = Adapter;
}();

!function() {
    "use strict";

    function createWaypoint(jQuery: any) {
        return function() {
            const waypoints = [];
            const options = arguments[0];

            if (jQuery.isFunction(arguments[0])) {
                options.handler = arguments[0];
                options.context = arguments[1];
            }

            this.each(function() {
                const waypointOptions = jQuery.extend({}, options, { element: this });
                if (typeof waypointOptions.context === "string") {
                    waypointOptions.context = jQuery(this).closest(waypointOptions.context)[0];
                }
                waypoints.push(new Waypoint(waypointOptions));
            });

            return waypoints;
        };
    }

    if (window.jQuery) {
        window.jQuery.fn.waypoint = createWaypoint(window.jQuery);
    }

    if (window.Zepto) {
        window.Zepto.fn.waypoint = createWaypoint(window.Zepto);
    }
}();