define(['core', 'utils'], function(core, utils) {
  const GBDBox = {};
  let $parent = $('#group_booking_discount_box');

  GBDBox.common_event = function() {
    if ($parent.size() === 0)
      $parent = $('#group_booking_discount_box');

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'group_booking_discount_box\' 不存在，无法绑定事件');
      else
        console.log('id\'group_booking_discount_box\' 不唯一，无法绑定事件');

      return;
    }

    // 全选事件
    $parent.find('label.select_all_checkbox input[type=checkbox]').on('click', function() {
      var $tp = $parent.find('table.selected_goods_list label[data-toggle=checkbox]');
      if ($(this).is(':checked')) {
        $tp.checkbox().checkbox('check');
      } else {
        $tp.checkbox().checkbox('uncheck');
      }
    });

    // 团购折扣 输入内容校验
    $parent.find('table.selected_goods_list input[name=group_discount]').live('blur', function() {
      utils.check_input_is_discount($(this));
    });

    // 成团人数，限购数量 输入内容校验
    $parent.find('table.selected_goods_list').
      find('input[name=group_member_num],input[name=goods_limit_num]').
      live('blur', function() {
        var value_ = $(this).val();
        if (utils.is_positive_integer(value_)) {
          if (parseInt(value_) >= 2) {
            return;
          }
        }
        layer.msg('请输入大于1的整数');
        $(this).val('');
      });

    // 批量修改商品团购折扣按钮
    $parent.find('input[name=batch_group_booking_discount_button]').on('click', function() {
      console.log(3);
      var value = $parent.find('input[name=batch_group_booking_discount]').val();
      if (!utils.is_discount(value)) {
        layer.msg('请输入符合折扣格式的数字，范围：0.1~9.9');
      } else {
        var $tp = $parent.find('table.selected_goods_list input[type=checkbox]:checked');
        if ($tp.size() === 0) {
          layer.msg('请选择需要修改的商品');
        } else {
          $tp.parents('tr.can_be_del').find('input[name=group_discount]').val(value);
        }
      }
    });

    // 批量修改商品团购人数按钮
    $parent.find('input[name=batch_group_booking_member_num_button]').on('click', function() {
      var value = $parent.find('input[name=batch_group_booking_member_num]').val();
      if (!utils.is_positive_integer(value) || parseInt(value) <= 1) {
        layer.msg('请输入正整数');
      } else {
        var $tp = $parent.find('table.selected_goods_list input[type=checkbox]:checked');
        if ($tp.size() === 0) {
          layer.msg('请选择需要修改的商品');
        } else {
          $tp.parents('tr.can_be_del').find('input[name=group_member_num]').val(value);
        }
      }
    });

    // 批量修改商品团购数量限制按钮
    $parent.find('input[name=batch_group_booking_limit_num_button]').on('click', function() {
      var value = $parent.find('input[name=batch_group_booking_limit_num]').val();
      if (!utils.is_positive_integer(value)) {
        layer.msg('请输入正整数');
      } else {
        var $tp = $parent.find('table.selected_goods_list input[type=checkbox]:checked');
        if ($tp.size() === 0) {
          layer.msg('请选择需要修改的商品');
        } else {
          $tp.parents('tr.can_be_del').find('input[name=goods_limit_num]').val(value);
        }
      }
    });

  };

  /**
   * 把商品弹窗的数据显示到团购价弹窗
   */
  GBDBox.show_to_GBDBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    GBDBox.show_to_GBDBox_from_more(goodsIds);
  };

  GBDBox.edit_to_GBDBox = function() {
    var goods_ids = $('#much_select_goods input[name=__goodsIds]').val();
    if (goods_ids) {
      goods_ids = goods_ids.split(',').map(function(item) {return parseInt(item);}).sort(utils.compare);

      var exist_goods_ids = [];
      $parent.find('table.selected_goods_list tr.can_be_del').each(function() {
        exist_goods_ids.push(parseInt($(this).find('input[name=goods_id]').val()));
      });
      exist_goods_ids = exist_goods_ids.sort(utils.compare);

      var lack = [];
      var redundant = [];

      while (goods_ids.length !== 0 && exist_goods_ids.length !== 0) {
        if (goods_ids[0] > exist_goods_ids[0]) {
          redundant.push(exist_goods_ids.shift());
        } else if (goods_ids[0] < exist_goods_ids[0]) {
          lack.push(goods_ids.shift());
        } else {
          goods_ids.shift();
          exist_goods_ids.shift();
        }
      }

      lack = lack.concat(goods_ids);
      redundant = redundant.concat(exist_goods_ids);

      if (lack.length) {
        GBDBox.show_to_GBDBox_from_more(lack.join(','));
      }

      redundant.forEach(function(item) {
        $parent.find('input[name=goods_id][value=' + item + ']').parents('tr.can_be_del').remove();
      });
    } else {
      $parent.find('table.selected_goods_list').html('');
    }
  };

  /**
   * 根据GoodsIds和其他参数渲染数据到团购价弹窗
   * @param goodsIds
   * @param map
   */
  GBDBox.show_to_GBDBox_from_more = function(goodsIds, map) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = goodsIds;
    params.fields = 'goods_id,goods_title,shop_price,goods_code';

    utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
      if (data.code === '000') {
        var val_ = data.value;
        if (map) {
          val_.forEach(function(t) {
            var t_m = map[t.goods_id.toString()];
            t.group_discount = t_m.groupDiscount / 10;
            t.group_member_num = t_m.groupMemberNum;
            t.goods_limit_num = t_m.goodsLimitNum;
          });
        }

        var template_code = document.getElementById('gbd_show_select_goods').innerHTML;
        var tempFn = doT.template(template_code);
        $('#group_booking_discount_box table.selected_goods_list').append(tempFn(val_));
      }
    });
  };

  GBDBox.get_data_from_box = function() {
    var result_arr = [];
    $parent.find('table.selected_goods_list tr.can_be_del').each(function() {
      var temp_obj = {};
      var goods_id = $(this).find('input[name=goods_id]').val();
      var group_discount = $(this).find('input[name=group_discount]').val();
      var group_member_num = $(this).find('input[name=group_member_num]').val();
      var goods_limit_num = $(this).find('input[name=goods_limit_num]').val();
      var goods_title = $(this).find('input[name=goods_title]').val();
      var goods_code = $(this).find('input[name=goods_code]').val();
      if (!group_discount || !group_member_num || !goods_limit_num) {
        result_arr = '商品:' + goods_title + '(' + goods_code + ')' + ' 团购规则未填写完整';
        return false;
      }
      temp_obj.goodsId = parseInt(goods_id);
      temp_obj.groupDiscount = group_discount * 10;
      temp_obj.groupMemberNum = parseInt(group_member_num);
      temp_obj.goodsLimitNum = parseInt(goods_limit_num);
      result_arr.push(temp_obj);
    });
    if (result_arr.length === 0) result_arr = '请指定拼团折扣';
    return result_arr;
  };

  return GBDBox;
});
