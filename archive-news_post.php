<?php
/**
 * The template for displaying the news archive.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package phila-gov
 */

get_header(); ?>

<section id="primary" class="content-area archive row news">
  <?php
  $current_cat = get_the_category();

  $cat_slug = $current_cat[0]->slug;
  //this filters the OEM featured news out of the main news loop
  if( $cat_slug == 'oem') {
    $args = array(
        'post_type' => 'news_post',
        'category_name' => $cat_slug,
        'tax_query' => array(
          array(
            'taxonomy' => 'news_type',
            'field'    => 'slug',
            'terms'    => 'featured-news',
            'operator' => 'NOT IN',
          ),
        )
    );
  }else{
    $args = array(
        'post_type' => 'news_post',
        'category_name' => $cat_slug
    );
  }
  $filtered_news = new WP_Query( $args );
  if ( $filtered_news->have_posts() ) : ?>
    <header class="columns">
      <h1>
        <?php

        _e( 'NEWS ', 'phila-gov' );

        $taxonomy = 'topics';
        $queried_term = get_query_var($taxonomy);
        if (!$queried_term == 0) :
          $term_obj = get_term_by( 'slug', $queried_term, $taxonomy);
          echo ' | ' . $term_obj->name ;
        elseif (is_category()):
          //$current_cat = get_the_category();
          echo ' | ' . $current_cat[0]->name;
        endif;
        ?>
      </h1>
    </header><!-- .page-header -->
    <main id="main" class="site-main small-24 columns medium-19" role="main">
      <?php while ( $filtered_news->have_posts() ) : $filtered_news->the_post(); ?>
      <?php
        get_template_part( 'partials/content', 'news' );
        endwhile;
          phila_gov_paging_nav();
        else :
          get_template_part( 'partials/content', 'none' );
     endif; ?>

  </main><!-- #main -->

  <div id="secondary" class="widget-area small-24 medium-5 columns" role="complementary">
    <?php //get_sidebar( 'topics' ); ?>
  </div><!-- #secondary -->

</section><!-- #primary -->
<?php
  get_template_part( 'partials/content', 'modified' );
  get_footer();
?>
