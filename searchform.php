<?php
/**
 * The search form
 *
 * @package phila-gov
 */
?>


<form role="search" method="get" class="search" action="<?php echo home_url( '/' ); ?>">
	<label>
		<span class="screen-reader-text"><?php echo _x( 'Search for:', 'label' ) ?></span>
		<input type="text" class="search-field" placeholder="<?php echo esc_attr_x( 'I\'m looking for...', 'placeholder' ) ?>" value="<?php echo get_search_query() ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label' ) ?>" id="search-form"/>
	</label>
    <input type="submit" class="search-submit" value="<?php echo esc_attr_x( 'Search', 'submit button' ) ?>"><i class="fa fa-search"></i></input>
</form>
