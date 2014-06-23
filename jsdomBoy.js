var jsdom = require('jsdom');
var request = require('request');

request('http://localhost:4000/jsdomtest.html', function(err, resp, body) {
	var clickEvent;
	var clearMe;
	var document;

	if (err) process.exit(1);

	document = jsdom.jsdom(body, jsdom.level(3), {
		features: {
			FetchExternalResources: ['script'],
			ProcessExternalResources: ['script'],
			MutationEvents: '2.0'
		}
	}).parentWindow.document;

	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent('click', true, true);

	function boop(document) {
		var els = document.querySelectorAll('.item');
		for (var i = 0; i < els.length; i++) {
			console.log("------------" + (i + 1) + "-----------");
			console.log(els[i].outerHTML);
			els[i].parentNode.removeChild(els[i]);
		}
		if (document.querySelectorAll('.item').length === 0) document.querySelector('#clickMe').dispatchEvent(clickEvent);
		if (document.querySelectorAll('.item').length >= 8) clearInterval(clearMe);
	}

	clearMe = setInterval(boop, 100, document);
});
