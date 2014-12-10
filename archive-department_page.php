<?php
/**
 * Archive for Department List
 * 
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area departments">
		<main id="main" class="site-main" role="main">
            <div class="pure-g">
                <div class="container">
                    <header class="pure-u-1">
                        <h1>City Departments</h1>
                    </header>
                </div>
            </div>
            <div class="pure-g">
                <div class="container">
          
                    <div class="pure-u-1 results">
                    
                        <?php get_template_part( 'content', 'finder' ); ?>
                        
                        <ul class="list"><!-- ul for sortable listness -->
                            <?php 
                                $type = 'department_page';
                                $department_listing = new WP_Query(array( 
                                        'post_type' => $type, 
                                        'posts_per_page' => -1, 
                                        'orderby' => 'title', 
                                        'order'=> 'asc' 
                                    )
                                );
                               
                                if ( $department_listing->have_posts() ) : ?>
                            
                                <?php while ( $department_listing->have_posts() ) : $department_listing->the_post(); ?>

                                    <?php get_template_part( 'content', 'list' ); ?>
                                
                                <?php endwhile; ?>
                                <?php else : ?>

                            <?php endif;
                            ?>
                            
                        </ul>
                    </div>
			     
                   </div> <!-- #servinfo-list-container -->
                </div>
            </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
