/**
 * Created by Administrator on 2017/6/6.
 */
$(function () {
  var itemsCount;
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core',
      'vue-agenation':'merchant/js/integral/VuePagenation',
    }
  })
  require(['vue','core','vue-agenation'],function (Vue,core,VuePagenation) {
    //noinspection JSAnnotator
    var vm = new Vue({
      el:"#detail",
      data:{
        page: 1,//当前页
        pageSize:15,
        pages: 50,
        total: 50,
        displayPage:6,//分页菜单显示
        result:[],
        msg: ''
      },
      watch:{
        page:'queryVisitDetailList',
        pageSize:'queryVisitDetailList'
      },
      components:{
        "vue-pagenation":VuePagenation
      },
      methods:{
        queryVisitDetailList:function () {
          var _self = this;
          var url = core.getHost()+'/merchant/queryVisitDetailList';
          var param = {};
          param.page = _self.page;
          param.pageSize = _self.pageSize;
          var title=$("#activityTitle").val();
          var startTime=$("#startTime").val();
          var endTime=$("#endTime").val();
          var adminName=$("#adminName").val();
          var adminMobile=$("#adminMobile").val();
          var bvsId=$("#activityId").val();
          if(title) param.title=title;
          if(startTime) param.startTime=startTime;
          if(endTime)param.endTime=endTime;
          if(adminName)param.adminName=adminName;
          if(adminMobile)param.adminMobile=adminMobile;
          if(bvsId)param.bvsId=bvsId;
          $.ajax({
            type:'POST',
            data:param,
            url:url
          }).then( function (res) {
            console.log(res);
            if(res.message == "Success"){
              _self.result = res.value;
              _self.pages = res.value.pages;
              _self.total = res.value.total;
              itemsCount=res.value.total;
            }
          })
        },
        search_report:function () {
          if (itemsCount == 0){
            $(".order_hint").html('根据本次查询条件，未查询到相关会员信息！');
          }else if (itemsCount > 10000){
            $(".order_hint").html('根据本次查询条件，共查询到<span style="color:red">' + itemsCount + '</span>条记录，已超过&nbsp;10000&nbsp;条的最大值，请修改查询条件，分批次下载。');
            $("#export_list").attr({class:'sui-modal show fade'});
            return;
          }else {
            $(".order_hint").html("根据本次查询条件，共查询到"+itemsCount+"条结果,请<a id = 'do-export'>点击下载</a>");
          }
          $("#export_list").attr({class:'sui-modal show fade'});
          $("#do-export").click(function () {
            var param = {};
            var title=$("#activityTitle").val();
            var startTime=$("#startTime").val();
            var endTime=$("#endTime").val();
            var adminName=$("#adminName").val();
            var adminMobile=$("#adminMobile").val();
            var activityId=$("#activityId").val();
            if(title) param.title=title;
            if(startTime) param.startTime=startTime;
            if(endTime)param.endTime=endTime;
            if(adminName)param.adminName=adminName;
            if(adminMobile)param.adminMobile=adminMobile;
            if(activityId)param.activityId=activityId;

            var form=$("<form>");//定义一个form表单
            form.attr("style","display:none");
            form.attr("target","");
            form.attr("method","post");
            for(var i in param){
              form.append('<input type="hidden" name="'+i+'" value="'+param[i]+'" >');
            }
            console.log(form.html());
            form.attr("action","/merchant/visitDetail/report");
            $("body").append(form);//将表单放置在web中
            form.submit();//表单提交
          });
        },
        pageChange:function(page){
          this.page = page;
        },
        pageSizeChange:function(pageSize){
          this.pageSize = pageSize;
        }
      },
      mounted:function () {
        this.queryVisitDetailList();
      }
    });
  });


});


