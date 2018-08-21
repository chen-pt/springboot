/**
 * Created by Administrator on 2017/3/8.
 */
var map, myGeo, marker,isADD  = null;
var first_use=true; //判断是否为初入页面时读取数据，如果是，则只取store_tag取接口里的值，不用直接赋值为0，否则拖动后再变为0【青山修改】


var baidumap = {
    /**
     * 初使化
     * @param opt
     */
    initStoreMap:function (opt) {

        /**
         * 默认定位
         * @param result
         * @constructor
         */
        function DefaultLocation(result){

            var cityName = result.name;

            var poing = map.setCenter(cityName);

            console.log("当前定位城市:"+cityName);

            baidumap.SearchLocation('auto',cityName);

        }


        // 百度地图API功能
        map = new BMap.Map("allmap");
        var point = new BMap.Point(121.5135,31.242785);
        map.centerAndZoom(point,11);

        //大小调节控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: BMAP_ANCHOR_TOP_LEFT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: true
        });

        map.addControl(navigationControl);

        if(opt=='new')
        {
            //IP 定位
            var myCity = new BMap.LocalCity();
            myCity.get(DefaultLocation);
        }

    },


/**
 * 地址搜索定位
 * @param address
 * @constructor
 */
SearchLocation:function(opt,address) {
    isADD = opt;

    // 创建地址解析器实例
    myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, function(point){

        var flag = true;

        var store_lat_tmp = $("#store_lat_tmp").val();
        var store_lng_tmp = $("#store_lng_tmp").val();

        if(first_use && store_lat_tmp && store_lng_tmp){

            point = new BMap.Point(store_lng_tmp,store_lat_tmp);

        }else if(!point){
            point = new BMap.Point(121.5135,31.242785);

            console.log('您选择地址没有找到!');

            flag = false;
        }

        console.log('地址：'+address+'  新位置:'+JSON.stringify(point));

        map.removeOverlay(marker);

        var myIcon = new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(33,36));

        //标注可拖动
        marker = new BMap.Marker(point,{icon:myIcon});// 创建标注

        map.addOverlay(marker);             // 将标注添加到地图中

        marker.addEventListener("dragend",baidumap.MarketListener);

        marker.enableDragging();           // 可拖拽

        if(opt!='auto'&& flag)
        {
            map.centerAndZoom(point,20);

        }else{

            map.centerAndZoom(point,11);
        }

        if(opt!='auto'&& !flag )
        {

            var opts = {
                width : 200,     // 信息窗口宽度
                height: 50,     // 信息窗口高度
                title:'',
                enableMessage:false//设置允许信息窗发送短息
            }
            var infoWindow = new BMap.InfoWindow('<span style="font-size:24px;color:#f00"><i class="sui-icon icon-tb-infofill"></i></span>找不到门店地址!请重新输入，或拖拽【红点】选择地址。', opts);

            map.openInfoWindow(infoWindow,point); //开启信息窗口
        }else{
            baidumap.MarketListener(marker);
        }


    }, "上海市");
},

//拖动事件监听
MarketListener:function(e) {
    var flag=true;
    if(!first_use){
        //$('#store_tag').val(0);
        console.log("当前位置：" + e.point.lng + ", " + e.point.lat);

        $('#store_lat_tmp').val(e.point.lat);
        $('#store_lng_tmp').val(e.point.lng);
    }else{
        first_use=false;
        console.log($('#store_lat_tmp').val()+'---'+$('#store_lat').val()+'----'+$('#store_lng_tmp').val()+'---'+$('#store_lng').val()+'-----'+$('#store_tag').val());
        if($('#store_lat_tmp').val()==$('#store_lat').val() && $('#store_lng_tmp').val()==$('#store_lng').val() && $('#store_tag').val()=="1"){
            flag=false;
        }
    }

    var geoc = new BMap.Geocoder();

    geoc.getLocation(e.point, function(rs) {

        var addComp = rs.addressComponents;

        var address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;

        console.log(address);

        var city = addComp.province + " " + addComp.city + " " + addComp.district;

        var address = addComp.street + " " + addComp.streetNumber;

        var addressshow = city + " " + address;

        /**已经定位过的，在编辑的时候不需要显示是否需要定位的提示【青山】20150811**/
        if(flag){
            if (isADD == 'auto')
            {

                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 50,     // 信息窗口高度
                    title:'',
                    enableMessage:false//设置允许信息窗发送短息
                }

                var infoWindow = new BMap.InfoWindow('<span style="font-size:24px;color:#f00"><i class="sui-icon icon-tb-infofill"></i></span>请输入详细地址，或拖拽【红点】选择地址。', opts);

                map.openInfoWindow(infoWindow,e.point); //开启信息窗口


                isADD = 'self';//

            }else{
                if($("#store_citys select").val() && $("#store_address").val()){
                    if(address == $("#store_address").val()){
                        $(".success_show").removeClass('hide');
                        $(".alert_show").addClass("hide");
                        $(".fail_show").addClass('hide');
                        var sContent =
                            '<div><h4 style="margin:0 0 5px 0;padding:0.2em 0">'+addressshow+'</h4>' +
                            '<p>是否使用此位置作为门店的定位？</p>'+
                            '<ul style="list-style: none;">'+
                            '<li style="width: 50%;"></li>'+
                            '<li style="width: 50%;" class="pull-right">'+
                            '<p style="margin:0;line-height:1.5;font-size:13px;text-indent:2em">'+
                            '<button id="sureaddress" type="button" onclick="changeAddress(\''+addComp.province+'\',\''+addComp.city+'\',\''+addComp.district+'\',\''+address+'\')" class="sui-btn btn-block btn-xlarge btn-success">确定</button></p></li></ul>' +
                            '</div>';

                        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象

                        map.openInfoWindow(infoWindow,e.point); //开启信息窗口
                    }else{
                        var kaxi_check = true;
                        $(".fail_show").removeClass('hide');
                        $(".success_show").addClass('hide');
                        $(".alert_show").removeClass("hide");
                        var sContent =
                            '<div><h4 style="margin:0 0 5px 0;padding:0.2em 0">'+addressshow+'</h4>' +
                            '<p>是否使用此位置作为门店的定位？</p>'+

                            '<p style="margin:0;line-height:1.5;font-size:13px;text-indent:2em">'+
                            '<button id="sureaddress" type="button" onclick="changeAddress(\''+addComp.province+'\',\''+addComp.city+'\',\''+addComp.district+'\',\''+address+'\')" class="sui-btn btn-block btn-xlarge btn-success">仅使用坐标</button>' +
                            '<button id="sureaddress" type="button" onclick="changeAddress(\''+addComp.province+'\',\''+addComp.city+'\',\''+addComp.district+'\',\''+address+'\','+kaxi_check+')" class="sui-btn btn-block btn-xlarge btn-primary">使用坐标和地址</button></p>' +
                            '</div>';

                        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象

                        map.openInfoWindow(infoWindow,e.point); //开启信息窗口

                    }
                }else{ layer.msg("请先选择“所在地区”并填写“详细地址”");return false;}
            }

        }
    });
},
getMap:function() {
        return map;
    }

}