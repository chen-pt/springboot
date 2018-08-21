$(document).ready(function(){

  setTimeout(elementObj.init,1000);
  /****basic--tool***/
  $(".basic-element").mouseover(function(){
    $(this).find(".shade_div").removeClass("lee_hide");
  }).mouseout(function(){
    $(this).find(".shade_div").addClass("lee_hide");
  });

  $(".shade_div").click(function(){
    var tag = $(this).attr("data-target");
    var tmpStr = "";
    switch(tag){
      case "goods1":
        tmpStr = "单列商品模块";
        break;
      case "goods2":
        tmpStr = "双列商品模块";
        break;
      case "goods3":
        tmpStr = "三列商品模块";
        break;
      case "pic1":
        tmpStr = "单列图片模块";
        break;
      case "pic2":
        tmpStr = "双列图片模块";
        break;
      case "pic3":
        tmpStr = "三列图片模块";
        break;
      case "pic_text":
        tmpStr = "图文标题模块";
        break;
    }
    $(".element.edit").removeClass("edit");
    var newElement = "<div class='element edit' data-type='"+tag+"'>"+tmpStr+"<br><span>（请在右侧单列商品设置中编辑）</span></div>";
    if(elementObj.curEditObj){
      $(elementObj.curEditObj).after(newElement);
    }else{
      $(".edit-area").append(newElement);
      $(".edit-mobile-area").animate({scrollTop: '10000px'}, 800);
    }
    elementObj.curEditObj = $(".element.edit");
    elementObj.curObj = $(".element.edit");
    elementObj.editElement();
  });


  /****mobile-content***/
  $(".element").live("mouseenter",function(){
    $(".mobile-tool").removeClass("lee_hide").animate({top:($(this).offset().top>401?($(this).offset().top>880?880:$(this).offset().top):367)+"px",left:($(".edit-mobile-area").position().left+399)+"px"},200);
    //$(".mobile-tool").removeClass("lee_hide").animate({top:"480px",left:($(".edit-mobile-area").position().left+399)+"px"},200);

    elementObj.curObj = $(this);
  }).live("mouseout",function(){
    //$(".mobile-tool").addClass("lee_hide");
  }).live("click",function(){
    elementObj.curObj = $(this);

    $(".element.edit").removeClass("edit");
    elementObj.curEditObj = elementObj.curObj;
    $(elementObj.curEditObj).addClass("edit");
    elementObj.editElement();
  });;


  /****mobile---tool****/
  $(".edit-element").click(function(){
    $(".element.edit").removeClass("edit");
    elementObj.curEditObj = elementObj.curObj;
    $(elementObj.curEditObj).addClass("edit");
    elementObj.editElement();
  });
  $(".moveup-element").click(function(){
    $(elementObj.curObj).prev().before(elementObj.curObj);
    $(".edit-mobile-area").animate({scrollTop:$(elementObj.curObj).offset().top-$(".edit-mobile-area").offset().top+$(".edit-mobile-area").scrollTop()},500);
  });
  $(".movedown-element").click(function(){
    $(elementObj.curObj).next().after(elementObj.curObj);
    $(".edit-mobile-area").animate({scrollTop:$(elementObj.curObj).offset().top-$(".edit-mobile-area").offset().top+$(".edit-mobile-area").scrollTop()},500);
  });
  $(".del-element").click(function(){
    /* $(".element.edit").removeClass("edit");
     $(elementObj.curObj).addClass("edit");*/
    if(!elementObj.curEditObj){
      alert("请先选择一个模块后再进行操作！");
      return;
    }
    if(confirm("确定要删除这个模块吗？")){
      $(elementObj.curEditObj).remove();
      $(".mobile-tool").addClass("lee_hide");

      if($(elementObj.curObj).hasClass("edit")){
        $(".goods_setting").html('<p style="text-align:center;font-size:18px;color:#999;margin-top:40%"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>请先选择你需要编辑的模块!</p>');
      }
      elementObj.curEditObj = '';
    }
  });

  /***set-content****/
  $("[name='select_goods_radio']").live("click",function(){
    var type = $(this).val();
    if(type=="cate"){
      //$(this).parents(".select_goods_div").find(".add_goods_btn").html("选择商品分类").addClass("select_cat_btn").removeClass("add_goods_btn");
      $(this).parents(".select_goods_div").find("p").html('<a  href="javascript:void(0)" class="btn btn-large select_cat_btn" data-desc="cate_name">选择商品分类</a>');
    }else if(type=="goods"){
      //$(this).parents(".select_goods_div").find(".select_cat_btn").html("添加商品").addClass("add_goods_btn").removeClass("select_cat_btn");
      $(this).parents(".select_goods_div").find("p").html('<a  href="javascript:void(0)" class="btn btn-large add_goods_btn" data-desc="goods_name">添加商品</a>');
    }
  });

  $(".select_cat_btn").live("click",function(){
    productObj.source_btn = $(this).attr("data-desc");
    loadEvt.loadCatDialog();
  });

  $(".add_goods_btn").live("click",function(){
    productObj.source_btn = $(this).attr("data-desc");
    loadEvt.loadProductDialog1();

    if($(this).hasClass("tmp_edit_btn")){
      var tmpParam = {};
      tmpParam.goods_ids = $(this).parent().find('[name="goods_id"]').val();
      tmpParam.tmp_order = "shop_price asc";
      tmpParam.source = "dialog";
      tmpParam.tmp_num = $('[name="goods_control_num"]').val();
      dataObj.product_batchGetProducts(tmpParam);
    }else{
      $(".select_goods_list").html("");
    }
  });

  $(".select_icon_btn").live("click",function(){
    loadEvt.loadIconDialog();
  });

  $(".method_text_label").live("click",function(){
    var radioId = $(this).attr('name');
    $(".method_text_label_checked").removeAttr('class').attr('class', 'method_text_label');
    $(this).removeAttr('class').attr('class', 'method_text_label_checked');
    $('.method_text').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
  });
  /**图标上传**/
  $("#btnUpIcon").live("change",function(e) {
    Array.prototype.forEach.call(e.target.files, function(f) {
      productObj.upLoadIcon(f);
    });
  });


  $(".add_pic_btn").live("mouseover",function(){
    $(this).find(".img_shade").removeClass("lee_hide");
  }).live("mouseout",function(){
    $(this).find(".img_shade").addClass("lee_hide");
  }).live("click",function(){
    productObj.source_img_btn_id = $(this).attr("data-img-btn-id");
    loadEvt.loadUploadImg();
    if($(this).find("img").length>0){
      $(".tmp_pic_a").html("<img src='"+$(this).find("img").attr("src")+"' style='max-width:40px;max-height: 40px' />修改图片");
      $('[name="dialog_link_url"]').val($(this).find("img").attr("data-link"));
    }else{
      $(".tmp_pic_a").html('<i style="padding:5px;" class="fa fa-cloud-upload btn grey-cascade"></i>上传图片');
      $('[name="dialog_link_url"]').val("");
      $("#btnUpImg").val("");
    }
    var tmpObjType = $(elementObj.curEditObj).attr("data-type");
    if(tmpObjType == "pic1"){
      $(".pic_dialog_prompt").html("建议上传尺寸：460x1080，支持jpg、png格式");
    }else if(tmpObjType == "pic2"){
      $(".pic_dialog_prompt").html("建议上传尺寸：535x600，支持jpg、png格式");
    }else if(tmpObjType == "pic3"){
      $(".pic_dialog_prompt").html("建议上传尺寸：358x440，支持jpg、png格式");
    }
  });

  /***预览***/
  $(".preview-goods-setting-btn").live("click",function(){
    if(elementObj.curEditObj == ''){
      alert("请先选择你要编辑的模块！");
      return;
    }
    if(!$('[name="goods-cat-title"]').val()){
      alert("请填写商品分类标题！");
      return;
    }
    elementObj.preViewGoodsObj();
  });
  $(".preview-pic-setting-btn").live("click",function(){
    elementObj.preViewImgObj();
  });

  $(".preview-pic-text-setting-btn").live("click",function(){
    elementObj.preViewImgTextObj();
  });

  $('.save-setting-btn').live("click",function(){
    elementObj.saveElement();
  });

});
var elementObj={
  page_no:0,
  total_page:1,
  content:'',
  curObj:"",
  curEditObj:"",
  editElement:function(){
    var tmpObjType = $(elementObj.curEditObj).attr("data-type");
    var data = {};
    data.objType = tmpObjType;
    if(tmpObjType == "goods1"){
      data.tips = "tips：每行展示一个商品，能很好的突显商品特性。";
    }else if(tmpObjType == "goods2"){
      data.tips = "tips：每行展示2个宝贝，最多显示10个宝贝；";
    }else if(tmpObjType == "goods3"){
      data.tips = "";
    }
    switch(tmpObjType){
      case "goods1":
      case "goods2":
      case "goods3":
        data.element_type = "goods";
        var tmpl = document.getElementById('goods_setting_templete').innerHTML;
        break;
      case "pic1":
      case "pic2":
      case "pic3":
        data.element_type = "pic";
        var tmpl = document.getElementById('goods_setting_templete').innerHTML;
        break;
      case "pic_text":
        data.element_type = "pic_text";
        var tmpl = document.getElementById('goods_setting_templete').innerHTML;
        break;

    }
    var doTtmpl = doT.template(tmpl);
    $(".set-content").html(doTtmpl(data));

    var historyData = $(elementObj.curEditObj).find('[name="result_json"]').val();

    if(historyData){
      var historyData = JSON.parse(decodeURI(historyData));
      elementObj.editElementShowVal(tmpObjType,historyData);

    }

  },
  preViewGoodsObj:function(){
    var tmp_title = $('[name="goods-cat-title"]').val();
    var tmp_type = $('[name="select_goods_radio"]:checked').val();
    var tmp_num = $('[name="goods_control_num"]').val();
    var tmp_order = $('[name="goods_control_order"]').val();
    var tmp_show_price = $('[name="is_show_price"]:checked').val();
    var tmp_show_car = $('[name="is_show_car"]:checked').val();
    var tmp_pic_url = $('[name="tmp_pic_url"]:checked').val();

    var params = {};
    params.tmp_title = tmp_title;
    params.tmp_num = tmp_num;
    params.tmp_order = tmp_order;
    params.tmp_show_price = tmp_show_price;
    params.tmp_show_car = tmp_show_car;
    params.tmp_type = tmp_type;
    params.tmp_pic_url = tmp_pic_url
    console.log("put params")
    console.log(params);

    if(tmp_type == "goods"){
      params.goods_ids = $('[name="goods_id"]').val();
      if(!params.goods_ids){
        alert("尚未选择商品，无法保存。");
        return false;
      }
      params.element_type = $(elementObj.curEditObj).attr("data-type");
      params.result_json = encodeURI(JSON.stringify(params));
      params.source = "save";
      dataObj.product_batchGetProducts(params);
    }else{
      params.cate_id = $('[name="cate_id"]').val();
      if(!params.cate_id ){
        alert("请先选择分类！");
        return false;
      }
      params.element_type = $(elementObj.curEditObj).attr("data-type");
      params.result_json = encodeURI(JSON.stringify(params));
      params.source = "save";
      dataObj.getProductList(params);
    }

  },
  preViewImgObj:function(){
    var params = {};
    params.element_type = $(elementObj.curEditObj).attr("data-type");
    params.imgs = [];
    if($(".add_pic_btn img").length<1){
      alert("请上传图片后保存!");
      return false;
    }

    for(var i=0,len=$(".add_pic_btn").length;i<len;i++){
      params.imgs[i] = {};
      params.imgs[i].imgsrc = $(".add_pic_btn:eq("+i+") img").attr("src");
      params.imgs[i].linkURL= $(".add_pic_btn:eq("+i+") img").attr("data-link");
    }
    params.result_json = encodeURI(JSON.stringify(params));

    elementObj.showElement(params);
  },
  preViewImgTextObj:function(){
    var tmp_align = $('[name="title_align_type"]:checked').val();
    var tmp_title = $('[name="pic-text-title"]').val();
    var tmp_url = $('[name="pic-text-url"]').val();
    var tmp_img = $(".preViewIcon").attr("src");

    if(tmp_img.indexOf("/theme/default/images/upload.png")>-1){
      alert('请选择或上传一张图片后再进行保存！');
      return;
    }
    if(tmp_img.indexOf("/theme/default/images/022.gif")>-1){
      alert('图片正在上传中，请等上传完成后再进行保存！');
      return;
    }

    var params = {};
    params.tmp_title = tmp_title;
    params.tmp_align = tmp_align;
    params.tmp_url = tmp_url;
    params.tmp_img = tmp_img;
    params.element_type = $(elementObj.curEditObj).attr("data-type");
    params.result_json = encodeURI(JSON.stringify(params));

    elementObj.showElement(params);

  },
  showElement:function(tmpData){
    var tmpObjType = $(elementObj.curEditObj).attr("data-type");

    tmpObjType = /pic[1-3]/g.test(tmpObjType)?"pic":tmpObjType;

    var tmpl = document.getElementById('tmp_'+tmpObjType+'_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(elementObj.curEditObj).html(doTtmpl(tmpData));

    $(elementObj.curEditObj).addClass("has_content");

  },
  editElementShowVal:function(tmpObjType,params){
    switch(tmpObjType){
      case "goods1":
      case "goods2":
      case "goods3":
        $('[name="goods-cat-title"]').val(params.tmp_title);
        $('[name="select_goods_radio"][value="'+params.tmp_type+'"]').attr("checked",true);
        $('[name="goods_control_num"]').val(params.tmp_num);
        $('[name="goods_control_order"]').val(params.tmp_order);
        $('[name="goods_img"]')
        if(params.tmp_show_price)$('[name="is_show_price"]').attr("checked",true);
        if(params.tmp_show_car)$('[name="is_show_car"]').attr("checked",true);
        if(params.cate_id){
          dataObj.getProductCategory(params.cate_id);
        }else if(params.goods_ids){
          var tmpParam = {};
          tmpParam.goods_ids = params.goods_ids;
          tmpParam.tmp_order = params.tmp_order;
          tmpParam.source = "edit";
          tmpParam.tmp_num = params.tmp_num;
          dataObj.product_batchGetProducts(tmpParam);
        }
        break;
      case "pic1":
      case "pic2":
      case "pic3":
        for(var i in params.imgs){
          $(".add_pic_btn").eq(i).html("<div class='img_shade lee_hide'>修改</div><img src='"+params.imgs[i].imgsrc+"' style='width:100%;' data-link='"+decodeURI(params.imgs[i].linkURL)+"' />").addClass("pic_btn");
        }
        break;
      case "pic_text":
        $('[name="pic-text-title"]').val(params.tmp_title);
        $('[name="pic-text-url"]').val(params.tmp_url);
        $('[name="title_align_type"][value="'+params.tmp_align+'"]').attr("checked",true);
        $('.preViewIcon').attr("src",params.tmp_img);
        break;

    }
  },
  saveElement:function(){
    var result_json = [];
    var num = 0;
    for(var i =0,len=$('[name="result_json"]').length;i<len;i++){
      result_json[num++] = $('[name="result_json"]').eq(i).val();
    }
    console.log("上传的数据");
    console.log(result_json);
    var result_str = JSON.stringify(result_json);
    dataObj.setIndex(result_str);
  },
  preViewData:function(){
    var i = elementObj.page_no;
    var content = elementObj.content;
    if(content.length<1){return;}

    switch(content[i].element_type){
      case "goods1":
      case "goods2":
      case "goods3":
        if(content[i].goods_ids){
          content[i].source = "init";
          dataObj.product_batchGetProducts(content[i]);
        }else if(content[i].cate_id){
          content[i].source = "init";
          dataObj.getProductList(content[i]);
        }
        break;
      case "pic1":
      case "pic2":
      case "pic3":
      case "pic_text":
        elementObj.showEditElement(content[i]);
        break;
    }
  },
  showEditElement:function(datas){

    /***图片和商品的区别**/
    if(datas.setting){
      var tmpObjType = datas.setting.element_type;
      datas.setting.result_json = encodeURI(JSON.stringify(datas.setting));
    }else{
      var tmpObjType = datas.element_type;
      datas.result_json = encodeURI(JSON.stringify(datas));
    }

    var tmpObjType1 = /pic[1-3]/g.test(tmpObjType)?"pic":tmpObjType;

    var tmpl = document.getElementById('tmp_'+tmpObjType1+'_templete').innerHTML;
    var doTtmpl = doT.template(tmpl);
    $(".edit-area").append('<div class="element has_content" data-type="'+tmpObjType+'">'+doTtmpl(datas)+'</div>');
    if(++elementObj.page_no < elementObj.total_page){
      elementObj.preViewData();
    }
  },
  init:function(){
    dataObj.getFocusAD();
    dataObj.getIconLink();
    dataObj.getIndex();
  },
};

/***新首页需要调取的数据***/
var dataObj = {
  getIndex:function(){
    var urlStr  = "/merchant/indexpageget";

    var params = {};
    $.post(urlStr,params,function(data){
      console.log('data.metaval');
      console.log(data.data);
      if(data && data.data && data.data.metaVal){
        // var content = "["+decodeURI(JSON.parse(data.data.metaVal))+"]";
        var content = data.data.metaVal;
        content = JSON.parse(content);
        console.log("content");
        console.log(content);
        elementObj.total_page = content.length;

        elementObj.content = content;

        elementObj.preViewData();
      }
    });
  },
  setIndex:function(tmpData){
    var metaId = $('[name=metaId]').val();
    var urlStr  = "/merchant/indexpageadd";
    var params = {};
    params.metaVal = tmpData;
    if(metaId)params.metaId = metaId;
    $.post(urlStr,params,function(data){
      if(data.code==200){
        alert("保存成功！");
      }else{
        alert('保存失败。');
      }

    });
  },
  getProductList:function(datas){

    var cate_id =datas.cate_id;
    var pageNum = datas.tmp_num;
    var orderby = datas.tmp_order;
    //var urlStr  = "/merchant/ecBgoodsList";
    var urlStr  = "/merchant/bgoodsList?hasImage=1&goodsStatus=1&";

    var params = {};
    //params.user_cateid = cate_id;
    params.userCateid = cate_id;
    params.currentPage = 1;
    params.startRow = 0;
    params.pageSize = datas.tmp_num;
    params.order = orderby;

    $.post(urlStr,params,function(data){
      var objData = {};
      objData.data = data.goodsPage.list;
      objData.setting = datas;
      //console.log("bgoods");
      //console.log(data.goodsPage.list);
      for(var i in objData.data){
        objData.data[i].shop_price /=100;
      }

      if(datas.source == "init"){
        elementObj.showEditElement(objData);
      }else if(datas.source == "save"){
        elementObj.showElement(objData);
      }
    });

  },
  product_batchGetProducts: function(datas){
    var params = {};
    var ids = new String(datas.goods_ids);
    params.goodsIds = ids.substr(0,ids.length - 1);
    params.order = datas.tmp_order;
    params.startRow = 0;
    params.pageSize = datas.tmp_num;

    //var urlStr  = "/merchant/ecBgoodsList";
    var urlStr  = "/merchant/bgoodsList?hasImage=1&goodsStatus=1&";

    $.post(urlStr+$.param(params),function(data){

      if(null != data.goodsPage.list){
        var tmpList = data.goodsPage.list;

        if(datas.source == "save"){
          var objData = {};
          // for(var i=0;i<tmpList.length;i++){
          //   data.goodsPage.list[i].shop_price =(tmpList[i].shop_price/100).toFixed(2);
          // }
          objData.data = tmpList;
          objData.setting = datas;
          console.log(objData);
          elementObj.showElement(objData);
        }else if(datas.source == "edit"){
          for(var i=0;i<tmpList.length;i++){
            data.goodsPage.list[i].shop_price =(tmpList[i].shopPrice/100).toFixed(2);
            data.goodsPage.list[i].shopPrice =(data.goodsPage.list[i].shopPrice/100).toFixed(2);
          }
          var tmpl = document.getElementById('tmp_select_goods_templete').innerHTML;
          var doTtmpl = doT.template(tmpl);
          $('.cate_goods_show_area').html(doTtmpl(tmpList));

        }else if(datas.source == "dialog"){
          console.log("data.gInfos:"+JSON.stringify(tmpList));
          console.log("hefang:"+tmpList.length)
          $(".select_goods_list").html("");
          for(var i in tmpList){
            var tmpData={};
            tmpData.goods_id=tmpList[i].goodsId;
            tmpData.goods_title=tmpList[i].goodsTitle;
            //tmpData.shop_price=tmpList[i].shopPrice*100;
            tmpData.shop_price=tmpList[i].shopPrice;
            tmpData.specif_cation=tmpList[i].specifCation;

            var tmpl = document.getElementById('select_product_list_templete').innerHTML;
            var doTtmpl = doT.template(tmpl);
            $(".select_goods_list").append(doTtmpl(tmpData));
          }
          $(".select_goods_total").html(tmpList.length);
        }else if(datas.source == "init"){
          var objData = {};

          objData.data = tmpList;
          objData.setting = datas;
          elementObj.showEditElement(objData);
        }
      }

    });
  },
  getProductCategory:function(cate_id){
    /* var tmpData = JSON.parse('{"status":true,"result":{"current":1,"before":1,"next":1,"total_pages":1,"total_items":17,"items":[{"cate_id":"1","parent_id":"0","cate_code":"1000","cate_name":"\u4e2d\u897f\u836f\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:33","update_time":"2015-06-24 18:56:33","yb_cateid":"0","del_tag":"0"},{"cate_id":"153","parent_id":"0","cate_code":"1006","cate_name":"\u4e2d\u836f\/\u53c2\u8338","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"192","parent_id":"0","cate_code":"1002","cate_name":"\u4e2d\u8349\u836f","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"233","parent_id":"0","cate_code":"1001","cate_name":"\u533b\u7597\u5668\u68b0","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"298","parent_id":"0","cate_code":"1005","cate_name":"\u6bcd\u5a74\u7528\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"342","parent_id":"0","cate_code":"1003","cate_name":"\u6210\u4eba\u7528\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"408","parent_id":"0","cate_code":"1004","cate_name":"\u7f8e\u5bb9\u62a4\u80a4","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"456","parent_id":"0","cate_code":"1007","cate_name":"\u513f\u7ae5\u7528\u836f","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-11-10 16:13:06","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"466","parent_id":"0","cate_code":"1008","cate_name":"\u4fdd\u5065\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-01-11 12:01:58","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"479","parent_id":"0","cate_code":"1013","cate_name":"\u98df\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-11-08 09:52:03","update_time":"2016-11-08 09:52:03","yb_cateid":"0","del_tag":"0"},{"cate_id":"482","parent_id":"0","cate_code":"1014","cate_name":"\u706b\u9505","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-11-10 10:11:45","update_time":"2016-11-10 10:47:44","yb_cateid":"0","del_tag":"0"},{"cate_id":"491","parent_id":"0","cate_code":"1016","cate_name":"12.8\u4f18\u60e0","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-08 09:35:44","update_time":"2016-12-08 09:35:44","yb_cateid":"0","del_tag":"0"},{"cate_id":"492","parent_id":"0","cate_code":"1017","cate_name":"\u6d4b\u8bd5\u7a7a\u5206\u7c7b\u80fd\u6dfb\u52a0\u5417","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-08 09:42:09","update_time":"2016-12-08 09:42:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"511","parent_id":"0","cate_code":"1032","cate_name":"\u6d4b\u8bd5","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 15:28:59","update_time":"2016-12-15 15:28:59","yb_cateid":"0","del_tag":"0"},{"cate_id":"517","parent_id":"0","cate_code":"1034","cate_name":"test","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 15:55:09","update_time":"2016-12-15 15:55:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"520","parent_id":"0","cate_code":"1036","cate_name":"\u5206\u9500\u7c7b\u76ee","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 18:25:11","update_time":"2016-12-15 18:25:11","yb_cateid":"0","del_tag":"0"},{"cate_id":"523","parent_id":"0","cate_code":"1037","cate_name":"\u65e5\u7528\u767e\u8d27","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2017-01-06 11:44:14","update_time":"2017-01-06 11:44:14","yb_cateid":"0","del_tag":"0"}]}}');

     var tmpl = document.getElementById('tmp_select_cat_templete').innerHTML;
     var doTtmpl = doT.template(tmpl);
     $('.cate_goods_show_area').html(doTtmpl(tmpData.result.items[0]));*/

    var urlStr  = "/merchant/codeGetCat";

    var params = {};
    params.cateCode = cate_id;

    $.post(urlStr,params,function(data){
      var tmpl = document.getElementById('tmp_select_cat2_templete').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('.cate_goods_show_area').html(doTtmpl(data.result[0]));
    });
    /*var urlStr  = "/product/getProductCategory";
     var params = {};
     params.cate_id = cate_id;
     $.post(urlStr,params,function(data){
     var tmpData = JSON.parse(data);

     var tmpl = document.getElementById('tmp_select_cat_templete').innerHTML;
     var doTtmpl = doT.template(tmpl);
     $('.cate_goods_show_area').html(doTtmpl(tmpData.result.items[0]));

     });*/
  },
  getFocusAD:function(){
    //加载数据
    $.get("/merchant/getslidelist",function(res){
      if(res.code == 200){
        var data = res.data;
        var tmpl = document.getElementById('sliders_area_templete').innerHTML;

        var doTtmpl = doT.template(tmpl);

        $(".sliders_area").html(doTtmpl(data));

        var swiper = new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          slidesPerView: 1,
          paginationClickable: true,
          loop: true,
          autoplayDisableOnInteraction: false,
          autoplay: 6000//可选选项，自动滑动
        });
      }else{
        $(".sliders_area").html("暂无数据");
      }

    });

  },
  getIconLink:function(){

    $.get("/merchant/wxIcongetlistnew",function(res){
      console.log("res");
      console.log(res);
      var tmpData = res;
      var tmpl = document.getElementById('iconlink_area_templete').innerHTML;

      var doTtmpl = doT.template(tmpl);

      $(".icon_link_area").html(doTtmpl(tmpData));
    });


    //整合一下 merchant/wxIcongetlist merchant/getSildeLineNum merchant/getSildeMaxShow这三个接口，把三个元素都放到一个接口里，按三个val放
    // var tmpData = JSON.parse('{"status":true,"result":[{"linkId":"27","image":"http:\/\/img01.pic.12306pc.cn\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/43b71983669dc36c572b1e7d8bbffe83.jpg","title":"test1","url":"\/product\/index?cate_id=518"},{"linkId":"21","image":"http:\/\/img01.pic.12306pc.cn\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/7da1f6ff979f59275a0aa2c8c6ff4349.jpg","title":"\u6bcd\u5a74\u7528\u54c1","url":"\/product\/index?cate_id=298"},{"linkId":"22","image":"http:\/\/img01.pic.12306pc.cn\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/abd7fefb7aa54cb29ee18bdb97377d51.jpg","title":"\u4e2d\u836f\/\u53c2\u8338","url":"\/product\/index?cate_id=153"},{"linkId":"23","image":"http:\/\/img01.pic.12306pc.cn\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/14553a8810e25293e63586d8820ffbd2.jpg","title":"\u6210\u4eba\u7528\u54c1","url":"\/product\/index?cate_id=342"},{"linkId":"25","image":"http:\/\/img01.pic.12306pc.cn\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/822a34329e04f9a8425f8de5da5d18b9.jpg","title":"1201","url":"http:\/\/100166.weixin.51jk.com\/product\/detail?goods_ids=207"}],"iconLinkRow":3}');
    //
    // var tmpl = document.getElementById('iconlink_area_templete').innerHTML;
    //
    // var doTtmpl = doT.template(tmpl);
    //
    // $(".icon_link_area").html(doTtmpl(tmpData));


  }
}
