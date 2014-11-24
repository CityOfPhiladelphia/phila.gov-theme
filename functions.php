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
	//add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'phila-gov' ),
	) );

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
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function phila_gov_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'phila-gov' ),
		'id'            => 'sidebar-1',
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
    
    wp_enqueue_style( 'pure-base', '//yui.yahooapis.com/pure/0.5.0/base.css', array(), '0.5.0' );
    wp_enqueue_style( 'pure-grids', '//yui.yahooapis.com/pure/0.5.0/grids.css', array(), '0.5.0' );
    wp_enqueue_style( 'pure-forms', '//yui.yahooapis.com/pure/0.5.0/forms.css', array(), '0.5.0' );
    wp_enqueue_style( 'pure-buttons', '//yui.yahooapis.com/pure/0.5.0/buttons.css', array(), '0.5.0' );
    wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css', array(), '4.2.0' );


    //DEV LINK
    wp_enqueue_style( 'phila-gov-style-dev', get_stylesheet_directory_uri() . '/phila.gov-styles/styles.css', array('pure-base'), '1.0' );
    
    //PROD LINK 
    //wp_enqueue_style( 'phila-gov-style-prod', '//github.com/CityOfPhiladelphia/phila.gov-styles', array(), '1.0' );
    
    wp_enqueue_script( 'modernizr', '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js', array(), '2.8.3', true );
    
	wp_enqueue_script( 'phila-gov-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );

	wp_enqueue_script( 'phila-gov-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );

    

}
add_action( 'wp_enqueue_scripts', 'phila_gov_scripts' );

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
 * Add breadcrumb support 
 *
 */
function the_breadcrumb() {
    global $post;
    global $output;
    echo '<ul>';
    if (!is_front_page()) {
        echo '<li><a href="';
        echo get_option('home');
        echo '">';
        util_echo_website_url();
        echo '</a></li>';
        if (is_category() || 'department_page' == get_post_type()) {
            echo '<li>';
            the_title();   
                echo '</li>';
        } elseif (is_single()) {
             $term_list = wp_get_post_terms($post->ID, 'topics', array('parent'=> 0, 'orderby' => 'parent' ));
                foreach ($term_list as $term){
                  $name = $term->name;
                    echo '<li>';
                    echo '<a href="#">' . $name . '</a>';
                    echo '</li>';
                } 
            echo '<li>' . the_title() . '</li>';
        } elseif (is_page()) {
            if($post->post_parent){
                //$anc = array_reverse(get_post_ancestors( $post->ID ));
                $anc = get_post_ancestors( $post->ID );
                $title = get_the_title();
                foreach ( $anc as $ancestor ) {
                    $output = '<li><a href="'.get_permalink($ancestor).'" title="'.get_the_title($ancestor).'">'.get_the_title($ancestor).'</a></li> ' . $separator . $output;
                }
                echo $output;
                echo '<li><strong title="'.$title.'"> '.$title.'</strong></li>';
            } else {
                echo '<li><strong> '.get_the_title().'</strong></li>';
            }
        }
    }
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
 * Mah utitlity functions
 */

//this is used throughout the theme and is meant to be updated once the major switch happens
function util_echo_website_url(){
    echo 'alpha.phila.gov';
}

//should there be an alert bar at the top of the site?
function alpha_alert(){
    return true;
}


/**
 * Run the query for external sites
 */
//TODO find a better way of integrating this 

  //if the page is outside of alpha, render the "not on alpha" version of the page
function get_external_site_display() {
    $params = array( 'limit' => -1); 
    //get the category associated with the page
    $categories = get_the_category();
    $category_id = $categories[0]->cat_ID;

    // Create and find in one shot 
    //if (function_exists('pods')) {
        $category = pods( 'category', $params); 
        if ( 0 < $category->total() ) { 
            while ( $category->fetch() ) { 
                //only display id the page category matches the pods category
           if ($category->display('term_id') === $category_id ) {
            ?>  
            <div class="external-site">
            <h2><?php echo $category->display( 'title' ); ?> has a <strong>seperate website</strong>: <a href="<?php echo $category->display( 'url' ); ?>"><?php echo $category->display( 'url' ); ?></a></h2> 
                <a class="pure-button" href="<?php echo $category->display( 'url' ); ?>">You are now leaving <?php util_echo_website_url();?> </a>
            </div>
            <?php echo $category->display('description'); ?>
            <?php 
            }
        }// end of cats loop
    } // end of found cats 
// } //end iffff
}

/**
 * get service URL
 */
//TODO find a better way of integrating this 

  //if the page is outside of alpha, render the "not on alpha" version of the page
function service_page_link() {
    global $post;
    $params = array(); 

    // Create and find in one shot 
        $service_post = pods( 'service_post', $params); 
        $display_pod = pods_field_display('service_post',  get_the_id(), 'service_url', false);
        if ( !$display_pod == '') { ?>
            <a href="<?php echo $display_pod; ?>" class="pure-button pure-button-primary">Start Now</a>   
    <?php 
    } // end of found posts 
}
