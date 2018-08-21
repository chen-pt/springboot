var vm = new Vue({
  el: "#setting",
  data: {
    priceType: '',
    prePriceType: '',
    isJoint: 10,

    generalStores: [],
    generalData: [
      {
        siteId: '',
        type: '',
        storeId: '',
        storeName: '',
        areaCode: 0,
        priority: 100,
      }
    ],
    generalStoreIds: [],

    municipalStores: [],
    municipalData: [],

    districtStores: [],
    districtData: [],

  },
  methods: {
    changePriceType: changePriceType,

    addGeneralStore: addGeneralStore,
    deleteGeneralStore: deleteGeneralStore,
    watchGenrealStore: watchGenrealStore,

    addMunicipalStore: addMunicipalStore,
    deleteMunicipalStore: deleteMunicipalStore,
    watchMunicipalStore: watchMunicipalStore,

    addDistrictStore: addDistrictStore,
    deleteDistrictStore: deleteDistrictStore,
    watchDistrictStore: watchDistrictStore,
    disableAddBtn: function (data) {
      return (data || []).length == 5;
    },

    getPriorityName: getPriorityName,
    storeIsSelect: storeIsSelect,

    createCityPriceObj: function () {
      return cityPriceObj.create()
    },

    // getGeneralStores: getGeneralStores,
    changePriceType: changePriceType,
    addGeneralStore: addGeneralStore,
    deleteGeneralStore: deleteGeneralStore,
    watchGenrealStore: watchGenrealStore,
    storeIsSelect: storeIsSelect,

    getSettingDetail: getSettingDetail,
    saveSetting: saveSetting,
    cancel_erp_setting: cancel_erp_setting,
    // getStoreName: getStoreName,
    isJointButton: isJointButton,

    file_btn: function () {
      return $("#input_file").click();
    },
    batchAddErpPrice: batchAddErpPrice
    // getGeneralStores:getGeneralStores,
  },
  created: function () {
  },
  watch: {},
  mounted: function () {
    getStoresAll().always(function () {
      getSettingDetail();
      $("#setting").show();
    });
  }
})

function file_change(name) {
  $("#file_name").val(name);
};

/**
 * 添加匹配门店
 * @param index
 * @param storeData
 * @param ele
 */
function addPriorityStore(storeData, storeIds) {
  if (storeData.length >= 5) {
    // layer.msg("优先匹配门店最多设置5个")
  } else {
    var erpObj = erppriceObj.createObj();
    erpObj.priority = 100 - storeData.length * 10;
    storeData.splice(storeData.length, 0, erpObj);
    storeIds.splice(storeIds.length, 0, null);
  }
}

/**
 * 删除匹配门店
 * @param index
 * @param storeData
 * @param storeIds
 * @param ele
 */
function deletePriorityStore(index, storeData, storeIds, ele) {
  storeData.splice(index, 1);
  storeIds.splice(index, 1);
  /*
   //将选定的门店id前移
   for(var i = parseInt(index); i<storeIds.length-1; i++){
   storeIds[i] = storeIds[i+1]
   }
   //末尾赋值0
   storeIds[storeIds.length-1] = 0

   //删除元素
   storeData.splice(index,1)
   */
  //调动优先级
  for (var i = index; i < storeData.length; i++) {
    storeData[i].priority = 100 - i * 10
  }
}

/**
 * 监控设定的匹配门店
 * @param index
 * @param storeIds
 * @param storeData
 * @param stores
 */
function watchPriorityStore(index, storeData, storeIds, stores) {
  var store = ''
  var areaCode = ''

  if (vm.priceType == generalType) {
    store = storeData[index]
    store.areaCode = 0

  } else {
    store = storeData.stores[index]
    store.areaCode = storeData.areaCode
  }
  var storeId = storeIds[index]

  if (storeId == 0) {
    store.storeId = 0
    store.storeName = ''
  } else {
    stores.forEach(function (s, index, array) {
      if (s.id == parseInt(storeId)) {
        store.storeId = s.id
        store.storeName = s.name
        store.type = vm.priceType
      }
    })
  }
}

function storeIsSelect(storeIds, storeId) {
  return $.inArray(storeId, storeIds) > -1
}

function getStoresAll() {
  var ajaxs = [];
  ajaxs[0] = changePriceType(generalType);
  ajaxs[1] = changePriceType(municipalType);
  ajaxs[2] = changePriceType(districtType);

  return $.when.apply($, ajaxs);
}

