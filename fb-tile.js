var fbTile;

fbTile || (function() {

    fbTile = {
        configNs       : "fb-tile",
        draw           : draw,
        getFacebookPhotos: getFacebookPhotos,
        config         : undefined,
    };

    function draw() {
        

        var param = {
            limit : 20,
            offset: 0,
        };

        var isAccessFb = false;
		var expiry = new Date(parseInt(localStorage.expiryTime));
		var now = new Date();
		
		if(localStorage.accessToken){
			$.getJSON(
            "https://graph.facebook.com/me/photos/?access_token="+localStorage.accessToken,
            function(json) {}).fail(function() { 
			loginfacebook(draw);
			});
		}
		
						
		if (localStorage.accessToken && now < expiry){  
		
       getFacebookPhotos(param, function(div) {
            $("#container").append($(div));
        }).then(function() {

            param.offset += param.limit;
$("#container").imagesLoaded( function() {
            $("#container").masonry({
                itemSelector: ".item",
                columnWidth: 300,
                isFitWidth: true,
                isAnimated: true
            });
			});
        }).then(function() {
            $(window).scroll(function() {
                if ( isAccessFb == false && $(window).scrollTop() + $(window).height() >= $(document).height() ) {

                    isAccessFb = true;
                    var divs = "";

                    getFacebookPhotos(param, function(div) {
                        divs += div;
                    }).then(function() {

                        param.offset += param.limit;

                        var $divs = $(divs);
						
							$("#container").append($divs).masonry( 'appended', $divs, false );
						
						
                    }).then(function() {
                        isAccessFb = false;
                    });
                }
            });
        });
		}else{
			loginfacebook(draw);
		}
    }

    function getFacebookPhotos(param, func) {

        var self = this;
        var d = $.Deferred();
        
		var name = "";
        $.getJSON(
            "https://graph.facebook.com/me/photos/?access_token="+localStorage.accessToken,
            function(json) {

                json.data.forEach(function(val, index, array) {
					name = "";
					if(val.name){
						name = val.name;
					}
                    if ( ! val.id ) {
                        return 1;
                    }
                    var j    = 0;
                   
                    var div = '<div class="item" background = url('+'"https://graph.facebook.com/v2.4/' + val.id + '/picture?access_token='+localStorage.accessToken+'") width = 280 bottom = 10'+'><a href="https://graph.facebook.com/v2.4/' + val.id + '/picture?access_token='+localStorage.accessToken+'" title ='+name+'><img src="https://graph.facebook.com/v2.4/' + val.id + '/picture?access_token='+localStorage.accessToken+'" width = 280/><p>'+name+'</p></a>'+'</div>';
                    func(div);

                });

                d.resolve();
            }
        );

        return d;
    }
	
	

})();
