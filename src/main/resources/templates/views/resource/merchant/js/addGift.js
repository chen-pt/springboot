var imageData={} ;

var defualtStoreIds = '';
$(document).ready(function () {
  getstore()
  $(".select_stores_total").text($(".select_stores_list input[name='name']").length)
  var total_lenth = {};
  //富文本编辑器上传图片事件
  $('#input_file_F').live('change', function uploadImg(evt) {
    var param = {};
    cur_lenth = $('input[name="pic_num"]').val();
    var files = evt.target.files;
    $('input[name="pic_num"]').val(parseInt(cur_lenth) + 1);
    var formData = new FormData();
    formData.append("file", files[0]);
    $.ajax({
      url: '/common/localpictureUpload',
      type: 'POST',
      data: formData,
      success: function (data) {
        var tips = '<img src="http://jkosshash.oss-cn-shanghai.aliyuncs.com//'+data.image.md5Key+'.jpg">'
        console.log(editor2.html());
        editor2.html(editor2.html()+tips);

      },
      error: function (data) {
      },
      cache: false,
      contentType: false,
      processData: false
    });
  });

//商品图片添加上传事件图片事件
  $('#input_file').live('change', function uploadImg(evt) {
    var param = {};
    cur_lenth = $('input[name="pic_num"]').val();
    var files = evt.target.files;
    if ($(".pic-parent-div").length>6) {
      layer.alert("添加失败，一个商品最多只能添加 6 张图片哦！");
      return;
    }
    $('input[name="pic_num"]').val(parseInt(cur_lenth) + 1);
    var formData = new FormData();
    formData.append("file", files[0]);
    $.ajax({
      url: '/common/localpictureUpload',
      type: 'POST',
      data: formData,
      success: function (data) {
        console.log(data);
        imageData.size = data.image.size;
        imageData.hashs = data.image.md5Key;
        var temp =''
        if($(".pic-parent-div").length<=1){
          temp='<div class="main-pic" id ="mainPic">主图</div>'
        }
        var tips = '<div class="pic-parent-div">'+
          '<div class="del-pic" id ="del">删除</div>'+
          temp+
          '<img layer-src="'+data.image.md5Key+'"'+
          'src="http://jkosshash.oss-cn-shanghai.aliyuncs.com/'+data.image.md5Key+'.jpg?x-oss-process=image/resize,m_lfit,h_100,w_100/watermark,image_eWJ6ZjIucG5n,t_2,g_se,x_10,y_10"'+
          'class="product_img" alt=""><input type="hidden" name="pic_id" value="'+data.image.md5Key+'"><input type="hidden" name="Picsize" value="'+data.image.size+'">'+
          ' </div>'
        if($(".pic-parent-div").length<=1) {
          $("#pic_div").prepend(tips);
        }else {
          $("#mainPic").parent().parent().find('div:last-child').before(tips);
        }
      },
      error: function (data) {
      },
      cache: false,
      contentType: false,
      processData: false
    });
  });

  //删除商品图片事件
  $(".del-pic").live("click", function () {
    var pic_id = $(this).parent().find("input[name='upload_img']").val();
    if (confirm("您确定删除图片吗？")) {
      $(this).parent().find("img").remove();
      $("#upload_img").val("");
      if(($(this).parent().index()==0)) {
        $(this).parent().next().find("#del").before('<div class="main-pic" id ="mainPic">主图</div>');
      }
      $(this).addClass("hide");
      $(this).parent().remove();
    }
  });



  //门店选择弹框选择确定事件
  $(".select-store-ok").click(function () {
    var stores_id = "";
    $(".select_stores_list input[name='id']").each(function () {
      stores_id += $(this).val() + ",";
    });
    stores_id = stores_id.substr(0, stores_id.length - 1);
    if (stores_id) {

      var storeIdsDiv = $("#integral_goods_store_ids");

      if(storeIdsDiv){
        storeIdsDiv.remove();
      }

      $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ stores_id +'">');

      // $('#integral_goods_store_ids').val(stores_id);

      var storeNamesDiv = $('.mer-box');
      storeNamesDiv.html('');
      $(".select_stores_list input[name='name']").each(function () {
        storeNamesDiv.append('<div class="box-item" title="'+ $(this).val() +'">'+ $(this).val() +'</div>')
      });

      $('#closeSelectModel').click();
    } else {
      layer.msg('请选择至少一个门店！');
    }
  });
});

