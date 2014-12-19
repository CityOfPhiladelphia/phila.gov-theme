<?php
/**
 * The template part for displaying a message that posts cannot be found.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package phila-gov
 */
?>

<section class="no-results not-found">
        <header class="container">
            <div class="pure-u-1">
                <h1><?php _e( 'Nothing Found', 'phila-gov' ); ?></h1>
            </div>
        </header><!-- .page-header -->
   
    <div class="pure-g">
        <div class="container">
            <div class="page-content pure-u-1">
                <?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>

                    <p><?php printf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'phila-gov' ), esc_url( admin_url( 'post-new.php' ) ) ); ?></p>

                <?php elseif ( is_search() ) : ?>

                    <p><?php _e( 'Sorry, nothing has matched your search terms. Please try again with some different words.', 'phila-gov' ); ?></p>
                <?php provide_feedback();?>

                <?php else : ?>

                    <p><?php _e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'phila-gov' ); ?></p>
             

                <?php endif; ?>
            </div><!-- .page-content -->
        </div>
    </div><!-- .pure-g -->
</section><!-- .no-results -->
