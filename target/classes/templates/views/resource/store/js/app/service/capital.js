/**
 * Created by wt on 2015/7/20.
 */
define(['core','service/pagin'],function(core,pagin){

    var page_size = 15;

    /**
     * 设置页码
     * @param val
     */
    var setPageSize = function(val) {
        page_size = val;
    };

    /**
     * 订单展示
     */
    var showCapitals = function(opt,num) {
        var postdata = {};
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pagesize = pagesize;
        postdata.pageno = num;
        var flag=1;
        if(opt=='search') {
            postdata.trades_id = $('#tid').val();
            postdata.start = $('#start').val();
            postdata.end = $('#end').val();
            postdata.pay_style = $('#pay_style').val();
            postdata.platform_type = $('#platform_type').val();
            if(postdata.start==''||postdata.end=='') {
                $.alert({'title':'温馨提示!','body':'请输入查询日期!'});
                flag=0;
            }
            var OneMonth = postdata.end.substring(5,postdata.end.lastIndexOf ('-'));
            var OneDay = postdata.end.substring(postdata.end.length,postdata.end.lastIndexOf ('-')+1);
            var OneYear = postdata.end.substring(0,postdata.end.indexOf ('-'));
            var TwoMonth = postdata.start.substring(5,postdata.start.lastIndexOf ('-'));
            var TwoDay = postdata.start.substring(postdata.start.length,postdata.start.lastIndexOf ('-')+1);
            var TwoYear = postdata.start.substring(0,postdata.start.indexOf ('-'));
            var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
            var caa=Math.abs(cha);
            if(caa>90) {
                $.alert({'title':'温馨提示!','body':'最多一次查询90天范围内订单!'});
                flag=0;
            }
        }
        //console.log('postdata:'+JSON.stringify(postdata));
        if(flag==1){
            // 加载层
            var idx = layer.load(1, {
                shade: [0.1,'#fff']
            });
            //加载层时间
            var idxTime = new Date();
            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost()+ '/capital/getCapitals',
                success:function(e) {
                    var data = JSON.parse(e);
                    // 最少需要加载1.5S
                    if(new Date() - idxTime < 1500) {
                        setTimeout(function() {
                            layer.close(idx);
                        }, 1500 - (new Date() - idxTime));
                    } else {
                        layer.close(idx);
                    }
                    if(data.status==true) {
                        var tpl =  $("#list_template").html();
                        var doTtmpl = doT.template(tpl);
                        var html = doTtmpl(data);
                        $("#capital_list").html(html);
                        pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                            showCapitals(opt,num);
                        });
                    }else{
                        $("#capital_list").html('<tr><td colspan="7" style="text-align: center">'+ data.result.msg +'</td></tr>');
                        $('#pagelsit').html('');
                    }
                }
            });
        }
        console.log('展示');
    };
    var showtradeStatistics=function() {
        var postdata = {};
        postdata.store_id=$('#storeid').val();
        console.log('postdata:'+JSON.stringify(postdata));
        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/capital/gettradeStatistics',
            success:function(e){
                console.log('资金详情:'+e);
                var data = JSON.parse(e);
                if(data.status==true) {
                    var tpl =  $("#list_template2").html();
                    var doTtmpl = doT.template(tpl);
                    var html = doTtmpl(data);
                    $("#total").html(html);
                }else{
                    $.alert({'title':'温馨提示!','body':data.result.msg});
                }
            }
        });
        console.log('展示');
    };
    return{
        showCapitals:showCapitals,
        showtradeStatistics:showtradeStatistics,
        setPageSize:setPageSize
    };
});