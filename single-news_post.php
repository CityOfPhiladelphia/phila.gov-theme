<?php
/**
 * The template used for displaying news pages
 *
 * @package phila-gov
 */

get_header(); ?>
<?php
$terms = get_the_terms( $post->ID, 'topics' );

	if ( $terms && ! is_wp_error( $terms ) ) :

		$current_topics = array();
		$link = array();

		foreach ( $terms as $term ) {
			//parent terms only
			if( 0 == $term->parent ) {
					$current_topics[] = $term->name;
			}
		}
		$topics = join( ", ", $current_topics );
		else :
			$topics = null;
	endif;
	?>

<article id="post-<?php the_ID(); ?>" <?php post_class('news'); ?>>
	<div class="row">
		<header class="entry-header small-24 columns">
			<?php the_title( '<h1 class="entry-title container">', '</h1>' ); ?>
			<div class="entry-meta small-text">
				<span class="entry-date"><?php echo get_the_date(); ?> </span>
				<span class="posted-in">
					<?php echo  (!$topics == null ? ' | Topics: ' . $topics : ''); ?> 
				</span>
			</div>
		</header><!-- .entry-header -->
	</div>
    <div class="row">
        <div class="entry-content small-24 medium-18 columns">
					<?php
					if ( has_post_thumbnail() ) { ?>
	 						<?php	the_post_thumbnail( 'medium', array( 'class' => 'float-left' ) ); ?>

					<?php
					}//end post thumb if
				 	while ( have_posts() ) : the_post();
            if (function_exists('rwmb_meta')) {
              $news_url = rwmb_meta( 'phila_news_url', $args = array('type' => 'url'));
              $news_desc = rwmb_meta( 'phila_news_desc', $args = array('type' => 'textrea'));

              if ($post->post_content != ""){
                the_content();
              }else{
                echo '<p class="description">' . $news_desc . '</p>';
              }
            }

                wp_link_pages( array(
                    'before' => '<div class="page-links">' . __( 'Pages:', 'phila-gov' ),
                    'after'  => '</div>',
                ) );

            endwhile; // end of the loop. ?>


        </div><!-- .entry-content -->
    </div><!-- .row -->
		<?php get_template_part( 'partials/content', 'modified' ) ?>
</article><!-- #post-## -->
<?php get_footer(); ?>
