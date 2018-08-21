$(document).ready(function () {

  selectRefundList(1);
});
function selectRefundList(pageNo,pageSize) {
  pageNo = pageNo || 1;
  pageSize  = 15;
  $("#preorder_table").html("");
  var traderOrMember=$("[name='traderOrMember']").val();
  var data = {
    "sellerName":$("[name='sellerName']").val(),
    "tradeId":$("[name='tradeId']").val(),
    "refundSerialNo":$("[name='refundSerialNo']").val(),
    "refundStatus":$("[name='refundStatus']").val(),
    // "reason":$("input[name='reason']:checked").text(),
    "reason":$("#reason").find("option:selected").text(),
    "createTimeStart":$("[name='createTimeStart']").val(),
    "createTimeEnd":$("[name='createTimeEnd']").val(),
    "pageNum":pageNo,
    "pageSize":pageSize
  };
  if(traderOrMember==1){
    data.tradeId=$("[name='str']").val();
  }else{

  }
  AlertLoading($('#preorder_table'));
  $.ajax({
    type: 'post',
    url: '/jk51b/refundList',
    data: data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      $("#preorder_table").empty();
      var tmpl=document.getElementById('refund_list').innerHTML;
      //alert(data.result.length);
      for(var i=0;i<data.result.length;i++){
        data.result[i].createTime=format(data.result[i].createTime);
        if(data.result[i].refundTime!=null){
          data.result[i].refundTime=format(data.result[i].refundTime);
        }
      }

      var doTtmpl=doT.template(tmpl);
      $("#preorder_table").append(doTtmpl(data));
      var pageno = data.pageInfo.pageNum;
      var page_total = data.pageInfo.pages;
      var pagesize = data.pageInfo.pageSize;
      var total = data.pageInfo.total;
      pageInfo($('#pageinfo'), pageno, page_total, pagesize, total, selectRefundList);
    },
    error: function () {
      console.log("error ....");
    }
  });
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
      callback(num, pagesize);
    }
  });
  $pagein.find('span:contains(共)').append("(" + total + "条记录)");
};
Date.prototype.toLocaleString = function () {
  return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};


function refundDetail() {

  $.ajax({
    type: 'post',
    url: '/store/refundDetail',
    data: data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
    },
    error: function () {
      console.log("error ....");
    }
  });
}
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
