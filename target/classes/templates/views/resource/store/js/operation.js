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
        queryList:function () {
          var _this = this;
          var url = '/helpCenter/helpList';
          //发送ajax
          $.ajax({
            url: url,
            data: {
              platformType:115,
            },
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
          var ss=$("#platformType").val();
          formData.append('upload_file', $("#input_file")[0].files[0]);
          formData.append('fileType',fileExt);
          if(value.id){formData.append('id',value.id);}
          formData.append('platformType',value.platformType?value.platformType:ss);
          formData.append('title',value.title?value.title:$("input[name='title']").val());
          formData.append('version',value.version?value.version:$("input[name='version']").val());
          $.ajax({
            url:url,
            type:"post",
            data:formData,
            contentType: false,
            processData: false,
            timeout: 0,
            success:function (data) {
              console.log(data);
            }
          });
        },
        reset:function () {
          var _this=this;
          _this.value="";
          $("#terrace").val(0);
        }
      },

      mounted:function () {
        this.queryList();
      }
    });

  });


}





