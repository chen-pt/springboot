/**
 * doT 初始化
 */
var doTinit = function () {
  //配置定界符
  doT.templateSettings = {
    evaluate: /\[\%([\s\S]+?)\%\]/g,
    interpolate: /\[\%=([\s\S]+?)\%\]/g,
    encode: /\[\%!([\s\S]+?)\%\]/g,
    use: /\[\%#([\s\S]+?)\%\]/g,
    define: /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
    conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
    iterate: /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
    varname: 'it',
    strip: true,
    append: true,
    selfcontained: false
  };
}();

/**不包邮地区弹框内的操作***/
/**
 * 全选
 */
$(".select_all_city").live("click", function () {
  $("#free_ragion_list input[type='checkbox']").each(function () {
    $(this).attr("checked", true);
  });
});
/**
 * 反选
 */
$(".unselect_all_city").live("click", function () {
  $("#free_ragion_list input[type='checkbox']").each(function () {
    $(this).attr("checked", false);
  });
});
/**
 * 华*选中时的操作
 */
$('[top="1"]').live("change", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(this).parent().find("input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
  });
})
/**
 * 具体地区选中时的操作
 */
$('[top="2"]').live("change", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  if (curStatus) {
    if ($(this).parents("div").find("label>input").length == $(this).parents("div").find("label>input:checked").length) {
      $(this).parents("div").children("input").attr("checked", true);
    }
  } else {
    $(this).parents("div").children("input").attr("checked", false);
  }
})
/**
 * 确定后的操作
 */
$(".select_city_ok").click(function () {
  var cityName = "";
  var cityId = "";
  $("#free_ragion_list input[type='checkbox'][top='2']").each(function () {
    if ($(this).attr("checked")) {
      cityName += $(this).val() + ",";
      cityId += $(this).attr("id") + ",";
    }
  });
  cityName = cityName.substr(0, cityName.length - 1);
  cityId = cityId.substr(0, cityId.length - 1);
  $('[name="free_city_area"]').val(cityName);
  $('[name="free_city_area_id"]').val(cityId);
});
/**
 * 编辑页面弹出框时需要选择哪些地区
 */
$(".set_no_free_area").click(function () {
  var areaId = $('input[name="free_city_area_id"]').val();
  var areaIdArr = areaId.split(",");
  for (var i in areaIdArr) {
    $("#free_ragion_list input[id='" + areaIdArr[i] + "']").attr("checked", true);
  }
  $("#free_ragion_list>div").each(function () {
    if ($(this).find("label>input").length == $(this).find("label>input:checked").length) {
      $(this).children("input").attr("checked", true);
    }
  });
});

/**指定商品弹框的操作**/
/**
 * 批量添加全选
 */
