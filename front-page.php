<?php
/**
 * The template for displaying the front page.
 *
 * @package phila-gov
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="pure-g">
                <div class="container">
                    <section id="welcome" class="pure-u-md-1-2">
                        <div class="s-box-right">
                            <header>
                                <h1>
                                    Welcome to <?php util_echo_website_url(); ?>
                                </h1>
                            </header>
                            <div class="search">
                                <p>Find Philadelphia's government services and information, <strong>simpler & faster.</strong></p>
                                <?php get_search_form(); ?>
                                <div class="search-help">e.g. Property Information, Department of Revenue, Water Billing</div>
                            </div>
                            <div id="popular" class="pure-g">
                                <div class="pure-u-1-4">
                                    <a href="http://www.phila.gov/311/form/Pages/default.aspx">
                                        <span class="fa-stack fa-3x">
                                          <i class="fa fa-circle fa-stack-2x"></i>
                                          <i class="fa fa-exclamation-triangle fa-stack-1x fa-inverse"></i>
                                        </span>
                                        <h2>Report a problem to 311</h2>
                                    </a>
                                </div>
                                <div class="pure-u-1-4">
                                    <a href="/browse/taxes-and-payments/make-a-payment">
                                       <span class="fa-stack fa-3x">
                                          <i class="fa fa-circle fa-stack-2x"></i>
                                          <i class="fa fa-credit-card fa-stack-1x fa-inverse"></i>
                                        </span>
                                        <h2>Pay a bill</h2>
                                    </a>
                                </div>
                                 <div class="pure-u-1-4">
                                     <a href="http://property.phila.gov">
                                        <span class="fa-stack fa-3x">
                                          <i class="fa fa-circle fa-stack-2x"></i>
                                          <i class="fa fa-home fa-stack-1x fa-inverse"></i>
                                        </span>
                                        <h2>Property Search</h2>
                                     </a>
                                </div>
                                  <div class="pure-u-1-4">
                                    <a href="http://www.phila.gov/personnel//announce/current/index.html">
                                        <span class="fa-stack fa-3x">
                                          <i class="fa fa-circle fa-stack-2x"></i>
                                          <i class="fa fa-briefcase fa-stack-1x fa-inverse"></i>
                                        </span>
                                       <h2>Jobs</h2>
                                    </a>
                                </div>                               
                                
                            </div><!--#popular -->
                            </div>
                        </section>
                    <section id="services" class="pure-u-md-1-2">
                        <div class="m-box">
                            <h1 class="h2">Services & Information</h1>
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
                </div><!--.container -->
            </div><!--.pure-g -->
            <div class="pure-g">
                <div class="container">
                        <section id="news" class="s-box">
                            <div class="pure-u-md-7-24">
                                <div class="story s-box">
                                    <a href="#"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/snow.jpg" alt=""></a>
                                    <h3>Snow Emergency Routes</h3>
                                    <span>Streets</span>
                                    <p>Owners of vehicles on Emergency Routes must move them to alternate parking spaces to allow City forces to clear snow.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>
                          <div class="pure-u-1-24 hidden-xm hidden-sm"></div>
                            <div class="pure-u-md-7-24">
                                <div class="story s-box">
                                    <a href="#"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/pgw-sign.jpg" alt=""></a>
                                    <h3>Purchase of PGW Terminated</h3>
                                    <span>United Illuminating Company</span>
                                    <p>United Illuminating Company announced termination of its agreement to purchase Philadelphia Gas Works assets.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>
                            <div class="pure-u-1-24 hidden-xm hidden-sm"></div>
                            <div class="pure-u-md-7-24">
                                <div class="story s-box">
                                    <a href="#"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/mayor-nutter-signs-bill.jpg" alt=""></a>
                                    <h3>Marijuana Decriminalization</h3>
                                    <span>Mayor's Office</span>
                                    <p>Mayor Nutter signed legislation to decriminalize the possession and use of 30 grams or less of marijuana. It is still against the law to use, possess or distribute marijuana. Know the facts.</p>
                                    <a href="#" class="read-more">Read More</a>
                                </div>
                            </div>   
                          
                        </section><!--#news-->
                    </div><!--.pure-u-1-->
                </div><!-- .pure-g -->
                <section id="active" class="pure-g">
                        <div class="container">
                            <div class="pure-u-1 pure-u-lg-17-24">
                                <div class="s-box active-list">
                                    <header>
                                        <h1>Most Active</h1>
                                    </header>
                                    <dl class="pure-g">
                                        <dt class="pure-u-1 pure-u-md-1-3"><a href="http://property.phila.gov" class="h3">Property Information</a>
                                        <span>Property Assessment</span></dt>
                                        <dd class="pure-u-1 pure-u-md-2-3">Search and compare property data in the City of Philadelphia</dd>

                                        <dt class="pure-u-1 pure-u-md-1-3"><a href="http://www.phila.gov/revenue/realestatetax/" class="h3">Property Information</a>
                                        <span>Revenue</span></dt>
                                        <dd class="pure-u-1 pure-u-md-2-3">Real Estate Tax bills are sent in December for the following year and payments are due March 31st.</dd>

                                        <dt class="pure-u-1 pure-u-md-1-3"><a href="http://www.phila.gov/zoningarchive/" class="h3">Zoning Archive</a>
                                        <span>L+I</span></dt>
                                        <dd class="pure-u-1 pure-u-md-2-3">Search and view all previous applications, approved uses and site drawings for a parcel of land.</dd>

                                        <dt class="pure-u-1 pure-u-md-1-3"><a href="http://www.phila.gov/prisons/Facilities/Pages/default.aspx" class="h3">Correctional Facilities</a>
                                        <span>Prisons</span></dt>
                                        <dd class="pure-u-1 pure-u-md-2-3">Find facility history, visiting rules, and hours.</dd>


                                        <dt class="pure-u-1 pure-u-md-1-3"><a href="http://www.phila.gov/Revenue/individuals/Pages/default.aspx" class="h3">Individual Taxes</a>
                                        <span>Revenue</span></dt>
                                        <dd class="pure-u-1 pure-u-md-2-3">Learn about taxes that individuals must remit and/or file in Philadelphia.</dd>
                                    </dl>                                            

                                </div>
                            </div>
                            <div class="pure-u-1-24"></div>
                                <div class="pure-u-1 pure-u-lg-6-24 links">
                                    <a class="pure-button departments" href="/departments"><span>Department Directory</span></a>
                                    <a class="pure-button mayor" href="http://phila.gov/mayor"><span>Mayor's Office</span></a>
                                    <a class="pure-button news" href="https://cityofphiladelphia.wordpress.com/"><span>News</span></a>
                                    <a class="pure-button maps" href="http://phila.gov/map"><span>Maps</span></a>
                                </div>
                            </section><!--#news-->
                            </div>
                    </div><!--.pure-u-1-->
                </div><!-- .pure-g -->
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
