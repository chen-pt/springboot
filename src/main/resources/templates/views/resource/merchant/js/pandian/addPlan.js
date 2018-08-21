var vm = new Vue({
  el: '#select_clerks',
  data: {
    quotaList: []
  },
  created: function () {
    getAllStore();
  },
});

function getAllStore() {
  $.ajax({
    url: "/merchant/getPDStoreList",
    type: "POST",
    data: {
      "pageNum": 1,
      "pageSize": 200,
    },
    success: function (data) {
      if (data.status == "ERROR") {
        layer.msg(data.message);
        return;
      }
      vm.quotaList = data.pageInfo.list;
    }
  })
};


getStores(1);
$(".search_stores_btn").live("click", function () {
  getStores(1);
});
getClerks();
$(".search_clerks_btn").live("click", function () {
  getClerks();
});

function getStores(pageNum, pageSize) {
  var data = {pageNum: pageNum, pageSize: pageSize};
  data.storeName = $("[name=store_name_search]").val();
  data.storesNumber = $("[name=store_number_search]").val();
  $.ajax({
    type: 'post',
    url: '/merchant/getPDStoreList',
    data: data,
    dataType: 'json',
    success: function (data) {
      if (data.status == "ERROR") {
        layer.msg(data.message);
        return;
      }

      $(".stores_list").empty();
      $(".stores_total").html(data.pageInfo.total);
      var tmpl = document.getElementById('store_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      var tr = doTtmpl(data);
      $(".stores_list").append(tr);

      $('.fenye').pagination({
        itemsCount: data.pageInfo.total,
        pageSize: data.pageInfo.pageSize,
        currentPage: data.pageInfo.pageNum,
        displayPage: 6,
        /*displayInfoType: "itemsCount",*/
        styleClass: ['pagination-large'],
        showCtrl: true,
        onSelect: function (num) {
          getStores(num, data.pageInfo.pageSize);
        }
      });
      $('.fenye').pagination('updatePages', data.pageInfo.pages, data.pageInfo.pageNum);
      /*$('.fenye').pagination('updateItemsCount',data.pageInfo.total,data.pageInfo.pageNum);*/
    },
    error: function () {
      console.log("error ....");
    }
  });
};

function getClerks(pageNum, pageSize) {
  var data = {pageNum: pageNum, pageSize: pageSize};
  data.name = $("[name=clerk_name]").val();
  data.storeId = $("#quotaSource").val();
  $.ajax({
    type: 'post',
    url: '/merchant/getPDClerkList',
    data: data,
    dataType: 'json',
    success: function (data) {
      if (data.status == "ERROR") {
        layer.msg(data.message);
        return;
      }

      $(".clerks_list").empty();
      $(".clerks_total").html(data.pageInfo.total);
      var tmpl = document.getElementById('clerks_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      var tr = doTtmpl(data.pageInfo);
      $(".clerks_list").append(tr);

      $('.pagination-small').pagination({
        itemsCount: data.pageInfo.total,
        pageSize: data.pageInfo.pageSize,
        currentPage: data.pageInfo.pageNum,
        displayPage: 6,
        /*displayInfoType: "itemsCount",*/
        styleClass: ['pagination-large'],
        showCtrl: true,
        onSelect: function (num) {
          getClerks(num, data.pageInfo.pageSize);
        }
      });
      $('.pagination-small').pagination('updatePages', data.pageInfo.pages, data.pageInfo.pageNum);
      /*$('.pagination-small').pagination('updateItemsCount',data.pageInfo.total,data.pageInfo.pageNum);*/
    },
    error: function () {
      console.log("error ....");
    }
  });
};


$("input[name='planType']").click(function () {
  if ($(this).val() == 1) {
    $(".dateSpan").hide();
  } else {
    $(".dateSpan").show();
  }
});

var store_ids = [];
var clerks_ids = [];

$("input[name='executor']").click(function () {
  // alert($(this).val());
  if ($(this).val() == 1) {
    $(this).next().show();
    $("#dy").next().hide();
  } else if ($(this).val() == 2) {
    $(this).next().show();
    $("#md").next().hide();
  }
  selectEvent();
});

var selectEvent = function () {
  $("#taskproject").empty();

  if ($("input[name='executor']:checked").val() == 1) {
    $('#select_stores').modal('show');
    if (store_ids.length > 0) {
      $("#taskproject").append("<span class='green'>" + "共有" + store_ids.length + "个门店被选中" + "</span>");
    } else {
      $("#taskproject").append("<span class='red'>" + "请选择门店或者店员作为任务对象" + "</span>");
    }

    $(".select_stores_list").empty();
    for (i = 0; i < store_ids.length; i++) {
      var tmpl = document.getElementById('select_store_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_stores_list").append(doTtmpl(store_ids[i]));
      var selectid = store_ids[i].id;
      $("#md_" + selectid).attr("checked", true);
      $("#md_" + selectid).parent().addClass("checked");
    }
    $(".select_stores_total").html($(".select_stores_list tr").length);
  } else if ($("input[name='executor']:checked").val() == 2) {
    $('#select_clerks').modal('show');
    if (clerks_ids.length > 0) {
      $("#taskproject").append("<span class='green'>" + "共有" + clerks_ids.length + "个店员被选中" + "</span>");
    } else {
      $("#taskproject").append("<span class='red'>" + "请选择门店或者店员作为任务对象" + "</span>");
    }

    $(".select_clerks_list").empty();
    for (i = 0; i < clerks_ids.length; i++) {
      var tmpl = document.getElementById('select_clerks_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_clerks_list").append(doTtmpl(clerks_ids[i]));
      var selectid = clerks_ids[i].storeadminid;
      $("#dy_" + selectid).attr("checked", true);
      $("#dy_" + selectid).parent().addClass("checked");
    }
    $(".select_clerks_total").html($(".select_clerks_list tr").length);
  }
};

//门店 确认选择
function getStoreIds() {
  $('#select_stores').modal('hide');
  $("#taskproject").empty();
  store_ids.length = 0;

  $(".select_stores_list [type='checkbox']").each(function () {//".select_stores_list [type='checkbox']:checked"
    var data = {};
    data.id = $(this).val();
    data.storesNumber = $(this).parents("tr").find('[name="stores_number"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.area = $(this).parents("tr").find('[name="area"]').val();
    store_ids.push(data);
  });

  if (store_ids.length > 0) {
    $("#taskproject").append("<span class='green'>" + "共有" + store_ids.length + "个门店被选中" + "</span>");
  } else {
    $("#taskproject").append("<span class='red'>" + "请选择门店或者店员作为任务对象" + "</span>");
  }
};

//店员 确认选择
function getClerkIds() {
  $('#select_clerks').modal('hide');
  $("#taskproject").empty()
  clerks_ids.length = 0;

  $(".select_clerks_list [type='checkbox']").each(function () {//".select_clerks_list [type='checkbox']:checked"
    var data = {};
    data.storeId = $(this).parents("tr").find('[name="storeId"]').val();
    data.storeadminid = $(this).val();
    // data.storeadminid = $(this).parents("tr").find('[name="storeadminid"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.storeName = $(this).parents("tr").find('[name="storeName"]').val();
    data.employeeNumber = $(this).parents("tr").find('[name="employeeNumber"]').val();
    clerks_ids.push(data);
  });

  if (clerks_ids.length > 0) {
    $("#taskproject").append("<span class='green'>" + "共有" + clerks_ids.length + "个店员被选中" + "</span>");
  } else {
    $("#taskproject").append("<span class='red'>" + "请选择门店或者店员作为任务对象" + "</span>");
  }
}


//添加计划
var flag = true;
function addPlan() {
  var data = {};
  data.planType = $("input[name='planType']:checked").val();
  data.planStockShow = $("input[name='stockShow']:checked").val();
  data.planCheck = $("input[name='check']:checked").val();
  data.planCheckType = $("input[name='checkType']:checked").val();
  data.planSignature = $("input[name='signature']:checked").val();

  if (data.planType == 0 && ($("#planDay").val() == "" || $("#planHour").val() == "")) {
    layer.msg("指定日期不能为空");
    return;
  } else if (data.planType == 0 && $("#planDay").val() < 1) {
    layer.msg("指定日期不能小于1");
    return;
  }
  if (data.planType == 0) {
    data.planDay = $("#planDay").val();
    data.planHour = $("#planHour").val();
  } else {
    data.planDay = 0;
    data.planHour = 0;
  }

  var planExecutor = new Object();
  if ($("input[name='executor']:checked").val() == 0) {
    planExecutor[0] = 0;
  } else if ($("input[name='executor']:checked").val() == 1) {
    if (store_ids.length == 0) {
      layer.msg("指定门店不能为空");
      return;
    }

    for (i = 0; i < store_ids.length; i++) {
      planExecutor[store_ids[i].id] = 0;
    }
  } else if ($("input[name='executor']:checked").val() == 2) {
    if (clerks_ids.length == 0) {
      layer.msg("指定店员不能为空");
      return;
    }

    for (i = 0; i < clerks_ids.length; i++) {
      if (planExecutor[clerks_ids[i].storeId] == null || planExecutor[clerks_ids[i].storeId] == undefined) {
        planExecutor[clerks_ids[i].storeId] = [Number(clerks_ids[i].storeadminid)];
      } else {
        planExecutor[clerks_ids[i].storeId].push(Number(clerks_ids[i].storeadminid));
      }
    }
  }
  data.planExecutor = JSON.stringify(planExecutor);
  // alert(planExecutor);

  if(flag){
    flag = false;
    $.ajax({
      type: 'post',
      url: '/merchant/addPlan',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      dataType: 'json',
      success: function (data) {
        if (data.status == "ERROR") {
          layer.msg(data.message);
          if (data.existPlan != null) {
            $("#exist_list").empty();
            var tmpl = document.getElementById('existPlanTemplate').innerHTML;
            var doTtmpl = doT.template(tmpl);
            var tr = doTtmpl(data.existPlan);
            $("#exist_list").append(tr);
            $("#existPlanTip").modal('show');
          }
          flag = true;
          return;
        }
        window.location.href = "/merchant/planListView";
      },
      error: function () {
        console.log("error ....");
        flag = true;
      }
    });
  }
}


//门店 指定  -------------------------------------------------------------------------------------
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

    var selectid = data.id
    $("#md_" + selectid).attr("checked", true);
    $("#md_" + selectid).parent().addClass("checked")
  } else {
    alert("该门店已被选择！");
  }
});

//门店 移除
$(".unselect_stores_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_stores_list tr").length;
  $(".select_stores_total").html(len);
  $("#check_num").html(len);
});

