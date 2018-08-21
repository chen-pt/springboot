var vm;

var groupId = 1;
var quotaGroups = {};
var counttypes = {};

//获取奖励规则
var rewardTypeNames = {10 : 'rmb', 20 : 'jx',30 : 'jkd'};

var rmbConditionTargetIds = ['3','4','5','6'];

$(function () {

  vm = new Vue({
    el: '.order-detail-div',
    data: {
      urlTypeCode : 0,
      taskDetail: {
        targetId: 10,
        rewardType: (getURLTypeCode()== 30 ? 30 : 10),
        rewardLimit: '',
        lowTarget: '',
        punish: '',
        rewardDetail:{
          type:'',
          detail:{
            condition:'',
            reward:'',
            topLimit:'',
            intervalMin:'',
            intervalMax:'',
          },
          intervals:[
            {
              condition:'',
              reward:'',
              topLimit:'',
              intervalMin:0,
              intervalMax:'',
            }
          ],
          ladders:[
            {
              condition:'',
              reward:'',
              topLimit:'',
              intervalMin:'',
              intervalMax:'',
            }
          ]
        },
      },
      quotaGroup:[{
        id: '',
        groupId: '',
        name: '',
        type: '',
        enable: ''
      }] ,
      counttype: [{
        id: '',
        groupId: '',
        name: '',
        tbl_name: '',
        filter_condition:''
      }],
      groupId: groupId,

      goods: {
        goodList: [],
        totalNum :0,
        addgoodIdList:[],
        addgoodList: [],
        addgoodListcheck:[],
        selectAll:false,
        addSelectAll:false,
        categoryId:'',
      },

      taskShow: false,
      taskLinkage: false,

      examination:{
        examinationList: [],
        examinationId: 0,
        title:'',
        questNum:0,
        secondTotal:0,
      },

      rewardUnit: rewardUnit,
      laddersConditionUnit: laddersConditionUnit,
      intervalsConditionUnit: intervalsConditionUnit,

    },
    created: function () {
      getQuotaGroupAndCounttype(groupId);
      getGoodsList();
      getCategories();
      getExaminationList();
    },
    methods: {
      getQuotaGroupAndCounttype: getQuotaGroupAndCounttype,
      saveTask: saveTask,
      removeSelectAll: removeSelectAll,
      specifyGood: specifyGood,
      getURLTypeCode: getURLTypeCode,

      getGoodsList: getGoodsList,
      selectGoods: selectGoods,
      unSelectGoods: unSelectGoods,
      selectAllGood: selectAllGood,
      addSelectAllGood: addSelectAllGood,
      selectGoodBatch:selectGoodBatch,
      unSelectGoodBatch:unSelectGoodBatch,
      getIndex: getIndex,

      addIntervalsLi: addIntervalsLi,
      deleteIntervalsLi: deleteIntervalsLi,
      addLaddersLi: addLaddersLi,
      deleteLaddersLi: deleteLaddersLi,

      getExaminationList: getExaminationList,
      getMinute: getMinute,
      selectExam: selectExam,

      contains: function (value,array) {
        return $.inArray(value, array) > -1;
      },
      timeFormate : function (time) {
        var date  = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
        return date;
      },
    },
    watch: {
      groupId: function (val) {
        getQuotaGroupAndCounttype(val);

        this.taskDetail.rewardDetail.intervals = [Detail.createDetail(0)];
        this.taskDetail.rewardDetail.ladders = [Detail.createDetail(0)];
        this.taskDetail.rewardLimit = '';
        this.taskDetail.lowTarget = '';
        this.taskDetail.punish = '';
      },
    }
  })

  //指标和口径联动
  $('.control-group-target .slide li').click(function () {
    var _index = $(this).index();

    //初始化一些内容
    if($('[name="type_id_all_trades"]').is(':checked')){
      $('[name="type_id_all_trades"]').click();
    }
    if($('[name="type_id_all_member"]').is(':checked')){
      $('[name="type_id_all_member"]').click();
    }
    if($('[name="goods_limit"]').is(':checked')){
      $('[name="goods_limit"]').click();
    }

    $('#goods_select').hide();
    $('#goods_num').hide();
    if (_index < 3) {
      $('.control-content-target li').eq(_index).show().siblings().hide();
      $('.control-main-target li').eq(_index).show().siblings().hide();
      $(this).css('background','#6bc5a4');
      $(this).siblings().css('background','#d9d7d9');
    }
    vm.taskLinkage = false;
    vm.groupId = $(this).attr('data');
    vm.urlTypeCode = getURLTypeCode();

  })

  //口径中订单全选
  $('[name="type_id_all_trades"]').click(function () {
    selectAllOrder($('[name="type_id_all_trades"]').is(':checked'));
  })

  //口径中會員全选
  $('[name="type_id_all_member"]').click(function () {
    selectAllOrder($('[name="type_id_all_member"]').is(':checked'));
  })


})

