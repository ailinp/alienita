jQuery(function($) {
    $('.babySlider-content').sss();
    $('.section').click(function(e) {
      e.preventDefault();

      var loc = $(this).attr('href').substring(1);
      var lock = $('#' + loc).offset().top;
      $('body,html').animate({scrollTop:lock});
    });
});