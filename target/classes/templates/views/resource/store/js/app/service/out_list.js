/**
 * Created by 卡西 on 2016/7/25.
 */
define(['core'],function (core) {
    var mod ={}
    //数据面板
    mod.datamodalout = function(){
        var type = $("#out_type").val();
        var url = core.getHost() + '/export/tongjiout';
        // var url = core.getHost()+ "/admin/datastatistics/get_modal_dataTwo";
        var datas={}
        datas.type = type;
        $('.modal_export1').html("<span style='text-align: center;font-size: 15px;'>报表正在生成中，请耐心等待一会。</span>");
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            console.log(data);

            if(data){
                $('.modal_export1').html('<span style="font-size: 15px">报表已经生成，</span><a style="font-size: 15px" href="javascript:void(0)" class="download_address1" >点击下载报表</a>');
                $('.download_address1').attr("href",data.addr);
            }
        })
    }
    //新增订单
    mod.new_orderout = function(){
        var type = $("#out_type").val();
        var url = core.getHost() + '/export/NewOrderOutlist';//这里改方法名
        // var url = core.getHost()+ "/admin/datastatistics/get_modal_dataTwo";success_orderout
        var datas={}
        datas.type = type;
        $('.modal_export2').html("<span style='text-align: center;font-size: 15px;'>报表正在生成中，请耐心等待一会。</span>");
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            console.log(data);

            if(data){
                $('.modal_export2').html('<span style="font-size: 15px">报表已经生成，</span><a style="font-size: 15px" href="javascript:void(0)" class="download_address1" >点击下载报表</a>');
                $('.download_address1').attr("href",data.addr);
            }
        })
    }
    //完成订单
    mod.success_orderout = function(){
        var type = $("#out_type").val();
        var url = core.getHost() + '/export/SuccessOrderOutlist';//这里改方法名
        // var url = core.getHost()+ "/admin/datastatistics/get_modal_dataTwo";success_orderout
        var datas={}
        datas.type = type;
        $('.modal_export3').html("<span style='text-align: center;font-size: 15px;'>报表正在生成中，请耐心等待一会。</span>");
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            console.log(data);

            if(data){
                $('.modal_export3').html('<span style="font-size: 15px">报表已经生成，</span><a style="font-size: 15px" href="javascript:void(0)" class="download_address3" >点击下载报表</a>');
                $('.download_address3').attr("href",data.addr);
            }
        })
    }
    //会员数据
    mod.member_out = function(){

        var type = $("#out_type").val();
        var url = core.getHost() + '/export/OutList';//这里改方法名
        // var url = core.getHost()+ "/admin/datastatistics/get_modal_dataTwo";success_os=dafs
        var datas={}
        datas.type = type;
        $('.modal_export4').html("<span style='text-align: center;font-size: 15px;'>报表正在生成中，请耐心等待一会。</span>");
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            console.log(data);

            if(data){
                $('.modal_export4').html('<span style="font-size: 15px">报表已经生成，</span><a style="font-size: 15px" href="javascript:void(0)" class="download_address4" >点击下载报表</a>');
                $('.download_address4').attr("href",data.addr);
            }
        })
    }
    return mod;
})