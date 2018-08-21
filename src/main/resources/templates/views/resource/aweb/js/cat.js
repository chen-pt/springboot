

var CAT = {
    init: function() {
        $("#max_display_num").change(function() {
            var val = $(this).val();
            var k = $(this).attr('data-id');
            var meta_key = $(this).attr('id');
            
            var action = "/cat/addCat";
            if(k != '' ) {
                action = '/cat/updateCat';
            }
            
            YIB.post(action, {'meta_id': k, 'meta_type': 'weixin_diy_cat', 'meta_val': val, 'meta_key': meta_key}, function(response) {
                location.reload();
            });
        });


        //模式对话框退出后,执行清空表单操作
        $('.modal').on("hidden.bs.modal", function() {
            $(this).find(":text,:file").val('');
            $(this).find("input[type='hidden']").val('');

        });


    },
    openCatModal: function(obj) {
        $("#modal-top-cat").modal("show");
        $("#txt-meta-id").val($(obj).attr("data-id"));
    },
    saveCat: function(obj) {
        var slt = $("#slt-cat");
        if (slt.val() == '-1') {
            alert("请选择一个分类!");
            return false;
        }

        var params = {};
        params.meta_val = slt.val();
        params.meta_desc = slt.find("span").html().trim();
        params.meta_id = $("#txt-meta-id").val();
        params.meta_type = 'weixin_diy_cat';
        params.meta_key = 'cat_id';
        
        $(obj).html("操作中..").attr("disabled", true);
        var action = "/cat/addCat";
        if(params.meta_id != '') {
            action = "/cat/updateCat";
        }
        YIB.post(action, params, function(response) {
            $(obj).html("保存").attr("disabled", false);
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });
    },
    deleteCat:function(obj){
        if(!confirm("确定要删除这个类目么？")){
            return false;
        }
        var params = {};
        params.meta_id = $(obj).attr("data-id");
        var action = "/cat/deleteCat";
        YIB.post(action, params, function(response) {
            alert(response.msg);
            if (response.code == 0) {
                location.reload();
            }
        });

    }

}

$(function() {
    //绑定各类事件
    CAT.init();
});