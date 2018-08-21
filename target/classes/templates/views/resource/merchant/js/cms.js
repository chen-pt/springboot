/**
 * Created by Administrator on 2017/2/27.
 */
var CMS = {};

//轮播广告相关前端渲染
CMS.Slider = {
    settings: {
        //模式对话框ID
        modalID: '#modal-slider',
        //模式对话框标题元素
        eModalTitle: '#modal-slider-title',
        //模式对话框内表单ID
        eMoalForm: '#frm-modal-slider',
        //对话框内上传文件按钮
        eMosalFileBtn: '#btnSliderFile'
    },
    init: function() {

        this.bindUploadBtn();

    },
    bindUploadBtn: function() {
        $(this.settings.eMosalFileBtn).change(function(e) {
            var self = this;
            Array.prototype.forEach.call(e.target.files, function(f) {
                YIB.uploadFile(settings.urls.uploadImg, f, function(response) {
                    var response = $.parseJSON(response);
                    if (response.code != 0) {
                        alert(response.msg);
                        return false;
                    }
                    $("#slide_oneimg_preview").attr('src', response.data);
                    $("#slide_oneimg").val(response.data);
                });

            });

        });


    },
    openDialog: function() {
        $(this.settings.eModalTitle).html("添加轮播广告");
        $(this.settings.modalID).modal('show');
    },
    deleteSlider: function(obj) {
        if (!confirm("您确定要删除吗?")) {
            return false;
        }
        var id = $(obj).attr("data-id");
        if (!id) {
            console.log("Error: data-id was not found in this element !");
            return false;
        }

        var params = {
            action: 'ads/deleteFocuseAD',
            'adv_id': id
        }
        YIB.post("/cms/apiCall", params, function(response) {
            if (typeof response != 'object') {
                response = $.parseJSON(response);
            }
            alert(response.msg);
            if (response.code == 0) {
                $("[ad-id=" + id + "]").remove();
            }
        });
    },
    saveSlider: function(btn) {
        var params = $(this.settings.eMoalForm).serialize();
        if (!YIB.validator($(this.settings.eMoalForm))) {
            return false;
        }
        $(btn).attr('disabled', true).html('操作中');

        YIB.post(settings.urls.saveSlider, params, function(response) {
            alert(response.msg);
            $(btn).attr('disabled', false).html('保存');
            if (response.code == 0) {
                location.reload();
            }


        });
    },
    editSlider: function(obj) {
        var id = $(obj).attr("data-id");
        if (!id) {
            console.log("Error: data-id was not found in this element !");
            return false;
        }

        var self = this;

        //重新拉取广告数据
        YIB.post(settings.urls.getFocusADByID, {'adv_id': id}, function(response) {
            if (response.code != 0) {
                alert("广告数据获取失败,请重试!");
                return false;
            }

            //将数据填充到模式对话框
            $(self.settings.eModalTitle).html("编辑轮播广告");

            var data = response.data;

            for (var x in data) {
                if (x == 'slide_oneimg') {
                    $("[name='slide_oneimg_preview']").attr('src', data[x]);
                }

                var obj = $('[name=' + x + ']');
                if (obj.size() <= 0) {
                    continue;
                }

                if (obj.get(0).tagName == 'IMG') {
                    obj.attr('src', data[x]);
                } else {
                    obj.val(data[x]);
                }
            }

            //显示对话框
            $(self.settings.modalID).modal('show');
        });
    }
};



