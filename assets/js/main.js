
import $ from 'jquery';
import 'jquery.counterup';
import 'waypoints/lib/jquery.waypoints.min';
import 'owl.carousel';
import 'isotope-layout';
import 'venobox';
enum NavMenuSelectors {
  NavMenu = '.nav-menu a, .mobile-nav a',
  NavMenuActive = '.nav-menu .active, .mobile-nav .active',
  Header = '#header',
  Section = 'section',
  MobileNavActive = 'mobile-nav-active',
  MobileNavToggle = '.mobile-nav-toggle',
  MobileNavOverly = '.mobile-nav-overly',
  CounterUp = '[data-toggle="counter-up"]',
  SkillsContent = '.skills-content',
  ProgressBar = '.progress .progress-bar',
  TestimonialsCarousel = '.testimonials-carousel',
  PortfolioContainer = '.portfolio-container',
  PortfolioItem = '.portfolio-item',
  PortfolioFilters = '#portfolio-flters li',
  Venobox = '.venobox'
}
interface JQuery {
  counterUp(options: { delay: number; time: number }): JQuery;
  waypoint(handler: () => void, options: { offset: string }): JQuery;
  owlCarousel(options: { autoplay: boolean; dots: boolean; loop: boolean; responsive: object }): JQuery;
  isotope(options: { itemSelector: string; layoutMode: string }): JQuery;
  venobox(): JQuery;
}
(function($: JQueryStatic) {
  "use strict";
  // Nav Menu
  $(document).on('click', NavMenuSelectors.NavMenu, function(e: JQuery.Event) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      const hash = this.hash;
      const target = $(hash);
      if (target.length) {
        e.preventDefault();
        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $(NavMenuSelectors.NavMenuActive).removeClass('active');
          $(this).closest('li').addClass('active');
        }
        if (hash == NavMenuSelectors.Header) {
          $(NavMenuSelectors.Header).removeClass('header-top');
          $(NavMenuSelectors.Section).removeClass('section-show');
          return;
        }
        if (!$(NavMenuSelectors.Header).hasClass('header-top')) {
          $(NavMenuSelectors.Header).addClass('header-top');
          setTimeout(function() {
            $(NavMenuSelectors.Section).removeClass('section-show');
            $(hash).addClass('section-show');
          }, 350);
        } else {
          $(NavMenuSelectors.Section).removeClass('section-show');
          $(hash).addClass('section-show');
        }
        if ($('body').hasClass(NavMenuSelectors.MobileNavActive)) {
          $('body').removeClass(NavMenuSelectors.MobileNavActive);
          $(NavMenuSelectors.MobileNavToggle + ' i').toggleClass('icofont-navigation-menu icofont-close');
          $(NavMenuSelectors.MobileNavOverly).fadeOut();
        }
        return false;
      }
    }
  });
  // Activate/show sections on load with hash links
  if (window.location.hash) {
    const initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      $(NavMenuSelectors.Header).addClass('header-top');
      $(NavMenuSelectors.NavMenuActive).removeClass('active');
      $(NavMenuSelectors.NavMenu + ', .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      setTimeout(function() {
        $(NavMenuSelectors.Section).removeClass('section-show');
        $(initial_nav).addClass('section-show');
      }, 350);
    }
  }
  // Mobile Navigation
  if ($(NavMenuSelectors.NavMenu).length) {
    const $mobile_nav = $(NavMenuSelectors.NavMenu).clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');
    $(document).on('click', NavMenuSelectors.MobileNavToggle, function(e: JQuery.Event) {
      $('body').toggleClass(NavMenuSelectors.MobileNavActive);
      $(NavMenuSelectors.MobileNavToggle + ' i').toggleClass('icofont-navigation-menu icofont-close');
      $(NavMenuSelectors.MobileNavOverly).toggle();
    });
    $(document).click(function(e: JQuery.Event) {
      const container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass(NavMenuSelectors.MobileNavActive)) {
          $('body').removeClass(NavMenuSelectors.MobileNavActive);
          $(NavMenuSelectors.MobileNavToggle + ' i').toggleClass('icofont-navigation-menu icofont-close');
          $(NavMenuSelectors.MobileNavOverly).fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }
  // jQuery counterUp
  $(NavMenuSelectors.CounterUp).counterUp({
    delay: 10,
    time: 1000
  });
  // Skills section
  $(NavMenuSelectors.SkillsContent).waypoint(function() {
    $(NavMenuSelectors.ProgressBar).each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });
  // Testimonials carousel (uses the Owl Carousel library)
  $(NavMenuSelectors.TestimonialsCarousel).owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });
  // Porfolio isotope and filter
  $(window).on('load', function() {
    const portfolioIsotope = $(NavMenuSelectors.PortfolioContainer).isotope({
      itemSelector: NavMenuSelectors.PortfolioItem,
      layoutMode: 'fitRows'
    });
    $(NavMenuSelectors.PortfolioFilters).on('click', function() {
      $(NavMenuSelectors.PortfolioFilters).removeClass('filter-active');
      $(this).addClass('filter-active');
      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });
  });
  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $(NavMenuSelectors.Venobox).venobox();
  });
})(jQuery);