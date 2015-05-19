<?php
/**
 * The template used for displaying a featured image and some text
 *
 * @package phila-gov
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('news-item row'); ?>>
  <?php
  if ( has_post_thumbnail() ) {
    $thumb_active = true;
   ?>

    <div class="logo columns medium-8">
      <?php the_post_thumbnail(); ?>
    </div>
  <?php } ?>

  <div class="small-24 medium-16 columns">
  	<header class="entry-header small-text">
      <span class="entry-date"><?php echo get_the_date(); ?> </span> |
      <?php
        $categories = get_the_category($post->ID);
          if ((!$categories == '') || (!$categories[0]->cat_name == 'Uncategorized')){
            $current_cat = $categories[0]->name;
          }

          $terms = get_the_terms( $post->ID, 'topics' );

          if ( $terms && ! is_wp_error( $terms ) ) :

          	$current_topics = array();

          	foreach ( $terms as $term ) {
              //parent terms only
              if( 0 == $term->parent ) {
          		    $current_topics[] = $term->name;
              }
          	}

          	$topics = join( " | ", $current_topics );

        ?>
        <?php echo $topics; ?>
      <?php endif; ?>
        <span class="category"> | <?php echo $current_cat ?> </span>
      <a href="<?php echo the_permalink(); ?>"><?php the_title('<h2>', '</h2>' ); ?></a>
  	</header><!-- .entry-header -->
     <?php
    if (function_exists('rwmb_meta')) {
        $news_url = rwmb_meta( 'phila_news_url', $args = array('type' => 'url'));
        $news_desc = rwmb_meta( 'phila_news_desc', $args = array('type' => 'textrea'));

          echo '<p class="description">' . $news_desc . '</p>';

    }?>
        </div><!-- .entry-content -->
</article><!-- #post-## -->
<hr>
