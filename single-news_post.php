<?php
/**
 * The template used for displaying news pages
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g service'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title container">', '</h1>' ); ?>
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
                $news_url = rwmb_meta( 'phila_news_url', $args = array('type' => 'url'));
                $news_desc = rwmb_meta( 'phila_news_desc', $args = array('type' => 'textrea'));
                
                if ($news_url == ''){
                    the_content();
                }else{
                  echo '<p class="description">' . $news_desc . '</p>';
                }
            }

            endwhile; // end of the loop. ?>


        </div><!-- .entry-content -->
    
    </div><!-- .container -->

</article><!-- #post-## -->

<?php get_footer(); ?>