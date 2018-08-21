(function () {
  /*eslint-disable no-multi-str*/
  var template = '\
  <span class="sui-dropdown dropdown-bordered">\
    <span class="dropdown-inner">\
      <input type="hidden" name="${name}" value="0">\
      <a role="button" data-toggle="dropdown" href="javascript:void(0)" class="dropdown-toggle" id="board">\
        <i class="caret"></i><span>${first}</span>\
      </a>\
      <ul role="menu" aria-labelledby="drop1" class="sui-dropdown-menu">\
        <li role="presentation">\
          <a role="menuitem" tabindex="-1" href="#" value="0">${first}</a>\
        </li>\
        ${menus}\
      </ul>\
    </span>\
  </span>\
  ';

  var defaultOptions = {
    url: './cats',
    name: 'user_cateid',
    first: '请选择',
    defaultId: 0,
  };

  $.fn.extend({
    category: function (options) {
      options = $.extend(defaultOptions, options);

      // return this.each(function () {
        var $self = $(this);

        $.ajax({
          url: options.url,
          dataType: 'json',
        }).done(function (rsp) {
          if (rsp.ybCategoryList != null) {
            appendTo($self, options, rsp.ybCategoryList);
            $self.find('[role=menuitem][value=' + options.defaultId + ']').click();
          }
        });
      // });
    }
  });



  function appendTo ($ele, options, data) {
    var html = template;

    var menus = getMenuHtml(data);

    html = html.replace('${name}', options.name)
               .replace(/\$\{first}/g, options.first)
               .replace('${menus}', menus);

    $('#cate_box').append(html);
  }

  function getMenuHtml (data) {
    var menus = '';
    $.each(data, function (k, v) {
      var optionsTemp = '\
        <li role="presentation">\
          <a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${value}">${name}</a>\
        </li>\
      ';

      if ($.isArray(v.subYbCategory) && v.subYbCategory.length) {
        optionsTemp = '\
        <li role="presentation" class="dropdown-submenu">\
          <a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${value}">\
            <i class="sui-icon icon-angle-right pull-right"></i>${name}\
          </a>\
          <ul class="sui-dropdown-menu">\
          ${submenu}\
          </ul>\
        </li>\
        ';

        var subMenu = getMenuHtml(v.subYbCategory);
        optionsTemp = optionsTemp.replace('${submenu}', subMenu);
      }
      menus += optionsTemp.replace('${value}', v.cate_code).replace('${name}', v.cate_name);
    });

    return menus;
  }

  $(document).on('click', '.sui-dropdown-menu a', function () {
    var $target = $(this),
      $li = $target.parent(),
      $container = $target.parents('.sui-dropdown, .sui-dropup'),
      $menu = $container.find("[role='menu']")
    if ($li.is('.disabled, :disabled')) {return}
    if ($container.is('.disabled, :disabled')) {return}
    $container.find('input').val($target.attr('value') || '').trigger('change')
    $container.find('[data-toggle=dropdown] span').html($target.text())
    $menu.find('.active').removeClass('active')
    $li.addClass('active')
    $li.parents('[role=presentation]').addClass('active')
  });

  $(document).on('click', '#board', function () {
    $(this).parent().parent().removeClass("sui-dropdown dropdown-bordered").addClass("sui-dropdown dropdown-bordered open");
  });
})();
