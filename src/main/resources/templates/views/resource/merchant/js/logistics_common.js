define(['dot'], function () {
  var common = {};
  common.getListUrl = "/merchant/commonData";
  common.updateUrl = "/merchant/commonUpdate";
  common.saveUrl = "/merchant/commonAdd";

  common.getList = function () {
    $.ajax({
      url: common.getListUrl,
      data: {},
      type: 'post',
      success: function (data) {
        if (data.status) {
          var html = "";
          for (var i in data.result) {
            for (var m in data.result[i]) {
              html += "<span style='margin-top:11px;width:25px;' class='pull-left'>" + m + "</span>";
              html += "<span style='display:inline-block;overflow:hidden;width:95%'>";
              var label = data.result[i];
              for (var n in label[m]) {
                var item = label[m];
                var metaId = item[n].metaId||"";
                html += "<label class='checkbox-pretty inline ";
                html += item[n].oftenFlag ? "checked" : "";
                html += "' style='margin:10px 10px 1px;display:inline-block;width:160px;'> " +
                  "<input type='checkbox' name='log_id' meta-id='" + metaId + "' data-id='" + item[n].id + "'";
                html += item[n].oftenFlag ? "checked" : "";
                html += "><span>" + item[n].name + "</span> </label>";
              }
              html += "</span><br>";
            }
          }
          $("#commonList").append(html);
        }

      }
    });


  }

  common.updateData = function () {
    var obj = $("input[name='log_id']:checkbox:checked");
    var datas = {};
    var log_id = "";

    if (obj.length > 5) {
      layer.msg('常用物流不能超过5个');
      return false;
    }
    if (obj.length == 0) {
      layer.msg('未选择任何常用物流');
      return false;
    }

    obj.each(function () {
      log_id += $(this).attr("data-id") + ",";
      if(!datas.metaId)datas.metaId = $(this).attr("meta-id")||"";
    });

    datas.metaVal = log_id.replace(/(,*$)/g, "");
    $.ajax({
      type: 'POST',
      data: datas,
      url: common.updateUrl,
      success: function (data) {
        if (data.status == true) {
          layer.msg("常用物流设置成功", function () {
            window.location.reload();
          });
        }
      }
    });

  }

  common.saveData = function () {
    var name = $('#addlogcompany_name').val() || "";
    if (name.length > 10 || name.length < 2) {
      layer.msg("名称长度要求2-10个字符");
      return false;
    }
    $('#addLogCompany').modal('hide');
    var datas = {};
    datas.name = name;
    datas.code = "";

    $.ajax({
      type: 'POST',
      data: datas,
      url: common.saveUrl,
      success: function (data) {
        if (data.status) {
          layer.msg("物流公司添加成功", function () {
            window.location.reload();
          });
        }
      }
    });

  }

  return common;
});
