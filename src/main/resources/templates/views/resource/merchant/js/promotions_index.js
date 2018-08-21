!(function () {

  // 初始化一些地址定义
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'utils': 'merchant/js/coupon/ll_utils',
      'uploadify': 'merchant/js/lib/uploadify/jquery.uploadify.min',
      'category_choose': 'public/product/categoryChoose',
      'goods_box': 'merchant/js/coupon/common/goods_box',
      'EGD_box': 'merchant/js/coupon/common/each_goods_discount_box',
      'EGFP_box': 'merchant/js/coupon/common/each_goods_fixed_price_box',
      'gift_box': 'merchant/js/coupon/common/gift_box',
      'gift_box2': 'merchant/js/coupon/common/gift_box_2',
      'area_box': 'merchant/js/coupon/common/area_box',
      'area_choose':'merchant/js/coupon/common/area_choose',
      'vue': 'public/vue',
      'rule': 'merchant/js/promotions/rule',
      'activity': 'merchant/js/promotions/activity'
    }
  })

  // 使用core.js 初始化一些东西
  require(['core'], function (core) {
    //doT
    core.doTinit()
    //重写console
    core.ReConsole()
  })

  // 定义
  var router = {
    'merchant': {
      'promotions': {
        'ruleNew': initRuleNew,
        'ruleDetail': initRuleDetail,
        'activityNew': initActivityNew,
        'activityDetail': initActivityDetail
      }
    }
  }

  require(['core'], function (_url) {
    var controllerAction = _url.getControllerActionTernary()
    var t1 = controllerAction[0]
    var t2 = controllerAction[1]
    var t3 = controllerAction[2]
    router[t1][t2][t3]()
  })
})()

function initRuleNew () {
  // 在js运行前加载需要的模块文件
  ruleNewLoadModule()

  setRules()
  // 事件绑定
  ruleNewEvent()

  require(['rule', 'core', 'goods_box', 'gift_box', 'gift_box2', 'area_box', 'EGD_box', 'EGFP_box', 'category_choose','area_choose'],
    function (rule, core, goods_box, gift_box, gift_box2, area_box, EGD_box, EGFP_box, category_choose,area_choose) {
      // 事件绑定
      goods_box.commonEvent()
      gift_box.commonEvent()
      gift_box2.commonEvent()
      area_choose.commonEvent()
      EGD_box.commonEvent()
      EGFP_box.commonEvent()
      area_box.commonEvent()
      // 加载几个弹窗的内容
      goods_box.show_goods_list()
      gift_box.show_gifts_list()
      area_box.showProvince()

      // 确认是编辑、复制、正常新建，做相应的页面跳转
      var promotionsId = core.getUrlParam('promotionsId')
      var op = core.getUrlParam('op')
      if (promotionsId && op === 'edit') {
        rule.toEdit_(promotionsId)
        // 用来开启校验并确定保存的js
        $('#promotionsForm').validate({
          success: function () {
            rule.edit_()
            return false
          }
        })
      } else if (promotionsId && op === 'copy') {
        rule.copy_(promotionsId)
        // 用来开启校验并确定保存的js
        $('#promotionsForm').validate({
          success: function () {
            rule.create_()
            return false
          }
        })
      } else {
        // 用来开启校验并确定保存的js
        $('#promotionsForm').validate({
          success: function () {
            rule.create_()
            return false
          }
        })

        // 时间相关
        core.formatDate()
        var today_ = new Date()
        $('input[name=startTime]').val(today_.format('yyyy-MM-dd hh:mm'))
        $('input[name=endTime]').val(today_.format('yyyy-MM-dd') + ' 23:59')
      }

      // 页面从创建优惠券跳转过来的时候，锁定点击的标签
      var promotionsType = core.getUrlParam('promotionsType')
      if (promotionsType) {
        $('#tab a[href="#' + promotionsType + '"]').trigger('click')

        // 确认名称和标签
        var ruleName = getCookie('ruleName')
        var label = getCookie('label')
        if (ruleName) {
          $('input[name=ruleName]').val(ruleName)
        }
        if (label) {
          $('input[name=label]').val(label)
        }
        clearCookie('ruleName')
        clearCookie('label')
      }
    })
}

function ruleNewLoadModule () {
  $.ajaxSetup({async: false})
  $('#goods_popup_box_html').load('/templates/views/resource/merchant/js/coupon/common/goods_box.html')
  $('#gift_popup_box_html').load('/templates/views/resource/merchant/js/coupon/common/gift_box.html')
  $('#gift_popup_box2_html').load('/templates/views/resource/merchant/js/coupon/common/gift_box_2.html')
  $('#area_popup_box_html').load('/templates/views/resource/merchant/js/coupon/common/area_box.html')
  $('#area_chooes_html').load('/templates/views/resource/merchant/js/coupon/common/area_chooes.html')
  $('#each_goods_discount_box_html').load('/templates/views/resource/merchant/js/coupon/common/each_goods_discount_box.html')
  $('#each_goods_fixed_price_box_html').load('/templates/views/resource/merchant/js/coupon/common/each_goods_fixed_price_box.html')
  $.ajaxSetup({async: true})
}

/**
 * 新建活动规则要绑定的事件
 * 事件上下关系请遵守页面的上下关系
 */
