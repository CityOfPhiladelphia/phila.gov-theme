<?php
/**
 * The template for displaying archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package phila-gov
 */

get_header();
if ( 'news_post' == get_post_type() ) {
	echo ('its news');
		 $actively_news = true;
	}	?>

	<section id="primary" class="content-area archive row">
	<?php
		if ( $actively_news ) : ?>
			<div id="secondary" class="widget-area small-24 medium-5 columns" role="complementary">
				<?php get_sidebar( ); ?>
			</div><!-- #secondary -->
		<?php endif; ?>

		<main id="main" class="site-main small-24 columns <?php if($actively_news) : ?>medium-19<?php endif; ?>" role="main">

<?php
			if ( have_posts() ) : ?>
        <header>
          <h1>
            <?php
              if ( is_category() ) :
                    single_cat_title();

                elseif ( is_tag() ) :
                    single_tag_title();

                elseif ( is_author() ) :
                    printf( __( 'Author: %s', 'phila-gov' ), '<span class="vcard">' . get_the_author() . '</span>' );

                elseif ( is_day() ) :
                    printf( __( 'Day: %s', 'phila-gov' ), '<span>' . get_the_date() . '</span>' );

                elseif ( is_month() ) :
                    printf( __( 'Month: %s', 'phila-gov' ), '<span>' . get_the_date( _x( 'F Y', 'monthly archives date format', 'phila-gov' ) ) . '</span>' );

                elseif ( is_year() ) :
                    printf( __( 'Year: %s', 'phila-gov' ), '<span>' . get_the_date( _x( 'Y', 'yearly archives date format', 'phila-gov' ) ) . '</span>' );

								elseif ( $actively_news ) :
										_e( 'News', 'phila-gov' );
                else :
                    _e( 'Archives', 'phila-gov' );

                endif;
            ?>
          </h1>
              <?php
                  // Show an optional term description.
                  $term_description = term_description();
                  if ( ! empty( $term_description ) ) :
                      printf( '<div class="taxonomy-description">%s</div>', $term_description );
                  endif;
              ?>
          </header><!-- .page-header -->

          <?php while ( have_posts() ) : the_post(); ?>
						<?php
						if ( $actively_news ) :

							get_template_part( 'partials/content', 'news' );

								else :

                  /* Include the Post-Format-specific template for the content.
                   * If you want to override this in a child theme, then include a file
                   * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                   */

      ?>
				<div class="row">
            <div class="small-24 columns">
                          <?php get_template_part( 'content', get_post_format() ) ?>
                      </div>
                  </div>

							<?php endif; ?>
          	<?php endwhile; ?>

          <?php phila_gov_paging_nav(); ?>

      <?php else : ?>

          <?php get_template_part( 'partials/content', 'none' ); ?>

      <?php endif; ?>

		</main><!-- #main -->

	</section><!-- #primary -->
	<?php
 	get_template_part( 'partials/content', 'modified' );
	get_footer();
?>
