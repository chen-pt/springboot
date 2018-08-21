/**
 * Created by Administrator on 2017/3/8.
 */
var amap, geocoder, geolocation, placeSearch, infoWindow;

var search_tag = true;  //防止重复标注

var gaodemap = {
  initMap: function (type) {

    amap = new AMap.Map('container', {
      zoom: 11,
      zooms: [3, 18],
      scrollWheel: false,
      resizeEnable: true,
      isHotspot: true
    });

    AMap.plugin(['AMap.ToolBar'], function () {  //地图级别调节工具
      amap.addControl(new AMap.ToolBar());
    });

    AMap.plugin(['AMap.PlaceSearch'], function () {
      placeSearch = new AMap.PlaceSearch();  //构造地点查询类
    });

    AMap.plugin(['AMap.AdvancedInfoWindow'], function () {
      infoWindow = new AMap.AdvancedInfoWindow({closeWhenClickMap: true});  //构造地点查询类
    });

    amap.on('hotspotclick', function (result) {
      placeSearch.getDetails(result.id, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          placeSearch_CallBack(result);
        }
      });
    });
    //回调函数
    function placeSearch_CallBack(data) { //infoWindow.open(amap, result.lnglat);
      var poiArr = data.poiList.pois;
      var location = poiArr[0].location;
      infoWindow.setContent(createContent(poiArr[0]));
      infoWindow.open(amap, location);
    }

    function createContent(poi) {  //信息窗体内容
      var s = [];
      s.push('<div class="info-title"  style="margin-left: 15px;"><h4>' + poi.name + '</h4><a target="_blank" href="http://gaode.com/detail/' + poi.id + '?src=jsapi_detail">详情>></a></div><div class="info-content"  style="margin-left: 15px;">' + "地址：" + poi.address);
      if (poi.tel != '') {
        s.push("电话：" + poi.tel);
      }
      s.push("类型：" + poi.type);
      s.push('<div>');
      return s.join("<br>");
    }

    //
    if (type == 'new') {
      amap.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: 'RB'
        });
        amap.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
      });
      //解析定位结果
      function onComplete(data) {
        console.log(data.position.getLng());
        var str = ['高的地图定位成功'];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        str.push('精度：' + data.accuracy + ' 米');
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        gaodemap.addMarker(data.position.getLng(), data.position.getLat());
        amap.setZoomAndCenter(13, [data.position.getLng(), data.position.getLat()]);

      }

      //解析定位错误信息
      function onError(data) {
        console.log('定位失败');
      }
    }
  },

  LocationSearch: function (opt, address, times) {
    if (address != '') {
      AMap.plugin(['AMap.Geocoder'], function () {  //地理编码 正想地理编码，地址-坐标

        geocoder = new AMap.Geocoder({
          radius: 1000 //范围，默认：500
        });

        var citys = $('#store_citys').data('tree').datas;
        console.log(citys);


        if (citys.value.length >= 2 && citys.value[citys.value.length - 1] != "") {
          geocoder.setCity(citys.text[1]);

          $('#gaode_province_hidden').val(citys.text[0]);
          $('#gaode_city_hidden').val(citys.text[1]);
          $('#gaode_street_hidden').val(citys.text[2]);
        }

        amap.addControl(geocoder);
        geocoder.getLocation(address);
        AMap.event.addListener(geocoder, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geocoder, 'error', onError);      //返回定位出错信息

        function onComplete(data) {
          console.log(data);

          if (data.info == 'OK') {
            if (times == 0) {
              $(".gaode_fail_show").removeClass('hide');
              $(".gaode_success_show").addClass('hide');
              $(".alert_show").removeClass("hide");
            } else {
              if (times != 5) {
                $(".gaode_success_show").removeClass('hide');
              }

              $(".alert_show").addClass("hide");
              $(".gaode_fail_show").addClass('hide');
            }
            // 地理编码结果数组
            var geocode = data.geocodes;

            amap.setZoomAndCenter(13, [geocode[0].location.getLng(), geocode[0].location.getLat()]);

            gaodemap.addMarker(geocode[0].location.getLng(), geocode[0].location.getLat());

          } else {
            $(".gaode_fail_show").removeClass('hide');
            $(".gaode_success_show").addClass('hide');
            $(".alert_show").removeClass("hide");
          }

        }

        function onError() {
          console.log('定位失败');
        }
      });
    } else {
      alert("请先填写“详细地址”");
      return false;
    }
  },

  addMarker: function (lng, lat) { //添加点标记
    var marker = new AMap.Marker({
      map: amap,
      position: [lng, lat],
      draggable: true,
      cursor: 'move',
      icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_rs.png'
    });

    console.log(search_tag);

    if (search_tag) {
      marker.setMap(amap);

      search_tag = false;
    }
    // 自定义点标记内容
    var markerContent = document.createElement("div");

    // 点标记中的图标
    var markerImg = document.createElement("img");
    markerImg.className = "markerlnglat";
    markerImg.src = "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png";
    markerContent.appendChild(markerImg);

    // 点标记中的文本
    var markerSpan = document.createElement("span");
    markerSpan.className = 'marker';
    markerContent.appendChild(markerSpan);

    console.log(markerContent);
    marker.setContent(markerContent); //更新点标记内容
    marker.setPosition([lng, lat]); //更新点标记位置
    infoWindow(lng, lat);


    $('#gaode_lng_tmp').val(lng);
    $('#gaode_lat_tmp').val(lat);

    AMap.event.addListener(marker, 'dragend', onDragend);//点标记拖拽移动结束触发事件

    function onDragend(result) {
      console.log('gaodeeeeeeeee');
      $('#gaode_lng_tmp').val(result.lnglat.getLng());
      $('#gaode_lat_tmp').val(result.lnglat.getLat());

      console.log('高德新位置为：' + result.lnglat.getLng() + ',' + result.lnglat.getLat());

      lng = result.lnglat.getLng();

      lat = result.lnglat.getLat();

      infoWindow(lng, lat);

    }

    var flag = true;

    function infoWindow(lng, lat) {
      AMap.plugin(['AMap.Geocoder'], function () {  //逆向地理编码，坐标-地址

        geocoder = new AMap.Geocoder({
          radius: 1000, //范围，默认：500
          extensions: "all"
        });

        amap.addControl(geocoder);

        geocoder.getAddress([lng, lat]);

        AMap.event.addListener(geocoder, 'complete', onComplete);//返回定位信息

        AMap.event.addListener(geocoder, 'error', onError);      //返回定位出错信息

        function onComplete(data) {

          var addComp = data.regeocode.addressComponent;

          var p_citys = provinceList = ['北京市', '天津市', '上海市', '重庆市'];

          if (addComp.city == '') {
            if ($.inArray(addComp.province, p_citys) != -1) {
              var addComp_city = addComp.province;
            } else {
              var addComp_city = addComp.district;
            }
          } else {
            var addComp_city = addComp.city;
          }

          var address = addComp.street + " " + addComp.streetNumber;

          // var addressshow = data.regeocode.formattedAddress;
          var addressshow = addComp.province + addComp.city + addComp.district + addComp.township + addComp.street + addComp.streetNumber;

          console.log(addComp);

          var now_addr = addComp.street + addComp.streetNumber;
          var search = $("#store_address").val();

          if (search.replace(/\s/g, "") != now_addr.replace(/\s/g, "")) {
            $(".gaode_fail_show").removeClass('hide');
            $(".gaode_success_show").addClass('hide');
            $(".alert_show").removeClass("hide");
          } else {
            $(".gaode_success_show").removeClass('hide');
            $(".alert_show").addClass("hide");
            $(".gaode_fail_show").addClass('hide');
          }


          if (flag) {
            if ($("#store_citys select").val() && $("#store_address").val()) {

              var infoWindow = new AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                offset: new AMap.Pixel(16, -45),
                closeWhenClickMap: true
              });

              //消息提示窗体
              var info = document.createElement("div");
              info.style.backgroundColor = 'white';
              info.style.width = '265px';
              info.style.padding = '15px';
              info.style.border = '1px solid #999';

              //地址栏显示
              var address_format = document.createElement('h4');
              address_format.style.margin = '0 0 5px 0';
              address_format.style.padding = '0.2em 0';
              address_format.innerHTML = addressshow;

              info.appendChild(address_format);

              //内容显示
              var message = document.createElement('p');
              message.innerHTML = '是否使用此位置作为门店的定位？';
              info.appendChild(message);

              var button_group = document.createElement('p');
              button_group.style.margin = '0 0 5px 0';
              button_group.style.fontSize = '13px';
              button_group.style.textIndent = '2em';


              if (address == $("#store_address").val()) {

                button_group.innerHTML = '<button id="sureaddress" type="button" onclick="changeAddress(\'' + addComp.province + '\',\'' + addComp_city + '\',\'' + addComp.district + '\',\'' + address + '\')"  class="sui-btn btn-block btn-xlarge btn-success">确定</button>';
              } else {

                button_group.innerHTML = '<button id="sureaddress" type="button" onclick="changeAddress(\'' + addComp.province + '\',\'' + addComp_city + '\',\'' + addComp.district + '\',\'' + address + '\')"  class="sui-btn btn-block btn-xlarge btn-success">仅使用坐标</button><button id="sureaddress" type="button" onclick="changeAddress(\'' + addComp.province + '\',\'' + addComp_city + '\',\'' + addComp.district + '\',\'' + address + '\',1)"  class="sui-btn btn-block btn-xlarge btn-primary">使用坐标和地址</button>';
              }

              info.appendChild(button_group);

              infoWindow.setContent(info);
              infoWindow.open(amap, marker.getPosition());

            } else {
              //  alert("请先选择“所在地区”并填写“详细地址”");
              return false;
            }
          }
        }

        function onError() {
          console.log('定位失败');
        }
      });
    }
  },

  closeInfoWindow: function () {
    amap.clearInfoWindow();
  }
}
