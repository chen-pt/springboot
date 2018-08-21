$(document).ready(function () {
  var curWwwPath = window.document.location.href;
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  var baseUrl = window.document.location.href.substring(0, pos);//项目路径

  getgoodsList(1, false);
});
function getgoodsList(currentPage, isSelect) {
  var pageSize = 15;
  var datas = {};
  if (isSelect) {
    var classify = $("input[name='classify']").val();

    datas.cate_id = classify > 0 ? classify : "";

    //datas.current_page = product.product_list_pageno;

    //datas.per_page = product.cur_per_page;

    datas.drug_name = $("input[name='drug_name']").val().trim();

    datas.approval_number = $("input[name='approval_number']").val();

    datas.id = $("input[name='id']").val();

    datas.specif_cation = $("input[name='specif_cation']").val();

    datas.specif_code = $("input[name='specif_code']").val();

    datas.brand_name = $("input[name='brand_name']").val().trim();

    datas.start_date = $("input[name='start_date']").val();

    datas.end_date = $("input[name='end_date']").val();

    datas.goods_company = $("input[name='goods_company']").val();

    datas.has_image = $("input[name='has_image']").val();

    datas.udateimg_status = $("input[name='update_img']").val();

    datas.detail_tpl = $("input[name='detail_tpl']").val();

    datas.goods_status = $("input[name='goods_status']").val();

    datas.update_status = $("input[name='update_status']").val();
  }

  datas.page = currentPage;
  datas.pageSize = pageSize;
  AlertLoading($("tbody"));
  $.ajax({
    type: 'POST',
    url: "./query2",
    data: datas,
    dataType: 'json',
    success: function (data) {
      console.log(data, 'nice');
      $("tbody").empty();
      if (data == null || data.result == null || data.result.items == null) {
        return
      }
      for (var i = 0; i < data.result.items.length; i++) {
        var goods = data.result.items[i];

        // console.log(goods,'goods.def_url');
        // var imageId=goods.def_url?(+goods.def_url.substring(goods.def_url.lastIndexOf(":"+1,goods.def_url.length-1))):"";
        var imageIdurl = goods.def_url ? '<div class="pre-thumb" data-item-id="' + goods.goods_id + '"><img src="' + $("#img_url_prefix_jk51").val() + goods.def_url.hash + '.jpg' + '" /><div class="thumb-pack"> <div style="line-height: 40px;white-space: nowrap;margin: 0 10px">请稍后，正在加载...</div> </div> </div>' : '暂无图片';//  暂无图片配图路径  templates/views/resource/merchant/img/empty.jpg
        // console.log(imageIdurl,'imageIdurl');
        // console.log(imageId);
        var update_img;
        if (goods.update_img == 1) {
          update_img = "已处理";
        } else if (goods.update_img == 0) {
          update_img = "未处理";
        }
        ;
        var goods_status;
        if (goods.goods_status == 2) {
          goods_status = "已审核";
        } else if (goods.goods_status == 1) {
          goods_status = "未审核";
        } else if (goods.goods_status == 3) {
          goods_status = "已删除";
        } else if (goods.goods_status == 10) {
          goods_status = "初审";
        }
        ;
        var update_status;
        if (goods.update_status == 0) {
          update_status = "锁定";
        } else if (goods.update_status == 1) {
          update_status = "可更新";
        }
        ;

        if (datas.goods_status == 3) {
          var editNode = "<td><a class='change' href='/jk51b/goods/modify?goods_status=3&goods_id=" + goods.goods_id + "' target='_blank'><i class='sui-icon icon-edit' title='编辑'></i></a> <a class='change' href='/jk51b/goods/joinimg?goodId=" + goods.goods_id + "' target='_blank'> <i class='sui-icon icon-picture'></i> </a> </td>"
        } else {
          var editNode = "<td><a class='change' href='/jk51b/goods/modify?goods_id=" + goods.goods_id + "' target='_blank'><i class='sui-icon icon-edit' title='编辑'></i></a> <a class='change' href='/jk51b/goods/joinimg?goodId=" + goods.goods_id + "' target='_blank'> <i class='sui-icon icon-picture'></i> </a> </td>";
        }
        $("tbody").append("<tr>" +
          "<td><input type='checkbox' value='" + goods.goods_id + "' class='del-flag'></td>" +
          "<td>" + goods.goods_id + "</td>" +
          "<td>" + goods.approval_number + "</td>" +
          "<td>" + goods.drug_name + "</td>" +
          "<td>" + goods.specif_cation + "</td>" +
          "<td>" + goods.goods_company + "</td>" +
          "<td>" + imageIdurl + "</td>" +
          "<td>" + update_img + "</td>" +
          "<td>" + goods_status + "</td>" +
          "<td>" + update_status + "</td>" +
          "<td>" + goods.update_time + "</td>" +
          editNode +
          "</tr>");
      }


      addpage(data.result.current, data.result.total_items, pageSize);

      if (!$('#pageinfo').find('span:contains(条记录)')) {
        $('#pageinfo').find('span:contains(共)').append("(" + data.result.total_items + "条记录)");

      }
      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");

    },
    error: function () {
      console.log("error ....");
    }
  });
}

