/**
 * Created by vv on 2015/11/19.
 */

define(['core', 'service/pagin'],function(core,pagin){

    var showPrice = function(opt,num) {

        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pageSize = pagesize;
        postdata.pageno = num;
        postdata.drug_name = $('#drug_name').val();
        postdata.approval_number = $('#approval_number').val();
        postdata.cate_id = $("input[name='classify']").val();
        postdata.platform_type = $('#platform_type').val();

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            type: 'POST',

            data: postdata,

            url: core.getHost()+ '/price/getPrice',

            success:function(e) {
                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                var data = JSON.parse(e);

                if(data.status) {

                    var tpl =  $("#list_template").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#price-list").html(html);

                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        showPrice(opt,num);
                    });
                    $('#pagelsit').show();
                }else{
                    $("#price-list").html('<tr><td colspan="8" class="center">'+ data.result.msg +'</td></tr>');
                    $('#pagelsit').hide();
                }
            }
        });
    };

    //获取分类
    var getProductCategory = function ()
    {

        var datas={};

        datas.cate_id="";
        datas.cate_ishow="";
        datas.del_tag="";
        datas.parent_id="";

        $("#lee_add_classify").empty();

        var url = core.getHost()+"/price/product_category_get";

        $.post(url,datas,function(e){

            var data = JSON.parse(e);

            if(data.status)
            {
                for(var i=0,len=data.result.length;i<len;i++)
                {
                    if(data.result[i].children)
                    {
                        $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data.result[i].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data.result[i].cate_name+'</span></a><ul class="sui-dropdown-menu"><ul></li>');

                        for(var j=0,j_len=data.result[i].children.length;j<j_len;j++)
                        {
                            if(data.result[i].children[j].children)
                            {
                                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data.result[i].children[j].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data.result[i].children[j].cate_name+'</span></a><ul class="sui-dropdown-menu"></ul></li>');

                                for(var k=0,k_len=data.result[i].children[j].children.length;k<k_len;k++)
                                {
                                    $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data.result[i].children[j].children[k].cate_id+'">'+data.result[i].children[j].children[k].cate_name+'</a></li>');
                                }
                            }else{
                                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data.result[i].children[j].cate_id+'">'+data.result[i].children[j].cate_name+'</a></li>');
                            }
                        }

                    }else{

                        $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data.result[i].cate_id+'">'+data.result[i].cate_name+'</a></li>');
                    }
                }
            }
            $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');

        });
    };

    //价格修改
    var showUpdateStorePrice = function ()
    {
        var postdata = {};

        postdata.goods_id = $('#goods_id').val();
        postdata.store_price = $('#store_price').val();
        if(postdata.store_price > 10000000) {
            layer.msg('提交失败！');
            return;
        }
        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/store/updateYBPrice',

            success:function(e){

              if(e=="success") {
                    layer.msg('提交成功!', {'time': 500, 'end': function() {
                        window.location.reload();
                    }});
                }else{
                    $.alert({'title':'温馨提示!','body':'提交失败！'});
                }
            }
        });
    };


    //恢复门店价格
    var showResumeStorePrice = function (type,goods_id) {
        var postdata = {};

        postdata.type = type;
        postdata.goods_id = goods_id;

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/store/resumeStorePriceAction',

            success:function(e){

                if(e=="success") {
                    window.location.reload();
                }else{
                    $.alert({'title':'温馨提示!','body':'未设置门店的价格'});
                }
            }
        });
    };

    //价格刷新
    var showPriceProductDetail = function(goods_id) {
        var postdata = {};

        postdata.product_id = goods_id;

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/price/priceProductDetail',

            success:function(e){

                var data = JSON.parse(e);

                if(data.status) {
                    layer.msg('刷新成功！', {'time': 1000, 'end': function() {
                        window.location.reload();
                    }});
                }else{
                    $.alert({'title':'温馨提示!','body':'刷新失败！'});
                }
            }
        });
    };

    return {
        showPrice: showPrice,
        getProductCategory:getProductCategory,
        showUpdateStorePrice: showUpdateStorePrice,
        showResumeStorePrice:showResumeStorePrice,
        showPriceProductDetail:showPriceProductDetail
    }
});