//编辑保存事件
function saveGift() {
  var parms = {}
  parms.goods_title = $("#goods_title").val();
  if(parms.goods_title==null||parms.goods_title==''){
    alert("商品标题不能为空")
    return false;
  }


  parms.goods_code = $("#goods_number").val();
  if(parms.goods_code==null||parms.goods_code==''){
    alert("商品编码不能为空")
    return false;
  }
  if($("#goods_code_err").html()=="商品编码已存在，请重新输入"){
    alert("重复的商品编码！")
    return false
  }
  parms.specif_cation = $("#gift_sp").val();
  if(parms.specif_cation==null||parms.specif_cation==''){
    alert("商品规格不能为空")
    return false;
  }
  parms.goods_weight = $("#goods_weight").val();
  if(parms.goods_weight==null||parms.goods_weight==''){
    alert("商品重量不能为空")
    return false;
  }
  parms.integral_goods_is_del=$("[name=integral_goods_is_del]:checked").val();
  if(parms.integral_goods_is_del==1) {
    parms.integral_exchanges = $("[name=integral_exchanges]").val()
    if (parms.integral_exchanges == null || parms.integral_exchanges == '') {
      alert("兑换积分价格不能为空！")
      return false;
    };

    parms.integral_goods_start_time = $("[name=integral_goods_start_time]").val();
    if (parms.integral_goods_start_time == null || parms.integral_goods_start_time == '') {
      alert("起始时间不能为空")
      return false;
    }
    parms.limit_each = $("[name=limit_each_radio]").is(":checked")?0:$("[name=limit_each]").val();
    parms.integral_goods_end_time = $("[name=integral_goods_end_time]").val();
    parms.integral_goods_store_ids = $("#integral_goods_store_ids").val()==''?allStoreIds:$("#integral_goods_store_ids").val()
  }
  if(parms.integral_goods_end_time!=null&&parms.integral_goods_end_time!='') {
    if (parms.integral_goods_end_time <= parms.integral_goods_start_time) {
      alert("请设置正确的时间!")
      return;
    }
  }
  parms.approval_number = '--';
  parms.detail_tpl = 150;
  parms.drug_name = $("#drug_name").val();
  if(parms.drug_name==null||parms.drug_name==''){
    alert("商品名不能为空")
    return false;
  }
  parms.market_price=$("#real_price").val()*10*10;
  parms.shop_price=0;
  parms.size =imageData.size;
  parms.img_hash = '';
  $(".pic-parent-div [name = pic_id]").each(function (e,v) {
    console.log(v.value);
    parms.img_hash += v.value+",";
  })
  if(parms.img_hash==","){
    alert("请设置图片！");
    return false
  }

  //parms.img_hash  =imageData.hashs;
  var edhtml = editor2.html();
  parms.goods_desc = edhtml;
  if(parms.goods_desc==null||parms.goods_desc == ''){
    alert("商品描述不能为空！")
    return false;
  }
  if($("[name='prototal_input']").attr("checked")!='checked'){
    alert("请勾选51健康商户后台使用协议")
    return false;
  }

  $.ajax({
    url: '/merchant/productCreate',
    type: 'POST',
    data: parms,
    success: function (data) {
      if (data.status = true) {
        layer.msg("添加成功！");
        window.location.href='/merchant/productList';
      }
    },
    error: function (data) {
      layer.msg("添加失败！");
    },

  });
}

//全部门店事件
function extractStoreAll(){
    $("#extract_store_div").hide();
    $("#extract_store_num_div").hide();
    $("#extract_store_num_div a").text(alllist.length);
    $('#integral_goods_store_ids').remove();
    $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ allStoreIds +'">');
}

//指定门店事件
function noExtractStoreAll(){
    $("#extract_store_div").show();
    $("#extract_store_num_div").show();
    $("#extract_store_num_div a").text(0);
    $('#integral_goods_store_ids').remove();
    $(".select_stores_total").text(0);

}

//选择积分兑换事件
function chooseYesOfIntegralExchange() {
  $("#extract_store_div").hide();
  $("#extract_store_all").attr("checked",true);
}

// 是否限购事件
function exchangeNoLimit() {
  $("[name=limit_each]").val("");
}


function changeInput() {
  if($("[name=limit_each]").val()!=null||$("[name=limit_each]").val()!=''){
    $("[name=limit_each_radio]").attr("checked",false);
  }
}

function getstore() {
  var name = $("[name=store_name]").val();
  var storenumber = $("[name=store_number]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/storeList",
      data: {
        "store_name": name,
        "storeNumber": storenumber
      },
      dataType: "JSON",
      success: function (data) {
        $(".stores_list").empty();
        var stores_id = "";
        for(i in data.storeList){
          stores_id += data.storeList[i].id + ',';
        }
        defualtStoreIds = stores_id;
      }
    }
  )
}

 function currencyFormat(value) {
  return value?(parseFloat(value) / 100).toFixed(2):"";
}

function  goodsNumCheck(target) {
  var goodsCode = $(target).val()
  console.log(goodsCode);
  if(goodsCode==""){
    return
  }
  $.ajax({
    type:"post",
    url:"./queryByGoodsCode?goods_code="+ goodsCode,
    async: false,
    success:function (data) {
      if(data.status==="OK"){
        $("#goods_code_err").hide();
        $("#goods_code_err").html("商品编码验证通过")
      }else if(data.status==="ERROR"){
        layer.msg(data.errorMessage);
      }else{
        $("#goods_code_err").html("商品编码已存在，请重新输入");
        $("#goods_code_err").show();
      }
    }
  });
}







