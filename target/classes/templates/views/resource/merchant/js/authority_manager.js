$(function () {
  //promission:1:自主定价；2：o2o门店，3：仓库权限；4：积分权限；5：退款权限；6:聊天权限；7盘点工具
  getstores();
  shownum();
  shownums();
  pandian_change_num();
  //自主定价
  $("#own_pricing_type").click(function () {
    shownum();
  });
  $(".set-price-btn").click(function () {
    $("[name=promission]").val(1);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    pricenum();
    showlist(alllist);
    storesprice(alllist, toarray($("[name=select_price_ids]").val()));
  });
  $(".save-price-btn").click(function () {
    addownpricingtype();
  });
  $("#up_pricing_type").click(function () {
    shownums();
  });
  $(".set-price-btns").click(function () {
    $("[name=promission]").val(6);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    pricenums();
    showlist(alllist);
    storesprices(alllist, toarray($("[name=price_idss]").val()));
  });
  $(".update-price-btn").click(function () {
    adduppricingtype();
  });
  //分单设置
  $(".set-store-btn").click(function () {
    $("[name=promission]").val(2);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    orderList(alllist);
    ordertype(alllist, $("[name=select_assign_ids]").val());
  });
  //区域仓库
  $(".set-house-btn").click(function () {
    $("[name=promission]").val(3);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    showlist(alllist);
    storespromission(alllist, $("[name=select_warehouse_ids]").val());
  });
  $(".save-house-btn").click(function () {
    order_auto();
  });
  //会员积分权限
  $(".set-member-btn").click(function () {
    $("[name=promission]").val(4);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    showlist(alllist);
    storespromission(alllist, $("[name=member_store_ids]").val());
  });
  $(".save-member-btn").click(function () {
    setIntegalPermissionType();
  });
  //退款权限
  $(".set-refund-btn").click(function () {
    $("[name=promission]").val(5);
    $("[name=store_name]").val("");
    $("[name=store_number]").val("");
    showlist(alllist);
    storespromission(alllist, $("[name=refund_store_ids]").val());
  });
  $(".save-refund-btn").click(function () {
    setStoreRefundPermission();
  });
  //列表搜索
  $(".search_stores_btn").click(function () {
    search();
    showlist(searchlist);
  });
  //显示店员聊天开关列表
  $(".set-clerk-btn").click(function () {
    $("[name=promission]").val(6);
    selectClerk(0);
    selectClerkChat(clerklist, $("[name=clerk_ids]").val());
  });
  $(".search_clerk_btn").click(function () {
    selectClerk(0);
  });
  $(".save-clerk-btn").click(function () {
    set_clerk_chat();
  });
  // //邀请码设置
  // $(".save_wx_set_btn").click(function () {
  //   inviteCode();
  // });

  $("#store_id").change(function () {
    if ($(this).val() == 1) {
      $(".set-store-btn").addClass("lee_hide");
    } else {
      $(".set-store-btn").removeClass("lee_hide");
    }
  });

  $('[name="store_permission_type"]').change(function () {
    if ($(this).val() == 3) {
      $(".set-member-btn").removeClass("lee_hide");
    } else {
      $(".set-member-btn").addClass("lee_hide");
    }
  });
  $('[name="store_refund_permission_type"]').change(function () {
    if ($(this).val() == 3) {
      $(".set-refund-btn").removeClass("lee_hide");
    } else {
      $(".set-refund-btn").addClass("lee_hide");
    }
  });
  $('[name="clerk_chat_type"]').change(function () {
    if ($(this).val() == 3) {
      $(".set-clerk-btn").removeClass("lee_hide");
    } else {
      $(".set-clerk-btn").addClass("lee_hide");
    }
  });
  //盘点权限
  $('#select_check_stores').click(function () {
    pandian_change_num();
  });
  $('.set-check-btn').click(function () {
    $("[name=promission]").val(7);
    showlist(alllist);
    storescheck(alllist, $("[name=select_pandian_stores_ids]").val());
  });
  $(".set-check-promission-btn").click(function () {
    showCheckPermission();
  });
  $(".save-check-btn").click(function () {
    savepandianPermission();
  });
});
var alllist = [];//所有门店数组
var len = 0;//平台门店总数量
var searchlist = [];//查询得到的门店列表
var clerklist = [];//所有店员列表
/**
 *页面初始化
 */
