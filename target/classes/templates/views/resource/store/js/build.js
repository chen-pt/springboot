exports.appdir = '.';
exports.viewdir = '../../../app/ma/views/';
exports.baseUrl = 'app/';

exports.module  = [{ name:'analysis_index',    paths:{
        'core':'../lovejs/core',//基本插件
        'tools':'../lovejs/tools',//基本插件
        'ana': 'service/ana',
        'out':'service/out_list',
        'model':'service/model',
        'orderdata':'service/orderdata',
        'success':'service/success'
    }

},{ name:'capital_index',    paths:{
        'core':'../lovejs/core',
        'capital': 'service/capital'
    }

},{ name:'clerk_index',    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'clerk': 'service/clerk'

    }

},{ name:'coupon_index',    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'coupons': 'service/coupon1'
    }

},{ name:'helpful_index',  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'helpful': 'service/helpful'
  }

},{ name:'login_index',    paths:{
        'core':'../lovejs/core'
    }

},{ name:'member_index',  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'member': 'service/member',
    'clerk' : 'service/clerk'
  }

},{ name:'order_index',    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'order': 'service/order',
        'create': 'service/createorder',
        'refund': 'service/refund'
    }

},{ name:'permission_index',  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'permission': 'service/permission'
  }

},{ name:'price_index',    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'price': 'service/price'
    }

},{ name:'print_index',    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'print': 'service/print'
    }

},{ name:'promotion_index',  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'promotion': 'service/promotion'
  }

}];
