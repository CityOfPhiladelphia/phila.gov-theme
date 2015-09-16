<?php
/**
 * The template used for displaying service pages
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('service'); ?>>
	<div class="service-head full">
    <div class="row">
      <div class="small-16 columns">
    		<header class="entry-header">
    			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
    		</header><!-- .entry-header -->
       <?php while ( have_posts() ) : the_post();
        if (function_exists('rwmb_meta')) {
            $service_url = rwmb_meta( 'phila_service_url', $args = array('type' => 'url'));
            $service_name = rwmb_meta( 'phila_service_detail', $args = array('type' => 'textrea'));
            $service_button_text =  rwmb_meta( 'phila_service_button_text', $args = array('type' => 'text'));
            $service_before_start =  rwmb_meta( 'phila_service_before_start', $args = array('type' => 'text'));
            echo '<p class="description">' . rwmb_meta( 'phila_service_desc', $args = array('type' => 'textarea')) . '</p>';
            ?></div><div class="small-8 columns"><?php
            if (!$service_url == ''){
              echo '<a data-swiftype-index="false" class="button no-margin full" href="';
              echo $service_url;
              echo '">';
              echo ( ( $service_button_text == '')  ? 'Start Now' :  $service_button_text );
              echo '<span class="accessible"> External link</span></a>';
            }
            if (!$service_name == ''){
              echo '<span data-swiftype-index="false" class="small-text">On the ' . $service_name . ' website</span>';
              }
              ?></div>
          </div>
  </div>
    <div class="row">
      <div data-swiftype-index='true' class="entry-content small-24 medium-18 columns">
        <?php
      if ( !$service_before_start == '' ) {
        ?><div>
          <h3 class="alternate divide">Before you start</h3><?php
          echo $service_before_start; ?>
          </div><?php
        }
      }
      ?>
      <?php the_content();

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
    </div>
  </div><!-- .container -->

</article><!-- #post-## -->

<?php get_footer(); ?>
