/**
 * Created by Administrator on 2017/12/26.
 */
 var vm = new Vue({
  el: '#avticity_list',
  data: {
    visit_activityList: [],
    curPage:1,
    totalNum:0,
    name:"",
    title:"",
    pageSize : 15
  },
  mounted:function () {
    this.getActivityList()
  },
  created: function () {

  },
  methods: {
    timeFormate : function (time) {
      var date  = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
      return date;
    },
    getNum:function () {
      $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + vm.totalNum + "条记录)</span>");
      //页码选择
      var pagearr = [15, 30, 50, 100];

      var pageselect = '<select class="page_size_select" style="width: 50px;">';

      $.each(pagearr, function () {

        if (this == vm.pageSize) {
          pageselect = pageselect + '<option value="' + this + '"  selected>' + this + '</option>';
        } else {
          pageselect = pageselect + '<option value="' + this + '">' + this + '</option>';
        }
      });

      pageselect = pageselect + '</select>&nbsp;';

      $('.pageinfo').find('span:contains(共)').prepend(pageselect);

      $('.page_size_select').change(function () {
        vm.pageSize = $('.page_size_select').val();
        vm.getActivityList()
      })
    },
    getActivityList:function () {
      var data = {};
      data.pageSize = this.pageSize;
      data.pageno = this.curPage;
      data.name=this.name;
      data.title=this.title;
      data.start_time=$('#start_time').val();
      data.end_time=$('#end_time').val();


      $.ajax({
        type:'post',
        data:data,
        url:"/merchant/getActivityList",
      }).then( function (res) {
        if(res.message == "Success"){
          vm.visit_activityList = res.value.list;

          vm.totalNum = res.value.total;

          if($('.pageinfo')){
            $('.pageinfo').remove();
          }
          $(".activity_list").append("<span class='pageinfo' style='text-align:right'></span>")
          $('.pageinfo').pagination({
            pages: res.value.pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage: vm.curPage,
            onSelect: function (num) {
              vm.curPage = num;
              vm.getActivityList();
            }
          });
          vm.getNum();
        }else{
          vm.visit_activityList=[]
        }
      })
    }
  }
})





