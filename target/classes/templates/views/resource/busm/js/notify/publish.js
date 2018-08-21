define(['common', 'sui'], function(YBZF) {
  'use strict';

  var __obj, publish;

  __obj = {};
  publish = {};

  var defaultConfig = {
    UEDITOR_HOME_URL: YBZF.hostname + '/source/js/ueditor/',
    serverUrl: YBZF.hostname + '/Ueditor/index',
    elementPathEnabled: false,
    maximumWords: 500,
    toolbars: [[
      'source', 'undo', 'redo', 'bold', 'indent', 'italic', 'underline', 'strikethrough', 'horizontal', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist',
      'emotion', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'simpleupload', 'imagenone', //默认
      'imageleft', //左浮动
      'imageright', //右浮动
      'imagecenter',
      'drafts'
    ]]
  };

  publish.init = function(config, successHandle) {
    config = $.extend(defaultConfig, config);
    if(! UE) {
      throw '没有引入UE';
    }

    UE.getEditor('editor', config);

    // 增加验证规则
    $.validate.setRule('version', function(value, $element, param) {
      return /^v(\d+\.){1,4}\d+\w?$/.test(value);
    }, '请输入正确的版本号');

    // 开启表单验证
    $('#publish-form').validate({
      'success': successHandle
    });
  };

  publish.send = function(data) {
    return YBZF.services({
      'url': YBZF.hostname + '/notify/sendgg',
      'data': data
    });
  };

  publish.del = function(id) {
    return YBZF.services({
      'url': YBZF.hostname + '/notify/delgg',
      'data': {
        'id': id
      }
    });
  };

  __obj.publish = publish;

  return __obj;
});