/**
 * Custom js for our theme
 *
 *
**/

new List('servinfo-list-container', {
    valueNames: ['item', 'item-desc']
});

jQuery(document).ready(function($) {    
    /*
    *       phila.gov/browse 
    */
    var pathArray = window.location.pathname.split( '/' );

    var parentURL = pathArray[3];
    var childURL = pathArray[4];
    
    var parentClass = $('.parent-topics li').hasClass(parentURL);
    var childClass = $('.parent-topics li').hasClass(childURL);
    var theParentClassName = '.' + pathArray[2];
    var theChildClassName = '.' + pathArray[3];
    
    if (pathArray.length == 3){
        $('.browse nav ul').hide();
        $('.browse section.topic').removeClass('pure-u-md-1-3');
    }
    
    //compare the url with the classname - if the url reflects the classname, hide everything else
    $('.topic li').each(function(){
        if (pathArray.length == 3){
            $('.parent-topics li.child').hide();
            $('.parent-topics .child-description').hide();
        }else if (parentClass == parentURL) {    
            $('.parent-topics li').not(theParentClassName).hide();
            $('.parent-topics .parent-description').hide();
            $('.parent-topics .child-description').not(theParentClassName).hide();
            $(theParentClassName).addClass('current-topic');
            $('.parent.current-topic a').removeAttr('href');
            $('.topic').removeClass('pure-u-md-1-3');
            $('.topic').addClass('pure-u-2-3 subtopic-select');
        }else if (childClass == childURL){
            $('.parent-topics li').not(theParentClassName).hide();
            $('.parent-topics .parent-description').hide();
            $(theParentClassName).addClass('current-topic');
            $('.parent-topics .child-description').not(theParentClassName).hide();
            $(theParentClassName).addClass('current-topic');
            $(theChildClassName).addClass('current');
            $('.parent.current-topic a').removeAttr('href');
            $('.browse nav ul').hide();
            $('.child-description').hide();
        }//end else if

    });//end topics
    
    var currentURL = window.location.pathname;
    if (currentURL.indexOf('browse') != -1){
        var mq = window.matchMedia('(max-width: 48em)');

        if (mq.matches) {
            var target = $('.topic li.current-topic');
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }  
    }

});