function ruleNewEvent () {
  require(['core', 'rule'], function (core, rule) {
    var $parent = $('#promotionsForm')
    // 优惠名称

    // 优惠类型
    $('#tab a').on('click', function () {
      var href = $(this).attr('href')
      if (!href.startsWith('#')) { // coupon和promotions的切换
        var params = 'couponType=' + href
        var ruleName = $('input[name=ruleName]').val()
        var label = $('input[name=label]').val()
        setCookie('ruleName', ruleName, 1)
        setCookie('label', label, 1)

        window.location.href = '/merchant/couponNew?' + params
      } else { // 包邮活动不包括门店自提 暂时
        switch (href) {
          case '#gift-promotions':
          case '#discount-promotions':
          case '#reduce-money-promotions':
          case '#fixed-price-promotions':
            takeBySelf(true)
            break
          case '#free-postage-promotions':
            takeBySelf(false)
            break
        }

        function takeBySelf (boolean) {
          $('input[name=order_type][value=\'100\']').attr('checked', boolean)
          $('input[name=order_type][value=\'100\']').attr('disabled', !boolean)
        }
      }
    })


    // 所有的 + 号事件
    $('input[name=_add]').live('click', function () {
      // 找到阶梯限制数
      var temp_str = $(this).parent().parent().nextAll('.sui-msg').eq(0).children('div').eq(0).html()
      var num = temp_str.replace(/[^0-9]/ig, '')

      if ($(this).parent().parent().children('span').size() >= num) {
        layer.msg('最多可添加' + num + '级阶梯')
        return
      }

      var temp_1 = $(this).parent().parent().prop('outerHTML')
      var $1 = $(temp_1).children('span').eq(0)
      var temp_2 = '<input type="button" value="-" style="height:20px;width:40px;" name="_minus"/>'
      $1.append(temp_2)
      $(this).parent().parent().append('<br/>').append($1)

      // 所有的 - 号事件
      $('input[name=_minus]').live('click', function () {
        $(this).parent().prev().remove()
        $(this).parent().remove()
      })
    })

    /* -- 地区弹出框相关事件 -- */
    $('input[name=areaIdsType]').on('change', function () {
      var temp_ = $('input[name=areaIdsType]:checked').val()
      if (temp_ == 1) {
        $('#area-box').find('.modal-title').text('指定【包邮】区域')
      } else {
        $('#area-box').find('.modal-title').text('指定【不包邮】区域')
      }
      $('#area-div').show()
    })

    /* -- 商品弹出框相关事件 -- */
    $('select[name=type]').on('change', function () {
      var selectedValue = $(this).val()
      $('select[name=type]').val(selectedValue)

      if (selectedValue == '0') {
        $('.GoodsIdsTypeCheck').hide()
      } else {
        $('.GoodsIdsTypeCheck').show()
      }
    })

    /* -- 满赠活动 ‘选择购买商品及组合方式’和‘选择赠送的商品’之间的联动 -- */
    $parent.find('#gift-promotions input[type=radio][name=calculateBase]').on('click', function () {
      var calculateBase = parseInt($(this).val())
      if (calculateBase === 2) {
        $parent.find('#gift-promotions input[type=radio][name=sendType][value=2]')
          .prop('checked', false)
          .prop('disabled', true)
      } else {
        $parent.find('#gift-promotions input[type=radio][name=sendType][value=2]')
          .prop('disabled', false)
      }
    })

    /* -- 满赠活动选择赠送商品单选框 -- */
    $parent.find('#gift-promotions input[name=sendType]').on('click', function () {
      var sendType = parseInt($(this).val())
      var giftBoxEntrance = $(this).nextAll('div')
      switch (sendType) {
        case 2:
          $parent.find('#gift-promotions #select_gift_num').html($parent.find('#gift-promotions #select_goods_num').html())
          $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#selected_gift_box')
          require(['gift_box2'], function (gift_box2) {
            if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
              gift_box2.showDataToGiftBox()
            } else {
              gift_box2.editDataToGiftBox()
            }
          })
          break
        case 3:
          $parent.find('#gift-promotions #select_gift_num').html($('#select-gifts-box table.select_gift_list tr').size())
          $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#select-gifts-box')
          break
        default:
          layer.msg('error on sendType')
      }
    })

    $parent.find('#gift-promotions .gift_box_button').on('click', function () {
      var sendType = $(this).parent().parent().find('input[name=sendType]:checked').val()
      if (parseInt(sendType) === 2) {
        $parent.find('#gift-promotions #select_gift_num').html($parent.find('#gift-promotions #select_goods_num').html())
        $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#selected_gift_box')
        require(['gift_box2'], function (gift_box2) {
          if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
            gift_box2.showDataToGiftBox()
          } else {
            gift_box2.editDataToGiftBox()
          }
        })
      }
    })

    /* -- 打折活动 按商品设置折扣 -- */
    $parent.find('#discount-promotions #set_each_goods_discount').on('click', function () {
      $(this).attr('data-target', '#undefined_ll')
      if ($('#discount-promotions select[name=type]').val() === '1' && $('#much_select_goods input[name=__goodsIds]').val()) {
        $(this).attr('data-target', '#each-goods-discount-box')
        require(['EGD_box'], function (EGD_box) {
          // 1. 检查设置折扣弹窗是否有数据，无则根据商品id添加页面数据
          if ($('#each-goods-discount-box table.select_goods_list tr').size() === 0) {
            EGD_box.showToEGDBoxFromGoodsBox()
          } else {
            EGD_box.editEGDBoxFromGoodsBox()
          }
          // 2. 检查折扣弹窗的数据和指定参加的商品数据是否一直，不一致则添加或删除，并提示
        })
      } else {
        layer.msg('只有在选择 “指定商品参加” 且 设置一个以上商品 时才能设置分别打折')
      }
    })

    /* -- 限价活动 按商品设置限价 -- */
    $parent.find('#fixed-price-promotions #set_each_goods_fixed_price').on('click', function () {
      $(this).attr('data-target', '#undefined_ll')
      if ($('#fixed-price-promotions select[name=type]').val() === '1' && $('#much_select_goods input[name=__goodsIds]').val()) {
        $(this).attr('data-target', '#each-goods-fixed-price-box')
        require(['EGFP_box'], function (EGFP_box) {
          // 1. 检查设置折扣弹窗是否有数据，无则根据商品id添加页面数据
          if ($('#each-goods-fixed-price-box table.select_goods_list tr').size() === 0) {
            EGFP_box.showToEGFPBoxFromGoodsBox()
          } else {
            EGFP_box.editEGFPBoxFromGoodsBox()
          }
          // 2. 检查折扣弹窗的数据和指定参加的商品数据是否一直，不一致则添加或删除，并提示
        })
      } else {
        layer.msg('只有在选择 “指定商品参加” 且 设置一个以上商品 时才能设置分别限价')
      }
    })

    // 数量

    // 有效期
    $('input[name=validity_type]').on('click', function () {
      var $dayOfMonth = $('#dayOfMonth')
      var $dayOfWeek = $('#dayOfWeek table').parent()
      switch ($(this).val()) {
        case '1':
          $dayOfMonth.hide()
          $dayOfWeek.hide()
          break
        case '2':
          $dayOfMonth.show()
          $dayOfWeek.hide()
          break
        case '3':
          $dayOfMonth.hide()
          $dayOfWeek.show()
          break
      }
    })

    $('.odd_day').on('click', function () {
      $('input[name=work-date-month]').filter('.odd').parent().checkbox().checkbox('check')
      $('input[name=work-date-month]').filter('.even').parent().checkbox().checkbox('uncheck')
    })

    $('.even_day').on('click', function () {
      $('input[name=work-date-month]').filter('.even').parent().checkbox().checkbox('check')
      $('input[name=work-date-month]').filter('.odd').parent().checkbox().checkbox('uncheck')
    })

    $('.optional_day').on('click', function () {
      $('input[name=work-date-month]').parent().checkbox().checkbox('uncheck')
    })

    // 是否首单

    // 订单类型

    // 适用门店
    $('input[name=apply_store]').on('click', function () {
      var value = $('input[name=apply_store]:checked').val()
      switch (parseInt(value)) {
        case -1:
          $('input[name=order_type]').prop('disabled', false)
          $('input[name=order_type]').prop('checked', true)
          break
        case 2:
          $('input[name=order_type][value="200"]').prop('checked', false)
          $('input[name=order_type][value="200"]').prop('disabled', true)
          break
      }
    })
    // 提交按钮 这里的validate用于启动数据数据校验
    $('#promotionsSubmit').on('click', function () {
      $('#promotionsForm').submit()
    })

    // 编辑提交 这里的validate用于启动数据数据校验
    $('#editSubmit').live('click', function () {
      $('#promotionsForm').submit()
    })
  })
}


