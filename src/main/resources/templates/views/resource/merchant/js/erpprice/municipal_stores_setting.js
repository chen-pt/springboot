const municipalType = 20;
var municipalStores = [];

var cityPriceObj = {
  create:function () {
    return {
      areaCode: '',
      areaName: '',
      storeIds:[0,0,0,0,0],
      stores: []
    }
  }
}

function addMunicipalStore(index) {
  addPriorityStore(vm.municipalData[index].stores, vm.municipalData[index].storeIds);
}

function deleteMunicipalStore(index,mindex) {
  deletePriorityStore(index,vm.municipalData[mindex].stores,vm.municipalData[mindex].storeIds)
}

function watchMunicipalStore(index,mindex) {
  watchPriorityStore(index,vm.municipalData[mindex],vm.municipalData[mindex].storeIds,vm.generalStores)
}


