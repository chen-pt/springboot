/**
 * Created by zw on 2017/03/10.
 */
var ACCOUNT = {};

var page_total = 0;
var pagesize = 0;
var total = 0;
var params={};


ACCOUNT.GetNum = {
    settings: {
        // modalID: '#modal-slider',
    },
    init: function () {
        this.ajaxGetList(1);
        this.even();
    },
    even: function () {
        $("#search").on('click', function () {
            ACCOUNT.GetNum.ajaxGetList(1);
        });


    },
    ajaxGetList: function (pageno) {
        var pageSize = 15;
        pageno = pageno || 1;


        var datas = {
        "merchantNum": $("input[name=merchant_id]").val(),
        "name": $("input[name=seller_name]").val(),
        "bilStatus": $('#invoice option:selected').val(),
        "examineStatus": $('#audit_status option:selected').val(),
        "settlementStatus": $('#status option:selected').val(),
        "sPayment": $("input[name=total_pay_start]").val(),
        "ePayment": $("input[name=total_pay_end]").val(),
        "bilNum": $("input[name=account_number]").val(),
        "sOutDate": $("input[name=out_date_start]").val(),
        "eOutDate": $("input[name=out_date_end]").val(),
        "sActualDate": $("input[name=pay_date_start]").val(),
        "eActualDate": $("input[name=pay_date_end]").val(),
        "financeDate": $("input[name=pay_day_start]").val(),
        "financeDateEnd": $("input[name=pay_day_end]").val(),
        "settlementType": $("#account_type").val()

      }

      var isCount = false;
      if(!document.cachedCond || document.cachedCond != JSON.stringify(datas)){
        //window.cachedCond = JQuery.extends(true,{},datas);
        document.cachedCond = JSON.stringify(datas);
        isCount = true;
      }

      datas.count = isCount;
      datas.pageNum= pageno;
      datas.pageSize=pageSize;
      console.log(datas);
      $("#detail-list").html('');
      AlertLoading($('#account-list'));
        $.ajax({
            type: 'post',
            url: "get_account_list",
            dataType: 'json',
            data:datas,
            success: function (data) {
              $("#account-list").empty();
              var page_total,pagesize,total;
              if(data.value.pages){

                document.pages = data.value.pages;
                document.total = data.value.total;
              }

                  page_total = data.value.pages;
                  pagesize = data.value.pageSize;
                 ACCOUNT.total = data.value.total;

                  // pageInfo($('.pageinfo'), pageno, page_total, pagesize,ACCOUNT.total, ACCOUNT.GetNum.ajaxGetList);
                  var tmpl = document.getElementById('accountList').innerHTML;
                  var doTtmpl = doT.template(tmpl);
                  $("#account-list").html(doTtmpl(data.value));
              pageInfo($('.pageinfo'), pageno, page_total, pagesize,ACCOUNT.total, ACCOUNT.GetNum.ajaxGetList);
            }
        });
      // $(document).ready(function(){
        $.ajax({
          async: true,
          type: "POST",
          data:datas,
          url: "update_charge_off",
        });
      // });
    },

};


ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {
    "merchantNum": $("input[name=merchant_id]").val(),
    "name": $("input[name=seller_name]").val(),
    "bilStatus": $('#invoice option:selected').val(),
    "examineStatus": $('#audit_status option:selected').val(),
    "settlementStatus": $('#status option:selected').val(),
    "sPayment": $("input[name=total_pay_start]").val(),
    "ePayment": $("input[name=total_pay_end]").val(),
    "bilNum": $("input[name=account_number]").val(),
    "sOutDate": $("input[name=out_date_start]").val(),
    "eOutDate": $("input[name=out_date_end]").val(),
    "sActualDate": $("input[name=pay_date_start]").val(),
    "eActualDate": $("input[name=pay_date_end]").val(),
    "financeDate": $("input[name=pay_day_start]").val(),
    "financeDateEnd": $("input[name=pay_day_end]").val(),
    "settlementType": $("#account_type").val()
  };

  return params;
}
//修改审核状态
var finance_no = "";
function save_finance_no(obj){

  $("#auditStatuId option:first").prop("selected", 'selected');
  $("#remarkId").val("");
  finance_no=$(obj).data("id");
  $("#sellerName").html($(obj).data("name")=='undefined'?'':$(obj).data("name"));
}

