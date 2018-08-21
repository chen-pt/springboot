/**
 * Created by Administrator on 2017/8/16.
 */
var vm;

$(function () {

  vm = new Vue({
    el: '#task_list',
    data: {
      taskGroups:[],
      quotaList:[]
    },
    created:function () {
      getTaskGroup();
      getQuotaList();
    },
    methods: {
      deleteById: deleteById,
      detailById: detailById,
      taskCreate: taskCreate,
      taskDetail: taskDetail,
      money : function (a,b) {
        var money = a/b;
        money = money.toFixed(2);
        return money;
      },
      intervalShow: intervalShow,
      conditionShow: conditionShow,
      rewardShow: rewardShow

    }
  })

  $('.page_size_select').change(function () {

    pageSize = this.val();

    getTaskGroup();

  })

})

var intervalShow = function (intervalValue,targetId) {

  if(!intervalValue){
    intervalValue = 0;
  }

  if(parseInt(intervalValue) == -1){
    return '无穷大';
  }

  if(targetId == 3 || targetId == 4 || targetId == 5 || targetId == 6){
    intervalValue = vm.money(intervalValue,100);
  }

  return intervalValue;
}

var conditionShow = function (targetId,conditionValue,rewardType,questType) {
  var conditionExpression = '';

  var rewardTypeExpression = questType == 1 ? (rewardType == 30 ? '每满' : '满') : "不满";
  var questTypeExpression = questType == 1 ? (rewardType == 30 ? '每答对' : '答对') : '正确答题数不满';

  if(targetId ==1){
    conditionExpression = rewardTypeExpression + conditionValue + '单';
  }else if(targetId == 2){
    conditionExpression = rewardTypeExpression + conditionValue + '个';
  }else if(targetId == 3){
    conditionExpression = rewardTypeExpression + vm.money(conditionValue,100) + '元';
  }else if(targetId == 4){
    conditionExpression = rewardTypeExpression + vm.money(conditionValue,100) + '元';
  }else if(targetId == 5){
    conditionExpression = rewardTypeExpression + vm.money(conditionValue,100) + '元';
  }else if(targetId == 6){
    conditionExpression = rewardTypeExpression + vm.money(conditionValue,100) + '元';
  }else if(targetId == 7){
    conditionExpression = rewardTypeExpression + conditionValue + '个';
  }else if(targetId == 8){
    conditionExpression = questTypeExpression + conditionValue + '题';
  }
  return conditionExpression;
}

var rewardShow = function (rewardType,rewardValue,type) {
  var rewardExpression = '';

  if(rewardType == '人民币'){
    rewardExpression = (type == 1 ? '奖励' : '罚') + vm.money(rewardValue,100) + '元';
  }else if(rewardType == '绩效'){
    rewardExpression = (type == 1 ? '奖励' : '罚') + rewardValue + '绩效';
  }else if(rewardType == '健康豆'){
    rewardExpression = (type == 1 ? '奖励' : '罚') + rewardValue + '健康豆';
  }

  return rewardExpression;
}



var getURLType = function () {

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

var taskDetail = function (id) {

  var urlType = getURLType();
  if(urlType){
    window.location.href="/"+ urlType +"/task/task_detail/" + id;
  }

}

var taskCreate = function () {
  var urlType = getURLType();
  if(urlType){
    window.location.href="/"+ urlType +"/task/task_create";
  }
}

//更新
function detailById(id) {
  var urlType = getURLType();
  if(urlType){
    window.location.href="/"+ urlType +"/task/task_detail/" + id;
  }
}

//删除
function deleteById(id) {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/task_delete";
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
            window.location.href="/"+urlType+"/task/task_list";
          },2000)
        }else if (result.code == 101)  {
          layer.msg(result.message);
        }
      });
  }


}

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

//<----------------------------------------列表start---------------------------------------->
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

//获取搜索条件
function getParams() {

  var params={};

  var id = $("#id").val();
  var name = $("#name").val();
  var targetId = $("#quotaSource").val();
  var startTime = $("#start_time").val();
  var endTime = $("#end_time").val();

  if(id)params.id=id;
  if(name)params.name=name;
  if(targetId)params.targetId=targetId;
  if(startTime)params.startTime=startTime;
  if(endTime)params.endTime=endTime;

  params.pageSize = pageSize;
  params.pageNum = curPage;
  params.is_del = 0;

  return params;

}
//获取任务数据
function getTaskGroup() {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/tasks";
  }else {
    return;
  }

  var params = getParams();
  params.adminType = getURLTypeCode();

  $.post(url,
    params,
    function(result){
      if(result.message == 'Success'){
        var list = result.value.list;

        for (var i=0; i< list.length; i++){
          list[i].typeNames = list[i].typeNames.split(",");
          list[i].rewardRule = list[i].rewardRule || {};
          list[i].rewardRule.detail = list[i].rewardRule.detail || {};
          list[i].rewardRule.ladders = list[i].rewardRule.ladders || [];
        }
        vm.taskGroups = list;

        var num = result.value.total
        totalNum = num;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        if($('.pageinfo')){
          $('.pageinfo').remove();
        }

        $(".task-list").append("<span class='pageinfo' style='text-align:right'></span>")

        $('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getTaskGroup();
          }
        });
        getNum();
      }else {
        console.log("error ....");
      }
    },
    "json");
}

function getNum(){
  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select" style="width: 50px;">';

  $.each(pagearr, function(){

    if(this==pageSize)
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });

  pageselect = pageselect+'</select>&nbsp;';

  $('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('.page_size_select').change(function () {
    pageSize = $('.page_size_select').val();
    getTaskGroup();
  })

}

//<-------------------------------------***列表end***---------------------------------------->

//删除任务
function deleteTask(){

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/task_delete";
  }else {
    return;
  }

  var ids = "";
  var data = {};
  $(".choose-check").each(function(){
    if (this.checked == true){
      ids = ids + $(this).val() + ",";
    }
  });
  ids = ids.substring(0, ids.length-1)
  data.ids = ids;
  if (ids == ""){
    layer.msg("请选择任务");
  }else{

    if(confirm("你确定删除此任务？")){
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json',
        success: function (data) {
          if (data.message == 'Success'){
            layer.msg('删除成功');
            setTimeout(function () {
              window.location.href="/"+urlType+"/task/task_list";
            },2000)
          }else if (data.code == 101){
            layer.msg(data.message);
            setTimeout(function () {
              window.location.href="/"+urlType+"/task/task_list";
            },2000)
          }
        },
        error: function () {
          console.log("error ....");
        }
      });
    }
  }


}
