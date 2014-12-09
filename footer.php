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

  <footer id="colophon" class="site-footer" role="contentinfo">
        <div class="container">
            <div class="site-info">
                <a href="<?php get_template_part( 'content', 'feedback-url' ); ?>" target="_blank"><?php printf( __( 'Provide Feedback', 'phila-gov' ), 'WordPress' ); ?></a>
                <?php //printf( __( 'Theme: %1$s by %2$s.', 'phila-gov' ), 'phila-gov', '<a href="http://underscores.me/" rel="designer">Underscores.me</a>' ); ?>
            </div><!-- .site-info -->
        </div>
  </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>
  <!--[if lte IE 8]>
      <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive-old-ie-min.css">
    <![endif]-->
    <!--[if gt IE 8]><!-->
      <link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive.css">
    <!--<![endif]-->
</body>
</html>
