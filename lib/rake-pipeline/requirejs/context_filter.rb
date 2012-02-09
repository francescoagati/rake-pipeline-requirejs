module Rake::Pipeline::RequireJS
  class ContextFilter < Rake::Pipeline::Filter
    def initialize(module_id_generator, *args, &block)
      super *args, &block
      @module_id_generator = module_id_generator
    end

    def generate_output(inputs, output)
      cloak_lib_code = File.read(File.dirname(__FILE__) + '/context_filter/requirejs-cloak.js')

      output.write <<-JS
(function() {
  var cloak = {};

  (function(exports) {
    #{cloak_lib_code.gsub(/\n/, "\n    ")}
  })(cloak);

  var cloakContext = new cloak.Context
    , require = cloakContext.makeRequireFunction();
      JS
    
      inputs.each do |input|
        module_id = @module_id_generator.call(input)
        code = input.read

        output.write <<-JS
  (function() {
    var define = cloakContext.makeDefineFunction('#{module_id}');
    #{code.gsub(/\n/, "\n    ")}
  })();
        JS
      end

      output.write <<-JS

  require(['main'], function(main) {
    main();
  });
})();
      JS
    end
  end
end
