/**
 * Created by DELL on 2017/11/3.
 */
$(function () {
  getPandianList();
  getPanDianStoreList();
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
    if ($(".option_add").attr("checked") == "checked") {
      if (!$("#input_file_add").val()) {
        layer.alert("请先选择您的商品文件！");
        $("#view_upload").modal("show");
        return;
      }
      file_size = $("#input_file_add")[0].files[0].size;
      formData.append('xls_file', $("#input_file_add")[0].files[0]);
      formData.append("option", "1");//上传类型，0:覆盖型上传；1:新增型上传
    }
    if ($(".option_update").attr("checked") == "checked") {
      if (!$("#input_file_update").val()) {
        layer.alert("请先选择您的商品文件！");
        $("#view_upload").modal("show");
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

var getPanDianStoreList = function () {
  $.ajax({
    type: "POST",
    dataType: "JSON",
    url: "/merchant/inventory/getStores",
    success: function (data) {
      console.log(data);
      var tr = "<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);'value=''>全部门店</a></li>";
      if (data.status == 1) {
        if (data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            var store = data.data[i];
            tr += "<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);'value='" + store.storeId + "'>" + store.storeName + "</a></li>"
          }
        }
      }
      $("#storeList").html(tr);
    },
    error: function () {
      console.log("error...");
    }
  });
}
//盘点表列表数据渲染
var getPandianList = function () {
  //获取各个参数
  var pandian_num = $("#pandianView [name=pandian_num]").val();//盘点单号
  var storeId = $("#pandianView [name=storeId]").val();//获取门店编码
  var status = $("#pandianView [name=status]").val();//单据状态
  // var profitOrLossStatu = $("#pandianView [name=profitOrLossStatu]").val();//盈亏状态
  var profitOrLossStatu = null;
  var createTime = $("#pandianView [name=createTime]").val();//盘点开始时间
  var endTime = $("#pandianView [name=endTime]").val();//盘点结束时间
  console.log("搜索条件:盘点单号:[" + pandian_num + "],门店ID:[" + storeId + "],单据状态:[" + status + "],盈亏状态:[" + profitOrLossStatu + "]," +
    "盘点开始时间:[" + createTime + "],盘点结束时间:[" + endTime + "],");
  $("#pandian_list").html('');
  AlertLoading($("#pandian_list"));
  $.ajax({
      async: false,
      type: 'post',
      url: '/merchant/pandianList',
      dataType: 'JSON',
      data: {
        "pandian_num": pandian_num,
        "storeId": storeId,
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

//点击打开上传盘点单.初始化上传限制按钮
var uploadDetail = function (id, plan_id, pandian_num, storeId) {
  $("#view_upload [name=pandian_id]").val(id);
  $("#view_upload [name=pandian_num]").val(pandian_num);
  $("#view_upload [name=plan_id]").val(plan_id);
  initUploadButton(pandian_num);
  getPanDianOrderStatus(pandian_num, storeId);
}
//上传页面取消按钮点击
var cancel_upload = function () {
  $("#view_upload").wrap('<form></form>');
  $("#view_upload").parent()[0].reset();
  $("#view_upload").unwrap();
}
var initUploadButton = function (pandian_num) {
  $.ajax({
    url: "/merchant/getIsUpdateSite",
    type: "POST",
    data: {
      "pandian_num": pandian_num,
    },
    async: false,
    success: function (data) {
      if (data.data == 0) {//按钮关闭状态--------仅门店上传
        $("#div1").removeClass("open1").addClass("close1");
        $("#div2").removeClass("close2").addClass("open2");
        $("#isupdateText").html("仅门店上传");
      } else {//按钮打开状态-----仅总部上传
        $("#div1").addClass("open1").removeClass("close1");
        $("#div2").addClass("close2").removeClass("open2");
        $("#isupdateText").html("仅总部上传");
      }
      $("#isUpSite").val(data.data);
    },
    error: function () {
      console.log("为获取到盘点单号对应的状态");
    }
  });
}

//下发盘点任务
var status2StartOne = function () {
  var num = "";
  var pandian_num = "";
  var flag = true;
  var msg = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) {
      if (!pandian_num) {
        num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";
        pandian_num = $(row).val();
      } else {
        if (pandian_num == $(row).val()) {
          num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";
        } else {
          flag = false;
          msg = "您选择的不是相同的单号，请重新选择。";
        }
      }
    }
  });
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
};


//下发盘点任务
var status2Start = function () {
  var num = "";
  var pandian_num = "";
  var flag = true;
  var msg = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) {
      if (!pandian_num) {
        num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";
        pandian_num = $(row).val();
      } else {
        if (pandian_num == $(row).val()) {
          num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";
        } else {
          flag = false;
          msg = "您选择的不是相同的单号，请重新选择。";
        }
      }
    }
  });
  if (!flag) {
    layer.alert(msg);
    return;
  }
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/merchant/IssuedTheTask",//下发盘点任务
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
          layer.alert("盘点单下发成功。");
          getPandianList();
        }
      },
      error: function () {
        layer.alert("传输失败");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再下发盘点任务。");
  }
};

