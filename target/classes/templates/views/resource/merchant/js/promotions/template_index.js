!(function() {

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
      'GBP_box': 'merchant/js/coupon/common/group_booking_price_box',
      'GBD_box': 'merchant/js/coupon/common/group_booking_discount_box',
      'gift_box': 'merchant/js/coupon/common/gift_box',
      'gift_box2': 'merchant/js/coupon/common/gift_box_2',
      'area_box': 'merchant/js/coupon/common/area_box',
      'vue': 'public/vue',
      'activity': 'merchant/js/promotions/activity',
      'modelRule': 'merchant/js/promotions/model/modelRule',
      'store_box': 'merchant/js/coupon/common/store_box',
      'modelActivity': 'merchant/js/promotions/model/modelActivity',
      'area_choose': 'merchant/js/coupon/common/area_choose',
      'coupon_template': 'merchant/js/coupon/coupon_template',
    },
  });

  // 使用core.js 初始化一些东西
  require(['core'], function(core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();
  });

  // 定义Url对应的函数
  var router = {
    'merchant': {
      'promotions': {
        'templatesEntry': templatesEntryInit,
        'promotionsSendManager': promotionsSendManager,
        'templateNew': templateNewInit,
        'activityDetail': activityDetailInit,
        'outLink': outLinkInit,
        'activityDetailOutLink': activityDetailOutLink,
      },
    },
  };

  //根据Url执行不同的初始化函数
  require(['core'], function(_url) {
    var controllerAction = _url.getControllerActionTernary();
    var t1 = controllerAction[0];
    var t2 = controllerAction[1];
    var t3 = controllerAction[2];
    router[t1][t2][t3]();
  });
})();

