/** 升级公告关闭**/
$('.lee-close-btn').on('click', function () {
  $(this).parents('.sui-msg.msg-large.msg-block.msg-notice').addClass('lee_hide')
  var url = '/admin/bshop/close_notice'
  $.get(url)
})

// 左边的导航栏展开和隐藏
$(document).ready(function () {

  is_order_tips();
  setInterval('is_order_tips()', 1000 * 60);//后台接口影响，这里设置为每分钟查询一次

  is_pandain_tips();
  setInterval('is_pandain_tips()', 1000 * 60);//后台接口影响，这里设置为每分钟查询一次

  $('a.clink-all').click(function () {
    var arrow = $(this)
    if ($('.expmenu').find('li[class=active]').length == $('.expmenu').find('li').length) {
      arrow.parent().find('ul.expmenu li').removeClass('active')
      arrow.find("span").text('全部隐藏');
      arrow.removeClass("active");
      arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom')
    } else {
      arrow.parent().find('ul.expmenu li').addClass('active')
      arrow.find("span").text('全部展开');
      arrow.addClass("active");
      arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top')
    }
  })
  $('ul.expmenu li > .nav-header').click(function () {
    var arrow = $(this).parent('ul.expmenu li')
    // 当前ul.expmenu li 是否展开和隐藏
    if (arrow.hasClass('active')) {
      arrow.removeClass('active')
      arrow.find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom')
    } else if (arrow.hasClass('')) {
      arrow.addClass('active')
      arrow.find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top')
    }
    // ul.expmenu li是否全部展开和隐藏
    var liSize = $('ul.expmenu ').find('li').size()
    var activeSize = $('ul.expmenu ').find('li.active').size()
    if (liSize == activeSize) {
      arrow.parents('.sidebar').find('.clink-all span').html('全部隐藏')
      arrow.parents('.sidebar').find('.clink-all').addClass('active')
    } else {
      arrow.parents('.sidebar').find('.clink-all span').html('全部展开')
      arrow.parents('.sidebar').find('.clink-all').removeClass('active')
    }
  })

  $(".select_all_btn").click(function () {
    if ($(this).prop('checked')) {
      $('table').find('[type="checkbox"]').prop('checked', true);
      $('table').find('[type="checkbox"]').parent().addClass('checked');
    } else {
      $('table').find('[type="checkbox"]').prop('checked', false);
      $('table').find('[type="checkbox"]').parent().removeClass('checked');
    }
  });
  $('table [type="checkbox"]:not(.select_all_btn)').live("click", function () {
    if ($('table [type="checkbox"]:not(.select_all_btn)').length == $('table [type="checkbox"]:not(.select_all_btn):checked').length) {
      $('.select_all_btn').prop('checked', true);
      $('.select_all_btn').parent().addClass('checked');
    } else {
      $('.select_all_btn').prop('checked', false);
      $('.select_all_btn').parent().removeClass('checked');
    }
  });
  /*盘点表页面条件查询页面*/
  $(".check_btn_hide").click(function () {
    $(this).parent().next().toggle(1000);
  });
  $('table [type="checkbox"]:not(.select_all_btn)').live("click", function () {
    if ($('table [type="checkbox"]:not(.select_all_btn)').length == $('table [type="checkbox"]:not(.select_all_btn):checked').length) {
      $('.select_all_btn').prop('checked', true);
      $('.select_all_btn').parent().addClass('checked');
    } else {
      $('.select_all_btn').prop('checked', false);
      $('.select_all_btn').parent().removeClass('checked');
    }
  });
  select_menu();
});

function select_menu() {
  var pathname = $('[name="leftmenu"]').val();
  if (!pathname) pathname = window.location.pathname;
  $(".sidebar .expmenu li.active").removeClass("active");
  $(".sidebar .expmenu li .menu .item.active").removeClass("active");

  $(".sidebar .expmenu li .menu .item a[href='" + pathname + "']").parents(".item").addClass("active");
  $(".sidebar .expmenu li .menu .item a[href='" + pathname + "']").parents("li").addClass("active");


}
function is_pandain_tips() {
  var url = "/merchant/PDRemind";
  $.get(url, function (data) {
    //console.log("提醒");
    console.log(data);
    if (data.status == 'OK' && data.pdNumList.length > 0) {// 离盘点还有30分钟
      $("#notice_pandian_alert").modal("hide");//关闭前一个弹框
      //弹框提示
      setTimeout(function () {
        $("#notice_pandian_alert").modal("show")
      }, 500);
    }
  });
}

function is_order_tips() {

  var url = "/merchant/autoRemind?time=1";
  var datas = {};
  $.post(url, datas, function (data) {
    if (data && data.value.data && data.value.data.length > 0) {
      //order_message(data.value.data[data.value.data.length - 1].tradesId);
      order_message(data.value.data[0].tradesId);//如果有多个新订单，默认取第一个

      // 调用订单提醒
      //order_message(1000301490578204939);
    }
  });
}

/**
 * 消息提醒
 */
function order_message(tradesId) {
  var postdata = {};

  postdata.time = 1;

  //setTimeout('order_message()',postdata.time*60*1000);

  //保留
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/merchant/getRemind',
    success: function (data) {
      console.log("提醒");
      console.log(data);
      if (data.code == "000") {
        if (data.value.order_pc_alert == 1) {// 有已付款的新订单时，电脑弹窗提醒 0=禁用 1=启用
          console.log('需要弹框-----');
          //关闭前一个弹框
          $("#notice_alert").modal("hide");
          //弹框提示
          setTimeout(function () {
            $("#notice_alert").modal("show")
          }, 500);
          console.log("订单号" + tradesId);
          var tid = ' <a href="/merchant/orderDetail?tradesId=' + tradesId + '"  style = "font-size: 14px;">查看订单详情</a><br>'

          $("#look_new_order").empty().append(tid);
        }
        if (data.value.order_voice_alert == 1) {
          console.log('需要语音提醒-----');
          $("#music").html('');
          if (navigator.userAgent.indexOf("Firefox") > 0) {
            var str = '<audio autoplay="autoplay" src="/templates/views/resource/merchant/elsefile/order.mp3"> </audio>';
            $("#music").prepend(str);
          } else {
            $("#music").prepend('<Embed id="music_play" src="/templates/views/resource/merchant/elsefile/order.mp3" width="0" height="0" AUTOSTART="TURE" LOOP="FALSE"></Embed>');
          }
        }
      }

    }
  });
}


function AlertLoading(dom) {    //dom给需要的标签内 加 效果
  dom.parent().css({                  //方便居中显示，给table加relative
    position: 'relative'
  });
  var load =
    '<div class="alert-loading" style="width: 100px;height:100px">' +
    '<div class="sk-circle">' +
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
    '</div>' +
    '</div>';   //loading  dom
  dom.append(load);    //loading追加到tbody之后
  /*$('.sk-circle').parent().remove(); //移除Loading效果*/
}

var _imgConfig = {
  url: $("#img_url_prefix").val() || "/templates/views/resource/merchant/img/empty.jpg",
}

function _imgLink(hash, size, suffix, defaultImg) {
  suffix = suffix || ".jpg";
  defaultImg = defaultImg || "/templates/vAiws/resource/merchant/img/empty.jpg";
  size = "/" + size + "/" || "/200x200/";
  return hash ? $("#img_url_prefix").val() + size + suffix : defaultImg;
}

