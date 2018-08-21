/**
 * Created by boren on 15/9/1.
 * 商品
 */

define(['core'], function (core) {


    var product = {};

    product.product_list_pageno = 1;

    product.cur_per_page = 15;


    /*==========================================*/
    /*======== 商品列表页面
     /*==========================================*/
    //商品列表
   /* product.getProductList = function () {

        var datas = {};

        var classify = $("input[name='classify']").val();

        datas.cate_id = classify > 0 ? classify : "";

        datas.current_page = product.product_list_pageno;

        datas.per_page = product.cur_per_page;

        datas.goods_title = $("input[name='goods_title']").val().trim();

        datas.goods_status = $("input[name='status']").val();

        datas.bar_code_status = $("input[name='bar_code_status']").val();

        datas.bar_code = $("input[name='bar_code']").val();

        datas.drug_category = $("input[name='drug_category']").val();

        datas.drug_name = $("input[name='drug_name']").val().trim();

        datas.approval_vague = $("input[name='approval_number']").val().trim();

        datas.has_image = $("input[name='has_pic']").val();

        datas.goods_property = $("input[name='goods_property']").val();

        datas.shop_price = ($("input[name='price_small']").val() ? $("input[name='price_small']").val().trim() * 100 : "0") + "," + ($("input[name='price_large']").val() ? $("input[name='price_large']").val().trim() * 100 : "99999999");

        datas.barnd_name = $("input[name='brand_name']").val().trim();

        datas.detail_tpl = $("input[name='detail_tpl']").val();

        datas.purchase_way = $("input[name='purchase_way']").val();

        datas.wx_purchase_way = $("input[name='wx_purchase_way']").val();

        datas.goods_code = $("input[name='goods_code']").val();

        datas.order = "update_time desc,goods_id DESC";

        var url = core.getHost() + "/ecBgoodsList";

        $.post(url, datas, function (e) {

            var data = JSON.parse(e);

          /!*$("#product_table").empty();

            var tmpl = document.getElementById('product_list_templete').innerHTML;

            var doTtmpl = doT.template(tmpl);

            $("#product_table").html(doTtmpl(data));*!/



            if (data.status) {
                $('#pageinfo').pagination({
                    pages: data.result.total_pages,
                    styleClass: ['pagination-large'],
                    showCtrl: true,
                    displayPage: 6,
                    currentPage: product.product_list_pageno,
                    onSelect: function (num) {
                        product.product_list_pageno = num;

                        product.getProductList();
                    }
                });

                $('#pageinfo').find('span:contains(共)').append("(" + data.result.total_items + "条记录)");
                //页码选择
                product.AddPageExtd(product.cur_per_page);

                $('.select_all_btn').attr("checked", false);
                $('.select_all_btn').parent().removeClass("checked");
            }

        });

    };*/

    product.exportProductList=function () {
        var datas = {};

        var classify = $("input[name='classify']").val();

        datas.cate_id = classify > 0 ? classify : "";

        datas.current_page = product.product_list_pageno;

        datas.per_page = product.cur_per_page;

        datas.goods_title = $("input[name='goods_title']").val().trim();

        datas.goods_status = $("input[name='status']").val();

        datas.bar_code_status = $("input[name='bar_code_status']").val();

        datas.bar_code = $("input[name='bar_code']").val();

        datas.drug_category = $("input[name='drug_category']").val();

        datas.drug_name = $("input[name='drug_name']").val().trim();

        datas.approval_vague = $("input[name='approval_number']").val().trim();

        datas.has_image = $("input[name='has_pic']").val();

        datas.goods_property = $("input[name='goods_property']").val();

        datas.shop_price = ($("input[name='price_small']").val() ? $("input[name='price_small']").val().trim() * 100 : "0") + "," + ($("input[name='price_large']").val() ? $("input[name='price_large']").val().trim() * 100 : "99999999");

        datas.barnd_name = $("input[name='brand_name']").val().trim();

        datas.detail_tpl = $("input[name='detail_tpl']").val();

        datas.purchase_way = $("input[name='purchase_way']").val();

        datas.wx_purchase_way = $("input[name='wx_purchase_way']").val();

        datas.goods_code = $("input[name='goods_code']").val();

        datas.order = "update_time desc,goods_id DESC";

        var url = core.getHost() + "/admin/export/product_list";

        $('#search_report').addClass("lee_hide");
        $('.order_hint').html("正在处理，请稍后.....");

        $.post(url,datas,function(e){

            var data = JSON.parse(e);
            if(data[0] ==0)
            {
                $('.order_hint').html('共查询到 <span class="list_record"></span> 条记录，<a href="javascript:void(0)" class="download_address" >点击下载报表</a>');

                $(".download_address").attr("href",core.getHost()+"/"+data[1].addr);
                $(".list_record").html(data[1].num);
                $('#search_report').removeClass("lee_hide");
            }else{

                $('.order_hint').html(data[1]);
                $('#search_report').removeClass("lee_hide");
            }
        });
    }
    /**
     * sui 翻页控件增加页码选择框
     * @param pageSize
     * @constructor
     */
    product.AddPageExtd = function (pageSize) {

        var pagearr = [15, 30, 50, 100];

        var pageselect = '&nbsp;<select class="page_size_select">';

        $.each(pagearr, function () {

            if (this == pageSize) {
                pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>';
            } else {
                pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>';
            }
        });

        pageselect = pageselect + '</select>&nbsp;';

        $('#pageinfo').find('span:contains(共)').prepend(pageselect);

    };

    //获取分类
    product.getProductCategory = function () {
       /* var datas = {};

        datas.cate_id = "";
        datas.cate_ishow = "";
        datas.del_tag = "";
        datas.parent_id = "";

        $("#lee_add_classify").empty();

        var url = core.getHost() + "/merchant/categories";

        $.post(url, datas, function (e) {

            var data = JSON.parse(e);

            if (data.status) {
                for (var i = 0, len = data.result.length; i < len; i++) {
                    if (data.result[i].children) {
                        $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].cate_name + '</span></a><ul class="sui-dropdown-menu"><ul></li>');

                        for (var j = 0, j_len = data.result[i].children.length; j < j_len; j++) {
                            if (data.result[i].children[j].children) {
                                $("#lee_add_classify>li:eq(" + i + ")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">' + data.result[i].children[j].cate_name + '</span></a><ul class="sui-dropdown-menu"></ul></li>');

                                for (var k = 0, k_len = data.result[i].children[j].children.length; k < k_len; k++) {
                                    $("#lee_add_classify>li:eq(" + i + ")>ul>li:eq(" + j + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].children[k].cate_id + '">' + data.result[i].children[j].children[k].cate_name + '</a></li>');
                                }
                            } else {
                                $("#lee_add_classify>li:eq(" + i + ")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].children[j].cate_id + '">' + data.result[i].children[j].cate_name + '</a></li>');
                            }
                        }

                    } else {

                        $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="' + data.result[i].cate_id + '">' + data.result[i].cate_name + '</a></li>');
                    }
                }
            }
            $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');


        });*/
    };

    /**添加商品获取分类**/
    product.getCategory = function () {
      // require(['categoryChoose'], function () {
        /*$('#cate_box').category({
          defaultId: $('#initcateid').val(),
        });*/
      // });
    };
    //上架
    product.productPutaway = function (product_goods_ids) {

        console.log("product_goods_ids:" + product_goods_ids);

        if (product_goods_ids) {


            layer.confirm("确定要上架吗", {title: '提示', icon: 3}, function (index) {

                var url = core.getHost() + "/admin/bshop/product_putaway_ajax";

                var datas = {};

                datas.goods_ids = product_goods_ids;

                $.post(url, datas, function (e) {

                    var data = JSON.parse(e);

                    if (!data.status && typeof(data.result.error) == 'undefined') return false;

                    $("#product_status").modal("show");

                    $("#product_status .lee_status_table").empty();

                    $('#putarray_sure').prev().empty();

                    if (data.result.error.num == 0) {
                        $("#product_status .lee_status_ts").html("恭喜，成功上架" + data.result.success.num + "个。");

                    } else {

                        $("#product_status .lee_status_table").append("<tr><th>商品标题</th><th>失败原因</th><th>无法强制上架的原因</th></tr>");

                        var num = 0;

                        var hard = 0;

                        var goods_id = new Array();

                        for (var i = 0, len = data.result.error.success_list.length; i < len; i++) {

                            if(data.result.error.success_list[i].hard_msg && data.result.error.success_list[i].hard_msg != '无' && data.result.error.success_list[i].goods_status != 1){ //不可强制上架

                                num += 1;

                            }else{

                                goods_id.push(data.result.error.success_list[i].goods_id);
                            }

                            if (data.result.error.success_list[i].goods_status == 1) {

                                hard = hard + 1;  //已经上架成功的个数

                            } else {

                                $("#product_status .lee_status_table").append("<tr><td><a href='product_add?gid=" + data.result.error.success_list[i].goods_id + "' target='_blank'>" + data.result.error.success_list[i].name + "</a></td><td>" + data.result.error.success_list[i].message + "<span style='color:red;margin-left:20px'>x</span></td><td>" + data.result.error.success_list[i].hard_msg + "</td></tr>");
                            }

                        }

                        var no = (parseInt(data.result.error.num)-parseInt(num)-parseInt(hard));

                        if(no <= 0 ){
                            no = 0
                        }
                        $("#goods_id_str").val(goods_id.join(','));
                        $('#putarray_sure').before('<div style="float: left;cursor: pointer" id="hard-up"><a>强制批量上架</a></div>');
                        $("#product_status .lee_status_ts").html("上架成功" + data.result.success.num + "个，失败" + data.result.error.num + "个。<label style='color: #FF0000;'>(可以强制上架" + no + "个，已强制上架" + hard + "个)</label>");
                        product.getProductList();
                    }
                });

                layer.close(index);
            });

        } else {
            alert("请先选择商品！");
        }
    };

    //强制批量上架
    product.productHardPutaway = function (product_goods_ids, num) {
        layer.confirm("确定要<label style='color: #FF0000;'>强制上架</label>这<label style='color: #FF0000;'>" + num + "</label>个商品", {
            icon: 3,
            title: '提示'
        }, function (index) {
            if (product_goods_ids == '') {
                layer.alert('没有可以强制的商品', {title: '提示', icon: 2});
                return false;
            }
            $.ajax({
                'type': 'post',
                'url': core.getHost() + "/admin/bshop/product_hardaway_ajax",
                'data': {id_str: product_goods_ids},

                success: function (e) {
                    var res = JSON.parse(e);

                    if (res.status) {
                        if (res.result.success.num) {
                            layer.alert('恭喜，成功强制上架' + res.result.success.num + '个', {title: '提示', icon: 1})
                            ProductRefreshList();

                        } else {
                            layer.alert('没有可以强制的商品', {title: '提示', icon: 1})
                        }
                    }
                }
            });

            layer.close(index);
        });
    }

    //下架
    product.productSaleout = function (product_goods_ids) {

        console.log("product_goods_ids:" + product_goods_ids);

        if (product_goods_ids) {

            if (confirm("确定要下架吗？")) {

                var url = core.getHost() + "/admin/bshop/product_saleout_ajax";

                var datas = {};

                datas.goods_ids = product_goods_ids;

                $.post(url, datas, function (e) {

                    var data = JSON.parse(e);

                    if (!data.status && typeof(data.result.error) == 'undefined') return false;

                    $("#product_status").modal("show");
                    $("#product_status .lee_status_table").empty();
                    if (data.status) {
                        if (data.result.error.num == 0) {
                            $("#product_status .lee_status_ts").html("恭喜，成功下架" + data.result.success.num + "个。");
                        } else {

                            $("#product_status .lee_status_ts").html("下架成功" + data.result.success.num + "个，失败" + data.result.error.num + "个。");
                            $("#product_status .lee_status_table").appendChild("<tr><td>商品标题</td><td>失败原因</td></tr>");

                            for (var i = 0, len = data.result.error.success_list; i < len; i++) {
                                $("#product_status .lee_status_table").appendChild("<tr><td>" + data.result.error.success_list[i].name + "</td><td>" + data.result.error.success_list[i].message + "</td></tr>");
                            }
                        }

                        $('#putarray_sure').prev('#hard-up').remove();
                    }
                });
            }
        } else {
            alert("请先选择商品！");
        }
    };
    //还原
    product.productRestore = function (product_goods_ids) {
        if (product_goods_ids) {
          layer.confirm('确定要还原吗？', function (idx) {
            $.post('/merchant/product/restore', {goods_ids: product_goods_ids}, function (data) {
              layer.close(idx);

              var $statusModel = $('#product_status').modal('show');
              var $statusTable = $statusModel.find('.lee_status_table').empty();

              if (data.result.fail_num === 0) {
                $statusModel.find('.lee_status_ts').html('恭喜，成功还原' + data.result.success_num + '个。');
              } else {
                $statusModel.find('.lee_status_ts').html('还原成功' + data.result.success_num + '个，失败' + data.result.fail_num + '个。');
                $statusModel.find('.lee_status_table').append('<tr><td>商品标题</td><td>失败原因</td></tr>');
                $.each(data.result.error_list, function (k, v) {
                  var title = $('[name=goods_id][value=' + v.goods_id + ']').data('title');
                  $statusTable.append('<tr><td>' + title + '</td><td>' + v.reason + '</td></tr>');
                });
              }
            }, 'json');
          });
        } else {
            layer.alert("请先选择商品！");
        }
    }

    //刷新
    product.productRefresh = function (product_goods_ids) {
        console.log("product_goods_ids:" + product_goods_ids);

        var url = core.getHost() + "/admin/bshop/product_refresh_ajax";

        var datas = {};

        datas.goods_id = product_goods_ids;

        $.post(url, datas, function (e) {

            var data = JSON.parse(e);

            if (data.status) {
                alert("刷新成功！");

                product.getProductList();

            } else {
                alert(data.result.msg);
            }

        });
    };
    //增加条形码
    product.productBarCode = function () {


        var url = core.getHost() + "/admin/bshop/product_barcode";

        var datas = {};

        datas.goods_id = $("#bar_goodsid").val();
        datas.bar_code = $("#bar_code_input").val();
        if (!datas.bar_code && datas.bar_code == "0") {

            layer.confirm('未更改条形码', {btn: ['确定']}, function () {
                location.reload();
            })
            return;
        }
        $.post(url, datas, function (e) {

            var data = JSON.parse(e);

            if (data.status) {
                //product.getProductList();
                //location.reload();
                layer.confirm('增加条形码成功！', {
                    btn: ['确定'] //按钮
                }, function () {
                    setTimeout(function () {
                        var idx = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景嗷嗷嗷
                        });
                        var idxTime = new Date();
                        if (new Date() - idxTime < 1500) {
                            setTimeout(function () {
                                layer.close(idx);
                            }, 1500 - (new Date() - idxTime));
                        } else {
                            layer.close(idx);
                        }

                        window.location.href = core.getHost() + "/admin/bshop/product_list";
                    }, 1000)

                });
            } else {
                layer.confirm('增加条形码失败！', {
                    btn: ['确定'] //按钮
                }, function () {
                    setTimeout(function () {
                        var idx = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景嗷嗷嗷
                        });
                        var idxTime = new Date();
                        if (new Date() - idxTime < 1500) {
                            setTimeout(function () {
                                layer.close(idx);
                            }, 1500 - (new Date() - idxTime));
                        } else {
                            layer.close(idx);
                        }

                        window.location.href = core.getHost() + "/admin/bshop/product_list";
                    }, 1000)

                });

            }

        });
    };

    /**
     * 生成/下载二维码
     * @param goods_id
     * @param download
     * @constructor
     */
    product.QRCode=function (goods_id,download,goods_info) {
        var url = core.getHost() + "/admin/bshop/codeGenerator";
        var datas = {};
        datas.goods_id = goods_id;

        var good_info = JSON.parse(goods_info);
        var good_title = good_info.goods_title;
        var specif_cation = good_info.specif_cation;

        datas.dl = download;
        $.get(url, datas, function (e) {
            if(download ==0){
                $('#qrcode_img').attr('src',url+'?goods_id='+goods_id);
                $('#qrcode_dwonload').attr('href',url+'?goods_id='+goods_id+'&dl=1&good_title='+good_title+'&specif_cation='+specif_cation);
            }
        });
    };
    /**
     * 批量下载二维码
     * @param product_goods_ids
     */
    product.QRCodeDownload = function (product_goods_ids) {
        console.log("product_goods_ids:" + product_goods_ids);
        var num = product_goods_ids.split(',').length;
        if (product_goods_ids) {
            layer.confirm("确定要下载这"+num+"个商品的二维码吗", {title: '提示', icon: 3}, function (index) {
                var url = core.getHost() + "/admin/bshop/QRCodeDownload";
                var datas = {};
                datas.goods_ids = product_goods_ids;
                location.href = url + '?goods_id='+product_goods_ids;
                });
            } else {
            }
        };

    /*==========================================*/
    /*======== 商品新增页面
     /*==========================================*/

    //批量导放商品
    product.batchImportProduct = function (type) {
        if (!$("#input_file").val()) {
            layer.alert("请先选择您的商品文件！");
            return;
        }
        if (!$("#check_modal").val()) {
            layer.alert("请先选择模版");
            return;
        }
        var isclouds = $("input[name='isclouds']:checked").val() ? 1 : 0;

        var is_recycle = $("input[name='is_recycle']:checked").val();


        var detail_tpl = $("#check_modal").val();//(一)选择商品模版


        $(".ajax_info").html("正在处理，请稍后.....");
        $(".ajax_info").css("color", "#000");

        var formData = new FormData();
        formData.append("xls_file", $("#input_file")[0].files[0]);
        formData.append("isclouds", isclouds);
        formData.append("is_recycle", is_recycle);
        formData.append("type", type);
        formData.append('detail_tpl', detail_tpl);//添加表单数据

        var url = core.getHost() + '/admin/batchimport/batchImport_product_ajax';

        return $.ajax({
            url: url,
            data: formData,
            type: 'POST',
            success: function (e) {
              try {
                var data = JSON.parse(e);
                $(".ajax_info").empty();
                if (data.result.msg) {
                  layer.alert(data.result.msg);
                  return;
                }

                if (data.result.error.num > 0) {
                  if (type == 'add') {
                    $(".ajax_info").html("处理完成，匹配成功" + data.result.success.num + "条，失败" + data.result.error.num + "条。  <a href=" + location.origin + "/" + data.filename + ">下载失败文件</a>");
                  } else {
                    $(".ajax_info").html("处理完成，更新成功" + data.result.success.num + "条，失败" + data.result.error.num + "条。" + data.result.error.success_list[0].message.msg);
                  }

                  $(".ajax_info").css("color", "#f00");
                } else {
                  if (type == 'add') {
                    $(".ajax_info").html("处理完成，匹配成功" + data.result.success.num + "条记录。");
                  } else {
                    $(".ajax_info").html("处理完成，更新成功" + data.result.success.num + "条记录。");
                  }
                  $(".ajax_info").css("color", "#00ee00");
                }
              } catch (e) {

              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $(".ajax_info").html("请求超时").css("color", "#f00");
                // console.log("status:" + XMLHttpRequest.status);
                // console.log("state:" + XMLHttpRequest.readyState);
                // console.log("text:" + textStatus);
            },
            cache: false,
            contentType: false,
            processData: false
        });

    };
    /**获取更多查询条件**/
    product.get_more_condition = function () {
        $(".more_condition").each(function () {
            if ($(this).hasClass("lee_hide")) {
                $(this).removeClass("lee_hide");
            } else {
                $(this).addClass("lee_hide");
            }
        });
        if ($(".more_condition_a").html() == "隐藏更多条件") {
            $(".more_condition_a").html("显示更多条件");
            $(".need_three_row").each(function () {
                $(this).attr("rowspan", "1");
            });
        } else {
            $(".more_condition_a").html("隐藏更多条件");
            $(".need_three_row").each(function () {
                $(this).attr("rowspan", "3");
            });
        }
    };

  product.getProductList=function () {

  };
    return product;

});