(function () {
  var timeId;
  $(document).on('mouseover', '.pre-thumb', function () {
    var self = $(this);
    timeId = setTimeout(function () {
      var goods_id = self.attr("data-item-id");
      $.ajax({
        url: "findImgView",
        data: {"goodId": goods_id},
        dataType: 'json',
        success: function (data) {
          if (data.status) {
            $(self).find(".thumb-pack").empty();
            var mainImg = "";
            var otherImg = "";
            for (var i = 0; i < data.results.imgs.length; i++) {
              if (data.results.imgs[i].is_default) {
                mainImg = '<a href="/jk51b/goods/joinimg?goodId= '+ goods_id +'"  target="_blank"><img src="' + imgLink(data.results.imgs[i].hash, 900, 900, '.jpg') + '"/></a>';
              } else {
                otherImg += '<a href="/jk51b/goods/joinimg?goodId= '+ goods_id +'"  target="_blank"><img  src="' + imgLink(data.results.imgs[i].hash, 900, 900, '.jpg') + '"/></a>';
              }
              //var html = '<img src="'+$("#img_url_prefix_jk51").val()+'/80x80/' + data.results.imgs[i].hash + '.jpg' + '"/>';

            }
            $(self).find(".thumb-pack").append(mainImg)
            $(self).find(".thumb-pack").append(otherImg);
            $(self).find(".thumb-pack").css('width', 80 * data.results.imgs.length);
            $(self).data('has_get', true);
          }
        }

      });
    }, 500);
    $(this).children(".thumb-pack").css("display", "block");
  }).on('mouseout', '.pre-thumb', function () {
    clearTimeout(timeId);
    $(this).children(".thumb-pack").css("display", "none");
  });
})();


function addpage(currentPage, total, pageSize) {
  $('#pageinfo').pagination({
    itemsCount: currentPage,
    pageSize: pageSize,
    styleClass: ['pagination-large'],
    showCtrl: true,
    displayPage: 10,
    currentPage: currentPage,
    onSelect: function (num) {
      getgoodsList(num, true);
    }
  });

  $('#pageinfo').pagination('updateItemsCount', total, currentPage);
  $('#pageinfo').find('span:contains(共)').append("(" +  total + "条记录)");
};

$(document).on('click', '.sui-dropdown-menu a', function () {
  var $target = $(this),
    $li = $target.parent(),
    $container = $target.parents('.sui-dropdown, .sui-dropup'),
    $menu = $container.find("[role='menu']")
  if ($li.is('.disabled, :disabled')) {
    return
  }
  if ($container.is('.disabled, :disabled')) {
    return
  }
  $container.find('input').val($target.attr('value') || '').trigger('change')
  $container.find('[data-toggle=dropdown] span').html($target.text())
  $menu.find('.active').removeClass('active')
  $li.addClass('active')
  $li.parents('[role=presentation]').addClass('active')
});

$(document).on('click', '#check-all-goodsList', function () {
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
$(document).on('click', '#batch-del-goodsList', function () {
  var $checkedInput = $('.del-flag:checked');
  if ($checkedInput.size() == 0) {
    layer.msg('未选中任何商品');
    return;
  }
  var ids = $checkedInput.map(function () {
    return this.value;
  }).get().join(',');

  layer.confirm('总计' + $checkedInput.size() + '个商品，你确定删除吗?', function () {
    $.ajax({
      type: 'POST',
      url: "./delete",
      data: {'ids': ids},
      dataType: 'json',
      success: function (data) {
        layer.msg("删除成功！！！");
        getgoodsList(1, true);
      },
      error: function () {
        layer.msg("删除失败！！！");
      }
    })
  });
});

// 批量处理
$(document).on('click', '#handle-all-goodsList', function () {
  var $checkedInput = $('.del-flag:checked');
  if ($checkedInput.size() == 0) {
    layer.msg('未选中任何商品');
    return;
  }
  var ids = $checkedInput.map(function () {
    return this.value;
  }).get().join(',');

  layer.confirm('总计' + $checkedInput.size() + '个商品，你确定吗?', function () {
    $.ajax({
      type: 'POST',
      url: "./batchHandle",
      data: {'ids': ids},
      dataType: 'json',
      success: function (data) {
        layer.msg("批量处理商品图片成功！！！");
        getgoodsList(1, true);
      },
      error: function () {
        layer.msg("批量处理商品图片失败！！！");
      }
    })
  });
});
