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

function Context(receiver) {
  this.receiver = receiver;
  this.modules = {};
  this.definitions = {};
  this.aliases = {};
}

Context.prototype = {
  makeRequireFunction: function() {
    var self = this
      , require = self.require
      , boundRequire = function() { require.apply(self, arguments); }
      , setConfig = self.setConfig
      , boundSetConfig = function() { setConfig.apply(self, arguments); };

    boundRequire.config = boundSetConfig;

    return boundRequire;
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
    var receiver = this.receiver
      , args = [];

    for(var i in deps) {
      var moduleId = deps[i]
        , aliases = this.aliases
        , registeredModuleId = aliases[moduleId] || moduleId
        , module = (moduleId == 'exports' ? exports : this.load(registeredModuleId));

      args[i] = module;
    }

    // TODO: optimize by not creating args if !callback

    if (callback)
      callback.apply(receiver, args);
  }
, define: function(deps, callback) {
    if (typeof deps == 'function') {
      callback = deps;
      deps = [];
    }

    var module
      , onRequire
      , exports;

    if (callback) {
      var receiver = this.receiver;

      exports = {};
      onRequire = function() {
        var args = arguments;

        module = callback.apply(receiver, args);

        var hasReturnedModule = (typeof module != 'undefined')
          , hasFilledExports = Object.keys(exports).length;

        if (!hasReturnedModule && hasFilledExports)
          module = exports;
      };
    }

    this.require(deps, onRequire, exports);

    return module;
  }
, setConfig: function(config) {
    var aliases = this.aliases
      , newAliases = config.paths;

    for(var alias in newAliases) {
      var real = newAliases[alias];
      aliases[alias] = real;
    }
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
