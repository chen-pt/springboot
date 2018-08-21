
var curEdit;
var editor1;

var vm;

$(function () {

  vm = new Vue({
    el: '.content',
    data: {
      noticeDetail:{
        id:null,
        platformType:-1,
        version:'',
        title:'',
        tipsType:-1,
        content:'',
        status:-1
      }
    },
    methods: {

    }
  })

// <---------------------------文本框start----------------------->
  KindEditor.ready(function(K) {
    KindEditor.lang({
      example1: '插入图片'
    });
    KindEditor.plugin('example1',
      function (K) {
        var self = this,
          name = 'example1';
        self.clickToolbar(name,
          function () {
            $("#upload").modal('show');
            curEdit = self.items[27];
            console.log(self.items[27]);
          });
      });

    editor1 = KindEditor.create('.kindeditor_lee_1', {
      allowFileManager: true,
      items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1'],
      afterBlur:function(){
        editor1.sync();
        vm.noticeDetail.content = editor1.html();
      }
    });
    noticeNewEvents();
  });

  //事件
  function noticeNewEvents()
  {

    $("#space-pic-btn").click(function()
    {
      var select_pic_length=$("#space-pic .pic-parent-div .has-select").length;
      var select_pic=$("#space-pic .pic-parent-div .has-select").parent().find("img");

      KindEditor.ready(function(K)
      {
        var editor = K.editor({
          allowFileManager : true
        });
        for(var i=0;i<select_pic_length;i++){
          K.insertHtml(".kindeditor_lee_1","<img src='"+$(select_pic).eq(i).attr("src")+"'  />");
        }
      });
    });

    //上传
    document.getElementById('input_file').addEventListener('change', noticeNewHandleFileSelect, false);
  }

  //文件上传
  function noticeNewHandleFileSelect(evt)
  {
    var img_url = newhandleFileSelect(evt);
    KindEditor.ready(function(K) {
      K.insertHtml(".kindeditor_lee_1","<img src='"+img_url+"' />");
    });
  }

  function newhandleFileSelect(evt){
    var img_url = '';
    var files = evt.target.files;
    var cur_success_file_num=0;
    var cur_error_file_num=0;

    for (var i = 0, f; f = files[i]; i++)
    {

      if (!f.type.match('image.*')) {
        continue;
      }
      var formData = new FormData();
      formData.append("ad_img_file",  f);

      $.ajax({
        url: '/merchant/image/upload',
        type: 'post',
        async: false,
        success: function(data){


          if(data && data.status)
          {
            cur_success_file_num++;

            img_url = data.result.imgsrc;

            if(cur_error_file_num+cur_success_file_num==files.length)
            {
              alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
            }
          }else{
            cur_error_file_num++;
            if(cur_error_file_num+cur_success_file_num==files.length)
            {
              alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
            }
          }
        },
        error: function(data){
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      });
    }

    return img_url;
  }

  // <---------------------------***文本框end***----------------------->
  getNotice();
})

//是创建还是更新记录状态
var edit_type;

//获取公告信息
function getNotice() {

  var url=location.href;

  if(url.indexOf('update') > 0){

    edit_type = 'update';

    var urls = url.split('/');

    var id = urls[urls.length-1];

    vm.noticeDetail.id = id;

    var params = {};

    params.id = id;
    params.pageSize = 15;
    params.pageNum = 1;
    params.is_del = 0;

    $.ajax({
      type: "post",
      url: "/jk51b/notice/getNoticeGroup",
      data:params,
      dataType: "json",
      async:false,
      success: function(result) {
        if(result.message == 'Success' && result.value.list.length > 0){
          vm.noticeDetail = result.value.list[0];
        }else {
          layer.msg(result.message);
        }
      },
      error: function() {
        console.log("请求失败！");
      }
    });
  }else {
    edit_type = 'create'
  }

}

//必填数组
var check_term = ['version','title','content','status'];

//保存公告
function saveNotice() {

  var params = checkTrem();

  var url;

  if(edit_type == 'update'){
    url = "/jk51b/notice/update";
  }else if(edit_type == 'create'){
    url = "/jk51b/notice/save";
  }

  //参数不为空就保存
  if(!params){
    return;
  }else {
    $.post(url,
      params,
      function(result){

        if(result.message == 'Success'){
          layer.msg('操作成功');
          $("#submit").attr({"disabled":"disabled"});
          setTimeout(function () {
             window.location.href="/jk51b/notice_index";
          },500)
        }else {
          layer.msg(result.message);
        }
      },
      "json");
  }

}

//校验必填项，并封装结果
function checkTrem() {

  var params ={};

  //获取表单的值
  var platform_type = $('#platform_type').val();
  var version = $('#version').val();
  var title = $('#title').val();
  var tips_type = $('input[name="tips_type"]:checked').val();
  // var content = $('[name="content"]').text();
  var status = $('#status').val();

  //校验及封装参数
  if(vm.noticeDetail.id)params.id = vm.noticeDetail.id;
  if(platform_type && platform_type != -1)params.platformType=platform_type;

  if(version){
    params.version = version;
  }else{
    layer.msg("请填写版本号");
    return null;
  }

  if(title){
    params.title = title;
  }else{
    layer.msg("请填写功能简介");
    return null;
  }

  if(tips_type)params.tipsType = tips_type;

  if(vm.noticeDetail.content){
    params.content = vm.noticeDetail.content;
  }else{
    layer.msg("请填写功能详情");
    return null;
  }

  if(status && status != -1){
    params. status = status;
  }else{
    layer.msg("请选择状态");
    return null;
  }

  //返回数据参数
  return params;

}
