/// <reference path="../../lib/jquery/dist/jquery.js" />
/// <reference path="../../lib/jquery/dist/jquery.min.js" />
/// <reference path="../../lib/jquery/dist/jquery.slim.js" />
/// <reference path="../../lib/jquery/dist/jquery.slim.min.js" />




$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'api/Values/',
        autoUpload: true
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );


    // Load existing files:
    //$('#fileupload').addClass('fileupload-processing');
    //$.ajax({
    //    // Uncomment the following to send cross-domain cookies:
    //    //xhrFields: {withCredentials: true},
    //    url: $('#fileupload').fileupload('option', 'url'),
    //    dataType: 'json',
    //    context: $('#fileupload')[0]
    //}).always(function () {
    //    $(this).removeClass('fileupload-processing');
    //}).done(function (result) {
    //    $(this).fileupload('option', 'done')
    //        .call(this, $.Event('done'), { result: result });
    //});


    $("#search").keyup(function (e) {
        var obj = $(this);
        if (obj.val() === "") {
            return;
        }
        let active = $("#navbar>li.active>a").text();
        var url = "";
        if (active === "上传文件") {
            url = "/api/values/" + obj.val();
        }
        else {
            url = "/api/Products/" + obj.val();
        }

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (result) {

                var o = {
                    files: result,
                    formatFileSize: function (bytes) {
                        if (typeof bytes !== 'number') {
                            return '';
                        }
                        if (bytes >= 1000000000) {
                            return (bytes / 1000000000).toFixed(2) + ' GB';
                        }
                        if (bytes >= 1000000) {
                            return (bytes / 1000000).toFixed(2) + ' MB';
                        }
                        return (bytes / 1000).toFixed(2) + ' KB';
                    }
                };

                var html = tmpl($("#template-search").html().toString(), o);
                $("#searchResults").html(html.toString());
            },
            error: function (xhr, statusText) {

            }
        });
    })
    //$('#myModal').modal({show:false});



});

function showDialog(obj) {
    $('#myModal').modal('show');
    //获取excel的列名
    $.ajax({
        url: "/api/Excel/" + $(obj).data("name"),
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, statusText) {

        }
    });
}