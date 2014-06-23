var jsdom = require('jsdom');
var request = require('request');

request('http://localhost:4000/index.html', function(err, resp, body) {
	var clickEvent;
	var clearMe;
	var document;
	//log the html received from request
	console.log('request -> body: \n%s',body);
	
	if (err) process.exit(1);

	document = jsdom.jsdom(body, jsdom.level(3), {
		features: {
			FetchExternalResources: ['script'],
			ProcessExternalResources: ['script']
		}
	}).parentWindow.document;
	
	//I am going to dispatch this click event 
	//on the div#clickMe in jsdomtest.html
	//which in turn will make a $.get call and 
	//invoke function `boop` given below.
	//boop will keep dispatching clicks till it has
	//8 elements in the dom
	//once there are 8 div.item in the dom, it'll
	//log them to server console, empty the dom and exit
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
			process.exit(0);
		}
	}

	clearMe = setInterval(boop, 100, document);
});
