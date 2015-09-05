$( document ).ready(function() {
    $('.SocialMedia-item').hover(function () {
        $('.js-SocialMedia-active', this).toggleClass('active');
        $('.js-SocialMedia-active', this).css({'display':'block'});
    });
});