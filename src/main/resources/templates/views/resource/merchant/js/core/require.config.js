require.config({
  'baseUrl': (location.origin || location.protocol + '//' + location.hostname + (location.port === 80 ? '' : ':' + location.port)) + '/templates/views/resource/merchant/js',
  'paths': {
    'core': 'lib/core',
    'vue': '/templates/views/resource/public/vue',
    'lodash': '/templates/views/resource/public/lodash.min',
    'productdetail': 'product/productdetail',
    'productconfig': '/templates/views/resource/public/product/product',
    'categoryChoose': '/templates/views/resource/public/product/categoryChoose',
    'product': 'product/product',
    'productedit': 'product/productedit',
    'pubmig': 'productimg/pubimg',
    'recommendBusiness': 'goodsdistribute/recommend_business',
  },
  'shim': {
  },
});
