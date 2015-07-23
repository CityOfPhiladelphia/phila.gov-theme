<?php

/*
* Template part
* for displaying on-site departments
*/
?>
<?php
  $category = get_the_category();
  $cat_slug =	$category[0]->slug;
  $cat_id =	$category[0]->cat_ID;
  $sidebar_name = 'sidebar-' .	$cat_slug . '-' . $cat_id;
  /*sidebars are generated by what is in the sidebar widget area */
  if ( is_active_sidebar( $sidebar_name ) ) : ?>
    <div id="sidebar" class="medium-8 columns">
    <?php
    $has_sidebar = true;
      if ( has_post_thumbnail() ) { ?>
        <div class="logo">
          <?php the_post_thumbnail(); ?>
        </div>
        <?php
      }elseif (has_post_thumbnail( $post->post_parent )) {
        ?><div class="logo">
            <?php echo get_the_post_thumbnail( $post->post_parent );?>
          </div>
        <?php }else { }
        ?>
      <div class="inner">
        <?php dynamic_sidebar( $sidebar_name ); ?>
      </div>
    </div>

<?php endif; ?>
  <header class="entry-header on-site <?php echo ($has_sidebar) ? 'medium-16' : 'medium-24'; ?> small-24 columns">
    <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
  </header><!-- .entry-header -->
  <div data-swiftype-index='true' class="entry-content <?php echo ($has_sidebar) ? 'medium-16' : 'medium-24'; ?> small-24 columns">
     <?php echo the_content();?>
  </div>
