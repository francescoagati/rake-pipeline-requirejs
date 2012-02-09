require.config({
  paths: {
    'vendor/jquery': 'vendor/jquery-1.2.3'
  }
});

define(['underscore', 'backbone'], function(underscore, backbone) {
  return function() {
    console.log('main');
    console.log('  .. Underscore =', underscore);
    console.log('  .. Backbone =', backbone);
  };
});
