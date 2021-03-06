<?php
/**
 * The template used for displaying a featured image and some text
 *
 * @package phila-gov
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('news-item row'); ?>>
  <?php if ( has_post_thumbnail() ) {
    $thumb_active = true;  ?>
    <div class="logo columns medium-7">
      <?php the_post_thumbnail('news-thumb'); ?>
    </div>
  <?php } ?>

  <div class="medium-17 columns">
  	<header class="entry-header small-text">
      <?php
        $categories = get_the_category($post->ID);
          if ( !$categories == 0 ) {
            $current_cat = $categories[0]->name;
          }else {
            $current_cat = null;
          }
        ?>
      <span class="entry-date"><?php echo get_the_date(); ?> </span> <span class="category">
        <?php echo $current_cat == null ?  '' : ' | ' . $current_cat  ?> </span>
        <a href="<?php echo the_permalink(); ?>"><?php the_title('<h2>', '</h2>' ); ?></a>
  	</header><!-- .entry-header -->
    <?php
    if (function_exists('rwmb_meta')) {
      $news_url = rwmb_meta( 'phila_news_url', $args = array('type' => 'url'));
      $news_desc = rwmb_meta( 'phila_news_desc', $args = array('type' => 'textrea'));
      echo '<p class="description">' . $news_desc . '</p>';
    } ?>
  </div>
</article><!-- #post-## -->
<hr>
