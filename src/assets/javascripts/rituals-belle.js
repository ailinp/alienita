$(window).load(function() {

    var moduleTrigger   = $('.js-moduleContentTrigger'),
        moduleContainer = $('.js-moduleContent'),
        linkTextClose   = 'Ver más',
        linkTextOpen    = 'Ver menos';

    moduleContainer.hide();
    moduleTrigger.on('click', function(event) {
        event.preventDefault();
        var _text   = $(this).text(),
            newText = (_text == linkTextClose) ? linkTextOpen : linkTextClose;

        $(this).toggleClass('is-open').text(newText);
        $(this).parent().parent().parent().find('.js-moduleContent').slideToggle();
    });
});