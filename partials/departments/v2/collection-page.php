<?php
/* Displays contents of a Collection Page Template. */

$row_content = rwmb_meta('collection_row');?>

<?php if (!phila_util_is_array_empty($row_content)) :?>
<!-- Collection page -->
  <section class="mtl">

    <div class="one-quarter-layout">

    <?php $last_key = phila_util_is_last_in_array( (array) $row_content ); ?>

    <?php foreach ($row_content as $key => $value ) :
      $current_row = $row_content[$key];
      $current_row_option = $current_row['phila_collection_options']; ?>

      <?php if ($current_row_option === 'service') : ?>
        <?php $headline = isset($current_row['service_pages']['phila_custom_text_title']) ? $current_row['service_pages']['phila_custom_text_title'] : '<span class="placeholder">Please enter heading title</span>';?>
        <div class="row one-quarter-row mvl collection-services">
          <div class="columns medium-6">
            <h3 id="<?php echo sanitize_title_with_dashes($headline, null, 'save')?>"><?php echo $headline ?></h3>
          </div>
          <div class="columns medium-18">
            <div class="row grid-x fat-gutter">
            <?php foreach( $current_row['service_pages']['phila_v2_service_page'] as $service_page ) : ?>
              <div class="flex-container auto small-24 medium-8 column end">
                <a href="<?php echo get_the_permalink($service_page);?>" class="card sub-topic">
                  <div class="content-block">
                    <h4 class="h3"><?php echo get_the_title($service_page); ?></h3>
                    <?php echo rwmb_meta( 'phila_meta_desc', $args = '', $service_page ); ?>
                  </div>
                </a>
              </div>
            <?php endforeach; ?>
            </div>
          </div>
        </div>
      <?php endif; ?>
      <?php if ($current_row_option === 'document') :  ?>
        <!-- Document pages [DEPRECATED] -->
        <?php $headline = isset($current_row['document_pages']['phila_custom_text_title']) ? $current_row['document_pages']['phila_custom_text_title'] : '<span class="placeholder">Please enter heading title</span>';?>
        <div class="row one-quarter-row mvl">
          <div class="columns medium-6">
            <h3 id="<?php echo sanitize_title_with_dashes($headline, null, 'save')?>"><?php echo $headline ?></h3>
          </div>
          <div class="columns medium-18 pbxl">
            <div class="mbl">
              <?php foreach($current_row['document_pages']['document_page_group'] as $group): ?>
                  <?php $title =    isset($group['phila_custom_wysiwyg']['phila_wysiwyg_title']) ? $group['phila_custom_wysiwyg']['phila_wysiwyg_title'] : '' ;
                  $content = isset ($group['phila_custom_wysiwyg']['phila_wysiwyg_content']) ? $group['phila_custom_wysiwyg']['phila_wysiwyg_content'] : '';
                  ?>
                  <?php if ( $title ) : ?>
                    <h2 class="h3"><?php echo $title?></h2>
                  <?php endif; ?>
                  <?php if ( $content ) : ?>
                    <div class="small-24 medium-24">
                      <p><?php echo $content ?></p>
                    </div>
                  <?php endif; ?>
                  <div class="resource-list">
                    <ul>
                      <?php foreach($group['phila_document_page_picker'] as $doc): ?>
                      <li class="phm pvs clickable-row" data-href="<?php echo get_the_permalink($doc); ?>">
                        <a href="<?php echo get_the_permalink($doc);?>">
                          <div>
                            <i class="fas fa-file-alt fa-lg" aria-hidden="true"></i>
                          </div> <?php echo get_the_title($doc); ?>
                        </a>
                      </li>
                      <?php endforeach; ?>
                    </ul>
                  </div>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
        <!-- / Document pages [DEPRECATED] -->
      <?php endif; ?>
      <?php if ($current_row_option === 'program') :  ?>
        <!-- Program pages -->
        <?php $headline = isset($current_row['program_pages']['phila_custom_text_title']) ? $current_row['program_pages']['phila_custom_text_title'] : '<span class="placeholder">Please enter heading title</span>';?>
        <div class="row one-quarter-row mvl">
          <div class="columns medium-6">
            <h3 id="<?php echo sanitize_title_with_dashes($headline, null, 'save')?>"><?php echo $headline ?></h3>
          </div>
          <div class="columns medium-18">
            <div class="row fat-gutter program-card-row">
              <?php foreach( $current_row['program_pages']['phila_select_programs'] as $program_page ) : ?>
                <div class="medium-12 columns end mbl">
                  <?php $off_site = rwmb_meta('prog_off_site_link', $args = array(), $program_page); ?>
                  <a href="<?php echo !empty($off_site) ? $off_site : get_the_permalink($program_page); ?>" class="card program-card">
                    <?php
                    $img = rwmb_meta( 'prog_header_img', $args = array( 'size' => 'medium', 'limit' => 1 ), $program_page );
                    $img = reset( $img );?>
                    <img src="<?php echo $img['url'] ?>" alt="<?php echo $img['alt']?>" />
                    <div class="content-block">
                        <h4 class="h3 <?php echo !empty($off_site) ? 'external' : ''; ?>"><?php echo get_the_title($program_page); ?></h4>
                      <?php echo rwmb_meta( 'phila_meta_desc', $args = '', $program_page ); ?></h4>
                    </div>
                  </a>
                </div>
            <?php endforeach; ?>
          </div>
        </div>
        <?php if (isset($current_row['program_pages']['phila_v2_programs_link'] )):  ?>
          <div class="float-right">
            <a href="<?php echo $current_row['program_pages']['phila_v2_programs_link']?>">See all programs ></a>
          </div>
        <?php endif; ?>
      </div>
      <!-- /Program pages -->
      <?php endif; ?>

      <?php if ($current_row_option === 'free_text') :  ?>
        <!-- Free text -->
        <?php foreach( $current_row['free_text'] as $free_text ) :
          ?>
          <?php $headline = isset($free_text['phila_custom_wysiwyg']['phila_wysiwyg_title']) ? $free_text['phila_custom_wysiwyg']['phila_wysiwyg_title'] : '<span class="placeholder">Please enter heading title</span>'; ?>
          <?php $expand_collapse = isset($free_text['expand_collapse']) ? $free_text['expand_collapse'] : ''; ?>

          <div class="row one-quarter-row mvl">
            <div class="columns medium-6">
                <h3 id="<?php echo sanitize_title_with_dashes($headline, null, 'save')?>"><?php echo $headline ?></h3>
            </div>
            <div class="columns medium-18">
            <?php if ($expand_collapse == 1) :?>
              <div class="expandable" aria-controls="<?php echo sanitize_title_with_dashes($headline, null, 'save') . '-control' ?>" aria-expanded="false">
            <?php endif; ?>
              <?php echo apply_filters( 'the_content', $free_text['phila_custom_wysiwyg']['phila_wysiwyg_content'] ); ?>
              <?php if ($expand_collapse == 1) :?>
                  </div><a href="#" data-toggle="expandable" class="float-right" id="<?php echo sanitize_title_with_dashes($headline, null, 'save') . '-control' ?>"> More + </a>
              <?php endif; ?>
            </div>

          </div>
          <?php endforeach; ?>
          <!-- Free text -->
      <?php endif; ?>

      <?php if ($current_row_option === 'stepped_process') :  ?>
        <?php $stepped_content = $current_row['stepped_process']; ?>
        <?php include(locate_template('partials/departments/v2/stepped-process-wrapper.php')); ?>
      <?php endif; ?>

      <?php if ($current_row_option === 'phila_resource_group') :  ?>
        <?php include(locate_template('partials/departments/v2/grouped-resources.php')); ?>
      <?php endif; ?>

      <?php if ($current_row_option === 'paragraph_text_with_photo') :  ?>
        <?php include(locate_template('partials/departments/v2/paragraph-text-with-photo.php')); ?>
      <?php endif; ?>

      <?php if ($current_row_option === 'post') :  ?>
        <?php include(locate_template('partials/departments/v2/collection-posts.php')); ?>
      <?php endif; ?>

      <?php if ($current_row_option === 'press_releases') :  ?>
        <?php include(locate_template('partials/departments/v2/collection-page-press-releases.php')); ?>
      <?php endif; ?>

      <?php if ($current_row_option === 'phila_callout_v2') :  ?>
        <?php include(locate_template('partials/departments/v2/collection-callout.php')); ?>
      <?php endif; ?>
      <?php if ($current_row_option === 'member_list') :  ?>
        <?php $members = $current_row['member_list']['members']; ?>
        <?php $section_title = $current_row['member_list']['section_title']; ?>
        <?php include(locate_template('partials/departments/v2/member_list.php')); ?>
      <?php endif; ?>
      <?php if ($last_key != $key) : ?>
        <hr class="margin-auto"/>
      <?php endif; ?>

    <?php endforeach ?>
    </div>
    </section>
  <?php wp_reset_postdata(); ?>
<!-- /Collection page -->
<?php endif; ?>