/**
 * Created by admin on 2017/4/20.
 */
/**
 * Created by qingshan on 2017/3/29.
 */
var pagination_page_no = 1; //页码
var pagination_pages = 1; //总页数
var pagination_totals = 0; //总条数
var pagination_pagesize = 5; //每页显示多少条

function addpage(methodName) {

  if (pagination_page_no > pagination_pages) pagination_page_no = pagination_pages;
  $('.pageinfo').pagination({
    pages: pagination_pages, //总页数
    styleClass: ['pagination-large'],
    showCtrl: true,
    displayPage: 6,
    currentPage: pagination_page_no, //当前页码
    onSelect: function (num) {
      pagination_page_no = num;
      if (typeof methodName === "function") {
        methodName();
      }
    }
  });

  $('.pageinfo').find('span:contains(共)').append("(" + pagination_totals + "条记录)");

  var pageselect = '&nbsp;<select class="page_size_select" style="width:80px;">';
  var pagearr = [5, 10, 15, 20];
  $.each(pagearr, function () {

    if (this == pagination_pagesize) {
      pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>';
    } else {
      pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>';
    }
  });

  pageselect = pageselect + '</select>&nbsp;';
  if (!$('.page_size_select').val()) {
    $('.pageinfo').find('span:contains(共)').prepend(pageselect);
  }


  $('.page_size_select').one('change', function () {
    pagination_pagesize = $(this).val();
    methodName();
  });


};

