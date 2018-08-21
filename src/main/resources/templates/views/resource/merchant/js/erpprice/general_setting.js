const generalType = 10;
var generalStores = [];
// var generalstoreIndexs=[];

var erppriceObj = {
  createObj: function () {
    return {
      siteId:'',
      type:'',
      storeId:'',
      storeName: '',
      areaCode:'',
      priority:100,
    }
  }
}

function addGeneralStore() {
  addPriorityStore(vm.generalData, vm.generalStoreIds);
}

function deleteGeneralStore(index) {
  deletePriorityStore(index,vm.generalData,vm.generalStoreIds)
}

function watchGenrealStore(index) {
  watchPriorityStore(index,vm.generalData,vm.generalStoreIds,vm.generalStores)
}

// function getGeneralStores() {
//   var stores = JSON.parse(JSON.stringify(generalStores));
//   generalstoreIndexs.sort();
//   generalstoreIndexs.forEach(function (i,index,array) {
//     stores.splice()
//   })
//   return stores;
// }
