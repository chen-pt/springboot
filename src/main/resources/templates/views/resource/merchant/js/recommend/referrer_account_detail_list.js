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

  $("title").html("推荐人奖励明细");

  getReferrerAccountDetailList();

  /**
   *搜索
   */
  $("#search_btn").click(function (){

    curPage=1;
    totalNum = 0;
    pageSize = 15;
    getReferrerAccountDetailList();

  })

  /**
   * 改变个数
   */
  $(document).on('change', '.page_size_select',function () {

    curPage=1;
    totalNum = 0;
    pageSize = $(this).val();

    getReferrerAccountDetailList();

  })

})

function getReferrerAccountDetailList() {

  // AlertLoading($('#referrer_account_list'));

  var username = isExist($('#distributor').val());
  var type = isExist($('#type').val());
  var startTime = isExist($('#start_time').val());
  var endTime = isExist($('#end_time').val());


  $.post("/merchant/recommend/referrerAccountDetailList", {

    username : username,
    type : type,
    startTime : startTime,
    endTime : endTime,
    pageIndex : curPage,
    pageSize : pageSize,
  }, function (result) {

    // $('#referrer_account_detail_list').html("");

    if (result.code == 1 || result.code == "1" || result.code == "success") {

      if (result.data.page.count < 1) {

        $("#referrer_account_detail_list").html('<tr><td colspan="11" style="text-align:center;">该商户下未查询到相应分销商奖励明细。。。</td></tr>');

      } else {

        //推荐奖励List生成
        var page = result.data.page;

        var data = page.data;

        var accountListDetailHtml = '';

        for (var i = 0; i < data.length; i++) {

          var accountDetail = data[i];

          accountListDetailHtml += ("<tr>"
          +"<td>"+accountDetail.distributorId+"</td>"
          +"<td>"+accountDetail.mobile+"</td>"
          +"<td>"+(accountDetail.type == 1
            ? ("奖励</td>"+"<td>+"+(parseFloat(accountDetail.changeMoney/100.0).toFixed(2))+"</td>")
            : "提现</td>"+"<td>"+(parseFloat(accountDetail.changeMoney/-100.0).toFixed(2))+"</td>")
          +"<td>"+0+"</td>"
          +"<td>"+parseFloat(accountDetail.changeMoney/100.0).toFixed(2)+"</td>"
          +"<td>"+parseFloat(accountDetail.remainingMoney/100.0).toFixed(2)+"</td>"
          +"<td>"+ formatTime(accountDetail.updateTime,"yyyy-MM-dd hh:mm:ss") +"</td>"
          +"<td>"+ ((accountDetail.status == 1 && accountDetail.type == 2 ) ? "待处理</td><td><button data-toggle='modal' data-target='#myModal' data-keyboard='false' " +
            "style='font-weight: 600 ; color: #00b7ee' onclick='getAccount("+accountDetail.id + "," + accountDetail.distributorId +")'>财务处理</button></td>"
            : (accountDetail.status == 2 ? "成功</td><td>- - - -</td>" : "失败</td><td>- - - -</td>" ))
          + "</tr>");

        }

        $('#referrer_account_detail_list').html(accountListDetailHtml);

        //添加页面页码
        totalNum = page.count;

        $('#referrer_account_detail_list').append('<tr><td colspan="11"><span class ="pageinfo" style="float: right;margin: 0;"></span></td></tr>');

        $('.pageinfo').pagination({
          pages: page.pageCount,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getReferrerAccountDetailList()
          }
        });
        getNum();
      }

    } else {
      $("#referrer_account_detail_list").html('<tr><td colspan="11" style="text-align:center;">暂无数据</td></tr>');
    }


  })
}

