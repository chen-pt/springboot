$(document).ready(function () {
  selectRefundList();
  //回车搜索
});
$(document).keyup(function(event){
  if(event.keyCode ==13){
    selectRefundList();
  }
});
function selectRefundList() {

  $("#preorder_table").empty();
  AlertLoading($("#preorder_table"));
  var traderOrMember = $("[name='traderOrMember']").val();
  var data = {
    "refundType": $("[name='refundType']").val(),
    "refundStatus": $("[name='refundStatus']").val(),
    "createTimeStart": $("[name='createTimeStart']").val(),
    "createTimeEnd": $("[name='createTimeEnd']").val(),
    "pageNum": pagination_page_no,
    "pageSize": pagination_pagesize
  };
  if (traderOrMember == 1) {
    data.tradeId = $("[name='str']").val();
  } else {
    data.mobile = $("[name='str']").val();
  }
  $.ajax({
    type: 'post',
    url: '/merchant/refundList',
    data: data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      if (data.pageInfo != null) {
        pagination_pages = data.pageInfo.pages;
        pagination_totals = data.pageInfo.total;
      }

      var tmpl = document.getElementById('refund_list').innerHTML;
      //alert(data.result.length);
      if (data.result!=null) {
        for (var i = 0; i < data.result.length; i++) {
          data.result[i].createTime = format(data.result[i].createTime);
          if (data.result[i].refundTime != null) {
            data.result[i].refundTime = format(data.result[i].refundTime);
          }
        }
        var doTtmpl = doT.template(tmpl);
        $("#preorder_table").html(doTtmpl(data));

      }
      addpage(selectRefundList);
    },
    error: function () {
      console.log("error ....");
    }
  });
}

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
function add0(m) {
  return m < 10 ? '0' + m : m
}
function format(shijianchuo) {
//shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
