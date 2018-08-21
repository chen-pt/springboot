require.config({
  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'promotion': 'service/promotion'
  }
});

$(function () {
  require(['core'], function (core) {
    core.doTinit();
    core.ReConsole();
  });

  var url =  window.location.pathname;

  switch (url) {
    case '/promotion/new':
      initNew();
      break;
    case '/promotion/modify':
      initNew();
      break;
    case '/promotion/cat':
      initCat();
      break;
    case '/promotion/index':
      initList();
      break;
  }

  // 字数提示
  $(document).on('input', '.input-wrap input, .input-wrap textarea', function() {
    var $container = $(this).parent('.input-wrap');
    var maxlength = ~~$container.find('.max-length').html();
    var $numLimit = $container.find('.num-limit');

    $numLimit.empty().append(this.value.length);

    if (this.value.length > maxlength) {
      $numLimit.addClass('red');
    } else {
      $numLimit.removeClass('red');
    }

  });

  // 多级下拉框
  $(document).on("click", ".sui-dropdown-menu a", function() {
    var $target = $(this),
        $li = $target.parent(),
        $container = $target.parents(".sui-dropdown, .sui-dropup"),
        $menu = $container.find("[role='menu']");
    if($li.is(".disabled, :disabled")) return;
    if ($container.is('.disabled, :disabled')) return;
    $container.find("input").val($target.attr("value") || "").trigger("change");
    $container.find('[data-toggle=dropdown] span').html($target.text());
    $menu.find(".active").removeClass("active");
    $li.addClass("active")
  });

});

