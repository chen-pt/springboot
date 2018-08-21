/**
 * Created by Administrator on 2017/4/20.
 */
/**
 * Created by Administrator on 2017/3/21.
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
    $("#search_btn").on("click", function () {
      ACCOUNT.GetNum.ajaxGetList(1);
    });

    //回车搜索
    $(document).keyup(function(event){
      if(event.keyCode ==13){
        ACCOUNT.GetNum.ajaxGetList(1);
      }
    });

    $(".select_trades_detail").live("click",function(){
      var text = $(this).html();
      // text = "1001791481788286884";

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

    // var pageSize = 15;

    var minPrice=$("#minPrice").val();
    var maxPrice=$("#maxPrice").val();


    if (minPrice){
        minPrice = parseInt(parseFloat(minPrice)*10*10);
    }else{
        minPrice = undefined;
    }
    if (maxPrice){
      maxPrice = parseInt(parseFloat(maxPrice)*10*10);
    }else{
      maxPrice = undefined;
    }



    var datas = {
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
      // "pageNum": pageno,
      // "pageSize": pageSize,
      "drugName": $("input[name=name]").val(),
      "goodsTitle": $("input[name=title]").val(),
      "userCateid": $("input[name=classify]").val(),
      "goodsCode":$("input[name=code]").val(),
      "minPrice": minPrice ,
      "maxPrice": maxPrice ,
      "templateName": $("#template_name").val(),
    };
    console.log(datas);
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "/merchant/getGoodsDistributeList",
      data: datas,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        $("#detail-list").empty();
        if(data.code == "000") {
          pagination_pages = data.value.pages;
          pagination_totals = data.value.total;


          for (var a = 0; a < data.value.list.length; a++) {
            var json = eval('(' + data.value.list[a].reward + ')');
            if (data.value.list[a].reward_type == 0) {

              data.value.list[a].level3 = ((json.level1)*0.01 * ((data.value.list[a].shop_price*0.01))).toFixed(2);
              data.value.list[a].level2 = ((json.level2)*0.01 * ((data.value.list[a].shop_price*0.01))).toFixed(2);
              data.value.list[a].level1 = ((json.level3)*0.01 * ((data.value.list[a].shop_price*0.01))).toFixed(2);


            }
            else {
              data.value.list[a].level3 = (json.level1*0.01);
              data.value.list[a].level2 = (json.level2*0.01);
              data.value.list[a].level1 = (json.level3*0.01);
            }

          }


          for (var a = 0; a < data.value.list.length; a++) {
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
            // data.value.list[a].levelT=(max==min)?(min/10).toFixed(2):(min/10).toFixed(2)+'~'+(max/10).toFixed(2);
          }

        }


          // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);

          var tmpl = document.getElementById('accountDetail').innerHTML;
          var doTtmpl = doT.template(tmpl);
          var tr= doTtmpl(data);
          tr=tr+ "<tr><td colspan='11'><span class='pageinfo'></span></td></tr>";
          $("#detail-list").append(tr);


          addpage(ACCOUNT.GetNum.ajaxGetList);
          // addpage(ACCOUNT.GetNum.ajaxGetList)

      }
    });
  },
};

function getMoban(goods_id,vv) {

  AlertLoading($("#template"));
  $("#gid").val(goods_id);
  var template_id = $(vv).attr('dpid');

  var c=template_id;
    $.ajax({
      type: 'post',
      url: '/recommend/getAwardTemplateListUser',

      dataType: 'json',
      success: function (data) {
        $("#template").empty();
        var page_total, pagesize, total;
        if (data.pages) {
          document.pages = data.pages;
          document.total = data.total;
        }
        page_total = document.pages;
        pagesize = document.size;
        ACCOUNT.total = document.total;
        console.log(data);

        for(var  a=0;a<data.value.list.length;a++){
          var json = eval('(' + data.value.list[a].reward + ')');
          if (data.value.list[a].type==0){
            data.value.list[a].level1=((json.level1*0.01).toFixed(2));
            data.value.list[a].level2=((json.level2*0.01).toFixed(2));
            data.value.list[a].level3=((json.level3*0.01).toFixed(2));


          }
          else{
            data.value.list[a].level1=((json.level1*0.01).toFixed(2));
            data.value.list[a].level2=((json.level2*0.01).toFixed(2));
            data.value.list[a].level3=((json.level3*0.01).toFixed(2));
          }

          data.value.list[a].distribution_template=c;

        }


        for (var a = 0; a < data.value.list.length; a++) {
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
            data.value.list[a].levelZ="无优惠"
          }
          else{
            data.value.list[a].levelZ=(max==min)?min+"%":min+"%"+'~'+max+"%";
          }
          // data.value.list[a].levelT=(max==min)?(min/10).toFixed(2):(min/10).toFixed(2)+'~'+(max/10).toFixed(2);
        }

        // for(var  a=0;a<data.value.list.length;a++){
        //   var json = eval('(' + data.value.list[a].discount + ')');
        //   data.value.list[a].levelT1=json.level1;
        //   data.value.list[a].levelT2=json.level2;
        //   data.value.list[a].levelT3=json.level3;
        //   data.value.list[a].levelT4=json.level4;
        //   data.value.list[a].levelT5=json.level5;
        // }

        //pageInfo($('.pageinfo'), pageno, page_total, pagesize, ACCOUNT.total, ACCOUNT.GetNum.ajaxGetList);
        var tmpl = document.getElementById('templateDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#template").append(doTtmpl(data));
      }

    })
}

function opTemplate(self)
{
  if (self.attr('occupy') == 1) {
    $(".op_template").attr('occupy',0);
    $(".op_template").html("选择使用");
    $(".op_template").removeAttr('style');
  } else {
    $(".op_template").attr('occupy',0);
    $(".op_template").html("选择使用");
    $(".op_template").removeAttr('style');
    self.attr('occupy',1);
    self.html("移出");
    self.css("color","red");
  }
}

function bindTemplate()
{
  var pass = 0;
  var template_id = 0;
  $(".op_template").each(function(){
    if ($(this).attr('occupy') == 1) {
      template_id = $(this).attr('tid');
      pass = 1;
      return false;
    }
  });
  if (pass == 0) {
    alert("必须选择一个模板！");
    return false;
  }
  var  goods_id=$("#gid").val();
  var datas={
    "templateid": template_id,
    "goods_id":goods_id

};



  $.ajax({
    url:'/merchant/changeDistributionTemplate',
    data:datas,
    type:'post',
    success:function(data){
      var reward = eval('(' + data.reward + ')');

        var json = eval('(' + data.discount + ')');

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
          data.levelX="无优惠"
        }
        else{
          data.levelX=(max==min)?min+"%":min+"%"+'~'+max+"%";
        }



      var  goodid=$("#gid").val();
      if (data.type==0){
        var start=(data.shop_price*0.01*(reward.level1*0.01)).toFixed(2);
        var end=(data.shop_price*0.01*(reward.level1*0.01)+data.shop_price*0.01*(reward.level2*0.01)+
          data.shop_price*0.01*(reward.level3*0.01)).toFixed(2);
        var level1=data.shop_price*0.01*(reward.level3*0.01);
        var leve12=data.shop_price*0.01*(reward.level2*0.01);
      }
      else{
        var start=reward.level1*0.01;
        var end=parseInt(reward.level1*0.01)+parseInt(reward.level2*0.01)+
          parseInt(reward.level3*0.01);
        var level1=reward.level3*0.01;
        var leve12=reward.level2*0.01;
      }

      var str="￥"+start+"~￥"+end;
      $("#tdtre_"+data.goods_id).html(str);

      $("#tdname_"+data.goods_id).html(data.name);
      var levelstr  = "<li>上上级：￥"+level1+"</li><li>上级：￥"+leve12+"</li><li>下单级：￥"+start+"</li>";
      $("#reward_"+data.goods_id).html(levelstr);

      // var tddiscount= (discount.level5/10).toFixed(2)+"折~"+(discount.level1/10).toFixed(2)+"折";

      $("#tddiscount_"+data.goods_id).html(data.levelX);


      $("#tdddp_"+data.goods_id).attr("dpid",data.id);
    }
  });
}

function getcategories(){
  $.ajax({
    type: 'post',
    url: "/merchant/categories",
    dataType: 'json',
    success:function(data){
      var data=data.result.children;
      categoriesData = data;
      console.log(data);
      $("#lee_add_classify").html("");
      for(var i=0,len=data.length;i<len;i++)
      {
        if(data[i].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].cateName);
        if(data[i].children)
        {
          $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cateName+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
          for(var j=0,j_len=data[i].children.length;j<j_len;j++)
          {
            if(data[i].children[j].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].cateName);
            if(data[i].children[j].children)
            {
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].children[j].cateName+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
              for(var k=0,k_len=data[i].children[j].children.length;k<k_len;k++)
              {
                if(data[i].children[j].children[k].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].children[k].cateName);
                $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].children[k].cateId+'">'+data[i].children[j].children[k].cateName+'</a></li>');
              }
            }else{
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateId+'">'+data[i].children[j].cateName+'</a></li>');
            }
          }
        }else{
          $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateId+'">'+data[i].cateName+'</a></li>');
        }

      }

      $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');

      return;
    },
    error:function(){
      console.log("error ....");
    }
  })
}



ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
  getcategories();
});


