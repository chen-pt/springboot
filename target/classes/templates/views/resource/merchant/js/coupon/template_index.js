/**
 * Created by Administrator on 2017/10/25.
 */
!(function() {

  // 初始化一些地址定义
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'utils': 'merchant/js/coupon/ll_utils',
      'uploadify': 'merchant/js/lib/uploadify/jquery.uploadify.min',
      'coupon': 'merchant/js/coupon/coupon',
      'coupon_template': 'merchant/js/coupon/coupon_template',
      'coupon_new': 'merchant/js/coupon/coupon_new',
      'coupon_manager': 'merchant/js/coupon/coupon_manager',
      'coupon_detail': 'merchant/js/coupon/coupon_detail',
      'coupon_use': 'merchant/js/coupon/coupon_use',
      'goods_box': 'merchant/js/coupon/common/goods_box',
      'gift_box': 'merchant/js/coupon/common/gift_box',
      'gift_box2': 'merchant/js/coupon/common/gift_box_2',
      'area_box': 'merchant/js/coupon/common/area_box',
      'store_box': 'merchant/js/coupon/common/store_box',
      'activity': 'merchant/js/coupon/activity',
      'category_choose': 'public/product/categoryChoose',
      'vue': 'public/vue',
    },
  });

  // 使用core.js 初始化一些东西
  require(['core'], function(core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();
  });

  // 定义
  var router = {
    'merchant': {
      'couponNewProcess': initCouponTemplateProcess,
      'couponSendProcess': initCouponSendProcess,
      'couponTemplate': initCouponTemplate,
      'couponListManager': couponListManager,
      'activityManager': initSendCouponManager,
    },
  };

  require(['core'], function(ybzf) {
    var controllerAction = ybzf.getControllerAction();
    var controller = controllerAction[0];
    var action = controllerAction[1];
    router[controller][action]();
  });
})();

