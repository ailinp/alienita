$(document).ready(function() {

    $.fn.extend({
        animateSquares: function() {
            var c;
            $.each($(this), function(i, el){
                c = $(el).data('order');

                setTimeout(function(){
                    $(el).addClass("animated fadeIn")
                }, 200 + ( c * 500 ));
            });
        }
    });

    $('section.NewProducts').waypoint(function() {
        $('section.NewProducts .js-square').animateSquares();
    },{
        offset: '85%'
    });

    $('section.RitualsBelle').waypoint(function() {
        $('section.RitualsBelle .js-square').animateSquares();
    },{
        offset: '85%'
    });
});