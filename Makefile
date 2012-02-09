REQ_JS_PATH        = "lib/rake-pipeline/requirejs"
CLOAK_JS_PATH      = "$(REQ_JS_PATH)/context_filter/requirejs-cloak.js"
JSHINT_CONFIG_PATH = "jshint.json"

check:
	jshint $(CLOAK_JS_PATH) --config $(JSHINT_CONFIG_PATH)

test: .PHONY
	rm -rf tmp test/output/app.js && bundle exec rakep build && clear && node test/output/app.js

.PHONY:
