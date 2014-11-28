<?php


get_header(); ?>

	<div id="primary" class="content-area browse">
		<main id="main" class="site-main" role="main">
            <div class="pure-g">
                <div class="container">
                    <section class="pure-u-1-3 topic">    
                        <?php  get_topics(); ?>
                    </section>
			     
                    <?php while ( have_posts() ) : the_post(); ?>
            
                        <?php get_template_part( 'content', 'finder' ); ?>

			     <?php endwhile; // end of the loop. ?>
                   
                </div>
            </div>
        
        <div class="pure-g">
            <div class="container">
                <section class="main-nav pure-u-1-3">
                  <?php 
                        $args = array(
                            'orderby' => 'name',
                            'fields'=> 'all',
                            'parent' => 0
                       );
                      $terms = get_terms( 'topics', $args );
                        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
                             echo '<nav>';
                             echo '<ul>';
                             foreach ( $terms as $term ) {
                                 echo '<li><h4>' . $term->name . '</h4></li>';
                             }
                             echo '</ul>';
                             echo '</nav>';
                        }
                    ?>
                </section>
            </div>
        </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
