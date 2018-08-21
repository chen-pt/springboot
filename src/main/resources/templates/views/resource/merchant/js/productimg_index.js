$(function(){
  var imgURL = $("input[name='imgUrl']").val();
  var siteId = $("input[name='siteId']").val();
  var total_lenth=6;
  var imgList;
  loadGoodsImg();
  //加载商品图片
  function  loadGoodsImg(){
    imgList = new Array();
    var param={};
    param.goodsId = $("input[name='goods_id']").val();
    $.ajax({
      url: "/merchant/bgoodsOne",
      type: 'post',
      data: param,
      dataType: 'json',
      success:function (data) {
        var approval_number = data.goods.approvalNumber;
        var pic_divHtml ="";
        var goodsImgs = data.goodsImg;
        $('input[name="pic_num"]').val(goodsImgs.length);
        var mainImg = "";
        var otherImg = "";
        pic_divHtml+="<p>当前规格："+data.goods.specifCation+"</p>"
        for (var i in goodsImgs){
          if(goodsImgs[i].is_default==1){
            mainImg+='<div class="pic-parent-div"><div class="main-pic">主图</div><div class="del-pic lee_hide">删除</div>';
            mainImg+='<img layer-src="'+goodsImgs[i].hash+'" src="'+imgLink (goodsImgs[i].hash, 100, 100, ".jpg")+'" class="product_img" alt="" /><input type="hidden" name="pic_id" value="'+goodsImgs[i].hash+'"></div>';
          }else{
            otherImg+='<div class="pic-parent-div"><div class="set-main-pic lee_hide hide">设为主图</div><div class="del-pic lee_hide hide">删除</div>';
            otherImg+='<img layer-src="'+goodsImgs[i].hash+'" src="'+imgLink (goodsImgs[i].hash, 100, 100, ".jpg")+'" class="product_img" alt="" /><input type="hidden" name="pic_id" value="'+goodsImgs[i].hash+'"></div>';
          }
          imgList[i] = goodsImgs[i].hash;
        }
        pic_divHtml= pic_divHtml + mainImg +otherImg;
        pic_divHtml+='<div class="pull-left"><i class="sui-icon icon-touch-plus" onclick="$(\'#input_file\').click();" style="margin-right: 10px"></i>' +
          '<input type="file" id="input_file" style="display: none;" accept=".png,.gif,.bmp,.gpeg,.jpg" /></div>';

        $("#pic_div").html(pic_divHtml);

        findOhterImg (approval_number);
      }
    });
  }



  // 读取商品信息
  function findOhterImg (approval_number) {
    if (!(approval_number && approval_number.trim())) {
      return;
    }
    $.ajax({
      url: "product/find51jk",
      type: 'post',
      data: {
        approval_number: approval_number,
        page: 1,
        pageSize: 1000,
        hasExtdFields: 1,   //查询扩展表
      },
      success:function (data) {
        var rsp = JSON.parse(data);
        if(rsp && rsp.status && rsp.result.items.length){
          getImgItm(rsp.result.items);
        }
      }
    });
  }

  function getImgItm(items){
    $("#pic_div_tmp").html('<h4 style="margin-bottom: 0;">您可以根据需要选择以下图片：</h4>');
    for(var i=0;i<items.length;i++){
      var param={};
      console.log(items[i].goods_id);
      param.goodId = items[i].goods_id;
      param.specif_cation = items[i].specif_cation;
      $.ajax({
        url: "/merchant/goods/findImgView",
        type: 'post',
        data: param,
        async : false,
        dataType: 'json',
        success:function (data) {
          var imgInfo = "";
          if(data.results.imgs!=null && data.results.imgs.length>0){
            imgInfo = '<div id="amoxilin" class="clearfix"><p>规格：'+data.specifCation+'</p>';
          }
          var goodsImgs = data.results.imgs;

          for (var i in goodsImgs){
            imgInfo+= '<div class="pic-parent-div"><img layer-src="'+goodsImgs[i].hash+'" src="'+imgLink (goodsImgs[i].hash, 100, 100, ".jpg")+'" class="product_img" alt="" />';
            var flag = false;
            for (var j in imgList){
              if(imgList[j]==goodsImgs[i].hash){
                flag = true;
              }
            }
            if(flag){
              imgInfo+= '<div class="hasset-ybzf-pic">已使用</div></div>';
            }else{
              imgInfo+= '<div class="set-ybzf-pic hide" data-hash="'+goodsImgs[i].hash+'" data-width="600" data-height="500" data-size="'+goodsImgs[i].size+'" >我要使用</div></div>';
            }
          };
          imgInfo+="</div>";
          $("#pic_div_tmp").append(imgInfo);
        }
      });
    }
    if($("#pic_div_tmp .pic-parent-div").length==0){
      $("#pic_div_tmp").html("");
    }
  }

  $(".set-ybzf-pic").live("click",function () {
    var img = $(this);
    cur_lenth=$('input[name="pic_num"]').val();
    var param={};
    param.hash=img.data("hash");
    param.width= img.data("width");
    param.height= img.data("height");
    param.size =img.data("size");
    param.goodsId = $('input[name="goods_id"]').val();
    if(cur_lenth==0){   //第一张图片默认主图
      param.isDefault  = 1;
    }else{
      param.isDefault  = 0;
    }
    addImgAttr(param);
  });


  $(".pic-parent-div").live('mouseover',function(){
    $(this).find(".lee_hide").removeClass('lee_hide');
  }).live("mouseout",function(){
    $(this).find(".del-pic").addClass('lee_hide');
    $(this).find(".set-main-pic").addClass('lee_hide');
  });

  //显示设置主图和删除按钮。
  $("#form .pic-parent-div").live("mouseover",function(){
    $(this).find(".set-main-pic").removeClass("hide");
    $(this).find(".del-pic").removeClass("hide");
    $(this).find(".set-ybzf-pic").removeClass("hide");
  }).live("mouseout",function(){
    $(this).find(".set-main-pic").addClass("hide");
    $(this).find(".del-pic").addClass("hide");
    $(this).find(".set-ybzf-pic").addClass("hide");
  });



  //选择图片上传到服务器
  $('#input_file').live('change',function uploadImg(evt){
    var param={};
    cur_lenth=$('input[name="pic_num"]').val();
    var files = evt.target.files;
    if(total_lenth==cur_lenth){
      layer.alert("添加失败，一个商品最多只能添加 6 张图片哦！");
      return;
    }
    $('input[name="pic_num"]').val(parseInt(cur_lenth)+1);
    var goods_id=$('input[name="goods_id"]').val();
    var formData = new FormData();
    formData.append("goods_id", goods_id);
    formData.append("file",  files[0]);
    $.ajax({
      url: '/common/localpictureUpload',
      type: 'POST',
      data: formData,
      success: function(data){
        if(data.status == 1){
          var img = data.image;
          param.hash=img.md5Key;
          param.width= img.width;
          param.height= img.height;
          param.size =img.size;
          param.goodsId = goods_id;
          if(cur_lenth==0){   //第一张图片默认主图
            param.isDefault  = 1;
          }else{
            param.isDefault  = 0;
          }
          addImgAttr(param);
        }else{
          layer.alert("图片上传失败！")
        }
      },
      error: function(data){
      },
      cache: false,
      contentType: false,
      processData: false
    });

  });

  //添加商品图片信息
  function addImgAttr(param){
    $.ajax({
      url: '/merchant/addGoodsImg',
      data:param,
      type: 'POST',
      success: function(data){
        if(data.status == "success"){
          loadGoodsImg();
        }else{
          layer.alert(data.result.msg)
        }
      }
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
    layer.confirm("您确定删除图片吗？",function () {
      $.post(url,datas,function(data){
        if(data.status == "success"){
          layer.alert("图片删除成功！");
          loadGoodsImg();
        } else {
          layer.alert((data.result || {}).message || "图片删除失败！");
        }
      });
    })
  };

  //删除商品图片事件
  $(".del-pic").live("click",function()
  {
    var goods_id = $("input[name='goods_id']").val();
    var img_id = $(this).parent().find("input[name='pic_id']").val();
    if($(this).parent().find(".main-pic").html()=="主图") {
      var nextImg = $(this).parent().next(".pic-parent-div");
      if(nextImg.length>0){
        var nextImgId = nextImg.find("input[name='pic_id']").val();
      }
    }

    delGoodsImg(goods_id,img_id, nextImgId);   //删除图片
  });

  //设置商品主图
  function setGoodsMainImg(goods_id,img_id){
    var url = "/merchant/setDefaultImg";
    var datas={};
    datas.goodsId = goods_id;
    datas.imgHash = img_id;
    $.post(url,datas,function(data){
      if(data.status == "success"){
        layer.alert("设置主图成功！");
        loadGoodsImg();
      }else{
        layer.alert("设置主图失败！");
      }
    });
  }

  function setGoodsMainImgNoAlert(goods_id,img_id){
    var url = "/merchant/setDefaultImg";
    var datas={};
    datas.goodsId = goods_id;
    datas.imgHash = img_id;
    $.post(url,datas,null);
  }

  //设置商品主图事件
  $(".set-main-pic").live("click",function()
  {
    var goods_id = $("input[name='goods_id']").val();
    var img_id = $(this).parent().find("input[name='pic_id']").val();
    setGoodsMainImg(goods_id,img_id);
  });

  // 查看大图
  $(document).on('click', '.product_img', function() {
    layer.open({
      type: 1,
      title: false,
      closeBtn: true,
      area: ['399px', '399px'],
      content: "<img src='"+imgLink ($(this).attr("layer-src"), 600, 400, ".jpg")+"' />"
    });

  });
});