function modifyAuditStatus(id){
  var audit_status=$("#auditStatuId").val();
  if(audit_status==undefined||audit_status==''||audit_status==null){
   alert("请选择审核状态！");
    return;
  }

  $.ajax({
    type: 'post',
    url: "update_account_status",
    dataType: 'json',
    async:false,
    data: {
      finance_no:finance_no,
      audit_status:audit_status,
      audit_remark:$("#remarkId").val()
    },
    success: function (data) {

      if (data.code == "000") {
          alert(data.value);
        $('#checkOut').modal('hide');
        $("#search").click();
      }
    }
  });
}

//结算查询
function getAuditIdfo(obj){

  var param=$(obj).data("id");
  for(var i=1;i<=8;i++){
    $("#label"+i).html("");
  }
  $("#formInfo input[type='text']").val("");
  $("#jieSuanStatus option:first").prop("selected","selected");
  $("#financeRemark").val("");
  $("#radioId").removeAttr("checked");

  $.ajax({
    type: 'post',
    url: "get_merchant_account_statement_detail",
    dataType: 'json',
    data:param,
    success: function (data) {
      console.log(data);
      if (data.code == "000") {
        $("#label1").html(data.value.merchant_name);
        $("#label2").html(data.value.bank_name);
        $("#label3").html(data.value.seller_names);
        $("#label4").html(data.value.bank_id);
        $("#label5").html(((data.value.total_pay==null?0:data.value.total_pay)-data.value.spendingAcount-data.value.refund_total-data.value.real_pay)/100+"元");
        $("#label6").html(data.value.beneficiary_party);
        $("#label7").html(data.value.invoice_value/100);
        $("#label8").html(data.value.merchant_remark);
        $("#financeNoId").val(data.value.finance_no);
        $("#label9").val(data.value.status);
        $("input[name='invoice_number']").val(data.value.invoice_number);
        $("input[name='pay_date']").val(data.value.pay_date);
        $("input[name='invoice_time']").val(data.value.invoice_time);
        $("input[name='express_number']").val(data.value.express_number);
        $("input[name='express_type']").val(data.value.express_type);
        $("#financeRemark").val(data.value.remark);
        if(data.value.invoice==1){
          $("#radioId").attr("checked","checked");
        }
        if(data.value.status==900){
          $("#payMoney").attr("disabled","disabled");
          $('#jieSuanStatus').attr("disabled","disabled").find("option[value='900']").attr("selected",true);
        }else{
          $("#payMoney").removeAttr("disabled");
          if(data.value.status<=100&&data.value.audit_status==130){
            $('#jieSuanStatus').removeAttr("disabled").find("option[value='100']").attr("selected",true);
          }else{
            $('#jieSuanStatus').removeAttr("disabled").find("option[value='"+data.value.status+"']").attr("selected",true);
          }
        }
      }
    }
  });
}
//结算修改
function updateInvoice(obj){
  var payMoney=$("#payMoney").val();
  var label9=$("#label9").val();
  var jieSuanStatus=$("#jieSuanStatus").val();
  /*var reg = new RegExp("^[0-9]*$");*/
  if(isNaN(payMoney)){
    alert("支付金额格式有误(支付金额不能小于0)!");
    return;
  }
  if(label9!=900&&(payMoney==undefined||payMoney=='')){
    alert("请输入本次支付金额！");
    return;
  }
  if(jieSuanStatus==undefined||jieSuanStatus==''){
    alert("请选择结算状态！");
    return;
  }
  $.ajax({
    type: 'post',
    url: "updateInvoice",
    dataType: 'json',
    data:$("#formInfo").serializeArray(),
    success: function (data) {

      if (data.code == "000") {
        alert(data.value);
        $('#jiesuanId').modal('hide');
        $("#search").click();
      }else{
        alert(data.message);
      }
    }
  });
}

ACCOUNT.init = function () {
    ACCOUNT.GetNum.init();
};

$(function () {
    ACCOUNT.init();
});

/*导出报表*/

var settle = {};

