/**
 * 定义promotionRule的核心函数
 * create by ztq 2017-08-10
 */
define(['core'], function (core) {
  var rule = {}
  rule.pageno = 1
  rule.cur_per_page = 15

  /**
   * 保存活动规则
   */
  rule.create_ = function () {
    console.log('rule.create_()')
    var promotions = rule.getPageData()
    if (typeof(promotions) === 'string') {
      layer.msg(promotions)
      return
    }

    var url = 'promotions/rule/create'

    disableSubmit()
    doGetOrPost(url, promotions, 'post', true, function (data) {
      if (data && data.code && data.code === '000') {
        location.href = '/merchant/couponManager'
      } else {
        if (data && data.message)
          layer.msg(data.message)
        else
          layer.msg('创建失败')
        enableSubmit()
      }
    }, function () {
      enableSubmit()
    })

    function disableSubmit () {
      $('#promotionsSubmit').attr('disabled', true)
      $('#promotionsSubmit').off('click')
      $('#promotionsSubmit').on('click', function () {
        layer.msg('请不要重复提交')
      })
    }

    function enableSubmit () {
      $('#promotionsSubmit').attr('disabled', false)
      $('#promotionsSubmit').off('click')
      $('#promotionsSubmit').on('click', function () {
        $('#promotionsForm').submit()
      })
    }
  }

  /**
   * 编辑回显
   */
  rule.toEdit_ = function (promotionsId) {
    console.log('rule.toEdit_')
    console.log(promotionsId)

    var promotionsRule = getRuleById(promotionsId)
    if (typeof(promotionsRule) === 'string') {
      layer.msg('查询失败')
      return
    }

    var $parent = $('#promotionsForm')
    var result = rule.copyToNew(promotionsRule, $parent)
    if (result) {
      layer.msg(result)
      return
    }

    var $target = $('#promotionsForm #promotionsSubmit')
    $target.off('click')
    $target.attr('id', 'editSubmit').html('编辑提交')
  }

  rule.edit_ = function () {
    console.log('rule.edit_')
    var promotions = rule.getPageData()
    if (typeof(promotions) === 'string') {
      layer.msg(promotions)
      return
    }

    var promotionsRuleId = core.getUrlParam('promotionsId')
    if (!promotionsRuleId) {
      layer.msg('id丢失')
      return
    }

    var promotionsRule = getRuleById(promotionsRuleId)
    promotions.version = promotionsRule.version
    promotions.amount = promotionsRule.amount
    promotions.status = promotionsRule.status
    promotions.sendAmount = promotionsRule.sendAmount
    promotions.useAmount = promotionsRule.useAmount
    promotions.createTime = promotionsRule.createTime

    promotions.id = promotionsRule.id
    promotions.siteId = promotionsRule.siteId

    var url = 'promotions/rule/edit'

    doGetOrPost(url, promotions, 'post', true, function (data) {
      if (data && data.code && data.code === '000') {
        location.href = '/merchant/promotions/ruleDetail?id=' + promotions.id + '&ruleType=2'
      } else {
        if (data && data.message)
          layer.msg(data.message)
        else
          layer.msg('编辑失败')
      }
    }, function () {
    })
  }

  rule.copy_ = function (promotionsRuleId) {
    console.log('rule.copy_')
    console.log(promotionsRuleId)

    var promotionsRule = getRuleById(promotionsRuleId)
    if (typeof(promotionsRule) === 'string') {
      layer.msg('查询失败')
      return
    }

    var $parent = $('#promotionsForm')
    var result = rule.copyToNew(promotionsRule, $parent)
    if (result) {
      layer.msg(result)
      return
    }
  }

  /**
   * 详情页面
   */
  rule.show_ = function () {
    var ruleId = $('#edit_id').val()
    var url = core.getHost() + '/merchant/promotions/promRuleDetail'
    var param = {}
    param.id = ruleId
    param.ruleType = 2
    $.ajax({
      type: 'POST',
      url: url,
      data: param,
      async: false,
      complete: function (data) {
        if (data.code = '000') {
          console.log(data.code)
          var res = JSON.parse(data.responseText)
          if (res.value) {
            res = JSON.parse(res.value)
            $('input[name=promotions_status]').val(res.status)
            rule.promotions_rule_detail(res, core)
          }
        }
      }
    })
  }

  rule.promotions_rule_detail = function (res, core) {
    //类型
    if (res.promotionsType == 10) {
      $('#promotionsType').html('满赠活动')
    } else if (res.promotionsType == 20) {
      $('#promotionsType').html('打折活动')
    } else if (res.promotionsType == 30) {
      $('#promotionsType').html('包邮活动')
    } else if (res.promotionsType == 40) {
      $('#promotionsType').html('满减活动')
    } else if (res.promotionsType == 50) {
      $('#promotionsType').html('限价活动')
    }

    //状态
    if (res.status == 0) {
      $('#status').html('可发放')
    } else if (res.status == 1) {
      $('#status').html('已过期')
    } else if (res.status == 2) {
      $('#status').html('手动停发')
    } else if (res.status == 3) {
      $('#status').html('已发完')
    } else if (res.status == 10) {
      $('#status').html('待发放')
    }
    $('input[name=promotions_status]').val(res.status)

    //优惠编码
    $('#id').html(res.id)

    //名称
    $('#promotionsName').html(res.promotionsName)
    $('#label').html(res.label)

    //优惠类型proCouponRuleView
    var rule__ = JSON.parse(res.promotionsRule)
    var goodModifyButton = getGoodsModifyButton(res, rule__)

    if (goodModifyButton)
      switch (res.promotionsType) {
        case 10:
          $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(0).remove()
          $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(1).remove()
          $('#much_select_goods_container').show()
          break
        case 20:
        case 40:
          break
        case 30:
          $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(1).remove()
          $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(1).remove()
          break
        case 50:
          $('#goodsModifyModal').find('select[name=__goodsIdsType] option').eq(0).remove()
          $('#much_select_goods_container').show()
          break
      }

    copyGoodsToDetail(rule__)

    var pro = res.proCouponRuleView
    var Rule_Type = '<span style="color:red"></span>'
    if (pro != null) {
      var rule = ''
      if (pro.proruleDetail) {
        Rule_Type = '<span>' + pro.proruleDetail + '</span>' + goodModifyButton
      } else {
        layer.msg('活动类型查询失败')
      }
    } else {
      layer.msg('活动类型查询失败')
    }

    if (res.promotionsType == 30) {
      if (res.promotionsRule) {
        if (rule__.areaIdsType == 1) {
          Rule_Type += '&nbsp;&nbsp;<div data-toggle="modal" data-target="#expressFee" id="express" data-keyboard="false"  class="sui-btn btn-primary btn-lg">查看包邮地区</div>'
        } else if (rule__.areaIdsType == 2) {
          Rule_Type += '&nbsp;&nbsp;<div data-toggle="modal" data-target="#expressFee" id="express" data-keyboard="false"  class="sui-btn btn-primary btn-lg">查看不包邮地区</div>'
        }
        $('#areaIds').html(rule__.areaIds)
      } else {
        layer.msg('查询失败')
      }
    }

    //数量
    if (res.amount == -1) {
      $('#amount').html('不限量')
    } else {
      $('#amount').html('---')
    }
    var timeRule = JSON.parse(res.timeRule)
    var time = ''
    if (timeRule.validity_type == 1) {
      //绝对时间
      time += '固定时间：'
      time += timeRule.startTime + '&nbsp;-&nbsp;' + timeRule.endTime
      time += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
      if (res.status == 0 || res.status == 1 || res.status == 3) {
        time += '<button data-toggle="modal" data-target="#ValidityTimeModal" data-keyboard="false" class="sui-btn btn-primary btn-lg">延长有效期</button>'
      }
    } else if (timeRule.validity_type == 2) {
      //按每月
      time += '每月固定日期：'
      var days = ''
      var assgin = timeRule.assign_rule.split(',')
      var odd = 0
      var even = 0
      var flag = true
      //有可能点击的是单双月按钮
      if (assgin.length >= 15) {
        for (var i = 0; i < assgin.length; i++) {
          if (assgin[i]) {
            assgin[i] % 2 == 0 ? even++ : odd++
          }
        }
        if (odd == assgin.length) {
          time += '单号日'
          flag = false
        } else if (even == assgin.length) {
          time += '双号日'
          flag = false
        }
      }
      if (flag) {
        for (var i = 0; i < assgin.length; i++) {
          days += assgin[i] + '日、'
        }
        days = days.substring(0, days.length - 1)
      }

      time += days
      if (timeRule.lastDayWork) {
        time += '<br/>当月没有29日、30日、31日时，允许系统自动按每月最后' + timeRule.lastDayWork + '天计算'
      }
    } else if (timeRule.validity_type == 3) {
      //按每周
      time += '指定星期：'
      var week = ''
      // if(timeRule.assign_rule)
      var weeks = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
      var workdays = '1,2,3,4,5'
      var restdays = '6,7'
      if (timeRule.assign_rule == workdays) {
        week += '工作日'
      } else if (timeRule.assign_rule == restdays) {
        week += '双休日'
      } else {
        var assgin = timeRule.assign_rule.split(',')
        for (var i = 0; i < assgin.length; i++) {
          if (assgin[i]) {
            week += weeks[assgin[i]] + '、'
          }
        }
        week = week.substring(0, week.length - 1)
      }
      time += week
    }
    //有效期
    $('#timeRule').html(time)
    if (res.isFirstOrder == 0) {
      $('#isFirstOrder').html('所有订单')
    } else if (res.isFirstOrder == 1) {
      $('#isFirstOrder').html('仅限首单')
    }
    var order_type_arr = res.orderType.split(',')
    var order_type = ''
    var order_type_count = ''
    $.each(order_type_arr, function (k, v) {
      if (v == 100) {
        //todo 100,300合并
        // order_type += '自提订单，'
        order_type += '门店自提（包括门店直购），'
        order_type_count = order_type_count + v
      }
      if (v == 200) {
        order_type += '送货上门，'
        order_type_count = order_type_count + v
      }
      if (v == 300) {
        // order_type += '门店直购，'
        order_type_count = order_type_count + v
      }

    })

    order_type = order_type.substring(0, order_type.length - 1)
    $('#orderType').html(order_type)
    if (res.useStore == -1) {
      $('#useStore').html('全部门店')
    } else if (res.useStore == 2) {
      var useArea = JSON.parse(res.useArea)
      $('#useStore').html('指定区域门店(您已选择 <span style="color:red">' + useArea.length + '</span> 家门店，' +
        '<span data-toggle=\'modal\' data-target=\'#store_list_box\' id="show_store" data-value = "' + encodeURIComponent(JSON.stringify(useArea)) + '" style="color: #6BC5A4">点击查看</span>)')
    }
    if (res.limitState) {
      $('#limit_state').html(res.limitState)
      $('#limit_state').parent().parent().show()
    }
    if (res.limitRemark) {
      $('#limit_remark').html(res.limitRemark)
    }
    core.formatDate()
    $('#create_time').html(new Date(res.createTime).format())
    //获取商品
    var goodsList = ''
    var goodsIdsType = rule__.goodsIdsType
    var goodsIds = rule__.goodsIds
    if (typeof(goodsIds) === 'undefined') {
      goodsIds = rule__.goods_ids
    }
    var promotionsType = res.promotionsType
    var ruleType = ''
    if (goodsIdsType == 0 || goodsIds == 'all') {
      $('#goods_rule').html('全部商品参加<br/>' + Rule_Type)
    } else {
      var url = core.getHost() + '/goods/getGoodsInfoByIds'
      $.post(url, 'goodsIds=' + goodsIds, function (goods) {
        if (goods.code == '000') {
          goodsList = goods.data
          if (rule__.goodsIdsType == 1 || promotionsType == 10) {
            if (parseInt(promotionsType) === 20 && parseInt(rule__.ruleType) === 5) {
              $('#goods_rule').html('指定商品参加(您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" style="color: #6BC5A4">点击查看</span>)<span id="gift_goods"></span><br/>' + Rule_Type)
              showEGDInfo(goods.data, rule__.rules)
            } else if (parseInt(promotionsType) === 50 && parseInt(rule__.ruleType) === 2) {
              $('#goods_rule').html('指定商品参加(您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" style="color: #6BC5A4">点击查看</span>)<span id="gift_goods"></span><br/>' + Rule_Type)
              showEGFPInfo(goods.data, rule__.rules)
            } else {
              $('#goods_rule').html('指定商品参加(您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" data-value= "' + encodeURIComponent(JSON.stringify(goodsList)) + '" style="color: #6BC5A4">点击查看</span>)<span id="gift_goods"></span><br/>' + Rule_Type)
            }
          } else if (rule__.goodsIdsType == 2) {
            $('#goods_rule').html('指定商品不参加(您已选择<span style="color: red">' + goodsList.length + '</span>个商品，<span data-toggle=\'modal\' data-target=\'#goods_list_box\' id="show_goods" data-value= "' + encodeURIComponent(JSON.stringify(goodsList)) + '" style="color: #6BC5A4">点击查看</span>)<span id="gift_goods"></span><br/>' + Rule_Type)
          }
          if (promotionsType == 10) {
            //查询赠品
            if (res.promotionsRule == null || rule__ == null) {
              layer.msg('查询失败')
            }
            var gift_arr = rule__.sendGifts
            var gift_goods = ''
            for (var i = 0; i < gift_arr.length; i++) {
              gift_goods += gift_arr[i].giftId + ','
            }
            var gift_goods = gift_goods.substring(0, gift_goods.length - 1)
            console.log(gift_goods)
            query_Gift_goods(core, gift_goods, gift_arr, rule__)
          }
        }
      })
    }
  }

  rule.changeStatus = function (id, status) {
    console.log('rule.changeStatus')
    console.log(id + ', ' + status)

    var params = {}
    params.ruleId = id
    params.status = status

    var url = '/merchant/promotions/changeStatus'

    var msg = ''

    $.ajax({
      type: 'POST',
      data: params,
      async: false,
      url: url,
      success: function (data) {
        if (data.code === '000') {
          msg = 'success'
        } else {
          msg = 'fail'
        }
      },
      error: function () {
        msg = 'fail'
      }
    })

    return msg
  }

  rule.rightEntrance = function () {
    console.log('rule.rightEntrance')

    var stop_html = '<a href="javascript:void(0);" data-target="#stop_promotions_rule" data-toggle="modal" class="sui-btn btn-bordered btn-xlarge btn-warning">停止发放该活动规则</a>&nbsp;&nbsp;' // 停止
    var copy_html = '<a href="javascript:void(0);" id="copy_promotions_rule" class="sui-btn btn-bordered btn-xlarge btn-success">复制该活动规则</a>&nbsp;&nbsp;' // 复制
    var a_html = ''
    var status = $('input[name=promotions_status]').val()
    switch (parseInt(status)) {
      case 0:
        a_html = stop_html + copy_html
        break
      case 1:
        a_html = copy_html
        break
      case 2:
        a_html = copy_html
        break
      case 3:
        a_html = copy_html
        break
      case 10:
        a_html = stop_html + copy_html
        break
    }

    $('#rightSide').append(a_html)
  }

  rule.bottomButton = function () {
    console.log('rule.bottomButton')

    var release_html = '<a href="javascript:void(0);" id="release_promotions_rule" class="sui-btn btn-xlarge btn-primary" data-target="#ConfirmModal" data-toggle="modal">确认发放</a>&nbsp;&nbsp;' // 发放
    var edit_html = '<a href="javascript:void(0);" id="to_edit_promotions_rule" class="sui-btn btn-xlarge btn-warning">修改</a>&nbsp;&nbsp;'  // 编辑
    var return_html = '<a href="/merchant/couponManager" class="sui-btn btn-xlarge">返回列表</a>&nbsp;&nbsp;' // 返回

    var a_html = ''
    var status = $('input[name=promotions_status]').val()
    switch (parseInt(status)) {
      case 0:
        a_html = return_html
        break
      case 1:
        a_html = return_html
        break
      case 2:
        a_html = return_html
        break
      case 3:
        a_html = return_html
        break
      case 10:
        a_html = release_html + edit_html + return_html
        break
    }

    $('#bottomButton').append(a_html)
  }

  rule.getPageData = function (param) {
    var promotions = {}

    // 优惠标签
    promotions.label = $('input[name=label]').val()

    // 优惠名称
    var promotionsName = $('input[name=ruleName]').val()
    promotions.promotionsName = promotionsName ? promotionsName : promotions.label

    // 优惠类型和优惠规则
    var promotionsRule = getPromotionsRule(promotions, param)
    if (typeof(promotionsRule) === 'string') {
      return promotionsRule
    }
    promotions.promotionsRule = JSON.stringify(promotionsRule)

    // 数量
    promotions.total = -1
    promotions.amount = -1

    // 有效期
    var timeRule = getTimeRule()
    if (typeof(timeRule) === 'string') {
      return timeRule
    }
    promotions.timeRule = JSON.stringify(timeRule)

    // 是否首单
    promotions.isFirstOrder = $('input[name=is_first_order]:checked').val()

    var apply_store = $('input[name=apply_store]:checked').val()
    // 适用门店
    if (apply_store == -1) {
      promotions.useStore = -1
    } else if (apply_store == 2) {
      var use_stores = $('.now_area_name_store').html()
      if (use_stores != '') {
        promotions.useStore = 2
        promotions.useArea = clearSeparator(use_stores, ',')
      } else {
        return '请选择区域门店'
      }
    }

    // 订单类型
    var orderType = getOrderType()
    if (orderType.startsWith('error:')) {
      return orderType.replace('error:', '')
    }
    promotions.orderType = orderType

    // 说明
    promotions.limitState = $('textarea[name=limitState]').val()

    // 备注
    promotions.limitRemark = $('textarea[name=limitRemark]').val()

    console.log(promotions)

    return promotions

  }

  rule.copyToNew = function (promotionsRule, $parent) {
    // 优惠名称
    $parent.find('input[name=ruleName]').val(promotionsRule.promotionsName)

    // 优惠标签
    $parent.find('input[name=label]').val(promotionsRule.label)

    // 优惠类型
    var result = copyPromotionsRuleToNew($parent, promotionsRule)
    if (result) return result

    // 数量

    // 有效期
    result = copyTimeRuleToNew($parent, promotionsRule)
    if (result) return result

    // 是否首单
    $parent.find('input[name=is_first_order][value=\'' + promotionsRule.isFirstOrder + '\']').trigger('click')

    // 订单类型
    result = copyOrderTypeToNew($parent, promotionsRule)
    if (result) return result

    // 使用门店
    result = copyUseStores2New($parent, promotionsRule)

    // 优惠说明不再显示，因为确定不再让新的优惠活动存在优惠说明这个字段

    // 商家备注
    $parent.find('textarea[name=limitRemark]').val(promotionsRule.limitRemark)

  }

  return rule
})

