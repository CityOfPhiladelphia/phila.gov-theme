<!-- Timeline content -->
<div class="grid-x grid-margin-x mvl">
  <div class="medium-24 cell pbm">
    <div class="mbl">	
      <?php if( isset($current_row[$current_row_option]['phila_timeline_content']['phila_wysiwyg_title'] )): ?>	
        <?php $current_row_id = sanitize_title_with_dashes( $current_row[$current_row_option]['phila_timeline_content']['phila_wysiwyg_title']);?>
        <h4 id="<?php echo $current_row_id;?>" class="h3 black bg-ghost-gray phm-mu mtn mbm"><?php echo $current_row[$current_row_option]['phila_timeline_content']['phila_wysiwyg_title']; ?></h4>	
      <?php endif;?>	
      <?php if( isset($current_row[$current_row_option]['phila_timeline_content']['phila_wysiwyg_content'] )): ?>	
        <div class="plm">	
          <?php echo apply_filters( 'the_content', $current_row[$current_row_option]['phila_timeline_content']['phila_wysiwyg_content']) ?>	
        </div>	
      <?php endif;?>	
    </div>
    <?php if( isset($current_row[$current_row_option]['phila_timeline_content']) && isset($current_row[$current_row_option]['phila_timeline_content']['timeline-items'])): ?>
      <?php $timeline_items = $current_row[$current_row_option]['phila_timeline_content']['timeline-items']; ?>
      <div class="mbl">
        <div class="plm">
          <!-- Timeline -->
          <div class="timeline">
            <?php $j = 0; ?>
            <?php $temp_month = ''; ?>
            <?php foreach($timeline_items as $item) { ?>
              <div class="timeline-item row">
                <?php $item_date = $item['phila_timeline_item_timestamp']; ?>
                <?php if( phila_translate_date($item_date, $language, 'month-year') != $temp_month ) { ?>
                  <?php $temp_month = phila_translate_date($item_date, $language, 'month-year'); ?>
                  <div class="month-label medium-6 columns" id="<?php echo sanitize_title_with_dashes( $temp_month);?>">
                    <div>
                      <span ><?php echo $temp_month; ?></span>
                    </div>
                  </div>
                <?php } ?>
                <div class="timeline-details medium-18 columns timeline-right">
                  <div class="timeline-dot-container <?php echo ($j == 0) ? 'first-dot' : '' ?>">
                    <div class="timeline-dot"></div>
                  </div>
                  <div class="timeline-text">
                    <div class="timeline-month"><?php echo phila_translate_date($item_date, $language, 'month-day');?></div>
                    <div class="timeline-copy"><?php echo do_shortcode(wpautop( $item['phila_timeline_item'] )); ?></div>
                  </div>
                </div>
              </div>
              <?php $j++; ?>
            <?php } ?>
          </div>
          <!-- /Timeline -->
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>
<!-- /Timeline content -->