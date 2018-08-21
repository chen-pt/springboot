/**
 * Created by Administrator on 2017/3/12.。
 */
define(['core', 'utils'], function (core, utils) {
  var couponNew = {}
  couponNew.pageno = 1
  couponNew.cur_per_page = 15

  couponNew.defeatedSubmit =function($parent){
    $('#coupon_send').off('click.a').prop('type', 'submit')
    $('#coupon_later').off('click.a').prop('type', 'submit')
    $('#coupon_send').attr("disabled",false);
    $('#coupon_later').attr("disabled",false);
  }
  couponNew.create_ = function (action_url) {
    core.formatDate()
    var $parent = $('#coupon_form')
    var couponRule = couponNew.getDataFromPage($parent)
    if (typeof(couponRule) === 'string') {
      layer.msg(couponRule)
      console.log("创建失败-0")
      couponNew.defeatedSubmit($parent)
      return
    }
    $('#coupon_send').on('click.a', function () {
      layer.msg('请不要重复提交')
    })
    $('#coupon_send').prop('type', 'button')

    $('#coupon_later').on('click.a', function () {
      layer.msg('请不要重复提交')
    })
    $('#coupon_later').prop('type', 'button')
    var url = 'couponRule/createCouponRule'
    doGetOrPostOrJson(url, couponRule, 'json', true, function (data) {
      if (data.code === '000') {
        layer.msg('添加成功')
        if(!action_url){
          action_url= '/merchant/couponListManager'
        }
        location.href = core.getHost() +action_url
      } else {
        layer.msg('创建失败，请刷新页面')
      }
    })
  }
  couponNew.buildCoupon = function (callback) {
    var params = {}
    params.ruleId = $('input[name=rule_id]').val()
    params.preStatus = $('input[name=status]').val()
    params.toUpdateStatus = 0

    var url = core.getHost() + '/merchant/updateCouponStatus'
    $.post(url, params, function (data) {
      if (data.code == '000') {
        callback()
      } else if (data.code == '101') {
        layer.msg(data.message)
      } else {
        layer.msg('发放优惠券失败')
      }
    })
  }

  couponNew.cancelCoupon = function () {
    var params = {}
    params.rule_id = $('[name=rule_id]').val()

    var url = core.getHost() + '/merchant/cancelCoupon'
    $.post(url, params, function (msg) {
      if (msg.code == '000') {
        location.href = core.getHost() + '/merchant/couponManager'
      } else {
        layer.msg('手动停止优惠券失败')
      }
    })
  }

  couponNew.showDataToPage = function (couponRuleId,isSteps) {
    if(isSteps){
      $('#coupon_steps').show()
    }
    var couponRule = ''

    couponRuleId = typeof(couponRuleId) === 'string' ? parseInt(couponRuleId) : couponRuleId
    var url = '/merchant/getCouponDetail/'
    var params = {'ruleId': couponRuleId}
    utils.ajax_(url, params, 'get', false, function (data) {
      if (data.code === '000') {
        couponRule = JSON.parse(data.value)
      }
    })

    if (!couponRule) {
      console.log('error on getCouponRuleInfo')
      return
    }

    var $parent = $('#coupon_form')

    var temp_result = couponNew.copyDataToPage($parent, couponRule)
    if (typeof(temp_result) === 'string') {
      console.log(temp_result)
      return
    }
    if(isSteps){
      $('#coupon_submit').html('保存,稍后发放')
      $('#coupon_submit_send').show()
      $('#coupon_back').hide()
      $('#coupon_submit').removeClass()
      $('#coupon_submit').addClass('sui-btn btn-xlarge btn-warning')
    }
  }

  couponNew.edit_ = function (action) {
    core.formatDate()
    var $parent = $('#coupon_form')
    var couponRule = couponNew.getDataFromPage($parent)
    if (typeof(couponRule) === 'string') {
      layer.msg(couponRule)
      return
    }

    var $parent = $('#coupon_form')
    couponRule.ruleId = parseInt(core.getUrlParam('couponRuleId'))
    couponRule.status = parseInt($parent.find('input[name=status]').val())

    var url = 'couponRule/editCouponRule'
    if(action){
      url='couponRule/editCouponRuleAndRelease'
    }
    doGetOrPostOrJson(url, couponRule, 'json', true, function (data) {
      if (data.code === '000') {
        layer.msg('编辑成功')
        if(action){
          var action_url=core.getHost()+action+'?ruleId='+data.value
          location.href = action_url
        }else {
          location.href = core.getHost() + '/merchant/couponListManager'
        }
      } else {
        layer.msg(data.message)
      }
    })
  }

  /**
   * 复制数据到页面
   * @param $parent jquery的父定位
   * @param couponRule 从 ‘/merchant/getCouponDetail/’ 获取的CouponRule对象
   */
  couponNew.copyDataToPage = function ($parent, couponRule) {
    clearDefaultValue($parent)
    $parent.find('input[name=status]').val(couponRule.status)

    // 优惠标签
    $parent.find('input[name=markedWords]').val(couponRule.markedWords)

    // 优惠名称
    $parent.find('input[name=ruleName]').val(couponRule.ruleName)

    // 优惠类型（规则）
    var temp_result = showGoodsRuleToPage($parent, JSON.parse(couponRule.goodsRule), couponRule.couponType)
    if (typeof(temp_result) === 'string') return temp_result

    // 数量
    var sign = ''
    if (couponRule.total === -1) {
      sign = -1
    } else {
      sign = 1
      $parent.find('input[name=amount_val]').val(couponRule.total)
    }
    $parent.find('input[name=amount][value=' + sign + ']').trigger('click')

    // 有效期
    temp_result = copyTimeRuleToPage($parent, JSON.parse(couponRule.timeRule))
    if (typeof(temp_result) === 'string') return temp_result

    // 是否首单
    var limitRule = JSON.parse(couponRule.limitRule)
    $parent.find('input[name=is_first_order][value=' + limitRule.is_first_order + ']').trigger('click')

    // 适用门店
    temp_result = copyLimitRuleToPage($parent, limitRule)
    if (typeof(temp_result) === 'string') return temp_result

    // 订单类型
    $parent.find('input[name=order_type]:checked').attr('checked', false)
    limitRule.order_type.split(',').forEach(function (item) {
      $parent.find('input[name=order_type][value=' + item + ']').trigger('click')
    })
    // todo 100,300合并，
    var order_type = limitRule.order_type.split(',')
    if ($.inArray('100', order_type) > -1 || $.inArray('300', order_type) > -1) {
      $parent.find('input[name=order_type][value=\'100,300\']').attr('checked', true)
    }

    // 使用渠道
    $parent.find('input[name=apply_channel][value=\'' + limitRule.apply_channel + '\']').trigger('click')

    // 是否分享
    $parent.find('input[name=is_share][value=' + limitRule.is_share + ']').trigger('click')

    // 商家备注
    $parent.find('textarea[name=limitRemark]').val(couponRule.limitRemark)
  }

  /**
   * 从页面活动输出，组装CouponRule对象
   * @param $parent jquery的父定位
   * @returns object类型的couponRule,或者是string类型的报错信息
   */
  couponNew.getDataFromPage = function ($parent) {
    var couponRule = {}
    couponRule.aimAt = 1
    // 优惠标签
    var markedWords = $parent.find('input[name=markedWords]').val()
    couponRule.markedWords = markedWords

    // 优惠名称
    var ruleName = $parent.find('input[name=ruleName]').val()
    couponRule.ruleName = ruleName ? ruleName : markedWords

    // 优惠类型（规则）
    var goodsRule = getGoodsRule($parent, couponRule)
    if (typeof(goodsRule) === 'string')
      return goodsRule
    else
      couponRule.goodsRule = goodsRule

    // 数量
    var temp_result = getAmount($parent, couponRule)
    if (typeof(temp_result) === 'string') return temp_result

    // 有效期
    temp_result = getTimeRule($parent, couponRule)
    if (typeof(temp_result) === 'string') return temp_result
    couponRule.timeRule = temp_result

    // 是否首单
    var limitRule = {}
    var is_first_order = parseInt($parent.find('input[name=is_first_order]:checked').val())
    if (typeof(is_first_order) === 'number') limitRule.is_first_order = is_first_order
    else return '请选择是否首单'

    // 适用门店
    temp_result = getStore($parent, limitRule)
    if (typeof(temp_result) === 'string') return temp_result

    // 订单类型
    var order_type = $parent.find('input[name=order_type][type=checkbox]:checked').map(function (index, elem) {
      return $(elem).val()
    }).get().join(',')
    if (!order_type) return '请选择订单类型'
    limitRule.order_type = order_type

    // 适用渠道
    var apply_channel = $parent.find('input[name=apply_channel]:checked').val()
    if (!apply_channel) return '请选择适用渠道'
    limitRule.apply_channel = apply_channel

    // 是否分享
    var is_share = parseInt($parent.find('input[name=is_share]:checked').val())
    limitRule.is_share = is_share
    switch (is_share) {
      case 0:
        break
      case 1:
        limitRule.can_get_num = 1
        break
      default:
        return '请选择是否分享'
    }

    // 商家备注
    couponRule.limitRule = limitRule
    var remark=$parent.find('textarea[name="limitRemark"]').val()
    couponRule.limitRemark=remark
    return couponRule
  }

  return couponNew
})

