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
  delpic();
  $("#add_store_btn").click(function () {
    addStore();
  });
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
    gaode_init(1);
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

  /**图片上传**/
  $("#input_file").change(function (e) {
    Array.prototype.forEach.call(e.target.files, function (f) {
      upLoadImg(f);
    });
  });

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
      var areaHtml;
      if (show == 1) {
        areaHtml = "<select id =" + (type == 2 ? 'province' : type == 3 ? 'city' : type == 4 ? 'area' : 'other') + " disabled> <option value='0'>请选择</option> ";
      } else {
        areaHtml = "<select id =" + (type == 2 ? 'province' : type == 3 ? 'city' : type == 4 ? 'area' : 'other') + "> <option value='0'>请选择</option> ";
      }
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
function upLoadImg(f) {
  var formData = new FormData();
  formData.append("file", f);
  $.ajax({
    url: '/common/localpictureUpload',
    type: 'POST',
    success: function (data) {
      console.log(data);
      if (data && data.image && data.image.md5Key) {
        alert("图片上传成功！");
        var imgsrc = "[{'host_id':'a','hash':'" + data.image.md5Key + "','height':" + data.image.height + ",'width':" + data.image.width + "}]";
        $("#upload_img").val(imgsrc);
        var img = "<div class='pic-parent-div'><div class='del-pic hide'>删除</div><img  src='" + _imgConfig.url + data.image.md5Key + ".jpg'" +
          "class='product_img'/></div>";
        $("#upload_file").html(img);
        $(".del-pic").removeClass("hide");

      } else {
        alert("图片上传失败！")
      }
    },
    error: function (data) {
      alert("图片上传失败！")
    },
    data: formData,
    cache: false,
    contentType: false,
    processData: false
  });
}
/**
 * 图片处理
 */
var delpic = function () {
  $(".del-pic").live("click", function () {
    var pic_id = $(this).parent().find("input[name='upload_img']").val();
    if (confirm("您确定删除图片吗？")) {
      $(this).parent().find("img").remove();
      $("#upload_img").val("");
      $(this).addClass("hide");
      $(this).parent().html("<i class='sui-icon icon-touch-plus' onclick=' $(\"#input_file\").click()'></i>"
      )
    }
  });
}


/**
 * 新增门店
 */
