var vm;
$(function () {
  vm = new Vue({
    el: '#examination_list',
    data: {
      examinationList: [],
      disease : [],
      categorys : [],
      url:'',
      urlType : ''
    },
    created: function () {
      getExaminationList();
      getDisease();
      getCategorys();
      this.createExamination();
    },
    methods: {
      deleteById: deleteById,
      timeFormate : function (time) {
        var date  = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
        return date;
      },
      querySplit : function (str) {
        var arr = new Array();
        var arr = str.split(',');
        return arr;
      },
      createExamination:function(){
        var urlType = getURLType();
        if(urlType){
          this.url="/"+urlType+"/examination/edit/0"
        }
      },
      examinationDetail : function (id) {
        var urlType = getURLType();
        if(urlType){
          window.location.href="/"+ urlType +"/examination/detail/" + id;
        }
      },
      examinationFollow : function (id) {
        var urlType = getURLType();
        if(urlType){
          window.location.href="/"+ urlType +"/examination/follow/" + id;

        }
      },
      examinationEdit: function (id) {
        examinationEdit(id);
      }
    }
  })

  $('.page_size_select').change(function () {
    pageSize = this.val();
    getExaminationList();
  })

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

//列表
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

function getExaminationList() {
  var url;
  var urlType = getURLType();

  if(urlType){
    url = "/"+ urlType +"/examination/examinationList";
  }else {
    return;
  }
  var param = {};
  var id = $('#id').val();
  if (id) param.id=id;
  var name = $('#name').val();
  if (name) param.title=name;
  var manufactor = $('#manufactor').val();
  if (manufactor) param.enterprise=manufactor;
  var brand = $('#brand').val();
  if (brand) param.brand = brand;
  var disease = $('#disease').val();
  if (disease) param.diseaseCategory = disease;
  var drugs = $('#drugs').val();
  if (drugs) param.drugCategory = drugs;
  var questions_type = $('#questions_type').val();
  if (questions_type) param.questType = questions_type;
  var start_time = $('#start_time').val();
  if (start_time) param.startTime = start_time;
  var end_time = $('#end_time').val();
  if (end_time) param.endTime = end_time;

  param.pageSize = pageSize;
  param.pageno = curPage;


  $.post(url,
    param,
    function(result){
      if(result.message == 'Success'){
        var list = result.value.list;
        vm.examinationList = list;
        vm.urlType = urlType;
        var num = result.value.total
        totalNum = num;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        if($('.pageinfo')){
          $('.pageinfo').remove();
        }

        $(".examination-list").append("<span class='pageinfo' style='text-align:right'></span>")

        $('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getExaminationList();
          }
        });
        getNum();
      }else {
        vm.examinationList = [];
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
        vm.disease = list;
      }else {
        console.log("error ....");
      }
    },
    "json");
}

//药品分类
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

//删除试卷
function deleteExamination(){
  var tipHtml = '确定删除此试卷吗?';
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
    layer.msg('请选择试卷');
  }else{
    layer.confirm(tipHtml, {title: ['提示']}, function (idx) {


      var url;
      var urlType = getURLType();
      if(urlType){
        url = "/"+ urlType +"/examination/delete";
      }else {
        return;
      }
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json',
        success: function (data) {
          if (count != data.value.seccessCount){
            layer.msg(data.message);
          }else {
            layer.msg('删除成功');
          }
          setTimeout(function () {
            window.location.href="/"+urlType+"/examination/list";
          },2000)
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
    url = "/"+ urlType +"/examination/delete";
  }else {
    return;
  }
  if(confirm("你确定删除此试卷？")){
    $.post(url,
      {ids: id},
      function (result) {
        if (result.message == 'Success') {
          layer.msg('删除成功');
          setTimeout(function () {
            window.location.href="/"+urlType+"/examination/list";
          },2000)
        }else {
          layer.msg('该试卷在任务中，删除失败');
        }
      });
  }
}

/**
 * 编辑页面
 * @param id
 */
var examinationEdit = function (id) {
  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/examination/edit/" + id;
  }else {
    return;
  }
  window.open(url);
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
