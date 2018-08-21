require(['common'], function() {
  $('.preview-img').on('click', function() {
    var p = $(this).clone();
    p.removeAttr('style');
    layer.open({
      type: 1,
      title: false,
      closeBtn: true,
      area: [$(this).width(), $(this).height()],
      content: p.prop('outerHTML')
    });
  });
});