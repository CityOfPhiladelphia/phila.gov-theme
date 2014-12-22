<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package phila-gov
 */
?>
    <?php
        if (is_front_page()){
            //nothing
        }elseif (is_post_type_archive('department_page')){
            //nothing
        }
        elseif (is_page()){ ?>
<div class="pure-g">
    <div class="container">
    <div class="pure-u-1">
        <div class="lost">
        <?php echo 'Can\'t find what you are looking for? <a href="';
            echo get_template_part( 'content', 'feedback-url' ); 
            echo 'target="_blank"> Let us know</a>.'; ?>
                </div>
            </div>
        </div>
    </div>
<?php
                           
        }elseif(is_page_template('taxonomy-topics.php') ||      is_tax('topics')){  ?>
<div class="pure-g">
    <div class="container">
    <div class="pure-u-1">
        <div class="lost">
        <?php 
            echo 'Can\'t find what you\'re looking for? We\'re still moving content. <a href="https://docs.google.com/forms/d/16i1gP0lSdquHUlAV26-9K04WkwHI1TAjuAhJGMU0nA0/viewform?entry.2063571544&entry.1408587938=';
            echo $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"] . '" target="_blank">';
            echo 'Let us know what you are trying to find</a>.'; ?>
                </div>
            </div>
        </div>
    </div>
<?php
        }elseif(is_single()){ ?>
    <div class="pure-g">
        <div class="container">
            <div class="pure-u-1">
                <div class="lost">
        <?php
            echo 'Is this information incorrect? <a href="';
            echo get_template_part( 'content', 'feedback-url' );                 echo 'target="_blank"> Let us know</a>.'; ?>
                    </div>
                </div>
        </div>
    </div>
<?php } ?>
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
