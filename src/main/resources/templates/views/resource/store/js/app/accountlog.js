$(function(){



  var currentPage = 1;
  var pageSize = 3;
  var total_items = 0;
  var total_page = 0;
  /*$(".page_size_select").live("change",function(){
   pageSize = $(this).val();
   getLogisticsList();
   });*/
  getCouponList();
  function getCouponList() {
    var datas = {};
    //var classify = $("input[name='classify']").val();

    //datas.cate_id = classify > 0 ? classify : "";

    datas.page = currentPage;

    datas.pageSize = pageSize;

    datas.storeId = $("#storeId").val();

    datas.siteId = $("#siteId").val();


    //datas.currentPage = currentPage;
    //datas.pageNum = pageSize;
    $.ajax({
      type: 'POST',
      url: "/store/coupon/getcouponList",
      data:datas,
      dataType: 'json',
      success: function(data){
        //alert(JSON.stringify(data));
        //var tmpData = JSON.parse(data);
        //var tp = data.total_pages;

        var tmpData =data.couponList;
        if(!tmpData){
          return;
        }
        $("#coupon-list").empty();
        total_items = tmpData.total;
        total_page = Math.ceil(tmpData.total/tmpData.pageSize);
        if(!tmpData.list){
          return;
        }
        for (var i=0;i<tmpData.list.length;i++){

          var coupon =  tmpData.list[i];

          //编号
          var id = coupon.id;
          //领取数量
          var sendNum = coupon.sendNum;
          if(sendNum===0){
            sendNum = "不限制数量"
          }
          //url 现在接口还没有
          // var link = coupon.linkUrl
          if(coupon!=null&&coupon.map!=null){
            var couponNum = coupon.map.length?coupon.map.length:0;
          }else{
            couponNum = 0;
          }
          //活动状态
          var status;
          if(coupon.status===1){
            status = "暂停";
          }
          var endTime = coupon.end_time == null? '': (new Date(parseFloat(coupon.end_time)))
          if(endTime){
            if(endTime.getTime() < new Date().getTime()){
              status = "过期";
            }
          }

          //优惠券的领取链接的url
          var url = coupon.url;

          //门店类型
          var storeType = coupon.sendWayValue ==="all"?"全部门店":"指定门店";

          var content = "";
          content = content+'<div class="left-content">'+
            '<p>编号：<span class="number">'+id+'</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领取数量：<span class="num-limit">'+sendNum+'</span></p>'+
            '<p>参与门店：<span class="shop" >'+storeType+'</span></p>'+
            '<p>链接<a href="http://'+url+' class="link" style="margin-left: 30px;"><span>http://'+url+'</span></a>&nbsp;&nbsp;&nbsp;<span style="cursor: pointer;" class="copyUrl" data-clipboard-text="http://'+url+'">复制</span></p>'+
            '<p>优惠券列表：<span >共'+couponNum+'张</span></p>'


          if(coupon.map!=null&&coupon.map.length>0){
            for(var p=0;p<coupon.map.length;p++){
              var couponmap = coupon.map[p];
              var marked_words = couponmap.marked_words;
              var coupon_type = couponmap.coupon_type;
              var rule_name;
              switch(coupon_type)
              {
                case 100:
                  rule_name = "现金券";
                  break;
                case 200:
                  rule_name = "打折券";
                  break;
                case 300:
                  rule_name = "现价券";
                  break;
                case 400:
                  rule_name = "包邮券";
                  break;
                default:
                  rule_name = "---";
              }
              var stime = couponmap.create_time == null? '---': (new Date(parseFloat(couponmap.create_time))).format("yyyy-MM-dd hh:mm:ss");
              var etime = couponmap.end_time == null? '---': (new Date(parseFloat(couponmap.end_time))).format("yyyy-MM-dd hh:mm:ss");
              var surplusNum = (couponmap.total-couponmap.send_num)>0?couponmap.total-couponmap.send_num:0;



              content = content+'<p class="goods" >'+
                '<span >'+marked_words+'</span>'+
                '<span>'+rule_name+'</span>'+
                '<span>'+'购指定商品满100减10元'+'</span>'+
                '<span>'+stime+"---"+etime+'</span>'+
                '<span>'+'剩余'+surplusNum+'张'+'</span> </p>'

            }


          }

          $("#coupon-list").append(content);


          if(status==="暂停"){
            $("#coupon-list").append("暂停");
          }else if(status==="过期"){
            $("#coupon-list").append("过期");
          }else{
            $("#coupon-list").append(
            '</div> <div class="right-img">'+
            '<img src="getQRCode?url=http://'+url+' alt=""/>'+
            '<p>活动页面，请使用微信扫描</p></div>'
            );
          }






        }
        $("#pageInfo").append('<tr><td colspan="16"><span class ="pageinfo" style="float: right"></span></td></tr>' );
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

        //复制领取优惠卷url
        var clipboard = new Clipboard('.copyUrl');
        clipboard.on('success', function(e) {
          console.log(e);
          alert("复制成功！")
        });
        clipboard.on('error', function(e) {
          console.log(e);
          alert("复制失败！请手动复制")
        });

      },
      error:function(){
        console.log("error ....");
      }
    });


  }

  function getNum(){
    $('.pageinfo').find('span:contains(共)').append("(" + total_items + "条记录)");
    //页码选择
    var pagearr = [15,30,50,100];

    var pageselect = '&nbsp;<select class="page_size_select" style="width:60px">';

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



})

