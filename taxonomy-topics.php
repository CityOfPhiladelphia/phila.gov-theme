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
                        <h1>Services and Information</h1>
                    </header>
                </div>
            </div>
            <div class="pure-g">
                <div class="container">
                    <section class="pure-u-1-3 topic">    
                        <ul class="parent-topics">
                            <?php get_topics(); ?>
                        </ul>
                     
                    <nav class="topics-nav hidden-md hidden-sm hidden-xs">
                        <h2>All Topics</h2>
                        <?php get_parent_topics(); ?>
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
