/* -- 这是商品弹出框通用部分的代码抽取,配合goods_box.html使用 -- */
define(['core', 'category_choose', 'utils'], function(core, category_choose, utils) {
  const goodsBox = {};
  let init = function() {
    goodsBox.pageno = 1;
    goodsBox.cur_per_page = 15;
    goodsBox.$parent = $('#much_select_goods');
    goodsBox.$parent.find('#cate_box').category();
  };

  init();

  let tab = 'goodsBoxTabOne';

  // 通用事件绑定
  goodsBox.commonEvent = function() {
    if (goodsBox.$parent.size() === 0)
      init();

    if (goodsBox.$parent.size() !== 1) {
      if (goodsBox.$parent.size() === 0)
        console.log('id\'much_select_goods\' 不存在，无法绑定事件');
      else
        console.log('id\'much_select_goods\' 不唯一，无法绑定事件');

      return;
    }

    // 标签切换
    goodsBox.$parent.find('#add-goods-nav a').on('click', function() {
      var presentTab = $(this).attr('href').slice(1);
      // 清数据
      if (presentTab !== tab) {
        if (tab === 'goodsBoxTabOne') {
          goodsBox.$parent.find('input[name=__goodsIds]').val('');
          goodsBox.$parent.find('#goodsBoxTabOne table.select_goods_list').html('');
          goodsBox.$parent.find('#goodsBoxTabOne span.select_goods_total').html(0);
          $('#select_goods_num').html(0);
        } else if (tab === 'goodsBoxTabTwo') {
          goodsBox.$parent.find('input[name=__goodsIds]').val('');
          goodsBox.$parent.find('#goodsBoxTabTwo #importCount').html(0);
          goodsBox.$parent.find('#goodsBoxTabTwo #importSuccessCount').html(0);
          goodsBox.$parent.find('#goodsBoxTabTwo #upload_goods_list').html(0);
          goodsBox.$parent.find('#goodsBoxTabTwo #importFileCount').html(0);
          $('#select_goods_num').html(0);
        } else {
          // doNothing
        }
        tab = presentTab;
      }
    });

    // 搜索
    goodsBox.$parent.find('.search_goods_btn').on('click', function() {
      goodsBox.show_goods_list();
    });

    // 商品全选
    goodsBox.$parent.find('#select_all_goods_btn').on('change', function() {
      var $selectGoods = goodsBox.$parent.find('.goods_list').find('input[name=gid]');
      if ($(this).is(':checked')) {
        for (var i = 0; i < $selectGoods.size(); i++) {
          $selectGoods.eq(i).prop('checked', true);
          $selectGoods.eq(i).parent().addClass('checked');
        }
      } else {
        for (var i = 0; i < $selectGoods.size(); i++) {
          $selectGoods.eq(i).prop('checked', false);
          $selectGoods.eq(i).parent().removeClass('checked');
        }
      }
    });

    // 商品批量参加
    goodsBox.$parent.find('.select_all_goods').on('click', function() {
      goodsBox.$parent.find('.goods_list').find('input[name=gid]:checked').each(function() {
        var $div = $(this).parent().parent().nextAll().eq(1);
        var data = {};
        data.goods_id = $div.find('[name="goods_id"]').val();
        data.goods_title = $div.find('[name="goods_title"]').val();
        data.goods_code = $div.find('[name="goods_code"]').val();
        data.shop_price = $div.find('[name="shop_price"]').val();
        data.disc_price = $div.find('[name="disc_price"]').val();
        var type = goodsBox.$parent.find('input[name=__showGoodsType]').val();
        goodsBox.selectGoods(data, type);
      });
    });

    // 商品参加
    goodsBox.$parent.find('.select_goods_btn').live('click', function() {
      var data = {};
      data.goods_id = $(this).parent().find('[name="goods_id"]').val();
      data.goods_title = $(this).parent().find('[name="goods_title"]').val();
      data.goods_code = $(this).parent().find('[name="goods_code"]').val();
      data.shop_price = $(this).parent().find('[name="shop_price"]').val();
      data.disc_price = $(this).parent().find('[name="disc_price"]').val();
      var type = goodsBox.$parent.find('input[name=__showGoodsType]').val();
      goodsBox.selectGoods(data, type);
    });

    // 参加活动商品全选
    goodsBox.$parent.find('#remove_all_goods_btn').on('change', function() {
      var $selectGoods = goodsBox.$parent.find('.select_goods_list').find('input[name=gid]');
      if ($(this).is(':checked')) {
        for (var i = 0; i < $selectGoods.size(); i++) {
          $selectGoods.eq(i).prop('checked', true);
          $selectGoods.eq(i).parent().addClass('checked');
        }
      } else {
        for (var i = 0; i < $selectGoods.size(); i++) {
          $selectGoods.eq(i).prop('checked', false);
          $selectGoods.eq(i).parent().removeClass('checked');
        }
      }
    });

    // 商品批量移除
    goodsBox.$parent.find('#remove_all_goods').on('click', function() {
      var goodsIdArr = goodsBox.$parent.find('input[name=__goodsIds]').val().split(',');

      goodsBox.$parent.find('.select_goods_list').find('input[name=gid]:checked').each(function() {
        var $div = $(this).parent().parent().nextAll().eq(1);
        var goodsId = $div.find('[name=goods_id]').val();
        $(this).parent().parent().parent().remove();

        $.each(goodsIdArr, function(index, value) {
          if (value == goodsId) {
            goodsIdArr = goodsIdArr.slice(0, index).concat(goodsIdArr.slice(index + 1));
            return false;
          }
        });
      });
      goodsBox.$parent.find('input[name=__goodsIds]').val(goodsIdArr.join(','));

      goodsBox.$parent.find('.select_goods_total').html(goodsBox.$parent.find('.select_goods_list tr').length);
      $('#select_goods_num').html(goodsBox.$parent.find('.select_goods_list tr').length);
    });

    // 商品移除
    goodsBox.$parent.find('.unselect_goods_btn').live('click', function() {
      var goodsId = $(this).parent().find('[name=goods_id]').val();
      $(this).parents('.can_del_tr').remove();

      var goodsIdArr = goodsBox.$parent.find('input[name=__goodsIds]').val().split(',');
      $.each(goodsIdArr, function(index, value) {
        if (value == goodsId) {
          goodsIdArr = goodsIdArr.slice(0, index).concat(goodsIdArr.slice(index + 1));
          return false;
        }
      });
      goodsBox.$parent.find('input[name=__goodsIds]').val(goodsIdArr.join(','));

      goodsBox.$parent.find('.select_goods_total').html(goodsBox.$parent.find('.select_goods_list tr').length);
      $('#select_goods_num').html(goodsBox.$parent.find('.select_goods_list tr').length);
    });

    // 商品导入
    goodsBox.$parent.find('#upload').click(function() {
      goodsBoxUploadGoods(goodsBox.$parent);
    });

    // 商品导入确认
    goodsBox.$parent.find('#sure_my_choose').on('click', function() {
      if ($.trim(goodsBox.$parent.find('#upload_goods_list').html()) != '') {
        var str = goodsBox.$parent.find('[name=__goodsIds]').val();
        if (str != '') {
          $('#much_select_goods').modal('hide');
          layer.msg('批量导入成功！');
        } else {
          layer.msg('保存失败，没有可成功导入的商品');
        }
      } else {
        layer.msg('请不要导入空的模板');
      }
    });

    eventsAboutEachGoods(goodsBox.$parent);
  };

  // 初始化商品弹出框左边栏数据和搜索按钮的方法
  goodsBox.show_goods_list = function() {
    //分类
    var cate_code = goodsBox.$parent.find('#cate_box').find('input').val();

    // 名称
    var goods_name = goodsBox.$parent.find('input[name=\'good_name\']').val();

    // 标题
    var goods_title = goodsBox.$parent.find('input[name=\'much_search_input\']').val();

    //商品编码
    var goods_code_disc = goodsBox.$parent.find('input[name=\'goods_code_disc\']').val();
    var $selected_model = goodsBox.$parent.find('#box_menu').find('[class=active] a').attr('value');
    //现价
    var goods_price_s = goodsBox.$parent.find('input[name=\'goods_price_s\']').val() ? goodsBox.$parent.find(
      'input[name=\'goods_price_s\']').val().trim() * 100 : 0;
    var goods_price_b = goodsBox.$parent.find('input[name=\'goods_price_b\']').val() ? goodsBox.$parent.find(
      'input[name=\'goods_price_b\']').val().trim() * 100 : 99999999;
    var goods_price = goods_price_s + ',' + goods_price_b;

    var url = core.getHost() + '/merchant/bgoodsList';

    var params = {};
    params.startRow = goodsBox.pageno;
    params.pageSize = goodsBox.cur_per_page;

    params.goodsStatus = 1;
    params.userCateid = cate_code > 0 ? cate_code : '';
    params.goodsTitle = goods_title;
    params.goodsCode = goods_code_disc;
    params.shopPWrice = goods_price;
    params.startPrice = goods_price_s;
    params.endPrice = goods_price_b;
    params.drugName = goods_name;
    params.hasImage = -1;
    if ($selected_model != 0) {
      params.goodsTemplate = $selected_model;
    }

    utils.ajax_(url, params, 'post', false, function(data) {
      var e = data.goodsPage;

      var tmpl = document.getElementById('show_goods_list_template').innerHTML;
      var doTtmpl = doT.template(tmpl);
      goodsBox.$parent.find('.goods_list').html(doTtmpl(e));
      goodsBox.$parent.find('.goods_total').html(e.total);
      var pages = Math.ceil(e.total / goodsBox.cur_per_page);

      goodsBox.$parent.find('#pageinfo').data('sui-pagination', '');
      goodsBox.$parent.find('#pageinfo').pagination({
        pages: e.pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 4,
        currentPage: goodsBox.pageno,
        onSelect: function(num) {
          goodsBox.pageno = num;
          goodsBox.show_goods_list();
        },
      });
      goodsBox.$parent.find('#pageinfo').find('span:contains(共)').html('共' + pages + '页(' + e.total + '条记录)');
      $('.page_size_select').find('option[value=' + goodsBox.cur_per_page + ']').prop('selected', true);
      goodsBox.$parent.find('#select_all_goods_btn').attr('checked', false);
    });
  };

  /**
   * 根据符合规则的数据和规定的type显示选择的数据
   *
   * @param data
   * @param type
   */
  goodsBox.selectGoods = function(data, type) {
    type = type ? type : 1;
    type = parseInt(type);
    goodsBox.$parent.find('tbody.show_goods_title').html($('#show_goods_title_' + type).html());
    goodsBox.$parent.find('#goodsBoxTabOne td.operator_position').html($('#operate_right_data_' + type).html());

    if (!goodsBox.$parent.find('.select_goods_list [name=goods_id][value=' + data.goods_id + ']').val()) {
      var oldGoodsIds = goodsBox.$parent.find('input[name=__goodsIds]').val();
      goodsBox.$parent.find('input[name=__goodsIds]').
        val(oldGoodsIds ? oldGoodsIds + ',' + data.goods_id : data.goods_id);
      var template = document.getElementById('select_goods_list_template_' + type).innerHTML;
      var doTT = doT.template(template);
      goodsBox.$parent.find('.select_goods_list').append(doTT(data));
      goodsBox.$parent.find('.select_goods_total').html(goodsBox.$parent.find('.select_goods_list tr').size());
      $('#select_goods_num').html(goodsBox.$parent.find('.select_goods_list tr').size());
    } else {
      layer.msg('该商品已被选择！');
    }
  };

  goodsBox.firstSelectGoods = function(data, goodsIds) {
    // select_goods_list_template_all
    if (!goodsIds)
      goodsIds = data.map(item => item.goods_id).join(',');

    goodsBox.$parent.find('input[name=__goodsIds]').val(goodsIds);
    var template = document.getElementById('select_goods_list_template_all').innerHTML;
    var doTT = doT.template(template);
    goodsBox.$parent.find('.select_goods_list').children().remove();
    goodsBox.$parent.find('.select_goods_list').append(doTT(data));
    goodsBox.$parent.find('.select_goods_total').html(goodsBox.$parent.find('.select_goods_list tr').size());
    $('#select_goods_num').html(goodsBox.$parent.find('.select_goods_list tr').size());
  };

  /**
   * 把用逗号分隔的商品Idx显示在商品弹窗的右边部分，并把数据放入
   * @param goodsIds
   */
  goodsBox.showSelectList = function(goodsIds) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = goodsIds;
    params.fields = 'goods_id,goods_title,shop_price,goods_code';

    require(['utils'], function(utils) {
      utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
        if (data.code === '000') {
          var data_value = data.value;
          var type = goodsBox.$parent.find('input[name=__showGoodsType]').val();

          for (var i = 0; i < data_value.length; i++) {
            goodsBox.selectGoods(data_value[i], type);
          }
        }
      });
    });
  };

  /**
   * goodsBox 不同的模块初始化
   *
   * @param type
   */
  goodsBox.goodsBoxShowModuleInit = function(type) {
    if (/^[1234]$/.test(type)) {
      goodsBox.$parent.find('input[name=__showGoodsType]').val(parseInt(type));

      for (var i = 0; i < 1 + goodsBox.$parent.find('#remove_all_goods_btn:checked').size(); i++)
        goodsBox.$parent.find('#remove_all_goods_btn').trigger('click');
      goodsBox.$parent.find('#remove_all_goods').trigger('click');

      goodsBox.$parent.find('table.goods_list tr').eq(0).find('.select_goods_btn').trigger('click');
      goodsBox.$parent.find('table.select_goods_list').eq(0).find('.unselect_goods_btn').trigger('click');

      if (parseInt(type) === 1)
        showGoodsBatchImport(goodsBox.$parent.find('#add-goods-nav li').eq(1));
      else
        hideGoodsBatchImport(goodsBox.$parent.find('#add-goods-nav li').eq(1));
    } else {
      console.log('error on goodsBoxShowModuleInit(type)');
    }
  };

  return goodsBox;
})
;

