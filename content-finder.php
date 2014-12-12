<?php
/**
 * The template used for sortable lists
 *
 * @package phila-gov
 */
?>
<?php
if (is_post_type_archive('department_page')){
    echo '<h1 class="h2">What Department Are You Looking for?</h1>';
    ?>
    <div id="servinfo-list-container">
    <form class="pure-form">
            <input class="pure-input-1 search" type="text" placeholder="Filter results...">
    </form>
    <?php
}elseif (is_tax('topics'))  {
       //echo '<h1 class="h2">What Kind of Information Are You Looking for?</h1>';
    ?>    <div id="servinfo-list-container">
        <h2>  <?php display_current_selected_topic(); ?> </h2>

    <?php } 