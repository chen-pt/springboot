$(function(){
  var url="";
  var option = "";

  $("#import_add").on("click",function () {
    url="";
    option = "add";
    $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/ypl' + url + '.xls');
    $('#check_modal').val("0");
    $('#on_type').html('药品');
    $('#is_disable').removeClass("hide");
    $("#import_message span").html("批准文号");
  });
  $("#import_edit").on("click",function () {
    url="_update";
    option = "update";
    $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/ypl' + url + '.xls');
    $('#check_modal').val("0");
    $('#on_type').html('药品');
    $('#is_disable').addClass("hide");
    $("#import_message span").html("商品编码");
  });
  //导入模板选择事件
  $('#check_modal').on('change', function () {

    switch ($('#check_modal').val()) {
      case '':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/ypl' + url + '.xls');
        $('#on_type').html('药品' + name);
        break;
      case'10':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/ypl' + url + '.xls');
        $('#on_type').html('药品');
        break;
      case'40':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/bjp' + url + '.xls');
        $('#on_type').html('保健品');
        break;
      case'30':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/qixie' + url + '.xls');
        $('#on_type').html('器械类');
        break;
      case'80':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/xiaodu' + url + '.xls');
        $('#on_type').html('消毒类');
        break;
      case'60':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/hzp' + url + '.xls');
        $('#on_type').html('化妆品');
        break;
      case'70':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/zhyc' + url + '.xls');
        $('#on_type').html('中药材');
        break;
      case'20':
        $('#tag_address').attr('href', '/templates/views/resource/merchant/elsefile/qita' + url + '.xls');
        $('#on_type').html('其他类');
        break;
    }
  })

  $(document).on('change', '#input_file', function () {
    var e = $(this).val();
    $("#file_name").val(e);
  });

  //上传csv
  $(document).on('click', '#import_btn', (function () {
    batchImportProduct();
  }));

  //批量导放商品
  function batchImportProduct() {
    if (!$("#input_file").val()) {
      layer.alert("请先选择您的商品文件！");
      return;
    }
    if (!($('#check_modal').val() > 0)) {
      layer.alert('请先选择模板');
      return;
    }
    var isCloud = 0;
    if($("input[name='isclouds']").attr('checked')){
        isCloud = 1;
    }
    var detail_tpl = $("#check_modal").val();
    $(".ajax_info").html("正在处理，请稍后.....");
    $(".ajax_info").css("color", "#000");
    var formData = new FormData();
    formData.append('xls_file', $("#input_file")[0].files[0]);
    formData.append('detailTpl', detail_tpl);
    formData.append('option',option);
    formData.append('use51',isCloud);
    var $recycle = $('[name=is_recycle]');
    var recy = $recycle.is(':checked');
    if (recy) {
      recy = $recycle.val();
    } else {
      recy = 0;
    }

    formData.append('recy', recy);
    $.ajax({
      url:"/merchant/productBatchEdit2",
      type:"post",
      data:formData,
      contentType: false,
      processData: false,
      timeout: 0,
      success:function (data) {

        if (data.status) {
          var str = '';
          if(option == "update"){
             str = "处理完成，匹配成功"+data.result.success_num+"条，失败"+data.result.fail_num+"条。";
            if (data.result.errfile_url) {
              str += '<a target="_blank" href="' + data.result.errfile_url + '">下载失败文件</a>'
            }

          }else if (option == "add") {
            str = "处理完成，匹配成功<span style='color:#30b08f'> "+ (data.result.marry_success_num ? data.result.marry_success_num : 0) +" </span>条" +
              "（其中重复信息<span style='color:#30b08f'> "+ (data.result.repeat_marry_num ? data.result.repeat_marry_num : 0) +" </span> 条），" +
              "匹配失败<span style='color:#30b08f'> "+ (data.result.marry_fail_num ? data.result.marry_fail_num : 0) + " </span>条，" +
              "上传失败<span style='color:#30b08f'> "+ (data.result.fail_num ? data.result.fail_num : 0) +" </span>条。" ;
            if (data.result.errfile_url) {
              str += '<a target="_blank" href="' + data.result.errfile_url + '">下载报表</a>'
            }
          }

          if(data.errorNum==0){
            $(".ajax_info").css("color","#30b08f");
          }else {
            $(".ajax_info").css("color","red");
          }
          $(".ajax_info").html(str)

        } else {
          $(".ajax_info").html("");
          layer.alert(data.result.msg);
        }
      },
      error: function (req, status) {
        if (status === 'timeout') {
          layer.confirm('处理超时');
        }
      }
    });

  };

  //设置回收站
  $('#recycle_opt').live('click', function (index) {
    var now_recycle = $('input[name="is_recycle"]:checked').val();
    var content = '当导入的商品在回收站中有相似（或相同）的商品存在，<label style="color: #FF0000">回收站相似（或相同）</label>的商品如何处理？<div>';
    if (now_recycle == 1) {
      content = content + '<input name="recycle" type="radio" value="1" checked>还原并保留<input  name="recycle" type="radio" value="0" style="margin-left: 80px;">保留回收站</div>';
    } else {
      content = content + '<input name="recycle" type="radio" value="1">还原并保留<input  name="recycle" type="radio" value="0" style="margin-left: 80px;" checked>保留回收站</div>';
    }
    layer.confirm(content,
      {title: '设置【回收站】商品', icon: 3, btn: ['保存', '取消']},
      function (index) {
        var val = $('input[name="recycle"]:checked').val();
        if(val == 1){
          var msg = '还原并保留';
          $('input[name="is_recycle"]').val(1);
        }else{
          var msg = '保留回收站';
          $('input[name="is_recycle"]').val(2);
        }

        $('#now_checked').html('('+msg+')')
        layer.close(index);
      }
    )
  })

  // 标签页的切换
  $(document).on('show', '#add-goods-nav', function (eve) {
    var $file = $('#input_file');
    $file.after($file.clone().val(''));
    $file.remove();
    var e = $.Event('change', {target: $('#input_file').get(0)});
    $(document).trigger(e);
    $('.ajax_info').empty();
  });
});