function showGoodsBatchImport($target) {
  $target.show();
}

function hideGoodsBatchImport($target) {
  $target.parent().find('li a').eq(0).trigger('click');
  $target.hide();
}

/**
 * 事件绑定，每件商品单独优惠的相关事件
 * 暂时无人使用goodsBox设置，只能暂时放置，以后看时机在写
 * 09-30 事物基本写完，除了弹窗关闭时候的数据校验和获取
 *
 * @param goodsBox.$parent
 */
function eventsAboutEachGoods($parent) {
  var moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  var discountReg = /^(0\.[1-9]|[1-9](\.[0-9])?)$/;

  /* -- 立减 -- */
  $parent.find('input[name=direct_reduce_money_each_goods]').live('blur', function() {
    var value_ = $(this).val();
    if (value_ && !moneyReg.test(value_)) {
      $(this).val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
      return;
    }
    if (parseInt(value_) === 0) {
      $(this).val('');
      layer.msg('不能输入零元');
      return;
    }
  });

  $parent.find('input.batch_direct_reduce_money_each_goods_button').live('click', function() {
    var $input = $parent.find('input[name=batch_direct_reduce_money_each_goods_input]');
    var value_ = $input.val();

    if (!value_) {
      layer.msg('请输入批量修改的立减金额');
      return;
    }

    if (value_ && !moneyReg.test(value_)) {
      $input.val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
      return;
    }

    if (parseInt(value_) === 0) {
      $input.val('');
      layer.msg('不能输入零元');
      return;
    }

    var $checked = $parent.find('table.select_goods_list input.singRightCheckBox:checked').parents('tr.can_del_tr');
    if ($checked.size() !== 0)
      $checked.find('input[name=direct_reduce_money_each_goods]').val(value_);
    else
      layer.msg('请选择商品用于修改立减金额');
  });

  /* -- 立折 -- */
  $parent.find('input[name=direct_discount_each_goods]').live('blur', function() {
    var value_ = $(this).val();
    if (value_ && !discountReg.test(value_)) {
      $(this).val('');
      layer.msg('打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%');
    }
  });

  $parent.find('input[name=max_reduce_money_each_goods]').live('blur', function() {
    var value_ = $(this).val();
    if (value_ && !moneyReg.test(value_)) {
      $(this).val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
    }
  });

  $parent.find('input.batch_direct_discount_each_goods_button').live('click', function() {
    var $input = $parent.find('input[name=batch_direct_discount_each_goods_input]');
    var value_ = $input.val();

    if (!value_) {
      layer.msg('请输入批量修改的立折额度');
      return;
    }

    if (value_ && !discountReg.test(value_)) {
      $input.val('');
      layer.msg('打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%');
      return;
    }

    var $checked = $parent.find('table.select_goods_list input.singRightCheckBox:checked').parents('tr.can_del_tr');
    if ($checked.size() !== 0)
      $checked.find('input[name=direct_discount_each_goods]').val(value_);
    else
      layer.msg('请选择商品用于修改立折额度');
  });

  $parent.find('input.batch_max_reduce_money_each_goods_button').live('blur', function() {
    var $input = $parent.find('input[name=batch_max_reduce_money_each_goods_input]');
    var value_ = $input.val();

    if (!value_) {
      layer.msg('请输入批量修改的最大优惠金额');
      return;
    }

    if (value_ && !moneyReg.test(value_)) {
      $input.val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
      return;
    }

    var $checked = $parent.find('table.select_goods_list input.singRightCheckBox:checked').parents('tr.can_del_tr');
    if ($checked.size() !== 0)
      $checked.find('input[name=max_reduce_money_each_goods]').val(value_);
    else
      layer.msg('请选择商品用于修改最大优惠金额');
  });

  /* -- 限价 -- */
  $parent.find('input[name=fixed_price_each_goods]').live('blur', function() {
    var value_ = $(this).val();
    if (value_ && !moneyReg.test(value_)) {
      $(this).val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
      return;
    }
    if (parseInt(value_) === 0) {
      $(this).val('');
      layer.msg('不能输入零元');
      return;
    }
  });

  $parent.find('input.batch_fixed_price_each_goods_button').live('click', function() {
    var $input = $parent.find('input[name=batch_fixed_price_each_goods_input]');
    var value_ = $input.val();

    if (!value_) {
      layer.msg('请输入批量修改的限价金额');
      return;
    }

    if (value_ && !moneyReg.test(value_)) {
      $input.val('');
      layer.msg('请输入符合金钱格式的数字，无符号');
      return;
    }

    if (parseInt(value_) === 0) {
      $input.val('');
      layer.msg('不能输入零元');
      return;
    }

    var $checked = goodsBox.$parent.find('table.select_goods_list input.singRightCheckBox:checked').
      parents('tr.can_del_tr');
    if ($checked.size() !== 0)
      $checked.find('input[name=fixed_price_each_goods]').val(value_);
    else
      layer.msg('请选择商品用于修改限价金额');
  });

}

