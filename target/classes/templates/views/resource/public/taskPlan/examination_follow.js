var vm;

$(function () {
  vm = new Vue({
    el: '#examination_follow',
    data: {
      followList : [],
      dateIndex : 'day'
    },
    created:function () {
      getFollow();
    },
    methods: {
      invitedCode: function (code) {
        var arr = [];
        arr = code.split('_');
        return arr[arr.length-1];
      },
      selectedTitle : function(a) {
        $('.bottom-choose').addClass('bottom');
        $('.bottom-choose').removeClass("bottom-choose");
        $('#'+a).removeClass('bottom');
        $('#'+a).addClass('bottom-choose');
        vm.dateIndex = a;
      },
      dateHandle : function (dateType, date) {
        var a = new Date(date);
        var date = a.getDate();
        var month = a.getMonth()+1;
        var year = a.getFullYear();
        if (dateType == 'day'){
          return a.Format("yyyy-MM-dd");
        }else if (dateType == 'week'){
          var week = getWeekNumber(year, month, date);
          return '第' + week + '周'
        }else if (dateType == 'month'){
          return '第' + month + '月';
        }
      }

    }
  })


})

function getFollow() {
  var urlType = getURLType();
  var url = '';
  if(urlType){
    url = "/"+ urlType +"/examination/follow";
  }else {
    return;
  }

  var examId = getUrlId();
  var startTime = $('#start_time').val();
  var endTime = $('#end_time').val();
  var param = {};
  param.examId = examId;
  if (startTime) param.startTime = startTime;
  if (endTime) param.endTime = endTime;

  $.post(url,
    param,
    function(result){
      if(result.message == 'Success'){
        var list = result.value;
        vm.followList = list;
      }else {
        console.log("error ....");
      }
    },
    "json");
}

function getURLType() {
  var url = window.location.href;

  if(url.indexOf("merchant") > 0){
    return "merchant";
  }else if(url.indexOf("store") > 0){
    return "store";
  }else if(url.indexOf("jk51b") > 0){
    return "jk51b";
  }else {
    layer.msg("系统检测到异常");
    return null;
  }
}

function getUrlId() {
  var url = window.location.href;
  var strs = url.split("/");
  return strs[strs.length-1];
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

//计算周
function getWeekNumber(y, m, d) {
  var now = new Date(y, m - 1, d),
    year = now.getFullYear(),
    month = now.getMonth(),
    days = now.getDate();
  //那一天是那一年中的第多少天
  for (var i = 0; i < month; i++) {
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
  }

  return week;
}

function isLeapYear(year) {
  return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}