function initRuleDetail () {
  // 在js运行前加载需要的模块文件
  ruleDetailLoadModule()

  ruleDetailEvent()
  require(['rule', 'core', 'goods_box'], function (rule, core, goods_box) {
    goods_box.commonEvent()
    goods_box.show_goods_list()

    var coupon_id = (core.getUrlParam('id'))
    $('input[name=coupon_rule_id]').val(coupon_id)
    rule.show_()

    rule.rightEntrance()
    rule.bottomButton()
  })

}

function ruleDetailLoadModule () {
  $.ajaxSetup({async: false})
  $('#goods_popup_box_html').load('/templates/views/resource/merchant/js/coupon/common/goods_box.html')
  $.ajaxSetup({async: true})
}

/**
 * 活动规则详情页面绑定事件
 */
function ruleDetailEvent () {
  require(['core', 'rule'], function (core, rule) {
    // 事件绑定在这里

    // 优惠类型 修改商品弹出框
    $('select[name=__goodsIdsType]').on('change', function () {
      var selectedValue = $(this).val()
      $('select[name=type]').val(selectedValue)

      if (selectedValue == '0') {
        $('#much_select_goods_container').hide()
      } else {
        $('#much_select_goods_container').show()
      }
    })

    $(document).delegate('#show_store', 'click', function (e) {
      console.log($(this).attr('data-value'))
      var storeList = JSON.parse(decodeURIComponent($(this).attr('data-value')))
      var storeStr = ''
      var support1 = '送货上门'
      var support2 = '门店自提'
      var support3 = '送货上门,门店自提'

      $('#selected_store').html('您已选择 <span style=\'color: red\'>' + storeList.length + '</span> 家门店：')
      for (var item = 0; item < storeList.length; item++) {
        console.log(storeList[item].serviceSupport)
        if (!storeList[item].service_support_str) {
          switch (storeList[item].serviceSupport) {
            case '150':
              storeList[item].serviceSupport = support1
              break
            case '160':
              storeList[item].serviceSupport = support2
              break
            case '150,160':
              storeList[item].serviceSupport = support3
              break
            case '160,150':
              storeList[item].serviceSupport = support3
              break
            case '':
              storeList[item].serviceSupport = '---'
              break
            case undefined:
              storeList[item].serviceSupport = '---'
              break
          }
        }
        storeStr += '<tr><td>' + storeList[item].storesNumber + '</td><td>' + storeList[item].name + '</td><td>'
          + storeList[item].serviceSupport + '</td></tr>'

      }
      $('#store_list_promotions').html(storeStr)

    })
    $('#goodsModifyModal').on('okHide', function () {
      var obj = {}

      var $parent = $('#goodsModifyModal')
      var goodsIdsType = parseInt($parent.find('select[name=__goodsIdsType]').val())
      obj.goodsIdsType = goodsIdsType
      if (goodsIdsType) {
        var goodsIds = $('#much_select_goods').find('input[name=__goodsIds]').val()
        if (!goodsIds) {
          layer.msg('请先选择商品')
          return
        }
        obj.goodsIds = goodsIds
      } else {
        obj.goodsIds = 'all'
      }

      var url = 'promotions/rule/editPromotionsRuleOneField'
      var params = {}
      params.ruleId = parseInt($('#id').html())
      params.field = 'goods'
      params.goods = JSON.stringify(obj)

      doGetOrPostOrJson(url, params, 'post', false, function (data) {
        if (data && data.code && data.code === '000') {
          location.reload()
        } else {
          layer.msg('修改失败')
          console.log(data)
        }
      })
    })

    /* -- 右边栏和底边栏按钮事件 -- */
    $(document).delegate('#express', 'click', function (e) {
      var ids = $('#areaIds').html()
      var url = core.getHost() + '/common/queryAreaByTree'
      $.post(url, 'areaIds=' + ids, function (data) {
        if (data.code == '000') {
          $('#tree').treeview({data: data.data, levels: 0})
        }
      })
    })
    // 停止发放
    $('#stop_promotions_rule').on('okHide', function () {
      var id = $('input[name=coupon_rule_id]').val()
      var msg = rule.changeStatus(id, 2)
      if (msg === 'success') {
        location.reload(true)
      } else if (msg === 'fail') {
        layer.msg('手动停发失败')
      } else {}
    })

    // 复制
    $('#copy_promotions_rule').live('click', function () {
      var op = 'copy'
      var id = $('input[name=coupon_rule_id]').val()
      location.href = '/merchant/promotions/ruleNew?promotionsId=' + id + '&op=' + op
    })

    // 确定发放点击事件
    $('#ConfirmModal').on('okHide', function () {
      var id = $('input[name=coupon_rule_id]').val()
      var msg = rule.changeStatus(id, 0)
      if (msg === 'success') {
        window.location.href = core.getHost() + '/merchant/promotions/activityNew?ruleId=' + id
      } else if (msg === 'fail') {
        layer.msg('发放失败')
      } else {}
    })

    // 稍后再说点击事件
    $('#ConfirmModal').on('cancelHide', function () {
      var id = $('input[name=coupon_rule_id]').val()
      var msg = rule.changeStatus(id, 0)
      if (msg === 'success') {
        window.location.reload()
      } else if (msg === 'fail') {
        layer.msg('发放失败')
      } else {}
    })

    // 弹框关闭点击事件
    $('#ConfirmModal .sui-close').on('click', function () {
      window.location.reload()
    })

    // 回显数据用于编辑
    $('#to_edit_promotions_rule').live('click', function () {
      var op = 'edit'
      var id = $('input[name=coupon_rule_id]').val()
      location.href = '/merchant/promotions/ruleNew?promotionsId=' + id + '&op=' + op
    })
    $(document).delegate('#show_store', 'click', function (e) {
      console.log($(this).attr('data-value'))
      var storeList = JSON.parse(decodeURIComponent($(this).attr('data-value')))
      var storeStr = ''
      $('#selected_store').html('您已选择 <span style=\'color: red\'>' + storeList.length + '</span> 家门店：')
      for (var item = 0; item < storeList.length; item++) {
        console.log(storeList[item].service_support)
        storeStr += '<tr><td>' + storeList[item].storesNumber + '</td><td>' + storeList[item].name + '</td><td>'
          + storeList[item].service_support_str + '</td></tr>'

      }
      $('#store_list').html(storeStr)

    })

    $(document).delegate('#show_goods', 'click', function (e) {
      console.log($(this).attr('data-value'))
      var goodsList = JSON.parse(decodeURIComponent($(this).attr('data-value')))
      var goodsStr = ''

      $('#selected_goods').html('您已选择 <span style=\'color: red\'>' + goodsList.length + '</span> 个商品：')
      for (var item = 0; item < goodsList.length; item++) {
        var price = goodsList[item].product_price == 0 ? 0 : goodsList[item].product_price
        goodsStr += '<tr><td>' + goodsList[item].product_name + '</td><td>' + price / 100 + '</td><tr>'
      }
      $('#goods_list').html(goodsStr)

    })
    $(document).delegate('#show_gift_goods', 'click', function (e) {
      console.log($(this).attr('data-value'))
      var goodsList = JSON.parse(decodeURIComponent($(this).attr('data-value')))
      var goodsStr = ''

      $('#selected_gift').html('您已选择 <span style=\'color: red\'>' + goodsList.length + '</span> 个赠品：')
      for (var item = 0; item < goodsList.length; item++) {
        var price = goodsList[item].shop_price == 0 ? 0 : goodsList[item].shop_price
        goodsStr += '<tr><td>' + goodsList[item].goods_title + '</td><td>' + price / 100 + '</td><td>' + goodsList[item].sendNum + '</td><tr>'
      }
      $('#gift_list').html(goodsStr)

    })

    $('#validity_day_append_save').on('click', function () {
      update_amount_validity(core)
    })

  })
}