function showGoodsRuleToPage ($parent, goodsRule, couponType) {
  var href = ''
  var temp_result = {}
  switch (couponType) {
    case 100: // 现金券
      href = 'cash-coupon'
      var $parent_ = $parent.find('#' + href)
      temp_result = showCashCouponToPage($parent_, goodsRule)
      break

    case 200: // 打折券
      href = 'discount-coupon'
      var $parent_ = $parent.find('#' + href)
      temp_result = showDiscountCouponToPage($parent_, goodsRule)
      break

    case 300: // 限价券
      href = 'limit-price-coupon'
      var $parent_ = $parent.find('#' + href)
      temp_result = showLimitPriceCouponToPage($parent_, goodsRule)
      break

    case 500: // 满赠券
      href = 'gift-coupon'
      var $parent_ = $parent.find('#' + href)
      temp_result = showGiftCouponToPage($parent_, goodsRule)
      break

    default:
      return 'error on couponRule.couponType'
  }
  if (typeof(temp_result) === 'string') return temp_result

  $parent.find('#tab li a[href=\'#' + href + '\']').trigger('click')
}

function showGiftCouponToPage ($parent, goodsRule) {
  console.log('showGiftCouponToPage')
  console.log(goodsRule)
  // 选择购买商品及组合方式
  $parent.find('input[name=calculateBase][value=' + goodsRule.gift_calculate_base + ']').trigger('click')
  var temp_result = showGoodsToPage($parent, goodsRule.promotion_goods, goodsRule.type)
  if (typeof(temp_result) === 'string') return temp_result

  // 设置赠送条件
  var rule = goodsRule.rule
  var $parent_ = $parent.find('input[name=rule_type][value=' + goodsRule.rule_type + ']').parent()
  $parent_.children('input[name=rule_type]').trigger('click')
  switch (goodsRule.rule_type) {
    case 1:
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.meetNum, 'rightValue': item.sendNum}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData($parent_.next(), temp_data)
      })
      break
    case 2:
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.meetMoney / 100, 'rightValue': item.sendNum}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData($parent_.next(), temp_data)
      })
      break
    default:
      return 'error on goodsRule.rule_type'
  }

  // 选择赠送的商品
  $parent.find('input[name=sendType][value=' + goodsRule.gift_send_type + ']').trigger('click')
  if (goodsRule.gift_send_type !== 2) {
    require(['gift_box'], function (gift_box) {
      gift_box.showSelectList(goodsRule.gift_storage)
    })
  } else {
    require(['gift_box2'], function (gift_box2) {
      gift_box2.showToGiftBoxForCopyOrEdit(goodsRule.gift_storage)
    })
  }
}

