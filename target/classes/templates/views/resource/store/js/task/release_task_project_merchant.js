//  选择门店
$(".select_stores_btn").live("click", function () {
  var data = {};
  data.id = $(this).parents("tr").find('[name="id"]').val();
  data.storesNumber = $(this).parent().find('[name="stores_number"]').val();
  data.name = $(this).parent().find('[name="name"]').val();
  data.area = $(this).parent().find('[name="area"]').val();

  if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
    var tmpl = document.getElementById('select_store_list_templete').innerHTML;

    var doTtmpl = doT.template(tmpl);
    $(".select_stores_list").append(doTtmpl(data));
    $(".select_stores_total").html($(".select_stores_list tr").length);

    var selectid=data.id
    $("#md_"+selectid).attr("checked", true);
    $("#md_"+selectid).parent().addClass("checked")
  } else {
    alert("该门店已被选择！");
  }
})

/**
 * 移除
 */
$(".unselect_goods_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_store_list tr").length;
  $(".select_stores_total").html(len);
  $("#check_num").html(len);
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
    data.id = $(this).parents("tr").find('[name="id"]').val();
    data.storesNumber = $(this).parents("tr").find('[name="stores_number"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.area = $(this).parents("tr").find('[name="area"]').val();
    if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
      var tmpl = document.getElementById('select_store_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);
      $(".select_stores_list").append(doTtmpl(data));

      var selectid=data.id;
      $("#md_"+selectid).attr("checked", true);
      $("#md_"+selectid).parent().addClass("checked")

    }
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
  $("#check_num").html($(".select_stores_list tr").length);
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

//  选择店员
$(".select_clerks_btn").live("click", function () {
  var data = {};
  data.storeadminid = $(this).parents("tr").find('[name="storeadminid"]').val();
  data.name = $(this).parent().find('[name="name"]').val();
  data.storeName = $(this).parent().find('[name="storeName"]').val();
  data.employeeNumber = $(this).parent().find('[name="employeeNumber"]').val();

  if (!$('.select_clerks_list [name="storeadminid"][value="' + data.storeadminid + '"]').val()) {
    var tmpl = document.getElementById('select_clerks_list_templete').innerHTML;

    var doTtmpl = doT.template(tmpl);
    $(".select_clerks_list").append(doTtmpl(data));
    $(".select_clerks_total").html($(".select_clerks_list tr").length);

    var selectid=data.storeadminid
    $("#dy_"+selectid).attr("checked", true);
    $("#dy_"+selectid).parent().addClass("checked")
  } else {
    alert("该店员已被选择！");
  }
})

/**
 * 移除
 */
$(".unselect_clerks_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_clerks_list tr").length;
  $(".select_clerks_total").html(len);
  $("#check_num").html(len);
});
/**
 * 批量添加全选
 */
$(".select_all_clerks_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;

  $(".clerks_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_select_clerks_btn").live("click", function () {
  $(".clerks_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.storeadminid = $(this).parents("tr").find('[name="storeadminid"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.storeName = $(this).parents("tr").find('[name="storeName"]').val();
    data.employeeNumber = $(this).parents("tr").find('[name="employeeNumber"]').val();
    if (!$('.select_clerks_list [name="storeadminid"][value="' + data.storeadminid + '"]').val()) {
      var tmpl = document.getElementById('select_clerks_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);
      $(".select_clerks_list").append(doTtmpl(data));

      var selectid=data.storeadminid
      $("#dy_"+selectid).attr("checked", true);
      $("#dy_"+selectid).parent().addClass("checked")
    }
  });
  $(".select_clerks_total").html($(".select_clerks_list tr").length);
  $("#check_num").html($(".select_clerks_list tr").length);
});

$(".clerks_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".select_all_clerks_btn").attr("checked", false);
    $(".select_all_clerks_btn").parent().removeClass("checked");

  } else if ($(".clerks_list input[type='checkbox']").length == $(".clerks_list input[type='checkbox']:checked").length) {

    $(".select_all_clerks_btn").attr("checked", true);
    $(".select_all_clerks_btn").parent().addClass("checked");

  }
});

/**
 * 批量移除全选
 */
$(".unselect_all_clerks_btn").live("click", function () {

  var curStatus = $(this).attr("checked") ? true : false;

  $(".select_clerks_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
$(".putaway_unselect_clerks_btn").live("click", function () {
  $(".select_clerks_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_clerks_total").html($(".select_clerks_list tr").length);
});

$(".select_clerks_list input[type='checkbox']").live("click", function () {

  if (!$(this).attr("checked")) {

    $(".unselect_all_clerks_btn").attr("checked", false);
    $(".unselect_all_clerks_btn").parent().removeClass("checked");

  } else if ($(".select_clerks_list input[type='checkbox']").length == $(".select_clerks_list input[type='checkbox']:checked").length) {

    $(".unselect_all_clerks_btn").attr("checked", true);
    $(".unselect_all_clerks_btn").parent().addClass("checked");

  }
});




