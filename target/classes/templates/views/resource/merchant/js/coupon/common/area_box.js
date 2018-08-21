/* -- 这是地区弹窗的通用js代码抽取部分，配合area_box.html使用 -- */
define(['core'], function (core) {
  var areaBox = {}

  areaBox.commonEvent = function () {
    // 点击省份，保存或删除相对应的下一级市Id
    var $parent = $('#area-box')
    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'area-box\' 不存在，无法绑定事件')
      else
        console.log('id\'area-box\' 不唯一，无法绑定事件')

      return
    }

    $parent.delegate('#province_box input[type=checkbox]', 'click.space1', function () {
      var provinceId = $(this).val()
      var $province = $('#area-box #province_box input[type=checkbox][value=' + provinceId + ']')
      if (!$province.parent('.checked').size()) {
        saveCityId(provinceId, getIdArrByParentId(provinceId))
        changeCityCheckStatus(provinceId, true)
      } else {
        saveCityId(provinceId)
        changeCityCheckStatus(provinceId, false)
      }
    })

    // 指定市 模块 选择省份时调取后台并把选中的市区勾选上
    $parent.delegate('#city_box .provinceListBox', 'change', function () {
      var provinceId = $(this).val()
      if (provinceId < 0) { //请选择
        $('.cityListDiv').html('')
        return false
      }

      areaBox.showCityAndChecked(provinceId)
    })

    // 点击市区，保存或删除相对应的市区id，并且对省份的多选框进行同步修改
    $parent.find('#city_box .cityListDiv input[type=checkbox]').live('click', function () {
      var cityId = $(this).val()
      var isChecked = $(this).is(':checked') ? 1 : -1
      var provinceId = $parent.find('#city_box .provinceListBox').val()
      var checkedCitiesSize = $parent.find('#city_box .cityListDiv').children('.checked').size() + isChecked
      var $allCities = $parent.find('#city_box .cityListDiv').children()

      // 勾上，检查省份应该是半选中还是全选中
      var $province = $parent.find('#province_box input[type=checkbox][value=' + provinceId + ']').parent()
      if (!$(this).parent('.checked').size()) {
        addCityIdToInput(cityId)
        if (checkedCitiesSize === $allCities.size()) {
          changeProvinceStatus($province, 'check')
        } else {
          changeProvinceStatus($province, 'halfcheck')
        }
      } else { // 取消，检查省份应该是半选中还是不选中
        delCityIdFromInput(cityId)
        if (checkedCitiesSize === 0) {
          changeProvinceStatus($province, 'uncheck')
        } else {
          changeProvinceStatus($province, 'halfcheck')
        }
      }
    })

  }

  areaBox.showProvince = function () {
    //地区选择
    var cityObj = getIdAndNameByParentId(1)
    var PinYiArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var url = '/merchant/queryAreaByArgs'

    datas = {
      pinyi: PinYiArr,
      cityList: cityObj
    }

    $.ajax({
      type: 'POST',
      data: {parentId: 1},
      async: false,
      url: url,
      success: function (data) {
        if (data.status) {
          datas.city = data.result
        }
      },
      error: function () {
        console.log('error')
      }
    })

    var tpl = $('#area_template').html()
    var doTtmpl = doT.template(tpl)
    var html = doTtmpl(datas)
    $('#city_list').html(html)
  }

  areaBox.showCityAndChecked = function (provinceId) {
    var params = {parentId: provinceId}
    $.post('/merchant/queryAreaByArgs', params, function (data) {
      if (data.status) {
        data.nowSelectCityId = $('#area-box input[name=__cityIds]').val()

        var tpl = $('#city_template').html()
        var doTtmpl = doT.template(tpl)
        $('.cityListDiv').html(doTtmpl(data))
      } else {
        $('.cityListDiv').html('')
      }
    })
  }

  areaBox.showSelectList = function (areaIds) {
    $('#area-box input[name=__cityIds]').val(areaIds)

    var url = 'ybArea/getProvinceIdByCityIds'
    var params = {}
    params.cityIds = areaIds
    require(['utils'], function (utils) {
      utils.doGetOrPostOrJson(url, params, 'get', false, function (data) {
        if (data.code === '000') {
          var result_map = data.value
          for (var i = 0; i < result_map.check.length; i++) {
            $('#area-box #province_box input[name=new_pointarea][value=' + result_map.check[i] + ']').parent().checkbox().checkbox('check')
          }
          for (var i = 0; i < result_map.halfcheck.length; i++) {
            $('#area-box #province_box input[name=new_pointarea][value=' + result_map.halfcheck[i] + ']').parent().checkbox().checkbox('halfcheck')
          }
        }
      })
    })
  }

  return areaBox
})