//用户点击按钮更改当前值
var isExchangeButton = function () {
  updateUpSite();
}
//更新是否允许门店导入盘点报表的权限
var updateUpSite = function () {
  var id = $("#view_upload [name=pandian_id]").val();
  var isUpSite = 0;//默认仅允许门店上传
  if ($("#div1").attr("class") == "open1") {//修改之前状态
    isUpSite = 0;
  } else {
    isUpSite = 1;
  }
  $.ajax({
    type: "POST",
    url: "/merchant/updateUpSite",
    data: {
      "id": id,
      "isUpSite": isUpSite,
    },
    success: function (data) {
      if (data.status == "OK") {
        // layer.alert("按钮当前class值:" + $("#div1").attr("class"));
        if ($("#div1").attr("class") == "open1") {//当前是打开状态
          //将按钮调节至关闭状态
          $("#div1").removeClass("open1").addClass("close1");
          $("#div2").removeClass("close2").addClass("open2");
          $("#isupdateText").html("仅门店上传");
        } else {//当前是关闭状态
          //将按钮调节至打开状态
          $("#div1").removeClass("close1").addClass("open1");
          $("#div2").removeClass("open2").addClass("close2");
          $("#isupdateText").html("仅总部上传");
        }
        $("#isUpSite").val(isUpSite);
        changeUpDivSta();
        layer.alert("状态更新成功。");
      } else {
        layer.alert("状态未更新。");
      }
    },
    error: function () {
      console.log("更新允许门店上传盘点单接口调用失败。");
    }
  });
}
//点击上传文件
var ImportProduct = function (formData) {
  $.ajax({
    url: "/merchant/addFile",
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
        layer.alert("本次上传共" + data.total + "条数据，其中成功" + data.successTotal + "条。失败" + data.errorTotal + "条");
        getPandianList();
      }
    },
    error: function () {
      console.log("用户上传失败，请稍后重新上传。");
    }
  });
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
    url: "/merchant/reportBef",//预下载盘点单
    data: detailed_Data,
    success: function (data) {
      if (data.status == "ERROR") {
        layer.msg(data.message);
        return;
      }
      var dataNum = data.pageInfo.total;
      if (dataNum > 0) {
        if (dataNum > 15000) {
          layer.alert("本次导出共有" + data.pageInfo.total + "条数据。超过15000条记录限制，请修改查询条件导出。");
        } else {
          layer.alert("本次导出共有" + data.pageInfo.total + "条数据。请<a onclick='view_exportData()' style='cursor: pointer' >点击下载</a>。");
        }
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
  form.attr("action", "/merchant/inventories/report");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
};
var getPanDianOrderStatus = function (pandian_num, storeId) {
  $.ajax({
    type: "POST",
    dataType: "JSON",
    data: {
      "pandian_num": pandian_num,
      "storeId": storeId,
    },
    url: "/merchant/getPanDianOrderStatus",
    success: function (data) {
      if (!(data.status == "OK" && (data.data == 0 || data.data == 100) && $("#isUpSite").val() == 1)) {//获取值且状态不为待上传和待下发状态
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
  if ($("#isUpSite").val() == 1 && ($("#orderStatus").val() == 0 || $("#orderStatus").val() == 100)) {
    $("#import_btn").removeAttr("disabled");
  } else {
    $("#import_btn").attr("disabled", "disabled");
  }
};
//强制关闭盘点单
var closeCheckList = function () {
  var num = "";
  var pandian_num = "";
  $.each($("#pandianView [name=pandian_num]"), function (c, row) {
    if ($(row).is(':checked')) {
      num += $(row).val() + "_" + $(row).parent().find("[name=storeId]").val() + ",";
    }
  });
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/merchant/closeTheTask",//关闭盘点单
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
          layer.alert("关闭盘点单成功。");
          getPandianList();
        }
      },
      error: function () {
        layer.alert("没有该权限或数据传输失败。");
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