function getGoodsModifyButton (res, rule__) {
  var goodModifyButton = ''
  var editGoodsFlag = true
  if (res.status === 1 || res.status === 2) // 过期/手动停发 不提供修改商品功能
    editGoodsFlag = false
  if (res.promotionsType === 10 && (rule__.sendType || rule__.sendType === 2)) // 满赠活动送同种商品 详情页不提供修改商品功能
    editGoodsFlag = false
  if (res.promotionsType === 20 && (rule__.ruleType || rule__.ruleType === 5)) // 打折活动指定商品分别打折 详情页不提供修改商品功能
    editGoodsFlag = false
  if (res.promotionsType === 50 && (!rule__.ruleType || rule__.ruleType !== 2)) // 限价活动指定商品分别限价 详情页不提供修改商品功能
    editGoodsFlag = false
  if (editGoodsFlag)
    goodModifyButton = '&nbsp;&nbsp;<button data-toggle=\'modal\' data-target=\'#goodsModifyModal\' class=\'sui-btn btn-bordered btn-small btn-warning\'>修改商品</button>'

  return goodModifyButton
}

function getPromotionsRule (promotions) {
  // 获取活动规则类型
  var activeTabHref = $('#promotionsForm li').filter('.active').find('a').attr('href')
  var promotionsRule = ''
  switch (activeTabHref) {
    case '#gift-promotions':
      promotions.promotionsType = 10
      promotionsRule = getGiftPromotionsRule()
      break
    case '#discount-promotions':
      promotions.promotionsType = 20
      promotionsRule = getDiscountPromotionsRule()
      break
    case '#free-postage-promotions':
      promotions.promotionsType = 30
      promotionsRule = getFreePostagePromotionsRule()
      break
    case '#reduce-money-promotions':
      promotions.promotionsType = 40
      promotionsRule = getReduceMoneyRule()
      break
    case '#fixed-price-promotions':
      promotions.promotionsType = 50
      promotionsRule = getFixedPriceRule()
      break
    default:
      promotionsRule = '不可能出现的错误'
  }
  return promotionsRule
}

