'use strict';
require.config({
  'baseUrl': (location.origin || location.protocol + '//' + location.hostname + (location.port == 80 ? '' : ':' + location.port)) + '/templates/views/resource/busm/js',
  'paths': {
    'jquery': 'lib/jquery-2.1.4',
    'services': 'core/services',
    'common': 'core/common',
    'push': 'core/pjax',
    'doT': 'lib/doT',
    'layer': 'lib/layer',
    'drag': 'core/drag',
    'slidebar': 'core/slidebar',
    'sui': 'http://g.alicdn.com/sj/dpl/1.5.1/js/sui',
    'autoNumeric': 'lib/autoNumeric',
    'pagin': 'core/pagin',
    'auth': 'site/auth',
    'vue': '/templates/views/resource/public/vue',
    'lodash': '/templates/views/resource/public/lodash.min',
  },
  'shim': {
    'push': {
      'deps': ['jquery']
    },
    'doT': {
      'exports': 'doT'
    },
    'sui': {
      'deps': ['jquery']
    },
    'layer': {
      'deps': ['jquery']
    },
    'drag': {
      'deps': ['jquery']
    },
    'slidebar': {
      'deps': ['jquery']
    },
    'autoNumeric': {
      'deps': ['jquery']
    }
  }
});
