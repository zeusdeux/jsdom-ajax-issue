var jsdom = require('jsdom');
var request = require('request');

request('http://localhost:4000/jsdomtest.html', function(err, resp, body) {
	var clickEvent;
	var clearMe;
	var document;
	console.log('request -> body: \n%s',body);
	if (err) process.exit(1);

	document = jsdom.jsdom(body, jsdom.level(3), {
		features: {
			FetchExternalResources: ['script', 'link'],
			ProcessExternalResources: ['script', 'link']
		}
	}).parentWindow.document;

	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent('click', true, true);

	function boop(document) {
		var elements = document.querySelectorAll('.item');
		if (elements.length < 8) document.querySelector('#clickMe').dispatchEvent(clickEvent);
		else {
			clearInterval(clearMe);
			for (var i = 0; i < elements.length; i++) {
				console.log("------------ element " + (i + 1) + " -----------");
				console.log(elements[i].outerHTML);
				elements[i].parentNode.removeChild(elements[i]);
			}
		}
	}

	clearMe = setInterval(boop, 100, document);
});