function update_amount_validity (core) {
  var params = {}

  params.ruleId = core.getUrlParam('id')
  params.ruleType = 2
  params.dayNum = $('input[name="validity_day_append"]').val() ? $('input[name="validity_day_append"]').val() : 0
  var g = new RegExp(/^[0-9]{1}[0-9]*$/)
  if (!g.test(params.dayNum)) {

    layer.msg('追加错误，请输入有效天数')
    return
  }

  if (params.dayNum > 3600) {

    layer.msg('有效期追加最多为3600天，请重新输入')
    return
  }

  if (params.amount > 0 || params.dayNum > 0) {
    layer.open({
      type: 3,
      content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>'
    })
    var url = core.getHost() + '/merchant/promotions/prolongPromValidity'
    $.post(url, params, function (e) {
      if (e.code == '000') {
        layer.msg('修改成功')
        window.location.reload()
      } else {
        layer.msg('修改失败')
      }
    })
  }

}

function initActivityNew () {
  $('#newBtn').attr('class', 'sui-btn btn-info btn-large')
  require(['core', 'activity'], function (core, activity) {
    core.formatDate()
    var today_ = new Date()
    $('input[name=start_time]').val(today_.format('yyyy-MM-dd hh:mm'))
    $('input[name=end_time]').val(today_.format('yyyy-MM-dd') + ' 23:59')
    activity.getMemberSignInfo()
    activity.getMemberSignGroupInfo()
    activity.get_vip_member_list()
    activity.getAllStore()
    activity.getCouponList()

    var activityId = core.getUrlParam('activityId')
    if (activityId) {
      $('#send_activity_ok').text('保存')
      activity.toEdit_(activityId)
    }
    var ruleId = core.getUrlParam('ruleId')
    if (ruleId) {
      $('input[type=radio][name=coupon_id][value=' + ruleId + ']').attr('checked', 'checked')
      $('#rules_val').val(ruleId)
    }
  })

  activityNewEvent()
}

