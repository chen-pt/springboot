
getLogisticsList();
getLogisticsName();
var currentPage = 1;
var pageSize = 30;
var total_items = 0;
var total_page = 0;

$(".page_size_select").live("change",function(){
  pageSize = $(this).val();
  currentPage = 1;
  getLogisticsList();
});

function getLogisticsList() {

  var datas = {};
  //var classify = $("input[name='classify']").val();

  //datas.cate_id = classify > 0 ? classify : "";

  datas.page = currentPage;

  datas.pageSize = pageSize;

  datas.order_number = $("input[name='order_number']").val();

  datas.waybill_number = $("input[name='waybill_number']").val();

  datas.area = $("input[name='district']").val();

  datas.logistics_name = $("select[name='logistics_name']").val()==0 ? '' : $("select[name='logistics_name']").val();


  datas.start_time = $("input[name='create_time_start']").val();

  datas.end_time = $("input[name='create_time_end']").val();

  //datas.currentPage = currentPage;
  //datas.pageNum = pageSize;
  if ((!/^[0-9]*$/.test(datas.order_number)) && datas.order_number != "" && datas.order_number != null) {
    datas.order_number = null;
    alert("请输入正确订单号!");
  } else{
    AlertLoading($("#logistics_table"));
    $.ajax({
      type: 'POST',
      url: "/jk51b/logisticsList",
      data: datas,
      dataType: 'json',
      success: function (data) {
        //alert(JSON.stringify(data));
        //var tmpData = JSON.parse(data);
        //var tp = data.total_pages;

        var tmpData = data;
        $("#logistics_table").empty();
        total_items = tmpData.total_items;
        total_page = tmpData.total_pages;
        if(tmpData.items.length){
          for (var i = 0; i < tmpData.items.length; i++) {
            var order = tmpData.items[i];
            var siteId = (order.siteId == null || order.siteId == '') ? '---' : order.siteId;
            var orderNum = (order.orderNo == null || order.orderNo == '') ? '---' : order.orderNo;
            var waybillNum = (order.waybillNumber == null || order.waybillNumber == 'NULL') ? '---' : order.waybillNumber;
            var provin = order.province;
            var ci = order.city;
            var logisticsN = order.logisticsName;
            var storeN = order.storeName;
            var orderT = (order.orderTime == null || order.orderTime == 57599000) ? '---' : (new Date(parseFloat(order.orderTime))).format("yyyy-MM-dd hh:mm:ss");
            var orderAmo = order.orderAmount / 100;
            var distributionDista = order.distributionDistance / 1000;
            var startingF = order.startingFare / 100;
            var surpassDistanceF = order.surpassDistanceFare / 100;
            var overweightChargeF = order.overweightChargeFare / 100;
            var overtimeF = order.overtimeFare / 100;
            var o2OFreight = order.o2OFreight / 100;
            var chargebackF = order.chargebackFare / 100;
            var totalF = order.totalFee / 100;
            var statuNum = order.status;
            var statu = "";
            switch (statuNum) {
              case 0:
                statu = "接受成功";
                break;
              case 1:
                statu = "系统已接单";
                break;
              case 2:
                statu = "已分配到骑手";
                break;
              case 3:
                statu = "骑手已到店";
                break;
              case 4:
                statu = "配送中";
                break;
              case 5:
                statu = "已送达";
                break;
              case 6:
                statu = "已取消";
                break;
              case 7:
                statu = "异常";
                break;
              default :
                statu = "---";

            }
            $("#logistics_table").append(
              "<tr>" +
              "<td >" + siteId + "</td>" +
              "<td >" + orderNum + "</td>" +
              "<td>" + waybillNum + "</td>" +
              "<td>" + provin + "</td>" +
              "<td>" + ci + "</td>" +
              "<td>" + logisticsN + "</td>" +
              "<td>" + storeN + "</td>" +
              "<td>" + orderT + "</td>" +
              "<td>" + orderAmo + "</td>" +
              "<td>" + distributionDista + "</td>" +
              "<td>" + startingF + "</td>" +
              "<td>" + surpassDistanceF + "</td>" +
              "<td>" + overweightChargeF + "</td>" +
              "<td>" + overtimeF + "</td>" +
              "<td>" + chargebackF + "</td>" +
              "<td>" + o2OFreight + "</td>" +
              "<td>" + totalF + "</td>" +
              "<td>" + statu + "</td>" +
              "</tr>"
            );
          }

            $("#logistics_table").append('<tr><td colspan="16"><span class ="pageinfo" style="float: right"></span></td></tr>');
            $('.pageinfo').pagination({
              pages: total_page,
              styleClass: ['pagination-large'],
              showCtrl: true,
              displayPage: 6,
              currentPage: currentPage,

              onSelect: function (num) {
                currentPage = num;
                getLogisticsList();
                getNum();
              }

            });
            getNum();


            $('.select_all_btn').attr("checked", false);
            $('.select_all_btn').parent().removeClass("checked");

        }else{

          $("#logistics_table").append("<tr><td colspan='16' height='30' style='text-align: center'>暂无数据</td></tr>");
        }

      },
      error: function () {
        console.log("error ....");
      }
    });
  }

}

function getNum(){
  $('.pageinfo').find('span:contains(共)').append("(" + total_items + "条记录)");
  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '&nbsp;<select class="page_size_select" style="width:40px">';

  $.each(pagearr, function(){

    if(this==pageSize)
    {
      pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
    }

  });


  pageselect = pageselect+'</select>&nbsp;';

  $('.pageinfo').find('span:contains(共)').prepend(pageselect);

}

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    // month
    "d+": this.getDate(),
    // day
    "h+": this.getHours(),
    // hour
    "m+": this.getMinutes(),
    // minute
    "s+": this.getSeconds(),
    // second
    "q+": Math.floor((this.getMonth() + 3) / 3),
    // quarter
    "S": this.getMilliseconds()
    // millisecond
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

function getLogisticsName() {
  $.post(
    "/jk51b/logisticsName"
  ,function (data) {
      $(data).each(function(){
        $("#logistics_name").append(
          '<option value="'+this+'">'+this+'</option>'
        );
      });
  });


}

