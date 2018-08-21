/**
 * Created by 卡西 on 2016/4/7.
 */
define(['core','service/pagin'],function(core,pagin){

    var pagesize = 15;

    /**
     * 设置页码
     * @param val
     */
    var setPageSize = function(val)
    {
        pagesize = val;
    };

    var getSendList = function(num) {

        var postdata = {}
        var pagesize =  $('.page-size-sel').val() || 15;

        postdata.pagesize = pagesize;
        postdata.page = num || 1;
        postdata.trigger_title = $('#trigger_title').val();
        postdata.trigger_state = $('#trigger_state').val();
        postdata.trigger_code = $('#trigger_code').val();

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/coupon1/triggerList',
            success:function(e){
                // 最少需要加载1.5S
                if(new Date() - idxTime < 1500) {
                    setTimeout(function() {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }
                $("#send_table").empty();
                var data = JSON.parse(e);

                if(data.status==true) {

                    var tpl =  $("#send_list_templete").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#send_table").html(html);
                    //翻页条码
                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function(num) {
                        getSendList(num);
                    });
                }else{
                    $("#send_table").html("<tr><td colspan='6' style='text-align: center'>" + data.result.msg + "</td></tr>");
                    $(".sui-text-right").hide();
                }
            }
        });
    }


    return {
        getSendList: getSendList,
        setPageSize: setPageSize
    };
});