function showLimitPriceCouponToPage ($parent, goodsRule) {
  // 商品弹框
  var temp_result = showGoodsToPage($parent, goodsRule.promotion_goods, goodsRule.type)
  if (typeof(temp_result) === 'string') return temp_result

  // 剩余部分
  var rule = goodsRule.rule
  $parent.find('input[name=fixed-price]').val(rule.each_goods_price / 100)
  $parent.find('input[name=buy-num-each-order]').val(rule.buy_num_max)
  $parent.find('input[name=storage]').val(rule.each_goods_max_buy_num)
}

function showDiscountCouponToPage ($parent, goodsRule) {
  // 商品弹框
  var temp_result = showGoodsToPage($parent, goodsRule.promotion_goods, goodsRule.type)
  if (typeof(temp_result) === 'string') return temp_result

  // 是否抹零
  if (goodsRule.is_ml === 1) {
    if (goodsRule.is_round)
      $parent.find('input[name=ml-radio][value=1]').trigger('click')
    else
      $parent.find('input[name=ml-radio][value=3]').trigger('click')
  } else if (goodsRule.is_ml === 2) {
    if (goodsRule.is_round)
      $parent.find('input[name=ml-radio][value=2]').trigger('click')
    else
      $parent.find('input[name=ml-radio][value=4]').trigger('click')
  } else {
    return 'error on goodsRule.is_ml'
  }

  // 剩余部分
  $parent = $parent.find('input[name=rule_type][value=' + goodsRule.rule_type + ']').parent()
  $parent.children('input[name=rule_type]').trigger('click')
  var rule = goodsRule.rule

  switch (goodsRule.rule_type) {
    case 4: // 设置打折比率
      $parent.find('input[name=direct_discount]').val(rule.direct_discount / 10)
      if (rule.max_reduce) {
        $parent.find('input[name=max_reduce_sign]').trigger('click')
        $parent.find('input[name=max_reduce]').val(rule.max_reduce / 100)
      }
      break

    case 1: // 满多少元，打多少折
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.meet_money / 100, 'rightValue': item.discount / 10}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData($parent.next(), temp_data)
      })
      break

    case 5: // 第二件打折
      $parent.find('input[name=discount]').val(rule.discount / 10)
      if (rule.max_buy_num) {
        $parent.find('input[name=max_reduce_sign]').trigger('click')
        $parent.find('input[name=max_reduce]').val(rule.max_buy_num)
      }
      break

    case 2: // 满多少件，打多少折
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.meet_num, 'rightValue': item.discount / 10}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData($parent.next(), temp_data)
      })
      break
    case 6: // 满多少米，打多少折
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.distance_meter, 'rightValue': item.discount / 10}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData_select($parent.next(), temp_data)
      })
      break

    default:
      return 'error on goodsRule.rule_type'
  }
}

