define(['core', 'utils'], function(core, utils) {
  const EGDBox = {};
  let $parent = $('#each-goods-discount-box');

  EGDBox.commonEvent = function() {
    if ($parent.size() === 0)
      $parent = $('#each-goods-discount-box');

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'each-goods-discount-box\' 不存在，无法绑定事件');
      else
        console.log('id\'each-goods-discount-box\' 不唯一，无法绑定事件');

      return;
    }

    // 绑定input框校验函数
    $parent.find('table.select_goods_list input[name=discount]').live('blur', function() {
      discountInputCheck($(this));
    });

    $parent.find('table.select_goods_list input[name=maxReduce]').live('blur', function() {
      moneyInputCheck($(this));
    });

    // 全选checkbox
    $parent.find('input.select_all_goods_checkbox').on('click', function() {
      var flag;
      if ($(this).is(':checked')) flag = 'check';
      else flag = 'uncheck';

      $parent.find('table.select_goods_list input[type=checkbox]').parent().checkbox().checkbox(flag);
    });

    // 批量修改选中商品打折
    $parent.find('button.batch_change_goods_discount_button').on('click', function() {
      var value_ = $parent.find('input[name=batch_change_goods_discount]').val();
      if (value_) {
        if (/^(0\.[1-9]|[1-9](\.[0-9])?)$/.test(value_)) {
          var $temp = $parent.find('table.select_goods_list input[type=checkbox]:checked');

          if ($temp.size() !== 0) {
            $temp.parents('tr').find('input[name=discount]').val(value_);
          } else {
            layer.msg('请至少选中一个商品用于修改折扣');
          }
        } else {
          layer.msg('打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%。');
        }
      } else {
        layer.msg('请填写批量折扣额度');
      }
    });

    // 批量修改选中商品最多优惠
    $parent.find('button.batch_change_goods_max_reduce_button').on('click', function() {
      var value_ = $parent.find('input[name=batch_change_goods_max_reduce]').val();
      if (value_) {
        if (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value_)) {
          var $temp = $parent.find('table.select_goods_list input[type=checkbox]:checked');

          if ($temp.size() !== 0) {
            $temp.parents('tr').find('input[name=maxReduce]').val(value_);
          } else {
            layer.msg('请至少选中一个商品用于修改最大优惠额度');
          }
        } else {
          layer.msg('最多优惠填写的是通常的金额格式，最多两位小数，无符号');
        }
      } else {
        layer.msg('请填写批量最大优惠额度');
      }
    });

    // 弹出框点击确定和x时候的事件
    $parent.on('okHide', function() {
      var resultArr = [];

      var $tr = $parent.find('table.select_goods_list tr');
      for (var i = 0; i < $tr.size(); i++) {
        var discount = $tr.eq(i).find('input[name=discount]').val();
        if (!discount) {
          layer.msg('请填写全部折扣额度');
          $parent.find('input[name=__goodsIdAndNum]').val('error,请填写全部折扣额度');
          return;
        }
        var maxReduce = $tr.eq(i).find('input[name=maxReduce]').val();
        maxReduce = maxReduce ? maxReduce : '0';

        var tempObj = {};
        tempObj.id = $tr.eq(i).find('input[name=goods_id]').val();
        tempObj.discount = discount;
        tempObj.maxReduce = maxReduce;
        resultArr.push(tempObj);
      }

      $parent.find('input[name=__goodsIdAndNum]').val(JSON.stringify(resultArr));
    });
  };

  // 根据商品弹出框的数据 把相应的数据显示到商品折扣框
  EGDBox.showToEGDBoxFromGoodsBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    EGDBox.showToEGDBoxFromGoodsIdsAndMore(goodsIds);
  };

  // 根据商品弹出框的数据 修改商品折扣框的数据
  EGDBox.editEGDBoxFromGoodsBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    if (goodsIds) {
      goodsIds = goodsIds.split(',').map(function(item) {return parseInt(item);}).sort(compare);

      var discountGoodsIds = [];
      $parent.find('table.select_goods_list tr').each(function() {
        discountGoodsIds.push(parseInt($(this).find('input[name=goods_id]').val()));
      });
      discountGoodsIds = discountGoodsIds.sort(compare);

      var lack = [];
      var redundant = [];

      while (goodsIds.length !== 0 && discountGoodsIds.length !== 0) {
        if (goodsIds[0] > discountGoodsIds[0]) {
          redundant.push(discountGoodsIds.shift());
        } else if (goodsIds[0] < discountGoodsIds[0]) {
          lack.push(goodsIds.shift());
        } else {
          goodsIds.shift();
          discountGoodsIds.shift();
        }
      }

      lack = lack.concat(goodsIds);
      redundant = redundant.concat(discountGoodsIds);

      if (lack.length) {
        EGDBox.showToEGDBoxFromGoodsIdsAndMore(lack.join(','));
      }

      redundant.forEach(function(item) {
        $parent.find('input[name=goods_id][value=' + item + ']').parent().parent().remove();
        $parent.find('span.select_goods_num').html($parent.find('table.select_goods_list tr').size());
      });
    } else {
      $parent.find('table.select_goods_list').html('');
      $parent.find('span.select_goods_num').html(0);
    }
  };

  /**
   * 根据商品id和其他数据显示商品折扣框的数据
   * @param goodsIds
   * @param map key为goodsId，value为{'discount':xxx,'maxReduce':xxx}
   */
  EGDBox.showToEGDBoxFromGoodsIdsAndMore = function(goodsIds, map) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = goodsIds;
    params.fields = 'goods_id,goods_title,shop_price,goods_code';

    utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
      if (data.code === '000') {
        data.value.map(function(item) {
          if (map) {
            item.discount = map[item.goods_id.toString()].discount;
            item.maxReduce = map[item.goods_id.toString()].maxReduce;
          }
          return item;
        }).forEach(function(item) {
          var template = document.getElementById('EGDBox_template').innerHTML;
          var doTT = doT.template(template);
          $parent.find('.select_goods_list').append(doTT(item));
        });
        $parent.find('.select_goods_num').html($parent.find('.select_goods_list tr').size());
      }
    });
  };

  return EGDBox;
});

function discountInputCheck($ele) {
  var rule = /^(0\.[1-9]|[1-9](\.[0-9])?)$/;
  var value_ = $ele.val();
  if (value_ && !rule.test(value_)) {
    $ele.val('');
    layer.msg('打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%。');
  }
}

function moneyInputCheck($ele) {
  var rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  var value_ = $ele.val();
  if (value_ && !rule.test(value_)) {
    $ele.val('');
    layer.msg('最多优惠填写的是通常的金额格式，最多两位小数，无符号');
  }
}

function compare(v1, v2) {
  if (v1 < v2) return -1;
  else if (v1 > v2) return 1;
  else return 0;
}
