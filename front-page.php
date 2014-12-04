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
                            </div>
                            <div class="pure-g popular">
                                <div class="pure-u-sm-1-4">
                                    <i class="fa fa-exclamation-triangle"></i>
                                    <p>Submit a ticket</p>
                                </div>
                                <div class="pure-u-sm-1-4">
                                    <i class="fa fa-exclamation-triangle"></i>
                                    <p>Pay a bill</p>
                                </div>
                                 <div class="pure-u-sm-1-4">
                                    <i class="fa fa-exclamation-triangle"></i>
                                    <p>Property Search</p>
                                </div>
                                  <div class="pure-u-sm-1-4">
                                    <i class="fa fa-exclamation-triangle"></i>
                                   <p>Maps</p>
                                </div>                               
                                
                                </div><!--.trending -->
                            </div>
                        </section>
                    <section id="services" class="pure-u-md-1-2">
                        <div class="s-box">
                            <h1 class="h2">Services & Information</h1>
                            <?php 
                            /* temporary top-level topics list w/ descriptions */
                               $args = array(
                                    'orderby' => 'name',
                                    'fields'=> 'all',
                                    'parent' => 0
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
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/snow.jpg">
                                    <h3>Snow Emergency Routes</h3>
                                    <span>Streets</span>
                                    <p>Owners of vehicles on Emergency Routes must move them to alternate parking spaces to allow City forces to clear snow.</p>
                                </div>
                            </div>
                          <div class="pure-u-1-24"></div>
                            <div class="pure-u-md-7-24">
                                <div class="story s-box">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/love-christmas.jpg">
                                    <h3>Must-See Holiday Attractions</h3>
                                    <span>Visit Philly</span>
                                    <p>The City of Brotherly Love hosts a festive array of iconic holiday attractions.</p>
                                </div>
                            </div>
                            <div class="pure-u-1-24"></div>
                            <div class="pure-u-md-7-24">
                                <div class="story s-box">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/temp/snow.jpg">
                                    <h3>Neque porro quisquam est</h3>
                                    <span>Sed ut perspiciatis unde omnis</span>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            </div>   
                          
                        </section>
                        </div><!--.pure-u-1-->
                </div><!-- .container -->
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