//批量参加全选
$(".select_all_stores_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
//列表复选框 与 全选复选框 同步状态
$(".stores_list input[type='checkbox']").live("click", function () {
  if (!$(this).attr("checked")) {
    $(".select_all_stores_btn").attr("checked", false);
    $(".select_all_stores_btn").parent().removeClass("checked");
  } else if ($(".stores_list input[type='checkbox']").length == $(".stores_list input[type='checkbox']:checked").length) {
    $(".select_all_stores_btn").attr("checked", true);
    $(".select_all_stores_btn").parent().addClass("checked");
  }
});
//批量参加
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

      var selectid = data.id;
      $("#md_" + selectid).attr("checked", true);
      $("#md_" + selectid).parent().addClass("checked")
    }
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
  $("#check_num").html($(".select_stores_list tr").length);
});

//批量移除全选
$(".unselect_all_stores_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".select_stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
//列表复选框 与 全选复选框 同步状态
$(".select_stores_list input[type='checkbox']").live("click", function () {
  if (!$(this).attr("checked")) {
    $(".unselect_all_stores_btn").attr("checked", false);
    $(".unselect_all_stores_btn").parent().removeClass("checked");
  } else if ($(".select_stores_list input[type='checkbox']").length == $(".select_stores_list input[type='checkbox']:checked").length) {
    $(".unselect_all_stores_btn").attr("checked", true);
    $(".unselect_all_stores_btn").parent().addClass("checked");
  }
});
//批量移除
$(".putaway_unselect_stores_btn").live("click", function () {
  $(".select_stores_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
});


// 店员 指定  -------------------------------------------------------------------------------------
$(".select_clerks_btn").live("click", function () {
  var data = {};
  data.storeadminid = $(this).parents("tr").find('[name="storeadminid"]').val();
  data.name = $(this).parent().find('[name="name"]').val();
  data.storeName = $(this).parent().find('[name="storeName"]').val();
  data.employeeNumber = $(this).parent().find('[name="employeeNumber"]').val();
  data.storeId = $(this).parent().find('[name="storeId"]').val();

  if (!$('.select_clerks_list [name="storeadminid"][value="' + data.storeadminid + '"]').val()) {
    var tmpl = document.getElementById('select_clerks_list_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".select_clerks_list").append(doTtmpl(data));
    $(".select_clerks_total").html($(".select_clerks_list tr").length);

    var selectid = data.storeadminid
    $("#dy_" + selectid).attr("checked", true);
    $("#dy_" + selectid).parent().addClass("checked")
  } else {
    alert("该店员已被选择！");
  }
});

//店员 移除
$(".unselect_clerks_btn").live("click", function () {
  $(this).parents(".can_del_tr").remove();
  var len = $(".select_clerks_list tr").length;
  $(".select_clerks_total").html(len);
  $("#check_num").html(len);
});

//批量参加全选
$(".select_all_clerks_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".clerks_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
//列表复选框 与 全选复选框 同步状态
$(".clerks_list input[type='checkbox']").live("click", function () {
  if (!$(this).attr("checked")) {
    $(".select_all_clerks_btn").attr("checked", false);
    $(".select_all_clerks_btn").parent().removeClass("checked");
  } else if ($(".clerks_list input[type='checkbox']").length == $(".clerks_list input[type='checkbox']:checked").length) {
    $(".select_all_clerks_btn").attr("checked", true);
    $(".select_all_clerks_btn").parent().addClass("checked");
  }
});
//批量参加
$(".putaway_select_clerks_btn").live("click", function () {
  $(".clerks_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.storeadminid = $(this).parents("tr").find('[name="storeadminid"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.storeName = $(this).parents("tr").find('[name="storeName"]').val();
    data.employeeNumber = $(this).parents("tr").find('[name="employeeNumber"]').val();
    data.storeId = $(this).parents("tr").find('[name="storeId"]').val();

    if (!$('.select_clerks_list [name="storeadminid"][value="' + data.storeadminid + '"]').val()) {
      var tmpl = document.getElementById('select_clerks_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_clerks_list").append(doTtmpl(data));

      var selectid = data.storeadminid
      $("#dy_" + selectid).attr("checked", true);
      $("#dy_" + selectid).parent().addClass("checked")
    }
  });
  $(".select_clerks_total").html($(".select_clerks_list tr").length);
  $("#check_num").html($(".select_clerks_list tr").length);
});

//批量移除全选
$(".unselect_all_clerks_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;
  $(".select_clerks_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});
//列表复选框 与 全选复选框 同步状态
$(".select_clerks_list input[type='checkbox']").live("click", function () {
  if (!$(this).attr("checked")) {
    $(".unselect_all_clerks_btn").attr("checked", false);
    $(".unselect_all_clerks_btn").parent().removeClass("checked");
  } else if ($(".select_clerks_list input[type='checkbox']").length == $(".select_clerks_list input[type='checkbox']:checked").length) {
    $(".unselect_all_clerks_btn").attr("checked", true);
    $(".unselect_all_clerks_btn").parent().addClass("checked");
  }
});
//批量移除
$(".putaway_unselect_clerks_btn").live("click", function () {
  $(".select_clerks_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_clerks_total").html($(".select_clerks_list tr").length);
});



