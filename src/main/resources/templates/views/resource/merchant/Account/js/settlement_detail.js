/**
 * Created by zw on 2017/3/21.
 */

var ACCOUNT = {};

var page_total = 0;
var pagesize = 0;
var total = 0;
var pagination_totals=0;



  $(function () {

    ACCOUNT.init();
  });

Date.prototype.format = function(format){
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(), //day
    "h+" : this.getHours(), //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter
    "S" : this.getMilliseconds() //millisecond
  }

  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
}
ACCOUNT.GetNum = {
  init: function () {
    // this.ajaxGetList();
    this.even();
  },
  even: function () {
    $(document).keyup(function(event){
      if(event.keyCode ==13){
        ACCOUNT.GetNum.ajaxGetList();
      }
    });

    $("#search").on("click", function () {
      $("#dd").remove();
      pagination_page_no = 1;
      ACCOUNT.GetNum.ajaxGetList();
    });
    $("#account_status li").on("click",function(){
        var className = $(this)[0].className;
        var val_=$(this).attr('value');
        if(className!="active"){
          $("#account_status").find('li').removeClass("active");
          $(this).addClass("active");
          $("#summary_status").val(val_);

          pagination_page_no = 1;
          ACCOUNT.GetNum.ajaxGetList();
        }
    });

    $("#check_select_table li").on("click",function () {
      var className=$(this)[0].className;
      if(className!="active"){
        $("#account_status").find('li').removeClass("active");
        if($(this).index()==0){
          post("/merchant/account/settlement_detail",{"type":0})
        }else if($(this).index()==1){
          post("/merchant/account/settlement_detail",{"type":1})
        }else if($(this).index()==2){
          post("/merchant/account/settlement_detail",{"type":2})
        }
      }
    });


  },



  addPrefix : function(m){
    return m<10?'0'+m:m;
  },
  getLocalTime: function(timeStamp){ //时间转换函数可以公用
    var time = new Date(timeStamp);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+ACCOUNT.GetNum.addPrefix(m)+'-'+ACCOUNT.GetNum.addPrefix(d)+' '+ACCOUNT.GetNum.addPrefix(h)+':'+
      ACCOUNT.GetNum.addPrefix(mm)+':'+ACCOUNT.GetNum.addPrefix(s);
  },
  ajaxGetList: function () {
    select_summary_status();

    var datas = {
      "select_type":"by_order",
      "tradesId": $('input[name=trades_id]').val(),
      "financeNo": $('input[name=finance_id]').val(),
      "payType": $("#pay_style").find("option:selected").val(),
      "settlementStatus": $("#summary_status").find("option:selected").val(),
      "orderStartTime" : $("#create_start_time").val(),//todo
      "orderEndTime" : $("#create_end_time").val(),
      "dealStartTime": $('#over_start_time').val(),
      "dealEndTime": $('#over_end_time').val(),
      "paymentStartTime": $('#pay_start_time').val(),
      "paymentEndTime": $('#pay_end_time').val()
    };

    var isCount = false;
    if(!document.cachedCond || JSON.stringify(document.cachedCond) != JSON.stringify(datas)){
      document.cachedCond = datas;
      isCount = true;
    }
    datas.count = isCount;
    datas.pageNum = pagination_page_no;
    datas.pageSize = pagination_pagesize;

    $("#account_table").html('');
    AlertLoading($("#account_table"));
    $.ajax({
      type: 'post',
      url: "get_settlement_detail_list",
      data: datas,
      dataType: 'json',
      success: function (data) {
        pagination_pages = data.pages;
        pagination_totals = data.total;
          console.log(data.items);


        var tmpl = document.getElementById('accountList').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#account_table").html(doTtmpl(data));

        $("#pagediv").html("<span class='pageinfo'></span>")
        addpage( ACCOUNT.GetNum.ajaxGetList);

      }
    });
  }
};

ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {
    "select_type":"by_order",
    "pageNum": pageNum,
    "pageSize": 15,
    "tradesId": $('input[name=trades_id]').val(),
    "payType": $("#pay_style").find("option:selected").val(),
    "settlementStatus": $("#summary_status").find("option:selected").val(),
    "orderStartTime" : $("#create_start_time").val(),//todo
    "orderEndTime" : $("#create_end_time").val(),
    "dealStartTime": $('#over_start_time').val(),
    "dealEndTime": $('#over_end_time').val(),
    "paymentStartTime": $('#pay_start_time').val(),
    "paymentEndTime": $('#pay_end_time').val(),
    "financeNo": $('input[name=finance_id]').val(),
    "count": true
  };
  //params.count = true;
  return params;
}

