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

	<div id="primary" class="content-area row">
		<main id="main" class="site-main small-24 columns" role="main">

			<?php while ( have_posts() ) : the_post();

				if ( is_page() && $post->post_parent ) {
					    // This is a subpage
							get_template_part( 'partials/content', 'page' );

					} else {
					    // This is not a subpage
							get_template_part( 'partials/content', 'page' );
					}

				endwhile; // end of the loop. ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