function getGiftPromotionsRule () {
  var giftRule = {}

  var calculateBase = $('input[name=calculateBase]:checked').val()
  if (!calculateBase) {
    return '满赠活动必须选择组合方式'
  }
  giftRule.calculateBase = calculateBase

  var goodsIds = $('input[name=__goodsIds]').val()
  if (!goodsIds) {
    return '满赠活动必须选择商品'
  }
  giftRule.goodsIds = goodsIds

  var ruleType = $('input[name=ruleType]:checked').val()
  if (!ruleType) {
    return '满赠活动必须设置赠送条件'
  }
  giftRule.ruleType = ruleType

  var ruleConditions = getRuleConditions(ruleType)
  if (typeof(ruleConditions) === 'string') {
    return ruleConditions
  }
  giftRule.ruleConditions = ruleConditions

  var sendType = parseInt($('input[name=sendType]:checked').val())
  if (!sendType) {
    return '满赠活动必须设置赠品赠送方式'
  }
  giftRule.sendType = sendType

  var sendGifts = getGift(sendType)
  if (typeof(sendGifts) === 'string') return sendGifts

  giftRule.sendGifts = sendGifts
  return giftRule
}

function getGift (sendType) {
  if (sendType === 2) {
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

    var sendGifts = JSON.parse(temp_data).map(function (item) {
      var tempObj = {}
      tempObj.giftId = item.id
      tempObj.sendNum = item.num
      tempObj.total = item.num
      return tempObj
    })
  } else {
    // 设置赠品Id和数量
    var giftIdAndNum = $('input[name=__giftIdsAndNum]').val()
    if (!giftIdAndNum) {
      return '满赠活动必须设置赠品和数量'
    }
    giftIdAndNum = JSON.parse(giftIdAndNum)
    if (!giftIdAndNum) {
      return '满赠活动必须设置赠品和数量'
    }
    var sendGifts = giftIdAndNum
  }

  return sendGifts
}