ACCOUNT.query = function(pageNum){
  var params = ACCOUNT.getQueryCondition(pageNum);
  var result;
  //$.post('get_settlement_detail_list', {params:params}, callback, 'json');
  $.ajax({
    type: 'post',
    url: "get_settlement_detail_list",
    data: params,
    async:false,
    dataType: 'json',
    success: function (data) {
      result=data;
      // total = data.total;
      // ACCOUNT.total=document.total;
      // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total,ACCOUNT.GetNum.ajaxGetList);
      //
      // var tmpl = document.getElementById('accountList').innerHTML;
      // var doTtmpl = doT.template(tmpl);
      // $("#account_table").append(doTtmpl(data));
      // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
    }
  })
};


ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {

  ACCOUNT.init();
});



function select_summary_status(){
  $("#dd").remove();
  var _v = $("#summary_status").val();
  $("#account_status").find('li').removeClass("active");
  if(_v == ''){
    $("#account_status").find('li').eq(0).addClass("active");
  }else if(_v == '100'){
    $("#account_status").find('li').eq(4).addClass("active");
  }else if(_v == '150'){
    $("#account_status").find('li').eq(3).addClass("active");
  }else if(_v == '200'){
    $("#account_status").find('li').eq(2).addClass("active");
  }else if(_v == '250'){
    $("#account_status").find('li').eq(1).addClass("active");
  }else{
    $("#account_status").find('li').eq(0).addClass("active");
  }
};

function post(url, params) {
  var temp = document.createElement("form"); //创建form表单
  temp.action = url;
  temp.method = "post";
  temp.style.display = "none";//表单样式为隐藏
  for (var item in params) {//初始化表单内部的控件
    //根据实际情况创建不同的标签元素
    var opt =document.createElement("input");  //添加input标签
    opt.type="text";   //类型为text
    opt.id = item;      //设置id属性
    opt.name = item;    //设置name属性
    opt.value = params[item];   //设置value属性
    temp.appendChild(opt);
  }

  document.body.appendChild(temp);
  temp.submit();
  return temp;
};

/*导出报表*/
ACCOUNT.query = function(pageNum){
  var params = ACCOUNT.getQueryCondition(pageNum);
  var result;
  //$.post('get_settlement_detail_list', {params:params}, callback, 'json');
  $.ajax({
    type: 'post',
    url: "get_settlement_detail_list",
    data: params,
    async:false,
    dataType: 'json',
    success: function (data) {
      result=data;
    }
  })
  return result;
};
/*
ACCOUNT.query = function(pageNum,callback){
  var params = ACCOUNT.getQueryCondition(pageNum);
  $.post('get_settlement_detail_list', params, callback);
};*/

/*导出报表*/
$(document).ready(function () {
  $('[name=search]').bind('click', function () {
    settle.query(1, settle.fill);
  })
  $('[name=exportBtn]').bind('click',function(){
    var tips;
    var resp=ACCOUNT.query(0);
      if (!resp.total || resp.total == 0) {
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      } else if (parseInt(resp.total) > 2000) {
        tips = '<p id="result-tips">根据本次查询条件,共查询到<span style="color: red" id="row_span">'+resp.total+'</span>条记录，已超过&nbsp;2000&nbsp;条<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出2000条，超过时请分批次下载</p>';
      } else {
        // var params = ACCOUNT.getQueryCondition();
        tips = '<p id="result-tips">根据本次查询条件，共查询到' + resp.total + '条结果,' +
            '<a onclick="export_by_account_order();" > 请点击下载</a></p>';
           /* '<a href="export_by_order?' + $.param(params) + '" target="_blank"> 请点击下载</a></p>';*/
      }
    $("#modal_body").html(tips);
    $("#export-dialog").modal("show");

  });

});
function export_by_account_order(){
    var params = ACCOUNT.getQueryCondition(1);
    console.log(params);
    var form = $("<form>");//定义一个form表单
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    for (var i in params) {
        form.append('<input type="hidden" name="' + i + '" value="' + params[i] + '" >');
    }
    console.log(form);
    form.attr("action", "/merchant/account/export_by_order");
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
}