function showCashCouponToPage ($parent, goodsRule) {
  // 商品部分
  var temp_result = showGoodsToPage($parent, goodsRule.promotion_goods, goodsRule.type)
  if (typeof(temp_result) === 'string') return temp_result

  // 剩余部分
  $parent = $parent.find('input[name=rule_type][value=' + goodsRule.rule_type + ']').parent()
  $parent.children('input[name=rule_type]').trigger('click')
  var rule = goodsRule.rule

  switch (goodsRule.rule_type) {
    case 4: // 有就减多少元
      $parent.find('input[name=direct_money]').val(rule.direct_money / 100)
      break

    case 0: // 每满多少元，减多少元(按比例)
      $parent.find('input[name=each_full_money]').val(rule.each_full_money / 100)
      $parent.find('input[name=reduce_price]').val(rule.reduce_price / 100)
      if (rule.max_reduce) {
        $parent.find('input[name=max_reduce_checkbox]').trigger('click')
        $parent.find('input[name=max_reduce]').val(rule.max_reduce / 100)
      }
      break

    case 1: //满多少元，减多少元(自定义)
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.meet_money / 100, 'rightValue': item.reduce_price / 100}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData($parent.next(), temp_data)
      })
      break
    case 6: //多少距离之内，减多少元
      var temp_data = rule.map(function (item) {
        var tempObj = {'leftValue': item.distance_meter, 'rightValue': item.reduce_price / 100}
        return tempObj
      })
      require(['utils'], function (utils) {
        utils.showLadderData_select($parent.next(), temp_data)
      })
      break

    default:
      return 'error on goodsRule.rule_type'
  }
}

/**
 *
 * @param $parent
 * @param goodsIds
 * @param type 0:全部, 2:指定参加, 3:指定不参加
 */
function showGoodsToPage ($parent, goodsIds, type) {
  $parent.find('select[name=type]').val(type)

  if (parseInt(type) !== 0) {
    $parent.find('.GoodsIdsTypeCheck').show()
    require(['goods_box'], function (goods_box) {
      goods_box.showSelectList(goodsIds)
    })
  }
}

function copyLimitRuleToPage ($parent, limitRule) {
  $parent.find('input[name=apply_store][value=' + limitRule.apply_store + ']').trigger('click')

  switch (limitRule.apply_store) {
    case -1: // 全部门店
      break
    case 2: // 指定区域内的门店
      $parent.find('input[name=order_type][value=200]').prop('disabled', 'true')
      require(['area_box'], function (area_box) {
        area_box.showSelectList(limitRule.use_stores)
      })
      break
    case 1: // 指定门店
      $parent.find('input[name=order_type][value=200]').prop('disabled', 'true')
      require(['store_box'], function (store_box) {
        store_box.show_select_list(limitRule.use_stores)
      })
      break
    default:
      return 'error on limitRule.apply_store'
  }
}

function copyTimeRuleToPage ($parent, timeRule) {
  $parent.find('input[name=validity_type][value=' + timeRule.validity_type + ']').trigger('click')
  switch (timeRule.validity_type) {
    case 1: // 绝对时间
      $parent.find('input[name=start_time]').val(timeRule.startTime)
      $parent.find('input[name=end_time]').val(timeRule.endTime)
      break
    case 4: // 秒杀时间
      $parent.find('input[name=m_date]').val(timeRule.startTime.slice(0, 10))
      $parent.find('input[name=m_start_time]').val(timeRule.startTime.slice(11, 16))
      $parent.find('input[name=m_end_time]').val(timeRule.endTime.slice(11, 16))
      break
    case 2: // 相对时间
      $parent.find('input[name=how_day]').val(timeRule.how_day)
      break
    default:
      return 'error on timeRule.validity_type'
  }
}

function clearDefaultValue ($parent) {
  $parent.find('input[name=amount]:checked').attr('checked', false)
  $parent.find('input[name=validity_type]:checked').attr('checked', false)
  $parent.find('input[name=is_first_order]:checked').attr('checked', false)
  $parent.find('input[name=apply_store]:checked').attr('checked', false)
  $parent.find('input[name=order_type]:checked').attr('checked', false)
  $parent.find('input[name=apply_channel]:checked').attr('checked', false)
  $parent.find('input[name=is_share]:checked').attr('checked', false)
}

function getStore ($parent, limitRule) {
  var apply_store = parseInt($parent.find('input[name=apply_store]:checked').val())
  limitRule.apply_store = apply_store
  switch (apply_store) {
    case -1:
      break
    case 1:
      var use_stores = $('#select_stores input[name=__storeIds]').val()
      if (!use_stores) return '请选择指定门店';
      limitRule.use_stores = use_stores
      break
    case 2:
      var not_empty_store = true
      var use_stores = $('#area-box input[name=__cityIds]').val()
      if (!use_stores) return '适用门店请选择指定区域'
      limitRule.use_stores = use_stores
      var url = 'store/selectStoreInfoByCityIds'
      doGetOrPostOrJson(url, {'cityIds': use_stores}, 'get', false, function (data) {
        if (data.code == '000') {
          if(data.value.length < 1)
            not_empty_store = false
        }
      })
      if(!not_empty_store){
        return '指定区域内无可指定门店'
      }
      break
    default:
      return '请选择适用门店'
  }
}

