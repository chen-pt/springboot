//左边的导航栏展开和隐藏
$(document).ready(function () {
  var arrow = $("a.clink-all");
  arrow.parent().find("ul.expmenu li").addClass("active");
  arrow.find("span").text('全部隐藏');
  arrow.removeClass("active");
  arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
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
  });

//             导航栏tab切换
  $(".nav-tabs li").click(function () {
    $(this).addClass("active").siblings("li").removeClass("active");
  })

  $("#check-all").click(function () {
    $('table').find('[type="checkbox"]').checked = true;
    $('table').find('[type="checkbox"]').prop('checked', true);
  });
  $('#batch-del').click(function () {
    $('table').find('[type="checkbox"]:checked').parents('tr').remove();
  });
  $(".select_all_btn").click(function () {
    if ($(this).prop('checked')) {
      $('table').find('[type="checkbox"]').prop('checked', true);
      $('table').find('[type="checkbox"]').parent().addClass('checked');
    } else {
      $('table').find('[type="checkbox"]').prop('checked', false);
      $('table').find('[type="checkbox"]').parent().removeClass('checked');
    }
  });

  initDatePicker();

});
function pageInfo(container, pageno, page_total, pagesize, total, callback) {
  pageno = pageno || 1;
  if (!('object' === typeof(container))) {
    var $pagein = $(container);
  } else {
    $pagein = container;
  }
  // 清空缓存的配置
  $pagein.data('sui-pagination', '');
  $pagein.pagination({
    pages: page_total,
    styleClass: ['pagination-large', 'pagination-right'],
    showCtrl: true,
    displayPage: 6,
    pageSize: pagesize,
    itemsCount: total,
    currentPage: pageno,
    onSelect: function (num) {
      $pagein.find('span:contains(共)').append("(" + total + "条记录)");
      callback(num);
    }
  });
  $pagein.find('span:contains(共)').append("(" + total + "条记录)");
}

function AlertLoading(dom){    //dom给需要的标签内 加 效果
  dom.parent().css({                  //方便居中显示，给table加relative
    position: 'relative'
  });
  var load =
    '<div class="alert-loading" style="width: 100px;height:100px">'+
    '<div class="sk-circle">'+
    '<div class="sk-circle1 sk-child"></div>'+
    '<div class="sk-circle2 sk-child"></div>'+
    '<div class="sk-circle3 sk-child"></div>'+
    '<div class="sk-circle4 sk-child"></div>'+
    '<div class="sk-circle5 sk-child"></div>'+
    '<div class="sk-circle6 sk-child"></div>'+
    '<div class="sk-circle7 sk-child"></div>'+
    '<div class="sk-circle8 sk-child"></div>'+
    '<div class="sk-circle9 sk-child"></div>'+
    '<div class="sk-circle10 sk-child"></div>'+
    '<div class="sk-circle11 sk-child"></div>'+
    '<div class="sk-circle12 sk-child"></div>'+
    '</div>'+
    '</div>';   //loading  dom
  dom.append(load);    //loading追加到tbody之后
  /*$('.sk-circle').parent().remove(); //移除Loading效果*/
}

/*日期范围的选择限制*/
function initDatePicker() {
  $('#start_date,#create_time_start,#start_time,#date_start').datepicker()
    .on('changeDate', function (e) {
      $('#end_date,#create_end,#end_time,#date_end').datepicker('setStartDate', e.date);
    });
  $('#end_date,#create_end,#end_time,#date_end').datepicker()
    .on('changeDate', function (e) {
      $('#start_date,#create_time_start,#start_time,#date_start').datepicker('setEndDate', e.date);
    });
}
