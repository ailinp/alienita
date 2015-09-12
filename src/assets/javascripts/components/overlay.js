$(document).ready(function(){
    $(".mainSection").on("click", "a.js-preview", function(){
        var btnId = $(this).attr('id');
        $( "."+ btnId ).css('display','block');
    });

    $.fn.overlayClose = function() {
        $( ".overlay" ).css('display','none');
        return this;
    };
});