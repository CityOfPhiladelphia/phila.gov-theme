/**
 * Custom js for our theme
 *
 *
**/
 
jQuery(document).ready(function($) {
    //$('nav li a[href^="browse' + location.pathname.split("/")[1] + '"]').addClass('active');

    new List('servinfo-list-container', {
        valueNames: ['item-link']
    });
    
    
    var pathArray = window.location.pathname.split( '/' );

    var parentURL = pathArray[3];
    var childURL = pathArray[4];
    
    console.log(pathArray.length);
    var parentClass = $('.topic li').hasClass(parentURL);
    var childClass = $('.topic li').hasClass(childURL);
    var theParentClassName = '.' + pathArray[2];
    var theChildClassName = '.' + pathArray[3];
 
    //compare the url with the classname - if the url reflects the classname, hide everything else
    $('.topic li').each(function(){
        if (pathArray.length == 3){
            $('.topic li.child').hide();
            $('.topic .child-description').hide();
        }else if (parentClass == parentURL) {    
            $('.topic li').not(theParentClassName).hide();
            $('.topic .parent-description').hide();
            $('.topic .child-description').not(theParentClassName).hide();
           // $('.topic li').addClass('current');
            //console.log(theParentClassName);
        }else if ( childClass == childURL){
            $('.topic li').not(theParentClassName).hide();
            $('.topic .parent-description').hide();
            $('.topic .child-description').not(theParentClassName).hide();
            //$('.topic ul li').addClass('current');
           //console.log(theChildClassName);
        }
    });
});