function getTimeRule ($parent) {
  var validity_type = parseInt($parent.find('input[name=validity_type]:checked').val())
  var timeRule = {}
  var $targetParent = $parent.find('input[name=validity_type][value=' + validity_type + ']').parent()
  switch (validity_type) {
    case 1:
      var startTime = $targetParent.find('input[name=start_time]').val()
      var endTime = $targetParent.find('input[name=end_time]').val()
      if (!startTime || !endTime) return '请填写绝对时间'
      startTime = parseDate(startTime)
      endTime = parseDate(endTime)
      endTime.setHours(23)
      endTime.setMinutes(59)
      endTime.setSeconds(59)
      if (endTime > new Date()){
        if (startTime < endTime) {
          timeRule.startTime = startTime.format('yyyy-MM-dd')
          timeRule.endTime = endTime.format('yyyy-MM-dd')
        }
        else {
          return '绝对时间的开始时间不能大于结束时间'
        }
      }else {
        return '绝对时间的结束时间必须大于今天'
      }
      break
    case 4:
      var date = $parent.find('input[name=m_date]').val()
      var startTime = $parent.find('input[name=m_start_time]').val()
      var endTime = $parent.find('input[name=m_end_time]').val()
      if (!date || !startTime || !endTime) return '请填写秒杀时间'
      startTime = parseDate(date + ' ' + startTime + ':00')
      endTime = parseDate(date + ' ' + endTime + ':59')
      if (endTime > new Date())
        if (startTime < endTime) {
          timeRule.startTime = startTime.format()
          timeRule.endTime = endTime.format()
        }
        else
          return '秒杀时间的开始时间不能大于结束时间'
      else
        return '秒杀时间的结束时间必须大于现在'
      break
    case 2:
      var how_day = parseInt($parent.find('input[name=how_day]').val())
      if (how_day) {
        timeRule.how_day = how_day
        timeRule.draw_day = 0
      } else
        return '请填写领取后几天内使用'
      break
    default:
      return '请选择有效期类型'
  }
  timeRule.validity_type = validity_type
  return timeRule
}

function getAmount ($parent, couponRule) {
  var amount = parseInt($parent.find('input[name=amount]:checked').val())
  if (amount === -1) {
    couponRule.amount = -1
  } else if (amount === 1) {
    amount = parseInt($parent.find('input[name=amount_val]').val())
    if (amount)
      couponRule.amount = amount
    else
      return '请填写限制数量'
  } else {
    return '请选择数量'
  }
}

function getGoodsRule ($parent, couponRule) {
  var tab = $parent.find('#tab li.active').children().attr('href')
  var goodsRule
  switch (tab) {
    case '#cash-coupon':
      couponRule.couponType = 100
      goodsRule = getCashCoupon($parent.find(tab))
      break
    case '#discount-coupon':
      couponRule.couponType = 200
      goodsRule = getDiscountCoupon($parent.find(tab))
      break
    case '#limit-price-coupon':
      couponRule.couponType = 300
      goodsRule = getLimitPriceCoupon($parent.find(tab))
      break
    case '#gift-coupon':
      couponRule.couponType = 500
      goodsRule = getGiftCoupon($parent.find(tab))
      break
    default:
      return '请选择优惠类型'
  }
  return goodsRule
}

function getGiftCoupon ($parent) {
  var giftCoupon = {}
  giftCoupon.is_post = 0
  var rule = {}

  var gift_calculate_base = parseInt($parent.find('input[name=calculateBase]:checked').val())
  if (!gift_calculate_base) return '请选择购买商品及组合方式'
  giftCoupon.gift_calculate_base = gift_calculate_base

  var temp_result = getGoods($parent, giftCoupon)
  if (typeof(temp_result) === 'string') return temp_result

  var rule_type = parseInt($parent.find('input[name=rule_type]:checked').val())
  if (!rule_type) return '请设置赠送条件'
  giftCoupon.rule_type = rule_type
  var ladderData = getLadderData($parent.find('input[name=rule_type][value=' + rule_type + ']').parent().next().children('span'), true, true)
  switch (ladderData) {
    case 'leftEmpty':
      return '满赠券设置赠送条件左边不应该为空'
    case 'leftNotIncre':
      return '满赠券设置赠送条件左边应该递增'
    case 'rightEmpty':
      return '满赠券设置赠送条件右边不应该为空'
    case 'rightNotIncre':
      return '满赠券设置赠送条件右边应该递增'
  }

  switch (rule_type) {
    case 1:
      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        tempObj.meetNum = obj.leftValue
        tempObj.sendNum = obj.rightValue
        tempObj.ladder = index + 1
        return tempObj
      })
      break

    case 2:
      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        tempObj.meetMoney = obj.leftValue * 1000 / 10
        tempObj.sendNum = obj.rightValue
        tempObj.ladder = index + 1
        return tempObj
      })
      break

    default:
      return '类型错误'
  }

  var gift_send_type = parseInt($parent.find('input[name=sendType]:checked').val())
  if (!gift_send_type) return '请选择赠送的类型'
  giftCoupon.gift_send_type = gift_send_type

  var gift_storage = getGift(gift_send_type)
  if (typeof(gift_storage) === 'string') return gift_storage

  giftCoupon.rule = rule
  giftCoupon.gift_storage = gift_storage
  return giftCoupon
}

