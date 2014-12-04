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
      <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive-old-ie-min.css">
    <![endif]-->
    <!--[if gt IE 8]><!-->
      <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive.css">
    <!--<![endif]-->
    <!--[if lte IE 8]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div id="page" class="hfeed site">
    <header id="masthead" class="site-header pure-g" role="banner">
        <div class="container">
            <div class="site-branding pure-u-1-2">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo get_stylesheet_directory_uri();?>/img/city-of-philadelphia@2x.png" alt="City of Philadelphia" height="100"></a>
                <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                <h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
            </div><!-- .site-branding -->

            <a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'phila-gov' ); ?></a>
            <!--hide nav for now
                <nav id="site-navigation" class="main-navigation" role="navigation">
                <button class="menu-toggle"><?php // _e( 'Primary Menu', 'phila-gov' ); ?></button>
                <?php // wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
            </nav><!-- #site-navigation -->
            <?php if(!is_front_page()) { ?> <div class="search-site pure-u-1-2"> <?php get_search_form(); ?> </div> <?php }?>
        </div>
    </header><!-- #masthead -->
<?php if (alpha_alert()){ //show the alpha alert if set to true in functions.php ?>
    <div class="alpha-alert pure-g">
        <div class="container">
            <div class="pure-u-1">
                <span class="h2">Experimental Prototype</span> <p>This site might contain errors, inaccuracies and inconsistencies.</p>
                <a href="<?php get_template_part( 'content', 'feedback-url' ); ?>" target="_blank"><?php printf( __( 'Provide Feedback', 'phila-gov' ), 'WordPress' ); ?></a>
            </div>
        </div>
    </div>
<?php }  ?>
    <?php if (function_exists('the_breadcrumb') && !is_front_page()) { ?> <div id="breadcrumbs" class="pure-g"> <div class="container"><nav class="pure-u-1"><?php the_breadcrumb(); ?> </nav></div></div> <?php } ?>

        <div id="content" class="site-content">
