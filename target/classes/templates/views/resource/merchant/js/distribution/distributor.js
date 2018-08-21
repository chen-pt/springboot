/**
 * Created by Administrator on 2017/4/17.
 */
define(['core','vue'],function (core,vue) {
  var distributor = {};
  distributor.pageno = 1;
  distributor.cur_per_page = 15;
  distributor.list = [];


  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      $("#search_btn").click();
    }
  });

  
  distributor.getDistributorList=function () {
    
    vm = new vue({
      el:"#distributor",
      data:function () {
        return {result:[],page:1,pageSize:15,msg:'加载中。。。',total:0}
      },
      
      watch:{
        page:'getDistributorSearch',
        pageSize:'getDistributorSearch',
        // total:'pagination'
      },

      filters:{
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        }
      },
      
      methods:{
        getDistributorSearch:function() {
          var _self = this;
          var url = core.getHost()+'/merchant/getDistributorList';
          var param = {};
          if($('#username').val() != ""){
            param.username = $('#username').val();
          }

          if($('#channel').val() == 0 || $('#channel').val() == 1){
            param.applyType = $('#channel').val();
          }

          var level = parseInt($('#grade').val());
          if($.inArray(level, [1,2,3,4,5]) > -1){
            param.level = level;
          }
          
          if($.inArray(parseInt($('#status').val()),[0,1,2,3]) > -1){
            param.status = $('#status').val();
          }

          if($('#start_time').val() != ""){
            param.start = $('#start_time').val();
          }

          if($('#end_time').val() != ''){
            param.end = $('#end_time').val();
          }
          
          param.pageNum = _self.page;
          param.pageSize = _self.pageSize;
          
          $.ajax({
            type:'get',
            url:url,
            data:param
          }).then(function (res) {
            console.log(res)
            _self.result = res.value;
            _self.total = _self.result.total;
            if(res.code='000' && res.value.total > 0){
              distributor.list = res.value;
              distributor.setPage(_self,_self.result.total);
            }else{
              _self.msg = "暂无数据";
            }
          });
        },
        pagination:function () {
          var pages = Math.ceil(this.total/distributor.cur_per_page);
          // console.log(0000)
          console.log(pages);
          console.log(distributor.pageno);
          $("#pageinfo").pagination({
            pages:pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage:distributor.pageno,
            onSelect: function (num) {
              _self.page = num;
              distributor.pageno = num;
            }
          });
          $('#pageinfo').find('span:contains(共)').html("(共" + this.total + "条记录)");
          distributor.addPageExtd(distributor.cur_per_page);
        }
       
      },
      
      mounted:function () {
        this.getDistributorSearch()
      }
    })
  };

  distributor.setPageSize=function (pageSize) {
    vm.$data.pageSize=pageSize;
    vm.$data.page=1;
    distributor.cur_per_page=pageSize;
  };
  
  distributor.setPage = function(_self,total){
    var pages = Math.ceil(total/distributor.cur_per_page);
    $("#pageinfo").data('sui-pagination', '')
    $("#pageinfo").pagination({
      pages:pages,
      styleClass: ['pagination-large'],
      showCtrl: true,
      displayPage: 6,
      currentPage:distributor.pageno,
      onSelect: function (num) {
        _self.page = num;
        distributor.pageno = num;
      }
    });
    $('#pageinfo').find('span:contains(共)').html("(共" + total + "条记录)");
    distributor.addPageExtd(distributor.cur_per_page);
  };
  //sui 翻页控件增加页码选择框
  distributor.addPageExtd = function (pageSize)
  {
    var pagearr = [15,30,50,100];

    var pageselect = '&nbsp;<select class="page_size_select" style="width: 40px;">';

    $.each(pagearr, function(){
      if(this==pageSize)
      {
        pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
      }else{
        pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
      }
    });

    pageselect = pageselect+'</select>&nbsp;';

    $('#pageinfo').find('span:contains(共)').prepend(pageselect);
  };
  
  
  distributor.distributorEdit = function () {
    var vm = new vue({
      el:"#distributorDetail",
      
      data:function () {
        return {operatorRecord:[],distributorDetail:'',siteName:'',page:1,pageSize:15}
      },
      watch:{
        page:'getOperatorRecordList',
        pageSize:'getOperatorRecordList'
      },
      filters:{
        accountFilter:function (account,accountType) {
          if(accountType == 300){
            return account;
          }else{
            return '--';
          }
        },
        moneyFilter:function (money) {
          return parseFloat(money/100).toFixed(2);
        },
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        }
      },
      methods:{
        getOperatorRecordList:function () {
          var url = core.getHost() +'/merchant/operatorRecord'
          var param = {};
          param.pageNum = this.page;
          param.pageSize = this.pageSize;
          param.did = location.search.match(/.*?did=(\d+)/)[1];
          
          var _self = this;
          
          $.get(url, param, function (res) {
            if(res.code == '000' && res.value.items){
              _self.operatorRecord = res.value;
              
              distributor.setPage(_self,_self.operatorRecord.total);
            }
          })
        },
        
        distributorUpdate:function () {
          var param = {};
          param.id = this.distributorDetail.id;
          console.log($('[name="status"] option:selected').val());
          param.status =$('[name="status"] option:selected').val();
          var note = $('#reamrk').val();
          
          if(param.status == this.distributorDetail.status){
            layer.msg('状态没有修改');
            return;
          }
          
          if(note == ""){
            param.note = "无";
          }else{
            param.note = note;
          }
          
          var url = core.getHost()+'/merchant/distributorSave';
          $.post(url,param,function (res) {
            if(res.code == '000'){
              location.href = core.getHost() + "/merchant/distributorManager";
            }
          })
        },
        getDistributorDetail:function () {
          var _self = this;
          var params = {};
          params.id = location.search.match(/.*?did=(\d+)/)[1];
          var url = core.getHost() + "/merchant/getDistributorDetail";
          $.get(url, params, function (res) {
            console.log(res)
           
            if(res.code == '000' && res.value){
              _self.distributorDetail = res.value;
              _self.siteName = res.siteName;

            }else{
              location.href=core.getHost()+"/merchant/distributorManager"
            }
          })
        }
      },
      mounted:function () {
        this.getDistributorDetail();
        this.getOperatorRecordList();
        
      }
    });
  };
  return distributor;
});
