define(['core', 'service/pagin'],function(core, pagin){
    var User = {};
    var Role = {};

    User.getList = function(pageno) {
        pageno = pageno || 1;

        var data = $('#search-user-form').serializeArray();
        var pagesize =  $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        getStoreAdminList(data).done(function(rsp) {

            // 最少需要加载1.5S
            if(new Date() - idxTime < 1500) {
                setTimeout(function() {
                    layer.close(idx);
                }, 1500 - (new Date() - idxTime));
            } else {
                layer.close(idx);
            }

            //rsp.getRoleNames = getRoleNames;
            var html = doT.template($('#user-row-temp').html())(rsp);
            var $dataContainer = $('#user-list');
            $dataContainer.empty().append(html);

            if(rsp.status && rsp.result.items) {
                // 将数据绑定到视图
                $(rsp.result.items).each(function(idx) {
                    $dataContainer.find('tr').eq(idx).data('tree', {'datas': this});
                });
            }
            if(rsp.status && rsp.result.items.length) {
                pagin('#user-pagin',  +rsp.result.current, rsp.result.total_pages, pagesize, rsp.result.total_items, function(pageno) {
                    User.getList(pageno);
                });
                $('#user-pagin').show();
            }else {
                $('#user-pagin').hide();
            }
        });
    };

    // 获取角色列表
    Role.getList = function(pageno) {
        pageno = pageno || 1;

        var data = $('#search-role-form').serializeArray();
        var pagesize =  $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            'url': core.getHost() + '/permission/getRoleList',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        }).done(function(rsp) {

            // 最少需要加载1.5S
            if(new Date() - idxTime < 1500) {
                setTimeout(function() {
                    layer.close(idx);
                }, 1500 - (new Date() - idxTime));
            } else {
                layer.close(idx);
            }

            //rsp.getRoleNames = getRoleNames;
            var html = doT.template($('#role-row-temp').html())(rsp);
            var $dataContainer = $('#role-list');
            $dataContainer.empty().append(html);

            if(rsp.status && rsp.result.items) {
                // 将数据绑定到视图
                $(rsp.result.items).each(function(idx) {
                    $dataContainer.find('tr').eq(idx).data('tree', {'datas': this});
                });
            }
            if(rsp.status && rsp.result.items.length) {
                pagin('#role-pagin', +rsp.result.current, rsp.result.total_pages, pagesize, rsp.result.total_items, function (pageno) {
                    Role.getList(pageno);
                });
                $('#role-pagin').show();
            }else {
                $('#role-pagin').hide();
            }
        });
    };

    // 编辑/修改
    Role.edit = function(data) {
        return $.ajax({
            'url': core.getHost() + '/role/editRole',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        });
    };

    // 删除
    Role.drop = function(role_id) {
        return $.ajax({
            'url': core.getHost() + '/role/dropRole',
            'data': {
                'role_id': role_id
            },
            'type': 'post',
            'dataType': 'json'
        });
    };

    // 设置用户
    Role.setUser = function(data) {
        return $.ajax({
            'url': core.getHost() + '/role/storeRoleManagers',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        });
    };


    function getPermissionList(data) {
        data = data || {
            'pageno': 1,
            'pagesize': 100,
            'permission-platform': 110
        };
        return $.ajax({
            'url': core.getHost() + '/permission/getPermissionList',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        });
    }

    // 获取权限模块
    function getPermissionTypeList() {
        return $.ajax({
            'url': core.getHost() + '/permission/getPermissionTypeList',
            'type': 'post',
            'dataType': 'json'
        });
    }

    // 获取店员列表
    function getStoreAdminList(data) {
        data = data || {
            'pageno': 1,
            'pagesize': 1000
        };
        return $.ajax({
            'url': core.getHost() + '/permission/getStoreAdminList',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        });
    }

    // 获取日志
    function getLogList(pageno) {
        pageno = pageno || 1;
        var data = $('#search-log-form').serializeArray();
        var pagesize =  $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            'url': core.getHost() + '/permission/getlogsList',
            'data': data,
            'type': 'post',
            'dataType': 'json'
        }).done(function(rsp) {

            // 最少需要加载1.5S
            if(new Date() - idxTime < 1500) {
                setTimeout(function() {
                    layer.close(idx);
                }, 1500 - (new Date() - idxTime));
            } else {
                layer.close(idx);
            }

            var html = $('#log-row-temp').html();
            html = doT.template(html)(rsp);

            $('#log-list').empty().append(html);
            if(rsp.status) {
                pagin('#log-pagin', +rsp.result.current, rsp.result.total_pages, pagesize, rsp.result.total_items, function (pageno) {
                    getLogList(pageno);
                });
                $('#log-pagin').show();
            }else {
                $('#log-pagin').hide();
            }
        });
    }

    // 设置授权码
    function setAuthCode(data) {
        return $.ajax({
            'url': core.getHost() + '/permission/setAuthCode',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp.status) {
                layer.alert('设置成功');
            } else {
                layer.alert(rsp.result.msg);
            }
        })
    }

    // 设置授权码
    function showGetStorePower() {
        return $.ajax({
            'url': core.getHost() + '/permission/setAuthCode',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp.status) {
                layer.alert('设置成功');
            } else {
                layer.alert(rsp.result.msg);
            }
        })
    }

    return {
        'User': User,
        'Role': Role,
        'getPermissionList': getPermissionList,
        'getPermissionTypeList': getPermissionTypeList,
        'getStoreAdminList': getStoreAdminList,
        'getLogList': getLogList,
        'setAuthCode': setAuthCode,
        'showGetStorePower':showGetStorePower
    };
});