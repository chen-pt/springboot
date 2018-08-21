//左边的导航栏展开和隐藏
$(document).ready(function () {
  is_pandain_tips();
  setInterval('is_pandain_tips()', 1000 * 60);//后台接口影响，这里设置为每分钟查询一次

  getExpmenuIndex();
  select_menu();
  $("a.clink-all").click(function () {
    var arrow = $(this);
    if ($(".expmenu").find("li[class=active]").length == $(".expmenu").find("li").length) {
      arrow.parent().find("ul.expmenu li").removeClass("active");
      arrow.find("span").text('全部隐藏');
      arrow.removeClass("active");
      arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
    }
    else {
      arrow.parent().find("ul.expmenu li").addClass("active");
      arrow.find("span").text('全部展开');
      arrow.addClass("active");
      arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
    }
    setExpmenuIndex();
  });
  $("ul.expmenu li > .nav-header").click(function () {
    var arrow = $(this).parent('ul.expmenu li');
    //当前ul.expmenu li 是否展开和隐藏
    if (arrow.hasClass("active")) {
      arrow.removeClass("active");
      arrow.find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
    } else if (arrow.hasClass("")) {
      arrow.addClass("active");
      arrow.find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
    }
    //ul.expmenu li是否全部展开和隐藏
    var liSize = $('ul.expmenu ').find('li').size();
    var activeSize = $('ul.expmenu ').find('li.active').size();
    if (liSize == activeSize) {
      arrow.parents('.sidebar').find('.clink-all span').html('全部隐藏');
      arrow.parents('.sidebar').find('.clink-all').addClass("active");
    } else {
      arrow.parents('.sidebar').find('.clink-all span').html('全部展开');
      arrow.parents('.sidebar').find('.clink-all').removeClass("active");
    }
    setExpmenuIndex();
  });

  store_qr_show();


});
function is_pandain_tips() {
  var url = "/store/check/PDRemind";
  $.get(url, function (data) {
    console.log("提醒");
    console.log(data);
    if (data.status == 'OK' && data.pdNumList.length > 0) {// 离盘点
      $("#notice_pandian_alert").modal("hide");//关闭前一个弹框
      //弹框提示
      setTimeout(function () {
        $("#notice_pandian_alert").modal("show")
      }, 500);
    }
  });
}


function setExpmenuIndex() {
  var index = [];
  $(".expmenu").find("li").each(function () {
    if ($(this).hasClass("active")) {
      index[$(this).index()] = $(this).index();
    }
    else {
      index[$(this).index()] = '';
    }
  });
  document.cookie = 'ExpmenuIndex=' + index + ";path=/";
}

//判断商户后台是否配置了线下扫码
$(function(){
  if($("#offline_code_input").val())
    $("#offline_code").show();
  else
    $("#offline_code").hide();

});

function getExpmenuIndex() {
  var ExpmenuIndex = [], element;
  var cookie = document.cookie;
  var arrCookie = cookie.split("; ");
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    if ("ExpmenuIndex" == arr[0]) {
      ExpmenuIndex = arr[1].split(",");
      break;
    }
  }
  for (var i = 0; i < ExpmenuIndex.length; i++) {
    if (ExpmenuIndex[i] != '') {
      element = "ul.expmenu li:eq(" + ExpmenuIndex[i] + ")";
      $(element).addClass("active");
    }
  }
}
function select_menu() {
  var pathname = $('[name="leftmenu"]').val();
  if (!pathname) pathname = window.location.pathname;
  $(".sidebar .expmenu li.active").removeClass("active");
  $(".sidebar .expmenu li .menu .item.active").removeClass("active");

  $(".sidebar .expmenu li .menu .item a[href='" + pathname + "']").parents(".item").addClass("active");
  $(".sidebar .expmenu li .menu .item a[href='" + pathname + "']").parents("li").addClass("active");


}

//微信服务号
function store_qr_show() {
  $(".pull-right").children(".qrcode").hover(function () {
    if (!$("#grcode").attr("has-data")) {
      var url = "/store/storeqr";
      $.post(url, {}, function (data) {
        $("#grcode").attr("src", data.qr).attr("has-data", true);
      });
    }
  });
}
function AlertLoading(dom) {
  dom.parent().css('position', 'relative');
  //dom给需要的标签内 加 效果
  var load =
    '<div class="sk-circle" style="position: absolute; top: 50%;left: 50%;">' +
    '<div class="sk-circle1 sk-child"></div>' +
    '<div class="sk-circle2 sk-child"></div>' +
    '<div class="sk-circle3 sk-child"></div>' +
    '<div class="sk-circle4 sk-child"></div>' +
    '<div class="sk-circle5 sk-child"></div>' +
    '<div class="sk-circle6 sk-child"></div>' +
    '<div class="sk-circle7 sk-child"></div>' +
    '<div class="sk-circle8 sk-child"></div>' +
    '<div class="sk-circle9 sk-child"></div>' +
    '<div class="sk-circle10 sk-child"></div>' +
    '<div class="sk-circle11 sk-child"></div>' +
    '<div class="sk-circle12 sk-child"></div>' +
    '</div>';
  dom.append(load);   //loading追加到tbody之后
}
