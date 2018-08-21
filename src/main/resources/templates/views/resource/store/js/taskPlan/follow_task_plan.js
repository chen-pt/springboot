/**
 * Created by Administrator on 2017/8/21.
 */
var vm;
var dayGroup = {};
var myDate;
var taskId = 0;
var  planId = 0;
var object = 0;
var titleList = [];
// var todayDay = '';
// var todayWeek = '';
// var todayMonth = '';

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
    vm = new Vue({
      el: '#follow_task_plan',
      data: {
        titleGroup : [],
        todayDate : {},
        titleIndex : 0,
        lableIndex : 0,
        timeIndex : 0,
        followList : [],
        first : 0,
        second : 0,
        third : 0,
        rewardAll : 0,
        joinPeople : 0,
        checked  : true,
        picked :'0_0',
        planTime : {},
        dayStr :'',
        rewardRule : [],
        page: 1,//当前页
        pageSize:15,
        pages: 50,
        total: 50,
        displayPage:6,//分页菜单显示
        result:[],
      },
      watch:{
        page:'getFollowRecord',
        pageSize:'getFollowRecord'
      },
      components:{
        "vue-pagenation":VuePagenation
      },

      methods: {
        created:function () {
          getTitle();
        },
        getFollowRecord:function(){
          getFollowRecord();
        },
        percent : function (a, b) {
          var count = a/b*10*10;
          count = count.toFixed(1);
          return count;
        },
        money : function (money) {
          money = money/100;
          money = money.toFixed(2);
          return money;
        },
        pageChange:function(page){
          this.page = page;
        },
        pageSizeChange:function(pageSize){
          this.pageSize = pageSize;
        }
      },
      mounted:function () {
        this.created();
      }
    })
  });



})

//选择栏
function selectedTitle(id) {
  //returnZero();
  console.log(id);
  vm.titleIndex = id.replace('selected','');
  console.log(vm.titleIndex);
  $('.selected').removeClass("selected");
  $("#" + id).addClass('selected');
  taskId = $("#" + id).val();
  object = titleList[vm.titleIndex].object;
  $("input[name='follow_task_time_type']").val('');
  vm.timeIndex=0;
  getDate()
  // getFollowRecord();
}

//任务日期
function getDate() {
  //今天日期
  myDate = new Date();
  var day = myDate.getDate();
  var month = myDate.getMonth() + 1;
  var year = myDate.getFullYear();
  var week = getWeekNumber(year, month, day);
  vm.todayDate.dayStr = myDate.Format("yyyy-MM-dd");
  vm.todayDate.monthStr = month;
  vm.todayDate.weekStr =week;
  vm.todayDate.yearStr = year;

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/executePlanTime";
  }else {
    return;
  }
    //计划时间
    $.post(
      url,
    {
      taskId: taskId,
      planId: planId
    },
    function (result) {
      if (result.message == 'Success') {
        list = result.value;
        vm.planTime = list;
        var flag = 0;
        for (var i=0; i<list.length; i++){
          if (myDate>=list[i].startDay && myDate <= list[i].endDay){
            flag = 1;
            vm.timeIndex = i;
            dayShow(list[i].startDay);
            break;
          }
        }
        if (flag == 0){
          dayShow(list[list.length-1].startDay)
        }
        getFollowRecord();
      }else {
        console.log(result.message);
        // layer.msg(result.message);
      }
    });
}

//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
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

function dayShow(day) {
  var planDate = new Date(day);
  var day = new Date(day).Format("yyyy-MM-dd")
  var date = planDate.getDate();
  var month = planDate.getMonth()+1;
  var year = planDate.getFullYear();
  if (vm.titleGroup[vm.titleIndex].timeType==10){
    vm.dayStr = day;
  }else if (vm.titleGroup[vm.titleIndex].timeType==20){
    var week = getWeekNumber(year, month, date);
    vm.dayStr = year + '年第' + week + '周';
  }else if (vm.titleGroup[vm.titleIndex].timeType==30){
    vm.dayStr = year + '年第' + month + '月';
  }
}

function getWeekNumber(y, m, d) {
       var now = new Date(y, m , d),
             year = now.getFullYear(),
             month = now.getMonth(),
             days = now.getDate();
       //那一天是那一年中的第多少天

  var date = new Date(year, parseInt(month) - 1, days),
      yearFirstDay = new Date(year, 0, 1),
      week = Math.round((date.valueOf() - yearFirstDay.valueOf()) / 86400000);
  return Math.ceil((week + ((yearFirstDay.getDay() + 1) - 1)) / 7);
      /* for (var i = 0; i < month; i++) {
             days += getMonthDays(year, i);
        }

       //那一年第一天是星期几
       var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

       var week = null;
       if (yearFirstDay == 1) {
             week = Math.ceil(days / yearFirstDay);
         } else {
             days -= (7 - yearFirstDay + 1);
             week = Math.ceil(days / 7) + 1;
         }*/

       //return week;
  }

