// $(document).ready(function(){
//    productObj.doTinit();
//
//    $(".goods_linker_btn").live("click",function(){
//         productObj.source_btn = $(this).attr("data-desc");
//         loadEvt.loadProductDialog2();
//    });
//    $(".cat_linker_btn").live("click",function(){
//         productObj.source_btn = $(this).attr("data-desc");
//         loadEvt.loadCatDialog();
//    });
//    /***商品列表的各种搜索***/
// 	$(".search_goods_btn").click(function(){
//     productObj.current_goods_page = 1;
// 		productObj.getProductList();
// 	});
// 	$('[name="cart_id_first"]').change(function(){
// 		  productObj.getProductCategory(2);
//       productObj.cur_cate_id = $(this).val();
//       productObj.cur_cate_name = $(this).find("option:selected").text();
// 	});
// 	$('[name="cart_id_second"]').change(function(){
// 		  productObj.getProductCategory(3);
//       productObj.cur_cate_id = $(this).val();
//       productObj.cur_cate_name = $(this).find("option:selected").text();
// 	});
//    $('[name="cart_id_third"]').change(function(){
//       productObj.cur_cate_id = $(this).val();
//       productObj.cur_cate_name = $(this).find("option:selected").text();
//    });
//
//    /**上一页**/
//   $('.pre_page').click(function(){
//       if(productObj.current_goods_page>1){
//         $(".select_all_goods_btn").attr("checked",false);
//         $(".select_all_goods_btn").parent().removeClass("checked"); 
//
//         productObj.current_goods_page--;
//         productObj.getProductList();
//       }
//    });
//
//  /**下一页**/
//   $('.next_page').click(function(){
//       if(productObj.current_goods_page<productObj.total_goods_page){
//         $(".select_all_goods_btn").attr("checked",false);
//         $(".select_all_goods_btn").parent().removeClass("checked"); 
//
//         productObj.current_goods_page++;
//         productObj.getProductList();
//       }
//    });
//
//    /****下面是选择商品的一大块内容****/
//     $(".select_all_goods_btn").click(function(){
//         var curStatus=$(this).attr("checked")?true:false;
//         $(".goods_list input[type='checkbox']").each(function(){
//             $(this).attr("checked",curStatus);
//             curStatus?$(this).parent().addClass("checked"):$(this).parent().removeClass("checked");
//         });
//     });
//
//     $(".goods_list input[type='checkbox']").live("click",function(){
//         if(!$(this).attr("checked")){
//             $(".select_all_goods_btn").attr("checked",false);
//             $(".select_all_goods_btn").parent().removeClass("checked"); 
//         }else if($(".goods_list input[type='checkbox']").length==$(".goods_list input[type='checkbox']:checked").length){
//             $(".select_all_goods_btn").attr("checked",true);
//             $(".select_all_goods_btn").parent().addClass("checked"); 
//
//         }
//     });
//
//     /**
//      * 批量移除全选
//      */
//     $(".unselect_all_goods_btn").click(function(){
//         var curStatus=$(this).attr("checked")?true:false;
//         $(".select_goods_list input[type='checkbox']").each(function(){
//             $(this).attr("checked",curStatus);
//         });
//     });
//     $(".putaway_unselect_goods_btn").click(function(){
//         $(".select_goods_list input[type='checkbox']:checked").each(function(){
//             $(this).parents(".can_del_tr").remove();
//         });
//         $(".select_goods_total").html($(".select_goods_list tr").length);
//     });
//
//
//     $(".select_goods_list input[type='checkbox']").live("click",function(){
//         if(!$(this).attr("checked")){
//             $(".unselect_all_goods_btn").attr("checked",false);
//             $(".unselect_all_goods_btn").parent().removeClass("checked");
//         }else if($(".select_goods_list input[type='checkbox']").length==$(".select_goods_list input[type='checkbox']:checked").length){
//             $(".unselect_all_goods_btn").attr("checked",true);
//             $(".unselect_all_goods_btn").parent().addClass("checked");
//
//         }
//     });
//
//     $(".putaway_select_goods_btn").click(function(){
//         $(".goods_list input[type='checkbox']:checked").each(function(){
//             var index =  $(this).index(".goods_list input[type='checkbox']");
//             var data={};
//             data.goods_id=$(".goods_list").find('[name="goods_id"]').eq(index).val();
//             data.goods_title=$(".goods_list").find('[name="goods_title"]').eq(index).val();
//             data.shop_price=$(".goods_list").find('[name="shop_price"]').eq(index).val();
//             data.specif_cation=$(".goods_list").find('[name="specif_cation"]').eq(index).val();
//             if(!$('.select_goods_list [name="goods_id"][value="'+data.goods_id+'"]').val()){
//                 var tmpl = document.getElementById('select_product_list_templete').innerHTML;
//                 var doTtmpl = doT.template(tmpl);
//                 $(".select_goods_list").append(doTtmpl(data));
//             }
//         });
//         $(".select_goods_total").html($(".select_goods_list tr").length);
//     });
//     /**
//      * 参加
//      */
//     $(".select_goods_btn").live("click",function(){
//         var data={};
//         data.goods_id=$(this).parent().find('[name="goods_id"]').val();
//         data.goods_title=$(this).parent().find('[name="goods_title"]').val();
//         data.shop_price=$(this).parent().find('[name="shop_price"]').val();
//         data.specif_cation=$(this).parent().find('[name="specif_cation"]').val();
//         if(!$('.select_goods_list [name="goods_id"][value="'+data.goods_id+'"]').val()){
//             var tmpl = document.getElementById('select_product_list_templete').innerHTML;
//             var doTtmpl = doT.template(tmpl);
//             $(".select_goods_list").append(doTtmpl(data));
//             $(".select_goods_total").html($(".select_goods_list tr").length);
//         }else{
//             alert("该商品已被选择！");
//         }
//     });
//     /**
//      * 移除
//      */
//     $(".unselect_goods_btn").live("click",function(){
//         $(this).parents(".can_del_tr").remove();
//         $(".select_goods_total").html($(".select_goods_list tr").length);
//     });
//
//     /**图片上传**/
//     $("#btnUpImg").change(function(e) {
//           Array.prototype.forEach.call(e.target.files, function(f) {
//               productObj.upLoadImg(f);
//           });
//       });
//
//     /**选择图标
//     */
//     $(".tile").live("click",function() {
//         $(".selected").removeClass("selected");
//         $(this).addClass("selected");
//     });
//
//     /**各种弹框的保存按钮**/
//     $(".add_one_goods_btn").live("click",function(){
//         var tmp_goods_id  = $(this).parent().find('[name="goods_id"]').val();
//         var baseUrl = "/product/detail";
//        
//         if(productObj.source_btn == "goods_url"){
//             $('[data-desc="'+productObj.source_btn+'"]').parents("form").find("[name='pic-text-url']").val(baseUrl+"?goods_ids="+tmp_goods_id);
//         }else if(productObj.source_btn == "goods_url_dialog"){
//             $('[data-desc="'+productObj.source_btn+'"]').parents("form").find("[name='dialog_link_url']").val(baseUrl+"?goods_ids="+tmp_goods_id);
//         }
//         $("#modal-goods-render").modal('hide');
//     });
//
//     $(".save-cat-btn").click(function(){
//         if(!productObj.cur_cate_id){
//           alert("请选择至少一个分类！");
//           return false;
//         }
//         productObj.cateHasGoods(productObj.cur_cate_id);
//     });
//
//      $(".save-goods-btn").click(function(){
//         if($(".select_goods_list [name='goods_id']").length<1){
//           alert("暂未添加商品。");
//           return false;
//         }
//
//         if(productObj.source_btn == "goods_name"){
//           var tmpData = [];
//           var num = 0;
//           $(".select_goods_list [name='goods_id']").each(function(){
//               tmpData[num] = {};
//               tmpData[num].goods_title = $(this).parent().find('[name="goods_title"]').val(); 
//               tmpData[num].shop_price = $(this).parent().find('[name="shop_price"]').val(); 
//               tmpData[num].specif_cation = $(this).parent().find('[name="specif_cation"]').val(); 
//               tmpData[num++].goods_id = $(this).val(); 
//           });
//          
//           var tmpl = document.getElementById('tmp_select_goods_templete').innerHTML;
//           var doTtmpl = doT.template(tmpl);
//           $('[data-desc="'+productObj.source_btn+'"]').parent().html(doTtmpl(tmpData));
//         }
//
//         $("#modal-goods-render").modal('hide');
//     });
//      $(".save-pic-btn").click(function(){
//           if($(".tmp_pic_a img").length<1){
//             alert('请上传图片后再做保存！');
//               return;
//           }
//           if($(".tmp_pic_a img").attr("src").indexOf('/templates/views/resource/aweb/img/loading.gif')>-1){
//               alert('图片正在上传中，请等上传完成后再进行保存！');
//               return;
//           }
//           var imgsrc = $(".tmp_pic_a img").attr("src").replace(/[0-9]+x[0-9]+/,'608x608');
//           var linkUrl = encodeURI($('[name="dialog_link_url"]').val());
//           $(".add_pic_btn[data-img-btn-id='"+ productObj.source_img_btn_id +"']").html("<div class='img_shade lee_hide'>修改</div><img src='"+imgsrc+"' style='width:100%;' data-link='"+linkUrl+"' />").addClass("pic_btn");
//
//           $("#modal-pic-render").modal('hide');
//      });
//      $(".save-icon-btn").click(function(){
//           var icon = $(".tiles").find(".selected");
//           if (icon.size() <= 0) {
//               alert("请选择一个后保存!");
//               return false;
//           }
//
//           var iconID = icon.attr("data-id");
//
//           $(".preViewIcon").attr("data-icon-id",iconID);
//           $(".preViewIcon").attr("src",icon.find("[name='icon_img_url']").attr("src"));
//
//           $("#modal-icons-render").modal('hide');
//      });
//
// });
//
// /***事件整理****/
// var loadEvt = {
//   loadProductDialog1:function(){
//       $("#modal-goods-render").modal('show');
//       productObj.parent_form = $("#modal-goods-render");
//       $(".select_goods_table").removeClass("lee_hide");
//       $(".select_goods_table_one").addClass("lee_hide");
//       productObj.dialog_type = 1;
//       productObj.per_goods_page=100;
//       productObj.cur_cate_id = "";
//       productObj.getProductCategory(1);
//       productObj.getProductList();
//   },
//   loadProductDialog2:function(){
//         $("#modal-goods-render").modal('show');
//         productObj.parent_form = $("#modal-goods-render");
//         $(".select_goods_table").addClass("lee_hide");
//         $(".select_goods_table_one").removeClass("lee_hide");
//         productObj.dialog_type = 2;
//         productObj.per_goods_page=10;
//         productObj.cur_cate_id = "";
//         productObj.getProductCategory(1);
//         productObj.getProductList();
//   },
//   loadCatDialog:function(){
//         $("#modal-cat-render").modal('show');
//         productObj.parent_form = $("#modal-cat-render");
//         productObj.cur_cate_id = "";
//         productObj.getProductCategory(1);
//   },
//   loadUploadImg:function(){
//       $("#modal-pic-render").modal('show');
//       productObj.parent_form = $("#modal-pic-render");
//   },
//   loadIconDialog:function(){
//      $("#modal-icons-render").modal('show');
//       productObj.parent_form = $("#modal-icons-render");
//       productObj.getIcon();
//   }
// };
// /****后台数据调取api****/
// var productObj = {
//   dialog_type:1, /**1、加载选择多个商品的框,2、加载选择一个商品的框**/
// 	current_goods_page:1, /**加载商品列表当前页码**/
//   per_goods_page:100,/**加载商品列表每页数量**/
//   total_goods_page:1,/**加载商品列表总页数**/
//   cur_cate_id:"",/**加载商品列表分类id**/
//   cur_cate_name:"",/**加载商品列表分类名**/
//   parent_form:"",  /**需要调用的弹框**/
//   source_btn:"", /**事件来源控件**/
//   source_img_btn_id:"", /****图片按钮来源**/
//   getProductList:function(){
//    		var cate_id = productObj.cur_cate_id;
//    		var goods_title = $('[name="keyword"]').val();
//    		var goods_code = $('[name="goods_code"]').val();
//    		var goods_price_s = $('[name="goods_price_s"]').val();
//    		var goods_price_b = $('[name="goods_price_b"]').val();
//
//    		var urlStr  = "/jk51b//get_product_list";
//    		var params = {};
//
//    		if(cate_id)params.cate_id = cate_id;
//    		if(goods_title)params.goods_title = goods_title;
//    		if(goods_code)params.goods_code = goods_code;
//
//    		if(!goods_price_s)goods_price_s = 0; else goods_price_s*=100;
//    		if(!goods_price_b)goods_price_b = 99999999; else goods_price_b*=100;
//
//    		params.shop_price = goods_price_s +","+ goods_price_b;
//    		params.current_page = productObj.current_goods_page;
//       params.per_page = productObj.per_goods_page;
//
//
//    		$.post(urlStr,params,function(data){
//              var dataArr = JSON.parse(data);
//              if(productObj.dialog_type == 1){
//                   var tmpl = document.getElementById('product_list_templete').innerHTML;
//                   var doTtmpl = doT.template(tmpl);
//                   $(".goods_list").html(doTtmpl(dataArr));
//                   $("#modal-goods-render .modal-footer").removeClass("lee_hide");
//               }else{
//                  $("#select_goods_one_list").empty();
//                  var tmpl = document.getElementById('product_list_select_one_templete').innerHTML;
//                  var doTtmpl = doT.template(tmpl);
//                  $(".select_goods_one_list").html(doTtmpl(dataArr));
//                   $("#modal-goods-render .modal-footer").addClass("lee_hide");
//               }
//              if(dataArr.status){
//                   productObj.total_goods_page = dataArr.result.total_pages;
//                  
//                   $(".goods_total").html(dataArr.result.total_items);
//                   $(".cur_goods_list_page").html(productObj.current_goods_page);
//                   $(".total_goods_list_page").html(productObj.total_goods_page);
//              }else{
//                   productObj.total_goods_page = 1;
//                  
//                   $(".goods_total").html(0);
//                   $(".cur_goods_list_page").html(1);
//                   $(".total_goods_list_page").html(1);
//              }
//    		});
//    },
//    getProductCategory:function(menu_num){
//    		if(menu_num == 1){
//
//         var urlStr  = "/merchant/categories";
//    			var curObj = $(productObj.parent_form).find('[name="cart_id_first"]');
//         $(productObj.parent_form).find('[name="cart_id_second"]').html('<option value="">全部分类</option>');
//         $(productObj.parent_form).find('[name="cart_id_third"]').html('<option value="">全部分类</option>');
//
//         $(curObj).html('<option value="">全部分类</option>');
//         $.get(urlStr,function(data){
//                var items = data.result.children;
//                 for(var row in items){
//                   $(curObj).append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
//                 }
//         });
//
//         return;
//    		}else if(menu_num == 2){
//    			var parent_id = $(productObj.parent_form).find('[name="cart_id_first"]').val();
//
//         var urlStr = "/merchant/getbyparentid?parentId="+parent_id;
//    			var curObj = $(productObj.parent_form).find('[name="cart_id_second"]');
//         $(productObj.parent_form).find('[name="cart_id_third"]').html('<option value="">全部分类</option>');
//    		}else if(menu_num == 3){
//    			var parent_id = $(productObj.parent_form).find('[name="cart_id_second"]').val();
//
//         var urlStr = "/merchant/getbyparentid?parentId="+parent_id;
//    			var curObj = $(productObj.parent_form).find('[name="cart_id_third"]');
//    		}
//       $(curObj).html('<option value="">全部分类</option>');
//    		$.get(urlStr,function(data){
//             var items =JSON.parse(data.data);
//         			for(var row in items){
//         				$(curObj).append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
//         			}
//    		});
//    },
//    cateHasGoods:function(cate_id){
//          var urlStr  = "/jk51b/get_product_list";
//
//          var params = {};
//          params.cate_id = cate_id;
//          params.per_page = 1;
//
//          $.post(urlStr,params,function(data){
//              var tmpData = JSON.parse(data);
//                
//                if(!tmpData.status || tmpData.result.items.length<1){
//                   alert("该分类没有商品，无法保存。");
//                   return false;
//                 }
//
//               var baseUrl = "/product/index";
//
//               if(productObj.source_btn == "cate_name"){
//                 var tmpData = {};
//                 tmpData.cate_id = productObj.cur_cate_id;
//                 tmpData.cate_name = productObj.cur_cate_name;
//
//                 var tmpl = document.getElementById('tmp_select_cat_templete').innerHTML;
//                 var doTtmpl = doT.template(tmpl);
//                 $('[data-desc="'+productObj.source_btn+'"]').parent().html(doTtmpl(tmpData));
//                
//               }else if(productObj.source_btn == "cate_url"){
//                   $('[data-desc="'+productObj.source_btn+'"]').parents("form").find("[name='pic-text-url']").val(baseUrl+"?cate_id="+productObj.cur_cate_id+"&cate_name="+productObj.cur_cate_name);
//               }else if(productObj.source_btn == "cate_url_dialog"){
//                   $('[data-desc="'+productObj.source_btn+'"]').parents("form").find("[name='dialog_link_url']").val(baseUrl+"?cate_id="+productObj.cur_cate_id+"&cate_name="+productObj.cur_cate_name);
//               }
//
//               $("#modal-cat-render").modal('hide');
//          });
//    },
//    upLoadImg:function(f){
//     $(".tmp_pic_a").html("<img src='/templates/views/resource/aweb/img/loading.gif' style='max-width:40px;max-height: 40px' />正在上传。。。");
//     var formData = new FormData();
//          formData.append("file",  f);
//          $.ajax({
//           url: '/merchant/localpictureUpload',
//            type: 'POST',
//            success: function(data){
//              console.log(data);
//              if(data.code == 200){
//                  $(".tmp_pic_a").html('<i class="sui-icon icon-upload" style="padding:5px;"></i>上传图片');
//                   $(".tmp_pic_a").html("<img src='"+data.data.url+"' style='max-width:40px;max-height: 40px' />修改图片");
//              }else{
//                  alert("图片上传失败！")
//              }
//
//            },
//            error: function(data){
//            },
//            data: formData,
//            cache: false,
//            contentType: false,
//            processData: false
//          });
//
//    },
//     upLoadIcon:function(f){
//        $(".preViewIcon").attr("src","/templates/views/resource/aweb/img/loading.gif");
//        var formData = new FormData();
//          formData.append("file",  f);
//          formData.append("flag","icon");
//          $.ajax({
//            url: '/merchant/localpictureUpload',
//            type: 'POST',
//            success: function(res){
//              console.log(res);
//              if(res.code == 200){
//                  $(".preViewIcon").attr("data-icon-id",res.data.iconId);
//                  $(".preViewIcon").attr("src",res.data.url.replace(/[0-9]+x[0-9]+/,'80x80'));
//                  //location.reload();
//              }else{
//                  alert("图片上传失败！")
//              }
//
//            },
//            error: function(data){
//            },
//            data: formData,
//            cache: false,
//            contentType: false,
//            processData: false
//          });
//      
//
//    },
//    getIcon:function(){
//       var params = {};
//       $(".tile .selected").removeClass("selected");
//       $.get("/merchant/WxIcongetlist",function(res){
//             if(res.code == 200){
//                 var data = res.data;
//                 var tmpl = document.getElementById('iconlib_templete').innerHTML;
//
//                 var doTtmpl = doT.template(tmpl);
//
//                  $(".iconlib-list").html(doTtmpl(data));
//             }else{
//                 $(".iconlib-list").html("暂无数据");
//             }
//
//         });
//    },
//    doTinit:function()
//    {
//        //配置定界符
//        doT.templateSettings = {
//          evaluate:    /\[\%([\s\S]+?)\%\]/g,
//          interpolate: /\[\%=([\s\S]+?)\%\]/g,
//          encode:      /\[\%!([\s\S]+?)\%\]/g,
//          use:         /\[\%#([\s\S]+?)\%\]/g,
//          define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
//          conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
//          iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
//          varname: 'it',
//          strip: true,
//          append: true,
//          selfcontained: false
//        };
//   }
// };
