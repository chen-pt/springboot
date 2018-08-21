/**
 * Created by Administrator on 2017/8/15.
 */
getTaskPlan(20);

// var vm;
// $(function () {
  var vm = new Vue({
    el: '#taskplan_list',
    data: {
      quotaList: []
    },
    created: function () {
      getQuotaList();
    },
  })
// })

function getQuotaList(){
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/quota";
  }else {
    return;
  }

  $.post(url,
    function(result){
      if(result.message == 'Success'){
        var list = result.value;
        vm.quotaList = list;
      }else {
        console.log("error ....");
      }
    },
    "json");
}

$('#jinxing').on('click',function () {
  getTaskPlan(20)
});

$('#start').on('click',function () {
  getTaskPlan(10)
});

$('#end').on('click',function () {
  getTaskPlan(30)

});

var  planstatus;

function getURLType() {

  var url = window.location.href;

  if(url.indexOf("merchant") > -1){
    return "merchant";
  }else if(url.indexOf("store") > -1){
    return "store";
  }else if(url.indexOf("jk51b") > -1){
    return "jk51b";
  }else {
    layer.msg("系统检测到异常");
    return null;
  }

}

function getTaskPlan(status){
  var data = {};
  if(status!=null){
    planstatus=status;
  }

  data.targetId = $("#quotaSource").val();

  data.pageNum=pagination_page_no,
  data.pageSize= pagination_pagesize,


  data.id=$('[name=task_id]').val();


  data.name=$.trim($('[name=task_name]').val());

  var url = window.location.href;

  if(url.indexOf("merchant") > -1){
    data.sourceType=10
  }else if(url.indexOf("store") > -1){
    data.sourceType=20
  }else {
    data.sourceType=30
  }


  data.startTime=$('[name=date_start]').val();


  data.endTime=$('[name=date_end]').val();


  // data.name=$('[name=task_name]').val;
  // data.starTime=$('[name=date_start]').val;
  // data.endTime=$('[name=date_end]').val;
  data.status=planstatus;
  // alert($('#jinxing').val())

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/getTaskPlan";
  }else {
    return;
  }

  $.ajax({
    type: 'post',
    url: url,
    data: data,
    dataType: 'json',
    success: function (data) {
      $("#task_list").empty();

      Date.prototype.format = function (fmt) {
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

      pagination_pages = data.value.pages;
      pagination_totals = data.value.total;


      if(data.value.list.length>0){
        for(var y=0;y<data.value.list.length;y++){

          data.value.list[y].namestr=""
          for(var x=0;x<(data.value.list[y]).nameList.length;x++){

            data.value.list[y].namestr+=(data.value.list[y]).nameList[x]+="<br>";
          }

        }
      }


      var tmpl = document.getElementById('templateDetail').innerHTML;
      var doTtmpl = doT.template(tmpl);
      // $("#task_list").append(doTtmpl(data));

      var tr= doTtmpl(data);
      if (status == 30){
        tr=tr+ "<tr>" +
          "<td  colspan='10'><div><span style='text-align:left'><input name='checkAll' type='checkbox' id='checkAll' onclick='checkboxOnclick(this)' />全选" +
          "&nbsp;&nbsp;&nbsp;&nbsp;<a class='sui-btn btn-large btn-info' onclick='deleteTaskPlan()' role='button' id='deleteTaskPlan'>删除</a>" +
          "&nbsp;&nbsp;&nbsp;&nbsp;<a class='sui-btn btn-large btn-info' href='#' role='button' id='taskPlanReport'>导出当期报表</a> </span>" +
          "<span  class='pageinfo' style='text-align:right'></span></div></td></tr>";
      }else{
      tr=tr+ "<tr>" +
          "<td  colspan='10'><div><span style='text-align:left'><input name='checkAll' type='checkbox' id='checkAll' onclick='checkboxOnclick(this)' />全选" +
        "&nbsp;&nbsp;&nbsp;&nbsp;<a class='sui-btn btn-large btn-info' onclick='deleteTaskPlan()' role='button' id='deleteTaskPlan'>删除</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;<a class='sui-btn btn-large btn-info' onclick='endTaskPlan()' role='button' id='endTaskPlan'>结束</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;<a class='sui-btn btn-large btn-info' href='#' role='button' onclick='exportNowReportBacth()'>导出当期报表</a></span>" +
        "<span  class='pageinfo' style='text-align:right'></span></div></td></tr>";
      }
      $("#task_list").append(tr);

      addpage(getTaskPlan);
    },
    error: function () {
      console.log("error ....");
    }
  });
}

