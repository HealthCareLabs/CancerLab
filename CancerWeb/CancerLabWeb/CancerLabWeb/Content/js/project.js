jQuery(document).ready(function ($) {

    if ($('.statistics section').hasClass('chart')) {
        chartInit();
    }

});

function chartInit() {
    getNumStatistics();
    getSizeStatistics();
    getAgeStatistics();
    getSexStatistics();
}

function getNumStatistics() {
    var url = '/Statistics/TreatmentsCount';

    $.getJSON(url, function (data) {
        var dataStat = data['data'];

        var chart = new CanvasJS.Chart('chart_treatment', {
            data: [{
                type: 'line',
                dataPoints: dataStat
            }]
        });
        chart.render();
    });
}

function getSizeStatistics() {
    var url = '/Statistics/SizeStatistics';

    $.getJSON(url, function (data) {
        var dataStat = data['data'];

        var chart = new CanvasJS.Chart('chart_size', {
            data: [{
                type: 'doughnut',
                dataPoints: dataStat
            }]
        });
        chart.render();
    });
}

function getAgeStatistics() {
    var url = '/Statistics/AgeStatistics';

    $.getJSON(url, function (data) {
        var dataStat = data['data'];

        var chart = new CanvasJS.Chart('chart_age', {
            data: [{
                type: 'doughnut',
                dataPoints: dataStat
            }]
        });
        chart.render();
    });
}

function getSexStatistics() {
    var url = '/Statistics/SexStatistics';

    $.getJSON(url, function (data) {
        var dataStat = data['data'];

        var chart = new CanvasJS.Chart('chart_sex', {
            data: [{
                type: 'doughnut',
                dataPoints: dataStat
            }]
        });
        chart.render();
    });
}