/**
 * Created by Administrator on 2017/8/11.
 */
var curEdit;
var editor2; //富文本编辑器对象
var alllist = [];//所有门店数组
var len = 0;//平台门店总数量
var searchlist = [];//查询得到的门店列表
var selectList=''; //选择的门店Id
var allStoreIds = ''; //所有的门店Id

function oldStoresShow(storelist, promissionids) {
  var tr1 = "";//参加自主定价的门店列表
  var tr2 = "";//不参加自主定价的门店列表
  var tmpl = document.getElementById('select_store_list_templete').innerHTML;
  var doTtmpl = doT.template(tmpl);
  for (var i = 0; i < len; i++) {
    var ds = {};//拥有权限的数组
    var dd = {};//禁止权限的数组
    if (promissionids.length > 0) {
      if (promissionids.indexOf(storelist[i].id) > -1) {//拥有权限的id
        ds.id = storelist[i].id;
        ds.name = storelist[i].name;
        ds.service_support = storelist[i].serviceSupport;
        ds.stores_number = storelist[i].storesNumber;
        tr1 += doTtmpl(ds);
      }
    }
  }
  $(".select_stores_list").empty();
  $(".select_stores_list").append(tr1);

}

function searchs() {
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
        searchlist = data.storeList;
      }
    }
  )
}
function showlist(storelist) {
  $(".stores_total").html(len);
  $(".stores_list").empty();
  var tr = '';
  if (storelist.length > 0) {
    for (var i = 0; i < storelist.length; i++) {
      var str = "";
      if (storelist[i].serviceSupport.indexOf("160") > -1) {
        str = "门店自提";
        tr += "<tr><td width='3%'></td><td style='width:24%'><label data-toggle='checkbox' class='checkbox-pretty inline'>" +
          "<input name='gid' type='checkbox'><span>" + storelist[i].storesNumber + "</span></label></td><td style='width:33%'><span>" + storelist[i].name + "</span></td>" +
          "<td style='width:30%'>" + str + "</td><td><input name='stores_number' value='" + storelist[i].storesNumber + "' type='hidden'>" +
          "<input name='id' value='" + storelist[i].id + "' type='hidden'><input name='name' value='" + storelist[i].name + "' type='hidden'>" +
          "<input name='service_support' value='" + storelist[i].serviceSupport + "' type='hidden'><a href='javascript:void(0)' class='select_stores_btn'>指定</a>" +
          "</td></tr>";
      }
    }

    if(!tr || tr == '' ){
      tr = "该商户未查询到合适的自提门店"
    }

  } else {
    tr = "该商户未查询到门店信息";
  }
  $(".stores_list").append(tr);
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
        len = data.storeList.length;
        alllist = data.storeList;
        var stores_id = "";
        for(i in alllist){
          stores_id += alllist[i].id + ',';
        }
        stores_id = stores_id.substr(0, stores_id.length - 1);
        if (stores_id) allStoreIds = stores_id;
        showlist(alllist);
        oldStoresShow(alllist, toarray($("#integral_goods_store_ids").val()));
      }
    }
  )
}
window.onload = function () {
  /**
   * 弹框确定后的操作
   */
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
      var storeNamesDiv = $('.mer-box');
      storeNamesDiv.html('');
      $(".select_stores_list input[name='name']").each(function () {
        storeNamesDiv.append('<div class="box-item" title="'+ $(this).val() +'">'+ $(this).val() +'</div>')
      });
      $('#closeSelectModel2').click();
      $("#extract_store_num_div a").text(stores_id.split(",").length);
      selectList = stores_id;
    } else {
      layer.msg('请选择至少一个门店！');
    }
  });

  //富文本点击上传事件
  $('#input_file_C').live('change', function uploadImg(evt) {
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
  //页面加载完成查询商品图片请求
  getstore();
  var search = getQueryString("goodsId");
  var parms = {}
  parms.goodsId = search;
  $.ajax({
    url: '/merchant/bgoodsOne',
    type: 'POST',
    data: parms,
    async: false,
    success: function (data) {
      console.log(data);
      //页面基本数据回显
      selectList = data.goods.integralGoodsStoreIds;
      $("#drug_name").val(data.goods.drugName);
      $("#goods_title").val(data.goods.goodsTitle);
      $("#goods_weight").val(data.goods.goodsWeight);
      $("#goods_number").val(data.goods.goodsCode);
      $("#real_price").val(currencyFormat(data.goods.marketPrice));
      $("#gift_sp").val(data.goods.specifCation);
      $("#points_price").val(data.goods.integralExchanges);
      $("#exchangeStartTime").val(data.goods.integralGoodsStartTime)
      $("#exchangeEndTime").val(data.goods.integralGoodsEndTime);
      $("#exchange_num").val(data.goods.limitCount);
      if(data.goods.limitEach!=0) {
        $("#exchangeLimit").val(data.goods.limitEach);
      }else {
        $("#noLimit").attr("checked",true);
      }
      if(data.goods.integralGoodsLimitEach==0||data.goods.integralGoodsLimitEach==null){
        $("[name=limit_each_radio]").attr("checked",true);
      }else {
        $("#limit_each").val(data.goods.integralGoodsLimitEach);
      }
      //判断是否参加积分商城
      if(data.goods.integralGoodsIsDel!=0){
        $("#integral_goods_store_ids").val(data.goods.integralGoodsStoreIds)
        $("[name=integral_goods_is_del]").attr("checked",true)
        $('#integral_goods_div').css('display','block')
        $("[name=integral_goods_start_time]").val(data.goods.integralGoodsStartTime);
        $("[name=integral_goods_end_time]").val(data.goods.integralGoodsEndTime);
        $("[name=integral_exchanges]").val(data.goods.integralExchanges)

        //判断用户之前是选取的指定门店还是全部门店
        if(alllist.length>data.goods.integralGoodsStoreIds.split(",").length){
          $("#part_extract_store").attr("checked",true);
          $("#part_extract_store").click()
        }else {
          $("#extract_store_all").attr("checked",true);
          $("#extract_store_all").click();
        }
      }
      if(selectList!='') {
        if(typeof(selectList) != "undefined") {
          $("#extract_store_num_div a").text(selectList.split(",").length);
        }
      }
      //图片判断
      var temp =''
      for (var i = 0; i < data.goodsImg.length; i++) {
        if($(".pic-parent-div").length<=1){
          temp='<div class="main-pic" id ="mainPic">主图</div>'
        }else {
          temp = '';
        }
        var tips  = '<div class="pic-parent-div">' +
          '<div class="del-pic" id="del">删除</div>' +
          temp +
          '<img layer-src="'+data.goodsImg[i].hash+'" ' +
          'src="http://jkosshash.oss-cn-shanghai.aliyuncs.com/'+data.goodsImg[i].hash+'.jpg?x-oss-process=image/resize,m_lfit,h_100,w_100/watermark,image_eWJ6ZjIucG5n,t_2,g_se,x_10,y_10" ' +
          'class="product_img" alt=""><input type="hidden" name="pic_id" value="'+data.goodsImg[i].hash+'"><input type="hidden" name="Picsize" value="'+data.goodsImg[i].size+'">'
        if($(".pic-parent-div").length<=1) {
          $("#pic_div").prepend(tips);
        }else {
          $("#mainPic").parent().parent().find('div:last-child').before(tips);
        }
      }
      var editor2 =productPolyfill();
      editor2.html(data.goods.goodsDesc)
    }
  });

  $("[name=saveChange]").live("click",function () {
    editGift();
  })
  getstore();
  var storeNamesDiv = $('.mer-box');
  storeNamesDiv.html('');
  $(".select_stores_list input[name='name']").each(function () {
    storeNamesDiv.append('<div class="box-item" title="'+ $(this).val() +'">'+ $(this).val() +'</div>')
  });
  $(".select_stores_total").text($(".select_stores_list input[name='name']").length)
  $(".search_stores_btn").click(function () {
    searchs();
    showlist(searchlist);
  });
}

//获取页面上URL上的参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


//编辑保存
function editGift() {
  var parms = {}
  parms.goods_id = getQueryString("goodsId")
  if(parms.goods_id==null||parms.goods_id==''){
    alert("商品Id不能为空")
    return false;
  }
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

  //积分修改
  parms.integral_goods_is_del=$("[name=integral_goods_is_del]:checked").val();
  if(parms.integral_goods_is_del==1) {
    parms.integral_exchanges = $("[name=integral_exchanges]").val()
    if (parms.integral_exchanges == null || parms.integral_exchanges == '') {
      alert("兑换积分价格不能为空！")
      return false;
    }
    ;

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

  parms.pic_size = '';
  $("[name = Picsize]").each(function (e,v) {
    console.log(v.value);
    parms.pic_size += v.value+",";
  })

  if(parms.img_hash==","){
    alert("请设置图片！");
    return false
  }
  var editor = KindEditor.create('textarea[name="content"]');
   console.log(editor);
  var edhtml = editor.html();
  parms.goods_desc = edhtml;
  $.ajax({
    url: '/merchant/productUpdate',
    type: 'POST',
    data: parms,
    success: function (data) {
      if (data.status = true) {
        alert("修改成功！");
        window.location.href='/merchant/productList';
      }
    },
    error: function (data) {
      layer.msg("修改失败！");
    },

  });


}

//删除图片信息
function delGoodsImg(goods_id,img_id, nextImgId)
{

  var url = "/merchant/delGoodsImg";
  var datas={};
  datas.goodsId = goods_id;
  datas.imgHash = img_id;
  datas.nextImgId = nextImgId;
    $.post(url,datas,function(data){
      if(data.status == "success"){
      } else {
      }
    });
};

//富文本初始化
function productPolyfill () {
  KindEditor.lang({
    example1: '插入图片'
  });
  KindEditor.plugin('example1',
    function (K) {
      var self = this,
        name = 'example1';
      self.clickToolbar(name,
        function () {
          $('#upload_C').attr('class','sui-modal show');
          /*}*/
          curEdit = self.items[27];
        });
    });
  editor2 = KindEditor.create('[name=content]', {
    allowFileManager: true,
    items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'content']
  });
  // 富文本编辑器
  function createKindEditor () {
    require(['productedit'], function (edit) {
      edit.setKindEditor(editor1, editor2, editor3)
    });
  }

  return editor2;
}

function extractStoreAll(){
  $("#extract_store_div").hide();
  $("#extract_store_num_div").hide();
  $("#extract_store_num_div a").text(alllist.length);
  $('#integral_goods_store_ids').remove();
  $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ allStoreIds +'">');
}

function noExtractStoreAll(){
  $("#extract_store_div").show();
  $("#extract_store_num_div").show();
  $("#extract_store_num_div a").text(0);
  $('#integral_goods_store_ids').remove();
  $(".select_stores_total").text(0);
  selectList.length = 0
  $('#product_form').prepend('<input type="hidden" id="integral_goods_store_ids" name="integral_goods_store_ids" value="'+ selectList +'">');
  $(".select_stores_list").empty()
  //$("#extract_store_num_div a").text(selectList.split(",").length);
}

//选择积分兑换事件
function chooseYesOfIntegralExchange1() {
  $("#extract_store_div").hide();
  $("#extract_store_all").attr("checked",true);
  $("#extract_store_num_div").hide();
}
function changeSelectNum() {
  $("#extract_store_num_div a").text(selectList.split(",").length);
}

function currencyFormat(value) {
  return value?(parseFloat(value)/100).toFixed(2):"";
}









