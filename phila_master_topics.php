<?php
/**
 * Template Name: Master Topics List
 *
 * @package phila-gov
 */

get_header(); ?>

  <div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
            <div class="pure-g">
                <div class="container">
                    <header class="pure-u-1">
                        <?php echo the_title(); ?>
                    </header>
                </div>
            </div>
            <div class="pure-g">
                <div class="container">
                    <div class="pure-u-1">
                          <?php get_master_topics(); ?>
                    </div>
                </div>
            </div>

    </main><!-- #main -->
  </div><!-- #primary -->

<?php get_footer(); ?>
