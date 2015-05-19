<?php
/**
 * The template used for displaying a featured image and some text
 *
 * @package phila-gov
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('news row collapse'); ?>>
  <?php
  if ( has_post_thumbnail() )  ?>
    <div class="logo columns medium-6">
      <?php the_post_thumbnail(); ?>
    </div>

  <div class="small-24 medium-18 columns">
  	<header class="entry-header">
  		<?php the_title( '<h1 class="entry-title container">', '</h1>' ); ?>
  	</header><!-- .entry-header -->
     <?php
    if (function_exists('rwmb_meta')) {
        $news_url = rwmb_meta( 'phila_news_url', $args = array('type' => 'url'));
        $news_desc = rwmb_meta( 'phila_news_desc', $args = array('type' => 'textrea'));

        if ($news_url == ''){
            the_content();
        }else{
          echo '<p class="description">' . $news_desc . '</p>';
        }
    }?>


        </div><!-- .entry-content -->
</article><!-- #post-## -->