var addStore = function () {
  var data = paramValidate();
  if (data != null) {
    $.ajax({
      type: 'POST',
      data: data,
      async: true,
      url: "/merchant/add",
      success: function (e) {
        console.log('edit store:' + e);
        if (e == "300") {
          $.alert({'title': '温馨提示!', 'body': '门店编号已存在，请重新输入！'});
        } else if (e == "500") {
          $.alert({'title': '温馨提示!', 'body': '通讯错误，稍后请重新输入！'});
        } else if (e == "600") {
          $.alert({'title': '温馨提示!', 'body': '该管理账号已存在，请重新输入！'});
        } else if (e == "200") {
          $.alert({'title': '温馨提示!', 'body': '门店信息编辑成功！'});
          window.location.href = "/merchant/store_manager";
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("status:" + XMLHttpRequest.status);
        console.log("state:" + XMLHttpRequest.readyState);
        console.log("text:" + textStatus);
      }
    });
  }

};
/**
 * 参数校验
 */
var paramValidate = function () {
  var data = {};
  var valdata =
    {
      isvalidate: false,
      message: ''
    };

  data.id = $('#store_id').val();

  data.name = $('#store_name').val();

  data.storesNumber = $('#store_number').val();

  data.type = $('input[name="store_type"]:checked').val();

  data.mapFlag = $('#store_tag').val();

  data.province = $("#province [value='" + $("#province").val() + "']").html();
  data.cityId = $("#city").val();
  data.city = $("#city [value='" + data.cityId + "']").html();

  data.regionId = $("#area").val();
  data.country = $("#area [value='" + data.regionId + "']").html();

  data.address = $('#store_address').val();

  data.tel = $('#store_phone').val();

  data.businessTime = $('#store_bustime').val() ? $('#store_bustime').val() : 'NULL';

  data.feature = $('#store_feature').val() ? $('#store_feature').val() : 'NULL';

  data.summary = $('#store_summary').val() ? $('#store_summary').val() : 'NULL';

  var qjd = $('#store_qjd').is(':checked');

  data.isQjd = qjd ? 1 : 0;

  data.storeImgs = $('#upload_img').val();

  data.admin = $('#store_admin').val();

  data.pwd = $('#store_passwd').val();
  data.oldpwd = $("#store_oldpwd").val();
  data.storeAdminId = $("#storeAdmin_id").val();
  data.serviceSupport = '';
  data.selfTokenTime = $('textarea[name="self_token_time"]').val() ? $('textarea[name="self_token_time"]').val() : 'NULL';

  data.deliveryTime = $('textarea[name="delivery_time"]').val() ? $('textarea[name="delivery_time"]').val() : 'NULL';
  var remindMobile = "";

  $('input[name="remind_mobile"]').each(function () {
    if ($(this).val()) {
      remindMobile += $(this).val() + ",";
    }
  });
  remindMobile = remindMobile.substring(0, remindMobile.length - 1);

  var tmpMobile = remindMobile.split(",");

  for (var i = 0, len = tmpMobile.length; i < len; i++) {
    for (var j = 0; j < len; j++) {
      if (i != j && tmpMobile[i] == tmpMobile[j]) {
        $.alert({'title': '温馨提示!', 'body': "接收提醒短信的手机号不能相同！"});
        return null;
      }
      if (tmpMobile[i] && !validate("mobile", tmpMobile[i])) {
        $.alert({'title': '温馨提示!', 'body': "请输入正确的手机号！"});
        return null;
      }
    }
  }
  if ($('[name="order_home_lert"][value="1"]').is(":checked"))
    data.order_lert = "150" + ",";
  if ($('[name="order_store_lert"][value="1"]').is(":checked"))
    data.order_lert += "160" + ",";
  if ($('[name="order_refund_lert"][value="1"]').is(":checked"))
    data.order_lert += "400" + ",";

  data.remindMobile = remindMobile;

  $("input[type='checkbox'][name='service_support']:checked").each(function () {
    if ($(this).val()) data.serviceSupport = data.serviceSupport + $(this).val() + ',';

  });

  if (data.serviceSupport) data.serviceSupport = data.serviceSupport.substr(0, data.serviceSupport.length - 1);


  data.storesStatus = $('input[name="stores_status"]:checked').val();

  data.ownPricingType = $('#own_pricing_type:checked').val() ? 1 : 0;

  data.ownPromotionType = $('#own_promotion_type:checked').val() ? 1 : 0;

  if (data.name == "") {

    valdata.message = '请填写门店名称！';
  } else if (data.storesNumber == "") {

    valdata.message = '请填写门店编号！';
  } else if (!validate('min', data.storesNumber, 0) || !validate('max', data.storesNumber, 30)) {
    valdata.message = '门店编号不能空且不能大于30个字符';
  } else if (data.province == '请选择' || !data.city || data.city == '请选择' || data.country == '请选择') {
    valdata.message = '请选择地区！';
  } else if (data.address == "") {
    valdata.message = '请填写详细地址!';
  } else if (data.tel == "") {

    valdata.message = '请填写联系方式！';
  } else if (data.mapFlag != "1") {
    valdata.message = '没有定位门店坐标。</br>请点击【<span class="sui-text-danger">搜索坐标</span>】或拖拽地图上的【<span class="sui-text-danger">红点</span>】定位坐标后再提交。';
  } else if (data.admin == "") {
    valdata.message = '管理账户不能为空！';
  } else if (data.pwd == "" && data.oldpwd == "") {
    valdata.message = '登录密码不能为空！';
  } else {
    valdata.isvalidate = true;
  }
  searchtag();
  changeAddress(data.province, data.city, data.country, data.address, 1);
  data.lat = $('#store_lat').val();

  data.lng = $('#store_lng').val();

  data.gaodeLat = $('#gaode_lat').val();

  data.gaodeLng = $('#gaode_lng').val();
  if (valdata.isvalidate) {
    return data;
  } else {
    console.log('valdata.message---' + valdata.message);
    $.alert({'title': '温馨提示!', 'body': valdata.message});
    //alert(valdata.message);
    return null;
  }
};

/**
 * 显示编辑页
 */
var showEditStore = function (id) {
  var store_address = '';
  if (id != '' && parseInt(id) > 0) {
    $.ajax({
      type: 'POST',
      data: {"id": id},
      async: false,
      url: "/merchant/selectStoreByStoreKey",
      success: function (data) {
        if (!data.status) {
          var store = data.result;
          store_address = store.province + ' ' + store.city + ' ' + store.country + ' ' + store.address;
          $('#store_name').val(store.name);
          if (store.isQjd) {
            $("#store_qjd").parent().addClass("checked");
            $('#store_qjdlable').prop('class', 'checkbox-pretty inline checked');
          }

          $('#store_number').val(store.storesNumber);
          if (store.type == 1) {
            $('#store_self').attr("checked", true);
            $('#store_other').attr("checked", false);
            $('#store_self').parent().addClass("checked");
            $('#store_other').parent().removeClass("checked");
          } else {
            $('#store_self').attr("checked", false);
            $('#store_other').attr("checked", true);
            $('#store_self').parent().removeClass("checked");
            $('#store_other').parent().addClass("checked");
          }
          console.log("store.stores_status----" + store.storesStatus);
          if (store.storesStatus) {//启用
            $("#status_disab").parent().removeClass("checked");
            $("#status_disab").attr("checked", false);
            $("#status_block").parent().addClass("checked");
            $("#status_block").attr("checked", true);
          } else {//禁用
            $("#status_block").parent().removeClass("checked");
            $("#status_block").attr("checked", false);
            $("#status_disab").parent().addClass("checked");
            $("#status_disab").attr("checked", true);
          }

          if (store.ownPricingType == 1) {
            $("#own_pricing_type").attr("checked", true);
            $("#own_pricing_type").parent().addClass("checked");
          }
          if (store.ownPromotionType == 1) {
            $("#own_promotion_type").attr("checked", true);
            $("#own_promotion_type").parent().addClass("checked");
          }

          $('#store_address').val(store.address);
          $('#gaode_address_hidden').val(store.address);
          $('#baidu_address_hidden').val(store.address);

          $('#store_lat').val(store.baiduLat);

          $('#store_lat_tmp').val(store.baiduLat);

          $('#store_lng').val(store.baiduLng);

          $('#store_lng_tmp').val(store.baiduLng);

          $('#gaode_lat').val(store.gaodeLat);

          $('#gaode_lat_tmp').val(store.gaodeLat);

          $('#gaode_lng').val(store.gaodeLng);

          $('#gaode_lng_tmp').val(store.gaodeLng);

          $('#coordinate_span').html(store.baiduLat + " / " + store.baiduLng);
          if (store.gaodeLat && store.gaodeLng) {
            $('#gaode_coordinate_span').html(store.gaodeLng + " / " + store.gaodeLat);
          } else {
            $('#gaode_coordinate_span').html("0 " + " / " + " 0");
          }

          $('#store_tag').val(store.mapFlag);
          console.log("store.mapFlag---" + store.mapFlag);
          if (store.mapFlag == 1) {
            $('.has_coordinate').removeClass('lee_hide');
            $('.no_coordinate').addClass('lee_hide');
          } else {
            $('.no_coordinate').removeClass('lee_hide');
            $('.has_coordinate').addClass('lee_hide');
          }
          setDefaultArea(store.province, store.city, store.country);

          $('#store_phone').val(store.tel);
          if (store.businessTime != "NULL") {
            $('#store_bustime').val(store.businessTime);
          }
          if (store.feature != "NULL") {
            $('#store_feature').val(store.feature);
          }
          if (store.summary != "NULL") {
            $('#store_summary').val(store.summary);
          }

          if (store.store_admin != '') {
            $('#store_admin').val(store.admin);
            $('#store_admin').attr('disabled', 'disabled');
          }
          $('#store_passwd').val('');
          $("#store_oldpwd").val(store.pwd);
          if (store.storeAdminId != '') {
            $('#storeAdmin_id').val(store.storeAdminId);
          }
          if (store.selfTokenTime && store.selfTokenTime != 'NULL') {
            $('textarea[name="self_token_time"]').val(store.selfTokenTime);
            $('textarea[name="self_token_time"]').next('span').html(store.selfTokenTime.length);
          }
          if (store.deliveryTime && store.deliveryTime != 'NULL') {
            $('textarea[name="delivery_time"]').val(store.deliveryTime);
            $('textarea[name="delivery_time"]').next('span').html(store.deliveryTime.length);
          }
          if (store.remindMobile != 'NULL' && store.remindMobile) {
            var remind_mobile = store.remindMobile.split(",");
            for (var i in remind_mobile) {
              $('input[name="remind_mobile"]').eq(i).val(remind_mobile[i]);
            }
          }
          if (store.order_lert.indexOf("150") > -1) {
            $('[name="order_home_lert"]').attr("checked", true).parent().addClass("checked");
          }
          if (store.order_lert.indexOf("160") > -1) {
            $('[name="order_store_lert"]').attr("checked", true).parent().addClass("checked");
          }
          if (store.order_lert.indexOf("400") > -1) {
            $('[name="order_refund_lert"]').attr("checked", true).parent().addClass("checked");
          }
          if (store.serviceSupport != '' && store.serviceSupport) {
            var services = store.serviceSupport.split(',');
            for (var i = 0, len = services.length; i < len; i++) {
              switch (services[i]) {
                case '150':
                  $('#todoor').attr("checked", true);
                  $('#todoor').parent().addClass("checked");
                  break;
                case '160':
                  $('#since').attr("checked", true);
                  $('#since').parent().addClass("checked");
                  break;
              }
            }
          }
          var content = {};
          if (store.storeImgs) {
            content.images = eval(store.storeImgs);
            if (content.images && content.images.length > 0) {
              var img = "<div class='pic-parent-div'><div class='del-pic hide'>删除</div><img  src='" + _imgConfig.url +
                content.images[0].hash + ".jpg'" +
                "class='product_img'/></div>";
              $("#upload_img").val(store.storeImgs);
              $("#upload_file").html(img);
            }
          }
          if (show == "0") {
            $(".del-pic").removeClass("hide");
          }
          var city = '';
          $('#store_citys select').each(function () {
            city += $(this).find('option:selected').html() + " ";
          });
          console.log("store_address:" + store_address);
          $("#address_hidden_init").val(city + store_address);
          /*baidumap.initStoreMap('edit');
           baidumap.SearchLocation('search', store_address);*/
          /*gaodemap.initMap('edit');
           gaodemap.LocationSearch('search', store_address,0);*/
          gaode_init(store_address);
        } else {
          $.alert({'title': '温馨提示!', 'body': data.result.msg});
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("status:" + XMLHttpRequest.status);
        console.log("state:" + XMLHttpRequest.readyState);
        console.log("text:" + textStatus);
      }
    });

  }
  return store_address;
};


/**
 * tag
 */
var gaode_map = 0;
function gaode_init(val) {

  if (val != 1) {//编辑门店

    if (gaode_map == 0) {
      if ($('#gaode_lng').val() && $('#gaode_lat').val()) {
        gaode_map = 5;
      }
      gaodemap.initMap('edit');

      gaodemap.LocationSearch('search', val, gaode_map);
      gaode_map = parseInt(gaode_map) + 1;
    }

  } else {

    gaodemap.initMap('new');

  }
  $(".gaode_success_show").addClass('hide');

  $('#gaode_coordinate_span').html($('#gaode_lng').val() + " / " + $('#gaode_lat').val());
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
      var tmpArr = [data.result.province[0].areaid, data.result.city[0].areaid, data.result.region[0] ? data.result.region[0].areaid : ""];
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
                } else {
                  getArea(tmpArr[1], area_type);
                }
              })
            } else {
              getArea(tmpArr[0], city_type);
            }
          })
        } else {
          getArea(parent_id_default, province_type);
        }
      }
    }
  });
}

