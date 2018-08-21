/**
 * Created by zw on 2017/3/22.
 */

var ACCOUNT = {};

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
      ACCOUNT.GetNum.ajaxGetList();
    });
    $("#account_status li").on("click",function(){
      var className = $(this)[0].className;
      var val_=$(this).attr('value');
      if(className!="active"){
        $("#account_status").find('li').removeClass("active");
        $(this).addClass("active");
        $("#summary_status").val(val_);
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

    $('[name=exportBtn]').bind('click',function(){
      var resp=ACCOUNT.query(0);
      var tips;
      if(!resp.total || resp.total == 0){
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      }else if(parseInt(resp.total) > 2000){
        tips = '<p id="result-tips">根据本次查询条件,共查询到<span style="color: red" id="row_span">'+resp.total+'</span>条记录，已超过&nbsp;2000&nbsp;条<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出2000条，超过时请分批次下载</p>';
      }else{
        // var params = ACCOUNT.getQueryCondition(0);
        // tips = '<p id="result-tips">根据本次查询条件，共查询到'+resp.total+'条结果,<a href="export_by_user?'+$.param(params)+'" target="_blank"> 请点击下载</a></p>';

        tips = '<p id="result-tips">根据本次查询条件，共查询到' + pagination_totals + '条结果,' +
          '<a onclick="export_by_user();" > 请点击下载</a></p>';
      }
      $("#modal_body").html(tips);
      $("#export-dialog").modal("show");


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
  ajaxGetList: function (pageno) {
    select_summary_status();
    pageno = pageno || 1;
    var pageSize = 15;

    var datas = {
      "select_type":"by_user",
      "tradesId": $('input[name=trades_id]').val(),
      "financeId": $('input[name=finance_id]').val(),
      "storeUserName": $('input[name=storeUserName]').val(),
      "storeUserCard": $('input[name=storeUserCard]').val(),
      "payType": $("#pay_style").find("option:selected").val(),
      "refundStatus": $("#refund_status").find("option:selected").val(),//todo
      "settlementStatus": $("#summary_status").find("option:selected").val(),
      "orderStartTime" : $("#create_start_time").val(),//todo
      "orderEndTime" : $("#create_end_time").val(),
      "dealStartTime": $('#settled_start_time').val(),
      "dealEndTime": $('#settled_end_time').val(),
      "paymentStartTime": $('#pay_start_time').val(),
      "paymentEndTime": $('#pay_end_time').val()
    };
    var isCount = false;
    if(!document.cachedCond || JSON.stringify(document.cachedCond) != JSON.stringify(datas)){
      document.cachedCond = datas;
      isCount = true;
    }

    datas.pageNum = pagination_page_no;
    datas.pageSize = pagination_pagesize;
    datas.count = isCount;
    console.log(datas);
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

        for(var i = 0; i< data.items.length ; i++){
          if(data.items[i]['pay_style']=="NULL"){
            data.items[i]['pay_style']="---";
          }

          switch (data.items[i]['pay_style']){
            case 'wx':
              data.items[i]['pay_style'] = "微信";
              break;
            case 'ali':
              data.items[i]['pay_style'] = "支付宝";
              break;
            case 'bil':
              data.items[i]['pay_style'] = "快钱";
              break;
            case 'unionPay':
              data.items[i]['pay_style'] = "银联";
              break;
            case 'health_insurance':
              data.items[i]['pay_style'] = "医保";
              break;
            case 'cash':
              data.items[i]['pay_style'] = "现金";
              break;
          }
          /*switch (data.items[i]['settlement_status']){
            case 100:
              data.items[i]['settlement_status'] = "不结算";
              break;
            case 150:
              data.items[i]['settlement_status'] = "待结算";
              break;
            case 200:
              data.items[i]['settlement_status'] = "可结算";
              break;
            case 250:
              data.items[i]['settlement_status'] = "已结算";
              break;
          }*/
          data.items[i]['order_create_time'] = ACCOUNT.GetNum.getLocalTime(data.items[i]['order_create_time']);
          data.items[i]['end_time'] = ACCOUNT.GetNum.getLocalTime(data.items[i]['end_time']);
          data.items[i]['pay_time'] = ACCOUNT.GetNum.getLocalTime(data.items[i]['pay_time']);
        }
        var tmpl = document.getElementById('accountList').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#account_table").html(doTtmpl(data));

        addpage( ACCOUNT.GetNum.ajaxGetList);

      },
      error : function(data){
        console.log('系统异常');
      }
    });
  }
};

function export_by_user(){
  var params = ACCOUNT.getQueryCondition(0);
  console.log(params);
  var form = $("<form>");//定义一个form表单
  form.attr("style", "display:none");
  form.attr("target", "");
  form.attr("method", "post");
  for (var i in params) {
    form.append('<input type="hidden" name="' + i + '" value="' + params[i] + '" >');
  }
  console.log(form);
  form.attr("action", "/merchant/account/export_by_user");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};


ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {

    "select_type":"by_user",
    "pageNum": pageNum,
    "pageSize": 15,
    "tradesId": $('input[name=trades_id]').val(),
    "storeUserName": $('input[name=storeUserName]').val(),
    "financeId": $('input[name=finance_id]').val(),
    "storeUserCard": $('input[name=storeUserCard]').val(),
    "financeId": $('input[name=finance_id]').val(),
    "payType": $("#pay_style").find("option:selected").val(),
    "settlementStatus": $("#summary_status").find("option:selected").val(),
    "orderStartTime" : $("#create_start_time").val(),//todo
    "orderEndTime" : $("#create_end_time").val(),
    "dealStartTime": $('#settled_start_time').val(),
    "dealEndTime": $('#settled_end_time').val(),
    "paymentStartTime": $('#pay_start_time').val(),
    "paymentEndTime": $('#pay_end_time').val(),
    "count": true
  };
  //params.count = true;
  return params;
};

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
}

function pageInfo(container, pageno, page_total, pagesize, total, callback) {
  pageno = pageno || 1;
  if (!('object' === typeof(container))) {
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
    onSelect: function (num) {
      $pagein.find('span:contains(共)').append("(" + total + "条记录)");
      callback(num);
    }
  });
  $pagein.find('span:contains(共)').append("(" + total + "条记录)");
}


