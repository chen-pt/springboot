define(['core'], function(core) {
  const giftBox2 = {};
  let $parent = $('#selected_gift_box');

  giftBox2.commonEvent = function() {
    if ($parent.size() === 0)
      $parent = $('#selected_gift_box');

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'selected_gift_box\' 不存在，无法绑定事件');
      else
        console.log('id\'selected_gift_box\' 不唯一，无法绑定事件');

      return;
    }

    /* -- 同种商品赠品弹出框全选checkbox -- */
    $parent.find('input.select_all_gift_checkbox').on('click', function() {
      var isChecked = $(this).is(':checked');
      var action;
      if (isChecked) action = 'check';
      else action = 'uncheck';

      $('#selected_gift_box table.selected_gift_list').find('input[type=checkbox]').parent().checkbox().checkbox(action);
    });

    $parent.find('table.selected_gift_list input[name=gift_num]').live('blur', function() {
      var value_ = $(this).val();
      if (/^\d+$/.test(value_) && parseInt(value_) > 0) {
        // donothing
      } else {
        layer.msg('请在赠品数量框内填写正整数');
        $(this).val('');
      }
    });

    /* -- 批量修改 -- */
    $parent.find('#batch_change_gift_num_button').on('click', function() {
      var value_ = $('#selected_gift_box input[name=batch_change_gift_num]').val();
      if (value_) {
        if (/^\d+$/.test(value_) && parseInt(value_) > 0) {
          var $temp = $parent.find('table.selected_gift_list input[type=checkbox]:checked');
          if ($temp.size() !== 0) {
            $temp.each(function() {
              $(this).parent().parent().next().find('input[name=gift_num]').val(value_);
            });
          } else {
            layer.msg('请至少选中一个赠品用于修改数量');
          }
        } else {
          layer.msg('请在 批量修改选中赠品数量输入框内 填写正整数');
        }
      } else {
        layer.msg('请填写批量修改的数量');
      }
    });

    /* -- 点确定或点×的时候获取数据放入一个input框内 -- */
    $parent.on('okHide', function() {
      var resultArr = [];
      var $tr = $parent.find('table.selected_gift_list tr');

      for (var i = 0; i < $tr.size(); i++) {
        var num = parseInt($tr.eq(i).find('input[name=gift_num]').val());
        if (!num) {
          layer.msg('赠品数量不能为空或非正整数');
          resultArr = 'error,赠品数量不能为空或非正整数';
          break;
        }

        var tempObj = {};
        tempObj.num = num;
        tempObj.id = parseInt($tr.eq(i).find('input[name=gift_id]').val());
        resultArr.push(tempObj);
      }
      if ($tr.size() === 0) resultArr = 'error,请选择商品或重新点击送同种商品单选框';

      if (typeof(resultArr) !== 'string') resultArr = JSON.stringify(resultArr);
      $parent.find('input[name=__giftIdAndNum]').val(resultArr);
    });
  };

  giftBox2.showDataToGiftBoxByGoodsIds = function(goodsIds, obj) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = goodsIds;
    params.fields = 'goods_id,goods_title,goods_code';

    require(['utils'], function(utils) {
      utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
        if (data.code === '000') {
          console.log('11111111');
          console.log(data);
          data.value.map(function(item) {
            var tempObj = {};
            tempObj.gift_title = item.goods_title;
            tempObj.gift_id = item.goods_id;
            tempObj.goods_code = item.goods_code;
            if (obj) tempObj.gift_num = obj[item.goods_id.toString()];
            return tempObj;
          }).forEach(function(item, index) {
            var tmpl = document.getElementById('selected_gift_list_template').innerHTML;
            var doTtmpl = doT.template(tmpl);
            $('#selected_gift_box table.selected_gift_list').append(doTtmpl(item));
          });
          $('#selected_gift_box span.select_gift_num').html($('#selected_gift_box table.selected_gift_list tr').size());
        }
        $('#select_gift_num').html($('#selected_gift_box table.selected_gift_list tr').size());
      });
    });
  };

  // 复制商品弹出框的数据到赠品弹出框2
  giftBox2.showDataToGiftBox = function() {
    var giftIds = $('#much_select_goods input[name=__goodsIds]').val();

    if (giftIds) {
      giftBox2.showDataToGiftBoxByGoodsIds(giftIds);
    }
  };

  // 根据商品弹出框的数据修改赠品弹出框2的数据
  giftBox2.editDataToGiftBox = function() {
    var goodsIds = $('#much_select_goods input[name=__goodsIds]').val();
    if (goodsIds) {
      goodsIds = goodsIds.split(',').map(function(item) {return parseInt(item);}).sort(compare);
      var giftIds = [];
      $('#selected_gift_box table.selected_gift_list tr').each(function() {
        giftIds.push(parseInt($(this).find('input[name=gift_id]').val()));
      });
      giftIds = giftIds.sort(compare);

      var lack = [];
      var redundant = [];

      while (goodsIds.length !== 0 && giftIds.length !== 0) {
        if (goodsIds[0] > giftIds[0]) {
          redundant.push(giftIds.shift());
        } else if (goodsIds[0] < giftIds[0]) {
          lack.push(goodsIds.shift());
        } else {
          goodsIds.shift();
          giftIds.shift();
        }
      }

      lack = lack.concat(goodsIds);
      redundant = redundant.concat(giftIds);

      if (lack.length) {
        giftBox2.showDataToGiftBoxByGoodsIds(lack.join(','));
      }

      redundant.forEach(function(item) {
        $('#selected_gift_box input[name=gift_id][value=' + item + ']').parent().parent().remove();
        $('#selected_gift_box span.select_gift_num').html($('#selected_gift_box table.selected_gift_list tr').size());
      });
    } else {
      $('#selected_gift_box table.selected_gift_list').html('');
      $('#selected_gift_box span.select_gift_num').html(0);
    }
  };

  // 根据给与的参数显示数据到赠品弹出框2
  giftBox2.showToGiftBoxForCopyOrEdit = function(data) {
    var obj = {};
    var giftIds = data.map(function(t) {
      obj[t.giftId.toString()] = t.sendNum;
      return t.giftId;
    }).join(',');
    giftBox2.showDataToGiftBoxByGoodsIds(giftIds, obj);
  };

  return giftBox2;
});

function compare(v1, v2) {
  if (v1 < v2) return -1;
  else if (v1 > v2) return 1;
  else return 0;
}
