/**
 * Created by tianwenlong on 2017/03/22.
 */

var ACCOUNT = {};
//修改审核状态
var finance_no = "";
function save_finance_no(obj){
  $("#auditStatuId option:first").prop("selected", 'selected');
  $("#remarkId").val("");
  finance_no=$(obj).data("id");
  $("#sellerName").html($(obj).data("name")=='undefined'?'':$(obj).data("name"));
}


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
    url: "/merchant/account/update_account_status",
    dataType: 'json',
    async:false,
    data: {
      change_130_time:new Date().valueOf(),
      finance_no:finance_no,
      audit_status:audit_status,
      merchant_remark:$("#remarkId").val()
    },
    success: function (data) {
      console.log(data);
      if (data.code == "000") {
        alert(data.value);
        $('#checkOut').modal('hide');
        $("#search").click();
      }
    }
  });
}

ACCOUNT.GetNum = {
    settings: {
        // modalID: '#modal-slider',
    },
    init: function () {
        this.ajaxGetList();
        this.even();
    },
    even: function () {
      $(document).keyup(function(event){
        if(event.keyCode ==13){
          ACCOUNT.GetNum.ajaxGetList();
        }
      });
        $("#search").on('click', function () {
            ACCOUNT.GetNum.ajaxGetList(1);
        });
    },
    ajaxGetList: function () {

        $("#account-list").html('');
       AlertLoading($("#account-list"));
        $.ajax({
            type: 'post',
            url: "get_merchant_account_list",
            dataType: 'json',
            data: {
                merchantNum: $("input[name=merchant_id]").val(),
                name: $("input[name=seller_name]").val(),
                bilStatus: $('#invoice option:selected').val(),
                examineStatus: $('#audit_status option:selected').val(),
                settlementStatus: $('#status option:selected').val(),
                sPayment: $("input[name=total_pay_start]").val(),
                ePayment: $("input[name=total_pay_end]").val(),
                bilNum: $("input[name=account_number]").val(),
                sOutDate: $("input[name=out_date_start]").val(),
                eOutDate: $("input[name=out_date_end]").val(),
                sActualDate: $("input[name=pay_date_start]").val(),
                eActualDate: $("input[name=pay_date_end]").val(),
                financeDate: $("input[name=pay_day_start]").val(),
                financeDateEnd: $("input[name=pay_day_end]").val(),
                settlementType: $("#account_type").val(),
                findType:"merchant",//访问方，原因：商户后台页面查询结果和显示总数不一致
                pageNum: pagination_page_no,
                pageSize: pagination_pagesize
            },
            success: function (data) {

              console.log(data.value);
                if (data.code == 000) {
                  pagination_pages = data.value.pages;
                  pagination_totals = data.value.total;

                  if(data.value.list.length>0&&data.value.list[0].transfer_time!=undefined&&data.value.list[0].transfer_time!=''){
                    $("#transfer_time").html('提示：【我的账单】中仅显示下单时间在 '+data.value.list[0].transfer_time+' 之后的结算信息，之前的结算信息请联系客服。');
                  }

                    var tmpl = document.getElementById('accountList').innerHTML;
                    var doTtmpl = doT.template(tmpl);
                    $("#account-list").html(doTtmpl(data.value));
                  $("#pagediv").html("<span class='pageinfo'></span>")
                    addpage(ACCOUNT.GetNum.ajaxGetList)
                }else{
                  $("#account-list").html("<tr><td colspan='15' class='center'>暂无数据</td></tr>");
                }
            }
        });
    },

};

ACCOUNT.init = function () {
    ACCOUNT.GetNum.init();
};

$(function () {
    ACCOUNT.init();
});

function openDetails(financeNo) {

  // window.open(href="merchant_account_statement_detail?financeNo="+financeNo);
  window.open(href="account/settlement_detail?financeNo="+financeNo);
}

//查看详情
function openDetail(financeNo) {

  window.open(href="merchant_account_statement_detail?financeNo="+financeNo);
}