function isLeapYear(year) {
      return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

//获取id
function getUrlId() {
  var url = window.location.href;
  var strs = url.split("/");
  return strs[strs.length-1];
}


//标头
function getTitle() {
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/queryIds";
  }else {
    return;
  }
  var id = getUrlId();
  planId = id;
  $.post(url,
      {id: id},
      function (result) {
        if (result.message == 'Success') {
          var list = result.value;
          vm.titleGroup = list;
          taskId = list[0].id;
          //vm.task = list[0].id;
          object = list[0].object;
          titleList = list
          vm.picked = taskId + "_0";
          getDate();
        }else {
          layer.msg(result.message);
        }
      });
}

function getURLType() {

  var url = window.location.href;

  if(url.indexOf("merchant") > 0){
    return "merchant";
  }else if(url.indexOf("store") > 0){
    return "store";
  }else if(url.indexOf("jk51b") > -1){
    return "jk51b";
  }else {
    layer.msg("系统检测到异常");
    return null;
  }

}


//跟踪记录
function getFollowRecord(){
  var _this=this;
  returnZero();
  var timeType = vm.dayStr;
  var objectName = $("input[name='object_name']").val();

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/followTaskPlan";
  }else {
    return;
  }

  $.post(
    url,
    {
      taskId:taskId,
      planId:planId,
      object:object,
      timeType:timeType,
      objectName:objectName,
      page:vm.page,
      pageSize:vm.pageSize,
    },
    function (result) {
      if (result.message == 'Success' && result.value.page.list.length >0) {
        vm.pages = result.value.page.pages;
        vm.total = result.value.page.total;
        var list = result.value.page.list;
        vm.result=result.value.page;
        vm.followList = list;
        vm.rewardAll=result.value.taskCount.rewardAll;
        vm.first=result.value.taskCount.first;
        vm.second=result.value.taskCount.second;
        vm.third=result.value.taskCount.third;
        vm.joinPeople=result.value.taskCount.total;
        vm.startDay = new Date(list[0].startDay);
        vm.endDay = new Date(list[0].endDay);
      }else {
        vm.followList=[];
      }
    });
}

//处理日期翻页
function chagePageLast() {
  //returnZero();
  vm.timeIndex = vm.timeIndex -1 + 2;
  var day = vm.planTime[vm.timeIndex].startDay;
  dayShow(day);
  getFollowRecord();
}

  function chagePageBefore() {
    //returnZero();
    vm.timeIndex = vm.timeIndex - 1;
    var day = vm.planTime[vm.timeIndex].startDay;
    dayShow(day);
    getFollowRecord();
}

function returnZero() {
  vm.first = 0;
  vm.second = 0;
  vm.third = 0;
  vm.rewardAll = 0;
}

function getReport() {

  var planName = vm.planTime.name;
  var taskName = vm.titleGroup[vm.picked.split("_")[1]].name;
  var obj = vm.titleGroup[vm.picked.split("_")[1]].object;
  var taskId = vm.titleGroup[vm.picked.split("_")[1]].id;
  var plan= planId;
  var timeType = '';

  if (vm.titleGroup[vm.picked.split("_")[1]].timeType==10){
     timeType = $("input[name='reportDate']").val();
  }else if (vm.titleGroup[vm.picked.split("_")[1]].timeType==20){
    timeType = $("input[name='reportYear']").val() + "年第" + $("input[name='reportWeek']").val() + "周";
  }else {
    timeType = $("input[name='reportYear']").val() + "年第" + $("input[name='reportMonth']").val() + "月";
  }

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/taskReport";
  }else {
    return;
  }

  $.post(
    url,
    {
      taskId:taskId,
      planId:plan,
      object:obj,
      timeType:timeType,
      planName:planName,
      taskName:taskName
    },
    function (result) {
      if (result.code == 101) {
        layer.msg(result.message);
      }else{
        var params = {};
        if(planName)params.planName=planName;
        if(taskName)params.taskName = taskName;
        if(obj)params.object = obj;
        if(taskId)params.taskId = taskId;
        if(plan)params.planId = plan;
        if(timeType)params.timeType = timeType;

        var form=$("<form>");//定义一个form表单
        form.attr("style","display:none");
        form.attr("target","");
        form.attr("method","post");
        for(var i in params){
          form.append('<input type="hidden" name="'+i+'" value="'+params[i]+'" >');
        }
        console.log(form.html());
        form.attr("action",url);
        $("body").append(form);//将表单放置在web中
        form.submit();//表单提交
      }
    });

}

