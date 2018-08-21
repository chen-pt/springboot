/**
 * Created by Administrator on 2017/4/18.
 */

var curPage = 1;
var totalNum = 0;
var pageSize = 15;

/**
 * 初始化动作
 */
$(function () {

  $("title").html("推荐人奖励");

  getReferrerAccountList();

  /**
   *搜索
   */
  $("#search_btn").click(function (){

    curPage=1;
    totalNum = 0;
    pageSize = 15;
    getReferrerAccountList();

  })

  /**
   * 改变个数
   */
  $(document).on('change', '.page_size_select',function () {

    curPage=1;
    totalNum = 0;
    pageSize = $(this).val();

    getReferrerAccountList();

  })

})

function getReferrerAccountList() {

  // AlertLoading($('#referrer_account_list'));

  var username = $('#username').val();

  if(username==undefined || username == "" || username == null){
    username = undefined;
  }

  $.post("/merchant/recommend/referrerAccountList",{
    username : username,
    pageIndex : curPage,
    pageSize : pageSize,
  },function (result) {

    // $('#referrer_account_list').html();

    if(result.code == 1 || result.code == "1" || result.code == "success"){

      if( result.data.page.count < 1 ){

        $("#referrer_account_list").html('<tr><td colspan="8" style="text-align:center;">该商户下未查询到相应分销商奖励。。。</td></tr>');

      }else {

        //商户推荐总计
        var rewardTotal = result.data.rewardTotal;

        $('#recevied_money').text(parseFloat(rewardTotal.rewardCount/100.0).toFixed(2));
        $('#pay_money').text(parseFloat(rewardTotal.expenditureCount/100.0).toFixed(2));
        $('#remainder_money').text(parseFloat(rewardTotal.remainingCount/100.0).toFixed(2));

        //推荐奖励List生成
        var page = result.data.page;

        var data = page.data;

        var accountListHtml = '';

        for (var i = 0; i < data.length; i++) {

          var account = data[i];

          accountListHtml += ("<tr>" +
            "<td>" + account.distributorId + "</td>" +
            "<td>" + account.mobile + "</td>" +
            "<td>" + (parseFloat(account.rewardCount/100.0).toFixed(2)) + "</td>" +
            "<td>" + (parseFloat(account.expenditureCount/100.0).toFixed(2)) + "</td>" +
            "<td>" + (parseFloat(account.remainingCount/100.0).toFixed(2)) + "</td>" +
            "</tr>")
        }

        $('#referrer_account_list').html(accountListHtml);

        //添加页面页码

        totalNum = page.count;

        $('#referrer_account_list').append('<tr><td colspan="8"><span class ="pageinfo" style="float: right"></span></td></tr>');

        $('.pageinfo').pagination({
          pages: page.pageCount,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getReferrerAccountList();
          }
        });
        getNum();
      }

    }else{
      $("#referrer_account_list").html('<tr><td colspan="8" style="text-align:center;">请刷新重试或联系客服。。。。。。。。。。。</td></tr>');
    }


  })

}

function getNum(){

  $('.pageinfo').find('span:contains(共)').append("<span id='record_total_num'>(" + totalNum + "条记录)</span>");

  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select">';

  $.each(pagearr, function(){

    if(this==pageSize)
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });

  pageselect = pageselect+'</select>&nbsp;';

  $('.pageinfo').find('span:contains(共)').prepend(pageselect);
}

function AlertLoading(dom){

  dom.parent().css('position','relative');
  //dom给需要的标签内 加 效果
  var load =
    '<div class="sk-circle" style="position: absolute; top: 50%;left: 50%;">'+
    '<div class="sk-circle1 sk-child"></div>'+
    '<div class="sk-circle2 sk-child"></div>'+
    '<div class="sk-circle3 sk-child"></div>'+
    '<div class="sk-circle4 sk-child"></div>'+
    '<div class="sk-circle5 sk-child"></div>'+
    '<div class="sk-circle6 sk-child"></div>'+
    '<div class="sk-circle7 sk-child"></div>'+
    '<div class="sk-circle8 sk-child"></div>'+
    '<div class="sk-circle9 sk-child"></div>'+
    '<div class="sk-circle10 sk-child"></div>'+
    '<div class="sk-circle11 sk-child"></div>'+
    '<div class="sk-circle12 sk-child"></div>'+
    '</div>';
  dom.append(load);   //loading追加到tbody之后

}
