(function () {
  require.config({
    baseUrl: '/templates/views/resource/merchant/js',
  });

  var url = window.location.pathname;

  switch (url) {
    case '/merchant/o2o' :
      inito2o();

      initLogistics();
      break;
    // case '/merchant/delivery' :
    //   initLogistics();
    //   break;
    case '/merchant/logisticsEdit'  :
      initLogisticsEdit();
      break;
    case '/merchant/common'   :
      initCommon();
      break;

  }


}());

function dataValidate() {
  $("form").find("input").each(function () {
    //输入的数值验证，两位小数
    if ($(this).attr("data-double")) {
      $(this).keyup(function () {
        var inputv = $(this).val();
        if (/[^0-9\d.?]|^0(?!\.)\d+|^[^\d]|\.\d*\.|\.{2}|0\.00/.test(inputv)) $(this).val("");
        if (/\S{13}/.test(inputv))$(this).val(inputv.substr(0, 12));
        if (/\d*\.\d{3}/.test(inputv))$(this).val(inputv.substr(0, inputv.indexOf(".")+3));
      });
    }
    //输入的数值验证，正整数
    if ($(this).attr("data-integer")) {
      $(this).keyup(function () {
        var inputv = $(this).val();
        ///[^\d]|^0/g
        if (!/^[1-9]\d*$/.test($(this).val()) || /\d{20}/.test($(this).val())) $(this).val("");
        if (/\S{13}/.test(inputv))$(this).val(inputv.substr(0, 12));
        if (/\d*\.\d{3}/.test(inputv))$(this).val(inputv.substr(0, inputv.indexOf(".")+3));
      });
    }
  })
}

function inito2o() {
  require(['logistics_o2o'], function (o2o) {
    //删除
    $('.del-o2o-condition').click(function () {
      o2o.DelCut(this);
    });

    //增加条件事件
    $('.add-o2o-condition').click(function () {
      o2o.AddCut(this);
    });

    $(".save-o2o-btn").click(function () {
      o2o.checkSubmit();
    });

    o2o.o2oInit();

  });

  dataValidate();

}

function initLogistics() {

  require(['logistics_r'], function (logistics) {

    //列表
    logistics.getlist();

    //设为默认
    $(".setDefault").live("click", function () {
      var devl_id = $(this).parents("table").find("input[name='devl_id']").val();

      var datas = {};

      datas.devlId = devl_id;
      datas.siteId = logistics.siteId;

      logistics.setDefault(datas, this);
    });

    //setIsUse
    $(".setIsUse").live("click", function () {

      var devl_id = $(this).parents("table").find("input[name='devl_id']").val();
      var first_price = $(this).parents("table").find("[name='first_price']").val();
      var add_price = $(this).parents("table").find("[name='add_price']").val();
      var is_activation = $(this).val();

      var datas = {};

      datas.devlId = devl_id;
      datas.add_price = add_price;
      datas.first_price = first_price;
      datas.isActivation = is_activation;
      if (datas.first_price == "0" || datas.first_price == "") {
        layer.alert("运费不能为空");
        return false;
      } else {
        if (datas.add_price == "0" || datas.add_price == "") {
          layer.alert("运费不能为空");
          return false;
        } else {
          logistics.setIsActivation(datas);
        }
      }


    });

    //setIsnoUse
    $(".setIsNoUse").live("click", function () {

      var devl_id = $(this).parents("table").find("input[name='devl_id']").val();

      var is_activation = $(this).val();

      var datas = {};

      datas.devlId = devl_id;
      datas.isActivation = is_activation;
      logistics.setIsActivation(datas);
    });

  });
}

function initLogisticsEdit() {
  require(['logistics_r'], function (logistics) {

    //logistics.getProvince(logistics.areaUrl)

    logistics.getLogisticsDetail();

    logistics.showCity();

    logisticsEditEvent();

  });
}

function initCommon() {
  require(['logistics_common'], function (logistics) {
    logistics.getList();
    $(".commonlogis-save").click(function () {
      logistics.updateData();
    });
    $(".addlogcompany").click(function () {
      logistics.saveData();
    });

  });
}

