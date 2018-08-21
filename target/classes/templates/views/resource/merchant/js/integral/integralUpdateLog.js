/**
 * Created by Administrator on 2017/6/6.
 */
$(function () {

  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core',
      'vue-agenation':'merchant/js/integral/VuePagenation',
    }
  })
  require(['vue','core','vue-agenation'],function (Vue,core,VuePagenation) {
    var vm = new Vue({
      el:"#recoreTemplate",
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
        page:'getIntegralLog',
        pageSize:'getIntegralLog'
      },

      components:{
        "vue-pagenation":VuePagenation
      },
      methods:{
        getIntegralLog:function () {
          var _self = this;
          var url = core.getHost()+'/integral/record';
          var param = {};
          param.page = _self.page;
          param.pageSize = _self.pageSize;

          $.ajax({
            type:'get',
            data:param,
            url:url
          }).then( function (res) {
            console.log(res);
            if(res.message == "Success"){
              _self.result = res.value;
              _self.pages = res.value.totalPages;
              _self.total = res.value.total;
            }
          })
        },
        pageChange(page){
          this.page = page;
        },
        pageSizeChange(pageSize){
          this.pageSize = pageSize;
        }
      },

      filters:{
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        }
      },
      mounted:function () {
        this.getIntegralLog();

      }
    });
  });
});