function getRuleConditions (ruleType) {
  var $div = $('input[name=ruleType]:checked').next()
  var $span = $div.find('span')

  var ladderDate = getLadderDate($span, true, true)
  if (typeof(ladderDate) === 'string') {
    switch (ladderDate) {
      case 'leftEmpty':
        return '满件或满元不能为空'
      case 'leftNotIncre':
        return '满件或满元必须递增'
      case 'rightEmpty':
        return '赠送的件数不能为空'
      case 'rightNotIncre':
        return '赠送的件数必须递增'
    }
  }

  var result = []
  if (ruleType === '1') {
    for (var i = 0; i < ladderDate.length; i++) {
      var obj = {}
      obj.meetNum = ladderDate[i].leftValue
      obj.sendNum = ladderDate[i].rightValue
      obj.ladder = i + 1
      result.push(obj)
    }
  } else if (ruleType === '2') {
    for (var i = 0; i < ladderDate.length; i++) {
      var obj = {}
      obj.meetMoney = ladderDate[i].leftValue * 1000 / 10
      obj.sendNum = ladderDate[i].rightValue
      obj.ladder = i + 1
      result.push(obj)
    }
  } else {
    return '不可能出现的错误'
  }

  return result
}

/**
 *
 * @param $spans
 * @param leftIncre true 代表 左边递增, false 则是递减
 * @param rightIncre true 代表 右边递增， false 则是递减
 */
function getLadderDate ($spans, leftIncre, rightIncre) {
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

    var obj = {}
    obj.leftValue = old1 = new1
    obj.rightValue = old2 = new2
    result.push(obj)
  }

  return result
}

function getEachGoodsDiscount () {
  var $parent = $('#each-goods-discount-box')

  // 信息校验
  var box_result = $parent.find('input[name=__goodsIdAndNum]').val()
  if (!box_result) return '请设置商品折扣'
  if (box_result.startsWith('error')) return box_result.split(',')[1]
  var EGDBoxGoodsIds = JSON.parse(box_result).map(function (item) {
    return parseInt(item.id)
  }).sort(compare)

  var goodsBoxGoodsIds = $('#much_select_goods input[name=__goodsIds]').val()
  if (!goodsBoxGoodsIds) return '请设置商品折扣'
  goodsBoxGoodsIds = goodsBoxGoodsIds.split(',').map(function (item) {
    return parseInt(item)
  }).sort(compare)

  var errorMsg = '指定商品弹窗和设置商品折扣弹窗数据不同步，请点击设置折扣弹窗'
  if (EGDBoxGoodsIds.length === goodsBoxGoodsIds.length) {
    for (var i = 0; i < EGDBoxGoodsIds.length; i++) {
      if (EGDBoxGoodsIds[i] !== goodsBoxGoodsIds[i]) return errorMsg
    }
  } else {
    return errorMsg
  }

  var rules = JSON.parse(box_result).map(function (item) {
    var tempObj = {}
    tempObj.goodsId = parseInt(item.id)
    tempObj.discount = item.discount * 10
    tempObj.max_reduce = item.maxReduce * 1000 / 10
    return tempObj
  })
  return rules
}

function getDiscountPerNum () {
  var rules = [], obj = {}
  var $parent = $('#discount_goods_num_per')

  var discount = $parent.find('input[name=discount]').val()
  if (!discount) return '折扣不能为空'
  obj.discount = discount * 10
  obj.rate = 2

  if ($parent.find('input[name=max_reduce_sign]').is(':checked')) {
    var goods_amount_limit = $parent.find('input[name=max_reduce]').val()
    if (!goods_amount_limit) return '优惠商品封顶不能为空'

    obj.goods_amount_limit = goods_amount_limit
  } else {
    obj.goods_amount_limit = 0
  }

  rules.push(obj)
  return rules
}

function getDiscountByNum () {
  var $span = $('#discount_goods_num_incr').find('span')
  var ladderDate = getLadderDate($span, true, false)

  if (typeof(ladderDate) === 'string') {
    switch (ladderDate) {
      case 'leftEmpty':
        return '满件不能为空'
      case 'leftNotIncre':
        return '满件必须递增'
      case 'rightEmpty':
        return '折扣不能为空'
      case 'rightNotIncre':
        return '折扣必须递减'
    }
  }

  var rules = []
  for (var i = 0; i < ladderDate.length; i++) {
    var obj = {}
    obj.meet_num = ladderDate[i].leftValue
    obj.discount = ladderDate[i].rightValue * 10
    obj.ladder = i + 1
    rules.push(obj)
  }

  return rules
}

function getDiscountByMoney () {
  var $span = $('#discount_money').find('span')
  var ladderDate = getLadderDate($span, true, false)

  if (typeof(ladderDate) === 'string') {
    switch (ladderDate) {
      case 'leftEmpty':
        return '满元不能为空'
      case 'leftNotIncre':
        return '满元必须递增'
      case 'rightEmpty':
        return '折扣不能为空'
      case 'rightNotIncre':
        return '折扣必须递减'
    }
  }

  var rules = []
  for (var i = 0; i < ladderDate.length; i++) {
    var obj = {}
    obj.meet_money = ladderDate[i].leftValue * 1000 / 10
    obj.discount = ladderDate[i].rightValue * 10
    obj.ladder = i + 1
    rules.push(obj)
  }

  return rules
}

function getFreePostagePromotionsRule () {
  var freePostageRule = {}
  var $parent = $('#free-postage-promotions')
  var goodsIdsType = $parent.find('select[name=type]').val()

  freePostageRule.goodsIdsType = goodsIdsType
  switch (parseInt(goodsIdsType)) {
    case 0:
      freePostageRule.goodsIds = 'all'
      break
    case 1:
    case 2:
      var goodsIds = $('input[name=__goodsIds]').val()
      if (!goodsIds) return '请选择包邮活动的商品'
      freePostageRule.goodsIds = goodsIds
      break
    default:
      return '不可能出现的错误'
  }

  var meetMoney = $parent.find('input[name=meetMoney]').val()
  if (!meetMoney) return '请填写订单满多少金额包邮'
  freePostageRule.meetMoney = meetMoney * 1000 / 10

  var reducePostageLimit = $parent.find('input[name=reducePostageLimit]').val()
  if (!reducePostageLimit) return '请填写免除邮费的上限'
  freePostageRule.reducePostageLimit = reducePostageLimit * 1000 / 10

  var areaIdsType = $parent.find('input[name=areaIdsType]:checked').val()
  if (!areaIdsType) return '请选择指定区域包邮或指定区域不包邮'
  freePostageRule.areaIdsType = areaIdsType

  var areaIds = $('input[name=__cityIds]').val()
  if (!areaIds) return '请选择地区'
  areaIds = clearSeparator(areaIds)
  freePostageRule.areaIds = areaIds

  return freePostageRule
}

