$(document).ready(function () {
  getgoodsList();
  $(".select_all_btn").click(function () {
    if ($(this).prop('checked')) {
      $('#price-list').find('[type="checkbox"]').prop('checked', true);
      // $('table').find('[type="checkbox"]').parent().addClass('checked');
    } else {
      $('#price-list').find('[type="checkbox"]').prop('checked', false);
      // $('table').find('[type="checkbox"]').parent().removeClass('checked');
    }
  });
  $('#price-list').find('[type="checkbox"]').click(function () {
    var long = $('#price-list').find('[type="checkbox"]').length;
    if ($('#price-list').find('[type="checkbox"]:checked').length == long) {
      $(".select_all_btn").prop('checked', true);
    } else {
      $(".select_all_btn").prop('checked', false);
    }
  });
  //价格提交修改
  $(document).on('click', '.btn-store-price', function () {
    var delTag = $(this).parents("tr").find("input[name='delTag']").val();
    if (delTag == 1) {//禁用状态
      layer.alert("该价格已禁用，不能进行修改。");
    } else {
      var goods_id = $(this).parents("tr").find("input[name='goods_id']").val();
      var store_price = $(this).parents("tr").find("td:eq(3) span").html();
      var store_price_title = $(this).parents("tr").find(".img-title").html();
      var market_price = $(this).parents("tr").find("td:eq(4)").html();
      $("#store_price_title").html(store_price_title);
      $("#store_price").val(store_price);
      $("#goods_id").val(goods_id);
      $("#market_price").html(market_price);
      $('#Revise-modal').modal('show');
    }
  });
  //价格刷新
  $(document).on('click', '.btn-refresh', function () {
    var delTag = $(this).parents("tr").find("input[name='delTag']").val();
    if (delTag == 1) {//禁用状态
      layer.alert("该价格已禁用，不能进行刷新。");
    } else {
      var goods_id = $(this).parents("tr").find("input[name='goods_id']").val();
      refresh(goods_id);
    }
  });
});
function getgoodsList() {
  var datas = {};
  var classify = $("input[name='classify']").val();
  if (classify) datas.userCateid = classify;

  // var classify = $("input[name='classify']").val();
  // datas.userCateid = classify > 0 ? classify : "";

  datas.drugName = $("#drug_name").val().trim();
  datas.approvalNnumber = $("#approval_number").val().trim();

  datas.currentPage = pagination_page_no;
  datas.pageSize = pagination_pagesize;

  // $("#price-list").html("<tr><td colspan='8' style='text-align: center'>数据正在加载中。。。</td></tr>");
  function AlertLoading(dom) {
    dom.parent().css('position', 'relative');
    //dom给需要的标签内 加 效果
    var load =
      '<div class="sk-circle" style="position: absolute; top: 50%;left: 50%;">' +
      '<div class="sk-circle1 sk-child"></div>' +
      '<div class="sk-circle2 sk-child"></div>' +
      '<div class="sk-circle3 sk-child"></div>' +
      '<div class="sk-circle4 sk-child"></div>' +
      '<div class="sk-circle5 sk-child"></div>' +
      '<div class="sk-circle6 sk-child"></div>' +
      '<div class="sk-circle7 sk-child"></div>' +
      '<div class="sk-circle8 sk-child"></div>' +
      '<div class="sk-circle9 sk-child"></div>' +
      '<div class="sk-circle10 sk-child"></div>' +
      '<div class="sk-circle11 sk-child"></div>' +
      '<div class="sk-circle12 sk-child"></div>' +
      '</div>';
    dom.append(load);   //loading追加到tbody之后
  }

  AlertLoading($("#price-list"));
  $.ajax({
    type: 'POST',
    url: "./findByGoodsList",
    data: datas,
    dataType: 'json',
    success: function (data) {
      $("#price-list").html('');
      $("#price-list").empty();
      if (data.type != "error") {
        if (data.goodsPage.list.length > 0) {
          var tmpHtml = "";
          for (var i = 0; i < data.goodsPage.list.length; i++) {
            var goods = data.goodsPage.list[i];
            var updateTime = (new Date(parseFloat(goods.updateTime.toString()))).format("yyyy-MM-dd hh:mm:ss");
            var storeUpdateTime;
            if (goods.storeUpdateTime) {
              storeUpdateTime = (new Date(parseFloat(JSON.stringify(goods.storeUpdateTime)))).format("yyyy-MM-dd hh:mm:ss");
            } else {
              storeUpdateTime = "";
            }
            tmpHtml += "<tr>" +
              "<td><input type='checkbox' name='goodsId' value='" + goods.goodsId + "'></td>" +
              "<td><input type='hidden' name='goods_id' value='" + goods.goodsId + "'><input type='hidden' name='delTag' value='" + goods.delTag + "'> <div class='media'> " +
              "<ul class='unstyled media-body' style='word-wrap: break-word;width: 218px;'> <li class='img-title'> " +
              goods.drugName + "</li> <li>" + goods.specifCation + "</li> <li>商品编码： " + goods.goodsCode + "</li> </ul> </div> </td>" +
              " <td> " +
              "<div style='word-wrap: break-word;width: 128px;'>" + goods.approvalNumber + "</div> </td> <td><span>" + (goods.discountPrice ? (goods.discountPrice / 100).toFixed(2) : '') + "</span></td>" +
              " <td>" + (goods.shopPrice = (goods.shopPrice / 100).toFixed(2) ? (goods.shopPrice / 100).toFixed(2) : '') + "</td> <td> " + (goods.goodsStatus == 1 ? "上架" : "下架") + "</td> " +
              //"<td>"+(goods.updateTime?DateFormat(goods.updateTime,"yyyy-MM-dd HH:mm:ss"):'')+"</td> <td> "+(goods.storeUpdateTime?DateFormat(goods.storeUpdateTime,"yyyy-MM-dd HH:mm:ss"):'')+" </td> " +
              "<td>" + (updateTime) + "</td> <td> " + (storeUpdateTime) + " </td> " +
              "<td class='center'> <ul class='unstyled'> " +
              "<li><a class='sui-btn btn-small btn-primary btn-store-price' href='javascript:;'>修改</a>" +
              "</li><li><a class='sui-btn btn-small btn-primary btn-refresh' href='javascript:void(0);' onclick='refresh(" + JSON.stringify(goods) + ")'>刷新</a></li></ul></td></tr>";
          }
          tmpHtml += "<tr><td colspan='8' style='text-align: right;border-bottom:0 '><span class='pageinfo'></span></td></tr>";
        } else {
          var tmpHtml = "<tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>";
        }
      } else {
        $('.control-group').remove();
        $('.order-list').remove();
        $('.order-active').remove();
        $("#isprice").html("你没有该权限");
      }
      $("#price-list").html(tmpHtml);
      pagination_pages = data.goodsPage.pages;
      pagination_totals = data.goodsPage.total;
      addpage(getgoodsList);

      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");
      //读取delTag字段并判断按钮的状态
      $('#price-list input[name="delTag"]').each(function () {
        if ($(this).val() == 1) {
          $(this).parents("tr").find(".btn-primary").css("opacity", "0.5");
        }
      });
    },
    error: function () {
      console.log("error ....");
    }
  });
}


