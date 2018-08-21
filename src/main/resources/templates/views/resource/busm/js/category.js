require(['common', 'core/pagin', 'sui'], function(YBZF ,pagin) {
  // region 初始化
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
    $li.addClass("active");
    $li.parents('[role=presentation]').addClass('active');
  });
  // endregion

  newpagein();

  $("#search_btn").on("click",function() {
    getList(1);
    //pageinClassify();
  });

  $('.sui-nav').on('shown', function(e) {
    if(e.target.id == 'shop_category') {
      getList(1);
      //pageinClassify();
    } else {
      newpagein();
    }
  });

  // 变量
  var curParentId = 0;

  // 分类设置
  function newpagein() {
    $.ajax({
      'url': YBZF.hostname + '/shop/getYbzfCategoryList',
      'type': 'post',
      'data': '',
      'dataType': 'json'
    }).done(function (rsp) {
      var html = $("#shop-set-temp").html();
      html = $.tmpl(html, rsp);
      $("#shop-set").empty().append(html);

      //一级子类展开
      $(".first_classify>p i").on("click", function() {
        if ($(this).parents(".first_classify").find(".second_classify").hasClass("hide")) {
          $(this).removeClass("icon-caret-right").addClass("icon-caret-down");
          $(this).parents(".first_classify").find(".second_classify").removeClass("hide");
        } else {
          $(this).removeClass("icon-caret-down").addClass("icon-caret-right");
          $(this).parents(".first_classify").find(".second_classify").addClass("hide");
        }
      });

      //二级子类展开
      $(".second_classify>p i").on("click", function () {
        if ($(this).parents(".second_classify").find(".third_classify").hasClass("hide")) {
          $(this).removeClass("icon-caret-right").addClass("icon-caret-down");
          $(this).parents(".second_classify").find(".third_classify").removeClass("hide");
        } else {
          $(this).removeClass("icon-caret-down").addClass("icon-caret-right");
          $(this).parents(".second_classify").find(".third_classify").addClass("hide");
        }
      });

      //moseover moseout事件
      $(".p").on("mouseover", function () {
        $(this).find(".hide").removeClass("hide");
      }).on("mouseout", function () {
        $(this).find(".add_sub_classify").addClass("hide");
        $(this).find(".del_classify").addClass("hide");
      });

      // 添加一级分类
      $(".add_first_sub_classify").on("click", function () {
        $("#qs_floor_span").html("一");
        $("#alert_title").html("");
        curParentId = 0;
      });

      /**添加子类目**/
      $('.add_sub_classify').on("click", function () {
        var classifyId=$(this).attr("data-id");
        console.log(classifyId);
        if($(this).hasClass("second")) {
          $("#qs_floor_span").html("二");
          $("#alert_title").html("上级分类：" + $(this).parents(".first_classify").children("p").find("input").val());
        } else {
          $("#qs_floor_span").html("三");
          $("#alert_title").html("上级分类：" + $(this).parents(".first_classify").children("p").find("input").val() + ">" + $(this).parents(".second_classify").children("p").find("input").val());
        }
        curParentId = classifyId;
     });
    });
  }

  // 添加分类保存
  $(".save_add_classify_qs").on("click", function() {
    var newcate_name=trim($("#add_classify").find("input[type='text']").val());
    if(!newcate_name) {
      alert("请输入分类名！");
      return false;
    }
    $.ajax({
      'url':YBZF.hostname +'/shop/addClassify',
      'type': 'post',
      data: {
        'cate_name': newcate_name,
        'parent_id': curParentId
      },
      'dataType': 'json'
    }).done(function (rsp) {
        if( rsp.status ) {
          alert("保存成功！");
          location.reload();
        } else {
        alert(rsp.result.msg);
      }
    });
  });

  /**批量展开/收缩**/
  var isUnfold=false;
  $(".qs-unfold-shrink").on("click", function () {
    isUnfold = !isUnfold;
    if (isUnfold) {
      $(this).html("－展开");
      $(".first_classify>p i").removeClass("icon-caret-right").addClass("icon-caret-down").parents(".first_classify").find(".second_classify").removeClass("hide");
      $(".second_classify>p i").removeClass("icon-caret-right").addClass("icon-caret-down").parents(".second_classify").find(".third_classify").removeClass("hide");
    } else {
      $(this).html("+展开");
      $(".first_classify>p i").removeClass("icon-caret-down").addClass("icon-caret-right").parents(".first_classify").find(".second_classify").addClass("hide");
      $(".second_classify>p i").removeClass("icon-caret-down").addClass("icon-caret-right").parents(".second_classify").find(".third_classify").addClass("hide");
    }
  });

  // 修改分类
  $(document).on('click', '.change_classify', function() {
    var $change_classify = $(this);
    var itemid = this.dataset.id;
    $('#change_classifyDialog').modal({
      'backdrop': 'static',
      'show': true
    }).on('shown', function() {
      $('#categoryGroup').tree({
        src : YBZF.hostname + '/services/categoryTree',
        placeholder : '-- 请选择 --',
        jsonp : true
      });
    });

    // 确认修改
    $('#modify-category-btn').one('click', function() {
      // 获取选择的分类
      var $selected = $('#categoryGroup').find('option:selected[value!=""]:eq(-1)');
      var cate_id   = $selected.val();
      var cate_name = $selected.html();

      if( ! cate_id ) {
        layer.msg('你还没有选择分类');
      } else {
        YBZF.services({
          'url': YBZF.hostname + '/shop/updateCateId',
          'type': 'post',
          'data': {
            'itemid': itemid,
            'cate_id': cate_id
          },
          'dataType': 'json'
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg( rsp.result.msg );
            // 选择分类的TD将内容替换
            $change_classify.parents('td').siblings('td.category_name').empty().append( cate_name );
          } else {
            layer.msg( rsp.result.msg || '未知错误' );
          }
          console.log(rsp);
        }).fail(function() {
          // TODO 请求失败
        });
      }
    });
  });

  $(document).on('click', '#save-classify-btn', function() {
    var datas = [];

    // 获取到被修改过的分类
    $('#shop-set').find('input').each(function() {
      if( this.value != this.dataset.value ) {
        datas.push({
          'cate_id': this.dataset.id,
          'value': this.value,
          'parent_id': this.dataset.pid
        });
      }
    });

    if( ! datas.length ) {
      layer.msg('没有任何分类需要修改');
      return;
    }

    // 发送数据
    YBZF.services({
      'url': YBZF.hostname + '/shop/editCategory',
      'data': {
        'categorys': datas
      }
    }).done(function(rsp) {
      if( rsp.status ) {
        layer.alert(rsp.result.msg, function() {
          location.reload();
        });
      } else {
        layer.msg( rsp.result.msg || '未知错误' );
      }
    }).fail(function() {
      // TODO 失败处理
    });
  });

  //商品列表
  function getList(pageno) {
    pageno = pageno || 1;

    var pagesize      = $('.page-size-sel').val() || 15;
    var drug_name     = $("#drug_name").val();
    var user_cateid   = $("#user_cateid").val();
    var goods_status  = $("#goods_status").val();

    YBZF.services({
      'url': YBZF.hostname + '/shop/getClassify',
      'data': {
        'pageno': pageno,
        'pagesize': pagesize,
        'drug_name': drug_name,
        'user_cateid': user_cateid,
        'goods_status': goods_status
      }
    }).done(function (rsp) {
      if( rsp.status ) {
        var html = $("#shop-classify-temp").html();
        html = $.tmpl(html, rsp.result);
        $("#shop-classify").empty().append(html);

        pagin('#pagination', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
      } else {
        // 没有数据
        $("#shop-classify").empty().append("<tr>" + "<td colspan='8' style='text-align: center;' >" + "<div align='center' class='sui-msg msg-large msg-naked msg-error'>" +
        "<div class='msg-con'>没有查询到数据</div>" + "<s class='msg-icon'></s>" + "</div>" + "</td>" + "</tr>");
        $('#pagination').pagination('updatePages',1);
      }
    });
  }

  // 删除分类
  $(document).on('click', '.del_classify', function() {
    var cate_id = this.dataset.id;
    var self = $(this);

    layer.confirm('确定删除该分类吗?', {icon: 4, title:'警告'}, function(index){
      YBZF.services({
        'url': YBZF.hostname + '/shop/delcategory',
        'data': {
          'cate_id': cate_id
        }
      }).done(function(rsp) {
        if( rsp.status ) {
          layer.msg( rsp.result.msg );
          self.parent().parent('.classify').fadeOut('slow', function() {
            this.remove();
          });

        } else {
          layer.msg( rsp.result.msg || '未知错误' );
        }
      });

      layer.close(index);
    });
  });

  // 商品管理链接
  $(document).on('click', '.product_manager_a', function() {
    var user_cateid = this.dataset.id;
    // 显示商品分类
    $('#categorys').find('li[role=presentation]').each(function() {
      if( $(this).find('>a').attr('value') == user_cateid ) {
        var $active = $(this).find('>a');
        $('[name=user_cateid]').siblings('span').empty().append( $active.text() ).end().val( $active.attr('value') );
      }
    });

    $('#shop_category').tab('show');
  });

  // TODO 商品列表>商品分类
  function pageinClassify() {
    $.ajax({
      'url': YBZF.hostname + '/shop/getYbzfCategoryList',
      'type': 'post',
      'data': '',
      'dataType': 'json'
    }).done(function (data) {
    });
  }

});