/**
 * 新建活动发放页面绑定事件
 */
function activityNewEvent () {

  require(['core', 'activity'], function (core, activity) {
    console.log('activityNewEvent')

    $('input[type=radio][name=active_center]').on('change', function () {
      if ($(this).val() == 0) {
        $('#promotionsMouldDiv').hide()
      } else {
        $('#promotionsMouldDiv').show()
      }
    })

    $('input[type=radio][name=sendObj]').on('change', function () {
      if ($(this).val() == 0) {
        $('.user_check_members').hide()
        $('.direct_user_check_members').hide()
        $('#show_active_obj').hide()
      } else if ($(this).val() == 1) {
        $('.direct_user_check_members').hide()
        $('.user_check_members').show()
        $('.user_check_members_group').hide()
        $('#show_active_obj').hide()
        $('#show_active_obj_group').hide()
      }
      else if ($(this).val() == 3) {
        $('#show_active_obj').hide()
        $('.user_check_members').hide()
        $('.direct_user_check_members').hide()
        $('.user_check_members_group').show()
        $('#show_active_obj_group').hide()
      } else {
        $('.user_check_members_group').hide()
        $('.user_check_members').hide()
        $('#show_active_obj').hide()
        $('#show_active_obj_group').hide()
        $('.direct_user_check_members').show()
      }
    })

    $('input[type=radio][name=isTopicPromotions]').on('change', function () {
      if ($(this).val() == 0) {
        $('#topicActivityDiv').hide()
      } else {
        $('#topicActivityDiv').show()
      }
    })

    // 商品小工具搜索
    function findShoplist () {
      var goodsTitle = $('.shop_main_content .goodsTitle').val()
      var startPrice = $('.shop_main_content .startPrice').val()
      var endPrice = $('.shop_main_content .endPrice').val()
      if (startPrice != '') {
        startPrice = startPrice * 100
      }
      if (endPrice != '') {
        endPrice = endPrice * 100
      }
      console.log(goodsTitle, 'dasdasd')
      vm.goodsTitle = goodsTitle
      vm.startPrice = startPrice
      vm.endPrice = endPrice
      bgoodsList()
      $('.shop_main_content .goodsTitle').val('')
      $('.shop_main_content .startPrice').val('')
      $('.shop_main_content .endPrice').val('')
    }

    //    商品小工具获取选择的商品
    function checkShop () {
      $('.selectIMG').each(function () {
        console.log($(this).attr('goodsid'), '****************')
        if ($.inArray($(this).attr('goodsid'), vm.shopsId) >= 0) {
          $(this).attr('checked', true)
        }
        else {
          $(this).attr('checked', false)
        }
      })
    }

    var pagination_page_no = 1 //页码
    var pagination_pages = 1 //总页数
    var pagination_totals = 0 //总条数
    var pagination_pagesize = 16 //每页显示多少条
    //查询商品列表
    function bgoodsList () {
      $.ajax({
        type: 'post',
//      url: "/merchant/ecBgoodsList",
        url: '/merchant/ecBgoodsListByDrugName',
        dataType: 'json',
        data: {
          user_cateid: vm.cateId,
          maxPrice: vm.endPrice,
          minPrice: vm.startPrice,
          goods_name: vm.goodsTitle,
          pageNum: 12,
          currentPage: vm.pageNum,
//        goods_img:1,
          goods_status: 1
        },
        success: function (data) {
          console.log(data, '查询商品列表')
          if (data.code == '000') {
            if (data.total % 12 > 0) {
              pagination_pages = parseInt(data.total / 12) + 1//总页数
            }
            else {
              pagination_pages = parseInt(data.total / 12)
            }
            pagination_totals = data.total//总条数
            vm.bgoodsList.list = data.gInfos
            console.log(vm.bgoodsList.list, '^^^^^^^^^^^^^^^^^^^^^')
            console.log(vm.shopsId, '++++++++++++++++++')
            setTimeout(checkShop, 500)
            $('#pagediv').html('<span class=\'pageinfo\'></span>')
            $('#pageLink').html('<span class=\'pageinfo\'></span>')
            addpage(bgoodsList)
          }
          else {
            vm.bgoodsList.list = []
          }

        },
        error: function () {
          console.log('请求失败！')
        }
      })
    }

    //    查找商品
    function categories () {
      $.ajax({
        type: 'post',
        url: '/merchant/categories',
        dataType: 'json',
        success: function (data) {
          console.log(data, '查找商品分类链接')
          if (data.result) {
            vm.categories.result.children = data.result.children
            console.log(vm.categories.result.children, 'sadasdasdasd')
          }
        },
        error: function () {
          console.log('请求失败！')
        }
      })
    }

    // 链接小工具商品搜索
    function findShop () {
      var goodsTitle = $('#goodsTitle').val()
      var startPrice = $('#priceStart').val()
      var endPrice = $('#priceEnd').val()
      if (startPrice != '') {
        startPrice = startPrice * 100
      }
      if (endPrice != '') {
        endPrice = endPrice * 100
      }
      vm.goodsTitle = goodsTitle
      vm.startPrice = startPrice
      vm.endPrice = endPrice
      bgoodsList()
      $('#goodsTitle').val('')
      $('#priceStart').val('')
      $('#priceEnd').val('')
    }

    // 获取相应的主题信息
    function indexPageGet (themeId) {
      $.ajax({
        type: 'post',
        url: '/wxThemeManager/indexPageGetDraft',
        dataType: 'json',
        data: {
          themeId: themeId,
        },
        success: function (data) {
          vm.updateTime = data.data.updateTime
          console.log(data, ' 获取相应的主题信息69699')
          vm.modelData = JSON.parse(data.data.metaVal)
          console.log(vm.modelData, ' 哈哈哈哈')
          vm.backData = data.data.metaVal
//              console.log( vm.backData," 要回显得数据");

          //    swaper轮播
          Vue.nextTick(function () {
            var mySwiper = new Swiper('.swiper-container', {
              autoplay: 3000,
              loop: true,
              pagination: '.swiper-pagination',
              autoplayDisableOnInteraction: false
            })
            //    轮播导航
            var swiper1 = new Swiper('.swiper-container1', {
              pagination: '.swiper-pagination1',
              slidesPerView: 5,
              slidesPerColumn: 2,
              spaceBetween: 10,
            })
            //    轮滑
            var swiper2 = new Swiper('.swiper-container2', {
              pagination: '.swiper-pagination2',
              slidesPerView: 3.5,
              //        centeredSlides: true,
              paginationClickable: true,
              spaceBetween: 10
            })
          })

        },
        error: function () {
          console.log('请求失败！')
        }
      })
    }

    $('input[type=radio][name=active_type]').on('change', function () {
      if ($(this).val() == 0) {
        $('#add_coupon_list').show()

      } else {
        $('#add_coupon_list').hide()
        $('#promitonsDetail').hide()
      }
      if ($(this).val() == 1) {
        $('#linkweb').show()
        $('#add_coupon_link').show()
      } else {
        $('#linkweb').hide()
        $('#add_coupon_link').hide()
      }
    })

    $('#add_coupon_list').on('click', function () {
      $('#coupon_list').modal('show')
    })

    $('.select-coupon-ok-btn').on('click', function () {
      var rulesVal = $('#rules_val').val()
      if (rulesVal == '' || rulesVal.indexOf('undefined') != -1) {
        layer.msg('添加优惠活动失败')
        return
      }
      $('#coupon_list').modal('hide')
    })

    /**
     * 标签组添加事件
     */
    $(document).on('click', '.main-item-a', function () {
      var data = {}
      data.id = $(this).attr('id')
      data.crowdName = $(this).text()
      if (!$('[name="sign-member-b-input"][value="' + data.id + '"]').val()) {

        if ($('#send_obj_members')) {
          var ss = $('#send_obj_members').val()
          ss += data.id + ','
          $('#send_obj_members').val(ss)
        }
        $(this).css('background-color', 'green')
        var tmpl = '<a href=\'#\' data-empty-msg="' + data.crowdName + '"  data-id = "' + data.id + '" class=\'main-item main-item-b\' id="' + data.id + '">' + data.crowdName + '<input type="hidden" name="sign-member-b-input" value="' + data.id + '"><span class="close-item close-item-a">×</span></a> '
        $('#content-box-main_b').append(tmpl)
      } else {
        layer.msg('该标签已被选择！')
      }
    })

    /**
     * 标签库添加事件
     */
    $(document).on('click', '.main-item-a-group', function () {
      var data = {}
      data.labelName = $(this).attr('id')
      if (!$('[name="sign-member-b-input_group"][value="' + data.labelName + '"]').val()) {
        if ($('#send_obj_members_group')) {
          var ss = $('#send_obj_members_group').val()
          ss += data.labelName + ','
          $('#send_obj_members_group').val(ss)
        }
        $(this).css('background-color', 'green')
        var tmpl = '<a href=\'#\' data-empty-msg="' + data.labelName + '"  data-labelName = "' + data.labelName + '" class=\'main-item main-item-b_group\' id="' + data.labelName + '">' + data.labelName + '<input type="hidden" name="sign-member-b-input_group" value="' + data.labelName + '"><span class="close-item close-item-a_group">×</span></a> '
        $('#content-box-main_b_group').append(tmpl)
      } else {
        layer.msg('该标签已被选择！')
      }
    })

    /**
     * 标签组移除事件
     */
    $(document).on('click', '.close-item-a', function () {
      $(this).parents('.main-item-b').remove()

      var ss = $('#send_obj_members').val()
      if (ss != undefined) {
        var members_id = ss.split(',')
        var memberId = $(this).parent().attr('data-id')

        var index = $.inArray(memberId, members_id)
        if (index != -1) {
          members_id.splice(jQuery.inArray(memberId, members_id), 1)
          $('#send_obj_members').val(members_id.toString())
        }
      }

      $('[name="sign-member-a-input"][value="' + $(this).parent().attr('data-id') + '"]').parent().css('background-color', '#169bd5')

    })

    /**
     * 标签库移除事件
     */
    $(document).on('click', '.close-item-a_group', function () {
      $(this).parents('.main-item-b_group').remove()

      var ss = $('#send_obj_members_group').val()
      if (ss != undefined) {
        var labelName = ss.split(',')
        for (var i = 0; i < labelName.length; i++) {
          if (labelName[i] == $(this).parents('.main-item-b_group').attr('id')) {
            labelName.splice(i, 1)
          }
        }
        $('#send_obj_members_group').val(labelName)
      }

      $('[name="sign-member-a-input_group"][value="' + $(this).parents('.main-item-b_group').attr('id') + '"]').parent().css('background-color', '#169bd5')

    })

    /**
     * 商品标签确认按钮
     */
    $(document).on('click', '.select-sign-members-ok', function () {
      var members_id = ''
      var members_title = ''
      $('#content-box-main_b a').each(function () {
        members_id += $(this).attr('data-id') + ','
        members_title += '<a href=\'#\'  class=\'main-item main-item-a\'>' + $(this).attr('data-empty-msg') + '</a> '
      })

      members_id = members_id.substr(0, members_id.length - 1)

      if (members_id) {
        $('#send_obj_members').val(members_id)
        $('#select_sign_member').modal('hide')
        $('#send_obj_info').html('')
        $('#send_obj_info').append(members_title)
        $('#show_active_obj').show()
      } else {
        layer.msg('请选择至少一个标签 ！')
      }

    })

    /**
     * 商品标签组确认按钮
     */
    $(document).on('click', '.select-sign-members-ok_group', function () {
      var members_id = ''
      var members_title = ''
      $('#content-box-main_b_group a').each(function () {
        members_id += $(this).attr('id') + ','
        members_title += '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + $(this).attr('data-empty-msg') + '</a> '
      })

      members_id = members_id.substr(0, members_id.length - 1)

      if (members_id) {
        $('#send_obj_members_group').val(members_id)
        $('#select_sign_group_member').modal('hide')
        $('#send_obj_group_info').html('')
        $('#send_obj_group_info').append(members_title)
        $('#show_active_obj_group').show()
      } else {
        layer.msg('请选择至少一个标签 ！')
      }

    })

    /**
     * 自定义会员添加
     */
    $(document).on('click', '.select_direct_member_btn', function () {
      var data = {}
      data.memberId = $(this).parent().find('[name="memberId"]').val()
      data.mobile = $(this).parent().find('[name="mobile"]').val()
      data.storName = $(this).parent().find('[name="storName"]').val()
      data.registerTime = $(this).parent().find('[name="registerTime"]').val()
      data.ban_status = $(this).parent().find('[name="ban_status"]').parent().val()
      if (!$('.select_member_list [name="memberId"][value="' + data.memberId + '"]').val()) {
        if ($('#send_obj_members_direct')) {
          var ss = $('#send_obj_members_direct').val()
          ss += data.memberId + ','
          $('#send_obj_members_direct').val(ss)
        }

        var tmpl = document.getElementById('coupon_select_members_list_templete').innerHTML
        var doTtmpl = doT.template(tmpl)
        $('.select_member_list').append(doTtmpl(data))
      } else {
        layer.msg('该会员已在选取列表！')
      }

    })

    /**
     * 自定义会员移除
     */
    $(document).on('click', '.unselect_members_btn', function () {
      $(this).parents('.can_del_tr').remove()
      var ss = $('#send_obj_members_direct').val()
      if (ss != undefined) {
        var members = ss.split(',')
        var memberId = $(this).parent().find('input[name=memberId]').val()

        var index = $.inArray(memberId, members)
        if (index != -1) {
          members.splice(jQuery.inArray(memberId, members), 1)
          $('#send_obj_members_direct').val(members.toString())
        }
      }

    })

    //活动搜索会员确认按钮
    $('.search_much_members_btn').live('click', function () {
      require(['activity', 'core'], function (activity, core) {
        activity.pageno = 1
        activity.get_vip_member_list()
      })

    })

    /**
     * 会员确认按钮
     */
    $(document).on('click', '.select-members-ok', function () {
      var members_id = ''
      $('.select_member_list input[name=\'memberId\']').each(function () {
        members_id += $(this).val() + ','
      })

      members_id = members_id.substr(0, members_id.length - 1)

      if (members_id) {
        $('#send_obj_members_direct').val(members_id.toString())
        $('#direct_check_user_members').modal('hide')
      } else {
        layer.msg('请至少选择一个会员 ！')
      }

    })

    $('#uploadMember').on('click', function () {
      activity.uploadMember()
    })

    $(document).on('click', '.check_import', function () {
      if ($.trim($('#member_list').html()) != '') {
        var str = $('#send_obj_members_direct').val()
        if (str != '') {
          $('#send_obj_members_direct').val(str)
          $('#direct_check_user_members').modal('hide')
          layer.msg('批量导入成功！')
          to_sure_reissure_activity()
        } else {
          layer.msg('保存失败，没有可成功导入的会员')
        }
      } else {
        layer.msg('请不要导入空的模板')
      }
    })

    //图标上传
    $('input[type=file]').live('change', function (evt) {
      if ($(this).attr('id') == 'input_file_C') {
        return
      }
      var r = $(this).parent().children().eq(0).attr('id')
      console.log(r)
      activity.upLoadPic(evt, this, r)

    })

    $('#send_activity_ok').on('click', function () {
      require(['activity', 'core'], function (activity, core) {
        var activityId = core.getUrlParam('activityId')
        activity.create_(activityId)
      })
    })

    //富文本点击上传事件
    $('#input_file_C').live('change', function uploadImg (evt) {
      var param = {}
      var files = evt.target.files
      var formData = new FormData()
      formData.append('file', files[0])
      $.ajax({
        url: '/common/localpictureUpload',
        type: 'POST',
        data: formData,
        success: function (data) {
          var tips = '<img src="http://jkosshash.oss-cn-shanghai.aliyuncs.com//' + data.image.md5Key + '.jpg">'
          console.log(editor.html())
          editor.html(editor.html() + tips)
          $('#upload_C').attr('class', 'sui-modal hide')
          layer.msg('上传成功')
        },
        error: function (data) {
        },
        cache: false,
        contentType: false,
        processData: false
      })
    })

  })
}

