<?php
/**
 * phila-gov functions and definitions
 *
 * @package phila-gov
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

if ( ! function_exists( 'phila_gov_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function phila_gov_setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on phila-gov, use a find and replace
	 * to change 'phila-gov' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'phila-gov', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in any number of locations.
	add_action( 'init', 'phila_register_category_menus' );

    function phila_register_category_menus() {

        $phila_menu_cat_args = array(
            'type'                     => 'post',
            'child_of'                 => 0,
            'parent'                   => '',
            'orderby'                  => 'name',
            'order'                    => 'ASC',
            'hide_empty'               => 1,
            'hierarchical'             => 0,
            'taxonomy'                 => 'category',
            'pad_counts'               => false
        );

        $phila_get_menu_cats = get_categories( $phila_menu_cat_args );

        foreach ($phila_get_menu_cats as $phila_category) {
            register_nav_menus( array( 'menu-' .$phila_category->term_id => $phila_category->name ) );
        }
    }

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'gallery', 'caption',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'phila_gov_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // phila_gov_setup
add_action( 'after_setup_theme', 'phila_gov_setup' );

/**
 * Register widget areas for all categories. To appear on department pages.
 *
 * TODO: This could be a scalability issue. More research needs to be done.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function phila_gov_widgets_init() {
  $args = array(
    'orderby' => 'name',
    'parent' => 0
    );
  $categories = get_categories( $args );

  foreach ( $categories as $category ) {

    $slug = $category->slug;
    $name = $category->name;
    $cat_id = $category->cat_ID;

    register_sidebar( array(
  		'name'          => __( 'Sidebar ' . $name, 'phila-gov' ),
  		'id'            => 'sidebar' . $slug,
  		'description'   => '',
  		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
  		'after_widget'  => '</aside>',
  		'before_title'  => '<h1 class="widget-title">',
  		'after_title'   => '</h1>',
  	) );
  }
  //only one of these
  register_sidebar( array(
    'name'          => __( 'News Sidebar', 'phila-gov' ),
    'id'            => 'sidebar-news',
    'description'   => '',
    'before_widget' => '<aside id="%1$s" class="widget %2$s">',
    'after_widget'  => '</aside>',
    'before_title'  => '<h1 class="widget-title">',
    'after_title'   => '</h1>',
  ) );
}
add_action( 'widgets_init', 'phila_gov_widgets_init' );



/**
 * Enqueue scripts and styles.
 */
function phila_gov_scripts() {

    wp_enqueue_style( 'pattern_portfolio', '//cityofphiladelphia.github.io/patterns/dist/0.8.0/css/patterns.css' );

    wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css', array(), '4.2.0' );

    wp_enqueue_style( 'ionicons', '//code.ionicframework.com/ionicons/2.0.0/css/ionicons.min.css', array(), '2.0.0' );


    wp_enqueue_style( 'theme-styles', get_stylesheet_directory_uri() . '/css/styles.css', array('pattern_portfolio'), '0.1.0' );

    wp_enqueue_script( 'modernizr', '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js', array(), '2.8.3', false );

    wp_enqueue_script( 'text-filtering', '//cdnjs.cloudflare.com/ajax/libs/list.js/1.1.1/list.min.js', array(), '1.1.1', true );

    wp_enqueue_script( 'pattern-scripts', '//cityofphiladelphia.github.io/patterns/dist/0.8.0/js/patterns.min.js', array('jquery', 'foundation-js'), true );
    wp_enqueue_script( 'phila-scripts', get_stylesheet_directory_uri().'/js/phila-scripts.min.js', array('jquery', 'text-filtering'), 1.0, true );

		wp_enqueue_script( 'foundation-js', '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/js/foundation.min.js', array('jquery'), '2.8.3', true );
}
add_action( 'wp_enqueue_scripts', 'phila_gov_scripts');

function enqueue_scripts_styles_init() {
	//wp_enqueue_script( 'ajax-script', get_stylesheet_directory_uri().'/js/scripts.js', array('jquery', 'text-filtering'), 1.0 ); // jQuery will be included automatically
	wp_localize_script( 'ajax-script', 'ajax_object', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) ); // setting ajaxurl
}
add_action('init', 'enqueue_scripts_styles_init');

function ajax_action_stuff() {
	$post_id = $_POST['post_id']; // getting variables from ajax post
	// doing ajax stuff
	update_post_meta($post_id, 'post_key', 'meta_value');
	echo 'ajax submitted';
	die(); // stop executing script
}
add_action( 'wp_ajax_ajax_action', 'ajax_action_stuff' ); // ajax for logged in users
add_action( 'wp_ajax_nopriv_ajax_action', 'ajax_action_stuff' ); // ajax for not logged in users


/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';
/**
 * Load custom Department menu file.
 */
require get_template_directory() . '/inc/department-menu.php';

/**
 * Add breadcrumb support
 *
 */
