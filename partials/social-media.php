<?php 
  /* Template for social media icon markup 
  *
  */

?>
<?php 
$tweet_intent = isset($tweet_intent) ? $tweet_intent : rwmb_meta('phila_social_intent'); 
$the_title =  isset($the_title) ? $the_title : get_the_title();
$email_title = urlencode(html_entity_decode($the_title));
?>

<div class="social-media">
  <a href="http://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()) ?>" id="fb-share" data-analytics="social" target="_blank"><i class="fab fa-facebook fa-lg" aria-hidden="true"></i><span class="accessible">Share on Facebook</span></a>
  <a href="https://twitter.com/intent/tweet?text=<?php echo ( $tweet_intent != '' ) ? phila_encode_title(rwmb_meta('phila_social_intent') ) :  phila_encode_title( $the_title );?>&url=<?php echo get_permalink()?>" target="_blank"><i class="fab fa-twitter fa-lg" aria-hidden="true"></i><span class="accessible">Share on Twitter</span></a>
  <a translate="no" href="mailto:?subject=<?php echo str_replace('+', '%20', $email_title) ?>&body=<?php echo get_permalink()?>" data-analytics="social"><i class="fas fa-envelope fa-lg" aria-hidden="true"></i><span class="accessible">Send via email</span></a>
  <a href="javascript:window.print()" data-analytics="social"><i class="fas fa-print fa-lg" aria-hidden="true"></i><span class="accessible">Print this page</span></a>
</div>