$(function () {

  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core'
    }
  });
  require(['vue','core'],function (Vue,core) {
    var vm = new Vue({
      el:'#shippingSetting',
      data: {
        shipping:[],
        metaId:0,
        shippingAll:[150,160],
        nameAll:['送货上门','门店自提'],
        param:{}
      },
      methods:{
        queryShipping:function () {
          var _this = this;
          $.get(core.getHost()+'/integral/shipping/query',function (res) {
            console.log(res);
            if(res.message == "Success"){
              console.log(res.value.metaVal);
              var metaVal = JSON.parse(res.value.metaVal);

              console.log(metaVal.length)
              _this.shipping = metaVal;
              if(metaVal.length == 1){
                var pppp = {};
                _this.shippingAll.splice(_this.shippingAll.indexOf(parseInt(metaVal[0].shipping)),1);
                pppp.shipping = _this.shippingAll[0];

                _this.nameAll.splice(_this.nameAll.indexOf(metaVal[0].name),1);
                pppp.name = _this.nameAll[0];

                pppp.checked = 0;

                _this.shipping.push(pppp);
                console.log(_this.shipping)
              }
              _this.metaId = res.value.metaId;
            }
          })
        },
        shippingSave:function(){
          var param = {};

          var style = [];

          if($("input[type='checkbox']:checked").length <= 0){
            alert("两种配送方式至少选择一种");
            return false;
          }
          console.log($("input[type='checkbox']:checked").length);
          $("input[type='checkbox']:checked").each(function (item) {
            var shipping = {};
            shipping.shipping = $(this).val();
            shipping.name = $(this).siblings("span").find('label').html();
            style.push(shipping);
          });
          if(this.metaId > 0){
            param.id = this.metaId;
          }
          param.metaVal = style;

          console.log(JSON.stringify(param));
          $.ajax({
            type:'post',
            contentType: "application/json; charset=utf-8",
            url:core.getHost()+'/integral/shipping/save',
            data:JSON.stringify(param),
            success:function (res) {
              console.log(res);
              if(res.message=="Success"){
                alert("设置成功");
              }else{
                alert("设置失败");
              }
            }
          });
        },
        paramSet:function (shipping,name,ele) {
          console.log(ele)
        }
      },
      mounted:function () {
        this.queryShipping();
      }
    });

  })
});
