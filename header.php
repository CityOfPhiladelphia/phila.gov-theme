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
    <?php if (function_exists('create_alpha_alert')){ ?> <div class="alpha-alert"> <?php create_alpha_alert(); ?> </div>  <?php } ?>
<div id="page" class="hfeed site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'phila-gov' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding">
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
		</div><!-- .site-branding -->

		<!--hide nav for now
            <nav id="site-navigation" class="main-navigation" role="navigation">
			<button class="menu-toggle"><?php // _e( 'Primary Menu', 'phila-gov' ); ?></button>
			<?php // wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
		</nav><!-- #site-navigation -->
        <?php if(!is_front_page()) { get_search_form(); }?>
	</header><!-- #masthead -->
    
    <?php if (function_exists('the_breadcrumb')) { ?> <div id="breadcrumbs"> <?php the_breadcrumb(" / "); ?> </div> <?php } ?>
	
    <div id="content" class="site-content">
