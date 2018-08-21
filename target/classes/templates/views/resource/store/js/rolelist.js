/**
 * Created by admin on 2017/3/10.
 */

function AlertLoading(dom) {
  dom.parent().css('position', 'relative');
  //dom给需要的标签内 加 效果
  var load =
    '<div class="sk-circle" style="position: absolute; top: 50%;left: 50%;">' +
    '<div class="sk-circle1 sk-child"></div>' +
    '<div class="sk-circle2 sk-child"></div>' +
    '<div class="sk-circle3 sk-child"></div>' +
    '<div class="sk-circle4 sk-child"></div>' +
    '<div class="sk-circle5 sk-child"></div>' +
    '<div class="sk-circle6 sk-child"></div>' +
    '<div class="sk-circle7 sk-child"></div>' +
    '<div class="sk-circle8 sk-child"></div>' +
    '<div class="sk-circle9 sk-child"></div>' +
    '<div class="sk-circle10 sk-child"></div>' +
    '<div class="sk-circle11 sk-child"></div>' +
    '<div class="sk-circle12 sk-child"></div>' +
    '</div>';
  dom.append(load);   //loading追加到tbody之后
}
$(function () {
  role_clear();
  getrolelist(0);
  $("#role-search-btn").click(function () {
    getrolelist(0);
  });
  $(".page_size_select").on("change", function () {
    pageSize = $(this).val();
    getrolelist();
  });
  $("#save-user-btn").click(function () {
    updateUserOnRole();
  });
});
/**
 * 获取角色列表
 */
var getrolelist = function () {
  var rolename = $("[name=search_role_name]").val();
  AlertLoading($("#role-list"));
  $.ajax({
    type: "POST",
    url: "/store/storeroles",
    data: {
      "rolename": rolename,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#role-list").html('');
      $("#role-list").empty();
      var tr = "";
      if (data.result.list.length > 0) {
        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;
        for (var i = 0; i < data.result.list.length; i++) {
          var role = data.result.list[i];
          var roledesc = (role.roleDesc == "null" || role.roleDesc == null) ? "" : role.roleDesc;
          tr += "<tr><input  type='hidden' name='role-id'value='" + role.roleId + "'/><td>" + role.rolename + "</td>" +
            "<td>" + roledesc + "</td><td>" + role.username + "</td>" +
            "<td><a class='edit-role' data-toggle='modal' data-target='#edit-user'data-keyboard='false'>编辑</a>" +
            "<a class='set-role' data-toggle='modal' data-target='#set-role'data-keyboard='false' style='margin:auto 6px;'>权限</a>" +
            "<a class='set-user' data-toggle='modal' data-target='#set-user'data-keyboard='false'>用户</a>" +
            "<a class='del-role'style='margin-left:6px;'>删除</a></td>" +
            "</tr>";
        }

        $("#role-list").html(tr);
        $("#pagediv").html("<span class='pageinfo'></span>");
      } else {
        $("#role-list").html("<tr><td colspan='10'class='center'>暂无数据</td></tr>");
      }
      $(".edit-role").click(function () {
        role_edit_show(this);
      });
      $(".set-role").click(function () {
        permission_list(this);
      });
      $(".set-user").click(function () {
        setuserlist(this);
      });
      $("#edit_btn").click(function () {
        edit_role();
      });
      $(".del-role").click(function () {
        delRoleById(this);
      });
      addpage(getrolelist);
    },
  })
}

/**
 * 单一角色信息显示
 */
var role_edit_show = function ($edit_btn) {
  var roleid = $($edit_btn).parent().parent().children("input").val();
  var rolename = $($edit_btn).parent().parent().children("td:eq(0)").html();
  var roleDesc = $($edit_btn).parent().parent().children("td:eq(1)").html();
  $("[name=role_id]").val(roleid);
  $("[name=role_name]").val(rolename);
  $("[name=role_desc]").html(roleDesc);
}
/**
 * 表单清空
 */
var role_clear = function () {
  $("[name=role_id]").val("");
  $("[name=role_name]").val("");
  $("[name=role_desc]").html("");
}
/**
 * 新增或修改确定按钮点击
 */
var edit_role = function () {
  var id = $("[name=role_id]").val();
  var name = $("[name=role_name]").val();
  var desc = $("[name=role_desc]").val();
  if (name == "" || name == null) {
    alert("角色名不能为空");
  } else {
    $.ajax({
      type: "POST",
      url: "/store/updaterole",
      data: {
        "id": id,
        "role_name": name,
        "role_desc": desc
      },
      dataType: "JSON",
      success: function (data) {
        if (data.result == "success") {
          alert("角色更新成功");
          window.location.href = "/store/permission/role";
        } else if (data.result = "300") {
          alert("角色名称不能重复");
        }
      },
    });
  }
}

/**
 * 权限列表显示+角色权限
 */

