<?php
/**
 * The template for displaying search results pages.
 *
 * @package phila-gov
 */

get_header(); ?>

	<section id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
      <div class="search-head">
				<div class="row">
          <header class="medium-8 columns">
            <h1><?php printf( __( 'Search results for:', 'phila-gov' )); ?></h1>
          </header><!-- .page-header -->
            <div class="search-site medium-16 columns"> <?php get_search_form(); ?> </div>
          <?php if ( have_posts() ) : ?>
          </div>
				</div>
            <div class="row">
              <div class="medium-6 columns">
                    <?php printf( __( 'Displaying ', 'phila-gov' ));
                            $num = $wp_query->post_count;
                        if (have_posts()) : echo '<strong>' . $num .' </strong>'; endif;
                            $search_count = 0;
                            $search = new WP_Query("s=$s & showposts=-1");
                        if($search->have_posts()) : while($search->have_posts()) : $search->the_post(); $search_count++;
                        endwhile;
                        endif;
                        printf( __( ' Results', 'phila-gov' ));
                        ?>
                    </div>
                    <div class="medium-18 columns search-results-list">
                        <?php /* Start the Loop */ ?>
                        <?php while ( have_posts() ) : the_post(); ?>

                            <?php
                            /**
                             * Run the loop for the search to output the results.
                             * If you want to overload this in a child theme then include a file
                             * called content-search.php and that will be used instead.
                             */
                            get_template_part( 'templates/template', 'search' );
                            ?>

                        <?php endwhile; ?>

                        <?php
                        echo '<div class="panel center">';
                                still_migrating_content();
                        echo '</div>';
                        ?>

                    <?php else : ?>
                        </div>
											</div>
                        <?php get_template_part( 'content', 'none' ); ?>

                    <?php endif; ?>
                    </div>
                </div><!--container-->

		</main><!-- #main -->
	</section><!-- #primary -->

<?php get_footer(); ?>
