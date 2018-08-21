/**
 * Created by Administrator on 2017/4/19.
 */
/**
 * Created by liufeng on 17/4/19.
 * 分销商模块
 */

$(document).ready(function()
{
  var raise_book_set = {};
  //图片

})

var editor1;

$(function(){



  //表单验证
  function checkAll(){
    var distribut_type = $("input[name=distribut_type]").val();
    $is_diposit = $("[name='is_diposit']:checked").val();
    $diposit = $("[name='deposit']").val();
    $total_recruit = $("[name='total_recruit']").val();
    $total=$("#total").text();
    var r = /^\+?[1-9][0-9]*$/;//判断正整数
    $is_true = r.test($total_recruit);
    $level1 = $("#level1").val();
    $level2 = $("#level2").val();
    $level3 = $("#level3").val();
    $level4 = $("#level4").val();
    $level5 = $("#level5").val();
    $level = {'level1':$level1,'level2':$level2,'level3':$level3,'level4':$level4,'level5':$level5};

    if($is_diposit == 1){
      if(!$diposit){
        layer.msg("请输入保证金");
        return false;
      }else if($diposit<=0 || isNaN($diposit)){
        layer.msg("请输入大于0的数字");
        return false;
      }else if($diposit != '' && $diposit != 0){
        if($diposit>999999.99 || $diposit<0.01){
          layer.msg("保证金超出限制");
          return false;
        }
      }
    }
    for($j=1;$j<=5;$j++){
      if($level['level'+$j]<0 || isNaN($level['level'+$j])){
        layer.msg("请输入大于等于0的数字");
        return false;
      }else if($j>1){
        if($level['level'+$j] != '' && $level['level'+$j] != 0){
          if($level['level'+$j]>999999.99 || $level['level'+$j]<0.01){
            if(distribut_type == 1){
              layer.msg("购买金额超出限制");
            }else{
              layer.msg("充值金额超出限制");
            }

            return false;
          }
          // console.log(parseFloat($level['level'+$j]));
          //console.log(parseFloat($level['level'+($j-1)]));
          if($level['level'+($j-1)] == '' || $level['level'+($j-1)] == 0){
            layer.msg("上一级必须先设置");

            return false;
          }
        }
        if(parseFloat($level['level'+$j]) <= parseFloat($level['level'+($j-1)]) && $level['level'+$j] != 0){
          //console.log(parseFloat($level['level'+$j]));
          //console.log(parseFloat($level['level'+($j-1)]));
          //console.log(parseFloat($level['level'+$j]) < $level['level'+($j-1)]);

          if(distribut_type == 1){
            layer.msg("请按照等级递增规则来填写购买金额<br/>如：T1&lt;T2&lt;T3&lt;T4&lt;T5");
          }else{
            layer.msg("请按照等级递增规则来填写充值金额<br/>如：T1&lt;T2&lt;T3&lt;T4&lt;T5");
          }
          return false;
        }
      }else if($j == 1){
        if($level['level'+$j] == '' || $level['level'+$j] == 0 || isNaN($level['level'+$j])){
          layer.msg("至少设置一级");
          return false;
        }
      }
    }
    if($total_recruit){
      if($total_recruit<=0 || isNaN($total_recruit) || !$is_true){
        layer.msg("请输入大于0的正整数");
        return false;
      }
      if(parseInt($total_recruit) < parseInt($total)){
        layer.msg("允许人数不得低于以通过人数");
        return false;
      }
    }


    return true;
  }




  // 增加验证规则
  $.validate.setRule('version', function(value, $element, param) {
    return /^v(\d+\.){1,4}\d+\w?$/.test(value);
  }, '请输入正确的版本号');

  $('#back-step-1').click(function(){
    $('.step-2').css('display','none');
    $('.step-1').css('display','block');
  })
  $('#back-step-2').click(function(){
    $('.step-3').css('display','none');
    $('.step-2').css('display','block');
  })
  $('#step-1').click(function(){
    if(checkAll()){
      $('.step-1').css('display','none');
      $('.step-2').css('display','block');
      if($(".kindeditor_lee_1")){
        $(".default").css('display','none');
        $(".user_default").css('display','block');
      }
    }
  })
  $('#step-2').click(function(){
    createRecruit();
    $('.step-2').css('display','none');
    $('.step-3').css('display','block');
    $("#preview").html(editor1.html());
  })
//表单提交
  $('#btnSave').click(function(){
    var datas ={};
    var type=$("#recruit_type").val();
    $level1 = parseInt(($("#level1").val()*100).toFixed(2));
    $level2 = parseInt(($("#level2").val()*100).toFixed(2));
    $level3 = parseInt(($("#level3").val()*100).toFixed(2));
    $level4 = parseInt(($("#level4").val()*100).toFixed(2));
    $level5 = parseInt(($("#level5").val()*100).toFixed(2));
    $level = {'level1':$level1,'level2':$level2,'level3':$level3,'level4':$level4,'level5':$level5};
    datas.owner=$("input[name='owner']").val();
    datas.level=JSON.stringify($level);
    datas.total_recruit=$("input[name='total_recruit']").val() >0?$("input[name='total_recruit']").val():0;
    if (type==0) {
      datas.template= "NULL";
    }else{
      datas.template= editor1.html();
    }
    $.ajax({
      type: 'POST',
      url: "./recruit/editRecruit",
      data:datas,
      dataType: 'json',
      success: function(data){
        if(data.msg){
          $('.step-1').css('display','block');
          $('.step-3').css('display','none');
          layer.msg("提交成功");
          getRecruit();
        }else{
          layer.msg("提交失败");
        }
      }

    })
  })

  function createRecruit(){
    if($("#recruit_type").val() != 0) {
      if($("[name='content']").val()){
        $recruit = $("[name='content']").val();
      }else{
        $recruit = $("#template").val();
        $("[name='content']").val($recruit)
      }
      $("#preview").html($recruit);
      $("#preview").css("display","block");
      $("#recruit_preview").css("display","none");
    }else{
      $("#preview").css("display","none");
      $("#recruit_preview").css("display","block");
    }
  }


  $("#recruit_type").change(function(){
    var val=$("#recruit_type").val();
    if(val==0){
      $("#default_recruit").css('display','block');
      $("#recruit").css('display','none');
    }
    if(val==1){
      $("#default_recruit").css('display','none');
      $("#recruit").css('display','block');
    }
  })



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
      }
    });
  });
  getRecruit();
})


