/**
 * Created by Administrator on 2017/8/16.
 */
var vm;

$(function () {

  vm = new Vue({
    el: '.order-detail-div',
    data: {
      task: {
        name: '',
        quotaName: '',
        goodsNum: 0,
        isAll: -1,
        rewardType: '',
        rewardLimit: 0,
        timeType: '',
        object: '',
        explain: '',
        rewardRule: {
          type: 0,
          detail:{
            condition: 0,
            reward: 0,
            topLimit: 0,
          },
          ladders: [{
            condition: 0,
            reward: 0,
            topLimit: 0,
          }]
        },
        examinationId: '',
        examinationDetail: {
          id: '',
          title: '',
          secondTotal: '',
          minuteTotal: '',
          questNum: '',
        }
      },
      typeNames: [],
      goodsList: [],
      goodTotalNum: 0,
    },
    created:function () {
      getTask();
      getGoodsDetail();
    },
    methods: {
      getTask: getTask,
      getUrlId: getUrlId,
      getURLType: getURLType,
      money : function (a,b) {
        var money = a/b;
        money = money.toFixed(2);
        return money;
      },
      getGoodsDetail:getGoodsDetail,
      imgLink: imgLink(),
      getImgUrl: function (imageId) {
        console.log(imageId ? imgLink(imageId,100,100,'.jpg') : '/templates/views/resource/merchant/img/empty.jpg','imageIdurl');
        return (imageId ? imgLink(imageId,100,100,'.jpg') : '/templates/views/resource/merchant/img/empty.jpg');
      },
      timeFormat: timeFormat,
      showGoodDetail: showGoodDetail,
      intervalShow: intervalShow,
      conditionShow: conditionShow,
      rewardShow: rewardShow,
      examDetailUrl: function (id) {
        window.open('/'+ getURLType() +'/examination/detail/' + id);
      },
      getURLTypeCode:getURLTypeCode,
    }
  })

  $('#goodsDetail').on('okHide', function(e){console.log('okHide')})
  $('#goodsDetail').on('okHidden', function(e){console.log('okHidden')})
  $('#goodsDetail').on('cancelHide', function(e){console.log('cancelHide')})
  $('#goodsDetail').on('cancelHidden', function(e){console.log('cancelHidden')})

})

var intervalShow = function (intervalValue,targetId) {

  if(!intervalValue){
    intervalValue = 0;
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

var showGoodDetail = function (goodsId) {
  //用于判断是什么后台
  var url;
  var urlType = getURLType();
  if(urlType){
    window.open("/"+ urlType +"/task/specify_good/"+goodsId);
  }else {
    return;
  }
}

var timeFormat = function(time,format){
  /*
   * eg:format="yyyy-MM-dd hh:mm:ss";
   */
  time = new Date(time);
  if(!format){
    format = "yyyy-MM-dd hh:mm:ss";
  }
  var o = {
    "M+": time.getMonth() + 1, /* month*/
    "d+": time.getDate(), /* day*/
    "h+": time.getHours(), /* hour*/
    "m+": time.getMinutes(), /* minute*/
    "s+": time.getSeconds(), /* second*/
    "q+": Math.floor((time.getMonth() + 3) / 3), /* quarter*/
    "S": time.getMilliseconds()

  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" +o[k]).length));
    }
  }
  return format;
};

var pageSize = 15;
var pageNum = 1;
var goodTotalNum = 0;

var getGoodsDetail = function () {

  var urlCode = getURLTypeCode();

  if(urlCode != 30){
    //用于判断是什么后台
    var url;
    var urlType = getURLType();
    if(urlType){
      url = "/"+ urlType +"/task/task_specify_good";
    }else {
      return;
    }

    var param = {};

    param.pageSize = pageSize;
    param.pageNum = pageNum;
    param.taskId = getUrlId();
    param.adminType = urlCode;

    $.post(url, param, function (result) {
      if(result.value && result.value.goodsPage){
        vm.goodsList = result.value.goodsPage.list;
        goodTotalNum = result.value.goodsPage.total;
        vm.goodTotalNum = result.value.goodsPage.total;

        $('.pageinfo').data('sui-pagination', '');
        $('.pageinfo').pagination({
          pages: result.value.goodsPage.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: pageNum,
          onSelect: function (num) {
            pageNum = num;
            getGoodsDetail();
          }
        });
        getNum();
      }
    })
  }

}

var getNum = function (){

  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + goodTotalNum + "条记录)</span>");

  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select" style="width: 50px">';

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
    getGoodsDetail();
  })
}

function getUrlId() {

  var url = window.location.href;
  var strs = url.split("/");

  return strs[strs.length-1];
}

var getTask =  function (){

  var url;
  var urlType = getURLType();
  if(urlType){
    url = '/'+ urlType +'/task/task_data';
  }else {
    return;
  }

  var id = getUrlId();
  var data = {};
  data.id = id;
  data.adminType = getURLTypeCode();
  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: data,
    success: function (result) {
      var taskParam = result.value;
      var typeN = taskParam.typeNames.split(',');
      vm.typeNames = typeN;
      vm.task = taskParam;
    },
    error: function () {
      console.log("error ....");
    }
  });

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
