/**
 * Created by xiapeng on 2017/4/8.
 */

/**
 * 添加医生
 */

$(function () {
  $('.user_check_store').on('click', function () {
    getStoreList();
  });

  document.getElementById('uploadify').addEventListener('change', function (evt) {
    upload(evt, this);
  }, false);

  getList();
  getSelect();
});

function getStoreList() {
  var url = '/common/storesby';
  var store_name = $("input[name='store_name']").val();
  var store_id = $("input[name='store_id']").val();
  var datas = {};
  datas.store_name = store_name;
  datas.stores_number = store_id;
  datas.storesStatus = 1;

  $(".stores_list").empty();
  $.post(url, datas, function (res) {
    if (res.storelist.length > 0) {
      var data = res.storelist;
    }
    var tmpl = document.getElementById('store_list_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".stores_list").html(doTtmpl(data));
    $(".stores_total").html(data ? data.length : 0);
    var selects = $('.select_stores_list').find('tr').length;
    $('.select_stores_total').html(selects);
  });

  $(document).on("click", '.select_stores_btn', function () {
    var data = {};
    data.id = $(this).siblings('[name="id"]').val();
    data.name = $(this).siblings('[name="name"]').val();
    data.service_support = $(this).siblings('[name="service_support"]').val();
    data.stores_number = $(this).parents("tr").find('[name="stores_number"]').val();

    if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {

      var tmpl = document.getElementById('select_store_list_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $(".select_stores_list").append(doTtmpl(data));
      $(".select_stores_total").html($(".select_stores_list tr").length);
    } else {
      layer.alert("该门店已被选择！");
    }
  });

  /**
   * 门店移除
   */
  $(document).on("click", '.unselect_stores_btn', function () {
    $(this).parents(".can_del_tr").remove();
    $(".select_stores_total").html($(".select_stores_list tr").length);
  });

  // 弹框确定后の操作
  $(document).on('click', '.select-house-ok', function () {
    var stores_id = "";
    var stores_name = '';
    $(".select_stores_list input[name='id']").each(function () {
      stores_id += $(this).val() + ",";
      stores_name += $(this).siblings('[name="name"]').val() + ',';

    });

    stores_id = stores_id.substr(0, stores_id.length - 1);

    if (stores_name != '') {
      $('#check_store_msg').show();
      $('#check_store').html(stores_name.substr(0, stores_name.length - 1));
    } else {
      $('#check_store_msg').hide();
      $('#check_store').html('');
    }
    $("#xuanzhe_num").html($(".select_stores_list tr").length);
    $('[name="apply_store_val"]').val(stores_id);
    $("#select_stores").modal("hide");
  });

}

/**
 * 批量添加全选
 */
$(".select_all_stores_btn").live("click", function () {
  var curStatus = $(this).attr("checked") ? true : false;

  $(".stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_select_stores_btn").live("click", function () {
  $(".stores_list input[type='checkbox']:checked").each(function () {
    var data = {};
    data.stores_number = $(this).parents("tr").find('[name="stores_number"]').val();
    data.id = $(this).parents("tr").find('[name="id"]').val();
    data.name = $(this).parents("tr").find('[name="name"]').val();
    data.service_support = $(this).parents("tr").find('[name="service_support"]').val();

    if (!$('.select_stores_list [name="id"][value="' + data.id + '"]').val()) {
      var tmpl = document.getElementById('select_store_list_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);

      $(".select_stores_list").append(doTtmpl(data));
    }
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
});
/**
 * 批量移除全选
 */
$(".unselect_all_stores_btn").live("click", function () {

  var curStatus = $(this).attr("checked") ? true : false;

  $(".select_stores_list input[type='checkbox']").each(function () {
    $(this).attr("checked", curStatus);
    curStatus ? $(this).parent().addClass("checked") : $(this).parent().removeClass("checked");
  });
});

$(".putaway_unselect_stores_btn").live("click", function () {
  $(".select_stores_list input[type='checkbox']:checked").each(function () {
    $(this).parents(".can_del_tr").remove();
  });
  $(".select_stores_total").html($(".select_stores_list tr").length);
  $(".unselect_all_stores_btn").prop("checked",false);
});
//全选按钮下元素被全部选中后，全选按钮也一起被选中
$(document).on('change', '.select_stores_list input[type=checkbox]', function () {
  var $fieldCheckbox =$(".select_stores_list input[type='checkbox']");
  if ($fieldCheckbox.length == $fieldCheckbox.filter(':checked').length) {
    $(".unselect_all_stores_btn").prop('checked', true);
  } else {
    $(".unselect_all_stores_btn").prop('checked', false);
  }
});
//全选按钮下元素被全部选中后，全选按钮也一起被选中
$(document).on('change', '.stores_list input[type=checkbox]', function () {
  var $fieldCheckbox =$(".stores_list input[type='checkbox']");
  if ($fieldCheckbox.length == $fieldCheckbox.filter(':checked').length) {
    $(".select_all_stores_btn").prop('checked', true);
  } else {
    $(".select_all_stores_btn").prop('checked', false);
  }
});



function upload(evt,source) {
  var files = evt.target.files;

  for (var i = 0, f; f = files[i]; i++) {
    if (!f.type.match('image.*')) {
      continue;
    }

    var formData = new FormData();

    formData.append("ad_img_file", f);
    formData.append("min_size_width", 300);
    formData.append("min_size_height", 300);
    formData.append("width_equal_height", 1);

    $.ajax({
      url: '/merchant/image/upload',
      type: 'POST',
      success: function (data) {
        if (data.status === true) {
          var img_url = data.result.imgsrc;
          $(source).prev().find("img").attr("src", img_url);
          $('[name="share_icon"]').val(img_url);
        }
      },
      error: function (data) {
      },
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    });
  }
}

function getList() {

  $.ajax({
    url:'/merchant/categories',
    type:'POST',
    success: function (data) {
      if (data.status === 'success') {
        var obj = data.result.children[8].children;
        var optionstring = "";
        for (var i = 0;i<obj.length;i++) {
          optionstring += "<option value=\"" + obj[i].cateId + "\" >" + obj[i].cateName + "</option>";
        }
        $("#selectttt").html(optionstring);
      }
    },
    error: function (data) {
    },
  });
}

function getSelect() {
  if ((window.location.search).substring(25,28) == 100){
    $.ajax({
      url:'/merchant/selectDoctor',
      type:'POST',
      data:{
        'goodsId':(window.location.search).substring(9,14)
      },
      dataType:"json",
      success: function (data) {
        if (data.code === '000') {
          $("#doctorName").attr("value",data.value[0].doctorName);
          $("#doctorPhone").attr("value",data.value[0].doctorPhone);
          $("#describe").attr("value",data.value[0].describe);
          $("#honour").attr("value",data.value[0].honour);
          $("#introduce").attr("value",data.value[0].introduce);
          $("#remark").attr("value",data.value[0].remark);
          $("#goodsTitle").attr("value",data.value[0].goodsTitle);
          $("#goodRemark").attr("value",data.value[0].goodRemark);
          $("#doctorId").attr("value",data.value[0].id);
          $("#marketPrice").attr("value",data.value[0].marketPrice);
          $("#goods_property").attr("value",data.value[0].doctorPosition);
          $("#status").attr("value",data.value[0].status);
          $("#sex").attr("value",data.value[0].sex);
          // $("#doctorc").val(data.value[0].doctorPosition);
          $("#sex").find('input').each(function(){
            if(data.value[0].sex == $(this).val()){
              $(this).parent('label').attr('class','radio-pretty inline checked');
            }else{
              $(this).parent('label').attr('class','radio-pretty inline');
            }
          });
          $("#status").find('input').each(function () {
            if(data.value[0].status==$(this).val()){
              $(this).parent('label').attr('class','radio-pretty inline checked');
            }else{
              $(this).parent('label').attr('class','radio-pretty inline');
            }
          });
          $("#doctorPosition").find('option').each(function(){
            if(data.value[0].sex == $(this).val()){
              $(this).parent('label').attr('class','radio-pretty inline checked');
            }else{
              $(this).parent('label').attr('class','radio-pretty inline');
            }
          });
          $("#goodsStatus").find('input').each(function(){
            if(data.value[0].goodsStatus == $(this).val()){
              $(this).parent('div').attr('class','controls checked');
            }else{
              $(this).parent('div').attr('class','controls');
            }
          });
          // $("#doctorPosition").attr("value",data.value[0].doctorPosition);
          $(".selector").find("option[text='data.value[0].doctorPosition']").attr("selected",true);


        }
      },
    });
  }
}



function updateDoctor() {
  var datas = {};
  datas.doctorName = $("#doctorName").val();
  datas.doctorPhone = $("#doctorPhone").val();
  datas.sex = $("input[name='member_sex']:checked").val();
  datas.doctorPosition = $("#goods_property").find("option:selected").val();
  datas.describe = document.getElementById('describe').value;
  datas.honour = document.getElementById('honour').value;
  datas.introduce = document.getElementById('introduce').value;
  datas.status = $("input[name='status']:checked").val();
  datas.remark = document.getElementById('remark').value;
  datas.goodsTitle = $("#goodsTitle").val();
  datas.scheduleTime = $("input[name='scheduleTime']:checked").val();
  datas.servceNum = $("input[name='servceNum']:checked").val();
  datas.goodRemark = document.getElementById('goodRemark').value;
  datas.goodsStatus = $("input[name='goodsStatus']:checked").val();
  datas.doctorImg = $("input[name='share_icon']").val();
  datas.stores = $("#mendianxinxi").val();
  datas.doctorc = $("#doctorc").find("option:selected").val();
  datas.id = $("#doctorId").val();
  alert(datas.doctorPosition);
  if (trim(datas.doctorName) == "" || datas.doctorName == null) {
    return layer.msg("医生姓名不能为空");
  }
  var verify_phone = new RegExp(/^1[34578]{1}[0-9]{9}$/);
  if (!verify_phone.test(trim(datas.doctorPhone))) {
    return layer.msg("手机号格式不正确");
  }
  if (trim(datas.describe) == "" || datas.describe == null) {
    return layer.msg("擅长描叙不能为空");
  }
  if (trim(datas.introduce) == "" || datas.introduce == null) {
    return layer.msg( "医生介绍不能为空");
  }
  if (trim(datas.goodsTitle) == "" || datas.goodsTitle == null) {
    return layer.msg("商品名称不能为空");
  }
  if (trim(datas.scheduleTime) == "" || datas.scheduleTime == null) {
    return layer.msg("请选择有效期");
  }
 
  if (trim(datas.servceNum) == "" || datas.servceNum == null) {
    return layer.msg("请选择服务次数");
  }
  // var verify_fee = new RegExp(/^\d+$/);
  // if ($("input[name='marketPrice']:checked").val() == 2) {
  //   if (!verify_fee.test(trim(datas.marketPrice)) || datas.marketPrice <= 0) {
  //     return layer.msg("价格输入错误");
  //   }
  // }

  if (trim(datas.goodsStatus) == "" || datas.goodsStatus == null) {
    return layer.msg("请选择商品状态");
  }
  if (datas.doctorc == '名医预约') {
    datas.userCateid = $("#selectttt").find("option:selected").val();
  } else if (datas.doctorc == '专家') {
  } else if (datas.doctorc == '神医')
    alert(datas.userCateid);
  if ($("input[name='marketPrice']:checked").val() == 1) {
    datas.marketPrice = 0;
  } else if ($("input[name='marketPrice']:checked").val() == 2) {
    datas.marketPrice = $('input[name=money]').val();
  }
  $.ajax({
    type:'post',
    url:'/merchant/updateDoctor',
    data:datas,
    dataType: 'json',

    success: function(data){
      if(data.code == "000"){
        layer.msg( "更新成功", function() {
          // window.reload();
          window.location.href = "/merchant/productList";
        });
      }
    },

    error:function(){
      console.log("error .....");
    }
  });
}
