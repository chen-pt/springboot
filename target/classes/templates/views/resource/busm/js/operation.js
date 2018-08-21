//页面加载完成执行函数
$(function () {
  require.config({
    baseUrl: '/templates/views/resource/',
    paths: {
      'vue': 'public/vue',
      'core': 'merchant/js/lib/core'
    }
  });
  helpList();
});


//积分规则列表
function helpList() {
  //加载vue模块
  require(['vue', 'core'], function (vue, core) {
    //列表请求路径
    var vm=  new vue({
          el: '#help',
          data:function () {
            var data = {items:{},value:{}};
            return data;
          },
          filters:{
            dateFormat:function (time) {
              core.formatDate()
              return new Date(time).format();
            }
          },
          methods:{
            queryDetail: function(id) {
              var _this = this;
              $.ajax({
                url: '/helpCenter/queryDetail',
                data: {
                  id:id,
                },
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                  console.log(data);
                  if(data.msg=="success"){
                    _this.value=data.value;
                  }else{
                    alert("操作失败");
                  }
                },
                error: function (data) {
                  vue.show = true;
                  vue.content = '系统内部错误';
                }
              })
            },
            queryDetail: function(id) {
              var _this = this;
              $.ajax({
                url: '/helpCenter/queryDetail',
                data: {
                  id:id,
                },
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                  console.log(data);
                  if(data.msg=="success"){
                    _this.value=data.value;
                  }else{
                    alert("操作失败");
                  }
                },
                error: function (data) {
                  vue.show = true;
                  vue.content = '系统内部错误';
                }
              })
            },
            queryList:function () {
              var _this = this;
              var url = '/helpCenter/helpList';
              //发送ajax
              $.ajax({
                url: url,
                data: siteId,
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    _this.items=data.list;
                }
              });
            },
            importOperation: function() {
              var _this = this;
              var url = '/helpCenter/save';
              //发送ajax
              var formData = new FormData();
              var value= _this.value;
              //formData.append(_this.value);
              var file= $("#file_name").val();
              var filename=file.replace(/.*(\/|\\)/, "");
              var fileExt=(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
              if($("#input_file")[0].files[0]){
                formData.append('upload_file', $("#input_file")[0].files[0]);
                formData.append('fileType',fileExt);
              }

              var type=$("#platformType").val();
              var title=$("input[name='title']").val();
              var version=$("input[name='version']").val();
              if(!type || type=="-1"){
                alert("请选择发布平台");
                return false;
                $("#addOperation").show();
              }
              if(!title){
                alert("请填写文档名称！");
                return false;
              }
              if(!version){
                alert("请填写版本号！");
                return false;
              }
              var pattern = /\d+(\.\d+){2,2}/;
              if(!pattern.test(version)){
                  alert("版本号格式错误！如:1.00.00");
                return false;
              }
              if(!file){
                alert("请选择上传文件！");
                return false;
              }
              if(value.id){formData.append('id',value.id);}
              formData.append('platformType',value.platformType?value.platformType:type);
              formData.append('title',value.title?value.title:title);
              formData.append('version',value.version?value.version:version);

              $.ajax({
                url:url,
                type:"post",
                data:formData,
                contentType: false,
                processData: false,
                timeout: 0,
                success:function (data) {
                  console.log(data);
                  if(data.msg=="success"){
                    alert("上传成功");
                    $("#addOperation").hide();
                    location.reload();
                  }else{
                    alert("上传失败");
                  }
                }
              });
            },
            delOperation:function (id) {
              var url = '/helpCenter/save';
              var formData = new FormData();
              formData.append('id',id);
              formData.append('isDel',1);
              $.ajax({
                url:url,
                type:"post",
                data:formData,
                contentType: false,
                processData: false,
                timeout: 0,
                success:function (data) {
                  console.log(data);
                  if(data.msg="success"){
                    alert("删除成功");
                    location.reload();
                  }else{
                    alert("删除失败");
                  }
                }
              });
            },
        /*    delOperation:function(item.id){

        }*/
            reset:function () {
              var _this=this;
              _this.value="";
              $("#terrace").val(-1);
            }
          },

          mounted:function () {
            this.queryList();
          }
        });

    });


}



$(document).on('change', '#input_file', function () {
  var e = $(this).val();
  $("#file_name").val(e);
});



