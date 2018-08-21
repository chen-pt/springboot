(function () {
  var css = [
    '.lowie-tip {' +
      'height: 24px;' +
      'line-height: 1.8;' +
      'font-weight: normal;' +
      'text-align: center;' +
      'border-bottom: 1px solid #fce4b5;' +
      'background-color: #FFF4DE;' +
      'color: #e27839;' +
      'position: relative;' +
      'font-size: 16px;' +
      'text-shadow: 0 0 1px #efefef;' +
      'padding: 10px 0;' +
    '}',
    '.tip-icon {' +
      'border-radius: 50%;' +
      'border: 1px solid;' +
      'background-color: #56ABE4;' +
      'color: #fff;' +
      'width: 25px;' +
      'display: inline-block;' +
      'line-height: 25px;' +
      'margin-right: 5px;' +
    '}',
    '.lowie-tip a {' +
      'color: #08c;' +
      'text-decoration: none;' +
    '}'
  ];

  var lowieTipHtml = '<span class="tip-icon">!</span>您正在使用的浏览器可能无法得到最佳浏览、操作效果、建议使用火狐、Chrome浏览器，获取更好、更佳的体验！<a href="http://www.firefox.com.cn/download/">立即下载</a>';

  function showie() {
    if (document.readyState == 'complete') {
      try {
        var b = navigator.userAgent.toLowerCase();
        var version = b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1];
        if (version < 9) {
          var styleEle = document.createElement('style');
          styleEle.setAttribute("type", "text/css");
          if (styleEle.styleSheet) {
            styleEle.styleSheet.cssText = css.join('\n');
          } else {
            var textNode = document.createTextNode(css.join('\n'));
            styleEle.appendChild(textNode);
          }
          document.getElementsByTagName('head')[0].appendChild(styleEle);
          var tipEle = document.createElement('div');
          tipEle.id = 'lowie-tip';
          tipEle.className = 'lowie-tip';
          tipEle.innerHTML = lowieTipHtml;
          document.body.insertBefore(tipEle, document.body.childNodes[0]);
        }
      }
      catch (e) {
      }
    } else {
      setTimeout(showie, 233);
    }
  }

  showie();
})();