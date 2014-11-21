<?php
/**
 * The template used for displaying external site content in page.php
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g department'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content pure-u-1">
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
				'after'  => '</div>',
			) );
		?>    
        <?php 
            //TODO - make a better fallback in case pods is disabled
            $external = pods_field_display('external_site');
            $external = strtolower($external);
            if ($external ==="yes"){
                get_external_site_display();
            }else {
                //otherwise show the current page content
                while ( have_posts() ) : the_post();
                     the_content();
                endwhile; // end of the loop.
            }
        ?>
        
	</div><!-- .entry-content -->

	<footer class="entry-footer pure-u-1">
		<?php edit_post_link( __( 'Edit', 'phila-gov' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->

<?php get_footer(); ?>