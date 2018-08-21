/**
 * Created by DELL on 2017/11/30.
 */
$(function () {
  getPandianList(0, 15);
  //详情页面点击重新加载页面
  /*  $(document).on('change', '#detailed [name=profitOrLossStatu]', function () {
   console.log("当前选中的状态是" + $(this).val());
   getDetail_pandian($("#detailed [name=detail_pandian_num]").val(), $("#detailed [name=detail_storeId]").val(), $(this).val());
   });*/
});
//盘点表列表数据渲染
var getPandianList = function (pageNum, pageSize) {//获取各个参数
  var pandian_num = $("#detailed [name=detail_pandian_num]").val();//盘点单号
  var storeId = $("#detailed [name=detail_storeId]").val();//获取门店id
  console.log("详情页:盘点单号:[" + pandian_num + "],门店ID:[" + storeId + "]");
  $.ajax({
      async: false,
      type: 'post',
      url: '/merchant/pandianList',
      dataType: 'JSON',
      data: {
        "pandian_num": pandian_num,
        "storeId": storeId,
        "profitOrLossStatu": "",
        "status": "",
        "createTime": "",
        "endTime": "",
        "pageNum": pageNum,
        "pageSize": pageSize,
      },
      success: function (data) {
        if (data.status == 1) {
          getPanDianDetail(data.data.list[0].pandianOrderId, data.data.list[0].pandian_num, data.data.list[0].storeId,
            data.data.list[0].storeName, data.data.list[0].storesNumber, chargeTime(data.data.list[0].createTime),
            data.data.list[0].pandianType, data.data.list[0].actualStoreTotal, data.data.list[0].statu);
        } else {
          getPanDianDetail(data.data.list[0].pandianOrderId, data.data.list[0].pandian_num, data.data.list[0].storeId,
            data.data.list[0].storeName, data.data.list[0].storesNumber, chargeTime(data.data.list[0].createTime),
            data.data.list[0].pandianType, data.data.list[0].actualStoreTotal, data.data.list[0].statu);
        }
      },
      error: function () {
        console.log("error...");
      }
    }
  );
};

/**
 * 查看盘点详情表
 */
var getPanDianDetail = function (pandianOrderId, pandian_num, storeId, storeName, storeNumber, createTime, pandianType,
                                 actualStoreTotal, statu) {
  getPanDianOrderStatus(pandian_num, storeId);
  $("#detailed [name=detail_pandianOrderId]").val(pandianOrderId);
  $("#detailed [name=detail_storeNumber]").val(storeNumber);
  $("#detailed [name=pandian_num]").attr("placeholder", pandian_num);
  $("#detailed .storeName").html(storeName);
  $("#detailed .storeNumber").html(storeNumber);
  $("#detailed [name=create_time]").attr("placeholder", createTime);
  $("#detailed [name=actualStoreTotal]").attr("placeholder", actualStoreTotal == "null" ? "" : actualStoreTotal);
  $("#detailed [name=statu]").attr("placeholder", statu);
  $("#detailed [name=pandianType]").attr("placeholder", pandianType);
  getDetail_pandian($("#detailed [name=detail_pandian_num]").val(), $("#detailed [name=detail_storeId]").val(),
    $("#detailed [name=profitOrLossStatu]").val());
}
//点击详情页面的搜索按钮
var selectDetailClick = function () {
  var pandian_num = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  var profitOrLossStatu = $('#detailed [name=profitOrLossStatu]').val();
  getDetail_pandian(pandian_num, storeId, profitOrLossStatu);
}


