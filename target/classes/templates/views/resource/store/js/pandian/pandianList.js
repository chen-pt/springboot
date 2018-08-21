/**
 * Created by DELL on 2017/11/3.
 */
$(function () {
  getPandianList();
  $(document).on('change', '#input_file_add', function () {
    var e = $(this).val();
    if (e) {
      $("#import_btn").attr("data-ok", "modal");
      $("#import_btn").attr("data-target", "#remainTime");
      file_size = $("#input_file_add")[0].files[0].size;
      if (file_size >= 15728640) {
        layer.alert("上传文件超过了限制(15兆)，请更改后重新上传。");
        $("#import_btn").attr("disabled", "disabled");
      } else {
        changeUpDivSta();
      }
    }
    $("#file_name_add").val(e);
  });
  $(document).on('change', '#input_file_update', function () {
    var e = $(this).val();
    if (e) {
      $("#import_btn").attr("data-ok", "modal");
      $("#import_btn").attr("data-target", "#remainTime");
      file_size = $("#input_file_update")[0].files[0].size;
      if (file_size >= 15728640) {
        layer.alert("上传文件超过了限制，请更改后重新上传。");
        $("#import_btn").attr("disabled", "disabled");
      } else {
        changeUpDivSta();
      }
    }
    $("#file_name_update").val(e);
  });
  //上传csv，将文件信息保存到一个对象中
  $(document).on('click', '#import_btn', (function () {
    var file_size = "";
    var formData = new FormData();
    if ($(".option_add").parent().attr("class") == "checked") {
      if (!$("#input_file_add").val()) {
        layer.alert("请先选择您的上传文件！");
        return;
      }
      file_size = $("#input_file_add")[0].files[0].size;
      formData.append('xls_file', $("#input_file_add")[0].files[0]);
      formData.append("option", "1");//上传类型，0:覆盖型上传；1:新增型上传
    }
    if ($(".option_update").parent().attr("class") == "checked") {
      if (!$("#input_file_update").val()) {
        layer.alert("请先选择您的上传文件！");
        return;
      }
      file_size = $("#input_file_update")[0].files[0].size;
      formData.append('xls_file', $("#input_file_update")[0].files[0]);
      formData.append("option", "0");//上传类型，0:覆盖型上传；1:新增型上传
    }
    formData.append("id", $("#view_upload [name=pandian_id]").val());
    formData.append("num", $("#view_upload [name=pandian_num]").val());
    formData.append("pid", $("#view_upload [name=plan_id]").val());
    formData.append("t", new Date().getTime());
    $(this).attr("disabled", "disabled");//按钮暂时失效
    ImportProduct(formData);
  }));
});
//点击上传文件
var ImportProduct = function (formData) {
  $.ajax({
    url: "/store/check/addFile",
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    timeout: 0,
    success: function (data) {
      if (data.status == "ERROR") {
        layer.alert(data.message);
      } else if (data.errfile_url) {//导入失败，下载导入错误报表
        layer.alert("本次上传共" + data.total + "条数据，其中成功" + data.successTotal + "条，失败" + data.errorTotal + "条，" +
          "请下载<a href='" + data.errfile_url + "'>下载错误报表</a>。");
        getPandianList();
      } else {//导入成功
        layer.alert("本次上传共" + data.total + "条数据，其中成功" + data.successTotal + "条。失败" + data.errorTotal + "条。");
        getPandianList();
      }
    },
    error: function () {
      console.log("用户上传失败，请稍后重新上传。");
    }
  });
}
var getPandianList = function () {
  //获取各个参数
  var pandian_num = $("#pandianView [name=pandian_num]").val();//盘点单号
  var status = $("#pandianView [name=status]").val();//单据状态
  // var profitOrLossStatu = $("#pandianView [name=profitOrLossStatu]").val();//盈亏状态
  var profitOrLossStatu = null;
  var createTime = $("#pandianView [name=createTime]").val();//盘点开始时间
  var endTime = $("#pandianView [name=endTime]").val();//盘点结束时间
  console.log("搜索条件:盘点单号:[" + pandian_num + "],单据状态:[" + status + "],盈亏状态:[" + profitOrLossStatu + "]," +
    "盘点开始时间:[" + createTime + "],盘点结束时间:[" + endTime + "],");
  $("#pandian_list").html('');
  AlertLoading($("#pandian_list"));
  $.ajax({
      async: false,
      type: 'post',
      url: '/store/check/pandianList',
      dataType: 'JSON',
      data: {
        "pandian_num": pandian_num,
        "profitOrLossStatu": profitOrLossStatu,
        "status": status,
        "createTime": createTime,
        "endTime": endTime,
        "pageNum": pagination_page_no,
        "pageSize": pagination_pagesize,
      },
      success: function (data) {
        $("#pandian_list").empty();
        if (data.status == 1) {
          pagination_pages = data.data.pages;
          pagination_totals = data.data.total;
          if (data.data.pageNum == 0) {
            data.data.pageNum = 1;
          }
          var tmpl = document.getElementById('pandianListTemplate').innerHTML;
          var doTtmpl = doT.template(tmpl);
          var tr = doTtmpl(data.data);
          $("#pandian_list").append(tr);
          $("#pagediv").html("<span class='pageinfo'></span>");
        } else {
          $("#pandian_list").html("<tr><td colspan='10' class='center'>暂无数据</td></tr>");
        }
        addpage(getPandianList);
      },
      error: function () {
        console.log("error...");
      }
    }
  );
};

