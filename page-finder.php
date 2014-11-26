<?php
/**
 * Template Name: Finder
 *
 * A template for the "Service and Information Finder" 
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<?php while ( have_posts() ) : the_post(); ?>
            
                <?php get_template_part( 'content', 'finder' ); ?>

			<?php endwhile; // end of the loop. ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
