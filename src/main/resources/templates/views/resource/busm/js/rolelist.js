/**
 * Created by admin on 2017/3/10.
 */
$(function () {
  getrolelist();
  $("#role-search-btn").click(function () {
    getrolelist();
  });
  $("#add-role-btn").click(function () {
    role_clear();
  });
});
/**
 * 获取角色列表
 */
var getrolelist = function (num) {
  var currentPage = num;
  var pagesize = 10;
  var rolename = $("[name=search_role_name]").val();
  AlertLoading($("#role-list"));
  $.ajax({
    type: "POST",
    url: "/jk51b/getRole",
    data: {
      "rolename": rolename,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#role-list").empty();
      var tr = "";
      if (data.result.list) {
        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;
        for (var i = 0; i < data.result.list.length; i++) {
          var role = data.result.list[i];
          var roledesc = (role.roleDesc == "null" || role.roleDesc == null) ? "" : role.roleDesc;
          tr += "<tr><input  type='hidden' name='role_id'value='" + role.roleId + "'/><td>" +
            role.rolename + "</td><td>" + roledesc + "</td><td>" +
            role.username + "</td>" +
            "<td><a class='edit-role' data-toggle='modal' data-target='#add-role'data-keyboard='false'>编辑</a>" +
            "<a class='set-role' data-toggle='modal' data-target='#set-role'data-keyboard='false' style='margin:auto 6px;'>权限</a>" +
            "<a class='set-user' data-toggle='modal' data-target='#set-user'data-keyboard='false'>用户</a>" +
            "<a class='del-role' style='margin-left:6px;'>删除</a></td>" +
            "</tr>";
        }
      } else {
        tr = "暂无数据";
      }
      $("#role-list").append(tr);
      $("#pagediv").html("<span class='pageinfo'></span>");
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
  var url = "";
  var id = $("[name=role_id]").val();
  var name = $("[name=role_name]").val();
  var desc = $("[name=role_desc]").val();
  if (id != null && id != "") {
    url = "updateRole";  //这是修改角色信息
  } else {
    url = "addrole";//这是新增
  }
  if (!name) {
    alert("角色名称必须填写哟！");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/jk51b/" + url,
    data: {
      "id": id,
      "role-name": name,
      "role-desc": desc
    },
    dataType: "JSON",
    success: function (data) {
      if (data.result == 300) {
        alert("角色名不能重复！");
      } else if (data.result == "success") {
        alert("编辑角色成功");
        window.location.href = "/jk51b/to_rolelist";
      }
    },
  });

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
    url: "/jk51b/roleAndPermissions",
    data: {"id": roleid},
    datatype: "json",
    success: function (data) {
      var permissionTypes = data.permissionType;
      var permissions = data.permissions;
      var roleHasPermissions = data.roleHasPermissions;
      var ss = "";
      $.each(permissionTypes, function (n, permissionType) {
        var tr = "<tr ><td><label class='permission-group-label'><input type='checkbox' value='" + permissionType.id + "' class='pertype'/>" + permissionType.name + "</label></td><td id='permission-group-28'>";
        $.each(permissions, function (m, permission) {
            if (permissionType.id == permission.typeId || permissionType.id == permission.type_id) {
              tr += "<label class='permission-label'><input type='checkbox' name='role_permission' value='" + permission.id + "'/>" + permission.name + "</label>";
            }
          }
        );
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
  $.ajax({
    type: "POST",
    dataType: "JSON",
    url: "/jk51b/addPermissiononRole",
    data: {
      "roleId": roleId,
      "role_permissions": role_permissions
    },
    success: function (data) {
      window.location.href = "/jk51b/to_rolelist";
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
    url: "/jk51b/selectUserByRole",
    data: {
      "roleId": roleid,
    },
    success: function (data) {
      var managerlist = data.managerList;
      var managerli = "";
      $.each(managerlist, function (a, manager) {
        managerli += "<li class='user-label'><label><input type='checkbox'name='user_ids' value='" + manager.id +
          "'/>" + manager.username + "</label></li>";
      })
      $("#set-user-form").find(".clearfix").append(managerli);
      var roleid = $($btn).parent().parent().children("input").val();
      $.each(managerlist, function (a, manager) {
        $.each(manager.roleList, function (b, role) {
          if (role.id == roleid) {
            $.each($("[name=user_ids]"), function (c, uid) {
              if ($(uid).val() == manager.id) {
                $(uid).attr("checked", "checked");
              }
            })
          }
        })
      })
      $("#save-user-btn").click(function () {
        updateUserOnRole();
      });
    },
  })
}

/**
 * 更改角色拥有的用户
 */
var updateUserOnRole = function () {
  var id = $("#set-user-form").find("[name=role_id]").val();
  var user_ids = "";
  $.each($("[name=user_ids]"), function (c, uid) {
    if ($(uid).is(':checked')) {
      user_ids += $(uid).val() + ",";
    }
  })
  $.ajax({
    type: "POST",
    url: "/jk51b/updateUserOnRole",
    data: {
      "role_id": id,
      "user_ids": user_ids
    },
    dataType: "JSON",
    success: function (data) {
      window.location.href = "/jk51b/to_rolelist";
    },
  })
}

/**
 * 删除对应角色
 */
var delRoleById = function ($delBtn) {
  var roleid = $($delBtn).parent().parent().children("input").val();
  $.ajax({
    type: "POST",
    url: "/jk51b/delRole",
    data: {"roleId": roleid},
    success: function (data) {
      alert("删除成功");
      window.location.href = "/jk51b/to_rolelist";
    },
    error: function () {
      alert("删除失败");
    }
  })
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





