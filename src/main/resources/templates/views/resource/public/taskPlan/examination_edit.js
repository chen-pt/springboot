/**
 * Created by Administrator on 2017/9/21.
 */

var vm = new Vue({
  el: '#examination',
  data: {
    categorys : [],
    diseases : [],
    trains:[],
    ok:true,
    content: '',
    minuteTotal:'',
    examination: {
      id: '',
      siteId: '',
      adminType: 0,
      adminId: 0,
      adminName: '',
      title: '',
      drugCategory: '',
      categoryName: '',
      diseaseCategory: [],
      trainedCategory: '',
      questNum: 1,
      secondTotal: 0,
      questTypes: 20,
      brand: '',
      enterprise: '',
      status: 10,
      // content:'',
      createTime: '',
      updateTime: '',
    },
    questionAnswers:[
      {
        question:{
          id: '',
          examId: '',
          num: 0,
          content: '',
          expound: '',
          status:'',
          createTime:'',
          updateTime:'',
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
          },
          { id: '',
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
    ],
    options:['A','B','C','D','E','F'],
  },
  beforeMount:function () {

  },
  mounted:function () {
      var urlType = getURLType();
      if(urlType!="merchant"){
        this.ok = true;
      }  else{
        this.ok = false;
      }
  },
  created:function () {
    getCategorys();
    getDisease();
    geTrain();
    getExaminationDetail();
    this.time_task();
    this.get_jsondata()
  },

  computed: {
  },
  methods: {
    changeSort:function(index) {
      if(index==0){
        layer.msg("最上面的试题不可上移")
      }else{
        var x=this.questionAnswers[index-1]
        Vue.set(this.questionAnswers,index-1,this.questionAnswers[index])
        Vue.set(this.questionAnswers,index,x)
      }
      resetNum(this.questionAnswers,null);
    },

    deleteQuestion:function(index) {
      if(this.questionAnswers.length==1){
        layer.msg("至少要有一道题目")
      }else{
          this.questionAnswers.splice(index,1)
      }
      resetNum(this.questionAnswers,null);
    },

    addQuestion:function(index) {
      this.questionAnswers.splice(index+1,0,createQuestion());
      resetNum(this.questionAnswers,null);
    },

    createQuestion: createQuestion,
    createAnswer: createAnswer,
    // getOptionNum: getOptionNum(),

    //添加一条选项
    addAnswer: function (question_index,answer_index) {
      var answers = this.questionAnswers[question_index].answers;
      if(answers.length < 6){
        if(answer_index == answers.length-1){
          answers.push(createAnswer());
        }else {
          answers.splice(answer_index + 1,0,createAnswer());
        }
      }
      resetNum(this.questionAnswers[question_index].answers,this.options);
    },

    //删除一条选项
    deleteAnswer:function (question_index,answer_index) {
      this.questionAnswers[question_index].answers.splice(answer_index,1);
      resetNum(this.questionAnswers[question_index].answers,this.options);
    },

    //添加正确答案
    correctAnswer: function (question_index,answer_index) {
      var answer = this.questionAnswers[question_index].answers[answer_index];
      answer.checked = !answer.checked;
    },
    //秒转化为分钟
    getMinute:function (value,type) {
      if(value){
        return parseInt((value - 1)/60) + 1;
      }
      return 0;
    },

    time_task: function() {
      setInterval(this.save, 1000*60)
    },
    save:function (){
      vm.examination.diseaseCategory.sort();
      var storage=window.localStorage;
      var savedata={title:this.examination.title,
        content:this.content,
        drugCategory:this.examination.drugCategory,
        diseaseCategory:this.examination.diseaseCategory,
        trainedCategory:this.examination.trainedCategory,
        questionAnswers:this.questionAnswers,
        minuteTotal:this.minuteTotal,
        enterprise:this.examination.enterprise,
        brand:this.examination.brand,
      }
        // savedata.content=editor1;
      editor1.sync();
        savedata.content=document.getElementById('editor1').value;

      var jsondata=JSON.stringify(savedata);
      // if(storage.getItem("jsondata")!=null){
      //   storage.removeItem("jsondata");
      // }
      storage.setItem("jsondata",jsondata);

    },
    get_jsondata:function(){
      var storage=window.localStorage;
      if(storage.getItem("jsondata")==null){
        return
      }
      var jsonObj=JSON.parse(storage.getItem("jsondata"));
      this.examination.title=jsonObj.title;
      // editor1.html(jsonObj.content);
      this.content=jsonObj.content;
      this.examination.drugCategory=jsonObj.drugCategory;
      this.examination.diseaseCategory=jsonObj.diseaseCategory;
      this.examination.trainedCategory=jsonObj.trainedCategory;
      this.questionAnswers=jsonObj.questionAnswers;
      this.questionAnswers=jsonObj.questionAnswers;
      this.minuteTotal=jsonObj.minuteTotal;
      this.examination.enterprise=jsonObj.enterprise;
      this.examination.brand=jsonObj.brand;

    },
    click_return:function () {
      layer.confirm('是否保存为草稿？', {
        btn: ['是','否'] //按钮
      }, function(){
        vm.save();
        var urlType = getURLType();
        window.opener.location.href=window.opener.location.href
        window.close();
      }, function(){
        var storage=window.localStorage;
        storage.removeItem("jsondata");
        var urlType = getURLType();
        window.opener.location.href=window.opener.location.href
        window.close();
      });
    },

    previewExamination: previewExamination,
    saveExamination: saveExamination,
    getURLType: getURLType,
    getURLTypeCode: getURLTypeCode,
    contains: function (value,array) {
      return $.inArray(value, array) > -1;
    },
    filterEmoji: filterEmoji,

  },
  watch:{
    minuteTotal:function (val,oldVal) {
      if(val){
        val = val.toString().replace(/\D/g,'');
        this.minuteTotal = val > 180 ? 180 : val;
        this.examination.secondTotal = val ? val * 60 : 0;
      }
    },
    questionAnswers: function (val,oldVal) {
      this.examination.questNum = val.length;
    }
  },

})


//url头
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

//培训分类
function geTrain(){
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/examination/getTrains";
  }else {
    return;
  }

  $.ajax({
    type: 'post',
    url: url,
    success: function (data) {
      var list = data.value;
      vm.trains = list;
    }

  })
}


// //药品分类
function getCategorys() {
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/examination/categorys";
  }else {
    return;
  }
  $.post(url,
    function(result){
      if(result.message == 'Success'){
        var list = result.value;
        vm.categorys = list;
      }else {
        console.log("error ....");
      }
    },
    "json");
}

