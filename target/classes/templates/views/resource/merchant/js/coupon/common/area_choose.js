/**
 * Created by Administrator on 2017/11/2.
 */
define(['core'], function(core) {
  var area_choose = {};

  area_choose.commonEvent = function() {
    //显示主页省份
    area_choose.showProvince();

    area_choose.bindEvents();

    //省份列表 下拉后出现对应市区
    $('.provinceListBox_store').live('change', function() {
      var provinceId = $(this).val();

      if (provinceId < 0) { //请选择
        $('.cityListDiv_store').html('');
      }
      area_choose.getCityAndFill(provinceId);
    });
  };

  /**
   * 通过父id获取相对应的下一级地区的Id和name等信息
   */
  area_choose.getIdAndNameByParentId = function(parentId) {
    var url = '/merchant/queryAreaByArgs';
    var cityObj = {};
    var param = {};
    param.parentId = parentId;

    $.ajax({
      type: 'POST',
      data: param,
      async: false,
      url: url,
      success: function(data) {
        if (data.status) {
          for (var i = 0, len = data.result.length; i < len; i++) {
            cityObj[data.result[i].areaid] = data.result[i].name;
          }
        }
      },
      error: function() {console.log('error');},
    });

    return cityObj;
  };

  area_choose.getIdAndNameByParentId_change = function(parentId) {
    var url = '/merchant/queryAreaByArgs';
    var cityObj = [];
    var param = {};
    param.parentId = parentId;

    $.ajax({
      type: 'POST',
      data: param,
      async: false,
      url: url,
      success: function(data) {
        if (data.status) {
          for (var i = 0, len = data.result.length; i < len; i++) {
            cityObj[i] = data.result[i].areaid;
          }
        }
      },
      error: function() {console.log('error');},
    });

    return cityObj;
  };

  //通过省份获取城市
  area_choose.getCityAndFill = function(provinceId) {
    var datas = {};
    datas.parentId = provinceId;

    var urlstr = '/merchant/queryAreaByArgs';

    $.post(urlstr, datas, function(data) {
      if (data.status) {
        showCityByProvinceId(data);
      } else {
        $('.cityListDiv_store').html('');
      }

    });
  };
  area_choose.showProvince = function() {
    //地区选择
    var cityObj = getIdAndNameByParentId(1);
    console.log(cityObj);
    var PinYiArr = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'];
    var url = '/merchant/queryAreaByArgs';

    datas = {
      pinyi: PinYiArr,
      cityList: cityObj,
    };

    $.ajax({
      type: 'POST',
      data: {parentId: 1},
      async: false,
      url: url,
      success: function(data) {
        if (data.status) {
          datas.city = data.result;
        }
      },
      error: function() {
        console.log('error');
      },
    });

    var tpl = $('#area_template_store').html();
    var doTtmpl = doT.template(tpl);
    var html = doTtmpl(datas);
    $('#city_list_store').html(html);
  };

  area_choose.bindEvents = function() {
    $('input[name="new_pointarea_store"]').each(function() {
      $(this).click(function() {
        var check_class = $(this).parent().prop('class');
        var time_check = $(this);
        window.setTimeout(function() {
          //未选中
          unchecked(check_class, time_check);
          checked(check_class, time_check);
          if (check_class == 'checkbox-pretty inline halfchecked') {
            time_check.parent().prop('class', 'checkbox-pretty inline checked');
          }
        }, 1);
      });
    });
  };

  //工具方法
  //删除两个数组相同的部分
  var array_diff = function(a, b) {
    for (var i = 0; i < b.length; i++) {
      for (var j = 0; j < a.length; j++) {
        if (a[j] == b[i]) {
          a.splice(j, 1);
          j = j - 1;
        }
      }
    }
    return a;
  };
  //------------------
  //未选中or半选
  function unchecked(check_class, time_check) {
    if (check_class == 'checkbox-pretty inline' || check_class == 'checkbox-pretty inline halfchecked') {
      var pid = time_check.val();
      var city_list = area_choose.getIdAndNameByParentId_change(pid);
      var cityId = $('.now_area_name_store').html();
      var arr = cityId.split(',');
      var result = [];
      var arr_add = '';
      if (cityId != '') {
        result = array_diff(city_list, arr);
        for (var i = 0; i < result.length; i++) {
          if (result[i] != '')
            arr_add += result[i] + ',';
        }
      } else {
        for (var i = 0; i < city_list.length; i++) {
          arr_add += city_list[i] + ',';
        }
      }
      //回显后的数据，最后没有逗号，需要加上
      if (cityId.lastIndexOf(',') != (cityId.length - 1)) {
        cityId += ',';
      }
      cityId += arr_add;
      $('.now_area_name_store').html(cityId);
      var province = $('.provinceListBox_store').val();
      if (province == pid) {
        for (var i = 0; i < city_list.length; i++) {
          $('#cityId_store_' + city_list[i]).parent().prop('class', 'checkbox-pretty checked');
        }
      }
    }
  }

  //----------------------
  //选中
  function checked(check_class, time_check) {
    if (check_class == 'checkbox-pretty inline checked') {
      var arr_check = $('.now_area_name_store').html().split(',');
      var pid = time_check.val();
      var city_list = area_choose.getIdAndNameByParentId_change(pid);
      var result = array_diff(arr_check, city_list);
      var arr = '';
      for (var i = 0; i < result.length; i++) {
        arr += result[i] + ',';
      }
      $('.now_area_name_store').html(arr.substring(0, arr.length - 1));
      var province = $('.provinceListBox_store').val();
      if (province == pid) {
        for (var i = 0; i < city_list.length; i++) {
          $('#cityId_store_' + city_list[i]).parent().prop('class', 'checkbox-pretty');
        }
      }
    }
  }

  //-------
  //通过省展示城市
  function showCityByProvinceId(data) {
    var nowSelectCityId = $('.now_area_name_store').html();

    data.nowSelectCityId = nowSelectCityId;

    var tpl = $('#city_template_store').html();

    var doTtmpl = doT.template(tpl);

    $('.cityListDiv_store').html(doTtmpl(data));
    $('input[name=cityName_stores]').each(function() {
      $(this).click(function() {
        var status = $(this).parent().prop('class');
        if (status == 'checkbox-pretty') {
          //未选择状态，被点击
          var cityId = $('.now_area_name_store').html();
          var arr = cityId.split(',');
          var area = $(this).val();
          var arr_add = '';
          if ('' == cityId) {
            //第一次
            $('.now_area_name_store').html(cityId + area + ',');
          } else {
            //回显后的数据，最后没有逗号，需要加上
            if (cityId.lastIndexOf(',') != (cityId.length - 1)) {
              cityId += ',';
            }
            if (cityId.indexOf(area) == -1) {
              $('.now_area_name_store').html(cityId + area + ',');
            }
          }
          var totalLen = $('input[name=cityName_stores]').length;
          var len = $('#city_box_stores .checkbox-pretty.checked').length;
          var key = $('.provinceListBox_store').val();
          //在依次基础上+1  因为此次点击还未完成，所以没有统计到
          if (++len > 0 && totalLen != len) {
            $('#pointid_store_' + key).parent().prop('class', 'checkbox-pretty inline halfchecked');
          } else if (totalLen == len && len != 0) {
            $('#pointid_store_' + key).parent().prop('class', 'checkbox-pretty inline checked');
          }
        }
        if (status == 'checkbox-pretty checked') {
          var arr_stores = $('.now_area_name_store').html().split(',');
          var area = [0];
          area[0] = $(this).val();
          arr_stores = array_diff(arr_stores, area);
          var arr = '';
          for (var i = 0; i < arr_stores.length; i++) {
            if (arr_stores != '')
              arr += arr_stores[i] + ',';
          }
          $('.now_area_name_store').html(arr.substring(0, arr.length - 1));
          var len = $('#city_box_stores .checkbox-pretty.checked').length;
          var totalLen = $('input[name=cityName_stores]').length;
          var key = $('.provinceListBox_store').val();
          if (--len < totalLen && len != 0) {
            $('#pointid_store_' + key).parent().prop('class', 'checkbox-pretty inline halfchecked');
          } else if (len == 0) {
            $('#pointid_store_' + key).parent().prop('class', 'checkbox-pretty inline');
          }
        }

      });
    });
  }

  //-------------------
  return area_choose;

});
