!(function () {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'distributor': 'merchant/js/distribution/distributor',
      'vue': 'public/vue'
    }
  });
  require(['core'], function (core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();

  });
  var url = window.location.pathname;
  var action = url.replace(/\/merchant\/(.*)/, function (_, $1) {
    return $1.replace('/', '_');
  });
  var router = {
    'merchant': {
      'distributorManager': distributorList,
      'distributorEdit':initDistributorEdit
    }
  };

  require(['core'], function (ybzf) {
    var controllerAction = ybzf.getControllerAction();

    var controller = controllerAction[0];
    var action = controllerAction[1];
    $('#detail_tpl').val(ybzf.getUrlParam('type') || 20);
    router[controller][action]();
  });
})();


function distributorList() {
  
  require(['distributor'], function (distributor) {
    distributor.getDistributorList();
    $(document).on('change','.page_size_select',function () {
      distributor.setPageSize($(this).val())
    })
  });
}

function initDistributorEdit() {
  require(['distributor'], function (distributor) {
    distributor.distributorEdit();
  });
}

