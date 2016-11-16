/// <reference path="../../lib/jquery/dist/jquery.js" />
/// <reference path="../../lib/jquery/dist/jquery.min.js" />
/// <reference path="../../lib/jquery/dist/jquery.slim.js" />
/// <reference path="../../lib/jquery/dist/jquery.slim.min.js" />

'use strict';
$(function () {
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
        if ($.trim(obj.val()).length === 0) {
            return;
        }
        let active = $("#navbar>li.active>a").attr("href");
        var url = "";
        if (active === "#uploadExcel") {
            url = "/api/values/" + obj.val();
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
                    var obj = $("#searchResults").html(html.toString()).find(".img-thumbnail");
                    obj.each(function (i, o) {
                        var ob = $(o);
                        ob.tooltip({ html: true, title: "<img src='" + ob.attr('src') + "' width='180' height='180'/>", placement: "right" });
                    });

                },
                error: function (xhr, statusText) {

                }
            });
        }
        else {
            url = "/api/Products/" + obj.val();
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    var html = tmpl($("#template-product").html().toString(), data);
                    var obj = $("#productInfo").html(html).find(".img-thumbnail");
                    obj.each(function (i, o) {
                        var ob = $(o);
                        ob.tooltip({ html: true, title: "<img src='" + ob.attr('src') + "' width='180' height='180'/>", placement: "right" });
                    });
                },
                error: function (xhr, statusText, error) {
                    console.log(error);
                }
            });
        }
    })


    $("#sortable1,#sortable2,#sortable3").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();

    //$("#printArea,#template").sortable({
    //    connectWith: ".printLabel"
    //});


    $("#inputBarCode").keyup(function (e) {
        if (e.keyCode == 13) {
            var obj = $(this);
            //alert(obj.val());
            if ($.trim(obj.val()) === "") {
                return;
            }
            var templateId = $("#template").val();
            $.ajax({
                url: '/api/label/' + obj.val(),
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    var html;
                    var $barCodeImg
                    if (templateId === "1") {

                        html = tmpl($("#template-smallLabel").html().toString(), data);
                    } else if (templateId === "2") {

                        html = tmpl($("#template-bigLabel").html().toString(), data);
                    }
                    $("#printArea").html(html);
                    var options = {
                        format: "CODE128",
                        displayValue: true,
                        //fontSize: 24,
                        fontOptions:"bold"
                        //height: 50,
                        //width: 105
                    };
                    if (templateId === "1") {
                        $barCodeImg = $("#smallBarCode");
                    } else if (templateId === "2") {
                        $barCodeImg = $("#bigBarCode");
                    }
                    console.log($barCodeImg.attr('alt'));
                    $barCodeImg.JsBarcode($barCodeImg.attr('alt'), options);


                },
                error: function (xhr, statusText, err) {

                }
            });
        }
    });
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
                $("#sortable3").html("");
                $("#saveMappedColumns").data("excelPath", data.excelPath);
            }
        },
        error: function (xhr, statusText) {

        }
    });
}

function saveMappedColumns(obj) {
    var $btn = $(obj).button("loading");
    var arr1 = new Array();
    var arr2 = new Array();
    $("#sortable1").find("li").each(function (index, ele) {
        arr1.push(ele.innerText);
    });
    $("#sortable2").find("li").each(function (index, ele) {
        arr2.push(ele.innerText);
    });

    $.ajax({
        url: "/api/Excel",
        type: 'POST',
        data: {
            dbColumns: arr2,
            excelColumns: arr1,
            excelPath: $("#saveMappedColumns").data("excelPath")
        },
        success: function (data) {
            $btn.button('reset');
            $('#myModal').modal('hide');
        },
        error: function (xhr, statusTexth, error) {
            console.log(error);
            $btn.button('reset');
        }
    });
}

function printLabel(obj) {
    /*1. 初始化打印任务*/
    LODOP.PRINT_INIT("sky-faith打印标签任务");
    /*2. 设定纸张的大小和打印的方向*/
    LODOP.SET_PRINT_PAGESIZE(1, "4cm", "7cm", "");
};





