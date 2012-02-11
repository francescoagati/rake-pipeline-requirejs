# Rake::Pipeline::RequireJS

[Rake::Pipeline][rake-pipeline] filters for concatenating anonymous RequireJS
modules into a single file.  Once modules are concatenated,
[RequireJS][requirejs] is not needed anymore.

Acts as an alternative to the RequireJS [Optimizer][r-js], `r.js`.

`ContextFilter` (see [Usage](#usage)) includes a replacement for RequireJS that
implements a subset of its API (see [Why not `r.js`](#why)).  Supported:

  * `define([<dep>[, <dep>]])`
  * `define([<dep>[, <dep>]], function(arg[, arg]) { })`
  * `define(function() { })`
  * `require([<dep>[, <dep>]])`
  * `require([<dep>[, <dep>]], function(arg[, arg]) { })`
  * `require(function() { })`
  * `require.config({paths: {<alias>: <actual>}})`

Where `<dep>` may be the special `'exports'` for exporting an object via the
`export` object as argument to the function, instead of returning an object.

## Usage <a name="usage"></a>

Example `Assetfile` to concatenate all anonymous modules in `js/` to
`static/app.js`:

    require 'rake-pipeline/requirejs/context_filter'

    output 'static'

    input 'js' do
      match '**/*.js' do
        filter Rake::Pipeline::RequireJS::ContextFilter do
          'app.js'
        end
      end
    end

## Why not r.js <a name="why"></a>

I couldn't use `r.js` in a certain project because it couldn't parse calls to
`require()` and `define()` in non-`.js` files, such as within `<script>` tags of
server-side views.

Besides, I don't like that it:

  * Parses module files recursively to determine which ones to concatenate in
    which order.  This feels (and has proven) error-prone.
  * Doesn't provide much control over the concatenation process.
  * Worst of all, evaluates each module definition, calling its function
    immediately at `define()` time.
    * Leads to unnecessarily defined modules since they are all pre-loaded at
      once, being concatenated in a single file.
    * Implies that dependencies must be defined in a particular order.

In contrast, Rake::Pipeline allows unlimited possibilities when concatenating.
It just needed a RequireJS replacement for concatenated modules.

[rake-pipeline]: https://github.com/livingsocial/rake-pipeline
[requirejs]: http://requirejs.org
[r-js]: http://requirejs.org/docs/optimization.html
