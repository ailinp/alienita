// 'use strict';
// (function($) {
//     $('.overlay-close').click(function() {
//         hideOverlay();
//     });

//     $('.js-preview').click(function() {
//         showOverlay();
//     });
// }(jQuery));

// function showOverlay(){
//     $('.js-preview + .overlay').css('visibility','visible');
//     $('.js-preview + .overlay').css('opacity','1');
// }

// function hideOverlay(){
//     $('.js-preview + .overlay').css('opacity','0');
//     $('.js-preview + .overlay').css('visibility','hidden');
// }

(function($) {
    $('.overlay-close').click(function() {
        $('.js-preview + .overlay').css('opacity','0');
        $('.js-preview + .overlay').css('visibility','hidden');
    });

    $('.js-preview').click(function() {
        $(this + '.overlay').css('visibility','visible');
        $(this + '.overlay').css('opacity','1');
    });
}(jQuery));