$(document).ready(function(){
    $(".mainSection").on("click", "a.js-preview", function(){
        var btnId = $(this).attr('id');
        $( "."+ btnId ).css('display','block');
        $( "body" ).css('overflow','hidden');
        $( ".cd-top" ).css('display','none');
        $( ".FooterContent" ).css('display','none');
    });

    $.fn.overlayClose = function() {
        $( ".overlay" ).css('display','none');
        $( "body" ).css('overflow','auto');
        $( ".cd-top" ).css('display','block');
        $( ".FooterContent" ).css('display','block');
        return this;
    };
});