!(function() {
  // 结算相关
  define([
    'common',
    'account/list',
    'account/detail',
    'account/setjsr',
    'account/cwjs',
    'autoNumeric'
  ], function(YBZF, listModule, detailmodule, setjsrmodule, cwjs) {
    var page = location.pathname.split('/').slice(-1)[0];
    switch(page) {
      case 'list':
        listModule.init();
        break;
      case 'detail':
        detailmodule.init();
        break;
      case 'setjsr':
        setjsrmodule.init();
        break;
      case 'financesettle':
        cwjs.init();
        break;
    }

  });

}());