require(['common', 'core/pagin', 'sui'], function(YBZF, pagin) {
  'use strict';
  $(document).on("click", ".sui-dropdown-menu a", function () {
    var $target = $(this),
        $li = $target.parent(),
        $container = $target.parents(".sui-dropdown, .sui-dropup"),
        $menu = $container.find("[role='menu']");
    if ($li.is(".disabled, :disabled")) return;
    if ($container.is('.disabled, :disabled')) return;
    $container.find("input").val($target.attr("value") || "").trigger("change");
    $container.find('[data-toggle=dropdown] span').html($target.text());
    $menu.find(".active").removeClass("active");
    $li.addClass("active");
    $li.parents('[role=presentation]').addClass('active');
  });

  (function () {
    var timeId;
    $(document).on('mouseover', '.pre-thumb', function () {
      var self = this;
      if (!$(self).data('has_get')) {
        timeId = setTimeout(function () {
          // 获取图片
          // http://busm.dev:8080/shop/catimage?itemid=69208&type=json
          var goods_id = $(self).data('item-id');
          YBZF.services({
            'url': YBZF.hostname + '/shop/catimage',
            'data': {
              'itemid': goods_id,
              'type': 'json'
            },
            'dataType': 'json',
            success: function (data) {
              if (data.status) {
                $(self).find(".thumb-pack").empty();
                if (data.result.items.length >= 6) {
                  for (var i = 0; i < 6; i++) {
                    var html = '<img src="' + data.result.imgHost + '0/0/10/10/0/80x80/' + data.result.items[i].imageId + '.jpg' + '"/>';
                    $(self).find(".thumb-pack").append(html);
                    $(self).find(".thumb-pack").css('width', 80 * data.result.items.length);
                    $(self).data('has_get', true);
                  }
                } else {
                  for (var i = 0; i < data.result.items.length; i++) {
                    var html = '<img src="' + data.result.imgHost + '0/0/10/10/0/80x80/' + data.result.items[i].imageId + '.jpg' + '"/>';
                    $(self).find(".thumb-pack").append(html);
                    $(self).find(".thumb-pack").css('width', 80 * data.result.items.length);
                    $(self).data('has_get', true);
                  }
                }
              }
            }
          })
        }, 500);
      }
    }).on('mouseout', '.pre-thumb', function () {
      clearTimeout(timeId);
    });
  })();

  $("#search").on("click", function () {
    getList(1);
  });

  getList(1);

  function getList(pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    /*var drug_name = $("#drug_name").val();
     var approval_number = $("#approval_number").val();
     var goods_status  = $('#goods_status').val();
     var update_status = $('#update_status').val();*/

    var data = $('#search-goods-form').serializeArray();
    data.push({'name': 'pagesize', 'value': pagesize});
    data.push({'name': 'pageno', 'value': pageno});

    YBZF.services({
      'url': '/goods/query',
      'data': data
    }).done(function (rsp) {
      var html = $("#shop-list-temp").html();
      rsp.hasNewResult = function (update_time) {
        return ($.now() - new Date(update_time.replace(/-/g, '/'))) / 86400000 < 2;
      };

      html = $.tmpl(html, rsp);
      $("#goods-list").empty().append(html);

      pagin('#pagination', pageno, rsp.result.total_pages || 0, pagesize, rsp.result.total_items|| 0, getList);
      $('#check-all').html('全选');
    });
  }

  // 全选
  $(document).on('click', '#check-all', function () {
    if ($(this).html().trim() == '全选') {
      $('.del-flag').prop('checked', true);
      $(this).empty().append('反选');
    } else {
      $('.del-flag').each(function () {
        this.checked = !this.checked;
      });
      $(this).empty().append('全选');
    }
  });

  // 批量删除
  $(document).on('click', '#batch-del', function () {
    var $checkedInput = $('.del-flag:checked');
    if ($checkedInput.size() == 0) {
      layer.msg('未选中任何商品');
      return;
    }
    var ids = $checkedInput.map(function () {
      return this.value;
    }).get().join(',');

    layer.confirm('总计' + $checkedInput.size() + '个商品，你确定删除吗?', function () {
      YBZF.services({
        'url': YBZF.hostname + '/shop/batchdel',
        'data': {
          'ids': ids
        }
      }).done(function (rsp) {
        layer.msg(rsp.result.msg, function () {
          getList(1);
        });
      });
    });
  });
  //批量处理图片
  $(document).on('click', '#handle-all', function () {
    var $checkedInput = $('.del-flag:checked');
    if ($checkedInput.size() == 0) {
      layer.msg('未选中任何商品');
      return;
    }
    var goods_ids = $checkedInput.map(function () {
      return this.value;
    }).get().join(',');

    layer.confirm('总计' + $checkedInput.size() + '个商品，你确定要处理图片吗?', function () {
      YBZF.services({
        'url': YBZF.hostname + '/shop/BatchYbzfUpdateImg',
        'data': {
          'goods_ids':goods_ids
        }
      }).done(function (rsp) {
        if (rsp.status) {
          layer.msg(rsp.result.msg.msg, function () {
            var pageno = $('.sui-pagination').find('.active').text();
            getList(pageno);
          });
        } else {
          layer.msg(rsp.result.error.error_list[0].message, function () {
            var pageno = $('.sui-pagination').find('.active').text();
            getList(pageno);
          });
        }
      });
    });
  });

});

/**
 * 查看图片
 */
function catImages(itemid)
{
  // 服务地址
  var hosturl = (location.origin || location.protocol + '//' + location.hostname + (location.port == 80 ? '' : ':' + location.port));

  $.alert({'title':'查看图片','backdrop':'static','width':'810px','height':'810px','remote':hosturl+'/shop/catimage?itemid='+itemid});
}
