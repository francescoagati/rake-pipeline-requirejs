# `Rake::Pipeline::RequireJS`

[`Rake::Pipeline`][1] filters for concatenating anonymous RequireJS modules into
a single file.  Once modules are concatenated, [RequireJS][2] is not needed
anymore.

Acts as an alternative to the RequireJS [Optimizer][3], `r.js`.

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

[1]: https://github.com/livingsocial/rake-pipeline
[2]: http://requirejs.org
[3]: http://requirejs.org/docs/optimization.html

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

## Why not `r.js` <a name="why"></a>

I couldn't use it in a certain project because it couldn't parse calls to
`require()` and `define()` in non-`.js` files, like within `<script>` tags of
server-side views.
