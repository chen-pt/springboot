
// var taskDetail = {
//   name: '',
//   targetId: '',
//   typeIds: '',
//   timeType: '',
//   object:'',
//   rewardType:10,
//   rewardDetail: rewardDetail,
//   explain:'',
// }

var Detail = {
  createDetail : function (intervalMin) {
    return {
      condition:'',
      reward:'',
      topLimit:'',
      intervalMin:intervalMin,
      intervalMax:'',
    }
  }
}

//奖励规则列表
var rewardUnit = {10:'元',20:'绩效',30:'健康豆'};
var laddersConditionUnit = {1:'数量满',2:'数量满',3:'答对'}
var intervalsConditionUnit = {1:'每满',2:'每满',3:'每答对'};

//区间阶梯条件
var addIntervalsLi = function(index){
  if(vm.taskDetail.rewardDetail.intervals.length < 3 ){
    vm.taskDetail.rewardDetail.intervals.splice(index + 1,0,Detail.createDetail());
  }
}

var deleteIntervalsLi = function (index) {
  if(vm.taskDetail.rewardDetail.intervals.length > 1){
    vm.taskDetail.rewardDetail.intervals.splice(index,1);
  }
}

//阶梯条件
var addLaddersLi = function(index){
  if(vm.taskDetail.rewardDetail.ladders.length < 3){
    vm.taskDetail.rewardDetail.ladders.splice(index + 1,0 ,Detail.createDetail());
  }
}

var deleteLaddersLi = function (index) {
  if(vm.taskDetail.rewardDetail.ladders.length > 1){
    vm.taskDetail.rewardDetail.ladders.splice(index,1);
  }

}


