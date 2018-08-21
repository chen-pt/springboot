define(['common', 'core/pagin'], function(YBZF, pagin) {
  'use strict';
  var __obj = {};
  var defaultConfig = {
    UEDITOR_HOME_URL: YBZF.hostname + '/source/js/ueditor/',
    serverUrl: YBZF.hostname + '/Ueditor/index',
    elementPathEnabled: false,
    maximumWords: 100,
    toolbars: [[
      'source', 'undo', 'redo', 'bold', 'indent', 'italic', 'underline', 'strikethrough', 'horizontal', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist',
      'emotion', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'simpleupload', 'imagenone', //默认
      'imageleft', //左浮动
      'imageright', //右浮动
      'imagecenter',
      'drafts'
    ]]
  };
  __obj.init = function(config) {
    config = $.extend(defaultConfig, config);
    UE.getEditor('editor', config);
  };

  __obj.getList = function(pageno) {
    YBZF.services({
      'url': YBZF.hostname + '/faq/answersList',
      'data': {
        id: $('#q_no').val()
      }
    }).done(function(rsp) {
      if (rsp.status && rsp.result.items.length) {
        var html = $('#answers-list-temp').html();
        rsp.result.pagesize = 10;
        html = $.tmpl(html, rsp.result);
        $('#answers-List').find('li:not(:eq(0))').remove().end().append(html);
        pagin('#aw-pagin', pageno, rsp.result.total_pages, null, null, __obj.getList);
      }
    });
  };

  // 回复问题
  __obj.reply = function(data) {
    return YBZF.services({
      'url': YBZF.hostname + '/faq/answer',
      'data': data
    });
  };

  return __obj;
});