
//列表
var curPage_exam = 1;
var totalNum_exam = 0;
var pageSize_exam = 15;

function getExaminationList() {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = "/"+ urlType +"/examination/examinationList";
  }else {
    return;
  }

  var id = $('#select_exam').find('[name="id"]').val();
  var title = $('#select_exam').find('[name="title"]').val();
  var manufactor = $('#select_exam').find('[name="manufactor"]').val();
  var brand = $('#select_exam').find('[name="brand"]').val();
  var start_time = $('#select_exam').find('[name="start_time"]').val();
  var end_time = $('#select_exam').find('[name="end_time"]').val();

  var param = {};

  if (id) param.id=id;
  if (name) param.title=title;
  if (manufactor) param.enterprise=manufactor;
  if (brand) param.brand = brand;
  if (start_time) param.startTime = start_time;
  if (end_time) param.endTime = end_time;

  param.pageSize = pageSize_exam;
  param.pageno = curPage_exam;

  $.post(url,
    param,
    function(result){
      if(result.message == 'Success'){
        vm.examination.examinationList = result.value.list;
        totalNum_exam = result.value.total;

        $('#select_exam').find('.pageinfo').data('sui-pagination', '');
        $('#select_exam').find('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage_exam,
          onSelect: function (num) {
            curPage_exam = num;
            getExaminationList();
          }
        });
        getNumExam();
      }else {
        vm.examination.examinationList = [];
        console.log("error ....");
      }
    },
    "json");
}

var getNumExam = function (){

  $('#select_exam').find('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum_exam + "条记录)</span>");

  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select" style="width: 40px">';

  $.each(pagearr, function(){

    if(this==pageSize_exam)
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });

  pageselect = pageselect+'</select>&nbsp;';

  $('#select_exam').find('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('#select_exam').find('.page_size_select').change(function () {
    pageSize_exam = $('#select_exam').find('.page_size_select').val();
    getExaminationList();
  })

}

var selectExam = function () {
  var exam_select = $('[name="examinationId"]:checked');

  if(exam_select){
    vm.examination.examinationId = exam_select.val();
    vm.examination.title = exam_select.parent().find('[name="title"]').val();
    vm.examination.questNum = exam_select.parent().find('[name="questNum"]').val();
    vm.examination.secondTotal = exam_select.parent().find('[name="secondTotal"]').val();
  }
}
