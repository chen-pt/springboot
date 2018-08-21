!(function() {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'utils': 'merchant/js/coupon/ll_utils',
    },
  });

  require(['core'], function(core) {
    core.doTinit();
    core.ReConsole();
  });

  // 定义
  var router = {
    'merchant': {
      'concession': {
        'index': initConcession,
      },
    },
  };

  require(['core'], function(_url) {
    var controllerAction = _url.getControllerActionTernary();
    var t1 = controllerAction[0];
    var t2 = controllerAction[1];
    var t3 = controllerAction[2];
    router[t1][t2][t3]();
  });
})();

function initConcession() {
  initEvent();
  left_submit();
}

function left_submit() {
  require(['utils'], function(utils) {
    $('#before_order').on('click', function() {
      var param = getParamWithoutCoupon();
      var couponDetailId = parseInt($('select[name=coupon_detail_id]').val());
      if (couponDetailId !== -1)
        param.couponId = couponDetailId;

      var url = '/test/beforeOrder';

      utils.doGetOrPostOrJson(url, param, 'json', false, function(data) {
        if (data.code === '000') {
          var json = JSON.stringify(data.value);
          $('textarea[name=output]').val(json);

          // 显示结果
          showResult(data.value);
        } else {
          layui.layer.msg('获取列表失败');
          $('textarea[name=output]').val('');
        }
      });
    });

    $('#show_coupon_list').on('click', function() {
      var param = getParamWithoutCoupon();
      var url = '/test/usableListForTest';
      console.log(param);

      utils.doGetOrPostOrJson(url, param, 'json', false, function(data) {
        if (data.code === '000') {
          var couponList = data.value.data;
          var template = document.getElementById('show_coupon_list_template').innerHTML;
          var doTT = doT.template(template);
          $('#coupon_list').children().remove();
          $('#coupon_list').append(doTT(couponList));
        } else {
          layui.layer.msg('获取列表失败');
        }
      });

      showCouponViewDetail();
    });

    $('#search_session_by_goods_id').on('click', function() {
      let layer = layui.layer;
      layer.open({
        type: 2,
        title: '根据商品ID查询活动和优惠券',
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['893px', '400px'],
        offset: ['465px', '513.5px'],
        content: '/merchant/concession/searchConcessionByGoodsId'
      });
    });

  });
}

function showResult(data) {
  console.log(data);
  // 赠品列表展示
  var giftResultList = data.giftResultList;
  if (giftResultList && giftResultList.length > 0) {
    var template = document.getElementById('show_gift_result_template').innerHTML;
    var doTT = doT.template(template);
    $('#choose_gift').children().remove();
    $('#choose_gift').append(doTT(data));
  } else {
    $('#choose_gift').children().remove();
  }

  // 商品总价
  $('span.totalGoodsFee').html(data.orderOriginalPrice / 100);

  // 运费
  $('span.freightFee').html(data.orderFreight / 100);

  // 活动优惠
  $('span.promotionsFee').html(data.proRuleDeductionPrice / 100);

  // 优惠券优惠
  $('span.couponFee').html(data.couponDeductionPrice / 100);

  // 实付款
  $('span.realPay').html(data.orderRealPrice / 100);

  // 构建数据分析列表
  buildDataAnalyzeChart(data);
}

