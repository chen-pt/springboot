/**
 * Created by xipaeng on 2017/9/5.
 */
var ACCOUNT = {};
var page_total = 0;
var pagesize = 0;
var total = 0;

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
    var now = new Date(new Date().getTime() - 86400000);
    var monthweekdate = new Date(now-30*24*3600*1000);
    var nowStr=now.format("yyyy-MM-dd");
    var monthweekdateStr = monthweekdate.format("yyyy-MM-dd");
    $("#pay_start_time").val(monthweekdateStr);
    $("#pay_end_time").val(nowStr);

    // this.ajaxGetList(1);
    this.even();
  },/*

ACCOUNT.GetNum = {
  init: function () {
    this.ajaxGetList(1);
    this.even();
  },*/
  even: function () {
    $("#search").on("click", function () {
      ACCOUNT.GetNum.ajaxGetList(1);
    });
  },
  ajaxGetList: function (pageNum) {
    pageNum = pageNum || 1;
    var pageSize = 15;
    var datas = {
      "merchantName": $("input[name=merchant_name]").val(),
      "merchantId": $("input[name=merchant_id]").val(),
      "payStartTime": $("#pay_start_time").val(),
      "payEndTime": $("#pay_end_time").val(),
      /*"remitStartTime": $('input[name=remit_start_time]').val(),
      "remitEndTime": $('input[name=remit_end_time]').val(),*/
      "pageNum": pageNum,
      "pageSize": pageSize,
    };
    var payStartTime=$('input[name=pay_start_time]').val();
    var payEndTime=$('input[name=pay_end_time]').val();
    if(payStartTime>payEndTime){
      layer.msg("开始时间不能大于结束时间");
      return false;
    }
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_collect",
      data: datas,
      dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        console.log(data);
        ACCOUNT.total=document.total;
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#detail-list").append(doTtmpl(data));
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
      }
    });
  }
};

//跳转到结算明细表
function  toSettlementDetail(siteId) {
  var payStartTime=$("#pay_start_time").val();
  var payEndTime=$("#pay_end_time").val();
  window.open(href="/jk51b/account_detail?siteId="+siteId+"&payStartTime="+payStartTime+"&payEndTime="+payEndTime);
}

//跳转到商家账单
function  toMerchantFinances(siteId) {
  var payStartTime=$("#pay_start_time").val();
  var payEndTime=$("#pay_end_time").val();
  window.open(href="/jk51b/account_list?siteId="+siteId+"&payStartTime="+payStartTime+"&payEndTime="+payEndTime);
}

//跳转到划账表
function  toRemitDetail(siteId) {
  // var remitStartTime=$("#remit_start_time").val();
  // var remitEndTime=$("#remit_end_time").val();
  var remitStartTime=$("#pay_start_time").val();
  var remitEndTime=$("#pay_end_time").val();
  window.open(href="/jk51b/account_remit?siteId="+siteId+"&remitStartTime="+remitStartTime+"&remitEndTime="+remitEndTime);
}

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
});
