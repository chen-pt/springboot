require(['common','sui'], function(YBZF) {
  $(document).on('click', '.update-img', function() {
    console.log('更新图片');
  });

  // 删除图片
  $(document).on('click', '.del-img', function() {
    var self = $(this);
    var hashId = $(this).attr("name");
    var goods_id = $('#goods_id').val();

    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/delSinglePic',
      'data': {
        'hashId': hashId,
        'goodId': goods_id
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        $(self).next('img').fadeOut('slow', function() {
          $(this).parent().remove();
        });
        $(self).remove();
      } else {
        layer.msg( rsp.result.msg || '未知错误' );
      }
    });
  });

  // 更新图片
  $(document).on('click', '.update-img', function() {
    var imageId = $(this).attr("name");
    var hostId = $(this).data('hostid');
    var goods_id = $('#goods_id').val();
    if(goods_id==="0"){
      layer.msg("更新图片失败,请先更新商品在更新图片!" );
      return;
    }

    //已更新过的不允许再次更新
    var flag =false;
    $(".pic-group:eq(1)").find("figcaption").each(function(){
      if($(this).attr("name") == imageId){
        location.reload();
        flag = true;
        return false;
      }
    });
   if(flag)return;

    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/updateSyncPic',
      'data': {
        'hash': imageId,
        'hostId': hostId,
        'goods_id': goods_id
      }
    }).done(function(rsp) {
      if( rsp.status==true ) {
        layer.msg( "更新成功", function() {
          location.reload();
        });
      } else {
        layer.msg( rsp.errorMsg );
      }
    });
  });

  // 标记为已处理
  $(document).on('click', '#mark-status', function() {
    var sync_draft_id = $('#sync_draft_id').val();

    YBZF.services({
      'url': YBZF.hostname + '/jk51b/goods/changeUpdateImgStatus',
      'data': {
        'sync_draft_id': sync_draft_id
      }
    }).done(function(rsp) {
      if( rsp.status==true ) {
        layer.msg( "成功标记为已处理", function() {
          location.pathname = '/jk51b/goods/update';
        });
      } else {
        layer.msg( rsp.result.msg );
      }
    });
  });

  // 查看大图
  $(document).on('click', 'figure img', function() {
    layer.open({
      type: 1,
      title: false,
      closeBtn: true,
      area: ['399px', '399px'],
      content: $(this).clone().prop('outerHTML').replace('100x100', '399x399')
    });

  });
});
