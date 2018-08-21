!(function() {
  $.fn.drag = function(options) {
    $(this).each(function() {
      init.call(this, options);
    });

    return this;
  };

  function init(options) {
    options = $.extend({
      'border': '1px solid #0099FF',
      'boxShadow': '0px 0px 20px #0099FF',
      'colors': ['#0099FF', '#ff0000', '#009933', '#CC0000'],
      'title': '将图片拖拽至此或点击上传',
      'tips': '禽兽，快放开那张图片',
      'container': '.file-container',
      'closeBtnClass': 'sui-icon icon-tb-roundclose',
      'fileSize': 2028,
      'error': errorMsg
    }, options);

    var source = $(this).find('input:file').data('source') || '';
    var html =
      '<span class="tips">' + options.title +'</span>' +
      '<i class="sui-icon icon-cloud-upload"></i>' +
      '<span class="filecontent' +
      (source ? ' full-img' : '') +
      '"><img src="' +
      source +
      '" alt="" /><i class="close-btn ' +
      options.closeBtnClass +
      '" style="position: absolute;right: -10px;top: -10px;font-size: 24px;font-weight: bold;color: #555;"></i></span>';

    var $container = $(this).find(options.container).empty().append(html).data('title', options.title).data('tips', options.tips);
    $container.on('dragenter', function (e) {
      // 当鼠标第一次经过目标元素，且有拖动发生时触发。此事件的监听者应指明在这个位置上是否允许drop，或者监听者不执行任何操作，那么drop默认是不允许的
      e.stopPropagation();
      e.preventDefault();
      this.style.border = options.border;
      this.style.boxShadow = options.boxShadow;
      $(this).find('.tips').empty().append( $(this).data('tips') );
    }).on('dragover', (function () {
      // 当鼠标经过一个元素时，且有拖动发生时触发
      var index = 0;
      return function (e) {
        e.stopPropagation();
        e.preventDefault();
        var color = options.colors[index];
        index = (index + 1) % options.colors.length;

        this.style.border = "1px solid " + color;
        this.style.boxShadow = "0px 0px 20px " + color;
        $(this).find('.tips').empty().append( $(this).data('tips') );
      }
    })()).on('dragleave', function (e) {
      // 当鼠标离开一个元素，且有拖动在发生时触发。
      e.stopPropagation();
      e.preventDefault();

      leave.call(this);
    }).on('drop', function (e) {
      // 在drag操作的最后发生drop时，在元素上触发此事件。监听者应该负责检索拖动的数据，并插入drop的位置。
      e.stopPropagation();
      e.preventDefault();
      leave.call(this);
      var dt = e.originalEvent.dataTransfer;
      $(this).siblings('input:file')[0].files = dt.files;
    });

    (function() {
      var timeId = 0;
      this.on('mouseenter', function() {
        if( ! $(this).find('.full-img').length ) {
          return;
        }
        timeId = setTimeout((function() {
          var html = '<div class="pre-view" style="position: absolute;top: 0;right: 0;left: 0;bottom: 0;background-color: #000;opacity: .3;"><i class="sui-icon icon-touch-magnifier"></i></div>';
          $(this).append(html);
          $(this).find('.pre-view').on('click', function(e) {
            var $clone = $(this).siblings('.full-img').find('img');

            layer.open({type: 1,
              title: false,
              closeBtn: true,
              shift: 0,
              area: 'auto',
              maxWidth: 700,
              skin: 'layui-layer-molv',
              shadeClose: false,
              content: $clone.prop('outerHTML')
            });
            e.stopImmediatePropagation();
            e.preventDefault();
            e.stopPropagation();
          });
        }).bind(this), 1000);
      }).on('mouseleave', function() {
        clearTimeout(timeId);
        $(this).find('.pre-view').remove();
      }).on('click', function() {
        clearTimeout(timeId);
      });
    }).call($container);

    var $file = $(this).find('input:file');

    $file.on('change', function (e) {
      var self = this;
      if (this.files.length) {
        var file = this.files[0];
        // 文件最大大小
        var maxSize = $(this).data('size') || options.fileSize;

        if ( /(jpg|jpeg|gif|png|bmp)/.test(file.type) && maxSize > (file.size / 1024) ) {
          var reader = new FileReader();
          reader.onload = function () {
            var imgData = 'data:img/jpg;base64,' + base64_encode(this.result);
            var img = new Image();
            img.src = imgData;
            var imgid = 'tempimg' + ~~(Math.random() * 10000);
            img.id = imgid;
            img.style.visibility = 'hidden';
            document.body.insertAdjacentHTML('beforeEnd', img.outerHTML);
            var $img = $('#' + imgid);
            var maxWidth = $(self).data('maxwidth');
            var maxHeight = $(self).data('maxheight');
            $img.on('load', function() {
              if( maxWidth < this.width ) {
                clearFile.call(self, options);
                options.error('宽度不能大于' + maxWidth);
              } else if(maxHeight < this.height) {
                clearFile.call(self, options);
                options.error('高度不能大于' + maxHeight);
              }
              $(this).remove();
            });
            //$img.css('visibility', 'hidden');
            var $filecontent = $(self).siblings('.file-container').find('.filecontent');
            $filecontent.find('img').attr('src', imgData).end().addClass('full-img');
          };
          reader.readAsBinaryString(file);
        } else {
          clearFile.call(this, options);
          if( ! /(jpg|jpeg|gif|png|bmp)/.test(file.type) ) {
            var msg = '文件类型错误';
          } else if( ! (maxSize > (file.size / 1024)) ) {
            msg = '你上传的文件过大，换一张吧';
          }
          options.error(msg);
        }
      } else {
        clearFile.call(this, options);
      }

    });

    // 右上角取消按钮
    $(this).find('.close-btn').on('click', function(e) {
      clearFile.call($file[0], options);
      e.stopPropagation();
      //e.stopImmediatePropagation();
      e.preventDefault();
    });

    //$container.find('.filecontent').css('display', 'none');
  }

  function clearFile(options) {
    this.value = '';
    $(this).siblings('.file-container').find('.filecontent.full-img').removeClass('full-img').find('img').attr('src', '');
    $(this).trigger('update');
  }

  function leave() {
    console.log('还原');
    this.style.border = null;
    this.style.boxShadow = null;
    this.style.color = null;
    $(this).find('.tips').empty().append( $(this).data('title') );
  }

  function errorMsg(msg) {
    // TODO 错误处理
  }

  function base64_encode(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var i = 0, len = str.length, string = '';

    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
        string += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
        string += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      string += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return string
  }
})();