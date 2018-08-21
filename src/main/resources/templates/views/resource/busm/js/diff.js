/**
 * Created by wt on 2015/8/4.
 */
require(['common','sui'], function(YBZF) {
  //隐藏相同项
  $(document).on("click", "#hide", function() {
    $('.field-group:not(.diff)').fadeToggle('slow');
  });

  //全选
  $(document).on("click", "#checkall", function() {
    var self = this;
    $('.field-checkbox').find('input:checkbox').each(function() {
      // 禁用的 不进行操作
      if( ! this.disabled ) {
        this.checked = self.checked;
      }
    });
  });

  $(document).on('change', '.field-checkbox input:checkbox', function() {
    var $fieldCheckbox = $('.field-checkbox').find('input:visible:checkbox');
    if ($fieldCheckbox.length == $fieldCheckbox.filter(':checked').length) {
      $("#checkall").prop('checked', true);
    } else {
      $("#checkall").prop('checked', false);
    }
  });

  // 设置医宝数据/上海数据值
  $(document).on('setvalue', '.field-val, .field-sync-val', function(evt, data) {
    // 创建事件对象 保存事件处理返回值
    var beforeEvt = $.Event('setvalue:before');
    $(this).trigger(beforeEvt, data);
    $(this).trigger('setvalue:after', {'html': beforeEvt.result, 'value': data});
  });

  // 不直接显示接口值  需要进行处理的字段
  $(document).on('setvalue:before', '.field-group[data-json]', function(evt, data) {
    data = (data||'').split(',');
    var config = $(this).data('json');
    var temp = [];

    $.each(config.result, function(k, v) {
      if($.inArray(v.id + '', data) != -1) {
        temp.push(v.value);
      }
    });

    //$(evt.target).trigger('setvalue:after', html);
    return temp.join(',');
  });

  // 设置医宝数据值
  $(document).on('setvalue:after', '.field-val', function(evt, data) {
    $(this).empty().append(data.html || data.value);
  });

  // 设置商家数据值
  $(document).on('setvalue:after', '.field-sync-val', function(evt, data) {
    if( this.tagName == 'INPUT' ) {
      $(this).val(data.html || data.value);
    } else {
      $(this).empty().append(data.html || data.value);
    }
    $(this).next('input').val(data.value);
  });

  // 手动修改数据
  $(document).on('change', '.field-sync-val', function() {
    $(this).next('.sync-val').val( this.value );
  });

  var sync_draft_id=$('#ybzfid').val();
  YBZF.services({
    'url': YBZF.hostname + '/goodssync/showdiff',
    'data': {
      'sync_draft_id': sync_draft_id
    }
  }).done(function (rsp) {
    if( rsp.status ) {
      // YBZF商品
      var goods = rsp.result.Goods;
      // 商家商品
      var goodsSync = rsp.result.GoodsSync;

      if(goodsSync['sync_type'] == 2){
        $('#ignore-update').after('<button id="update-new" class="sui-btn btn-xlarge btn-success">添加为新商品</button>');
      }
      // 商品模板id
      $('#tpl').val( goodsSync.detail_tpl );
      if( goods ) {
        // 商家商品id
        $('#goodsid').val( goods.goods_id );
      }

      var showDiff = function(id) {
        var $field = $('#' + id);

        if( ! $field.size() ) {
          return;
        }

        if( goods ) {
          $field.find('.field-val').trigger('setvalue', goods[id]);
        }
        $field.find('.field-sync-val').trigger('setvalue', goodsSync[id]);
        if(goods && goodsSync[id] && goods[id] && goodsSync[id] != goods[id]) {
          // ybzf数据和商家数据都有值 并且ybzf数据和商家数据值不同
          $field.addClass('diff');

          // 设置了允许更新的字段才允许修改
          if( $.inArray($field[0].id, rsp.result.fields) === -1 ) {
            $field.find('.field-checkbox input:checkbox').attr('disabled', 'disabled').hide();
          }

          // 不需要处理的值并且是设置了允许更新的字段才允许修改
          if( ! $field.data('json') && $.inArray($field[0].id, rsp.result.fields) !== -1 ) {
            var textarea = $('<textarea></textarea>');
            $(textarea).html( $field.find('.field-sync-val').html() );
            var maxlength = 250;
            // 有效期和重量的长度
            if( $field[0].id == 'goods_validity' || $field[0].id == 'goods_weight' ) {
              maxlength = 3;
            }

            $(textarea).attr({'class': 'field-sync-val', 'maxlength': maxlength});
            var outerHTML = $field.find('.field-sync-val').prop('outerHTML').replace(/<span(.*)>(.*)<\/span>/, "<textarea$1>$2</textarea>");
            $field.find('.field-sync-val').prop('outerHTML', $(textarea).prop('outerHTML'));
          } else if(! $field.data('json')) {
            $field.find('.field-checkbox input:checkbox').attr('disabled', 'disabled').hide();
          }
        } else if(goods) {
          $field.find('.field-checkbox input:checkbox').attr('disabled', 'disabled').hide();
        }
      };

      $.each(goodsSync, function(key) {
        showDiff(key);
      });

      // 隐藏没有的字段选择框
      $('.field-checkbox').find('input:visible').each(function() {
        // 这个字段没有返回  隐藏
        if( ! (this.name in rsp.result.GoodsSync) ) {
          $(this).attr('disabled', 'disabled').hide();
        }
      });

      // 擦擦擦
      var nofields = [];
      nofields['10'] = ['goods_usage', 'forpeople_desc'];
      nofields['40'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
      nofields['80'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
      nofields['60'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
      nofields['30'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
      nofields['50'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
      nofields['70'] = ['goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'bar_code', 'goods_description'];
      nofields['20'] = ['com_name', 'drug_category', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];

      $.each(nofields[goodsSync.detail_tpl], function(k, v) {
        $('#' + v).remove();
      });

      // 默认全选
      $('#checkall').click();

      if( ! goods ) {
        $('.field-val').hide();
      }
    } else {
      $.alert({'title':'温馨提示!','body':rsp.result.msg});
    }
  });

  // 忽略
  $("#ignore-update").on("click",function(){
    var type=2;
    var sync=$('#ybzfid').val();
    var tpl=$('#ttpl').val();

    YBZF.services({
      'url': YBZF.hostname + '/goodssync/syncInfo',
      'data': {
        'type': type,
        'sync_draft_id': sync,
        'detail_tpl': tpl
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        layer.msg(rsp.result.msg, function() {
          location.pathname = '/goodssync/list';
        });
      } else {
         layer.msg( rsp.result.msg );
      }
    });
  });

  // 更新
  $("#sync-update").on("click",function(){
    var postdata = {};
    postdata.type = 1;
    postdata.sync_draft_id = $('#ybzfid').val();
    postdata.goods_id = $('#goodsid').val();
    postdata.detail_tpl = $('#tpl').val();

    // 获取需要更新的字段
    var $checkField = $('.field-checkbox').find('input:checked');
    if( ! $checkField.size() ) {
      layer.msg('请选择更新字段');
      return;
    }

    $checkField.each(function() {
      var key = this.name;
      postdata[key] = $('#' + key).find('.sync-val').val();
    });

    YBZF.services({
      'url': YBZF.hostname + '/goodssync/syncInfo',
      'data': postdata
    }).done(function(rsp) {
      if( rsp.status ) {
        layer.msg(rsp.result.msg || '更新成功', function() {
          location.pathname = 'goodssync/list';
        });
      } else {
         $.alert({'title':'温馨提示!','body':rsp.result.msg});
      }
    });
  });

  //添加为新商品
  $(document).on("click",'#update-new',function(e){
    $.confirm({
      body: '确定将此商家数据添加为新商品',
      height: 100,
      okHide:function(){
        var postdata = {};
        postdata.type = 1;
        postdata.sync_draft_id = $('#ybzfid').val();
        postdata.goods_id = $('#goodsid').val();
        postdata.detail_tpl = $('#tpl').val();

        // 获取需要更新的字段
        var $checkField = $('.field-checkbox').find('input:checked');
        if( ! $checkField.size() ) {
          layer.msg('请选择更新字段');
          return;
        }

        $checkField.each(function() {
          var key = this.name;
          postdata[key] = $('#' + key).find('.sync-val').val();
        });

        YBZF.services({
          'url': YBZF.hostname + '/goodssync/updateToNew',
          'data': postdata
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg(rsp.result.msg || '添加成功', function() {
              location.pathname = 'goodssync/list';
            });
          } else {
            $.alert({'title':'温馨提示!','body':rsp.result.msg});
          }
        });
      }
    })

  })
});