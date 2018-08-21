!(function() {

  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'utils': 'merchant/js/coupon/ll_utils',
      'uploadify': 'merchant/js/lib/uploadify/jquery.uploadify.min',
      'coupon': 'merchant/js/coupon/coupon',
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

  require(['core'], function(core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();
  });

  var router = {
    'merchant': {
      'couponNew': initCouponNew,
      'couponDetail': initCouponDetail,
      'couponManager': initCouponManager,
      'couponUse': initCouponUse,
      'activityManager': initSendCouponManager,
      'activityDetail': initSendCouponDetail,
      'activityNew': initSendCouponNew,
    },
  };

  require(['core'], function(ybzf) {
    var controllerAction = ybzf.getControllerAction();
    var controller = controllerAction[0];
    var action = controllerAction[1];
    router[controller][action]();
  });
})();

function initCouponNew() {
  console.log('initCouponNew');
  // 在js运行前加载需要的模块文件
  loadModuleBeforeInit();
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
      'category_choose'],
    function(
      core, utils, coupon_new, goods_box, gift_box, gift_box2, store_box,
      area_box, category_choose) {
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

      // 确认是编辑、复制、正常新建，做相应的页面跳转
      var couponRuleId = core.getUrlParam('couponRuleId');
      var op = core.getUrlParam('op');
      if (couponRuleId && op === 'edit') {
        coupon_new.showDataToPage(couponRuleId, true);
        $('.left_title').html('编辑优惠券')
        // 用来开启校验并确定保存的js
        $('#coupon_form').validate({
          success: function() {
            var action = $('#action').val();
            if (action === '0') {
              var url = '/merchant/couponSendProcess';
              coupon_new.edit_(url);
              return false;
            } else {
              coupon_new.edit_();
              return false;
            }

          },
        });
      } else if (couponRuleId && op === 'copy') {
        coupon_new.showDataToPage(couponRuleId);
        $('.left_title').html('复制优惠券')
        // 用来开启校验并确定保存的js
        $('#coupon_form').validate({
          success: function() {
            coupon_new.create_();
            return false;
          },
        });
      } else {
        // 用来开启校验并确定保存的js
        $('#coupon_form').validate({
          success: function() {
            coupon_new.create_();
            return false;
          },
        });
      }

      // 页面从创建优惠券跳转过来的时候，锁定点击的标签
      var couponType = core.getUrlParam('couponType');
      if (couponType) {
        $('#tab a[href="#' + couponType + '"]').trigger('click');

        // 确认名称和标签
        var ruleName = utils.getCookie('ruleName');
        var label = utils.getCookie('label');
        if (ruleName) {
          $('input[name=ruleName]').val(ruleName);
        }
        if (label) {
          $('input[name=markedWords]').val(label);
        }
        utils.clearCookie('ruleName');
        utils.clearCookie('label');
      }
    });
}

function initCouponDetail() {
  loadModuleBeforeInit();

  require(['coupon_detail', 'core', 'goods_box', 'coupon_new'],
    function(coupon_detail, core, goods_box, coupon_new) {
      var couponRuleId = (core.getUrlParam('id'));
      coupon_detail.show_(couponRuleId);
      goods_box.show_goods_list();

      coupon_detail.changeCouponDetailButtons();
      coupon_detail.changeCouponDetailRightSide();

      couponDetailEvent(coupon_new);
      goods_box.commonEvent();
    });
}

