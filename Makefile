.PHONY:

check:
	jshint lib/requirejs-cloak.js --config jshint.json

test: .PHONY
	rm -rf tmp test/output/app.js && bundle exec rakep build && clear && node test/output/app.js