function getAccount(recordId,distributorId){

    $("#recordId").remove();

    if(isEmpty(distributorId)){
      $('.modal-body').html('该用户账户异常，请刷新重试或联系客服');
      return;
    }else{
      $('.modal-body').html('');
    }

    $.post("/merchant/recommend/withdrawAccount",{
      recordId : recordId,
      distributorId : distributorId
    },function (result) {

      if(result.code == 1 || result.code == "1" || result.code == "success"){
        var body_account = '<table id="message"><tbody><tr><td width="100px" style="text-align: right">处理结果：　</td> <td><input type="radio" name="status" value="2"></td> <td>确认已打款给用户（成功）</td> </tr> <tr> <td>　</td> <td>　</td> <td style="color: red;">请确认已打款给用户后再操作</td> </tr> <tr> <td>　</td> <td><input type="radio" name="status" value="3"></td> <td>暂不打款（失败）</td> </tr> <tr> <td>　</td> <td>　</td> <td style="color: red;">对于有问题的记录，可以暂不打款</td> </tr> <tr> <td style="text-align: right">开户行：　</td> <td colspan="2" id="bank_name">'+result.data.bankName+'</td> </tr> <tr> <td style="text-align: right">银行卡号：　</td> <td colspan="2" id="account">'+result.data.account+'</td> </tr> <tr> <td style="text-align: right">开户人姓名：　</td> <td colspan="2" id="name">'+result.data.name+'</td> </tr> <tr> <td style="text-align: right"><br>处理说明：　</td> <td colspan="2">　</td> </tr> <tr> <td colspan="3"> <textarea name="" id="remark" cols="58" rows="10" maxlength="225" style="margin-left: 15px"></textarea> </td> </tr> </tbody> </table>';
        $('.modal-body').html(body_account);
        $('.modal-footer').html('<input type="hidden" value='+recordId+' id="recordId"><button type="button" data-ok="modal" onclick="moneyRecordOperation()" id="withdrawOp" class="sui-btn btn-primary btn-large">确认处理</button><button type="button" data-dismiss="modal" class="sui-btn btn-default btn-large">取消</button>');
      }else {
        $('.modal-body').html('该用户账户异常，请刷新重试或联系客服');
        $('.modal-footer').html('<button type="button" data-dismiss="modal" class="sui-btn btn-default btn-large">取消</button>');
      }

    })

}

function moneyRecordOperation(){

  var recordId = $('#recordId').val();
  var status = isExist($("input[name='status']:checked").val());
  var remark = $('#remark').val();

  if(recordId){

    $.post("/merchant/recommend/financeOperation",{
      id : recordId,
      status : status,
      remark : remark
    },function (result) {

      if (result.status == 200 && result.data == 1) {

        window.location.reload();

      }else if (result.status == 200 && result.data == 2 ) {
        alert("系统通信异常(2)，状态重复，请刷新重试或联系客服");
      } else if (result.status == 200 && result.data == 3 ) {
        alert("系统通信异常(3)，状态规则不符，请刷新重试或联系客服");
      } else if (result.status == 200 && result.data == 4 ) {
        alert("系统通信异常(4)，类型验证不通过，请刷新重试或联系客服");
      } else {
        alert("财务处理失败");
      }
    })
  }else {
    alert('该用户账户异常，请刷新重试或联系客服');
  }

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

function isExist(obj) {

  return isEmpty(obj) ? undefined : obj;

}

function isEmpty(val) {

  return val == undefined ||  val == null || val == "" ;

}

Date.prototype.pattern=function(fmt) {
  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

function formatTime(time,format) {

  if(time){
    try {
      var date = new Date(time);
      var paddNum = function(num){
        num += "";
        return num.replace(/^(\d)$/,"0$1");
      }
      //指定格式字符
      var cfg = {
        yyyy : date.getFullYear() //年 : 4位
        ,yy : date.getFullYear().toString().substring(2)//年 : 2位
        ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
        ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        ,d  : date.getDate()   //日 : 如果1位的时候不补0
        ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
        ,hh : paddNum(date.getHours())  //时
        ,mm : paddNum(date.getMinutes()) //分
        ,ss : paddNum(date.getSeconds()) //秒
      }
      format || (format = "yyyy-MM-dd hh:mm:ss");
      return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
    }catch (e){
      return time;
    }
  }else {
    return "";
  }
}
