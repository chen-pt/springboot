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
      el:'#ruleSetting',
      data:function () {
        var data = {result:{},rule:{},shopping:{},shoppingRule:{},register:{},registerRule:{},consult:{},consultRule:{},order:{},orderRule:{},msg:''};
        data.shoppingRule.type = 2;
        data.consult.status = 0;
        data.order.status = 0;
        data.shoppingRule.payLevel = [{},{},{},{}]; //type==1
        data.shoppingRule.meetLevel = {}; //type==2
        data.shoppingRule.equalAmount = {}; //type == 3
        return data;
      },
      methods:{
        getRuleDataByType:function (type) {
          var url = "/integral/queryIntegral";
          var datas={};
          datas.site_id=$("#siteId").val();
          datas.type=type;
          var _this = this;
          $.ajax({
            url: url,
            data: datas,
            async: false,
            type: 'post',
            success: function (data) {
              console.log(data);
              if(data.msg == "success"){
                if(type == 10) {
                  _this.register = data.result;
                  _this.registerRule = JSON.parse(data.result.rule);
                }
                if(type == 20){
                    _this.result = data.result;
                  _this.rule = JSON.parse(data.result.rule);
                }
                if(type == 40){
                  console.log(data);
                  _this.shopping =  data.result;
                  var rule = JSON.parse(data.result.rule);
                  _this.shoppingRule.type=rule.type;
                  // Array.apply(null, Array(4)).map(() => 4)
                  if(rule.type == 1){
                    rule.payLevel.map((item,index)=>{return _this.shoppingRule.payLevel[index] = item;});
                  }else if(rule.type == 2){
                    _this.shoppingRule.meetLevel = rule.meetLevel;
                  }else {
                    _this.shoppingRule.equalAmount = rule.equalAmount;
                  }
                }
                if(type == 50) {
                  _this.consult = data.result;
                  _this.consultRule = JSON.parse(data.result.rule);
                }
                if(type == 60) {
                  _this.order = data.result;
                  _this.orderRule = JSON.parse(data.result.rule);
                }

              }
            }
          });
        },
        ruleAdd:function (type) {
          var re = /^[1-9]{1}[0-9]{0,6}$/;
          console.log(this.rule.max_num)
          if(type == 20){
            if(!re.test(this.rule.value)){
              alert('请输入1-99999之间的正整数');
              return false;
            }if(this.rule.max_num != '' && !re.test(this.rule.max_num)){
              alert('请输入1-99999之间的正整数');
              return false;
            }if(this.rule.add_value != '' && !re.test(this.rule.add_value)){
              alert('请输入1-99999之间的正整数');
              return false;
            }

            this.result.siteId=$("#siteId").val();
            this.result.type=type;
            var data = JSON.stringify(this.result);
            var rule =JSON.stringify(this.rule);
          }else if(type == 10) {

            if(!re.test( this.registerRule.firstRegister)) {
              alert('请输入1-99999之间的正整数');
              return false;
            }
            this.register.siteId=$("#siteId").val();
            this.register.type=type;
            var data = JSON.stringify(this.register);
            var rule =JSON.stringify(this.registerRule);

          } else if(type == 40){
            if(!this.shopping.hasOwnProperty("name")){
              this.shopping.name="购物送积分";
            }
            this.shopping.limit = !this.shopping.hasOwnProperty("limit")?0:this.shopping.limit;
            if(!this.hasOwnProperty("siteId")){
              this.shopping.siteId=$("#siteId").val()
            }

            if(!this.hasOwnProperty("type")){
              this.shopping.type=40;
            }

            if(!this.shoppingRule.hasOwnProperty('type')){
              alert("选择积分设置类型");
              return false;
            }

           if(this.shoppingRule.type == 1){
             var ruleArray = [];

             for (var current in this.shoppingRule.payLevel){
               if(this.shoppingRule.payLevel[current].integral != '' && this.shoppingRule.payLevel[current].integral != undefined && !re.test(this.shoppingRule.payLevel[current].integral) ){
                 alert('请输入1-99999之间的正整数');
                 return false;
               }

               if(this.shoppingRule.payLevel[current].payMoney != '' && this.shoppingRule.payLevel[current].payMoney != undefined && !re.test(this.shoppingRule.payLevel[current].payMoney) ){
                 alert('请输入1-99999之间的正整数');
                 return false;
               }

               if(current > 0){
                 if((this.shoppingRule.payLevel[current].payMoney != '' && this.shoppingRule.payLevel[current].payMoney <= this.shoppingRule.payLevel[current-1].payMoney) || (this.shoppingRule.payLevel[current].integral!= ''&& parseInt(this.shoppingRule.payLevel[current].integral) <= parseInt(this.shoppingRule.payLevel[current-1].integral))){
                   alert("下一级的支付金额或赠送积分条件需大于上一级");
                   return false;
                 }
               }
               if(this.shoppingRule.payLevel[current].integral != '' && this.shoppingRule.payLevel[current].hasOwnProperty("integral") && this.shoppingRule.payLevel[current].hasOwnProperty("payMoney") && this.shoppingRule.payLevel[current].payMoney != ''){
                 ruleArray.push(this.shoppingRule.payLevel[current]);
               }
             }
             if(ruleArray.length <= 0){
               alert('至少添加一级');
               return false;
             }
             var rule =JSON.stringify({"type":this.shoppingRule.type,"payLevel":ruleArray});
             var maxLevel = ruleArray.length-1;
             console.log(this.shopping.limit)
             if(parseInt(this.shopping.limit) != 0 && parseInt(ruleArray[maxLevel].integral) > parseInt(this.shopping.limit)){
               alert('每日上限需大于单次购物赠送积分的最大额度'+this.shoppingRule.payLevel[maxLevel].integral+'积分');
               return;
             }

           }else if(this.shoppingRule.type == 2){
             if(!re.test(this.shoppingRule.meetLevel.eachIntegral) || !re.test(this.shoppingRule.meetLevel.eachMoney)){
               alert('请输入1-99999之间的正整数');
               return false;
             }
             if(!re.test(this.shoppingRule.meetLevel.eachMoney)){
               alert('请输入1-99999之间的正整数');
               return false;
             }

             if(parseInt(this.shopping.limit) != 0 && parseInt(this.shoppingRule.meetLevel.eachIntegral) > parseInt(this.shopping.limit)){
               alert('每日上限需大于单次购物赠送积分的最大额度'+this.shoppingRule.meetLevel.eachIntegral+'积分');
               return;
             }
             var ruleArray = {};
             if(this.shoppingRule.meetLevel.hasOwnProperty("eachMoney") && this.shoppingRule.meetLevel.hasOwnProperty("eachIntegral")){
               ruleArray.eachIntegral = this.shoppingRule.meetLevel.eachIntegral;
               ruleArray.eachMoney = this.shoppingRule.meetLevel.eachMoney;
             }
             var rule =JSON.stringify({"type":this.shoppingRule.type,"meetLevel":ruleArray});
           }else if(this.shoppingRule.type == 3) {  //等额
             // alert(this.shoppingRule.equalAmount.consumeMoney)
             // alert($("input[name='consumeMoney']").val())
             if(!re.test(this.shoppingRule.equalAmount.consumeMoney)){
               alert('请输入1-99999之间的正整数');
               return false;
             }
             /*if(parseInt(this.shopping.limit) != 0 && parseInt(this.shoppingRule.equalAmount.consumeIntegral) > parseInt(this.shopping.limit)){
               alert('每日上限需大于等额赠送积分的最大额度'+this.shoppingRule.equalAmount.consumeIntegral+'积分');
               return;
             }*/
             var ruleArray = {};
             // if(this.shoppingRule.equalAmount.hasOwnProperty("consumeMoney") && this.shoppingRule.equalAmount.hasOwnProperty("consumeIntegral")){
             if(this.shoppingRule.equalAmount.hasOwnProperty("consumeMoney")){
               // ruleArray.consumeIntegral = this.shoppingRule.equalAmount.consumeIntegral;
               ruleArray.consumeMoney = this.shoppingRule.equalAmount.consumeMoney;
             }
             var rule =JSON.stringify({"type":this.shoppingRule.type,"equalAmount":ruleArray});

           }
            this.shopping.limit = this.shopping.limit == ""?null:this.shopping.limit;
            var data =JSON.stringify(this.shopping);

          }else if(type == 50) {
            if(!re.test( this.consultRule.evaluate)) {
              alert('请输入1-99999之间的正整数');
              return false;
            }
            if(this.consult.limit != "") {
              if(!re.test( this.consultRule.evaluate)) {
                alert('请输入1-99999之间的正整数');
                return false;
              }
            }
            if(parseInt(this.consult.limit) != 0 && parseInt(this.consultRule.evaluate) > parseInt(this.consult.limit)){
              alert('每日限额需大于单次咨询评价赠送积分的最大额度'+this.consultRule.evaluate+'积分');
              return;
            }
            this.consult.limit = this.consult.limit == ""?null:this.consult.limit;
            this.consult.siteId=$("#siteId").val();
            this.consult.type=type;
            var data = JSON.stringify(this.consult);
            var rule =JSON.stringify(this.consultRule);
          }else if(type == 60) {
            if(!re.test( this.orderRule.orderEvaluate)) {
              alert('请输入1-99999之间的正整数');
              return false;
            }
            if(this.order.limit != "") {
              if(!re.test( this.orderRule.orderEvaluate)) {
                alert('请输入1-99999之间的正整数');
                return false;
              }
            }
            if(parseInt(this.order.limit) != 0 && parseInt(this.orderRule.orderEvaluate) > parseInt(this.order.limit)){
              alert('每日限额需大于订单评价赠送积分的最大额度'+this.orderRule.orderEvaluate+'积分');
              return;
            }
            this.order.limit = this.order.limit == ""?null:this.order.limit;
            this.order.siteId=$("#siteId").val();
            this.order.type=type;
            var data = JSON.stringify(this.order);
            var rule =JSON.stringify(this.orderRule);
          }
          $.ajax({
            url: '/integral/insert',
            data: {
              data:data,
              rule:rule,
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
              console.log(data);
              if(data.msg=="success"){
                location.href=core.getHost()+"/merchant/integral/management/rule";
              }else{
                alert("操作失败");
              }
            },
            error: function (data) {
              vue.show = true;
              vue.content = '系统内部错误';
            }
          })
        },
        settingTypeCahnge:function (type) {
          this.shoppingRule.type=type;
          if(type == 1){
            /*if(this.shoppingRule.type == 2){
              this.shoppingRule.payLevel
            }*/
            $('#fixedTotal').show();
            $('#grandTotal').hide();
            // $('#equalTotal').hide();
          // }else if(type == 3) {
          //   $('#fixedTotal').hide();
          //   $('#grandTotal').hide();
            // $('#equalTotal').show();
          } else {
            $('#fixedTotal').hide();
            $('#grandTotal').show();
            // $('#equalTotal').hide();
          }

        },
        settingStatusCahnge:function (status) {
          this.consult.status = status;
        },
        settingOrderStatusCahnge:function (status) {
          this.order.status = status;
        }
      },
      filters: {
        currencyFormat: function (value) {
          return value?(parseFloat(value) / 100).toFixed(2):"";
        },
      },
      mounted:function () {
        this.getRuleDataByType(10);
        this.getRuleDataByType(20);
        this.getRuleDataByType(40);
        this.getRuleDataByType(50);
        this.getRuleDataByType(60);
      }
    });

  })
});
