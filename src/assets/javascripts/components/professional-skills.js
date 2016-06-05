$(document).ready(function() {
    $(".js-tabMenu a").on('click', function(event) {
        event.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(".js-tabContent").not(tab).css("display", "none");
        $(tab).slideDown();
    });
});