CMS.itemBlock = {
    settings: {
        "btnCreate": "#btnCreate",
        "modal": '#modal-item-select',
    },
    openWindow: function(id) {
        if (id != undefined) {
            var params = {
                action: 'iconLink/findByID',
                link_id: id
            };

            var self = this;
            YIB.post('/cms/apiCall', params, function(response) {
                if (response.code != 0) {
                    alert(response.msg.msg);
                    return false;
                }

                var data = response.data;
                for (var x in data) {
                    $("#modal-itemBlock").find("[name='" + x + "']").val(data[x]);
                }
            });
            $("#modal-itemblock-title").html("修改数据");
        } else {
            $("#modal-itemblock-title").html("添加数据");

        }
        $("#modal-itemBlock").modal("show");
    },
    init: function() {


        var self = this;

        $("#arrow-add").bind("click", function() {
            $("#slt-item-list").trigger("dblclick");
        });

        $("#slt-item-list").bind('dblclick', function() {
            var e = $(this).find("option:selected");
            if (e.size() <= 0) {
                return false;
            }
            e.attr('selected', false);

            //校验最大数目
            var selected = $("#slt-item-selected").find("option").size();
            var left = (12 - ~~selected);

            //如果数目小于0 直接返回
            if (left <= 0) {
                return false;
            }

            if (~~e.size() > left) {
                alert("您选择的数目过多,请减少一些,当前最多只能添加:" + left + "个商品");
                return false;
            }


            var ids = [];
            e.each(function(idx, val) {
                ids.push($(val).val());
            });

            var params = {
                compaign_id: self.itemID,
                goods_id: ids.join(",")
            };

            YIB.post('/cms/multiAddGoods', params, function(response) {

                if (response.code != 0) {
                    alert(response.msg.msg);
                    return false;
                }
                $('#slt-item-selected').append(e);
                $("#txt-max-selected").html($("#slt-item-selected > option").size());
            });
        });



        $("#slt-item-selected").bind('dblclick', function() {
            var e = $(this).find("option:selected");
            if (e.size() <= 0) {
                return false;
            }
            var params = {
                action: 'CampaignGoods/delete',
                pk: 'id',
                pv: e.val()
            };

            var self = this;
            YIB.post('/cms/apiCall', params, function(response) {
                if (response.code != 0) {
                    alert(response.msg.msg);
                    return false;
                }

                e.remove();

                $("#txt-max-selected").html($("#slt-item-selected > option").size());
            });


        });

        var self = this;
        $("#txt-cat-keywords").keydown(function(e) {
            if (e.keyCode == 13) {
                self.searchItem();
            }
        });
    },
    itemID: undefined,
    openModal: function(obj) {
        $(this.settings.modal).modal('show');
        this.itemID = $(obj).attr('data-id');
        console.log("Edting :" + this.itemID + " now .. ");

        //Search items for this compaign
        var params = {
            'action': 'CampaignGoods/findAll',
            'compaign_type': 'link',
            'compaign_id': this.itemID
        };
        YIB.post("/cms/apiCall", params, function(response) {
            $("#slt-item-selected").html("");
            var selected = 0;

            if (response.code != 0) {
                $("#txt-max-selected").html(0);
                console.log("Response: " + response);
                return false;
            }

            var compaign = response.data.compaign;
            var goods = response.data.goods;
            selected = compaign.length;


            $("#txt-max-selected").html(selected);

            for (var x in compaign) {
                var item = goods[compaign[x]['goods_id']];
                $("#slt-item-selected").append("<option value='" + compaign[x].id + "'>" + item.drug_name + "(" + item.specif_cation + ")</option>");
            }

        });
    },
    saveForm: function(obj) {
        var frm = $(obj).closest("form");
        if (!YIB.validator(frm)) {
            return false;
        }

        var params = frm.serialize();
        $(obj).html("正在保存..").attr("disabled", true);
        YIB.post("/cms/saveItemBlock", params, function(response) {
            $(obj).html("保存").attr("disabled", false);
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    onCancel: function() {
        $("tr#frm-new").find(":text").val('');
        $("tr#frm-new").hide();
    },
    onDelete: function(obj) {
        if (!confirm("您确定要删除吗?")) {
            return false;
        }
        var id = $(obj).attr('data-id');
        if (!id) {
            console.log("Error: data-id was not found in this element !");
            return false;
        }

        YIB.post(settings.urls.deleteItemBlock, {'link_id': id}, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    searchItem: function() {

        var x = -1;
        var items = ['#sltThirds', '#sltSeconds', '#sltFirsts'];
        for (var idx in items) {
            var v = $(items[idx]).val();
            if (v != '-1') {
                x = v;
                console.log("Find val :" + x + ", for element:" + items[idx]);
                break;
            }
        }

        var keywords = $("#txt-cat-keywords").val().trim();
        x = parseInt(x);
        if ((!x || x <= 0) && !keywords) {
            alert("请选择一个分类");
            return false;
        }

        var self = this;

        YIB.post("/cms/apiCall", {'action': 'product/getProductCategoryList', 'keyword': keywords, 'cate_id': x, 'api_vn': 2, per_page: 100}, function(response) {
            $("#slt-item-list").html('');
            if (response.code != 0) {
                alert(response.msg.msg);
                return false;
            }

            var items = response.data.items;
            console.log("Response length of items is : " + items.length);
            if (items.length <= 0) {
                return false;
            }
            for (var x in items) {
                $("#slt-item-list").append("<option value='" + items[x].goods_id + "'>" + items[x].drug_name + "(" + items[x].specif_cation + ")</option>");
            }
        });

    }

};

CMS.iconLink = {
    settings: {
        //模式对话框ID (添加页)
        'modIconLink': '#modal-icons',
        'modIconCats': '#modal-cats-render',
        'formAdd': '#frm-add-iconlink'
    },
    init: function() {
        var self = this;

        $(".tile .selected").removeClass("selected");
        $(".tile").click(function() {
            $(".selected").removeClass("selected");
            $(this).addClass("selected");
        });

        this.eveUpload();

        this.eveMetaChange();
    },
    eveMetaChange: function() {
        $("#icon_row,#icon_max").change(function() {
            var val = $(this).val();
            var k = $(this).attr('data-id');
            var meta_key = $(this).attr('id');
            var url = '/cms/updateMeta';
            if (k == '') {
                url = "/cms/addMeta";
            }
            YIB.post(url, {'meta_id': k, 'meta_type': 'iconlink', 'meta_val': val, 'meta_key': meta_key}, function(response) {

            });
        });
    },
    eveUpload: function() {
        $("#btnUpIcon").change(function(e) {
            Array.prototype.forEach.call(e.target.files, function(f) {
                YIB.uploadFile('/cms/uploadIcon', f, function(response) {
                    var response = $.parseJSON(response);
                    if (response.code != 0) {
                        alert(response.msg);
                        return false;
                    }
                    $("#img-icon-preview").attr('src', response.data.url);
                    $("#btn-save-icon").attr('data-id', response.data.icon_id);
                });


            });
        });
    },
    itemID: undefined,
    openIconModal: function(obj) {
        $(this.settings.modIconLink).modal('show');
        this.itemID = $(obj).attr("data-id");
    },
    openAddIconModal: function() {
        $('#modal-add-iconlink').modal('show');
    },
    onSaveIcon: function(obj) {
        var icon_id = $(obj).attr('data-id');

        var self = this;
        //如果是新增操作,不执行更新ICONLINK
        if (self.itemID == 'new') {
            $("[content-id='new']").find("[name='icon_id']").val(icon_id);
            $("#modal-icon-upload").modal('hide');
            $("[content-id='new']").find("[name='icon_preview']").attr("src", $("#img-icon-preview").attr("src"));
            return false;
        }
        var self = this;
        var params = {
            'action': '/IconLink/update',
            'link_id': self.itemID,
            'icon_id': icon_id
        };
        YIB.post("/cms/apiCall", params, function(response) {
            if (response.code != 0) {
                alert(response.msg);
                return false;
            }

            alert(response.msg);
            location.reload();
        });
    },
    openCatModal: function(obj) {
        $(this.settings.modIconCats).modal('show');
        $(".edting").removeClass('edting');
        $(obj).addClass('edting');
    },
    openUploadModal: function(obj) {
        $("#modal-icon-upload").modal('show');
        this.itemID = $(obj).attr("data-id");
    },
    onCreate: function() {
        var frm = $("#frm-add-iconlink");
        var params = frm.serialize();
        if (!YIB.validator(frm)) {
            return false;
        }
        YIB.post("/cms/addIconLink", params, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    openCreateForm: function() {
        $("#modal-add-icon").modal('show');
    },
    cancelAdd: function() {
        var o = $("[content-id='new']");
        o.find(":text").val('');
        o.find("img").attr("src", '');
        o.hide();
    },
    saveSelectIcon: function(obj) {
        var self = this;
        var icon = $(".tiles").find(".selected");
        if (icon.size() <= 0) {
            alert("请选择一个后保存!");
            return false;
        }

        var iconID = icon.attr("data-id");

        if (self.itemID == 'new') {
            $("[content-id='new']").find("[name='icon_id']").val(iconID);
            $("#modal-icons").modal('hide');
            $("[content-id='new']").find("[name='icon_preview']").attr("src", icon.find("[name='icon_img_url']").attr("src"));
            return false;
        }

        var params = {
            'action': '/IconLink/update',
            'link_id': self.itemID,
            'icon_id': iconID
        };
        $(obj).html("处理中...").attr("disabled", true);
        YIB.post("/cms/apiCall", params, function(response) {
            if (response.code != 0) {
                alert(response.msg);
                return false;
            }

            $(obj).attr("disabled", false);
            alert(response.msg);
            location.reload();
        });
    },
    onDelete: function(obj) {
        if (!confirm("您确定要删除吗?")) {
            return false;
        }
        var id = $(obj).attr('data-id');
        if (!id) {
            console.log("Error: data-id was not found in this element !");
            return false;
        }

        YIB.post(settings.urls.deleteIconLink, {'link_id': id}, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    onUpdate: function(obj) {

        var id = $(obj).attr('data-id');
        if (!id) {
            console.log("Error: data-id was not found in this element !");
            return false;
        }

        if (!YIB.validator($("#icon-" + id))) {
            return false;
        }
        var params = $("#frm-" + id).serialize();
        params += '&action=IconLink/update&link_type=1';
        YIB.post("/cms/apiCall", params, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    onSave: function(obj) {
        if (!YIB.validator($("#frm-add-iconlink-body"))) {
            return false;
        }
        var params = $(this.settings.formAdd).serialize();
        params += "&action=IconLink/add&link_type=1";

        $(obj).attr("disabled", true);
        YIB.post("/cms/apiCall", params, function(response) {
            $(obj).attr("disabled", false);
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    onConfirmCat: function() {

        var x = -1;
        var items = ['#sltThird', '#sltSecond', '#sltFirst'];
        for (var idx in items) {
            var v = $(items[idx]).val();
            if (v != '-1') {
                x = v;
                break;
            }
        }

        x = parseInt(x);
        if (!x || x <= 0) {
            alert("请选择一个分类");
            return false;
        }


        var self = this;
        YIB.post(settings.urls.findCatByID, {'cate_id': x}, function(response) {
            if ($('#cate-link').attr('data-val')) {
                $('#link_url').val("/product/index?cate_id=" + response.data.cate_id);
                $(self.settings.modIconCats).modal('toggle');
                return true;
            }
            var id = $(".edting").attr('data-id');
            $("[content-id='" + id + "']").find('[name="link_name"]').val(response.data.cate_name);
            $("[content-id='" + id + "']").find('[name="link_url"]').val("/product/index?cate_id=" + response.data.cate_id);
            $(self.settings.modIconCats).modal('toggle');
        });
    }
};


CMS.weixin = {
    updateReply: function(obj) {
        var id = $(obj).attr('data-id');
        var type = $(obj).attr('data-type');
        //todo
        // YIB.post("/reply/getByID", {"reply_type": type, "reply_id": id}, function(response) {
        //     if (response.code != 0) {
        //         alert(response.msg);
        //         return false;
        //     }
        //
        //     response.data.reply_id = response.data.id;
        //     for (var x in response.data) {
        //         $("[name='" + x + "']").val(response.data[x]);
        //     }
        //
        //     $("#modal-auto-title").html("修改内容");
        //     $("#modal-weixin-auto").modal("show");
        // });
        $("#modal-auto-title").html("修改内容");
        $("#modal-weixin-auto").modal("show");


    },
    deleteReply: function(obj) {
        // var reply_id = $(obj).attr('data-id');
        // YIB.post("/reply/delete", {'reply_id': reply_id}, function(response) {
        //     alert(response.msg);
        //     if (response.code == 0) {
        //         location.reload();
        //     }
        // });
    },
    saveReply: function() {
        if (!YIB.validator($("#modal-weixin-auto"))) {
            return false;
        }

        var params = $("#frm-modal-reply").serialize();
        YIB.post("/reply/save", params, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }

        });
    },
    addKeywords: function(obj) {
      $("#modal-auto-title").html("添加内容");
      $(".control-group").find(".rule-name").val("");
      $(".control-group").find(".key-words").val("");
      $(".control-group").find(".reply-content").val("");
      $("[name='reply_type']").val(130);
      $("#modal-weixin-keywords").modal("show");
    },
    updateKeywords: function(obj) {
        var id = $(obj).attr("data-id");
        // YIB.post("/reply/getByID", {"reply_type": 130, "reply_id": id}, function(response) {
        //     if (response.code != 0) {
        //         alert(response.msg);
        //         return false;
        //     }
        //
        //     for (var x in response.data) {
        //         if (x == 'id') {
        //             $("[name='reply_id']").val(response.data[x]);
        //             continue;
        //         }
        //         $("[name='" + x + "']").val(response.data[x]);
        //     }
        //
        //     $("#modal-title").html("修改内容");
        //     $("#modal-weixin-keywords").modal("show");
        // });
        $("#modal-title").html("修改内容");
        $("#modal-weixin-keywords").modal("show");
    },
    saveKeywords: function() {
        if (!YIB.validator($("#modal-weixin-keywords"))) {
            console.log('000');
            return false;
        }
        var params = $("#frm-modify-keywords").serialize();
        YIB.post("/reply/save", params, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    deleteKeywords: function(obj) {
        var id = $(obj).attr("data-id");
        YIB.post("/reply/delete", {reply_id: id}, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    onCreateReply: function(type_id) {
        var objHash = {
            110: {
                reply_type: 110,
                rule_name: '关注自动回复',
                keywords: '关注自动回复'
            },
            120: {
                reply_type: 120,
                rule_name: '消息自动回复',
                keywords: '消息自动回复'
            }
        };

        var data = objHash[type_id];

        var pe = $("#modal-weixin-auto");
        for (var x in data) {
            pe.find("[name='" + x + "']").val(data[x]);
        }

        $("#modal-weixin-auto").modal("show");
        $("#modal-auto-title").html("添加" + data.rule_name);
    }
};

//绑定各类按钮以及注册事件
CMS.init = function() {


    //Slider 相关函数注册
    CMS.Slider.init();

    //Itemblock 相关函数注册
    CMS.itemBlock.init();

    //IconLink Register
    CMS.iconLink.init();

    //模式对话框退出后,执行清空表单操作
    $('.modal').on("hidden.bs.modal", function() {

        $(this).find(":text,:file").val('');
        $(this).find("input[type='hidden']").val('');

    });

};

$(function() {
    //绑定各类事件
    CMS.init();
});
