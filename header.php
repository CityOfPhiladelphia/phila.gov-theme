<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package phila-gov
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri();?>/phila.gov-styles/ie8.css" type="text/css" media="all">
     <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive-old-ie-min.css">
          <p class="browsehappy alert">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
    <!--[if IE 9]>
        <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri();?>/phila.gov-styles/ie9.css" type="text/css" media="all">
    <![endif]-->

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<!-- Google Tag Manager [alpha.phila.gov] -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-KDM9KV"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KDM9KV');</script>
<!-- End Google Tag Manager -->

<div id="page" class="hfeed site">
    <?php if (alpha_alert()){ //show the alpha alert if set to true in functions.php ?>
    <div class="alpha-alert pure-g">
        <div class="container">
            <div class="pure-u-1">
                <div class="float-left">
                    <h1 class="h2">Welcome to alpha.phila.gov</h1> <p>This is a work in progress. It may contain errors and inaccuracies. Help us improve it by providing feedback.</p>
                    <p><a href="/about"><?php printf( __( 'Learn more about this project. &raquo;', 'phila-gov' )); ?></a></p>
                </div>
                <div class="float-right">
                    <div class="button-with-icon"><a class="pure-button feedback" href="<?php get_template_part( 'content', 'feedback-url' ); ?>" target="_blank"><?php printf( __( 'Provide Feedback', 'phila-gov' )); ?><span class="accessible">Opens in new window</span></a></div>
                    <div class="button-with-icon"><a class="pure-button go-back" href="http://www.phila.gov" target="_blank"><?php printf( __( 'Back to current site', 'phila-gov' )); ?><span class="accessible">Opens in new window</span></a></div>
                </div>
            </div>
        </div>
    </div>
<?php }  ?>
    <header id="masthead" class="site-header pure-g" role="banner">
        <div class="container">
            <div class="site-branding">
                <div class="pure-u-1-4 pure-u-md-1-2">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                        <img src="<?php echo get_stylesheet_directory_uri();?>/img/city-of-philadelphia@2x.png" alt="City of Philadelphia" height="100" class="hidden-xs">
                    <img src="<?php echo get_stylesheet_directory_uri();?>/img/city-of-philadelphia-mobile@2x.png" alt="City of Philadelphia" height="50" class="visible-xs"></a>


                    <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                    <h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
                </div>
                <?php if(!is_front_page()) { if (!is_search()) {?> <div class="search-site pure-u-3-4 pure-u-md-1-2"> <?php get_search_form(); ?> </div> <?php } }?>
            </div><!-- .site-branding -->
            
        
            <a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'phila-gov' ); ?></a>
            <!--hide nav for now
                <nav id="site-navigation" class="main-navigation" role="navigation">
                <button class="menu-toggle"><?php // _e( 'Primary Menu', 'phila-gov' ); ?></button>
                <?php // wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
            </nav><!-- #site-navigation -->
        </div>
    </header><!-- #masthead -->
    <?php if (function_exists('the_breadcrumb') && !is_front_page()) { ?> <div id="breadcrumbs" class="pure-g"> <div class="container"><nav class="pure-u-1"><?php the_breadcrumb(); ?> </nav></div></div> <?php } ?>
    
    <div id="content" class="site-content">
