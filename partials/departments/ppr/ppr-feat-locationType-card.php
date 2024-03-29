<?php
  /* PPR Featured location type card */
?>
<div class="cell ppr-feat-locationType large-7 medium-12 small-auto loaded" >
  <div class="ppr-feat-locationType__img-container">
    <div class="ppr-feat-locationType__count-badge"><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span data-count></span></div>
    <a data-slug href="/parks-rec-finder/#/locations/">
        <img data-location_type_photo class="ppr-feat-locationType__img" src="" alt="" />
    </a>
  </div>
    <a data-slug href="/parks-rec-finder/#/locations/">
        <h4 data-name class="ppr-feat-locationType__name"></h4>
    </a>
  <p data-description class="ppr-feat-locationType__desc"></p>
  <?php include(dirname(__FILE__).'/ppr-loader-svg.php'); ?>
</div>
