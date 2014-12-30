<?php
/**
 * The template for displaying archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package phila-gov
 */

get_header(); ?>

	<section id="primary" class="content-area archive">
		<main id="main" class="site-main pure-g" role="main">
         <div class="container">
            <div class="pure-u-1">
                    <?php if ( have_posts() ) : ?>
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

                                    elseif ( is_tax( 'post_format', 'post-format-aside' ) ) :
                                        _e( 'Asides', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-gallery' ) ) :
                                        _e( 'Galleries', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-image' ) ) :
                                        _e( 'Images', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-video' ) ) :
                                        _e( 'Videos', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-quote' ) ) :
                                        _e( 'Quotes', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-link' ) ) :
                                        _e( 'Links', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-status' ) ) :
                                        _e( 'Statuses', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-audio' ) ) :
                                        _e( 'Audios', 'phila-gov' );

                                    elseif ( is_tax( 'post_format', 'post-format-chat' ) ) :
                                        _e( 'Chats', 'phila-gov' );

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
                    </div>

                        <?php /* Start the Loop */ ?>
                        <?php while ( have_posts() ) : the_post(); ?>

                            <?php
                                /* Include the Post-Format-specific template for the content.
                                 * If you want to override this in a child theme, then include a file
                                 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                                 */
                    ?>           <div class="container">                   
                                    <div class="pure-u-1">
                                        <?php get_template_part( 'content', get_post_format() ) ?>
                                    </div>
                                </div>
                            <hr>

                        <?php endwhile; ?>

                        <?php //phila_gov_paging_nav(); ?>

                    <?php else : ?>

                        <?php get_template_part( 'content', 'none' ); ?>

                    <?php endif; ?>
         
            </div><!-- .container -->
		</main><!-- #main -->
	</section><!-- #primary -->

<?php get_footer(); ?>
