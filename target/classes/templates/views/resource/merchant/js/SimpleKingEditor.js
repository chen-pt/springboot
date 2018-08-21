/**
 * Created by Administrator on 2017/9/12.
 */

var editor; //全局变量 编辑器对象
$(document).ready(function () {
  //获取自身文件对象
  var target=$("script[src=\\/templates\\/views\\/resource\\/merchant\\/js\\/SimpleKingEditor\\.js]");

  //动态导入js依赖
  var script1=document.createElement("script");
  script1.charset="utf-8";
  script1.src="/templates/views/resource/public/kindEditor/kindeditor-all-min.js";
  var script2=document.createElement("script");
  script2.charset="utf-8";
  script2.src="/templates/views/resource/public/kindEditor/lang/zh_CN.js";
  var link=document.createElement("link");
  link.href="/templates/views/resource/public/kindEditor/themes/default/default.css";
  link.rel="stylesheet";
  $(target).prepend(script1);
  $(target).prepend(script2);
  $(target).prepend(link);

  //初始化编辑器
  KindEditor.ready(function (K) {
    editor = K.create('#king', {
      allowFileManager: true,
      items: ['source', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist',
        'insertunorderedlist', '|', 'selectall', 'fullscreen', 'table', 'hr', 'link', '|', 'formatblock', 'fontname',
        'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', '|', 'example1', 'content']
    })
  })

  KindEditor.lang({
    example1: '插入图片'
  });
  KindEditor.plugin('example1',
    function (K) {
      var self = this, name = 'example1'
      self.clickToolbar(name,
        function () {
          $('#uploadMyPicToServer').attr('class', 'sui-modal show')
          curEdit = self.items[27]
        })
    })

    //准备向页面添加一些东西
    var tips = '<input type="file" id="clickMe" multiple="multiple" style="display: none;" accept=".png,.gif,.bmp,.gpeg,.psd,.jpg"/>'+
      '<div id="uploadMyPicToServer" tabindex="-1" role="dialog" class="sui-modal hide" data-backdrop="static"><div class="modal-dialog"><div class="modal-header">'+
    '<button type="button" data-dismiss="modal" aria-hidden="true" class="sui-close">×</button><h4 class="modal-title">选择图片</h4></div>'+
    '<div class="modal-content"> <div class="modal-body" style="text-align: center;"> <p><input type="button" value="本地上传" class="sui-btn btn-large" '+
    'data-dismiss="modal" aria-hidden="true" /></p> </div> </div> </div> </div>';

    //将这个html片段添加在页面最后
     $("body").append(tips);

    //给新加的html片段绑定事件
     $("input[value=本地上传]").live("click",function () {
       $('#clickMe').click();
     })

     $(".sui-close").live("click",function () {
       $('#uploadMyPicToServer').attr('class','sui-modal hide');
     })

  //富文本点击上传事件
  $('#clickMe').live('change', function uploadImg (evt) {
    var param = {}
    var files = evt.target.files
    var formData = new FormData()
    formData.append('file', files[0])
    $.ajax({
      url: '/common/localpictureUpload',
      type: 'POST',
      data: formData,
      success: function (data) {
        var tips = '<img src="http://jkosshash.oss-cn-shanghai.aliyuncs.com//' + data.image.md5Key + '.jpg">'
        console.log(editor.html())
        editor.html(editor.html() + tips)
        $('#upload_D').attr('class', 'sui-modal hide')
        layer.msg('上传成功')
      },
      error: function (data) {
      },
      cache: false,
      contentType: false,
      processData: false
    })
  })
})