function logisticsEditEvent() {
  require(['logistics_r'], function (logistics) {
    //修改按钮
    $(".change-btn").live("click", function () {

      logistics.clearBox();

      logistics.areaIndex = $(this).index(".change-btn");

      var firstWeight = $(this).parents("tr").find("input[name='firstWeight']").val();
      var firstPrice = $(this).parents("tr").find("input[name='firstPrice']").val();
      var addWeight = $(this).parents("tr").find("input[name='addWeight']").val();
      var addPrice = $(this).parents("tr").find("input[name='addPrice']").val();
      var areaCode = $(this).parents("tr").find("input[name='areaCode']").val();
      var areaName = $(this).parents("tr").find(".specialAreaNames").html();

      $("#new_pointfirstWeight").val(firstWeight);
      $("#new_pointFirstprice").val(firstPrice / 100);
      $("#new_pointaddWeight").val(addWeight);
      $("#new_pointAddprice").val(addPrice / 100);

      $('input[name="hasSelectCity"]').val(areaCode);

      $(".now_area_name").html("<p style='line-height: 10px;margin-top:-5px;margin-bottom: 10px;'>已选地区：</p><p style='margin-top:-7px;'>" + areaName + "</p>");

      logistics.hasSelect();
    });
    //删除
    $(".del-btn").live("click", function () {
      $(this).parents("tr").remove();
    });

    //指定特殊地区运费
    $(".set-special-btn").live("click", function () {

      logistics.areaIndex = -1;

      $(".now_area_name").html("");  //清空已选地区

      $('input[name="hasSelectCity"]').val(""); //清空每条记录的地区id

      logistics.hasSelect(); //禁用掉每条记录的已选地区checkbox

      logistics.clearBox(); //清除所有值
    });

    //省份列表 下拉后出现对应市区
    $(".provinceListBox").live("change", function () {

      var provinceId = $(this).val();

      if (provinceId < 0) { //请选择

        $(".cityListDiv").html("");

        return false;
      }

      logistics.getCityAndFill(provinceId);

    });

    //点击市区后保存下来
    $('input[name="cityName"],input[name="new_pointarea"]').live("click", function () {

      var tmpCityId = $(this).val();

      if (tmpCityId.indexOf("|") > -1) {
        tmpCityId = tmpCityId.split("|");
        tmpCityId = tmpCityId[0];
      }

      var nowSelectCityId = $('input[name="hasSelectCity"]').val();

      var nowSelectCityIdArr = nowSelectCityId.split(",");

      var tmpNewStr = "";

      if ($(this).attr("checked")) {
        var hasExits = false;
        for (var i in nowSelectCityIdArr) {
          if (nowSelectCityIdArr[i] == tmpCityId) {
            hasExits = true;
            break;
          }
        }
        if (!hasExits) {
          tmpNewStr = (nowSelectCityId ? (nowSelectCityId + ",") : nowSelectCityId) + tmpCityId;
        } else {
          tmpNewStr = nowSelectCityId;
        }
      } else {
        for (var i in nowSelectCityIdArr) {
          if (nowSelectCityIdArr[i] != tmpCityId)
            tmpNewStr += nowSelectCityIdArr[i] + ",";
        }
        tmpNewStr = tmpNewStr.substr(0, tmpNewStr.length - 1);
      }
      $('input[name="hasSelectCity"]').val(tmpNewStr);

    });


    //暂存指定地区
    $(".save-area-btn").live("click", function () {

      logistics.saveTmpArea();

    });
    //保存
    $(".save-logistics-btn").live("click", function () {

      var devl_id = $("#devl_id").val();
      var first_weight = $("#firstWeight").val();

      var def_firstprice = $("#defFirstprice").val();

      var add_weight = $("#addWeight").val();

      var def_addprice = $("#defAddprice").val();

      var appoint_firstweight = "";

      var appoint_addweight = "";

      var appoint_firstprice = "";

      var appoint_addprice = "";

      var appoint_area = "";

      var dev_desc = $("#devDesc").val();

      var devl_desc = $("#devlDesc").val();

      $('input[name="firstWeight"]').each(function () {
        appoint_firstweight += parseFloat($(this).val()) + ";";
      });

      $('input[name="addWeight"]').each(function () {
        appoint_addweight += $(this).val() + ";";
      });

      $('input[name="firstPrice"]').each(function () {
        appoint_firstprice += $(this).val() + ";";
      });

      $('input[name="addPrice"]').each(function () {
        appoint_addprice += $(this).val() + ";";
      });

      $('input[name="areaCode"]').each(function () {
        appoint_area += $(this).val() + ";";
      });

      var datas = {};

      datas.devlId = devl_id;

      datas.firstWeight = first_weight;

      datas.addWeight = add_weight;

      datas.defFirstprice = def_firstprice * 100;

      datas.defAddprice = def_addprice * 100;

      datas.appointFirstweight = appoint_firstweight;

      datas.appointAddweight = appoint_addweight;

      datas.appointFirstprice = appoint_firstprice;

      datas.appointAddprice = appoint_addprice;

      datas.appointArea = appoint_area;

      datas.devDesc = dev_desc;

      datas.devlDesc = devl_desc;

      datas.siteId = logistics.siteId;

      if (!datas.firstWeight || !datas.defFirstprice || !datas.addWeight || !datas.defAddprice) {
        layer.msg('提示：价格和重量必须为大于0的数字哟！');
        return false;
      }

      logistics.save(datas);

    });
  });
}
