/**
 * Created by Administrator on 2015/11/19.
 */
require.config({
  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'helpful': 'service/helpful'
  }
});

/**
 * 初始化
 */
$(function () {

  require(['core'], function (core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();

  });

  /**
   * 路由
   * @type {string}
   */
  var url =  window.location.pathname;
  switch (url)
  {
    case '/helpful/index':initHelpful();break;
    case '/helpful/detail':initDetail();break;
    case '/helpful/question':initQuestion();break;
    case '/helpful/reply':initAnswer();break

  }

});


/**
 * 问题列表
 ***/
function initHelpful() {

  require(['helpful'],function(helpful) {

    helpful.showHelpful();

  });
}

/*
* 我要提问
* */
function initQuestion() {

   require(['helpful'],function(helpful)  {

     AnswerEvents();

     // 提交问题
    $(document).on('click', '#btn-question', function() {
      helpful.showQuestion();
    });

  });
}

/**
 *页码选择
 */
function select_pages(opt,status)
{
  require(['helpful'],function(helpful)  {

    var page_size = $('#page_size').val();

    helpful.setPageSize(page_size);

    helpful.showHelpful(opt,status,1);

    helpful.showAnswersList(opt,status,1);

  });
}

/*
* 问题搜索
* **/
function index_searchHelpful() {
  require(['helpful'],function(helpful)  {

    helpful.showHelpful('search','all',1);

  });
}

/*
* 回复列表
* **/
function initDetail() {

  require(['helpful'],function(helpful)  {

    helpful.showDetail();

    helpful.showAnswersList();

  });

}

/*
* 回复问题
* **/
function initAnswer() {

  require(['helpful'],function(helpful)  {

    AnswerEvents();
    // 回复问题
    $(document).on('click', '#btn-answer', function() {
      helpful.showAnswer();

    });

  });
}


function AnswerEvents(){

    //图片上传
    document.getElementById('input_file').addEventListener('change', NoticeNewHandleFileSelect, false);
}

function NoticeNewHandleFileSelect(evt)
{
    require(['helpful'], function (helpful) {

        var img_url =  helpful.newhandleFileSelect(evt);


        KindEditor.ready(function(K) {
            var editor = K.editor({
                allowFileManager : true
            });
            K.insertHtml("#simple","<img src='"+img_url+"' />");
        });

    });
}



