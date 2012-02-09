require.config({
  paths: {
    'vendor/jquery': 'vendor/jquery-1.2.3'
  }
});

define(['underscore', 'backbone', 'jquery'], function(underscore, backbone, jquery) {
  return function() {
    console.log('main');

    // define(function() { })
    console.log('  .. Underscore =', underscore);

    // define([<deps>, 'exports'], function(exports) { })
    console.log('  .. Backbone =', backbone);

    // define([<alias>], function() { })
    console.log('  .. jQuery =', jquery);
  };
});
