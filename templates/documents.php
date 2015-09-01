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
	//$document_description is required so it will always exist
	$document_description = rwmb_meta( 'phila_document_description', $args = array('type' => 'textarea'));
	echo '<p>' . $document_description . '</p>';

	/**
	* Our one function for displaying all the language data
	* @param $the_lang Takes a rwmb_meta object
	* @param $rwmb_file_id needs the $rwmb_meta id
	* @param $lang_name The language the way a native would understand it
	* @param $iso_code HTML Lang attribute
	**/
	function phila_display_alt_lang( $the_lang, $rwmb_file_id, $lang_name, $iso_code ) { ?>
	<div class="row">
		<div class="medium-12 columns">
		<?php
		$the_lang = rwmb_meta( $rwmb_file_id, $args = array('type' => 'file_input'));

		echo '<a href="'. $the_lang .'" class="button icon" lang=' . $iso_code . '>' . $lang_name . '<i class="fa fa-download"></i></a>';

		$id = phila_get_attachment_id_by_url($the_lang);
		$data = wp_prepare_attachment_for_js( $id[0] );
		$file_type = $data['subtype'];
		?>
		<div class="row doc-meta">
			<div class="<?php echo ($is_pdf ? 'small-8' : 'small-12') ?> columns">
				<?php echo __('<h4 class="alternate">Format</h4>');
					echo '<span class="file-type">' . $file_type . '</span>';
				?>
			</div>
			</div><!-- .doc-meta -->
		</div>
	</div><!-- Language .row -->
			<?php
		}

	//set up all the languages
	$document_english= rwmb_meta( 'phila_document_english', $args = array('type' => 'file_input'));
	$document_spanish = rwmb_meta( 'phila_document_spanish', $args = array('type' => 'file_input'));
	$document_french = rwmb_meta( 'phila_document_french', $args = array('type' => 'file_input'));
	$document_chinese = rwmb_meta( 'phila_document_chinese', $args = array('type' => 'file_input'));
	$document_korean = rwmb_meta( 'phila_document_korean', $args = array('type' => 'file_input'));
	$document_khmer = rwmb_meta( 'phila_document_khmer', $args = array('type' => 'file_input'));
	$document_russian = rwmb_meta( 'phila_document_russian', $args = array('type' => 'file_input'));
	$document_vietnamese = rwmb_meta( 'phila_document_vietnamese', $args = array('type' => 'file_input'));

	//Display them if they exist
	if ( $document_english ){ phila_display_alt_lang( $document_english, 'phila_document_english', 'English', 'en');}
	if ( $document_spanish ){ phila_display_alt_lang( $document_spanish, 'phila_document_spanish' ,'Español', 'es'); }
	if ( $document_french ){ phila_display_alt_lang( $document_french, 'phila_document_french', 'Français', 'fr' ); }
	if ( $document_chinese ){ phila_display_alt_lang( $document_chinese, 'phila_document_chinese', '中文', 'zh-Hans'); }
	if ( $document_korean ){ phila_display_alt_lang( $document_korean, 'phila_document_korean', '한국어', 'ko' ); }
	if ( $document_khmer ){ phila_display_alt_lang( $document_khmer, 'phila_document_khmer', 'ភាសាខ្មែរ', ''); }
	if ( $document_russian ){ phila_display_alt_lang( $document_russian, 'phila_document_russian', 'Русский', 'ru' ); }
	if ( $document_vietnamese ){ phila_display_alt_lang( $document_vietnamese, 'phila_document_vietnamese', 'tiếng việt', 'vi'); }
	?>
</div><!-- .entry-content -->
<aside id="secondary" class="small-24 medium-6 columns" role="complementary">
	<?php
		if (function_exists('rwmb_meta')) {
			echo __('<h3 class="alternate">Published</h3>');
			$document_published = rwmb_meta( 'phila_document_released', $args = array('type' => 'date'));
			echo '<span class="small-text">' . $document_published . '</span>';
		}
		echo __('<h3 class="alternate">From</h3>');
		/* A link pointing to the category in which this content lives. We are looking at dpartment pages specifically, so a department link will not appear unless that department is associated with the category in question.  */
		$current_category = get_the_category();

		if ( !$current_category == '' ) :
			$department_page_args = array(
				'post_type' => 'department_page',
				'tax_query' => array(
					array(
						'taxonomy' => 'category',
						'field'    => 'slug',
						'terms'    => $current_category[0]->slug,
					),
				),
				'post_parent' => 0,
				'posts_per_page' => 1,
			);
				$get_department_link = new WP_Query( $department_page_args );
			if ( $get_department_link->have_posts() ) :
				while ( $get_department_link->have_posts() ) :
					$get_department_link->the_post();
					$current_cat_slug = $current_category[0]->slug;
					//we are rendering the depatrtment link elsewhere on document pages.
					if ( $current_cat_slug != 'uncategorized' ) {
						// NOTE: the id and data-slug are important. Google Tag Manager
						// uses it to attach the department to our web analytics.
						echo '<a class="small-text" href="' . get_the_permalink() . '" id="content-modified-department"
									data-slug="' . $current_cat_slug . '">' . get_the_title() . '</a>';
					}
				endwhile;
			endif;
		endif;

		/* Restore original Post Data */
		wp_reset_postdata();
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
