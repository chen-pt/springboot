!(function() {
  // 结算明细
  'use strict';
  var YBZF, pagin, currentPageno;
  var DetailModule = function(services) {
    YBZF = services;
    if( ! (this instanceof DetailModule) ) {
      return new DetailModule(YBZF);
    }

    this.ybzf = YBZF;
  };
  define(['services', 'pagin', 'sui'], function(YBZF, __pagin) {
    pagin = __pagin;
    return new DetailModule(YBZF);
  });

  // 页面加载时的初始化操作
  DetailModule.prototype.init = function() {
    // 操作
    $(document).on('click', '.status-opt', checkInfo);
    // 搜索
    $(document).on('click', '#search', function() {
      getList(1);
    });

    this.getData(1);
  };

  // 根据条件获取数据
  function getList (pageno) {
    pageno = pageno || 1;
    currentPageno = pageno;
    var pagesize = $('.page-size-sel').val() || 15;
    // 商家名称
    var data = $('.search-form').serializeArray();
    console.log(data);
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'name': 'pagesize', 'value': pagesize});
    YBZF.services({
      'url': YBZF.hostname + '/account/getSettlementList',
      'data': data
    }).done(function(rsp) {
      var html = $('#detail-row-temp').html();
      rsp.trades_id = $('#trades_id').val();
      html = $.tmpl(html, rsp);
      var $list = $('#detail-list').empty().append(html);

      pagin('#pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
      if (rsp.status) {
        if (rsp.result.total_items < 1001) {
          data = data.filter(function(field) {
            if (field.name === 'pageno' || field.name === 'pagesize') {
              return false;
            }

            return field.value !== '';
          });
          var tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，<a href="/export/accountDetail?' + $.param(data) + '"">点击下载</a>';
        } else {
          tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，已超过1000条的最大值<br />请修改查询条件，分批次下载。';
        }

        $list.find('tr').each(function(k, v) {
          $(this).data('record', rsp.result.items[k])
        });


        $('#result-tips').empty().append(tipsHtml);
      } else {
        $('#result-tips').empty().append('没有查询到数据');
      }

    });
  }
  DetailModule.prototype.getData = getList;

  /**
   * 对账状态
   */
  function checkInfo() {
    var $activeRecord = $(this).parents('tr');
    var status = $activeRecord.find('.record-status').data('status');
    var remark = $activeRecord.find('.record-remark').val();
    var settlement_id = $activeRecord.find('.settlement_id').val();

    var history = [];
    //查询对账历史记录
    YBZF.services({
      'type':'post',
      url:YBZF.hostname + '/account/accountCheckList',
      'data': {"settlement_id":settlement_id}
    }).done(function (rsp) {

      if(rsp.status){

        var data = $activeRecord.data('record').datas;

        // history = $.extend(rsp.result, data);
        history = rsp.result.items;
      }

      var html = $.tmpl($('#info-temp').html(), {
        'status': status,
        'settlement_id': settlement_id,
        'remark': remark,
        'history':history
      });

      var $modal = $.alert({
        'backdrop': 'static',
        'width': 'normal',
        'title': '结算',
        'hasfoot': false,
        'body': html
      });
      $modal.on('click', '.detail-change', function() {
        var data = $('.change-record-form').serializeArray();
        YBZF.services({
          'url': YBZF.hostname + '/account/accountCheck',
          'data': data
        }).done(function(rsp) {
          $modal.modal('hide');
          layer.msg(rsp.result.msg);
          $activeRecord.hide(1000, function() {
            getList(currentPageno);
          });
        });
        return false;
      });
    });

  }

})();