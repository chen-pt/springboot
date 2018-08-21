require(['common'], function(YBZF) {
  // 隐藏没有的字段
  (function() {
    var detail_tpl = $('#detail_tpl').val();
    var nofields = [];
    nofields['10'] = ['goods_usage', 'forpeople_desc'];
    nofields['40'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
    nofields['80'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
    nofields['60'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
    nofields['30'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
    nofields['50'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
    nofields['70'] = ['goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'bar_code', 'goods_description'];
    nofields['20'] = ['com_name', 'drug_category', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];

    $.each(nofields[detail_tpl], function(k, v) {
      $('#' + v).parents('tr').remove();
    });
  })();

  function getTings() {
    var detail_tpl = $('#detail_tpl').val();
    // 获取设置值
    YBZF.services({
      'url': YBZF.hostname + '/goodssync/getTings',
      'data': {
        'detail_tpl': detail_tpl
      }
    }).done(function(rsp) {
      if( rsp.status && rsp.result.items[0].fields ) {
        var fields = rsp.result.items[0].fields.split(',');
        $.each(fields, function(k, v) {
          $('#' + v).prop('checked', true);
        });
      }
    });
  }
  getTings();

  $(document).on('click', '#save', function() {
    var fields = $('#fields').find('input:checked').map(function() {
      return this.id;
    }).get();

    var detail_tpl = $('#detail_tpl').val();

    YBZF.services({
      'url': YBZF.hostname + '/goodssync/setTings',
      'data': {
        'fields': fields.join(','),
        'detail_tpl': detail_tpl,
        'fields_pk': 'approval_number'
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        layer.msg(rsp.result.msg, function() {
          location.reload();
        });
      } else {
        layer.msg(rsp.result.msg);
      }
    });
  });
});