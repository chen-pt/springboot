function initPrice(){require(["price"],function(e){e.showPrice(),e.getProductCategory(),$(document).on("click","#lee_add_classify a",function(e){$("#lee_add_classify_a").html('<i class="caret"></i>'+$(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")),$("input[name='classify']").val($(this).attr("data"))}),$(document).on("click",".btn-store-price",function(){var e=$(this).parents("tr").find("input[name='goods_id']").val(),t=$(this).parents("tr").find("td:eq(2) span").html(),i=$(this).parents("tr").find(".img-title").html(),n=$(this).parents("tr").find("td:eq(3)").html();$("#store_price_title").html(i),$("#store_price").val(t),$("#goods_id").val(e),$("#market_price").html(n),$("#Revise-modal").modal("show")})})}function index_searchPrice(){require(["price"],function(e){e.showPrice()})}function store_price_btn(){require(["price"],function(e){e.showUpdateStorePrice()})}function AllRegain_btn(){require(["price"],function(e){$.confirm({body:"确定后，会将所有门店设置的价格重置",okHide:function(){e.showResumeStorePrice(900)}})})}function Regain_btn(e){require(["price"],function(t){layer.msg("恢复成功！",{time:500,end:function(){t.showResumeStorePrice(100,e)}})})}function Refresh_btn(e){require(["price"],function(t){t.showPriceProductDetail(e)})}define("core",[],function(){function submitPwd(e){$.ajax({type:"POST",data:e,url:getHost()+"/member/updatePwd",success:function(e){var t=JSON.parse(e);console.log(t),t.status?(layer.msg("密码修改成功！"),$("#pwd-modal").modal("hide")):layer.msg("密码修改失败！")}})}var doTinit=function(){doT.templateSettings={evaluate:/\[\%([\s\S]+?)\%\]/g,interpolate:/\[\%=([\s\S]+?)\%\]/g,encode:/\[\%!([\s\S]+?)\%\]/g,use:/\[\%#([\s\S]+?)\%\]/g,define:/\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,conditional:/\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,iterate:/\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,varname:"it",strip:!0,append:!0,selfcontained:!1}},getHost=function(){var e=location.origin||location.protocol+"//"+location.hostname+(80==location.port?"":":"+location.port);return e},exeError=function(e,t,i,n){if("http"==e.type){var a="status:"+t.status+" state:"+t.readyState+" text:"+i+" err:"+JSON.stringify(n);e.desc=a}console.log("错误处理："+JSON.stringify(e))},formatDate=function(){Date.prototype.format=function(e){e||(e="yyyy-MM-dd hh:mm:ss");var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in t)new RegExp("("+i+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?t[i]:("00"+t[i]).substr((""+t[i]).length)));return e}},ReConsole=function(){window.console=window.console||function(){var e={};return e.log=e.warn=e.debug=e.info=e.error=e.time=e.dir=e.profile=e.clear=e.exception=e.trace=e.assert=function(){},e}()},isExitsFunction=function(funcName){try{if("function"==typeof eval(funcName))return!0}catch(e){}return!1},isExitsVariable=function(e){try{return"undefined"!=typeof e}catch(t){}return!1};return $(document).on("click","#branner .download",function(){try{localStorage.setItem("is_show",!0)}catch(e){}}),$(document).on("click","#upgrade-bar .sui-close",function(){try{localStorage.setItem("upgrade-version",CURRENT_VERSION)}catch(e){}}),$(document).on("shown","#pwd-modal",function(){$("#pwd-form").validate({success:function(e){var t=e.serializeArray();submitPwd(t)}})}),$(document).on("hidden","#pwd-modal",function(){$("#pwd-form")[0].reset()}),$(function(){$.ajax({type:"get",url:getHost()+"/helpful/upgrade",dataType:"json"}).done(function(e){return e.status&&e.result.items.length?($("#upgrade-bar").find(".upgrade-title").empty().append(e.result.items[0].title).end().show(),$("#upgrade").find(".upgrade-content").empty().append(e.result.items[0].content),void(200==e.result.items[0].tips_type&&$("#upgrade-bar").hide())):null})}),$(function(){$.ajax({type:"POST",url:getHost()+"/store/getGrcode",success:function(e){1!=e&&$("#grcode").attr("src",e)},error:function(e,t){console.log("status:"+e.status),console.log("state:"+e.readyState),console.log("text:"+t)}})}),{doTinit:doTinit,getHost:getHost,exeError:exeError,formatDate:formatDate,ReConsole:ReConsole,isExitsVariable:isExitsVariable,isExitsFunction:isExitsFunction}}),define("service/pagin",[],function(){return $.fn.pagination.Constructor.prototype=$.extend($.fn.pagination.Constructor.prototype,{_drawCtrl:function(){var e="";if(this.pageSize&&this.itemsCount){var t=$('<select class="page-size-sel"></select>'),i=[15,30,50,100];for(var n in i){var a='<option value="'+i[n]+'"'+(this.pageSize==i[n]?"selected":"")+">"+i[n]+"</option>";t.append(a)}e+=t.prop("outerHTML"),e+="<div>&nbsp;"+("itemsCount"==this.displayInfoType?"<span>共"+this.itemsCount+"条</span>&nbsp;":"<span>共"+this.pages+"页</span>&nbsp;")+"("+this.itemsCount+'条记录)<span>&nbsp;到&nbsp;<input type="text" class="page-num"/><button class="page-confirm">确定</button>&nbsp;页</span></div>'}else e="<div>&nbsp;"+("itemsCount"==this.displayInfoType?"<span>共"+this.itemsCount+"条</span>&nbsp;":"<span>共"+this.pages+"页</span>&nbsp;")+'<span>&nbsp;到&nbsp;<input type="text" class="page-num"/><button class="page-confirm">确定</button>&nbsp;页</span></div>';return e},updateConfig:function(e){e.pageSize&&(this.pageSize=e.pageSize)}}),function(e,t,i,n,a,s,r){if(t=t||1,i=i||1,i||(i=Math.ceil(a/n)),"object"!=typeof e)var o=$(e);else o=e;o.data("sui-pagination",""),o.pagination({pages:i,styleClass:["pagination-large","pagination-right"],showCtrl:!0,displayPage:6,pageSize:n,itemsCount:a,currentPage:t,onSelect:s}),o.pagination("updatePages",~~i,~~t),o.data("evt-init")||(o.on("change",".page-size-sel",function(){o.pagination("updateConfig",{pageSize:+this.value}),s(1)}),o.data("evt-init",1))}}),define("price",["core","service/pagin"],function(e,t){var i=function(n,a){var s={},r=$(".page-size-sel").val()||15;s.pageSize=r,s.pageno=a,s.drug_name=$("#drug_name").val(),s.approval_number=$("#approval_number").val(),s.cate_id=$("input[name='classify']").val(),s.platform_type=$("#platform_type").val();var o=layer.load(1,{shade:[.1,"#fff"]}),l=new Date;$.ajax({type:"POST",data:s,url:e.getHost()+"/price/getPrice",success:function(e){new Date-l<1500?setTimeout(function(){layer.close(o)},1500-(new Date-l)):layer.close(o);var a=JSON.parse(e);if(a.status){var s=$("#list_template").html(),c=doT.template(s),u=c(a);$("#price-list").html(u),t("#pagelsit",+a.result.current,a.result.total_pages,r,a.result.total_items,function(e){i(n,e)}),$("#pagelsit").show()}else $("#price-list").html('<tr><td colspan="8" class="center">'+a.result.msg+"</td></tr>"),$("#pagelsit").hide()}})},n=function(){var t={};t.cate_id="",t.cate_ishow="",t.del_tag="",t.parent_id="",$("#lee_add_classify").empty();var i=e.getHost()+"/price/product_category_get";$.post(i,t,function(e){var t=JSON.parse(e);if(t.status)for(var i=0,n=t.result.length;n>i;i++)if(t.result[i].children){$("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+t.result[i].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+t.result[i].cate_name+'</span></a><ul class="sui-dropdown-menu"><ul></li>');for(var a=0,s=t.result[i].children.length;s>a;a++)if(t.result[i].children[a].children){$("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+t.result[i].children[a].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+t.result[i].children[a].cate_name+'</span></a><ul class="sui-dropdown-menu"></ul></li>');for(var r=0,o=t.result[i].children[a].children.length;o>r;r++)$("#lee_add_classify>li:eq("+i+")>ul>li:eq("+a+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+t.result[i].children[a].children[r].cate_id+'">'+t.result[i].children[a].children[r].cate_name+"</a></li>")}else $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+t.result[i].children[a].cate_id+'">'+t.result[i].children[a].cate_name+"</a></li>")}else $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+t.result[i].cate_id+'">'+t.result[i].cate_name+"</a></li>");$("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>')})},a=function(){var t={};return t.goods_id=$("#goods_id").val(),t.store_price=$("#store_price").val(),t.store_price>1e7?void layer.msg("提交失败！"):void $.ajax({type:"POST",data:t,url:e.getHost()+"/price/updateStorePrice",success:function(e){var t=JSON.parse(e);t.status?layer.msg("提交成功!",{time:500,end:function(){window.location.reload()}}):$.alert({title:"温馨提示!",body:"提交失败！"})}})},s=function(t,i){var n={};n.type=t,n.goods_id=i,$.ajax({type:"POST",data:n,url:e.getHost()+"/price/resumeStorePrice",success:function(e){var t=JSON.parse(e);t.status?window.location.reload():$.alert({title:"温馨提示!",body:"未设置门店的价格"})}})},r=function(t){var i={};i.product_id=t,$.ajax({type:"POST",data:i,url:e.getHost()+"/price/priceProductDetail",success:function(e){var t=JSON.parse(e);t.status?layer.msg("刷新成功！",{time:1e3,end:function(){window.location.reload()}}):$.alert({title:"温馨提示!",body:"刷新失败！"})}})};return{showPrice:i,getProductCategory:n,showUpdateStorePrice:a,showResumeStorePrice:s,showPriceProductDetail:r}}),require.config({paths:{core:"../lovejs/core",tools:"../lovejs/tools",price:"service/price"}}),$(function(){require(["core"],function(e){e.doTinit(),e.ReConsole()});var e=window.location.pathname;switch(e){case"/price/index":initPrice()}}),define("price_index",function(){});