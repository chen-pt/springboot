$(document).ready(function(){

    setTimeout(elementObj.init,1000);
    /****basic--tool***/
    //在图文模块鼠标移入移除会改变div的样式
    $(".basic-element").mouseover(function(){
        $(this).find(".shade_div").removeClass("lee_hide");
    }).mouseout(function(){
        $(this).find(".shade_div").addClass("lee_hide");
    });

    //给图文模块窗口下的各个图标绑定事件,调取不同的模板数据，并先清空模块设置中原有默认页面，
   //在加入模板样式
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
        $(".edit-area").append("<div class='element edit' data-type='"+tag+"'>"+tmpStr+"<br><span>（请在右侧单列商品设置中编辑）</span></div>");
        elementObj.curEditObj = $(".element.edit");
        elementObj.editElement();
        $(".edit-mobile-area").animate({scrollTop: '10000px'}, 800);
    });


    /****mobile-content***/
    $(".element").live("mouseover",function(){
        $(".mobile-tool").removeClass("lee_hide").animate({top:($(this).offset().top>401?($(this).offset().top>775?480:$(this).offset().top-294):110)+"px",left:($(".edit-mobile-area").position().left+399)+"px"},200);
        //$(".mobile-tool").removeClass("lee_hide").animate({top:"480px",left:($(".edit-mobile-area").position().left+399)+"px"},200);

        elementObj.curObj = $(this);
    }).live("mouseout",function(){
        //$(".mobile-tool").addClass("lee_hide");
    }).live("click",function(){

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
        $(".element.edit").removeClass("edit");
        elementObj.curEditObj = elementObj.curObj;
        $(elementObj.curEditObj).addClass("edit");
        if(confirm("确定要删除这个模块吗？")){
            $(elementObj.curObj).remove();
            $(".mobile-tool").addClass("lee_hide");

            if($(elementObj.curObj).hasClass("edit")){
                $(".goods_setting").html('<p style="text-align:center;font-size:18px;color:#999;margin-top:40%"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>请先选择你需要编辑的模块!</p>');
            }
        }
    });

    //点击商品模块中的图标，模块设置中选择商品下的两个单选按钮
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
    //点击商品分类时触发
    $(".select_cat_btn").live("click",function(){
        productObj.source_btn = $(this).attr("data-desc");
        loadEvt.loadCatDialog();
    });

    //点击添加商品时触发
    $(".add_goods_btn").live("click",function(){
        productObj.source_btn = $(this).attr("data-desc");
        loadEvt.loadProductDialog1();

        if($(this).hasClass("tmp_edit_btn")){
            var tmpParam = {};
            tmpParam.goods_ids = $(this).parent().find('[name="goods_id"]').val();
            tmpParam.tmp_order = "shop_price asc";
            tmpParam.source = "dialog";
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

        var params = {};
        params.tmp_title = tmp_title;
        params.tmp_num = tmp_num;
        params.tmp_order = tmp_order;
        params.tmp_show_price = tmp_show_price;
        params.tmp_show_car = tmp_show_car;
        params.tmp_type = tmp_type;

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
            if(!params.cate_id){
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
                if(params.tmp_show_price)$('[name="is_show_price"]').attr("checked",true);
                if(params.tmp_show_car)$('[name="is_show_car"]').attr("checked",true);
                if(params.cate_id){
                    dataObj.getProductCategory(params.cate_id);
                }else if(params.goods_ids){
                    var tmpParam = {};
                    tmpParam.goods_ids = params.goods_ids;
                    tmpParam.tmp_order = params.tmp_order;
                    tmpParam.source = "edit";
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
        var result_str = JSON.stringify(result_json);

        dataObj.setIndex(result_str);
    },
    preViewData:function(){
        var i = elementObj.page_no;
        var content = elementObj.content;

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
        //var content = "["+decodeURI(JSON.parse(tmpData.result.data))+"]";
        //content = JSON.parse(content);
        // var content = [{"tmp_title":"","tmp_num":"6","tmp_order":"shop_price asc","tmp_show_price":"1","tmp_show_car":"1","tmp_type":"cate","cate_id":"192","element_type":"goods3","source":"init"},{"tmp_title":"","tmp_num":"6","tmp_order":"shop_price asc","tmp_show_price":"1","tmp_show_car":"1","tmp_type":"cate","cate_id":"192","element_type":"goods2","source":"init"},{"tmp_title":"","tmp_num":"6","tmp_order":"shop_price asc","tmp_show_price":"1","tmp_show_car":"1","tmp_type":"goods","goods_ids":"60624,","element_type":"goods1","source":"init"},{"element_type":"pic1","imgs":[{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/b1c33424239ccd112f47f9d772fc0239.jpg","linkURL":""}]},{"element_type":"pic2","imgs":[{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/90bd7f01d83e042a8d46286bef573579.jpg","linkURL":""},{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/90bd7f01d83e042a8d46286bef573579.jpg","linkURL":""}]},{"element_type":"pic3","imgs":[{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/90bd7f01d83e042a8d46286bef573579.jpg","linkURL":""},{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/90bd7f01d83e042a8d46286bef573579.jpg","linkURL":""},{"imgsrc":"http://img-test.51jk.com//display/public/100001/10/0/10/0/608x608/90bd7f01d83e042a8d46286bef573579.jpg","linkURL":""}]},{"tmp_title":"abcdefg","tmp_align":"right","tmp_url":"","tmp_img":"http://img-test.51jk.com//display/public/100001/10/0/10/0/40x40/5e68131290cd3d185ba6b81a6a90c680.jpg","element_type":"pic_text"}];
        // elementObj.total_page = content.length;
        // elementObj.content = content;

        // elementObj.preViewData();
        var urlStr  = "/merchant/indexpageget";

        var params = {};
        $.post(urlStr,params,function(data){
            var content = "["+decodeURI(JSON.parse(data.data.metaVal))+"]";
            content = JSON.parse(content);
            elementObj.total_page = content.length;
            elementObj.content = content;

            elementObj.preViewData();


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


        var tmpData = JSON.parse('{"status":true,"result":{"current":1,"before":1,"next":1,"total_pages":1,"total_items":5,"items":[{"goods_id":1965,"goods_code":"73821","goods_title":"\u590d\u65b92","goods_company":"\u66fc\u79c0\u96f7\u6566\u836f\u4e1a\u6709\u9650\u516c\u53f8","drug_name":"\u590d\u65b9xxxxxxxxxxxxxxxxx","com_name":"\u590d\u65b91","market_price":3000,"shop_price":10,"in_stock":999,"specif_cation":"234\u514b","goods_status":1,"update_time":"2016-11-28 17:24:25","bar_code":"12345","approval_number":"\u56fd\u836f\u51c6\u5b57Z22021842","brand_name":"\u5f8b\u5eb7","cate_code":0,"def_url":null,"purchase_way":130,"wx_purchase_way":"130","user_cateid":"10061001"},{"goods_id":1289,"goods_code":"0434001","goods_title":"\u5e03\u6d1b\u82ac\u53e3\u670d\u6eb6\u6db2\uff08\u8d1d\u601d\uff09","goods_company":"\u795e\u5a01\u836f\u4e1a","drug_name":"\u5e03\u6d1b\u82ac\u53e3\u670d\u6eb6\u6db2\uff08\u8d1d\u601d\uff09","com_name":"\u5e03\u6d1b\u82ac\u53e3\u670d\u6eb6\u6db2\uff08\u8d1d\u601d\uff09","market_price":0,"shop_price":960,"in_stock":30,"specif_cation":"6\u652f","goods_status":1,"update_time":"2016-08-04 17:52:29","bar_code":"","approval_number":"\u56fd\u836f\u51c6\u5b57H10950111","brand_name":"","cate_code":0,"def_url":{"hostId":"a","imageId":"b903845a83a4e6504a90b747c9c2589d"},"purchase_way":140,"wx_purchase_way":"110","user_cateid":"100610001001","imgsrc":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/100x100\/b903845a83a4e6504a90b747c9c2589d.jpg"},{"goods_id":1913,"goods_code":"60203085","goods_title":"\u6c64\u81e3\u500d\u5065\u9c7c\u6cb9\u8f6f\u80f6\u56ca","goods_company":"\u798f\u5dde\u6d77\u738b\u91d1\u8c61\u4e2d\u836f\u5236\u836f\u6709\u9650\u516c\u53f8","drug_name":"\u6c64\u81e3\u500d\u5065\u9c7c\u6cb9\u8f6f\u80f6\u56ca","com_name":"\u6c64\u81e3\u500d\u5065\u9c7c\u6cb9\u8f6f\u80f6\u56ca","market_price":2150,"shop_price":2150,"in_stock":999,"specif_cation":"0.4g*12s*2\u677f","goods_status":1,"update_time":"2017-02-16 09:50:01","bar_code":"6905942303582","approval_number":"\u56fd\u836f\u51c6\u5b57Z20020023","brand_name":"","cate_code":0,"def_url":{"hostId":"a","imageId":"2d481130beff18b9ec703ac8b37c14fa"},"purchase_way":140,"wx_purchase_way":"110","user_cateid":"100610021002","imgsrc":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/100x100\/2d481130beff18b9ec703ac8b37c14fa.jpg"},{"goods_id":1293,"goods_code":"0451009","goods_title":"\u522b\u560c\u9187\u7247","goods_company":"\u6c5f\u82cf\u4e16\u8d38\u5929\u9636","drug_name":"\u522b\u560c\u9187\u7247","com_name":"\u522b\u560c\u9187\u7247","market_price":2350,"shop_price":2350,"in_stock":30,"specif_cation":"0.1g*100\u7247","goods_status":1,"update_time":"2016-08-04 17:52:29","bar_code":"","approval_number":"\u56fd\u836f\u51c6\u5b57H20033683","brand_name":"","cate_code":0,"def_url":{"hostId":"a","imageId":"c822fde74947770aed0da93be0d66e76"},"purchase_way":140,"wx_purchase_way":"110","user_cateid":"100610021000","imgsrc":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/100x100\/c822fde74947770aed0da93be0d66e76.jpg"},{"goods_id":1157,"goods_code":"15020101521","goods_title":"\u517b\u751f\u5802\u5929\u7136\u7ef4\u751f\u7d20E\u80f6\u56ca","goods_company":"\u6d77\u5357\u517b\u751f\u5802\u836f\u4e1a\u6709\u9650\u516c\u53f8","drug_name":"\u517b\u751f\u5802\u5929\u7136\u7ef4\u751f\u7d20E\u80f6\u56ca","com_name":"","market_price":18900,"shop_price":18900,"in_stock":20,"specif_cation":"250mg*200s","goods_status":1,"update_time":"2016-03-25 09:59:26","bar_code":"6910312779195","approval_number":"\u536b\u98df\u5065\u5b572002\u7b2c0331\u53f7","brand_name":"","cate_code":0,"def_url":{"hostId":"a","imageId":"7ee23b764b7f8e6ef39876b155c37f18"},"purchase_way":140,"wx_purchase_way":"110","user_cateid":"100610021000","imgsrc":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/100x100\/7ee23b764b7f8e6ef39876b155c37f18.jpg"}],"facet":""}}');
        var objData = {};
        objData.data = tmpData.result.items;
        objData.setting = datas;

        for(var i in objData.data){
            objData.data[i].shop_price /=100;
        }

        if(datas.source == "init"){
            elementObj.showEditElement(objData);
        }else if(datas.source == "save"){
            elementObj.showElement(objData);
        }
        // var urlStr  = "http://172.20.10.74:8765/merchant/bgoodsList";

        // var params = {};
        // params.startRow = 1;
        // params.pageSize = 100;
        // params.siteId = 100002

        // $.get(urlStr+"?"+$.param(params),function(data){
        //     alert(data);

        // });
    },
    product_batchGetProducts: function(datas){
        // var tmpData = JSON.parse('{"status":true,"result":[{"goods_id":1162,"goods_code":"73821","goods_title":"\u535e\u9526","goods_company":"\u66fc\u79c0\u96f7\u6566\u836f\u4e1a\u6709\u9650\u516c\u53f8","drug_name":"\u535e\u95265656","com_name":"\u535e\u9526","market_price":23000,"shop_price":2,"in_stock":20,"specif_cation":"28\u514b56","goods_status":1,"update_time":"2017-01-23 14:14:44","bar_code":"6917246200887","approval_number":"\u56fd\u98df\u5065\u5b57G20090498","brand_name":"\u54c8\u516d","cate_code":0,"def_url":{"hostId":"a","imageId":"7550666a391ac44bd9d0b67ff1e77941"},"purchase_way":130,"wx_purchase_way":"130","user_cateid":"10161000","imgsrc":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/100x100\/7550666a391ac44bd9d0b67ff1e77941.jpg"}]}');
        //   for(var i=0;i<tmpData.result.length;i++){
        //       tmpData.result[i].shop_price=(tmpData.result[i].shop_price/100).toFixed(2);
        //   }
        //   if(datas.source == "save"){
        //      var objData = {};
        //      objData.data = tmpData.result;
        //      objData.setting = datas;
        //      elementObj.showElement(objData);
        //   }else if(datas.source == "edit"){

        //     var tmpl = document.getElementById('tmp_select_goods_templete').innerHTML;
        //     var doTtmpl = doT.template(tmpl);
        //     $('.cate_goods_show_area').html(doTtmpl(tmpData.result));

        //   }else if(datas.source == "dialog"){

        //     $(".select_goods_list").html("");
        //     for(var i in tmpData.result){
        //       var data={};
        //       data.goods_id=tmpData.result[i].goods_id;
        //       data.goods_title=tmpData.result[i].goods_title;
        //       data.shop_price=tmpData.result[i].shop_price*100;
        //       data.specif_cation=tmpData.result[i].specif_cation;

        //       var tmpl = document.getElementById('select_product_list_templete').innerHTML;
        //       var doTtmpl = doT.template(tmpl);
        //       $(".select_goods_list").append(doTtmpl(data));
        //     }
        //     $(".select_goods_total").html(tmpData.result.length);
        //   }else if(datas.source == "init"){
        //      var objData = {};
        //      objData.data = tmpData.result;
        //      objData.setting = datas;
        //      elementObj.showEditElement(objData);
        //   }
        /*var urlStr  = "/product/product_batchGetProducts";
         var params = {};

         params.goods_ids = datas.goods_ids;
         params.order = datas.tmp_order;
         $.post(urlStr,params,function(data){
         var tmpData = JSON.parse(data);
         for(var i=0;i<tmpData.result.length;i++){
         tmpData.result[i].shop_price=(tmpData.result[i].shop_price/100).toFixed(2);
         }
         if(datas.source == "save"){
         var objData = {};
         objData.data = tmpData.result;
         objData.setting = datas;
         elementObj.showElement(objData);
         }else if(datas.source == "edit"){

         var tmpl = document.getElementById('tmp_select_goods_templete').innerHTML;
         var doTtmpl = doT.template(tmpl);
         $('.cate_goods_show_area').html(doTtmpl(tmpData.result));

         }else if(datas.source == "dialog"){

         $(".select_goods_list").html("");
         for(var i in tmpData.result){
         var data={};
         data.goods_id=tmpData.result[i].goods_id;
         data.goods_title=tmpData.result[i].goods_title;
         data.shop_price=tmpData.result[i].shop_price*100;
         data.specif_cation=tmpData.result[i].specif_cation;

         var tmpl = document.getElementById('select_product_list_templete').innerHTML;
         var doTtmpl = doT.template(tmpl);
         $(".select_goods_list").append(doTtmpl(data));
         }
         $(".select_goods_total").html(tmpData.result.length);
         }else if(datas.source == "init"){
         var objData = {};
         objData.data = tmpData.result;
         objData.setting = datas;
         elementObj.showEditElement(objData);
         }

         });*/

        var params = {};
        var ids = new String(datas.goods_ids);

        params.order = datas.tmp_order;


        var urlStr  = "/merchant/ecBgoodsList";

        $.post(urlStr+"?"+$.param(params),function(data){


            for(var i=0;i<data.goodsPage.list.length;i++){
                data.goodsPage.list[i].shopPrice=(data.goodsPage.list[i].shopPrice/100).toFixed(2);
            }
            if(datas.source == "save"){
                var objData = {};
                objData.data = data.goodsPage;
                objData.setting = datas;
                elementObj.showElement(objData);
            }else if(datas.source == "edit"){

                var tmpl = document.getElementById('tmp_select_goods_templete').innerHTML;
                var doTtmpl = doT.template(tmpl);
                $('.cate_goods_show_area').html(doTtmpl(data.goodsPage));

            }else if(datas.source == "dialog"){

                $(".select_goods_list").html("");
                for(var i in data.goodsPage.list){
                    var data={};
                    data.goods_id=data.goodsPage.list[i].goodsId;
                    data.goods_title=data.goodsPage.list[i].goodsTitle;
                    data.shop_price=data.goodsPage.list[i].shopPrice*10*10;
                    data.specif_cation=data.goodsPage.list[i].specifCation;

                    var tmpl = document.getElementById('select_product_list_templete').innerHTML;
                    var doTtmpl = doT.template(tmpl);
                    $(".select_goods_list").append(doTtmpl(data));
                }
                $(".select_goods_total").html(tmpData.result.length);
            }else if(datas.source == "init"){
                var objData = {};
                objData.data = data.goodsPage;
                objData.setting = datas;
                elementObj.showEditElement(objData);
            }

        });
    },
  //商品分类初始化函数
    getProductCategory:function(cate_id){
        var tmpData = JSON.parse('{"status":true,"result":{"current":1,"before":1,"next":1,"total_pages":1,"total_items":17,"items":[{"cate_id":"1","parent_id":"0","cate_code":"1000","cate_name":"\u4e2d\u897f\u836f\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:33","update_time":"2015-06-24 18:56:33","yb_cateid":"0","del_tag":"0"},{"cate_id":"153","parent_id":"0","cate_code":"1006","cate_name":"\u4e2d\u836f\/\u53c2\u8338","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"192","parent_id":"0","cate_code":"1002","cate_name":"\u4e2d\u8349\u836f","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"233","parent_id":"0","cate_code":"1001","cate_name":"\u533b\u7597\u5668\u68b0","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"298","parent_id":"0","cate_code":"1005","cate_name":"\u6bcd\u5a74\u7528\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"342","parent_id":"0","cate_code":"1003","cate_name":"\u6210\u4eba\u7528\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"408","parent_id":"0","cate_code":"1004","cate_name":"\u7f8e\u5bb9\u62a4\u80a4","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-06-24 18:56:34","update_time":"2015-06-24 18:56:34","yb_cateid":"0","del_tag":"0"},{"cate_id":"456","parent_id":"0","cate_code":"1007","cate_name":"\u513f\u7ae5\u7528\u836f","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2015-11-10 16:13:06","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"466","parent_id":"0","cate_code":"1008","cate_name":"\u4fdd\u5065\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-01-11 12:01:58","update_time":"2016-11-11 09:20:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"479","parent_id":"0","cate_code":"1013","cate_name":"\u98df\u54c1","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-11-08 09:52:03","update_time":"2016-11-08 09:52:03","yb_cateid":"0","del_tag":"0"},{"cate_id":"482","parent_id":"0","cate_code":"1014","cate_name":"\u706b\u9505","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-11-10 10:11:45","update_time":"2016-11-10 10:47:44","yb_cateid":"0","del_tag":"0"},{"cate_id":"491","parent_id":"0","cate_code":"1016","cate_name":"12.8\u4f18\u60e0","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-08 09:35:44","update_time":"2016-12-08 09:35:44","yb_cateid":"0","del_tag":"0"},{"cate_id":"492","parent_id":"0","cate_code":"1017","cate_name":"\u6d4b\u8bd5\u7a7a\u5206\u7c7b\u80fd\u6dfb\u52a0\u5417","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-08 09:42:09","update_time":"2016-12-08 09:42:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"511","parent_id":"0","cate_code":"1032","cate_name":"\u6d4b\u8bd5","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 15:28:59","update_time":"2016-12-15 15:28:59","yb_cateid":"0","del_tag":"0"},{"cate_id":"517","parent_id":"0","cate_code":"1034","cate_name":"test","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 15:55:09","update_time":"2016-12-15 15:55:09","yb_cateid":"0","del_tag":"0"},{"cate_id":"520","parent_id":"0","cate_code":"1036","cate_name":"\u5206\u9500\u7c7b\u76ee","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2016-12-15 18:25:11","update_time":"2016-12-15 18:25:11","yb_cateid":"0","del_tag":"0"},{"cate_id":"523","parent_id":"0","cate_code":"1037","cate_name":"\u65e5\u7528\u767e\u8d27","cate_sort":"9999","img_hash":"","cate_ishow":"0","create_time":"2017-01-06 11:44:14","update_time":"2017-01-06 11:44:14","yb_cateid":"0","del_tag":"0"}]}}');

        var tmpl = document.getElementById('tmp_select_cat_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('.cate_goods_show_area').html(doTtmpl(tmpData.result.items[0]));
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
    //图片轮播初始化函数
    getFocusAD:function(){
        var tmpData = JSON.parse('{"status":true,"result":[{"adv_id":"22","slide_oneimg":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/640x350\/8df31c68b7abc2b1ec2475d7ea439874.jpg","slide_oneurl":"","slide_sort":"1","slide_type":"1","ad_status":"1","platform_type":"120","create_time":"2017-01-22 20:35:49","update_time":"2017-01-22 20:35:49"},{"adv_id":"23","slide_oneimg":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/640x350\/b0215ec274691dfd252a324324215fd4.jpg","slide_oneurl":"","slide_sort":"2","slide_type":"1","ad_status":"1","platform_type":"120","create_time":"2017-01-22 20:36:09","update_time":"2017-01-22 20:36:09"},{"adv_id":"18","slide_oneimg":"http:\/\/img-test.51jk.com\/\/display\/public\/100063\/10\/0\/10\/0\/640x350\/6f13a6b0bc5fef3f5680b7bebf892c0a.jpg","slide_oneurl":"","slide_sort":"5","slide_type":"1","ad_status":"1","platform_type":"120","create_time":"2016-07-21 16:25:08","update_time":"2016-07-21 16:25:08"}]}');

        var tmpl = document.getElementById('sliders_area_templete').innerHTML;

        var doTtmpl = doT.template(tmpl);

        $(".sliders_area").html(doTtmpl(tmpData));
        //使用的swiper实现的图片轮播
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',//分页器
            slidesPerView: 1,
            paginationClickable: true,
            loop: true, /*形成环路（即：可以从最后一张图跳转到第一张图*/
            autoplayDisableOnInteraction: false,//移动端手指滑动
            autoplay: 6000//可选选项，自动滑动
        });

        /* var urlStr  = "/product/getFocusAD";
         var params = {};

         $.post(urlStr,params,function(data){
         var tmpData = JSON.parse(data);

         var tmpl = document.getElementById('sliders_area_templete').innerHTML;

         var doTtmpl = doT.template(tmpl);

         $(".sliders_area").html(doTtmpl(tmpData));

         var swiper = new Swiper('.swiper-container', {
         pagination: '.swiper-pagination',
         slidesPerView: 1,
         paginationClickable: true,
         loop: true,
         autoplayDisableOnInteraction: false,
         autoplay: 6000//可选选项，自动滑动
         });

         });*/
    },
  //商品图标初始化函数
    getIconLink:function(){
        var tmpData = JSON.parse('{"status":true,"result":[{"linkId":"27","image":"http:\/\/img-test.51jk.com\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/43b71983669dc36c572b1e7d8bbffe83.jpg","title":"test1","url":"\/product\/index?cate_id=518"},{"linkId":"21","image":"http:\/\/img-test.51jk.com\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/7da1f6ff979f59275a0aa2c8c6ff4349.jpg","title":"\u6bcd\u5a74\u7528\u54c1","url":"\/product\/index?cate_id=298"},{"linkId":"22","image":"http:\/\/img-test.51jk.com\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/abd7fefb7aa54cb29ee18bdb97377d51.jpg","title":"\u4e2d\u836f\/\u53c2\u8338","url":"\/product\/index?cate_id=153"},{"linkId":"23","image":"http:\/\/img-test.51jk.com\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/14553a8810e25293e63586d8820ffbd2.jpg","title":"\u6210\u4eba\u7528\u54c1","url":"\/product\/index?cate_id=342"},{"linkId":"25","image":"http:\/\/img-test.51jk.com\/\/display\/public\/100001\/10\/0\/10\/0\/40x40\/822a34329e04f9a8425f8de5da5d18b9.jpg","title":"1201","url":"http:\/\/100166.weixin.51jk.com\/product\/detail?goods_ids=207"}],"iconLinkRow":3}');

        var tmpl = document.getElementById('iconlink_area_templete').innerHTML;

        var doTtmpl = doT.template(tmpl);

        $(".icon_link_area").html(doTtmpl(tmpData));
        /*var urlStr  = "/product/getIconLink";
         var params = {};

         $.post(urlStr,params,function(data){
         var tmpData = JSON.parse(data);

         var tmpl = document.getElementById('iconlink_area_templete').innerHTML;

         var doTtmpl = doT.template(tmpl);

         $(".icon_link_area").html(doTtmpl(tmpData));

         });
         */
    }
}
