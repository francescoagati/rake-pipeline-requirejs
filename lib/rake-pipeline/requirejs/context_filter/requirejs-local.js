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




/*
 * return the keys of an object.
 * compatible with explorer 8
 * based on http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
 */  
var keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
 
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
 
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
 
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }
 
        return result;
    };
})();

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
          , hasFilledExports = keys(exports).length;

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
      var actual = newAliases[alias];
      aliases[alias] = actual;
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
