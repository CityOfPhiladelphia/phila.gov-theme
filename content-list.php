<?php
/**
 * The template used for displaying sotable list content
 *
 * @package phila-gov
 */
?>

<li>

    <?php 
    if (is_tax('topics')){
        the_title( sprintf( '<a href="%s" rel="bookmark" class="item"><h2 class="h3">', esc_url( get_permalink() ) ), '</h2></a>' );
    }else //it's the department list so:
        {
    ?><a href="<?php echo get_permalink(); ?>" class="item"><?php get_department_category(); ?></a>
    <?php
        echo '<p class="item-desc">' . the_dept_description() . '</p>';
    }

    ?>
</li>
     
