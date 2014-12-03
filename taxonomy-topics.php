<?php
/**
 * Template Name: Browse 
 * 
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area browse">
		<main id="main" class="site-main" role="main">
            <div class="pure-g">
                <div class="container">
                    <header class="pure-u-1">
                        <h1>DIRECTORY OF SERVICES AND INFORMATION ORGANIZED BY TOPIC</h1>
                    </header>
                </div>
            </div>
            <div class="pure-g">
                <div class="container">
                    <section class="pure-u-1-3 topic">    
                        <ul class="parent-topics">
                            <?php get_topics(); ?>
                        </ul>
                     
                    <nav class="topics-nav">
                        <h2>All Topics</h2>
                    <?php 
                        $args = array(
                            'orderby' => 'name',
                            'fields'=> 'all',
                            'parent' => 0
                       );
                      $terms = get_terms( 'topics', $args );
                        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
                             echo '<ul>';
                             foreach ( $terms as $term ) {
                                 echo '<li class="h4"><a href="/browse/' .$term->slug . '">' . $term->name . '</a></li>';
                             }
                             echo '</ul>';
                             echo '</nav>';                        
                        }
                    ?>
                    </nav>
                    </section>
          
                    <div class="pure-u-2-3 results">
                    <?php display_filtered_pages(); ?>
                    </div>
			     
                   </div> <!-- #servinfo-list-container -->
                </div>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
