require.config({
  baseUrl: '/templates/views/resource/',
  paths: {
    'core': 'merchant/js/lib/core',
    'base_info': 'merchant/js/shop/base_info'
  }
});
require(['base_info'],function (baseInfo) {
  $('#account_btn').on('click',function () {
    var change_num = $('[name="change_num"]').val();

    if(change_num >= 3){
      $('.first_remind').addClass('hide');
      $('.three_remind').removeClass('hide');
    }else if(change_num == 2){
      $('.sure_remind').removeClass('hide');
    }
    $('#change_settlement').modal('show');
  });
  
  $(document).on('click','#editSeller_btn',function () {
    var change_num = $('[name="change_num"]').val();
    if(change_num < 3){
      baseInfo.checkSeller();
    }
  });
  $(document).on('click','#check_btn',function () {
    baseInfo.saveSeller();
  })
})


