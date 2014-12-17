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
                        <?php  
                            global $wp_query;
                            $term = $wp_query->get_queried_object();
                            $title = $term->name;
                            if (!$title == ''){
                                echo '<h1>' . $title . '</h1>';  
                            }else{
                                echo '<h1>Services and Information Finder</h1>';
                            }
                        ?>
                    </header>
                </div>
            </div>
            <div class="pure-g">
                <div class="container">
                    <nav class="topics-nav visible-lg hidden-md hidden-xs hidden-sm pure-u-md-1-3">
                        <?php get_parent_topics(); ?>
                    </nav>
                    
                    <section class="pure-u-md-1-3 topic">    
                        <ul class="parent-topics">
                            <?php get_topics(); ?>
                        </ul>
                     
                    </section>
          
                    <div class="pure-u-1 pure-u-md-2-3 results">
                        <?php display_filtered_pages(); ?>
                    </div>
                   </div> <!-- #servinfo-list-container -->
        
                </div>
            
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
