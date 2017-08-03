(function ($) {

  "use strict";

  let DATA_KEY = 'ca.textfield';
  let EVENT_KEY = DATA_KEY+'.';

  let Event = {
    FOCUS: EVENT_KEY+'focus',
    BLUR: EVENT_KEY+'blur',
    CHANGED: EVENT_KEY+'changed',
    DIRTY: EVENT_KEY+'dirty',
    VALID: EVENT_KEY+'valid',
    INVALID: EVENT_KEY+'invalid',
    RESET: EVENT_KEY+'reset'
  };

  let Selector = {
    TEXT_FIELD: '.md-textfield',
    DATA_TOGGLE: '[data-toggle="textfield"]'
  };

  let MaterialTextfield = function () {

    let MaterialTextfield = function (element, config) {
      this.$textfield_ = $(element);
      this.isShown_ = false;
      this.isAnimating_ = false;
      this.startY_ = 0;
      this.currentY_ = 0;
      this.touchingBSheet_ = false;
      this.init_(config);
    };

    MaterialTextfield.VERSION = '1.0';

    MaterialTextfield.prototype.Classes_ = {
      INPUT: 'md-textfield__input',
      IS_DIRTY: 'md-textfield--dirty',
      IS_FOCUSED: 'md-textfield--focused',
      IS_DISABLED: 'md-textfield--disabled',
      IS_INVALID: 'md-textfield--invalid',
      FLOATING_LABEL: 'md-textfield--floating-label',
      HAS_PLACEHOLDER: 'md-textfield--has-placeholder',
      COUNTER_SPAN: 'md-textfield__counter'
    };

    MaterialTextfield.prototype.init_ = function (config) {
      this.config = $.extend({}, this.Default, config);
      if(this.$textfield_){
        this.$input_ = this.$textfield_.find('.'+this.Classes_.INPUT);
        if(this.$input_){
          this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
          this.boundFocusHandler = this.onFocus_.bind(this);
          this.boundBlurHandler = this.onBlur_.bind(this);
          this.boundResetHandler = this.onReset_.bind(this);
          this.$input_.on('input', this.boundUpdateClassesHandler);
          this.$input_.on('focus', this.boundFocusHandler);
          this.$input_.on('blur', this.boundBlurHandler);
          this.$input_.on('reset', this.boundResetHandler);
          this.setTextfieldClass_()
          this.setCount_()
          this.updateClasses_()
          if (typeof this.$input_.attr('autofocus') !== typeof undefined && this.$input_.attr('autofocus') !== false) {
            this.$textfield_.focus();
            this.checkFocus();
          }
        }
      }
    };

    MaterialTextfield.prototype.Default = {
      float: false,
      count: false
    };

    MaterialTextfield.prototype.setTextfieldClass_ = function () {
      if(this.config.float || this.$textfield_.hasClass(this.Classes_.FLOATING_LABEL)){
        this.$textfield_.addClass(this.Classes_.FLOATING_LABEL)
      }
      if (typeof this.$input_.attr('placeholder') !== typeof undefined && this.$input_.attr('placeholder') !== false) {
        this.$textfield_.addClass(this.Classes_.HAS_PLACEHOLDER);
      }

    };

    MaterialTextfield.prototype.setCount_ = function(){
      if(!this.config.count)
          return ;
      let $counterSpan = this.$textfield_.find('.'+this.Classes_.COUNTER_SPAN)
      if($counterSpan.length){
        this.$counterSpan = $counterSpan;
        this.$input_.on('input', this.onKeyDownCount_.bind(this));
        this.maxLength = this.$input_.attr('maxlength')
      }
    }

    MaterialTextfield.prototype.onKeyDown_ = function (event) {
      let currentRowCount = event.target.value.split('\n').length;
      if (event.keyCode === 13) {
        if (currentRowCount >= this.maxRows) {
          event.preventDefault();
        }
      }
    };

    MaterialTextfield.prototype.onKeyDownCount_ = function (event){
      let wordCount = event.target.value.length;
      this.$counterSpan.text(wordCount +'/' + this.maxLength);
    };

    MaterialTextfield.prototype.onFocus_ = function () {
      this.$textfield_.addClass(this.Classes_.IS_FOCUSED);
      this.$textfield_.trigger(Event.FOCUS);
    };

    MaterialTextfield.prototype.onBlur_ = function () {
      this.$textfield_.removeClass(this.Classes_.IS_FOCUSED);
      this.$textfield_.trigger(Event.BLUR);
    };

    MaterialTextfield.prototype.onReset_ = function () {
      this.updateClasses_();
      this.$textfield_.trigger(Event.RESET);
    };

    MaterialTextfield.prototype.updateClasses_ = function () {
      this.checkDisabled();
      this.checkDirty();
      this.checkFocus();
      this.checkValidity_();
    };

    MaterialTextfield.prototype.checkDisabled = function () {
      if(this.$input_.prop('disabled')){
        this.$textfield_.addClass(this.Classes_.IS_DISABLED);
      } else{
        this.$textfield_.removeClass(this.Classes_.IS_DISABLED);
      }
    };

    MaterialTextfield.prototype.checkFocus = function () {
      if (typeof this.$input_.attr('autofocus') !== typeof undefined && this.$input_.attr('autofocus') !== false) {
        this.$textfield_.addClass(this.Classes_.IS_FOCUSED);
      }
    };

    MaterialTextfield.prototype.checkValidity_ = function () {
      if(!this.$textfield_.hasClass(this.Classes_.IS_DIRTY))
          return ;
      if (typeof this.$input_.get(0).validity !== typeof undefined) {
        if (this.$input_.get(0).validity.valid) {
          this.$textfield_.removeClass(this.Classes_.IS_INVALID);
          this.$textfield_.trigger(Event.VALID);
        } else {
          this.$textfield_.addClass(this.Classes_.IS_INVALID);
          this.$textfield_.trigger(Event.INVALID);
        }
      }
    };

    MaterialTextfield.prototype.checkDirty = function () {
      if ((this.$input_.val() != '') && (this.$input_.val().length > 0)) {
        this.$textfield_.addClass(this.Classes_.IS_DIRTY);
        this.$textfield_.trigger(Event.DIRTY);
      } else {
        this.$textfield_.removeClass(this.Classes_.IS_DIRTY);
      }
    };

    MaterialTextfield.prototype.disable = function () {
      this.$input_.prop( "disabled",true);
      this.updateClasses_();
    };

    MaterialTextfield.prototype.enable = function () {
      this.$input_.prop( "disabled",false);
      this.updateClasses_();
    };

    MaterialTextfield.prototype.clear = function () {
      this.$input_.val('');
      this.updateClasses_();
    };

    MaterialTextfield.prototype.destroy = function (value) {
      this.$textfield_.removeClass(this.Classes_.IS_DIRTY).removeClass(this.Classes_.IS_INVALID)
      this.$input_.unbind('input', this.boundUpdateClassesHandler);
      this.$input_.unbind('focus', this.boundFocusHandler);
      this.$input_.unbind('blur', this.boundBlurHandler);
      this.$input_.unbind('reset', this.boundResetHandler);
      this.$textfield_.data(DATA_KEY, null);
    };

    MaterialTextfield.Plugin_ = function Plugin_(config) {
      return this.each(function () {
        let $this = $(this);
        let data  = $this.data(DATA_KEY);
        if (!data){
          $this.data(DATA_KEY, (data = new MaterialTextfield(this, config)));
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    };
    return MaterialTextfield;
  }();

  $(window).on('load', function (){
    $(Selector.DATA_TOGGLE).each(function () {
      var $this = $(this);
      var config = $this.data();
      MaterialTextfield.Plugin_.call($this, config);
    });
  });

  $.fn.MaterialTextfield = MaterialTextfield.Plugin_;
  $.fn.MaterialTextfield.Constructor = MaterialTextfield;
  $.fn.MaterialTextfield.noConflict = function () {
    $.fn.MaterialTextfield = MaterialTextfield;
    return MaterialTextfield.Plugin_;
  };
}( jQuery ));