var getstores = function () {
  var a = localStorage.getItem("b");
  $("#up_pricing_type").find("option[value='" + a + "']").attr("selected", true);
  var name = $("[name=store_name]").val();
  var storenumber = $("[name=store_number]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/stores",
      data: {
        "store_name": name,
        "storeNumber": storenumber
      },
      dataType: "JSON",
      success: function (data) {

        console.log(data);
        $(".stores_list").empty();
        len = data.storeList.length;
        alllist = data.storeList;
        clerklist = data.clerk_list;
        $("[name=select_price_ids]").val(data.ounpricing.storeIds);
        $("#own_pricing_type").val(data.ounpricing.type);
        $("[name=price_idss]").val(data.uppricing);
        $("[name=select_warehouse_ids]").val(data.warehousepromission);
        $("[name=member_store_ids]").val(data.integralpromission.ids);
        $("[name=refund_store_ids]").val(data.refundpromission.fundstores);
        $("[name=select_assign_ids]").val(data.autoassign.storeids);
        $("[name=clerk_ids]").val(data.clerk_chat_ids);
        if (data.checkPermission) {
          $("[name=select_pandian_stores_ids]").val(data.checkPermission.store_id);
          $("[name=select_pandian_permission_ids]").val(data.checkPermission.permission_id);
        } else {
          $("[name=select_pandian_stores_ids]").val("");
          $("[name=select_pandian_permission_ids]").val("");
        }

        //确定门店定价设置
        //确定分单模式
        $.each($("[name=order_assign_type]"), function () {
          if ($(this).val() == data.autoassign.type) {
            $(this).attr("checked", true);
          }
        })
        if (data.autoassign.type == 130) {
          var times = data.autoassign.order_time.split("--");
          $("[name=work_start_time]").val(times[0]);
          $("[name=work_end_time]").val(times[1]);
        }
        //确定分单类型
        if (data.autoassign.storeids == "all") {
          $("#store_id").parent().find("span").html("启用状态且选中了对应服务的【所有门店】");
          $(".set-store-btn").addClass("lee_hide");
        } else {
          $("#store_id").parent().find("span").html("启用状态且选中了对应服务的【指定门店】");
          $(".set-store-btn").removeClass("lee_hide");
        }
        //确定积分类型
        $.each($("[name=store_permission_type]"), function () {
          if ($(this).val() == data.integralpromission.integaltype) {
            $(this).attr("checked", true);
            if ($(this).val() == 3) {
              $(".set-member-btn").removeClass("lee_hide");
            } else {
              $(".set-member-btn").addClass("lee_hide");
            }
          }
        })
        //确定退款类型
        $.each($("[name=store_refund_permission_type]"), function () {
          if ($(this).val() == data.refundpromission.fundtype) {
            $(this).attr("checked", true);
            if ($(this).val() == 3) {
              $(".set-refund-btn").removeClass("lee_hide");
            } else {
              $(".set-refund-btn").addClass("lee_hide");
            }
          }
        })
        //确定聊天开关类型
        $.each($("[name=clerk_chat_type]"), function () {
          if ($(this).val() == data.clerk_Chat) {
            $(this).attr("checked", true);
            if ($(this).val() == 3) {
              $(".set-clerk-btn").removeClass("lee_hide");
            } else {
              $(".set-clerk-btn").addClass("lee_hide");
            }
          }
        })
        // //邀请码显示
        // if (data.invidecode.compucode != 1) {
        //   $("#compu_show").parent().addClass("checked");
        //   $("#compu_show").attr("checked", "checked");
        //   var value = data.invidecode.compucode;
        //   $("[name=compu_show] ").attr("value", value);
        //   $("[name=compu_show] ").val(value);
        //   $("[name=compu_show] ").get(0).value = value;
        // }
        // if (data.invidecode.weixincode != 1) {
        //   $("#wei_show").parent().addClass("checked");
        //   $("#wei_show").attr("checked", "checked");
        //   var value = data.invidecode.weixincode;
        //   $("[name=winxin_show]").attr("value", value);
        //   $("[name=winxin_show]").val(value);
        //   $("[name=winxin_show]").get(0).value = value;
        // }

      }
    }
  )
}
/**
 * 查询
 */
