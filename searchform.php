<?php
/**
 * The search form
 *
 * @package phila-gov
 */
?>


<form role="search" method="get" class="search-form pure-form" action="<?php echo home_url( '/' ); ?>">
	<label>
		<span class="screen-reader-text"><?php echo _x( 'Search for:', 'label' ) ?></span>
		<input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'e.g. property, revenue department, water bill', 'placeholder' ) ?>" value="<?php echo get_search_query() ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label' ) ?>" />
	</label>
    <button type="submit" class="search-submit pure-button" value="<?php echo esc_attr_x( 'Search', 'submit button' ) ?>"><i class="fa fa-search"></i></button>
</form>