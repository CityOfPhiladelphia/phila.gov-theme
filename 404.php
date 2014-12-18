<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<section class="error-404 not-found">
				<header class="page-header">
					<h1 class="page-title container"><?php _e( 'Oops! That page can&rsquo;t be found.', 'phila-gov' ); ?></h1>
				</header><!-- .page-header -->
                <div class="container">
                    <div class="page-content">
                        <p><?php _e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'phila-gov' ); ?></p>

                        <?php get_search_form(); ?>

                        <?php the_widget( 'WP_Widget_Recent_Posts' ); ?>


                    </div><!-- .page-content -->
                </div>
			</section><!-- .error-404 -->

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
