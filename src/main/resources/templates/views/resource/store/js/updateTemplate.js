/**
 * Created by admin on 2017/4/12.
 */
var day="";
function updateTemplate(templateNo,storeId) {
  var datas = {}
  datas.templateNo=templateNo;
  datas.storeId=storeId;

  $.ajax({
    type: 'post',
    url: '/management/queryTemplateNo',
    data: datas,
    dataType: 'json',
    success: function (data) {
      var obj = data.value.list;
      for(var i=0;i<obj.length;i++){
        obj[i].startTime = dataFormat(new Date(obj[i].startTime),"hh:mm");
        obj[i].endTime = dataFormat(new Date(obj[i].endTime),"hh:mm")
      }
      $("#edit_template").html('');
      var tmpl = document.getElementById('editTemplateList').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $("#edit_template").html(doTtmpl(data));
      $('input[name="time_end"]').timepicker();
      $('input[name="time_start"]').timepicker();
    }
  });
};
$.each($('#selectMonth').find('option'),function(){
  if(this.value == new Date().getMonth()+1){
    this.selected = true;
  }
});

function _updateTemlate() {
  var datas ={};
  var i = 0;
  $(".edit_template").find('tr').each(function(){
    var item = {};
    var current = dataFormat(new Date(),"yyyy-MM-dd") + " ";
    item.time_start =new Date(current + $(this).find("input[name=time_start]").val() + ":00").getTime();
    item.time_end = new Date(current + $(this).find("input[name=time_end]").val() + ":00").getTime();
    item.accountSource = $(this).find("input[name=accountSource]").val();
    item.templateId = $(this).find("input[name=accountSource]").attr("data-templateId");
    datas[i]=item;
    i++;
  });
  $.ajax({
    type:'post',
    url:'/management/updateTemplate',
    data:datas,
    dataType: 'json',
    success: function(data){
      console.log(data);
      if(data.message == "Success"){
        alert("更新成功~！");
        window.location.reload();
      }
    }

  });
}

function _updateTemlate() {
  var datas ={};
  var i = 0;
  var flag = true;
  //var sum =0;
  var paramArray= [];

  $(".edit_template").find('tr').each(function(){
    var item = {};
    var current = dataFormat(new Date(),"yyyy-MM-dd") + " ";
    item.time_start =new Date(current + $(this).find("input[name=time_start]").val() + ":00").getTime();
    item.time_end = new Date(current + $(this).find("input[name=time_end]").val() + ":00").getTime();
    if(item.time_start==item.time_end || item.time_start>item.time_end){
      flag=false;
    }
    paramArray.push(item.time_start);
    paramArray.push(item.time_end);


   /* if(sum==0){
      sum= item.time_start+item.time_end;
    }else{
      var timeSum = item.time_start+item.time_end;
      if(timeSum==sum){
        flag=false;
      }
    }*/
    item.accountSource = $(this).find("input[name=accountSource]").val();
    item.templateId = $(this).find("input[name=accountSource]").attr("data-templateId");
    datas[i]=item;
    i++;
  });
  var resault = compaireTime(paramArray);
  alert(resault);
  if(resault==false){
    flag=false;
  }
  alert(flag);
  if(flag==false){
    alert("请输入正确的时间");
    return ;
  }
  $.ajax({
    type:'post',
    url:'/management/updateTemplate',
    data:datas,
    dataType: 'json',
    success: function(data){
      console.log(data);
      if(data.message == "Success"){
        alert("更新成功~！");
        window.location.reload();
      }
    }

  });
}


function _updateUserTemlate() {
  var datas ={};
  var i = 0;
  $(".edit_template").find('tr').each(function(){
    var item = {};
    item.templateId =$(this).find("input[name=templateId]").val()
    item.accountSource = $(this).find("input[name=accountSource]").val();
    console.log(item.templateId);
    /*item.templateId = $(this).find("input[name=accountSource]").attr("data-templateId");*/
    datas[i]=item;
    i++;
  });
  var year =$("#selectYear option:selected").val();
  var month =$("#selectMonth option:selected").val();
  var url = location.search; //获取url中"?"符后的字串
  var arr2=url.split('?')[1].split('&');
  var num=arr2[0].split('=')[1];
  var ss=arr2[1].split('=')[1];
  var day = ss;
  alert(num);
  var date = year+"-"+month+"-"+day;
  var length =$(".edit_template").find("tr").length
  datas.date=date;
  datas.length=length;
  datas.templateNo=num;
  $.ajax({
    type:'post',
    url:'/management/createClass',
    data:datas,
    dataType: 'json',
    success: function(data){
      console.log(data);
      if(data.message == "Success"){
        alert("排班成功~！");
        window.location.href="/management/schedulingDetail";
      }else {
        alert("当前日期已排班！");
        window.location.href="/management/schedulingDetail";
      }
    }

  });
}

function  dataFormat (date, fmt){
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function getDay(a) {
  day=a;
  if(a!=null){
    window.location.href="/management/editScheduling?day="+a;
  }
}

function _cancelScheduling(servUserIds) {
 var ids=servUserIds.replace(/,/g,':');
  var msg = "您真的确定要取消本日排班吗？\n\n请确认！";
  var str=ids;
  var datas={};
  datas.servUserIds=str;
  if (confirm(msg)==true){
    $.ajax({
      type:'post',
      url:'/management/cancelScheduling',
      data:datas,
      dataType: 'json',
      success: function(data){
        console.log(data);
        if(data.message == "Success"){
          alert("取消成功~！");
          window.location.href="/management/schedulingDetail";
        }
      }
    });
  }else{
    return false;
  }
}

function compaireTime(paramArray) {
  var foo = true;
  alert(paramArray);
  $.ajax({
        type:'post',
        url:'/management/compaireTime',
        data:{paramArray:paramArray},
        async: false,
        dataType: 'json',
        success: function(data){
          console.log(data);
          if(data.msg=="ok"){
            alert(1);
            return true;
          }else{
            alert(2);
            foo = false;
            return false;
          }
    }


  });
  return foo;
}


