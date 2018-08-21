// noinspection JSUnusedLocalSymbols
define(['core'], function(core) {
  let utils = {};

  // noinspection JSCommentMatchesSignature
  /**
   *
   * @param url
   * @param params
   * @param type 'post" or 'get" or "json"
   * @param async ajax同步还是异步
   * @param callback 回调函数
   */
  utils.doGetOrPostOrJson = function(url, params, type, async, callback, failCallback = alertException) {
    let obj = {};
    obj.url = url;
    obj.requestParams = params;
    obj.isPost = type;

    // noinspection AmdModulesDependencies
    $.ajax({
      url: '/merchant/common/doGetOrPost',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(obj),
      async: async,
      success: function(data) {
        callback(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        failCallback(XMLHttpRequest, textStatus, errorThrown);
      },
    });
  };

  utils.ajax_ = function(url, params, type, async, callback, failCallback = alertException) {
    // noinspection AmdModulesDependencies
    $.ajax({
      url: url,
      data: params,
      type: type.toUpperCase(),
      async: async,
      success: function(data) {
        callback(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        failCallback(XMLHttpRequest, textStatus, errorThrown);
      },
    });
  };

  // 如果想使用该方法，html必须符合一定的格式 by ztq
  utils.showLadderData = function($div, data) {
    let length = data.length;
    for (let i = 0; i < length; i++) {
      let $parent = $div.find('span').eq(i).find('input');
      $parent.eq(0).val(data[i].leftValue);
      $parent.eq(1).val(data[i].rightValue);
      if (i !== length - 1) {
        $div.find('span').eq(0).find('input[name=_add]').trigger('click');
      }
    }
  };

  // 如果想使用该方法，html必须符合一定的格式 by ztq
  utils.showLadderData_select = function($div, data) {
    let length = data.length;
    for (let i = 0; i < length; i++) {
      let $parent = $div.find('span').eq(i);
      let $p_select = $parent.find('select');
      let $p_input = $parent.find('input');
      $p_select.eq(0).find('option[value="' + data[i].leftValue + '"]').attr('selected', true);  //val(data[i].leftValue)
      $p_input.eq(0).val(data[i].rightValue);
      if (i !== length - 1) {
        $div.find('span').eq(0).find('input[name=_add]').trigger('click');
      }
    }
  };

  // 设置cookie
  utils.setCookie = function(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
  };

  // 获取cookie
  utils.getCookie = function(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      // noinspection EqualityComparisonWithCoercionJS
      while (c.charAt(0) == ' ') c = c.substring(1);
      // noinspection EqualityComparisonWithCoercionJS
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return '';
  };

  // 清除cookie
  utils.clearCookie = function(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = utils.getCookie(name);
    if (cval != null) { // noinspection JSUnresolvedFunction
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
  };

  // noinspection SpellCheckingInspection
  utils.getattr = function(obj, attr) {
    return obj[attr.toString()];
  };

  /**
   * 检验输入的value是否符合金额格式，返回true or false
   * @param value
   * @return {boolean}
   */
  utils.is_money = function(value) {
    let rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0)$)|(^[0-9]\.[0-9]([0-9])?$)/;
    return rule.test(value.toString());
  };

  /**
   * 检测输入框的内容是否符合金额格式，如果不符合，则删除该内容
   * @param $this
   */
  utils.check_input_is_money = function($this) {
    let value = $this.val();
    if (value) {
      if (!utils.is_money(value)) {
        layer.msg('请输入符合金钱格式的数字');
        $this.val('');
      }
    }
  };

  /**
   * 检验输入的value是否符合折扣数据格式，返回true or false
   * @param value
   * @return {boolean}
   */
  utils.is_discount = function(value) {
    let rule = /^(0\.[1-9]|[1-9](\.[0-9])?)$/;
    return rule.test(value.toString());
  };

  /**
   * 检测输入框的内容是否符合折扣格式，如果不符合，则删除该内容
   * @param $this
   */
  utils.check_input_is_discount = function($this) {
    let value = $this.val();
    if (value) {
      if (!utils.is_discount(value)) {
        layer.msg('请输入符合折扣格式的数字，范围：0.1~9.9');
        $this.val('');
      }
    }
  };

  /**
   * 检验输入的value是否是正整数，返回true or false
   * @param value
   * @return {boolean}
   */
  utils.is_positive_integer = function(value) {
    let rule = /^[1-9]\d*$/;
    return rule.test(value.toString());
  };

  /**
   * 检测输入框的内容是否是正整数，如果不符合，则删除该内容
   * @param $this
   */
  utils.check_input_is_positive_integer = function($this) {
    let value = $this.val();
    if (value) {
      if (!/^[1-9]\d*$/.test(value)) {
        layer.msg('请输入正整数');
        $this.val('');
      }
    }
  };

  // noinspection JSCommentMatchesSignature
  /**
   * 检测输入框的内容是否符合正则表达式，如果不符合，则删除该内容
   * @param $this
   */
  utils.check_input_by_regex = function($this, regex) {
    let value = $this.val();
    if (value) {
      if (!regex.test(value)) {
        layer.msg('请输入符合正则表达式的数字');
        $this.val('');
      }
    }
  };

  utils.compare = function(v1, v2) {
    if (v1 < v2) return -1;
    else if (v1 > v2) return 1;
    else return 0;
  };

  utils.objToMap = function(obj) {
    let map = new Map();
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k]);
    }
    return map;
  };

  utils.mapToObj = function(map) {
    let obj = Object.create(null);
    for (let [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  };

  /**
   * 让js的obj变成类似与map一般的存在方便遍历
   * @param obj
   */
  utils.objectEntries = function* (obj) {
    // noinspection JSCheckFunctionSignatures
    let propKeys = Object.keys(obj);

    for (let propKey of propKeys) {
      yield [propKey, obj[propKey]];
    }
  };

  /**
   * 根据参数加载页面，执行后续操作
   * @param map key为jq的选择器，value为加载的模块页面资源url
   * @param fn 需要加载完全部页面后才能执行的操作
   */
  utils.loadPageAsync = function(map, fn) {
    let promises = [];

    for (let [$position, url] of map) {
      let promise = undefined;
      if ($position.size() === 1) {
        promise = fetch(url).
          then(rep => {
            if (rep.ok) {
              return rep.text();
            } else {
              throw error;
            }
          }).
          then(data => {
            console.log('start to load page:' + url);
            $position.append(data);
          });
      }

      if (promise)
        promises.push(promise);
    }

    if (promises.length !== 0)
      Promise.all(promises).then(() => {
        console.log('prove exist much_select_goods:' + $('#much_select_goods').size());
        fn();
      });
  };

  // 内置函数，置于底部

  let alertException = function() {
    alert('异常发送');
  };

  return utils;
});
