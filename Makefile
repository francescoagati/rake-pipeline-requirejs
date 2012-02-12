REQ_JS_PATH        = "lib/rake-pipeline/requirejs"
LOCAL_LIB_PATH     = "$(REQ_JS_PATH)/context_filter/requirejs-local.js"
JSHINT_CONFIG_PATH = "jshint.json"

lint:
	jshint $(LOCAL_LIB_PATH) --config $(JSHINT_CONFIG_PATH)

test: .PHONY
	cd test \
	  && rm -rf tmp output/* \
	  && bundle exec rakep build \
	  && node output/app.js

.PHONY:
