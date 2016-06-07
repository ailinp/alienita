jQuery(document).ready(function($) {
    $(window).scroll(function() {
        $('.PersonalSkills-chart').easyPieChart({
            scaleColor: false,
            lineWidth: 5,
            lineCap: 'round',
            barColor: '#f64159',
            trackColor: '#fcbbc3',
            size: 120,
            animate: 5000,
            onStop: $.noop
        });
    });
});
