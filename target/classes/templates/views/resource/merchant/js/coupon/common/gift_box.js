/* -- 这是赠品弹窗的通用js代码抽取部分，配合gift_box.html使用 -- */
define(['core', 'category_choose'], function(core, category_choose) {
  const giftBox = {};
  let $parent;

  let init = function() {
    giftBox.pageno = 1;
    giftBox.cur_per_page = 15;
    $parent = $('#select-gifts-box');
    $parent.find('#cate_box').category();
  };

  init();

  giftBox.commonEvent = function() {
    if ($parent.size() === 0)
      init();

    if ($parent.size() !== 1) {
      if ($parent.size() === 0)
        console.log('id\'select-gifts-box\' 不存在，无法绑定事件');
      else
        console.log('id\'select-gifts-box\' 不唯一，无法绑定事件');

      return;
    }

    // 赠品搜索
    $('.search_gifts_btn').on('click', function() {
      giftBox.show_gifts_list();
    });

    // 赠品参加
    $('.select_gift_btn').live('click', function() {
      var data = {};
      data.gift_id = $(this).parent().find('[name=gift_id]').val();
      data.gift_title = $(this).parent().find('[name=gift_title]').val();
      data.goods_code = $(this).parent().find('[name=goods_code]').val();
      giftBox.selectGifts(data);
    });

    // 赠品移除
    $('.remove_gift_btn').live('click', function() {
      var giftId = $(this).parent().find('[name=gift_id]').val();
      $(this).parents('.can_del_tr').remove();

      var giftsIdArr = $('input[name=__giftIds]').val().split(',');
      $.each(giftsIdArr, function(index, value) {
        if (value == giftId) {
          giftsIdArr = giftsIdArr.slice(0, index).concat(giftsIdArr.slice(index + 1));
          return false;
        }
      });
      $('input[name=__giftIds]').val(giftsIdArr.join(','));

      $('.select-gift-num').html($('.select_gift_list tr').length);
      $('#select_gift_num').html($('.select_gift_list tr').length);
    });

    // 左栏全选
    $('#select_all_gift_btn').on('change', function() {
      var $selectGift = $('#select-gifts-box .gifts_list').find('input[name=gid]');
      if ($(this).is(':checked')) {
        for (var i = 0; i < $selectGift.size(); i++) {
          $selectGift.eq(i).prop('checked', true);
          $selectGift.eq(i).parent().addClass('checked');
        }
      } else {
        for (var i = 0; i < $selectGift.size(); i++) {
          $selectGift.eq(i).prop('checked', false);
          $selectGift.eq(i).parent().removeClass('checked');
        }
      }
    });

    // 右栏全选
    $('#remove_all_gift_btn').on('change', function() {
      var $selectGift = $('#select-gifts-box .select_gift_list').find('input[name=gid]');
      if ($(this).is(':checked')) {
        for (var i = 0; i < $selectGift.size(); i++) {
          $selectGift.eq(i).prop('checked', true);
          $selectGift.eq(i).parent().addClass('checked');
        }
      } else {
        for (var i = 0; i < $selectGift.size(); i++) {
          $selectGift.eq(i).prop('checked', false);
          $selectGift.eq(i).parent().removeClass('checked');
        }
      }
    });

    // 左栏批量参加
    $('.select_all_gift').on('click', function() {
      $('#select-gifts-box .gifts_list').find('input[name=gid]:checked').each(function() {
        var $div = $(this).parent().parent().parent().eq(0);
        var data = {};
        data.gift_id = $div.find('[name=gift_id]').val();
        data.gift_title = $div.find('[name=gift_title]').val();
        data.goods_code = $div.find('[name=goods_code]').val();
        giftBox.selectGifts(data);
      });
    });

    // 右栏批量移除
    $('#remove_all_gift').on('click', function() {
      var giftIdsArr = $('input[name=__giftIds]').val().split(',');

      $('#select-gifts-box .select_gift_list').find('input[name=gid]:checked').each(function() {
        var $div = $(this).parent().parent().nextAll().eq(0);
        var gift_id = $div.find('[name=gift_id]').val();
        $(this).parent().parent().parent().remove();

        $.each(giftIdsArr, function(index, value) {
          if (value == gift_id) {
            giftIdsArr = giftIdsArr.slice(0, index).concat(giftIdsArr.slice(index + 1));
            return false;
          }
        });
      });
      $('input[name=__giftIds]').val(giftIdsArr.join(','));

      $('.select-gift-num').html($('.select_goods_list tr').length);
      $('#select-gift-num').html($('.select_goods_list tr').length);
    });

    // 批量修改赠品数量
    $('#batch_change_gift_num_button').on('click', function() {
      var temp = $('input[name=batch_change_gift_num]').val();

      if (temp && /^[1-9][0-9]*$/g.test(temp)) {
        var $tr = $('.select_gift_list tr');
        if ($tr.size()) {
          for (var i = 0; i < $tr.size(); i++) {
            $tr.eq(i).find('input[name=gift_num]').val(temp);
          }
          layer.msg('修改成功');
        } else {
          layer.msg('无可修改项');
        }
      } else {
        layer.msg('请在批量修改赠品数量后填写正整数');
      }
    });

    // 确定按钮
    $('#select-gifts-box').on('okHide', function() {
      var arr = [];

      var $temp = $('#select-gifts-box').find('.select_gift_list tr');
      for (var i = 0; i < $temp.size(); i++) {
        var giftId = $temp.eq(i).find('input[name=gift_id]').val();
        var giftNum = $temp.eq(i).find('input[name=gift_num]').val();

        var obj = {};
        obj.giftId = giftId;
        obj.sendNum = giftNum;
        if (!/^[1-9][0-9]*$/g.test(obj.sendNum)) {
          layer.msg('选择赠品弹窗中赠品数量必须是数字类型');
          $('input[name=__giftIdsAndNum]').val('');
          return false;
        }

        arr.push(obj);
      }

      $('input[name=__giftIdsAndNum]').val(JSON.stringify(arr));
    });
  };

  giftBox.show_gifts_list = function() {
    //分类
    var cate_code = $parent.find('#cate_box').find('input').val();

    // 标题
    var giftTitle = $('input[name=giftTitle]').val();
    var com_name = $parent.find('input[name=\'good_name\']').val();

    // 商品模版
    var selected_model = $parent.find('#box_menu').find('[class=active] a').attr('value');

    // 商品编码
    var goods_code_disc = $parent.find('input[name=\'goods_code_disc\']').val();

    //现价
    var goods_price_s = $parent.find('input[name=\'goods_price_s\']').val();
    goods_price_s = goods_price_s ? goods_price_s.trim() * 100 : 0;
    var goods_price_b = $parent.find('input[name=\'goods_price_b\']').val();
    goods_price_b = goods_price_b ? goods_price_b.trim() * 100 : 99999999;

    var url = core.getHost() + '/merchant/giftList';

    var params = {};
    params.pageNum = giftBox.pageno;
    params.pageSize = giftBox.cur_per_page;
    params.goodsTitle = giftTitle;
    params.userCateId = cate_code > 0 ? cate_code : '';
    params.comName = com_name;

    params.goodsCode = goods_code_disc;

    params.startPrice = goods_price_s;
    params.endPrice = goods_price_b;

    if (selected_model !== '0') {
      params.goodsTemplate = selected_model;
    }

    $.post(url, params, function(data) {
      var e = data.value;
      console.log('----------------e:');
      console.log(e);
      var tmpl = document.getElementById('show_gift_list_template').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('.gifts_list').html(doTtmpl(e));
      $('.show-gift-num').html(e.total);
      var pages = Math.ceil(e.total / giftBox.cur_per_page);

      $('#select-gift-box-pageinfo').data('sui-pagination', '');
      $('#select-gift-box-pageinfo').pagination({
        pages: e.pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 4,
        currentPage: giftBox.pageno,
        onSelect: function(num) {
          giftBox.pageno = num;
          giftBox.show_gifts_list();
        },
      });
      $('#select-gift-box-pageinfo').find('span:contains(共)').html('共' + pages + '页(' + e.total + '条记录)');
      $('.page_size_select').find('option[value=' + giftBox.cur_per_page + ']').prop('selected', true);
      $('#select_all_gift_btn').attr('checked', false);
    });
  };

  giftBox.selectGifts = function(data) {
    if (!$('.select_gift_list [name=gift_id][value="' + data.gift_id + '"]').val()) {
      var oldGiftIds = $('input[name=__giftIds]').val();
      $('input[name=__giftIds]').val(oldGiftIds ? oldGiftIds + ',' + data.gift_id : data.gift_id);

      var template = document.getElementById('select_gift_list_template').innerHTML;
      var doTT = doT.template(template);
      $('.select_gift_list').append(doTT(data));
      $('.select-gift-num').html($('.select_gift_list tr').length);
      $('#select_gift_num').html($('.select_gift_list tr').length);
    } else {
      layer.msg('该赠品已被选择！');
    }
  };

  giftBox.showSelectList = function(sendGifts) {
    var giftIds = getValueFromListMap(sendGifts, 'giftId');

    giftBox.showSelectListFromGoodsIds(giftIds, sendGifts);
  };

  giftBox.showSelectListFromGoodsIds = function(giftIds, sendGifts) {
    var url = 'goods/getGoodInfoByIdsAndFields';
    var params = {};
    params.ids = giftIds;
    params.fields = 'goods_id,goods_title,goods_code';

    require(['utils'], function(utils) {
      utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
        if (data.code === '000') {
          var data_value = data.value;
          for (var i = 0; i < data_value.length; i++) {
            data_value[i].gift_id = data_value[i].goods_id;
            data_value[i].gift_title = data_value[i].goods_title;

            if (sendGifts) data_value[i].gift_num = sendGifts[i].sendNum;

            giftBox.selectGifts(data_value[i]);
          }

          $('#select-gifts-box').trigger('okHide');
        }
      });
    });
  };

  return giftBox;
});

function getValueFromListMap(arr, key) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key]) result.push(arr[i][key]);
  }
  return result.join(',');
}
