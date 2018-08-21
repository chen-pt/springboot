define(['core'],function(core){
    var __obj = {};

    __obj.init = function() {
        // 添加凭证
        $(document).on('change', '#temp-file', function() {
            if(this.value) {
                $('#temp-file-form').trigger('submit');
            }
        });

        // 删除凭证
        $(document).on('click', '.del-ce', function() {
            //var $previewImg = $(this).prevAll('.preview-img');
            //$previewImg.find('img').attr('src', '').siblings('[name="voucher[]"]').val('');
            //$previewImg.addClass('empty');
            $(this).parent('.ce-img').remove();
        });

        $(document).on('keyup', '.listen-input', function() {
            $('#js-pl-limit').html(this.value.length);
        });

    };

    // 添加凭证
    __obj.addCe = function (imgurl) {
        var $ceImgs = $('.ce-group');
        // 最多五个 如果还有空位也不增加
        if($ceImgs.find('.ce-img').size() < 5 && $ceImgs.find('.ce-img .preview-img.empty').size() == 0) {
            //var $clone = $('.ce-img:eq(0)').clone();
            //$clone.find('.preview-img').addClass('empty').find('img').attr('src', '');
            var $clone = $('#ce-img-temp').html();
            $ceImgs.append($clone);
        }

        // 找到一个空的位置
        var $previewImg = $('.ce-img').find('.preview-img.empty').eq(0);
        // 显示图片
        $previewImg.find('img').attr('src', imgurl).siblings('[name="voucher[]"]').val(imgurl);
        $previewImg.removeClass('empty');

    };

    __obj.handleRefund = function(data) {
        $.ajax({
            'url': core.getHost() + '/refund/handleRefund',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if(rsp && rsp.status) {
                layer.msg(rsp.result.msg, function() {
                    // TODO 退款成功之后
                    location.href = core.getHost() + '/order/refund/handle' + location.search;
                });
            } else {
                layer.alert(rsp.result.msg);
            }
        });
    };

    return __obj;
});