//口径全选
function selectAllOrder(bool) {
  $('[name="type_id"]').each(function () {
    this.checked = bool;
    if(bool){
      $(this).parent().addClass("checked");
    }else{
      $(this).parent().removeClass("checked");
    }
  })
}

//商品选着后的显示
var specifyGood = function () {
  if($('[name="goods_limit"]').is(':checked')){
    $('#goods_select').show();
    $('#goods_num').show();
  }else {
    $('#goods_select').hide();
    $('#goods_num').hide();
  }
}

//移除订单类型全选
var removeSelectAll = function (_this) {

  // if(!$(_this).is(':checked') && $('[name="type_id_all"]').is(':checked')){
  //   $('[name="type_id_all"]').parent().click();
  // }

}

//获取指标和统计口径
var getQuotaGroupAndCounttype = function (_groupId) {
  //用于判断是什么后台
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/task/getQuotaGroupAndCounttype";
  }else {
    return;
  }

  var param = {};

  param.groupId = _groupId;

  //指标和统计口径都存在就不在获取
  if (quotaGroups[_groupId] && counttypes[_groupId] ) {
    vm.quotaGroup = quotaGroups[_groupId];
    vm.counttype = counttypes[_groupId];
    vm.taskLinkage = true;
    return;
  }

  $.post(url, param, function (result) {

    if (result.status == 'OK') {
      if (result.value.quotaGroup && result.value.counttype) {
        vm.quotaGroup = result.value.quotaGroup;
        quotaGroups[result.value.groupId] = result.value.quotaGroup;
        vm.counttype = result.value.counttype;
        counttypes[result.value.groupId] = result.value.counttype;
      } else {
        layer.msg('未查到相关指标和统计口径，请刷新后重试！')
      }
    } else {
      layer.msg(result.message);
    }
    vm.taskLinkage = true;
    $("[name='task_form']").show();
  },'json')

}

