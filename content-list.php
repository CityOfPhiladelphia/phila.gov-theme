<?php
/**
 * The template used for displaying finder content
 *
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-u-2-3'); ?>>
    <?php the_title( sprintf( '<h1 class="h3"><a href="%s" rel="bookmark" class="item-link">', esc_url( get_permalink() ) ), '</a></h1>' ); ?>
     
</article><!-- #post-## -->
