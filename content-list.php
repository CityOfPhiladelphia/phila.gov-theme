<?php
/**
 * The template used for displaying the list content
 *
 * @package phila-gov
 */
?>

<li>
    <?php the_title( sprintf( '<a href="%s" rel="bookmark" class="item-link"><h1 class="h3">', esc_url( get_permalink() ) ), '</h1></a>' ); ?>
    <?php
        the_dept_description();
    ?>
</li>
     
