<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package phila-gov
 */

get_header(); ?>
<div class="row">
	<div id="secondary" class="widget-area small-24 medium-6 columns" role="complementary">
		<?php dynamic_sidebar( 'sidebar-news' ); ?>
	</div><!-- #secondary -->

	<div id="primary" class="content-area">
		<main id="main" class="site-main medium-18 small-24 columns" role="main">

    <?php  $all_news_loop = new WP_Query( array( 'post_type' => 'news_post') );  ?>

      <?php while ( $all_news_loop->have_posts() ) : $all_news_loop->the_post(); ?>

          <?php get_template_part( 'partials/content', 'news' ); ?>

			<?php endwhile; // end of the loop. ?>

		</main><!-- #main -->
	</div><!-- #primary -->
</div><!-- .row -->

<?php get_footer(); ?>
