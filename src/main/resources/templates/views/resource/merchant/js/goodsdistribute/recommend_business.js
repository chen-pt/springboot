
  // $("#shangpin").on('click',function(){
  //
  //   category();
  //   alert("11111");
  // })
  //
  //
  // var ACCOUNT = {};
  //
  // var page_total = 0;
  // var pagesize = 0;
  // var total = 0;
  // ACCOUNT.GetNum = {
  //
  //   settings: {
  //     //modalID: '#modal-slider',
  //   },
  //   init: function () {
  //     this.ajaxGetList(1);
  //     this.even();
  //   },
  //   even: function () {
  //     $("#search").on("click", function () {
  //
  //       ACCOUNT.GetNum.ajaxGetList(1);
  //     });
  //     $(".select_trades_detail").live("click",function(){
  //       var text = $(this).html();
  //       // text = "1001791481788286884";
  //       alert(text);
  //       $.ajax({
  //         type: 'post',
  //         url: "/jk51b/selectTradesDetails",
  //         data: {"tradesId":text},
  //         dataType: 'json',
  //         success: function (data) {
  //           console.log(data);
  //
  //         }
  //       });
  //     });
  //   },
  //   ajaxGetList: function (pageno) {
  //     pageno = pageno || 1;
  //     var pageSize = 15;
  //
  //     var datas = {
  //       "pageNum": pageno,
  //       "pageSize": pageSize,
  //       "sellerId": $("input[name=merchant_id]").val(),
  //       "sellerName": $("input[name=merchant_name]").val(),
  //       "executeStatus": $('#summary_status option:selected').val(),
  //       "financeNo":$("input[name=debit_id]").val(),
  //       "sOutDate": $("input[name=start_time]").val(),
  //       "eOutDate": $("input[name=end_time]").val()
  //     };
  //     console.log(datas);
  //     AlertLoading($("#detail-list"));
  //     $.ajax({
  //       type: 'post',
  //       url: "/merchant/getGoodsDistributeList",
  //       data: datas,
  //       dataType: 'json',
  //       success: function (data) {
  //         page_total = data.value.pageNum;
  //         pagesize = data.value.pageSize;
  //         total = data.value.total;
  //         console.log(data);
  //         $("#detail-list").empty();
  //
  //
  //         // pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
  //
  //         var tmpl = document.getElementById('accountDetail').innerHTML;
  //         var doTtmpl = doT.template(tmpl);
  //         $("#detail-list").append(doTtmpl(data));
  //
  //       }
  //     });
  //   }
  // };
  //
  // ACCOUNT.init = function () {
  //   ACCOUNT.GetNum.init();
  // };
  // $(function () {
  //   ACCOUNT.init();
  // });





  /**
   * Created by boren on 15/9/7.
   * 分销订单
   */
  require(['core', 'vue'],function(core, Vue)
  {
    var distributiongoods = {};

    distributiongoods.distributiongoods_list_pageno=1;
    distributiongoods.cur_per_page= $('.page_size_select').find('option:selected').val()?$('.page_size_select').find('option:selected').val():15;
    distributiongoods.serch_msg='';


    distributiongoods.get_distributiongoods_list = function (){

      var vm =  new Vue({
        delimiters: ['<%', '%>'],
        el:"#detail-list",
        data:function(){
          return {result:'',status:''}
        },
        mounted: function(){
          var _self = this;
          _self.getDistributionGoodsList();

        },
        methods:{
          getDistributionGoodsList:function(){
            getList(this);
          }
        }
      });

      function getList(_self){
        $(function(){
          var url=core.getHost() +"/merchant/getGoodsDistributeList";

          var datas={};

          datas.current_page=distributiongoods.distributiongoods_list_pageno;
          datas.per_page=distributiongoods.cur_per_page;
          datas.cate_code = $("input[name='classify']").val();
          datas.goods_name = $("#goods_name").val();
          datas.goods_title = $("#goods_title").val();
          datas.goods_code = $("#goods_code").val();
          datas.minPrice = $("#minPrice").val();
          datas.maxPrice = $("#maxPrice").val();
          datas.template_name = $("#template_name").val();

          $.ajax({
            url:url,
            data:datas,
            type:'post',
            success:function(data){
              console.log(data);

              _self.result = data.value;
              _self.status = data.code === '000';
              if(!data.status || data.value.list.length == 0){
                $("#loading").show();
                $("#loading_msg").html("暂无数据！");
              }else{
                $("#loading").hide();
                $("#loading_msg").html("加载中。。。");
              }

              $.each(data.value.list, function (k, v) {
                $maxdiscount = 0;
                $mindiscount = 100;
                v.discount = JSON.parse(v.discount);
                v.reward= JSON.parse(v.reward);
                for (var num in v.discount) {
                  if(parseFloat(v.discount[num])!=100){
                    if($maxdiscount<parseFloat(v.discount[num])){
                      $maxdiscount = v.discount[num];
                    }
                    if(v.discount[num]!=''&&$mindiscount>parseFloat(v.discount[num])){
                      $mindiscount = v.discount[num];
                    }
                  }
                }
                data.value.list[k].maxdiscount = $maxdiscount;
                data.value.list[k].mindiscount = $mindiscount;
              });

              $('#pageinfo').pagination({
                pages: data.value.total,
                styleClass: ['pagination-large'],
                showCtrl: true,
                displayPage: 6,
                currentPage: distributiongoods.distributiongoods_list_pageno,
                onSelect: function (num) {
                  distributiongoods.distributiongoods_list_pageno=num;
                  _self.getDistributionGoodsList();
                }
              });
              $('#pageinfo').pagination('updatePages',data.value.total_pages);

              $('.pagination-large').find('div span:eq(0)').empty();
              if(data.value.total_items>0){
                var html = $('.pagination-large').find('div span:eq(0)').html();
                $('.pagination-large').find('div span:eq(0)').html("<select class='page_size_select'><option value='15'>15</option><option value='30'>30</option><option value='50'>50</option><option value='100'>100</option></select>"+html+"(" + data.value.total_items + "条记录)");
                $('.page_size_select').find('option[value='+distributiongoods.cur_per_page+']').attr("selected",true);
              }else{
                var html = $('.pagination-large').find('div span:eq(0)').html();
                $('.pagination-large').find('div span:eq(0)').html("<select class='page_size_select'><option value='15'>15</option><option value='30'>30</option><option value='50'>50</option><option value='100'>100</option></select>"+html+"(0条记录)");
                $('.page_size_select').find('option[value='+distributiongoods.cur_per_page+']').attr("selected",true);
              }
            }
          });
        });
      }
      $('.page_size_select').live('change',function(){
        distributiongoods.distributiongoods_list_pageno=1;
        distributiongoods.cur_per_page=$(this).val();
        vm.getDistributionGoodsList();
      });
      $("#search_btn").click(function(){
        $("#loading_msg").html("加载中。。。");
        distributiongoods.distributiongoods_list_pageno=1;
        vm.getDistributionGoodsList();
      });
    }
    distributiongoods.get_distributiongoods_list();
  })



















