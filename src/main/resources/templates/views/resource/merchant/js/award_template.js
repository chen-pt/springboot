/**
 * Created by Administrator on 2017/4/19.
 */
var ACCOUNT = {};

var page_total = 0;
var pagesize = 0;
var total = 0;
ACCOUNT.GetNum = {

  settings: {
    //modalID: '#modal-slider',
  },
  init: function () {
    this.ajaxGetList(1);
    this.even();
  },
  even: function () {
    $("#search").on("click", function () {

      ACCOUNT.GetNum.ajaxGetList(1);
    });
    $(".select_trades_detail").live("click",function(){
      var text = $(this).html();
      // text = "1001791481788286884";
      alert(text);
      $.ajax({
        type: 'post',
        url: "/jk51b/selectTradesDetails",
        data: {"tradesId":text},
        dataType: 'json',
        success: function (data) {
          console.log(data);

        }
      });
    });
  },
  ajaxGetList: function () {
    // pageno = pageno || 1;
    // var pageSize = 15;

    var datas = {
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
      // "pageNum": pageno,
      // "pageSize": pageSize,
      "name": $("input[name=name]").val()
    };
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "getAwardTemplateList",
      data: datas,
      dataType: 'json',
      success: function (data) {
        // page_total = data.value.list.pageNum;
        // pagesize = data.value.list.pageSize;
        // total = data.value.list.total;

        pagination_pages = data.value.pages;
        pagination_totals = data.value.total;
        
        $("#detail-list").empty();

        for(var  a=0;a<data.value.list.length;a++){
          var json = eval('(' + data.value.list[a].reward + ')');
          if (data.value.list[a].type==0) {
            data.value.list[a].level1 = json.level1;
            data.value.list[a].level2 = json.level2;
            data.value.list[a].level3 = json.level3;
          }
          else{
            data.value.list[a].level1 = (json.level1*0.01).toFixed(2);
            data.value.list[a].level2 = (json.level2*0.01).toFixed(2);
            data.value.list[a].level3 = (json.level3*0.01).toFixed(2);
          }
        }


        for(var  a=0;a<data.value.list.length;a++){
          var json = eval('(' + data.value.list[a].discount + ')');
          var levelArray = [];
          $.each(json,function (key,val) {
            if(val != "undefined" && val !="0"){
              levelArray.push(val)
            }
          });
          var max = Math.max.apply(Math,levelArray);
          var min = Math.min.apply(Math,levelArray);

          console.log(min);
          if(max==-Infinity && min==Infinity){
            data.value.list[a].levelT="无优惠"
          }
          else{
            data.value.list[a].levelT=(max==min)?min+"%":min+"%"+'~'+max+"%";
          }


        }

        console.log(data.value.list);
        //pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);

        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        var tr= doTtmpl(data);
        tr=tr+ "<tr><td colspan='8'><span class='pageinfo'></span></td></tr>";
        $("#detail-list").append(tr);

        addpage(ACCOUNT.GetNum.ajaxGetList);

      }
    });
  }
};

function use(id, isused) {
  var datas = {
    "id": id,
    "isUsed": isused,
  };
  $.ajax({
    type: 'post',
    url: "editAwardTemplate",
    data: datas,

    dataType: 'json',
    success: function (data) {
        if(data==200){
          window.location.href="/recommend/awards_templates";
        }
    }
  });
}



ACCOUNT.init= function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
 });
