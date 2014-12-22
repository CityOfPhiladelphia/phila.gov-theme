<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package phila-gov
 */
?>

      </div><!-- #content -->
 </div><!-- #page -->

      <footer id="colophon" class="pure-g site-footer" role="contentinfo">
            <div class="container">
                <div class="site-info pure-u-1-3">
                    <a href="<?php get_template_part( 'content', 'feedback-url' ); ?>" target="_blank"><?php printf( __( 'Provide Feedback', 'phila-gov' )); ?></a>
                    <?php //printf( __( 'Theme: %1$s by %2$s.', 'phila-gov' ), 'phila-gov', '<a href="http://underscores.me/" rel="designer">Underscores.me</a>' ); ?>
                 </div><!-- .site-info -->
                    <nav class="pure-u-2-3">
                        <ul class="float-right">
                            <li><a href="/terms-of-use">Terms of use</a></li>
                            <li><a href="http://www.phila.gov/privacy/pdfs/FinalCityOpenRecords.pdf">Right to know (pdf)</a></li>
                            <li><a href="/privacypolicy">Privacy Policy</a></li>
                        </ul>
                    </nav>
            </div>
      </footer><!-- #colophon -->
    </div><!-- #page -->

    <?php wp_footer(); ?>
        <!--[if gt IE 8]><!-->
          <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive.css">
        <!--<![endif]-->
</body>
</html>
