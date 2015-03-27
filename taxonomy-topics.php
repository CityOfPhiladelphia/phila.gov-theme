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
        <nav class="topics-nav small-24 large-8 columns">
            <?php get_parent_topics(); ?>
        </nav>

        <section id="topic" class="small-24 large-8 columns">
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
<script type="text/javascript">
	browse.init();
</script>
