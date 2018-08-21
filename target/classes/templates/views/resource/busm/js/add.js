requirejs(['sui', 'common', 'drag', 'layer'], function(sui, YBZF) {
  $('.drag-box').drag({
    'error': function(msg) {
      layer.msg(msg);
    }
  });

  // 网站备案号的位置
  $(document).on('change', '#icp_positionck', function() {
    $('#icp_position').val( this.checked ? 200 : 110 );
  });

  // 在首页显示QQ客服
  $(document).on('change', '#index_show_qq_serviceck', function() {
    $('#index_show_qq_service').val( this.checked ? 1 : 0 );
  });

  //$('#city').tree({
  //  src : YBZF.hostname + '/services/getCitys',
  //  placeholder : '-- 请选择 --',
  //  jsonp : true
  //});

  //$('[name=hideiframe]').on('load', function(rsp) {
  //  var html = $(rsp.target).contents().find('body').html();
  //
  //  try {
  //    rsp = JSON.parse(html);
  //  } catch(e) {
  //    rsp = {'status': false, 'result': {'msg': '未知错误'}};
  //  }
  //
  //  if (rsp.status) {
  //    var merchant_id = rsp.result.notes ? rsp.result.notes.merchant_id : $('#merchant_id').val();
  //
  //    layer.msg(rsp.result.msg, {
  //      time: 3000
  //    }, function() {
  //      location.href = YBZF.hostname + '/site/detail?siteid=' + merchant_id;
  //    });
  //  } else {
  //    layer.msg( rsp.result.msg || '未知错误' );
  //  }
  //});

  $('#siteinfo').validate({
    'success': function() {
      var formData = new FormData( this.$form[0] );
      //var shop_area = $('#city').find('option:selected[value!=""]:eq(-1)').val();
      var $city = $('#city');
      var shop_area = $($city.data('tree').datas.value).get(-1);

      if( ! $.isNumeric(shop_area) ) {
        $('.main-container').animate({scrollTop: $city[0].getBoundingClientRect().top});
        layer.msg('请选择公司地址');
        return false;
      }

      if( $('#index_show_qq_service').val() == 1 && ! ($('#company_email').val() && $('#shop_qq').val()) ) {
        $('.main-container').animate({scrollTop: document.querySelector('#company_email').getBoundingClientRect().top});
        layer.msg('在首页显示QQ客服时，必须输入邮件和QQ号码');
        return false;
      }

      formData.append('shop_area', shop_area);
      YBZF.services({
        'url': this.$form.prop('action'),
        'type': this.$form.prop('method'),
        'dataType': 'json',
        'data': formData,
        'contentType': false, // 告诉jQuery不要去处理发送的数据
        'processData': false  // 告诉jQuery不要去设置Content-Type请求头
      }).done(function(rsp) {
        if (rsp.status) {
          var merchant_id = rsp.result.notes ? rsp.result.notes.merchant_id : $('#merchant_id').val();

          layer.msg(rsp.result.msg, {
            time: 3000
          }, function() {
            location.href = YBZF.hostname + '/site/detail?siteid=' + merchant_id;
          });
        } else {
          layer.msg( rsp.result.msg || '未知错误' );
        }
      });

      return false;
    }
  });

  // 增加QQ号验证规则
  $.validate.setRule("qq", function(value, element) {
    return /[1-9][0-9]{4,}/.test(value);
  }, 'QQ号码格式错误');

  $.validate.setRule('url', function(value, element, param) {
    var urlPattern;
    value = trim(value);
    urlPattern = /(http|ftp|https):\/\/([\w-]+\.)+[\w-]+\.(com|net|cn|org|me|io|info|cc|me|xxx)/;
    //urlPattern = /[a-zA-z]+:\/\/[^\s]*/;
    if (!/^http/.test(value)) {
      value = 'http://' + value;
    }
    return urlPattern.test(value);
  }, '请填写正确的网址');

  var flag = true;
  $(document).on('click','#ratio-ok',function () {
    //微信比率
    var wx_process = parseFloat($('.wx-process').val()).toFixed(2);
    var wx_ratio = parseFloat($('.wx-ratio').val()).toFixed(2);
    //支付宝比率
    var ali_process = parseFloat($('.ali-process').val()).toFixed(2);
    var ali_ratio = parseFloat($('.ali-ratio').val()).toFixed(2);
    //现金比率
    var cash_process = parseFloat($('.cash-process').val()).toFixed(2);
    var cash_ratio = parseFloat($('.cash-ratio').val()).toFixed(2);
    //医保比率
    var health_process = parseFloat($('.health-process').val()).toFixed(2);
    var health_ratio = parseFloat($('.health-ratio').val()).toFixed(2);
    //银联比率
    var unionPay_process = parseFloat($('.unionPay-process').val()).toFixed(2);
    var unionPay_ratio = parseFloat($('.unionPay-ratio').val()).toFixed(2);

    //commission代收手续费         charge佣金
    var wexin = {commission : wx_process,charge : wx_ratio};
    var alipay = {commission : ali_process,charge : ali_ratio};
    var cash = {commission : cash_process,charge : cash_ratio};
    var unionpay = {commission : unionPay_process,charge : unionPay_ratio};
    var insurencepay = {commission : health_process,charge : health_ratio};
    var site_id = $('#merchant_id').val();
    flag = true;

    var errLevel = 0;
    var errMsg = ['请输入0到100之间的数字！', '请输入数字', '结算比率不能为空'];
    $(".ratio").each(function () {
      if ($(this).val().trim() == '' && 3 > errLevel) {
        errLevel = 3;
      } else if (isNaN($(this).val()) && 2 > errLevel) {
        errLevel = 2;
      } else if (($(this).val() < 0 || $(this).val() > 100) && 1 > errLevel) {
        layer.msg('请输入0到100之间的数字！');
        flag = false;
      }
    });

    if (errLevel) {
      layer.msg(errMsg[errLevel - 1]);
      return;
    }

    if (flag == true) {
      YBZF.services({
        'url': YBZF.hostname + '/site/setrate',
        'data': {
          'site_id': site_id,
          'wexin': wexin,
          'alipay': alipay,
          'cash': cash,
          'unionpay': unionpay,
          'insurencepay': insurencepay
        },
        'type': 'post'
      }).done(function (rsp) {
        layer.msg('更新成功！', function() {
          location.reload(true);
        });
      })
    }
  });

});