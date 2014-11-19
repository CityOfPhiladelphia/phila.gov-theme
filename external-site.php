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
            $external = pods_field_display('external_site');
            $external = strtolower($external);
            if ($external ==="yes"){
                
                //if the page is outside of alpha, render the "not on alpha" version of the page
                function get_external_site_display() {
                    $params = array( 'limit' => -1); 
               
                    $categories = get_the_category();
                    $category_id = $categories[0]->cat_ID;
                  
                    // Create and find in one shot 
                    //if (function_exists('pods')) {
                        $category = pods( 'category', $params); 
                        if ( 0 < $category->total() ) { 
                            while ( $category->fetch() ) { 
                                //only display id the page category matches the pods category
                           if ($category->display('term_id ') === $category_id ) {
                            ?>  
                            
                            <h2><?php echo $category->display( 'title' ); ?> has a <strong>seperate website</strong>: <a href="<?php echo $category->display( 'url' ); ?>"><?php echo $category->display( 'url' ); ?></a></h2> 
                                <a class="pure-button" href="<?php echo $category->display( 'url' ); ?>">You are now leaving <?php util_echo_website_url();?> </a>
                            <?php 
                            }
                        }// end of cats loop
                    } // end of found cats 
                // } //end iffff
            }
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