function goodsBoxUploadGoods($parent) {
  $parent.find('#goods_list').html('');
  $parent.find('[name=__goodsIds]').val('');
  var formData = new FormData();
  var name = $parent.find('#file_name').val;
  var file = $parent.find('#input_file')[0].files[0];
  formData.append('file', file);
  formData.append('name', name);
  formData.append('target', 'goods');
  var successMsg = '读取商品信息成功！';
  var failMsg = '未读取到商品信息！';
  $.ajax({
    url: '/merchant/import',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(result) {
      if (result != null) {
        if (result.code !== '000') {
          layer.msg(result.msg);
          return;
        }
        var tmpl = document.getElementById('importGoodsFromFile').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $parent.find('#upload_goods_list').html(doTtmpl(result.value.resultToShow));

        var str = result.value.goodsIds.join(',');
        var count = result.value.goodsIds.length;

        $parent.find('[name=__goodsIds]').val(str);
        $parent.find('#importSuccessCount').text(count);
        $('#select_goods_num').html(count);
        $parent.find('#importCount').text(result.value.resultToShow.length);
        var importFile = (result.value.resultToShow.length - count);
        $parent.find('#importFileCount').text(importFile);
        layer.msg(successMsg);
      } else {
        $parent.find('#importFileCount').text(0);
        $parent.find('#importCount').text(0);
        $parent.find('#importSuccessCount').text(0);
        $('#select_goods_num').html(0);
        layer.msg(failMsg);
      }
    },
  });
}

function goodsBoxFileChange(name) {
  $('#much_select_goods').find('#file_name').val(name);
}
