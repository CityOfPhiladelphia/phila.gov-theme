<?php
/**
 * The template for displaying the front page.
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="container">
                <section id="services">
                    <div>
                        <p>Search for City Departments, Applications, Documents, or content.</p>
                        <?php get_search_form(); ?>
                    </div>
                    <div>
                        <p>Submit a ticket</p>
                        <p>Pay a bill</p>
                        <p>Property Search</p>
                        <p>Maps</p>
                    </div>

                    <h1>Services</h1>
                    <?php 
                    /* temporary top-level topics list w/ descriptions */
                       $args = array(
                            'orderby' => 'name',
                            'fields'=> 'all',
                            'parent' => 0
                       );
                      $terms = get_terms( 'topics', $args );
                        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
                             echo '<ul>';
                             foreach ( $terms as $term ) {
                                 echo '<li>' . $term->name . '</li>';
                                 echo '<p>' . $term->description . '</p>';
                             }
                             echo '</ul>';
                            }

                            ?>

                    </section>

                    <section id="active">
                        most active things
                    </section>

                    <section id="news">
                        News
                   <?php
                        if ( have_posts() ) : while ( have_posts() ) : the_post();
                            // do something
                        endwhile; else:
                            // no posts found
                        endif;
                    ?>
                    </section>
            </div><!-- .container -->
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
