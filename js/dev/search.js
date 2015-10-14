(function ($) {

/*
mustache templating?
<article id="post-<?php the_ID(); ?>">

	<header class="search-entry-header">
		<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-summary">
		<?php the_excerpt(); ?>
	</div><!-- .entry-summary -->

</article><!-- #post-## -->
<hr>
*/

var customRenderer = function(documentType, item) {
  var result = '<div class="st-result">';
  result += '<a href="' + item.url + '" class="st-search-result-link">';
  result += item.title + '</a></h3><div class="st-metadata"><span class="st-snippet">';
  result += item.highlight.body || item.body.substring(0, 300)
  result += '</span></div></div>';
  return result;
};

var $resultCount = $('#result-count');

var customPostRenderFunction = function(data) {
  var totalResultCount = 0;
  var $resultContainer = this.getContext().resultContainer;
  var spellingSuggestion = null;

  if (data['info']) {
    $.each(data['info'], function(index, value) {
      totalResultCount += value['total_result_count'];
      if ( value['spelling_suggestion'] ) {
        spellingSuggestion = value['spelling_suggestion']['text'];
      }

    });
  }

  if (totalResultCount === 0) {
    $resultCount.text("No results found");
  } else {
    $resultCount.html("Found <b>" + totalResultCount + "</b> results");
  }

  if (spellingSuggestion !== null) {
    $resultContainer.append('<div class="st-spelling-suggestion">Did you mean <a href="#" data-hash="true" data-spelling-suggestion="' + spellingSuggestion + '">' + spellingSuggestion + '</a>?</div>');
  }
};

$("#search-form").swiftypeSearch({
  engineKey: SWIFTYPE_ENGINE, // Env var set in footer by php
  resultContainingElement: '#st-results-container',
  renderFunction: customRenderer,
  postRenderFunction: customPostRenderFunction
});

})(jQuery);
