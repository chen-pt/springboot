/**
 * Created by boren on 15/7/10.
 */
require.config({
  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'member': 'service/member',
    'clerk' : 'service/clerk'
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
    case '/member/index':initMember();break;
    case '/member/addmember':initAddMember();break;

  }

});



/*=============会员管理=============*/

function initMember()
{
  require(['member'], function (member){

    member.showMembers('default',1);

  });
}
/**
 * 搜索
 */
function index_search()
{
  require(['member'], function (member){

     member.showMembers('search',1);
  });
}
/**
 * 查找所有会员
 */
function index_allsearch()
{
  require(['member'], function (member){

    member.showMembers('allsearch',1);
  });

}


/*=============会员编辑=============*/

function initAddMember() {
  require(['member'], function (member) {

    member.editMemberInfo();
    $(document).on('click', '#add_sure', function () {
      var isClick = false;
      return function () {
        if (!isClick) {
          require(['member'], function (member) {
            isClick = true;
            var result = member.EditMember();
            if (typeof result === 'object' && $.isFunction(result.always)) {
              result.always(function () {
                isClick = false;
              });
            } else {
              isClick = false;
            }
          });
        }
      }
    }());
  });
}

/**
 * 发验证码
 */
function addmember_sendvcode()
{
  require(['member'], function (member){

      member.sendSignCode();
  });

}
/**
 * 提交
 */
function addmember_Commit()
{
  var isClick = false;

  if (! isClick) {
    return function() {
      require(['member'], function (member){
        isClick = true;
        var result = member.EditMember();
        if (typeof result === 'object' && $.isFunction(result.always)) {
          result.always(function() {
            isClick = false;
          });
        } else {
          isClick = false;
        }
      });
    }();
  }
}
/**
 * 检查用户名
 */
function addmember_checkuser()
{
  require(['member'], function (member){

    var mobile = $('#member_mobile').val();

    member.checkUser(mobile);

  });
}
/**
 * 添加标签
 * @param lable
 */
function selectTable(obj)
{
  var txt = obj.innerHTML;

  txt = txt.replace(/<.+?>/g,'');

  var tag = $('#member_tag').val();
  //是否存在注释
  var index = txt.indexOf('（');
  if(index > 0)
  {
    txt = txt.substr(0,index);
  }
  console.log(txt);
  //是否存在
  var find_index = tag.indexOf(txt);

  if(!(find_index>=0))
  {
    if(tag.length>0)
    {
      $('#member_tag').val(tag+','+txt);
    }else{
      $('#member_tag').val(txt);
    }

  }

}

/**
 *页码选择
 */
function select_pages(opt,status)
{
  require(['member'], function (member) {

    var page_size = $('#page_size').val();

    member.setPageSize(page_size);

    member.showMembers(opt,1);

  });
}

//选择会员按钮
//调配店员
$(document).on('click','.clerk_selected,.invite_btn',function() {
  $("#clerkList-modal").modal("show");

  require(['clerk'], function (clerk){
    clerk.showClerks('search',1);
  });
});

//选则店员确定
$(document).on('click','.clerk_select_ok',function () {
  var invite_code = $(this).siblings().val();
  $("#clerkList-modal").modal("hide");
  $('#invite_code').val(invite_code)
});
