<?php
/**
 * The template for displaying search results pages.
 *
 * @package phila-gov
 */

get_header(); ?>

	<section id="primary" class="content-area search">
		<main id="main" class="site-main" role="main">
            <div class="pure-g search-head">
                <div class="container">
                    
                     <header class="pure-u-1-3">
                        <h1><?php printf( __( 'Search results for:', 'phila-gov' )); ?></h1>
                    </header><!-- .page-header -->
                    <div class="search-site pure-u-2-3"> <?php get_search_form(); ?> </div>
                </div><!--.container-->
            <?php if ( have_posts() ) : ?>
                </div>
            <div class="pure-g">
                <div class="container">
                    <div class="pure-u-1-4">
                    <?php printf( __( 'Displaying ', 'phila-gov' ));
                            $num = $wp_query->post_count; if (have_posts()) : echo '<strong>' . $num .' </strong>'; endif;
                            printf( __( 'of ', 'phila-gov' ));
                            $search_count = 0; 
                            $search = new WP_Query("s=$s & showposts=-1"); 
                            if($search->have_posts()) : while($search->have_posts()) : $search->the_post(); $search_count++; 
                        endwhile;  
                        endif; 
                        echo '<strong>' . $search_count . '</strong>';
                        printf( __( ' Results', 'phila-gov' ));
                        ?>
                    </div>
                    <div class="pure-u-3-4 search-results">
                        <?php /* Start the Loop */ ?>
                        <?php while ( have_posts() ) : the_post(); ?>

                            <?php
                            /**
                             * Run the loop for the search to output the results.
                             * If you want to overload this in a child theme then include a file
                             * called content-search.php and that will be used instead.
                             */
                            get_template_part( 'content', 'search' );
                            ?>

                        <?php endwhile; ?>

                        <?php //phila_gov_paging_nav(); ?>

                    <?php else : ?>
                        </div>
                    </div>

                        <?php get_template_part( 'content', 'none' ); ?>

                    <?php endif; ?>
                    </div>
                </div><!--container-->
            </div><!-- pure-g -->
		</main><!-- #main -->
	</section><!-- #primary -->

<?php get_footer(); ?>
