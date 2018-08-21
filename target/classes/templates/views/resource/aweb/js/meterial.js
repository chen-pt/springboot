/**
 * 
 * 微信公众要素材管理前端JS
 * @author Robanlee@gmail.com
 */
var meterial = {
    init: function() {
        $("#addMeterial").change(function(e) {
            Array.prototype.forEach.call(e.target.files, function(f) {
                var ori = $("#btnTrigger").html();
                $("#btnTrigger").attr('disabled', true).html(YIB.tipper.loading);
                YIB.uploadFile("/meterial/uploadMeterial", f, function(response) {
                    $("#btnTrigger").attr('disabled', false).html(ori);
                    if (typeof response != 'object') {
                        response = $.parseJSON(response);
                    }
                    alert(response.msg);
                    if (response.code == 0) {
                        location.reload();
                    }

                });

            });
        });


        $("#btnUpload").click(function() {
            $("#iptImages").trigger('click');
        });

        $("#iptImages").change(function(e) {
            var html = $("#btnUpload").html();
            $("#btnUpload").attr('disabled', true).html(YIB.tipper.loading);
            YIB.uploadFile("/meterial/uploadMeterial", e.target.files[0], function(response) {
                $("#btnUpload").attr('disabled', false).html(html);
                if (typeof response != 'object') {
                    response = $.parseJSON(response);
                }
                alert(response.msg);
                if (response.code != 0) {
                    return false;
                }
                var id = $("#edit-block").attr('data-id');
                var element = $("li[data-id='" + id + "']");

                element.find('.img-preview').attr('src', response.data.url);
                element.find('[data-field="thumb_media_id"]').val(response.data.media_id);
                element.find('[data-field="img_src"]').val(response.data.src);

            });
        });


        $("#showCover").click(function() {

            var id = $("#edit-block").attr('data-id');
            var element = $("li[data-id='" + id + "']").find('[data-field="show_cover_pic"]');


            //表示已经选中,点击后则取消
            if ($(this).hasClass('green')) {
                $(this).removeClass('green').addClass('default');
                element.val(0);
                return false;
            }

            $(this).removeClass('default').addClass('green');
            element.val(1);
            return false;

        });


        $("#btnSaveSelection").click(function() {
            var selection = $(".active-images");
            if (selection.size() <= 0) {
                alert("请选择一个素材!");
                return false;
            }
            ;

            var img = selection.find("img");
            var dataID = $("#edit-block").attr('data-id');
            $("li[data-id='" + dataID + "']").find('img').attr('src', img.attr('src'));
            console.log(img.attr('md5key'));
            $("li[data-id='" + dataID + "']").find("[data-field='thumb_media_id']").val(img.attr('media-id'));
            $("li[data-id='" + dataID + "']").find('[data-field="img_src"]').val(img.attr('src'));
//            $("#news-list >li:eq(0) > .news_image_url").attr('src',src);
            $("#modal-meterial-selection").modal('toggle');

        });

        $('#summernote_1').blur(function(){
            alert($(this).html());
        });



        //处理编辑事件
        $('[data-type="edit-news"],.firstElement').live('click', function() {
            var element = $(this).closest('li');
            var id = element.attr('data-id');
            $("#edit-block").attr('data-id', id);

            $(".editon").removeClass('editon');
            $(this).closest('li').addClass('editon');
            var subElements = element.find('[data-field]');
           
            subElements.each(function() {
                var val = '';

                var attr = $(this).attr('data-field');
                var obj = $("[data-toggle='" + attr + "']");

                if (attr == 'show_cover_pic') {
                    if ($(this).val() == 1) {
                        $("#showCover").attr('class', 'btn green');
                    } else {
                        $("#showCover").attr('class', 'btn default');
                    }

                }

                if ($(this).is('input')) {
                    val = $(this).val().trim();
                    console.log($(this).is('input'))
                }else if ($(this).is('textarea')) {
                    $("#summernote_1").html($(this).text());
                    return;
                } else {
                    val = $(this).html().trim();
                }

                if (val == '标题') {
                    val = '';
                }

                if (attr == 'title') {
                    $("#titleCount").html(val.length);
                }

                obj.val(val);
            });
        });

        $('[data-toggle]').keyup(function() {
            var id = $("#edit-block").attr('data-id');
            var attr = $(this).attr('data-toggle');
            console.log(id+"---"+attr);


            var element = $("li[data-id='" + id + "']").find('[data-field="' + attr + '"]');
            if (element.is('input')) {
                element.val($(this).val());
            } else {
                element.html($(this).val());
            }

            if ($(this).attr('data-toggle') == 'title') {
                $("#titleCount").html($(this).val().length);
            }
        });

        $('[data-toggle="title"]').blur(function() {
            var len = $(this).val().length;
            if (len >= 64) {
                alert("您最大只能输入64个字符");
                return false;
            }

        });


        //处理删除事件
        $('[data-type="trash-news"]').live('click', function() {
            var element = $(this).closest('li');
            element.remove();
        });
        $("#btnSaveNews").click(function() {
            var passed = true;
            var vals = [];
            //校验元素值
            $("li[data-id]").each(function() {
                var elements = $(this).find('[data-field]');
                var v = {};
                elements.each(function() {
                    var attr = $(this).attr('data-field');

                    var val = '';
                    if (attr == 'title') {
                        val = $(this).html();
                    } else {
                        val = $(this).val();
                    }

                    if ((attr != 'author' && val == '') || val == '标题') {
                        console.log('arrt:'+attr+'<br>');
                        console.log('val:'+val);
                        passed = false;
                        return false;
                    }

                    v[attr] = val;


                });

                vals.push(v);


            });

            if (!passed) {
                alert("您有部分内容未完善,请校验!");
                return false;
            }

            var self = this;
            //alert(JSON.stringify(vals));
            console.log(JSON.stringify(vals));
            console.log(vals);
            data = JSON.stringify(vals);
            // $.post("http://172.20.10.74:8765/picturecontext/add",data,function(data){
            //     alert(1);
            // })
            
            $.ajax({
        
              type: "post",
              data: {"data":data},
              contentType: "application/x-www-form-urlencoded",
              url: "/merchant/WxPictureadd",
              async: false,
              error: function () {
                  alert("服务器忙1");
              },
              success: function (data) {
                  if (data.code == 200) {
                      alert("操作成功");
                      location.reload();
                  } else {
                      alert("服务器忙2");
                  }

              }
            });


        });
    },

        
    openModal: function(obj) {
        $("#modal-meterial-selection").attr("data-url", $(obj).attr("data-url"));
        $("#modal-meterial-selection").attr("data-type", $(obj).attr('data-type'));
        $("#modal-meterial-selection").modal('toggle');
    },
    triggerElement: function(obj, type) {
        $(obj).trigger(type);
    },
    delMeterial: function(obj) {
        if (!confirm("您确定要删除?")) {
            return false;
        }
        var id = $(obj).attr('data-id');
        $.post("/merchant/WxPicturedelete", {wxMediaId: id}, function(response) {
            //alert(response.msg);
            console.debug(response);
            if (response.code == 200) {
                location.reload();
            }
        });
    },
    /**
     * 新增一条图文空白块
     * @param {type}    元素OBJECT
     * @returns {Boolean}
     */
    createBlock: function(obj) {
        var size = $("#news-list >li").size();

        if (size >= 8) {
            alert("您最多只能添加8条图文!");
            return false;
        }

        var data_id = $(obj).attr('next-id');
        data_id++;
        var element = $("#list-empty-template").clone().removeAttr("id").removeAttr("style").attr('data-id', data_id);
        $(obj).before(element);
        $(obj).attr('next-id', data_id++);
        return true;
    }
};



$(function() {
    //绑定各类事件
    meterial.init();
});