/**
 * 改变省份选择状态，其中半选中实际上是不选中状态
 * @param status ‘check', 'halfcheck', 'uncheck'
 */
function changeProvinceStatus ($target, status) {
  switch (status) {
    case 'check':
    case 'uncheck':
      $target.checkbox().checkbox(status)
      break
    case 'halfcheck':
      $target.checkbox().checkbox('uncheck')
      $target.checkbox().checkbox('halfcheck')
      break
    default:
      layer.msg('changeProvinceStatus 需要的参数是\'check\', \'halfcheck\', \'uncheck\'')
      return
  }
}

/**
 * 通过父id获取相对应的下一级地区的Id和name等信息
 */
function getIdAndNameByParentId (parentId) {
  var url = '/merchant/queryAreaByArgs'
  var cityObj = {}
  var param = {}
  param.parentId = parentId

  $.ajax({
    type: 'POST',
    data: param,
    async: false,
    url: url,
    success: function (data) {
      if (data.status) {
        for (var i = 0, len = data.result.length; i < len; i++) {
          cityObj[data.result[i].areaid] = data.result[i].name
        }
      }
    },
    error: function () {console.log('error')}
  })

  return cityObj
}

function getIdArrByParentId (parentId) {
  var url = '/merchant/queryAreaByArgs'
  var cityObj = []
  var param = {}
  param.parentId = parentId

  $.ajax({
    type: 'POST',
    data: param,
    async: false,
    url: url,
    success: function (data) {
      if (data.status) {
        for (var i = 0, len = data.result.length; i < len; i++) {
          cityObj.push(data.result[i].areaid)
        }
      }
    },
    error: function () {console.log('error')}
  })

  return cityObj
}

function addCityIdToInput (cityId) {
  var $cityIds = $('#area-box input[name=__cityIds]')

  if ($cityIds.val()) {
    var cityIdArr = $cityIds.val().split(',')
    if (cityIdArr.indexOf(cityId.toString()) === -1)
      cityIdArr.push(cityId)
    $cityIds.val(cityIdArr.join(','))
  } else {
    $cityIds.val(cityId)
  }
}

function delCityIdFromInput (cityId) {
  var $cityIds = $('#area-box input[name=__cityIds]')

  if ($cityIds.val()) {
    var cityIdArr = $cityIds.val().split(',')
    var temp_index = cityIdArr.indexOf(cityId.toString())
    if (temp_index !== -1)
      cityIdArr.splice(temp_index, 1)
    $cityIds.val(cityIdArr.join(','))
  }
}

/**
 * 把选中的市Id保存在 $("#area-box input[name=__cityIds]")，会先删除所有provinceId的下一次市Id，然后保存cityIdArr中的cityId
 * @param provinceId
 * @param cityIdArr
 */
function saveCityId (provinceId, cityIdArr) {
  var $cityIds = $('#area-box input[name=__cityIds]')
  if (!cityIdArr) cityIdArr = []

  var oldCityIds = $cityIds.val()
  if (oldCityIds) {
    oldCityIds = oldCityIds.split(',')
  } else {
    oldCityIds = []
  }

  var cityByProvinceId = getIdArrByParentId(provinceId)
  var newCityIds = oldCityIds.filter(function (value, index) {
    return cityByProvinceId.indexOf(parseInt(value)) === -1
  }).concat(cityIdArr)
    .join(',')

  $cityIds.val(newCityIds)
}

/**
 * 改变省份的同时，改变市区的选中状态
 * @param provinceId
 * @param boolean true代表省份被选择，反之则取消选中
 */
function changeCityCheckStatus (provinceId, boolean) {
  var $parent = $('#area-box')
  var selectedProvinceId = $parent.find('#city_box .provinceListBox').val()
  if (selectedProvinceId && parseInt(selectedProvinceId) === parseInt(provinceId))
    if (boolean)
      $parent.find('#city_box .cityListDiv').children().checkbox().checkbox('check')
    else
      $parent.find('#city_box .cityListDiv').children().checkbox().checkbox('uncheck')
}