var search = function () {
  var name = $("[name=store_name]").val();
  var storenumber = $("[name=store_number]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/stores",
      data: {
        "store_name": name,
        "storeNumber": storenumber
      },
      dataType: "JSON",
      success: function (data) {
        searchlist = data.storeList;
      }
    }
  )
}
//自主定价权限数字切换显示
function shownum() {
  var ids = $("[name=select_price_ids]").val();
  var num = "";
  if (ids != null && ids != "") {
    num = ids.split(",").length;
    $("#select_stores_total").text("");
    if ($("#own_pricing_type").val() == 1) {
      $("#KKK").text(num);
    } else {
      $("#KKK").text(len - num);
    }
  } else {
    $("#select_stores_total").text("");
    if ($("#own_pricing_type").val() == 1) {
      $("#KKK").text(0);
    } else {
      $("#KKK").text(len);
    }
  }

}
//表格数字显示
function pricenum() {
  var ids = $("[name=select_price_ids]").val();
  var num = "";
  if (ids != null) {
    num = ids.split(",").length;
  }
  $(".stores_list").empty();
  if ($("#own_pricing_type").val() == 1) {
    $(".select_stores_total").text(num);
  } else if ($("#own_pricing_type").val() == 0) {
    $(".select_stores_total").text(len - num);
  }
}

//表格数字显示
function pricenums() {
  var ids = $("[name=price_idss]").val();
  var num = "";
  if (ids != null) {
    num = ids.split(",").length;
  }
  $(".stores_list").empty();
  if ($("#up_pricing_type").val() == 1) {
    $(".select_stores_total").text(num);
  } else if ($("#up_pricing_type").val() == 0) {
    $(".select_stores_total").text(len - num);
  }
}
//渲染门店列表
function showlist(storelist) {
  $(".stores_total").html(len);
  $(".stores_list").empty();
  $("[name=store_name]").val("");
  $(".select_all_stores_btn").removeAttr("checked");
  $(".unselect_all_stores_btn").removeAttr("checked");
  if (storelist.length > 0) {
    var tr = "";
    for (var i = 0; i < storelist.length; i++) {
      var str = "";
      if (storelist[i].serviceSupport.indexOf("150") > -1 && storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "送货上门，门店自提";
      } else if (storelist[i].serviceSupport.indexOf("150") > -1) {
        str = "送货上门";
      } else if (storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "门店自提";
      } else {
        str = "---";
      }
      tr += "<tr><td width='3%'></td><td style='width:24%'><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
        "<input name='gid' type='checkbox'><span>" + storelist[i].storesNumber + "</span></label></td><td style='width:33%'><span>" + storelist[i].name + "</span></td>" +
        "<td style='width:30%'>" + str + "</td><td><input name='stores_number' value='" + storelist[i].storesNumber + "' type='hidden'>" +
        "<input name='id' value='" + storelist[i].id + "' type='hidden'><input name='name' value='" + storelist[i].name + "' type='hidden'>" +
        "<input name='service_support' value='" + storelist[i].serviceSupport + "' type='hidden'><a href='javascript:void(0)' class='select_stores_btn'>指定</a>" +
        "</td></tr>";
    }
  } else {
    tr = "没有找到合适的数据";
  }
  $(".stores_list").append(tr);
}
//分单列表渲染（全部）
function orderList(storelist) {
  $(".stores_list").empty();
  if (storelist.length > 0) {
    var tr = "";
    for (var i = 0; i < storelist.length; i++) {
      var str = "";
      if (storelist[i].serviceSupport.indexOf("150") > -1 && storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "送货上门，门店自提";
      } else if (storelist[i].serviceSupport.indexOf("150") > -1) {
        str = "送货上门";
      } else if (storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "门店自提";
      } else {
        continue;
      }
      tr += "<tr><td width='3%'></td><td style='width:24%'><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
        "<input name='gid' type='checkbox'><span>" + storelist[i].storesNumber + "</span></label></td><td style='width:33%'><span>" + storelist[i].name + "</span></td>" +
        "<td style='width:30%'>" + str + "</td><td><input name='stores_number' value='" + storelist[i].storesNumber + "' type='hidden'>" +
        "<input name='id' value='" + storelist[i].id + "' type='hidden'><input name='name' value='" + storelist[i].name + "' type='hidden'>" +
        "<input name='service_support' value='" + storelist[i].serviceSupport + "' type='hidden'><a href='javascript:void(0)' class='select_stores_btn'>指定</a>" +
        "</td></tr>";
    }
  } else {
    tr = "没有找到合适的数据";
  }
  $(".stores_list").append(tr);
  $(".stores_total").html($(".stores_list").find("tr").length);
}
/**
 * 渲染自主定价门店列表
 * @param storelist
 * @param promissionids
 */
