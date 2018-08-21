

function createQuestion() {

  return Question.createQuestion();

}

function createAnswer() {
  return Answer.createAnswer();
}

//用于创建一道试题
var Question = {
  createQuestion:function(){
    return {
      question:{
        id: '',
        examId: '',
        num: '',
        content: '',
        expound:'',
        status:'',
        createTime:'',
        updateTime:''
      },
      answers:[
        { id: '',
          questId: 0,
          num: 'A',
          content: '',
          checked: false,
        },
        {
          id: '',
          questId: 0,
          num: 'B',
          content: '',
          checked: false,
        },{ id: '',
          questId: 0,
          num: 'C',
          content: '',
          checked: false,
        },
        {
          id: '',
          questId: 0,
          num: 'D',
          content: '',
          checked: false,
        }]
    }
  }
}

//用于创建一道试题
var Answer = {
  createAnswer:function(num){
    return {
      id: '',
      questId: 0,
      num: '',
      content: '',
      checked: false,
    }
  }
}

//用于重置题号和选项号
function resetNum(list,condition) {
  if(condition){
    list.forEach(function (obj,index) {
      obj.num = condition[index];
    })
  }else{
    list.forEach(function (obj,index) {
      obj.question.num = index;
    })
  }
}

function getExaminationDetail() {

  var examId = $("#examId").val();

  if(examId && examId > 0){

    var url;
    var urlType = getURLType();
    if(urlType){
      url = "/"+ urlType +"/examination/question";
    }else {
      return;
    }

    $.post(url,{examId: examId},function (result) {
      if(result && result.status == 'OK' && result.value){

        if(getURLTypeCode() == result.value.examination.adminType){
          vm.examination = result.value.examination;
          vm.minuteTotal = getMinute(vm.examination.secondTotal);
          vm.questionAnswers = result.value.questionAnswers;
          vm.content = result.value.content;
          editor1.html(result.value.content);
          if(result.value.examination.diseaseCategory){
            vm.examination.diseaseCategory = result.value.examination.diseaseCategory.split(',');
          }
          // console.log(result);
        }else {
          layer.msg("该平台查不到这个的试卷的相关内容");
          setTimeout(function () {
            window.location.href = "/"+ urlType +"/examination/edit/0";
          }, 1000*1)
        }
      }else {
        layer.msg("原填写内容获取异常:" + (result.errorMessage ? result.errorMessage : result.message));
        setTimeout(function () {
          window.opener.location.href=window.opener.location.href;
          window.close();
        }, 1000*1)

      }
    })

  }

}

