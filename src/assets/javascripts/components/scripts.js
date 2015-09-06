$(document).ready(function () {
    var topbarHeight = $('.Header').height()+20;

    $(".toCategories").click(function() {
        $('html, body').animate({
            scrollTop: $('#Categories').offset().top-= topbarHeight
        },1000);
    });

    $(".toContact").click(function() {
        $('html, body').animate({
            scrollTop: $('#Contact').offset().top-= topbarHeight
        },1000);
    });

    $(".toFooter").click(function() {
        $('html, body').animate({
            scrollTop: $('#Footer').offset().top-= topbarHeight
        },1000);
    });
});