//查询盘点详情
var getDetail_pandian = function (pandian_num, storeId, profitOrLossStatu) {
  var drug_name = $("#detailed [name=goodsName]").val();
  var goods_code = $("#detailed [name=goodsCode]").val();
  var goodsCompany = $("#detailed [name=goodsCompany]").val();
  var inventory_confirm = $("#detailed [name=inventoryConfirm]").val();
  console.info("商户后台盘点表盘点详情搜索详情:盘点单号:" + pandian_num + ",门店id:" + storeId + "," +
    "盘点状态:" + profitOrLossStatu + ",药品名称:" + drug_name + ",商品编码:" + goods_code);
  $("#pandianDetail").html('');
  AlertLoading($("#pandianDetail"));
  $.ajax({
    async: false,
    type: 'post',
    url: '/merchant/pandianDetail',
    dataType: 'JSON',
    data: {
      "pandian_num": pandian_num,
      "storeId": storeId,
      "profitOrLossStatu": profitOrLossStatu,
      "drug_name": drug_name,
      "goods_code": goods_code,
      "goods_company": goodsCompany,
      "inventory_confirm": inventory_confirm,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#pandianDetail").empty();
      if (data.status == 1) {
        pagination_pages = data.data.pages;
        pagination_totals = data.data.total;
        if (data.data.pageNum == 0) {
          data.data.pageNum = 1;
        }
        var tmpl = document.getElementById('pandianDetailTemplate').innerHTML;
        var doTtmpl = doT.template(tmpl);
        var tr = doTtmpl(data.data);
        tr += " <tr><td colspan='17'><span class ='detail_pageinfo' style='float: right'></span></td></tr>";
        $("#pandianDetail").append(tr);
        $("#pagediv").html("<span class='pageinfo'></span>");
        $.each($("#pandianDetail .confirm_status input"), function (i, item) {
          console.log(item.value);
          if (item.value == 1) {
            $(item).parent().css("background-color", "green");
          } else if (item.value == 0 && (!$(item).parent().parent().children(".checker").html() == "")) {
            $(item).parent().css("background-color", "red");
          }
        });
      } else {
        $("#pandianDetail").html("<tr><td colspan='10' class='center'>暂无数据</td></tr>");
      }
      addpage(selectDetailClick);
    }
    ,
    error: function () {
      console.log("error...");
    }
    ,
  })
  ;
};

//详情页面下发盘点单
var detail_start2Task = function () {
  var pandianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  console.log("下发盘点单单号是:" + pandianNum + ",门店id:" + storeId);
  var num = pandianNum + "_" + storeId;
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
          layer.alert("盘点单下发成功");
          getPandianList(0, 15);
        }
      },
      error: function () {
        layer.alert("传输失败，或你没有该权限。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再下发盘点任务。");
  }
}

