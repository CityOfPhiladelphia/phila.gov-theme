<?php
/**
 * The template used for displaying the list content
 *
 * @package phila-gov
 */
?>

<li>
    <?php the_title( sprintf( '<a href="%s" rel="bookmark" class="item-link"><h2 class="h3">', esc_url( get_permalink() ) ), '</h2></a>' ); ?>
    <?php
        the_dept_description();
    ?>
</li>
     
