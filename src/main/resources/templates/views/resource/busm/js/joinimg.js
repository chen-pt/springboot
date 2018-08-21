require(['common'], function(YBZF) {

  // 删除图片
  $(document).on('click', '.del-img', function(evt) {
    var self = $(this);
    var hashId = self.attr("value");
    var itemid = $('#itemid').val();

    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/delSinglePic',
      'data': {
        'hashId': hashId,
        'goodId': itemid
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        $(self).parents('.pic').fadeOut('slow', function() {
          this.remove();
        });
        location.reload();
      } else {
        $('#push-pic-num').html($('.pic').size());
        layer.msg( rsp.result.msg || '未知错误' );
      }
    });
    evt.stopPropagation();

  });
  if($('.pic-group>.pic  ').hasClass('main')==false){
    $('.pic-group').find("div:eq(1)").addClass("main");
  }

  var flag = "true";
  onlyOne()
  function onlyOne() {
    if(flag) {
      var morenpic=$(".main-img").eq(0);

      var hashid = morenpic.attr("value");

      var itemid = $('#itemid').val();

      YBZF.services({
        'url': YBZF.hostname + '/jk51b/goods/setDefaultPic',
        'data': {
          'hashId': hashid,
          'goodId': itemid
        }
      }).done(function(rsp) {
        if( rsp.status ) {
          // layer.msg( rsp.result.msg );
          $('.pic-group').find('.pic.main').removeClass('main');
          var $pic = $(morenpic).parents('.pic');

          $pic.addClass('main');
          $pic.fadeOut('slow', function() {
            var outerHTML = $pic.prop('outerHTML');
            $pic.remove();
            $('.pic-group').prepend(outerHTML).find('.main').fadeIn('slow');
            $('#push-pic-num').html($('.pic').size());
          });
          // location.reload();
        } else {
          $('#push-pic-num').html($('.pic').size());
          layer.msg( rsp.result.msg || '未知错误' );
        }
      });
    }
    flag = "false";
  }

  // 设为主图
  $(document).on('click', '.main-img', function(evt) {
    var self = $(this);
    var hashId = self.attr("value");
    var itemid = $('#itemid').val();

    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/setDefaultPic',
      'data': {
        'hashId': hashId,
        'goodId': itemid
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        layer.msg( rsp.result.msg );
        $('.pic-group').find('.pic.main').removeClass('main');
        var $pic = $(self).parents('.pic');

        $pic.addClass('main');
        $pic.fadeOut('slow', function() {
          var outerHTML = $pic.prop('outerHTML');
          $pic.remove();
          $('.pic-group').prepend(outerHTML).find('.main').fadeIn('slow');
          $('#push-pic-num').html($('.pic').size());
        });
        location.reload();
      } else {
        $('#push-pic-num').html($('.pic').size());
        layer.msg( rsp.result.msg || '未知错误' );
      }
    });


    evt.stopPropagation();
  });

//上传图片数量，载入页面时显示
  $('#push-pic-num').html($('.pic').size());
  // 查看大图
  $(document).on('click', '.pic', function() {
    var $img = $(this).find('img');
    layer.open({
      type: 1,
      title: false,
      closeBtn: true,
      area: ['900px', '900px'],
      // content: $img.clone().prop('outerHTML')
      content: '<span></span>'+$img.clone().prop('outerHTML').replace('100x100', '399x399')
    });

  });

  // 监听DOM节点插入和删除 ff有点问题
  /*$(document).on('DOMNodeRemoved DOMNodeInserted',  function(event) {
    if( $(event.target).hasClass('pic') ) {
      if( $('.pic:visible').size() > 5 ) {
        $('#add-pic').fadeOut('slow');
      } else {
        $('#add-pic').fadeIn('slow');
      }
    }
  });*/

  $(document).keyup(function(event){
    // 按esc关闭
    if (event.keyCode == 27 || event.keyCode == 96) {
      layer.closeAll && layer.closeAll();
    }
  });

  (function() {
    // 选择目标节点
    var target = document.querySelector('.pic-group');
    // 创建观察者对象
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var len = mutation.target.querySelectorAll('.pic').length;
        if( len > 99 ) {
          $('#add-pic').fadeOut('slow');
        } else {
          $('#add-pic').fadeIn('slow');
        }
      });

    });
    // 配置观察选项:
    var config = { childList: true };
    // 传入目标节点和观察选项
    observer.observe(target, config);
  })();

  // 这里没有验证是不是图片
  $('#img-push').on('change', function() {
    // 没有选择文件
    if( ! this.files.length ) {
      return;
    }

    for(var i = 0; i < this.files.length; i++) {
      if( ! /(jpg|jpeg|gif|png|bmp)/.test(this.files[i].type) ) {
        layer.msg('你选的啥玩意');
        return;
      }

      if( (this.files[i].size / 1024) > 2048 ) {
        layer.msg('太大了，换一个吧', {icon: 13});
        return;
      }
    }

    // TODO 数量
    if ($('.pic-group .pic').size() + this.files.length > 6) {
      layer.msg('选择文件过多');
      return;
    }

    // 上传文件
    var formData = new FormData();

    for(i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
      // formData.append('img' + i, this.files[i]);
    }

    formData.append('itemid', $('#itemid').val());

    YBZF.services({
      'url': './uploadPics',
      'type': 'post',
      'data': formData,
      'dataType': 'json',
      'contentType': false,
      'processData': false
    }).done(function(rsp) {
      if( rsp.images ) {
        var hashs =$('.del-img').map(function() {return $(this).attr("value")});

        var exisNum = 0;
        for (var k in rsp.images) {
          if( $.inArray(rsp.images[k].hash, hashs) === -1 ) {
            var html = doT.template($("#pic-temp").text())(rsp.images[k]);
            // var html = $.tmpl($('#pic-temp').html(), rsp.images[k]);
            $('#add-pic').before(html);
            $('#push-pic-num').html($('.pic').size());
          } else {
            $('#push-pic-num').html($('.pic').size());
            exisNum++;
          }
        }
        if (exisNum) {
          layer.msg(exisNum + '张图片已经存在了哦T_T', {
            time: 22000, //20s后自动关闭
          });
        }
        setTimeout(function(){location.reload()},2000);
      } else {
        layer.msg( rsp.result.msg || '未知错误' );
      }
    });
  });
  //标记提示
  $(document).on('click','#handled',function () {
    if($('.pic-group .pic').size()==0){
      layer.msg("没有图片，请先上传图片");
      return;
    }
    var goods_ids = $('#itemid').val();
    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/batchHandle',
      'data': {
        'ids':goods_ids
      },
      'type':'post'
    }).done(function(rsp) {
      layer.msg(rsp.result.msg,function () {
        location.href = './list'
      });
    });
  })
});
