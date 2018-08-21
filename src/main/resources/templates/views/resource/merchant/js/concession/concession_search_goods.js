!(function() {
  // noinspection JSFileReferences
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

  // 定义
  let router = {
    'merchant': {
      'concession': {
        'searchConcessionByGoodsId': searchByGoodsId,
      },
    },
  };

  require(['core'], function(_url) {
    let controllerAction = _url.getControllerActionTernary();
    let t1 = controllerAction[0];
    let t2 = controllerAction[1];
    let t3 = controllerAction[2];
    router[t1][t2][t3]();
  });
})();

function searchByGoodsId() {
  $('form.sui-form > button.search-button').on('click', function() {
    let goodsId = $('form.sui-form > input[name=goodsId]').val();
    if (goodsId) {
      renderTable(goodsId);
    }
  });
}

function renderTable(goodsId) {
  require(['utils'], function(utils) {
    const table = layui.table;
    const layer = layui.layer;

    let url = '/test/findConcessionRuleByGoodsId';
    utils.doGetOrPostOrJson(url, {goodsId: goodsId}, 'get', true, function(data) {
      console.log(data);
      if (data.code === '000' && data.value.length > 0) {
        let EncodeText = doT.template($('#simple-goods-table').text());
        $('#table-position').children().remove();
        $('#table-position').append(EncodeText(data));
        table.init('search-result', {});
      } else if (data.code === '000' && data.value.length === 0) {
        layer.msg('查询不到商品');
      } else {
        layer.msg('查询出现异常');
      }
    });
  }, function() {
    layer.msg('查询出现异常');
  });
}

