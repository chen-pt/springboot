define([], function() {
  'use strict';

  $.fn.pagination.Constructor.prototype = $.extend($.fn.pagination.Constructor.prototype, {
    _drawCtrl: function() {
      var tpl = '';

      if (this.pageSize && this.itemsCount) {
        var $pageSizeSel = $('<select class="page-size-sel"></select>');
        var sizeArr = [15, 30, 50, 100];
        for(var i in sizeArr) {
          var item = '<option value="' + sizeArr[i] + '"' + (this.pageSize == sizeArr[i] ? 'selected' : '') + '>' + sizeArr[i] + '</option>';
          $pageSizeSel.append(item);
        }

        // 添加下拉框
        tpl += $pageSizeSel.prop('outerHTML');

        tpl += '<div>&nbsp;' +
            (this.displayInfoType == 'itemsCount'? '<span>共' + this.itemsCount + '条</span>&nbsp;' :'<span>共' + this.pages + '页</span>&nbsp;') +
            '(' + this.itemsCount + '条记录)' +
            '<span>' + '&nbsp;到&nbsp;' + '<input type="text" class="page-num"/><button class="page-confirm">确定</button>' + '&nbsp;页' + '</span>' + '</div>';
      } else {
        tpl = '<div>&nbsp;' + (this.displayInfoType == 'itemsCount'? '<span>共' + this.itemsCount + '条</span>&nbsp;' :'<span>共' + this.pages + '页</span>&nbsp;') +
              '<span>' + '&nbsp;到&nbsp;' + '<input type="text" class="page-num"/><button class="page-confirm">确定</button>' + '&nbsp;页' + '</span>' + '</div>';
      }

      return tpl;
    },
    updateConfig: function(options) {
      // TODO 先只能更新一个
      options.pageSize && (this.pageSize = options.pageSize);
    }
  });

  /**
   * 翻页
   * @param container mixed 翻页容器
   * @param pageno int 当前页
   * @param page_total int 总页数
   * @param pagesize int 每页显示多少条
   * @param total int 总记录数
   * @param callback function 回调方法
   * @param args 参数
   */
  return function(container, pageno, page_total, pagesize, total, callback, args) {
    pageno = pageno || 1;
    page_total = page_total || 1;
    if(! page_total) {
      // TODO 验证值
      page_total = Math.ceil(total / pagesize);
    }

    if( ! ('object' === typeof(container)) ) {
      var $pagein = $(container);
    } else {
      $pagein = container;
    }
    // 清空缓存的配置
    $pagein.data('sui-pagination', '');
    $pagein.pagination({
      pages: page_total,
      styleClass: ['pagination-large', 'pagination-right'],
      showCtrl: true,
      displayPage: 6,
      pageSize: pagesize,
      itemsCount: total,
      currentPage: pageno,
      onSelect: callback
    });

    //更新分页数
    $pagein.pagination('updatePages', ~~page_total, ~~pageno);

    if(! $pagein.data('evt-init')) {
      // 只绑定一次
      $pagein.on('change', '.page-size-sel', function() {
        $pagein.pagination('updateConfig', {pageSize: +this.value});
        // FIXME 重新获取下数据
        callback(1);
      });
      $pagein.data('evt-init', 1);
    }
  }
});