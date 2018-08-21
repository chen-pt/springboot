/**
 * Created by Administrator on 2017/6/5.
 */
// //查询积分商品
var good;
var param = {};
$(function () {
  require.config({
    paths: {
      'vue': '/templates/views/resource/public/sui/js/vue',
    },
    baseUrl: '/templates/views/resource/merchant/js',

  })


  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      $("#search").click();
    }
  });


  $(document).on('keyup','#search',function (event) {
    param.status= $('#status option:selected').val();
    good.getIntegralLog();
  })

  require(['vue'],function (Vue) {
    good=new  Vue({
      el: '#app',
      data:{
        goodsList: [],
        page:1,pageSize:15
      },

      watch:{
        page:'getIntegralLog',
        pageSize:'getIntegralLog'
      },

      methods: {
        imgLink:imgLink,

        getIntegralLog:function () {
          var _self = this;
          var url = "/integralGoods/query";
          // var param = {};
          param.page = _self.page;
          param.pageSize = _self.pageSize;
          // param.status= $('#status option:selected').val();

          param.drugname=$("#drugname").val();

          $.ajax({
            type:'post',
            data:param,
            url:url
          }).then( function (res) {
            console.log(res);


            if(res.message == "Success"){
              _self.goodsList = res.value;
              if(res.value.total >= 0){
                _self.setPage()
              }
            }
          })
        },

        setPage:function(){
          var _self = this;
          var pages = this.goodsList.pages;
          $("#pageinfo").data('sui-pagination', '')
          $("#pageinfo").pagination({
            pages:pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage:_self.page,
            onSelect: function (num) {
              _self.page = num;
            }
          });
          $('#pageinfo').find('span:contains(共)').html("(共" + this.goodsList.total + "条记录)");
          this.addPageExtd();
        },

        addPageExtd:function ()
        {
          var _self = this;
          var pagearr = [15,30,50,100];
          var pageselect = '&nbsp;<select class="page_size_select" style="width: 40px;" id="pageSizeChange">';

          $.each(pagearr, function(){
            if(this==_self.pageSize)
            {
              pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
            }else{
              pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
            }
          });
          pageselect = pageselect+'</select>&nbsp;';

          $('#pageinfo').find('span:contains(共)').prepend(pageselect);
        },
      }
    });
    good.getIntegralLog();

    $(document).on('change','#pageSizeChange',function () {
      good.pageSize = $(this).val();
    })


    $(document).on('click','#search',function () {
      param.status= $('#status option:selected').val();
      good.getIntegralLog();
    })

  });
});

function getRTime(){

  for (var x=0;x<good.goodsList.size;x++){
    var StartTime= new Date(good.goodsList.list[x].start_time); //开始时间
    var localeTime =new Date().toLocaleString();


    var NowTime = new Date(localeTime);
    var id=good.goodsList.list[x].id;
    var z=NowTime.getTime()-(StartTime.getTime() - 86400000);

    if (z>0){
      var t =StartTime.getTime() - NowTime.getTime();

      if(t<0){
        $("#"+id).html("");

      }else{
        var d=Math.floor(t/1000/60/60/24);
        var h=Math.floor(t/1000/60/60%24);
        var m=Math.floor(t/1000/60%60);
        var s=Math.floor(t/1000%60);


        $("#"+id).html("距离兑换开始时间还有："+d+"天"+h+"小时"+m+"分"+s+"秒");
      }
    }
  }
}

/*$("#fund_table").hover(function(){
  $('.right_listt').show();
},function(){
  $('.right_listt').hide();
})*/


function getEndTime(){

  for (var x=0;x<good.goodsList.size;x++){
    if(good.goodsList.list[x].end_time!="0000-00-00 00:00:00"){
      var Endtime= new Date(good.goodsList.list[x].end_time); //开始时间


      var localeTime =new Date().toLocaleString();


      var NowTime = new Date(localeTime);
      var id=good.goodsList.list[x].id;
      var z=NowTime.getTime()-(Endtime.getTime() - 86400000);


      if (z>0){
        var t =Endtime.getTime() - NowTime.getTime();

        if(t<0){
          $("#end_"+id).html("");

        }else{
          var d=Math.floor(t/1000/60/60/24);
          var h=Math.floor(t/1000/60/60%24);
          var m=Math.floor(t/1000/60%60);
          var s=Math.floor(t/1000%60);

          $("#end_"+id).html("距离兑换截止时间还有："+d+"天"+h+"小时"+m+"分"+s+"秒");
        }
      }
    }
  }
}


setInterval(getRTime,1000);
setInterval(getEndTime,1000);
// setInterval(get,1000);

$(".toggle-button-wrapper").on("click",function () {
  var is_open = $(this).find("#toggle-button").val(); //当前状态
  var param = {};
  param.isOpen = is_open == 1 ? 0 : 1;
  var msg = is_open == 1 ? "未开启" : "已开启";
  ele = $(this);
  console.log(is_open);
  $.post('/merchant/integralShop',param, function (res) {
    console.log(res);

    if(res.message == "Success"){
      alert(res.value);
      location.reload()
      ele.find("#toggle-button").attr("checked",true).val(param.isOpen).siblings(".button-label").toggleClass('button-label-off').toggleClass("button-label-on").find(".text").toggleClass("off").toggleClass("on").html(msg);  //切换为蓝色
      $(".circle").toggleClass('off_circle').toggleClass('on_circle');
    }else{
      alert(res.message);
    }
  });
});












