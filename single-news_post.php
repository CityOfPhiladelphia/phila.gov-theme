<?php
/**
 * The template used for displaying news pages
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('service'); ?>>
	<div class="row">
	<header class="entry-header small-24 columns">
		<?php the_title( '<h1 class="entry-title container">', '</h1>' ); ?>
	</header><!-- .entry-header -->
</div>
    <div class="row">
        <div class="entry-content small-24 medium-18 columns">
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

    </div><!-- .row -->

</article><!-- #post-## -->

<?php get_footer(); ?>