function getDirectDiscount () {
  var rules = [], obj = {}
  var direct_discount = $('input[name=direct_discount]').val()
  if (!direct_discount) {
    return '打折活动请填写直接打折折扣率'
  }
  obj.direct_discount = direct_discount * 10

  if ($('input[name=discount_direct_is_limit]').is(':checked')) {
    var goods_money_limit = $('input[name=goods_money_limit]').val()
    if (!goods_money_limit) return '请填写商品总价封顶几元'

    obj.goods_money_limit = goods_money_limit * 1000 / 10
  } else {
    obj.goods_money_limit = 0
  }

  rules.push(obj)

  return rules
}

function getDiscountPromotionsRule () {
  var discountRule = {}
  discountRule.isPost = 1
  var $parent = $('#discount-promotions')

  // 选择商品
  var temp = getGoods(discountRule, $parent)
  if (typeof(temp) === 'string') return temp

  // 是否抹零
  var roundType = $('input[name=ml-radio]:checked').val()
  if (!roundType) {
    return '请设置抹零级别'
  }
  switch (parseInt(roundType)) {
    case 1:
      discountRule.isMl = 1
      discountRule.isRound = 1
      break
    case 2:
      discountRule.isMl = 2
      discountRule.isRound = 1
      break
    case 3:
      discountRule.isMl = 1
      discountRule.isRound = 0
      break
    case 4:
      discountRule.isMl = 2
      discountRule.isRound = 0
      break
    default:
      return '不可能出现的错误'
  }

  var ruleType = $parent.find('input[name=rule_type]:checked').val()
  if (!ruleType) return '请选择打折活动规则'
  discountRule.ruleType = ruleType
  var rules = []
  switch (parseInt(ruleType)) {
    case 1:
      rules = getDirectDiscount()
      break
    case 2:
      rules = getDiscountByMoney()
      break
    case 3:
      rules = getDiscountByNum()
      break
    case 4:
      rules = getDiscountPerNum()
      break
    case 5:
      rules = getEachGoodsDiscount()
      break
    default:
      return '不可能出现的错误'
  }

  if (typeof(rules) === 'string') {
    return rules
  }
  discountRule.rules = rules

  return discountRule
}

function getReduceMoneyRule () {
  var reduceMoneyRule = {}
  var $parent = $('#reduce-money-promotions')

  var temp = getGoods(reduceMoneyRule, $parent)
  if (typeof(temp) === 'string') return temp

  var ruleType = $parent.find('input[name=rule_type]:checked').val()
  if (!ruleType) return '请选择满减活动类型'
  reduceMoneyRule.ruleType = ruleType
  var rules = [], msg = undefined
  switch (parseInt(ruleType)) {
    case 1:
      msg = getDirectReduce(rules, $parent)
      break
    case 2:
      msg = getReducePerMoney(rules, $parent)
      break
    case 3:
      msg = getReduceByMoney(rules, $parent)
      break
    default:
      return '不可能出现的错误'
  }

  if (typeof(msg) === 'string') {
    return msg
  }
  reduceMoneyRule.rules = rules

  return reduceMoneyRule
}

function getDirectReduce (rules, $parent) {
  $parent = $parent.find('input[name=rule_type][value=1]').parent()

  var obj = {}
  obj.meetMoney = 0
  obj.cap = 0
  obj.ladder = 1

  var reduceMoney = $parent.find('input[name=reduce_money]').val()
  if (!reduceMoney) return '请输入立减金额'
  obj.reduceMoney = reduceMoney * 1000 / 10

  rules.push(obj)
}

function getReducePerMoney (rules, $parent) {
  $parent = $parent.find('input[name=rule_type][value=2]').parent()

  var obj = {}
  obj.ladder = 1

  var meetMoney = $parent.find('input[name=meet_money]').val()
  if (!meetMoney) return '请输入每满金额'
  obj.meetMoney = meetMoney * 1000 / 10

  var reduceMoney = $parent.find('input[name=reduce_money]').val()
  if (!reduceMoney) return '请输入满减金额'
  if (parseFloat(reduceMoney) > parseFloat(meetMoney)) return '满件金额不能大于每满金额'
  obj.reduceMoney = reduceMoney * 1000 / 10

  if ($parent.find('input[name=cap_sign]').is(':checked')) {
    var cap = $parent.find('input[name=cap]').val()
    if (!cap) return '请输入封顶金额'
    if (parseFloat(cap) < parseFloat(reduceMoney)) return '封顶金额不能小于满减金额'
    obj.cap = cap * 1000 / 10
  } else {
    obj.cap = 0
  }

  rules.push(obj)
}

function getReduceByMoney (rules, $parent) {
  $parent = $parent.find('input[name=rule_type][value=3]').parent().next()
  var $span = $parent.find('span')
  var ladderDate = getLadderDate($span, true, true)

  if (typeof(ladderDate) === 'string') {
    switch (ladderDate) {
      case 'leftEmpty':
        return '满元不能为空'
      case 'leftNotIncre':
        return '满元必须递增'
      case 'rightEmpty':
        return '优惠金额不能为空'
      case 'rightNotIncre':
        return '优惠金额必须递增'
    }
  }

  for (var i = 0; i < ladderDate.length; i++) {
    var obj = {}
    obj.meetMoney = ladderDate[i].leftValue * 1000 / 10
    obj.reduceMoney = ladderDate[i].rightValue * 1000 / 10
    if (parseInt(obj.reduceMoney) > parseInt(obj.meetMoney)) return '满减金额不能大于每满金额'
    obj.cap = 0
    obj.ladder = i + 1

    rules.push(obj)
  }
}

function getFixedPriceRule () {
  var fixedPriceRule = {}
  var $parent = $('#fixed-price-promotions')

  var temp = getGoods(fixedPriceRule, $parent)
  if (typeof(temp) === 'string') return temp

  var ruleType = $parent.find('input[name=rule_type]:checked').val()
  if (!ruleType) return '请选择限价类型'
  fixedPriceRule.ruleType = parseInt(ruleType)

  if (parseInt(ruleType) === 1) {
    var fixedPrice = $parent.find('input[name=fixed-price]').val()
    if (!fixedPrice) return '商品限价金额必须填写'
    fixedPriceRule.fixedPrice = fixedPrice * 1000 / 10
  } else { // ruleType == 2
    var rules = getEachGoodsFixPrice()
    if (typeof(rules) === 'string') return rules
    fixedPriceRule.rules = rules
  }

  var buyNumEachOrder = $parent.find('input[name=buy-num-each-order]').val()
  if (!buyNumEachOrder) return '每次订单最多可购买多少件必须填写'
  fixedPriceRule.buyNumEachOrder = buyNumEachOrder

  var storage = $parent.find('input[name=storage]').val()
  if (!storage) return '限价商品总量必须填写'
  fixedPriceRule.storage = storage
  fixedPriceRule.total = storage

  return fixedPriceRule
}

