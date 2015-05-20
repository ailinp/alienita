/* =Slide menu down (class toggle)
-------------------------------------------------------------------------- */
'use strict';

$('document').ready(function() {

    var mobile_menu = $('.js-mobileMenu'),
        header_menu = $('.js-headerMenu'),
        menu_class_open = 'is--open';

    // Mobile menu
    mobile_menu.on('click', function() {
        header_menu.slideToggle().toggleClass(menu_class_open);
    });

    $('.js-footerColumnsTitle').on('click', function(event) {

        event.preventDefault();

        if ($(window).width() > 768) {
            return;
        }

        var submenu  = $(this).parent().find('ul'),
            submenus = $('.js-footerColumnsList'),
            is_open  = submenu.hasClass(menu_class_open);

        submenus.removeClass(menu_class_open).hide();

        if (!is_open) {
            submenu.addClass(menu_class_open).slideDown();
        }
    });

    $(window).resize(function(){

        if ($(window).width() > 768) {
            $('.js-footerColumnsList').show().removeClass(menu_class_open);
        }

        if ($(window).width() > 626) {
            header_menu.show().removeClass(menu_class_open).removeAttr('style');
        }
    });

});
