/**
 * Created by boren on 15/9/2.
 * 图片编辑
 */
define(['core'],function(core){

  var total_lenth=6;
  var cur_lenth=6;

  var ImgHandleFileSelect = function (evt)
  {

    cur_lenth=$('input[name="pic_num"]').val();

    var files = evt.target.files;

    if(total_lenth==cur_lenth){
        alert("添加失败，一个商品最多只能添加 6 张图片哦！");
        $('#push-pic-num').html($('.del-pic').size());
      return;
    }

    $("#pic_div").append("<div class='pic-parent-div'>"+
    "<img src='"+ core.getHost()+"/source/managers/style/img/shoploading.gif' class='product_img_tmp' alt='' />"+
    "</div>");

    $('input[name="pic_num"]').val(parseInt(cur_lenth)+1);

    if(parseInt(cur_lenth)+1 >= total_lenth)
    {
        $('#push-pic-num').html($('.del-pic').size());
      $("#pic_div").next().hide();
    }

    var goods_id=$('input[name="goods_id"]').val();
    var cur_success_file_num=0;
    var cur_error_file_num=0;

    for (var i = 0, f; f = files[i]; i++)
    {
      if (!f.type.match('image.*'))
      {
        continue;
      }

      var formData = new FormData();

      formData.append("ad_img_file", f);
      formData.append("goods_id", goods_id);
      formData.append("max_img_size",  1024);
      formData.append("max_size_width",  900);
      formData.append("max_size_height",  900);
      formData.append("min_size_width",  700);
      formData.append("min_size_height",  700);
      formData.append("width_equal_height",  1);

      $.ajax({
        url: core.getHost()+'/admin/productimg/set_product_img',
        type: 'POST',
        success: function(e){

          var data = JSON.parse(e);


          //只支持单张上传
          $(".product_img_tmp").parent().remove();


          if(data && data.status)
          {
              var img_url=data.result.imgsrc;
              var imageId=data.result.hash;

              for(var i=0,len=$('input[name="pic_id"]').length;i<len;i++)
              {
                if(imageId==$('input[name="pic_id"]').eq(i).val())
                {
                  alert("图片已被设置，请上传其它图片！");
                  $('input[name="pic_num"]').val(parseInt($('input[name="pic_num"]').val())-1);
                  $("#pic_div").next().show();
                  return;
                }
              }

              if(data.result.is_default == 1){
                  $("#pic_div").append("<div class='pic-parent-div'>"+
                  '<div class="main-pic">主图</div>'+
                  "<img src='"+img_url+"' class='product_img' alt='' />"+
                  "<input type='hidden' name='pic_id' value='"+imageId+"'  />"+
                  "</div>");
              }else{
                  $("#pic_div").append("<div class='pic-parent-div'>"+
                  "<div class='set-main-pic hide'>设为主图</div>"+
                  "<div class='del-pic hide'>删除</div>"+
                  "<img src='"+img_url+"' class='product_img' alt='' />"+
                  "<input type='hidden' name='pic_id' value='"+imageId+"'  />"+
                  "</div>");
              }
              location.reload();
          }else{
            alert(data.result.msg);
            $('input[name="pic_num"]').val(parseInt($('input[name="pic_num"]').val())-1);
            $("#pic_div").next().show();

          }
          /* 支持多张上传时 if(data && data.status){
           var img_url=data.result.imgsrc;
           var imageId=data.result.hash;
           $("#pic_div").append("<div class='pic-parent-div'>"+
           "<div class='set-main-pic hide'>设为主图</div>"+
           "<div class='del-pic hide'>删除</div>"+
           "<img src='"+img_url+"' class='product_img' alt='' />"+
           "<input type='hidden' name='pic_id' value='"+imageId+"'  />"+
           "</div>");

           cur_success_file_num++;
           if(cur_error_file_num+cur_success_file_num==files.length){
           alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
           location.reload();
           }
           }else{
           cur_error_file_num++;
           if(cur_error_file_num+cur_success_file_num==files.length){
           alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
           location.reload();
           }
           }*/
        },
        error: function(data){
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      });
    }

  };
    $('#push-pic-num').html($('.del-pic').size());
  //设置图片为商品封面
  var setProductCoverImg = function (goods_id,pic_id)
  {
      var url = core.getHost()+"/admin/productimg/set_product_coverImg";

      var datas={};

      datas.goods_id=goods_id;

      datas.img_id=pic_id;

      $.post(url,datas,function(e){

        var data = JSON.parse(e);

        if(data.status)
        {
          alert("主图设置成功！");
          location.reload();

        }else{
          alert(data.result.msg);
        }
      });
  };
  //删除商品图片
  var delProductImg = function (goods_id,img_id)
  {
      var url = core.getHost()+"/admin/productimg/del_product_img";

      var datas={};
      datas.goods_id = goods_id;
      datas.img_id = img_id;

    if(confirm("您确定删除图片吗？")){

        $.post(url,datas,function(e){

          var data = JSON.parse(e);

          if(data.status)
          {

            alert("图片删除成功！");
              $('#push-pic-num').html($('.del-pic').size());
            location.reload();

          }else{
              $('#push-pic-num').html($('.del-pic').size());
            alert(data.result.msg);
          }
        });
      }
  };

  //设置商品图片
  var setProductImg = function (obj)
  {
        cur_lenth = $('input[name="pic_num"]').val();

        var curObj=obj;

        if(total_lenth==cur_lenth)
        {
            $('#push-pic-num').html($('.del-pic').size());
          alert("添加失败");

          return;
        }

        $("#pic_div").append("<div class='pic-parent-div'>"+
        "<img src='"+core.getHost()+"/source/managers/style/img/shoploading.gif' class='product_img_tmp' alt='' />"+
        "</div>");

        $('input[name="pic_num"]').val(parseInt(cur_lenth)+1);

        if(parseInt(cur_lenth)+1>=total_lenth)
        {
          $("#pic_div").next().hide();

        }

        var url = core.getHost()+ "/admin/productimg/set_product_img";

        var datas={};

        datas.goods_id=$('input[name="goods_id"]').val();
        var pic_id=$(curObj).parent().find(".product_img").attr("data");
        imageAttr=pic_id.split("|");

        datas.imgData=imageAttr[0];
        datas.img_from_ybzf=1;
        datas.host_id=imageAttr[1];

        $.post(url,datas,function(e){

          var data = JSON.parse(e);

          $(".product_img_tmp").parent().remove();


          if(data.status)
          {
            var img_url=data.result.imgsrc;
            var imageId=data.result.hash;

			if(data.result.is_default == 1){
                  $("#pic_div").append("<div class='pic-parent-div'>"+
                  '<div class="main-pic">主图</div>'+
                  "<img src='"+img_url+"' class='product_img' alt='' />"+
                  "<input type='hidden' name='pic_id' value='"+imageId+"'  />"+
                  "</div>");
              }else{
                   $("#pic_div").append("<div class='pic-parent-div'>"+
		            "<div class='set-main-pic hide'>设为主图</div>"+
		            "<div class='del-pic hide'>删除</div>"+
		            "<img src='"+img_url+"' class='product_img' alt='' />"+
		            "<input type='hidden' name='pic_id' value='"+imageId+"'  />"+
		            "</div>");
              }
          

            //console.log($(curObj).html()+"~~"+$(curObj).attr("class"));
            $(curObj).addClass("hasset-ybzf-pic").removeClass("set-ybzf-pic").html("已使用");
            //console.log($(curObj).html()+"~~"+$(curObj).attr("class"));
              location.reload();
          }else{

            alert(data.result.msg);
            $('input[name="pic_num"]').val(parseInt($('input[name="pic_num"]').val())-1);
            $("#pic_div").next().show();

          }
        });
  };


  return {
    ImgHandleFileSelect:ImgHandleFileSelect,
    setProductCoverImg:setProductCoverImg,
    delProductImg:delProductImg,
    setProductImg:setProductImg
  };

});
