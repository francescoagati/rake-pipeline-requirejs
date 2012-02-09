module Rake::Pipeline::RequireJS
  class ContextFilter < Rake::Pipeline::Filter
    def initialize(module_id_generator, *args, &block)
      super *args, &block
      @module_id_generator = module_id_generator
    end

    def generate_output(inputs, output)
      local_lib_code = File.read(File.dirname(__FILE__) + '/context_filter/requirejs-local.js')

      output.write <<-JS
(function(receiver) {
  var local = {};

  (function(exports) {
    #{local_lib_code.gsub(/\n/, "\n    ")}
  })(local);

  var context = new local.Context(receiver)
    , require = context.makeRequireFunction();
      JS
    
      inputs.each do |input|
        module_id = @module_id_generator.call(input)
        code = input.read

        output.write <<-JS
  (function() {
    var define = context.makeDefineFunction('#{module_id}');
    #{code.gsub(/\n/, "\n    ")}
  })();
        JS
      end

      output.write <<-JS

  require(['main'], function(main) {
    main();
  });
})(this);
      JS
    end
  end
end