// 对应的模块id和资源路径
const sourceMap = new Map([
  [
    $('#area_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/area_box.html'],
  [
    $('#goods_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/goods_box.html'],
  [
    $('#gift_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/gift_box.html'],
  [
    $('#gift_popup_box2_html'),
    '/templates/views/resource/merchant/js/coupon/common/gift_box_2.html'],
  [
    $('#store_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/store_box.html'],
  [
    $('#each_goods_discount_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/each_goods_discount_box.html'],
  [
    $('#each_goods_fixed_price_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/each_goods_fixed_price_box.html'],
  [
    $('#area_choose_html'),
    '/templates/views/resource/merchant/js/coupon/common/area_chooes.html'],
  [
    $('#group_booking_price_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/group_booking_price_box.html'],
  [
    $('#group_booking_discount_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/group_booking_discount_box.html'],
]);

//初始化创建活动的页面数据
function templateNewInit() {
  require([
      'core', 'utils', 'modelRule', 'modelActivity', 'goods_box', 'gift_box', 'gift_box2', 'area_box',
      'EGD_box', 'EGFP_box', 'GBP_box', 'GBD_box', 'store_box', 'area_choose'],
    function(core, utils, modelRule, modelActivity, goods_box, gift_box, gift_box2, area_box,
             EGD_box, EGFP_box, GBP_box, GBD_box, store_box, area_choose) {
      utils.loadPageAsync(sourceMap, () => {
        //初始化页面列表左侧选中状态
        rightMenu();

        //设置SUI验证规则
        setRules();
        //载入各种模板页面
        loadModuleBeforeInit(core, () => {
          // 弹窗事件
          goods_box.commonEvent();
          gift_box.commonEvent();
          gift_box2.commonEvent();
          area_box.commonEvent();
          EGD_box.commonEvent();
          EGFP_box.commonEvent();
          GBP_box.common_event();
          GBD_box.common_event();
          store_box.commonEvent();
          area_choose.commonEvent();
          // 加载几个弹窗的数据
          goods_box.show_goods_list();
          gift_box.show_gifts_list();
          area_box.showProvince();
          store_box.show_store_list();
          //创建页面的各种事件
          templateNewEvent();
          activityNewEvent(modelActivity, utils);
          // 启动页面sui校验，用于创建优惠活动规则
          var some_box = {'GBP_box': GBP_box, 'GBD_box': GBD_box};
          checkMyPageData(modelRule, some_box);
          //判断是创建还是复制还是修改函数
          createOrEditOrCopy(modelActivity, core);
        });
      });
    });
}

//详情页面初始化
function activityDetailInit() {
  require(['core', 'modelActivity', 'modelRule', 'utils', 'goods_box'],
    function(core, modelActivity, modelRule, utils, goods_box) {
      utils.loadPageAsync(sourceMap, () => {
        rightMenu();

        goods_box.commonEvent();
        goods_box.show_goods_list();
        activityDetailEvent(core, modelActivity, modelRule);

        var id = (core.getUrlParam('id'));
        $('#promotions_form').append('<input type="hidden" name="edit_id" id="edit_id" value="' + id + '"/>');
        modelActivity.show_(modelRule, utils, core);
        modelActivity.changePromotionsActivityDetailButtons();
        modelActivity.changePromotionsActivityDetailRightSide();
      });
    });
}

//自定义sui表单验证的规则
function setRules() {
  // 设置折扣格式校验
  var discount = function(value, element, param) {
    var rule = /^(0\.[1-9]|[1-9](\.[0-9])?)$/;
    return rule.test(value);
  };

  $.validate.setRule('discount', discount, '打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%');

  // 金钱校验
  var money = function(value, element, param) {
    var rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    return rule.test(value);
  };

  $.validate.setRule('money', money, '请输入符合金钱格式的数字');

  // 距离校验
  var distance = function(value, element, param) {
    var rule = /(^\d+$)/;
    return rule.test(value);
  };

  $.validate.setRule('distance', distance, '请输入非负整数数字');
}

//加载模板页面
function loadModuleBeforeInit(core, fn) {
  var router = {
    '10': { // promotionsType = 10 满赠活动
      '1': '/templates/views/resource/merchant/js/promotions/module/10_all.html' //
    },
    '20': { //promotionsType = 20 打折活动
      '15': '/templates/views/resource/merchant/js/promotions/module/20_1.html', //直接打折
      '2': '/templates/views/resource/merchant/js/promotions/module/20_2.html', //满元打折
      '34': '/templates/views/resource/merchant/js/promotions/module/20_3.html' //满件打折
    },
    //promotionsType = 30 包邮活动
    '30': {
      '1': '/templates/views/resource/merchant/js/promotions/module/30_1.html' //包邮没有ruleType  默认
    },
    //promotionsType = 40 满减活动
    '40': {
      '1': '/templates/views/resource/merchant/js/promotions/module/40_1.html',//立减 即 ruleType = 1
      '2': '/templates/views/resource/merchant/js/promotions/module/40_2.html', //每满多少减多少 ruleType=2
      '3': '/templates/views/resource/merchant/js/promotions/module/40_3.html'  //满多少元减多少元 ruleType=3
    },
    //promotionsType = 50 限价活动
    '50': {
      '1': '/templates/views/resource/merchant/js/promotions/module/50_all.html',
      //每个商品都有自己的限定价格
    },
    //promotionsType = 60 团购活动
    '60': {
      '1': '/templates/views/resource/merchant/js/promotions/module/60_all.html',
    },
  };

  /* -- 加载主体和对应规则 -- */
  var promotionsType = core.getUrlParam('promotionsType');
  var ruleType = core.getUrlParam('ruleType');

  let promise = ifExistThanLoad($('#promotions_rule_html'), router[promotionsType.toString()][ruleType.toString()]);
  if (promise)
    promise.then(() => fn());
}

//判断文件是否被加载
function ifExistThanLoad($div, url) {
  if ($div.size() === 1) {
    return appendPage($div, url);
  }
}

function appendPage($position, url) {
  return fetch(url).
    then(rep => {
      if (rep.ok) {
        return rep.text();
      } else {
        throw error;
      }
    }).
    then(data => {
      console.log('start to load page:' + url);
      $position.append(data);
    });
}

//创建活动的模板页面相关初始化
function templatesEntryInit() {
  addSomeTemplateClick();
  findPromotionsTemplateInfo2Page();
  rightMenu();
}

function outLinkInit() {
  rightMenu();
  require(['core', 'utils', 'modelRule', 'modelActivity'],
    function(core, utils, modelRule, modelActivity) {
      //templateNewEvent()
      activityNewEvent(modelActivity, utils);
      // 启动页面sui校验，用于创建优惠活动规则
    });
}

//初始化创建页面的事件(第一页)
function templateNewEvent() {

  groupBookingEvent();
  limitedPriceEvent();
  $('#check_import').on('click', function() {
    if ($.trim($('#member_list').html()) != '') {
      var str = $('#send_obj_members_direct').val();
      if (str != '') {
        $('#send_obj_members_direct').val(str);
        $('#direct_check_user_members').modal('hide');
        layer.msg('批量导入成功！');
      } else {
        layer.msg('保存失败，没有可成功导入的会员');
      }
    } else {
      layer.msg('请不要导入空的模板');
    }
  });

  //触发函数
  $('#group-booking-promotions select[name=type]').on('change', function() {
    var type = $('#group-booking-promotions select[name=type] :selected').val();
    var target = $('#group-booking-promotions select[name=rule_type]');
    switch (type) {
      case '0':
      case '2':
        target.val(1);
        target.find('option[value=1],option[value=3]').show();
        target.find('option[value=2],option[value=4]').hide();
        break;
      case '1':
        target.find('option').show();
        break;
    }
  });

  $('#tab-demo2 a').click(function(e) {
    e.preventDefault();
    $('#index3').hide();
    $('#about3').show();
    $('.wrap').find('div').eq(0).removeClass().addClass('todo');
    $('.wrap').find('div').eq(1).removeClass().addClass('finished');
    $('.wrap').find('div').eq(1).find('.round').html('<i class="sui-icon icon-pc-right"></i>');
  });

  var $parent = $('#promotions_rule_form');
  // 优惠名称
  // 所有的 + 号事件
  $('input[name=_add]').live('click', function() {
    // 找到阶梯限制数
    var temp_str = $(this).parent().parent().next('.pd8').find('.sui-msg').eq(0).children('div').eq(0).html();
    if (typeof(temp_str) == 'undefined') {
      temp_str = $(this).parent().parent().nextAll('.sui-msg').eq(0).children('div').eq(0).html();
    }
    var num = temp_str.replace(/[^0-9]/ig, '');

    if ($(this).parent().parent().children('span').size() >= num) {
      layer.msg('最多可添加' + num + '级阶梯');
      return;
    }

    var temp_1 = $(this).parent().parent().prop('outerHTML');
    var $1 = $(temp_1).children('span').eq(0);
    var temp_2 = '<input type="button" value="-" style="height:20px;width:40px;" name="_minus"/>';
    $1.append(temp_2);
    $(this).parent().parent().append('<br/>').append($1);

    // 所有的 - 号事件
    $('input[name=_minus]').live('click', function() {
      $(this).parent().prev().remove();
      $(this).parent().remove();
    });
  });

  /* -- 地区弹出框相关事件 -- */
  $('input[name=areaIdsType]').on('change', function() {
    var temp_ = $('input[name=areaIdsType]:checked').val();
    if (temp_ == 1) {
      $('#area-box').find('.modal-title').text('指定【包邮】区域');
    } else {
      $('#area-box').find('.modal-title').text('指定【不包邮】区域');
    }
    $('#area-div').show();
  });

  /* -- 商品弹出框相关事件 -- */
  $('select[name=type]').live('change', function() {
    var selectedValue = $(this).val();
    $('select[name=type]').val(selectedValue);

    if (selectedValue == '0') {
      $('.GoodsIdsTypeCheck').hide();
    } else {
      $('.GoodsIdsTypeCheck').show();
    }
  });

  /* -- 满赠活动 ‘选择购买商品及组合方式’和‘选择赠送的商品’之间的联动 -- */
  $parent.find('#gift-promotions input[type=radio][name=calculateBase]').on('click', function() {
    var calculateBase = parseInt($(this).val());
    if (calculateBase === 2) {
      $parent.find('#gift-promotions input[type=radio][name=sendType][value=2]').
        prop('checked', false).
        prop('disabled', true);
    } else {
      $parent.find('#gift-promotions input[type=radio][name=sendType][value=2]').prop('disabled', false);
    }
  });

  /* -- 满赠活动选择赠送商品单选框 -- */
  $parent.find('#gift-promotions input[name=sendType]').on('click', function() {
    var sendType = parseInt($(this).val());
    switch (sendType) {
      case 2:
        $parent.find('#gift-promotions #select_gift_num').
          html($parent.find('#gift-promotions #select_goods_num').html());
        $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#selected_gift_box');
        require(['gift_box2'], function(gift_box2) {
          if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
            gift_box2.showDataToGiftBox();
          } else {
            gift_box2.editDataToGiftBox();
          }
        });
        break;
      case 3:
        $parent.find('#gift-promotions #select_gift_num').html($('#select-gifts-box table.select_gift_list tr').size());
        $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#select-gifts-box');
        break;
      default:
        layer.msg('error on sendType');
    }
  });

  $parent.find('#gift-promotions .gift_box_button').on('click', function() {
    var sendType = $(this).parent().parent().find('input[name=sendType]:checked').val();
    if (parseInt(sendType) === 2) {
      $parent.find('#gift-promotions #select_gift_num').html($parent.find('#gift-promotions #select_goods_num').html());
      $parent.find('#gift-promotions .gift_box_button').attr('data-target', '#selected_gift_box');
      require(['gift_box2'], function(gift_box2) {
        if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
          gift_box2.showDataToGiftBox();
        } else {
          gift_box2.editDataToGiftBox();
        }
      });
    }
  });

  /* -- 打折活动 按商品设置折扣 -- */
  $parent.find('#discount-promotions #set_each_goods_discount').on('click', function() {
    $(this).attr('data-target', '#undefined_ll');
    if ($('#discount-promotions select[name=type]').val() === '1' &&
      $('#much_select_goods input[name=__goodsIds]').val()) {
      $(this).attr('data-target', '#each-goods-discount-box');
      require(['EGD_box'], function(EGD_box) {
        // 1. 检查设置折扣弹窗是否有数据，无则根据商品id添加页面数据
        if ($('#each-goods-discount-box table.select_goods_list tr').size() === 0) {
          EGD_box.showToEGDBoxFromGoodsBox();
        } else {
          EGD_box.editEGDBoxFromGoodsBox();
        }
      });
    } else {
      layer.msg('只有在选择 “指定商品参加” 且 设置一个以上商品 时才能设置分别打折');
    }
  });

  /* -- 限价活动 按商品设置限价 -- */
  $parent.find('#fixed-price-promotions #set_each_goods_fixed_price').on('click', function() {
    $(this).attr('data-target', '#undefined_ll');
    if ($('#fixed-price-promotions select[name=type]').val() === '1' &&
      $('#much_select_goods input[name=__goodsIds]').val()) {
      $(this).attr('data-target', '#each-goods-fixed-price-box');
      require(['EGFP_box'], function(EGFP_box) {
        // 1. 检查设置折扣弹窗是否有数据，无则根据商品id添加页面数据
        if ($('#each-goods-fixed-price-box table.select_goods_list tr').size() === 0) {
          EGFP_box.showToEGFPBoxFromGoodsBox();
        } else {
          EGFP_box.editEGFPBoxFromGoodsBox();
        }
      });
    } else {
      layer.msg('只有在选择 “指定商品参加” 且 设置一个以上商品 时才能设置分别限价');
    }
  });

  /* -- 团购活动 -- */
  // 拼团价格
  $parent.find('#group-booking-promotions select[name=rule_type]').on('change', function() {
    var $div = $parent.find('#group-booking-promotions #group_price_div').children('div');
    var rule_type = parseInt($(this).val());
    $div.hide();
    $div.eq(rule_type - 1).show();
  });

  // 拼团时效
  $parent.find('#group-booking-promotions select[name=group_live_time]').on('change', function() {
    var group_live_time = parseInt($(this).val());
    var $div = $parent.find('#group-booking-promotions #group_live_time_div').children('div');
    $div.hide();
    if (group_live_time === -1) {
      $div.eq(1).prop('style', 'display: inline-table');
    } else {
      $div.eq(0).prop('style', 'display: inline-table');
    }
  });

  // 按商品设置团购价
  $parent.find('#group-booking-promotions #set_group_booking_price_button').on('click', function() {
    $(this).attr('data-target', '#undefined_ll');
    var $tp = $('#group-booking-promotions');
    if ($tp.find('select[name=type]').val() !== '1' ||
      !/.*\d+.*/.test($('#much_select_goods input[name=__goodsIds]').val())) {
      layer.msg('只有设置指定商品参加才能根据商品设置拼团价');
      return;
    }

    $(this).attr('data-target', '#group_booking_price_box');

    require(['GBP_box'], function(GBP_box) {
      if ($('#group_booking_price_box table.selected_goods_list tr').size() === 0) {
        GBP_box.show_to_GBPBox();
      } else {
        GBP_box.edit_to_GBPBox();
      }
    });
  });

  // 按商品设置团购折扣
  $parent.find('#group-booking-promotions #set_group_booking_discount_button').on('click', function() {
    $(this).attr('data-target', '#undefined_ll');
    var $tp = $('#group-booking-promotions');
    if ($tp.find('select[name=type]').val() !== '1' ||
      !/.*\d+.*/.test($('#much_select_goods input[name=__goodsIds]').val())) {
      layer.msg('只有设置指定商品参加才能根据商品设置拼团折扣');
      return;
    }

    $(this).attr('data-target', '#group_booking_discount_box');

    require(['GBD_box'], function(GBD_box) {
      if ($('#group_booking_discount_box table.selected_goods_list tr').size() === 0) {
        GBD_box.show_to_GBDBox();
      } else {
        GBD_box.edit_to_GBDBox();
      }
    });
  });

  // 数量

  // 有效期
  $('input[name=validity_type]').on('click', function() {
    var $dayOfMonth = $('#dayOfMonth');
    var $dayOfWeek = $('#dayOfWeek table').parent();
    switch ($(this).val()) {
      case '1':
        $dayOfMonth.hide();
        $dayOfWeek.hide();
        break;
      case '2':
        $dayOfMonth.show();
        $dayOfWeek.hide();
        break;
      case '3':
        $dayOfMonth.hide();
        $dayOfWeek.show();
        break;
    }
  });

  $('.odd_day').on('click', function() {
    $('input[name=work-date-month]').filter('.odd').parent().checkbox().checkbox('check');
    $('input[name=work-date-month]').filter('.even').parent().checkbox().checkbox('uncheck');
  });

  $('.even_day').on('click', function() {
    $('input[name=work-date-month]').filter('.even').parent().checkbox().checkbox('check');
    $('input[name=work-date-month]').filter('.odd').parent().checkbox().checkbox('uncheck');
  });

  $('.optional_day').on('click', function() {
    $('input[name=work-date-month]').parent().checkbox().checkbox('uncheck');
  });

  // 是否首单

  // 订单类型

  // 适用门店
  $('input[name=apply_store]').on('click', function() {
    var value = $('input[name=apply_store]:checked').val();
    switch (parseInt(value)) {
      case -1:
        $('input[name=order_type]').prop('disabled', false);
        $('input[name=order_type]').prop('checked', true);
        break;
      case 2:
        $('input[name=order_type][value="200"]').prop('checked', false);
        $('input[name=order_type][value="200"]').prop('disabled', true);
        break;
      case 1:
        $('input[name=order_type][value="200"]').prop('checked', false);
        $('input[name=order_type][value="200"]').prop('disabled', true);
        break;
    }
  });
}

//初始化创建页面的事件（第二页）
function activityNewEvent(activity, utils) {

  activity.getMemberSignInfo(utils);
  activity.getMemberSignGroupInfo(utils);
  activity.get_vip_member_list();
  activity.getAllStore();

  formatDate();
  var today_ = new Date();
  $('input[name=start_time]').val(today_.format('yyyy-MM-dd hh:mm'));
  $('input[name=end_time]').val(today_.format('yyyy-MM-dd') + ' 23:59');
  $('input[name=startTime]').val(today_.format('yyyy-MM-dd hh:mm'));
  $('input[name=endTime]').val(today_.format('yyyy-MM-dd') + ' 23:59');

  changeKey();
  if (getQueryString('promotionsType') == '99' && getQueryString('ruleType') == '99' &&
    getQueryString('op') == 'edit') {
    activity.showOtherLinkDataToPage(getQueryString('activityId').toString());
    $('#send_activity_ok_issue').html('编辑保存');
  } else if (getQueryString('promotionsType') == '99' && getQueryString('ruleType') == '99' &&
    getQueryString('op') == 'copy') {
    activity.showOtherLinkDataToPage(getQueryString('activityId').toString());
    $('#send_activity_ok_issue').html('复制保存');
  }

  $('#send_activity_ok_issue').on('click', function() {
    if ($(this).html() == '确认发放') {
      activity.create_();
    } else if ($(this).html() == '编辑保存') {
      activity.edit_otherLink();
    } else if ($(this).html() == '复制保存') {
      activity.create_();
    }

  });

  $('input[type=radio][name=active_center]').on('change', function() {
    if ($(this).val() == 0) {
      $('#promotionsMouldDiv').hide();
    } else {
      $('#promotionsMouldDiv').show();
    }
  });

  $('input[type=radio][name=sendObj]').on('change', function() {
    if ($(this).val() == 0) {
      $('.user_check_members').hide();
      $('.direct_user_check_members').hide();
      $('#show_active_obj').hide();
    } else if ($(this).val() == 1) {
      $('.direct_user_check_members').hide();
      $('.user_check_members').show();
      $('.user_check_members_group').hide();
      $('#show_active_obj').hide();
      $('#show_active_obj_group').hide();
    }
    else if ($(this).val() == 3) {
      $('#show_active_obj').hide();
      $('.user_check_members').hide();
      $('.direct_user_check_members').hide();
      $('.user_check_members_group').show();
      $('#show_active_obj_group').hide();
    } else {
      $('.user_check_members_group').hide();
      $('.user_check_members').hide();
      $('#show_active_obj').hide();
      $('#show_active_obj_group').hide();
      $('.direct_user_check_members').show();
    }
  });

  $('input[type=radio][name=isTopicPromotions]').on('change', function() {
    if ($(this).val() == 0) {
      $('#topicActivityDiv').hide();
    } else {
      $('#topicActivityDiv').show();
    }
  });

  $('input[type=radio][name=active_type]').on('change', function() {
    if ($(this).val() == 0) {
      $('#add_coupon_list').show();

    } else {
      $('#add_coupon_list').hide();
      $('#promitonsDetail').hide();
    }
    if ($(this).val() == 1) {
      $('#linkweb').show();
      $('#add_coupon_link').show();
    } else {
      $('#linkweb').hide();
      $('#add_coupon_link').hide();
    }
  });

  $('#add_coupon_list').on('click', function() {
    $('#coupon_list').modal('show');
  });

  $('.select-coupon-ok-btn').on('click', function() {
    var rulesVal = $('#rules_val').val();
    if (rulesVal == '' || rulesVal.indexOf('undefined') != -1) {
      layer.msg('添加优惠活动失败');
      return;
    }
    $('#coupon_list').modal('hide');
  });

  /**
   * 标签组添加事件
   */
  $('.main-item-a').live('click', function() {
    var data = {};
    data.id = $(this).attr('id');
    data.crowdName = $(this).text();
    if (!$('[name="sign-member-b-input"][value="' + data.id + '"]').val()) {

      if ($('#send_obj_members')) {
        var ss = $('#send_obj_members').val();
        ss += data.id + ',';
        $('#send_obj_members').val(ss);
      }
      $(this).css('background-color', 'green');
      var tmpl = '<a href=\'#\' data-empty-msg="' + data.crowdName + '"  data-id = "' + data.id +
        '" class=\'main-item main-item-b\' id="' + data.id + '">' + data.crowdName +
        '<input type="hidden" name="sign-member-b-input" value="' + data.id +
        '"><span class="close-item close-item-a">×</span></a> ';
      $('#content-box-main_b').append(tmpl);
    } else {
      layer.msg('该标签已被选择！');
    }
  });

  /**
   * 标签库添加事件
   */
  $('.main-item-a-group').live('click', function() {
    var data = {};
    data.labelName = $(this).attr('id');
    if (!$('[name="sign-member-b-input_group"][value="' + data.labelName + '"]').val()) {
      if ($('#send_obj_members_group')) {
        var ss = $('#send_obj_members_group').val();
        ss += data.labelName + ',';
        $('#send_obj_members_group').val(ss);
      }
      $(this).css('background-color', 'green');
      var tmpl = '<a href=\'#\' data-empty-msg="' + data.labelName + '"  data-labelName = "' + data.labelName +
        '" class=\'main-item main-item-b_group\' id="' + data.labelName + '">' + data.labelName +
        '<input type="hidden" name="sign-member-b-input_group" value="' + data.labelName +
        '"><span class="close-item close-item-a_group">×</span></a> ';
      $('#content-box-main_b_group').append(tmpl);
    } else {
      layer.msg('该标签已被选择！');
    }
  });

  /**
   * 标签组移除事件
   */
  $('.close-item-a').live('click', function() {
    $(this).parents('.main-item-b').remove();

    var ss = $('#send_obj_members').val();
    if (ss != undefined) {
      var members_id = ss.split(',');
      var memberId = $(this).parent().attr('data-id');

      var index = $.inArray(memberId, members_id);
      if (index != -1) {
        members_id.splice(jQuery.inArray(memberId, members_id), 1);
        $('#send_obj_members').val(members_id.toString());
      }
    }

    $('[name="sign-member-a-input"][value="' + $(this).parent().attr('data-id') + '"]').
      parent().
      css('background-color', '#169bd5');

  });

  /**
   * 标签库移除事件
   */
  $('.close-item-a_group').live('click', function() {
    $(this).parents('.main-item-b_group').remove();

    var ss = $('#send_obj_members_group').val();
    if (ss != undefined) {
      var labelName = ss.split(',');
      for (var i = 0; i < labelName.length; i++) {
        if (labelName[i] == $(this).parents('.main-item-b_group').attr('id')) {
          labelName.splice(i, 1);
        }
      }
      $('#send_obj_members_group').val(labelName);
    }

    $('[name="sign-member-a-input_group"][value="' + $(this).parents('.main-item-b_group').attr('id') + '"]').
      parent().
      css('background-color', '#169bd5');
  });

  /**
   * 商品标签确认按钮
   */
  $('.select-sign-members-ok').on('click', function() {
    var members_id = '';
    var members_title = '';
    $('#content-box-main_b a').each(function() {
      members_id += $(this).attr('data-id') + ',';
      members_title += '<a href=\'#\'  class=\'main-item main-item-a\'>' + $(this).attr('data-empty-msg') + '</a> ';
    });

    members_id = members_id.substr(0, members_id.length - 1);

    if (members_id) {
      $('#send_obj_members').val(members_id);
      $('#select_sign_member').modal('hide');
      $('#send_obj_info').html('');
      $('#send_obj_info').append(members_title);
      $('#show_active_obj').show();
    } else {
      layer.msg('请选择至少一个标签 ！');
    }

  });

  /**
   * 商品标签组确认按钮
   */
  $('.select-sign-members-ok_group').on('click', function() {
    var members_id = '';
    var members_title = '';
    $('#content-box-main_b_group a').each(function() {
      members_id += $(this).attr('id') + ',';
      members_title += '<a href=\'#\'  class=\'main-item main-item-a_group\'>' + $(this).attr('data-empty-msg') +
        '</a> ';
    });

    members_id = members_id.substr(0, members_id.length - 1);

    if (members_id) {
      $('#send_obj_members_group').val(members_id);
      $('#select_sign_group_member').modal('hide');
      $('#send_obj_group_info').html('');
      $('#send_obj_group_info').append(members_title);
      $('#show_active_obj_group').show();
    } else {
      layer.msg('请选择至少一个标签 ！');
    }

  });

  /**
   * 自定义会员添加
   */
  $('.select_direct_member_btn').live('click', function() {
    var data = {};
    data.memberId = $(this).parent().find('[name="memberId"]').val();
    data.mobile = $(this).parent().find('[name="mobile"]').val();
    data.storName = $(this).parent().find('[name="storName"]').val();
    data.registerTime = $(this).parent().find('[name="registerTime"]').val();
    data.ban_status = $(this).parent().find('[name="ban_status"]').parent().val();
    if (!$('.select_member_list [name="memberId"][value="' + data.memberId + '"]').val()) {
      if ($('#send_obj_members_direct')) {
        var ss = $('#send_obj_members_direct').val();
        ss += data.memberId + ',';
        $('#send_obj_members_direct').val(ss);
      }

      var tmpl = document.getElementById('coupon_select_members_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('.select_member_list').append(doTtmpl(data));
    } else {
      layer.msg('该会员已在选取列表！');
    }

  });

  /**
   * 自定义会员移除
   */
  $('.unselect_members_btn').live('click', function() {
    $(this).parents('.can_del_tr').remove();
    var ss = $('#send_obj_members_direct').val();
    if (ss != undefined) {
      var members = ss.split(',');
      var memberId = $(this).parent().find('input[name=memberId]').val();

      var index = $.inArray(memberId, members);
      if (index != -1) {
        members.splice(jQuery.inArray(memberId, members), 1);
        $('#send_obj_members_direct').val(members.toString());
      }
    }
  });

  //活动搜索会员确认按钮
  $('.search_much_members_btn').on('click', function() {
    activity.pageno = 1;
    activity.get_vip_member_list();
  });

  /**
   * 会员确认按钮
   */
  $('.select-members-ok').live('click', function() {
    var members_id = '';
    $('.select_member_list input[name=\'memberId\']').each(function() {
      members_id += $(this).val() + ',';
    });

    members_id = members_id.substr(0, members_id.length - 1);

    if (members_id) {
      $('#send_obj_members_direct').val(members_id.toString());
      $('#direct_check_user_members').modal('hide');
    } else {
      layer.msg('请至少选择一个会员 ！');
    }
  });

  $('#uploadMember').on('click', function() {
    activity.uploadMember();
  });

  $(document).on('click', '.check_import', function() {
    if ($.trim($('#member_list').html()) != '') {
      var str = $('#send_obj_members_direct').val();
      if (str != '') {
        $('#send_obj_members_direct').val(str);
        $('#direct_check_user_members').modal('hide');
        layer.msg('批量导入成功！');
        to_sure_reissure_activity();
      } else {
        layer.msg('保存失败，没有可成功导入的会员');
      }
    } else {
      layer.msg('请不要导入空的模板');
    }
  });

  //图标上传
  $('input[type=file]').live('change', function(evt) {
    if ($(this).attr('id') == 'input_file_C') {
      return;
    }
    var r = $(this).parent().children().eq(0).attr('id');
    console.log(r);
    activity.upLoadPic(evt, this, r);

  });

  //富文本点击上传事件
  $('#input_file_C').live('change', function uploadImg(evt) {
    var param = {};
    var files = evt.target.files;
    var formData = new FormData();
    formData.append('file', files[0]);
    $.ajax({
      url: '/common/localpictureUpload',
      type: 'POST',
      data: formData,
      success: function(data) {
        var tips = '<img src="http://jkosshash.oss-cn-shanghai.aliyuncs.com//' + data.image.md5Key + '.jpg">';
        console.log(editor.html());
        editor.html(editor.html() + tips);
        $('#upload_C').attr('class', 'sui-modal hide');
        layer.msg('上传成功');
      },
      error: function(data) {
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  });

}

//活动发放列表
function promotionsSendManager() {
  require(['modelActivity'], function(modelActivity) {
    var action_url = '/merchant/promotions/promotionsActivityList';
    modelActivity.getSendCouponList(action_url);
  });
  activityManagerEvent();
}

//为模板主页加载已经创建的模板信息
function findPromotionsTemplateInfo2Page() {
  require(['utils', 'core'], function(utils, core) {
    var params = new Array();
    var count = 0;
    $('.promotionsType').each(function() {
      var promotionsType = $(this).val();
      $(this).nextAll().each(function() {
        var rule_type = $(this).find('.ruleType').eq(0).val();
        if (rule_type) {
          params[count] = {};
          params[count].promotionsType = promotionsType;
          params[count++].ruleType = rule_type;
        }
      });
    });
    var obj = {};
    obj.params = params;
    var url = 'promotions/rule/getReleasePromotionsNumAndGoodsNum';
    console.log(obj);
    utils.doGetOrPostOrJson(url, obj, 'json', true, function(data) {
      console.log(data.value);
      var list = data.value;
      for (var i = 0; i < list.length; i++) {
        var promotionsType = list[i].promotionsType;
        var ruleType = list[i].ruleType;
        var releaseRule = list[i].releaseRule;
        var goodsInRule = list[i].goodsInRule;
        var $info = $('#info_' + promotionsType + '_' + ruleType);
        $info.find('span').eq(0).html(releaseRule);
        $info.find('span').eq(1).html(goodsInRule);
      }
    });
  });
}

//给模板的小块加点击事件
function addSomeTemplateClick() {
  require(['core'], function(core) {
    $('.inner-box').hover(
      function() {
        $(this).find('.shadow').eq(0).stop().fadeTo('slow', 1, function() {
          $(this).find('.shadow').eq(0).css('display', 'block');
        });
      },
      function() {
        $(this).find('.shadow').eq(0).stop().fadeTo('slow', 0, function() {
          $(this).find('.shadow').eq(0).css('display', 'none');
        });
      });
    var url = '/merchant/promotions/templateNew';
    $('.wold-inner').each(function() {
      var $parent = $(this).parent().parent();
      var rule_type = $parent.find('.ruleType').eq(0).val();
      var promotion_type = $parent.parent().find('.promotionsType').eq(0).val();

      if (rule_type == 99 && promotion_type == 99) {
        var newUrl = '/merchant/promotions/outLink?mark=otherLink';
        $(this).on('click', function() {
          window.location.href = core.getHost() + newUrl;
        });
        return true;
      }

      if (rule_type && promotion_type) {
        $(this).on('click', function() {
          window.location.href = core.getHost() + url + '?promotionsType=' + promotion_type + '&ruleType=' + rule_type;
        });
      }
    });
  });
}

//活动详情的事件绑定
function activityDetailEvent(core, modelActivity, modelRule) {

  $('select[name=__goodsIdsType]').on('change', function() {
    var selectedValue = $(this).val();

    if (selectedValue == '0') {
      $('#much_select_goods_container').hide();
    } else {
      $('#much_select_goods_container').show();
    }
  });

  //复制活动
  $('#copy_promotions_rule').live('click', function() {
    var activityId = $('input[name=activity_id]').val();
    var promotions_type = $('input[name=promotions_type]').val();
    if (typeof($('input[name=active_link]').val()) == 'undefined' || $('input[name=active_link]').val() == '') {
      if (promotions_type == 30 || promotions_type == 50 || promotions_type == 10 || promotions_type == 60) {
        var rule_type = $('input[name=ruleType]').val();
      } else if (promotions_type == 20) {
        var rule_type;
        if ($('input[name=rule_type]').val() == 1 || $('input[name=rule_type]').val() == 5) {
          rule_type = 15;
        } else if ($('input[name=rule_type]').val() == 3 || $('input[name=rule_type]').val() == 4) {
          rule_type = 34;
        } else {
          rule_type = 2;
        }
      } else {
        rule_type = $('input[name=rule_type]').val();
      }
      location.href = core.getHost() + '/merchant/promotions/templateNew?promotionsType='
        + promotions_type + '&ruleType=' + rule_type + '&activityId=' + activityId + '&op=copy';
    } else {
      location.href = core.getHost() + '/merchant/promotions/outLink?promotionsType='
        + 99 + '&ruleType=' + 99 + '&activityId=' + activityId + '&op=edit&mark=otherLink';
    }
  });

  $('#goodsModifyModal .data-ok').live('click', function() {
    var obj = {};

    var $parent = $('#goodsModifyModal');
    var goodsIdsType = parseInt($parent.find('select[name=__goodsIdsType]').val());
    obj.goodsIdsType = goodsIdsType;
    if (goodsIdsType) {
      var goodsIds = $('#much_select_goods').find('input[name=__goodsIds]').val();
      if (!goodsIds) {
        layer.msg('请先选择商品');
        return;
      }
      obj.goodsIds = goodsIds;
    } else {
      obj.goodsIds = 'all';
    }

    var url = 'promotions/rule/editPromotionsRuleOneField';
    var params = {};
    params.ruleId = parseInt($('#id').html());
    params.field = 'goods';
    params.goods = JSON.stringify(obj);

    doGetOrPostOrJson(url, params, 'post', false, function(data) {
      if (data && data.code && data.code === '000') {
        location.reload();
      } else {
        layer.msg('修改失败');
        console.log(data);
      }
    });
  });

  //包邮地区弹框
  $(document).delegate('#express', 'click', function(e) {
    var ids = $('#areaIds').html();
    var url = core.getHost() + '/common/queryAreaByTree';
    $.post(url, 'areaIds=' + ids, function(data) {
      if (data.code == '000') {
        $('#tree').treeview({data: data.data, levels: 0});
      }
    });
  });

  /*$(document).delegate('#show_gift_goods', 'click', function(e) {
    console.log($(this).attr('data-value'));
    var goodsList = JSON.parse(decodeURIComponent($(this).attr('data-value')));
    var goodsStr = '';
    $('#selected_gift').html('您已选择 <span style=\'color: red\'>' + goodsList.length + '</span> 个赠品：');
    for (var item = 0; item < goodsList.length; item++) {
      var price = goodsList[item].shop_price == 0 ? 0 : goodsList[item].shop_price;
      goodsStr += '<tr><td>' + goodsList[item].goods_title + '</td><td>' + price / 100 + '</td><td>' +
        goodsList[item].sendNum + '</td><tr>';
    }
    $('#gift_list').html(goodsStr);

  });*/

  $(document).delegate('#show_store', 'click', function(e) {
    console.log($(this).attr('data-value'));
    var storeList = JSON.parse(decodeURIComponent($(this).attr('data-value')));
    //偶发性解析出来的是字符串而不是数组
    if (!(storeList instanceof Array)) {
      storeList = JSON.parse(storeList);
    }
    var storeStr = '';
    var support1 = '送货上门';
    var support2 = '门店自提';
    var support3 = '送货上门,门店自提';

    $('#selected_store').html('您已选择 <span style=\'color: red\'>' + storeList.length + '</span> 家门店：');
    for (var item = 0; item < storeList.length; item++) {
      console.log(storeList[item].serviceSupport);
      if (!storeList[item].service_support_str) {
        switch (storeList[item].serviceSupport) {
          case '150':
            storeList[item].serviceSupport = support1;
            break;
          case '160':
            storeList[item].serviceSupport = support2;
            break;
          case '150,160':
            storeList[item].serviceSupport = support3;
            break;
          case '160,150':
            storeList[item].serviceSupport = support3;
            break;
          case '':
            storeList[item].serviceSupport = '---';
            break;
          case undefined:
            storeList[item].serviceSupport = '---';
            break;
        }
      }
      storeStr += '<tr><td>' + storeList[item].storesNumber + '</td><td>' + storeList[item].name + '</td><td>'
        + storeList[item].serviceSupport + '</td></tr>';

    }
    $('#store_list_promotions').html(storeStr);

  });
  //编辑
  $('#edit_activity').live('click', function() {
    var activityId = $('input[name=activity_id]').val();
    var promotions_type = $('input[name=promotions_type]').val();
    if (typeof($('input[name=active_link]').val()) == 'undefined' || $('input[name=active_link]').val() == '') {
      if (promotions_type == 30 || promotions_type == 50 || promotions_type == 10 || promotions_type == 60) {
        var rule_type = $('input[name=ruleType]').val();
      } else if (promotions_type == 20) {
        var rule_type;
        if ($('input[name=rule_type]').val() == 1 || $('input[name=rule_type]').val() == 5) {
          rule_type = 15;
        } else if ($('input[name=rule_type]').val() == 3 || $('input[name=rule_type]').val() == 4) {
          rule_type = 34;
        } else {
          rule_type = 2;
        }
      } else {
        rule_type = $('input[name=rule_type]').val();
      }
      location.href = core.getHost() + '/merchant/promotions/templateNew?promotionsType='
        + promotions_type + '&ruleType=' + rule_type + '&activityId=' + activityId + '&op=edit';
    } else {
      location.href = core.getHost() + '/merchant/promotions/outLink?promotionsType='
        + 99 + '&ruleType=' + 99 + '&activityId=' + activityId + '&op=edit&mark=otherLink';
    }
  });

  //延长有效期
  $('#validity_day_append_save').live('click', function() {
    update_amount_validity(core);
  });

  //将待发布改为发布中
  $('#send_activity').live('click', function() {
    console.log('确认发布');
    modelActivity.sendActivity();
  });

  //结束该活动
  $('#stop_activity .stop_activity').live('click', function() {
    console.log('结束该活动');
    modelActivity.stopPromotionsRule(modelRule);
    modelActivity.stopActivity();
  });
}

function activityDetailOutLink() {
  rightMenu();
  require(['core', 'modelActivity', 'modelRule', 'utils'],
    function(core, modelActivity, modelRule, utils) {
      var id = (core.getUrlParam('id'));
      console.log('id-->' + id);
      $('.list').append('<input type="hidden" name="edit_id" id="edit_id" value="' + id + '"/>');
      modelActivity.show_otherLink(modelRule, utils, core);
      modelActivity.changePromotionsActivityDetailButtons();
      modelActivity.changePromotionsActivityDetailRightSide();
      activityDetailEvent(core, modelActivity, modelRule);
    });
}

//活动发放列表发放数量相关
function activityManagerEvent() {
  require(['modelActivity'], function(modelActivity) {
    console.log(modelActivity);
    var action_url = '/merchant/promotions/promotionsActivityList';
    $('#send_manager_brn').on('click', function() {
      modelActivity.pageno = 1;
      modelActivity.getSendCouponList(action_url);
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        modelActivity.getSendCouponList(action_url);
      }
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      modelActivity.pageno = 1;
      modelActivity.cur_per_page = $(this).val();
      modelActivity.getSendCouponList(action_url);
    });
  });
}

//延长有效期
function update_amount_validity(core) {
  var params = {};

  //params.ruleId = core.getUrlParam('id')
  var flag = $('input[name=isRelease]').val();
  if (flag == true) {
    layer.msg('活动正在发布，不可修改！');
    return;
  }
  params.ruleId = $('input[name=promotionsRuleId]').val();
  params.ruleType = 2;
  params.act_id = $('input[name=activity_id]').val();
  params.dayNum = $('input[name="validity_day_append"]').val() ? $('input[name="validity_day_append"]').val() : 0;
  var g = new RegExp(/^[0-9]{1}[0-9]*$/);
  if (!g.test(params.dayNum)) {

    layer.msg('追加错误，请输入有效天数');
    return;
  }

  if (params.dayNum > 3600) {
    layer.msg('有效期追加最多为3600天，请重新输入');
    return;
  }

  if (params.amount > 0 || params.dayNum > 0) {
    layer.open({
      type: 3,
      content: '<div class="sui-loading loading-inline"><i class="sui-icon icon-pc-loading"></i></div>',
    });
    var url = core.getHost() + '/merchant/promotions/prolongPromValidity';
    $.post(url, params, function(e) {
      if (e.code == '000') {
        layer.msg('修改成功');
        window.location.reload();
      } else {
        layer.msg('修改失败');
      }
    });
  }

}

//右侧列表选中
function rightMenu() {
  $('.expmenu').find('.active').removeClass('active');
  $('li:contains(活动管理)').
    eq(0).
    addClass('active').
    find('a[href=\'/merchant/promotions/promotionsSendManager\']').
    parent().
    addClass('active');
}

//选择文件事件
function file_change(name) {
  $('#file_name').val(name);
}

//创建、复制、修改相关判断
function createOrEditOrCopy(modelActivity, core) {
  var activityId = core.getUrlParam('activityId');
  var op = core.getUrlParam('op');

  if (activityId) {
    if (op === 'edit') {
      $('#send_activity_ok').html('编辑保存');
      var result = modelActivity.showDataToPage(activityId);
      if (result) {
        layer.msg(result);
        return;
      } else {
        console.log('modelActivity.showDataToPage(' + activityId + ')，成功。。。。。。。。。。。');
      }

      $('#promotions_activity_form').validate({
        success: function() {
          modelActivity.edit_();
          return false;
        },
      });
    } else if (op === 'copy') {
      modelActivity.showDataToPage(activityId);

      $('#promotions_activity_form').validate({
        success: function() {
          modelActivity.create_();
          return false;
        },
      });
    } else {
      layer.msg('error on op');
    }
  } else {
    $('#promotions_activity_form').validate({
      success: function() {
        modelActivity.create_();
        return false;
      },
    });

    // 时间相关初始化
    core.formatDate();
    var today_ = new Date();
    $('input[name=start_time]').val(today_.format('yyyy-MM-dd hh:mm'));
    $('input[name=end_time]').val(today_.format('yyyy-MM-dd') + ' 23:59');
    $('input[name=startTime]').val(today_.format('yyyy-MM-dd hh:mm'));
    $('input[name=endTime]').val(today_.format('yyyy-MM-dd') + ' 23:59');
  }
}

//表单验证
function checkMyPageData(modelRule, some_box) {
  $('#promotions_rule_form').validate({
    success: function() {
      modelRule.validate(some_box);
      return false;
    },
  });
}

function changeKey() {
  if ($('#control_window1').is(':checked')) {
    $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled');
  }

  if ($('#control_window2').is(':checked')) {
    $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked');
  }

  $('#control_window1').live('click', function() {
    if ($('#control_window1').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled');
    }

    if ($('#control_window2').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked');
    }
  });

  $('#control_window2').live('click', function() {
    if ($('#control_window1').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('checked').attr('disabled', 'disabled');
    }

    if ($('#control_window2').is(':checked')) {
      $('input[name=isTopicPromotions]').eq(0).removeAttr('disabled').attr('checked');
    }
  });
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function limitedPriceEvent() {
  if (getQueryString('promotionsType') == 50) {
    var ss = 2;
    $('input[name=is_independent][value=' + ss + ']').attr('disabled', 'disabled');
  }
}

function groupBookingEvent() {
  if (getQueryString('promotionsType') == 60) {
    var ss = 2;
    var con = 1;
    $('input[name=is_first_order][value=' + ss + ']').attr('disabled', 'disabled');
    $('input[name=is_independent][value=' + ss + ']').attr('disabled', 'disabled');
    $('input[name=can_use_coupon][value=' + con + ']').attr('disabled', 'disabled');
  }
}

function GiftPromotionsEvent() {
  if (getQueryString('promotionsType') == 10) {
    $('#cpu').hide();
    $('#cpu2').attr('checked', true).hide();
  }
}

function GiftPromotionsEvent2() {
  if (getQueryString('promotionsType') == 10) {
    $('#cpu').show();
    $('#cpu2').attr('checked', true).show();
  }
}

function formatDate() {
  Date.prototype.format = function(format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    if (!format) {
      format = 'yyyy-MM-dd hh:mm:ss';
    }
    var o = {
      'M+': this.getMonth() + 1, /* month*/
      'd+': this.getDate(), /* day*/
      'h+': this.getHours(), /* hour*/
      'm+': this.getMinutes(), /* minute*/
      's+': this.getSeconds(), /* second*/
      'q+': Math.floor((this.getMonth() + 3) / 3), /* quarter*/
      'S': this.getMilliseconds(),

    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return format;
  };

}

