/*
 *  var context = new Context
 *    , require = context.makeRequireFunction()
 *    , defineFoo = context.makeDefineFunction('foo')
 *    , defineBar = context.makeDefineFunction('bar')
 *    , define;
 *
 *  (function(define) {
 *    define(function() {
 *      return 'foo';
 *    });
 *  )(defineFoo);
 *
 *  (function(define) {
 *    define(['exports'], function(exports) {
 *      exports.bar = true;
 *    });
 *  })(defineBar);
 *
 *  require(['foo', 'bar'], function(foo, bar) {
 *    console.log('foo =', foo, 'bar =', bar);
 *  });
 */

function Context() {
  this.modules = {};
  this.definitions = {};
}

Context.prototype = {
  makeRequireFunction: function() {
    var self = this
      , require = self.require;

    return function() {
      require.apply(self, arguments);
    };
  }
, makeDefineFunction: function(moduleId) {
    var self = this
      , define = self.define
      , definitions = self.definitions
      , modules = self.modules;

    return function() {
      var args = arguments
        , definition = function() {
            var module = define.apply(self, args);
            return module;
          };

      definitions[moduleId] = definition;
    };
  }
, require: function(deps, callback, exports) {
    var context = {}  // TODO: context of callbacks for require() and define()
      , args = [];

    for(var i in deps) {
      var moduleId = deps[i]
        , module = (moduleId == 'exports' ? exports : this.load(moduleId));

      args[i] = module;
    }

    callback.apply(context, args);
  }
, define: function(deps, callback) {
    if (typeof deps == 'function') {
      callback = deps;
      deps = [];
    }

    var context = {}  // TODO: context of callbacks for require() and define()
      , module
      , exports = {}
      , onRequire = function() {
          var args = arguments;

          module = callback.apply(context, args);

          var hasReturnedModule = (typeof module != 'undefined')
            , hasFilledExports = Object.keys(exports).length;

          if (!hasReturnedModule && hasFilledExports)
            module = exports;
        }

    this.require(deps, onRequire, exports);

    return module;
  }
, load: function(moduleId) {
    var module = this.modules[moduleId];

    if (module)
      return module;

    var definition = this.definitions[moduleId];

    if (!definition)
      throw new Error('no definition for module \'' + moduleId + '\'');

    module = this.modules[moduleId] = definition();

    return module;
  }
};

exports.Context = Context;