var validate = function (type, obj, value) {
  var validate_result = false;
  var reg;
  switch (type) {
    //验证数字
    case  'member': {
      reg = new RegExp("^[0-9]*$");
      if (reg.test(obj)) {
        validate_result = true;
      }
    }
      ;
      break;
    //验证手机号
    case 'mobile': {
      reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
      if (reg.test(obj)) {
        validate_result = true;
      }
    }
      ;
      break;
    //大于某个数
    case 'gt': {
      if (parseFloat(obj) > parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //小于某个数
    case 'lt': {
      if (parseFloat(obj) < parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //最大长度
    case 'max': {
      if (getStringLength(obj) <= parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //最小长度
    case 'min': {
      if (getStringLength(obj) > parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //汉字
    case 'cmax': {
      if (obj.length != 0) {

        reg = /^[\u4E00-\u9FA5]+$/;

        if (reg.test(obj) && getStringLength(obj) <= parseFloat(value)) {

          validate_result = true;
        }
      }

    }
      ;
      break;
    //汉字
    case 'cmin': {
      if (obj.length != 0) {

        reg = /^[\u4E00-\u9FA5]+$/;

        if (reg.test(obj) && getStringLength(obj) >= parseFloat(value)) {

          validate_result = true;
        }
      }

    }
      ;
      break;
    //身份证
    case 'idcard': {

      var ident = IdentityCodeValid(obj);

      if (ident) {

        validate_result = true;

      }
    }
      ;
      break;
    //邮箱帐号
    case 'email': {

      if (obj.length != 0) {

        reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (reg.test(obj)) {

          validate_result = true;

        }
      }

    }
      ;
      break;
    //qq
    case 'qq': {

      reg = /^\d{5,15}$/;

      if (reg.test(obj)) {

        validate_result = true;
      }

    }
      ;
      break;
  }
  //console.log('type:'+type+'  obj:'+obj+'  val:'+value+ '  result:'+validate_result);
  return validate_result;
};
/**
 * 取字符串长度，包括中文
 * @param
 * @returns {number}
 */
var getStringLength = function (s) {

  var char_length = 0;

  for (var i = 0; i < s.length; i++) {

    var son_char = s.charAt(i);

    encodeURI(son_char).length > 2 ? char_length += 1 : char_length += 0.5;

  }

  console.log(s + " length:" + char_length);

  return char_length;
};













