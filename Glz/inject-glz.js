var Glz2YT=function(){
    var call=function(){

    };


        var openVideo = function(e,$this,videoId){
            // Store the query string variables and values
            // Uses "jQuery Query Parser" plugin, to allow for various URL formats (could have extra parameters)
            // Prevent opening of external page
            e.preventDefault();

            // Variables for iFrame code. Width and height from data attributes, else use default.
            var vidWidth = 560; // default
            var vidHeight = 315; // default
            if ( $this.attr('data-width') ) { vidWidth = parseInt($(this).attr('data-width')); }
            if ( $this.attr('data-height') ) { vidHeight =  parseInt($(this).attr('data-height')); }
            var iFrameCode = '<iframe width="' + vidWidth + '" height="'+ vidHeight +'" scrolling="no" allowtransparency="true" allowfullscreen="true" src="http://www.youtube.com/embed/'+  videoId +'?rel=0&wmode=transparent&showinfo=0" frameborder="0"></iframe>';

            var w=$(window).width();
            var h=$(window).height();

            var popup=$("#moshePopup");
            if(popup.length == 0) {
                $(document).find("body").append("<div id='fade'/><div id='moshePopup'/>");
                popup=$("#moshePopup").css({
                    position:'fixed',
                    width:vidWidth,
                    left:(w-vidWidth)/2,
                    top:(h-vidHeight)/2,
                    zIndex:2000
                });
                $("#fade").css({
                    position:'fixed',
                    top:0,
                    left:0,
                    width:w,
                    height:h,
                    background:'black',
                    opacity:0.3,
                    zIndex:100
                }).click(function(e){
                    $("#fade").hide();
                    $("#moshePopup").html("").hide();

                });

            }

            // Replace Modal HTML with iFrame Embed
            $("#fade").show();
            popup.html(iFrameCode).show();

        };



    var YTapi = {
        API_KEY: 'AIzaSyArVXGAq0UgZ3RZv7Lkl4ott7WT6X53fVA',
        searchURL:'https://www.googleapis.com/youtube/v3/search?order=rating&part=snippet&maxResults=1&q='
    };


    function getImageUrl(searchTerm, callback, errorCallback) {
        // Google image search - 100 searches per day.
        // https://developers.google.com/image-search/
        var searchUrl =YTapi.searchURL + encodeURIComponent(searchTerm)+ '&key=' + YTapi.API_KEY;

        $.get(searchUrl,{},function(data){
            if(data && data.items && data.items.length > 0)
            {
                callback(data.items[0]);
            }
            else{
                errorCallback("not found");
            }
        },"json");



    };
    var loaded=function(e){
        //home page
        $(".hp_top5 .hp_top5_line_en").each(function(e,i){
            var elem = $(this);

            getImageUrl(elem.text(),function(data){
                elem.attr("videoId",data.id.videoId).css("cursor","hand");
                elem.html("<a target='blank' href='https://www.youtube.com/watch?v=" + data.id.videoId +"'>"+elem.html()+"</a>");
                elem.find("a").on('click',function(e){
                    openVideo(e,$(this),elem.attr("videoId"));
                    e.preventDefault();
                    return false;
                });
            },function(e){

            });
        });

        // hits page
        $("a.play").on("click",function(e){
            var link=$(this).attr("href");
            var vidId=link.indexOf("v=");
            if(vidId>0) {
                openVideo(e, $(this), link.substr(vidId + 2));
                e.preventDefault();
                return false;
            }
        });


    };
    return {
        init:function(){
            window.onload = function(e){
                loaded(e);
            };
        },
        call:function(){
            call();
        }
    };

}();
Glz2YT.init();