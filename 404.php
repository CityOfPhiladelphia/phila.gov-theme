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
                <div class="pure-u-md-2-3 pure-u-1">
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
                    <div class="pure-u-md-1-3 pure-u-1"></div>
                </section><!-- .error-404 -->
            </div><!-- .container -->
        </div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
