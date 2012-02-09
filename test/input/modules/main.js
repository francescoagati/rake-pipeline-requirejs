require.config({
  paths: {
    'vendor/jquery': 'vendor/jquery-1.2.3'
  }
});

define(['underscore', 'backbone', 'jquery', 'meta'], function(underscore, backbone, jquery, meta) {
  return function() {
    console.log('main');

    // define(function() { })
    console.log('  .. Underscore =', underscore);

    // define([<deps>, 'exports'], function(exports) { })
    console.log('  .. Backbone =', backbone);

    // define([<alias>], function() { })
    console.log('  .. jQuery =', jquery);

    // define([<deps>])
    console.log('  .. meta =', meta);
  };
});