function initActivityDetail () {
  console.log('initActivityDetail')

  require(['activity', 'core'], function (activity, core) {
    var id = (core.getUrlParam('id'))
    console.log('id-->' + id)
    $('#activity_form').append('<input type="hidden" name="edit_id" id="edit_id" value="' + id + '"/>')
    activity.show_()
    activity.changePromotionsActivityDetailButtons()
    activity.changePromotionsActivityDetailRightSide()
    activityDetailEvent()
  })
}

/**
 * 活动发放详情页面绑定事件
 */
function activityDetailEvent () {
  require(['core', 'activity'], function (core, activity) {
    console.log('activityDetailEvent')
    $('#edit_activity').on('click', function () {
      var activityId = $('input[name=activity_id]').val()

      location.href = core.getHost() + '/merchant/promotions/activityNew?activityId=' + activityId
    })
    //将待发布改为发布中
    $('#send_activity').on('click', function () {
      console.log('确认发布')
      activity.sendActivity()
    })

    //结束该活动
    $('#stop_activity').on('okHide', function () {
      console.log('结束该活动')
      activity.stopActivity()
    })
  })
}

/**
 * sui input框校验规则自定义
 */
function file_change (name) {
  $('#file_name').val(name)
}

function setRules () {
  // 设置折扣格式校验
  var discount = function (value, element, param) {
    var rule = /^(0\.[1-9]|[1-9](\.[0-9])?)$/
    return rule.test(value)
  }

  $.validate.setRule('discount', discount, '打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%')

  // 金钱校验
  var money = function (value, element, param) {
    var rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    return rule.test(value)
  }

  $.validate.setRule('money', money, '请输入符合金钱格式的数字')

}

// 设置cookie
function setCookie (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/'
}

// 获取cookie
function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 清除cookie
function clearCookie (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null)
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

/**
 *
 * @param url
 * @param params
 * @param type 'post" or 'get" or "json"
 * @param async ajax同步还是异步
 * @param callback 回调函数
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