function getEachGoodsFixPrice () {
  var $parent = $('#each-goods-fixed-price-box')

  // 信息校验
  var box_result = $parent.find('input[name=__goodsIdAndFixedPrice]').val()
  if (!box_result) return '请设置商品折扣'
  if (box_result.startsWith('error')) return box_result.split(',')[1]

  var EGFPGoodsIds = JSON.parse(box_result).map(function (item) {
    return parseInt(item.id)
  }).sort(compare)

  var goodsBoxGoodsIds = $('#much_select_goods input[name=__goodsIds]').val()
  if (!goodsBoxGoodsIds) return '请设置商品折扣'
  goodsBoxGoodsIds = goodsBoxGoodsIds.split(',').map(function (item) {
    return parseInt(item)
  }).sort(compare)

  var errorMsg = '指定商品弹窗和设置商品限价弹窗数据不同步，请点击设置限价'
  if (EGFPGoodsIds.length === goodsBoxGoodsIds.length) {
    for (var i = 0; i < EGFPGoodsIds.length; i++) {
      if (EGFPGoodsIds[i] !== goodsBoxGoodsIds[i]) return errorMsg
    }
  } else {
    return errorMsg
  }

  var rules = JSON.parse(box_result).map(function (item) {
    var tempObj = {}
    tempObj.goodsId = parseInt(item.id)
    tempObj.fixedPrice = item.fixedPrice * 1000 / 10
    return tempObj
  })
  return rules
}

/**
 * 适用于带选择商品框select的商品，并确保字段与后台相符合
 */
function getGoods (rule, $parent) {
  rule.goodsIdsType = $parent.find('select[name=type]').val()
  switch (parseInt(rule.goodsIdsType)) {
    case 0:
      rule.goodsIds = 'all'
      break
    case 1:
    case 2:
      rule.goodsIds = $('input[name=__goodsIds]').val()
      if (!rule.goodsIds)
        return '请选择商品'
      break
    default:
      return '不可能出现的错误'
  }
}

function getTimeRule () {
  var timeRule = {}
  var $parent = $('#validityTime')

  var validity_type = $parent.find('input[name=validity_type]:checked').val()
  if (!validity_type) return '请选择有效期类型'
  timeRule.validity_type = validity_type

  switch (parseInt(validity_type)) {
    case 1:
      var startTime = $('input[name=startTime]').val()
      var endTime = $('input[name=endTime]').val()

      if (startTime && endTime) {
        timeRule.startTime = startTime + ':00'
        timeRule.endTime = endTime + ':59'

        var startTime = parseDate(timeRule.startTime)
        var endTime = parseDate(timeRule.endTime)
        if (endTime < startTime) return '结束时间不能小于开始时间'
        if (endTime < new Date()) return '结束时间不能小于现在'
      } else {
        return '请选择固定时间'
      }
      break
    case 2:
      var $days = $('#dayOfMonth').find('input[name=work-date-month]:checked')
      var assign_rule = getValue($days)
      if (!assign_rule) return '请选择每月的固定日期'
      timeRule.assign_rule = assign_rule

      if ($('input[name=work-date-month-insurance]').is(':checked')) {
        var insuranceDay = $('input[name=insurance-day]').val()
        if (!insuranceDay) return '请填写每月最后几天计算'
        timeRule.lastDayWork = insuranceDay
      } else {
        timeRule.lastDayWork = 0
      }
      break
    case 3:
      var $days = $('#dayOfWeek').find('input[name=work-date-week]:checked')
      var assign_rule = getValue($days)
      if (!assign_rule) return '请选择指定星期'
      timeRule.assign_rule = assign_rule
      break
    default :
      return '不可能出现的错误'
  }

  return timeRule
}

function getOrderType () {
  var $orderTypes = $('input[name=order_type]:checked')
  var orderTypes = getValue($orderTypes)
  if (!orderTypes) return 'error:请选择订单类型'
  return orderTypes
}

/**
 * 清除字符串中多余的分隔符
 *
 * @param value
 * @param separator
 */
function clearSeparator (value, separator) {
  if (!separator) separator = ','
  if (value) {
    var split = value.split(separator)
    var result = []
    for (var i = 0; i < split.length; i++) {
      if (split[i]) result.push(split[i])
    }

    return result.join(separator)
  }
}

/**
 * 根据id查询规则详情
 * @param promotionsId
 */
function getRuleById (promotionsId) {
  var obj = {}
  obj.promotionsId = promotionsId
  var url = 'promotions/rule/queryById'

  var result = ''

  doGetOrPost(url, obj, 'get', false, function (data) {
    console.log('rule.js getRuleById')
    console.log(data)
    if (data.code === '000') {
      result = data.value
    } else {
      result = 'fail'
    }
  })

  return result
}

function copyUseStores2New ($parent, promotionsRule) {
  if (promotionsRule.useStore == 2) {
    $parent.find('input[name=order_type][value=200]').prop('disabled', 'true')
    $parent.find('input[name=\'apply_store\'][value=\'2\']').attr('checked', true)
    $('.now_area_name_store').html(promotionsRule.useArea)
    var url = 'ybArea/getProvinceIdByCityIds'
    var params = {}
    params.cityIds = promotionsRule.useArea
    doGetOrPost(url, params, 'get', false, function (data) {
      if (data.code === '000') {
        var result_map = data.value
        for (var i = 0; i < result_map.check.length; i++) {
          $('#pointid_store_' + result_map.check[i]).parent().prop('class', 'checkbox-pretty inline checked')
        }
        for (var i = 0; i < result_map.halfcheck.length; i++) {
          $('#pointid_store_' + result_map.halfcheck[i]).parent().prop('class', 'checkbox-pretty inline halfchecked')
        }
      }
    })
  }
}

function copyPromotionsRuleToNew ($parent, promotionsRule) {
  var type = promotionsRule.promotionsType
  var rule = JSON.parse(promotionsRule.promotionsRule)
  console.log('rule.js copyPromotionsRuleToNew')
  console.log(rule)

  var result = ''
  switch (parseInt(type)) {
    case 10:
      $parent.find('a[href=#gift-promotions]').trigger('click')
      result = copyGiftRuleToNew($parent, rule)
      break
    case 20:
      $parent.find('a[href=#discount-promotions]').trigger('click')
      result = copyDiscountRuleToNew($parent, rule)
      break
    case 30:
      $parent.find('a[href=#free-postage-promotions]').trigger('click')
      result = copyFreePostageToNew($parent, rule)
      break
    case 40:
      $parent.find('a[href=#reduce-money-promotions]').trigger('click')
      result = copyReduceMoneyToNew($parent, rule)
      break
    case 50:
      $parent.find('a[href=#fixed-price-promotions]').trigger('click')
      result = copyFixedPriceToNew($parent, rule)
      break
    default :
  }

  if (result) return result
}

function copySelectedGoodsToShow (goodsIds) {
  require(['goods_box'], function (goods_box) {
    goods_box.showSelectList(goodsIds)
  })
}