function buildDataAnalyzeChart(data) {
  function buildGoodsMap() {
    var goodsMap = new Map();
    var i = 97; // unicode "a"

    for (var key in data.concessionResult.goodsConcession) {
      goodsMap.set(key, String.fromCharCode(i++));
    }
    return goodsMap;
  }

  function getPromotionsMap() {
    var j = 0;
    var promotionsMap = new Map();
    for (var key1 in data.concessionResult.goodsConcession) {
      var promotionsRemark = data.concessionResult.goodsConcession[key1].promotionsRemark;
      if (!isEmptyObject(promotionsRemark)) {
        for (var key2 in promotionsRemark) {
          if (key2 === '10') continue;
          var promotionsActivityIdMap = promotionsMap.get(key2);
          if (!promotionsActivityIdMap) {
            promotionsActivityIdMap = new Map();
            promotionsMap.set(key2, promotionsActivityIdMap);
          }

          if (!promotionsActivityIdMap.get(promotionsRemark[key2].promotionsActivityId) &&
            promotionsActivityIdMap.get(promotionsRemark[key2].promotionsActivityId) !== 0)
            promotionsActivityIdMap.set(promotionsRemark[key2].promotionsActivityId, j++);
        }
      }
    }

    return promotionsMap;
  }

  function buildChart(goodsMap, promotionsMap) {
    var data = {};
    data.goodsMap = goodsMap;
    data.promotionsMap = promotionsMap;
    var template = document.getElementById('show_promotions_result_template').innerHTML;
    var doTT = doT.template(template);
    if ($('div.promotionsFee').size() === 1) {
      $('div.promotionsFee').eq(0).remove();
    }

    $('span.promotionsFee').parents('div.control-group').after(doTT(data));
  }

  function showPromotionsToChat(goodsMap, promotionsMap, data) {
    console.log('promotionsMap');
    console.log(promotionsMap);

    var innerHTML = $('span.promotionsFee').parents('div.controls').get(0).innerHTML;
    $('span.promotionsFee').
      parents('div.controls').
      html('<a href=\'javascript:;\' class=\'promotionsFee\'>' + innerHTML + '</a>');

    var goodsConcessions = data.concessionResult.goodsConcession;

    // 邮费
    if (data.concessionResult.postageDiscount !== 0) {
      var x = String.fromCharCode(97 + goodsMap.size);
      var y = promotionsMap.size;
      $('div.promotionsFee td.' + (y + x)).html(data.concessionResult.postageDiscount / 100);
    }

    var totalDiscountForPromotions = new Map();
    for (var goodsId in goodsConcessions) {
      var goodsConcession = goodsConcessions[goodsId];
      var promotionsRemarks = goodsConcession.promotionsRemark;
      if (isEmptyObject(promotionsRemarks)) continue;

      var x = goodsMap.get(goodsId);
      var totalDiscountForGoods = 0;
      for (var promotionsRuleType in promotionsRemarks) {
        if (promotionsRuleType === '10') continue;
        var promotionsRemark = promotionsRemarks[promotionsRuleType];
        var y = promotionsMap.get(promotionsRemark.promotionsActivityId);

        totalDiscountForPromotions.set(promotionsRemark.promotionsActivityId,
          totalDiscountForPromotions.get(promotionsRemark.promotionsActivityId) ? totalDiscountForPromotions.get(
            promotionsRemark.promotionsActivityId) + promotionsRemark.discount : 0 + promotionsRemark.discount);

        // 活动和商品对应的优惠
        $('div.promotionsFee td.' + (y + x)).html(promotionsRemark.discount / 100);
        totalDiscountForGoods += promotionsRemark.discount;
      }

      // 单商品总优惠
      if (totalDiscountForGoods !== 0)
        $('div.promotionsFee td.' + (promotionsMap.size + x)).html(totalDiscountForGoods / 100);
    }

    var promotionsIds = [...totalDiscountForPromotions.keys()];
    for (var i in promotionsIds) {
      var promotionsId = promotionsIds[i];
      var y = promotionsMap.get(promotionsId);
      var discount = totalDiscountForPromotions.get(promotionsId);
      // 单活动总优惠
      $('div.promotionsFee td.' + (y + String.fromCharCode(97 + goodsMap.size + 1))).html(discount / 100);
    }

    // 总活动优惠
    $('div.promotionsFee td.' + (promotionsMap.size + String.fromCharCode(97 + goodsMap.size + 1))).
      html(data.proRuleDeductionPrice / 100);
  }

  var goodsMap = buildGoodsMap();
  console.log(goodsMap);

  var promotionsMap = getPromotionsMap();
  console.log(promotionsMap);

  if (promotionsMap.size === 0) {
    return;
  }

  var tempMap = new Map();
  var tempArr = [...promotionsMap.values()];
  tempArr.forEach(map => {
    for (var k in [...map.keys()]) {
      tempMap.set([...map.keys()][k], map.get([...map.keys()][k]));
    }
  });

  buildChart(goodsMap, tempMap);

  showPromotionsToChat(goodsMap, tempMap, data);

}

