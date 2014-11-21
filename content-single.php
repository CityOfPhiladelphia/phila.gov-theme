<?php
/**
 * The content of a single post
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

	</header><!-- .entry-header -->
    <div class="container">
        <div class="entry-content pure-u-1">
		<?php the_content(); ?>
            <?php 
               // $term_list = wp_get_post_terms($post->ID, 'topics', array("fields" => "all"));
               
            
            ?>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
				'after'  => '</div>',
			) );
		?>
	   </div><!-- .entry-content -->
    </div>
    
    <?php //add sidebar to middleof <article> for grid and semantics
        if ( ! is_active_sidebar( 'sidebar-1' ) ) {
            return;
        }        
        get_sidebar(); 
    ?>
	
    <footer class="entry-footer pure-u-1">
		<?php phila_gov_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
