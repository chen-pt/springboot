
var settle = {};

settle.getQueryCondition = function (pageNum) {
  var params = {
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
    'refundAmountStart' : $('[name=refundAmountStart]').val(),
    'refundAmountEnd' : $('[name=refundAmountEnd]').val()
  };

  var isCount = false;
  if(!document.cachedCond || document.cachedCond != JSON.stringify(params)){
    //window.cachedCond = JQuery.extends(true,{},datas);
    document.cachedCond = JSON.stringify(params);
    isCount = true;
  }

  //如果是导出必须是true
  if(pageNum==0){
    params.isCount=true;
  }else{
    params.isCount=isCount;
  }

  params.pageNum=pageNum;
    params.pageSize=10;
  return params;
}
settle.query = function(pageNum,callback){
  var params = settle.getQueryCondition(pageNum);
  $.post('querySettlementDetail', {params: JSON.stringify(params)}, callback, 'json');
};

settle.pagination = function(size,total_pages,current_pages) {
  if(size == 0){
    $(".pageinfo").modal('hide');
    return;
  }
  // 清空缓存的配置
  $("#page").data('sui-pagination', '');
  $('.pageinfo').pagination({
    pages: total_pages,
    styleClass: ['pagination-large'],
    showCtrl: true,
    displayPage: 6,
    currentPage: current_pages,
    onSelect: function(pageNum){
      settle.query(pageNum,settle.fill);
    }
  })
};

settle.fill = function (resp) {
  if (resp.code != '000') {
    alert('请求失败');
    return;
  }
  $("#tbody").children().remove();
  var doTtmpl = doT.template($('#template').html());
  $("#tbody").append(doTtmpl(resp.value));
  settle.pagination(resp.value.size,resp.value.pages,resp.value.pageNum);
};


$('[name=search]').bind('click',function(){
  settle.query(1,settle.fill);
});

$(document).ready(function () {
  //settle.query(1,settle.fill);


  settle.query(1,settle.fill);

  $('[name=exportBtn]').bind('click',function(){
    settle.query(0,function(resp){
      var tips;
      if(!resp.value.total || resp.value.total == 0){
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      }else if(parseInt(resp.value.total) > 1000000){
        tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">'+resp.value.total+'</span>条，已超过1000条的最大值<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出1000条，超过时请分批次下载</p>';
      }else{
        var params = settle.getQueryCondition(0);
        tips = '<p id="result-tips">根据本次查询条件，共查询到'+resp.value.total+'条结果,<a href="export?'+$.param(params)+'" target="_blank"> 请点击下载</a></p>';
      }
      $("#modal_body").html(tips);
      $("#export-dialog").modal("show");

    });

  });

});
