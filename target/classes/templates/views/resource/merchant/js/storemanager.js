/**
 * Created by admin on 2017/3/13.
 */

$(function () {
  getstores();
  getAllStore();
  $(document).keyup(function (event) {
    if (event.keyCode == 13) {
      getstores();
    }
  });
  $('#store_list').select2({
    placeholder: '请选择门店',
    allowClear: true,
    "language": {
      "noResults": function () {
        return "暂无数据";
      }
    }
  }); // 初始化插件
  $("#search_store_btn").click(function () {
    pagination_page_no = 1;
    getstores();
  });
});
/**
 * 获取门店列表
 * @param currentPage
 */
var getstores = function () {
  var storename = name($(".store_list").val());
  var stores_number = $("[name=stores_number]").val();
  var type = name($("#storetype").html());//类型
  var storesStatus = name($("#storestatus").html());//状态
  var isQjd = name($("#storeIsQjd").html());//是否旗舰店

  $("#store_table").html('');
  AlertLoading($("#store_table"));

  $.ajax({
    url: "/merchant/getBStoresList",
    type: "POST",
    data: {
      "store_name": storename,
      "stores_number": stores_number,
      "type": type,
      "storesStatus": storesStatus,
      "isQjd": isQjd,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#store_table").empty();
      var tr = "";
      if (data.storelist.list.length > 0) {

        pagination_pages = data.storelist.pages;
        pagination_totals = data.storelist.total;

        for (var i = 0; i < data.storelist.list.length; i++) {
          var store = data.storelist.list[i];
          (store.type == 1) ? storetype = "直营" : storetype = "加盟";
          (store.storesStatus == 0) ? storeStatus = "禁用" : storeStatus = "启用";
          tr += "<tr><td><label data-toggle='checkbox' class='checkbox-pretty inline'><input type='checkbox' " +
            "name='store_id' value='" + store.id + "'><span>" + store.name + "</span></label></td>" +
            "<td>" + store.storesNumber + "</td><td>" + storetype + "</td><td> " + store.province + "&nbsp;&nbsp;" +
            store.city + "&nbsp;&nbsp;" + store.country + "&nbsp;&nbsp;" + store.address +
            "</td><td>" + store.tel + "</td><td>" + storeStatus + "</td><td><a href='/merchant/store_add?storeid=" + store.id + "&show=1' class='sui-btn" +
            " icon-pencil'><i class='sui-icon icon-search'></i></a><a href='/merchant/store_add?storeid=" + store.id + "&show=0' class='sui-btn icon-pencil'>" +
            "<i class='sui-icon icon-edit'></i></a></td></tr>";
        }
        tr += "<tr><td colspan='7'><span class='pageinfo'></span></td></tr>";
        $("#store_table").html(tr);
        addpage(getstores);
      } else {
        $("#store_table").html("<tr><td colspan='7' class='center'>暂无数据</td></tr>");
      }

    }
  })
}
/**
 * 获取所有的门店
 */
function getAllStore() {
  $.ajax({
    url: "/merchant/getBStoresListNoStatus",
    type: "POST",
    data: {
      "pageNum": 1,
      "pageSize": 500,
    },
    success: function (data) {

      if (data.storenames.length > 0) {
        for (var i = 0; i < data.storenames.length; i++) {
          var store = data.storenames[i];
          ArrNameList.push(store.name);
          ArrIdList.push(store.id);
        }

      }
    }
  })
}
/**
 * 启用，禁用按钮点击事件
 * @param num
 */
function clickBtnStatus(num) {
  var ids = "";
  var i = 0;
  $('input[name="store_id"]:checked').each(function () {
    i++;
    ids += $(this).val() + ",";
  });
  var str = "";
  if (num == 1) {
    str = "你确定要启动这" + i + "家店吗？";
  } else {
    str = "你确定要禁用这" + i + "家店吗？";
  }
  if (confirm(str)) {
    $.ajax({
        Type: "POST",
        url: "/merchant/updateStoresStatus",
        data: {
          "storeIds": ids,
          "storeStatus": num
        },
        success: function (data) {
          window.location.href = "/merchant/store_manager";
        }
      }
    )
  }
}

/**
 * 参数判断
 * @param res
 * @returns {*}
 */
function name(res) {
  if ("直营" == res) {
    return 1;
  } else if ("加盟" == res) {
    return 2;
  } else if ("是" == res) {
    return 1;
  } else if ("否" == res) {
    return 0;
  } else if ("启用" == res) {
    return 1;
  } else if ("禁用" == res) {
    return 0;
  } else if ("全部" == res) {
    return null;
  } else {
    return res;
  }
}
