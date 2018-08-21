$(document).ready(function(){
  getStoreList();
  getVipBlackList();
})

/**
 * 黑名单列表
 */
function getVipBlackList() {
  var datas = {};
    //var classify = $("input[name='classify']").val();

    //datas.cate_id = classify > 0 ? classify : "";

  datas.page = pagination_page_no;

  datas.pageSize = pagination_pagesize;

    datas.mobile = $("input[name='phone']").val();

    datas.start_time = $("input[name='start_time']").val();

    datas.end_time = $("input[name='end_time']").val();

  datas.store_name = $("input[name='store_name']").val() == 0 ? '' : $("input[name='store_name']").val();


  $("#vip_blacktable").html('');
  AlertLoading($("#vip_blacktable"));
  $.ajax({
    type: 'POST',
    url: "/merchant/vipBlackList",
    data:datas,
    dataType: 'json',
    success: function(data){
      $("#vip_blacktable").html('');
      var tmpData = data;
      //$("#vip_blacktable").empty();
      pagination_pages = tmpData.total_pages;
      pagination_totals = tmpData.total_items;
      itemsCount = tmpData.total_items;
      if(tmpData.items.length){
        var tmpHtml = "";
        for (var i=0;i<tmpData.items.length;i++){
          var member=tmpData.items[i];
          var memberMobile = member.mobile==null? "---":member.mobile;
          var memberName= (member.name==null || member.name=="NULL")? "---":member.name;
          var startTime = (member.createTime == null || member.createTime==57599000) ? '0000-00-00 00:00:00': (new Date(parseFloat(member.createTime))).format("yyyy-MM-dd hh:mm:ss");
          var endTime = (member.lastTime == null || member.lastTime==57599000) ? '0000-00-00 00:00:00': (new Date(parseFloat(member.lastTime))).format("yyyy-MM-dd hh:mm:ss");
          var storeNumber = member.storeName == null ? "---" : member.storeName;
          var code = (member.inviteCode == null || member.inviteCode == 'NULL' || member.inviteCode == "") ? "---" : member.inviteCode;
          var admin = (member.adminName == null || code=="---") ? "---" : member.adminName;
          var integ = member.integrate == null ? "---" : member.integrate;
          var orderN = member.orderNum == null ? "0" : member.orderNum;
          var orderF = member.orderFee == null ? "0" : member.orderFee;
          var memberId = member.memberId;
          tmpHtml +=
            "<tr>" +
            "<td >"+memberMobile+"</td>" +
            "<td>"+memberName+"</td>" +
            "<td>"+startTime+"</td>" +
            "<td>"+endTime+"</td>" +
            "<td>"+storeNumber+"</td>" +
            "<td>"+code+"</td>" +
            "<td>"+admin+"</td>" +
            "<td>"+integ+"</td>" +
            "<td>"+orderN+"/"+orderF/100+"</td>" +
            "<td><a id='"+memberId+"' href='vip_blackmember/"+memberId +"'>查看</a>&nbsp<a id='"+memberId+"' onclick='deleteBlackMember(this);'>移除</a></td>"+
            "</tr>";
        }
        $("#vip_blacktable").html(tmpHtml);
      $("#vip_blacktable").append('<tr><td colspan="10"><span class ="pageinfo"></span></td></tr>' );

        addpage(getVipBlackList);
         $('.select_all_btn').attr("checked", false);
        $('.select_all_btn').parent().removeClass("checked");
      }else{

        $("#vip_blacktable").append("<tr><td colspan='16' height='30' style='text-align: center'>暂无数据</td></tr>");
      }

    },
    error:function(){
      console.log("error ....");
    }
  });
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

/**
 * 移除黑名单
 * @param a
 */
function deleteBlackMember(a) {
  var tipHtml = '<h4 style="font-weight: 200">您确定将此会员<label style="color: #FF0000;">移出黑名单</label>吗?</h4>' +
    '<div><label style="color: #FF6600;">提醒：</label></div><div style="color: #FF6600;">1.移除后，会员可以正常进行购物；<br> *状态为正常（允许登录）的情况下；<br>2.移除后，会员信息仍于加入黑名单之前一样；</div>';
  // var tipHtml = '确定删除该会员吗?';
  var memberId = a.id;
  layer.confirm(tipHtml, {title :['提示']},function (idx) {
    $.post(
      "/merchant/removeBlackMember",
      {memberId:memberId}
    )
    setTimeout(function(){//两秒后跳转
      location.href = "/merchant/vip_blacklist";
    },2000);
  });

}

