/**
 * Created by Administrator on 2017/3/21.
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
var city_post;

// var country_name;
// var province_name;
// var city_name;
// var area_name;
// var other_name;//尚未定义


$(function () {

  /**
   * 省监听事件
   */
  $(document).on('change','#province',function () {
    $("#city").remove();
    $("#area").remove();

    if($(this).val() == 0||$(this).val() == '0'){
      return;
    }

    getArea($(this).val(),city_type,0);
  })

  /**
   * 市监听事件
   */
  $(document).on('change','#city',function () {
    $("#area").remove();

    if($(this).val() == 0||$(this).val() == '0'){
      return;
    }

    getArea($(this).val(),area_type,0);
  })

  /**
   * 区监听事件
   */
  $(document).on('change','#area',function () {
    if($(this).val() == 0||$(this).val() == '0'){
      return;
    }
    getArea($(this).val(),other_type,0)
  })
})

/**
 * 获取省市县
 * @param parent_id
 * @param type
 */
function  getArea(parent_id,type){

  var store_citys = $("#store_citys");

  city_post = $.post("/common/queryAreaByParentId",{

    parentId:parent_id,
    type:type

  },function (result) {

    var areaList = result.results.areaList;
    if(areaList.length > 0 ){
      var areaHtml= "<select id ="+ (type == 2 ? 'province' : type == 3 ? 'city' : type==4 ? 'area': 'other') + " > <option value='0'>请选择</option> ";

      for(var i = 0;i<areaList.length;i++ ){

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

        areaHtml += "<option value='"+ areaModel.areaid +"'>"+ areaModel.name +"</option>";

      }
      areaHtml += "</select>";
      store_citys.append(areaHtml);

      area_status = 1;

    }else{
      area_status = 0;
    }

  });



}