//打开盘点单上传页面
var uploadDetail = function (id, plan_id, pandian_num, storeId) {
//点击打开上传盘点单.初始化上传限制按钮
  $("#view_upload [name=pandian_id]").val(id);
  $("#view_upload [name=pandian_num]").val(pandian_num);
  $("#view_upload [name=plan_id]").val(plan_id);
  initUploadButton(pandian_num);
  getPanDianOrderStatus(pandian_num, storeId);
}
//
var initUploadButton = function (pandian_num) {
  $.ajax({
    url: "/store/check/getIsUpdateSite",
    type: "POST",
    data: {
      "pandian_num": pandian_num,
    },
    async: false,
    success: function (data) {
      $("#isUpSite").val(data.data);
    },
    error: function () {
      console.log("未获取到盘点单号对应的状态");
    }
  });
};

var getPanDianOrderStatus = function (pandian_num, storeId) {
  $.ajax({
    type: "POST",
    dataType: "JSON",
    data: {
      "pandian_num": pandian_num,
      "storeId": storeId,
    },
    url: "/store/check/getPanDianOrderStatus",
    success: function (data) {
      if (!(data.status == "OK" && (data.data == 0 || data.data == 100) && $("#isUpSite").val() == 0)) {//获取值且状态不为待上传和待下发状态
        $("#view_upload #import_btn").attr("disabled", "disabled");
      } else {
        $("#view_upload #import_btn").removeAttr("disabled");
      }
      $("#orderStatus").val(data.data);
    },
    error: function () {
      console.log("获取盘点单号的状态失败")
    }
  });
};

var changeUpDivSta = function () {
  if ($("#isUpSite").val() == 0 && ($("#orderStatus").val() == 0 || $("#orderStatus").val() == 100)) {
    $("#import_btn").removeAttr("disabled");
  } else {
    $("#import_btn").attr("disabled", "disabled");
  }
};
//第一次点击下发盘点任务
var status2StartOne = function () {
  var num = "";
  var pandian_num = "";
  var flag = true;
  var msg = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
      if ($(row).is(':checked')) {
        if (!pandian_num) {
          num += $(row).val() + "_" + $(row).parent().children("[name=storeId]").val() + ",";
          pandian_num = $(row).val();
        } else {
          if (pandian_num == $(row).val()) {
            num += $(row).val() + "_" + $(row).parent().children("[name=storeId]").val() + ",";
          } else {
            flag = false;
            msg = "您选择的不是相同的单号，请重新选择。";
          }
        }
      }
    }
  );
  if (!flag) {
    $("#task .modal-body").html(msg);
    $("#task_button").attr("disabled", "disabled");
  } else {
    if (!num) {
      $("#task .modal-body").html("未选中盘点单号,请选择盘点单号后再下发盘点任务。");
      $("#task_button").attr("disabled", "disabled");
    } else {
      $("#task_button").removeAttr("disabled");
      $("#task .modal-body").html("请再次确认盘点单下发，并进行盘点作业！");
    }
  }
}

//下发盘点任务
var status2Start = function () {
  var num = "";
  var pandian_num = "";
  var flag = true;
  var msg = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
      if ($(row).is(':checked')) {
        if (!pandian_num) {
          num += $(row).val() + "_" + $(row).parent().children("[name=storeId]").val() + ",";
          pandian_num = $(row).val();
        } else {
          if (pandian_num == $(row).val()) {
            num += $(row).val() + "_" + $(row).parent().children("[name=storeId]").val() + ",";
          } else {
            flag = false;
            msg = "您选择的不是相同的单号，请重新选择。";
          }
        }
      }
    }
  );
  if (!flag) {
    layer.alert(msg);
    return;
  }
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/store/check/IssuedTheTask",//下发盘点任务
      data: {
        "nums": num,
        "pandianType": "200"
      },
      success: function (data) {
        if (data.status == "ERROR") {
          layer.alert(data.message);
        } else if (data.status == "600") {
          layer.alert(data.message);
        } else if (data.code == "fail") {//盘点单下发失败
          layer.alert(data.data[0].errorMessage);
        } else if (data.code == "success") {
          alert("盘点单下发成功");
          getPandianList();
        }
      },
      error: function () {
        layer.alert("没有该权限或者传输失败。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再下发盘点任务。");
  }
};

