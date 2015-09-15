<?php
/**
 * The template used for displaying service pages
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('service'); ?>>
	<div class="row">
		<header class="entry-header small-24 columns">
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</header><!-- .entry-header -->
	</div>
    <div class="row">
        <div data-swiftype-index='true' class="entry-content small-24 medium-18 columns">
           <?php while ( have_posts() ) : the_post();
            if (function_exists('rwmb_meta')) {
                $service_url = rwmb_meta( 'phila_service_url', $args = array('type' => 'url'));
                $service_name = rwmb_meta( 'phila_service_detail', $args = array('type' => 'textrea'));
                echo '<p class="description">' . rwmb_meta( 'phila_service_desc', $args = array('type' => 'textarea')) . '</p>';
                if (!$service_url == ''){
                    echo '<a data-swiftype-index="false" class="button no-margin" href="';
                    echo $service_url;
                    echo '">' . 'Start Now' . '<span class="accessible"> external link</span></a>';
                }
                if (!$service_name == ''){
                    echo '<span data-swiftype-index="false" class="small-text">On the ' . $service_name . ' website</span>';
                    }
                }

                the_content();

            endwhile; // end of the loop. ?>
					<?php get_template_part( 'partials/content', 'modified' ) ?>
        </div><!-- .entry-content -->

        <?php
        if (function_exists('rwmb_meta')) {
          $related_content = rwmb_meta( 'phila_service_related_items', $args = array('type' => 'textarea'));
        }
        if (!$related_content == ''){
          ?>
          <aside id="secondary" class="related widget-area small-24 medium-6 columns" role="complementary">
            <h3 class="alternate">Related Topics</h3>
              <ul>
                <?php echo $related_content ?>
              </ul>
          </aside>
          <?php
          }
        ?>
    </div><!-- .container -->

</article><!-- #post-## -->

<?php get_footer(); ?>
