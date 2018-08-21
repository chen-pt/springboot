require([
  'common',
  'core/pagin',
  'issue/answers'
], function(YBZF, pagin, Answers) {
  // 意见反馈
  'use strict';
  $(document).on('submit', '#search-issue-form', function() {
   getIssueList(1);
    return false;
  });

  /**
   * 获取问题列表
   */
  function getIssueList(pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    var data = $('#search-issue-form').serializeArray();
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'name': 'pagesize', 'value': pagesize});
    // 搜索
    YBZF.services({
      'url': YBZF.hostname + '/faq/getList',
      'data': data
    }).done(function(rsp) {
      var html = $('#issue-record-temp').html();
      html = $.tmpl(html, rsp);
      $('#issue-list').empty().append(html);

      // 翻页
      pagin('#issue-pagin', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getIssueList);
    });
  }

  // 回复
  $(document).on('click', '#reply', function() {
    var q_no = $('#q_no').val();
    var q_content = UE.getEditor('editor').getContent();
    Answers.reply({
      'q_no': q_no,
      'q_content': q_content
    }).done(function(rsp) {
      if(rsp.status) {
        layer.msg('回复成功');
        Answers.getList(1);
      } else {
        layer.msg(rsp.result.msg);
      }
    });
  });

  // init
  $(function() {
    switch(location.pathname) {
      case '/site/issue':
        getIssueList(1);
        break;
      case '/site/issueAnswersList':
        if($('#editor').size()) {
          Answers.init();
        }
        Answers.getList(1);
        break;
      case '/site/handleaw':
        initHandleawPage();
    }
  });

  // 处理问题页面
  function initHandleawPage() {
    Answers.init();
    $('#aw-form').validate({
      'success': function($form) {
        if (! UE.getEditor('editor').hasContents()) {
          layer.msg('回复内容不能为空');
          return;
        }
        var data = $form.serializeArray();
        Answers.reply(data).done(function(rsp) {
          if(rsp.status) {
            layer.msg('操作成功', function() {
              //location.href = '/site/issue';
              history.back();
            });
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      }
    })
  }

});