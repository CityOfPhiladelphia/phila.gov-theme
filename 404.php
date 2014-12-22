<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="pure-g">
            <div class="container">
                <div class="pure-u-1-3"><img src="http://i1.kym-cdn.com/entries/icons/original/000/002/686/Deal_with_it_dog_gif.gif" alt="deal with it." class="pure-img"></div>
                <div class="pure-u-2-3">
                    <section class="error-404 not-found">
                        <header>
                            <h1><?php _e( 'Sorry, the page you requested was not found.', 'phila-gov' ); ?></h1>
                        </header><!-- .page-header -->
                            <div class="page-content">
                                <p><?php _e( 'It looks like nothing was found at this location.', 'phila-gov' ); ?></p>
                            <div class="search">
                                <h1>What can we help you find?</h1>
                                <?php get_search_form(); ?>
                            </div>

                            </div>
                    </div><!-- .page-content -->
                </section><!-- .error-404 -->
            </div><!-- .container -->
        </div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