function getGift (gift_send_type) {
  if (gift_send_type === 2) {
    var temp_data = $('#selected_gift_box input[name=__giftIdAndNum]').val()
    if (temp_data.startsWith('error')) return temp_data.split(',')[1]
    if (!temp_data) return '请点击选择赠品，确定赠品数量'

    var goodsBoxGoodsIds = $('#much_select_goods input[name=__goodsIds]').val()
      .split(',').map(function (item) {
        return parseInt(item)
      }).sort(compare)
    var giftBoxGiftIds = JSON.parse(temp_data).map(function (item) {
      return parseInt(item.id)
    }).sort(compare)
    var errorMsg = '赠品弹窗数据未同步，请点击 \'送同种商品\' 同步数据并修改库存数量'
    if (goodsBoxGoodsIds.length === giftBoxGiftIds.length) {
      for (var i = 0; i < goodsBoxGoodsIds.length; i++) {
        if (goodsBoxGoodsIds[i] !== giftBoxGiftIds[i]) return errorMsg
      }
    } else {
      return errorMsg
    }

    var gift_storage = JSON.parse(temp_data).map(function (item) {
      var tempObj = {}
      tempObj.giftId = item.id
      tempObj.sendNum = item.num
      tempObj.total = item.num
      return tempObj
    })
  } else {
    var gift_storage = $('#select-gifts-box input[name=__giftIdsAndNum]').val()
    if (!gift_storage) return '请选择赠品'
    gift_storage = JSON.parse(gift_storage).map(function (obj, index) {
      var tempObj = {}
      tempObj.giftId = obj.giftId
      tempObj.sendNum = obj.sendNum
      tempObj.total = obj.sendNum
      return tempObj
    })
  }

  return gift_storage
}


function getLimitPriceCoupon ($parent) {
  var limitPriceCoupon = {}
  limitPriceCoupon.is_post = 0
  limitPriceCoupon.rule_type = 3
  var rule = {}

  var temp_result = getGoods($parent, limitPriceCoupon)
  if (typeof(temp_result) === 'string') return temp_result

  var each_goods_price = $parent.find('input[name=fixed-price]').val()
  if (!each_goods_price) return '限价券请填写商品限价'
  rule.each_goods_price = each_goods_price * 1000 / 10

  var buy_num_max = parseInt($parent.find('input[name=buy-num-each-order]').val())
  if (!buy_num_max) return '限价券请填写每件商品最多可购买件数'
  rule.buy_num_max = buy_num_max

  var each_goods_max_buy_num = parseInt($parent.find('input[name=storage]').val())
  if (!each_goods_max_buy_num) return '限价券请填写每件商品总计可购买件数'
  rule.each_goods_max_buy_num = each_goods_max_buy_num

  if(!(each_goods_max_buy_num>=buy_num_max)){
    return '商品购买总计必须大于等于商品单次购买总计'
  }
  limitPriceCoupon.rule = rule
  return limitPriceCoupon
}