// settle.getQueryCondition = function (pageNum) {
params = {
  "merchantNum": $("input[name=merchant_id]").val(),
  "name": $("input[name=seller_name]").val(),
  "bilStatus": $('#invoice option:selected').val(),
  "examineStatus": $('#audit_status option:selected').val(),
  "settlementStatus": $('#status option:selected').val(),
  "sPayment": $("input[name=total_pay_start]").val(),
  "ePayment": $("input[name=total_pay_end]").val(),
  "bilNum": $("input[name=account_number]").val(),
  "sOutDate": $("input[name=out_date_start]").val(),
  "eOutDate": $("input[name=out_date_end]").val(),
  "sActualDate": $("input[name=pay_date_start]").val(),
  "eActualDate": $("input[name=pay_date_end]").val(),
  "financeDate": $("input[name=pay_day_start]").val(),
  "financeDateEnd": $("input[name=pay_day_end]").val(),
  "settlementType": $("#account_type").val()
}
// }
console.log(params);

$(document).ready(function () {
  $('[name=search]').bind('click', function () {
    settle.query(1, settle.fill);
  })
  $('[name=exportBtn]').bind('click', function () {
    var tips;
    if (ACCOUNT.total == 0) {

      tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
    } else if (ACCOUNT.total > 1000) {
      tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">' + ACCOUNT.total  + '</span>条，已超过1000条的最大值<br>请修改查询条件，分批次下载。</p>';
      tips += '<p style="color: orange">*每次最多可以导出1000条，超过时请分批次下载</p>';
    } else {
    var params=ACCOUNT.getQueryCondition();
      tips = '<p id="result-tips">根据本次查询条件，共查询到' + ACCOUNT.total  + '条结果,<a href="export_by_account?' +$.param(params) + '" target="_blank"> 请点击下载</a></p>';
    }
    $("#modal_body").html(tips);
    $("#export-dialog").modal("show");
  });
});

//查看详情
function openDetail(financeNo,siteId) {
  window.open(href="account_statement_detail?financeNo="+financeNo+"&siteId="+siteId);
}

function openDetails(financeNo) {
  window.open(href="/jk51b/account_detail?financeNo="+financeNo);
}





function billBatch() {
  // var startTime=$("#startTime").val();
  var endTime=$("#endTime").val();
  var siteId=$("#siteId").val();
  if(endTime==''||endTime==undefined){
    alert("请输入账单结束日期以便出账！");
    return;
  }
  if(siteId==''||siteId==undefined){
    alert("请输入待出账的商家编号！");
    return;
  }

  var data ={
    // "startTime":$("#startTime").val(),
    "endTime":endTime,
    "siteId":siteId
  }

  if(confirm("商家编号："+siteId+", 账单结束日期："+endTime+", 确定要出账么？")){
    $.ajax({
      type: 'post',
      url: "batchBill",
      data: data,
      dataType: 'json',
      success: function (data) {
        if (data.code == "000") {
          alert(data.value);
        }else{
          alert(data.message);
        }
      }
    });
  }

}

/**
 * 核对账单
 */
function financesRecalculate() {

  var financesNo=$("#financesNo").val();
  if(financesNo==''||financesNo==undefined){
    alert("请输入账单编号！");
    return;
  }

  var data ={
    "type":"select",
    "financesNo":financesNo
  }

  if(confirm("账单编号："+financesNo+"\r\n 确定要重新核算么？")){
    $.ajax({
      type: 'post',
      url: "financesRecalculate",
      data: data,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        if (data.code == "000") {
    var msg="本期总收入："+((data.value.total_pay-data.value.refund_total)/100).toFixed(2)+"\r\n 本期总支出："+((data.value.commission_total+data.value.platform_total+data.value.post_total)/100).toFixed(2)
            +"\r\n本期应付总计："+((data.value.total_pay-data.value.refund_total-data.value.commission_total-data.value.platform_total-data.value.post_total)/100).toFixed(2)
            +"\r\n确认修改账单么？";
            if(confirm(msg)){
              updateFinances(financesNo);
            }
          $("#search").click();
        }else{
          alert(data.message);
        }
      }
    });
  }

}

/**
 * 确定修改账单
 * @param financesNo
 */
function updateFinances(financesNo) {

  var data ={
    "type":"update",
    "financesNo":financesNo
  }

  $.ajax({
    type: 'post',
    url: "updateFinances",
    data: data,
    dataType: 'json',
    success: function (data) {

      if (data.code == "000"){
        alert(data.value);
      }else {
        alert(data.message);
      }
    }
  });
}
