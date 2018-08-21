/**
 * Created by admin on 2017/3/13.
 */
/**
 * 开始获取省份
 * 和接口传参一样
 * parentId:上一级的areaId, 默认 1（中国）;type:第几级地区分类，country:1,province:2,city:3,area:4.............
 */
var parent_id_default = 1;
var country_type = 1;
var province_type = 2;
var city_type = 3;
var area_type = 4;
var other_type = 5;//尚未定义
var show = 0;
$(document).ready(function () {
  var storeid = GetQueryString("storeid");
  show = GetQueryString("show");
  // if (storeid != null && storeid.toString().length > 0) {
  //   $("#store_id").val(storeid);
  // }
  if (show != null && show.toString().length > 0) {//show为1：查看；show为0：修改
    $("#store_id").val(storeid);
    if (show == 1) {
      $("#store_info div").last().hide();
      $("input").attr("disabled", true);
      $("textarea").attr("disabled", true);
    } else {
      $("#store_admin").attr("disabled", true);
      $(".del-pic").removeClass("hide");
    }

    showEditStore(storeid);
  } else {
    getArea(parent_id_default, province_type);
  }

  /**
   * 省市县监听事件
   */
  $(document).on('change', '#province', function () {
    $("#city").remove();
    $("#area").remove();

    getArea($(this).val(), city_type);
  })

  $(document).on('change', '#city', function () {
    $("#area").remove();
    getArea($(this).val(), area_type);
  })

  $(document).on('change', '#area', function () {
    getArea($(this).val(), other_type)
  })


});

/**
 * 获取省市县
 * @param parent_id
 * @param type
 */
function getArea(parent_id, type) {

  var store_citys = $("#store_citys");

  city_post = $.post("/common/queryAreaByParentId", {

    parentId: parent_id,
    type: type

  }, function (result) {

    var areaList = result.results.areaList;
    if (areaList.length > 0) {
      var areaHtml = "<select id =" + (type == 2 ? 'province' : type == 3 ? 'city' : type == 4 ? 'area' : 'other') + " > <option value='0'>请选择</option> ";

      for (var i = 0; i < areaList.length; i++) {

        var areaModel = areaList[i];

        // if(type = 2){
        //   province_name = areaModel.name;
        // }else if(type = 3 ){
        //   city_name = areaModel.name;
        // }else if ( type = 4){
        //   area_name = areaModel.name;
        // }else{
        //   other_name = areaModel.name;
        // }

        areaHtml += "<option value='" + areaModel.areaid + "'>" + areaModel.name + "</option>";

      }
      areaHtml += "</select>";
      store_citys.append(areaHtml);

      area_status = 1;

    } else {
      area_status = 0;
    }

  });

}
/**
 * url地址解析
 */

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)return unescape(r[2]);
  return null;
}

/**
 * 设置默认地址
 * @param province
 * @param city
 * @param country
 */
var setDefaultArea = function (province, city, country) {
  $("#store_citys").empty();
  var postdata = {};
  postdata.province = province;
  postdata.city = city;
  postdata.country = country;
  $.ajax({
    type: 'POST',
    data: postdata,
    async: true,
    url: "/common/querybyname",
    success: function (data) {
      var tmpArr = [data.result.province[0].areaid, data.result.city[0].areaid, data.result.region[0].areaid];
      if (!data.status) {
        /**
         *   省市区显示判断
         */
        if (tmpArr[0] != 0) {
          getArea(parent_id_default, province_type);
          city_post.done(function () {
            $("#province").val(tmpArr[0]);
            if (tmpArr[1] != 0) {
              getArea(tmpArr[0], city_type);
              city_post.done(function () {
                $("#city").val(tmpArr[1]);
                if (tmpArr[2] != 0) {
                  getArea(tmpArr[1], area_type);
                  city_post.done(function () {
                    $("#area").val(tmpArr[2]);
                    $("#selectChtag").click();
                  })
                }
              })
            }
          })
        }
      }
    }
  });
}
