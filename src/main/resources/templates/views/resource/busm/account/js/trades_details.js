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

});

/****后台数据调取api****/
var tradesObj = {
  tradesId:"",
  goodsId:"",
  OrderId:"",


  getTradesList:function(trade_id){

    console.log(trade_id);
    var getTradeDetailUrl = "/jk51b/selectTradesDetails?tradesId="+trade_id;
    $.get(getTradeDetailUrl,function (res) {
      console.log("res");
      console.log(res);
      if(res && res.value){
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


