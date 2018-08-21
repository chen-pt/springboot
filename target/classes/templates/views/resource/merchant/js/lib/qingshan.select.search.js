/**
 * Created by qingshan on 2017/3/27.
 */
var ArrNameList = [];
var ArrIdList = [];
var isClose = false;

$(document).on('mouseleave', '.fake_div', function () {
  if ($(".fake_div").length > 0 && !$(".fake_div").hasClass("lee_hide")) {
    isClose = true;
  }
});
$(document).on('mouseleave', '[data-search="qs"]', function () {
  if ($(".fake_div").length > 0 && !$(".fake_div").hasClass("lee_hide")) {
    isClose = true;
  }
});

$(document).on('mouseover', '.fake_div', function () {
  isClose = false;
});
$(document).click(function () {
  console.log('isclose:' + isClose);
  if (isClose) {
    $(".fake_div").addClass("lee_hide");
    isClose = false;
  }
});
$(document).ready(function () {
  $('[data-search="qs"]').css({
    "width": "180px",
    "height": "20px",
    "text-indent": "5px",
    "background-image": "url(/templates/views/resource/merchant/img/arrow.png)",
    "background-repeat": "no-repeat",
    "background-position": "98% 50%",
    "border": "1px solid #eee"
  }).attr("placeholder", "请选择门店");
});

$(".fake_sub_div").live("click", function () {
  isClose = false;
  $('[data-search="qs"]').val($(this).attr("data-content"));
  $('[data-search="qs"]').attr("data-id", $(this).attr("data-id"));
  $(".fake_div").addClass("lee_hide");
}).live("mouseover", function () {
  $(this).css({'background': '#aaa', 'color': '#fff'});
}).live("mouseout", function () {
  if ($(this).attr("data-content") == $('[data-search="qs"]').val()) {
    $(this).css({'color': '#f00', 'background': '#fff'});
  } else {
    $(this).css({'color': '#000', 'background': '#fff'});
  }
});

$('[data-search="qs"]').live("keyup", function () {
  $(".fake_sub_div").each(function () {
    if ($(this).hasClass("clear")) {
      return false
    }
    ;
    if ($(this).attr('data-content').indexOf($('[data-search="qs"]').val()) < 0) {
      $(this).addClass("lee_hide");
    } else {
      var tmpHtml = $(this).attr('data-content');
      $(this).html(tmpHtml.substr(0, $(this).attr("data-content").indexOf($('[data-search="qs"]').val())) + "<span style='color:#f00'>" + $('[data-search="qs"]').val() + "</span>" + tmpHtml.substr($(this).attr("data-content").indexOf($('[data-search="qs"]').val()) + $('[data-search="qs"]').val().length, tmpHtml.length - ($(this).attr("data-content").indexOf($('[data-search="qs"]').val()) + $('[data-search="qs"]').val().length)));
      $(this).removeClass("lee_hide")
    }
  })
}).live("click", function () {
  if ($('.lee_hide')) {
    $('.fake_sub_div').removeClass('lee_hide');
  }
  if ($(".fake_div").length > 0) {
    $(".fake_sub_div").css("color", "#000");
    $("div[data-content='" + $('[data-search="qs"]').val() + "']").css("color", "#f00");
    $(".fake_div").removeClass("lee_hide");
    return;
  }
  var div = "<div class='fake_div' style='position:absolute;z-index:100;min-width:" + ($('[data-search="qs"]').width() + 23) + "px;'>";
  //div += "<input type='text' style='width:177px;height:20px;' />";
  div += "<div style='background: #fff;max-height: 200px;overflow-y: scroll;'>";
  $.each(ArrNameList, function (i, content) {
    if (content) div += "<div class='fake_sub_div' style='line-height:20px;border:1px solid #eee;cursor: pointer;padding:5px;text-align: center;' data-id='" + (ArrIdList[i] ? ArrIdList[i] : -1) + "' data-content='" + content + "'>" + content + "</div>";
  });
  div += "<div class='clear'></div></div>";
  $(this).parent().append(div);
}).live("blur", function () {
  var tmpVal = $(this).val();
  if (tmpVal) {
    var hasContent = false;
    $.each(ArrNameList, function (i, content) {
      if (tmpVal == content) {
        hasContent = false;
      }
    });
    $(this).val($(".fake_sub_div:not(.lee_hide)").attr("data-content"));
  }
});

