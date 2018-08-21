var vm;

$(function () {

  vm = new Vue({
    el: '#noticeList',
    data: {
      noticeGroup:[]
    },
    methods: {

    },
    filters: {
      formatDate:function(time) {
        var date= new Date(Date.parse(time.replace(/-/g,  "/")));
        return timeStamp2String(date, 'yyyy-mm-dd');
      }
    },
  })

  getNoticeGroup();

})

//<----------------------------------------列表start---------------------------------------->
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

//获取搜索条件
function getParams() {

  var params={};

  params.pageSize = pageSize;
  params.pageNum = curPage;
  params.is_del = 0;
  params.status=1;
  params.platform_type = 115;

  return params;

}
//获取公告数据
function getNoticeGroup() {

  $.post("/store/notice/getNoticeGroup",
    getParams(),
    function(result){
      if(result.message == 'Success'){

        vm.noticeGroup = result.value.list;

        totalNum = result.value.total;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        //已经有了直接移除
        if($('.pageinfo')){
          $('.pageinfo').remove();
        }

        $("#noticeList").append("<span class='pageinfo' style='float: right;margin-right: 20px;'></span>")

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

function timeStamp2String(time){
  var datetime = new Date();
  datetime.setTime(time);
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();

  return year + "-" + month + "-" + date;
}

function getNum(){
  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
  //每页记录数选择
  var pagearr = [15,30,50,100];
  //
  var pageselect = '<select class="page_size_select">';
  //
  $.each(pagearr, function(){
  //
    if(this==pageSize)
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });
  //
  pageselect = pageselect+'</select>&nbsp;';
  //
  $('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('.page_size_select').change(function () {
    pageSize = $('.page_size_select').val();
    getNoticeGroup();
  })
}

//<-------------------------------------***列表end***---------------------------------------->
