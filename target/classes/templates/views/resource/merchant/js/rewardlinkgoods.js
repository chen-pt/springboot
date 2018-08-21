/**
 * Created by Administrator on 2017/4/23.
 */
var ACCOUNT2 = {};


var page_total = 0;
var pagesize = 0;
var total = 0;

ACCOUNT2.GetNum = {

  settings: {
    //modalID: '#modal-slider',
  },
  init: function () {
    this.ajaxGetList(1);
    // this.even();
  },
  even: function () {
    // $("#searchgoodsList").on("click", function () {
    //
    //   ACCOUNT2.GetNum.ajaxGetList(1);
    // });

    // $(".selectgoodsByNo").on("click", function () {
    //  alert(12345)
    // });

    // $(".select_trades_detail").live("click",function(){
    //   var text = $(this).html();
    //   // text = "1001791481788286884";
    //   alert(text);
    //   $.ajax({
    //     type: 'post',
    //     url: "/jk51b/selectTradesDetails",
    //     data: {"tradesId":text},
    //     dataType: 'json',
    //     success: function (data) {
    //       console.log(data);
    //
    //     }
    //   });
    // });


  },
  ajaxGetList: function (pagination_page_no) {
    // pagination_page_no = pagination_page_no || 1;
    // var pageSize = 15;
    var minPrice=$("input[name=goods_price_s]").val();
    var maxPrice=$("input[name=goods_price_b]").val();


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

    //分类

    var cate_code =  $("input[name=classify]").data('cate_code');

    var datas = {
      // "pageNum": pagination_page_no,
      // "pageSize": pagination_pagesize,
      "startRow": pagination_page_no,
      "pageSize": pagination_pagesize,
      "goodsStatus" : 1,
      "userCateid": cate_code ? cate_code : 0,
      "goodsTitle": $("input[name=much_search_input]").val(),
      "goodsCode": $("input[name=goods_code_disc]").val(),
      "startPrice": minPrice,
      "endPrice": maxPrice,

    };


    console.log(datas);
    AlertLoading($(".goods_list"));
    $.ajax({
      type: 'post',
      url: "/merchant/bgoodsList",
      data: datas,
      dataType: 'json',
      success: function (data) {
        // page_total = data.goodsPage.pageNum;
        // page
        // size = data.goodsPage.pageSize;
        // total = data.goodsPage.total;
        pagination_pages = data.goodsPage.pages;
        pagination_totals = data.goodsPage.total;
        console.log(data);
        $(".goods_list").empty();

        // $(".sui-text-danger goods_total").text(pagination_totals);
        // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);

        $(".goods_total").html(data.goodsPage.total);

        var tmpl = document.getElementById('much_product_list_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        // var tr= doTtmpl(data);
        // tr=tr+ "<tr><td colspan='3'><span class='getpageinfo'></span></td></tr>";
        // $(".goods_list").append(tr);
        $(".goods_list").append(doTtmpl(data));
        // alert(data.goodsPage.pages);
        // alert(data.goodsPage.pageNum);
        fenye(data.goodsPage.pages,data.goodsPage.pageNum);

        // addpage(ACCOUNT2.GetNum.ajaxGetList);


      }
    });
  }
};

var fenye=function(pages,pageNum) {
  $('.pagination-small').pagination({
    pages: pages,
    styleClass: ['pagination-small'],
    showCtrl: true,
    displayPage: 6,
    currentPage:pageNum,
    onSelect: function (num) {
      ACCOUNT2.GetNum.ajaxGetList(num)  //打开控制台观察
    }
  })
  $('.pagination-small').pagination('updatePages', pages);
}


$("#searchgoodsList").on("click", function () {

  ACCOUNT2.GetNum.ajaxGetList(1);
});
// $(function () {
//   ACCOUNT2.GetNum.ajaxGetList(1);
// });
// $("#searchgoodsList").on("click", function () {
//
//   ACCOUNT2.GetNum.ajaxGetList(1);
// });

// function fenye(pages) {
//   $('.test').pagination({
//     pages: pages,
//     styleClass: ['pagination-small'],
//     showCtrl: true,
//     displayPage: 6,
//     onSelect: function (num) {
//       console.log(num)  //打开控制台观察
//     }
//   })
// }
// function fenye(methodName) {
//   if(pagination_page_no>pagination_pages)pagination_page_no =pagination_pages;
//
//   $('.getpageinfo').pagination({
//     pages: pagination_pages, //总页数
//     styleClass: ['pagination-large'],
//     showCtrl: true,
//     displayPage: 6,
//     currentPage: pagination_page_no, //当前页码
//     onSelect: function (num) {
//       pagination_page_no = num;
//       if (typeof methodName === "function"){
//         methodName();
//       }
//     }
//   });
//
//   $('.getpageinfo').find('span:contains(共)').append("(" + pagination_totals + "条记录)");
//
//   var pageselect = '&nbsp;<select class="page_size_select" style="width:80px;">';
//   var pagearr = [15,30,50,100];
//   $.each(pagearr, function () {
//
//     if (this == pagination_pagesize) {
//       pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>';
//     } else {
//       pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>';
//     }
//   });
//
//   pageselect = pageselect + '</select>&nbsp;';
//   if( !$('.page_size_select').val()){
//     $('.getpageinfo').find('span:contains(共)').prepend(pageselect);
//   }
//
//
//   $('.page_size_select').one('change',function(){
//     pagination_pagesize = $(this).val();
//     methodName();
//   });
//
//
// };


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
          $("#lee_add_classify").append('<li role="presentation" data-cate_code="'+data[i].cateCode+'" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cateName+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
          for(var j=0,j_len=data[i].children.length;j<j_len;j++)
          {
            if(data[i].children[j].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].cateName);
            if(data[i].children[j].children)
            {
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" data-cate_code="'+data[i].children[j].cateCode+'" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].children[j].cateName+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
              for(var k=0,k_len=data[i].children[j].children.length;k<k_len;k++)
              {
                if(data[i].children[j].children[k].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].children[k].cateName);
                $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" data-cate_code="'+data[i].children[j].children[k].cateCode+'" href="javascript:void(0)" data="'+data[i].children[j].children[k].cateId+'">'+data[i].children[j].children[k].cateName+'</a></li>');
              }
            }else{
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data-cate_code="'+data[i].children[j].cateCode+'" data="'+data[i].children[j].cateId+'">'+data[i].children[j].cateName+'</a></li>');
            }
          }
        }else{
          $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data-cate_code="'+data[i].cateCode+'" data="'+data[i].cateId+'">'+data[i].cateName+'</a></li>');
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

var tempid=0;


ACCOUNT2.init= function () {
  ACCOUNT2.GetNum.init();
  getcategories();
};
function searchgoods(id) {
  ACCOUNT2.init();

  tempid=id;
  var data = {
    "id": id,
  };
  AlertLoading($(".select_goods_list"));
  $.ajax({
    type: 'post',
    url: "/merchant/getGoodsDistributeBytempId",
    data: data,
    dataType: 'json',
    success: function (data) {
      page_total = data.value.pageNum;
      pagesize = data.value.pageSize;
      total = data.value.total;
      console.log(data);
      $(".select_goods_list").empty();
      $(".select_goods_total").html(data.value.total);
      // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);

      var tmpl = document.getElementById('fullsend_select_product_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);
      $(".select_goods_list").append(doTtmpl(data));

    }
  });
}

$("#lee_add_classify a").live("click",function(){
  $("#lee_add_classify_a").html('<i class="caret"></i>'+($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")));
  $("input[name='classify']").val($(this).attr("data"));
  var cate_code = $(this).attr("data-cate_code") ? $(this).attr("data-cate_code") : $(this).parent().attr("data-cate_code");
  $("input[name='classify']").data("cate_code",cate_code);

});

