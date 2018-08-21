$(document).ready(function(){
  tradesObj.doTinit();
  var param = location.search;
  console.log("param");
  console.log(param);
  tradesObj.tradesId = param.substr(param.lastIndexOf('=')+1);
  tradesObj.getTradesList(tradesObj.tradesId);

  $("#inform_save").live("click",function () {
    tradesObj.saveComment();
  });
  $(".update_goods_batch_no").live("click",function () {
    var data = {};
    data.goodsId = $(this).next('[name="hidden_good_id"]').val();
    data.orderId = tradesObj.tradesId;
    $.post("/merchant/getGoodsBatchsNo",data,function (res) {
      console.log("批号");
      console.log(res);
      if(res && res.code == 200){
        $('[name="order_batch_no"]').val(res.data.goodsBatchNo);
        tradesObj.goodsId = data.goodsId;
        tradesObj.orderId = data.orderId;
      }

      $("#updateGoodsBatchNo").modal("show");
    });

  });

  $(".save_goods_batch_no").live("click",function () {
    var data2 = {};
    data2.goodsId = tradesObj.goodsId;
    data2.orderId = tradesObj.orderId;
    data2.goodsBatchNo  =$('[name="order_batch_no"]').val();
    $.post("/merchant/updateGoodsBatchsNo",data2,function (res) {
      if(res.code == 200){
        $("#updateGoodsBatchNo").modal("hide");
        alert("操作成功");
      }
    });
  });

  $('.refund_change').live("click",function () {
      var data = {};
      data.goodsId = $(this).prev().val();
      data.orderId = tradesObj.tradesId;
    $.post("/merchant/getRefundGoodsCode",data,function (res) {
      console.log("退换货编号");
      console.log(res);
      if(res && res.code == 200){
        $('[name="tuihuo"]').val(res.data.refundGoodsCode);
        tradesObj.goodsId = data.goodsId;
        tradesObj.orderId = data.orderId;
      }

      $("#refundchange").modal("show");
    });



  });
  $(".ok-refund").live("click",function () {
    var data = {};
    data.refundGoodsCode = $('[name="tuihuo"]').val();
    data.goodsId = tradesObj.goodsId;
    data.orderId = tradesObj.orderId;
    $.post("/merchant/updateRefundGoodsCode",data,function (re) {
      console.log("退换货编号");
      console.log(re);
      if(re && re.code == 200){
        $("#refundchange").modal("hide");
        alert("操作成功");
      }
    });
  });
  
  $(".comment_status").live("click", function () {
      var data = {};
      if($(this).attr("data-id")==1){
        data.isShow = 0;
      }else if($(this).attr("data-id")==0){
        data.isShow = 1;
      }
      data.goodsId = $(this).attr("data-goodsid");
      data.tradesId = tradesObj.tradesId;


      //修改是否显示评论
      $.post("/merchant/updateComment",data,function (res) {
        location.reload();
      });
  });




});

/****后台数据调取api****/
var tradesObj = {
  tradesId:"",
  goodsId:"",
  OrderId:"",

  saveComment:function () {
    var data ={};
    data.sellerFlag = $('[name="dealer_remark"]:checked').val();
    data.sellerMemo = $('[name="seller_memo"]').val();
    data.tradesId=tradesObj.tradesId;
    $.post("/merchant/merchantComment",data,function (res) {
      if(res && res.code == "000"){
        alert("更新成功");
        //location.reload();
        window.location.href="/merchant/order_list";
      }
    })
  },

  getTradesList:function(trade_id){

    console.log(trade_id);
    var getTradeDetailUrl = "/merchant/selectTradesDetails?tradesId="+trade_id;
    $.get(getTradeDetailUrl,function (res) {
      console.log(res);
      if(res && res.value){

//处理赠品信息
        if(res.value.discountList&&res.value.discountList.length>0){
          for (var i=0;i<res.value.discountList.length;i++){
            if (res.value.discountList[i].isGift){
              res.value.discountList[i].giftList;
              var obj=JSON.parse(res.value.discountList[i].concessionResult);
              var arra=new Array;
              for (var k in obj ){
                var ss=new Array;
                ss.push(k,obj[k]);
                arra.push(ss);
              }
              res.value.discountList[i].giftList=arra;
            }
          }
        }

        var tmpl = document.getElementById('trades_detail_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#order_detail_table').html(doTtmpl(res.value));
        if(res.value.sellerFlag > 0){
          $('[name="dealer_remark"][value = "'+res.value.sellerFlag+'"]').attr("checked",true);
        }
        $('[name="seller_memo"]').val((res.value.sellerMemo!=null&&res.value.sellerMemo!="null"&&res.value.sellerMemo!="NULL")?res.value.sellerMemo:"");
        $("#seller_memo_num").html($('[name="seller_memo"]').val().length+'/100');
        tradesObj.getCommentsList();
      }else{
        $('#order_detail_table').html("");
      }
    });

  },
  getCommentsList:function(){

    $.get("/merchant/orderCommentDetail?tradesId="+tradesObj.tradesId,function (res) {
      console.log("orderCommentDetail");
      console.log(res);
      if(res&&res.value.length < 1){
        $("#server_comment").addClass('lee_hide');
        return;
      }
      if(res && res.value){
        $("#server_comment").removeClass('lee_hide');
        var tmpl = document.getElementById('trades_comment_template').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#trades_comment_list').empty();
        $('#trades_comment_list').html(doTtmpl(res.value));
      }else{
        $('#trades_comment_list').html("暂无数据");
      }

    });

  },
  timeToDate:function (time){
    var unixTimestamp = new Date(time * 1000);
    var commonTime = unixTimestamp.toLocaleString().replace(/\//g,'-');
    return commonTime;
  },
  getLocalTime:function (time) {
    if(time==''){
      return '无';
    }
    var timestamp4 = new Date(time);
    return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
  },
doTinit:function()
  {
    //配置定界符
    doT.templateSettings = {
      evaluate:    /\[\%([\s\S]+?)\%\]/g,
      interpolate: /\[\%=([\s\S]+?)\%\]/g,
      encode:      /\[\%!([\s\S]+?)\%\]/g,
      use:         /\[\%#([\s\S]+?)\%\]/g,
      define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
      conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
      iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
      varname: 'it',
      strip: true,
      append: true,
      selfcontained: false
    };
  }
};


