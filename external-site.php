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
		<?php the_content(); ?>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
				'after'  => '</div>',
			) );
		?>    
        <?php 
            $params = array( 
                'limit'   => 1  // Return just one
            ); 

            // Create and find in one shot 
            if (function_exists('pods')) {
                $category = pods( 'category', $params ); 

            if ( 0 < $category->total() ) { 
                while ( $category->fetch() ) { 
        ?>  
                <h2><?php echo $category->display( 'title' ); ?> has a <strong>seperate website</strong>: <a href="<?php echo $category->display( 'url' ); ?>"><?php echo $category->display( 'url' ); ?></a></h2> 
                <a class="pure-button" href="<?php echo $category->display( 'url' ); ?>">You are now leaving <?php util_echo_website_url();?> </a>
        <?php 
                    } // end of cats loop
                } // end of found cats 
            } //end iffff
        ?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php edit_post_link( __( 'Edit', 'phila-gov' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
