/*eslint-disable space-after-keywords*/
/*eslint-disable space-return-throw-case*/
(function () {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'core': 'merchant/js/lib/core',
      'product': 'merchant/js/product/product',
      'edit': 'merchant/js/product/productedit',
      'pubmig': 'merchant/js/productimg/pubimg',
      'lodash': 'public/lodash.min',
      'goodsDeails': 'merchant/js/goodsDeails',
    },
  });

  var route = {
    'merchant': {
      'productAdd': initProductAdd,
      'productModify': initProductModify,
      'productList': initProductList,
    },
  };

  require(['core'], function (ybzf) {
    var controllerAction = ybzf.getControllerAction();
    var controller = controllerAction[0];
    var action = controllerAction[1];
    $('#detail_tpl').val(ybzf.getUrlParam('type') || 20);
    route[controller][action];
  });


  /*switch (url) {
    case '/admin/bshop/product_list':
    case '/admin/':
    case '/admin':initProductList();break // 商品列表
    case '/admin/bshop/product_new' :initProductNew();break  // 新增商品
    case '/admin/bshop/product_add' :initProductAdd();break  // 编辑商品
  }*/
}());

/**
 * 初始化
 */
$(function () {
  $(document).on('click', '.sui-dropdown-menu a', function () {
    var $target = $(this),
      $li = $target.parent(),
      $container = $target.parents('.sui-dropdown, .sui-dropup'),
      $menu = $container.find("[role='menu']")
    if ($li.is('.disabled, :disabled')) {return}
    if ($container.is('.disabled, :disabled')) {return}
    $container.find('input').val($target.attr('value') || '').trigger('change')
    $container.find('[data-toggle=dropdown] span').html($target.text())
    $menu.find('.active').removeClass('active')
    $li.addClass('active')
    $li.parents('[role=presentation]').addClass('active')
  });
});

/** ****************商品列表*******************/

// 商品列表初始化
function initProductList () {
  // region我是回收站的处理哦
  var goodsStatus = ~~(location.search.match(/.*goods_status=(\d+).*/) || [])[1];

  if (goodsStatus === 4) {
    // 把搜索框弄一下
    var $status = $('[name=status]').val(4);
    $status.parents('.sui-dropdown').addClass('disabled');
    $status.siblings('span').empty().append('已删除');
    $('.putaway_batch_btn').hide();
    $('.saleout_batch_btn').hide();
    $('.restore_batch_btn').show();
  }
  // endregion

  require(['product'], function (product) {

    var isDel = $('input[name="isDel"]').val()

    if(isDel) {

      setTimeout(function () {// 延迟1.5秒，搜索有延迟

        product.getProductList()

      }, 1500)
    }else{

      product.getProductList()

    }

    product.getProductCategory()

  })

    // 事件
  ProductListEvents()
}

// 查询报表
/*$('#search_report').click(function () {
  require(['product'], function (product) {
    product.exportProductList()
  })

})*/