function getDiscountCoupon ($parent) {
  var discountCoupon = {}
  discountCoupon.is_post = 0

  var temp_result = getGoods($parent, discountCoupon)
  if (typeof(temp_result) === 'string') return temp_result

  temp_result = parseInt($parent.find('input[name=ml-radio]:checked').val())
  if(!temp_result){
    temp_result=parseInt($parent.find('select[name=ml-radio]').val())
  }
  switch (temp_result) {
    case 1:
      discountCoupon.is_ml = 1
      discountCoupon.is_round = 1
      break
    case 2:
      discountCoupon.is_ml = 2
      discountCoupon.is_round = 1
      break
    case 3:
      discountCoupon.is_ml = 1
      discountCoupon.is_round = 0
      break
    case 4:
      discountCoupon.is_ml = 2
      discountCoupon.is_round = 0
      break
    default:
      return '请选择抹零级别'
  }

  var rule_type = parseInt($parent.find('input[name=rule_type]:checked').val())
  discountCoupon.rule_type = rule_type
  var rule = {}
  $parent = $parent.find('input[name=rule_type][value=' + rule_type + ']').parent()
  switch (rule_type) {
    case 4: // 直接打折
      var direct_discount = $parent.find('input[name=direct_discount]').val()
      if (!direct_discount) return '请填写直接打折折扣'
      rule.direct_discount = direct_discount * 10
      if ($parent.find('input[name=max_reduce_sign]:checked').size()) {
        var max_reduce = $parent.find('input[name=max_reduce]').val()
        if (!max_reduce) return '请填写直接打折最多优惠金额'
        rule.max_reduce = max_reduce * 1000 / 10
      } else {
        rule.max_reduce = 0
      }
      break

    case 1: // 满元打折
      var ladderData = getLadderData($parent.next().children('span'), true, false)
      switch (ladderData) {
        case 'leftEmpty':
          return '满元打折左边不应该为空'
        case 'leftNotIncre':
          return '满元打折左边应该递增'
        case 'rightEmpty':
          return '满元打折右边不应该为空'
        case 'rightNotIncre':
          return '满元打折右边应该递减'
      }

      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        tempObj.meet_money = obj.leftValue * 1000 / 10
        tempObj.discount = obj.rightValue * 10
        tempObj.ladder = index + 1
        return tempObj
      })
      break

    case 5: // 第二件打折
      rule.how_piece = 2
      var discount = $parent.find('input[name=discount]').val()
      if (!discount) return '第二件打折折扣不能为空'
      rule.discount = discount * 10

      if ($parent.find('input[name=max_reduce_sign]:checked').size()) {
        var max_buy_num = parseInt($parent.find('input[name=max_reduce]').val())
        if (!max_buy_num) return '最多优惠件数需大于0'
        rule.max_buy_num = max_buy_num
      } else {
        rule.max_buy_num = 0
      }
      break

    case 2: // 满减打折
      var ladderData = getLadderData($parent.next().children('span'), true, false)
      switch (ladderData) {
        case 'leftEmpty':
          return '满件打折左边不应该为空'
        case 'leftNotIncre':
          return '满件打折左边应该递增'
        case 'rightEmpty':
          return '满件打折右边不应该为空'
        case 'rightNotIncre':
          return '满件打折右边应该递减'
      }

      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        tempObj.meet_num = obj.leftValue
        tempObj.discount = obj.rightValue * 10
        tempObj.ladder = index + 1
        return tempObj
      })
      break
    case 6: //满距打折
      var ladderData = getLadderData_select($parent.next().children('span'), true, false)
      switch (ladderData) {
        case 'leftEmpty':
          return '满距打折左边不应该为空'
        case 'leftNotIncre':
          return '满距打折左边应该递增'
        case 'rightEmpty':
          return '满距打折右边不应该为空'
        case 'rightNotIncre':
          return '满距打折右边应该递减'
      }

      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        if (!Math.floor(obj.leftValue) === obj.leftValue) {
          return '满距打折左边应该是一个正整数'
        }
        tempObj.distance_meter = obj.leftValue
        tempObj.discount = obj.rightValue * 10
        tempObj.ladder = index + 1
        return tempObj
      })
      break

    default:
      return '请选择打折券类型'
  }

  discountCoupon.rule = rule

  return discountCoupon
}

function getCashCoupon ($parent) {
  var cashCoupon = {}
  cashCoupon.is_post = 0

  var temp_result = getGoods($parent, cashCoupon)
  if (typeof(temp_result) === 'string') return temp_result

  var rule_type = parseInt($parent.find('input[name=rule_type]:checked').val())
  cashCoupon.rule_type = rule_type
  var rule = {}
  $parent = $parent.find('input[name=rule_type][value=' + rule_type + ']').parent()
  switch (rule_type) {
    case 4: // 立减多少元
      var direct_money = $parent.find('input[name=direct_money]').val()
      if (!direct_money) return '请填写立减金额'
      rule.direct_money = direct_money * 1000 / 10
      break

    case 0: // 每满多少元减多少元
      var each_full_money = $parent.find('input[name=each_full_money]').val()
      if (!each_full_money) return '请填写每满金额'
      rule.each_full_money = each_full_money * 1000 / 10

      var reduce_price = $parent.find('input[name=reduce_price]').val()
      if (!reduce_price) return '请填写减少金额'
      rule.reduce_price = reduce_price * 1000 / 10
      if (rule.each_full_money < rule.reduce_price) return '每满金额不能小于减少金额'

      var max_reduce_sign = $parent.find('input[name=max_reduce_checkbox]:checked').size()
      if (max_reduce_sign) {
        var max_reduce = $parent.find('input[name=max_reduce]').val()
        if (!max_reduce) return '请填写封顶金额'
        rule.max_reduce = max_reduce * 1000 / 10
        if (rule.reduce_price > rule.max_reduce) return '满减金额不能大于封顶金额'
      } else {
        rule.max_reduce = 0
      }
      break

    case 1: // 满多少元减多少元
      var ladderData = getLadderData($parent.next().children('span'), true, true)
      switch (ladderData) {
        case 'leftEmpty':
          return '现金券满减左边不应该为空'
        case 'leftNotIncre':
          return '现金券满减左边应该递增'
        case 'rightEmpty':
          return '现金券满减右边不应该为空'
        case 'rightNotIncre':
          return '现金券满减右边应该递增'
      }

      var sign = 0
      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        tempObj.meet_money = obj.leftValue * 1000 / 10
        tempObj.reduce_price = obj.rightValue * 1000 / 10
        if (tempObj.meet_money < tempObj.reduce_price) sign = '减少金额不能大于满足金额'
        tempObj.ladder = index + 1
        return tempObj
      })
      if (typeof(sign) === 'string') return sign

      break
    case 6: // 满多少元减多少元
      var ladderData = getLadderData_select($parent.next().children('span'), true, true)
      switch (ladderData) {
        case 'leftEmpty':
          return '现金券距离不应该为空'
        case 'leftNotIncre':
          return '现金券距离应该递增'
        case 'rightEmpty':
          return '现金券满减金额不应该为空'
        case 'rightNotIncre':
          return '现金券满减金额应该递增'
      }

      var sign = 0
      rule = ladderData.map(function (obj, index) {
        var tempObj = {}
        if (!Math.floor(obj.leftValue) === obj.leftValue) {
          return '满现金券距离应该是正整数'
        }
        tempObj.distance_meter = obj.leftValue
        tempObj.reduce_price = obj.rightValue * 1000 / 10
        tempObj.ladder = index + 1
        return tempObj
      })
      if (typeof(sign) === 'string') return sign

      break
    default:
      return '请选择现金券类型'
  }
  cashCoupon.rule = rule

  return cashCoupon
}

