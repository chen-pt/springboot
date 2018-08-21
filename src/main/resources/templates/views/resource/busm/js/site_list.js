$(function () {
//加载页面是请求数据
  AlertLoading($('#site-list'));
  select();
})


//搜索方法
function select() {

  var start = $("#create_time_start").val();
  var end = $("#create_time_end").val();

  if(start!='' && end!='' && start>end ){
    layer.msg("开始时间应该在结束时间之前")
    return false;
  }

  var startTime=$("#set_value_start").find("option:selected").val();
  var endTime=$("#set_value_end").find("option:selected").val();
  if(startTime>endTime){
    layer.msg("开始时间不能大于结束时间");
    return false;
  }
  $("[name=pageNum]").val(pagination_page_no);
  $("[name=pageSize]").val(pagination_pagesize);
  $.ajax({
    type: 'post',
    url: '/jk51b/selectshops',
    dataType: 'JSON',
    data: $("#site-search-form").serialize(),
    success: function (result) {
      $("#site-list").empty();
      if (result.total == 0) {
        $("#site-list").html("<div style='text-align:center'>暂无数据</div>");
      } else {
        pagination_pages = result.pages;
        pagination_totals = result.total;
        var temp = doT.template($("#shoplisttemp").text());
        var tr = temp(result.list);
        $("#site-list").html(tr);
        $("#pagediv").html("<span class='pageinfo'></span>")
        addpage(select);
      }
    },
    error: function (result) {
      $("#site-list").html("<div style='text-align: center'>暂无数据</div>");
    }
  });
}