// 事件绑定
function ProductListEvents () {

  require(['product'], function (product) {

        /**
         * 商品列表页面所有文本框按回车时搜索商品
         */
    $("[type='text']").keyup(function (event) {
      if(event.keyCode == 13) {
        product.product_list_pageno = 1
        product.getProductList()
      }
    })
        // 搜索商品
    $('#search_btn').click(function () {
      product.product_list_pageno = 1
      product.getProductList()
    })
    $('.more_condition_a').click(function () {

      product.get_more_condition()
    })
        // 上架商品
    $('.putaway_btn').on('click', function () {
      var goods = $(this).parents('tr').find("input[name='goods_id']").val()
      product.productPutaway(goods)
    })

        // 下架商品
    $('.saleout_btn').on('click', function () {
      var goods = $(this).parents('tr').find("input[name='goods_id']").val()
      product.productSaleout(goods)
    })

        // 还原商品
    $('.restore_btn').on('click', function () {
      var goods = $(this).parents('tr').find("input[name='goods_id']").val()
      product.productRestore(goods)
    })

        // 批量上架商品
    $('.putaway_batch_btn').on('click', function () {
      var goods = ''

      $("input[name='gid']:checkbox:checked").each(function () {
        goods += $(this).parents('tr').find("input[name='goods_id']").val() + ','
      })

      goods = goods.replace(/(,*$)/g, '')

      product.productPutaway(goods)
    })

        // 强制批量上架
    $(document).on('click', '#hard-up', function () {
      var goods_id_str = $('#goods_id_str').val()

      if(goods_id_str == '') {
        var num = 0
      }else{
        var num = goods_id_str.split(',').length

      }

      $('#product_status').modal('hide')

      product.productHardPutaway(goods_id_str, num)
    })

        // 批量下架商品
    $('.saleout_batch_btn').on('click', function () {
      var goods = ''

      $("input[name='gid']:checkbox:checked").each(function () {
        goods += $(this).parents('tr').find("input[name='goods_id']").val() + ','
      })

      goods = goods.replace(/(,*$)/g, '')
      product.productSaleout(goods)
    })

        // 批量还原商品
    $('.restore_batch_btn').on('click', function () {
      var goods = ''

      $("input[name='gid']:checkbox:checked").each(function () {
        goods += $(this).parents('tr').find("input[name='goods_id']").val() + ','
      })

      goods = goods.replace(/(,*$)/g, '')
      product.productRestore(goods)
    })

        // 刷新商品
    $('.refresh_btn').on('click', function () {
      var goods = $(this).parents('tr').find("input[name='goods_id']").val()
      product.productRefresh(goods)
    })
        // 条形码
    $('#clear_up').on('click', function () {// 清空条形码
      $('#bar_code_input').val('')
    })

    $('.bar_code_edit').on('click', function (e) {
      var bargoods = $(this).attr('data-ids')
      var barcodes_num = $(this).attr('data-bars')
      $('#bar_goodsid').val(bargoods)
      $('#bar_code_input').attr('value', '').val(barcodes_num)
      $('#bar_code_ok').on('click', function () {
        if($('#bar_code_input').val() == '') {
          layer.msg('条形码不能为空!')
          location.reload()
          return
        }
        product.productBarCode(bargoods)
      })

    })

        // 二维码
    $('.qr_code_edit').on('click', function () {
      var goods_id = $(this).next('input[name="goods_id"]').val()
      console.log(goods_id);
      // if(!goods_id) {
      //   layer.msg('商品不能为空')
      //   return
      // }
      // var goods_info = $(this).siblings('input[name="goods_info"]').val()
      // product.QRCode(goods_id, 0, goods_info)
    })
        // 批量下载二维码
    $('.qrcode_batch_btn').on('click', function () {
      var goods = ''
      $("input[name='gid']:checkbox:checked").each(function () {
        goods += $(this).parents('tr').find("input[name='goods_id']").val() + ','
      })
      goods = goods.replace(/(,*$)/g, '')
      product.QRCodeDownload(goods)
    })

        // 全选
    $('.select_all_btn').on('click', function () {
      if(this.checked) {
        $('.select_all_btn').attr('checked', true)
        $('.select_all_btn').parent().addClass('checked')
        $("input[name='gid']:checkbox").each(function () {
          $(this).attr('checked', true)
          $(this).parent().addClass('checked')
        })

      }else {

        $('.select_all_btn').attr('checked', false)
        $('.select_all_btn').parent().removeClass('checked')
        $("input[name='gid']:checkbox").each(function () {
          $(this).attr('checked', false)
          $(this).parent().removeClass('checked')
        })
      }
    })

        // 记录的选择框 (用于判断是否需要全选框是否选中)
    $("input[name='gid']").on('click', function () {
      if(this.checked) {
        if($("input[name='gid']:checkbox:checked").length == $("input[name='gid']:checkbox").length) {
          $('.select_all_btn').attr('checked', true)
          $('.select_all_btn').parent().addClass('checked')
        }
      }else{

        $('.select_all_btn').attr('checked', false)
        $('.select_all_btn').parent().removeClass('checked')
      }
    })

        // 选择分类
    $('#lee_add_classify a').on('click', function () {
      $('#lee_add_classify_a').html('<i class="caret"></i>' + ($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>', '')))
      $("input[name='classify']").val($(this).attr('data'))
    })

        // 商品显示数目选择
    $('.page_size_select').on('change', function () {
      var pagesize = $(this).val()

      product.product_list_pageno = 1
      product.cur_per_page = pagesize

      product.getProductList()
    })
  })
}

// 刷新商品列表
function ProductRefreshList () {
  require(['product'], function (product) {
    setTimeout(function () {// 延迟1.5秒，搜索有延迟

      product.getProductList()

    }, 1500)

  })
}

/** ****************新增商品*******************/

function initProductNew () {

  require(['core', 'product'], function (core, product) {

        // 选中模板
    $('#start_write').click(function () {
      var type = $("input[name='type']").val()

      window.location.href = core.getHost() + '/admin/bshop/product_add?type=' + type
    })

    var sourcr_uri = $('#check_modal').data('base-url')
    if (sourcr_uri) {
      sourcr_uri += '/b/static'
    } else {
      sourcr_uri = '/source/managers'
    }

    $('#import_new').on('click', function () {
      $('#file_name').val('')
      url = '_update'
      name = '更新'
      option = 'update'
      location.hash = '#up'
      $('#tag_address').attr('href', sourcr_uri + '/elsefile/ypl' + url + '.xls')
      $('#on_type').html('药品' + name)
      $('#file_name').val('')
      $('#check_modal').val(0)
      $('#import_btn').val('确定更新')
      $('#is_disable').css('display', 'none')
      $('#import_message').html('系统数据仅供参考，根据商品编码匹配商品成功后，请您务必核对，确保与实际商品一致。（最多支持一次导入1000条记录，超过请分批次导入。）')
    })

    $('#import_add').on('click', function () {
      $('#file_name').val('')
      url = ''
      name = ''
      option = 'add'
      location.hash = '#ad'
      $('#tag_address').attr('href', sourcr_uri + '/elsefile/ypl.xls')
      $('#on_type').html('药品')
      $('#check_modal').val(0)
      $('#import_btn').val('确定上传')
      $('#is_disable').css('display', 'block')
      $('#import_message').html('系统数据仅供参考，根据批准文号匹配商品成功后，请您务必核对，确保与实际商品一致。（最多支持一次导入1000条记录，超过请分批次导入。）')
    })

        // 选择模板类型
    $('#check_modal').on('change', function () {

            // FIXME 这里是部分商家升级做的兼容处理

      switch ($('#check_modal').val()) {
        case '':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/ypl' + url + '.xls')
          $('#on_type').html('药品' + name)
          break
        case'10':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/ypl' + url + '.xls')
          $('#on_type').html('药品' + name)
          break
        case'40':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/bjp' + url + '.xls')
          $('#on_type').html('保健品' + name)
          break
        case'30':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/qixie' + url + '.xls')
          $('#on_type').html('器械类' + name)
          break
        case'80':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/xiaodu' + url + '.xls')
          $('#on_type').html('消毒类' + name)
          break
        case'60':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/hzp' + url + '.xls')
          $('#on_type').html('化妆品' + name)
          break
        case'70':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/zhyc' + url + '.xls')
          $('#on_type').html('中药材' + name)
          break
        case'20':
          $('#tag_address').attr('href', sourcr_uri + '/elsefile/qita' + url + '.xls')
          $('#on_type').html('其他类' + name)
          break
      }
    })

        // 上传csv
    $(document).on('click', '.submit-csv-file', (function () {
      var active = true
      return function () {
        if (active) {
          active = false
          product.batchImportProduct(option).always(function () {
            active = true
          })
        }
      }
    })())

    var t = {'up': 'import_new', 'ad': 'import_add'}[location.hash.replace('#', '')]
    if (t) {
      $('#' + t).trigger('click')
    }
  })
}
// 文件选择
function ProductNewFileChange (e, type) {
  if(type) {
    document.getElementById(type).value = e
  }else{
    document.getElementById('file_name').value = e
  }
}

// 设置回收站
$('#recycle_opt').on('click', function (index) {

  var now_recycle = $('input[name="is_recycle"]:checked').val()

  var content = '当导入的商品在回收站中有相似（或相同）的商品存在，<label style="color: #FF0000">回收站相似（或相同）</label>的商品如何处理？<div>'

  if (now_recycle == 1) {

    content = content + '<input name="recycle" type="radio" value="1" checked>还原并保留<input  name="recycle" type="radio" value="0" style="margin-left: 80px;">保留回收站</div>'

  } else {

    content = content + '<input name="recycle" type="radio" value="1">还原并保留<input  name="recycle" type="radio" value="0" style="margin-left: 80px;" checked>保留回收站</div>'

  }

  layer.confirm(content,

        {title: '设置【回收站】商品', icon: 3, btn: ['保存', '取消']},

        function (index) {
          var val = $('input[name="recycle"]:checked').val()
          if(val == 1) {
            var msg = '还原并保留'
          }else{
            var msg = '保留回收站'
          }

          $('input[name="is_recycle"]').val(val)
          $('#now_checked').html('(' + msg + ')')

          layer.close(index)

        }
    )

})

/** ****************编辑商品*******************/

function initProductAdd () {
  require(['product', 'edit'], function (product, edit) {

    if($('input[name="detail_tpl"]').val() == '10') {
      if($('input[name="drug_category"]').val() == '130' || $('input[name="drug_category"]').val() == '140') {
        $('.drug_category_msg').removeClass('lee_hide')
      }else{
        $('.drug_category_msg').addClass('lee_hide')
      }
    }
        // 初始化富文本编辑器
    createKindEditor();
        // 初始化分类
    product.getCategory();

    // TODO 商品字段信息 根据模板必填字段不一样
    var detailTpl = $('#detail_tpl').val();
    edit.initFieldInfo(detailTpl);

    // 校验
    edit.editAddValidate();
    // 添加事件
    ProductAddEvents();
    // 规格格式检查
    edit.specifcationInspect();
  });

  $(function () {
    if($('#pre_order_set').val() == 140 || $('#pre_order_set').val() == 130 || $('#pre_order_set').val() == 150) {
      $('#wx_purchase_way130').attr('checked', true);
    }
  });
}

function initProductModify () {
  initProductAdd();
  require(['goodsDeails']);
}

// 事件
function ProductAddEvents () {
  require(['edit', 'pubmig'], function (edit, pubmig) {
    $('#Hpc_active').click(function () {
      $('#pc_active').removeClass('hide')
      $('#phone_active').addClass('hide')
    })
    $('#Hphone_active').click(function () {
      $('#phone_active').removeClass('hide')
      $('#pc_active').addClass('hide')
    })

    $('.pc_save').click(function () {
      edit.SaveText('pc')
    })
    $('.phone_save').click(function () {
      edit.SaveText('phone')
    })

    $('#product_form').validate({
      success: function ($form) {
        $('#wx_purchase_way130').val($('#pre_order_set').val())
        if($('#wx_purchase_way130').prop('checked') == true && ($('#pre_wx').prop('checked') == false && $('#pre_phone').prop('checked') == false) && !$('#wx_purchase_way130').val()) {
          layer.alert('您还没有设置“显示【预约购买】”的类型');
        } else {
          edit.editSaveItem();
        }

        return false;
      },
      unhighlight: function ($input, $error, inputErrorClass) {
        $input.removeClass(inputErrorClass);
        $error.hide();
      },
    })

    // 相同商品确认
    $('.continue_submit').click(function () {
      $('#product_form_submit').click()
    })
        // 显示预约“设置”按钮
    $('.order_buyer_out').click(function () {
      if($('#pre_order_set').val() == 130) {
        $('#pre_wx').prop('checked', true)
        $('#pre_phone').prop('checked', true)
      }else if($('#pre_order_set').val() == 140) {
        $('#pre_wx').prop('checked', false)
        $('#pre_phone').prop('checked', true)
      }else if($('#pre_order_set').val() == 150) {
        $('#pre_wx').prop('checked', true)
        $('#pre_phone').prop('checked', false)
      }else{
        $('#pre_wx').prop('checked', false)
        $('#pre_phone').prop('checked', false)
      }
    })
        // 显示预约“设置” 保存按钮设置
    $('.order_buyer_save').click(function () {
      if($('#pre_wx').prop('checked') == true && $('#pre_phone').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
        $('#wx_purchase_way130').attr('value', 130)
        $('#pre_order_set').attr('value', 130)
      }else if($('#pre_phone').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
        $('#wx_purchase_way130').attr('value', 140)
        $('#pre_order_set').attr('value', 140)
      }else if($('#pre_wx').prop('checked') == true && $('#wx_purchase_way130').prop('checked') == true) {
        $('#wx_purchase_way130').attr('value', 150)
        $('#pre_order_set').attr('value', 150)
      }
      if($('#wx_purchase_way130').prop('checked') == false) {
        layer.alert('您未选择“预约购买”!')
        return false
      }
    })
        // 获取批准文号
    $('#get_drug_info').click(function () {

      edit.editGetApprovalNumber()
    })

        // 判断限数是否显示
    $('input[name="control_num_radio"]').click(function () {
      edit.editControlNum(this)
    })

        // 品牌处理
    $('input[name="brand_name"]').change(function () {
      edit.editBrand(this)
    })

        // 设置商品二维码提示文字信息
    $('.set-site-qRcodeTips-btn').click(function () {
      edit.editQRcodeTips()
    })

        // 选择分类
    $('#lee_add_classify').on('click', 'a', function () {
      $('#lee_add_classify_a').html('<i class="caret"></i>' + ($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>', '')))
      $("input[name='classify']").val($(this).attr('data'))
    })

        // 设置(页面二维码)按钮，弹框时将里面的内容重置
    $('.set-dimension-btn-dialog').click(function () {
      $('#site-qRcodeTips').val($('#site-qRcodeTips').next().val())
    })
    $('.getGoodsIconStatus').click(function () {
      edit.getGoodsIconStatus()
    })
    $('.setGoodsIconStatus').click(function () {
      edit.setGoodsIconStatus()
    })
        // 更多图片
    document.getElementById('input_file').addEventListener('change', ProductAddHandleFileSelect, false)

        // 删除商品事件
    $('.deleteItem').on('click', function () {
      layer.confirm('确定要删除吗？', function (idx) {
        layer.close(idx);
        edit.editDeleteGood();
      });
    })

    $('[data-rules]').on('focus', function () {
      $(this).parents('.controls').find('.sui-msg.msg-error.help-inline').each(function () {
        $(this).remove()
      })
    })

    $('input[name="drug_category"]').change(function () {
      if($('input[name="detail_tpl"]').val() == '10') {
        if($(this).val() == '130' || $(this).val() == '140') {
          $('.drug_category_msg').removeClass('lee_hide')
        }else{
          $('.drug_category_msg').addClass('lee_hide')
        }
      }
    })
        // 图片选择事件
    pubmig.ImgEvents()

  })
}
// 医保协议
function ProductAddGetProtocol () {

  require(['edit'], function (edit) {

    edit.editProtocol()

  })
}

// 富文本编辑器
function createKindEditor () {
  require(['edit'], function (edit) {

    edit.setKindEditor(editor1, editor2, editor3)

  })
}

// 文件上传
function ProductAddHandleFileSelect (evt) {
  require(['edit'], function (edit) {
    edit.editHandleFileSelect(evt).done(function (img_url) {
      if(curEdit == 'kindeditor_lee_3') {
        if($('#qualification_default').val() == '') {
          editor3.html('')
          $('#qualification_default').val('editing')
        }
      }

      $.each(img_url, function (k, v) {
        KindEditor.insertHtml('.' + curEdit, "<img src='" + v + "' />");
      });
    });
  })
}

// 图片选择
function ProductAddImgSelect () {
  require(['pubmig'], function (pubmig) {
    pubmig.ShowSpaceImg()
  })
}
