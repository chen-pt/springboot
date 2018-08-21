/**
 * Created by admin on 2017/4/11.
 */

$(function () {
  // 初始化插件
  $("#search_store_btn").click(function () {
    pagination_page_no = 1;
    select();
  });

  select();

  // getExpmenuIndex();
  // select_menu();
  //
  // $("a.clink-all").click(function() {
  //   var arrow = $(this);
  //   if($(".expmenu").find("li[class=active]").length == $(".expmenu").find("li").length) {
  //     arrow.parent().find("ul.expmenu li").removeClass("active");
  //     arrow.find("span").text('全部隐藏');
  //     arrow.removeClass("active");
  //     arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
  //   }
  //   else
  //   {
  //     arrow.parent().find("ul.expmenu li").addClass("active");
  //     arrow.find("span").text('全部展开');
  //     arrow.addClass("active");
  //     arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
  //   }
  //   setExpmenuIndex();
  // });
  //
  // $("ul.expmenu li > .nav-header").click(function() {
  //   var arrow = $(this).parent('ul.expmenu li');
  //   //当前ul.expmenu li 是否展开和隐藏
  //   if(arrow.hasClass("active")) {
  //     arrow.removeClass("active");
  //     arrow.find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
  //   } else if(arrow.hasClass("")) {
  //     arrow.addClass("active");
  //     arrow.find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
  //   }
  //   //ul.expmenu li是否全部展开和隐藏
  //   var liSize = $('ul.expmenu ').find('li').size();
  //   var activeSize = $('ul.expmenu ').find('li.active').size();
  //   if(liSize == activeSize) {
  //     arrow.parents('.sidebar').find('.clink-all span').html('全部隐藏');
  //     arrow.parents('.sidebar').find('.clink-all').addClass("active");
  //   }else {
  //     arrow.parents('.sidebar').find('.clink-all span').html('全部展开');
  //     arrow.parents('.sidebar').find('.clink-all').removeClass("active");
  //   }
  //   setExpmenuIndex();
  // });


})
function select() {
 /* var phone = $("[name=phone]").val();
  var date_start = $("[name=date_start]").val();
  var date_end = $("[name=date_end]").val();
  $.ajax({
    url: '/merchant/clerk/listclerk',
    data: {
      "phone": phone,
      "date_start": date_start,
      "date_end": date_end,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    type: 'post',
    dataType: 'JSON',
    success: function (result) {
      $("#clerk_list").html('');
      if (result.total > 0) {
        pagination_pages = result.pages;
        pagination_totals = result.total;
        var temp = doT.template($("#clerktemp").text());
        var temps = temp(result.list);
        $("#clerk_list").html(temps);
        $("#pagediv").html("<span  class='pageinfo'></span>");
        addpage(select);

        $(".deladmin").click(function(){
          var storeadminId= $(this).parent().find(".adminId").val();
          $("#vl").val(storeadminId);
        });
      }else{
        $("#clerk_list").html("<tr><td colspan='8' style='text-align:center;'>暂无数据</td></tr>");
        pagination_page_no = 1; //页码
        pagination_pages = 1; //总页数
        pagination_totals = 0; //总条数
        $("#pagediv").html("<span  class='pageinfo'></span>");
        addpage(select);
      }

    },
    error: function (e) {
      $("#clerk_list").html("<div>未获取到信息</div>");
    }
  });*/


}

function deleteClerk() {

  var sdId = $("#adminIdoo").val();
  if(!sdId){
    alert("门店ID未获取到请联系管理员！");
    return;
  }
  $.ajax({
    url: "/merchant/clerk/delete/"+sdId+"/"+$("#storeId").val(),
    type: "get",
    dataType: "JSON",
    success: function (result) {
      if (result == 200) {
        window.location.href = '/merchant/clerklist';
      }
      else {
        alert(result);
      }
    },
    error: function (e) {
      alert("系统忙，请稍后重试");
    }
  });
  /*href="/merchant/clerk/delete/[%=it[i].storeadmin_id%]*/
}


// function setExpmenuIndex()
// {
//   var index = [];
//   $(".expmenu").find("li").each(function(){
//     if($(this).hasClass("active")){
//       index[$(this).index()] = $(this).index();
//     }
//     else
//     {
//       index[$(this).index()] = '';
//     }
//   });
//   document.cookie ='ExpmenuIndex='+index+";path=/";
// }
//
// function getExpmenuIndex()
// {
//   var ExpmenuIndex=[],element;
//   var cookie=document.cookie;
//   var arrCookie = cookie.split("; ");
//   for(var i=0;i<arrCookie.length;i++){
//     var arr=arrCookie[i].split("=");
//     if("ExpmenuIndex"==arr[0]){
//       ExpmenuIndex=arr[1].split(",");
//       break;
//     }
//   }
//   for(var i=0;i<ExpmenuIndex.length;i++)
//   {
//     if(ExpmenuIndex[i] != ''){
//       element = "ul.expmenu li:eq("+ExpmenuIndex[i]+")";
//       $(element).addClass("active");
//     }
//   }
// }
// function select_menu(){
//   var pathname =  $('[name="leftmenu"]').val();
//   if(!pathname)pathname = window.location.pathname;
//   $(".sidebar .expmenu li.active").removeClass("active");
//   $(".sidebar .expmenu li .menu .item.active").removeClass("active");
//
//   $(".sidebar .expmenu li .menu .item a[href='"+pathname+"']").parents(".item").addClass("active");
//   $(".sidebar .expmenu li .menu .item a[href='"+pathname+"']").parents("li").addClass("active");
//
//
// }