/**
 * 修改价格类型
 * @param priceType
 */
function changePriceType(priceType) {
  if (priceType == generalType && generalStores.length <= 0) {
    return getStores(generalType);
  }
  else if (priceType == municipalType && municipalStores.length <= 0) {
    return getStores(municipalType);
  }
  else if (priceType == districtType && districtStores.length <= 0) {
    return getStores(districtType);
  }
}

/**
 * 请求门店数据
 * @param priceType
 */
function getStores(priceType) {
  return $.post("/merchant/erp/stores",
    {
      areaType: priceType
    },
    function (result) {
      if (result && result.message == 'Success' && result.value) {
        if (priceType == generalType) {
          vm.generalStores = result.value
          generalStores = vm.generalStores
        }
        else if (priceType == municipalType) {
          var cs = JSON.parse(JSON.stringify(result.value))
          if (!vm.municipalData || vm.municipalData.length <= 0) {
            cs.forEach(function (city, index, array) {
              city.storeIds = []
              city.stores = [erppriceObj.createObj()]
            })
          }
          vm.municipalData = cs
          vm.municipalStores = result.value
          municipalStores = vm.municipalStores
        }
        else if (priceType == districtType) {
          var cs = JSON.parse(JSON.stringify(result.value))
          if (!vm.districtData || vm.districtData.length <= 0) {
            cs.forEach(function (city, index, array1) {
              city.countrys.forEach(function (district, index, array2) {
                district.storeIds = []
                district.stores = [erppriceObj.createObj()]
              })
            })
          }
          vm.districtData = cs
          vm.districtStores = result.value
          districtStores = vm.districtStores
        }
      } else {
        layer.msg("获取门店数据失败,type:" + priceType)
      }
    })
}

function getPriorityName(index) {
  var priorityName = ["优先", "二级", "三级", "四级", "五级"]
  return priorityName[index]
}

const types = [10, 20, 30, 40]

function batchAddErpPrice() {

  if (!vm.prePriceType && !($.inArray(vm.prePriceType, types) > -1)) {
    layer.msg("未设置或保存ERP价格对接内容，请设置好后再导入");
    return;
  }
  if (!$("#input_file").val()) {
    layer.alert("请先选择您的erp价格设置文件！");
    return;
  }
  $(".ajax_info").html("正在处理，请稍后.....");
  $(".ajax_info").css("color", "#000");
  var formData = new FormData();
  formData.append('xls_file', $("#input_file")[0].files[0]);
  formData.append('detailTpl', 130);//erp价格
  formData.append("option", "update");
  $.ajax({
    url: "/merchant/import/erpPriceForStore",
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    timeout: 0,
    success: function (data) {
      if (data.message == 'Success') {
        if (data.value.failNum > 8000) {
          $(".ajax_info").css("color", "red");
          $(".ajax_info").html("请勿一次导入超过8000条")
        } else {
          var str = '';
          str = "处理完成，成功<span style='color:#30b08f'> " + (data.value.successNum ? data.value.successNum : 0)
            + "</span>条,其中重复<span style='color:#30b08f'> " + (data.value.repeatMarryNum ? data.value.repeatMarryNum : 0)
            + "</span>条，上传失败<span style='color:#30b08f'> " + (data.value.failNum ? data.value.failNum : 0) + " </span>条。";
          if (data.value.errfileUrl) {
            str += '<a target="_blank" href="' + data.value.errfileUrl + '">下载报表</a>'
          }
          if (data.errorNum == 0) {
            $(".ajax_info").css("color", "#30b08f");
          } else {
            $(".ajax_info").css("color", "red");
          }
          $(".ajax_info").html(str)
        }
      } else {
        $(".ajax_info").html("");
        console.log(data.message);
        layer.alert(data.message);
      }
    },
    error: function (req, status) {
      if (status === 'timeout') {
        layer.confirm('处理超时');
      }
    }
  });

}