//保存任务
var saveTask = function () {

  //用于判断是什么后台
  var url;
  var urlType = getURLType();
  if(urlType){
    url = '/'+ urlType +'/task/task_save';
  }else {
    return;
  }

  var params = getTaskData();

  //一旦参宿为空，就不保存
  if(params){
    params.adminType = getURLTypeCode();
    $.ajax({
      url: url,
      type: 'post',
      data: JSON.stringify(params),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (result) {

      if(result.status == 'OK'){
        window.location.href = '/'+ urlType +'/task/task_list';
      }else{
        layer.msg(result.message);
      }

    });
  }

}

//获取任务参数
var getTaskData = function () {

  var params = {};

  //获取参数
  var name = $('[name="name"]').val();
  var targetId = $('.control-content-target ul li [name="target_id"]:checked').val();
  var typeIds = [];
  $('[name="type_id"]:checked').each(function () {
    typeIds.push($(this).val());
  })

  var object = $('[name="object"]:checked').val();
  var rewardType = $('[name="reward_type"]:checked').val();
  var rewardDetail = {};
  var explain = $('[name="explain"]').val();

  //校验必填项
  if(!name){
    layer.msg('请填写任务名');
    return null;
  }
  if(!targetId){
    layer.msg('请选择任务指标');
    return null;
  }
  if(typeIds.length < 1){
    layer.msg('请选择统计口径');
    return null;
  }
  if(!object){
    layer.msg('请选择任务对象细度');
    return null;
  }
  if(!rewardType){
    layer.msg('请选择任务奖励类');
    return null;
  }

  //封装参数
  params.name = name;
  params.targetId = targetId;
  // params.typeIds = JSON.stringify(typeIds);
  params.typeIds = typeIds;
  params.object = object;
  //奖励类型获取判断
  if(rewardType){
    params.rewardType = rewardType;
    //获取奖励详情
    rewardDetail = getRewardType(rewardType,targetId);

    if(!rewardDetail){
      return null;
    }
    //额外封装
    params.rewardLimit = rewardDetail.limit;
    params.lowTarget = rewardDetail.punishLimit;
    params.punish = rewardDetail.penalize;

    rewardDetail = {type:rewardDetail.type,detail:rewardDetail.detail,intervals:rewardDetail.intervals,ladders:rewardDetail.ladders};
  }else {
    params.rewardType = 0;
    rewardDetail = {type:0,detail:{},intervals:[],ladders:[]};
  }

  var timeType = $('#time-type-' + rewardDetail.type).val();
  if(!timeType){
    layer.msg('请选择任务时间');
    return null;
  }
  params.timeType = timeType;

  //数据转换
  // params.rewardDetail = JSON.stringify(rewardDetail);
  params.rewardDetail = rewardDetail;


  if(explain)params.explain = explain;
  params.status = 10;

  //指定商品处理
  if(vm.groupId == 1){
    if($('[name="goods_limit"]').is(':checked')){
      //是否制定全部商品
      var isAll = $('[name="goods_limit"]:checked').val();
      if(isAll == 0){
        if(vm.goods.addgoodIdList.length > 0){
          params.taskBlob = {id: null,
            taskId: null,
            goodsId:vm.goods.addgoodIdList.join(","),
            isAll: isAll};
        }else{
          layer.msg('请添加指定商品');
          return null;
        }
      }else if(isAll == 1){
        params.taskBlob = {id: null,
          taskId: null,
          goodsId:null,
          isAll: isAll};
      }else {
        layer.msg('请添加指定商品');
        return null;
      }
    }else {
      params.taskBlob = {
        id: null,
        taskId: null,
        goodsId:null,
        isAll: 1
      };
    }
  }else {
    params.taskBlob = undefined;
  }

  if(vm.groupId == 3){
    if(vm.examination.examinationId > 0){
      params.taskBlob = {id: null,
        taskId: null,
        goodsId:null,
        isAll: null,
        examinationId:vm.examination.examinationId
      };
    }else {
      layer.msg('请选择试卷');
      return null;
    }
  }

  return params;

}

var getRewardType = function(rewardType,targetId){

  var rewardDetail = {};
  //奖励的div
  var rewardTypeDiv = $(".control-content-reward");
  //奖励条件类型
  var type =  rewardTypeDiv.find( '[name="type"]:checked').val();
  //满足条件
  var detail = {};
  //阶梯条件
  var ladders = [];

  var intervals = [];

  //条件状态，一旦为true，就结束方法，奖励获取失败
  var conditionStatus = false;

  //惩罚选项
  var punish = rewardTypeDiv.find('[name="punish"]').is(':checked');

  // 阶梯条件
  if(type == 20){
    //上一个奖励条件
    var preCondition;

    rewardTypeDiv.find(' [data-name="ladders"] li').each(function (index) {

      var _condition = $(this).find('[name="num_condition"]').val();
      var _reward =  $(this).find('[name="num_reward"]').val();

      //奖励和条件都不存在就跳过
      if(!_condition && !_reward){
        return true;
      }
      //奖励条件校验
      if(!_condition){
        layer.msg('阶梯条件缺少一个条件');
        conditionStatus = true;
        return false;
      }else if( _condition <= 0 ){
        layer.msg('阶梯条件请大于零');
        conditionStatus = true;
        return false;
      }

      //奖励条件递增校验
      if(index != 0){
        if(parseFloat(preCondition) > parseFloat(_condition)){
          layer.msg('阶梯条件要递增');
          conditionStatus = true;
          return false;
        }else {
          preCondition = _condition;
        }
      }else {
        preCondition = _condition;
      }

      //无奖励任务，奖励可以为0
      _reward = _reward ? _reward : 0;

      //当条件是关于金额的，要以金额计算，当奖励和封顶是人民币的话，以金额计算
      ladders.push({condition:((_condition && rmbConditionTargetIds.indexOf(targetId)>-1) ? (_condition * 100) : _condition),
        reward:(rewardType == 10 && _reward ? (_reward * 100) : _reward),
        topLimit:null});
    })
  }

  // 区间阶梯条件
  if(type == 30){
    //上一个奖励条件
    var preIntervalMin;
    var preIntervalMax;

    var divUlLi = rewardTypeDiv.find('[data-name="intervals"] li');

    divUlLi.each(function (index) {

      var intervalMin = $(this).find('[name="interval_min"]').val();
      var intervalMax = $(this).find('[name="interval_max"]').val();
      var intervalCondition = $(this).find('[name="interval_every_condition"]').val();
      var intervalReward =  $(this).find('[name="interval_every_reward"]').val();

      //奖励和条件都不存在就跳过
      if((!intervalMin || intervalMin == 0) && !intervalMax && !intervalCondition && !intervalReward){
        return true;
      }

      //区间条件校验
      if(index != 0 && !intervalMin){
        layer.msg('请填写区间最小值');
        conditionStatus = true;
        return false;
      }else if(index != 0 && intervalMin <= 0 ){
        layer.msg('区间最小值请大于零');
        conditionStatus = true;
        return false;
      }

      if(index == (divUlLi.length - 1)){
        //区间条件校验
        if(!intervalMax){

        }else if( intervalMax && intervalMax <= 0 ){
          layer.msg('区间最大值请大于零');
          conditionStatus = true;
          return false;
        }else if(intervalMax && parseFloat(intervalMax) < intervalMin){
          layer.msg('区间最小值请勿大于区间最大值');
          conditionStatus = true;
          return false;
        }
      }else {
        //区间条件校验
        if(!intervalMax){
          layer.msg('请填写区间最大值');
          conditionStatus = true;
          return false;
        }else if( intervalMax <= 0 ){
          layer.msg('区间最大值请大于零');
          conditionStatus = true;
          return false;
        }

        if(parseFloat(intervalMax) < intervalMin){
          layer.msg('区间最小值请勿大于区间最大值');
          conditionStatus = true;
          return false;
        }

      }

      if(index != 0 && parseFloat(preIntervalMax) != intervalMin){
        layer.msg('请设置连续区间');
        conditionStatus = true;
        return false;
      }

      //奖励条件递增校验
      if(index != 0 && parseFloat(preIntervalMin) > parseFloat(intervalMin)){
        layer.msg('区间最小值要递增');
        conditionStatus = true;
        return false;
      }else {
        preIntervalMin = intervalMin;
        preIntervalMax = intervalMax
      }

      //奖励条件校验
      if(!intervalCondition){
        layer.msg('区间阶梯条件缺少一个条件');
        conditionStatus = true;
        return false;
      }else if( intervalCondition <= 0 ){
        layer.msg('区间阶梯条件请大于零');
        conditionStatus = true;
        return false;
      }

      //区间条件校验
      if(!intervalReward){
        layer.msg('请填写区间奖励');
        conditionStatus = true;
        return false;
      }else if( intervalMin < 0 ){
        layer.msg('区间奖励请大于零');
        conditionStatus = true;
        return false;
      }

      //封顶
      var topLimit = 0;

      if($(this).find('[name="top_limit"]')){
        topLimit = $(this).find('[name="interval_top_limit"]').val();
      }

      //封顶条件存在必须大于零
      if(topLimit && topLimit < 0){
        layer.msg('区间封顶奖励请大于零，不封顶请不要填写或填写0');
        conditionStatus = true;
        return false;
      }

      //无奖励任务，奖励可以为0
      intervalReward = intervalReward ? intervalReward : 0;

      topLimit = topLimit ? topLimit : 0;

      //当条件是关于金额的，要以金额计算，当奖励和封顶是人民币的话，以金额计算
      intervals.push({
        intervalMin: ((intervalMin && rmbConditionTargetIds.indexOf(targetId) > -1) ? (intervalMin * 100) : intervalMin),
        intervalMax: ((intervalMax ? (rmbConditionTargetIds.indexOf(targetId) > -1 ? intervalMax * 100 : intervalMax) : -1)),
        condition:((intervalCondition && rmbConditionTargetIds.indexOf(targetId) > -1) ? (intervalCondition * 100) : intervalCondition),
        reward:(rewardType == 10 && intervalReward? (intervalReward * 100) : intervalReward),
        topLimit:((rewardType == 10 && topLimit) ? (topLimit * 100) : topLimit)});
    })
  }

  if(intervals.length == 0 && ladders.length == 0){
    type = 0;

    if(!punish){
      layer.msg("请正确设置奖励方式或者惩罚方式其中之一")
      conditionStatus = true;
      return null;
    }

  }

  //条件奖励内容是否填写正常，不不正常true，返回null
  if(conditionStatus){
    return null;
  }

  //总限额选项
  var totalLimit = rewardTypeDiv.find('[name="total_limit"]').is(':checked');
  //总限额
  var limit = totalLimit ? rewardTypeDiv.find('[name="limit"]').val() : 0;

  var punishLimit = '';
  var penalize = '';
  //惩罚存在
  if(punish){
    //惩罚条件
    punishLimit = rewardTypeDiv.find('[name="punish_limit"]').val();
    //惩罚
    penalize = rewardTypeDiv.find('[name="penalize"]').val();

    if(!punishLimit){
      layer.msg("请填写惩罚条件");
      conditionStatus = true;
      return null;
    }

    if(!penalize){
      layer.msg("请填写惩罚数额");
      conditionStatus = true;
      return null;
    }

  }
  //条件奖励内容是否填写正常，不不正常true，返回null
  if(conditionStatus){
    return null;
  }

  if(!type){
    type = 0;
  }

  punishLimit = punishLimit ? punishLimit : 0;
  penalize = penalize ? penalize : 0;

  //封装细则
  rewardDetail.type = type;
  rewardDetail.detail= detail;
  rewardDetail.intervals = intervals;
  rewardDetail.ladders = ladders;
  rewardDetail.totalLimit = totalLimit;
  //是人民币就 *100
  rewardDetail.limit = (rewardType == 10 && limit ? (limit * 100) : limit);
  rewardDetail.punish = punish;
  //当条件是关于金额的，要以金额计算，当奖励和封顶是人民币的话，以金额计算
  rewardDetail.punishLimit = ((punishLimit && rmbConditionTargetIds.indexOf(targetId)>-1)  ? (punishLimit * 100) : punishLimit);
  //仅仅与人民币还是绩效相关
  rewardDetail.penalize = (rewardType == 10 && penalize ? (penalize * 100) : penalize);

  return rewardDetail;

}

var getURLType = function () {

  var url = window.location.href;

  if(url.indexOf("merchant") > -1){
    return "merchant";
  }else if(url.indexOf("store") > -1){
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

var getMinute = function (num) {

  if(num){
    return num/60;
  }else{
    return 0;
  }
  
}

//时间格式化
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


