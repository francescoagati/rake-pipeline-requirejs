define(['underscore', 'backbone'], function(underscore, backbone) {
  return function() {
    console.log('main');
    console.log('  .. Underscore =', underscore);
    console.log('  .. Backbone =', backbone);
  };
});