function exportNowReport(id) {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/exportTaskReport";
  }else {
    return;
  }

  var form=$("<form>");//定义一个form表单
  form.attr("style","display:none");
  form.attr("target","");
  form.attr("method","get");
  form.append('<input type="hidden" name="planId" value="'+ id +'" >');
  form.append('<input type="hidden" name="adminType" value="'+ getURLTypeCode() +'" >');
  console.log(form.html());
  form.attr("action",url);
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交

}

function exportNowReportBacth() {
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/getTaskPlan";
  }else {
    return;
  }
  var planIds = [];
  $('input[name="taskPlanId"]:checked').each(function () {
    planIds.push($(this).val());
  })
  // planIds = JSON.stringify(planIds);

  if(planIds.length > 5){
    layer.msg("导出任务计划请勿超过5个");
    return;
  }

  if(planIds.length > 0){

    var form=$("<form>");//定义一个form表单
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","get");
    for(var i=0; i<planIds.length; i++){
      form.append('<input type="hidden" name="planId" value="'+ planIds[i] +'" >');
    }

    form.append('<input type="hidden" name="adminType" value="'+ getURLTypeCode() +'" >');

    console.log(form.html());
    form.attr("action","/"+urlType+"/taskPlan/exportTaskReportBatchZip");
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
    //
    // $.ajax({
    //   type: 'get',
    //   url: "/merchant/taskPlan/exportTaskReportBatchZip",
    //   data: {planIds:planIds},
    //   dataType: 'json',
    //   success: function (data) {
    //
    //   },
    //   error: function (e) {
    //     layer.msg(e);
    //     console.log(e);
    //   }})
  }
}


function deleteTaskPlan(){
  var tipHtml = '确定删除此任务吗?';
  var ids = "";
  var data = {};
  $(".choose-check").each(function(){
    if (this.checked == true){
      ids = ids + $(this).val() + ",";
    }
  });
  ids = ids.substring(0, ids.length-1)
  var count = ids.split(",").length;
  data.ids = ids;
  if (ids == ""){
    layer.msg('请选择计划');
  }else{
    layer.confirm(tipHtml, {title: ['提示']}, function (idx) {


    var url;
    var urlType = getURLType();
    if(urlType){
      url = "/"+ urlType +"/taskPlan/delete";
    }else {
      return;
    }
    $.ajax({
      type: 'post',
      url: url,
      data: data,
      dataType: 'json',
      success: function (data) {
        if (count != data.value.count){
          layer.msg(data.value.message);
        }else {
          layer.msg('删除成功');
        }
        setTimeout(function () {
          window.location.href="/"+urlType+"/taskPlan/list";
        },2000)
      },
      error: function () {
        console.log("error ....");
      }
    });
  });
  }

}

function endTaskPlan() {
  var ids = "";
  var data = {};
  $(".choose-check").each(function () {
    if (this.checked == true) {
      ids = ids + $(this).val() + ",";
    }
  });
  ids = ids.substring(0, ids.length - 1)
  data.ids = ids;
  var tipHtml = '确定结束此任务吗?';

  if (ids == ""){
    layer.msg('请选择计划');
  }else{
    layer.confirm(tipHtml, {title: ['提示']}, function (idx) {
    var url;
    var urlType = getURLType();
    if (urlType) {
      url = "/" + urlType + "/taskPlan/end";
    } else {
      return;
    }
    $.ajax({
      type: 'post',
      url: url,
      data: data,
      dataType: 'json',
      success: function (data) {
        layer.msg('结束成功');
        setTimeout(function () {
          window.location.href = "/" + urlType + "/taskPlan/list";
        }, 2000)
      },
      error: function () {
        console.log("error ....");
      }
    });
  });
  }
}

function deleteById(id) {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/delete";
  }else {
    return;
  }
  if(confirm("你确定删除此任务？")){
    $.post(url,
      {ids: id},
      function (result) {
        if (result.message == 'Success') {
          layer.msg('删除成功');
          setTimeout(function () {
            window.location.href="/"+urlType+"/taskPlan/list";
          },2000)
        }else {
          layer.msg('删除失败');
        }
      });
  }
}

function endById(id) {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/taskPlan/end";
  }else {
    return;
  }
  if(confirm("你确定结束此任务？")){
    $.post(url,
      {ids: id},
      function (result) {
        if (result.message == 'Success') {
          layer.msg('结束成功');
          setTimeout(function () {
            window.location.href="/"+ urlType +"/taskPlan/list";
          },2000)
        }else {
          layer.msg('结束失败');
        }
      });
  }
}

var getURLTypeCode = function () {

  if(getURLType() == "merchant"){
    return 10;
  }else if(getURLType() == "store"){
    return 20;
  }else if(getURLType() == "jk51b"){
    return 30;
  }else {
    layer.msg("系统检测到异常");
    return 0;
  }

}