function copyGiftRuleToNew ($parent, rule) {
  console.log('rule.js copyGiftRuleToNew')
  console.log(rule)

  // 1、选择购买商品及组合方式
  $parent.find('input[name=calculateBase][value=' + rule.calculateBase + ']').trigger('click')

  // 通过商品id获取相应的字段
  copySelectedGoodsToShow(rule.goodsIds)

  // 2、设置赠送条件
  var $temp = $parent.find('input[name=ruleType][value=' + rule.ruleType + ']')
  $temp.trigger('click')

  var ruleConditions = rule.ruleConditions
  for (var i = 0; i < ruleConditions.length; i++) {
    var $span = $temp.next().find('span').eq(i)
    if (parseInt(rule.ruleType) === 1) {
      $span.find('input[name=meetNum]').val(ruleConditions[i].meetNum)
      $span.find('input[name=sendNum]').val(ruleConditions[i].sendNum)
    } else {
      $span.find('input[name=meetMoney]').val(ruleConditions[i].meetMoney / 100)
      $span.find('input[name=sendNum]').val(ruleConditions[i].sendNum)
    }

    if (i !== ruleConditions.length - 1) {
      $span.find('input[name=_add]').trigger('click')
    }
  }

  // 3，选择赠送的商品
  $parent.find('input[name=sendType][value=' + rule.sendType + ']').trigger('click')

  if (rule.sendType !== 2) {
    require(['gift_box'], function (gift_box) {
      gift_box.showSelectList(rule.sendGifts)
    })
  } else {
    require(['gift_box2'], function (gift_box2) {
      gift_box2.showToGiftBoxForCopyOrEdit(rule.sendGifts)
    })
  }
}

function copyDiscountRuleToNew ($parent, rule) {
  $parent = $parent.find('#discount-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  // 是否抹零
  if (rule.isMl === 1) {
    if (rule.isRound === 0)
      $parent.find('input[name=ml-radio][value=' + 3 + ']').prop('checked', true)
    else
      $parent.find('input[name=ml-radio][value=' + 1 + ']').prop('checked', true)
  } else {
    if (rule.isRound === 0)
      $parent.find('input[name=ml-radio][value=' + 4 + ']').prop('checked', true)
    else
      $parent.find('input[name=ml-radio][value=' + 2 + ']').prop('checked', true)
  }

  // 折扣具体内容
  $parent.find('input[name=rule_type][value=' + rule.ruleType + ']').trigger('click')
  var rules = rule.rules
  switch (parseInt(rule.ruleType)) {
    case 1:
      $parent.find('input[name=direct_discount]').val(rules[0].direct_discount / 10)
      if (rules[0].goods_money_limit) {
        $parent.find('input[name=discount_direct_is_limit]').prop('checked', true)
        $parent.find('input[name=goods_money_limit]').val(rules[0].goods_money_limit / 100)
      }
      break

    case 2:
      $parent = $parent.find('#discount_money')
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=meet_money]').val(rules[i].meet_money / 100)
        $span.find('input[name=discount]').val(rules[i].discount / 10)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }

      break

    case 3:
      $parent = $parent.find('#discount_goods_num_incr')
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=meet_num]').val(rules[i].meet_num)
        $span.find('input[name=discount]').val(rules[i].discount / 10)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }
      break

    case 4:
      $parent = $parent.find('#discount_goods_num_per')
      $parent.find('input[name=discount]').val(rules[0].discount / 10)
      if (rules[0].goods_amount_limit) {
        $parent.find('input[name=max_reduce_sign]').prop('checked', true)
        $parent.find('input[name=max_reduce]').val(rules[0].goods_amount_limit)
      }
      break

    case 5:
      require(['EGD_box'], function (EGD_box) {
        var goodsIds = []
        var temp_map = {}
        rules.forEach(function (item) {
          var tempObj = {}
          tempObj.discount = item.discount / 10
          tempObj.maxReduce = item.max_reduce / 100
          temp_map[item.goodsId.toString()] = tempObj
          goodsIds.push(item.goodsId)
        })
        EGD_box.showToEGDBoxFromGoodsIdsAndMore(goodsIds.join(','), temp_map)
      })
  }
}

