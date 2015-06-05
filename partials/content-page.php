<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>">
	<div class="row">
		<header class="entry-header small-24 columns">
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</header><!-- .entry-header -->
	</div>
  <div class="row">
      <div data-swiftype-index='true' class="entry-content small-24 columns">
          <?php the_content(); ?>
          <?php
              //wp_link_pages( array(
                  //'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
                  //'after'  => '</div>',
              //) );
          ?>
      </div><!-- .entry-content -->
	</div>
	<?php get_template_part( 'partials/content', 'modified' ) ?>
</article><!-- #post-## -->
