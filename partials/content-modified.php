<?php
/**
 * The template part for displaying when content was last modified.
 *
 *
 * @package phila-gov
 */
?>
<div class="row">
  <div class="small-24 columns">
    <hr>
    <p class="small-text">This content was last modified on <time datetime="<?php the_modified_time('c'); ?>"><?php the_modified_date(); ?></time></p>
  </div>
</div>
