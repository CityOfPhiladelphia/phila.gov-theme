/**
 * Custom js for our theme
 *
 *
**/
 

jQuery(document).ready(function($) {
  $('nav li a[href^="browse' + location.pathname.split("/")[1] + '"]').addClass('active');
});
