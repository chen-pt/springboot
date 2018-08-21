$(document).ready(function () {
  select(1);
});

function selectCommentList(pageSize,pageNum) {
  $.ajax({
    type:'post',
    url:'/merchant/commentlist',
    data:data,
    dataType: 'json',
    success:function (data) {
      console.log(data);
      var tmpl=document.getElementById('index_list').innerHTML;
      var doTtmpl=doT.template(tmpl);
      console.log(doTtmpl);
      $("#order_list").append(doTtmpl(data));

      var pageTmpl=document.getElementById('page').innerHTML;
      var pageDoTtmpl=doT.template(pageTmpl);
      $(".sui-form").append(pageDoTtmpl(data));
    }
  });
}
