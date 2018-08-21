!(function() {
  'use strict';

  define(['common','core/pagin', 'sui'], function(YBZF,pagin) {
    function getList(pageno) {
      var data = $('#search-form').serializeArray();
      data.push({'name': 'pageno', 'value': pageno});
      var pagesize = $('.page-size-sel').val() || 15;
      data.push({'name': 'pagesize', 'value': pagesize});
      YBZF.services({
        'url': YBZF.hostname + '/account/getCheckList',
        'data': data
      }).done(function(rsp) {
        var html = $.tmpl($('#check-account-list-temp').html(), rsp);
        var $listContainer = $('#check-account-list');
        $listContainer.empty().append(html);
        if (rsp.result.total) {
          pagin('#check-pagin', pageno, null, pagesize, rsp.result.total, getList);
          $('#check-pagin').show();
        } else {
          $('#check-pagin').hide();
        }

        if (rsp.status) {
          if (rsp.result.total < 1001) {
            data = data.filter(function(field) {
              if (field.name === 'pageno' || field.name === 'pagesize') {
                return false;
              }

              return field.value !== '';
            });
            var tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total + '</span>条，<a href="/export/financeCheck?' + $.param(data) + '"">点击下载</a>';
          } else {
            tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total + '</span>条，已超过1000条的最大值<br />请修改查询条件，分批次下载。';
          }

          $('#result-tips').empty().append(tipsHtml);

          // 绑定数据
          $listContainer.find('tr').each(function(idx) {
            $(this).data('record', rsp.result.items[idx]);
          });
        } else {
          $('#result-tips').empty().append('没有查询到数据');
        }
      })
    }

    // 更新记录
    function updateRecord() {
      var data = $('#modify-handle-status-form').serializeArray();

      return YBZF.services({
        'url': YBZF.hostname + '/account/recordCheckAccount',
        'data': data
      });
    }

    $('#search-form').on('submit', function() {
      getList(1);
    });

    $(document).on('click', '.handle-status', function () {
      var data = $(this).parents('tr').data('record');

      // 获取修改历史
      YBZF.services({
        'url': YBZF.hostname + '/account/getCheckAccountLog',
        'data': {
          'id': data.id
        }
      }).done(function(rsp) {
        if (rsp.status) {
          data.historys = rsp.result.historys;
          // 填坑了
          var mark = '';
          for(var i = 0; i < data.historys.length; i++) {
            if (data.historys.hasOwnProperty(i)) {
              var optinfo = JSON.parse(data.historys[i].remark);
              if (optinfo.mark) {
                mark = optinfo.mark;
                break;
              }
            }
          }
          data.mark = mark;
        }
        
        var html = $.tmpl($('#modify-template').html(), data);

        var $modal = $.alert({
          body: html,
          width: 'normal',
          title: '结算',
          hasfoot: false
        });

        $modal.on('click', '#update-record', function() {
          updateRecord().done(function(rsp) {
            layer.msg(rsp.result.msg, function() {
              $modal.modal('hide');
              getList(1);
            });
          });
        });
      });
    });

    getList(1);
  });
})();
