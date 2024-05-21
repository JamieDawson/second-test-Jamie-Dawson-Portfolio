(function($: any) {
    "use strict";

    interface CounterUpSettings {
        time: number;
        delay: number;
        offset: number;
        beginAt: number;
        formatter: ((num: string) => string) | false;
        context: string;
        callback: () => void;
    }

    interface Counter {
        time: number;
        delay: number;
        offset: number;
        beginAt: number;
        context: string;
    }

    $.fn.counterUp = function(options: Partial<CounterUpSettings>) {
        const settings: CounterUpSettings = $.extend({
            time: 400,
            delay: 10,
            offset: 100,
            beginAt: 0,
            formatter: false,
            context: "window",
            callback: function() {}
        }, options);

        return this.each(function() {
            const $this = $(this);
            const counter: Counter = {
                time: $this.data("counterup-time") || settings.time,
                delay: $this.data("counterup-delay") || settings.delay,
                offset: $this.data("counterup-offset") || settings.offset,
                beginAt: $this.data("counterup-beginat") || settings.beginAt,
                context: $this.data("counterup-context") || settings.context
            };

            const counterUpper = function() {
                const nums: string[] = [];
                const divisions = counter.time / counter.delay;
                let num = $this.attr("data-num") ? $this.attr("data-num") : $this.text();
                const isComma = /[0-9]+,[0-9]+/.test(num);
                num = num.replace(/,/g, "");
                const decimalPlaces = (num.split(".")[1] || []).length;
                if (counter.beginAt > parseFloat(num)) counter.beginAt = parseFloat(num);
                const isTime = /[0-9]+:[0-9]+:[0-9]+/.test(num);
                let s: number;
                if (isTime) {
                    const times = num.split(":");
                    let m = 1;
                    s = 0;
                    while (times.length > 0) {
                        s += m * parseInt(times.pop()!, 10);
                        m *= 60;
                    }
                }
                for (let i = divisions; i >= (counter.beginAt / parseFloat(num)) * divisions; i--) {
                    let newNum = (parseFloat(num) / divisions * i).toFixed(decimalPlaces);
                    if (isTime) {
                        newNum = (s / divisions * i).toFixed(0);
                        const hours = Math.floor(parseInt(newNum) / 3600) % 24;
                        const minutes = Math.floor(parseInt(newNum) / 60) % 60;
                        const seconds = parseInt(newNum) % 60;
                        newNum = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                    }
                    if (isComma) {
                        while (/(\d+)(\d{3})/.test(newNum.toString())) {
                            newNum = newNum.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
                        }
                    }
                    if (settings.formatter) {
                        newNum = settings.formatter.call(this, newNum);
                    }
                    nums.unshift(newNum);
                }
                $this.data("counterup-nums", nums);
                $this.text(counter.beginAt.toString());

                const f = function() {
                    if (!$this.data("counterup-nums")) {
                        settings.callback.call(this);
                        return;
                    }
                    $this.html($this.data("counterup-nums").shift());
                    if ($this.data("counterup-nums").length) {
                        setTimeout($this.data("counterup-func"), counter.delay);
                    } else {
                        $this.data("counterup-nums", null);
                        $this.data("counterup-func", null);
                        settings.callback.call(this);
                    }
                };
                $this.data("counterup-func", f);
                setTimeout($this.data("counterup-func"), counter.delay);
            };

            $this.waypoint(function(direction: any) {
                counterUpper();
                this.destroy();
            }, { offset: counter.offset + "%", context: counter.context });
        });
    };
})(jQuery);