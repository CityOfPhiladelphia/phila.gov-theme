<?php
/*
* Template for displaying Publications
*/
?>
	<header class="entry-header small-24 columns">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->
	</div>
	<div class="row">
        <div data-swiftype-index='true' class="entry-content small-24 medium-18 columns">
          <?php the_content(); ?>
          <?php
          if (function_exists('rwmb_meta')) {
              $publications = rwmb_meta( 'phila_publications', $args = array('type' => 'file_advanced'));
              echo '<ul class="document-list">';

              foreach ( $publications as $document ){
                echo '<li>';
                echo "<a href={$document['url']} title={$document['title']}>{$document['title']}</a>";
                echo '</li>';
              }
              echo '</ul>';
          }
          ?>
        </div><!-- .entry-content -->
				<aside id="secondary" class="small-24 medium-6 columns" role="complementary">
					stuff here

				</aside>
	</div><!-- .row -->