function storesprice(storelist, promissionids) {
  var tr1 = "";//参加自主定价的门店列表
  var tr2 = "";//不参加自主定价的门店列表
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var doTtmpl = doT.template(tmpl);
  for (var i = 0; i < len; i++) {
    var ds = {};//拥有权限的数组
    var dd = {};//禁止权限的数组
    if (promissionids.length > 0) {
      if (promissionids.indexOf(storelist[i].id) > -1) {//拥有权限的id
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        tr1 += doTtmpl(ds);
      } else {//没有权限的id
        dd.id = storelist[i].id;
        dd.name = storelist[i].name;
        dd.service_support = storelist[i].serviceSupport;
        dd.stores_number = storelist[i].storesNumber;
        tr2 += doTtmpl(dd);
      }
    }
  }
  $(".select_stores_list").empty();
  if ($("#own_pricing_type").val() == 1) {
    $(".select_stores_list").append(tr1);
  } else if ($("#own_pricing_type").val() == 0) {
    $(".select_stores_list").append(tr2);
  }

}
/**
 * 渲染订单权限门店列表
 * @param storelist
 * @param promissionids
 */
function storesprices(storelist, promissionids) {
  var tr1 = "";//参加自主定价的门店列表
  var tr2 = "";//不参加自主定价的门店列表
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var doTtmpl = doT.template(tmpl);
  for (var i = 0; i < len; i++) {
    var ds = {};//拥有权限的数组
    var dd = {};//禁止权限的数组
    if (promissionids.length > 0) {
      if (promissionids.indexOf(storelist[i].id) > -1) {//拥有权限的id
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        tr1 += doTtmpl(ds);
      } else {//没有权限的id
        dd.id = storelist[i].id;
        dd.name = storelist[i].name;
        dd.service_support = storelist[i].serviceSupport;
        dd.stores_number = storelist[i].storesNumber;
        tr2 += doTtmpl(dd);
      }
    }
  }
  $(".select_stores_list").empty();
  if ($("#up_pricing_type").val() == 1) {
    $(".select_stores_list").append(tr1);
  } else if ($("#up_pricing_type").val() == 0) {
    $(".select_stores_list").append(tr2);
  }

}

//数据渲染(被选择分单)
function ordertype(storelist, promissionids) {
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var tr1 = "";//拥有权限的门店列表
  for (var i = 0; i < storelist.length; i++) {
    var ds = {};//拥有权限的数组
    if (promissionids == 'all') {
      if (storelist[i].serviceSupport != "NULL" && storelist[i].serviceSupport != "") {
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        var doTtmpl = doT.template(tmpl);
        tr1 += doTtmpl(ds);
      }
    } else if (toarray(promissionids).length > 0) {
      if (toarray(promissionids).indexOf(storelist[i].id) > -1) {
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        var doTtmpl = doT.template(tmpl);
        tr1 += doTtmpl(ds);
      }
    }
  }
  $(".select_stores_list").empty();
  $(".select_stores_list").append(tr1);
  $(".select_stores_total").text($(".select_stores_list").find("tr").length);
}
//数据渲染(自主退款和修改积分)
function storespromission(storelist, promissionids) {
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var trl;
  if (toarray(promissionids).length > storelist.length) {
    trl = storelist.length;
  } else {
    trl = toarray(promissionids).length;
  }
  $(".select_stores_total").text(trl);
  var tr1 = "";//拥有权限的门店列表
  for (var i = 0; i < storelist.length; i++) {
    var ds = {};//拥有权限的数组
    if (toarray(promissionids).length > 0) {
      if (toarray(promissionids).indexOf(storelist[i].id) > -1) {
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        var doTtmpl = doT.template(tmpl);
        tr1 += doTtmpl(ds);
      }
    }
  }
  $(".select_stores_list").empty();
  $(".select_stores_list").append(tr1);
}
/**
 * 渲染盘点门店数据
 * @param storelist
 * @param promissionids
 */
