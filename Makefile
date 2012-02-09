REQ_JS_PATH        = "lib/rake-pipeline/requirejs"
CLOAK_JS_PATH      = "$(REQ_JS_PATH)/context_filter/requirejs-local.js"
JSHINT_CONFIG_PATH = "jshint.json"

check:
	jshint $(CLOAK_JS_PATH) --config $(JSHINT_CONFIG_PATH)

test: .PHONY
	cd test && rm -rf tmp output/* && BUNDLE_GEMFILE=../Gemfile bundle exec rakep build && node output/app.js

.PHONY:
