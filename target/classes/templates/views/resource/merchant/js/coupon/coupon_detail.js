define(['core', 'utils'], function(core, utils) {
  var couponDetail = {};
  couponDetail.pageSize = 15;
  couponDetail.currentPage = 1;

  couponDetail.show_ = function(couponRuleId) {
    if (!couponRuleId) {
      layer.msg('参数有误');
      return;
    }

    var url = core.getHost() + '/merchant/getCouponDetail';
    var param = {};
    param.ruleId = couponRuleId;

    var $parent = $('#coupon_detail');
    $.ajax({
      type: 'GET',
      url: url,
      data: param,
      // 不要改动这里的false
      async: false,
      success: function(data) {
        if (data.code === '000') {
          var data = JSON.parse(data.value);
          var temp_result = displayDataToPage($parent, data);
          if (typeof(temp_result) === 'string') console.log(temp_result);
        }
      },
    });
  };

  couponDetail.editAmcountOrValidityTime = function() {
    var params = {};

    params.ruleId = $('input[name="rule_id"]').val();
    params.siteId = $('input[name="site_id"]').val();
    params.amount = $('input[name="amount_append"]').val() ? $('input[name="amount_append"]').val() : 0;
    params.dayNum = $('input[name="validity_day_append"]').val() ? $('input[name="validity_day_append"]').val() : 0;

    var g = new RegExp(/^[0-9][0-9]*$/);
    if (!g.test(params.amount)) {
      layer.msg('优惠券数量追加错误，请输入有效数字');
      return;
    }

    if (params.amount > 100000000) {
      layer.msg('优惠券数量最多追加一亿张，请重新输入');
      return;
    }

    if (!g.test(params.dayNum)) {
      layer.msg('优惠券有效期追加错误，请输入有效天数');
      return;
    }

    if (params.dayNum > 3600) {
      layer.msg('优惠券有效期追加最多为3600天，请重新输入');
      return;
    }

    if (params.amount > 0 || params.dayNum > 0) {
      layer.open({
        type: 3,
        content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>',
      });
      var url = core.getHost() + '/merchant/updateCoupon';
      $.post(url, params, function(e) {
        if (e.code == '000') {
          layer.msg('修改成功');
          window.location.reload();
        } else {
          layer.msg('修改失败');
        }
      });
    }
  };

  /**
   * 根据不同的规则状态改变按钮入口
   */
  couponDetail.changeCouponDetailButtons = function() {

    var release_html = '<button data-toggle="modal" data-target="#ConfirmModal" data-keyboard="false" class="sui-btn btn-primary btn-lg" style="padding-top: 4px;padding-bottom: 4px;">确认发放</button> &nbsp;';
    var edit_html = '<a class=\'sui-btn btn-warning btn-large\' id=\'edit_coupon\'>修改</a> &nbsp;';
    var return_html = '<a class=\'sui-btn btn-default btn-large\' id=\'return_list\' href=\'/merchant/couponListManager\'>返回列表</a> &nbsp;';
    var send_coupon = '<a class=\'sui-btn btn-primary btn-large\' id=\'send_coupon\'>去创建发布规则</a> &nbsp;';

    var status = $('input[name=status]').val();
    var a_html;
    switch (status) { // 新规则状态 0可发放 1已发完 2手动停发 3已过期 4手动作废 10待发放
      case '0':
        a_html = send_coupon + return_html;
        break;
      case '1':
        a_html = return_html;
        break;
      case '2':
        a_html = return_html;
        break;
      case '3':
        a_html = return_html;
        break;
      case '4':
        a_html = return_html;
        break;
      case '10':
        a_html = release_html + edit_html + return_html;
        break;
    }

    // 按订单计算
    if ($('input[name=aimAt]').val() === '0')
      a_html = '';

    $('#buttons').append(a_html);
  };

  /**
   * 根据不同的规则状态改变右边栏入口
   */
  couponDetail.changeCouponDetailRightSide = function() {

    var stop_html = '<a href=\'#\' data-toggle=\'modal\' data-target=\'#stop_coupon\' data-keyboard=\'false\' class="sui-btn btn-bordered btn-xlarge btn-warning">停止发放该优惠券</a> &nbsp;';
    var invalid_html = '<a href=\'#\' data-toggle=\'modal\' data-target=\'#invalid_coupon\' data-keyboard=\'false\' class="sui-btn btn-bordered btn-xlarge btn-warning">作废该优惠券</a> &nbsp;';
    var copy_html = '<a href=\'#\' id=\'copy_coupon\'  class="sui-btn btn-bordered btn-xlarge btn-success">复制该张优惠券</a> &nbsp;';

    var status = $('input[name=status]').val();
    var a_html;
    switch (status) { // 新规则状态 0可发放 1已过期 2手动停发 3已过完 4手动作废 10待发放
      case '0':
        a_html = stop_html + invalid_html + copy_html;
        break;
      case '1':
        a_html = copy_html;
        break;
      case '2':
        a_html = invalid_html + copy_html;
        break;
      case '3':
        a_html = invalid_html + copy_html;
        break;
      case '4':
        break;
      case '10':
        a_html = invalid_html;
        break;
    }

    // 按订单计算
    if ($('input[name=aimAt]').val() === '0')
      a_html = '';

    $('#rightSide').append(a_html);
  };

  return couponDetail;
});
var couponDetail = {};
couponDetail.pageSize = 15;
couponDetail.currentPage = 1;

function displayDataToPage($parent, data) {
  // 存放数据
  $parent.find('input[name=rule_id]').val(data.ruleId);
  $parent.find('input[name=site_id]').val(data.siteId);
  $parent.find('input[name=status]').val(data.status);
  $parent.find('input[name=timeRule]').val(data.timeRule);
  $parent.find('input[name=aimAt]').val(data.aimAt);

  // 优惠类型
  var couponTypeMap = {100: '现金券', 200: '打折券', 300: '限价券', 400: '包邮券', 500: '满赠券'};
  var couponType = couponTypeMap[data.couponType];
  if (!couponType) return 'error on couponType';
  $parent.find('#coupon_type').html(couponType);

  // 优惠状态
  var statusMap = {0: '可发放', 1: '已过期', 2: '手动停发', 3: '已发完', 4: '手动作废', 10: '待发放'};
  var status = statusMap[data.status];
  if (!status) return 'error on status';
  $parent.find('#coupon_status').html(status);

  // 优惠编码
  var ruleId = data.ruleId;
  if (!ruleId) return 'error on ruleId';
  $parent.find('#coupon_code').html(ruleId);

  // 优惠名称
  var ruleName = data.ruleName;
  if (!ruleName) return 'error on ruleName';
  $parent.find('#ruleName').html(ruleName);

  // 优惠标签
  var markedWords = data.markedWords;
  if (!markedWords) return 'error on markedWords';
  $parent.find('#markedWords').html(markedWords);

  // 优惠规则
  var temp_result = showGoodsRule($parent, data);
  if (typeof(temp_result) === 'string') return temp_result;

  // 数量
  if (data.total > -1) {  //-1表示不限量
    $('#amcount').html(data.total);
  } else {
    $('#amcount_no').html('不限量');
  }

  var addButtonHtml = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button data-toggle="modal" data-target="#AmcountModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">增加数量';
  if (data.amount > -1) {
    if (data.aimAt != 0 && data.status === 0 || data.status === 1 || data.status === 3) {
      $('#AddButtonDiv').html(addButtonHtml);
    }
  }

  // 有效期
  temp_result = showTimeRule($parent, data, JSON.parse(data.timeRule));
  if (typeof(temp_result) === 'string') return temp_result;

  var limitRule = JSON.parse(data.limitRule);
  // 是否首单
  var is_first_order = limitRule.is_first_order;
  if (is_first_order === 0) {
    $parent.find('#first_orde').html('全部订单');
  } else if (is_first_order === 1) {
    $parent.find('#first_orde').html('仅限首单');
  } else {
    return 'error on limitRule.is_first_order';
  }

  // 订单类型
  var order_type_arr = limitRule.order_type.split(',');
  var order_type = '';
  $.each(order_type_arr, function(k, v) {
    if (parseInt(v) === 100) {
      // todo nothing
      order_type += '门店自提，';
    }
    if (parseInt(v) === 200) {
      order_type += '送货上门，';
    }
    if (parseInt(v) === 300) {
      order_type += '门店直购（店员APP内下单）&nbsp;&nbsp;&nbsp;';
    }
  });
  order_type = order_type.substring(0, order_type.length - 1);
  $parent.find('#order_type').html(order_type);

  // 适用渠道
  if (limitRule.apply_channel) {
    var apply_channel = '';
    if (limitRule.apply_channel === '101,103,105') {

      apply_channel = '线上线下均可使用';
    } else if (limitRule.apply_channel === '101,103') {
      apply_channel = '线上使用';
    } else if (limitRule.apply_channel === '105') {
      apply_channel = '线下使用';
    }
    $parent.find('#apply_channel').html(apply_channel);
  }

  // 适用门店
  if (limitRule.apply_store === 1) {
    $('#apply_store').html('指定门店(您已选择 <span style="color:red">' + data.storeList.length + '</span> 家门店，' +
      '<span data-toggle=\'modal\' data-target=\'#store_list_box\' id="show_store" data-value = "' +
      encodeURIComponent(JSON.stringify(data.storeList)) + '" style="color: #6BC5A4">点击查看</span>)');
  } else if (limitRule.apply_store === 2) {
    $('#apply_store').html('指定区域门店(您已选择 <span style="color:red">' + data.storeList.length + '</span> 家门店，' +
      '<span data-toggle=\'modal\' data-target=\'#store_list_box\' id="show_store" data-value = "' +
      encodeURIComponent(JSON.stringify(data.storeList)) + '" style="color: #6BC5A4">点击查看</span>)');
  } else {
    $('#apply_store').html('全部门店');
  }

  // 是否分享
  if (limitRule.is_share == 1) {
    $parent.find('#is_share').html('可分享');
  } else {
    $parent.find('#is_share').html('不可分享');
  }

  // 优惠说明
  if (data.limitState) {
    $parent.find('#limit_state').html(data.limitState);
    $parent.find('#limit_state').parent().parent().show();
  }

  // 商家备注
  if (data.limitRemark != '') {
    $parent.find('#limit_remark').html(data.limitRemark);
  }

  // 创建时间
  require(['core'], function(core) {
    core.formatDate();
    $parent.find('#create_time').html(new Date(data.createTime).format());
  });
}

