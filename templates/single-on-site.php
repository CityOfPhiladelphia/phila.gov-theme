<?php

/* ]
* Template part
* for displaying on-site departments
*/
?>
<header class="entry-header small-24 columns">
  <?php the_title( '<h1 class="entry-title hide">', '</h1>' ); ?>
</header><!-- .entry-header -->
<?php
  $category = get_the_category();
  $cat_slug =	$category[0]->slug;
  /*sidebars are generated by what is in the sidebar widget area */
  if ( is_active_sidebar( 'sidebar' .	$cat_slug ) ) : ?>
    <div id="sidebar" class="medium-8 columns">
    <?php
      if ( has_post_thumbnail() ) { ?>
        <div class="logo">
          <?php the_post_thumbnail(); ?>
        </div><?php
        }
      ?>
      <div class="inner">
          <?php dynamic_sidebar( 'sidebar' .	$cat_slug ); ?>
      </div>
    </div>

<?php endif; ?>
  <div class="entry-content medium-16 small-24 columns">
     <?php echo the_content();?>
  </div>
