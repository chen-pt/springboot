/**
 * Created by Administrator on 2018/1/10.
 */
$(function () {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      "core":'merchant/js/lib/core',
      'utils':'merchant/js/coupon/ll_utils',
      'vue-pagenation':'merchant/js/integral/VuePagenation'
    }
  });

  var activityIds;
  require(['vue','core','utils','vue-pagenation'],function (Vue,core,utils,VuePagenation) {
    var vm = new Vue({
      el:'#clerk',
      data: {
        page: 1,//当前页
        pageSize:15,
        pages: 50,
        total: 50,
        displayPage:6,//分页菜单显示
        customerInfoMap:{},
        dealAnalyzeMap:{},
        buyThisLogMap:{},
        activityIds:{},
        activityDetails:{},
        goodsList:{},
        rule:{},
        result:{}
      },
      watch:{
        page:'queryDetail',
        pageSize:'queryDetail'
      },

      components:{
        "vue-pagenation":VuePagenation
      },
      methods:{
        imgLink:imgLink,
        queryDetail:function () {
          var _this = this;
          var id=GetQueryString("id");
          var buyerId=GetQueryString("buyerId");
          var storeId=GetQueryString("storeId");
          var userId=GetQueryString("userId");
          var activityId=GetQueryString("activityIds");
          activityIds=activityId;
          _this.activityIds=activityId;
          var data={};
          data.id=id;
          data.buyerId=buyerId;
          data.storeId=storeId;
          data.userId=userId;
          data.page = _this.page;
          data.pageSize = _this.pageSize;
          var url = core.getHost()+'/merchant/clerkDetail';
          $.ajax({
            type:'post',
            data:data,
            url:url
          }).then( function (res) {
            console.log(res);
            if(res.message == "Success"){
              _this.result=res.value;
              _this.customerInfoMap = res.value.customerInfoMap;
              _this.dealAnalyzeMap = res.value.dealAnalyzeMap;
              _this.goodsInfoMap = res.value.goodsInfoMap.list;
              _this.pages = res.value.goodsInfoMap.pages;
              _this.total = res.value.goodsInfoMap.total;
              //活动合并
              $.each(_this.goodsInfoMap,function(i,goods){
                goods.easyToSees.proCouponList.promotionsActivities=Object.assign(goods.easyToSees.pricesActivity,goods.easyToSees.proCouponList.promotionsActivities);
              });
            }
          })
        },
        pageChange:function(page){
          this.page = page;
        },
        pageSizeChange:function(pageSize){
          this.pageSize = pageSize;
        },
        goodsNote:function (note,indications) {
          $("#myModal").removeClass('hide');
          $("#note").html(note);
          $("#indications").html(indications);
        },
        activityDetail:function (activity,title) {
          var _this = this;
          var activity=activity;
          activity.title=title;
          var rule=JSON.parse(activity.promotionsRule);
          if(rule.goodsIds == "all" || rule.goodsIdsType == 0){
            _this.goodsList="";
          }else{
              this.queryGoods(rule.goodsIds);
          }
          //var rule=this.validityDate(JSON.parse(activity.timeRule));
          activity.timeRule=JSON.parse(activity.timeRule);
          _this.activityDetails=activity;
        },
        queryGoods:function (goodsIds) {
          var _this = this;
          var url=core.getHost() + '/goods/getGoodsInfoByIds';
          $.post(url, 'goodsIds=' + goodsIds, function (goods) {
              if (goods.code == '000') {
                console.log(goods);
                _this.goodsList=goods.data;
              }

          })
        },
        orderList:function (list,type) {
          return list.filter(function(item){
            var dataStrArr=activityIds.split(",");
            var dataIntArr=[];
            dataIntArr=dataStrArr.map(function(data){
              return +data;
            });
            if(type == 0){
              return $.inArray(item.id, dataIntArr) > -1;
            }else{
              return $.inArray(item.id, dataIntArr) == -1;
            }

          })
        },
        goodsShow:function (goods) {
          var _this = this;
          _this.goodsList=goods;
        },
        validityDate:function (timeRule) {
          var time = ''
          if (timeRule.validity_type == 1) {
            //绝对时间
            time += '固定时间：'
            time += timeRule.startTime + '&nbsp;-&nbsp;' + timeRule.endTime
            time += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          } else if (timeRule.validity_type == 2) {
            //按每月
            time += '每月固定日期：'
            var days = ''
            var assgin = timeRule.assign_rule.split(',')
            var odd = 0
            var even = 0
            var flag = true
            //有可能点击的是单双月按钮
            if (assgin.length >= 15) {
              for (var i = 0; i < assgin.length; i++) {
                if (assgin[i]) {
                  assgin[i] % 2 == 0 ? even++ : odd++
                }
              }
              if (odd == assgin.length) {
                time += '单号日'
                flag = false
              } else if (even == assgin.length) {
                time += '双号日'
                flag = false
              }
            }
            if (flag) {
              for (var i = 0; i < assgin.length; i++) {
                days += assgin[i] + '日、'
              }
              days = days.substring(0, days.length - 1)
            }

            time += days
            if (timeRule.lastDayWork) {
              time += '<br/>当月没有29日、30日、31日时，允许系统自动按每月最后' + timeRule.lastDayWork + '天计算'
            }
          } else if (timeRule.validity_type == 3) {
            //按每周
            time += '指定星期：'
            var week = ''
            // if(timeRule.assign_rule)
            var weeks = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
            var workdays = '1,2,3,4,5'
            var restdays = '6,7'
            if (timeRule.assign_rule == workdays) {
              week += '工作日'
            } else if (timeRule.assign_rule == restdays) {
              week += '双休日'
            } else {
              var assgin = timeRule.assign_rule.split(',')
              for (var i = 0; i < assgin.length; i++) {
                if (assgin[i]) {
                  week += weeks[assgin[i]] + '、'
                }
              }
              week = week.substring(0, week.length - 1)
            }
            time += week
          }
          return time;
        }
      },
      filters:{
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        },
        finalDate:function (time) {
          var sysDate = new Date().Format("yyyy-MM-dd HH:mm:ss");
          var type="hour";
          var h=GetDateDiff(sysDate,time,type);
          if(h > 24){
            var day=h/24;
            var days=Math.ceil(day);
            return days+"天";
          }else{
            return h+"小时";
          }
        },
        validityFs:function (id) {
          var timeRule=this.activityDetails.timeRule;
          var time = ''
          if (timeRule.validity_type == 1) {
            //绝对时间
            time += '固定时间：'
            time += timeRule.startTime + '&nbsp;-&nbsp;' + timeRule.endTime
            time += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          } else if (timeRule.validity_type == 2) {
            //按每月
            time += '每月固定日期：'
            var days = ''
            var assgin = timeRule.assign_rule.split(',')
            var odd = 0
            var even = 0
            var flag = true
            //有可能点击的是单双月按钮
            if (assgin.length >= 15) {
              for (var i = 0; i < assgin.length; i++) {
                if (assgin[i]) {
                  assgin[i] % 2 == 0 ? even++ : odd++
                }
              }
              if (odd == assgin.length) {
                time += '单号日'
                flag = false
              } else if (even == assgin.length) {
                time += '双号日'
                flag = false
              }
            }
            if (flag) {
              for (var i = 0; i < assgin.length; i++) {
                days += assgin[i] + '日、'
              }
              days = days.substring(0, days.length - 1)
            }

            time += days
            if (timeRule.lastDayWork) {
              time += '<br/>当月没有29日、30日、31日时，允许系统自动按每月最后' + timeRule.lastDayWork + '天计算'
            }
          } else if (timeRule.validity_type == 3) {
            //按每周
            time += '指定星期：'
            var week = ''
            // if(timeRule.assign_rule)
            var weeks = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
            var workdays = '1,2,3,4,5'
            var restdays = '6,7'
            if (timeRule.assign_rule == workdays) {
              week += '工作日'
            } else if (timeRule.assign_rule == restdays) {
              week += '双休日'
            } else {
              var assgin = timeRule.assign_rule.split(',')
              for (var i = 0; i < assgin.length; i++) {
                if (assgin[i]) {
                  week += weeks[assgin[i]] + '、'
                }
              }
              week = week.substring(0, week.length - 1)
            }
            time += week
          }
          return time;
        },

  },
      mounted:function () {
        this.queryDetail();
      }
    });

  })

  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }


  function GetDateDiff(startTime, endTime, diffType) {
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime);
    var eTime =new Date(endTime);
    var timeType =1;
    switch (diffType) {
      case"second":
        timeType =1000;
        break;
      case"minute":
        timeType =1000*60;
        break;
      case"hour":
        timeType =1000*3600;
        break;
      case"day":
        timeType =1000*3600*24;
        break;
      default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
  }

  function GetQueryString(name)
  {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }
});

