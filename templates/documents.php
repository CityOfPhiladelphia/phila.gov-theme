<?php
/*
* Template for displaying documents
*/
?>
	<header class="entry-header small-24 columns">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		<?php
			$doc_type_tax = array( 'document_type' );
			$args = array(
					'orderby'           => 'name',
					'order'             => 'ASC',
					'hide_empty'        => true
			);
			$type_terms = get_terms($doc_type_tax, $args);
			if ( !$type_terms == '' ){
				echo '<p class="small-text doc-type"><i class="fa fa-paperclip"></i>';
				foreach ($type_terms as $type){
						echo '<span>' . $type->name . '</span>';
				}
				echo '</p>';
			}
		?>
	</header><!-- .entry-header -->
    <div data-swiftype-index='true' class="entry-content small-24 medium-18 columns">

      <?php
      if (function_exists('rwmb_meta')) {
          $document_description = rwmb_meta( 'phila_document_description', $args = array('type' => 'textarea'));
          echo '<p>' . $document_description . '</p>';
      }
      ?>
    </div><!-- .entry-content -->
		<aside id="secondary" class="small-24 medium-6 columns" role="complementary">
			<?php
				if (function_exists('rwmb_meta')) {
					echo __('<h3 class="alternate">Published</h3>');
					$document_published = rwmb_meta( 'phila_document_released', $args = array('type' => 'date'));
					echo '<span class="small-text">' . $document_published . '</span>';
				}
				//topics
				$doc_topic = array( 'document_topics' );
				$args = array(
						'orderby'           => 'name',
						'order'             => 'ASC',
						'hide_empty'        => true
				);
				$doc_terms = get_terms($doc_topic, $args);
				if ( !$doc_terms == '' ){
					echo __('<h3 class="alternate">Topic</h3>');
					echo '<div class="small-text doc-type">';
					foreach ($doc_terms as $doc){
							echo '<span>' . $doc->name . '</span>';
					}
					echo '</div>';
					}

				?>
		</aside>
