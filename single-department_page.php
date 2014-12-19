<?php
/**
 * The template used for displaying  department websites
 *
 * @package phila-gov
 */

get_header(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g department'); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( '<h1 class="entry-title container">', '</h1>' ); ?>
	</header><!-- .entry-header -->
    <div class="container">
        <div class="entry-content pure-u-3-4">
            <?php
                wp_link_pages( array(
                    'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
                    'after'  => '</div>',
                ) );
            ?>  
            <?php
            //check for URL entry to indicate external website
            if (function_exists('rwmb_meta')) {
                $external_site = rwmb_meta( 'phila_dept_url', $args = array('type' => 'url'));
            if (!$external_site == ''){ 
            //TODO check IF on blank
                ?>
              <div class="external-site">
                  <p><?php the_title(); ?> has a <strong>separate website</strong>: <a href="<?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?>"><?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?></a></p>
           
                <a class="pure-button" href="<?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?>">You are now leaving 
                    <?php util_echo_website_url();?> </a>
            <?php 
                echo '<p class="description">' . rwmb_meta( 'phila_dept_desc', $args = array('type' => 'textarea')) . '</p>';
            ?>
            </div><!-- .external-site -->
        <?php }
            }else {
                
        //loop for our regularly scheduled content
            while ( have_posts() ) : the_post();
                the_content();
            endwhile;
        }
?>         
        </div><!-- .entry-content -->
    </div>
</article><!-- #post-## -->

<?php get_footer(); ?>
