/**
 * Created by Administrator on 2017/6/6.
 */
$(function () {

  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core',
    }
  })
  // getRulesData();
  require(['vue','core'],function (Vue,core) {
    var vm = new Vue({
      el:"#recoreTemplate",
      data:{result:[],page:1,pageSize:15},

      watch:{
        page:'getIntegralLog',
        pageSize:'getIntegralLog'
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
                if(res.value.total > 0){
                  _self.setPage()
                }
              }
          })
        },
        setPage:function(){
          var _self = this;
          var pages = this.result.totalPages;
          $("#pageinfo").data('sui-pagination', '')
          $("#pageinfo").pagination({
            pages:pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage:_self.page,
            onSelect: function (num) {
              _self.page = num;
            }
          });
          $('#pageinfo').find('span:contains(共)').html("(共" + this.result.total + "条记录)");
          this.addPageExtd();
        },
        addPageExtd:function ()
        {
          var _self = this;
          var pagearr = [15,30,50,100];

          var pageselect = '&nbsp;<select class="page_size_select" style="width: 40px;" id="pageSizeChange">';

          $.each(pagearr, function(){
            if(this==_self.pageSize)
            {
              pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
            }else{
              pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
            }
          });

          pageselect = pageselect+'</select>&nbsp;';

          $('#pageinfo').find('span:contains(共)').prepend(pageselect);
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
    $(document).on('change','#pageSizeChange',function () {
      vm.pageSize = $(this).val();
    })
  });
});