function getGoods ($parent, goodsRule) {
  var type = parseInt($parent.find('select[name=type]').val())
  if (isNaN(type)) {
    goodsRule.type = 2
  } else if (type === 0) {
    goodsRule.type = type
  } else {
    goodsRule.type = type ? type : 2
  }

  switch (goodsRule.type) {
    case 0:
      goodsRule.promotion_goods = 'all'
      break
    case 2:
    case 3:
      var promotion_goods = $('#much_select_goods input[name=__goodsIds]').val()
      if (!promotion_goods) return '请选择商品'
      goodsRule.promotion_goods = promotion_goods
      break
    default:
      return '请选择商品参加类型'
  }
}

/**
 *
 * @param $spans
 * @param leftIncre true 代表 左边递增, false 则是递减
 * @param rightIncre true 代表 右边递增， false 则是递减
 */
function getLadderData ($spans, leftIncre, rightIncre) {
  var old1 = 0, old2 = 0, new1 = 0, new2 = 0, result = []
  if (!leftIncre) old1 = 999999999
  if (!rightIncre) old2 = 999999999
  for (var i = 0; i < $spans.size(); i++) {
    new1 = parseFloat($spans.eq(i).find('input').eq(0).val())
    new2 = parseFloat($spans.eq(i).find('input').eq(1).val())

    if (!new1) return 'leftEmpty'
    if ((new1 > old1) !== leftIncre) return 'leftNotIncre'

    if (!new2) return 'rightEmpty'
    if ((new2 > old2) !== rightIncre) return 'rightNotIncre'
    if(new1==old1)
      return 'leftNotIncre'
    if(new2 == old2)
      return 'rightNotIncre'
    var obj = {}
    obj.leftValue = old1 = new1
    obj.rightValue = old2 = new2
    result.push(obj)
  }

  return result
}
function getLadderData_select ($spans, leftIncre, rightIncre) {
  var old1 = 0, old2 = 0, new1 = 0, new2 = 0, result = []
  if (!leftIncre) old1 = 999999999
  if (!rightIncre) old2 = 999999999
  for (var i = 0; i < $spans.size(); i++) {
    new1 = parseFloat($spans.eq(i).find('select').eq(0).val())
    new2 = parseFloat($spans.eq(i).find('input').eq(0).val())

    if (!new1) return 'leftEmpty'
    if ((new1 > old1) !== leftIncre) return 'leftNotIncre'

    if (!new2) return 'rightEmpty'
    if ((new2 > old2) !== rightIncre) return 'rightNotIncre'

    var obj = {}
    obj.leftValue = old1 = new1
    obj.rightValue = old2 = new2
    result.push(obj)
  }

  return result
}
/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */

/* -- 工具js 请保持在最下面 -- */

function parseDate (str) {
  var a
  if (str.length === 10) {
    var strDate = str.split('-')
    a = new Date(strDate[0], (strDate[1] - parseInt(1)), strDate[2])
  } else if (str.length === 19) {
    var strArray = str.split(' ')
    var strDate = strArray[0].split('-')
    var strTime = strArray[1].split(':')

    a = new Date(strDate[0], (strDate[1] - parseInt(1)), strDate[2], strTime[0], strTime[1], strTime[2])
  }
  return a
}

/**
 *
 * @param url
 * @param params
 * @param type 'post" or 'get" or "json"
 * @param async ajax同步还是异步
 * @param callback 回调函数
 * @param failCallback
 * @return {string}
 */
function doGetOrPostOrJson (url, params, type, async, callback, failCallback) {
  var obj = {}
  obj.url = url
  obj.requestParams = params
  obj.isPost = type

  var result = '' // 收集处理结果
  $.ajax({
    url: '/merchant/common/doGetOrPost',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    async: async,
    success: function (data) {
      callback(data)
    },
    error: function () {
      result = '请求失败'
      failCallback()
    }
  })

  return result
}

function compare (v1, v2) {
  if (v1 < v2) return -1
  else if (v1 > v2) return 1
  else return 0
}
