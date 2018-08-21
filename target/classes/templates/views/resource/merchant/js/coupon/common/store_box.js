define(['core'], function(core) {
  const storeBox = {};
  let $parent;
  let init = function() {
    storeBox.pageno = 1;
    storeBox.cur_per_page = 15;
    $parent = $('#select_stores');
  };

  init();

  storeBox.commonEvent = function() {
    if ($parent.size() === 0)
      init();

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'select_stores\' 不存在，无法绑定事件');
      else
        console.log('id\'select_stores\' 不唯一，无法绑定事件');

      return;
    }

    // 搜索按钮
    $parent.find('.search_stores_btn').on('click', function() {
      storeBox.show_store_list();
    });

    // 左边栏全选checkbox
    $parent.find('.select_all_stores_btn').on('click', function() {
      var curStatus = $(this).prop('checked') ? true : false;
      $parent.find('.stores_list input[type=\'checkbox\']').each(function() {
        $(this).prop('checked', curStatus);
        curStatus ? $(this).parent().addClass('checked') : $(this).parent().removeClass('checked');
      });
    });

    // 左边栏批量参加
    $parent.find('.putaway_select_stores_btn').on('click', function() {
      $('.stores_list input[type=\'checkbox\']:checked').each(function() {
        var data = {};
        data.stores_number = $(this).parents('td').siblings('.store_info').find('[name="stores_number"]').val();
        data.id = $(this).parents('td').siblings('.store_info').find('[name="id"]').val();
        data.name = $(this).parents('td').siblings('.store_info').find('[name="name"]').val();
        data.service_support = $(this).parents('td').siblings('.store_info').find('[name="service_support"]').val();

        if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
          var tmpl = document.getElementById('select_store_list_template').innerHTML;
          var doTtmpl = doT.template(tmpl);
          $('.select_stores_list').append(doTtmpl(data));
        }
      });
      $('.select_stores_total').html($('.select_stores_list tr').length);
    });

    // 左边栏指定参加
    $parent.find('.select_stores_btn').live('click', function() {
      var data = {};
      data.id = $(this).siblings('[name="id"]').val();
      data.name = $(this).siblings('[name="name"]').val();
      data.service_support = $(this).siblings('[name="service_support"]').val();
      data.stores_number = $(this).parents('tr').find('[name="stores_number"]').val();

      if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {

        var tmpl = document.getElementById('select_store_list_template').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('.select_stores_list').append(doTtmpl(data));
        $('.select_stores_total').html($('.select_stores_list tr').length);
      } else {
        layer.alert('该门店已被选择！');
      }
    });

    // 右边栏全选checkbox
    $parent.find('.unselect_all_stores_btn').on('click', function() {
      var curStatus = $(this).prop('checked') ? true : false;
      $('.select_stores_list input[type=\'checkbox\']').each(function() {
        $(this).prop('checked', curStatus);
        curStatus ? $(this).parent().addClass('checked') : $(this).parent().removeClass('checked');
      });
    });

    // 右边栏批量移除
    $parent.find('.putaway_unselect_stores_btn').on('click', function() {
      $('.select_stores_list input[type=\'checkbox\']:checked').each(function() {
        $(this).parents('.can_del_tr').remove();
      });
      $('.unselect_all_stores_btn').prop('checked', false);
      $('.unselect_all_stores_btn').parent().removeClass('checked');
      $('.select_stores_total').html($('.select_stores_list tr').length);
    });

    // 右边栏指定移除
    $parent.delegate('.unselect_stores_btn', 'click', function() {
      $(this).parent().parent().remove();
      $('.select_stores_total').html($('.select_stores_list tr').length);
    });

    $parent.on('okHide', function() {
      var temp_arr = [];
      $('.select_stores_list input[name=\'id\']').each(function() {
        temp_arr.push($(this).val());
      });

      $parent.find('[name=__storeIds]').val(temp_arr.join(','));
    });
  };

  // 左边栏显示
  storeBox.show_store_list = function() {
    var url = core.getHost() + '/common/storesby';
    var store_name = $('input[name=\'store_name\']').val();
    var store_id = $('input[name=\'store_id\']').val();

    var params = {};
    params.store_name = store_name;
    params.stores_number = store_id;
    params.storesStatus = 1;

    console.log(params);

    $('.stores_list').empty();
    $.post(url, params, function(res) {
      console.log(res);
      if (res.storelist.length > 0) {
        var data = res.storelist;
      }
      var tmpl = document.getElementById('store_list_template').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('.stores_list').html(doTtmpl(data));
      $('.stores_total').html(data ? data.length : 0);
      var selects = $('.select_stores_list').find('tr').length;
      $('.select_stores_total').html(selects);
    });
  };

  storeBox.show_select_list = function(ids) {
    var url = '/store/selectByids';
    var params = {'ids': ids, 'storesStatus': 1};

    require(['utils'], function(utils) {
      utils.doGetOrPostOrJson(url, params, 'get', true, function(data) {
        if (data.code === '000') {
          var idArr = [];
          data.value.map(function(item) {
            var tempObj = {
              'id': item.id,
              'name': item.name,
              'stores_number': item.storesNumber,
              'service_support': item.serviceSupport,
            };
            return tempObj;
          }).forEach(function(item) {
            if (!$('.select_stores_list [name="id"][value="' + item.id + '"]').val()) {
              idArr.push(item.id);
              var tmpl = document.getElementById('select_store_list_template').innerHTML;
              var doTtmpl = doT.template(tmpl);
              $('.select_stores_list').append(doTtmpl(item));
            }
          });

          $('#select_stores input[name=__storeIds]').val(idArr.join(','));
          $('.select_stores_total').html($('.select_stores_list tr').length);
        }
      });
    });
  };

  return storeBox;
});
