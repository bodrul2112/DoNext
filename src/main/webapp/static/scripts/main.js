

require( ["plugins/domReady", "thirdparty/jquery", "thirdparty/easing","donext/DoNext"], 
		function(domReady, jQuery, Easing, DoNext){
	
	domReady(function(){
		
		require(["thirdparty/jquery", "thirdparty/easing", "donext/DoNext"], 
				function(jQuery, Easing, DoNext) {
			
				console.log("things have loaded yo"); 
				
				var oEasing = new Easing(); // not pretty, but does the job bob.
				
				var oDoNext = new DoNext();
			
		});
		
	});

});

