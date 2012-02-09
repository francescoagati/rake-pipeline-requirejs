module Rake::Pipeline::RequireJS
  class DefineFilter < Rake::Pipeline::Filter
    def generate_output(inputs, output)
      inputs.each do |input|
        code = input.read

        output.write <<-JS
define(function() {
  #{code.gsub(/\n/, "\n  ")}
});
        JS
      end
    end
  end
end