function copyFreePostageToNew ($parent, rule) {
  console.log('rule.js copyFreePostageToNew')
  console.log(rule)

  $parent = $parent.find('#free-postage-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  // 满元包邮金额
  $parent.find('input[name=meetMoney]').val(rule.meetMoney / 100)

  // 免邮费上限
  $parent.find('input[name=reducePostageLimit]').val(rule.reducePostageLimit / 100)

  // 地区弹框
  $parent.find('input[name=areaIdsType][value=' + rule.areaIdsType + ']').trigger('click')

  require(['area_box'], function (area_box) {
    area_box.showSelectList(rule.areaIds)
  })
}

function copyReduceMoneyToNew ($parent, rule) {
  console.log('rule.js copyReduceMoneyToNew')
  console.log(rule)
  $parent = $parent.find('#reduce-money-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')

  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  $parent.find('input[name=rule_type][value=' + rule.ruleType + ']').trigger('click')
  var rules = rule.rules
  console.log('rules')
  console.log(rules)

  switch (parseInt(rule.ruleType)) {
    case 1:
      $parent = $parent.find('input[name=rule_type][value=1]').parent()
      $parent.find('input[name=reduce_money]').val(rules[0].reduceMoney / 100)
      break
    case 2:
      $parent = $parent.find('input[name=rule_type][value=2]').parent()
      $parent.find('input[name=meet_money]').val(rules[0].meetMoney / 100)
      $parent.find('input[name=reduce_money]').val(rules[0].reduceMoney / 100)
      var cap = rules[0].cap
      if (cap) {
        $parent.find('input[name=cap_sign]').trigger('click')
        $parent.find('input[name=cap]').val(cap / 100)
      }
      break
    case 3:
      $parent = $parent.find('input[name=rule_type][value=3]').parent().next()
      for (var i = 0; i < rules.length; i++) {
        var $span = $parent.find('span').eq(i)
        $span.find('input[name=meet_money]').val(rules[i].meetMoney / 100)
        $span.find('input[name=reduce_money]').val(rules[i].reduceMoney / 100)

        if (i !== rules.length - 1) {
          $span.find('input[name=_add]').trigger('click')
        }
      }
      break
    default:
      return '数据有误'
  }
}

function copyFixedPriceToNew ($parent, rule) {
  console.log('rule.js copyFixedPriceToNew')
  console.log(rule)
  $parent = $parent.find('#fixed-price-promotions')

  // 选择商品
  $parent.find('select[name=type]').val(rule.goodsIdsType).trigger('change')
  // 通过商品id获取相应的字段
  if (rule.goodsIds !== 'all') copySelectedGoodsToShow(rule.goodsIds)

  $parent.find('input[name=rule_type][value=' + rule.ruleType + ']').trigger('click')

  if (rule.ruleType === 1) {
    $parent.find('input[name=fixed-price]').val(rule.fixedPrice / 100)
  } else { // ruleType == 2
    require(['EGFP_box'], function (EGFP_box) {
      EGFP_box.showToEGFPBoxFromGoodsIdsAndMore(rule.goodsIds)
      rule.rules.forEach(function (item) {
        $('#each-goods-fixed-price-box table.select_goods_list input[name=goods_id][value=  ' + item.goodsId + ']')
          .parent().find('input[name=fixedPrice]').val(item.fixedPrice / 100)
      })
    })
  }

  $parent.find('input[name=buy-num-each-order]').val(rule.buyNumEachOrder)
  $parent.find('input[name=storage]').val(rule.total)
}

function copyTimeRuleToNew ($parent, promotionsRule) {
  var timeRule = JSON.parse(promotionsRule.timeRule)

  $parent.find('input[name=validity_type][value=\'' + timeRule.validity_type + '\']').trigger('click')
  switch (timeRule.validity_type) {
    case '1': // 绝对时间
      $parent.find('input[name=startTime]').val(timeRule.startTime.slice(0, 16))
      $parent.find('input[name=endTime]').val(timeRule.endTime.slice(0, 16))
      break
    case '2': // 按月份间隔
      var dayOfMonth = timeRule.assign_rule.split(',')
      for (var i = 0; i < dayOfMonth.length; i++) {
        $parent.find('input[name=work-date-month][value=\'' + dayOfMonth[i] + '\']').trigger('click')
      }

      if (timeRule.lastDayWork) {
        $parent.find('input[name=work-date-month-insurance]').trigger('click')
        $parent.find('input[name=insurance-day]').val(timeRule.lastDayWork)
      }
      break
    case '3': // 按星期间隔
      var dayOfWeek = timeRule.assign_rule.split(',')
      for (var i = 0; i < dayOfWeek.length; i++) {
        $parent.find('input[name=work-date-week][value=\'' + dayOfWeek[i] + '\']').trigger('click')
      }
      break
  }
}

function copyOrderTypeToNew ($parent, promotionsRule) {
  var orderType = promotionsRule.orderType
  var split = orderType.split(',')

  $parent.find('input[name=order_type]').attr('checked', false)
  for (var i = 0; i < split.length; i++) {
    $parent.find('input[name=order_type][value=\'' + split[i] + '\']').trigger('click')
  }
  // todo 100,300合并
  if ($.inArray('100', split) > -1 || $.inArray('300', split) > -1) {
    $parent.find('input[name=order_type][value=\'100,300\']').trigger('click')
  }
}

function showEGDInfo (goodsData, goodsRuleData) {
  var map = {}
  goodsData.forEach(function (t) {
    var tempData = {}
    tempData.name = t.product_name
    tempData.price = t.product_price / 100
    map[t.product_id.toString()] = tempData
  })

  // 修改弹窗样式
  $('#goods_list_box #goods_table tr').eq(0).html(
    '<td width="40%">商品名称</td>' +
    '<td width="20%">商品价格</td>' +
    '<td width="20%">商品折扣</td>' +
    '<td width="20%">最大优惠</td>'
  )

  // 处理数据
  data = goodsRuleData.map(function (t) {
    var tempObj = {}
    tempObj.name = map[t.goodsId.toString()].name
    tempObj.price = map[t.goodsId.toString()].price
    tempObj.discount = t.discount / 10
    tempObj.maxReduce = t.max_reduce / 100
    return tempObj
  })
  var tmpl = document.getElementById('EGD_template').innerHTML
  var doTtmpl = doT.template(tmpl)
  $('#goods_list_box #goods_list').html(doTtmpl(data))
}

function showEGFPInfo (goodsData, goodsRuleData) {
  console.log('goodsData')
  console.log(goodsData)
  console.log('goodsRuleData')
  console.log(goodsRuleData)

  var map = {}
  goodsData.forEach(function (t) {
    var tempData = {}
    tempData.name = t.product_name
    tempData.price = t.product_price / 100
    map[t.product_id.toString()] = tempData
  })

  // 修改弹窗样式
  $('#goods_list_box #goods_table tr').eq(0).html(
    '<td width="40%">商品名称</td>' +
    '<td width="30%">商品价格</td>' +
    '<td width="30%">商品限价</td>'
  )

  // 处理数据
  data = goodsRuleData.map(function (t) {
    var tempObj = {}
    tempObj.name = map[t.goodsId.toString()].name
    tempObj.price = map[t.goodsId.toString()].price
    tempObj.fixedPrice = t.fixedPrice / 100
    return tempObj
  })
  var tmpl = document.getElementById('EGFP_template').innerHTML
  var doTtmpl = doT.template(tmpl)
  $('#goods_list_box #goods_list').html(doTtmpl(data))
}

function copyGoodsToDetail (promotionsRule) {
  if (promotionsRule.goodsIdsType)
    $('#goodsModifyModal select[name=__goodsIdsType]').val(promotionsRule.goodsIdsType).trigger('change')

  if (promotionsRule.goodsIds && promotionsRule.goodsIds !== 'all') {
    copySelectedGoodsToShow(promotionsRule.goodsIds)
  }
}

function query_Gift_goods (core, goodsIds, gift_arr, goodsRule) {
  console.log('query_Gift_goods')
  console.log(goodsRule)

  var url = core.getHost() + '/merchant/queryGoodsInfoByIds?goodsIds=' + goodsIds

  $.get(url, function (data) {
    if (data.code == '000') {
      var value = data.value
      for (var i = 0; i < gift_arr.length; i++) {
        var gift_id = gift_arr[i].giftId
        for (var n = 0; n < value.length; n++) {
          if (value[n].goods_id == gift_id) {
            value[n].sendNum = gift_arr[i].sendNum
          }
        }
      }
      var temp_str = '赠送商品'
      var sendType = parseInt(goodsRule.sendType)
      switch (sendType) {
        case 2:
          temp_str = '送同种商品（买啥送啥）'
          break
        case 3:
          temp_str = '送任何不同种商品（多种赠品中随便选几种）'
          break
      }
      $('#gift_goods').html('&nbsp;&nbsp;'
        + temp_str
        + '(您已选择<span style="color: red">' + data.value.length + '</span>个赠品，<span data-toggle=\'modal\' data-target=\'#gift_goods_list_box\' id="show_gift_goods" data-value= "' + encodeURIComponent(JSON.stringify(data.value)) + '" style="color: #6BC5A4">点击查看</span>)')
    }
  })
}

/* -- 该js中通用的部分，请让它在最底部 -- */

/**
 * 获取多个jquery对象的值，返回用逗号分隔的字符串
 * @param $1
 */
function getValue ($1) {
  var arr = []
  for (var i = 0; i < $1.size(); i++) {
    arr.push($1.eq(i).val())
  }
  return arr.join(',')
}

/**
 * 日期解析成date类型
 * @param str
 * @returns {Date}
 */
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
 * 从List<Map>的json串中取出map中的某个字段，用逗号拼接
 * @param arr
 * @param key
 */
function getValueFromListMap (arr, key) {
  var result = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key]) result.push(arr[i][key])
  }
  return result.join(',')
}

/**
 *
 * @param url
 * @param params
 * @param type 'post" or 'get"
 * @param async ajax同步还是异步
 * @param callback 回调函数
 */
function doGetOrPost (url, params, type, async, callback, failCallback) {
  var obj = {}
  obj.url = url
  obj.requestParams = params
  obj.isPost = type

  var result = '' // 收集处理结果
  $.ajax({
    url: '/merchant/promotions/doGetOrPost',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    async: async,
    success: function (data) {
      callback(data)
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log('错误信息')
      console.log(XMLHttpRequest)
      console.log(textStatus)
      console.log(errorThrown)
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
