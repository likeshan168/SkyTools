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


    $("#sortable1,#sortable2,#sortable3").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();
    //$("#sortable2").sortable().disableSelection();
});

function showDialog(obj) {
    $('#myModal').modal('show');
    //获取excel的列名
    $.ajax({
        url: "/api/Excel/" + $(obj).data("name"),
        beforeSend: function () {
            $("#sortable1").html("<li>获取excel列的信息...</li>");
            $("#sortable2").html("<li>获取数据库列的信息...</li>");
        },
        success: function (data) {
            console.log(data);
            if (data) {
                var html;
                if (data.excelColumns) {
                    html = tmpl($("#template-excelColumn").html().toString(), data);
                    $("#sortable1").html(html);
                }
                if (data.dbColumns) {
                    html = tmpl($("#template-dbColumn").html().toString(), data);
                    $("#sortable2").html(html);
                }

                $("#saveMappedColumns").data("excelPath", data.excelPath);
            }
        },
        error: function (xhr, statusText) {

        }
    });
}

function saveMappedColumns() {
    var arr1 = new Array();
    var arr2 = new Array();
    $("#sortable1").find("li").each(function (index, ele) {
        arr1.push(ele.innerText);
    });
    $("#sortable2").find("li").each(function (index, ele) {
        arr2.push(ele.innerText);
    });
    console.log($("#saveMappedColumns").data("excelPath"));
    $.ajax({
        url: "/api/Excel",
        type: 'POST',
        dataType: 'json',
        data: {
            dbColumns: arr2,
            excelColumns: arr1,
            excelPath: $("#saveMappedColumns").data("excelPath")
        },
        beforeSend: function () {

        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, statusText) {

        }
    });
    console.log(arr1);
    console.log(arr2);
}