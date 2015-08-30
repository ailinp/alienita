/* =Language dropdown (class toggle)
-------------------------------------------------------------------------- */
'use strict';

function DropDown(e) {
    this.dd = e;
    this.initEvents();
}

DropDown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.dd.on('click', function(event){
            jQuery(this).toggleClass('is-open');
            event.stopPropagation();
        });
    }
}

$(function() {

    var dd = new DropDown( jQuery('.js-footerDropdown') );

    $(document).click(function() {
      // all dropdowns
        $('.js-footerDropdown').removeClass('is-open');
    });

});