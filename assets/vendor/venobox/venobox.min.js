/*
 * VenoBox - jQuery Plugin
 * version: 1.8.9
 * @requires jQuery >= 1.7.0
 *
 * Examples at http://veno.es/venobox/
 * License: MIT License
 * License URI: https://github.com/nicolafranchini/VenoBox/blob/master/LICENSE
 * Copyright 2013-2020 Nicola Franchini - @nicolafranchini
 *
 */
!function($: JQueryStatic) {
    "use strict";

    type Callback = () => void;

    interface VenoBoxOptions {
        arrowsColor: string;
        autoplay: boolean;
        bgcolor: string;
        border: string;
        closeBackground: string;
        closeColor: string;
        framewidth: string;
        frameheight: string;
        gallItems: boolean;
        infinigall: boolean;
        htmlClose: string;
        htmlNext: string;
        htmlPrev: string;
        numeratio: boolean;
        numerationBackground: string;
        numerationColor: string;
        numerationPosition: string;
        overlayClose: boolean;
        overlayColor: string;
        spinner: string;
        spinColor: string;
        titleattr: string;
        titleBackground: string;
        titleColor: string;
        titlePosition: string;
        share: string[];
        cb_pre_open: Callback;
        cb_post_open: Callback;
        cb_pre_close: Callback;
        cb_post_close: Callback;
        cb_post_resize: Callback;
        cb_after_nav: Callback;
        cb_content_loaded: Callback;
        cb_init: (element: JQuery) => void;
    }

    interface VenoBoxElement extends JQuery {
        data(key: string): any;
        data(key: string, value: any): this;
    }

    const defaultOptions: VenoBoxOptions = {
        arrowsColor: "#B6B6B6",
        autoplay: false,
        bgcolor: "#fff",
        border: "0",
        closeBackground: "transparent",
        closeColor: "#d2d2d2",
        framewidth: "",
        frameheight: "",
        gallItems: false,
        infinigall: false,
        htmlClose: "&times;",
        htmlNext: "<span>Next</span>",
        htmlPrev: "<span>Prev</span>",
        numeratio: false,
        numerationBackground: "#161617",
        numerationColor: "#d2d2d2",
        numerationPosition: "top",
        overlayClose: true,
        overlayColor: "rgba(23,23,23,0.85)",
        spinner: "double-bounce",
        spinColor: "#d2d2d2",
        titleattr: "title",
        titleBackground: "#161617",
        titleColor: "#d2d2d2",
        titlePosition: "top",
        share: ["facebook", "twitter", "linkedin", "pinterest", "download"],
        cb_pre_open: () => true,
        cb_post_open: () => {},
        cb_pre_close: () => true,
        cb_post_close: () => {},
        cb_post_resize: () => {},
        cb_after_nav: () => {},
        cb_content_loaded: () => {},
        cb_init: () => {}
    };

    $.fn.extend({
        venobox: function(options: Partial<VenoBoxOptions>) {
            const settings = $.extend({}, defaultOptions, options) as VenoBoxOptions;
            settings.cb_init(this);

            return this.each(function() {
                const $this = $(this) as VenoBoxElement;
                if ($this.data("venobox")) return true;

                function openVenoBox() {
                    // Implementation of openVenoBox function
                }

                function closeVenoBox() {
                    // Implementation of closeVenoBox function
                }

                $this.addClass("vbox-item");
                $this.data("venobox", true);
                $this.on("click", function(event) {
                    event.preventDefault();
                    openVenoBox();
                });

                // Additional event handlers and logic
            });
        }
    });
}(jQuery);