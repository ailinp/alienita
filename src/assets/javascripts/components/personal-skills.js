jQuery(document).ready(function($) {
    $(window).scroll(function() {
        $('.PersonalSkills-chart').easyPieChart({
            scaleColor: false,
            lineWidth: 6,
            lineCap: 'round',
            barColor: '#f64159',
            trackColor: '#fcbbc3',
            size: 140,
            animate: 5000,
            onStop: $.noop
        });
    });
});
