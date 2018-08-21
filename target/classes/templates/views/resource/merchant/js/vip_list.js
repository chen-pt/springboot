var itemsCount;

$(document).ready(function(){
  getStoreList();
  getVipList();
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getVipList();
    }
  });
  $("#search_report").click(function(){
    if (itemsCount == 0){
      $(".order_hint").html('根据本次查询条件，未查询到相关会员信息！');
    }else if (itemsCount > 10000){
      $(".order_hint").html('根据本次查询条件，共查询到<span style="color:red">' + itemsCount + '</span>条记录，已超过&nbsp;10000&nbsp;条的最大值，请修改查询条件，分批次下载。');
      $("#export_list").modal("show");
      return;
    }else {
      $(".order_hint").html("根据本次查询条件，共查询到"+itemsCount+"条结果,请<a id = 'do-export'>点击下载</a>");
    }

    $("#export_list").modal("show");

    $("#do-export").click(function () {
      var params = {};
      var mobile = $("input[name='phone']").val();
      var startTime = $("input[name='start_time']").val();
      var endTime = $("input[name='end_time']").val();
      var storeName = $("input[name='store_name']").val();

      if(mobile)params.mobile=mobile;
      if(startTime)params.start_time = startTime;
      if(endTime)params.end_time = endTime;
      if(storeName)params.store_name = storeName;

      var form=$("<form>");//定义一个form表单
      form.attr("style","display:none");
      form.attr("target","");
      form.attr("method","post");
      for(var i in params){
        form.append('<input type="hidden" name="'+i+'" value="'+params[i]+'" >');
      }
      console.log(form.html());
      form.attr("action","/member/report");
      $("body").append(form);//将表单放置在web中
      form.submit();//表单提交
    });
  });
  
})

/**
 * 导出报表
 */


/**
 * 会员列表
 */
function getVipList() {
  var datas = {};
    //var classify = $("input[name='classify']").val();

    //datas.cate_id = classify > 0 ? classify : "";

    datas.page = pagination_page_no;

    datas.pageSize = pagination_pagesize;

    datas.mobile = $("input[name='phone']").val();

    datas.start_time = $("input[name='start_time']").val();

    datas.end_time = $("input[name='end_time']").val();

    datas.store_name = $("input[name='store_name']").val();

  $("#vip_table").html('');
  // 加载数据动画
  AlertLoading($("#vip_table"));
  $.ajax({
    type: 'POST',
    url: "/merchant/vipList",
    data:datas,
    dataType: 'json',
    success: function(data){
      // 停止加载数据动画
      $("#vip_table").html('');
      var tmpData = data;



      if(tmpData.items.length){
        pagination_pages = tmpData.total_pages;
        pagination_totals = tmpData.total_items;
       // itemsCount = 20000;

        itemsCount = tmpData.total_items;
        var tmpHtml = "";
        for (var i=0;i<tmpData.items.length;i++){
          var member=tmpData.items[i];
          var memberMobile = member.mobile==null || member.mobile=="null"? "---":member.mobile;
          var memberName=(member.name==null || member.name=="NULL")? "---":member.name;
          var startTime = (member.createTime == null || member.createTime==57599000) ? '0000-00-00 00:00:00': (new Date(parseFloat(member.createTime))).format("yyyy-MM-dd hh:mm:ss");
          var endTime = (member.lastTime == null || member.lastTime==57599000) ? '0000-00-00 00:00:00': (new Date(parseFloat(member.lastTime))).format("yyyy-MM-dd hh:mm:ss");
          var storeNumber =( member.storeName == null || member.storeName== '')? "---" : member.storeName;
          var code = (member.inviteCode == null || member.inviteCode == 'NULL' || member.inviteCode == "") ? "---" : member.inviteCode;
          var admin = (member.adminName == null || code=="---")? "---" : member.adminName;
          var integ = member.integrate == null ? "---" : member.integrate;
          var orderN = member.orderNum == null ? "0" : member.orderNum1;
          var orderF = member.orderFee == null ? "0" : member.orderFee1;
          var memberId = member.memberId;
          tmpHtml +="<tr>" +
            "<td >"+memberMobile+"</td>" +
            "<td>"+memberName+"</td>" +
            "<td>"+startTime+"</td>" +
            "<td>"+endTime+"</td>" +
            "<td>"+storeNumber+"</td>" +
            "<td>"+code+"</td>" +
            "<td>"+admin+"</td>" +
            "<td>"+integ+"</td>" +
            "<td>"+orderN+"/"+orderF/100+"</td>" +
            "<td><a id='"+memberMobile+"' href='vip_update/"+memberId +"'>修改</a></td>"+
            "</tr>";
        }
        $("#vip_table").html(tmpHtml);
        $("#pagediv").html("<span class='pageinfo'></span>")

      addpage(getVipList);

       $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");
      }else{
        pagination_pages = 1;
        pagination_totals = 0;
        itemsCount = 0;
        //$("#vip_table").html(tmpHtml);
        $("#pagediv").html("<span class='pageinfo'></span>")
        addpage(emptyList);
        $("#vip_table").append("<tr><td colspan='16' height='30' style='text-align: center'>暂无数据</td></tr>");
        $('.select_all_btn').attr("checked", false);
        $('.select_all_btn').parent().removeClass("checked");
        $("#pagediv").html("");
      }

    },
    error:function(){
      console.log("error ....");
    }
  });
}

function emptyList() {
  pagination_page_no = 1; //页码
  pagination_pages = 1; //总页数
  pagination_totals = 0; //总条数
  //pagination_pagesize = 15; //每页显示多少条

}

/**
 * 日期格式化
 * @param format
 * @returns {*}
 */
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

/**
 * 门店列表
 */
function getStoreList() {

  $.post(
    "/merchant/storeName"
    ,function (data) {
      $(data).each(function(){
        ArrNameList.push(this.name);
      });
    });


}