function showTimeRule($parent, data, timeRule) {
  var temp_html = '';
  if (timeRule.validity_type === 1) {
    temp_html = '绝对时间：' + timeRule.startTime + ' - ' + timeRule.endTime + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    if ((data.status === 0 || data.status === 1 || data.status === 3) && data.aimAt === 1) {
      temp_html += '<button data-toggle="modal" data-target="#ValidityTimeModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">延长有效期</button>';
    }

  } else if (timeRule.validity_type === 2) {
    temp_html = '领取后&nbsp;' + timeRule.how_day + '&nbsp;天内使用';

  } else if (timeRule.validity_type === 3) {
    if (timeRule.assign_type === 1) {
      temp_html = '指定时间：按日期设置，每月' + timeRule.assign_rule + '号';
    } else if (timeRule.assign_type === 2) {
      temp_html = '指定时间：按星期设置，每周' + timeRule.assign_rule;
    }

  } else if (timeRule.validity_type === 4) {
    temp_html = timeRule.startTime + '~' + timeRule.endTime;
  }

  $('#validity_type').html(temp_html);
}

function showGoodsRule($parent, data) {
  // 商品显示
  var goodsRule = JSON.parse(data.goodsRule);
  var goodsRuleStr = '';
  if (goodsRule) goodsRuleStr = showGoodsRule2(goodsRule);

  // 赠品显示
  var giftRuleStr = data.couponType === 500 ? showGiftRule(goodsRule) : '';

  // 修改商品按钮
  var goodModifyButton = getGoodsModifyButton(data, goodsRule);

  if (goodModifyButton) {
    switch (data.couponType) {
      case 100:
      case 200:
      case 400:
      case 500:
        break;
      case 300:
        $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(0).remove();
        $('#much_select_goods_container').show();
        break;
    }
    if (parseInt((JSON.parse(data.goodsRule)).type) !== 0) $('#much_select_goods_container').show();
  }

  var orderType = '';
  if (data.couponView) {
    if (goodsRuleStr || giftRuleStr) {
      orderType = goodsRuleStr + '&nbsp;&nbsp;&nbsp;&nbsp;' + giftRuleStr + '<br/>';
    }
    orderType += '<span>' + data.couponView.ruleDetail + '</span>' + goodModifyButton;
    $parent.find('#order_rule').html(orderType);
  } else {
    return '优惠类型查询失败';
  }
}

function getGoodsModifyButton(data, goodsRule) {
  var goodsModifyButton = '';
  var goodsModifyFlag = true;

  if (data.status === 1 || data.status === 4 || data.aimAt !== 1) // 已过期/手动作废/按订单计算 都不能修改商品
    goodsModifyFlag = false;
  if (data.couponType === 500 && (goodsRule.gift_send_type || goodsRule.gift_send_type === 2)) // 满赠券 赠送同种商品 不能修改商品
    goodsModifyFlag = false;
  if (goodsModifyFlag) {
    goodsModifyButton = '<button data-toggle=\'modal\' data-target=\'#goodsModifyModal\' class=\'sui-btn btn-bordered btn-small btn-warning\'>修改商品</button>';
    copyGoodsToDetail(JSON.parse(data.goodsRule));
  }

  return goodsModifyButton;
}

