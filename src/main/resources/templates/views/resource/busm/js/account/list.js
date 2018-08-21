!(function() {
  // 结算列表
  'use strict';
  var YBZF, pagin, currentPageno;
  var ListModule = function(YBZF) {
    if( ! (this instanceof ListModule) ) {
      return new ListModule(YBZF);
    }

    this.ybzf = YBZF;
  };
  define(['services', 'pagin', 'sui'], function(services, __pagin) {
    pagin = __pagin;
    YBZF = services;
    return new ListModule(services);
  });

  // 页面加载时的初始化操作
  ListModule.prototype.init = function() {
    // 操作
    $(document).on('click', '.status-opt', checkInfo);

    // 审核
    $(document).on('click', '.audit-opt', auditInfo);

    // 商家还没有确认 修改状态
    //$(document).on('click', '.status-tips', function() {
    //  layer.msg('商家还没有确认，不能进行结算操作');
    //});

    // 搜索
    $(document).on('click', '#search', function () {
      getList(1);
    });

    // region 默认最近的一个结算日
    var days = [1, 6, 11, 16, 21, 26];
    var now = new Date();
    var currentDay = now.getDate();
    days.push( currentDay );
    var lastCountDayIdx = days.sort(function(a, b) {
      return a - b;
    }).lastIndexOf(currentDay) - 1;
    now.setDate( days[ lastCountDayIdx ]);
    //$('#pay_day').datepicker('update', new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    // endregion
    this.getData();
  };

  // 根据条件获取数据
  function getList(pageno) {
    pageno = pageno || 1;
    currentPageno = pageno;
    //// 商家名称
    //var seller_name = $('#seller_name').val() || '';
    //// 商家编号
    //var site_id = $('#site_id').val() || '';
    //// 结算日
    //var pay_day = $('#pay_day').val();
    //// 佣金发票
    //var invoice = $("#invoice").val();
    //// 结算状态
    //var status = $('#status').val();
    //// 当前页数
    //var pageno = 1;
    //// 每页显示条数
    //var pagesize = 20;
    var pagesize = $('.page-size-sel').val() || 15;
    var data = $('.search-form').serializeArray();
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'name': 'pagesize', 'value': pagesize});
    YBZF.services({
      'url': YBZF.hostname + '/account/getFinanceList',
      'data': data
    }).done(function(rsp) {
      var html = $('#account-row-temp').html();
      html = $.tmpl(html, rsp);
      var $accountList = $('#account-list');
      $accountList.empty().append(html);
      pagin('#pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);

      // 将记录记录在元素上面
      if( rsp.status && rsp.result.items.length ) {
        $.each(rsp.result.items, function(idx) {
          $accountList.find('tr').eq(idx).data('record', {'datas': this});
        });

        if (rsp.result.total_items < 1001) {
          data = data.filter(function(field) {
            if (field.name === 'pageno' || field.name === 'pagesize') {
              return false;
            }

            return field.value !== '';
          });
          var tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，<a href="/export/accountSummary?type=1&' + $.param(data) + '"">点击下载</a>';
        } else {
          tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，已超过1000条的最大值<br />请修改查询条件，分批次下载。';
        }

        $('#result-tips').empty().append(tipsHtml);
      } else {
        $('#result-tips').empty().append('没有查询到数据');
      }
    });
  }

  ListModule.prototype.getData = getList;

  /**
   * 结算支付
   */
  function checkInfo() {
    var $activeRecord = $(this).parents('tr');
    var site_id = $activeRecord.find('.site_id').text().trim();
    var finance_id = $activeRecord.find('[name=finance_id]').val();
    // 获取商户信息
    YBZF.services({
      'url': YBZF.hostname + '/account/getBeneficiaryBank',
      'data': {
        'seller_id': site_id,
        'finance_id': finance_id
      }
    }).done(function(rsp) {
      if (rsp.status) {
        // 获取到了账户信息
        rsp.result.no_pay = $activeRecord.find('.no-pay').html().trim();
        rsp.result.finance_id = finance_id;
        var data = $activeRecord.data('record').datas;
        data = $.extend(rsp.result, data);

        var html = $.tmpl($('#info-temp').html(), data);
        var $modal = $.alert({
          'backdrop': 'static',
          'width': 'normal',
          'title': '结算',
          'hasfoot': false,
          'body': html
        });
        // 输入限制
        $('.autoNumeric').autoNumeric('init', {
          'aSep': ''
        });

        $modal.on('click', '.account-pay', function() {
          var settlement_status = $('#settlement_status').val();
          var actual_fee = $('#actual_fee').val();

          // region 验证
          if( ! actual_fee ) {
            layer.msg('本次支付金额不能为空');
            return;
          }

          if( ! $.isNumeric(actual_fee) ) {
            layer.msg('本次支付金额请输入数字');
            return;
          }

          if( ! settlement_status ) {
            layer.msg('请选择结算状态');
            return;
          }
          // endregion

          var data = $('#act-form').serializeArray();

          YBZF.services({
            'url': YBZF.hostname + '/account/settleAccounts',
            'data': data
          }).done(function(rsp) {
            if( rsp.status ) {
              $modal.modal('hide');
              layer.msg(rsp.result.msg);
              $activeRecord.hide(1000, function() {
                getList(currentPageno);
              });
            } else {
              layer.msg( rsp.result.msg );
            }
          });
        });
      }
    });
  }

  /**
   * 审核
   */
  function auditInfo() {
    var $activeRecord = $(this).parents('tr');
    var finance_id = $activeRecord.find('[name=finance_id]').val();
    var data = {
      'finance_id': finance_id,
      'status': $(this).siblings('.record-status').val()
    };
    data = $.extend($activeRecord.data('record').datas, data);
    var html = $.tmpl($('#audit-temp').html(), data);

    var $modal = $.alert({
      'backdrop': 'static',
      'width': 'normal',
      'title': '审核',
      'hasfoot': false,
      'body': html
    });

    // 显示的时候获取历史操作记录
    $modal.on('shown', getHistoryAuditLog);

    // 点击确认
    $modal.on('click', '.audit-check', function() {
      var finance_id = $('#finance_id').val();
      var audit_status = $('#audit_status').val();
      var audit_remark = $('#audit_remark').val();
      if (! audit_status) {
        layer.msg('请选择审核状态');
        return;
      }

      YBZF.services({
        'url': YBZF.hostname + '/account/auditCheck',
        'data': {
          'finance_id': finance_id,
          'audit_status': audit_status,
          'audit_remark': audit_remark
        }
      }).done(function(rsp) {
        if( rsp.status ) {
          $modal.modal('hide');
          layer.msg(rsp.result.msg);
          $activeRecord.hide(1000, function() {
            getList(currentPageno);
          });
        } else {
          layer.msg( rsp.result.msg );
        }
      });
    });
  }

  /**
   * 获取历史审核记录
   */
  function getHistoryAuditLog() {
    var $model = $(this);
    var finance_id = $('#finance_id').val();
    YBZF.services({
      'url': YBZF.hostname + '/account/getAuditLog',
      'data': {
        'finance_id': finance_id
      }
    }).done(function(rsp) {
      if (rsp.status) {
        var $history = $('#history');
        var elems = [];
        // 循环添加
        $.each(rsp.result.audit_history_list, function(k, v) {
          var html = '<p style="margin-bottom: 5px">$idx、$create_time，由 $name $remark</p>';
          html = html.replace('$idx', k + 1).replace('$create_time', v.create_time).replace('$name', v.operation_name).replace('$remark', v.remark);
          elems.push(html);
          // domCache.appendChild();
        });
        var domCache = $.buildFragment(elems, document);
        // 添加元素并且显示
        $history.append(domCache).fadeIn('slow');
      }
    });
  }

})();