var permission_list = function ($btn) {
  $("#permissions").empty();
  var roleid = $($btn).parent().parent().children("input").val();
  $("#set-permission-form").find("[name=roleId]").val(roleid);
  $.ajax({
    type: "POST",
    url: "/store/roleAndPermissions",
    data: {"id": roleid},
    datatype: "json",
    success: function (data) {
      var permissionTypes = data.permissionType;
      var permissions = data.permissions;
      var roleHasPermissions = data.roleHasPermissions;
      var checkPermissions = data.storeHasPermissions;//未被选中的门店盘点权限
      var ss = "";
      $.each(permissionTypes, function (n, permissionType) {
        var tr = "";
        if (permissionType.name == '盘点管理') {
          if (checkPermissions.code == -1 || !checkPermissions.info) {//没有盘点模块
            console.log("该门店没有盘点模块");
          } else {
            tr = "<tr><td><label class='permission-group-label'><input type='checkbox'value='" + permissionType.id + "' class='pertype'/>" + permissionType.name + "</label></td><td id='permission-group-28'>";
            $.each(permissions, function (m, permission) {
                if (permissionType.id == permission.typeId || permissionType.id == permission.type_id) {
                  tr += "<label class='permission-label'><input type='checkbox'name='role_permission' value='" + permission.id + "'/>" + permission.name + "</label>";
                }
              }
            );
          }
        } else {
          tr = "<tr><td><label class='permission-group-label'><input type='checkbox'value='" + permissionType.id + "' class='pertype'/>" + permissionType.name + "</label></td><td id='permission-group-28'>";
          $.each(permissions, function (m, permission) {
              if (permissionType.id == permission.typeId || permissionType.id == permission.type_id) {
                tr += "<label class='permission-label'><input type='checkbox'name='role_permission' value='" + permission.id + "'/>" + permission.name + "</label>";
              }
            }
          );
        }
        tr += "</td></tr>";
        ss += tr;
      });
      $("#permissions").append(ss);
      $(".pertype").bind('click', function () {
        var checked_type = this.checked;
        var input_arr = $(this).parent().parent().next().find("input");
        $.each(input_arr, function (i, dom) {
          $(dom).prop('checked', checked_type);
        });
      });
      $("#save-permission-btn").click(function () {
        savepermission();
      });
      if (checkPermissions.code == -1) {//不要显示盘点模块的权限

      } else if (checkPermissions.code == 0) {//剔除部分权限
        $.each(checkPermissions.info, function (o, checkPermission) {
          $("[name=role_permission] ").each(function () {
            if ($(this).val() == checkPermission) {
              $(this).parent().attr("hidden", "hidden");
            }
          });
        });
      }
      $.each(roleHasPermissions, function (o, roleHasPermission) {
        $("[name=role_permission] ").each(function () {
          if ($(this).val() == roleHasPermission.id) {
            $(this).attr("checked", true);
          }
        });
      });

      eachLabel(permissionTypes);
    },
  });
}
/**
 * 修改该角色的权限信息
 */
var savepermission = function () {
  var roleId = $("#set-permission-form").find("[name=roleId]").val();
  var role_permissions = "";
  $.each($("[name=role_permission]"), function (c, uid) {
    if ($(uid).is(':checked')) {
      role_permissions += $(uid).val() + ",";
    }
  })
  console.log("需要修改的权限" + role_permissions);
  $.ajax({
    type: "POST",
    dataType: "JSON",
    url: "/store/addPermissiononRole",
    data: {
      "roleId": roleId,
      "role_permissions": role_permissions
    },
    success: function (data) {
      if (data.result == "success") {
        alert("角色权限修改成功");
      }
      window.location.href = "/store/permission/role";
    },
  })

}

/**
 * 加载用户选项框
 * 该平台的所有用户+该角色具有那些用户
 */

var setuserlist = function ($btn) {
  $("#set-user-form").find(".clearfix").empty();
  var roleid = $($btn).parent().parent().children("input").val();
  $("#set-user-form").find("[name=role_id]").val(roleid);
  $.ajax({
    type: "POST",
    url: "/store/selectUserByRole",
    data: {
      "roleId": roleid,
    },
    success: function (data) {
      var managerlist = data.managerlist;
      var managerli = "";
      $.each(managerlist, function (a, manager) {
        managerli += "<li class='user-label'><label><input class='user-ids' type='checkbox'name='user_ids' value='" + manager.storeadmin_id +
          "'/>" + manager.name + "</label></li>";
      })
      $("#set-user-form").find(".clearfix").append(managerli);
      var roleid = $($btn).parent().parent().children("input").val();
      $.each(managerlist, function (a, manager) {
        $.each(manager.roleList, function (b, role) {
          if (role.id == roleid) {
            $.each($(".user-ids"), function (c, uid) {
              if ($(uid).val() == manager.storeadmin_id) {
                $(uid).attr("checked", "checked");
              }
            })
          }
        })
      })
    },
  })
}


/**
 * 更改角色拥有的用户
 */
var updateUserOnRole = function () {
  var roleId = $("#set-user-form").find("[name=role_id]").val();
  var id = $("[name=role_id]").val();
  var user_ids = "";
  $.each($("[name=user_ids]"), function (c, uid) {
    if ($(uid).is(':checked')) {
      user_ids += $(uid).val() + ",";
    }
  })
  $.ajax({
    type: "POST",
    url: "/store/updateUserOnRole",
    data: {
      "role_id": roleId,
      "user_ids": user_ids
    },
    dataType: "JSON",
    success: function (data) {
      window.location.href = "/store/permission/role";
    },
  })
}

/**
 * 删除对应角色
 */
var delRoleById = function ($delBtn) {
  var roleid = $($delBtn).parent().parent().children("input").val();
  var r = confirm("你确定要删除该角色吗？该角色内所有权限和用户将被移除。");
  if (r) {
    $.ajax({
      type: "POST",
      url: "/store/delRole",
      data: {"roleId": roleid},
      success: function (data) {
        window.location.href = "/store/permission/role";
      },
    })
  }
}

function eachLabel(arr) {
  for (var i = 0; i < arr.length; i++) {
    var all_td = $('#permissions').children('tr')[i];
    var all_input = $(all_td).children('td').eq(1).find('input');
    var selected = 0;
    for (var s = 0; s < all_input.length; s++) {
      if (all_input[s].checked) {
        selected += 1;
      }
    }
    if (selected == all_input.length && selected != 0) {
      $(all_td).find('.pertype').attr('checked', true);
    }
  }
}