// 新建活动
function initNew() {
  // region 事件绑定
  // 满减活动添加条件
  $(document).on('click', '#add-mj-condition', function() {
    var $container = $('#mj-conditions');
    addCondition.call(this, $container, 'mj-condition-temp');
    $('.autoNumberic').autoNumeric('init', {
      'aSep': '',
      'mDec': 2
    });
  });

  // 删除满减活动条件
  $(document).on('click', '.del-mj-condition', function() {
    $(this).parents('.full-cut-condition').fadeOut('fast', function() {
      $(this).remove();
      $('#mj-conditions').find('.full-cut-condition:visible:eq(-1)').addClass('last');
    });
  });

  // 首单活动添加条件
  $(document).on('click', '#add-first-condition', function() {
    var $container = $('#first-conditions');
    addCondition.call(this, $container, 'first-condition-temp');
    $('.autoNumberic').autoNumeric('init', {
      'aSep': '',
      'mDec': 2
    });
  });

  // 删除首单活动条件
  $(document).on('click', '.del-first-condition', function() {
    $(this).parents('.full-cut-condition').fadeOut('fast', function() {
      $(this).remove();
      $('#first-conditions').find('.full-cut-condition:visible:eq(-1)').addClass('last');
    });
  });

  // 城市全选
  $(document).on('click', '.select_all_city', function() {
    $('#free_ragion_list').find('input:checkbox').prop('checked', true);
  });

  // 城市反选
  $(document).on('click', '.unselect_all_city', function() {
    $('#free_ragion_list').find('input:checkbox').each(function() {
      //noinspection JSPotentiallyInvalidUsageOfThis
      this.checked = ! this.checked;
    });
  });

  // 区域选择
  $(document).on('click', '.city-group', function() {
    var group = $(this).find('input').prop('name');
    var checked = $(this).find('input').prop('checked');
    $('[name=' + group +']').prop('checked', checked);
  });

  // 确定选择不包邮地区
  $(document).on('click', '.select_city_ok', function() {
    var city_names = [];
    var city_ids = $('#free_ragion_list').find('input:checkbox:checked').map(function() {
      if(this.value != 0) {
        city_names.push($(this).parent().text().trim());
        return this.value;
      }
    }).get().join(',');

    $('#exclude-city-names').empty().append(city_names.join(','));
    $('#exclude-city-ids').val(city_ids);
  });

  // 修改参与活动的商品范围
  $(document).on('change', '[name=promotion_goods_range]', function() {
    if(this.value == 2) {
      $(this).parents('form').find('input:submit').val('下一步，选择参与商品');
    } else if(this.value == 3) {
      $(this).parents('form').find('input:submit').val('下一步，选择不参与商品');
    } else {
      $(this).parents('form').find('input:submit').val('确定');
    }
  });

  // 商品全选
  $(document).on('click', '#check-all-goods', function() {
    var checked = this.checked;
    $("[name=add-goods]").prop('checked', checked);
  });

  // 已选商品全选
  $(document).on('click', '#check-sel-goods', function() {
    var checked = this.checked;
    $("[name=rm-goods]").prop('checked', checked);
  });

  // 选中/取消单个商品
  $(document).on('change', '[name=add-goods]', function() {
    if ($('[name=add-goods]:checked').size() == $('[name=add-goods]').size()) {
      $('#check-all-goods').prop('checked', true);
    } else {
      $('#check-all-goods').prop('checked', false);
    }
  });

  $(document).on('change', '#sel-goods-list [name=rm-goods]', function() {
    var $container = $('#sel-goods-list');
    if ($container.find('[name=rm-goods]:checked').size() == $container.find('[name=rm-goods]').size()) {
      $('#check-sel-goods').prop('checked', true);
    } else {
      $('#check-sel-goods').prop('checked', false);
    }
  });

  // 批量增加
  $(document).on('click', '#batch-add-btn', function() {
    var ids = $("[name=add-goods]:checked").map(function() {
      return this.value
    }).get();

    if (! ids.length) {
      layer.msg('请选择商品');
      return;
    }

    if (addShop(ids)) {
      layer.msg('添加成功');
      $('#all-goods-list').trigger('data:refresh');
    } else {
      layer.msg('添加失败');
    }
  });

  // 批量移出
  $(document).on('click', '#batch-rm-btn', function() {
    var $ckgoods = $('#sel-goods-list').find("[name=rm-goods]:checked");
    var ids = $ckgoods.map(function() {
      return this.value
    }).get();

    if (! ids.length) {
      layer.msg('请选择商品');
      return;
    }

    if (rmShop(ids)) {
      layer.msg('移出成功');
      $ckgoods.parents('tbody').trigger('data:refresh');
    } else {
      layer.msg('添加失败');
    }
  });

  // 单个添加商品
  $(document).on('click', '.add-shop', function() {

    if (addShop($(this).data('id'))) {
      layer.msg('添加成功');
      $('#all-goods-list').trigger('data:refresh');
    } else {
      layer.msg('添加失败');
    }
  });

  // 单个移出商品
  $(document).on('click', '.rm-shop', function() {
    if (rmShop($(this).data('id'))) {
      layer.msg('移出成功');
      $(this).parents('tbody').trigger('data:refresh');
    } else {
      layer.msg('添加失败');
    }
  });

  // endregion

  // 地址栏hash改变
  $(window).on('hashchange', function() {
    var hash = location.hash.replace('#', '');

    // 活动的
    var actype = ['full_reduce', 'free_post', 'discount', 'first_order', 'limited_price'];
    // 商品的
    var gtype = ['all-goods', 'sel-goods'];

    if ($.inArray(hash, actype) != -1) {
      $('#activity-page').show();
      $('#set-goods-page').hide();
    } else if($.inArray(hash, gtype) != -1) {
      $('#set-goods-page').show();
      $('#activity-page').hide();
    }

    switch (hash) {
      case 'full_reduce':
        $('[href=#full_reduce]').tab('show');
        break;
      case 'free_post':
        $('[href=#free_post]').tab('show');
        break;
      case 'discount':
        $('[href=#discount]').tab('show');
        break;
      case 'first_order':
        $('[href=#first_order]').tab('show');
        break;
      case 'limited_price':
        $('[href=#limited_price]').tab('show');
        break;
      case 'all-goods':
        $('[href=#all-goods]').tab('show');
        break;
      case 'sel-goods':
        $('[href=#sel-goods]').tab('show');
        break;
    }

  });

  require(['promotion'], function(promotion) {
    promotion.init();

    $(document).on('show', '#goods-nav', function(evt) {
      var formId = $('#formId').val();
      if (! formId) {
        location.hash = '#full_reduce';
        return;
      }
      var type = $('#' + formId).find('[name=promotion_type]').val();
      if (type == 160) {
        $('.discount-price-head').hide();
        $('.litmit-price-head').show();
      } else {
        $('.litmit-price-head').hide();
        $('.discount-price-head').show();
      }

      // 全部商品 已选择商品
      switch (evt.target.hash) {
        case '#all-goods':
          promotion.getGoodsList(1);
          break;
        case '#sel-goods':
          promotion.getSelGoodsList(1);
      }
    });

    // 全部商品的搜索
    $(document).on('submit', '#goods-search-form', function() {
      promotion.getGoodsList(1);
    });

    // 自定义事件 刷新数据
    $(document).on('data:refresh', '#all-goods-list', function() {
      promotion.getGoodsList();
    });

    $(document).on('data:refresh', '#sel-goods-list', function() {
      promotion.getSelGoodsList();
    });

    // FIXME 进页面就会加载 初始化包邮
    promotion.tools(120).getCitys();

    // 创建活动
    $('#full_reduce_form, #free_post_form, #discount-form, #first_order_form, #limited_post_form').validate({
      'success': function($form) {
        var data = $form.serializeArray();
        var type = $form.find('[name=promotion_type]').val();
        var t = '';//???

        // TODO 验证满减规则
        if (type == 130 || type == 140) {
          var flag = true;
          var promotion_info = [];

          // 获取数据
          $form.find('.full-cut-condition input:text').each(function(k) {
            var o = {'meet_price': '', 'discount_price': ''};
            var meet_price = 'meet_price';
            var discount_price = 'discount_price';
            if (k % 2 == 0) {
              promotion_info[k / 2] = o;
            }
            // 。。。。。
            eval(this.name + '=' + (this.value || 0));
          });

          for(var i in promotion_info) {
            flag &= promotion_info[i].discount_price < promotion_info[i].meet_price;

            if(flag && i > 0) {
              flag &= promotion_info[i].meet_price > promotion_info[i - 1].meet_price;
            }
          }

          if(! flag) {
            $form.find('.condition-tips').show();
            return false;
          }
        }

        var goods_range = $form.find('[name=promotion_goods_range]').val();
        if (goods_range == 2) {
          // 指定参与商品
          selGoodsPage(2, $form.prop('id'));
        } else if (goods_range == 3) {
          // 指定不参与商品
          selGoodsPage(3, $form.prop('id'));
        } else {
          promotion.tools(type).send(data);
        }
      }
    });

    // 选择活动商品的保存按钮
    $(document).on('click', '#save-activity', function() {
      var $form = $('#' + $('#formId').val());
      var data = $form.serializeArray();
      var promotion_goods = $('#sel-ids').val();
      if (! promotion_goods) {
        if($form.find('[name=promotion_goods_range]').val() == 2) {
          layer.alert('请选择参与活动的商品');
        } else {
          layer.alert('请选择不参与活动的商品');
        }
        return;
      }
      data.push({'name': 'promotion_goods', 'value': promotion_goods});

      promotion.tools(110).send(data);
    });

    $(function() {
      // 设置地址栏的hash 自带>当前标签页>默认满减
      location.hash = location.hash || $('#activity-nav').find('.active a').prop('hash') || 'full_reduce';
      $(window).trigger('hashchange');
    });
  });

  // 页面加载完成
  $(function() {
    // 输入限制
    $('.autoNumberic').autoNumeric('init', {
      'aSep': '',
      'mDec': 2
    });

    // region 增加表单验证规则
    $.validate.setRule('gtdate', function(value, element, param) {
      var t = $('#' + param).val().replace(/-/g, '/');
      return new Date(value.replace(/-/g, '/')) > new Date(t);
    }, function($input, param) {
      return '必须大于' + param;
    });

    $.validate.setRule('minnumber', function(value, element, param) {
      return parseFloat(value) >= parseFloat(param);
    }, function($input, param) {
      return '不能小于' + param;
    });

    $.validate.setRule('maxnumber', function(value, element, param) {
      return parseFloat(value) <= parseFloat(param);
    }, function($input, param) {
      return '不能大于' + param;
    });
    // endregion
  });

  // 增加条件
  function addCondition($container, tempId) {
    var len = $container.find('.full-cut-condition').size();

    if(len >= 9) {
      // 10个 加个禁用样式
      if (! $(this).hasClass('disabled')) {
        $(this).addClass('disabled');
        var html = $('#' + tempId).html();
        html = doT.template(html)({'index': len + 1});

        $container.append(html);

        // 最后yige
        $container.find('.last').removeClass('last').end().find('.full-cut-condition:eq(-1)').addClass('last');
      }

    } else {
      html = $('#' + tempId).html();
      html = doT.template(html)({'index': len + 1});

      $container.append(html);

      // 最后yige
      $container.find('.last').removeClass('last').end().find('.full-cut-condition:eq(-1)').addClass('last');
    }
  }

  /**
   * 选择商品
   * @param type 忘记了
   * @param formId 表单ID
   */
  function selGoodsPage(type, formId) {
    location.hash = '#all-goods';
    $('#formId').val(formId);
    $('#back').attr('href', '#' + $('#' + formId).parent('.tab-pane').attr('id'));
  }

  function addShop(ids) {
    try {
      var $selIds = $('#sel-ids');
      var oldIds = $selIds.val();
      ids = oldIds + ',' + ids;
      // 过滤掉空值
      ids = $(ids.split(',')).filter(function(k, v) {
        return v;
      }).get();

      // 去重
      ids = $.unique(ids);

      $selIds.val(ids.join());
      $('#sel-goods-num').empty().append(ids.length);
    } catch(e) {
      return false;
    }

    return true;
  }

  function rmShop(ids) {
    if (! $.isArray(ids)) {
      ids = (ids + '').split(',');
    }

    try {
      var $selIds = $('#sel-ids');
      var oldIds = $selIds.val().split(',');

      for (var i in ids) {
        //noinspection JSUnfilteredForInLoop
        var p = oldIds.indexOf(ids[i]);
        if (p!= -1) {
          oldIds.splice(p, 1);
        }
      }
      $selIds.val(oldIds.join());
      $('#sel-goods-num').empty().append(oldIds.length);
    } catch(e) {
      return false;
    }

    return true;
  }
}

