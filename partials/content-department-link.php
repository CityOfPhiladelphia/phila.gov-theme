<?php
/* A link pointing to the category in which this content lives */

?>
<div class="back small-text">
  <?php $current_category = get_the_category();

  $department_page_args = array(
  	'post_type' => 'department_page',
    'tax_query' => array(
  		array(
  			'taxonomy' => 'category',
  			'field'    => 'slug',
  			'terms'    => $current_category[0]->slug,
  		),
  	),
    'post_parent' => 0,
    'posts_per_page'      => 1,
  );

  $get_department_link = new WP_Query( $department_page_args );
  if ( $get_department_link->have_posts() ) :

  	while ( $get_department_link->have_posts() ) :
  		$get_department_link->the_post();
        echo '<a href="' . get_the_permalink() . '">';
        echo '«	Back to ' . $current_category[0]->slug .'  </a>';
    endwhile;
  endif;

/* Restore original Post Data */
wp_reset_postdata();
?>
</div>
