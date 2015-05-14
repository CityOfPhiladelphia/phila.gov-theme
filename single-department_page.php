<?php
/**
 * The template used for displaying  department websites
 *
 * @package phila-gov
 */

get_header();
?>
<?php /*

Allow screen readers / text browsers to skip the navigation menu and
get right to the good stuff. */ ?>

<div class="skip-link screen-reader-text">
		<a href="#content" title="<?php esc_attr_e( 'Skip to content', 'twentyten' ); ?>">
		<?php _e( 'Skip to content', 'twentyten' ); ?></a>
</div>
<?php
	/*
	Our navigation menu. We use categories to drive functionality.
	This checks to make sure a category exisits for the given page,
	if it does, we render our menu w/ markup.
	*/
		get_department_menu();
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('row department'); ?>>
<?php
	if (function_exists('rwmb_meta')) {
			$external_site = rwmb_meta( 'phila_dept_url', $args = array('type' => 'url'));
	if (!$external_site == ''){

		get_template_part( 'templates/single', 'off-site' );

 	} else {
  //loop for our regularly scheduled content
	   while ( have_posts() ) : the_post();
				get_template_part( 'templates/single', 'on-site' );
	    endwhile;
		}
	}
?>
</article><!-- #post-## -->
<?php get_template_part( 'partials/content', 'modified' ) ?>

<?php get_footer(); ?>
