jQuery(document).ready(function ($) {
    getNumStatistics();
    getSizeStatistics();
    getAgeStatistics();
    getSexStatistics();
});


function getNumStatistics() {
    var url = "js/json/treatment_number.json";

    $.getJSON(url, function (data) {
        new Chartist.Line('.chart_type_treatment-num', data['data']);
    });
}

function getSizeStatistics() {
    var url = "js/json/tumor_size.json";

    $.getJSON(url, function (data) {
        var nData = data['data'];
        var sum = function(a, b) { return a + b };
        new Chartist.Pie('.chart_type_tumor-size', nData, {
            labelInterpolationFnc: function(value) {
                return Math.round(value / nData.series.reduce(sum) * 100) + '%';
            }
        });
    });
}

function getAgeStatistics() {
    var url = "js/json/age.json";

    $.getJSON(url, function (data) {
        var nData = data['data'];
        var sum = function(a, b) { return a + b };
        new Chartist.Pie('.chart_type_age', nData, {
            labelInterpolationFnc: function(value) {
                return Math.round(value / nData.series.reduce(sum) * 100) + '%';
            }
        });
    });
}

function getSexStatistics() {
    var url = "js/json/sex.json";

    $.getJSON(url, function (data) {
        var nData = data['data'];
        var sum = function(a, b) { return a + b };
        new Chartist.Pie('.chart_type_sex', nData, {
            labelInterpolationFnc: function(value) {
                return Math.round(value / nData.series.reduce(sum) * 100) + '%';
            }
        });
    });
}