//疾病分类
function getDisease() {
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/examination/disease";
  }else {
    return;
  }
  $.post(url,
    function(result){
      if(result.message == 'Success'){
        var list = result.value;
        vm.diseases = list;
      }else {
        console.log("error ....");
      }
    },
    "json");
}

function getMinute(value) {
  if(value){
    return parseInt((value - 1)/60) + 1;
  }
  return 0;
}

function previewExamination() {

  var examinationInfo = getExaminationParam(false);

  if(examinationInfo){
    var url;
    var urlType = getURLType();
    if(urlType){
      url = "/" + urlType + "/examination/preview" ;
    }else {
      return;
    }

    $.ajax({
      url: url,
      type: 'post',
      data: JSON.stringify(examinationInfo),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (result) {
      if(result.code == '000' && result.value){
        window.open("/"+ urlType +"/examination/detail/" + result.value);
      }else{
        layer.msg(result.message);
      }
    });

  }
  
}

/**
 * 保存试卷
 */
function saveExamination() {

  var examinationInfo = getExaminationParam(true);

  if(examinationInfo){
    var url;
    var urlType = getURLType();
    if(urlType){
      url = "/"+ urlType +"/examination/" + (vm.examination.id > 0 ? 'update' : 'save');
    }else {
      return;
    }

    $.ajax({
      url: url,
      type: 'post',
      data: JSON.stringify(examinationInfo),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (result) {
      if(result.status == 'OK'){
        var storage=window.localStorage;
        storage.removeItem("jsondata");
        window.opener.location.href=window.opener.location.href
        window.close();
        // window.location.href = '/'+ urlType +'/examination/list';
      }else{
        layer.msg(result.message);
      }

    });

  }

}

/**
 * 获取试卷参数
 * @returns {*}
 */
function getExaminationParam(bl) {

  if(checkExaminationParam(bl)){
    var params = {};

    params.examination = vm.examination;
    params.questionAnswers = vm.questionAnswers;
    params.content = vm.content;

    var params_copy = JSON.parse(JSON.stringify(params));
    params_copy.examination.diseaseCategory = params_copy.examination.diseaseCategory.join(',');
    params_copy.examination.adminType = getURLTypeCode();

    return params_copy;
  }else {
    return null;
  }



}

/**
 * 校验必填项
 * @returns {*}
 */
function checkExaminationParam(bl) {

  //校验试卷标题
  if(!vm.examination.title){
    layer.msg("请填写试卷标题");
    return false;
  }

  var content = $("iframe").contents().find("body").html();

  //校验正文
  if(!content){
    layer.msg("请填写试卷正文");
    return false;
  }

  vm.content = content;

  //验证是否有试题
  if(vm.questionAnswers){
    try{
      //试题循环验证
      vm.questionAnswers.forEach(function (questionAnswer,question_index) {
        //校验试题题干
        if(!questionAnswer.question.content){
          layer.msg("请填写第"+ (question_index + 1) + "题的题干");
          throw 'BreakException';
        }
        //校验答案是否正常的状态
        var answer_checked = false;
        //答案循环校验
        questionAnswer.answers.forEach(function (answer,answer_index) {
          //校验选项内容
          if(!answer.content){
            layer.msg("请填写第"+ (question_index + 1) + "题的" + answer.num +"选项内容");
            throw 'BreakException';
          }
          //校验是否有正确选项
          if(bl && answer.checked){
            answer_checked = answer.checked;
          }
        })
        //未设置正确答案
        if(bl && !answer_checked){
          layer.msg("请设置第"+ (question_index + 1) + "题的正确答案");
          throw 'BreakException';
        }
      })
    } catch(e) {
      if ( e !== 'BreakException') throw e;
      return false;
    }
  }else {
    layer.msg("试卷添加试题信息异常，请刷新重试");
    return false;
  }

  return true;

}


function getURLTypeCode() {

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

var editor1;
  KindEditor.lang({
    example1: '插入图片'
  });
  KindEditor.plugin('example1',
    function (K) {
      var self = this,
        name = 'example1';
      self.clickToolbar(name,
        function () {
          $('#upload_N').attr('class','sui-modal show');
          $('#upload').modal('show');
          curEdit = self.items[27];
        });
    });
  editor1 = KindEditor.create('textarea[name="content"]', {
    allowFileManager: true,
    items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'kindeditor_lee_1'],
  });

var storage=window.localStorage;
var jsonObj=JSON.parse(storage.getItem("jsondata"));
if(jsonObj!=null && jsonObj.content!=""){
  editor1.html(jsonObj.content);
}



// 更多图片
document.getElementById('input_file').addEventListener('change', ProductAddHandleFileSelect, false)

// 文件上传
function ProductAddHandleFileSelect (evt) {

    editHandleFileSelect(evt).done(function (img_url) {
      // if(curEdit == 'kindeditor_lee_1') {
      //   if($('#qualification_default').val() == '') {
      //     editor3.html('')
      //     $('#qualification_default').val('editing')
      //   }
      // }

      // var storage=window.localStorage;
      // var jsonObj=JSON.parse(storage.getItem("jsondata"));
      // if(jsonObj!=null){
      //   curEdit=jsonObj.content;
      // }

      $.each(img_url, function (k, v) {
        KindEditor.insertHtml('.' + curEdit, "<img src='" + v + "' />");
      });
    });

}

//更多 选择图片
editHandleFileSelect = function (evt)
{
  var files = evt.target.files;
  var cur_success_file_num = 0;
  var cur_error_file_num = 0;
  var img_url = [];
  var dfds = [];

  for (var i = 0, f; f = files[i]; i++) {
    if (!f.type.match('image.*')) {
      continue;
    }
    var formData = new FormData();
    formData.append('ad_img_file', f);

    var url=getURLType();

    var dfd = $.ajax({
      url: '/'+url+'/examination/image/upload',
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
    }).done(function (rsp) {
      if (rsp && rsp.status) {
        img_url.push(rsp.result.imgsrc);
        cur_success_file_num++;
      } else {
        cur_error_file_num++;
      }
    }).fail(function () {
      cur_error_file_num++;
    });
    dfds.push(dfd);
  }

  var resultDfd = $.Deferred();
  $.when.apply($, dfds).always(function () {
    if (cur_error_file_num + cur_success_file_num == files.length) {
      layer.alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
    }

    resultDfd.resolve(img_url);
  });

  return resultDfd;
};

function filterEmoji(val){

  var ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ];

  return val.replace(new RegExp(ranges.join('|'), 'g'), '');

}





