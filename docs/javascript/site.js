
$j.extend($j.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $j ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $j.fn.navScroller = function(options) {
        settings = $j.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
    	navItems.on('click', function(event){
    		event.preventDefault();
            var navID = $j(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
        	$j('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset},
                settings.scrollSpeed, "easeInOutExpo", function(){
                    disableScrollFn = false;
                }
            );
    	});

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $j(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $j(window).height();
            var pos = $j(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $j(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $j(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $j(navs[nav]).removeClass('active'); }
        $j(navs[navID]).addClass('active');
    }
})( jQuery );


$j(document).ready(function (){

    $j('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
	$j(".sectiondivider").on('click', function(event) {
    	$j('html,body').animate({scrollTop: $j(event.target.parentNode).offset().top - 50}, 400, "linear");
	});

    //links going to other sections nicely scroll
	$j(".container a").each(function(){
        if ($j(this).attr("href").charAt(0) == '#'){
            $j(this).on('click', function(event) {
        		event.preventDefault();
                var target = $j(event.target).closest("a");
                var targetHight =  $j(target.attr("href")).offset().top
            	$j('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
	});

});
