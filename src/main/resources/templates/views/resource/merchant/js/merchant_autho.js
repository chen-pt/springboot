$(function () {

  /*function chooseMerchant(id,name) {
    $("input[name='merchantName1']").html(id+name);
  }*/
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core',
      'vue-agenation':'merchant/js/integral/VuePagenation',
    }
  });
  require(['vue','core','vue-agenation'],function (Vue,core,VuePagenation) {
    var vm = new Vue({
        el:'#merchantAuthoLog',
        data:{
          page: 1,//当前页
          pageSize:15,
          pages: 50,
          total: 50,
          displayPage:6,//分页菜单显示
          result:[],
          msg: ''
        },
        watch:{ //当前页和每页条数的变化都会触发chooseMerchant()函数
          page:'queryMerchantList',
          pageSize:'queryMerchantList'
        },
        components:{
        "vue-pagenation":VuePagenation
        },
        methods:{
          //生成授权码,
          generateAutho:function () {
            //生成之前先判断当前页是否已经生成,否则刷新
            var isAlready = $("#generateAuthoShow").html();
            if((isAlready != null || isAlready != '') && isAlready != '请点击生成') {
              alert("当前页授权码已经生成,请刷新页面再试!");
              return false;
            }
            var url = "/jk51b/insertLog";
            var datas={};
            var merchantName = $("input[name='merchantName1']").val();
            if(merchantName  == null || merchantName == '') {
              alert("请先选择商家!");
              return false;
            }
            if(merchantName == "所有商家") {
              datas.siteId = 1;
            }else{
              merchantName = merchantName.split("    ");
              datas.siteId = merchantName[0];
            }

            datas.effectiveTimeLength=$("select[name='effectiveTimeLength']").val();
            var applyReason=$("textarea[name='applyReason']").val();
            datas.applyReason= applyReason;
            if(applyReason == null || applyReason == '') {
              alert("请输入申请原因!")
              return false;
            }
            $.ajax({
              url: url,
              data: datas,
              async: false,
              type: 'post',
              success: function (data) {
                console.log(data);
                if(data.result == "success"){
                  var authoCode = data.authoCode;
                  var finishTime = data.finishTime;
                  /*$("#callback").html("以上为<font color='red'>默认值</font>，点击生成之后显示下面信息<br/>");
                  $("#callback").append("授权码: <span>"+authoCode+"</span><br/><br/>");
                  $("#callback").append("有效期至：<span>"+finishTime+"</span>,<font color='red'>请在有效期内使用，过期作废</font>").css({display:"block"});*/
                  $("#generateAuthoShow").html(authoCode);
                  $("#workTimeShow").html(finishTime+"&nbsp;&nbsp;<font color='red'>请在有效期内使用，过期作废</font>");

                }else{
                  alert("生成授权码错误!");
                }
              }
            });
          },
          //选择商家
          chooseMerchant:function (merchantId,merchantName) {
            // alert(merchantId);
            // alert(merchantName);
            if(merchantName == 0) merchantName = "所有商家";
            $('#myModal').modal('hide');
            if(merchantId == 1){
              $("input[name='merchantName1']").val(merchantName);
            }else{
              $("input[name='merchantName1']").val(merchantId+"    "+merchantName);
            }

          },
          //商家列表分页,根据商家名模糊查询
          queryMerchantList:function (isClick) {

            var _self = this;
            var url = core.getHost()+'/jk51b/queryMerchantList';
            var param = {};
            param.page = _self.page;  //当前页
            param.pageSize = _self.pageSize;  //每页条数
            //判断是否点击搜索
            if(isClick == 0) {
              var key = $("input[name=searchByMerchantName]").val();
              if(key == null  || "" == key) {
                alert("请输入商家名称!");
                return false;
              }else {
                param.merchantNameKey = key;
              }
            }

            $.ajax({
              type:'get',
              data:param,
              url:url
            }).then( function (res) {
              console.log(res);
              if(res.result == "success"){
                _self.result = res; //集合
                _self.pages = res.totalPages; //总页数
                _self.total = res.total;  //总条数
              }
            })
          },
          pageChange(page){
            this.page = page;
          },
          pageSizeChange(pageSize){
            this.pageSize = pageSize;
          },
          // var data = JSON.stringify(this.result);
          // var rule =JSON.stringify(this.rule);
        },
      filters:{
       dateFormat:function (time) {
       core.formatDate()
       return new Date(time).format();
       }
      },
       /*mounted:function () {
       // this.chooseMerchant();

       },*/
    });
  });
});