function initList() {

  require(['promotion'], function(promotion) {
    $(document).on('click', '.kill-ac', function() {
      var id = $(this).data('a-id');
      layer.confirm('你确定结束这个活动吗?', function() {
        promotion.endPromotion(id);
      });
    });

    $(document).on('submit', '#search-form', function() {
      promotion.getList(1);
    });

    promotion.getList(1);
  });
}

function initCat() {
  $(function() {
    // 禁用表单
    var form = $('#activity-nav').find('.active a').prop('hash');
    $(form).find('input').prop('disabled', true)
    $(form).find('select').prop('disabled', true)
    $(form).find('textarea').prop('disabled', true)
  });
  //cat-goods
  require(['promotion', 'service/pagin'], function(promotion, pagin) {
    $(document).on('show', '#cat-goods', function() {
      catGoodsList(1);
    });
    function catGoodsList(pageno) {
      promotion.getSelGoodsList(pageno).done(function(rsp) {
        var html = $("#cat-goods-temp").html();
        html = doT.template(html)(rsp);
        $('#cat-goods-list').empty().append(html);
        pagin('#cat-goods-pagin', rsp.result.current || 1, rsp.result.total_pages || 1, null, null, catGoodsList, ['pagination-small', 'pagination-right']);
      });
    }
  });
}