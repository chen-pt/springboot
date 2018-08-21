define(['core', 'utils'], function(core, utils) {
  const EGFPBox = {};
  let $parent = $('#each-goods-fixed-price-box');

  // 常用绑定事件
  EGFPBox.commonEvent = function() {
    if ($parent.size() === 0)
      $parent = $('#each-goods-fixed-price-box');

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'each-goods-fixed-price-box\' 不存在，无法绑定事件');
      else
        console.log('id\'each-goods-fixed-price-box\' 不唯一，无法绑定事件');

      return;
    }

    // 绑定input框校验函数
    $parent.find('input[name=fixedPrice]').live('blur', function() {
      moneyInputCheck($(this));
    });

    $parent.find('input[name=batch_change_goods_fixed_price]').on('blur', function() {
      moneyInputCheck($(this));
    });

    // 全选checkbox
    $parent.find('input.select_all_goods_checkbox').on('click', function() {
      var flag;
      if ($(this).is(':checked')) flag = 'check';
      else flag = 'uncheck';

      $parent.find('table.select_goods_list input[type=checkbox]').parent().checkbox().checkbox(flag);
    });

    // 批量修改选中商品限价
    $parent.find('button.batch_change_goods_fixed_price_button').on('click', function() {
      var value_ = $parent.find('input[name=batch_change_goods_fixed_price]').val();
      if (value_ && parseFloat(value_) !== 0) {
        if (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value_)) {
          var $temp = $parent.find('table.select_goods_list input[type=checkbox]:checked');

          if ($temp.size() !== 0) {
            $temp.parents('tr').find('input[name=fixedPrice]').val(value_);
          } else {
            layer.msg('请至少选中一个商品用于修改限价');
          }
        } else {
          layer.msg('最多优惠填写的是通常的金额格式，最多两位小数，无符号');
        }
      } else {
        layer.msg('请填写批量限价额度且不为零');
      }
    });

    // 弹出框点击确定和x时候的事件
    $parent.on('okHide', function() {
      var resultArr = [];

      var $tr = $parent.find('table.select_goods_list tr');
      for (var i = 0; i < $tr.size(); i++) {
        var fixedPrice = $tr.eq(i).find('input[name=fixedPrice]').val();
        if (!fixedPrice || parseFloat(fixedPrice) === 0) {
          layer.msg('请填写全部限价额度且不为零');
          $parent.find('input[name=__goodsIdAndFixedPrice]').val('error,请填写全部限价额度且不为零');
          return;
        }

        var tempObj = {};
        tempObj.id = $tr.eq(i).find('input[name=goods_id]').val();
        tempObj.fixedPrice = fixedPrice;
        resultArr.push(tempObj);
      }

      $parent.find('input[name=__goodsIdAndFixedPrice]').val(JSON.stringify(resultArr));
    });
  };

  // 根据商品弹出框的数据 把相应的数据显示到商品限价框
  EGFPBox.showToEGFPBoxFromGoodsBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    EGFPBox.showToEGFPBoxFromGoodsIdsAndMore(goodsIds);
  };

  // 根据商品弹出框的数据 修改商品限价框的数据
  EGFPBox.editEGFPBoxFromGoodsBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    if (goodsIds) {
      goodsIds = goodsIds.split(',').map(function(item) {return parseInt(item);}).sort(compare);

      var fixedPriceGoodsIds = [];
      $parent.find('table.select_goods_list tr').each(function() {
        fixedPriceGoodsIds.push(parseInt($(this).find('input[name=goods_id]').val()));
      });
      fixedPriceGoodsIds = fixedPriceGoodsIds.sort(compare);

      var lack = [];
      var redundant = [];

      while (goodsIds.length !== 0 && fixedPriceGoodsIds.length !== 0) {
        if (goodsIds[0] > fixedPriceGoodsIds[0]) {
          redundant.push(fixedPriceGoodsIds.shift());
        } else if (goodsIds[0] < fixedPriceGoodsIds[0]) {
          lack.push(goodsIds.shift());
        } else {
          goodsIds.shift();
          fixedPriceGoodsIds.shift();
        }
      }

      lack = lack.concat(goodsIds);
      redundant = redundant.concat(fixedPriceGoodsIds);

      if (lack.length) {
        EGFPBox.showToEGFPBoxFromGoodsIdsAndMore(lack.join(','));
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
   * 根据商品id和其他数据显示商品限价框的数据
   * @param goodsIds
   * @param map key为goodsId，value为fixedPrice
   */
  EGFPBox.showToEGFPBoxFromGoodsIdsAndMore = function(goodsIds, map) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = goodsIds;
    params.fields = 'goods_id,goods_title,shop_price,goods_code';

    utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
      if (data.code === '000') {
        data.value.map(function(item) {
          if (map) {
            item.fixedPrice = map[item.goods_id.toString()];
          }
          return item;
        }).forEach(function(item) {
          var template = document.getElementById('EGFPBox_template').innerHTML;
          var doTT = doT.template(template);
          $parent.find('.select_goods_list').append(doTT(item));
        });
        $parent.find('.select_goods_num').html($parent.find('.select_goods_list tr').size());
      }
    });
  };

  return EGFPBox;
});

function moneyInputCheck($ele) {
  var rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  var value_ = $ele.val();
  if (value_ && !rule.test(value_)) {
    $ele.val('');
    layer.msg('最多优惠填写的是通常的金额格式，最多两位小数，无符号');
  }
}
