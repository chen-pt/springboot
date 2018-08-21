/**
 * Created by bigFeng on 2017/4/12.
 */
/*$(".btn-lg").click(function (){
  $("#edit_template").find('input').each(function(j,item){
    alert();
    item.value = '';
  });
});*/

$(function () {
  addTemplate();
});

function addTemplate(){
  $('input[name="time_end"]').timepicker();
  $('input[name="time_start"]').timepicker();
}

function insertTemplate() {
var datas ={};
var i = 0;
  var flag = true;
  //var sum =0;
  var paramArray= [];
  $(".add_template").find('tr').each(function(){
    var item = {};
    var current = dataFormat(new Date(),"yyyy-MM-dd") + " ";
      item.time_start =new Date(current + $(this).find("input[name=time_start]").val() + ":00").getTime();
      item.time_end = new Date(current + $(this).find("input[name=time_end]").val() + ":00").getTime();
     if(item.time_start==item.time_end || item.time_start>item.time_end){
      flag=false;
     }
     paramArray.push(item.time_start);
     paramArray.push(item.time_end);
      item.accountSource = $(this).find("input[name=accountSource]").val();
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
  console.log(datas);
  $.ajax({
    type:'post',
    url:'/management/addTemplate',
    data:datas,
    dataType: 'json',
    success: function(data){
      console.log(data);
      if(data.message == "Success"){
        alert("添加成功");
        window.location.reload();
      }
    }

  });

  /*
  $(".table-nobordered").each(function () {
    alert($(this).length  );
    var datas ={};
    datas.storeId =$("#storeId").html()
    datas.startTime =$(".time_start").val();
    datas.endTime =$(".time_end").val();
    datas.accountSource = $(".accountSource").val();
    datas.templateNo = $(".title").html();
    console.log(datas);


})*/
}


function transform(obj){
  var arr = [];
  for(var item in obj){
    arr.push(obj[item]);
  }
  return arr;
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