//详情页面点击复盘
var detail_start2Repeat = function () {
  var pandianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  console.log("复盘盘点单单号是:" + pandianNum + ",门店id:" + storeId);
  var num = pandianNum + "_" + storeId;
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/merchant/analyseTheTask",//复盘盘点任务
      data: {
        "nums": num,
        "pandianType": "500"
      },
      success: function (data) {
        if (data.status == "ERROR") {
          layer.alert(data.message);
        } else if (data.status == "600") {
          layer.alert(data.message);
        } else if (data.code == "fail") {//盘点单复盘失败
          layer.alert(data.data[0].errorMessage);
        } else if (data.code == "success") {
          layer.alert("盘点单复盘成功");
          getPandianList(0, 15);
        }
      },
      error: function () {
        layer.alert("传输失败，或你没有该权限。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再复盘盘点任务。");
  }
}
//详情页面点击监盘
var detail_start2Confirm = function () {
  var pandianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  console.log("监盘盘点单单号是:" + pandianNum + ",门店id:" + storeId);
  var num = pandianNum + "_" + storeId;
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/merchant/inspectDishTask",//监盘
      data: {
        "nums": num,
        "pandianType": "300"
      },
      success: function (data) {
        if (data.status == "ERROR") {
          layer.alert(data.message);
        } else if (data.status == "600") {
          layer.alert(data.message);
        } else if (data.code == "fail") {//盘点单监盘失败
          layer.alert(data.data[0].errorMessage);
        } else if (data.code == "success") {
          alert("盘点单监盘成功");
          getPandianList(0, 15);
        }
      },
      error: function () {
        layer.alert("没有该权限或者传输失败。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再监盘盘点任务。");
  }
}
//详情页面点击审核
var detail_start2Audit = function () {
  var pandianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  console.log("审核盘点单单号是:" + pandianNum + ",门店id:" + storeId);
  var num = pandianNum + "_" + storeId;
  if (num) {//用户选中了对应的盘点单号
    $.ajax({
      async: false,
      type: "POST",
      dataType: "JSON",
      url: "/merchant/reviewTheTask",//审核盘点任务
      data: {
        "nums": num,
        "pandianType": "400"
      },
      success: function (data) {
        if (data.status == "ERROR") {
          layer.alert(data.message);
        } else if (data.status == "600") {
          layer.alert(data.message);
        } else if (data.code == "fail") {//盘点单复盘失败
          layer.alert(data.data[0].errorMessage);
        } else if (data.code == "success") {
          layer.alert("盘点单复审核成功");
          getPandianList(0, 15);
        }
      },
      error: function () {
        layer.alert("传输失败，或你没有该权限。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再审核盘点任务。");
  }
}
//详情页面导出盘点报表
var detail_export = function () {
  var detailed_Data = new Object();
  detailed_Data.id = $("#detailed [name=detail_pandianOrderId]").val();
  detailed_Data.num = $("#detailed [name=detail_pandian_num]").val();
  detailed_Data.storeIds = $("#detailed [name=detail_storeId]").val();
  detailed_Data.sNum = $("#detailed [name=detail_storeNumber]").val();
  detailed_Data.option = 0;
  $.ajax({
    async: false,
    type: "POST",
    dataType: "JSON",
    url: "/merchant/reportBef",//审核盘点任务
    data: detailed_Data,
    success: function (data) {
      if (data.status == "ERROR") {
        layer.msg(data.message);
        return;
      }
      var dataNum = data.pageInfo.total;
      if (dataNum > 0) {
        if (dataNum > 15000) {
          layer.alert("本次导出共有" + data.pageInfo.total + "条数据。超过15000条记录限制，请修改查询条件导出");
        } else {
          layer.alert("本次导出共有" + data.pageInfo.total + "条数据。请<a onclick='detail_exportData()' style='cursor: pointer' >点击下载</a>");
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
//详情页导出报表
var detail_exportData = function () {
  var detailed_Data = new Object();
  detailed_Data.id = $("#detailed [name=detail_pandianOrderId]").val();
  detailed_Data.num = $("#detailed [name=detail_pandian_num]").val();
  detailed_Data.storeIds = $("#detailed [name=detail_storeId]").val();
  detailed_Data.sNum = $("#detailed [name=detail_storeNumber]").val();
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
//强制关闭盘点单
var closeCheckList = function () {
  var pandianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  console.log("关闭盘点单单号是:" + pandianNum + ",门店id:" + storeId);
  var num = pandianNum + "_" + storeId;
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
          layer.alert("关闭盘点单成功");
          getPandianList(0, 15);
        }
      },
      error: function () {
        layer.alert("传输失败，或你没有该权限。");
      }
    });
  } else {
    layer.alert("未选中盘点单号,请选择盘点单号后再关闭盘点表。");
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
//更新盘点单下某一门店的最新商品数据
var erpdata_get = function () {
  var orderId = $("#detailed [name=detail_pandianOrderId]").val();
  var panDianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  var unit_no = $("#detailed [name=detail_storeNumber]").val();
  $.ajax({
    async: false,
    type: "POST",
    dataType: "JSON",
    url: "/merchant/erpData_get",//更新盘点数据
    data: {
      "panDianNum": panDianNum,
      "storeId": storeId,
      "unit_no": unit_no
    },
    success: function (data) {
      if (data.code == -1) {
        show1(data.msg);
      } else if (data.code == 100 || data.code == 400) {//未找到对应的任务号
        show1(data.msg);
      } else {
        if (pagination_pages > 0) {
          $("#cover_erpData").modal("show");
        } else {
          syncErpPandianData(orderId, panDianNum, storeId, unit_no);
        }
      }
    },
    error: function () {
      alert(0);
    }
  });
};
//同步门店盘点数据
function syncErpPandianData(orderId, panDianNum, storeId, unit_no) {
  $("#erpdata_get").css("background-color", "gray");
  $("#erpdata_get").attr("onclick", "return false");
  $.ajax({
    async: false,
    type: "POST",
    dataType: "JSON",
    url: "/merchant/erp_initPanDianData",//更新盘点数据
    data: {
      "orderId": orderId,
      "panDianNum": panDianNum,
      "storeId": storeId,
      "unit_no": unit_no
    },
    success: function (data) {
      if (data.status == 'OK') {
        alert("读取成功，可以下发盘点");
        window.location.replace(window.location.href);
      } else {
        show1(data.message);
      }

    }
  });

}

function show1(content) {
  layer.open({
    type: 0,
    title: false,
    area: "auto",
    time: 5000, //2秒后自动关闭
    content: content,
  });
}

function cover_confirmOK() {
  var orderId = $("#detailed [name=detail_pandianOrderId]").val();
  var panDianNum = $("#detailed [name=detail_pandian_num]").val();
  var storeId = $("#detailed [name=detail_storeId]").val();
  var unit_no = $("#detailed [name=detail_storeNumber]").val();
  syncErpPandianData(orderId, panDianNum, storeId, unit_no);
}

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
      if (!(data.status == "OK" && (data.data == 0 || data.data == 100))) {//获取值且状态不为待上传和待下发状态
        $("#erpdata_get").css("background-color", "gray");
        $("#erpdata_get").attr("onclick", "return false");
      }
    },
    error: function () {

    }
  });
};

