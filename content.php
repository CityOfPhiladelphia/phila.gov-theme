<?php
/**
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class("pure-g"); ?>>
	<header class="entry-header pure-u-1">
		<?php the_title( sprintf( '<h1 class="entry-title container"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h1>' ); ?>

		<?php if ( 'post' == get_post_type() ) : ?>
		<div class="entry-meta">
			<?php phila_gov_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php endif; ?>
       
	</header><!-- .entry-header -->
    <div class="container">
        <div class="entry-content pure-u-1">
            <?php
                /* translators: %s: Name of current post */
                the_content( sprintf(
                    __( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'phila-gov' ),
                    the_title( '<span class="screen-reader-text">"', '"</span>', false )
                ) );
            ?>

            <?php
              //  wp_link_pages( array(
                //    'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
                //    'after'  => '</div>',
            //    ) );
            ?>
        </div><!-- .entry-content -->
    </div>
	<footer class="entry-footer">
		<?php phila_gov_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->