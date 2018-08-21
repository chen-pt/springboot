const districtType = 30;
var districtStores = [];

var districtPriceObj = {
  create:function () {
    return {
      areaCode: '',
      areaName: '',
      countrys: [
        {
          preAreaCode: '',
          preAreaName: '',
          areaCode: '',
          areaName: '',
          storeIds: [0,0,0,0,0],
          stores: []
        }
      ]
    }
  }
}

function addDistrictStore(dindex,mindex) {
  addPriorityStore(vm.districtData[mindex].countrys[dindex].stores, vm.districtData[mindex].countrys[dindex].storeIds);
}

function deleteDistrictStore(index,dindex,mindex) {
  deletePriorityStore(index,vm.districtData[mindex].countrys[dindex].stores,vm.districtData[mindex].countrys[dindex].storeIds)
}

function watchDistrictStore(index,dindex,mindex) {
  watchPriorityStore(index,vm.districtData[mindex].countrys[dindex],vm.districtData[mindex].countrys[dindex].storeIds,vm.generalStores)
}

//计算在当前地区是第几个区
function howAnyCountrys(dindex,mindex) {
  var sum = 0;
  for(var i=0; i< mindex; i++){
    sum += vm.districtData[i].countrys.length;
  }
  sum += dindex
  // console.log(">>>>>>>>>>>>>>>" + sum );
  return sum
}
