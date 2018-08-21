//  选择门店
$(document).on("click",".select_stores_btn", function () {
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


  } else {
    alert("该门店已被选择！");
  }
})

/**
 * 移除
 */
$(document).on("click",".unselect_goods_btn", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_store_list tr").length;
  $(".select_stores_total").html(len);
  $("#check_num").html(len);
});
/**
 * 批量添加全选
 */
$(document).on("click",".select_all_stores_btn", function () {
  var curStatus = $(this).attr("checked") ? true : false;

  $(".stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(document).on("click",".putaway_select_stores_btn", function () {
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
    }
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
  $("#check_num").html($(".select_stores_list tr").length);
});

$(document).on("click",".stores_list input[type='checkbox']", function () {

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
$(document).on("click",".unselect_all_stores_btn", function () {

  var curStatus = $(this).attr("checked") ? true : false;

  $(".select_stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
$(document).on("click",".putaway_unselect_stores_btn", function () {
  $(".select_stores_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
});

$(document).on("click",".select_stores_list input[type='checkbox']", function () {

  if (!$(this).attr("checked")) {

    $(".unselect_all_stores_btn").attr("checked", false);
    $(".unselect_all_stores_btn").parent().removeClass("checked");

  } else if ($(".select_stores_list input[type='checkbox']").length == $(".select_stores_list input[type='checkbox']:checked").length) {

    $(".unselect_all_stores_btn").attr("checked", true);
    $(".unselect_all_stores_btn").parent().addClass("checked");

  }
});

//  选择店员
$("tbody").on("click",".select_clerks_btn", function () {
  var data = {};
  data.storeadminid = $(this).parent().find('[name="storeadminid"]').val();
  data.clerkName = $(this).parent().find('[name="clerkName"]').val();
  data.mobile = $(this).parent().find('[name="mobile"]').val();
  data.clerkjob = $(this).parent().find('[name="clerkjob"]').val();

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
$("tbody").on("click",".unselect_clerks_btn", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_clerks_list tr").length;
  $(".select_clerks_total").html(len);
  $("#check_num").html(len);
});
/**
 * 批量添加全选
 */
$(document).on("click",".select_all_clerks_btn", function () {

  // alert($(this).is(":checked"))
  var curStatus = $(this).is(":checked") ? true : false;
  $(".clerks_list input[type='checkbox']").each(function () {
    $(this).prop("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(document).on("click",".putaway_select_clerks_btn", function () {

  $(".clerks_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.storeadminid = $(this).parent().parent().parent("tr").find('[name="storeadminid"]').val();
    data.clerkName = $(this).parent().parent().parent("tr").find('[name="clerkName"]').val();
    data.mobile = $(this).parent().parent().parent("tr").find('[name="mobile"]').val();
    data.clerkjob = $(this).parent().parent().parent("tr").find('[name="clerkjob"]').val();
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

$("tbody").on("click",".clerks_list input[type='checkbox']", function () {

  if (!$(this).is(":checked")) {

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
$("tbody").on("click",".unselect_all_clerks_btn", function () {

  var curStatus = $(this).is(":checked") ? true : false;

  $(".select_clerks_list input[type='checkbox']").each(function () {
    $(this).prop("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
$("tbody").on("click",".putaway_unselect_clerks_btn", function () {
  $(".select_clerks_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_clerks_total").html($(".select_clerks_list tr").length);
});

$("tbody").on("click",".select_clerks_list input[type='checkbox']", function () {

  if (!$(this).is(":checked")) {

    $(".unselect_all_clerks_btn").attr("checked", false);
    $(".unselect_all_clerks_btn").parent().removeClass("checked");

  } else if ($(".select_clerks_list input[type='checkbox']").length == $(".select_clerks_list input[type='checkbox']:checked").length) {

    $(".unselect_all_clerks_btn").attr("checked", true);
    $(".unselect_all_clerks_btn").parent().addClass("checked");

  }
});