function storescheck(storelist, promissionids) {
  $(".select_stores_total").text($("#checknum").text());
  var tr1 = "";//参加自主定价的门店列表
  var tr2 = "";//不参加自主定价的门店列表
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var doTtmpl = doT.template(tmpl);
  for (var i = 0; i < len; i++) {
    var ds = {};//拥有权限的数组
    var dd = {};//禁止权限的数组
    if (toarray(promissionids).length > 0) {
      if (toarray(promissionids).indexOf(storelist[i].id) > -1) {//拥有权限的id
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        tr1 += doTtmpl(ds);
      } else {//没有权限的id
        dd.id = storelist[i].id;
        dd.name = storelist[i].name;
        dd.service_support = storelist[i].serviceSupport;
        dd.stores_number = storelist[i].storesNumber;
        tr2 += doTtmpl(dd);
      }
    }
  }
  $(".select_stores_list").empty();
  if ($("#select_check_stores").val() == 1) {
    $(".select_stores_list").append(tr1);
  } else if ($("#select_check_stores").val() == 0) {
    $(".select_stores_list").append(tr2);
  }

}
/**
 * 提交门店自主定价权限
 */
function addownpricingtype() {
  var ids = $("[name=select_price_ids]").val();
  if (ids != null && ids != '') {
    $.ajax({
      type: "POST",
      url: "/merchant/ownpricingtype",
      data: {
        "ids": ids,
        "ownPricingType": $("#own_pricing_type").val(),

      },
      success: function (data) {
        alert("设定成功");
        window.location.href = "/merchant/authority_manager";
      }
    })
  } else {
    alert("自主定价提交失败");
  }

}
/**
 * 设置修改门店积分权限设置
 */
function setIntegalPermissionType() {
  var meta_val = $("[name=store_permission_type]:checked").val();
  var ids = $("[name=member_store_ids]").val();
  $.ajax({
    url: "/merchant/storepermissiontype",
    type: "POST",
    data: {
      "meta_val": meta_val,
      "ids": ids,
      "meta_Type": "integralpermission_type",
    },
    success: function (data) {
      alert("设置成功");
      location.href = '/merchant/authority_manager';
    },
    error: function () {
      alert("设置失败");
    }
  })
}
/**
 * 设置修改门店退款权限设置
 */
function setStoreRefundPermission() {
  var meta_val = $("[name=store_refund_permission_type]:checked").val();
  var ids = $("[name=refund_store_ids]").val();
  $.ajax({
    url: "/merchant/storepermissiontype",
    type: "POST",
    data: {
      "meta_val": meta_val,
      "ids": ids,
      "meta_Type": "store_refund_permission",
    },
    success: function (data) {
      alert("设置成功");
      location.href = '/merchant/authority_manager';
    },
    error: function () {
      alert("设置失败");
    }
  })
}
// /**
//  * 邀请码显示设置
//  */
// function inviteCode() {
//   var compu_showType = 1;
//   var winxin_showType = 1;
//   if ($("#compu_show").attr("checked") == "checked") {
//     compu_showType = $("[name=compu_show] :selected").val();
//   }
//   ;
//   if ($("#wei_show").attr("checked") == "checked") {
//     winxin_showType = $("[name=winxin_show] :selected").val();
//   }
//   ;
//   $.ajax({
//     type: "POST",
//     url: "/merchant/setInviteCode",
//     data: {
//       "compu_showType": compu_showType,
//       "winxin_showType": winxin_showType,
//     },
//     success: function (data) {
//       alert("操作成功");
//       location.href = '/merchant/authority_manager';
//     }
//   })
// }
/**
 * 门店自动分单设置
 */
function order_auto() {
  var orderAssignType = $("input[name=order_assign_type]:checked").val();
  var start_time = $("[name=work_start_time]").val();
  var end_time = $("[name=work_end_time]").val();
  var warehouse = $("[name=select_warehouse_ids]").val();
  var o2oshop = $("[name=select_assign_ids]").val();
  var storeid = $("#store_id").val();
  if (orderAssignType == 130) {
    var start = start_time.split(":");
    var end = end_time.split(":");
    if ((start[0] > end[0] || ((start[0] == end[0]) && (start[1] > end[1])))) {
      alert("结束时间必须大于开始时间");
      return;
    }
  }
  $.ajax({
    url: "/merchant/warehouse",
    data: {
      "orderAssignType": orderAssignType,
      "work_start_time": start_time,
      "work_end_time": end_time,
      "setwarHouse": warehouse,
      "assignids": o2oshop,
      "storeid": storeid,
    },
    type: "POST",
    success: function (data) {
      alert("操作成功");
      location.href = '/merchant/authority_manager';
    },
  });
}