function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0;
}

function getParamWithoutCoupon() {
  var param = {};

  var $goodsList = $('#goodsList .goods');
  param.orderGoods = [];
  for (var i = 0; i < $goodsList.length; i++) {
    var goods = {};
    goods.goodsId = parseInt($goodsList.eq(i).find('input[name=goodsId]').val());
    goods.goodsNum = parseInt($goodsList.eq(i).find('input[name=goodsNum]').val());
    param.orderGoods.push(goods);
  }
  var $orderType = $('input[type=radio][name=orderType]');
  if ($orderType.is(':checked')) {
    param.orderType = $orderType.filter(':checked').val();
    if (param.orderType === '1') { // 送货上门，指定地址
      var provinceCode = $('#area_box select[name=provence]').val();
      param.addrCode = provinceCode;
      param.receiverProvinceCode = provinceCode;
      param.receiverCityCode = $('#area_box select[name=city]').val();
      param.address = $('#area_box select[name=area]').val();
      param.receiverAddress = $('#area_box input[name=addr]').val();
    } else if (param.orderType === '2') {
      param.storesId = parseInt($('#store_box input[name=storeId]').val());

    }
  }

  param.mobile = $('input[name=mobile]').val();

  return param;
}

function initOrderSelect() {
  $('input[name="orderType"]').click(function() {
    var orderType = $('input[name="orderType"]:checked').val();
    if (orderType == '1') {
      $('#area_box').show();
      $('#store_box').hide();
    } else if (orderType == '2') {
      $('#area_box').hide();
      $('#store_box').show();
    } else {
      layui.layer.msg('被玩坏了呢，请重试!');
      return;
    }
  });
}

function initAddGoods() {
  $('#add_goods').click(function() {
    $('#goodsList').append($('#goodsList').children().get(0).outerHTML);
  });

  $('input[name=goodsId]').live('blur', function() {

    var url = '/goods/queryById';
    var $this = $(this);
    if (!$this.val())
      return;

    var param = {};
    param.goodsId = parseInt($this.val());

    require(['utils'], function(utils) {
      utils.doGetOrPostOrJson(url, param, 'get', true, function(data) {
        if (data.code === '000') {
          console.log(data);
          $this.next().html(data.value.shop_price / 100);
          $this.parents('div.control-group').find('span.drugName').html(data.value.drug_name);
          var num = parseInt($this.parents('div.control-group').find('input[name=goodsNum]').val());
          if (num) {
            $this.parents('div.control-group').find('span.totalGoodsPrice').html(data.value.shop_price * num / 100);
          } else {
            $this.parents('div.control-group').find('span.totalGoodsPrice').html('计算失败');
          }

        } else {
          $this.next().html('查询失败');
          $this.parents('div.control-group').find('span.drugName').html('查询失败');
          $this.parents('div.control-group').find('span.totalGoodsPrice').html('待计算');
        }
      });
    });
  });
}

function initEvent() {
  require(['core', 'utils'], function(core, utils) {
    var url = core.getHost() + '/common/queryAreaByParentId';
    var param = {};
    param.parentId = 1;
    param.type = 2;
    //初始省市区联动
    initProvence(url, param);
    $('#provence').click(function() {
      initCity(url);
    });
    $('#city').click(function() {
      initArea(url);
    });
    initOrderSelect();
    initAddGoods();
    initCounter();
    initGiftList();
    initPromotionsChat();
    initClickClear();
  });
}

function initPromotionsChat() {
  var promotionsChatShow = false;
  $('a.promotionsFee').live('click', function() {
    if (promotionsChatShow) {
      $('div.promotionsFee').hide();
      promotionsChatShow = false;
    } else {
      $('div.promotionsFee').show();
      promotionsChatShow = true;
    }
  });
}

function initClickClear() {
  $('.click_clear').live('click', function() {
    $(this).val('');
  });
}

function showCouponViewDetail() {
  $('select[name=coupon_detail_id]').change(function() {
    var option_value = $(this).val();
    var coupon_detail = $('select[name=coupon_detail_id] option[value=' + option_value + ']').data('value');
    console.log('print--coupon_view_detail');
    console.log(coupon_detail);
    $('#show_coupon_view').html(coupon_detail);
  });
}