function couponDetailEvent(coupon_new) {
  require(['core', 'utils', 'coupon_detail'],
    function(core, utils, coupon_detail) {

      // 门店查看
      $(document).delegate('#show_store', 'click', function(e) {
        console.log($(this).attr('data-value'));
        var storeList = JSON.parse(
          decodeURIComponent($(this).attr('data-value')));
        var storeStr = '';
        var support1 = '送货上门';
        var support2 = '门店自提';
        var support3 = '送货上门,门店自提';
        $('#selected_store').
          html('您已选择 <span style=\'color: red\'>' + storeList.length +
            '</span> 家门店：');
        for (var item = 0; item < storeList.length; item++) {
          console.log(storeList[item].serviceSupport);
          if (!storeList[item].service_support_str) {
            switch (storeList[item].serviceSupport) {
              case '150':
                storeList[item].service_support_str = support1;
                break;
              case '160':
                storeList[item].service_support_str = support2;
                break;
              case '150,160':
                storeList[item].service_support_str = support3;
                break;
              case '160,150':
                storeList[item].service_support_str = support3;
                break;
              case '':
                storeList[item].service_support_str = '---';
                break;
              case undefined:
                storeList[item].service_support_str = '---';
                break;
            }
          }
          storeStr += '<tr><td>' + storeList[item].storesNumber + '</td><td>' +
            storeList[item].name + '</td><td>'
            + storeList[item].service_support_str + '</td></tr>';
        }
        $('#store_list').html(storeStr);
      });

      // 赠品查看

      // 优惠类型 修改商品弹出框
      $('select[name=__goodsIdsType]').on('change', function() {
        var selectedValue = $(this).val();
        $('select[name=type]').val(selectedValue);

        if (selectedValue == '0') {
          $('#much_select_goods_container').hide();
        } else {
          $('#much_select_goods_container').show();
        }
      });

      // 修改商品按钮确定按钮
      $('#goodsModifyModal').on('okHide', function() {
        var obj = {};
        var $parent = $('#goodsModifyModal');
        var goodsIdsType = parseInt(
          $parent.find('select[name=__goodsIdsType]').val());
        obj.goodsIdsType = goodsIdsType;
        if (goodsIdsType) {
          var goodsIds = $('#much_select_goods').
            find('input[name=__goodsIds]').
            val();
          if (!goodsIds) {
            layer.msg('请先选择商品');
            return;
          }
          obj.goodsIds = goodsIds;
        } else {
          obj.goodsIds = 'all';
        }

        var url = 'couponRule/editCouponRuleOneField';
        var params = {};
        params.ruleId = parseInt($('#coupon_code').html());
        params.field = 'goods';
        params.goods = JSON.stringify(obj);

        utils.doGetOrPostOrJson(url, params, 'post', false, function(data) {
          if (data && data.code && data.code === '000') {
            location.reload();
          } else {
            layer.msg('修改失败');
            console.log(data);
          }
        });
      });

      // 修改数量
      $('#amount_append_save').on('click', function() {
        coupon_detail.editAmcountOrValidityTime();
      });

      // 修改时间
      $('#validity_day_append_save').on('click', function() {
        coupon_detail.editAmcountOrValidityTime();
      });

      // 确认发布
      $('#ConfirmModal').on('okHide', function() {
        var analyzeResult = analyzeTimeRuleBeforeSend();
        if (typeof(analyzeResult) === 'string') {
          layer.msg(analyzeResult);
          return;
        }

        coupon_new.buildCoupon(function() {
          window.location.href = core.getHost() +
            '/merchant/couponSendProcess?ruleId=' +
            $('input[name=rule_id]').val();
        });
      });

      // 确认发布 稍后再说点击事件
      $('#ConfirmModal').on('cancelHide', function() {
        var analyzeResult = analyzeTimeRuleBeforeSend();
        if (typeof(analyzeResult) === 'string') {
          layer.msg(analyzeResult);
          return;
        }

        coupon_new.buildCoupon(function() {
          window.location.reload();
        });
      });

      // 修改点击事件
      $('#edit_coupon').on('click', function() {
        var ruleId = $('input[name=rule_id]').val();
        window.location.href = '/merchant/couponNew?couponRuleId=' + ruleId +
          '&op=edit';
      });

      // 复制优惠券点击事件
      $('#copy_coupon').click(function() {
        var ruleId = $('input[name=rule_id]').val();
        window.location.href = '/merchant/couponNew?couponRuleId=' + ruleId +
          '&op=copy';
      });

      // 去创建发布规则
      $('#send_coupon').on('click', function() {
        var ruleId = $('input[name=rule_id]').val();
        location.href = core.getHost() + '/merchant/couponSendProcess?ruleId=' +
          ruleId;
      });

      // 手动停发点击事件
      $('#stop_coupon').on('okHide', function() {
        if (!($(this).attr('disabled') == 'disabled')) {
          coupon_new.cancelCoupon();
        }
      });

      //作废优惠券
      $('#invalid_coupon').on('okHide', function() {
        var params = {};
        params.ruleId = $('input[name=rule_id]').val();
        params.preStatus = $('input[name=status]').val();
        params.toUpdateStatus = 4;

        var url = core.getHost() + '/merchant/updateCouponStatus';
        $.post(url, params, function(data) {
          if (data.code == '000') {
            window.location.href = '/merchant/couponListManager';
          } else if (data.code == '101') {
            layer.msg(data.message);
          } else {
            layer.msg('作废优惠券失败');
          }
        });
      });

      function analyzeTimeRuleBeforeSend() {
        var timeRule = JSON.parse($('input[name=timeRule]').val());

        core.formatDate();
        var endTime;
        if (timeRule.validity_type == 1) {
          endTime = new Date(timeRule.endTime).format('yyyy-MM-dd');
        } else if (timeRule.validity_type == 4) {
          endTime = new Date(timeRule.endTime).format('yyyy-MM-dd hh:mm:ss');
        }
        if (endTime && endTime < new Date()) {
          return '时间过期，不能发放该优惠券';
        }
      }
    });
}