$(function () {
  /**
   * 弹框确定后的操作
   */
  $(".select-store-ok").click(function () {
    var stores_id = "";
    $(".select_stores_list input[name='id']").each(function () {
      stores_id += $(this).val() + ",";
    });
    stores_id = stores_id.substr(0, stores_id.length - 1);
    if (stores_id) {
      $("#select_stores").modal("hide");
    } else {
      layer.alert('请选择至少一个门店！');
    }
    if ($("[name=promission]").val() == 1) {//自主定价
      $('[name="select_price_ids"]').val(stores_id);//这里在页面是隐藏输出input
      $("#KKK").html($(".select_stores_total").html());
    } else if ($("[name=promission]").val() == 2) {//o2o门店
      $('[name="select_assign_ids"]').val(stores_id);
    } else if ($("[name=promission]").val() == 3) {//总仓
      $('[name="select_warehouse_ids"]').val(stores_id);
    } else if ($("[name=promission]").val() == 4) {//会员积分
      $('[name="member_store_ids"]').val(stores_id);
    } else if ($("[name=promission]").val() == 5) {//退款
      $('[name="refund_store_ids"]').val(stores_id);
    } else if ($("[name=promission]").val() == 6) {//修改订单价格（夏鹏）
      $('[name="select_price_idss"]').val(stores_id);
      $("#CCC").html($(".select_stores_total").html());
    } else if ($("[name=promission]").val() == 7) {//盘点权限
      if ($("#select_check_stores").val() == 1) {
        $('[name="select_pandian_stores_ids"]').val(stores_id);
      } else {//以不参加门店进入弹窗
        var storeids = "";
        var selectStoreIds = [];
        var unselectstoreIds = toarray(stores_id);
        $(".stores_list input[name='id']").each(function () {
          selectStoreIds.push($(this).val());
          for (var i = 0; i < unselectstoreIds.length; i++) {
            if ($(this).val() == unselectstoreIds[i]) {
              selectStoreIds.splice(selectStoreIds.length - 1, 1);
            }
          }
        });
        for (var i = 0; i < selectStoreIds.length; i++) {
          storeids += selectStoreIds[i] + ",";
        }
        $('[name="select_pandian_stores_ids"]').val(storeids.substr(0, storeids.length - 1));
      }
      $("#checknum").html($(".select_stores_total").html());
    }
  });
});

var clerk_Box = function () {
  var clerk_ids = "";
  $(".select_clerk_list input[name='id']").each(function () {
    clerk_ids += $(this).val() + ",";
  });
  clerk_ids = clerk_ids.substr(0, clerk_ids.length - 1);
  if (clerk_ids) {
    $("#select_clerk").modal("hide");
  } else {
    layer.alert('请选择至少一个店员！');
  }
  $('[name=clerk_ids]').val(clerk_ids);
}
//盘点工具的选择权限确定
var check_Box = function () {
  var permission_ids = "";
  $.each($("input[name='role_permission']"), function (c, pid) {
    if ($(pid).is(':checked')) {
      permission_ids += $(this).val() + ",";
    }
  });
  if (permission_ids) {
    permission_ids = permission_ids.substr(0, permission_ids.length - 1);
    $('[name=select_pandian_permission_ids]').val(permission_ids);
    $("#select_check_promissions").modal("hide");
  } else {
    layer.alert('请选择至少一个权限！');
  }
}


/**
 * 将字符串切割成数组
 */