//强制关闭盘点单
var closeCheckList = function () {
  var num = "";
  var pandian_num = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) {
      /*  num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";*/
      num += $(row).val() + "_" + $(row).parent().children("[name=storeId]").val() + ",";
    }
  });
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/store/check/closeTheTask",//关闭盘点单
      data: {
        "nums": num,
        "pandianType": "600"
      },
      success: function (data) {
        if (data.status == "ERROR") {
          layer.alert(data.message);
        } else if (data.status == "600") {
          layer.alert(data.message);
        } else if (data.code == "fail") {//盘点单关闭失败
          layer.alert(data.data[0].errorMessage);
        } else if (data.code == "success") {
          alert("关闭盘点单成功。");
          getPandianList();
        }
      },
      error: function () {
        layer.alert("没有该权限或者传输失败。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后在关闭盘点表。");
  }
};


/**
 *时间格式转换
 * @param format timestamp类型时间格式
 * @returns {*}
 */
var chargeTime = function (timeStamp) {
  return new Date(parseFloat(timeStamp)).format("yyyy-MM-dd");
}
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    // month
    "d+": this.getDate(),
    // day
    "h+": this.getHours(),
    // hour
    "m+": this.getMinutes(),
    // minute
    "s+": this.getSeconds(),
    // second
    "q+": Math.floor((this.getMonth() + 3) / 3),
    // quarter
    "S": this.getMilliseconds()
    // millisecond
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};
//上传页面取消按钮点击
var cancel_upload = function () {
  $("#view_upload").wrap('<form></form>');
  $("#view_upload").parent()[0].reset();
  $("#view_upload").unwrap();
}


//盘点表页面导出盘点报表
var view_export = function () {
  var flag = true;
  var msg = "";
  var pandianOrderId = "";
  var pandian_num = "";
  var storeIds = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) { //获取的盘点单号必须一致
      if (!pandian_num) {//盘点单号为空
        pandian_num = $(row).val();
        pandianOrderId = $(row).next().val();
        storeIds += $(row).next().next().val() + ",";
      } else {//盘点单号不为空
        if (pandian_num == $(row).val() && pandianOrderId == $(row).next("[name=pandianOrderId]").val()) {//后续盘点单号是同一列盘点单
          storeIds += $(row).next().next().val() + ",";//将该盘点单对应的门店id保存起来
        } else {//后续盘点单和之前的盘点单不一致
          flag = false;
          msg = "你选择的不是同一盘点单，请重新选择。";
        }
      }
    }
  });
  if (!pandian_num) {//不能为空
    flag = false;
    msg = "请选择你要导出的盘点单。";
  }
  if (flag == false) {
    layer.alert(msg);
    return;
  }
  var detailed_Data = new Object();
  detailed_Data.id = pandianOrderId;
  detailed_Data.num = pandian_num;
  detailed_Data.storeIds = storeIds;
  /*detailed_Data.sNum = $("#detailed [name=detail_storeNumber]").val();不需要此参数*/
  detailed_Data.option = 0;
  $.ajax({
    async: false,
    type: "POST",
    dataType: "JSON",
    url: "/store/check/reportBef",//预导出任务
    data: detailed_Data,
    success: function (data) {
      if (data.status == "ERROR") {
        layer.alert(data.message);
        return;
      }
      var dataNum = data.pageInfo.total;
      if (dataNum > 0) {
        layer.alert("本次导出共有" + data.pageInfo.total + "条数据。请<a onclick='view_exportData()' style='cursor: pointer' >点击下载</a>");
      } else {
        layer.alert("没有数据可供导出。");
      }
    },
    error: function () {
      layer.alert("数据获取异常，请确认后重新点击。");
    }
  });
};
//盘点表页面点击下载盘点单
var view_exportData = function () {
  var pandianOrderId = "";
  var pandian_num = "";
  var storeIds = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) { //获取的盘点单号必须一致
      if (!pandian_num) {//盘点单号为空
        pandian_num = $(row).val();
        pandianOrderId = $(row).next().val();
        storeIds += $(row).next().next().val() + ",";
      } else {//盘点单号不为空
        if (pandian_num == $(row).val() && pandianOrderId == $(row).next("[name=pandianOrderId]").val()) {//后续盘点单号是同一列盘点单
          storeIds += $(row).next().next().val() + ",";//将该盘点单对应的门店id保存起来
        }
      }
    }
  });
  var detailed_Data = new Object();
  detailed_Data.id = pandianOrderId;
  detailed_Data.num = pandian_num;
  detailed_Data.storeIds = storeIds;
  /*detailed_Data.sNum = $("#detailed [name=detail_storeNumber]").val();*/
  detailed_Data.option = 0;
  var form = $("<form>");//定义一个form表单
  form.attr("style", "display:none");
  form.attr("target", "");
  form.attr("method", "post");
  for (var i in detailed_Data) {
    form.append('<input type="hidden" name="' + i + '" value="' + detailed_Data[i] + '" >');
  }
  console.log(form.html());
  form.attr("action", "/store/check/inventories/report");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}
