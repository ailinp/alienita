$(document).ready(function () {
    $(".toCategories").click(function() {
        $('html, body').animate({
            scrollTop: $('#Categories').offset().top
        },1000);
    });

    $(".toContact").click(function() {
        $('html, body').animate({
            scrollTop: $('#Contact').offset().top
        },1000);
    });

    $(".toFooter").click(function() {
        $('html, body').animate({
            scrollTop: $('#Footer').offset().top
        },1000);
    });
});