function getRecruit() {
  var datas = {};
  datas.owner=$("input[name='owner']").val();
  $.ajax({
    type: 'POST',
    url: "./recruit/getrecruit",
    data:datas,
    dataType: 'json',
    success: function(data){
      console.log(data);
      if (data.msg ) {
        var level=data.recruit.rule;
        if(data.recruit.is_diposit){
          if(data.recruit.is_diposit == 0){
            $("#is_diposit_0").attr("checked","checked");
          }else if(is_diposit_0.is_diposit == 1){
            $("#is_diposit_1").attr("checked","checked");
          }
        }else{
          $("#is_diposit_0").attr("checked","checked");
        }
        if(data.recruit.audit_mode){
          if(data.recruit.audit_mode == 0){
            $("#audit_mode_0").attr("checked","checked");
          }else if(data.recruit.audit_mode == 1){
            $("#audit_mode_1").attr("checked","checked");
          }
        }else{
          $("#audit_mode_0").attr("checked","checked");
        }

        if(data.recruit.rule){
          var level=JSON.parse(data.recruit.rule);
          $level1 = $("#level1").val((level.level1/100).toFixed(2));
          $level2 = $("#level2").val((level.level2/100).toFixed(2));
          $level3 = $("#level3").val((level.level3/100).toFixed(2));
          $level4 = $("#level4").val((level.level4/100).toFixed(2));
          $level5 = $("#level5").val((level.level5/100).toFixed(2));
        }

        if(data.recruit.total_recruit){
          $("input[name='total_recruit']").val(data.recruit.total_recruit);
        }

        if(data.siteId){
          $("input[name='owner']").val(data.siteId);
        }
        if(data.total){
          $("#total").html(data.total.total);
        }
        //设置form的action
        $owner = $("#owner").val();
        if(parseInt(data.recruit.owner) == $owner){
          $action = $("#form1").attr("action");
          $action = $action.substr(0, $action.lastIndexOf('/')+1)+"editRecruit";
          $("#form1").attr("action",$action);
        }

        if(data.recruit.template && data.recruit.template != ''){
          $("#default_recruit").hide();
          // editor1.html(data.recruit.template);
          $(".kindeditor_lee_1").html(data.recruit.template);
          $("#recruit").show();
          $("#recruit_type").val(1);
        }else{
          $("#default_recruit").show();
          $("#recruit").hide();
          $("#recruit_type").val(0);
        }
      } else {
        $("#default_recruit").show();
        $("#recruit").hide();
        $("#recruit_type").val(0);
      }
    }
  });
  NoticeNewEvents();
}





//事件
function NoticeNewEvents()
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
  document.getElementById('input_file').addEventListener('change', NoticeNewHandleFileSelect, false);
}

//文件上传
function NoticeNewHandleFileSelect(evt)
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

