'use strict';
(function($) {
    $('.previewBlock-close').click(function() {
        $('.previewBlock-open').addClass('previewBlock-hidden');
        return false;
    });

    $('.previewBlock').click(function() {
        $('.previewBlock-open').removeClass('previewBlock-hidden');
        return false;
    });
}(jQuery));