function couponNewEvent() {
  console.log('couponNewEvent');
  // 按钮

  var $parent = $('#coupon_form');
  $parent.delegate('#coupon_submit_send', 'click', function() {
    $('#action').val(0);
    $parent.submit();
  });
  require(['coupon_new', 'utils'], function(coupon_new, utils) {
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
      var temp_str = $(this).
        parent().
        parent().
        nextAll('.sui-msg').
        eq(0).
        children('div').
        eq(0).
        html();
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
    $parent.find('#gift-coupon input[type=radio][name=calculateBase]').
      on('click', function() {
        var calculateBase = parseInt($(this).val());
        if (calculateBase === 2) {
          $parent.find(
            '#gift-coupon input[type=radio][name=sendType][value=2]').
            prop('checked', false).
            prop('disabled', true);
        } else {
          $parent.find(
            '#gift-coupon input[type=radio][name=sendType][value=2]').
            prop('disabled', false);
        }
      });

    /* -- 满赠券选择赠送商品单选框 -- */
    $parent.find('#gift-coupon input[name=sendType]').on('click', function() {
      var sendType = parseInt($(this).val());
      switch (sendType) {
        case 2:
          $parent.find('#gift-coupon #select_gift_num').
            html($parent.find('#gift-coupon #select_goods_num').html());
          $parent.find('#gift-coupon .gift_box_button').
            attr('data-target', '#selected_gift_box');
          require(['gift_box2'], function(gift_box2) {
            if ($('#selected_gift_box table.selected_gift_list tr').size() ===
              0) {
              gift_box2.showDataToGiftBox();
            } else {
              gift_box2.editDataToGiftBox();
            }
          });
          break;
        case 3:
          $parent.find('#gift-coupon #select_gift_num').
            html($('#select-gifts-box table.select_gift_list tr').size());
          $parent.find('#gift-coupon .gift_box_button').
            attr('data-target', '#select-gifts-box');
          break;
        default:
          layer.msg('error on sendType');
      }
    });

    $parent.find('#gift-coupon .gift_box_button').on('click', function() {
      var sendType = $(this).
        parent().
        parent().
        find('input[name=sendType]:checked').
        val();
      if (parseInt(sendType) === 2) {
        $parent.find('#gift-coupon #select_gift_num').
          html($parent.find('#gift-coupon #select_goods_num').html());
        $parent.find('#gift-coupon .gift_box_button').
          attr('data-target', '#selected_gift_box');
        require(['gift_box2'], function(gift_box2) {
          if ($('#selected_gift_box table.selected_gift_list tr').size() ===
            0) {
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
          $parent.find('input[name=order_type][value=200]').
            prop('checked', false);
          $parent.find('input[name=order_type][value=200]').
            prop('disabled', true);
          break;
        case 2:
          $parent.find('input[name=order_type][value=200]').
            prop('checked', false);
          $parent.find('input[name=order_type][value=200]').
            prop('disabled', true);
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
    $parent.delegate('#coupon_submit', 'click', function() {
      $parent.submit();
    });
  });
}

function loadModuleBeforeInit() {
  console.log('ruleNewLoadModule');
  $.ajaxSetup({async: false});
  ifExistThanLoad($('#area_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/area_box.html');
  ifExistThanLoad($('#goods_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/goods_box.html');
  ifExistThanLoad($('#gift_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/gift_box.html');
  ifExistThanLoad($('#gift_popup_box2_html'),
    '/templates/views/resource/merchant/js/coupon/common/gift_box_2.html');
  ifExistThanLoad($('#store_popup_box_html'),
    '/templates/views/resource/merchant/js/coupon/common/store_box.html');
  $.ajaxSetup({async: true});
}

function ifExistThanLoad($div, url) {
  if ($div.size() === 1) {
    $div.load(url);
  }
}

/**
 * 优惠券管理
 */
function initCouponManager() {

  require(['coupon_manager'], function(coupon_manager) {
    coupon_manager.getCouponList();
  });

  couponManagerEvent();
}

/**
 * 优惠券管理事件绑定
 */
function couponManagerEvent() {
  require(['coupon_manager'], function(coupon_manager) {
    $('#coupon_search').on('click', function() {
      coupon_manager.pageno = 1;
      coupon_manager.getCouponList();
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        coupon_manager.getCouponList();
      }
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      coupon_manager.pageno = 1;
      coupon_manager.cur_per_page = $(this).val();
      coupon_manager.getCouponList();
    });

    $('#coupon_table').
      delegate('.promotions_code_offline', 'click', function() {
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

    $('#export-dialog').
      delegate('#export-dialog-show-history', 'click', function() {
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

/**
 * 优惠券使用情况
 */
function initCouponUse() {
  require(['coupon_use'], function(coupon_use) {
    coupon_use.getCouponUseList();
  });
  couponUseEvent();
}

/* todo 这个函数不仅仅是事件定义，需要修改 */
function couponUseEvent() {
  require(['coupon_use'], function(coupon_use) {
    $('a[name="exportCouponDetailBtn"]').prop('id', getUrlParam('id'));
    $('li[name="save_type"]').prop('id', getUrlParam('type'));

    $('#coupon_use_btn').on('click', function() {
      coupon_use.pageno = 1;
      coupon_use.getCouponUseList();
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      coupon_use.pageno = 1;
      coupon_use.cur_per_page = $(this).val();
      coupon_use.getCouponUseList();
    });

    if (getUrlParam('type') == 1) {
      $('#status').
        html(
          '<option selected="" value="-1">全部</option><option value="0">已使用</option><option value="1">待使用</option>');
    } else if (getUrlParam('type') == 2) {
      $('#title_one').html('活动管理');
      $('#title_two').html('活动使用情况');
      $('.replace_span').html('活动');
      $('option[value="1"]').html('活动编号');
      $('#status').
        html(
          '<option selected="" value="-1">全部</option><option value="0">已使用</option><option value="1">已退款</option><option value="2">订单取消</option>');
      $('#result').
        html(
          '当前查询结果中,已使用：<span style="color: red" id="use">0</span> ,已退款：<span style="color: red" id="refund">0</span>,订单取消：<span style="color: red" id="cancel">0</span>');
    }

    $('a[name=exportCouponDetailBtn]').on('click', function() {
      coupon_use.exportCouponDetail(this, this.id);
    });
  });
}

/**
 * 发送优惠券管理
 */
function initSendCouponManager() {
  require(['activity'], function(activity) {
    activity.getSendCouponList();
  });
  activityManagerEvent();
}

function activityManagerEvent() {
  require(['activity'], function(activity) {
    $('#send_manager_brn').on('click', function() {
      activity.pageno = 1;
      activity.getSendCouponList();
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        activity.getSendCouponList();
      }
    });

    //显示数目选择
    $(document).on('change', '.page_size_select', function() {
      activity.pageno = 1;
      activity.cur_per_page = $(this).val();
      activity.getSendCouponList();
    });
  });
}

/**
 * 发送发放详情
 */
function initSendCouponDetail() {

  require(['activity', 'core'], function(activity, core) {
    var coupon_id = (core.getUrlParam('id'));

    $('#coupon_form').
      append('<input type="hidden" name="edit_id" id="edit_id" value="' +
        coupon_id + '"/>');
    activity.get_detail_activity();

    changeSendCouponDetailButtons();
    changeSendCouponDetailRightSide();

    changeSendTime(core);
    sendCouponDetailEvent();
    someEvent();
  });
}

/**
 * 延长活动时间
 */
function changeSendTime(core) {
  $('#m_end_time').click(function() {
    $('.timepicker div[data-role="minute"] span').click(function() {
      $('.timepicker').css('display', 'none');
    });
  });

  $('#setTime').on('okHide', function(e) {
    var end_time = $('#end_time').val();
    var m_end_time = $('#m_end_time').val();
    if (end_time == '' || m_end_time == '') {
      $('#alert_title').html('请选择时间');
      return false;
    }
    var old_time = $('#hidden_end_time').val();
    var newTime = new Date(end_time + ' ' + m_end_time + ':00');
    var oldTime = new Date(old_time);
    if (newTime.getTime() - oldTime.getTime() <= 0) {
      $('#alert_title').html('延长时间不能小于结束时间');
      return false;
    }
    var activityId = $('#edit_id').val();
    var url = core.getHost() + '/merchant/activityUpdate';
    var params = {};
    params.activityId = activityId;
    params.date = newTime.format('yyyy-MM-dd hh:mm:ss');
    $.post(url, params, function(data) {
      console.log(data);
      if (data.code == '000') {
        location.href = location.href;
      } else {
        $('#alert_title').html(data.message);
        false;
      }
    }, 'json');
  });
}

function sendCouponDetailEvent() {
  require(['activity', 'core'], function(activity, core) {
    // 活动详情页修改按钮的触发事件
    $('#edit_activity').on('click', function() {
      var activityId = $('input[name=activity_id]').val();
      location.href = core.getHost() +
        '/merchant/couponSendProcess?activityId=' + activityId;
    });

    $(document).delegate('#show_stores', 'click', function(e) {
      console.log($(this).attr('data-value'));
      var data = $(this).attr('data-value');
      var decode = decodeURIComponent(data);
      var storeList = JSON.parse(decode);
      var storeStr = '';
      $('#selected_store').
        html('您已选择 <span style=\'color: red\'>' + storeList.length +
          '</span> 家门店：');
      for (var item = 0; item < storeList.length; item++) {
        storeStr += '<tr><td>' + storeList[item].storesNumber + '</td><td>' +
          storeList[item].name + '</td><td>'
          + storeList[item].service_support_str + '</td></tr>';
      }
      $('#stores_list').html(storeStr);
    });

    //将待发布改为发布中
    $('#send_activity').on('click', function() {
      activity.sendActivity();
    });

    //结束该活动
    $('#stop_activity').on('okHide', function() {
      var params = {};
      params.activeId = $('input[name=activity_id]').val();
      params.preStatus = $('input[name=status]').val();
      params.toUpdateStatus = 4;

      var url = core.getHost() + '/merchant/updateActiveStatus';
      $.post(url, params, function(data) {
        if (data.code == '000') {
          window.location.href = '/merchant/activityManager';
        } else if (data.code == '101') {
          layer.msg(data.message);
        } else {
          layer.msg('作废优惠券失败');
        }
      });
    });

    $('.copy').live('click', function(e) {
      var Url2 = document.getElementById('wxCodeUrlShow');
      Url2.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      alert('已复制好，可贴粘。');
    });
  });
}

/**
 * 创建发放优惠券
 */
function initSendCouponNew() {
  loadModuleBeforeInit();
  someEvent();

  cancelSomeEventFromCouponNewEvent();

  activityNewEventBefore();
  activityNewEventAfter();
  $('#oldBtn').attr('class', 'sui-btn btn-info btn-large');
  require(['activity', 'coupon', 'goods_box', 'core'],
    function(activity, coupon, goods_box, core) {
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
      } else if (activityId) {
        $('#send_activity_ok').text('保存');
        activity.toEditActivity(activityId);
      }
      $('#sendMethod').
        find('input[name=sendWay]').
        eq(0).
        trigger('click').
        parent().
        addClass('checked');
    });

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
function activityNewEventBefore() {
  require(['core', 'activity', 'coupon'], function(core, activity, coupon) {

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
  });
}

/**
 * 新建优惠券活动的事件
 * 之所以设计成before和after是因为中间的代码会影响页面布局
 */
function activityNewEventAfter() {
  require(['core', 'activity', 'coupon'], function(core, activity, coupon) {

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
        html += '<tr><td>' + name + '</td><td>' + type + '</td><td>' + detail +
          '</td></tr> ';
        $('#choose_list').children().remove();
        $('#choose_list').append(html);
        $('#sure_the_select_coupon').show();
        $('#coupon_list').modal('hide');
      }
    });

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
      $('input[name=sendType][value=' + split[i] + ']').
        parent().
        radio().
        radio('uncheck'); // 取消发放时间选中
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
    $('#send_condition_div').show();
  }

  function hideSendCondition() {
    $('#send_condition_div').hide();
  }
}

//保存
$('#send_activity_ok').on('click', function() {
  require(['activity', 'core'], function(activity, core) {
    var activityId = core.getUrlParam('activityId');
    activity.saveActivity(activityId, editor);
  });

});

//活动搜索会员确认按钮
$('.search_much_members_btn').click(function() {
  require(['activity', 'core'], function(activity, core) {
    activity.pageno = 1;
    activity.get_vip_member_list();
  });

});

function _close() {
  $('#export-dialog').modal('hide');
  return true;
}

function _checkDate() {
  var date = $('#m_date').val();
  var startHour = $('#m_start_time').val();
  var endHour = $('#m_end_time').val();
  var now1 = new Date();
  var nowTime1 = dataFormat(now1, 'yyyy-MM-dd hh:mm:ss');
  var inputTime1 = date + ' ' + startHour + ':00';
  if (nowTime1 > inputTime1) {
    alert('请设置当前时间之后的时段！');
    return false;
  }
  console.log(nowTime1);
  console.log(date + ' ' + startHour + ':00');
  if (date != '' && startHour != '' && endHour != '') {
    var now = new Date();
    var inputTime = $('#m_date').val();
    var nowTime = dataFormat(now, 'yyyy-MM-dd');
    if (nowTime <= inputTime) {
      var n_startHour = startHour.substring(0, 2);
      var n_endHour = endHour.substring(0, 2);
      if ($('#m_end_time').val() === '00:00') {
        alert('终止时间最大为当天23:59,请调整！');
        return false;
      }
      if (n_endHour < n_startHour) {
        alert('终止时间不能小于或者等于起始时间！');
        $('#m_end_time').val('');
        event.stopPropagation();
        return false;
      } else if (n_endHour === n_startHour) {
        startHour = $('#m_start_time').val().substring(2, 6).substring(1, 3);
        endHour = $('#m_end_time').val().substring(2, 6).substring(1, 3);
        if ($('#m_end_time').val() === '00:00') {
          alert('终止时间最大为当天23:59,请调整！');
          return false;
        }
        if (endHour <= startHour) {
          alert('终止时间不能小于或者等于起始时间！');
          $('#m_end_time').val('');
          event.stopPropagation();
          return false;
        }
      } else {
        return true;
      }
    } else {
      alert('请先修改秒杀时间，只限当天！');
      $('#m_date').val('');
      $('#m_start_time').val('');
      $('#m_end_time').val('');
      event.stopPropagation();
      return false;
    }
  } else {
    alert('请不要提交空的数据！');
    return false;
  }
}

/**
 * 满多少元打多少折 点击+号增加输入框
 * 功能同上 用于折扣券类似的机构
 */
$('#coupon_type').on('click', '[name=_add]', function() {
  var temp_div = $(this).parent().parent();
  switch (temp_div.prop('id')) {
    case 'discount_goods_money':
    case 'discount_goods_num':
    case 'cash_goods_every_money_ladder':
      var ladder_msg = temp_div.children('div:last').
        children('div:first').
        html();
      var ladder_max = ladder_msg.replace(/\D/gi, '');

      if (temp_div.children('p').size() >= ladder_max) {
        layer.msg('最多可添加' + ladder_max + '级阶梯');
        return;
      }

      var temp_p = temp_div.children('p:first').prop('outerHTML');
      var $temp_p = $(temp_p);
      $temp_p.find('input[type=radio]').remove();
      $temp_p.prepend('&nbsp;&nbsp;');

      var button_plus = $temp_p.find('input[type=button]').prop('outerHTML');
      var $button_minus = $(button_plus).
        val('-').
        prop('name', '_delete').
        after('&nbsp;&nbsp;');
      $temp_p.find('input[type=button]').before($button_minus);

      temp_div.children('p:last').after($temp_p);
      break;
    case 'gift-num-num':
    case 'gift-money-num':
      // 找到阶梯限制数
      var temp_str = $(this).
        parent().
        parent().
        nextAll('.sui-msg').
        eq(0).
        children('div').
        eq(0).
        html();
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
      break;
  }
});

function dataFormat(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,
    (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1,
      (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}

function uploadMember() {
  $('#member_list').html('');
  var formData = new FormData();
  var name = $('#file_name').val;
  var file = $('#input_file')[0].files[0];
  formData.append('file', file);
  formData.append('name', name);
  formData.append('target', 'member');
  var successMsg = '读取会员信息成功！';
  var failMsg = '未读取到会员信息！';

  $.ajax({
    url: '/merchant/import',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(result) {
      var count = 0;
      console.log(result);
      if (result != null) {
        if (result.code === '101') {
          layer.msg('模板格式错误！');
          return;
        }
        var tmpl = document.getElementById('importList').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#member_list').html(doTtmpl(result.value));
        var str = '';//导入成功的商品
        for (var i = 0; i < result.value.length; i++) {
          if (result.value[i].remark == 0) {
            count = count + 1;
            str += result.value[i].memberId + ',';
          }
        }
        str = str.substring(0, str.length - 1);
        $('#send_obj_members_direct').val(str);
        $('#importSuccessCount').text(count);
        $('#importCount').text(result.value.length);
        var importFuile = (result.value.length - count);
        $('#importFuileCount').text(importFuile);
        layer.msg(successMsg);
      } else {
        $('#importFuileCount').text(0);
        $('#importCount').text(0);
        $('#importSuccessCount').text(0);
        layer.msg(failMsg);
      }
    },

  });
}

function to_sure_reissure_activity() {
  if (confirm('您确定执行补发操作吗？')) {
    var params = {};
    var userIds = $('#send_obj_members_direct').val();
    var activityId = $('[name=activity_id]').val();
    if (userIds == '') {
      layer.msg('请至少选取一个会员');
      return;
    }
    if (activityId == '') {
      layer.msg('补发活动不能为空');
      return;
    }
    params.vipMembers = userIds;
    params.activeId = activityId;

    var url = '/merchant/toReissureActivity';
    $.post(url, params, function(data) {
      if (data.code == '000') {
        layer.msg('补发成功，补发结果请查看补发记录');
      } else {
        layer.msg('操作失败,请稍后重试');
      }

    });

    return;
  } else {
    return;
  }
}

function file_change(name) {
  $('#file_name').val(name);
}

$(document).on('change', '#input_file', function() {
  var e = $(this).val();
  $('#file_name').val(e);
});

/**
 * 根据活动的不同状态改变底边按钮
 */
function changeSendCouponDetailButtons() {
  var send_html = '<a class=\'sui-btn btn-info btn-large\' style=\'margin-right:30px\' id=\'send_activity\'>确认发布</a>';
  var edit_html = '<a class=\'sui-btn btn-info btn-large\' style=\'margin-right:30px\' id=\'edit_activity\'>修改</a>';
  var return_html = '<a class=\'sui-btn btn-default btn-large\' id="return_list" href=\'activityManager\'>返回列表</a>';
  var reissue_html = '<a data-toggle=\'modal\' style=\'margin-left:30px;background-color: #F7F7F7\' data-target=\'#direct_check_user_members\' class=\'sui-btn btn-default btn-large direct_user_check_members\'href=\'javascript:void(0)\' style=\'color:#F7F7F7;\'>补发优惠券</a>';
  var reissue_record_html = '<a data-toggle=\'modal\' style=\'margin-left:30px;background-color: #F7F7F7\' data-target=\'#export-dialog\' class=\'sui-btn btn-default btn-large direct_user_check_members\'href=\'javascript:void(0)\' style=\'color:#F7F7F7;\'>补发记录</a>';

  var status = $('input[name=status]').val();
  var sendWay = $('input[name=sendWay]').val();
  var isReissUre = $('input[name=isReissUre]').val();
  var isReissUreRecord = $('input[name=isReissUreRecord]').val();
  var a_html;
  switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
    case '0':
      a_html = return_html;
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
      a_html = send_html + edit_html + return_html;
      break;
  }

  if ((status == '0' || status == '1' || status == '4') && sendWay != '5' &&
    isReissUre == '1') {

    a_html = return_html + reissue_html;
  }

  if (isReissUreRecord > 0) {
    a_html += reissue_record_html;
  }

  $('#buttons').append(a_html);
}

/**
 * 根据活动的不同状态改变右边栏入口
 */
function changeSendCouponDetailRightSide() {
  var stop_activity = '<a href=\'#\' data-toggle=\'modal\' data-target=\'#stop_activity\' data-keyboard=\'false\' style=\'color: red\'>结束该活动</a> &nbsp;';

  var status = $('input[name=status]').val();
  var a_html;
  switch (status) { // 0发布中 1定时发布 2过期结束 3已发完结束 4手动结束 10待发布
    case '0':
      a_html = stop_activity;
      break;
    case '1':
      break;
    case '2':
      break;
    case '3':
      break;
    case '4':
      break;
    case '10':
    case '11':
      a_html = stop_activity;
      break;
  }

  $('#rightSide').append(a_html);
}

// todo 不同页面的事件都绑定在该函数内，需要修改
function someEvent() {
  require(['coupon', 'category_choose', 'utils'],
    function(coupon, category_choose, utils) {
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
          $('input[name=cash_coupon_limit_type][value=\'0\']').
            attr('checked', true);
          $('input[name=discount_coupon_limit_type][value=\'0\']').
            attr('checked', true);
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
        $('input[name=cash_coupon_limit_type][value=\'0\']').
          attr('checked', true);
        $('input[name=discount_coupon_limit_type][value=\'0\']').
          attr('checked', true);
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
            $('#meet_monye_msg').
              find('.check_goods').
              html(cate_name.substr(0, cate_name.length - 1));
          } else {
            //$('#meet_num_msg').show()
            $('#meet_num_msg').
              find('.check_goods').
              html(cate_name.substr(0, cate_name.length - 1));
          }
          $('input[name="add_classify"]').
            val(cate_id.substr(0, cate_id.length - 1));
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

      $(document).
        on('click', '.stores_list input[type=\'checkbox\']', function() {

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
          data.stores_number = $(this).
            parents('td').
            siblings('.store_info').
            find('[name="stores_number"]').
            val();
          data.id = $(this).
            parents('td').
            siblings('.store_info').
            find('[name="id"]').
            val();
          data.name = $(this).
            parents('td').
            siblings('.store_info').
            find('[name="name"]').
            val();
          data.service_support = $(this).
            parents('td').
            siblings('.store_info').
            find('[name="service_support"]').
            val();

          if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').
              val()) {
            var tmpl = document.getElementById(
              'select_store_list_templete').innerHTML;

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
      $(document).
        on('click', '.select_stores_list input[type=\'checkbox\']', function() {

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
        $('.select_stores_list input[type=\'checkbox\']:checked').
          each(function() {
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
      var tmpl = '<a href=\'#\' data-empty-msg="' + data.crowdName +
        '"  data-id = "' + data.id + '" class=\'main-item main-item-b\' id="' +
        data.id + '">' + data.crowdName +
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
    if (!$('[name="sign-member-b-input_group"][value="' + data.labelName +
        '"]').val()) {
      if ($('#send_obj_members_group')) {
        var ss = $('#send_obj_members_group').val();
        ss += data.labelName + ',';
        $('#send_obj_members_group').val(ss);
      }
      $(this).css('background-color', 'green');
      var tmpl = '<a href=\'#\' data-empty-msg="' + data.labelName +
        '"  data-labelName = "' + data.labelName +
        '" class=\'main-item main-item-b_group\' id="' + data.labelName + '">' +
        data.labelName +
        '<input type="hidden" name="sign-member-b-input_group" value="' +
        data.labelName +
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
    data.ban_status = $(this).
      parent().
      find('[name="ban_status"]').
      parent().
      val();
    if (!$('.select_member_list [name="memberId"][value="' + data.memberId +
        '"]').val()) {
      if ($('#send_obj_members_direct')) {
        var ss = $('#send_obj_members_direct').val();
        ss += data.memberId + ',';
        $('#send_obj_members_direct').val(ss);
      }

      var tmpl = document.getElementById(
        'coupon_select_members_list_templete').innerHTML;
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

    $('[name="sign-member-a-input"][value="' +
      $(this).parent().attr('data-id') + '"]').
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

    $('[name="sign-member-a-input_group"][value="' +
      $(this).parents('.main-item-b_group').attr('id') + '"]').
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
      members_title += '<a href=\'#\'  class=\'main-item \'>' +
        $(this).attr('data-empty-msg') + '</a> ';
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
      members_title += '<a href=\'#\'  class=\'main-item main-item-a_group\'>' +
        $(this).attr('data-empty-msg') + '</a> ';
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
    data.stores_number = $(this).
      parents('tr').
      find('[name="stores_number"]').
      val();

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
        $('#checked_date').
          html(assign_rule.substring(0, assign_rule.length - 1));
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
        $('#checked_date').
          html(assign_rule.substring(0, assign_rule.length - 1));
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
  $('#coupon_submit').on('click', function() {
    //如果有效期类型是秒杀时间，则进行验证
    if ($('[name=validity_type]:checked').val() == 4) {
      var flag = _checkDate();
      if (flag == false) {
        return false;
      }
    }
    require(['coupon'], function(coupon) {

      coupon.saveCoupon();
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

/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */
/* -- 工具js 请保持在最下面 -- */

/* -- 工具js 请保持在最下面 -- */

function setRules() {
  // 设置折扣格式校验
  var discount = function(value, element, param) {
    var rule = /^(0\.[1-9]|[1-9](\.[0-9])?)$/;
    return rule.test(value);
  };

  $.validate.setRule('discount', discount,
    '打多少折只支持一位小数，在0.1~9.9之间，8.5折即为原价的85%');

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

/**
 * 获取URL中的参数
 * @param name
 * @returns {null}
 */
function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}
