//页面加载完成执行函数
$(function () {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      'core': 'merchant/js/lib/core'
    }
  });
  integralRuleList();
});


//积分规则列表
function integralRuleList() {
  //加载vue模块
  require(['vue', 'core'], function (vue, core) {
    //列表请求路径
    var url = '/integral/queryIntegralRuleList';
    var siteId = $('#siteId').val();
    //发送ajax
    $.ajax({
      url: url,
      data: siteId,
      type: 'POST',
      success: function (data) {
        console.log(data);
        new vue({
          el: '#integralRule',
          data: {
            items: data
          }
        });
        //判断该商户下有没有设置积分规则
        /*if (data == null || data == '' || data == '404') {
          //说明该商户没有设置规则信息
          new vue({
            el: '#integralRule',
            data: {
              items: [
                {
                  "name": '注册送积分',
                  "desc": "完成注册任务获得积分",
                  integral: "10",
                  limit: "/",
                  status: "开启",
                  updateTime: new Date().format("yyyy-MM-dd hh:mm:ss")
                },
                {
                  "name": '签到送积分',
                  "desc": "完成每日签到和连续签到任务获得积分",
                  integral: "按规则赠送",
                  limit: "200",
                  status: "开启",
                  updateTime: new Date().format("yyyy-MM-dd hh:mm:ss")
                },
                {
                  "name": '购物送积分',
                  "desc": "订单金额满足条件交易成功后赠送积分",
                  integral: "按规则赠送",
                  limit: "200",
                  status: "开启",
                  updateTime: new Date().format("yyyy-MM-dd hh:mm:ss")
                }
              ]
            },
            filters: {
              dateFormat: function (time) {
                core.formatDate()
                return new Date(time).format();
              }
            }
          });
        } else {
          //将json串解析成对象
          // var ruleList = JSON.parse(data);
          // var ruleList = eval('(' + data + ')');
          // console.log(ruleList);
          new vue({
            el: '#integralRule',
            data: {
              items: data
            }
          });
        }*/


      }
    });
  });

  Date.prototype.format = function(fmt)
  {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  }
}

