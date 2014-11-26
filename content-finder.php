<?php
/**
 * The template used for displaying finder content
 *
 * @package phila-gov
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('pure-g finder'); ?>>
	<div class="container">
        <header class="pure-u-1">
            <?php the_title( '<h1>', '</h1>' ); ?>
        </header><!-- .entry-header -->
    </div>
    <div class="container">
        <div class="pure-u-1-3">
            <section>
                <?php 
                    $args = array(
                        'orderby' => 'name',
                        'fields'=> 'all'
                   );
                  $terms = get_terms( 'topics', $args );
                    if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
                         echo '<nav>';
                         echo '<ul>';
                         foreach ( $terms as $term ) {
                             echo '<li><h3><a href="' . $term->slug . '">' . $term->name . '</h3>';
                             echo '<p>' . $term->description . '</p></a></li>';
                         }
                         echo '</ul>';
                         echo '</nav>';
                    }
                ?>
            </section>
            <hr>
            
             <section class="main-nav">
              <?php 
                    $args = array(
                        'orderby' => 'name',
                        'fields'=> 'all',
                        'parent' => 0
                   );
                  $terms = get_terms( 'topics', $args );
                    if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
                         echo '<nav>';
                         echo '<ul>';
                         foreach ( $terms as $term ) {
                             echo '<li><h4>' . $term->name . '</h4></li>';
                         }
                         echo '</ul>';
                         echo '</nav>';
                    }
                ?>
                </section>
            <div class="pure-2-3">
        <section class="entry-content">
            
            
        </section>    
        </div>
        </div><!-- .entry-content -->
    </div>
</article><!-- #post-## -->
