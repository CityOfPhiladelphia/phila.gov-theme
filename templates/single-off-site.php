<?php
/* Template part
* for displaying off-site departments
*/
?>
<header class="entry-header small-24 columns">
  <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
</header><!-- .entry-header -->
<div class="entry-content medium-18 small-24 columns end">
    <div class="external-site">
      <p><?php the_title(); ?> has a <strong>separate website</strong>: <a href="<?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?>"><?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?></a></p>

    <a class="button icon" href="<?php echo rwmb_meta( 'phila_dept_url', $args = array('type' => 'url')); ?>">You are now leaving
    <?php util_echo_website_url();?> <i class="fa fa-sign-out"></i></a>
    <?php echo '<p class="description">' . rwmb_meta( 'phila_dept_desc', $args = array('type' => 'textarea')) . '</p>'; ?>
  </div><!-- .external-site -->
</div><!--.entry-content -->