function saveSetting() {

  var params = fitlerSetting();
  if (params) {
    $.ajax({
      url: '/merchant/erp/setting/save',
      type: 'post',
      data: JSON.stringify(params),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (result) {
      if (result.status == 'OK') {
        layer.msg("设置成功,请导入(对接)ERP价格")
        setTimeout(function () {
          window.location.reload()
        }, 1000);

      } else {
        layer.msg(result.message ? result.message : result.errorMessage)
      }
    })

  }

}

/**
 * 封装参数数据
 * @returns {string}
 */
function fitlerSetting() {
  var params

  if (vm.priceType == generalType) {
    params = {}
    params.type = generalType
    params.erpPriceSettingDTOs = []
    forGet(vm.generalData, params.erpPriceSettingDTOs)
    if (!params.erpPriceSettingDTOs || params.erpPriceSettingDTOs.length <= 0) {
      layer.msg("请设置优先级门店");
      return '';
    }
  }

  if (vm.priceType == municipalType) {
    params = {}
    params.type = municipalType
    params.erpPriceSettingDTOs = []

    vm.municipalData.forEach(function (mun, index, array) {
      forGet(mun.stores, params.erpPriceSettingDTOs)
    })
    if (!params.erpPriceSettingDTOs || params.erpPriceSettingDTOs.length <= 0) {
      layer.msg("请设置优先级门店");
      return '';
    }
  }

  if (vm.priceType == districtType) {
    params = {}
    params.type = districtType
    params.erpPriceSettingDTOs = []

    vm.districtData.forEach(function (dis, i, array1) {
      dis.countrys.forEach(function (country, j, array2) {
        forGet(country.stores, params.erpPriceSettingDTOs)
      })
    })
    if (!params.erpPriceSettingDTOs || params.erpPriceSettingDTOs.length <= 0) {
      layer.msg("请设置优先级门店");
      return '';
    }
  }

  if (vm.priceType == 40) {
    params = {}
    params.type = 40
    params.erpPriceSettingDTOs = [];
  }

  if (params) {
    params.siteId = ''
    params.isJoint = vm.isJoint
  }

  return params;
}

function forGet(datas, result) {
  datas.forEach(function (data, index, array) {
    if (data.storeId && data.storeId != 0) {
      result.push(data);
    }
  })
}

function getSettingDetail() {
  flag = true;
  while (flag) {
    if (generalStores && municipalStores && districtStores) {
      flag = false;
      $.post("/merchant/erp/setting/detail",
        {},
        function (result) {
          if (result.status == 'OK') {

            vm.prePriceType = result.value.type == -1 ? '' : result.value.type;

            if (vm.prePriceType) {
              vm.priceType = result.value.type;
              vm.isJoint = result.value.isJoint + '';
            }

            if (result.value.type == generalType) {
              stores = result.value.data[0]
              if (stores) {
                vm.generalData = stores
                stores.forEach(function (data, index) {
                  vm.generalStores.forEach(function (store, index, array) {
                    if (store.id == data.storeId) {
                      data.storeName = store.name
                    }
                  })
                  vm.generalStoreIds[index] = data.storeId
                })
              }
            } else if (result.value.type == municipalType) {
              vm.municipalData.forEach(function (mun, index, array) {
                stores = result.value.data[parseInt(mun.areaCode)]
                if (stores) {
                  mun.stores = stores
                  stores.forEach(function (data, index) {
                    vm.generalStores.forEach(function (store, index, array) {
                      if (store.id == data.storeId) {
                        data.storeName = store.name
                      }
                    })
                    mun.storeIds[index] = data.storeId
                  })
                }
              })
            } else if (result.value.type == districtType) {
              vm.districtData.forEach(function (dis, i, array) {
                dis.countrys.forEach(function (country, j, array) {
                  stores = result.value.data[parseInt(country.areaCode)]
                  if (stores) {
                    country.stores = stores;
                    stores.forEach(function (data, index) {
                      vm.generalStores.forEach(function (store, index, array) {
                        if (store.id == data.storeId) {
                          data.storeName = store.name
                        }
                      })
                      country.storeIds[index] = data.storeId
                    })
                  }
                })
              })
            }
          } else {
            layer.msg("详情：  " + result.message ? result.message : result.errorMessage);
          }
        }
      )
    }
  }
}

//开关按钮
function isJointButton() {
  if (vm.isJoint == 20) {
    vm.isJoint = 10
  } else {
    vm.isJoint = 20;
  }
}
//取消当前商户的多价格设置
function cancel_erp_setting() {
  $.ajax({
    url: "/merchant/erp/setting/cancelSetting",
    type: "POST",
    success: function (data) {
      if (data.status == "OK") {
        layer.alert("当前商户多价格设置已取消。");
        setTimeout(function () {
          window.location.reload()
        }, 1000);
      } else {
        layer.alert("取消多价格设置失败。");
      }
    },
    error: function () {
      console.error("取消多价格设置失败");
      layer.alert("取消多价格设置失败。");
    }
  });


}
