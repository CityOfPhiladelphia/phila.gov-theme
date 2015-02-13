<?php
/**
 * The template for displaying the front page.
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
      <div class="home-top">
				<div class="row">
	        <section id="welcome" class="medium-12 columns">
	            <div class="s-box-right">
	              <div class="home-search">
	                <header>
	                    <h1>What can we help you find?</h1>
	                </header>
	                    <?php get_search_form(); ?>
	                    <div class="search-help">e.g. Property Information, Department of Revenue, Water Billing</div>
	                </div>
	                <div id="popular" class="row call-to-action">
	                    <div class="small-6 columns">
	                        <a href="http://iframe.publicstuff.com/#?client_id=242" target="_blank">
	                            <span class="fa-stack fa-3x">
	                              <i class="fa fa-circle fa-stack-2x"></i>
	                              <i class="fa fa-stack-1x fa-inverse"><span class="h6">311</h6></i>
	                            </span>
	                            <h2 class="h3">Submit a Request</h2>
	                            <span class="accessible"> Opens in new window</span>
	                        </a>
	                    </div>
	                    <div class="small-6 columns">
	                        <a href="/browse/payments-and-taxes/pay-a-bill" target="_blank">
	                           <span class="fa-stack fa-3x">
	                              <i class="fa fa-circle fa-stack-2x"></i>
	                              <i class="fa fa-credit-card fa-stack-1x fa-inverse"></i>
	                            </span>
	                            <h2 class="h3">Pay a bill</h2>
	                            <span class="accessible"> Opens in new window</span>
	                        </a>
	                    </div>
	                     <div class="small-6 columns">
	                         <a href="http://property.phila.gov" target="_blank">
	                            <span class="fa-stack fa-3x">
	                              <i class="fa fa-circle fa-stack-2x"></i>
	                              <i class="fa fa-home fa-stack-1x fa-inverse"></i>
	                            </span>
	                            <h2 class="h3">Property Search</h2>
	                             <span class="accessible"> Opens in new window</span>
	                         </a>
	                    </div>
	                      <div class="small-6 columns">
	                        <a href="http://www.phila.gov/personnel//announce/current/index.html" target="_blank">
	                            <span class="fa-stack fa-3x">
	                              <i class="fa fa-circle fa-stack-2x"></i>
	                              <i class="fa fa-briefcase fa-stack-1x fa-inverse"></i>
	                            </span>
	                           <h2 class="h3">Jobs</h2>
	                            <span class="accessible"> Opens in new window</span>
	                        </a>
	                    </div>
	                </div><!--#popular -->
	                </div>
	          </section>
	          <section id="services" class="medium-12 columns">
	            <div class="m-box">
	                    <?php
	                    /* temporary top-level topics list w/ descriptions */
	                       $args = array(
	                            'orderby' => 'name',
	                            'fields'=> 'all',
	                            'parent' => 0,
	                           'hide_empty'=> false
	                       );
	                      $terms = get_terms( 'topics', $args );
	                        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
	                             echo '<ul>';
	                             foreach ( $terms as $term ) {
	                                 echo '<li><a href="/browse/' . $term->slug .  '"><h2>' . $term->name . '</h2>';
	                                 echo '<span>' . $term->description . '</span></a></li>';
	                             }
	                             echo '</ul>';
	                            }

	                            ?>
	          </div>
	        </section>
			</div><!--.row -->
		</div>

      <div class="row">
        <section id="news" class="home-news s-box">
            <?php
                $args = array(
                    'post_type' => array ('news_post'),
                    'posts_per_page'    => 3,
                    'meta_key'          => 'phila_show_on_home',
                    //only show if "yes" is selected
                    'meta_value'     => '1'
                );
                $counter = 0;
                $news_query = new WP_Query($args);
                if ( $news_query->have_posts() ) : while ( $news_query->have_posts() ) : $news_query->the_post(); ?>

                <div class="small-24 medium-7 columns">
                    <div class="story s-box">
                        <?php get_home_news(); ?>
                    </div>
                </div>
            <?php
                $counter++;
                if ($counter === 1 || $counter === 2){
                 echo '<div class="small-1 columns show-for-medium-up"></div>';
                }
            ?>
                <?php endwhile; ?>

                <?php else : ?>
                    <div class="alert">No news!</div>
                <?php endif; ?>

        </section><!--#news-->
          </div><!-- .row -->

                <section id="active" class="row">
                        <div class="container">
                            <div class="small-24 large-17 columns">
                                <div class="s-box active-list">
                                    <header>
                                        <h1>Most Active</h1>
                                    </header>
                                    <dl class="row">
                                        <dt class="small-24 medium-16 columns"><a href="http://property.phila.gov" class="h3" target="_blank">Property Information<span class="accessible"> Opens in new window</span></a>
                                        <span>Property Assessment</span></dt>
                                        <dd class="small-24 medium-16 columns">Search and compare property data in the City of Philadelphia</dd>

                                        <dt class="small-24 medium-8 columns"><a href="http://www.phila.gov/revenue/realestatetax/" class="h3" target="_blank">Real Estate Tax<span class="accessible"> Opens in new window</span></a>
                                        <span>Revenue</span></dt>
                                        <dd class="small-24 medium-16 columns">Real Estate Tax bills are sent in December for the following year and payments are due March 31st.</dd>

                                        <dt class="small-24 medium-8 columns"><a href="http://www.phila.gov/zoningarchive/" class="h3" target="_blank">Zoning Archive<span class="accessible"> Opens in new window</span></a>
                                        <span>L+I</span></dt>
                                        <dd class="small-24 medium-16 columns">Search and view all previous applications, approved uses and site drawings for a parcel of land.</dd>

                                        <dt class="small-24 medium-8 columns"><a href="http://www.phila.gov/prisons/Facilities/Pages/default.aspx" class="h3" target="_blank">Correctional Facilities<span class="accessible"> Opens in new window</span></a>
                                        <span>Prisons</span></dt>
                                        <dd class="small-24 medium-16 columns">Find facility history, visiting rules, and hours.</dd>


                                        <dt class="small-24 medium-8 columns"><a href="http://www.phila.gov/Revenue/individuals/Pages/default.aspx" class="h3" target="_blank">Individual Taxes<span class="accessible"> Opens in new window</span></a>
                                        <span>Revenue</span></dt>
                                        <dd class="small-24 medium-16 columns">Learn about taxes that individuals must remit and/or file in Philadelphia.</dd>
                                    </dl>

                                </div>
                            </div>
                            <div class="small-1 columns"></div>
                                <div class="small-1 large-6 columns links">
                                    <a class="button icon" href="/departments">Department Directory<i class="fa fa-sitemap"></i></a>
                                    <a class="button icon" href="http://www.phila.gov/mayor" target="_blank">Mayor's Office<i class="fa fa-university"></i><span class="accessible"> Opens in new window</span></a>
                                    <a class="button icon" href="http://cityofphiladelphia.wordpress.com/" target="_blank">News<i class="fa fa-microphone"></i><span class="accessible"> Opens in new window</span></a>
                                    <a class="button icon" href="http://www.phila.gov/map" target="_blank">Maps<i class="fa fa-map-marker"></i><span class="accessible"> Opens in new window</span></a>
                                </div>

                            </div>
                        </section><!--#news-->



		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