function initGiftList() {
  $('a.gift_list_show').live('click', function() {
    var $div = $(this).next();
    $div.show();
    $(this).addClass('gift_list_hide');
    $(this).removeClass('gift_list_show');
  });

  $('a.gift_list_hide').live('click', function() {
    var $div = $(this).next();
    $div.hide();
    $(this).addClass('gift_list_show');
    $(this).removeClass('gift_list_hide');
  });

  $('button.minus_g').live('click', function() {
    reduce(this);
  });

  $('button.add_g').live('click', function() {
    var value = $(this).prev().val();
    value = parseInt(value);
    var singleMax = $(this).parents('div.gift_list_1').find('input[name=singleMax]').val();
    if (value + 1 > singleMax) {
      layui.layer.msg('不能超过该赠品限制数量');
      return;
    }

    var $giftNums = $(this).parents('div.controls').find('input[name=giftNum]');
    var totalMax = parseInt($('#maxSendNum').html());
    var totalSendNum = 0;
    for (var i = 0; i < $giftNums.length; i++) {
      totalSendNum += parseInt($giftNums.eq(i).val());
    }

    if (totalSendNum + 1 > totalMax) {
      layui.layer.msg('不能超过该赠品列表限制数量');
      return;
    }

    plus(this);
  });
}

function initProvence(url, param) {
  $('#provence').html('');
  $.get(url, param, function(data) {
    var list_option = '';
    $.each(data.results.areaList, function(i, n) {
      var option = '<option value="' + n.areaid + '">' + n.name + '</option>';
      list_option += option;
    });
    $('#provence').append(list_option);
  });
}

function initCity(url) {
  var parentId = $('#provence').val();
  if (!parentId) {
    layui.layer.msg('请重新选择');
    return;
  }
  $('#city').html('');
  $('#area').html('<option name="0">--</option>');
  var param = {};
  param.parentId = $('#provence').val();
  param.type = 3;
  //去省市 type = 3
  $.get(url, param, function(data) {
    var list_option = '';
    $.each(data.results.areaList, function(i, n) {
      var option = '<option value="' + n.areaid + '">' + n.name + '</option>';
      list_option += option;
    });
    $('#city').append(list_option);
  });
}

function initArea(url) {
  var parentId = $('#city').val();
  if (!parentId) {
    layui.layer.msg('请重新选择');
    return;
  }
  $('#area').html('');
  var param = {};
  param.parentId = $('#city').val();
  param.type = 4;
  //去省市 type = 3
  $.get(url, param, function(data) {
    var list_option = '';
    $.each(data.results.areaList, function(i, n) {
      var option = '<option value="' + n.areaid + '">' + n.name + '</option>';
      list_option += option;
    });
    $('#area').append(list_option);
  });
}

function initCounter() {
  $('div.goodsNum > button.minus').live('click', function() {
    reduce(this);
    refreshGoodsTotalPrice(this);
  });

  $('div.goodsNum > button.add').live('click', function() {
    plus(this);
    refreshGoodsTotalPrice(this);
  });

  $('div.goodsNum > button.del').live('click', function() {
    $(this).parents('div.control-group').remove();
  });

}

function refreshGoodsTotalPrice(t) {
  var $parent = $(t).parents('div.control-group');
  var goodsNum = parseInt($parent.find('input[name=goodsNum]').val());
  var shopPrice = $parent.find('span.goodsPrice').get(0).innerHTML * 1000 / 10;
  if (goodsNum && shopPrice) {
    $parent.find('span.totalGoodsPrice').html(goodsNum * shopPrice / 100);
  } else {
    $parent.find('span.totalGoodsPrice').html('待计算');
  }
}

function reduce(reduce) {
  var value = $(reduce).next().val();
  value = parseInt(value);

  if (value > 0) {
    value -= 1;
  } else {
    value = 0;
  }

  $(reduce).next().val(value);
}

function plus(plus) {
  var value = $(plus).prev().val();
  value = parseInt(value);
  value += 1;

  if (value < 1) {
    value = 1;
  }

  $(plus).prev().val(value);
}

