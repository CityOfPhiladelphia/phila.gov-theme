<?php
/**
 * Template Name: Browse
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area browse">
		<main id="main" class="site-main" role="main">
      <div class="row">
        <header class="small-24 columns">
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
      <div class="row">
        <nav class="topics-nav small-24 large-8 columns">
            <?php get_parent_topics(); ?>
        </nav>

        <section class="small-24 large-8 columns topic">
            <ul class="parent-topics">
                <?php get_topics(); ?>
            </ul>

        </section>

        <div class="small-24 large-16 columns results">
            <?php display_filtered_pages(); ?>
        </div>
      </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
