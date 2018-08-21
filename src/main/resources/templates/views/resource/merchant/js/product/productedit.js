define(['core', 'lodash'],function(core, _) {

    var productEdit={};
    var editor1;
    var editor2;
    var editor3;


  /*==========================================*/
  /*======== 商品编辑页面
   /*==========================================*/

    //富文本编辑器
    productEdit.setKindEditor = function (one,tow,three)
    {
        editor1 = one;
        editor2 = tow;
        editor3 = three;
    };

    //保存富文本框内容
    productEdit.SaveText = function (type) {
        var datas = {};
        if (type === 'pc') {
            $('input[name="goods_desc"]').val(editor2.html());
            var gd = $('input[name="goods_desc"]').val();
            datas.goods_desc = gd;
        } else if (type === 'phone') {
            $('input[name="goods_mobile_desc"]').val(editor4.html())
            var md = $('input[name="goods_mobile_desc"]').val()
            datas.goods_mobile_desc = md;
        }

        datas.goods_id = $('[name="goods_id"]').val();

        $.post('/merchant/productUpdate', datas, function (data) {
            if (data.status) {
                layer.msg('保存成功。');
            } else {
                alert(data.result.msg);
            }
        }, 'json');
    }
    //校验
    productEdit.editAddValidate = function ()
    {
        if($('input[name="lee_ts_info"]').val())
        {
            if($('input[name="lee_ts_info"]').val()==1)
            {
                $("#success_ts").modal('show');
            }else{
                alert($('input[name="lee_ts_info"]').val());
            }
        }

        productEdit.required = function(value, element, param)
        {
            return trim(value);
        };

        $.validate.setRule("required", productEdit.required, function ($input)
        {
            var tagName = $input[0].tagName.toUpperCase();
            var type = $input[0].type.toUpperCase();
            if ( type == 'CHECKBOX' || type == 'RADIO' || tagName == 'SELECT') {
                return '请选择必填项';
            }
            return '请填写必填项';
        });
    };

    //商品检查
    productEdit.editCheckItem = function () {
        var goods_title = $('input[name="goods_title"]').val();
        var prototal_input = $("input[name='prototal_input']").prop('checked');

        if (editor1) $('input[name="goods_description"]').val(editor1.html());

        $('input[name="goods_desc"]').val(editor2.html());
        $('input[name="goods_mobile_desc"]').val(editor4.html());

        if ($("#qualification_default").val() != '') {
            $('input[name="qualification"]').val(editor3.html());
        }


        if (!$('input[name="market_price"]').val()) {
            $('input[name="market_price"]').val($('input[name="shop_price"]').val());
        }

      /*    if(!productEdit.checkDataRule()){
       return false;
       }*/
        if (!prototal_input) {
            layer.alert("请遵守51健康商户后台使用协议！");
            return false;
        }

        if ($('input[name="shop_price"]').val() == 0) {
            layer.alert("商品价格不能为0");
            return false;
        }
        if ($('input[name="market_price"]').val() > 999999.99 || $('input[name="shop_price"]').val() > 999999.99) {
            layer.alert("商品价格不能大于999999.99");
            return false;
        }
        if (parseFloat($('input[name="shop_price"]').val()) > parseFloat($('input[name="market_price"]').val())) {
            layer.alert("现价必须要小于原价哦！");
            return false;
        }

        return true;
    };

    productEdit.checkDataRule=function(){
        $(".sui-msg.msg-error.help-inline").each(function(){
            $(this).remove();
        });
        var canPass=true;
        $('[data-rules]').each(function(){
            var rules=$(this).attr("data-rules");
            var ruleArr=rules.split("|");
            var tmpArr;
            for(var i in ruleArr){
                if(ruleArr[i]=="required" && !$(this).val()){
                    var tmpStr=$(this).attr("data-empty-msg")?$(this).attr("data-empty-msg"):"请填写必填项";
                    if($(this).attr("name") == "classify"){
                        $(this).parent().append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>'+tmpStr+'</span></div><i class="msg-icon"></i></div>');
                    }else{
                        $(this).parent(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>'+tmpStr+'</span></div><i class="msg-icon"></i></div>');
                    }
                    canPass=false;
                    break;
                }else{
                    tmpArr=ruleArr[i].split("=");
                    if(tmpArr[0]=="minlength" && $(this).val().length<tmpArr[1]){
                        $(this).parents(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>长度不能少于'+tmpArr[1]+'</span></div><i class="msg-icon"></i></div>');
                        canPass=false;
                        break;
                    }
                    if(tmpArr[0]=="maxlength" && $(this).val().length>tmpArr[1]){
                        $(this).parents(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>长度不能大于'+tmpArr[1]+'</span></div><i class="msg-icon"></i></div>');
                        canPass=false;
                        break;
                    }
                }
            }
        });
        return canPass;
    }

    //保存商品
    productEdit.editSaveItem = function ()
    {
        var check = productEdit.editCheckItem();
        if($('[name="goods_id"]').val() && $('[name="goods_id"]')){
            if(check)
            {
                var $form = $('#product_form');
                var param = $form.serializeArray();

                // 价格字段需要*100的
                (function (fields) {
                    _.each(fields, function (v) {
                        var fieldIdx = _.findIndex(param, {name: v});
                        if (fieldIdx !== -1) {
                            var temp = param[fieldIdx];
                            param.splice(fieldIdx, 1);
                            // 有浮点数问题8
                            temp.value = (temp.value *= 100).toFixed();
                            param.push(temp);
                        }
                    });
                })(['shop_price', 'market_price', 'cost_price', 'erp_price']);

                // 处理多选框
                var goodsForpeopleArr = [];
                do {
                    var fIdx = _.findIndex(param, {name: 'goods_forpeople'});
                    if (fIdx !== -1) {
                        goodsForpeopleArr.push(param[fIdx].value);
                        param.splice(fIdx, 1);
                    }
                } while (fIdx !== -1);
                param.push({name: 'goods_forpeople', value: goodsForpeopleArr.join(',')});
                var type = $('input[name="detail_tpl"]').val();
                var url = $form.prop('action');
                var isAdd = true;
                if ($.isNumeric($('#goods_id').val())) {
                    isAdd = false;
                    url = url.replace('productCreate', 'productUpdate');
                }

                $.ajax({
                    url: url,
                    type: 'post',
                    data: param,
                    dataType: 'json',
                }).done(function (rsp) {
                    var msgPrefix = isAdd ? '商品添加' : '商品更新';
                    var btnText = '继续修改商品图片';
                    if(type==100){
                        msgPrefix = isAdd ? '医生添加' : '医生更新';
                        btnText = "继续修改医生图片";
                    }
                    if (rsp && rsp.status) {
                        if (isAdd) {
                            layer.confirm(msgPrefix + "成功", function (idx) {
                                layer.close(idx);
                                location.href = "/merchant/productImgEdit?goods_id=" + rsp.result.goods_id;
                            }, function (idx) {
                                layer.close(idx);
                                location.href = "/merchant/productList";
                            });
                        } else {
                            layer.confirm(msgPrefix + "成功", {
                                btn: ['确定', btnText],
                            }, function (idx) {
                                layer.close(idx);
                                location.href = "/merchant/productList";
                            }, function (idx) {
                                layer.close(idx);
                                location.href = "/merchant/productImgEdit?goods_id=" + rsp.result.goods_id;
                            });
                        }
                    } else {
                        layer.alert(rsp.result.msg || msgPrefix + "失败");
                    }
                });
            }
        }else{
            return productEdit.save();
        }

    };

    productEdit.save = function () {

        var url =  "./bgoodsList";
        var datas={};
        //datas.drugName = $("input[name='drug_name']").val().trim();
        var target_obj=$("input[name='approval_number']");
        if(target_obj.length > 0){
            datas.approvalNumber = $("input[name='approval_number']").val().trim();
            datas.startRow=1;
            //datas.goodsStatus="-1";
            //datas.order="goods_status asc";
            datas.pageSize=1000;
            $.ajax({
                type: 'POST',
                url: "./bgoodsList",
                data:datas,
                dataType: 'json',
                success: function(data){
                    var goodsResult = data.goodsPage;
                    if(goodsResult.list.length  >0)
                    {
                        $("#multiple-standard-remimd .item_list").empty();
                        $("#multiple-standard-remimd").modal('show');
                        $("#multiple-standard-remimd .total_items").html(goodsResult.total);

                        for(var i=0;i<goodsResult.list.length;i++)
                        {
                            var goods=goodsResult.list[i];
                            $("#multiple-standard-remimd .item_list").append("<tr><td>"+goods.approvalNumber+"</td><td>"+goods.drugName+"</td><td>"+goods.specifCation+"</td><td>"+(goods.shopPrice/100).toFixed(2)+"</td><td>"+(goods.goodsStatus==1?"上架":"下架")+"</td></tr>");
                        }
                    }else
                    {
                        goodsSubmit();
                    }
                }

            });

        }else{
            goodsSubmit();
        }


    };


    $("#goodsSubmit").click(function () {
        goodsSubmit();
    });

    function goodsSubmit (){
        var check = productEdit.editCheckItem();
        if(check)
        {
            var $form = $('#product_form');
            var param = $form.serializeArray();
            if($('input[name="detail_tpl"]').val()==100){
                param.push({name: 'goods_title', value: $('input[name="drug_name"]').val()});
                param.push({name: 'market_price', value: '0'});
                param.push({name: 'specif_cation', value: '预约费'});
            }
            // 价格字段需要*100的
            (function (fields) {
                _.each(fields, function (v) {
                    var fieldIdx = _.findIndex(param, {name: v});
                    if (fieldIdx !== -1) {
                        var temp = param[fieldIdx];
                        param.splice(fieldIdx, 1);
                        // 有浮点数问题 需要进行向上取整
                        temp.value = (temp.value *= 100).toFixed();
                        param.push(temp);
                    }
                });
            })(['shop_price', 'market_price','cost_price']);

            // 处理多选框
            var goodsForpeopleArr = [];
            do {
                var fIdx = _.findIndex(param, {name: 'goods_forpeople'});
                if (fIdx !== -1) {
                    goodsForpeopleArr.push(param[fIdx].value);
                    param.splice(fIdx, 1);
                }
            } while (fIdx !== -1);
            param.push({name: 'goods_forpeople', value: goodsForpeopleArr.join(',')});

            var url = $form.prop('action');
            var type = $('input[name="detail_tpl"]').val();
            var isAdd = true;
            if ($.isNumeric($('#goods_id').val())) {
                isAdd = false;
                url = url.replace('productCreate', 'productUpdate');
            }

            $.ajax({
                url: url,
                type: 'post',
                data: param,
                dataType: 'json',
            }).done(function (rsp) {
                if (rsp && rsp.status) {
                    var msgPrefix = isAdd ? '商品添加' : '商品更新';
                    if(type==100){
                        msgPrefix = isAdd ? '医生添加' : '医生更新';
                        $("#extImg").html("继续修改医生图片")
                    }
                    layer.confirm(msgPrefix + "成功", function (idx) {
                        layer.close(idx);
                        location.href = "/merchant/productImgEdit?goods_id=" + rsp.result.goods_id;
                    });
                } else {
                    layer.alert(rsp.result.msg || msgPrefix + "失败");
                }
            });
        }
    }


    // $("#bar_code").blur(function () {
    //     var bar_code = $("#bar_code").val();
    //     if (bar_code == "") {
    //       return;
    //     }
    //     $.ajax({
    //       type: "post",
    //       url: "./queryByBarCode?bar_code=" + bar_code,
    //       success: function (data) {
    //         if (data.status === "OK") {
    //           barCodeValidateStatus = true;
    //         } else if (data.status === "ERROR") {
    //           layer.msg(data.errorMessage);
    //         } else {
    //           barCodeValidateStatus = false;
    //           layer.msg("商品条形码已存在，请重新输入");
    //         }
    //       }
    //     });
    // });


    //删除商品
    productEdit.editDeleteGood = function ()
    {
        var gid = $('#goods_id').val();
        var goodsStatus = $('#goods_status').val();
        if(goodsStatus==4){
            layer.alert('商品已在回收站，不可重复删除！', function () {
                window.location.href = core.getHost() + "/merchant/productList?goodsStatus=4";
            });
            return;
        }
        var url = core.getHost() + "/merchant/productDelete";

        var datas = {
            goods_id: gid
        };

        $.post(url, datas, function (rsp) {
            if (rsp.status) {
                layer.alert('商品删除成功', function () {
                    window.location.href = core.getHost() + "/merchant/productList?del=1";
                });
            }else{
                layer.alert(rsp.result.msg);
            }
        }, 'json');
    };

    //获取批图文号
    productEdit.editGetApprovalNumber = function ()
    {
        var approval_number = $('input[name="approval_number"]').val();
        var type = $('input[name="detail_tpl"]').val();

        if(trim(approval_number))
        {
            console.log("window.location.href:"+window.location.href);

            var param = 'approval_number='+approval_number+'&type='+type;

            var search_param = decodeURI(location.search).replace(/approval_number=([\u4E00-\u9FA5\uF900-\uFA2D]*[A-Z]*[a-z]*[0-9]*)/,'').replace(/type=(\d*)/,'').replace(/&.*/,'');

            console.log(param);

            console.log(search_param);

            console.log(location.origin + location.pathname+search_param+'&'+param+location.hash);

            window.location.href = location.origin + location.pathname+search_param+'&'+param+location.hash;

        }else{
            alert('请先填写批准文号！');
        }
    };
    //设置商品二维码提示文字信息
    productEdit.editQRcodeTips = function ()
    {
        var site_qRcodeTips = $("#site-qRcodeTips").val();
        var datas = {};

        datas.qrcode_tips = site_qRcodeTips;
        layer.confirm('确定要提交该设置内容吗？', function (idx) {
            $.post('/merchant/setQRcodeTips', datas, function (data) {
                if (data.status) {
                    layer.msg('设置成功！')
                    $('#site-qRcodeTips').next().val(site_qRcodeTips);
                    $('#set-two-dimension-code').modal('hide');
                } else {
                    layer.msg(data.result.msg);
                }
            }, 'json');
        });
    };

    //判断限数是否显示
    productEdit.editControlNum = function (obj)
    {
        $('input[name="control_num_radio"]').each(function()
        {
            $(this).attr("checked",false);
            $(this).parent().removeClass("checked");
        });

        $(obj).parent().addClass("checked");
        $(obj).attr("checked",true);

        if($(obj).val()==1)
        {
            $('input[name="control_num"]').parent().removeClass("hide");
        }else{
            $('input[name="control_num"]').parent().addClass("hide");
        }
    };

    //品牌处理
    productEdit.editBrand  = function (obj)
    {
        var curBrandName=trim($(obj).val());
        var brand_id="";

        for(var i in goodsBrand_info)
        {
            if(goodsBrand_info[i].barnd_name==curBrandName)
            {
                brand_id = goodsBrand_info[i].barnd_id;
                break;
            }
        }
        $('input[name="barnd_id"]').val(brand_id);

    };

    //医保协议
    productEdit.editProtocol = function ()
    {
        var url = core.getHost() + "/admin/bshop/get_yibaoUserAgreement_ajax";

        var datas={};

        $.post(url,datas,function(e)
        {
            var data = JSON.parse(e);
            $("#protocal-page .modal-body").html(data.result.content);

        });
    };
    /**
     * 获取图标信息
     */
    productEdit.getGoodsIconStatus = function () {
        $.ajax({
            url: '/merchant/getGoodsIconStatus',
            type: 'post',
            dataType: 'json',
        }).done(function (rsp) {
            if (rsp.status) {
                try {
                    var val = rsp.result.items[0].meta_val;
                    // 没有修改就不需要请求服务器保存
                    $('#oldGoodsIconStatus').val(val);
                } catch (e) {
                    val = 0;
                }
                $('[name=goodsIconStatus][value=' + val + ']').click();
            } else {
                layer.msg('获取图标设置失败');
            }
        });
    }
    /**
     * 设置图标信息
     */
    productEdit.setGoodsIconStatus = function() {
        var status = $('input[name="goodsIconStatus"]:checked').val();
      /*eslint-disable eqeqeq*/
        if ($('#oldGoodsIconStatus').val() == status) {
            $('#set_picture').modal('hide');
            return;
        }

        var datas = {};
        datas.status = status;

        $.post('/merchant/setGoodsIconStatus', datas, function (data) {
            if (data.status) {
                layer.alert('保存成功！');
                $('#set_picture').modal('hide');
            }
        }, 'json');
    }


    //更多 选择图片
    productEdit.editHandleFileSelect = function (evt)
    {
        var files = evt.target.files;
      /*eslint-disable camelcase*/
        var cur_success_file_num = 0;
        var cur_error_file_num = 0;
        var img_url = [];
        var dfds = [];

        for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            var formData = new FormData();
            formData.append('ad_img_file', f);

            var dfd = $.ajax({
                url: '/merchant/image/upload',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
            }).done(function (rsp) {
                if (rsp && rsp.status) {
                    img_url.push(rsp.result.imgsrc);
                    cur_success_file_num++;
                } else {
                    cur_error_file_num++;
                }
            }).fail(function () {
                cur_error_file_num++;
            });
            dfds.push(dfd);
        }

        var resultDfd = $.Deferred();
        $.when.apply($, dfds).always(function () {
            if (cur_error_file_num + cur_success_file_num == files.length) {
                layer.alert("本次选择"+files.length+"张图片，其中"+cur_success_file_num+"张添加成功，"+cur_error_file_num+"张添加失败！");
            }

            resultDfd.resolve(img_url);
        });

        return resultDfd;
    };
    /**
     * 药品规格检查
     */
    productEdit.specifcationInspect = function () {
        $("#specif_cation").change(function () {
            var inputdata = $("#specif_cation").val();
            var key = new Array("PCS", "ml", "kg", "mg", "ug", "ng", "dm", "cm", "mm", "IU", "L", "g", "T", "B", "P", "U");
            var keys = new Array("个", "毫升", "千克", "毫克", "微克", "纳克", "分米", "厘米", "毫米", "国际单位", "升", "克", "片", "包", "片", "单位");

            for (var i = 0; i < key.length; i++) {
                var serchkey = key[i];
                var reg = new RegExp(serchkey, 'gmi');
                inputdata = inputdata.replace(reg, keys[i]);
            }
            inputdata = inputdata.replace("*", "X");
            if (inputdata.indexOf("每") != 0) {
                inputdata = inputdata.replace("每", "X");
            }

            var data = $("#specif_cation").val();
            if (inputdata == data) {
            } else {
                $("#change_remind").removeClass("hide");
                $("#change_remind").addClass("show");
                $("#change_specif").html(inputdata);
            }
            $("#button_change").on("click", function () {
                $("#specif_cation").val(inputdata);
            });
        });

    };

    /**
     * 根据模板获取字段信息
     * @param detailTpl
     */
    productEdit.initFieldInfo = function (detailTpl) {
        var publicRequired = [
            'drug_name', 'specif_cation', 'goods_company', 'goods_indications',
            'user_cateid', 'goods_title', 'goods_weight', 'shop_price', 'in_stock', 'purchase_way'
        ];
        var requiredFields = {};
        requiredFields[10] = ['approval_number', 'drug_category', 'adverse_reactioins', 'goods_note', 'goods_contd', 'goods_use_method'];
        requiredFields[40] = ['approval_number', 'goods_use_method'];
        requiredFields[80] = ['approval_number'];
        requiredFields[60] = ['approval_number'];
        requiredFields[30] = ['approval_number'];
        requiredFields[50] = ['approval_number'];
        requiredFields[70] = [];
        requiredFields[20] = [];

        var aliasFields = {};
        aliasFields[10] = { 'com_name': '商品名', 'drug_name': '通用名'};
        aliasFields[40] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍'};
        aliasFields[80] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍'};
        aliasFields[60] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍'};
        aliasFields[30] = { 'drug_category': '类别', 'main_ingredient': '产品参数', 'goods_indications': '功能介绍', 'goods_action': '产品特色'};
        aliasFields[70] = {
            'com_name': '别名',
            'drug_name': '中药名',
            'goods_company': '产地分布',
            'drug_category': '是否方剂',
            'goods_property': '药用部位',
            'goods_use_method': '临床应用',
            'forpeople_desc': '药物性状',
            'goods_action': '药物形态',
            'adverse_reactioins': '性味归经',
        };
        aliasFields[20] = { 'goods_validity': '保质期', 'goods_indications': '功能介绍', 'goods_action': '产品特色'};

        var temp = publicRequired.concat(requiredFields[+detailTpl || 20]);
        temp.forEach(function (v) {
            var $ele = $('#' + v);
            if (!$ele.length) {
                $ele = $('[name=' + v + ']');
                if (!$ele.length) {
                    $ele = $('[name=' + v + '[]]');
                }
            }

            var rules = $ele.data('delay');
            rules = rules ? 'required|' + rules : 'required';
            try {
                var html = $ele.parents('.control-group:eq(0)').find('.control-label').html();

                if ($.inArray(v, Object.keys(aliasFields[detailTpl])) !== -1) {
                    html = aliasFields[detailTpl][v] + '：';
                }

                html = html.replace(/(.*)：/, '$1<strong class="red">*</strong>：');
                $ele.parents('.control-group:eq(0)').find('.control-label').html(html);
            } catch (e) {}
            $ele.attr('data-rules', rules);
        });
    };

    return productEdit;

});