function showGoodsRule2(goodsRule) {
  var result = '';
  var goodsIdsArr = goodsRule.type === 0 ? [] : goodsRule.promotion_goods.split(',');
  if (goodsRule.type === 0) {
    result = '全部商品参加';
  } else if (goodsRule.type === 2) {
    result += '指定商品参加（您已选择<span style="color:red;">'
      + goodsIdsArr.length
      +
      '</span>个商品，<a href="javascript:;" data-toggle="modal" data-target="#goods_list_box" class="sui-btn btn-small btn-primary">点击查看</a>)';

    showGoodsRule3(goodsIdsArr, couponDetail.currentPage);

  } else if (goodsRule.type === 3) {
    result += '指定商品不参加（您已选择<span style="color:red;">'
      + goodsIdsArr.length
      +
      '</span>个商品，<a href="javascript:;" data-toggle="modal" data-target="#goods_list_box" class="sui-btn btn-small btn-primary">点击查看</a>)';

    showGoodsRule3(goodsIdsArr, couponDetail.currentPage);
  }
  return result;
}

/**
 * 分页
 * @param goodsIdsArr
 */
function showGoodsRule3(goodsIdsArr, page) {
  $('#goods_list_box #selected_goods').html('您已选择 <span style=\'color: red\'>' + goodsIdsArr.length + '</span> 个商品：');

  require(['utils'], function(utils) {
    var url = '/goods/getGoodsInfoByIdsByPage';
    var params = {
      'goodsIds': goodsIdsArr.join(','),
      'page': page,
      'pageSize': couponDetail.pageSize,
    };
    utils.ajax_(url, params, 'post', true, function(data) {
      if (data.code === '000') {
        var temp_data = data.value.data.map(function(obj) {
          var tempObj = {'name': obj.product_name, 'price': obj.product_price / 100};
          return tempObj;
        });
        $('#goods_list_box #selected_goods').
          html('您已选择 <span style=\'color: red\'>' + data.value.total + '</span> 个商品：');
        var tmpl = document.getElementById('goods_list_context').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#goods_list_box #goods_list').html(doTtmpl(temp_data));
        //分页
        $('#goodspage').pagination({
          pages: data.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: couponDetail.currentPage,
          onSelect: function (num) {
            couponDetail.cur_page = num
            showGoodsRule3(goodsIdsArr,num)
          }
        })
        $('#goodspage div').attr('style','display:inline')
      }
    }, function() {});
  });
}

function showGiftRule(goodsRule) {
  console.log('showGiftRule');
  console.log(goodsRule);

  var result = '';

  var giftArr = goodsRule.gift_storage.length ? goodsRule.gift_storage : [];
  var idNum = {};
  for (var i = 0; i < giftArr.length; i++) {
    idNum[giftArr[i].giftId.toString()] = giftArr[i].sendNum;
  }

  if (giftArr.length) {
    result += '赠送商品（您已选择<span style="color:red;">'
      + giftArr.length
      +
      '</span>个赠品，<a href="javascript:;" data-toggle="modal" data-target="#gift_goods_list_box" class="sui-btn btn-small btn-primary">点击查看</a>)';

    require(['utils'], function(utils) {
      var giftIds = giftArr.map(function(obj) {
        return obj.giftId;
      }).join(',');

      var url = '/merchant/queryGoodsInfoByIds?goodsIds=' + giftIds;
      utils.ajax_(url, {}, 'get', false, function(data) {
        if (data.code === '000') {
          var temp_data = data.value.map(function(obj) {
            var tempObj = {
              'name': obj.goods_title,
              'price': obj.shop_price / 100,
              'num': idNum[obj.goods_id.toString()],
            };
            return tempObj;
          });
          var tmpl = document.getElementById('gift_list_context').innerHTML;
          var doTtmpl = doT.template(tmpl);
          $('#gift_goods_list_box #gift_list').html(doTtmpl(temp_data));
        }
      });
    });
  }

  return result;
}

function copyGoodsToDetail(goodsRule) {
  if (goodsRule.type) $('#goodsModifyModal select[name=__goodsIdsType]').val(goodsRule.type);

  if (goodsRule.promotion_goods && goodsRule.promotion_goods !== 'all') {
    copySelectedGoodsToShow(goodsRule.promotion_goods);
  }
}

function copySelectedGoodsToShow(goodsIds) {
  var url = 'goods/getGoodInfoByIdsAndFields';
  var params = {};
  params.ids = goodsIds;
  params.fields = 'goods_id,goods_title,shop_price,goods_code';

  require(['utils'], function(utils) {
    utils.doGetOrPostOrJson(url, params, 'get', false, function(data) {
      if (data.code === '000') {
        console.log(data);
        require(['goods_box'], function(goods_box) {
          goods_box.firstSelectGoods(data.value, goodsIds);
        });
      }
    });
  });
}
