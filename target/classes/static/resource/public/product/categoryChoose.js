(function () {
  /*eslint-disable no-multi-str*/
  var template = '\
  <span class="sui-dropdown dropdown-bordered">\
    <span class="dropdown-inner">\
      <input type="hidden" id="${id}" value="0">\
      <input type="hidden" id="test" value="0">\
      <a role="button" data-toggle="dropdown" href="javascript:void(0)" class="dropdown-toggle" data="1">\
        <i class="caret"></i><span>${first}</span>\
      </a>\
      <ul role="menu" aria-labelledby="drop1" class="sui-dropdown-menu">\
        <li role="presentation">\
          <a role="menuitem" tabindex="-1" href="javascript:;" value="0">${first}</a>\
        </l\
        i>\
        ${menus}\
      </ul>\
    </span>\
  </span>\
  ';

  var defaultOptions = {
    url: '/merchant/categories',
    first: '请选择',
    defaultId: 0,
    changed: function () {},
  };

  $.fn.extend({
    category: function (options) {
      options = $.extend(defaultOptions, options);

      return this.each(function () {
        var $self = $(this);
        $.ajax({
          url: options.url,
          dataType: 'json',
        }).done(function (rsp) {
          console.log(rsp);
          if (rsp.status === 'success') {
            appendTo($self, options, rsp.result.children);
            if ($self.find('[role=menuitem][value=' + options.defaultId + ']').size()) {
              $self.find('[role=menuitem][value=' + options.defaultId + ']').click();
            } else {
              $self.find('[role=menuitem][value=0]').click();
            }
          }
        });
      });
    },
  });

  function appendTo ($ele, options, data) {
    var html = template;

    var menus = getMenuHtml(data);
    var id = 'category-' + $.now();
    html = html.replace('${id}', id)
      .replace(/\$\{first}/g, options.first)
      .replace('${menus}', menus);

    $ele.append(html);
    $('#' + id).on('change', options.changed);
  }

  function getMenuHtml (data) {
    var menus = '';
    $.each(data, function (k, v) {
      var optionsTemp = '\
        <li role="presentation">\
          <a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${value}" data-cateid="${cateId}">${name}</a>\
        </li>\
      ';

      if ($.isArray(v.children) && v.children.length) {
        optionsTemp = '\
        <li role="presentation" class="dropdown-submenu">\
          <a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${value}" data-cateid="${cateId}" data-cate_code="${cateCode}">\
            <i class="sui-icon icon-angle-right pull-right"></i>${name}\
          </a>\
          <ul class="sui-dropdown-menu">\
          ${submenu}\
          </ul>\
        </li>\
        ';

        var subMenu = getMenuHtml(v.children);
        optionsTemp = optionsTemp.replace('${submenu}', subMenu).replace('${cateId}', v.cateId).replace('${cateCode}',v.cateCode);
      }
      menus += optionsTemp.replace('${value}', v.cateCode).replace('${name}', v.cateName).replace('${cateId}', v.cateId).replace('${cateCode}',v.cateCode);
    });

    return menus;
  }
  /**
   * 。类目相关
   */
  $(document).on('click', '.sui-dropdown-menu a', function () {
    var $target = $(this),
      $li = $target.parent(),
      $container = $target.parents('.sui-dropdown, .sui-dropup'),
      $menu = $container.find("[role='menu']")
    if ($li.is('.disabled, :disabled')) {return}
    if ($container.is('.disabled, :disabled')) {return}
    $container.find('input').val($target.attr('value') || '').trigger('change')
    $container.find('input').data("cate_code",$target.attr('data-cate_code') || '').trigger('change')
    $container.find('[data-toggle=dropdown] span').html($target.text())
    $menu.find('.active').removeClass('active')
    $li.addClass('active')
    $li.parents('[role=presentation]').addClass('active')
  });
})();
