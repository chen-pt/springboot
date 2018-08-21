/**
 * Created by Administrator on 2017/5/22.
 */
//打印小票
var func = {
  EachDom: function (arr) {
    var dom = "";
    for (var i = 0; i < arr.length; i++) {
      dom += "<div class='section-box-good-content'>"+
      "<p class='section-box-text'>"+ arr[i].goodsCode +"/"+arr[i].goodsTitle+"/"+arr[i].specifCation+"/"+arr[i].goodsCompany+"</p>"+
      "</div>"+
      "<table class='goods-info'>"+
      "<tbody>"+
      "<tr>"+
      "<td width='33.33%' style='text-align: left'>"+ arr[i].goodsPrice / 100.0 +"</td>"+
      "<td width='33.33%' style='text-align: center'>"+ arr[i].goodsNum +"</td>"+
      "<td width='33.33%' style='text-align: right'>"+ (arr[i].goodsPrice * arr[i].goodsNum) / 100.0 +"</td>"+
      "</tr>"+
      "</tbody>"+
      "</table>";
      /*dom += '<div>' +
        '<div>' +
        '<p>' +
        '<span>' + arr[i].goodsCode + '</span>' +
        '/<span>' + arr[i].goodsTitle + '</span>' +
        '/<span>' + arr[i].specifCation + '</span>' +
        '/<span>' + arr[i].goodsCompany + '</span>' +
        '</p>' +
        '<p style="text-align: center">' +
        '<span class="p_left">' + arr[i].goodsPrice / 100.0 + '</span>' +
        '<span class="p_center">' + arr[i].goodsNum + '</span>' +
        '<span class="p_right">' + (arr[i].goodsPrice * arr[i].goodsNum) / 100.0 + '</span>' +
        '</p>' +
        '</div>' +
        '</div>'*/
    }
    return dom;
  },
  postStyle: function (type) {
    var doType = "";
    switch (type) {
      case 110:
        doType = "卖家包邮";
        break;
      case 120:
        doType = "平邮";
        break;
      case 130:
        doType = "快递";
        break;
      case 140:
        doType = "EMS";
        break;
      case 150:
        doType = "送货上门";
        break;
      case 160:
        doType = "门店自提";
        break;
      case 170:
        doType = "门店直购";
        break;
      case 9999:
        doType = "其他";
        break;
    }
    return doType;
  },
  payStyle: function (pay, price) {
    var p = price ? toDecimal2(price / 100.00) : "0.00";
    var payType = "";
    switch (pay) {
      case 'ali':
        payType = '<p class="section-box-text">支付宝：' + p + '元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
      case 'wx':
        payType = '<p class="section-box-text">微信：' + p + '元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
      case 'bil':
        payType = '<p class="section-box-text">快钱：' + p + '元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
      case 'unionPay':
        payType = '<p class="section-box-text">银联：' + p + '元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
      case 'health_insurance':
        payType = '<p class="section-box-text">支付宝：' + p + '元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
      case 'cash':
        payType = '<p class="section-box-text">支付宝：0.00元</p>' +
          '<p class="section-box-text">现金医保支付：' + p + '元</p>';
        break;
      default:
        payType = '<p class="section-box-text">支付宝：0.00元</p>' +
          '<p class="section-box-text">现金医保支付：0.00元</p>';
        break;
    }
    return payType;
  },
  postname: function (type, name, address, mobile) {
    var doType = "";
    switch (type) {
      case 150:
        doType = "<p class='section-box-text'>收货人姓名：" + name + "</p>" +
          "<p class='section-box-text'>收货人地址：" + address + "</p>" +
          "<p class='section-box-text'>收货人联系方式：" + mobile + "</p>";
        break;
      case 160:
        doType = "<p class='section-box-text'>姓名：" + name + "</p>" +
          "<p class='section-box-text'>联系方式：" + mobile + "</p>";
        break;
      default:
        doType = "";
        break;
    }
    return doType;
  },
};
var hkey_root,hkey_path,hkey_key;
hkey_root="HKEY_CURRENT_USER";
hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"

