(function() {
  'use strict';
  var defaultOptions = {
    pagesize: 100,
    okHidden: function () {

    },
    hostname: 'example',
    goods_ids: []
  };

  /**
   * 商品类目
   */
  function getProductCategory() {
    var datas = {};

    datas.cate_id = "";
    datas.cate_ishow = "";
    datas.del_tag = "";
    datas.parent_id = "";

    $("#lee_classify").empty();
    $("#much_classify").empty();

    var url = defaultOptions.hostname + "/admin/lib/product_category_get";

    $.post(url, datas, function (e) {

      var data = JSON.parse(e);

      if (data.status) {
        for (var i = 0, len = data.result.length; i < len; i++) {
          if (data.result[i].children) {
            $("#lee_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].cate_name + '</span></a><ul class="sui-dropdown-menu"><ul></li>');
            $("#much_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].cate_name + '</span></a><ul class="sui-dropdown-menu"><ul></li>');
            $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_code + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].cate_name + '</span></a><ul class="sui-dropdown-menu"><ul></li>');

            for (var j = 0, j_len = data.result[i].children.length; j < j_len; j++) {
              if (data.result[i].children[j].children) {
                $("#lee_classify>li:eq(" + i + ")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].children[j].cate_name + '</span></a><ul class="sui-dropdown-menu"></ul></li>');
                $("#much_classify>li:eq(" + i + ")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].children[j].cate_name + '</span></a><ul class="sui-dropdown-menu"></ul></li>');
                $("#lee_add_classify>li:eq(" + i + ")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_code + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].children[j].cate_name + '</span></a><ul class="sui-dropdown-menu"></ul></li>');

                for (var k = 0, k_len = data.result[i].children[j].children.length; k < k_len; k++) {
                  $("#lee_classify>li:eq(" + i + ")>ul>li:eq(" + j + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].children[k].cate_id + '"><span>' + data.result[i].children[j].children[k].cate_name + '</span></a></li>');
                  $("#much_classify>li:eq(" + i + ")>ul>li:eq(" + j + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].children[k].cate_id + '"><span>' + data.result[i].children[j].children[k].cate_name + '</span></a></li>');
                  $("#lee_add_classify>li:eq(" + i + ")>ul>li:eq(" + j + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].children[k].cate_code + '"><span>' + data.result[i].children[j].children[k].cate_name + '</span></a></li>');
                }
              } else {
                $("#lee_classify>li:eq(" + i + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '"><span>' + data.result[i].children[j].cate_name + '</span></a></li>');
                $("#much_classify>li:eq(" + i + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '"><span>' + data.result[i].children[j].cate_name + '</span></a></li>');
                $("#lee_add_classify>li:eq(" + i + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_code + '"><span>' + data.result[i].children[j].cate_name + '</span></a></li>');
              }
            }

          } else {
            $("#lee_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '"><span>' + data.result[i].cate_name + '</span></a></li>');
            $("#much_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '"><span>' + data.result[i].cate_name + '</span></a></li>');
            $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_code + '"><span>' + data.result[i].cate_name + '</span></a></li>');
          }
        }
      }

      $("#lee_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data=""><span>所有分类</span></a></li>');
      $("#much_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data=""><span>所有分类</span></a></li>');
    });
  }

  var init = function (options) {
    defaultOptions = $.extend(defaultOptions, options);
    getProductCategory();
    var goods_ids = defaultOptions.goods_ids;
    if ($.isArray(goods_ids) && goods_ids.length) {
      // 批量获取商品信息
      var url=defaultOptions.hostname+"/admin/bshop/product_batchGetProducts";
      var datas={};
      $(".select_goods_list").empty();
      datas.goods_ids=goods_ids.join(',');
      datas.per_page=10000;
      datas.current_page=1;
      $.post(url,datas,function(data){
        if (data.status) {
          for(var i in data.result){
            if (data.result.hasOwnProperty(i)) {
              var tmpData={};
              tmpData.goods_id=data.result[i].goods_id;
              tmpData.goods_title=data.result[i].goods_title;
              tmpData.shop_price=data.result[i].shop_price;
              //tmpData.disc_price=data.result[i].shop_price*discount/10;
              var tmpl = document.getElementById('fullsend_select_product_list_templete').innerHTML;
              //console.log(tmpData);
              var doTtmpl = doT.template(tmpl);
              $(".select_goods_list").append(doTtmpl(tmpData));
            }
          }
          $(".select_goods_total").html($(".select_goods_list .can_del_tr").length);
        } else {
          $(".select_goods_total").empty().append(0);
        }
      }, 'json');
    }
  };

  var list = function(pageno) {
    var datas={};
    datas.goods_status = 1;
     var goods_price_s = ($("input[name='goods_price_s']").val().trim() || 0) * 100;
    var goods_price_b = ($("input[name='goods_price_b']").val().trim() || 9999999) * 100;

    datas.shop_price = goods_price_s + "," + goods_price_b;
    datas.per_page = defaultOptions.pagesize;
    datas.current_page = pageno;
    datas.drug_name = $('[name=much_search_input]').val();
    datas.goods_code = $('[name=goods_code_disc]').val();
    datas.cate_id = $('input[name=much_classify]').val();

    var $goods_list = $(".goods_list").empty();
    var $much_pageinfo = $('.much_pageinfo').empty();

    $much_pageinfo.append("<span id='much_pageinfo'></span>");
    $goods_list.append("<tr><td colspan='2'>正在加载数据...</td></tr>");
    $('.select_all_goods_btn').attr("checked",false);

    $.ajax({
      'type': 'post',
      'url': defaultOptions.hostname + '/admin/bshop/product_list_ajax',
      'data': datas,
      'dataType': 'json'
    }).done(function (data) {
      var $goodsList = $(".goods_list").empty();
      $(".single_goods_list").empty();
      var tmpl = document.getElementById('much_product_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $goodsList.html(doTtmpl(data));
      $(".goods_total").html(data.result.total_items ? data.result.total_items : 0);
      if (data.status) {
          $('#much_pageinfo').pagination({
              pages: data.result.total_pages,
              styleClass: ['pagination-small'],
              showCtrl: true,
              displayPage: 6,
              currentPage: pageno,
              onSelect: function (num) {
                 list(num);
              }
          });
      }
    });
  };

  $(".putaway_select_goods_btn").click(function () {
    $(".goods_list input[type='checkbox']:checked").each(function () {
      var data = {};
      data.goods_id = $(this).parents("tr").find('[name="goods_id"]').val();
      data.goods_title = $(this).parents("tr").find('[name="goods_title"]').val();
      data.shop_price = $(this).parents("tr").find('[name="shop_price"]').val();
      //data.disc_price=$(this).parents("tr").find('[name="disc_price"]').val();
      if (!$('.select_goods_list [name="goods_id"][value="' + data.goods_id + '"]').val()) {
        var tmpl = document.getElementById('fullsend_select_product_list_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $(".select_goods_list").append(doTtmpl(data));
      }
    });

    var len = $(".select_goods_list tr").length;
    $(".select_goods_total").html();
    $("#check_num").html(len);
  });

  /**
   * 批量添加全选
   */
  $(".select_all_goods_btn").click(function () {
    var curStatus = $(this).attr("checked") ? true : false;
    $(".goods_list input[type='checkbox']").each(function () {
      $(this).attr("checked", curStatus);
      curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
    });
  });
  $(".putaway_select_goods_btn").click(function () {
    $(".goods_list input[type='checkbox']:checked").each(function () {
      var data = {};
      data.goods_id = $(this).parents("tr").find('[name="goods_id"]').val();
      data.goods_title = $(this).parents("tr").find('[name="goods_title"]').val();
      data.shop_price = $(this).parents("tr").find('[name="shop_price"]').val();
      //data.disc_price=$(this).parents("tr").find('[name="disc_price"]').val();
      if (!$('.select_goods_list [name="goods_id"][value="' + data.goods_id + '"]').val()) {
        var tmpl = document.getElementById('fullsend_select_product_list_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $(".select_goods_list").append(doTtmpl(data));
      }
    });
    $(".select_goods_total").html($(".select_goods_list tr").length);
    $("#check_num").html($(".select_goods_list tr").length);

  });

  $(".goods_list input[type='checkbox']").on("click", function () {
    if (!$(this).attr("checked")) {
      $(".select_all_goods_btn").attr("checked", false);
      $(".select_all_goods_btn").parent().removeClass("checked");
    } else if ($(".goods_list input[type='checkbox']").length == $(".goods_list input[type='checkbox']:checked").length) {
      $(".select_all_goods_btn").attr("checked", true);
      $(".select_all_goods_btn").parent().addClass("checked");

    }
  });

  /**
   * 批量移除全选
   */
  $(".unselect_all_goods_btn").click(function () {
    var curStatus = $(this).attr("checked") ? true : false;
    $(".select_goods_list input[type='checkbox']").each(function () {
      $(this).attr("checked", curStatus);
      curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
    });
  });
  $(".putaway_unselect_goods_btn").click(function () {
    $(".select_goods_list input[type='checkbox']:checked").each(function () {
      $(this).parents(".can_del_tr").remove();
    });
    $(".select_goods_total").html($(".select_goods_list tr").length);
    $("#check_num").html($(".select_goods_list tr").length);
  });


  $(".select_goods_list input[type='checkbox']").on("click", function () {
    if (!$(this).attr("checked")) {
      $(".unselect_all_goods_btn").attr("checked", false);
      $(".unselect_all_goods_btn").parent().removeClass("checked");
    } else if ($(".select_goods_list input[type='checkbox']").length == $(".select_goods_list input[type='checkbox']:checked").length) {
      $(".unselect_all_goods_btn").attr("checked", true);
      $(".unselect_all_goods_btn").parent().addClass("checked");

    }
  });

  /**
   * 不参加
   */
  $(".select_goods_btn").on("click", function () {
    var data = {};
    data.goods_id = $(this).parent().find('[name="goods_id"]').val();
    data.goods_title = $(this).parent().find('[name="goods_title"]').val();
    data.shop_price = $(this).parent().find('[name="shop_price"]').val();
    //data.disc_price=$(this).parent().find('[name="disc_price"]').val();
    if (!$('.select_goods_list [name="goods_id"][value="' + data.goods_id + '"]').val()) {
      var tmpl = document.getElementById('fullsend_select_product_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_goods_list").append(doTtmpl(data));
      var len = $(".select_goods_list tr").length;
      $(".select_goods_total").html();
      $("#check_num").html(len);
    } else {
      alert("该商品已被选择！");
    }
  });
  /**
   * 移除
   */
  $(".unselect_goods_btn").on("click", function () {
    $(this).parents(".can_del_tr").remove();
    var len = $(".select_goods_list tr").length;
    $(".select_goods_total").html(len);
    $("#check_num").html(len);
  });

  // queren
  $(".select-goods-ok").click(function(){
      var goods_ids = [];
      $(".select_goods_list input[name=goods_id]").each(function(){
          goods_ids.push($(this).val());
      });

      if(goods_ids.length){
          $("#much_select_goods").modal("hide");
          defaultOptions.okHidden(goods_ids);
      }else{
          alert('请选择至少一个商品！');
      }
  });

  // 搜索
  $('.search_much_goods_btn').on('click', function () {
    list(1);
  });

  var selGoodsComponent = {
    'init': init,
    'list': list
  };

  if (typeof define == 'function') {
    define(function() {
      return selGoodsComponent;
    });
  } else {
    window.selGoodsComponent = selGoodsComponent;
  }
})();