const sourceMap = new Map([
  [$('#area_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/area_box.html'],
  [$('#goods_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/goods_box.html'],
  [$('#gift_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/gift_box.html'],
  [$('#gift_popup_box2_html'), '/templates/views/resource/merchant/js/coupon/common/gift_box_2.html'],
  [$('#store_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/store_box.html'],
]);

/**
 * 发送优惠券管理
 */
function initSendCouponManager() {
  require(['activity'], function(activity) {
    var action_url = '/merchant/couponActivityList';
    activity.getSendCouponList(action_url);
  });
  activityManagerEvent();
}

/**
 * 优惠券管理
 */
function couponListManager() {
  var action_url = '/merchant/couponRuleList';
  require(['coupon_manager'], function(coupon_manager) {
    coupon_manager.getCouponList(action_url);
  });

  couponManagerEvent(action_url);
}

function activityManagerEvent() {
  require(['activity'], function(activity) {
    var action_url = '/merchant/couponActivityList';
    $('#send_manager_brn').on('click', function() {
      activity.pageno = 1;
      activity.getSendCouponList(action_url);
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        activity.getSendCouponList(action_url);
      }
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      activity.pageno = 1;
      activity.cur_per_page = $(this).val();
      activity.getSendCouponList(action_url);
    });
  });
}

/**
 * 优惠券管理事件绑定
 */
function couponManagerEvent(action_url) {
  require(['coupon_manager'], function(coupon_manager) {
    $('#coupon_search').on('click', function() {
      coupon_manager.pageno = 1;
      coupon_manager.getCouponList(action_url);
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        coupon_manager.getCouponList(action_url);
      }
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      coupon_manager.pageno = 1;
      coupon_manager.cur_per_page = $(this).val();
      coupon_manager.getCouponList(action_url);
    });

    $('#coupon_table').delegate('.promotions_code_offline', 'click', function() {
      var ruleId = parseInt($(this).parent().find('input[name=id]').val());
      var resp = export_(ruleId);
      resp.value.ruleId = ruleId;
      var list = resp.value;
      console.log('debug');
      console.log(list);
      var params = $(this).parent().parent().find('td').eq(1).text();
      var data = {resp: resp, params: params, ruleId: ruleId};

      var tmpl = document.getElementById('export-dialog-context').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('#modal_body').html(doTtmpl(data));

      var tmpl = document.getElementById('bbb').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('#export_coupon_history_log').html(doTtmpl(list));

      $('#export-dialog').modal('show');
      $('#aaa').attr('style', 'display:none');
    });

    $('#export-dialog').delegate('.close-export-dialog', 'click', function() {
      $('#export-dialog').modal('hide');
    });

    $('#export-dialog').delegate('#export-dialog-show-history', 'click', function() {
      $('#aaa').show();
      $('#remark a').text('收起导出记录');
      $('#remark a').addClass('hide-history');
    });

    $('#export-dialog').delegate('.show-history', 'click', function() {
      $('#aaa').show();
      $('#remark a').text('收起导出记录');
      $('#remark a').addClass('hide-history');
      $('#remark a').removeClass('show-history');
    });

    $('#export-dialog').delegate('.hide-history', 'click', function() {
      $('#aaa').hide();
      $('#remark a').text('显示导出记录');
      $('#remark a').addClass('show-history');
      $('#remark a').removeClass('hide-history');
    });
  });
}

function initCouponTemplate() {
  couponTemplateEvent();
}

function initCouponTemplateProcess() {
  require(['core'], function(core) {
    loadModuleBeforeInit(core, () => {

      // ..... 各种事件绑定

      // ..... 各种弹窗初始化
      setRules();

      couponNewEvent();

      require([
          'core',
          'utils',
          'coupon_new',
          'goods_box',
          'gift_box',
          'gift_box2',
          'store_box',
          'area_box',
          'category_choose',
          'coupon_template'],
        function(
          core, utils, coupon_new, goods_box, gift_box, gift_box2, store_box, area_box, category_choose,
          coupon_template) {
          // 事件绑定
          goods_box.commonEvent();
          gift_box.commonEvent();
          gift_box2.commonEvent();
          store_box.commonEvent();
          area_box.commonEvent();
          // 加载几个弹窗的内容
          goods_box.show_goods_list();
          gift_box.show_gifts_list();
          store_box.show_store_list();
          area_box.showProvince();

          // 用来开启校验并确定保存的js
          $('#coupon_form').validate({
            success: function() {
              dontRepeatSubmit();
              $parent = $('#coupon_form');
              var action = $('#action').val();
              if (action == '0') {
                var url = '/merchant/couponSendProcess';
                coupon_template.create_(url);
                return false;
              } else {
                coupon_new.create_();
                return false;
              }
            },
          });

        });
    });
  });
}

function dontRepeatSubmit() {
  $('#coupon_send').on('click.a', function() {
    layer.msg('请不要重复提交');
  });
  $('#coupon_send').prop('type', 'button');
  $('#coupon_later').on('click.a', function() {
    layer.msg('请不要重复提交');
  });
  $('#coupon_later').prop('type', 'button');
  $('#coupon_send').attr('disabled', true);
  $('#coupon_later').attr('disabled', true);
}

function loadModuleBeforeInit(core, fn) {
  let promises = [];

  var router = {
    '100': {
      '4': '/templates/views/resource/merchant/js/coupon/module/100_4.html', // 立减 即 ruleType = 4
      '0': '/templates/views/resource/merchant/js/coupon/module/100_0.html', //
      '1': '/templates/views/resource/merchant/js/coupon/module/100_1.html' //
    },
    '200': {
      '4': '/templates/views/resource/merchant/js/coupon/module/200_4.html',
      '1': '/templates/views/resource/merchant/js/coupon/module/200_1.html',
      '5': '/templates/views/resource/merchant/js/coupon/module/200_5.html',
    },
    '300': {
      '3': '/templates/views/resource/merchant/js/coupon/module/300_3.html',
    },
    '500': {
      '2': '/templates/views/resource/merchant/js/coupon/module/500_2.html',
      '3': '/templates/views/resource/merchant/js/coupon/module/500_3.html',
    },
  };

  console.log('ruleNewLoadModule');

  /* -- 加载主体和对应规则 -- */
  var couponType = core.getUrlParam('couponType');
  var ruleType = core.getUrlParam('ruleType');
  if (couponType && ruleType) {
    let promise = ifExistThanLoad($('#coupon_rule_html'), router[couponType.toString()][ruleType.toString()]);
    if (promise)
      promises.push(promise);
  }

  /* -- 加载弹出框 -- */

  let map = new Map([
    [$('#area_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/area_box.html'],
    [$('#goods_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/goods_box.html'],
    [$('#gift_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/gift_box.html'],
    [$('#gift_popup_box2_html'), '/templates/views/resource/merchant/js/coupon/common/gift_box_2.html'],
    [$('#store_popup_box_html'), '/templates/views/resource/merchant/js/coupon/common/store_box.html'],
  ]);

  for (let [k, v] of map) {
    let promise = ifExistThanLoad(k, v);
    if (promise)
      promises.push(promise);
  }

  if (promises.length !== 0) {
    Promise.all(promises).then(() => fn());
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
      console.log(data);
      $position.append(data);
    });
}

var funs = {};

function ifExistThanLoad($div, url) {
  if ($div.size() === 1) {
    return appendPage($div, url);
  }
}

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
    if(value/1 == 0){
      return false;
    }
    return rule.test(value);
  };

  $.validate.setRule('money', money, '请输入符合金钱格式的数字，无符号，且优惠不能为0元');

  // 距离校验
  var distance = function(value, element, param) {
    var rule = /(^\d+$)/;
    return rule.test(value);
  };

  $.validate.setRule('distance', distance, '请输入非负整数数字');
}

function couponNewEvent() {
  console.log('couponNewEvent');
  var $parent = $('#coupon_form');
  require(['coupon_new', 'utils'], function(coupon_new, utils) {
    //处理模板券创建流程1中是否要隐藏
    if ('no' === utils.getCookie('is_hidden')) {
      $('#more_info').show();
      $('#more_btn a').html('隐藏更多条件');
    } else {
      $('#more_info').hide();
      $('#more_btn a').html('显示更多条件');
    }
    $('#more_btn').on('click', function() {
      if ($('#more_info').is(':hidden')) {
        $('#more_info').show();
        $('#more_btn a').html('隐藏更多条件');
        utils.setCookie('is_hidden', 'no', 30 * 12);

      } else {
        $('#more_info').hide();
        $('#more_btn a').html('显示更多条件');
        utils.setCookie('is_hidden', 'yes', 30 * 12);
      }
    });
    // 优惠标签

    // 优惠名称

    // 优惠类型
    $parent.find('#tab a').on('click', function() {
      var href = $(this).attr('href');
      if (!href.startsWith('#')) { // coupon和promotions的切换
        var params = 'promotionsType=' + href;
        var ruleName = $('input[name=ruleName]').val();
        var label = $('input[name=markedWords]').val();
        utils.setCookie('ruleName', ruleName, 1);
        utils.setCookie('label', label, 1);

        window.location.href = '/merchant/promotions/ruleNew?' + params;
      } else {
      }
    });

    /* -- 所有的 + 号事件 -- */
    $('input[name=_add]').live('click', function() {
      // 找到阶梯限制数
      var temp_str = $(this).parent().parent().nextAll('.sui-msg').eq(0).children('div').eq(0).html();
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

    /* -- 商品弹出框相关事件 -- */
    $parent.find('select[name=type]').on('change', function() {
      var selectedValue = parseInt($(this).val());
      $('select[name=type]').val(selectedValue);

      if (selectedValue === 0) {
        $('.GoodsIdsTypeCheck').hide();
        $('#limit-price-coupon .GoodsIdsTypeCheck').show();
      } else {
        $('.GoodsIdsTypeCheck').show();
      }
    });

    /* -- 满赠券 ‘选择购买商品及组合方式’和‘选择赠送的商品’之间的联动 -- */
    $parent.find('#gift-coupon input[type=radio][name=calculateBase]').on('click', function() {
      var calculateBase = parseInt($(this).val());
      if (calculateBase === 2) {
        $parent.find('#gift-coupon input[type=radio][name=sendType][value=2]').
          prop('checked', false).
          prop('disabled', true);
        $('.hide_reduce_gift').show();
      } else {
        $parent.find('#gift-coupon input[type=radio][name=sendType][value=2]').prop('disabled', false);
        $('.hide_reduce_gift').hide();
      }
    });

    /* -- 满赠券选择赠送商品单选框 -- */
    $parent.find('#gift-coupon input[name=sendType]').on('click', function() {
      var sendType = parseInt($(this).val());
      switch (sendType) {
        case 2:
          $parent.find('#gift-coupon #select_gift_num').html($parent.find('#gift-coupon #select_goods_num').html());
          $parent.find('#gift-coupon .gift_box_button').attr('data-target', '#selected_gift_box');
          require(['gift_box2'], function(gift_box2) {
            if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
              gift_box2.showDataToGiftBox();
            } else {
              gift_box2.editDataToGiftBox();
            }
          });
          break;
        case 3:
          $parent.find('#gift-coupon #select_gift_num').html($('#select-gifts-box table.select_gift_list tr').size());
          $parent.find('#gift-coupon .gift_box_button').attr('data-target', '#select-gifts-box');
          break;
        default:
          layer.msg('error on sendType');
      }
    });

    $parent.find('#gift-coupon .gift_box_button').on('click', function() {
      var sendType = $(this).parent().parent().find('input[name=sendType]:checked').val();
      if (parseInt(sendType) === 2) {
        $parent.find('#gift-coupon #select_gift_num').html($parent.find('#gift-coupon #select_goods_num').html());
        $parent.find('#gift-coupon .gift_box_button').attr('data-target', '#selected_gift_box');
        require(['gift_box2'], function(gift_box2) {
          if ($('#selected_gift_box table.selected_gift_list tr').size() === 0) {
            gift_box2.showDataToGiftBox();
          } else {
            gift_box2.editDataToGiftBox();
          }
        });
      }
    });

    // 数量

    // 有效期

    // 是否首单

    // 适用门店
    $parent.find('input[name=apply_store]').on('click', function() {
      var value = $parent.find('input[name=apply_store]:checked').val();
      switch (parseInt(value)) {
        case -1:
          $parent.find('input[name=order_type]').prop('disabled', false);
          $parent.find('input[name=order_type]').prop('checked', true);
          break;
        case 1:
          $parent.find('input[name=order_type][value=200]').prop('checked', false);
          $parent.find('input[name=order_type][value=200]').prop('disabled', true);
          break;
        case 2:
          $parent.find('input[name=order_type][value=200]').prop('checked', false);
          $parent.find('input[name=order_type][value=200]').prop('disabled', true);
          break;
        default:
        // doNothing
      }
    });

    // 订单类型

    // 适用渠道

    // 是否分享

    // 商家备注

    // 按钮
    $('#coupon_later').on('click', function() {
      $('#action').val(-1);
    });
    $('#coupon_send').on('click', function() {
      $('#action').val(0);
    });
  });
}

function initCouponSendProcess() {
  require(['core', 'utils', 'activity', 'coupon', 'goods_box'], function(core, utils, activity, coupon, goods_box) {
    utils.loadPageAsync(sourceMap, () => {
      someEvent();

      cancelSomeEventFromCouponNewEvent();
      activityNewEventBefore(core,activity,coupon);
      activityNewEventAfter(core,activity,coupon);
      $('#oldBtn').attr('class', 'sui-btn btn-info btn-large');

      // 事件绑定
      goods_box.commonEvent();
      // 加载几个弹窗的内容
      goods_box.show_goods_list();

      var rule = $('[name="rules"]:checked').val();

      activity.getCouponList(rule);
      activity.getMemberSignInfo();
      activity.getMemberSignGroupInfo();
      activity.getAllStore();
      activity.get_vip_member_list();
      coupon.get_much_cate_list();

      // 如果url中有ruleId参数，表明该url是带优惠券创建活动，如果带activityId，表明是编辑活动
      var ruleId = core.getUrlParam('ruleId');
      var activityId = core.getUrlParam('activityId');
      if (ruleId) {
        $('input[name=coupon_id][value=' + ruleId + ']').trigger('click');
        setRulesVal(ruleId);
      } else if (activityId) {
        activity.toEditActivity(activityId, true);
      }

    $('#sendMethod').find('input[name=sendWay]').eq(0).trigger('click').parent().addClass('checked');
    });
  });
}

function someEvent() {
  require(['coupon', 'category_choose', 'utils'], function(coupon, category_choose, utils) {
    $('#m_end_time').timepicker();
    $('#type a').on('click', function() {
      var href = $(this).attr('href');
      if (!href.startsWith('#')) {
        var params = 'couponType=' + href;

        var ruleName = $('input[name=ruleName]').val();
        var label = $('input[name=markedWords]').val();
        utils.setCookie('ruleName', ruleName, 1);
        utils.setCookie('label', label, 1);

        window.location.href = '/merchant/promotions/ruleNew?' + params;
      } else {
        switch (href) {
          case '#cash-coupon':
          case '#discount-coupon':
          case '#limit-price-coupon':
            showUnderWeb();
            break;
          case '#gift-coupon':
            hideUnderWeb();
            break;
        }
      }

      function hideUnderWeb() {
        $('.apply_channel[value="101,103"]').prop('checked', true);
        var $1 = $('.apply_channel[value=105]');
        $1.hide();
        $1.nextAll().hide();
      }

      function showUnderWeb() {
        var $1 = $('.apply_channel[value=105]');
        $1.show();
        $1.nextAll().show();
      }
    });

    /* -- 创建打折券绑定事件 开始 by ztq -- */
    /**
     * 打折券是否抹零 绑定事件 用于把前台选择转换成后台需要的数据
     */
    $('#discount-coupon-ml-radio input').on('change', function() {
      var ml_status = $(this).filter(':checked').val();
      var $is_ml = $('#discount-coupon-ml-input input[name=is_ml]');
      var $is_round = $('#discount-coupon-ml-input input[name=is_round]');
      /*
       is_ml: 0->不抹零 1->抹零到角 2->抹零到分
       is_round: 0->四舍五入 1->直接抹去
       */
      switch (ml_status) {
        case '1':
          $is_ml.val(1);
          $is_round.val(1);
          break;
        case '2':
          $is_ml.val(2);
          $is_round.val(1);
          break;
        case '3':
          $is_ml.val(1);
          $is_round.val(0);
          break;
        case '4':
          $is_ml.val(2);
          $is_round.val(0);
          break;
      }

      // 去掉错误提示
      $('#discount-coupon-ml-radio').children('div').css('display', 'none');
    });
    /* -- 创建打折券绑定事件 结束 by ztq -- */

    /* -- 指定商品参加下拉框变更事件 开始 by ztq -- */
    $('select[name=type]').on('change', function() {
      var _type = $(this).val();
      if (_type == '0') {
        $('select[name=type]').val(_type);
        $('#cash-coupon .full_check').hide();
        $('#discount-coupon .full_check').hide();
      } else {
        $('select[name=type]').val(_type);
        $('select[name=typeRule]').val(_type);
        $('.full_check').show();
        $('input[name=cash_coupon_limit_type][value=\'0\']').attr('checked', true);
        $('input[name=discount_coupon_limit_type][value=\'0\']').attr('checked', true);
      }
    });

    $('input[name=apply_store]').on('change', function() {
      $('input[name=\'order_type[]\']').removeAttr('disabled');
      $('input[name=\'order_type[]\']').removeAttr('checked');
      if ($(this).val() == 1) {
        $('input[name=\'order_type[]\']').eq(1).attr('disabled', true);
      }
    });

    $('select[name=typeRule]').on('change', function() {
      var _type = $(this).val();

      $('select[name=type]').val(_type);
      $('.full_check').show();
      $('input[name=cash_coupon_limit_type][value=\'0\']').attr('checked', true);
      $('input[name=discount_coupon_limit_type][value=\'0\']').attr('checked', true);
    });

    /* -- 指定商品参加下拉框变更事件 结束 by ztq -- */
    $('[name="sendConditionType"]').on('change', function() {
      $('input[name="cate_ids[]"]').each(function() {
        $(this).prop('checked', false);
      });
    });

    $('[name="validity_type"]').on('click', function() {
      if ($(this).val() !== 3) {
        $('#check_time_msg').hide();
      }
    });

    //一级展开/收缩
    $(document).on('click', '.first_classify>p i', function() {
      coupon.classOneShowHide(this);
    });

    $(document).on('click', '.second_classify>p i', function() {
      coupon.classTwoShowHide(this);
    });

    /**
     * 类目确定后的操作
     */
    $('.select_cate_ok').on('click', function() {
      var cate_id = '';
      var cate_name = '';
      $('input[name="cate_ids[]"]:checked').each(function() {
        cate_id += $(this).val() + ',';
        cate_name += $(this).siblings('[name="cate_name"]').val() + ',';
      });

      if (cate_id != '') {
        var sendConditionType = $('[name="sendConditionType"]:checked').val();
        if (sendConditionType == 1) {
          //$('#meet_monye_msg').show()
          $('#meet_monye_msg').find('.check_goods').html(cate_name.substr(0, cate_name.length - 1));
        } else {
          //$('#meet_num_msg').show()
          $('#meet_num_msg').find('.check_goods').html(cate_name.substr(0, cate_name.length - 1));
        }
        $('input[name="add_classify"]').val(cate_id.substr(0, cate_id.length - 1));
      }
    });

    //门店
    $('.user_check_store').on('click', function() {
      coupon.get_store_list();
    });

    $('#clerk_store_check').on('click', function() {
      var sel = $('#clerk_store_check option:selected').val();
      if (sel == -1) {
        $('.user_check_store').hide();
      } else if (sel == 1) {
        $('.user_check_store').show();
      }
    });

    $(document).on('click', '.search_stores_btn', function() {
      coupon.get_store_list();
    });

    //批量添加全选の钮
    $('.select_all_stores_btn').click(function() {

      var curStatus = $(this).prop('checked') ? true : false;

      $('.stores_list input[type=\'checkbox\']').each(function() {
        $(this).prop('checked', curStatus);
        curStatus ? $(this).parent().addClass('checked') : $(this).parent().removeClass('checked');
      });
    });

    $(document).on('click', '.stores_list input[type=\'checkbox\']', function() {

      if (!$(this).prop('checked')) {

        $('.select_all_stores_btn').prop('checked', false);
        $('.select_all_stores_btn').parent().removeClass('checked');

      } else if ($('.stores_list input[type=\'checkbox\']').length ==
        $('.stores_list input[type=\'checkbox\']:checked').length) {

        $('.select_all_stores_btn').prop('checked', true);
        $('.select_all_stores_btn').parent().addClass('checked');

      }
    });
    $(document).on('click', '.putaway_select_stores_btn', function() {
      $('.stores_list input[type=\'checkbox\']:checked').each(function() {
        var data = {};
        data.stores_number = $(this).parents('td').siblings('.store_info').find('[name="stores_number"]').val();
        data.id = $(this).parents('td').siblings('.store_info').find('[name="id"]').val();
        data.name = $(this).parents('td').siblings('.store_info').find('[name="name"]').val();
        data.service_support = $(this).parents('td').siblings('.store_info').find('[name="service_support"]').val();

        if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
          var tmpl = document.getElementById('select_store_list_templete').innerHTML;

          var doTtmpl = doT.template(tmpl);

          $('.select_stores_list').append(doTtmpl(data));
        }
      });
      $('.select_stores_total').html($('.select_stores_list tr').length);
    });
    //批量移除全选の钮
    $('.unselect_all_stores_btn').click(function() {

      var curStatus = $(this).prop('checked') ? true : false;

      $('.select_stores_list input[type=\'checkbox\']').each(function() {
        $(this).prop('checked', curStatus);
        curStatus ? $(this).parent().addClass('checked') : $(this).parent().removeClass('checked');
      });
    });
    $(document).on('click', '.select_stores_list input[type=\'checkbox\']', function() {

      if (!$(this).prop('checked')) {

        $('.unselect_all_stores_btn').prop('checked', false);
        $('.unselect_all_stores_btn').parent().removeClass('checked');

      } else if ($('.select_stores_list input[type=\'checkbox\']').length ==
        $('.select_stores_list input[type=\'checkbox\']:checked').length) {

        $('.unselect_all_stores_btn').prop('checked', true);
        $('.unselect_all_stores_btn').parent().addClass('checked');

      }
    });

    $(document).on('click', '.putaway_unselect_stores_btn', function() {
      $('.select_stores_list input[type=\'checkbox\']:checked').each(function() {
        $(this).parents('.can_del_tr').remove();
      });
      $('.unselect_all_stores_btn').prop('checked', false);
      $('.unselect_all_stores_btn').parent().removeClass('checked');
      $('.select_stores_total').html($('.select_stores_list tr').length);
    });

  });

  $(document).on('click', '#select-members-ok', function() {
    to_sure_reissure_activity();
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

  //导入文件模板确认提交
  $(document).on('click', '#uploadMember', function() {
    uploadMember();
  });

  /**
   * 会员标签添加事件
   */
  $(document).on('click', '.main-item-a', function() {
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
  $(document).on('click', '.main-item-a-group', function() {
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
      layer.msg('该标签已经被选择！');
    }
  });

  /**
   * 自定义会员添加
   */
  $(document).on('click', '.select_direct_member_btn', function() {
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
  $(document).on('click', '.unselect_members_btn', function() {
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

  /**
   * 会员确认按钮
   */
  $(document).on('click', '.select-members-ok', function() {
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

  /**
   * 商品标签移除事件
   */
  $(document).on('click', '.close-item-a', function() {
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
  $(document).on('click', '.close-item-a_group', function() {
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
   * 商品标签组确认按钮
   */
  $(document).on('click', '.select-sign-members-ok', function() {
    var members_id = '';
    var members_title = '';
    $('#content-box-main_b a').each(function() {
      members_id += $(this).attr('data-id') + ',';
      members_title += '<a href=\'#\'  class=\'main-item \'>' + $(this).attr('data-empty-msg') + '</a> ';
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
  $(document).on('click', '.select-sign-members-ok_group', function() {
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
   * 门店参加
   */
  $(document).on('click', '.select_stores_btn', function() {
    var data = {};
    data.id = $(this).siblings('[name="id"]').val();
    data.name = $(this).siblings('[name="name"]').val();
    data.service_support = $(this).siblings('[name="service_support"]').val();
    data.stores_number = $(this).parents('tr').find('[name="stores_number"]').val();

    if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {

      var tmpl = document.getElementById('select_store_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('.select_stores_list').append(doTtmpl(data));
      $('.select_stores_total').html($('.select_stores_list tr').length);
    } else {
      layer.alert('该门店已被选择！');
    }
  });

  /**
   * 门店移除
   */
  $(document).on('click', '.unselect_stores_btn', function() {
    $(this).parents('.can_del_tr').remove();
    $('.select_stores_total').html($('.select_stores_list tr').length);
  });

  // 弹框确定后の操作
  $(document).on('click', '.select-house-ok', function() {
    var stores_id = '';
    var stores_name = '';
    $('.select_stores_list input[name=\'id\']').each(function() {
      stores_id += $(this).val() + ',';
      stores_name += $(this).siblings('[name="name"]').val() + ',';

    });

    stores_id = stores_id.substr(0, stores_id.length - 1);

    $('#xuanzhe_num').html($('.select_stores_list tr').length);
    $('[name="apply_store_val"]').val(stores_id);
    $('#select_stores').modal('hide');
  });

  $('#select_member_day').on('okHide', function() {
    var time_type = $('#select_member_day').
      find('#time_type').
      children('.active').
      find('input[name="assign_type"]').
      val();

    if (time_type == 1) {  //按月份设置
      var assign_rule = '';

      $('input[name=\'buyer_days_day[]\']:checked').each(function() {
        assign_rule += $(this).val() + ',';
      });
      if (assign_rule != '') {
        $('#check_time_msg').show();
        $('#check_data_type').html('每月');
        $('#checked_date').html(assign_rule.substring(0, assign_rule.length - 1));
      } else {
        $('#check_time_msg').hide();
        $('#checked_date').html('');
      }

    } else if (time_type == 2) { //按星期设置
      var assign_rule = '';
      $('input[name=\'buyer_days_week[]\']:checked').each(function() {
        assign_rule += $(this).val() + ',';
      });
      console.log(assign_rule);
      console.log(111111);
      if (assign_rule != '') {
        $('#check_time_msg').show();
        $('#check_data_type').html('每周');
        $('#checked_date').html(assign_rule.substring(0, assign_rule.length - 1));
      } else {
        $('#check_time_msg').hide();
        $('#checked_date').html('');
      }
    }
  });
  //按日期设置
  $('.date_radio').on('click', function() {
    $('.date_check').removeClass('lee_hide');
    $('.week_check').addClass('lee_hide');
  });
  //选择单双日
  $('.single_day').on('click', function() {
    $('.single').prop('checked', true);
    $('.single').parent().addClass('checked');
    $('.double').prop('checked', false);
    $('.double').parent().removeClass('checked');
  });
  $('.double_day').on('click', function() {
    $('.single').prop('checked', false);
    $('.single').parent().removeClass('checked');
    $('.double').prop('checked', true);
    $('.double').parent().addClass('checked');
  });
  $('.optional_day').on('click', function() {
    $('.single').prop('checked', false);
    $('.single').parent().removeClass('checked');
    $('.double').prop('checked', false);
    $('.double').parent().removeClass('checked');
  });
  //按星期设置
  $('.week_radio').on('click', function() {
    $('.week_check').removeClass('lee_hide');
    $('.date_check').addClass('lee_hide');
  });

  //创建优惠券提交按钮
  $('#coupon_submit_send').on('click', function() {
    //如果有效期类型是秒杀时间，则进行验证
    if ($('[name=validity_type]:checked').val() == 4) {
      var flag = _checkDate();
      if (flag == false) {
        return false;
      }
    }
  });
  //创建优惠券提交按钮
  $('#coupon_submit').on('click', function() {
    //如果有效期类型是秒杀时间，则进行验证
    if ($('[name=validity_type]:checked').val() == 4) {
      var flag = _checkDate();
      if (flag == false) {
        return false;
      }
    }
  });

}

function setRulesVal(ruleId) {
  require(['core', 'activity'], function(core, activity) {
    var url = core.getHost() + '/merchant/getCouponDetail';
    $.post(url, 'ruleId=' + ruleId, function(data) {
      if (data.code == '000') {
        var coupon = JSON.parse(data.value);
        $('#rules_val').
          val(joinRuleIdAndAmout('', coupon.ruleId + '', coupon.amount, coupon.ruleName, coupon.couponType + '',
            coupon.couponView.ruleDetail));
        funs.addCoupon2Page();
      } else {
        layer.msg('查询失败,请手动选择优惠券');
        return false;
      }
    });
  });
}

/**
 * 根据 jk-service com.jk51.model.coupon.CouponActivityRulesForJson实体类添加ruleId和数量
 *
 * @param material
 * @param ruleId
 * @param amount
 * @return 在result的基础上添加ruleId和amount
 */
function joinRuleIdAndAmout(material, ruleId, amount, name, contentType, contentMsg) {
  var temp_result;
  if (!material) {
    temp_result = {};
    temp_result.rules = [];
    temp_result.sendNumTag = $('input[name=rules]:checked').val();
    var temp_ = {};
    temp_.ruleId = ruleId;
    temp_.amount = amount;
    temp_.name = name;
    temp_.contentType = contentType;
    temp_.contentMsg = contentMsg;
    temp_result.rules.push(temp_);
  } else {
    temp_result = JSON.parse(material);
    temp_result.sendNumTag = $('input[name=rules]:checked').val();
    var temp_ = {};
    temp_.ruleId = ruleId;
    temp_.amount = amount;
    temp_.name = name;
    temp_.name = name;
    temp_.contentType = contentType;
    temp_.contentMsg = contentMsg;
    temp_result.rules.push(temp_);
  }

  return JSON.stringify(temp_result);
}

/**
 * 之所以设计这个方法是因为couponNewEvent里面绑定的时间原本设计就是为了新建优惠券规则的，
 * 而现在挪到新建活动使用必定会有冲突问题，所以在这里设置一个方法取消事件绑定
 */
function cancelSomeEventFromCouponNewEvent() {
  $('input[name=type]').off('change');
}

/**
 * 之所以设计成before和after是因为中间的代码会影响页面布局
 */
function activityNewEventBefore(core,activity,coupon) {
    $('input[name="sendObj"]').on('change', function() {

      $('#directMemberObj').find('label').removeClass('checked');
      $('input[name="sendObj"]').attr('checked', false);
      $(this).attr('checked', true);
      $(this).parent().addClass('checked');
      $('.user_check_members').hide();
      $('.direct_user_check_members').hide();
      //$(this).parent('label').addClass('checked')
      var sel = $('input[name="sendObj"]:checked').val();
      if (sel == 1) {
        $('.user_check_members').hide();
        $('#show_active_obj').hide();
        $('.user_check_members_group').hide();
        $('#show_active_obj_group').hide();
      } else if (sel == 2) {
        $('#show_active_obj_group').hide();
        $('.user_check_members').show();
        $('.user_check_members_group').hide();
      } else if (sel == 4) {
        $('.user_check_members').hide();
        $('.user_check_members_group').show();
        $('#show_active_obj').hide();
      } else if (sel == 3) {
        $('#show_active_obj').hide();
        $('.direct_user_check_members').show();
        $('.user_check_members_group').hide();
        $('#show_active_obj_group').hide();
      }
    });

    //选择发放种类 绑定change事件
    $('input[type=radio][name=rules]').on('change', function() {
      $('#rules_val').val('');
      var rule = $('[name="rules"]:checked').val();
      $('#sure_the_select_coupon').hide();
      activity.getCouponList(rule);
      switch (rule) {
        case '1':
          $('#get_num_pack span').eq(0).html('活动期间内每人可领');
          break;
        case '2':
          $('#get_num_pack span').eq(0).html('活动期间内每人可以随机领');
          break;
        case '3':
          $('#get_num_pack span').eq(0).html('活动期间内每人每张券分别可领');
          break;
      }
    });

    // 绑定发放条件的input输入框校验
    $('input[name=full_money_limit]').bind('change', function() {
      if ($('input[name=sendConditionType][value=\'1\']').has(':checked')) {
        var input_value = $(this).val();
        var moneyTest = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!moneyTest.test(input_value)) {
          layer.msg('请输入正确的金钱格式');
          $(this).val('');
        }
      }
    });

    $('input[name=full_num_limit]').bind('input propertychange', function() {
      if ($('input[name=sendConditionType][value=\'2\']').has(':checked')) {
        var input_value = $(this).val();
        var numTest = /^[0-9]*[1-9][0-9]*$/;
        if (!numTest.test(input_value)) {
          layer.msg('请输入正确的整数格式');
          $(this).val('');
        }
      }
    });

    $('#uploadMember').on('click', function() {
      uploadMember();
    });

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

    $('#sendType5Msg').on('click', function() {
      $('input[name=sendType][value=\'5\']').trigger('click');
    });
}

/**
 * 新建优惠券活动的事件
 * 之所以设计成before和after是因为中间的代码会影响页面布局
 */
function activityNewEventAfter(core,activity,coupon) {
    // initForSendWay()
    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      var rule = $('[name="rules"]:checked').val();
      activity.pageno = 1;
      activity.cur_per_page = $(this).val();
      console.log(rule);
      activity.getCouponList(rule);
    });
    // 发放方式
    $('[name="sendWay"]').on('click', function() {
      var send_way = parseInt($(this).val());
      initForSendWay();
      switch (send_way) {
        case 0: // 显示在领券中心
          //showDesAndPic()
          showGetNumPack();
          showSendTypeByValues('6');
          $('input[name=sendType][value=\'6\']').trigger('click'); // 取消发放时间选中
          break;
        case 1: // 自动发放至会员中心
          showRandomSend();
          hideGetNumPack();
          showSendTypeByValues('1,2,4,5');
          break;
        case 2: // 生成固定链接与二维码
          showGetNumPack();
          showRandomSend();
          showDesAndPic();
          break;
        case 3: // 发送红包showRandomSend()
          showGetNumPack();
          showDesAndPic();
          showSendTypeByValues('4,5');
          break;
        case 5: // 选择派发门店
          showGetNumPack();
          break;
        default :
          layer.msg('error');
      }
    });

    // 发放时间
    $('[name="sendType"]').on('click', function() {
      var send_type = parseInt($(this).val());
      initForSendType();
      switch (send_type) {
        case 1: // 注册后发放
          showSendObjByValues('1');
          break;
        case 2: // 立即发放，不限截止日期
          showSendObjByValues('1,2,3,4');
          break;
        case 4: // 只要付款后就发放，含首单
          showSendObjByValues('1');
          showSendCondition();
          break;
        case 5: // 仅首次付款后发放，不是首单不发放
          showSendObjByValues('1');
          showSendCondition();
          break;
        case 6: // 会员自领
          showSendObjByValues('1');
          break;
        default:
          layer.msg('error');
      }
    });

    $('select[name="type"]').on('change', function() {
      if ($(this).val() == 2 || $(this).val() == 3) {
        $('.full_check').hide();
        $('.full_check').show();
      } else {
        $('.full_check').hide();
      }
    });

    $('#add_coupon_list').on('click', function() {
      var rule = $('[name="rules"]:checked').val();
      if (rule == '' || typeof rule == 'undefined' || rule < 0) {
        layer.msg('请先选择优惠种类');
        $('#coupon_list').modal('hide');
        return;
      }
      $('#sure_the_select_coupon').hide();
      $('#coupon_list').modal('show');
    });

    $('.select-coupon-ok-btn').on('click', function() {
      funs.addCoupon2Page();

    });
    funs.addCoupon2Page = function() {
      var rulesVal = $('#rules_val').val();
      if (rulesVal == '' || rulesVal.indexOf('undefined') != -1) {
        layer.msg('添加优惠券失败');
        return;
      }
      var json = JSON.parse(rulesVal);
      var html = '';
      for (var i = 0; i < json['rules'].length; i++) {
        var name = json['rules'][i].name;

        var type = json['rules'][i].contentType;
        if (type == 100) {
          type = '现金券';
        } else if (type == 200) {
          type = '打折券';
        } else if (type == 300) {
          type = '限价券';
        } else if (type == 400) {
          type = '包邮券';
        } else if (type == 500) {
          type = '满赠券';
        }

        var detail = json['rules'][i].contentMsg;
        html += '<tr><td>' + name + '</td><td>' + type + '</td><td>' + detail + '</td></tr> ';
        $('#choose_list').children().remove();
        $('#choose_list').append(html);
        $('#sure_the_select_coupon').show();
        $('#coupon_list').modal('hide');
      }
    };
    var rule = $('[name="rules"]:checked').val();
    //阻止Enter键刷新页面
    $('.enter-press').bind('keypress', function(event) {
      if (event.keyCode == '13') {
        return false;
      }
    });

  function initForSendWay() {
    hideAllSendType();
    hideSendCondition();
    hideDesAndPic();
    hideRandomSend();
    showSendObjByValues('1');
  }

  function initForSendType() {
    hideSendCondition();
  }

  function showDesAndPic() {
    $('#Descp').show();
  }

  function hideRandomSend() {
    $('#sendTypeOfCoupon').find('[name=rules]').eq(1).parent().hide();
  }

  function showRandomSend() {
    $('#sendTypeOfCoupon').find('[name=rules]').eq(1).parent().show();
  }

  function hideDesAndPic() {
    $('#Descp').hide();
  }

  function hideGetNumPack() {
    $('#get_num_pack').hide();
  }

  function showGetNumPack() {
    $('#get_num_pack').show();
  }

  function showSendTypeByValues(nums) {
    if (!nums) return;
    var split = nums.split(',');
    for (var i = 0; i < split.length; i++) {
      $('input[name=sendType][value=' + split[i] + ']').parent().radio().radio('uncheck'); // 取消发放时间选中
      $('input[name=sendType][value=' + split[i] + ']').parent().show();
    }
    $('#send_time_div').show();
  }

  function showSendObjByValues(nums) {
    if (!nums) return;
    var split = nums.split(',');
    $('input[name=sendObj]').parent().hide();
    $('input[name=sendObj][value=\'1\']').parent().radio().radio('check');
    for (var i = 0; i < split.length; i++) {
      $('input[name=sendObj][value=' + split[i] + ']').parent().show();
    }
  }

  function hideAllSendType() {
    $('input[name=sendType]').parent().radio().radio('uncheck'); // 取消发放时间选中
    $('input[name=sendType]').parent().hide();
    $('#send_time_div').hide();
  }

  function showSendCondition() {
    $('select[name=type]').val(0).trigger('change');
    $('input[name=sendConditionType]:checked').trigger('click');
    $('input[name=full_money_limit]').val('');
    $('input[name=full_num_limit]').val('');
    $('.send_condition_div').show();
  }

  function hideSendCondition() {
    $('.send_condition_div').hide();
  }
}

//------------

//保存
$('#send_activity_ok').on('click', function() {
  require(['coupon_template', 'core'], function(coupon_template, core) {
    $('#send_activity_ok').unbind('click');
    $('#send_activity_ok').on('click', function() {
      layer.msg('请不要重复提交');
    });
    coupon_template.saveActivity();
    $('#send_activity_ok').unbind('click');
    $('#send_activity_ok').on('click', function() {
      coupon_template.saveActivity();
    });
  });
});

//保存并发布
$('#send_activity_ok_issue').on('click', function() {
  require(['coupon_template', 'core'], function(coupon_template, core) {
    $('#send_activity_ok_issue').unbind('click');
    $('#send_activity_ok_issue').on('click', function() {
      layer.msg('请不要重复提交');
    });
    var action_url = '/merchant/createReleasedCouponActive';
    coupon_template.saveActivity(action_url);
    $('#send_activity_ok_issue').unbind('click');
    $('#send_activity_ok_issue').on('click', function() {
      coupon_template.saveActivity(action_url);
    });
  });
});

//活动搜索会员确认按钮
$('.search_much_members_btn').click(function() {
  require(['activity', 'core'], function(activity, core) {
    activity.pageno = 1;
    activity.get_vip_member_list();
  });

});

function couponTemplateEvent() {
  findCouponTemplateInfo2Page();
  addSomeTemplateClick();
}

//为模板主页加载已经创建的模板信息
function findCouponTemplateInfo2Page() {
  require(['utils', 'core'], function(utils, core) {
    var params = new Array();
    var count = 0;
    $('.couponType').each(function() {
      var coupon_type = $(this).val();
      $(this).nextAll().each(function() {
        var rule_type = $(this).find('.ruleType').eq(0).val();
        if (rule_type) {
          params[count] = {};
          params[count].couponType = coupon_type;
          params[count++].ruleType = rule_type;
        }
      });
    });
    var obj = {};
    obj.params = params;
    var url = 'couponRule/getActiveCouponNumAndGoodsNum';
    console.log(obj);
    utils.doGetOrPostOrJson(url, obj, 'json', true, function(data) {
      var list = data.value;
      for (var i = 0; i < list.length; i++) {
        var coupon_type = list[i].couponType;
        var ruleType = list[i].ruleType;
        var releaseRule = list[i].releaseRule;
        var goodsInRule = list[i].goodsInRule;
        var $info = $('#info_' + coupon_type + '_' + ruleType);
        $info.find('span').eq(0).html(releaseRule);
        $info.find('span').eq(1).html(goodsInRule);
      }
    });
  });
}

//给模板的小块块加点击事件
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
    var url = '/merchant/couponNewProcess';
    $('.wold-inner').each(function() {
      var $parent = $(this).parent().parent();
      var rule_type = $parent.find('.ruleType').eq(0).val();
      var coupon_type = $parent.parent().find('.couponType').eq(0).val();
      if (rule_type && coupon_type) {
        $(this).on('click', function() {
          window.location.href = core.getHost() + url + '?couponType=' + coupon_type + '&ruleType=' + rule_type;
        });
      }
    });
  });
}

function export_(ruleId) {
  var params = {
    'ruleId': ruleId,
  };
  var result;
  $.ajax({
    type: 'post',
    url: 'couponDownDetail',
    data: params,
    async: false,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      result = data;
    },
  });
  return result;
}