$(".select_all_goods_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".goods_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
$(".putaway_select_goods_btn").live("click", function () {
  $(".goods_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.goods_id = $(this).parents("tr").find('[name="goods_id"]').val();
    data.goods_title = $(this).parents("tr").find('[name="goods_title"]').val();
    data.goods_weight = $(this).parents("tr").find('[name="goods_weight"]').val();
    if (!$('.select_goods_list [name="goods_id"][value="' + data.goods_id + '"]').val()) {
      var tmpl = document.getElementById('select_product_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_goods_list").append(doTtmpl(data));
    }
  });
  $(".select_goods_total").html($(".select_goods_list tr").length);
});

$(".goods_list input[type='checkbox']").live("click", function () {
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
$(".unselect_all_goods_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".select_goods_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
$(".putaway_unselect_goods_btn").live("click", function () {
  $(".select_goods_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_goods_total").html($(".select_goods_list tr").length);
});


$(".select_goods_list input[type='checkbox']").live("click", function () {
  if (!$(this).attr("checked")) {
    $(".unselect_all_goods_btn").attr("checked", false);
    $(".unselect_all_goods_btn").parent().removeClass("checked");
  } else if ($(".select_goods_list input[type='checkbox']").length == $(".select_goods_list input[type='checkbox']:checked").length) {
    $(".unselect_all_goods_btn").attr("checked", true);
    $(".unselect_all_goods_btn").parent().addClass("checked");

  }
});

/**选择分类**/
$("#lee_add_classify a").live("click", function () {
  $("#lee_add_classify_a").html('<i class="caret"></i>' + ($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>', "")));
  $("input[name='classify']").val($(this).attr("data"));
  freepost.get_product_list();
});
$(".search_goods_btn").click(function () {
  freepost.get_product_list();
});
/**
 * 不参加
 */
$(".select_goods_btn").live("click", function () {
  var data = {};
  data.goods_id = $(this).parent().find('[name="goods_id"]').val();
  data.goods_title = $(this).parent().find('[name="goods_title"]').val();
  data.goods_weight = $(this).parent().find('[name="goods_weight"]').val();
  if (!$('.select_goods_list [name="goods_id"][value="' + data.goods_id + '"]').val()) {
    var tmpl = document.getElementById('select_product_list_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".select_goods_list").append(doTtmpl(data));
    $(".select_goods_total").html($(".select_goods_list tr").length);
  } else {
    alert("该商品已被选择！");
  }
});
/**
 * 移除
 */
$(".unselect_goods_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  $(".select_goods_total").html($(".select_goods_list tr").length);
});

$("#lee_add_classify a").live("click", function () {
  $("#lee_add_classify_a").html('<i class="caret"></i>' + ($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>', "")));
  $("input[name='classify']").val($(this).attr("data"));
});

/*会员日*/
$('.single_day').live("click", function () {
  $(".single").attr("checked", true);
  $(".single").parent().addClass("checked");
  $(".double").attr("checked", false);
  $(".double").parent().removeClass("checked");
});
$('.double_day').live("click", function () {
  $(".single").attr("checked", false);
  $(".single").parent().removeClass("checked");
  $(".double").attr("checked", true);
  $(".double").parent().addClass("checked");
});
$('.optional_day').live("click", function () {
  $(".single").attr("checked", false);
  $(".single").parent().removeClass("checked");
  $(".double").attr("checked", false);
  $(".double").parent().removeClass("checked");
});


/**
 * 指定门店
 */
$(".select_stores_btn").live("click", function () {
  var data = {};
  data.id = $(this).parents("tr").find('[name="id"]').val();
  data.name = $(this).parents("tr").find('[name="name"]').val();
  data.service_support = $(this).parents("tr").find('[name="service_support"]').val();
  data.stores_number = $(this).parents("tr").find('[name="stores_number"]').val();

  if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {

    var tmpl = document.getElementById('select_store_list_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".select_stores_list").append(doTtmpl(data));
    $(".select_stores_total").html($(".select_stores_list tr").length);
  } else {
    alert("该门店已被选择！");
  }
});
/**
 * 批量添加全选
 */
$(".select_all_stores_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;

  $(".stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_select_stores_btn").live("click", function () {
  $(".stores_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.stores_number = $(this).parents("tr").find('[name="stores_number"]').val();
    data.id = $(this).parents("tr").find('[name="id"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.service_support = $(this).parents("tr").find('[name="service_support"]').val();

    if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
      var tmpl = document.getElementById('select_store_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);

      $(".select_stores_list").append(doTtmpl(data));
    }
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
});

$(".stores_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".select_all_stores_btn").attr("checked", false);
    $(".select_all_stores_btn").parent().removeClass("checked");

  } else if ($(".stores_list input[type='checkbox']").length == $(".stores_list input[type='checkbox']:checked").length) {

    $(".select_all_stores_btn").attr("checked", true);
    $(".select_all_stores_btn").parent().addClass("checked");

  }
});

$(".unselect_stores_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  $(".select_stores_total").html($(".select_stores_list tr").length);
});

/**
 * 批量移除全选
 */
$(".unselect_all_stores_btn").live("click", function () {

  var curStatus = $(this).attr("checked") ? true : false;

  $(".select_stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_unselect_stores_btn").live("click", function () {
  $(".select_stores_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
});

$(".select_stores_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".unselect_all_stores_btn").attr("checked", false);
    $(".unselect_all_stores_btn").parent().removeClass("checked");

  } else if ($(".select_stores_list input[type='checkbox']").length == $(".select_stores_list input[type='checkbox']:checked").length) {

    $(".unselect_all_stores_btn").attr("checked", true);
    $(".unselect_all_stores_btn").parent().addClass("checked");

  }
});
/**
 * 指定店员
 */
$(".select_clerk_btn").live("click", function () {
  var data = {};
  data.id = $(this).parents("tr").find('[name="id"]').val();
  data.name = $(this).parents("tr").find('[name="name"]').val();
  data.mobile = $(this).parents("tr").find('[name="mobile"]').val();
  data.storeName = $(this).parents("tr").find('[name="storeName"]').val();
  if (!$('.select_clerk_list [name="id"][value="' + data.id + '"]').val()) {

    var tmpl = document.getElementById('select_clerk_list_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".select_clerk_list").append(doTtmpl(data));
    $(".select_clerk_total").html($(".select_clerk_list tr").length);
  } else {
    alert("该店员已被选择！");
  }
});
/**
 * 批量添加全选
 */
$(".select_all_clerk_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;

  $(".clerk_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_select_clerk_btn").live("click", function () {
  $(".clerk_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.mobile = $(this).parents("tr").find('[name="mobile"]').val();
    data.id = $(this).parents("tr").find('[name="id"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.storeName = $(this).parents("tr").find('[name="storeName"]').val();

    if (!$('.select_clerk_list [name="id"][value="' + data.id + '"]').val()) {
      var tmpl = document.getElementById('select_clerk_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);

      $(".select_clerk_list").append(doTtmpl(data));
    }
  });
  $(".select_clerk_total").html($(".select_clerk_list tr").length);
});

$(".clerk_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".select_all_clerk_btn").attr("checked", false);
    $(".select_all_clerk_btn").parent().removeClass("checked");

  } else if ($(".clerk_list input[type='checkbox']").length == $(".clerk_list input[type='checkbox']:checked").length) {

    $(".select_all_clerk_btn").attr("checked", true);
    $(".select_all_clerk_btn").parent().addClass("checked");

  }
});

$(".unselect_clerk_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  $(".select_clerk_total").html($(".select_clerk_list tr").length);
});

/**
 * 批量移除全选
 */
$(".unselect_all_clerk_btn").live("click", function () {

  var curStatus = $(this).attr("checked") ? true : false;

  $(".select_clerk_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_unselect_clerk_btn").live("click", function () {
  $(".select_clerk_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_clerk_total").html($(".select_clerk_list tr").length);
});

$(".select_clerk_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".unselect_all_clerk_btn").attr("checked", false);
    $(".unselect_all_clerk_btn").parent().removeClass("checked");

  } else if ($(".select_clerk_list input[type='checkbox']").length == $(".select_clerk_list input[type='checkbox']:checked").length) {

    $(".unselect_all_clerk_btn").attr("checked", true);
    $(".unselect_all_clerk_btn").parent().addClass("checked");

  }
});


