import $ from 'jquery';

$(document).ready(function() {
  "use strict";

  enum Rule {
    Required = 'required',
    MinLen = 'minlen',
    Email = 'email',
    Checked = 'checked',
    RegExp = 'regexp'
  }

  interface JQueryInputElement extends JQuery<HTMLElement> {
    val(): string;
    attr(attributeName: string): string | undefined;
    is(selector: string): boolean;
    next(selector: string): JQuery<HTMLElement>;
  }

  // Contact
  $('form.php-email-form').submit(function() {
    const f = $(this).find('.form-group');
    let ferror = false;
    const emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() {
      const i = $(this) as JQueryInputElement;
      let rule = i.attr('data-rule');

      if (rule !== undefined) {
        let ierror = false;
        const pos = rule.indexOf(':', 0);
        let exp: string | RegExp = '';
        if (pos >= 0) {
          exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case Rule.Required:
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case Rule.MinLen:
            if (i.val().length < parseInt(exp as string)) {
              ferror = ierror = true;
            }
            break;

          case Rule.Email:
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case Rule.Checked:
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case Rule.RegExp:
            exp = new RegExp(exp as string);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    f.children('textarea').each(function() {
      const i = $(this) as JQueryInputElement;
      let rule = i.attr('data-rule');

      if (rule !== undefined) {
        let ierror = false;
        const pos = rule.indexOf(':', 0);
        let exp: string = '';
        if (pos >= 0) {
          exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case Rule.Required:
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case Rule.MinLen:
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    if (ferror) return false;
    else var str = $(this).serialize();

    const this_form = $(this);
    const action = $(this).attr('action');

    if (!action) {
      this_form.find('.loading').slideUp();
      this_form.find('.error-message').slideDown().html('The form action property is not set!');
      return false;
    }

    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();

    $.ajax({
      type: "POST",
      url: action,
      data: str,
      success: function(msg) {
        if (msg === 'OK') {
          this_form.find('.loading').slideUp();
          this_form.find('.sent-message').slideDown();
          this_form.find("input:not(input[type=submit]), textarea").val('');
        } else {
          this_form.find('.loading').slideUp();
          this_form.find('.error-message').slideDown().html(msg);
        }
      }
    });
    return false;
  });
});