function toarray(proids) {
  var ids = [];
  if (proids != "" && proids != null) {
    if (proids.length == 1) {
      ids.push(parseInt(proids));
    } else {
      var t = proids.split(",");
      for (var i = 0; i < t.length; i++) {
        ids.push(parseInt(t[i]));
      }
    }
  }
  return ids;
}
//查询拥有聊天权限的店员
var selectClerkChat = function (clerklist, promissionids) {
  var tmpl = document.getElementById('select_clerk_list_templete').innerHTML;
  var trl;
  if (toarray(promissionids).length > clerklist.length) {
    trl = clerklist.length;
  } else {
    trl = toarray(promissionids).length;
  }
  $(".select_clerk_total").text(trl);
  var tr1 = "";//拥有权限的店员列表
  for (var i = 0; i < clerklist.length; i++) {
    var ds = {};//拥有权限的数组
    if (toarray(promissionids).length > 0) {
      if (toarray(promissionids).indexOf(clerklist[i].id) > -1) {
        ds.id = clerklist[i].id;
        ds.mobile = clerklist[i].mobile;
        ds.name = clerklist[i].name;
        ds.storeName = clerklist[i].storeName;
        var doTtmpl = doT.template(tmpl);
        tr1 += doTtmpl(ds);
      }
    }
  }
  $(".select_clerk_list").empty();
  $(".select_clerk_list").append(tr1);
}

//获取门店所有店员
var selectClerk = function (pageNum) {
  var storeName = $("[name=clerk_store_name]").val().trim();
  var clerk_mobile = $("[name=clerk_mobile]").val().trim();
  var clerk_name = $("[name=clerk_name]").val().trim();
  $.ajax({
    type: "POST",
    url: "/merchant/selectPageAllClerk",
    data: {
      "store_name": storeName,
      "clerk_mobile": clerk_mobile,
      "clerk_name": clerk_name,
      "pageNum": pageNum,
      "pageSize": 13
    },
    success: function (data) {
      $(".clerk_list").empty();
      $(".clerk_total").html(data.total);
      if (data.list.length > 0) {
        var tr = "";
        for (var i = 0; i < data.list.length; i++) {
          tr += "<tr><td width='3%'></td><td style='width:24%'><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
            "<input name='gid' type='checkbox'><span>" + data.list[i].mobile + "</span></label></td><td style='width:33%'><span>" + data.list[i].name + "</span></td>" +
            "<td style='width:30%'>" + data.list[i].storeName + "</td><td><input name='mobile' value='" + data.list[i].mobile + "' type='hidden'>" +
            "<input name='id' value='" + data.list[i].id + "' type='hidden'><input name='name' value='" + data.list[i].name + "' type='hidden'>" +
            "<input name='storeName' value='" + data.list[i].storeName + "' type='hidden'><a href='javascript:void(0)' class='select_clerk_btn'>指定</a>" +
            "</td></tr>";
        }
        $(".clerk_list").append(tr);
      } else {
        $(".clerk_list").append("没有查找到符合条件的店员");
      }
      page(data.pages, data.pageNum);
    },
    error: function () {
      alert("");
    }
  })
}
/**
 * 保存聊天设置权限
 */
var set_clerk_chat = function () {
  var meta_val = $("[name=clerk_chat_type]:checked").val();
  var ids = $("[name=clerk_ids]").val();
  $.ajax({
    type: "POST",
    url: "/merchant/updateClerkChatType",
    data: {
      "chatType": meta_val,
      "ids": ids,
    },
    success: function (data) {
      alert("设置成功");
      location.href = '/merchant/authority_manager';
    },
    error: function () {
      alert("设置失败");
    }
  })
}


var page = function (pages, pageNum) {
  $('.pagination-large').pagination({
    pages: pages,
    styleClass: ['pagination-large'],
    showCtrl: true,
    currentPage: pageNum,
    displayPage: 6,
    onSelect: function (num) {
      selectClerk(num);
    }
  })
  $('.pagination-large').pagination('updatePages', pages);
}

/**
 * 提交门店订单改价权限
 */
function adduppricingtype() {
  var ids = $("[name=select_price_idss]").val();
  if (ids != null && ids != '') {
    $.ajax({
      type: "POST",
      url: "/merchant/uppricingtype",
      data: {
        "ids": ids,
        "upPricingType": $("#up_pricing_type").val(),
      },
      success: function (data) {
        alert("设定成功");
        localStorage.setItem("b", $("#up_pricing_type").find("option:selected").val());
        window.location.href = "/merchant/authority_manager";
      }
    })
  } else {
    alert("设定成功");
    localStorage.setItem("b", $("#up_pricing_type").find("option:selected").val());
    window.location.href = "/merchant/authority_manager";
  }
}

