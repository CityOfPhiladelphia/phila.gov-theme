<?php
/**
 * The template used for displaying external site content in page.php
 *
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
				'after'  => '</div>',
			) );
		?>    
        <?php 
            //TODO - make a better fallback in case pods is disabled
            $external = pods_field_display( 'external_site', $post->ID);
            $external = strtolower($external);
            if ($external ==="yes"){
                //if the page is outside of alpha, render the "not on alpha" version of the page
                get_external_site_display();
            }else {
                //otherwise show the page contnet
                the_content();
            }
        ?>
        
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php edit_post_link( __( 'Edit', 'phila-gov' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
