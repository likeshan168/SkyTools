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
    //查询基础数据或者图片文件等功能函数
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
    //初始化excel列和数据库列为可拖曳
    $("#sortable1,#sortable2,#sortable3").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();
    //扫描标签，显示模板并调用模板标签打印的方法
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
                beforeSend: function () {
                    $("#labelMsg").removeClass("hide").html("正在获取数据...").show();
                },
                success: function (data) {
                    if (data) {
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
                            fontOptions: "bold"
                            //height: 50,
                            //width: 105
                        };
                        if (templateId === "1") {
                            $barCodeImg = $("#smallBarCode");
                        } else if (templateId === "2") {
                            $barCodeImg = $("#bigBarCode");
                        }
                        $barCodeImg.JsBarcode($barCodeImg.attr('alt'), options);
                        $("#labelMsg").html("正在打印...");
                        //打印标签
                        printLabel(templateId);
                    }
                },
                error: function (xhr, statusText, err) {
                    $("#labelMsg").html("获取数据出错").hide();
                }
            });
        }
    });
    //初始化基础数据可配置列
    var content = '<table class="table table-striped table-condensed table-hover">' +
                      '<thead' +
                      '<tr>' +
                        '<th>列表显示条目</th>' +
                        '<th>恢复默认设置</th>' +
                      '</tr>' +
                      '</thead>' +
                      '<tbody>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="1" onclick="ConfigProductColumn(this);">鞋图</label></div></td><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="2" onclick="ConfigProductColumn(this);">货号</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="3" onclick="ConfigProductColumn(this);">颜色</label></div></td><td><div class="checkbox"><label><input type="checkbox" value="4" onclick="ConfigProductColumn(this);">英文颜色</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" value="5" onclick="ConfigProductColumn(this);">英文名称</label></div></td><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="6" onclick="ConfigProductColumn(this);">中文名称</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="7" onclick="ConfigProductColumn(this);">AUS</label></div></td><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="8" onclick="ConfigProductColumn(this);">EU</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="9" onclick="ConfigProductColumn(this);">USA</label></div></td><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="10" onclick="ConfigProductColumn(this);">CM</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="11" onclick="ConfigProductColumn(this);">Inches</label></div></td><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="12" onclick="ConfigProductColumn(this);">条形码</label></div></td></tr>' +
                      '<tr><td><div class="checkbox"><label><input type="checkbox" checked="checked" value="13" onclick="ConfigProductColumn(this);">京东码</label></div></td><td><div class="checkbox"><label><input type="checkbox" value="14" onclick="ConfigProductColumn(this);">旧京东码</label></div></td></tr>' +
                      '</tbody>' +
                  '</table>';
    //$("#configProductColumn").popover({
    //    html: true,
    //    content: content,
    //    placement: "left",
    //    //trigger: "focus ",
    //    //template: "<div class='popover'></div>"
    //    template: '<div class="popover" role="tooltip" ><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" width="300px;"></div></div>'
    //});
    $("#configColumnDialog").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        modal: true,
        buttons: [
            {
                text: "Ok",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    $(this).dialog("close");
                }

                // Uncommenting the following line would hide the text,
                // resulting in the label being used as a tooltip
                //showText: false
            }
        ]
    });

    $("#configProductColumn").click(function () {
        $("#configColumnDialog").removeClass("fade modal").dialog("open");
    });
});

//配置excel与数据库列的对应关系
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
//保存excel与数据库列的对应关系
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
//打印标签功能函数
function printLabel(templateId) {
    var LODOP = getCLodop();
    /*1. 初始化打印任务*/
    LODOP.PRINT_INIT("sky-faith打印标签任务");

    var style = "<link href='/src/style/PrintLabel.css' type='text/css' rel='stylesheet'>";
    //var html = style + "<body>" + document.getElementById("printArea").innerHTML + "</body>";
    var html;
    /*2. 设定纸张的大小和打印的方向*/
    if (templateId === "1") {
        //LODOP.SET_PRINT_PAGESIZE(1, "7cm", "4cm", "");
        html = style + "<body>" + $(".smallContainer").html() + "</body>";
        LODOP.ADD_PRINT_HTM(0, 0, "7cm", "4cm", html);

    } else if (templateId === "2") {
        //LODOP.SET_PRINT_PAGESIZE(1, "9cm", "5cm", "");
        html = style + "<body>" + $(".bigContainer").html() + "</body>";
        LODOP.ADD_PRINT_HTM(0, 0, "9cm", "5cm", html);
    }
    //LODOP.PRINT();
    LODOP.PREVIEW();
    $("#labelMsg").html("打印完成").hide(2000);

};

//添加，删除基础信息列
function ConfigProductColumn(obj) {
    var $obj = $(obj);
    if ($obj.is(":checked")) {
        $("#productTb tr th:eq(" + $obj.val() + ")").show();
        $("#productTb tr td:nth-child(" + $obj.val() + ")").show();
    } else {
        $("#productTb tr th:eq(" + $obj.val() + ")").hide();
        $("#productTb tr td:nth-child(" + $obj.val() + ")").hide();
    }

}




