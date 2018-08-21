/**
 * Created by zw on 2017/3/22.
 */

var ACCOUNT = {};


ACCOUNT.GetNum = {
   init: function () {
    this.ajaxGetDetail();
  },

  addPrefix : function(m){
    return m<10?'0'+m:m;
  },

  getLocalTime: function(timeStamp){ //时间转换函数可以公用
    var time = new Date(timeStamp);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+ACCOUNT.GetNum.addPrefix(m)+'-'+ACCOUNT.GetNum.addPrefix(d)+' '+ACCOUNT.GetNum.addPrefix(h)+':'+
      ACCOUNT.GetNum.addPrefix(mm)+':'+ACCOUNT.GetNum.addPrefix(s);
  },


  ajaxGetDetail: function () {
    var trade_id=getUrlParam("tradeId");
    var datas = {
      "site_id":10001611,
      "tradeId":trade_id
    };

    console.log(datas);
    $("#account_table").html('');
    $.ajax({
      type: 'post',
      url: "get_settlement_detail",
      data: datas,
      dataType: 'json',
      success: function (data) {
        var tmpl_first = document.getElementById('trades_detail_first').innerHTML;
        var doTtmpl = doT.template(tmpl_first);
        $("#account_table_first").append(doTtmpl(data));

        var tmpl_second = document.getElementById('trades_detail_second').innerHTML;
        var doTtmpl = doT.template(tmpl_second);
        $("#account_table_second").append(doTtmpl(data));

        var tmpl_third = document.getElementById('trades_detail_third').innerHTML;
        var doTtmpl = doT.template(tmpl_third);
        $("#account_table_third").append(doTtmpl(data));

        var tmpl_fou = document.getElementById('trades_detail_fou').innerHTML;
        var doTtmpl = doT.template(tmpl_fou);
        $("#account_table_fou").append(doTtmpl(data));

      }
    });
  }
};

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
});










