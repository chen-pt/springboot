/**
 * Created by DELL on 2017/9/21.
 */
$(function () {
  strageList();
  getAllStore();
  $(document).on('change', '#input_file_add', function () {
    var e = $(this).val();
    if (e) {
      $("#import_btn").attr("data-ok", "modal");
      $("#import_btn").attr("data-target", "#remainTime");
      file_size = $("#input_file_add")[0].files[0].size;
      if (file_size >= 15728640) {
        layer.alert("上传文件超过了限制(15兆)，请更改后重新上传");
        $("#import_btn").attr("disabled", "disabled");
      } else {
        $("#import_btn").removeAttr("disabled");
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
        layer.alert("上传文件超过了限制，请更改后重新上传");
        $("#import_btn").attr("disabled", "disabled");
      } else {
        $("#import_btn").removeAttr("disabled");
      }
    }
    $("#file_name_update").val(e);
  });
  //上传csv
  $(document).on('click', '#import_btn', (function () {
    var file_size = "";
    var formData = new FormData();
    if ($(".option_add").attr("checked") == "checked") {
      if (!$("#input_file_add").val()) {
        layer.alert("请先选择您的商品文件！");
        return;
      }
      file_size = $("#input_file_add")[0].files[0].size;
      formData.append('xls_file', $("#input_file_add")[0].files[0]);
      formData.append('detailTpl', 110);//erp库存excel
      formData.append("option", "add");//上传类型，update:覆盖型上传；add:新增型上传
    }
    if ($(".option_update").attr("checked") == "checked") {
      if (!$("#input_file_update").val()) {
        layer.alert("请先选择您的商品文件！");
        return;
      }
      file_size = $("#input_file_update")[0].files[0].size;
      formData.append('xls_file', $("#input_file_update")[0].files[0]);
      formData.append('detailTpl', 110);//erp库存excel
      formData.append("option", "update");//上传类型，update:覆盖型上传；add:新增型上传
    }
    $(this).attr("disabled", "disabled");
    window.open("/merchant/productList");
    timer(600);
    batchImportProduct(formData);
  }));

  if ($(".option_add").attr("checked") == "checked") {
    $(".option_update_div").find(".sui-btn").attr("disabled", true);
    $(".option_add_div").find(".sui-btn").attr("disabled", false);
  }
  $(".option_add").change(function () {
    $(".option_update_div").find(".sui-btn").attr("disabled", true);
    $(".option_add_div").find(".sui-btn").attr("disabled", false);
  });
  if ($(".option_update").attr("checked") == "checked") {
    $(".option_add_div").find(".sui-btn").attr("disabled", true);
    $(".option_update_div").find(".sui-btn").attr("disabled", false);
  }
  $(".option_update").change(function () {
    $(".option_add_div").find(".sui-btn").attr("disabled", true);
    $(".option_update_div").find(".sui-btn").attr("disabled", false);
  })
  //批量导放商品
  function batchImportProduct(formData) {
    $(".ajax_info").html("正在处理，请稍后.....");
    $(".ajax_info").css("color", "#000");
    $.ajax({
      url: "/merchant/goods/uploadstorage",
      type: "post",
      data: formData,
      contentType: false,
      processData: false,
      timeout: 0,
      success: function (data) {
        strageList();
        if (data.status) {
          $(".time-item").css("display", "none");
          var str = '';
          str = "处理完成，匹配成功<span style='color:#30b08f'> " + (data.result.marry_success_num ? data.result.marry_success_num : 0) + " </span>条" +
            "上传失败<span style='color:#30b08f'> " + (data.result.fail_num ? data.result.fail_num : 0) + " </span>条。";
          if (data.result.errfile_url) {
            str += '<a target="_blank" href="' + data.result.errfile_url + '">下载报表</a>'
          }
          if (data.errorNum == 0) {
            $(".ajax_info").css("color", "#30b08f");
          } else {
            $(".ajax_info").css("color", "red");
          }
          $(".ajax_info").html(str);
          $("#upload_right").removeClass("hide");
        } else {
          $(".time-item").css("display", "none");
          $(".ajax_info").html(data.result.msg);
          $("#upload_right").removeClass("hide");
        }
      },
      error: function (req, status) {
        if (status === 'timeout') {
          layer.confirm('处理超时');
        }
      }
    });
  };
});
var strageList = function () {
  var goods_name = $.trim($("#goods_name").val());
  var goods_code = $.trim($("#goods_code").val());
  var stores_number = $.trim($("#stores_number").val());
  var stores_name = $.trim($(".store_list").val());
  $("#goodstorage_table").html('');
  AlertLoading($("#goodstorage_table"));
  $.ajax({
    async: false,
    type: 'post',
    url: '/merchant/goods/storage',
    dataType: 'JSON',
    data: {
      "goods_name": goods_name,
      "goods_code": goods_code,
      "stores_number": stores_number,
      "stores_name": stores_name,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#goodstorage_table").empty();
      if (data.result.list.length > 0) {
        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;
        var tmpHtml = "";
        for (var i = 0; data.result.list.length > i; i++) {
          var storageOne = data.result.list[i];
          var sn = storageOne.in_stock ? storageOne.in_stock : 0;
          tmpHtml += "<tr><td>" + storageOne.id + "</td><td>" + storageOne.stores_number + "</td><td>" + storageOne.stores_name + "</td>" +
            "<td>" + storageOne.goods_code + "</td><td>" + storageOne.goods_name + "</td><td>" + storageOne.goods_category + "</td><td>"
            + storageOne.specif_cation + "</td><td>" + storageOne.goods_batch_number + "</td>" +
            "<td>" + sn + "</td><td>" + chargeTime(storageOne.update_time) + "</td></tr>";
        }
        $("#goodstorage_table").html(tmpHtml);
        $("#goodstorage_table").append("<tr><td colspan='10'><span class='pageinfo'></span></td></tr>");
        addpage(strageList);
      } else {
        $("#goodstorage_table").html("<tr><td colspan='10' class='center'>暂无数据</td></tr>");
        $("#pagediv").html("");
      }
    },
  })
}

/**
 * 获取所有的门店
 */
function getAllStore() {
  $.ajax({
    url: "/merchant/goods/storageStores",
    type: "POST",
    success: function (data) {
      if (data.result.length > 0) {
        for (var i = 0; i < data.result.length; i++) {
          var store = data.result[i];
          ArrNameList.push(store.stores_name);
        }
      }
    }
  })
}

function timer(intDiff) {//剩余时间秒数
  window.setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值       
    if (intDiff > 0) {
      day = Math.floor(intDiff / (60 * 60 * 24));
      hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    $('#minute_show').html('<s></s>' + minute + '分');
    $('#second_show').html('<s></s>' + second + '秒');
    intDiff--;
  }, 1000);
}
/**
 *时间格式转换
 * @param format timestamp类型时间格式
 * @returns {*}
 */
var chargeTime = function (timeStamp) {
  return new Date(parseFloat(timeStamp)).format("yyyy-MM-dd hh:mm:ss");
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



