require([
    'common',
    'task/xsjl',
    'task/xspmjl',
    'task/zcjl',
    'core/pagin',
    'sui',
], function(YBZF, xsjl, xspmjl, zcjl,pagin ,__xx__sui) {
    var store_ids;

    var Task = (function() {
        var $openModal;
        var data;

        return {
            'showModal': function(config) {
                $openModal = $.alert(config);
                return $openModal;
            },
            'hideModal': function() {
                $openModal.modal('hide');
                store_ids = null;
            },
            'reset': function() {
                store_ids = null;
                data = null;
            },
            'getData': function(reget) {
                data = data || {};

                if(reget) {
                    // 重新获取
                    data = {};
                }

                data = {
                    'task_id': data.task_id || $('#task_id').val(),
                    'task_title': data.task_title || ($('#task-title').val() || '').trim(),
                    'start_time': data.start_time || $('#start_time').val(),
                    'end_time': data.end_time || $('#end_time').val(),
                    //'is_long': data.is_long || +$('#is_long').prop('checked'),
                    'city_id': data.city_id || $('#city-group').data('tree').datas.value.slice(-1).toString(),
                    'store_ids': data.store_ids || $('#store-list').find('input:checkbox:checked').map(function() {
                        return this.value || '';
                    }).get().join(',')
                };

                return data;
            }
        };
    })();

    // 验证值
    Task.validate = function() {
        var data = Task.getData(true);

        // region 验证值
        if( ! data.task_title ) {
            return {
                'msg': '任务标题不能为空'
            };
        }
        if( ! (data.start_time && data.end_time) ) {
            return {
                'msg': '请选择任务时间'
            };
        }
        if( new Date(data.end_time) - new Date(data.start_time) < 864800) {
            var t = '';
            if(new Date(data.end_time) < new Date(data.start_time)) {
                t = '活动开始时间必须大于结束时间';
            } else {
                t = '活动持续时间必须大于一天';
            }

            return {
                'msg': t
            };
        }
        if( ! data.city_id ) {
            return {
                'msg': '请选择地区'
            };
        }
        if( ! data.store_ids ) {
            return {
                'msg': '请选择参与门店'
            };
        }
        // endregion

        return true;
    };

    // 显示发布新任务的对话框
    Task.showNewTashModal = function() {
        // 将记录的数据清空
        Task.reset();

        var html = $.tmpl($('#new-task-temp').html(), {});
        html += '<p class="split-top text-center"><button id="next-step" class="sui-btn btn-primary btn-large">下一步</button></p>';

        var $modal = Task.showModal({
            'backdrop': 'static',
            'width': 'small',
            'title': '发布新任务',
            'hasfoot': false,
            'body': html
        });

        // 初始化 级联选择器
        $('#city-group').tree();
        return $modal;
    };

    // 添加任务
    Task.addTask = function(data) {
        var validateResult = {};
        switch(+data.type) {
            case 110:
                validateResult = xspmjl.validate(data);
                break;
            case 120:
                validateResult = xsjl.validate(data);
                break;
            case 130:
                validateResult = zcjl.validate(data);
                break;
        }

        if(validateResult !== true) {
            layer.msg(validateResult.msg);
            return;
        }

        if( data.desc.length < 10 ) {
            layer.msg('任务描述不能少于10个字符');
            return;
        }

        YBZF.services({
            'url': YBZF.hostname + '/task/addTask',
            'data': data
        }).done(function(rsp) {
            if( rsp.status ) {
                Task.hideModal();
                getList(1);
            }
            layer.msg(rsp.result.msg);
        });
    };

    Task.updateTask = function(data) {
        if( data.desc.length < 10 ) {
            layer.msg('任务描述不能少于10个字符');
            return;
        }

        YBZF.services({
            'url': YBZF.hostname + '/task/updateTask',
            'data': data
        }).done(function(rsp) {
            if( rsp.status ) {
                Task.hideModal();
                getList(1);
            }
            layer.msg(rsp.result.msg);
        });
    };

    // 根据任务类型获取数据
    Task.getTypeData = function(type) {
        var typeData;
        switch(+type) {
            case 110:
                typeData = xspmjl.getData();
                break;
            case 120:
                typeData = xsjl.getData();
                break;
            case 130:
                typeData = zcjl.getData();
                break;
        }

        return typeData;
    };

    // 选择任务
    Task.selectTask = function() {
        var type = +$('#task-type').val();

        var validateResult = Task.validate();
        if(validateResult !== true) {
            layer.msg(validateResult.msg);
            return;
        }

        var modalParam = {};
        switch (type) {
            case 110:
                modalParam = xspmjl.getShowModalParam();
                break;
            case 120:
                modalParam = xsjl.getShowModalParam();
                break;
            case 130:
                modalParam = zcjl.getShowModalParam();
                break;
        }

        var pickForm = $.tmpl( $('#pick-form-temp').html(), {'formid': 'xxjl'} );
        pickForm = $(pickForm);
        pickForm.append(modalParam.html);

        // FIXME 不记得干啥的了
        Task.hideModal();

        modalParam = $.extend(modalParam, {
            'backdrop': 'static',
            'width': 'small',
            'hasfoot': false,
            'body': pickForm.prop('outerHTML')
        });

        var $taskModal = Task.showModal(modalParam);

        // 发布任务
        $taskModal.on('click', '.push-task', function() {
            var data = Task.getData();
            var typeData = Task.getTypeData(type);

            data = $.extend(data, typeData);
            Task.addTask(data);
        });
    };

    // 发布新任务
    $(document).on('click', '#new-task', function() {
        var $modal = Task.showNewTashModal();

        // 点击下一步
        $modal.on('click', '#next-step', function() {
            Task.selectTask();
        });
    });

    // 根据地区ID获取门店
    function getStoreByCityId() {
        if( ! this.value ) {
            $('#store-list').empty().append('<li>该地区没有门店</li>');
            return;
        }

        // 根据城市获取门店列表
        YBZF.services({
            'url': YBZF.hostname + '/task/getStoreByCityId',
            'data': {
                'city_id': this.value
            }
        }).done(function(rsp) {
            if( rsp.status && rsp.result.length ) {
                var html = '';
                var $storeList = $('#store-list').empty();
                for( var k in rsp.result ) {
                    var temp = rsp.result[k];
                    for( var i in store_ids ) {
                        if( store_ids[i].b_store_id == temp.b_store_id ) {
                            var ischecked = true;
                            break;
                        }
                    }

                    html = '<li><label><input type="checkbox" value="' + temp.id + '">' + temp.name + '</label></li>';
                    $storeList.append(html);

                    if(ischecked) {
                        $storeList.find('li:eq(-1) input:checkbox').prop('checked', true).trigger('change');
                        ischecked = false;
                    }

                }
                // 新的门店列表 重置下商家选择的单选按钮组
                //$('[name=select-store]').prop('checked', false);
            } else {
                $('#store-list').empty().append('<li>该地区没有门店</li>');
            }
        });
    }

    // 全部商家
    $(document).on('click', '#all-store', function() {
        $('#store-list').find('input:checkbox').prop('checked', this.checked);
    });

    // 选择门店
    $(document).on('change', '#store-list input:checkbox', function() {
        var $checkboxs = $('#store-list').find('input:checkbox');

        if( $checkboxs.filter(':checked').size() === $checkboxs.size() ) {
            $('#all-store').prop('checked', true);
        } else {
            $('#part-store').prop('checked', true);
        }
    });

    /**
     * 获取任务列表
     */
    function getList(pageno) {
        pageno = pageno || 1;
        var data = $('#search-form').serializeArray();
        var pagesize = $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});
        YBZF.services({
            'url': YBZF.hostname + '/task/getList',
            'data': data
        }).done(function(rsp) {
            var html = $.tmpl($('#task-list-temp').html(), rsp);
            var $taskList = $('#task-list').empty().append(html);
            $taskList.find('tr').each(function(k) {
                $(this).data('record', {datas: rsp.result.items[k]});
            });
            // 翻页

            pagin('#pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
        });
    }

    // 显示任务信息
    function showTask(data, title) {
        switch(+data.type) {
            case 110:
                var tempId = 'xspmjl-temp';
                break;
            case 120:
                tempId = 'xsjl-temp';
                break;
            case 130:
                tempId = 'zcjl-temp';
                break;
        }

        var html = $.tmpl($('#new-task-temp').html(), data);

        var typeHtml = $.tmpl($('#' + tempId).html(), data);
        html = $(html).append(typeHtml);

        return Task.showModal({
            'backdrop': 'static',
            'width': 'normal',
            'title': title || '编辑任务',
            'hasfoot': false,
            'body': html.prop('outerHTML')
        });
    }

    // 选择地区
    $(document).on('change', '#city-group select', getStoreByCityId);

    // 点击查看
    $(document).on('click', '.cat-task', function() {
        // 查看任务
        var data = $(this).parents('tr').data('record').datas;
        data.eventType = 'cat';
        showTask(data, '查看任务');
        $('#city-group').tree();
        store_ids = data.store_ids;
    });

    // 点击编辑
    $(document).on('click', '.edit-task', function() {
        // 编辑任务
        var data = $(this).parents('tr').data('record').datas;
        data.eventType = 'update';
        showTask(data, '编辑任务');
        $('#city-group').tree();
        store_ids = data.store_ids;

        $('.update-task').on('click', function() {
            // 更新任务
            var taskData = Task.getData();
            var typeData = Task.getTypeData(data.type);
            taskData = $.extend(taskData, typeData);

            Task.updateTask(taskData);
        });

        $('.pause-task,.stop-task').on('click', function() {
            // 改变任务状态
            var status;
            if( $(this.classList).get().indexOf('pause-task') !== -1 ) {
                status = 'pause';
            } else {
                status = 'stop';
            }

            YBZF.services({
                'url': YBZF.hostname + '/task/changeStatus',
                'data': {
                    'taskId': data.id,
                    'status': status
                }
            }).done(function(rsp) {
                if(rsp.status) {
                    Task.hideModal();
                    getList(1);
                }

                layer.msg(rsp.result.msg);
            });
        });
    });

    // 绑定搜索按钮
    $(document).on('click', '#search', function() {
        getList(1);
    });

    // 页面加载完就获取一下任务列表
    $(function() {
        getList(1);
    });
});