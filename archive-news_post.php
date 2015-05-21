<?php
/**
 * The template for displaying archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package phila-gov
 */

get_header();
if ( 'news_post' == get_post_type() ) {
		global $actively_news;
		 $actively_news = true;
	}	?>

	<section id="primary" class="content-area archive row">

		<?php
			if ( have_posts() ) : ?>
        <header class="columns">
          <h1>
            <?php

								if ( $actively_news ) :
										_e( 'NEWS', 'phila-gov' );
                endif;
            ?>
          </h1>
          </header><!-- .page-header -->
				<main id="main" class="site-main small-24 columns medium-19 push-5" role="main">
          <?php while ( have_posts() ) : the_post(); ?>
					<?php
							get_template_part( 'partials/content', 'news' );

         	endwhile;

	          phila_gov_paging_nav();

	      else :

         	get_template_part( 'partials/content', 'none' );

       	endif; ?>

			</main><!-- #main -->

			<div id="secondary" class="widget-area small-24 medium-5 pull-19 columns" role="complementary">
				<?php get_sidebar( 'topics' ); ?>
			</div><!-- #secondary -->

	</section><!-- #primary -->
	<?php
 	get_template_part( 'partials/content', 'modified' );
	get_footer();
?>
