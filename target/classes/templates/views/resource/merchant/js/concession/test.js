!(function() {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'utils': 'merchant/js/coupon/ll_utils',
    },
  });

  require(['core'], function(core) {
    core.ReConsole();
  });

  let router = {
    'merchant': {
      'concession': {
        'test': test,
      },
    },
  };

  require(['core'], function(core) {
    let controllerAction = core.getControllerActionTernary();
    let t1 = controllerAction[0];
    let t2 = controllerAction[1];
    let t3 = controllerAction[2];
    router[t1][t2][t3]();
  });
})();

function test() {
  fetch('/templates/views/resource/merchant/js/coupon/common/each_goods_discount_box.html').
    then(rep => {
      if (rep.ok) {
        return rep.text();
      } else {
        throw error;
      }
    }).
    then(data => console.log(data));
}
