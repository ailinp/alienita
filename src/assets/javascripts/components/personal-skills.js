$(function() {
    $('.PersonalSkills-chart').easyPieChart({
        scaleColor: false,
        lineWidth: 12,
        lineCap: 'round',
        barColor: '#f64159',
        trackColor: '#fcbbc3',
        size: 150,
        animate: 5000,
        onStop: $.noop
    });
});