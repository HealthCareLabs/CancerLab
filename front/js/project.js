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
    var url = 'js/json/treatment_number.json';

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
    var url = 'js/json/tumor_size.json';

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
    var url = 'js/json/age.json';

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
    var url = 'js/json/sex.json';

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