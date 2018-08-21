var vm;

$(function () {

  vm = new Vue({
    el: '#noticeList',
    data: {
      noticeGroup:[]
      // noticeGroup:[{
      //   id:-1,
      //   title:'',
      //   version:'',
      //   platform_type:'',
      //   create_time:'',
      //   author:'',
      //   status:-1
      // }]
    },
    methods: {
      deleteById:deleteById,
      updateById:updateById
    }
  })

  getNoticeGroup();

  $('.page_size_select').change(function () {

    pageSize = this.val();

    getNoticeGroup();

  })

})

//更新
function updateById(id) {
  window.location.href = "/jk51b/update_notice/" + id;
}

//删除
function deleteById(id) {

  if(confirm("确定要删除吗？")){
    $.post("/jk51b/notice/delete",
      {id: id},
      function (result) {
        if (result.message == 'Success') {
          layer.msg('删除成功');
          setTimeout(function () {
            $("#")
            window.location.href="/jk51b/notice_index";
          },500)
        }else {
          layer.msg('删除失败');
        }
      });
  }


}

//<----------------------------------------列表start---------------------------------------->
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

//获取搜索条件
function getParams() {

  var params={};

  var author = $("#author").val();
  var title = $("#title").val();
  var platform_type = $("#platform_type").val();
  var status = $("#status").val();
  var start_time = $("#start_time").val();
  var end_time = $("#end_time").val();

  if(author)params.author=author;
  if(title)params.title=title;
  if(platform_type)params.platform_type=platform_type;
  if(status)params.status=status;
  if(start_time)params.start_time=start_time + " 00:00:00";
  if(end_time)params.end_time=end_time + " 00:00:00";

  params.pageSize = pageSize;
  params.pageNum = curPage;
  params.is_del = 0;

  return params;

}
//获取公告数据
function getNoticeGroup() {

  $.post("/jk51b/notice/getNoticeGroup",
    getParams(),
    function(result){
      if(result.message == 'Success'){

        vm.noticeGroup = result.value.list;

        totalNum = result.value.total;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        if($('.pageinfo')){
            $('.pageinfo').remove();
        }

        $("#noticeList").append("<span class='pageinfo'></span>")

        $('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getNoticeGroup();
          }
        });
        getNum();
      }else {
        layer.msg(result.message);
      }
    },
    "json");
}

function getNum(){
  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select" style="width: 50px;">';

  $.each(pagearr, function(){

    if(this==pageSize)
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });

  pageselect = pageselect+'</select>&nbsp;';

  $('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('.page_size_select').change(function () {
    pageSize = $('.page_size_select').val();
    getNoticeGroup();
  })

}

//<-------------------------------------***列表end***---------------------------------------->
