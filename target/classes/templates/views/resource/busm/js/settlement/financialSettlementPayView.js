/**
 * Created by zw on 2017/3/21.
 */

var SETTLE = {};

var page_total = 0;
var pagesize = 0;
var total = 0;

$(function () {
 /* var now = new Date();
  var oneweekdate = new Date(now-7*24*3600*1000);
  var nowStr = now.format("yyyy-MM-dd");
  var oneweekdateStr = oneweekdate.format("yyyy-MM-dd");
  $("#pay_day_start").val(oneweekdateStr);
  $("#pay_day_end").val(nowStr);*/
  SETTLE.GetNum.even();
});
SETTLE.GetNum = {
  init: function () {
    this.ajaxGetList(1);
    this.even();
  },
  even: function () {
    $("[name=search]").on("click", function () {
      SETTLE.GetNum.ajaxGetList(1);
    });


    $('[name=exportBtn]').bind('click',function(){
      var resp=SETTLE.query(0);
      var tips;
      if(!resp.value.total || resp.value.total == 0){
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      }else if(parseInt(resp.value.total) > 2000){
        tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">'+resp.value.total+'</span>条，已超过2000条的最大值<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出2000条，超过时请分批次下载</p>';
      }else{
        var params = SETTLE.getQueryCondition(0);
        var exportType=$(this).attr("value");
        params.exportType=exportType;
        // tips = '<p id="result-tips">根据本次查询条件，共查询到'+resp.value.total+'条结果,<a href="export?'+$.param(params)+'" target="_blank"> 请点击下载</a></p>';
        tips = '<p id="result-tips">根据本次查询条件，共查询到' + resp.value.total + '条结果,' +
          '<a onclick="export_51();" > 请点击下载</a></p>';
      }

      $("#modal_body").html(tips);
      $("#export-dialog").modal("show");


    });
  },

  ajaxGetList: function (pageno) {1
    pageno = pageno || 1;
    var pageSize = 10;

    var params = {
      'data_type': 0,
      'merchantId': $('[name=merchantId]').val(),
      'sellerName': $('[name=sellerName]').val(),
      'sellerId': $('[name=sellerId]').val(),
      'payStyle': $('[name=payStyle]').val(),
      'accountCheckingStatus': $('[name=accountCheckingStatus]').val(),
      'payCheckingStatus': $('[name=payCheckingStatus]').val(),
      'refundCheckingStatus': $('[name=refundCheckingStatus]').val(),
      'tradesId': $('[name=tradesId]').val(),
      'payNumber': $('[name=payNumber]').val(),
      'payAmountStart' : $('[name=payAmountStart]').val(),
      'payAmountEnd' : $('[name=payAmountEnd]').val(),
      'pay_time_start':$('[name=payTimeStart]').val(),
      'pay_time_end':$('[name=payTimeEnd]').val(),
      'finance_no' :$('[name=financeNo]').val()
    };

    var isCount = false;
    if(!window.cachedCond || JSON.stringify(window.cachedCond) != JSON.stringify(params)){
      window.cachedCond = params;
      isCount = true;
    }
    params.count = isCount;
    params.pageNum=pageno;
    params.pageSize=pageSize;

    AlertLoading($("#tbody"));
    $.ajax({
      type: 'post',
      url: "querySettlementDetailPallet",
      data: {params: JSON.stringify(params)},
      dataType: 'json',
      success: function (data) {
        console.log(data);
        $("#tbody").empty();
        page_total = data.value.pages;
        pagesize = data.value.pageSize;
        total = data.value.total;
        // pageInfo($('#pageinfo'), pageno, page_total, pagesize, total, SETTLE.GetNum.ajaxGetList);

        var tmpl = $('#template').html();
        var doTtmpl = doT.template(tmpl);
        $("#tbody").append(doTtmpl(data.value));
        pageInfo($('#pageinfo'), pageno, page_total, pagesize, total, SETTLE.GetNum.ajaxGetList);
      }
    });
  }
};

SETTLE.getQueryCondition = function (pageNum) {
  var params = {
    'merchantId': $('[name=merchantId]').val(),
    'data_type': 0,
    'payStyle': $('[name=payStyle]').val(),
    'payCheckingStatus': $('[name=payCheckingStatus]').val(),
    'tradesId': $('[name=tradesId]').val(),
    'payNumber': $('[name=payNumber]').val(),
    'payAmountStart' : $('[name=payAmountStart]').val(),
    'payAmountEnd' : $('[name=payAmountEnd]').val(),
    'pay_time_start':$('[name=payTimeStart]').val(),
    'pay_time_end':$('[name=payTimeEnd]').val(),
    'finance_no' :$('[name=financeNo]').val(),
    'exportType':'second'
  };

  var isCount = false;
  if(!window.cachedCond || JSON.stringify(window.cachedCond) != JSON.stringify(params)){
    window.cachedCond = params;
    isCount = true;
  }
  params.count = isCount;
  params.pageNum=pageNum;
  params.pageSize=10;

  return params;
}

SETTLE.query = function(pageNum){
  var params = SETTLE.getQueryCondition(pageNum);
  var result;
  //$.post('get_settlement_detail_list', {params:params}, callback, 'json');
  $.ajax({
    type: 'post',
    url: "querySettlementDetailPallet",
    data: {params: JSON.stringify(params)},
    async:false,
    dataType: 'json',
    success: function (data) {
      result=data;
    }
  })
  return result;
};
function export_51(){
  var params = SETTLE.getQueryCondition(0);
  console.log(params);
  var form = $("<form>");//定义一个form表单
  form.attr("style", "display:none");
  form.attr("target", "");
  form.attr("method", "post");
  for (var i in params) {
    form.append('<input type="hidden" name="' + i + '" value="' + params[i] + '" >');
  }
  console.log(form);
  form.attr("action", "/jk51b/settle/export");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}


SETTLE.init = function () {
  SETTLE.GetNum.init();
};


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

//修改对账状态
function getAccountStatus(id) {
  $("#remarkId").val("");
  $("#statusId").val(id);
}
function modifyStatus(id){
  var param={
    account_checking_status:$("#accountStatus").val(),
    id:$("#statusId").val(),
    remark:$("#remarkId").val()
  };
    console.log('修改对账状态id：'+id);
    $.ajax({
      type: 'post',
      url: "update_check_status",
      dataType: 'json',
      async:false,
      data:param,
      success: function (data) {

        if (data.code == "000") {
          alert(data.value);
          $('#accountCheck').modal('hide');
          $("#search").click();
        }
      }
    });
}