// $(temp).val(a);


//订单改价权限数字切换显示
function shownums() {
  var ids = $("[name=price_idss]").val();
  var num = "";
  if (ids != null && ids != "") {
    num = ids.split(",").length;
    $("#select_stores_total").text("");
    if ($("#up_pricing_type").val() == 1) {
      $("#CCC").text(num);
    } else {
      $("#CCC").text(len - num);
    }
  } else {
    $("#select_stores_total").text("");
    if ($("#up_pricing_type").val() == 1) {
      $("#CCC").text(0);
    } else {
      $("#CCC").text(len);
    }
  }

}
//盘点工具的门店切换
function pandian_change_num() {
  var ids = $("[name=select_pandian_stores_ids]").val();//选中的拥有权限的门店
  var num = "";
  if (ids != null && ids != "") {
    num = ids.split(",").length;
    $("#select_stores_total").text("");
    if ($("#select_check_stores").val() == 1) {
      $("#checknum").text(num);
    } else {
      $("#checknum").text(len - num);
    }
  } else {
    $("#select_stores_total").text("");
    if ($("#select_check_stores").val() == 1) {
      $("#checknum").text(0);
    } else {
      $("[name=select_pandian_stores_ids]").val();
      $("#checknum").text(len);
    }
  }
}
//页面显示盘点工具的权限
function showCheckPermission() {
  $("#permissions").html("");
  $.ajax({
    type: "POST",
    url: "/merchant/check/selectPermissionByTypeName",
    data: {
      "name": "盘点管理",
      "platform": "130",
    },
    success: function (data) {
      var permissions = data.info;//门店下所有盘点的全部信息
      var ss = "";
      $.each(permissions, function (n, permissionType) {
        var tr = "<tr> <td><label class='permission-group-label'><input type='checkbox'value='" + permissionType.id + "' class='pertype'/> " + permissionType.name + "</label></td><td id='permission-group-28'>";
        $.each(permissions[n].permisionList, function (m, permission) {
            tr += "<label class='permission-label'><input type='checkbox'name='role_permission' value='" + permission.id + "'/>" + permission.name + "</label>";
          }
        );
        tr += "</td></tr>";
        ss += tr;
      });
      $("#permissions").append(ss);
      $(".pertype").bind('click', function () {
        var checked_type = this.checked;
        var input_arr = $(this).parent().parent().next().find("input");
        $.each(input_arr, function (i, dom) {
          $(dom).prop('checked', checked_type);
        });
      });
      $.each(toarray($("[name=select_pandian_permission_ids]").val()), function (o, id) {
        $("[name=role_permission] ").each(function () {
          if ($(this).val() == id) {
            $(this).attr("checked", true);
          }
        });
      });
      eachLabel($("#permissions").find("tr").length);
    },
  });
}
/**
 * 保存盘点工具的权限
 */
function savepandianPermission() {
  var storeIds = $("[name=select_pandian_stores_ids]").val();
  var permissionIds = $("[name=select_pandian_permission_ids]").val();
  if (storeIds == "" || permissionIds == "") {
    layer.alert("门店或者门店权限设置不能为空。");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/merchant/check/savecheckpermissions",
    data: {
      storeIds: storeIds,
      permissionIds: permissionIds,
      desc: "盘点管理",
      pandianStoreType: 1,
    },
    success: function (data) {
      if (data == "200") {
        layer.alert("保存成功");
      } else {
        layer.alert("保存失败，请稍候重试");
      }
    },
    error: function () {
      layer.alert("连接失败");
    }
  });
}
function selectUnselectStoreIds(storeIds) {
  $.ajax({
    type: "POST",
    url: "/merchant/check/selectUnselectStoreIds",
    data: {
      "storeIds": storeIds,
    },
    async: false,
    success: function (data) {
      console(data);
      return data;
    }
  });
};
function eachLabel(ll) {//长度
  for (var i = 0; i < ll; i++) {
    var all_td = $('#permissions').children('tr')[i];
    var all_input = $(all_td).children('td').eq(1).find('input');
    var selected = 0;
    for (var s = 0; s < all_input.length; s++) {
      if (all_input[s].checked) {
        selected += 1;
      }
    }
    if (selected == all_input.length && selected != 0) {
      $(all_td).find('.pertype').attr('checked', true);
    }
  }
}













