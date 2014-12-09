<?php
/**
 * The template used for displaying service pages
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g service'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->
    <div class="container">
        <div class="entry-content pure-u-1 pure-u-md-3-4">
            <?php
                wp_link_pages( array(
                    'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
                    'after'  => '</div>',
                ) );
            ?>    
           <?php while ( have_posts() ) : the_post();
            if (function_exists('rwmb_meta')) {
                echo '<p class="description">' . rwmb_meta( 'phila_service_desc', $args = array('type' => 'textarea')) . '</p>';
                echo '<a class="pure-button pure-button-primary" href="';
                echo rwmb_meta( 'phila_service_url', $args = array('type' => 'url'));
                echo '">' . 'Start Now' . '</a>';
                echo '<span class="detail">' . rwmb_meta( 'phila_service_detail', $args = array('type' => 'textrea')) . '</span>';
            }
                the_content();

            endwhile; // end of the loop. ?>


        </div><!-- .entry-content -->
    
    <?php       
        get_sidebar('topics'); 
    ?>
    </div><!-- .container -->

</article><!-- #post-## -->

<?php get_footer(); ?>