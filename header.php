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
    <title><?php global $post;
    if (is_home() || is_search()) {
       wp_title( '|', true, 'right' );
     }else {
       global $post;
       $post_parent = $post->post_parent;
       ( $post_parent ) ? phila_get_full_page_title() : wp_title( '|', true, 'right'   );}?></title>

    <link rel="shortcut icon" type="image/x-icon" href="//alpha.phila.gov/media/favicon.ico">
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri();?>/phila.gov-styles/ie8.css" type="text/css" media="all">
          <p class="browsehappy alert">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
    <!--[if IE 9]>
        <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri();?>/phila.gov-styles/ie9.css" type="text/css" media="all">
    <![endif]-->

    <!-- Swiftype tags -->
    <meta class="swiftype" name="title" data-type="string" content="<?php wp_title(''); ?>" />
<?php if (is_single()) { ?>
    <meta class="swiftype" name="published_at" data-type="date" content="<?php echo get_the_time('c', $post->ID); ?>" />
<?php } ?>

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<!-- Google Tag Manager [phila.gov] -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MC6CR2"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MC6CR2');</script>
<!-- End Google Tag Manager -->

<div id="page" class="hfeed site">
    <?php if (alpha_alert()){ //show the alpha alert if set to true in functions.php ?>

    <div data-swiftype-index='false' id="alpha-alert">
      <div class="row">
        <div class="large-18 columns">
                <h1 class="h3">This service is in alpha</h1> <p>This is a work in progress. It may contain errors and inaccuracies. Help us improve it by providing feedback.</p>
                <p><a href="/about"><?php printf( __( 'Learn more &raquo;', 'phila-gov' )); ?></a></p>
            </div>
            <div class="large-6 columns">
                <div class="button icon alternate"><a class="feedback" href="<?php get_template_part( 'partials/content', 'feedback-url' ); ?>" target="_blank">
                  <?php printf( __( 'Provide Feedback', 'phila-gov' )); ?>
                  <span class="accessible"> Opens in new window</span><i class="fa fa-comments"></i></a></div>
                <div class="button icon alternate"><a class="go-back" href="http://www.phila.gov" target="_blank">
                  <?php printf( __( 'Back to current site', 'phila-gov' )); ?><span class="accessible"> Opens in new window</span><i class="fa fa-reply"></i></a></div>
            </div>
        </div>
      </div>
<?php }  ?>
    <header data-swiftype-index='false' id="masthead" class="site-header" role="banner">
        <div class="row">
            <div class="site-branding">
                <div class="small-24 medium-12 columns">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                        <img src="<?php echo get_stylesheet_directory_uri();?>/img/city-of-philadelphia@2x.png" alt="City of Philadelphia" height="100" class="hidden-xs"></a>
                    <h1 class="site-title"><?php bloginfo( 'name' ); ?></h1>
                    <h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
                </div>
                <?php if(!is_front_page()) { if (!is_search()) {?> <div class="search-site small-24 medium-12 columns"> <?php get_search_form(); ?> </div> <?php } }?>
            </div><!-- .site-branding -->

            <a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'phila-gov' ); ?></a>
            <!--hide nav for now
                <nav id="site-navigation" class="main-navigation" role="navigation">
                <button class="menu-toggle"><?php // _e( 'Primary Menu', 'phila-gov' ); ?></button>
                <?php // wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
            </nav> -->
        </div>
    </header><!-- #masthead -->
    <?php create_site_wide_alerts() ?>
    <?php if (function_exists('the_breadcrumb') && !is_front_page()) { ?>
      <div class="row">
        <div class="small-24 columns">
          <div class="divider"></div>
        </div>
      </div>
      <div class="row">
        <div id="breadcrumbs" class="large-24 columns">
          <nav><?php the_breadcrumb(); ?> </nav>
        </div>
      </div> <?php } ?>
    <div id="content" class="site-content">