/**
 * 日期格式化
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
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

Date.prototype.toLocaleString = function () {
  return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};
function store_price_btn() { //author: meizz
  var postdata = {};
  postdata.goodsId = $('#goods_id').val();
  postdata.goodsPrice = ($('#store_price').val() * 10 * 10).toFixed(0);
  var regex = new RegExp("^[0-9]+([.]{1}[0-9]{1,2}){0,1}$");
  if (0 == postdata.goodsPrice || !regex.test($('#store_price').val()) || postdata.goodsPrice > 10000000) {
    layer.msg('提交失败！');
    return;
  }
  if ($('#checkErp').is(":checked")) {
    postdata.erpPrice = ($('#store_price').val() * 10 * 10).toFixed(0);
  }
  $.ajax({
    type: 'POST',
    data: postdata,
    url: './updateYBPrice',
    dataType: 'json',
    success: function (e) {
      if (e.msg == 'success') {
        layer.msg('提交成功!', {
          'time': 500, 'end': function () {
            window.location.reload();
          }
        });
      } else {
        $.alert({'title': '温馨提示!', 'body': '提交失败！'});
      }
    }
  });
}


function refresh(goods) {
  var postdata = {};
  postdata.goodsId = goods.goodsId;
  postdata.isUpdate = 1;
  if (goods.goodsPrice) {
    $.ajax({
      type: 'POST',
      data: postdata,
      url: './refreshYBTime',
      dataType: 'json',
      success: function (e) {
        if (e.msg == 'success') {
          layer.msg('刷新成功!', {
            'time': 500, 'end': function () {
              window.location.reload();
            }
          });
        } else {
          $.alert({'title': '温馨提示!', 'body': '刷新失败！'});
        }
      }
    });
  }
  //未修改不进行刷新
  // else {
  //   layer.msg('刷新成功!', {
  //     'time': 500, 'end': function () {
  //       window.location.reload();
  //     }
  //   });
  // }

}
/**
 * 启用，禁用按钮点击事件
 * @param num
 */
function clickBtnStatus(num) {
  var ids = "";
  var i = 0;
  $('input[name="goodsId"]:checked').each(function () {
    i++;
    ids += $(this).val() + ",";
  });
  var str = "";
  if (i > 0) {//选择项至少大于1项
    if (num == 0) {
      str = "你确定要启动这" + i + "个商品门店价格吗？";
    } else {
      str = "禁用后门店定价会被清除为空，只能读取总部定价，同时需要启动才能编辑价格。请确认是否禁用？";
    }
    $("#forbidPrice #delFag").val(num);
    $("#forbidPrice .text").text(str);
    $("#forbidPrice").removeClass("hide");
    // $("#forbidPrice").addClass("show");
  } else {
    layer.msg("请先选择商品");
  }
}
function btnForbidPrice() {
  var num = $("#forbidPrice #delFag").val();
  var ids = "";
  $('input[name="goodsId"]:checked').each(function () {
    ids += $(this).val() + ",";
  });
  $.ajax({
      Type: "POST",
      url: "/store/updateStorePriceFlag",
      data: {
        "goodsIds": ids,
        "delFlag": num
      },
      success: function (data) {
        cancelModal();
        getgoodsList();
      }
    }
  )
}
//取消提示框
function cancelModal() {
  $("#forbidPrice").removeClass("show");
  $("#forbidPrice").addClass("hide");
}

