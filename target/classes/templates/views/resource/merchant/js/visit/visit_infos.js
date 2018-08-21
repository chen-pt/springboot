/**
 * Created by Administrator on 2018/3/27.
 */
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
    }
  })
  require(['vue','core'],function (Vue,core) {
    //noinspection JSAnnotator
    var vm = new Vue({
      el:"#detail",
      data:{
        result:[],
      },
      methods:{
        queryVisitInfos:function () {
          var _self = this;
          var url = core.getHost()+'/merchant/queryVisitInfos';
          var param = {};
          var bvsId=$("#activityId").val();
          param.bvsId=bvsId;
          $.ajax({
            type:'POST',
            data:param,
            url:url
          }).then( function (res) {
            console.log(res);
            if(res.message == "Success"){
              _self.result = res.value;
            }
          })
        },
      },
      filters: {
        majorActivity:function (value) {
          var id=value[0];
          var str=value[1];
          var arr=str.split(",");
          var index = $.inArray(id.toString(),arr);
          if(index >= 0){
            return "主推";
          }else{
            return "---";
          }
        },
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        }
      },
      mounted:function () {
        this.queryVisitInfos();
      }
    });
  });


});


