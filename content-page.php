<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content pure-u-1">
		<?php the_content(); ?>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer pure-u-1">
		<?php edit_post_link( __( 'Edit', 'phila-gov' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