// 设置页眉页脚为空
function PageSetup_Null()
{
  try{
    var RegWsh = new ActiveXObject("WScript.Shell") ;
    hkey_key="header" ;
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"") ;
    hkey_key="footer" ;
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"") ;
  }
  catch(e){}
}

// 设置页眉页脚为默认值
function PageSetup_Default()
{
  try{
    var RegWsh = new ActiveXObject("WScript.Shell") ;
    hkey_key="header" ;
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"&w&b页码，&p/&P") ;
    hkey_key="footer" ;
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"&u&b&d") ;
  }
  catch(e){}
}

function print() {
  $("#doPrint").print({
    globalStyles: true,
    mediaPrint: false,
    stylesheet: null,
    noPrintSelector: ".no-print",
    iframe: true,
    append: null,
    prepend: null,
    manuallyCopyFormValues: true,
    deferred: $.Deferred(),
    timeout: 750,
    title: null,
    doctype: '<!doctype html>'
  });
  /*$('#doPrint').jqprint({
    debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
    importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
    printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
    operaSupport: false//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选
  });*/
}
function doPrint(tradesId) {
  PageSetup_Null();
  var $obj = $('#doPrint');
  if (!$obj.length <= 0) {
    getData(tradesId);
  } else {
    var DomBox = $('<div></div>');
    var DomPrint = $('<div></div>');
    var body = document.body;
    DomPrint.attr('id', 'doPrint').addClass('print');
    DomBox.addClass('hide').append(DomPrint);
    body.append(DomBox[0]);
    getData(tradesId);
  }
  PageSetup_Default();
}
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
function getData(tradesId) {
  $.ajax({
    url: "./printBox?tradesId=" + tradesId,
    success: function (data) {
      $('#doPrint').empty();
      var box, postSytle, payStyle, arrDom, price, receiverName, receiverAddress, recevierMobile, stockupId, totalFee, realPay = "";
      receiverName = data.value.recevierName != null && data.value.recevierName != 'null' && data.value.recevierName != 'NULL' ? data.value.recevierName : "";
      receiverAddress = data.value.receiverAddress != null && data.value.receiverAddress != 'null' && data.value.receiverAddress != 'NULL' ? data.value.receiverAddress : "";
      recevierMobile = data.value.recevierMobile != null && data.value.recevierMobile != 'null' && data.value.recevierMobile != 'NULL' ? data.value.recevierMobile : "";
      stockupId = data.value.stockupId ? data.value.stockupId : "";
      price = toDecimal2((data.value.totalFee + data.value.postFee - data.value.realPay) / 100.00);
      totalFee = data.value.totalFee ? toDecimal2(data.value.totalFee / 100.00) : "0.00";
      realPay = data.value.realPay ? toDecimal2(data.value.realPay / 100.00) : "0.00";

      var printBox ="",printBox2 ="";
      printBox = "<div class='section-box header'>" +
        "<h1>" + stockupId + "</h1>"+
        "<p class='header-title'>***顾客联***</p>" +
        "</div>"+
        "<div class='section-box order-header'>" +
        "<p class='section-box-text'>" + data.value.shop_weixin + "微商城</p>"+
        "<p class='section-box-text'>配送方式：" + func.postStyle(data.value.postStyle) + "</p>"+func.postname(data.value.postStyle, receiverName, receiverAddress, recevierMobile)+
        "</div>"+
        "<div class='section-box'>" +
        "<p class='section-box-text'>订单号：" + data.value.tradesId + "</p>"+
        "<p class='section-box-text'>下单时间：" + dateFormat(new Date(data.value.createTime), "yyyy-MM-dd hh:mm:ss") + "</p>"+
        "</div>" +
        "<div class='section-box'>"+
          "<div class='section-box-goods-title'>"+
            "<span class='goods-title-item'>编码</span>/"+
            "<span class='goods-title-item'>品名</span>/"+
            "<span class='goods-title-item'>规格</span>/"+
            "<span class='goods-title-item'>厂家</span>"+
          "</div>"+
          "<table class='goods-title'>"+
            "<thead>"+
            "<tr>"+
              "<th width='33.33%' style='text-align: left'>单价</th>"+
              "<th width='33.33%' style='text-align: center'>数量</th>"+
              "<th width='33.33%' style='text-align: right'>金额</th>"+
            "</tr>"+
            "</thead>"+
          "</table>"+
        "</div>" +
        "<div class='section-box'>" +
        func.EachDom(data.value.ordersList)+
        "</div>" +
        "<div class='section-box'>"+
        "<p class='section-box-text'>订单金额："+ totalFee +"元</p>"+
        "<p class='section-box-text'>优惠金额："+ price +"元</p>"+
        "<p class='section-box-text'>实付金额："+ realPay +"元</p>"+
        "</div>" +
        "<div class='section-box'>" +
        func.payStyle(data.value.payStyle, data.value.realPay) +
        "</div>" +
        "<div class='section-box'>" +
        "<p class='section-box-text'>顾客备注：" + data.value.buyerMessage + "</p>" +
        "</div>" +
        "<div class='section-box'>"+
        "<p class='section-box-text'>"+ data.value.sellerName + "零售清单</p>"+
        "<p class='section-box-text'>" + data.value.store.name + "门店</p>"+
        "<p class='section-box-text'>门店地址：" + data.value.store.address + "</p>"+
        "<p class='section-box-text'>电话：" + data.value.store.tel + "</p>"+
        "</div>" +
        "<div class='print-time'></div>";

      //box2
      printBox2 = "<div class='section-box header'>" +
        "<h1>" + stockupId + "</h1>"+
        "<p class='header-title'>***商家联***</p>" +
        "</div>"+
        "<div class='section-box order-header'>" +
        "<p class='section-box-text'>" + data.value.shop_weixin + "微商城</p>"+
        "<p class='section-box-text'>配送方式：" + func.postStyle(data.value.postStyle) + "</p>"+func.postname(data.value.postStyle, receiverName, receiverAddress, recevierMobile)+
        "</div>"+
        "<div class='section-box'>" +
        "<p class='section-box-text'>订单号：" + data.value.tradesId + "</p>"+
        "<p class='section-box-text'>下单时间：" + dateFormat(new Date(data.value.createTime), "yyyy-MM-dd hh:mm:ss") + "</p>"+
        "</div>" +
        "<div class='section-box'>"+
        "<div class='section-box-goods-title'>"+
        "<span class='goods-title-item'>编码</span>/"+
        "<span class='goods-title-item'>品名</span>/"+
        "<span class='goods-title-item'>规格</span>/"+
        "<span class='goods-title-item'>厂家</span>"+
        "</div>"+
        "<table class='goods-title'>"+
        "<thead>"+
        "<tr>"+
        "<th width='33.33%' style='text-align: left'>单价</th>"+
        "<th width='33.33%' style='text-align: center'>数量</th>"+
        "<th width='33.33%' style='text-align: right'>金额</th>"+
        "</tr>"+
        "</thead>"+
        "</table>"+
        "</div>" +
        "<div class='section-box'>" +
        func.EachDom(data.value.ordersList)+
        "</div>" +
        "<div class='section-box'>"+
        "<p class='section-box-text'>订单金额："+ totalFee +"元</p>"+
        "<p class='section-box-text'>优惠金额："+ price +"元</p>"+
        "<p class='section-box-text'>实付金额："+ realPay +"元</p>"+
        "</div>" +
        "<div class='section-box'>" +
        func.payStyle(data.value.payStyle, data.value.realPay) +
        "</div>" +
        "<div class='print-time'></div>";


      /*var box = "<table cellspacing='0' border='0' cellpadding='0' style=''>" +
        "<tbody>" +
        "<div class='print-code' style='text-align: center'>" +
        "<span>" + stockupId + "</span>" +
        "</div>" +
        "<div class='print-title' style='text-align: center'>***顾客联***</div>" +
        "<tr class='print-box'>" +
        "<td>" +
        "<p>" + data.value.shop_weixin + "微商城</p>" +
        "<p>配送方式：" + func.postStyle(data.value.postStyle) + "</p>" + func.postname(data.value.postStyle, receiverName, receiverAddress, recevierMobile) +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<div>订单号：" + data.value.tradesId + "</div>" +
        "<div>下单时间：" + dateFormat(new Date(data.value.createTime), "yyyy-MM-dd hh:mm:ss") + "</div>" +
        "</td>" +
        "</tr>" +
        "<tr class='print-box'>" +
        "<td>" +
        "<p>编码　/　品名　/　规格　/　厂家</p> <p>单价　　　　　数量　　　　　金额</p>" +
        "</td>" +
        "</tr>" +
        "<tr class='print-box'>" +
        "<td>" + func.EachDom(data.value.ordersList) +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>订单金额：" + totalFee + "元</p>" +
        "<p>优惠金额：" + price + "元</p>" +
        "<p>实付金额：" + realPay + "元</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>" + func.payStyle(data.value.payStyle, data.value.realPay) + "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>顾客备注：" + data.value.buyerMessage + "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>" + data.value.sellerName + "零售清单</p>" +
        "<p>" + data.value.store.name + "门店</p>" +
        "<p>门店地址：" + data.value.store.address + "</p>" +
        "<p>电话：" + data.value.store.tel + "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p class='print-time'></p>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "<div style='padding: 10px;'></div>";
      var box2 = "<table cellspacing='0' border='0' cellpadding='0' style=''>" +
        "<tbody>" +
        "<div class='print-code' style='text-align: center'>" +
        "<span>" + stockupId + "</span>" +
        "</div>" +
        "<div class='print-title' style='text-align: center'>***商家联***</div>" +
        "<tr class='print-box'>" +
        "<td>" +
        "<p>" + data.value.shop_weixin + "微商城</p>" +
        "<p>配送方式：" + func.postStyle(data.value.postStyle) + "</p>" + func.postname(data.value.postStyle, receiverName, receiverAddress, recevierMobile) +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<div>订单号：" + data.value.tradesId + "</div>" +
        "<div>下单时间：" + dateFormat(new Date(data.value.createTime), "yyyy-MM-dd hh:mm:ss") + "</div>" +
        "</td>" +
        "</tr>" +
        "<tr class='print-box'>" +
        "<td>" +
        "<p>编码　/　品名　/　规格　/　厂家</p> <p>单价　　　　　数量　　　　　金额</p>" +
        "</td>" +
        "</tr>" +
        "<tr class='print-box'>" +
        "<td>" + func.EachDom(data.value.ordersList) +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>订单金额：" + totalFee + "元</p>" +
        "<p>优惠金额：" + price + "元</p>" +
        "<p>实付金额：" + realPay + "元</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p>" + func.payStyle(data.value.payStyle, data.value.realPay) + "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p class='print-time'></p>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "<div style='padding: 10px;'></div>";*/
      $('#doPrint').append(printBox + printBox2);
      var myDate = new Date();
      var mytime = myDate.toLocaleString();     //获取当前时间
      $('.print-time').html('打印时间：' + mytime);
      print();
    },
    error: function () {
      alert("打印失效");
    }
  })
}
var dateFormat = function (date, format) {
  /*
   * 使用例子:format="yyyy-MM-dd hh:mm:ss";
   */
  var o = {
    "M+": date.getMonth() + 1, // month
    "d+": date.getDate(), // day
    "h+": date.getHours(), // hour
    "m+": date.getMinutes(), // minute
    "s+": date.getSeconds(), // second
    "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
    "S": date.getMilliseconds()
    // millisecond
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
      - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