function the_breadcrumb() {
    global $post;
    global $output;
    $category = get_the_category();
    echo '<ul>';
    if (!is_front_page()) {

        echo '<li><a href="';
        echo get_option('home');
        echo '">';
        util_echo_website_url();
        echo '</a></li>';
        if (is_category()) {
            echo '<li>';
            the_title();
            echo '</li>';
        }elseif (is_post_type_archive('department_page')){

            echo '<li>Departments</li>';

        }elseif (is_page_template('taxonomy-topics.php') || is_tax('topics')){
            //browse
            //echo '<li><a href="/browse">Browse</a></li>';
            if (function_exists('currentURL')){
                display_browse_breadcrumbs();
            }
        }
        elseif (is_single()) {
            if (is_singular('news_post') || (is_singular('site_wide_alert'))){
                echo '<li>';
                the_title();
                echo '</li>';
            }elseif (is_singular('department_page')) {

                $anc = get_post_ancestors( $post->ID );
                $title = get_the_title();

                foreach ( $anc as $ancestor ) {

                    $output = '<li><a href="'.get_permalink($ancestor).'" title="'.get_the_title($ancestor).'">'.get_the_title($ancestor).'</a></li> ' .  $output;
                }
                echo $output;
                echo '<li><strong title="'.$title.'"> '.$title.'</strong></li>';

            }else{
                //service/info pages
                $i = 0;
                $topic_terms = wp_get_object_terms( $post->ID,  'topics', array('orderby'=>'term_group') );
                $topic_parent = $topic_terms[0];
                    if ( ! empty( $topic_terms ) ) {
                        if ( ! is_wp_error( $topic_terms ) ) {
                                foreach( $topic_terms as $term ) {
                                    if ($i == 0) {
                                        echo '<li><a href=/browse/' . $term->slug . '>' . $term->name . '</a></li>';
                                    }elseif ($i == 1){
                                        echo '<li><a href=/browse/' . $topic_parent->slug . '/' .  $term->slug . '>' . $term->name . '</a></li>';
                                    }
                                $i++;
                            }
                         }
                    }
            echo '<li>';
            the_title();
            echo '</li>';
            }
        } elseif (is_page()) {

            if($post->post_parent){
                //$anc = array_reverse(get_post_ancestors( $post->ID ));
                $anc = get_post_ancestors( $post->ID );
                $title = get_the_title();
                foreach ( $anc as $ancestor ) {
                    $output = '<li><a href="'.get_permalink($ancestor).'" title="'.get_the_title($ancestor).'">'.get_the_title($ancestor).'</a></li> ' .  $output;
                }
                echo $output;
                echo '<li><strong title="'.$title.'"> '.$title.'</strong></li>';
            } else {
                echo '<li><strong> '.get_the_title().'</strong></li>';
            }
        }//end is_page
    }//end is front page
    elseif (is_tag()) {single_tag_title();}
    elseif (is_day()) {echo"<li>Archive for "; the_time('F jS, Y'); echo'</li>';}
    elseif (is_month()) {echo"<li>Archive for "; the_time('F, Y'); echo'</li>';}
    elseif (is_year()) {echo"<li>Archive for "; the_time('Y'); echo'</li>';}
    elseif (is_author()) {echo"<li>Author Archive"; echo'</li>';}
    elseif (isset($_GET['paged']) && !empty($_GET['paged'])) {echo "<li>Blog Archives"; echo'</li>';}
    elseif (is_search()) {echo"<li>Search Results"; echo'</li>';}
    echo '</ul>';
}

/**
 * Mah utility functions
 */

//this is used throughout the theme and is meant to be updated once the major switch happens
function util_echo_website_url(){
    echo 'alpha.phila.gov';
}

//should there be an alert bar at the top of the site?
function alpha_alert(){
    return true;
}

function provide_feedback(){
    echo '<div class="button-with-icon"><a class="pure-button feedback" href="';
    get_template_part( 'partials/content', 'feedback-url' );
    echo '" target="_blank"><span>Provide Feedback</span> <span class="accessible">Opens in new window</span></a></div>';
}

function still_migrating_content(){
    echo '<p>Can\'t find what you\'re looking for? We\'re still moving content. </p>';
    echo '<p><a href="javascript:searchPhilaGov()">Search phila.gov</a> or <a href="';
		get_template_part( 'partials/content', 'feedback-url' );
    echo '" target="_blank">tell us what you\'re looking for. <span class="accessible">Opens in new window</span></a></p>';
}

function get_department_menu() {
 		/*
		Set the menus. We use categories to drive functionality.
		Pass the current category (there should only ever be 1one)
		as the menu-id.
	*/
	global $post;
	$categories = get_the_category($post->ID);
	if ((!$categories == '') || (!$categories[0]->cat_name == 'Uncategorized')){
		$current_cat = $categories[0]->cat_ID;

    $defaults = array(
        'theme_location'  => 'menu-' . $current_cat,
        'menu'            => '',
        'container'       => '',
        'container_class' => '',
        'container_id'    => '',
        'menu_class'      => 'department-menu',
        'menu_id'         => '',
        'echo'            => true,
        'fallback_cb'     => false,//if there is no menu, output nothing
        'before'          => '',
        'after'           => '',
        'items_wrap'      => '
													<div class="row top-nav">
														<nav class="top-bar" data-topbar role="navigation">
																<section class="top-bar-section">
																	<ul id="%1$s" class="%2$s">%3$s</ul>
																</section>
															</nav>
													</div>',
        'depth'           => 0,
        'walker'          => new phila_gov_walker_nav_menu
    );
    wp_nav_menu( $defaults );
	}
}
