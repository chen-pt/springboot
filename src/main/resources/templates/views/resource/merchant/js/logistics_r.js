define(["dot"], function () {

  var logistics = {};
  logistics.queryListUrl = "/merchant/logisticsList";
  logistics.setDefaultUrl = "/merchant/setDefault";
  logistics.isActivationUrl = "/merchant/isActivation";
  logistics.areaUrl = "/merchant/queryAreaByArgs";
  logistics.getCitiesUrl = "/merchant/getCities";
  logistics.updateDelivery = "/merchant/updateDelivery";

  //取出现在商家已设置的物流模板
  logistics.getlist = function (cityarr) {


    var data = {};
    var urlstr = logistics.queryListUrl;
    $.ajax({
      type: 'POST',
      data: data,
      url: urlstr,
      success: function (data) {
        //var data = JSON.parse(e);

        //data.city = logistics.tmpCitys;

        for (var i in data.result) {
          if (data.result[i].appoint_area && data.result[i].appoint_area != " ") {
            var areaArr = data.result[i].appoint_area.split(';');
            for (var x in areaArr) {
              if (areaArr[x].substr(-1) == ",") {
                areaArr[x] = areaArr[x].substr(0, areaArr[x].length - 1);
              }
              if (areaArr[x] && areaArr[x] != "NULL") {
                logistics.getCities(areaArr[x], "areaName" + i + "_" + x);
              }
            }
          }
        }

        var tpl = $("#list_templete").html();

        var doTtmpl = doT.template(tpl);

        $("#logistshowlist").html(doTtmpl(data));
        if ($('.setIsNoUse').size() - $('.setIsNoUse:checked').size() == 1) {
          $(".setIsNoUse").parent().addClass("readonly");
          $(".setIsNoUse").attr("disabled", true);
        } else {
          $(".setIsNoUse").parent().removeClass("readonly");
          $(".setIsNoUse").attr("disabled", false);
        }

        $(".setIsNoUse").each(function(){//默认的不可暂停
          if($(this).parent().siblings(".setDefault").length == 0){
            $(this).parent().addClass("readonly");
            $(this).attr("disabled", true);
          }
        });

      },
      error: function () {
        console.log("error");
      }

    });
  };

  //设置默认
  logistics.setDefault = function (datas, item) {
    var urlstr = logistics.setDefaultUrl;
    var flag = $(item).parents(".sui-table").children("tbody").children("tr:eq(1)").children("td").children("a").html();
    if(flag){
      alert("请先修改运费")
      return;
    }
    $.post(urlstr, datas, function (data) {
      if (data.status) {

        alert("更新成功！");
        window.history.go(0);
      }
    });
  }

  /**
   * 获取省份城市的名称（通过areaid）
   * @param areaId
   * @returns {{}}
   */
  logistics.getCities = function (areaId, location) {
    var datas = {};
    datas.areaIds = areaId;
    datas.tmpPage = location;
    var urlstr = logistics.getCitiesUrl;

    $.post(urlstr, datas, function (data) {
      if (data.status && data.result.city) {

        var areas = data.result.city;
        var areaIds = "";
        var areaNames = "";

        for (var i in areas) {
          if (areas[i].child_city) {
            areaNames += areas[i].name + "（";
            for (var j in areas[i].child_city) {
              areaIds += areas[i].child_city[j].areaid + ",";
              areaNames += areas[i].child_city[j].name + ",";
            }
            areaNames = areaNames.substr(0, areaNames.length - 1);
            areaNames += "）,";
          } else {
            areaIds += areas[i].areaid + ",";
            areaNames += areas[i].name + ",";
          }
        }
        if (areaNames.substr(-1) == ",") {
          areaNames = areaNames.substr(0, areaNames.length - 1);
        }
        areaIds = areaIds.substr(0, areaIds.length - 1);
        $("." + data.tmpPage).html(areaNames);

      }
    });
  }

  //设置使用暂停
  logistics.setIsActivation = function (datas) {
    var urlstr = logistics.isActivationUrl;
    $.post(urlstr, datas, function (data) {
      if (data.status) {

        alert("更新成功！");
        //location.reload();
        window.history.go(0);
      }
    });

  }

  logistics.setCookie = function (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  };

  logistics.getCookie = function (c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    // var arr = document.cookie.match(new RegExp("(^| )" + c_name + "=([^;]*)(;|$)"));
    // if (arr != null) return decodeURI(arr[2]);
    return "";
  };

  //通过省份获取城市
  logistics.getCityAndFill = function (provinceId) {
    var datas = {};
    datas.parentId = provinceId;

    var urlstr = logistics.areaUrl;

    $.post(urlstr, datas, function (data) {
      if (data.status) {
        var nowSelectCityId = $('input[name="hasSelectCity"]').val();

        data.nowSelectCityId = nowSelectCityId;

        var tpl = $("#city_list_templete").html();

        var doTtmpl = doT.template(tpl);

        $(".cityListDiv").html(doTtmpl(data));

        logistics.hasSelect();
      } else {
        $(".cityListDiv").html("");
      }
    });
  };

  /**
   * 获取省级别的code 及name
   */
  logistics.getProvince = function (urlstr) {
    var data = {};
    data.parentId = 1;
    var cityobj = {};
    var citystr = logistics.getCookie('shop_city');
    if (citystr == "") {
      $.ajax({
        type: 'POST',
        data: data,
        async: false,
        url: urlstr,
        success: function (data) {
          if (data.status == true) {
            for (var i = 0, len = data.result.length; i < len; i++) {
              cityobj[data.result[i].areaid] = data.result[i].name;
            }
            // console.log("hash:"+JSON.stringify(cityobj));
            //取到了存到用户的本地，减少网络请求
            //logistics.setCookie("shop_city", data, 10);
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("status:" + XMLHttpRequest.status);
          console.log("state:" + XMLHttpRequest.readyState);
          console.log("text:" + textStatus);
        }
      });
    } else {
      var data = JSON.parse(citystr);
      for (var i = 0, len = data.result.length; i < len; i++) {
        cityobj[data.result[i].areaid] = data.result[i].name;
      }
    }
    logistics.cityobj = cityobj;
    return cityobj;
  };

  //新增编辑
  logistics.getLogisticsDetail = function () {
    var devl_id = $("#devl_id").val();

    var urlstr = logistics.queryListUrl;
    var datas = {};
    datas.devlId = devl_id;
    $.ajax({
      type: 'POST',
      data: datas,
      async: false,
      url: urlstr,
      success: function (data) {
        var tpl = $("#companylist_templete").html();

        var doTtmpl = doT.template(tpl);

        $("#company_list").html(doTtmpl(data));

        if (data.result[0].appoint_firstprice && data.result[0].appoint_firstprice != 'NULL') {
          var firstWeightArr = data.result[0].appoint_firstweight.split(';');
          var addWeightArr = data.result[0].appoint_addweight.split(';');
          var firstPriceArr = data.result[0].appoint_firstprice.split(';');
          var addPriceArr = data.result[0].appoint_addprice.split(';');
          var areaArr = data.result[0].appoint_area.split(';');

          for (var x in firstPriceArr) {
            if (firstWeightArr[x]) {

              var tmpData = {};

              tmpData.firstWeight = firstWeightArr[x];
              tmpData.addWeight = addWeightArr[x];
              tmpData.firstPrice = firstPriceArr[x];
              tmpData.addPrice = addPriceArr[x];

              var tpl = $("#special_area_date_templete").html();

              var doTtmpl = doT.template(tpl);

              $(".special-area-table tbody").append(doTtmpl(tmpData));

              if (areaArr[x].substr(-1) == ",") {
                areaArr[x] = areaArr[x].substr(0, areaArr[x].length - 1);
              }
              var datasParam = {};
              datasParam.areaIds = areaArr[x];
              datasParam.tmpPage = x;
              var urlstrParam = logistics.getCitiesUrl;

              $.post(urlstrParam, datasParam, function (dataArea) {
                if (dataArea.status && dataArea.result.city) {

                  var areas = dataArea.result.city;
                  var areaIds = "";
                  var areaNames = "";

                  for (var i in areas) {
                    if (areas[i].child_city) {
                      areaNames += areas[i].name + "（";
                      for (var j in areas[i].child_city) {
                        areaIds += areas[i].child_city[j].areaid + ",";
                        areaNames += areas[i].child_city[j].name + ",";
                      }
                      areaNames = areaNames.substr(0, areaNames.length - 1);
                      areaNames += "）,";
                    } else {
                      areaIds += areas[i].areaid + ",";
                      areaNames += areas[i].name + ",";
                    }
                  }
                  areaIds = areaIds.substr(0, areaIds.length - 1);
                  if (areaNames.substr(-1) == ",") {
                    areaNames = areaNames.substr(0, areaNames.length - 1);
                  }
                  $(".specialAreaNames").eq(dataArea.tmpPage).html(areaNames);
                  $('input[name="areaCode"]').eq(dataArea.tmpPage).val(areaIds);
                }

              });

            }

          }
        }

      },
      error: function () {
        console.log("error");
      }
    });
  };

  logistics.showCity = function () {

    ////地区选择
    var cityobj = logistics.getProvince(logistics.areaUrl)

    var pinyiarr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    datas = {
      pinyi: pinyiarr,
      cityList: cityobj
    };

    $.ajax({
      type: 'POST',
      data: {parentId: 1},
      async: false,
      url: logistics.areaUrl,
      success: function (data) {
        if (data.status == true) {
          datas.city = data.result;
        }
      },
      error: function () {
        console.log("error");

      }
    });


    var tpl = $("#fee_templete").html();

    var doTtmpl = doT.template(tpl);

    var html = doTtmpl(datas);

    $("#city_list").html(html);

  };

  logistics.getFirestCodeName = function (urlstr) {
    var obj = [];
    var citystr = logistics.getCookie('shop_city');
    if (citystr == "") {
      $.ajax({
        type: 'POST',
        data: data,
        async: false,
        url: urlstr,
        success: function (data) {
          if (data.status == true) {

            obj = data.result.list;
            //取到了存到用户的本地，减少网络请求
            logistics.setCookie("shop_city", data, 10);

          }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("status:" + XMLHttpRequest.status);
          console.log("state:" + XMLHttpRequest.readyState);
          console.log("text:" + textStatus);
        }
      });
    } else {
      var data = JSON.parse(citystr);
      obj = data.result.list;
    }
    return obj;
  };

  //判断是否被选择过的
  logistics.hasSelect = function () {
    $('input[name="areaCode"]').each(function () {
      //将所有已选地区都禁用掉
      var areaCodeArr = $(this).val();
      var areaCodes = areaCodeArr.split(",");
      for (var k in areaCodes) {
        if (areaCodes[k]) {
          $('#pointid_' + areaCodes[k]).attr('disabled', true);
          $('#disable_' + areaCodes[k]).css('color', 'red');
          $('#pointid_' + areaCodes[k]).parent().addClass('disabled');

          $("#cityId_" + areaCodes[k]).attr('disabled', true);
          $('#cityName_' + areaCodes[k]).css('color', 'red');
          $('#cityId_' + areaCodes[k]).parent().addClass('disabled');
        }
      }

      //解放当前所选的地区
      var nowCodeArr = $('input[name="hasSelectCity"]').val();
      var nowCodes = nowCodeArr.split(",");
      for (var i in nowCodes) {
        if (nowCodes[i]) {
          $("#pointid_" + nowCodes[i]).attr("checked", true);
          $('#pointid_' + nowCodes[i]).attr('disabled', false);
          $('#disable_' + nowCodes[i]).css('color', 'black');

          $('#pointid_' + nowCodes[i]).parent().addClass('checked');
          $('#pointid_' + nowCodes[i]).parent().removeClass('disabled');

          $("#cityId_" + nowCodes[i]).attr("checked", true);
          $('#cityId_' + nowCodes[i]).attr('disabled', false);
          $('#cityName_' + nowCodes[i]).css('color', 'black');

          $('#cityId_' + nowCodes[i]).parent().addClass('checked');
          $('#cityId_' + nowCodes[i]).parent().removeClass('disabled');
        }
      }
    });
  };

  //清除弹框里的内容
  logistics.clearBox = function () {
    $('input[name="new_pointarea"]:checked').each(function () {
      $(this).attr("checked", false);
      $(this).parent().removeClass('checked');
    });

    $('input[name="cityName"]:checked').each(function () {
      $(this).attr("checked", false);
      $(this).parent().removeClass('checked');
    });

    $("#new_pointfirstWeight").val("");
    $("#new_pointFirstprice").val("");
    $("#new_pointaddWeight").val("");
    $("#new_pointAddprice").val("");
  };

  //新增指定地区
  logistics.saveTmpArea = function () {
    $("#alert_msg").html('');

    var tmpData = {};
    tmpData.firstWeight = $("#new_pointfirstWeight").val();
    tmpData.firstPrice = $("#new_pointFirstprice").val() * 100;
    tmpData.addWeight = $("#new_pointaddWeight").val();
    tmpData.addPrice = $("#new_pointAddprice").val() * 100;

    var provinceCode = "";

    var cityCode = $('input[name="hasSelectCity"]').val();

    if (!tmpData.firstWeight || !tmpData.firstPrice || !tmpData.addWeight || !tmpData.addPrice) {
      layer.msg('提示：价格和重量必须为大于0的数字哟！');
      return false;
    }

    if ($('input[name="new_pointarea"]:checked').length < 1 && !cityCode) {
      layer.msg('提示：请选指定地区！');
      return false;
    }

    if ($(".special-area-table").hasClass("lee_hide")) {
      $(".special-area-table").removeClass("lee_hide");
    }

    $('input[name="new_pointarea"]:checked').each(function () {
      provinceCode += $(this).val().split("|")[0] + ",";
    });

    var datas = {};
    datas.areaid = provinceCode + cityCode;

    if (datas.areaid.substr(-1) == ",") {
      datas.areaid = datas.areaid.substr(0, datas.areaid.length - 1);
    }

    var urlstr = logistics.getCitiesUrl;

    datas.areaIds = datas.areaid;

    $.post(urlstr, datas, function (data) {
      if (data.status && data.result.city) {

        var areas = data.result.city;
        var areaIds = "";
        var areaNames = "";

        for (var i in areas) {
          if (areas[i].child_city) {
            areaNames += areas[i].name + "（";
            for (var j in areas[i].child_city) {
              areaIds += areas[i].child_city[j].areaid + ",";
              areaNames += areas[i].child_city[j].name + ",";
            }
            areaNames += "）";
          } else {
            areaIds += areas[i].areaid + ",";
            areaNames += areas[i].name + ",";
          }
        }
        areaIds = areaIds.substr(0, areaIds.length - 1);
        if (areaNames.substr(-1) == ",") {
          areaNames = areaNames.substr(0, areaNames.length - 1);
        } else {
          areaNames = areaNames.substr(0, areaNames.length - 2) + areaNames.substr(areaNames.length - 1, areaNames.length);
        }
        tmpData.areaNames = areaNames;
        tmpData.areaIds = areaIds;
      }

      var tpl = $("#special_area_date_templete").html();

      var doTtmpl = doT.template(tpl);

      var html = doTtmpl(tmpData);

      $("#special-area-box").modal("hide");

      if (logistics.areaIndex > -1) { //-1代表添加 以上为编辑
        $(".special-area-table tbody tr").eq(logistics.areaIndex).replaceWith(html);
      } else {
        $(".special-area-table tbody").append(html);
      }

    });

  };

  logistics.save = function (datas) {

    var url = logistics.updateDelivery;
    $.post(url, datas, function (data) {
      if (data.status) {
        alert("更新成功!");
        // location.href="/merchant/delivery";
        location.href="/merchant/o2o";
      }
    });
  }

  return logistics;
});
