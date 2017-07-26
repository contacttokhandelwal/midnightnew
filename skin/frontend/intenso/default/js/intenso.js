/**
 * Intenso Theme Library
 * http://itactica.com/intenso
 * Copyright 2014-2016, ITACTICA
 * http://getintenso.com/license
 */

;(function ($, window, document, undefined) {
    'use strict';

    /**
     * Description:  Parses data-options attribute
     * Arguments:  'el' (jQuery Object): Element to be parsed.
     * Returns:  Options (Javascript Object): Contents of the element's data-options attribute.
     */
    var data_options = function(el) {
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
                return el.data('options');
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
            return cached_options;
        }

        opts_arr = (cached_options || ':').split(';'),
            ii = opts_arr.length;

        function isNumber (o) {
            return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
            if (typeof str === 'string') return $.trim(str);
            return str;
        }

        while (ii--) {
            p = opts_arr[ii].split(':');

            if (/true/i.test(p[1])) p[1] = true;
            if (/false/i.test(p[1])) p[1] = false;
            if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

            if (p.length === 2 && p[0].length > 0) {
                opts[trim(p[0])] = trim(p[1]);
            }
        }

        return opts;
    };

    var createCookie = function(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    };

    var readCookie = function(name) {
        var nameEQ = escape(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    var eraseCookie = function(name) {
        createCookie(name, "", -1);
    };

    var random_str = function(length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        while (length--) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    var replace_inline_SVG = function() {
        // handles inline SVG images in case the browser doesnÂ´t support SVG format
        if(!Modernizr.svg) {
            $('img[src*="svg"]').attr('src', function () {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    };

    var toggle_input_placeholder = function() {
        // toggle input's placeholder text
        if($(".placeholder").val()!=''){
            $(".placeholder").next("label").hide();
        }
        $(".placeholder").focus(function() {
            $(this).next("label").hide();
        });
        $(".placeholder").focusout(function() {
            if($(this).val()!=''){
                $(this).next("label").hide();
            } else {
                $(this).next("label").show();
            }
        });
    };

    var init_form_select = function() {
        if ($('body').hasClass('mdformfields')) {
            // init Chosen select boxes
            var selectEl,
                selectVal,
                loop;
            if($.fn.chosen){
                $("select").each(function(){
                    if ($(this).hasClass('no-display')) return;
                    $(this).chosen({
                        disable_search_threshold: 10,
                        width: 'auto',
                    });
                    // dismiss validation-advice onchange
                    $(this).on('change', function() {
                        $(this).siblings('.validation-advice').hide(300);
                    });
                    // update original select boxes for configurable products on product's page
                    if ($(this).hasClass('super-attribute-select') || $(this).hasClass('product-custom-option')
                        || this.id == 'limits' || this.id == 'orders' || $(this).hasClass('simulate-change')) {
                        $(this).on('change keyup', function(event, loop) {
                            if ($(selectEl).attr('id') == $(this).attr('id')
                                && JSON.stringify(selectVal) == JSON.stringify($(this).val())) return;
                            selectEl = $(this)[0];
                            selectVal = $(this).val();
                            setTimeout(function(){
                                if (selectEl === event.target) {
                                    selectEl.simulate('change');
                                }
                                $("select").each(function(){
                                    $(this).trigger("chosen:updated");
                                });
                            },0);
                        });
                    }
                });
            };
            $('.input-box').has('select').addClass('input-box-select');
            $('.input-box').has('select').parent().addClass('select-list');
            // temporary fix for issue #1887 (https://github.com/harvesthq/chosen/issues/1887)
            $('.chosen-container .chosen-results').on('touchend', function(event) {
                event.stopPropagation();
                event.preventDefault();
                return;
            });
        }
    };

    var input_focus = function(el) {
        if ($('body').hasClass('mdformfields')) {
            var mainColor,
                top;
            if ($(el).is(":focus")) $(el).parents('.input-box').addClass('focus');
            if ($(el).val().length > 0) {
                if ($(el).parents('.input-box').hasClass('fade-label')) {
                    $(el).parents('.input-box').siblings('label').hide();
                } else {
                    mainColor = $('.main-color').css('color');
                    if (typeof mainColor === 'undefined' || mainColor.length == 0) mainColor = '#999';
                    top = ($(el).is("textarea")) ? 26 : 18;

                    if (!$(el).hasClass('label-animated')) {
                        $(el).addClass('label-animated');
                        $(el).parents('.input-box').siblings('label').animate({
                            top: '-='+top,
                            fontSize: '-=1'
                        }, 150, function() {
                            $(this).css({'font-weight': 'normal', 'color': mainColor});
                        });
                    }
                }
            }
        }
        // dismiss validation-advice onchange
        $(el).on('change keyup', function() {
            $(this).siblings('.validation-advice').hide(300);
        });
    };

    var input_blur = function(el) {
        if ($('body').hasClass('mdformfields')) {
            $(el).parents('.input-box').removeClass('focus');
            if ($(el).val().length == 0) {
                $(el).removeClass('label-animated');
                $(el).parents('.input-box').siblings('label').show();
                $(el).parents('.input-box').siblings('label').css({
                    'top': '',
                    'font-size': '',
                    'font-weight': '',
                    'color': ''
                });
            }
        }
    };

    var fix_label = function() {
        if ($('body').hasClass('mdformfields')) {
            // add class to textarea's label
            fix_textarea();
            // add class to checkbox's label
            fix_checkbox();
            // for ajax generated forms distpaching a custom event is needed for this to work
            $(document).on('new:ajaxform', function() {
                fix_textarea();
                fix_checkbox();
                init_form_select();
            });
        }
    };

    var fix_textarea = function() {
        $('.input-box').each(function() {
            $(this).has('textarea').addClass('textarea');
            $(this).has('textarea').siblings('label').addClass('textarea');
        });
    };

    var fix_checkbox = function() {
        $('.input-box').each(function() {
            if ($(this).children("input[type='checkbox']").length > 0) {
                $(this).addClass('checkbox');
                $(this).siblings('label').addClass('checkbox');
            }
        });
    };

    var bind_inputbox_focus = function() {
        // apply focus effect to labels in case they are prefilled when page load
        $('.input-text').each(function() {
            input_focus(this);
        });
        // bind focus event to every inputbox
        $(document).on('focus keyup change input', '.input-text', function() {
            input_focus(this);
        });
        $('#newsletter').on('focus keyup change input', function() { input_focus(this); });
        $('#newsletter-popup').on('focus keyup change input', function() { input_focus(this); });
        // for programmatically filled or ajax generated forms
        $(document).on('new:ajaxform', function() {
            $('.input-text').each(function() {
                input_focus(this);
            });
            $("select").each(function(){
                $(this).trigger("chosen:updated");
            });
        });
        $(document).on('focusout', '.input-text', function() {
            input_blur(this);
        });
        $('#newsletter').on('focusout', function() { input_blur(this); });
        $('#newsletter-popup').on('focusout', function() { input_blur(this); });
        // bind focus event to every textarea
        $(document).on('focus keyup change input', 'textarea', function() {
            input_focus(this);
        });
        $(document).on('focusout', 'textarea', function() {
            input_blur(this);
        });
    };

    var toggle_newsletter_inputbox = function() {
        // On click event to open and close newsletter inputbox
        $('.newsletter-subscribe').on('click', function(e) {
            e.preventDefault();
            $('.newsletter-ribbon .newsletter-subscribe-form').slideToggle(50);
        });
    };

    var toggle_tags_inputbox = function() {
        // On click event to open and close tags inputbox
        $('#add-tag').on('click', function(e) {
            e.preventDefault();
            $('#addTagForm').slideToggle(50);
        });
    };

    var toggle_secmenu = function() {
        $('.icon-sec-menu').hover(function(e) {
            $('.sec-menu-dropdown').addClass('show');
        }, function(e) {
            if(e.target.tagName.toLowerCase() != 'select'
                && e.target.tagName.toLowerCase() != 'option') {
                $('.sec-menu-dropdown').removeClass('show');
            }
        });
    };

    var init_mega_menu = function() {
        if ($('.main-nav > .top-bar-section').hasClass('hover')) {
            $(".level0.has-dropdown").hoverIntent({
                over: show_mega_menu,
                out: hide_mega_menu,
                timeout: 300
            });
        } else {
            $('.level0.has-dropdown').click(function (e) {
                if (e.target.className == 'level0 has-children') e.preventDefault();
                if ($(this).hasClass('hover') && e.target.className == 'level0 has-children') {
                    $(this).removeClass('hover');
                    $(this).find('.level0.dropdown').removeClass('display-menu');
                } else {
                    $('.level0.has-dropdown').removeClass('hover');
                    $('.level0.has-dropdown').find('.level0.dropdown').removeClass('display-menu');
                    show_mega_menu(this);
                }
            });
            $(document).click(function (e) {
                if ($(e.target).parents('.level0.has-dropdown').length <= 0) {
                    $('.level0.has-dropdown').removeClass('hover');
                    $('.level0.has-dropdown').find('.level0.dropdown').removeClass('display-menu');
                }
            });
        }
        $('.top-bar-section .right li.has-dropdown').hoverIntent({
            over: show_dropdown,
            out: hide_dropdown,
            timeout: 100
        });
    };

    var show_mega_menu = function(el) {
        el = typeof el.currentTarget === 'undefined' ? el : el.currentTarget;
        var packeryGrid = $(el).find('.level0.dropdown.mm-grid');
        $(el).addClass('hover');
        $(el).find('.level0.dropdown').show();
        $(el).find('.level0.dropdown').addClass('display-menu');
        if (Modernizr.mq('only screen and (min-width: 40em)')) {
            if (packeryGrid.length && !packeryGrid.data('isotope')) {
                adjust_column_width_for_packery(packeryGrid);
                // initialize packery.js to position subcategory blocks
                packeryGrid.isotope({
                    layoutMode: 'packery',
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    transitionDuration: 0,
                    sortBy: 'original-order'
                });
                remove_left_border(packeryGrid);
            } else if (packeryGrid.length && packeryGrid.data('isotope')) {
                adjust_column_width_for_packery(packeryGrid);
                packeryGrid.isotope('layout');
                remove_left_border(packeryGrid);
            }
        } else {
            // remove packery on mobile
            if (packeryGrid.data('isotope')) {
                packeryGrid.isotope('destroy');
                packeryGrid.find('li.level1').css('width', '');
            }
        }
    };

    var adjust_column_width_for_packery = function(packeryGrid) {
        // if mega-menu has right block, adjust the width of list items to solve packery.js issue with padding
        var originalWidth, colNum, diff,
            megaMenuRightPadding = packeryGrid.css('padding-right').replace('%', ''),
            megaMenuWidth = packeryGrid.width(),
            listEl = packeryGrid.find('li.level1');
        if (megaMenuRightPadding.indexOf('px') > -1) { // if padding is expressed in pixels convert px to percentage
            megaMenuRightPadding = megaMenuRightPadding.replace('px', '');
            megaMenuWidth = +megaMenuWidth + +megaMenuRightPadding;
            megaMenuRightPadding = Math.ceil(megaMenuRightPadding / megaMenuWidth * 100);
        }
        listEl.css('width', '');
        originalWidth = listEl.width();
        colNum = Math.round(100 / originalWidth);
        diff = Math.ceil(megaMenuRightPadding / colNum);
        listEl.css('width', originalWidth - diff + '%');
    };

    var remove_left_border = function(packeryGrid) {
        packeryGrid.find('li.level1').each(function() {
            $(this).css({
                'border-left' : '',
                'padding-right' : '1px'
            });
            if ($(this).css('left') === '0px') $(this).css({'border-left':'0','padding-right':'1px'});
        });
    };

    var hide_mega_menu = function() {
        $(this).removeClass('hover');
        $(this).find('.level0.dropdown').hide();
        $(this).find('.level0.dropdown').removeClass('display-menu');
    };

    var show_dropdown = function() {
        $(this).addClass('hover');
        $(this).find('ul.dropdown').show();
    };

    var hide_dropdown = function() {
        $(this).removeClass('hover');
        $(this).find('ul.dropdown').hide();
    };

    var init_vertical_menu = function() {
        $('.vertical ul.left').show();
        if ($('.right-off-canvas-menu.main-nav').hasClass('vertical')) {
            var touchmoved;
            $('.vertical ul.left li:not(:first)').hide();
            $('.vertical-menu-link').on('click','a',function(e){e.preventDefault(); });

            $('.vertical-menu-link').hoverIntent({
                over: function() {
                    $(this).addClass('v-hover');
                    $('.vertical ul.left li:not(:nth-child(2)):not(.js-generated)').show();
                    if ($('.vertical-menu-overlay').length == 0) {
                        $('.inner-wrap').append('<div class="vertical-menu-overlay"></div>');
                    }
                },
                out: function() { return false; },
                timeout: 300
            });
            $('.vertical ul.left').mouseleave(function(e) {
                if (Modernizr.mq('only screen and (min-width: 40.063em)')) {
                    $('.vertical-menu-link').removeClass('v-hover');
                    $('.vertical-menu-link').removeClass('hover');
                    $('.vertical ul.left li:not(:nth-child(2))').hide();
                    $('.vertical-menu-overlay').remove();
                }
            });
            $('.vertical .custom-menu').hoverIntent({
                over: function() {
                    if (Modernizr.mq('only screen and (min-width: 40.063em)')) {
                        $(this).addClass('hover');
                        $(".vertical ul.left li:not(:nth-child(2))").hide();
                        $('.vertical-menu-link').removeClass('v-hover');
                        $('.vertical-menu-link').removeClass('hover');
                        $('.vertical-menu-overlay').remove();
                    }
                },
                out: function() {
                    $(this).removeClass('hover');
                },
                timeout: 300
            });
            $('.vertical-menu-overlay').on('touchend', function(e){
                if(touchmoved != true){
                    $(".vertical ul.left li:not(:nth-child(2))").hide();
                    $('.vertical-menu-overlay').remove();
                }
            }).on('touchmove', function(e){
                touchmoved = true;
            }).on('touchstart', function(){
                touchmoved = false;
            });
            $('.vertical ul.left li.level0:not(.custom-menu):last').addClass('last-vt');
            $(window).on('orientationchange resize', function(e) {
                self.calculateDropdownsWidth();
                if (Modernizr.mq('only screen and (max-width: 40em)')) {
                    $(".vertical ul.left li:not(:nth-child(2))").show();
                } else if($('html').hasClass('no-touch')) {
                    $(".vertical ul.left li:not(:nth-child(2))").hide();
                    $('.vertical-menu-overlay').remove();
                }
            });
            self.calculateDropdownsWidth();
            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                $(".vertical ul.left li:not(:nth-child(2))").show();
            }
        }
    };

    self.calculateDropdownsWidth = function() {
        // calculates width of divs for vertical menu dropdowns and any custom dropdown
        var dropdown = $('.vertical .top-bar-section ul.left li.mega-menu ul.level0').add('.vertical .top-bar-section ul.left li.mega-menu div.dropdown'),
            screen_width = parseInt($('.off-canvas-wrap').width()),
            menu_width = $('.vertical ul.left').width(),
            margin_left = parseInt($('.vertical ul.left').css('margin-left')),
            dropdown_width = screen_width - menu_width - (margin_left * 2),
            custom_megamenu_width = screen_width - (screen_width*0.07),
            rightblock_width,
            custom_megamenu_offset,
            menu_item_width = $('.vmenu-title').outerWidth() + 50;
        $('.vertical ul.left > li:nth-child(2)').css('width', menu_item_width);
        $('.vertical ul.left li.custom-menu').each(function(index){
            menu_item_width = menu_item_width + 30;
            $(this).css('left', menu_item_width);
            menu_item_width = menu_item_width + $(this).outerWidth();
        });

        dropdown.each(function(){
            var style = $(this).attr('style');
            style = (typeof style === 'undefined') ? '' : style.replace(/width:.+/g, '');

            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                $(this).attr('style', style);
            } else {
                if (!(rightblock_width = $(this).find('.mega-menu-right-block').css('width')) > 0) rightblock_width = 0;
                custom_megamenu_offset = ($(this).parent('.custom-menu').offset()) ? $(this).parent('.custom-menu').offset() : 0;
                custom_megamenu_offset = parseInt(custom_megamenu_offset.left) - screen_width*0.035;
                if (rightblock_width && rightblock_width.indexOf('px') > -1) {
                    if ($(this).hasClass('custom-dropdown')) {
                        $(this).attr('style', 'width: '+custom_megamenu_width+'px !important; padding-right: '+rightblock_width+'; margin-left: -'+custom_megamenu_offset+'px !important;');
                    } else {
                        $(this).attr('style', 'width: '+dropdown_width+'px !important; padding-right: '+rightblock_width+';');
                    }
                } else {
                    if ($(this).hasClass('custom-dropdown')) {
                        $(this).attr('style', 'width: ' + custom_megamenu_width + 'px !important; padding-right: ' +
                            (dropdown_width * $(this).find('.mega-menu-right-block').outerWidth() / 100) + 'px; margin-left: -'+custom_megamenu_offset+'px !important;');
                    } else {
                        $(this).attr('style', 'width: ' + dropdown_width + 'px !important; padding-right: ' +
                            (dropdown_width * $(this).find('.mega-menu-right-block').outerWidth() / 100) + 'px;');
                    }
                }
            }
        });
    };

    var touch_exit_canvas = function() {
        // Allow closing Foundation Off Canvas Menu by swiping on touch devices
        var idx = 0;
        var exit_off_canvas = $('.exit-off-canvas');
        exit_off_canvas.on('touchstart.fndtn.offcanvas', function(e) {
                if (!e.touches) {e = e.originalEvent;}
                var data = {
                    start_page_x: e.touches[0].pageX,
                    start_page_y: e.touches[0].pageY,
                    start_time: (new Date()).getTime(),
                    delta_x: 0,
                    is_scrolling: undefined
                };
                exit_off_canvas.data('swipe-transition', data);
                e.stopPropagation();
            })
            .on('touchmove.fndtn.offcanvas', function(e) {
                if (!e.touches) { e = e.originalEvent; }
                // Ignore pinch/zoom events
                if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                var data = exit_off_canvas.data('swipe-transition');
                if (typeof data === 'undefined') {data = {};}

                data.delta_x = e.touches[0].pageX - data.start_page_x;

                if ( typeof data.is_scrolling === 'undefined') {
                    data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                }

                if (!data.is_scrolling && !data.active) {
                    e.preventDefault();
                    var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                    data.active = true;
                    if(direction<0) $(".off-canvas-wrap").removeClass("move-left");
                    if(direction>0) $(".off-canvas-wrap").removeClass("move-right");
                }
            })
            .on('touchend.fndtn.orbit', function(e) {
                exit_off_canvas.data('swipe-transition', {});
                e.stopPropagation();
            })
    };

    var show_nav_arrows = function(container, settings) {
        /* Hide/Show arrow navigations on mouse stop/move */
        var slide_selector = (settings.slide_selector == '*') ? '.item' : '.'+settings.slide_selector;
        var slides_count = $(container).find(slide_selector).length;
        if (slides_count > 1) {
            var i = null;
            $(container).mousemove(function() {
                clearTimeout(i);
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).fadeIn(300);
                if($('.'+settings.prev_class).hasClass('is-hover') || $('.'+settings.next_class).hasClass('is-hover')) {
                    clearTimeout(i);
                } else {
                    i = setTimeout(function() { $(container).find('.'+settings.prev_class+', .'+settings.next_class).fadeOut(); }, 1500);
                }
            });
        }
    };

    var minicart_build_markup = function() {
        var slideCount = $('.mini-products-container > ul').length;
        var bullets_container = $('<ul>');
        if (slideCount > 1) {
            $('.mini-products-wrapper').after(bullets_container);
            bullets_container.wrap('<nav class="simple-nav"></nav>');
            for(var i = 0; i < slideCount; i++) {
                var bullet = $('<li>').attr('data-featured-slide', i);
                bullets_container.append(bullet);
            }
        }
    };

    var minicart_toggle_item_attr = function() {
        // Cart dropdown - Expand and hide item attributes
        $(".view-more-attr").click(function(event){
            $(event.target).closest("li").children(".item-options").slideToggle(200, function() {
                $(".view-more-attr").html(($(this).is(':visible') ? Translator.translate('Show less details') : Translator.translate('Show more details')));

            });
        });
    };

    var minicart_slider_control = function(width) {
        // Cart dropdown - Slider control
        if ($('.mini-products-list').length) {
            var slideCount = $('.mini-products-container > ul').length,
                slideWidth = width,
                paddingLeft = $('.mini-products-list').css('padding-left').replace('px', ''),
                paddingRight = $('.mini-products-list').css('padding-right').replace('px', ''),
                listWidth = slideWidth - paddingLeft - paddingRight;
            $('.mini-products-list').width(slideWidth - paddingLeft - paddingRight);
            $('.mini-products-list > li').width(listWidth);
            $('.mini-products-container').width(slideWidth * slideCount);
            $('.cart-dropdown .simple-nav > ul > li:first-child').addClass('active');
            $('.cart-dropdown .simple-nav > ul > li').click(function (event) {
                event.preventDefault();
                $('.mini-products-container').animate({marginLeft: -slideWidth * $(this).index()}, 200);
                $('.cart-dropdown .simple-nav > ul > li.active').removeClass('active');
                $('.cart-dropdown .simple-nav > ul > li').eq($(this).index()).addClass('active');
            });
        }
    };

    var back_to_top = function() {
        if ($('.back-to-top').length) {
            $('.back-to-top').on('click', function() {
                var body = $("html, body");
                body.animate({scrollTop:0}, '1000', 'swing', function() {
                    // callback
                });
            });
        }
    };

    var init_sticky_header = function() {
        var stickyActive = false,
            $header = $('.main-header'),
            $topbar = $('.top-bar.main-nav'),
            topbarLeftHeight,
            headerHeight = $header.outerHeight(),
            topbarHeight = $topbar.outerHeight(),
            offset = headerHeight - topbarHeight;

        var stickyPlaceholder = $('<div>').insertAfter('.main-header .top-bar.main-nav').addClass('sticky-placeholder').hide();
        $(stickyPlaceholder).css('height',topbarHeight+'px');

        $(window).smartresize(function() {
            headerHeight = $header.outerHeight();
            topbarHeight = $topbar.outerHeight();
            offset = headerHeight - topbarHeight;
            $(window).scroll();
            if (Modernizr.mq('only screen and (min-width: 64.063em)')) {
                topbarLeftHeight = $('.main-header nav.top-bar.main-nav .top-bar-section .left').outerHeight();
                $('.magellan-nav.magellan-fixed').css('margin-top',topbarLeftHeight+'px');
            } else {
                $(stickyPlaceholder).css('height','');
            }
        });

        $(window).scroll($.throttle(250, function () {
            if ($(this).scrollTop() > offset && !stickyActive && Modernizr.mq('only screen and (min-width: 64.063em)')) {
                stickyActive = true;
                $header.addClass("sticky-active");
                $(stickyPlaceholder).show();
                var logo = $('<li></li>').append($('.main-header .logo-container > a').clone()).html();
                logo = '<li class="logo-fixed">'+logo+'</li>';
                $('.main-header nav.top-bar.main-nav .top-bar-section .left').prepend(logo);
                if ($('.top-bar-section .main-logo-sticky').length) {
                    $('.top-bar-section .logo-fixed .main-logo').hide();
                }
                topbarLeftHeight = $('.main-header nav.top-bar.main-nav .top-bar-section .left').outerHeight();
            } else if ($(this).scrollTop() < offset && stickyActive) {
                $header.removeClass("sticky-active");
                $('nav.top-bar.main-nav .logo-fixed').remove();
                $(stickyPlaceholder).hide();
                stickyActive = false;
            }
            if ($('body').hasClass('catalog-product-view') && Modernizr.mq('only screen and (min-width: 64.063em)')) {
                setTimeout(function(){
                    $('.magellan-nav.magellan-fixed').css('margin-top',topbarLeftHeight+'px');
                },100);
            }
        }));
        $(window).scroll();
    };

    var OrbitSlider = function(el, settings) {
        var self = this,
            container = el;

        self.orbit_height = function() {
            if ($(container).find('.full-screen').length != 0 &&
                $(container).find('.hero-text').css('position') != 'relative') { // full screen setting enabled
                var headerBorderWidth = parseInt($('.main-header').css('border-bottom-width').replace(/[^-\d\.]/g, ''));
                if ($('.main-header').css('position') == 'absolute' ||
                    $('.orbit-wrapper').index($(container).parent('.orbit-wrapper')) > 0) {
                    var orbit_height = parseInt($(window).height()) + headerBorderWidth;
                } else {
                    var orbit_height = parseInt($(window).height()) - $('.main-header').outerHeight() + (headerBorderWidth*2);
                }
                $(container).find("li.item").each(function(){
                    if ($(this).find('img').attr('src') != 'undefined') {
                        $(this).css('background-image', 'url(' + $(this).find('img').attr('src') + ')');
                    }
                });
            } else {
                $(container).find('.hero-text').css('height','');
                if($(container).find('.hero-text').first().css('position') == 'relative') { // adjust hero's text height only on mobile
                    $(container).find('.hero-text').css('height','');
                    var maxHeight = Math.max.apply(null, $(container).find('.hero-text').map(function () {
                        return $(this).outerHeight();
                    }).get());
                    // check if there is only one slide
                    if ($(container).find('.'+settings.bullets_container_class+' > li').length == 1) {
                        maxHeight = maxHeight - 10;
                    } else {
                        maxHeight = (settings.outside_bullets) ? maxHeight + 30 : maxHeight + 15;
                    }
                    $(container).find('.hero-text').css('height', maxHeight);
                }
                var heights = new Array();
                $(container).find("li.item").each(function(){
                    heights.push($(this).outerHeight());
                });
                var orbit_height = Math.max.apply(null, heights);
            }
            return orbit_height;
        };

        self.fix_orbit_height = function(resize) {
            var orbitHeight = self.orbit_height();
            if(resize) {
                if (!isNaN(parseFloat(orbitHeight)) && isFinite(orbitHeight)) {
                    $(container).css("height", orbitHeight);
                    $(container).find('.orbit-container').css("height", orbitHeight);
                }
            } else {
                // This fixes "height: 0" bug in Foundation's Orbit Slider when using in conjunction with Interchange.
                $(container).find("li img").on("load", function () { // waits until Interchange has placed the image
                    if (!isNaN(parseFloat(orbitHeight)) && isFinite(orbitHeight)) {
                        $(container).css("height", orbitHeight); // assign correct height to slider
                        $(container).find('.orbit-container').css("height", orbitHeight);
                        $('.hero-text').css('visibility', 'visible');
                        $('.orbit-wrapper').css('min-height', 'initial');
                        $('.orbit-wrapper').removeClass('spinner');
                        $(document).resize();
                    }
                });
            }
        };

        self.orbit_bullets = function() {
            var orbitBulletsContainer = $(container).find('.orbit-bullets-container'),
                bullets = $(container).find('.'+settings.bullets_container_class+' > li'),
                slides = $(container).find('li.item');
            //check if bullets container already exist and if number of slides has changed
            if (orbitBulletsContainer.length != 0 && bullets.length != slides.length) {
                $(container).find('.orbit-bullets-container').remove();
                var bullets_container = $('<ol>').addClass(settings.bullets_container_class);
                $(container).append(bullets_container);
                bullets_container.wrap('<div class="orbit-bullets-container"></div>');
                slides.each(function(idx, el) {
                    var bullet = $('<li>').attr('data-orbit-slide', idx);
                    bullets_container.append(bullet);
                });
            }

            // Hide bullets container if there is only one slide
            if ($(container).find('.'+settings.bullets_container_class+' > li').length == 1) {
                $(container).find('.orbit-bullets-container').hide(0);
            } else {
                // Adjust hero's bullets for slides with a dark background
                if($(container).find("li:first-child").hasClass("dark")){
                    self.bulletsDark();
                }
                $(container).on('after-slide-change.fndtn.orbit', function(event, orbit) {
                    if($(container).find('li:eq(' + orbit.slide_number + ')').hasClass('dark')){
                        $('.'+settings.bullets_container_class+' > li').addClass('dark');
                    } else {
                        $('.'+settings.bullets_container_class+' > li').removeClass('dark');
                    }
                });
            }
        };

        self.bulletsDark = function(){
            $('.'+settings.bullets_container_class+' > li').addClass("dark");
        };

        self.adjustFontSizeForMobile = function() {
            var ratio = 0.8;
            // adjust slides font-size on medium screens
            if (Modernizr.mq('only screen and (min-width: 40.063em) and (max-width: 48em)')) {
                $(container).find('li .hero-text > h1').each(function(){
                    var headerSize = $(this).data('size') * ratio;
                    if (headerSize > 0) {
                        $(this).css('font-size',headerSize);
                    }
                });
                $(container).find('li .hero-text > h5').each(function(){
                    var textSize = $(this).data('size') * ratio;
                    if (textSize > 0) {
                        $(this).css('font-size',textSize);
                    }
                });
            } else {
                $(container).find('li .hero-text > h1').each(function(){
                    $(this).css('font-size',$(this).data('size'));
                });
                $(container).find('li .hero-text > h5').each(function(){
                    $(this).css('font-size',$(this).data('size'));
                });
            }
        };

        self.init = function(){
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(window).resize(function() {
                self.fix_orbit_height(true);
                self.adjustFontSizeForMobile();
            });
            self.fix_orbit_height();
            self.orbit_bullets();
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                show_nav_arrows(container, settings);
            }
            // add active class to first bullet
            var active_class = $('.'+settings.bullets_container_class).children('[data-orbit-slide]').eq(0);
            active_class.addClass(settings.bullets_active_class);
        };

        self.init();
    };

    var Featured = function(el, settings, uuid) {

        var self = this,
            idx = 0,
            container = el,
            count_visible_items = 1,
            featured_items_count = {},
            featured_item_width,
            current = {},
            bullets_container = $('<ul>'),
            pages = {},
            animate;

        self.touch_slide = function() {
            if (settings.navigation_arrows) {
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.next_class));
            }
            if (settings.bullets) {
                $(container).append(bullets_container);
                bullets_container.wrap('<nav class="simple-nav"></nav>');
            }
            $(container).on('click', '.'+settings.next_class, {settings: settings}, self.next);
            $(container).on('click', '.'+settings.prev_class, {settings: settings}, self.prev);
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).on('click', '[data-cat-slide]', self.link_category);
            if (settings.swipe && !$(container).hasClass('grid-type')) {
                $(container).on('touchstart.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) {e = e.originalEvent;}
                        var data = {
                            start_page_x: e.touches[0].pageX,
                            start_page_y: e.touches[0].pageY,
                            start_time: (new Date()).getTime(),
                            delta_x: 0,
                            is_scrolling: undefined
                        };
                        $(container).data('swipe-transition', data);
                        e.stopPropagation();
                    })
                    .on('touchmove.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) { e = e.originalEvent; }
                        // Ignore pinch/zoom events
                        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                        var data = $(container).data('swipe-transition');
                        if (typeof data === 'undefined') {data = {};}

                        data.delta_x = e.touches[0].pageX - data.start_page_x;

                        if ( typeof data.is_scrolling === 'undefined') {
                            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                        }

                        if (!data.is_scrolling && !data.active) {
                            e.preventDefault();
                            var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                            data.active = true;
                            self._goto(direction);
                        }
                    })
                    .on('touchend.fndtn.orbit', 'ol', function(e) {
                        $(container).data('swipe-transition', {});
                        e.stopPropagation();
                    })
            }
        };

        self.update_nav_arrows = function(container, index) {
            if ($(container).hasClass('grid-type')) return;
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).css('visibility', 'visible');
                if (idx == 0) {
                    $(container).find('.'+settings.prev_class).css('visibility', 'hidden');
                }
                if (pages[uuid, index]-1 == 0) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
                if (idx == pages[uuid, index]-1) {
                    setTimeout(function() {
                        $(container).find('.' + settings.next_class).css('visibility', 'hidden');
                    },100);
                }
            }
        };

        self.link_bullet = function(e) {
            var index = $(this).attr('data-featured-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                if(isNaN(parseInt(index))) {
                    var slide = container.find('[data-orbit-slide='+index+']');
                    if (slide.index() != -1) {self._goto(slide.index() + 1);}
                } else {
                    self._goto(parseInt(index));
                }
            }
        };

        self.sort_by_attr = function(container) {
            container.find('li').sort(function (a, b) {
                return +a.getAttribute('data-cat-slide') - +b.getAttribute('data-cat-slide');
            }).appendTo(container);
        };

        self.link_category = function(e) {
            var index = $(this).attr('data-cat-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                $(container).find('ol:visible').hide();
                $(container).find('ol').eq(parseInt(index)).show();

                idx = current[uuid, index];
                if (current[uuid, index] === undefined) current[uuid, index] = 0;
                self._goto(current[uuid, index], true);
                $(container).find('.category-nav li').removeClass('active');
                $(container).find('[data-cat-slide='+parseInt(index)+']').addClass('active');

                self.init();
                self._goto(idx, true);
                self.update_slide_number(idx);

                self.sort_by_attr($(container).find('.category-nav'));
                if($(container).find('.category-nav li.active').css('display') == 'block') {
                    $(container).find('.category-nav li.active').prependTo($(container).find('.category-nav'));
                    $(container).find('.category-nav li').toggleClass('show-options');
                }
            }
        };

        self.update_slide_number = function(index) {
            bullets_container.children().removeClass(settings.bullets_active_class);
            $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
        };

        self.next = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx + 1);
        };

        self.prev = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx - 1);
        };

        self._goto = function(next_idx, no_animate) {
            no_animate = typeof no_animate === 'undefined' ? false : no_animate;
            if (next_idx < 0) {return false;}
            var slides = $(container).find('ol:visible');
            while (next_idx >= Math.ceil(featured_items_count[uuid, slides.index()-1] / count_visible_items)) {
                --next_idx;
            }
            var dir = 'next';
            if (next_idx < idx) {dir = 'prev';}
            idx = next_idx;
            var empty_positions = count_visible_items -(featured_items_count[uuid, slides.index()-1] % count_visible_items);
            if (empty_positions == count_visible_items) empty_positions = 0;
            var adjust_last_page = (idx == pages[uuid, slides.index()-1] - 1 && pages[uuid, slides.index()-1] - 1 > 0) ? (empty_positions * featured_item_width) : 0;
            self.update_slide_number(idx);
            self.update_nav_arrows(container, slides.index()-1);
            if (dir === 'next') {animate.next(slides, uuid, current, idx, adjust_last_page, count_visible_items, featured_item_width, no_animate);}
            if (dir === 'prev') {animate.prev(slides, uuid, current, idx, adjust_last_page, count_visible_items, featured_item_width, no_animate);}
        };

        self.cat_nav_build_markup = function() {
            var categories_array = $.map($(container).find('ol'), function(el) {
                return {value: $(el).data('featured-cat-name')}
            });
            var cat_nav_container = $('<ul>').addClass('category-nav');
            if (categories_array.length > 1) { // build menu only if has more than one category
                $(container).append(cat_nav_container);
                for(var i = 0; i < categories_array.length; i++ ) {
                    var nav_option = $('<li>'+categories_array[i].value+'</li>').attr('data-cat-slide', i);
                    cat_nav_container.append(nav_option);
                }
                $(container).find('.category-nav li:first-child').addClass('active');
            };
        };

        self.init = function(){
            featured_item_width = settings.min_item_width;
            var number_of_items = 0,
                available_width,
                padding_left = parseInt($(container).css('padding-left')),
                margin_right = parseInt($(container).find('.'+settings.slide_selector+':first-child').css('margin-right'));

            if (settings.fixed_width) {
                var totalItems = $(container).find('.' + settings.slide_selector).length;
                $(container).css('width', 'auto');
                number_of_items = Math.floor($(container).outerWidth() / featured_item_width);
                available_width = parseInt(number_of_items * (featured_item_width + margin_right));
                if (totalItems <= number_of_items) {
                    var fixedWidth = $(container).find('.' + settings.slide_selector).length * (featured_item_width + margin_right);
                    $(container).css('width', fixedWidth);
                } else {
                    $(container).css('width', available_width);
                }
            } else {
                if ($(container).hasClass('grid-type')) {
                    available_width = parseInt($(container).outerWidth()) - ($(window).width() * 2.8 / 100) - padding_left;
                } else {
                    available_width = parseInt($(container).outerWidth()) - settings.sneak_peak_width - padding_left;
                }
                while (featured_item_width >= settings.min_item_width) {
                    number_of_items++;
                    featured_item_width = available_width / number_of_items
                }
                if (number_of_items > 1) number_of_items = number_of_items - 1;
            }

            count_visible_items = number_of_items;
            featured_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.slide_selector).css('width', featured_item_width - margin_right);
            $(container).find('ol').each(function(index){
                featured_items_count[uuid, index] = $(this).find('.'+settings.slide_selector).length;
                var container_width = featured_items_count[uuid, index]*(featured_item_width + margin_right + 20);
                if (container_width < available_width) container_width = available_width;
                $(this).css('width', container_width);
            });
            if (settings.bullets) { // update bullets
                $(container).find('ol:visible').each(function(index){
                    var elIndex = ($(this).index() > 0) ? $(this).index()-1 : 0;
                    pages[uuid, elIndex] = Math.ceil(featured_items_count[uuid, elIndex] / count_visible_items);
                    bullets_container.html('');
                    if (pages[uuid, index] <= settings.max_bullets_count && pages[uuid, index] > 1) {
                        for(var i = 0; i < pages[uuid, elIndex]; i++ ) {
                            var bullet = $('<li>').attr('data-featured-slide', i);
                            bullets_container.append(bullet);
                        }
                    }
                    bullets_container.on('click', '[data-featured-slide]', self.link_bullet);
                });
            }
            self.update_nav_arrows(container, 0);
            self.update_slide_number(0);
        };

        self.on_resize = function() {
            self.init();
            self._goto(idx, true);
            if($(container).find('.category-nav li.active').css('display') == 'inline-block') {
                self.sort_by_attr($(container).find('.category-nav'));
            } else {
                $(container).find('.category-nav li.active').prependTo($(container).find('.category-nav'));
            }
        };

        $(container).find('ol').not(':first').hide();
        self.init();
        $(document).on('click', function(e){ // Hides category dropdown when clicked outside of it
            if (!$(e.target).hasClass('show-options')) {
                $(container).find('.category-nav li').removeClass('show-options');
            }
        });
        $(container).each(function() {
            var touch_events = self.touch_slide();
            animate = new SlideAnimation(settings);
            if (settings.navigation_arrows && $('html').hasClass('no-touch') && !$(container).hasClass('grid-type')) {
                show_nav_arrows(this, settings);
            };
            if (settings.category_nav_menu) {
                self.cat_nav_build_markup();
            }
            self.update_nav_arrows(container, 0);
        });
        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                self.on_resize();
            });
            self.update_slide_number(idx);
        } else {
            $( window ).resize(function() {
                self.on_resize();
            });
        }
    };

    var BrandSlider = function(el, settings, uuid) {
        var self = this,
            idx = 0,
            container = el,
            count_visible_items = 1,
            featured_items_count = {},
            logo_item_width = {},
            current = {},
            bullets_container = $('<ul>'),
            pages = {},
            is_collapsed = true,
            animate;

        self.touch_slide = function() {
            if (settings.navigation_arrows) {
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.next_class));
            }
            if (settings.bullets) {
                $(container).append(bullets_container);
                bullets_container.wrap('<nav class="simple-nav"></nav>');
            }
            $(container).on('click', '.'+settings.next_class, {settings: settings}, self.next);
            $(container).on('click', '.'+settings.prev_class, {settings: settings}, self.prev);
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            if (settings.swipe) {
                $(container).on('touchstart.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) {e = e.originalEvent;}
                        var data = {
                            start_page_x: e.touches[0].pageX,
                            start_page_y: e.touches[0].pageY,
                            start_time: (new Date()).getTime(),
                            delta_x: 0,
                            is_scrolling: undefined
                        };
                        $(container).data('swipe-transition', data);
                        e.stopPropagation();
                    })
                    .on('touchmove.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) { e = e.originalEvent; }
                        // Ignore pinch/zoom events
                        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                        var data = $(container).data('swipe-transition');
                        if (typeof data === 'undefined') {data = {};}

                        data.delta_x = e.touches[0].pageX - data.start_page_x;

                        if ( typeof data.is_scrolling === 'undefined') {
                            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                        }

                        if (!data.is_scrolling && !data.active) {
                            e.preventDefault();
                            var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                            data.active = true;
                            self._goto(direction);
                        }
                    })
                    .on('touchend.fndtn.orbit', 'ol', function(e) {
                        $(container).data('swipe-transition', {});
                        e.stopPropagation();
                    })
            }
        };

        self.update_nav_arrows = function(container, index) {
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).css('visibility', 'visible');
                if (idx == 0) {
                    $(container).find('.'+settings.prev_class).css('visibility', 'hidden');
                }
                if (pages[uuid]-1 == 0) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
                if (idx == pages[uuid]-1) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
            }
        };

        self.link_bullet = function(e) {
            var index = $(this).attr('data-featured-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                if(isNaN(parseInt(index))) {
                    var slide = container.find('[data-orbit-slide='+index+']');
                    if (slide.index() != -1) {self._goto(slide.index() + 1);}
                } else {
                    self._goto(parseInt(index));
                }
            }
        };

        self.update_slide_number = function(index) {
            bullets_container.children().removeClass(settings.bullets_active_class);
            $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
        };

        self.next = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx + 1);
        };

        self.prev = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx - 1);
        };

        self._goto = function(next_idx, no_animate) {
            no_animate = typeof no_animate === 'undefined' ? false : no_animate;
            if (next_idx < 0) {return false;}
            var slides = $(container).find('ol:visible');
            while (next_idx >= Math.ceil(featured_items_count[uuid] / count_visible_items)) {
                --next_idx;
            }
            var dir = 'next';
            if (next_idx < idx) {dir = 'prev';}
            idx = next_idx;
            var empty_positions = count_visible_items -(featured_items_count[uuid] % count_visible_items);
            if (empty_positions == count_visible_items || featured_items_count[uuid] <= count_visible_items) {
                empty_positions = 0;
            }
            var adjust_last_page = (idx == pages[uuid] - 1) ? (empty_positions * (logo_item_width+4)) : 0;
            self.update_slide_number(idx);
            self.update_nav_arrows(container, slides.index()-1);
            if (dir === 'next') {animate.next(slides, uuid, current, idx, adjust_last_page, count_visible_items, logo_item_width+4, no_animate);}
            if (dir === 'prev') {animate.prev(slides, uuid, current, idx, adjust_last_page, count_visible_items, logo_item_width+4, no_animate);}
        };

        self.show_all = function() {
            var expand_all_text = Translator.translate('Show all Brands');
            var collapse_all_text = Translator.translate('Show less Brands');
            // -------------------------------------
            $(container).append($('<div><a href="#" class="arrow-down">'+expand_all_text+'</a></div>').addClass('show-all-brands'));
            $(container).on('click', '.show-all-brands a', function(e){
                e.preventDefault();
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    is_collapsed = false;
                    $(container).find('.show-all-brands a').html(collapse_all_text).blur();
                    var available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2) + 120;
                    $(container).find('.simple-nav').hide();
                    $(container).find('.brand-prev,.brand-next').stop(true).css('visibility', 'hidden');
                    $(container).find('ol').stop(true).css({width: available_width, marginLeft : ''});
                    self.adjust_margin();
                    $(window).resize();
                } else {
                    $(container).find('.simple-nav').stop(true).show();
                    $(container).find('.brand-prev,.brand-next').stop(true).css('visibility', 'visible');
                    $(container).find('.'+settings.slide_selector).css('margin-right', '');
                    $(container).find('.show-all-brands a').html(expand_all_text).blur();
                    is_collapsed = true;
                    self.init();
                    self._goto(idx, true);
                    self.update_slide_number(idx);
                }
            });
        };

        self.adjust_margin = function() {
            var current_margin_right = parseInt($(container).find('.'+settings.slide_selector).css('margin-right'));
            var available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2);
            var item_width = logo_item_width;
            var rows = Math.floor(available_width / item_width);
            var margin_right = (available_width - ((item_width - 46) * rows)) / (rows - 1);
            $(container).find('ol').css('width', available_width + 120);
            $(container).find('.'+settings.slide_selector).css('margin-right', margin_right);
        }

        self.init = function(){
            var available_width,
                margin_right,
                padding_left,
                container_width,
                number_of_items = 0;

            $(container).find('ol').css('padding-left','');
            padding_left = parseInt($(container).css('padding-left'));
            if (is_collapsed) {
                available_width = parseInt($('.off-canvas-wrap').width()) - settings.sneak_peak_width - padding_left;
            } else {
                available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2);
                $(container).find('.'+settings.slide_selector).css('margin-right', '');
            }
            margin_right = parseInt($(container).find('.'+settings.slide_selector+':first-child').css("margin-right"));

            logo_item_width = settings.min_item_width + margin_right;
            while(logo_item_width >= (settings.min_item_width + margin_right)) {
                number_of_items++;
                logo_item_width = available_width / number_of_items;
            }
            if (number_of_items > 1) number_of_items = number_of_items - 1;
            count_visible_items = number_of_items;

            if (number_of_items == 1) { // center logo container for mobile view
                var centered = (margin_right + settings.sneak_peak_width + padding_left) / 2;
                $(container).find('ol').css('padding-left', centered);
            }
            logo_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.slide_selector).css("width", logo_item_width - margin_right);

            featured_items_count[uuid] = $(container).find('.'+settings.slide_selector).length;
            logo_item_width = (logo_item_width == available_width) ? available_width : logo_item_width;
            container_width = featured_items_count[uuid]*(logo_item_width + margin_right);
            $(container).find('ol').css("width", container_width);

            if (is_collapsed) {
                pages[uuid] = Math.ceil(featured_items_count[uuid] / count_visible_items);
                bullets_container.html('');
                if (pages[uuid] <= settings.max_bullets_count && pages[uuid] > 1) {
                    for(var i = 0; i < pages[uuid]; i++ ) {
                        var bullet = $('<li>').attr('data-featured-slide', i);
                        if (settings.bullets) bullets_container.append(bullet);
                    }
                }
                if (settings.bullets) { // update bullets
                    bullets_container.on('click', '[data-featured-slide]', self.link_bullet);
                }
                self.update_nav_arrows(container, 0);
            } else {
                available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2) + 120;
                $(container).find('.'+settings.slide_selector).css('margin-right', '');
                $(container).find('ol').stop(true).css({width: available_width, marginLeft : ''});
                self.adjust_margin();
            }
        };

        self.on_resize = function() {
            self.init();
            if (is_collapsed) {
                self._goto(idx, true);
            }
        };

        self.init();
        $(container).each(function() {
            var touch_events = self.touch_slide();
            animate = new SlideAnimation(settings);
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                show_nav_arrows(this, settings);
            };
        });

        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                self.on_resize();
            });
            self.update_slide_number(idx);
        } else {
            $(window).smartresize(function() {
                self.on_resize();
            });
        };

        self.show_all();
    };

    var ProductsGrid = function(el, settings) {
        var self = this,
            container = el,
            featured_item_width,
            settings_min_width,
            count_visible_items,
            price_clone,
            $grid = $('.category-products:not(body)');

        self.setItemWidth = function() {
            if (Modernizr.mq('only screen and (max-width: 28.875em)')) {
                featured_item_width = settings_min_width = 151;
            } else if (Modernizr.mq('only screen and (max-width: 40em)')) {
                featured_item_width = settings_min_width = 180;
            } else {
                featured_item_width = settings_min_width = settings.min_item_width;
            }
            if($grid.hasClass('list') || parseInt($grid.css('border-left-width')) == 3) {
                var list_width = parseInt($grid.width());
                featured_item_width = list_width;
            }
            var number_of_items = 0;
            var margin_right = parseInt($grid.find('.'+settings.item_selector+':first-child').css("margin-right"));
            var available_width = parseInt($grid.width());
            while(featured_item_width >= settings_min_width) {
                number_of_items++;
                featured_item_width = available_width / number_of_items
            }
            if (number_of_items > 1) number_of_items--;
            // uncomment the following line to enforce an even number of columns
            //if (Math.abs(number_of_items % 2)) number_of_items--;
            if($grid.hasClass('list') || parseInt($grid.css('border-left-width')) == 3) {
                number_of_items = 1;
            }
            count_visible_items = number_of_items;
            featured_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.item_selector).css("width", featured_item_width - margin_right - 1);
        };

        self.slide_layered_nav = function() {
            if ($('.layered-nav-container').hasClass('open')) {
                $('.layered-nav-toggle').removeClass('active');
                $('.layered-nav-container').animate({ left : -260 }, 300).removeClass('open');
                $grid.animate({ marginLeft : '3.5%' }, 300, function() {
                    $grid.removeClass('list-narrow');
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                eraseCookie('mage-layerednavmode');
                if ($('.layered-nav-container').hasClass('remember')) createCookie('mage-layerednavmode', 0, 10);
            } else {
                $('.layered-nav-toggle').addClass('active');
                $('.layered-nav-container').animate({ left : 0 }, 300).addClass('open');
                $grid.animate({ marginLeft : '268' }, 300, function() {
                    if(document.documentElement.clientWidth <= 1024 &&
                        $grid.hasClass('list')) {
                        $grid.addClass('list-narrow');
                    }
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                eraseCookie('mage-layerednavmode');
                if ($('.layered-nav-container').hasClass('remember')) createCookie('mage-layerednavmode', 1, 10);
            }
        };

        self.narrow_list_check = function() {
            // if layered nav is open and width < 64rem add narrow-list style
            $grid.removeClass('list-narrow');
            if (document.documentElement.clientWidth <= 1024 &&
                $grid.hasClass('list') &&
                $('.layered-nav-toggle').hasClass('active')) {
                $grid.addClass('list-narrow');
            } else if (document.documentElement.clientWidth <= 641 &&
                $grid.hasClass('list')) {
                $grid.addClass('list-narrow');
            }
        };

        self.list_mode = function() {
            $grid.addClass('list');
            self.narrow_list_check();
            if(document.documentElement.clientWidth <= 641) {
                $grid.addClass('list-narrow');
            }
            self.setItemWidth();
            if ($grid.data('isotope')) $grid.isotope('layout');
            $('.toggle-grid').removeClass('active');
            $('.toggle-list').addClass('active');
            if(readCookie('mage-listmode') == null){
                createCookie('mage-listmode', 1, 10);
            }
        };

        self.grid_mode = function() {
            $grid.removeClass('list');
            $grid.removeClass('list-narrow');
            self.setItemWidth();
            if ($grid.data('isotope')) $grid.isotope('layout');
            $('.toggle-list').removeClass('active');
            $('.toggle-grid').addClass('active');
            eraseCookie('mage-listmode');
        };

        self.init_isotope = function($grid) {
            if ($('#catalog-listing').hasClass('keep-aspect-ratio')) {
                // masonry layout is enabled - check for images to load
                imagesLoaded($grid, function() {
                    $grid.isotope({
                        itemSelector: '.isotope-item'
                    });
                });
                // reload masonry layout when clicking configurable swatch
                $(document).on('catalog:swapListImage', function(e){
                    $grid.isotope('reloadItems');
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                self.clone_price();
            } else {
                $grid.isotope({
                    itemSelector: '.isotope-item'
                });
                self.clone_price();
            }
        };

        self.clone_price = function() {
            // clone price box for list mode and remove id (to avoid having duplicate ids)
            $(container).find('.item-content').each(function() {
                if ($(this).find('.actions > .price-box').length == 0) {
                    price_clone = $(this).find('.price-box').clone();
                    price_clone.find('*').removeAttr('id');
                    price_clone.prependTo($(this).find('.actions'));
                }
            });
        };

        self.init = function() {
            if(readCookie('mage-listmode')) {
                self.list_mode();
            }
            if (($('.layered-nav-container').hasClass('open') && readCookie('mage-layerednavmode') != 0) ||
                readCookie('mage-layerednavmode') == 1) {
                $('.layered-nav-container').css({ left : 0, display : 'block' });
                $('.layered-nav-toggle').addClass('active');
                $('.layered-nav-container').addClass('open');
                $grid.css({ marginLeft : '268px' });
                if(document.documentElement.clientWidth <= 641 &&
                    $grid.hasClass('list')) {
                    $grid.addClass('list-narrow');
                }
                self.setItemWidth();
                if ($grid.data('isotope')) $grid.isotope('layout');
            } else if (readCookie('mage-layerednavmode') != 1) {
                $('.layered-nav-container').removeClass('open');
                $('.layered-nav-container').css({ left : -260, display : 'block' });
            }
            self.setItemWidth();
            $(container).on('click', '.layered-nav-toggle', function(e) {
                e.preventDefault();
                self.slide_layered_nav();
            });
            $(container).on('click', '.toggle-list', function(e) {
                e.preventDefault();
                self.list_mode();
            });
            $(container).on('click', '.toggle-grid', function(e) {
                e.preventDefault();
                self.grid_mode();
            });
            self.narrow_list_check();
            if(settings.show_filters_by_default == true || $(location).attr('href').replace(/^.*?(#|$)/,'') == 'layered-nav') {
                self.slide_layered_nav();
            }
            self.init_isotope($grid);
            $('#catalog-listing').on('isotope:update', function(e) {
                // masonry layout is enabled - check for images to load
                if ($('#catalog-listing').hasClass('keep-aspect-ratio')) {
                    imagesLoaded($grid, function() {
                        self.setItemWidth();
                        if ($grid.data('isotope')) $grid.isotope('destroy');
                        self.init_isotope($grid);
                    });
                } else {
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('destroy');
                    self.init_isotope($grid);
                }
                init_form_select();
            });
            $(document).ready(function() {
                $(document).trigger('product-media-loaded');
            });
        };

        self.init();

        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                setTimeout(function(){
                    self.narrow_list_check();
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                },500);
            });
        } else {
            $(window).resize(function() {
                $grid.removeClass('list-narrow');
                if (document.documentElement.clientWidth <= 1024 &&
                    $grid.hasClass('list') &&
                    $('.layered-nav-toggle').hasClass('active')) {
                    $grid.addClass('list-narrow');
                } else if (document.documentElement.clientWidth <= 641 &&
                    $grid.hasClass('list')) {
                    $grid.addClass('list-narrow');
                }
                self.setItemWidth();
                if ($grid.data('isotope')) $grid.isotope('layout');
            });
        }
    };

    var SlideAnimation = function(settings) {
        var duration;
        var is_rtl = ($('html[dir=rtl]').length === 1);
        var margin = is_rtl ? 'marginRight' : 'marginLeft';
        var animMargin = {};
        var current = this.current;

        this.next = function(slides, uuid, current, next, adjust_last_page, count_visible_items, featured_item_width, no_animate) {
            duration = (no_animate) ? 0 : settings.animation_speed;
            animMargin[margin] = -(next*count_visible_items*featured_item_width) -12 + adjust_last_page;
            slides.animate(animMargin, duration, function() {
                current[uuid, slides.index()-1] = next;
                // force lazy loading plugin to render without scroll
                setTimeout(function(){ echo.render(); },0);
            });
        };

        this.prev = function(slides, uuid, current, prev, empty_positions, count_visible_items, featured_item_width, no_animate) {
            duration = (no_animate) ? 0 : settings.animation_speed;
            animMargin[margin] = -(prev*count_visible_items*featured_item_width)-12;
            slides.animate(animMargin, duration, function() {
                current[uuid, slides.index()-1] = prev;
                // force lazy loading plugin to render without scroll
                setTimeout(function(){ echo.render('render'); },0);
            });
        };
    };

    var init_product_labels = function() {
        var productIds = [],
            labelUrl = $('.product-label-placeholder').data('labelurl');
        $('.product-label-placeholder').each(function(){
            productIds.push($(this).data('productid'));
        });
        $.ajax({
            url: labelUrl,
            data: {productIds : productIds},
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                $.each(response, function(index, data) {
                    $('[data-productid="'+index+'"]').replaceWith(data);
                });
            }
        });
    };

    window.Intenso = {
        name : 'Intenso',

        version : '1.5.0',

        init : function (scope, libraries, method, options, response) {
            var library_arr,
                args = [scope, method, options, response],
                responses = [];

            // set global scope
            this.scope = scope || this.scope;

            if (libraries && typeof libraries === 'string') {
                if (this.libs.hasOwnProperty(libraries)) {
                    responses.push(this.init_lib(libraries, args));
                }
            } else {
                for (var lib in this.libs) {
                    responses.push(this.init_lib(lib, libraries));
                }
            }

            return scope;
        },

        init_lib : function (lib, args) {
            if (this.libs.hasOwnProperty(lib)) {

                if (args && args.hasOwnProperty(lib)) {
                    return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
                }

                args = args instanceof Array ? args : Array(args);    // PATCH: added this line
                return this.libs[lib].init.apply(this.libs[lib], args);
            }

            return function () {};
        },

        libs : {}

    };

    $.fn.intenso = function () {
        var args = Array.prototype.slice.call(arguments, 0);

        return this.each(function () {
            Intenso.init.apply(Intenso, [this].concat(args));
            return this;
        });
    };

    Intenso.libs = Intenso.libs || {};

    // User interface
    Intenso.libs.ui = {
        settings: {
            svg_fallback: true
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.ui.setup(settings);
        },

        setup : function(settings){
            if(settings.svg_fallback) replace_inline_SVG();
            touch_exit_canvas();
            // Toggle placeholder´s text on focus/blur
            toggle_input_placeholder();
            // Close offcanvas menu on browser resize
            if ($('html').hasClass('touch')) {
                $(window).on('orientationchange resize', function(e) {
                    if(document.documentElement.clientWidth / parseFloat($("body").css("font-size")) >= 40.063) {
                        $(".off-canvas-wrap").removeClass("move-left");
                        $(".off-canvas-wrap").removeClass("move-right");
                    }
                });
            } else {
                $( window ).resize(function() {
                    if(document.documentElement.clientWidth / parseFloat($("body").css("font-size")) >= 40.063) {
                        $(".off-canvas-wrap").removeClass("move-left");
                        $(".off-canvas-wrap").removeClass("move-right");
                    }
                });
            }
            // add empty span referencing main color to allow querying main color when needed
            $('<span class="main-color"></span>').appendTo('body');
            // open global message (if any)
            $("#reveal-messages").foundation("reveal", "open");

            back_to_top();
            init_form_select(); // Init form selects
            bind_inputbox_focus(); // Change border color on input focus and animate labels
            fix_label(); // Add class to textarea, checkbox and radio labels
            toggle_newsletter_inputbox(); // Toggle newsletter inputbox on click
            toggle_tags_inputbox(); // Toggle tags inputbox on click
            toggle_secmenu(); // prevent menu from losing focus when select-box option is hover
            init_mega_menu();
            init_vertical_menu();
            init_product_labels();
            if ($('.main-header').hasClass('sticky-menu') && !$('.main-header nav.top-bar.main-nav').hasClass('vertical')) init_sticky_header();
            echo.init({ // init lazy loading of images
                offset: 300,
                throttle: 250,
                unload: false,
                callback: function(element, op) {
                    if(op === 'load') {
                        $(element).css('background-image', 'none');
                    }
                }
            });
            $(document).on('click', '#allow_gift_messages_for_order, #allow_gift_messages_for_items', function() {
                $('.input-text').each(function() {
                    input_focus(this);
                });
            })
        },
        bindInputboxes : function() {
            bind_inputbox_focus();
        },
        readCookie : function(name) {
            return readCookie(name);
        },
        createCookie : function(name, value, days) {
            createCookie(name, value, days);
        },
        eraseCookie : function(name) {
            eraseCookie(name);
        }
    },

    // Product labels init
    Intenso.libs.productLabel = {
        init : function() {
            init_product_labels();
        }
    },

    // Mini cart dropdown
    Intenso.libs.miniCart = {
        settings: {
            sliderWidth: parseInt($('.cart-dropdown .arrow-box').css('width'), 10)
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.miniCart.setup(settings);
        },

        setup : function(settings){
            minicart_build_markup();
            minicart_toggle_item_attr();
            minicart_slider_control(settings.sliderWidth);
        }
    },

    // Featured slider
    Intenso.libs.featured = {
        settings: {
            container_class: 'featured-slider',
            sneak_peak_width: 32,
            min_item_width: 220,
            fixed_width: false,
            animation_speed: 300,
            slide_selector: 'item',
            navigation_arrows: true,
            prev_class: 'featured-prev',
            next_class: 'featured-next',
            bullets: true,
            max_bullets_count: 10,
            bullets_active_class: 'active',
            category_nav_menu: true,
            swipe: true
        },

        uuid : function (separator) {
            var delim = separator || "-",
                self = this;

            function S4() {
                return random_str(5);
            }

            return (S4() + S4() + delim + S4() + delim + S4()
            + delim + S4() + delim + S4() + S4() + S4());
        },

        init : function(scope, method, options){
            var self = this;
            Intenso.libs.featured.setup(self.settings);
        },

        setup : function(settings){
            var self = this,
                data_options_attr;
            $('.'+settings.container_class).each(function(){
                if ($(this).attr('data-uuid') === undefined) {
                    var uuid = self .uuid();
                    $(this).attr('data-uuid', uuid);
                    data_options_attr = data_options($(this));
                    settings = $.extend({}, self.settings, data_options_attr);
                    var featured_instance = new Featured(this, settings, uuid);
                }
            });
        }
    },

    // Orbit slider
    Intenso.libs.orbit = {
        settings: {
            outside_bullets: false
        },

        init : function(){
            var self = this,
                data_options = Foundation.utils.data_options($('.orbit-slides-container')); // get data attr

            var settings = $.extend({}, self.settings, $('.orbit-slides-container').data('orbit-init'), data_options);
            Intenso.libs.orbit.setup(settings);
        },

        setup : function(settings){
            $('.'+settings.container_class).each(function(){
                var orbit_slider_instance = new OrbitSlider($(this).parent('.orbit-container'), settings);
            });
        }
    },

    // Brands slider
    Intenso.libs.brandSlider = {
        settings: {
            container_class: 'brand-slider',
            sneak_peak_width: 62,
            min_item_width: 120,
            animation_speed: 300,
            slide_selector: 'brand',
            navigation_arrows: true,
            prev_class: 'brand-prev',
            next_class: 'brand-next',
            bullets: true,
            max_bullets_count: 10,
            bullets_active_class: 'active',
            swipe: true
        },

        uuid : function (separator) {
            var delim = separator || "-",
                self = this;

            function S4() {
                return random_str(5);
            }

            return (S4() + S4() + delim + S4() + delim + S4()
            + delim + S4() + delim + S4() + S4() + S4());
        },

        init : function(scope, method, options){
            var self = this,
                data_options_attr = data_options($('.brand-slider')); // get data attr
            var settings = $.extend({}, self.settings, data_options_attr);
            Intenso.libs.brandSlider.setup(settings);
        },

        setup : function(settings){
            var self = this;
            $('.'+settings.container_class).each(function(){
                var uuid = self .uuid();
                $(this).attr('data-uuid', uuid);
                var brandSlider_instance = new BrandSlider(this, settings, uuid);
            });
        }
    },

    // Products Grid
    Intenso.libs.productsGrid = {
        settings: {
            container_class: 'products-grid',
            min_item_width: 220,
            item_selector: 'item',
            show_filters_by_default: false
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.productsGrid.setup(settings);
        },

        setup : function(settings){
            var self = this;
            var productsGrid_instance = new ProductsGrid($('.'+settings.container_class), settings);
        }
    }

    // Auto dismiss modal popups
    Intenso.libs.revealModalTimer = {
        settings: {
            duration: '5s'
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.revealModalTimer.setup(settings);
        },

        setup : function(settings){
            if ($('#dismiss-bar').length > 0) {
                var progressbar = $('#dismiss-bar');
                var progressbarinner = document.createElement('div');
                progressbarinner.className = 'inner';
                progressbarinner.style.animationDuration = settings.duration;

                $('#reveal-messages').on('animationend', progressbarinner, function() {
                    $('#reveal-messages').foundation('reveal', 'close');
                });

                progressbar.append(progressbarinner);
                progressbarinner.style.animationPlayState = 'running';
            }
        }
    }

    // Catalog AJAX
    Intenso.libs.catalogAjax = {
        processingUrl: '',
        url: '',
        settings: {
            offset: 300,
            catalogListing: $('#catalog-listing'),
            pager: '#pager .next'
        },

        init: function(scope, method, options){
            var self = this,
                settings = $.extend({}, self.settings, (options || method));
            if (!settings.catalogListing.hasClass('ajax')) return;
            if (settings.catalogListing.length && settings.catalogListing.hasClass('infinite-scroll')) {
                $('#pager.toolbar-bottom').hide();
                $(window).scroll($.throttle(500, function () {
                    Intenso.libs.catalogAjax.scrolling(settings);
                }));
            }
            (function(History) {
                if (!History.enabled) {
                    return false;
                }
                $(function() {
                    if(settings.catalogListing.length) {
                        Intenso.libs.catalogAjax.pushState({
                            listing: $('#catalog-listing').html(),
                            layer: $('#layered-navigation').html(),
                            categoryName: $('#category-name').html(),
                            clearLink: $('#filter-reset').html(),
                            amount: $('#amount').html(),
                            pager: $('#pager').html(),
                            orders: $('#orders').html(),
                            limits: $('#limits').html()
                        }, document.location.href, true);
                    }

                    // Bind to StateChange Event
                    History.Adapter.bind(window, 'popstate', function(event) {
                        if (event.type == 'popstate') {
                            var State = History.getState();
                            if ($('#catalog-listing').length) $('#catalog-listing').html(State.data.listing);
                            if ($('#layered-navigation').length) $('#layered-navigation').html(State.data.layer);
                            if ($('#category-name').length) $('#category-name').html(State.data.categoryName);
                            if ($('#filter-reset').length) $('#filter-reset').html(State.data.clearLink);
                            if ($('#amount').length) $('#amount').html(State.data.amount);
                            if ($('#pager').length) $('#pager').html(State.data.pager);
                            if ($('#orders').length) $('#orders').html(State.data.orders);
                            if ($('#limits').length) $('#limits').html(State.data.limits);
                            Intenso.libs.catalogAjax.ajaxListener();
                            Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
                            // trigger jQuery event needed to re-layout grid on intenso.js ?>
                            $('#catalog-listing').trigger('isotope:update');
                            // dispatch event to update chosen.js select boxes ?>
                            $('.layered-nav-select select').each(function(){
                                $(this).trigger('chosen:updated');
                            });
                            // dispatch catalog:update event for others script to hook up with ?>
                            $('#catalog-listing').trigger('catalog:update');
                            // trigger jQuery event needed to bind config swatches ?>
                            setTimeout(function(){
                                $(document).trigger('product-media-loaded');
                                // init lazy loading of images
                                echo.init({ // init lazy loading of images
                                    offset: 100,
                                    throttle: 250,
                                    unload: false
                                });
                                Intenso.libs.catalogAjax.scrolling(settings);
                            },500);
                        }
                    });
                });
            })(window.History);
            Intenso.libs.catalogAjax.ajaxListener();
            Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
            Intenso.libs.catalogAjax.scrolling(settings);
        },

        scrolling: function(settings) {
            var gridBottomPosition, scrollBottom,
                gridPosition = settings.catalogListing.position(),
                gridHeight = Math.floor(settings.catalogListing.outerHeight()),
                scrollTop = Math.floor($(window).scrollTop()),
                windowHeight = Math.floor(window.innerHeight);
            if ($(settings.pager).length == 0 || !settings.catalogListing.hasClass('infinite-scroll')) return;
            gridBottomPosition = Math.floor(gridPosition.top) + gridHeight;
            scrollBottom = scrollTop + windowHeight;
            if (gridBottomPosition - settings.offset < scrollBottom) {
                if ($(settings.pager).length) {
                    Intenso.libs.catalogAjax.handleEvent($(settings.pager).attr('href'), null, true);
                }
            }
        },

        pushState: function(data, link, replace) {
            var History = window.History;
            if ( !History.enabled ) {
                return false;
            }
            // check sessionStorage size to avoid exceeding storage quota
            if (window.sessionStorage
                && sessionStorage.getItem('History.store')
                && sessionStorage.getItem('History.store').length > 4000000) {
                sessionStorage.clear();
            }
            if (replace) {
                History.replaceState(data, document.title, link);
            } else {
                History.pushState(data, document.title, link);
            }
        },

        handleEvent: function(el, event, appendContent) {
            var url, fullUrl, isInfiniteScroll;
            if (typeof el === 'string') {
                url = el;
            } else if (el.prop('tagName').toLowerCase() === 'a') {
                url = el.attr('href');
            } else if (el.prop('tagName').toLowerCase() === 'select') {
                url = el.val();
            }

            if (Intenso.libs.catalogAjax.processingUrl == url) {
                return;
            } else {
                Intenso.libs.catalogAjax.processingUrl = url;
            }

            // Add this to query string for full page caching systems ?>
            if (url.indexOf('?') != -1) {
                fullUrl = url + '&isLayerAjax=1';
            } else {
                fullUrl = url + '?isLayerAjax=1';
            }

            isInfiniteScroll = (Intenso.libs.catalogAjax.settings.catalogListing.hasClass('infinite-scroll')
            && typeof el === 'string' && appendContent) ? true : false;
            $('#ajax-errors').hide();

            if (isInfiniteScroll) {
                var layeredNavPaneOpenClass = ($('.layered-nav-container').hasClass('open')) ? ' open' : '';
                $('<div class="loading-infinite'+layeredNavPaneOpenClass+'"><span class="button">Loading more products...</span></div>').insertAfter(Intenso.libs.catalogAjax.settings.catalogListing);
            } else {
                $('body').addClass('app-loading');
                Intenso.libs.catalogAjax.settings.catalogListing.addClass('loading');
                // push new state to update URL in case the AJAX call fails
                Intenso.libs.catalogAjax.pushState(null, url, false);
            }

            $.ajax(fullUrl, {
                type: 'GET',
                dataType : 'json',
                success: function(data) {
                    if (data) {
                        if (Intenso.libs.catalogAjax.settings.catalogListing.hasClass('infinite-scroll')
                            && typeof el === 'string' && appendContent) {
                            $('.loading-infinite').remove();
                            Intenso.libs.catalogAjax.settings.catalogListing.append(
                                data.listing
                            );
                        } else {
                            Intenso.libs.catalogAjax.settings.catalogListing.html(data.listing);
                        }
                        $('#layered-navigation').html(data.layer);
                        $('#category-name').html(data.categoryName);
                        $('#filter-reset').html(data.clearLink);
                        $('#amount').html(data.amount);
                        $('#pager').html(data.pager);
                        $('#orders').html(data.orders);
                        $('#limits').html(data.limits);

                        if (!isInfiniteScroll) {
                            Intenso.libs.catalogAjax.pushState({
                                listing: data.listing,
                                layer: data.layer,
                                categoryName: data.categoryName,
                                clearLink: data.clearLink,
                                amount: data.amount,
                                pager: data.pager,
                                orders: data.orders,
                                limits: data.limits
                            }, url, true);
                        }
                        Intenso.libs.catalogAjax.ajaxListener(); // attach click and change event handlers
                        Intenso.libs.productLabel.init(); // init product labels

                        Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
                        echo.init({ // init lazy loading of images
                            offset: 100,
                            throttle: 250,
                            unload: false
                        });
                        if (!isInfiniteScroll) {
                            var body = $j('html, body');
                            body.animate({scrollTop: 0}, '3000', 'swing', function () {
                                // callback
                            });
                        }
                    } else {
                        $('#ajax-errors').show();
                        Intenso.libs.catalogAjax.settings.catalogListing.removeClass('loading');
                    }

                    $('body').removeClass('app-loading');
                    Intenso.libs.catalogAjax.settings.catalogListing.removeClass('loading');

                    // trigger jQuery event needed to relayout grid
                    Intenso.libs.catalogAjax.settings.catalogListing.trigger('isotope:update');
                    // dispatch catalog:update event for others script to hook up with
                    Intenso.libs.catalogAjax.settings.catalogListing.trigger('catalog:update');
                    // trigger jQuery event needed to bind config swatches ?>
                    $j(document).ready(function() {
                        setTimeout(function(){
                            $j(document).trigger('product-media-loaded');
                        },500);
                    });
                    Intenso.libs.catalogAjax.scrolling(Intenso.libs.catalogAjax.settings);
                }
            });

            if (event) {
                event.preventDefault();
            }
        },

        ajaxListener: function() {
            var that = this,
                els;
            els = $('div.pager a')
                .add('.layered-nav-select select')
                .add('#narrow-by-list a')
                .add('#pager a')
                .add('#filter-reset a');

            els.each(function() {
                if ($(this).prop('tagName').toLowerCase() === 'a') {
                    $(this).on('click', function(event) {
                        Intenso.libs.catalogAjax.handleEvent($(this), event);
                    });
                } else if ($(this).prop('tagName').toLowerCase() === 'select') {
                    $(this).attr('onchange', '');
                    $(this).on('change', function(event) {
                        Intenso.libs.catalogAjax.handleEvent($(this), event);
                    });
                }
            });
        },

        hide_list_item: function(children, list_items_qty) {
            if(children.length > list_items_qty){
                for(var i = list_items_qty; i < children.length; i++) {
                    $(children[i]).hide();
                }
            }
        },

        shorten_list: function(list_items_qty) {
            list_items_qty = typeof list_items_qty !== 'undefined' ? list_items_qty : 5;
            var show_more = Translator.translate('Show all');
            var show_less = Translator.translate('Show less');
            var link = '<span class="arrow-down show-more">'+show_more+'</span>';
            $('.layered-nav dt').each(function(index) {
                var el = $(this).next('dd').find('ol').first();
                var children = $(el).find('li');
                if(children.length > list_items_qty){
                    Intenso.libs.catalogAjax.hide_list_item(children, list_items_qty);
                    $(this).append(link);
                }
            });
            $('.show-more').each(function(index) {
                $(this).on('click', function(event) {
                    event.preventDefault();
                    $(this).toggleClass('show-all');
                    var ol = $(this).parent().next('dd').find('ol');
                    var children = $(ol).find('li');
                    if($(this).hasClass('show-all')) {
                        children.each(function() {
                            $(this).fadeIn(300);
                        });
                        $(this).html(show_less);
                        $(this).removeClass('arrow-down').addClass('arrow-up');
                    } else {
                        Intenso.libs.catalogAjax.hide_list_item(children, list_items_qty);
                        $(this).html(show_more);
                        $(this).removeClass('arrow-up').addClass('arrow-down');
                    }
                });
            });
        }
    }

}(jQuery, this, this.document));

(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


/*!
 * Isotope PACKAGED v2.2.2
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(window),function(){"use strict";function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a,b){function c(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function d(){}function e(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=h.length;c>b;b++){var d=h[b];a[d]=0}return a}function f(b){function d(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||g("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=b("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var f=document.body||document.documentElement;f.appendChild(e);var h=j(e);l=200===c(h.width),f.removeChild(e)}}}function f(a){if(d(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var b=j(a);if("none"===b.display)return e();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var g=f.isBorderBox=!(!k||!b[k]||"border-box"!==b[k]),m=0,n=h.length;n>m;m++){var o=h[m],p=b[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=g&&l,y=c(b.width);y!==!1&&(f.width=y+(x?0:r+v));var z=c(b.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return f}var g="undefined"==typeof console?d:function(a){console.error(a)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],f):"object"==typeof exports?module.exports=f(require("desandro-get-style-property")):a.getSize=f(a.getStyleProperty)}(window),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(a){"use strict";function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a,b){"use strict";"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(c,d){return b(a,c,d)}):"object"==typeof exports?module.exports=b(a,require("doc-ready"),require("desandro-matches-selector")):a.fizzyUIUtils=b(a,a.docReady,a.matchesSelector)}(window,function(a,b,c){var d={};d.extend=function(a,b){for(var c in b)a[c]=b[c];return a},d.modulo=function(a,b){return(a%b+b)%b};var e=Object.prototype.toString;d.isArray=function(a){return"[object Array]"==e.call(a)},d.makeArray=function(a){var b=[];if(d.isArray(a))b=a;else if(a&&"number"==typeof a.length)for(var c=0,e=a.length;e>c;c++)b.push(a[c]);else b.push(a);return b},d.indexOf=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},d.removeFrom=function(a,b){var c=d.indexOf(a,b);-1!=c&&a.splice(c,1)},d.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1==a.nodeType&&"string"==typeof a.nodeName},d.setText=function(){function a(a,c){b=b||(void 0!==document.documentElement.textContent?"textContent":"innerText"),a[b]=c}var b;return a}(),d.getParent=function(a,b){for(;a!=document.body;)if(a=a.parentNode,c(a,b))return a},d.getQueryElement=function(a){return"string"==typeof a?document.querySelector(a):a},d.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},d.filterFindElements=function(a,b){a=d.makeArray(a);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f];if(d.isElement(h))if(b){c(h,b)&&e.push(h);for(var i=h.querySelectorAll(b),j=0,k=i.length;k>j;j++)e.push(i[j])}else e.push(h)}return e},d.debounceMethod=function(a,b,c){var d=a.prototype[b],e=b+"Timeout";a.prototype[b]=function(){var a=this[e];a&&clearTimeout(a);var b=arguments,f=this;this[e]=setTimeout(function(){d.apply(f,b),delete f[e]},c||100)}},d.toDashed=function(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()};var f=a.console;return d.htmlInit=function(c,e){b(function(){for(var b=d.toDashed(e),g=document.querySelectorAll(".js-"+b),h="data-"+b+"-options",i=0,j=g.length;j>i;i++){var k,l=g[i],m=l.getAttribute(h);try{k=m&&JSON.parse(m)}catch(n){f&&f.error("Error parsing "+h+" on "+l.nodeName.toLowerCase()+(l.id?"#"+l.id:"")+": "+n);continue}var o=new c(l,k),p=a.jQuery;p&&p.data(l,e,o)}})},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(c,d,e,f){return b(a,c,d,e,f)}):"object"==typeof exports?module.exports=b(a,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(a.Outlayer={},a.Outlayer.Item=b(a,a.EventEmitter,a.getSize,a.getStyleProperty,a.fizzyUIUtils))}(window,function(a,b,c,d,e){"use strict";function f(a){for(var b in a)return!1;return b=null,!0}function g(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}function h(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}var i=a.getComputedStyle,j=i?function(a){return i(a,null)}:function(a){return a.currentStyle},k=d("transition"),l=d("transform"),m=k&&l,n=!!d("perspective"),o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[k],p=["transform","transition","transitionDuration","transitionProperty"],q=function(){for(var a={},b=0,c=p.length;c>b;b++){var e=p[b],f=d(e);f&&f!==e&&(a[e]=f)}return a}();e.extend(g.prototype,b.prototype),g.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.getSize=function(){this.size=c(this.element)},g.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=q[c]||c;b[d]=a[c]}},g.prototype.getPosition=function(){var a=j(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=a[c?"left":"right"],f=a[d?"top":"bottom"],g=this.layout.size,h=-1!=e.indexOf("%")?parseFloat(e)/100*g.width:parseInt(e,10),i=-1!=f.indexOf("%")?parseFloat(f)/100*g.height:parseInt(f,10);h=isNaN(h)?0:h,i=isNaN(i)?0:i,h-=c?g.paddingLeft:g.paddingRight,i-=d?g.paddingTop:g.paddingBottom,this.position.x=h,this.position.y=i},g.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={},d=b.isOriginLeft?"paddingLeft":"paddingRight",e=b.isOriginLeft?"left":"right",f=b.isOriginLeft?"right":"left",g=this.position.x+a[d];c[e]=this.getXValue(g),c[f]="";var h=b.isOriginTop?"paddingTop":"paddingBottom",i=b.isOriginTop?"top":"bottom",j=b.isOriginTop?"bottom":"top",k=this.position.y+a[h];c[i]=this.getYValue(k),c[j]="",this.css(c),this.emitEvent("layout",[this])},g.prototype.getXValue=function(a){var b=this.layout.options;return b.percentPosition&&!b.isHorizontal?a/this.layout.size.width*100+"%":a+"px"},g.prototype.getYValue=function(a){var b=this.layout.options;return b.percentPosition&&b.isHorizontal?a/this.layout.size.height*100+"%":a+"px"},g.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={};j.transform=this.getTranslate(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},g.prototype.getTranslate=function(a,b){var c=this.layout.options;return a=c.isOriginLeft?a:-a,b=c.isOriginTop?b:-b,n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"},g.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},g.prototype.moveTo=m?g.prototype._transitionTo:g.prototype.goTo,g.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},g.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},g.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var r="opacity,"+h(q.transform||"transform");g.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:r,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(o,this,!1))},g.prototype.transition=g.prototype[k?"_transition":"_nonTransition"],g.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},g.prototype.onotransitionend=function(a){this.ontransitionend(a)};var s={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};g.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,c=s[a.propertyName]||a.propertyName;if(delete b.ingProperties[c],f(b.ingProperties)&&this.disableTransition(),c in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[c]),c in b.onEnd){var d=b.onEnd[c];d.call(this),delete b.onEnd[c]}this.emitEvent("transitionEnd",[this])}},g.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(o,this,!1),this.isTransitioning=!1},g.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var t={transitionProperty:"",transitionDuration:""};return g.prototype.removeTransitionStyles=function(){this.css(t)},g.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.prototype.remove=function(){if(!k||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.once("transitionEnd",function(){a.removeElem()}),this.hide()},g.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("visibleStyle");b[c]=this.onRevealTransitionEnd,this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.prototype.getHideRevealTransitionEndProperty=function(a){var b=this.layout.options[a];if(b.opacity)return"opacity";for(var c in b)return c},g.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("hiddenStyle");b[c]=this.onHideTransitionEnd,this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(c,d,e,f,g){return b(a,c,d,e,f,g)}):"object"==typeof exports?module.exports=b(a,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):a.Outlayer=b(a,a.eventie,a.EventEmitter,a.getSize,a.fizzyUIUtils,a.Outlayer.Item)}(window,function(a,b,c,d,e,f){"use strict";function g(a,b){var c=e.getQueryElement(a);if(!c)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(c||a)));this.element=c,i&&(this.$element=i(this.element)),this.options=e.extend({},this.constructor.defaults),this.option(b);var d=++k;this.element.outlayerGUID=d,l[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var h=a.console,i=a.jQuery,j=function(){},k=0,l={};return g.namespace="outlayer",g.Item=f,g.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e.extend(g.prototype,c.prototype),g.prototype.option=function(a){e.extend(this.options,a)},g.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},g.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},g.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},g.prototype._filterFindItemElements=function(a){return e.filterFindElements(a,this.options.itemSelector)},g.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},g.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},g.prototype._init=g.prototype.layout,g.prototype._resetLayout=function(){this.getSize()},g.prototype.getSize=function(){this.size=d(this.element)},g.prototype._getMeasurement=function(a,b){var c,f=this.options[a];f?("string"==typeof f?c=this.element.querySelector(f):e.isElement(f)&&(c=f),this[a]=c?d(c)[b]:f):this[a]=0},g.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},g.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},g.prototype._layoutItems=function(a,b){if(this._emitCompleteOnItems("layout",a),a&&a.length){for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d],g=this._getItemLayoutPosition(f);g.item=f,g.isInstant=b||f.isLayoutInstant,c.push(g)}this._processLayoutQueue(c)}},g.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},g.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},g.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},g.prototype._postLayout=function(){this.resizeContainer()},g.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},g.prototype._getContainerSize=j,g.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},g.prototype._emitCompleteOnItems=function(a,b){function c(){e.dispatchEvent(a+"Complete",null,[b])}function d(){g++,g===f&&c()}var e=this,f=b.length;if(!b||!f)return void c();for(var g=0,h=0,i=b.length;i>h;h++){var j=b[h];j.once(a,d)}},g.prototype.dispatchEvent=function(a,b,c){var d=b?[b].concat(c):c;if(this.emitEvent(a,d),i)if(this.$element=this.$element||i(this.element),b){var e=i.Event(b);e.type=a,this.$element.trigger(e,c)}else this.$element.trigger(a,c)},g.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},g.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},g.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},g.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e.removeFrom(this.stamps,d),this.unignore(d)}},g.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=e.makeArray(a)):void 0},g.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},g.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},g.prototype._manageStamp=j,g.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,e=d(a),f={left:b.left-c.left-e.marginLeft,top:b.top-c.top-e.marginTop,right:c.right-b.right-e.marginRight,bottom:c.bottom-b.bottom-e.marginBottom};return f},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.bindResize=function(){this.isResizeBound||(b.bind(a,"resize",this),this.isResizeBound=!0)},g.prototype.unbindResize=function(){this.isResizeBound&&b.unbind(a,"resize",this),this.isResizeBound=!1},g.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},g.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},g.prototype.needsResizeLayout=function(){var a=d(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},g.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},g.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},g.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},g.prototype.reveal=function(a){this._emitCompleteOnItems("reveal",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.reveal()}},g.prototype.hide=function(a){this._emitCompleteOnItems("hide",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.hide()}},g.prototype.revealItemElements=function(a){var b=this.getItems(a);this.reveal(b)},g.prototype.hideItemElements=function(a){var b=this.getItems(a);this.hide(b)},g.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},g.prototype.getItems=function(a){a=e.makeArray(a);for(var b=[],c=0,d=a.length;d>c;c++){var f=a[c],g=this.getItem(f);g&&b.push(g)}return b},g.prototype.remove=function(a){var b=this.getItems(a);if(this._emitCompleteOnItems("remove",b),b&&b.length)for(var c=0,d=b.length;d>c;c++){var f=b[c];f.remove(),e.removeFrom(this.items,f)}},g.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},g.data=function(a){a=e.getQueryElement(a);var b=a&&a.outlayerGUID;return b&&l[b]},g.create=function(a,b){function c(){g.apply(this,arguments)}return Object.create?c.prototype=Object.create(g.prototype):e.extend(c.prototype,g.prototype),c.prototype.constructor=c,c.defaults=e.extend({},g.defaults),e.extend(c.defaults,b),c.prototype.settings={},c.namespace=a,c.data=g.data,c.Item=function(){f.apply(this,arguments)},c.Item.prototype=new f,e.htmlInit(c,a),i&&i.bridget&&i.bridget(a,c),c},g.Item=f,g}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],b):"object"==typeof exports?module.exports=b(require("outlayer")):(a.Isotope=a.Isotope||{},a.Isotope.Item=b(a.Outlayer))}(window,function(a){"use strict";function b(){a.Item.apply(this,arguments)}b.prototype=new a.Item,b.prototype._create=function(){this.id=this.layout.itemGUID++,a.Item.prototype._create.call(this),this.sortData={}},b.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var a=this.layout.options.getSortData,b=this.layout._sorters;for(var c in a){var d=b[c];this.sortData[c]=d(this.element,this)}}};var c=b.prototype.destroy;return b.prototype.destroy=function(){c.apply(this,arguments),this.css({display:""})},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],b):"object"==typeof exports?module.exports=b(require("get-size"),require("outlayer")):(a.Isotope=a.Isotope||{},a.Isotope.LayoutMode=b(a.getSize,a.Outlayer))}(window,function(a,b){"use strict";function c(a){this.isotope=a,a&&(this.options=a.options[this.namespace],this.element=a.element,this.items=a.filteredItems,this.size=a.size)}return function(){function a(a){return function(){return b.prototype[a].apply(this.isotope,arguments)}}for(var d=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],e=0,f=d.length;f>e;e++){var g=d[e];c.prototype[g]=a(g)}}(),c.prototype.needsVerticalResizeLayout=function(){var b=a(this.isotope.element),c=this.isotope.size&&b;return c&&b.innerHeight!=this.isotope.size.innerHeight},c.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},c.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},c.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},c.prototype.getSegmentSize=function(a,b){var c=a+b,d="outer"+b;if(this._getMeasurement(c,d),!this[c]){var e=this.getFirstItemSize();this[c]=e&&e[d]||this.isotope.size["inner"+b]}},c.prototype.getFirstItemSize=function(){var b=this.isotope.filteredItems[0];return b&&b.element&&a(b.element)},c.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},c.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},c.modes={},c.create=function(a,b){function d(){c.apply(this,arguments)}return d.prototype=new c,b&&(d.options=b),d.prototype.namespace=a,c.modes[a]=d,d},c}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):a.Masonry=b(a.Outlayer,a.getSize,a.fizzyUIUtils)}(window,function(a,b,c){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}var d=this.columnWidth+=this.gutter,e=this.containerWidth+this.gutter,f=e/d,g=d-e%d,h=g&&1>g?"round":"floor";f=Math[h](f),this.cols=Math.max(f,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c.indexOf(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],b):"object"==typeof exports?module.exports=b(require("../layout-mode"),require("masonry-layout")):b(a.Isotope.LayoutMode,a.Masonry)}(window,function(a,b){"use strict";function c(a,b){for(var c in b)a[c]=b[c];return a}var d=a.create("masonry"),e=d.prototype._getElementOffset,f=d.prototype.layout,g=d.prototype._getMeasurement;
    c(d.prototype,b.prototype),d.prototype._getElementOffset=e,d.prototype.layout=f,d.prototype._getMeasurement=g;var h=d.prototype.measureColumns;d.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,h.call(this)};var i=d.prototype._manageStamp;return d.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,i.apply(this,arguments)},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],b):"object"==typeof exports?module.exports=b(require("../layout-mode")):b(a.Isotope.LayoutMode)}(window,function(a){"use strict";var b=a.create("fitRows");return b.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},b.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth+this.gutter,c=this.isotope.size.innerWidth+this.gutter;0!==this.x&&b+this.x>c&&(this.x=0,this.y=this.maxY);var d={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+a.size.outerHeight),this.x+=b,d},b.prototype._getContainerSize=function(){return{height:this.maxY}},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],b):"object"==typeof exports?module.exports=b(require("../layout-mode")):b(a.Isotope.LayoutMode)}(window,function(a){"use strict";var b=a.create("vertical",{horizontalAlignment:0});return b.prototype._resetLayout=function(){this.y=0},b.prototype._getItemLayoutPosition=function(a){a.getSize();var b=(this.isotope.size.innerWidth-a.size.outerWidth)*this.options.horizontalAlignment,c=this.y;return this.y+=a.size.outerHeight,{x:b,y:c}},b.prototype._getContainerSize=function(){return{height:this.y}},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","fizzy-ui-utils/utils","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],function(c,d,e,f,g,h){return b(a,c,d,e,f,g,h)}):"object"==typeof exports?module.exports=b(a,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("./item"),require("./layout-mode"),require("./layout-modes/masonry"),require("./layout-modes/fit-rows"),require("./layout-modes/vertical")):a.Isotope=b(a,a.Outlayer,a.getSize,a.matchesSelector,a.fizzyUIUtils,a.Isotope.Item,a.Isotope.LayoutMode)}(window,function(a,b,c,d,e,f,g){function h(a,b){return function(c,d){for(var e=0,f=a.length;f>e;e++){var g=a[e],h=c.sortData[g],i=d.sortData[g];if(h>i||i>h){var j=void 0!==b[g]?b[g]:b,k=j?1:-1;return(h>i?1:-1)*k}}return 0}}var i=a.jQuery,j=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^\s+|\s+$/g,"")},k=document.documentElement,l=k.textContent?function(a){return a.textContent}:function(a){return a.innerText},m=b.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});m.Item=f,m.LayoutMode=g,m.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),b.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var a in g.modes)this._initLayoutMode(a)},m.prototype.reloadItems=function(){this.itemGUID=0,b.prototype.reloadItems.call(this)},m.prototype._itemize=function(){for(var a=b.prototype._itemize.apply(this,arguments),c=0,d=a.length;d>c;c++){var e=a[c];e.id=this.itemGUID++}return this._updateItemsSortData(a),a},m.prototype._initLayoutMode=function(a){var b=g.modes[a],c=this.options[a]||{};this.options[a]=b.options?e.extend(b.options,c):c,this.modes[a]=new b(this)},m.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?void this.arrange():void this._layout()},m.prototype._layout=function(){var a=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,a),this._isLayoutInited=!0},m.prototype.arrange=function(a){function b(){d.reveal(c.needReveal),d.hide(c.needHide)}this.option(a),this._getIsInstant();var c=this._filter(this.items);this.filteredItems=c.matches;var d=this;this._bindArrangeComplete(),this._isInstant?this._noTransition(b):b(),this._sort(),this._layout()},m.prototype._init=m.prototype.arrange,m.prototype._getIsInstant=function(){var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=a,a},m.prototype._bindArrangeComplete=function(){function a(){b&&c&&d&&e.dispatchEvent("arrangeComplete",null,[e.filteredItems])}var b,c,d,e=this;this.once("layoutComplete",function(){b=!0,a()}),this.once("hideComplete",function(){c=!0,a()}),this.once("revealComplete",function(){d=!0,a()})},m.prototype._filter=function(a){var b=this.options.filter;b=b||"*";for(var c=[],d=[],e=[],f=this._getFilterTest(b),g=0,h=a.length;h>g;g++){var i=a[g];if(!i.isIgnored){var j=f(i);j&&c.push(i),j&&i.isHidden?d.push(i):j||i.isHidden||e.push(i)}}return{matches:c,needReveal:d,needHide:e}},m.prototype._getFilterTest=function(a){return i&&this.options.isJQueryFiltering?function(b){return i(b.element).is(a)}:"function"==typeof a?function(b){return a(b.element)}:function(b){return d(b.element,a)}},m.prototype.updateSortData=function(a){var b;a?(a=e.makeArray(a),b=this.getItems(a)):b=this.items,this._getSorters(),this._updateItemsSortData(b)},m.prototype._getSorters=function(){var a=this.options.getSortData;for(var b in a){var c=a[b];this._sorters[b]=n(c)}},m.prototype._updateItemsSortData=function(a){for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.updateSortData()}};var n=function(){function a(a){if("string"!=typeof a)return a;var c=j(a).split(" "),d=c[0],e=d.match(/^\[(.+)\]$/),f=e&&e[1],g=b(f,d),h=m.sortDataParsers[c[1]];return a=h?function(a){return a&&h(g(a))}:function(a){return a&&g(a)}}function b(a,b){var c;return c=a?function(b){return b.getAttribute(a)}:function(a){var c=a.querySelector(b);return c&&l(c)}}return a}();m.sortDataParsers={parseInt:function(a){return parseInt(a,10)},parseFloat:function(a){return parseFloat(a)}},m.prototype._sort=function(){var a=this.options.sortBy;if(a){var b=[].concat.apply(a,this.sortHistory),c=h(b,this.options.sortAscending);this.filteredItems.sort(c),a!=this.sortHistory[0]&&this.sortHistory.unshift(a)}},m.prototype._mode=function(){var a=this.options.layoutMode,b=this.modes[a];if(!b)throw new Error("No layout mode: "+a);return b.options=this.options[a],b},m.prototype._resetLayout=function(){b.prototype._resetLayout.call(this),this._mode()._resetLayout()},m.prototype._getItemLayoutPosition=function(a){return this._mode()._getItemLayoutPosition(a)},m.prototype._manageStamp=function(a){this._mode()._manageStamp(a)},m.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},m.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},m.prototype.appended=function(a){var b=this.addItems(a);if(b.length){var c=this._filterRevealAdded(b);this.filteredItems=this.filteredItems.concat(c)}},m.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){this._resetLayout(),this._manageStamps();var c=this._filterRevealAdded(b);this.layoutItems(this.filteredItems),this.filteredItems=c.concat(this.filteredItems),this.items=b.concat(this.items)}},m.prototype._filterRevealAdded=function(a){var b=this._filter(a);return this.hide(b.needHide),this.reveal(b.matches),this.layoutItems(b.matches,!0),b.matches},m.prototype.insert=function(a){var b=this.addItems(a);if(b.length){var c,d,e=b.length;for(c=0;e>c;c++)d=b[c],this.element.appendChild(d.element);var f=this._filter(b).matches;for(c=0;e>c;c++)b[c].isLayoutInstant=!0;for(this.arrange(),c=0;e>c;c++)delete b[c].isLayoutInstant;this.reveal(f)}};var o=m.prototype.remove;return m.prototype.remove=function(a){a=e.makeArray(a);var b=this.getItems(a);o.call(this,a);var c=b&&b.length;if(c)for(var d=0;c>d;d++){var f=b[d];e.removeFrom(this.filteredItems,f)}},m.prototype.shuffle=function(){for(var a=0,b=this.items.length;b>a;a++){var c=this.items[a];c.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},m.prototype._noTransition=function(a){var b=this.options.transitionDuration;this.options.transitionDuration=0;var c=a.call(this);return this.options.transitionDuration=b,c},m.prototype.getFilteredItemElements=function(){for(var a=[],b=0,c=this.filteredItems.length;c>b;b++)a.push(this.filteredItems[b].element);return a},m});

/*!
 * Packery layout mode PACKAGED v2.0.0
 * sub-classes Packery
 */

!function(a,b){"function"==typeof define&&define.amd?define("packery/js/rect",b):"object"==typeof module&&module.exports?module.exports=b():(a.Packery=a.Packery||{},a.Packery.Rect=b())}(window,function(){function a(b){for(var c in a.defaults)this[c]=a.defaults[c];for(c in b)this[c]=b[c]}a.defaults={x:0,y:0,width:0,height:0};var b=a.prototype;return b.contains=function(a){var b=a.width||0,c=a.height||0;return this.x<=a.x&&this.y<=a.y&&this.x+this.width>=a.x+b&&this.y+this.height>=a.y+c},b.overlaps=function(a){var b=this.x+this.width,c=this.y+this.height,d=a.x+a.width,e=a.y+a.height;return this.x<d&&b>a.x&&this.y<e&&c>a.y},b.getMaximalFreeRects=function(b){if(!this.overlaps(b))return!1;var c,d=[],e=this.x+this.width,f=this.y+this.height,g=b.x+b.width,h=b.y+b.height;return this.y<b.y&&(c=new a({x:this.x,y:this.y,width:this.width,height:b.y-this.y}),d.push(c)),e>g&&(c=new a({x:g,y:this.y,width:e-g,height:this.height}),d.push(c)),f>h&&(c=new a({x:this.x,y:h,width:this.width,height:f-h}),d.push(c)),this.x<b.x&&(c=new a({x:this.x,y:this.y,width:b.x-this.x,height:this.height}),d.push(c)),d},b.canFit=function(a){return this.width>=a.width&&this.height>=a.height},a}),function(a,b){if("function"==typeof define&&define.amd)define("packery/js/packer",["./rect"],b);else if("object"==typeof module&&module.exports)module.exports=b(require("./rect"));else{var c=a.Packery=a.Packery||{};c.Packer=b(c.Rect)}}(window,function(a){function b(a,b,c){this.width=a||0,this.height=b||0,this.sortDirection=c||"downwardLeftToRight",this.reset()}var c=b.prototype;c.reset=function(){this.spaces=[];var b=new a({x:0,y:0,width:this.width,height:this.height});this.spaces.push(b),this.sorter=d[this.sortDirection]||d.downwardLeftToRight},c.pack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b];if(c.canFit(a)){this.placeInSpace(a,c);break}}},c.columnPack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b],d=c.x<=a.x&&c.x+c.width>=a.x+a.width&&c.height>=a.height-.01;if(d){a.y=c.y,this.placed(a);break}}},c.rowPack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b],d=c.y<=a.y&&c.y+c.height>=a.y+a.height&&c.width>=a.width-.01;if(d){a.x=c.x,this.placed(a);break}}},c.placeInSpace=function(a,b){a.x=b.x,a.y=b.y,this.placed(a)},c.placed=function(a){for(var b=[],c=0;c<this.spaces.length;c++){var d=this.spaces[c],e=d.getMaximalFreeRects(a);e?b.push.apply(b,e):b.push(d)}this.spaces=b,this.mergeSortSpaces()},c.mergeSortSpaces=function(){b.mergeRects(this.spaces),this.spaces.sort(this.sorter)},c.addSpace=function(a){this.spaces.push(a),this.mergeSortSpaces()},b.mergeRects=function(a){var b=0,c=a[b];a:for(;c;){for(var d=0,e=a[b+d];e;){if(e==c)d++;else{if(e.contains(c)){a.splice(b,1),c=a[b];continue a}c.contains(e)?a.splice(b+d,1):d++}e=a[b+d]}b++,c=a[b]}return a};var d={downwardLeftToRight:function(a,b){return a.y-b.y||a.x-b.x},rightwardTopToBottom:function(a,b){return a.x-b.x||a.y-b.y}};return b}),function(a,b){"function"==typeof define&&define.amd?define("packery/js/item",["outlayer/outlayer","./rect"],b):"object"==typeof module&&module.exports?module.exports=b(require("outlayer"),require("./rect")):a.Packery.Item=b(a.Outlayer,a.Packery.Rect)}(window,function(a,b){var c=document.documentElement.style,d="string"==typeof c.transform?"transform":"WebkitTransform",e=function(){a.Item.apply(this,arguments)},f=e.prototype=Object.create(a.Item.prototype),g=f._create;f._create=function(){g.call(this),this.rect=new b};var h=f.moveTo;return f.moveTo=function(a,b){var c=Math.abs(this.position.x-a),d=Math.abs(this.position.y-b),e=this.layout.dragItemCount&&!this.isPlacing&&!this.isTransitioning&&1>c&&1>d;return e?void this.goTo(a,b):void h.apply(this,arguments)},f.enablePlacing=function(){this.removeTransitionStyles(),this.isTransitioning&&d&&(this.element.style[d]="none"),this.isTransitioning=!1,this.getSize(),this.layout._setRectSize(this.element,this.rect),this.isPlacing=!0},f.disablePlacing=function(){this.isPlacing=!1},f.removeElem=function(){this.element.parentNode.removeChild(this.element),this.layout.packer.addSpace(this.rect),this.emitEvent("remove",[this])},f.showDropPlaceholder=function(){var a=this.dropPlaceholder;a||(a=this.dropPlaceholder=document.createElement("div"),a.className="packery-drop-placeholder",a.style.position="absolute"),a.style.width=this.size.width+"px",a.style.height=this.size.height+"px",this.positionDropPlaceholder(),this.layout.element.appendChild(a)},f.positionDropPlaceholder=function(){this.dropPlaceholder.style[d]="translate("+this.rect.x+"px, "+this.rect.y+"px)"},f.hideDropPlaceholder=function(){this.layout.element.removeChild(this.dropPlaceholder)},e}),function(a,b){"function"==typeof define&&define.amd?define("packery/js/packery",["get-size/get-size","outlayer/outlayer","./rect","./packer","./item"],b):"object"==typeof module&&module.exports?module.exports=b(require("get-size"),require("outlayer"),require("./rect"),require("./packer"),require("./item")):a.Packery=b(a.getSize,a.Outlayer,a.Packery.Rect,a.Packery.Packer,a.Packery.Item)}(window,function(a,b,c,d,e){function f(a,b){return a.position.y-b.position.y||a.position.x-b.position.x}function g(a,b){return a.position.x-b.position.x||a.position.y-b.position.y}function h(a,b){var c=b.x-a.x,d=b.y-a.y;return Math.sqrt(c*c+d*d)}c.prototype.canFit=function(a){return this.width>=a.width-1&&this.height>=a.height-1};var i=b.create("packery");i.Item=e;var j=i.prototype;j._create=function(){b.prototype._create.call(this),this.packer=new d,this.shiftPacker=new d,this.isEnabled=!0,this.dragItemCount=0;var a=this;this.handleDraggabilly={dragStart:function(){a.itemDragStart(this.element)},dragMove:function(){a.itemDragMove(this.element,this.position.x,this.position.y)},dragEnd:function(){a.itemDragEnd(this.element)}},this.handleUIDraggable={start:function(b,c){c&&a.itemDragStart(b.currentTarget)},drag:function(b,c){c&&a.itemDragMove(b.currentTarget,c.position.left,c.position.top)},stop:function(b,c){c&&a.itemDragEnd(b.currentTarget)}}},j._resetLayout=function(){this.getSize(),this._getMeasurements();var a,b,c;this._getOption("horizontal")?(a=1/0,b=this.size.innerHeight+this.gutter,c="rightwardTopToBottom"):(a=this.size.innerWidth+this.gutter,b=1/0,c="downwardLeftToRight"),this.packer.width=this.shiftPacker.width=a,this.packer.height=this.shiftPacker.height=b,this.packer.sortDirection=this.shiftPacker.sortDirection=c,this.packer.reset(),this.maxY=0,this.maxX=0},j._getMeasurements=function(){this._getMeasurement("columnWidth","width"),this._getMeasurement("rowHeight","height"),this._getMeasurement("gutter","width")},j._getItemLayoutPosition=function(a){if(this._setRectSize(a.element,a.rect),this.isShifting||this.dragItemCount>0){var b=this._getPackMethod();this.packer[b](a.rect)}else this.packer.pack(a.rect);return this._setMaxXY(a.rect),a.rect},j.shiftLayout=function(){this.isShifting=!0,this.layout(),delete this.isShifting},j._getPackMethod=function(){return this._getOption("horizontal")?"rowPack":"columnPack"},j._setMaxXY=function(a){this.maxX=Math.max(a.x+a.width,this.maxX),this.maxY=Math.max(a.y+a.height,this.maxY)},j._setRectSize=function(b,c){var d=a(b),e=d.outerWidth,f=d.outerHeight;(e||f)&&(e=this._applyGridGutter(e,this.columnWidth),f=this._applyGridGutter(f,this.rowHeight)),c.width=Math.min(e,this.packer.width),c.height=Math.min(f,this.packer.height)},j._applyGridGutter=function(a,b){if(!b)return a+this.gutter;b+=this.gutter;var c=a%b,d=c&&1>c?"round":"ceil";return a=Math[d](a/b)*b},j._getContainerSize=function(){return this._getOption("horizontal")?{width:this.maxX-this.gutter}:{height:this.maxY-this.gutter}},j._manageStamp=function(a){var b,d=this.getItem(a);if(d&&d.isPlacing)b=d.rect;else{var e=this._getElementOffset(a);b=new c({x:this._getOption("originLeft")?e.left:e.right,y:this._getOption("originTop")?e.top:e.bottom})}this._setRectSize(a,b),this.packer.placed(b),this._setMaxXY(b)},j.sortItemsByPosition=function(){var a=this._getOption("horizontal")?g:f;this.items.sort(a)},j.fit=function(a,b,c){var d=this.getItem(a);d&&(this.stamp(d.element),d.enablePlacing(),this.updateShiftTargets(d),b=void 0===b?d.rect.x:b,c=void 0===c?d.rect.y:c,this.shift(d,b,c),this._bindFitEvents(d),d.moveTo(d.rect.x,d.rect.y),this.shiftLayout(),this.unstamp(d.element),this.sortItemsByPosition(),d.disablePlacing())},j._bindFitEvents=function(a){function b(){d++,2==d&&c.dispatchEvent("fitComplete",null,[a])}var c=this,d=0;a.once("layout",b),this.once("layoutComplete",b)},j.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&(this.options.shiftPercentResize?this.resizeShiftPercentLayout():this.layout())},j.needsResizeLayout=function(){var b=a(this.element),c=this._getOption("horizontal")?"innerHeight":"innerWidth";return b[c]!=this.size[c]},j.resizeShiftPercentLayout=function(){var b=this._getItemsForLayout(this.items),c=this._getOption("horizontal"),d=c?"y":"x",e=c?"height":"width",f=c?"rowHeight":"columnWidth",g=c?"innerHeight":"innerWidth",h=this[f];if(h=h&&h+this.gutter){this._getMeasurements();var i=this[f]+this.gutter;b.forEach(function(a){var b=Math.round(a.rect[d]/h);a.rect[d]=b*i})}else{var j=a(this.element)[g]+this.gutter,k=this.packer[e];b.forEach(function(a){a.rect[d]=a.rect[d]/k*j})}this.shiftLayout()},j.itemDragStart=function(a){if(this.isEnabled){this.stamp(a);var b=this.getItem(a);b&&(b.enablePlacing(),b.showDropPlaceholder(),this.dragItemCount++,this.updateShiftTargets(b))}},j.updateShiftTargets=function(a){this.shiftPacker.reset(),this._getBoundingRect();var b=this._getOption("originLeft"),d=this._getOption("originTop");this.stamps.forEach(function(a){var e=this.getItem(a);if(!e||!e.isPlacing){var f=this._getElementOffset(a),g=new c({x:b?f.left:f.right,y:d?f.top:f.bottom});this._setRectSize(a,g),this.shiftPacker.placed(g)}},this);var e=this._getOption("horizontal"),f=e?"rowHeight":"columnWidth",g=e?"height":"width";this.shiftTargetKeys=[],this.shiftTargets=[];var h,i=this[f];if(i=i&&i+this.gutter){var j=Math.ceil(a.rect[g]/i),k=Math.floor((this.shiftPacker[g]+this.gutter)/i);h=(k-j)*i;for(var l=0;k>l;l++)this._addShiftTarget(l*i,0,h)}else h=this.shiftPacker[g]+this.gutter-a.rect[g],this._addShiftTarget(0,0,h);var m=this._getItemsForLayout(this.items),n=this._getPackMethod();m.forEach(function(a){var b=a.rect;this._setRectSize(a.element,b),this.shiftPacker[n](b),this._addShiftTarget(b.x,b.y,h);var c=e?b.x+b.width:b.x,d=e?b.y:b.y+b.height;if(this._addShiftTarget(c,d,h),i)for(var f=Math.round(b[g]/i),j=1;f>j;j++){var k=e?c:b.x+i*j,l=e?b.y+i*j:d;this._addShiftTarget(k,l,h)}},this)},j._addShiftTarget=function(a,b,c){var d=this._getOption("horizontal")?b:a;if(!(0!==d&&d>c)){var e=a+","+b,f=-1!=this.shiftTargetKeys.indexOf(e);f||(this.shiftTargetKeys.push(e),this.shiftTargets.push({x:a,y:b}))}},j.shift=function(a,b,c){var d,e=1/0,f={x:b,y:c};this.shiftTargets.forEach(function(a){var b=h(a,f);e>b&&(d=a,e=b)}),a.rect.x=d.x,a.rect.y=d.y};var k=120;j.itemDragMove=function(a,b,c){function d(){f.shift(e,b,c),e.positionDropPlaceholder(),f.layout()}var e=this.isEnabled&&this.getItem(a);if(e){b-=this.size.paddingLeft,c-=this.size.paddingTop;var f=this,g=new Date;this._itemDragTime&&g-this._itemDragTime<k?(clearTimeout(this.dragTimeout),this.dragTimeout=setTimeout(d,k)):(d(),this._itemDragTime=g)}},j.itemDragEnd=function(a){function b(){d++,2==d&&(c.element.classList.remove("is-positioning-post-drag"),c.hideDropPlaceholder(),e.dispatchEvent("dragItemPositioned",null,[c]))}var c=this.isEnabled&&this.getItem(a);if(c){clearTimeout(this.dragTimeout),c.element.classList.add("is-positioning-post-drag");var d=0,e=this;c.once("layout",b),this.once("layoutComplete",b),c.moveTo(c.rect.x,c.rect.y),this.layout(),this.dragItemCount=Math.max(0,this.dragItemCount-1),this.sortItemsByPosition(),c.disablePlacing(),this.unstamp(c.element)}},j.bindDraggabillyEvents=function(a){this._bindDraggabillyEvents(a,"on")},j.unbindDraggabillyEvents=function(a){this._bindDraggabillyEvents(a,"off")},j._bindDraggabillyEvents=function(a,b){var c=this.handleDraggabilly;a[b]("dragStart",c.dragStart),a[b]("dragMove",c.dragMove),a[b]("dragEnd",c.dragEnd)},j.bindUIDraggableEvents=function(a){this._bindUIDraggableEvents(a,"on")},j.unbindUIDraggableEvents=function(a){this._bindUIDraggableEvents(a,"off")},j._bindUIDraggableEvents=function(a,b){var c=this.handleUIDraggable;a[b]("dragstart",c.start)[b]("drag",c.drag)[b]("dragstop",c.stop)};var l=j.destroy;return j.destroy=function(){l.apply(this,arguments),this.isEnabled=!1},i.Rect=c,i.Packer=d,i}),function(a,b){"function"==typeof define&&define.amd?define(["isotope/js/layout-mode","packery/js/packery"],b):"object"==typeof module&&module.exports?module.exports=b(require("isotope-layout/js/layout-mode"),require("packery")):b(a.Isotope.LayoutMode,a.Packery)}(window,function(a,b){var c=a.create("packery"),d=c.prototype,e={_getElementOffset:!0,_getMeasurement:!0};for(var f in b.prototype)e[f]||(d[f]=b.prototype[f]);var g=d._resetLayout;d._resetLayout=function(){this.packer=this.packer||new b.Packer,this.shiftPacker=this.shiftPacker||new b.Packer,g.apply(this,arguments)};var h=d._getItemLayoutPosition;d._getItemLayoutPosition=function(a){return a.rect=a.rect||new b.Rect,h.call(this,a)};var i=d.needsResizeLayout;d.needsResizeLayout=function(){return this._getOption("horizontal")?this.needsVerticalResizeLayout():i.call(this)};var j=d._getOption;return d._getOption=function(a){return"horizontal"==a?void 0!==this.options.isHorizontal?this.options.isHorizontal:this.options.horizontal:j.apply(this.isotope,arguments)},c});

/**
 * Event.simulate(@element, eventName[, options]) -> Element
 *
 * - @element: element to fire event on
 * - eventName: name of event to fire (only MouseEvents and HTMLEvents interfaces are supported)
 * - options: optional object to fine-tune event properties - pointerX, pointerY, ctrlKey, etc.
 *
 * $('foo').simulate('click'); // => fires "click" event on an element with id=foo
 *
 **/
(function(){

    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
    }
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    }

    Event.simulate = function(element, eventName) {
        var options = Object.extend(defaultOptions, arguments[2] || { });
        var oEvent, eventType = null;

        element = $(element);

        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }

        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                    options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            oEvent = Object.extend(document.createEventObject(), options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }

    Element.addMethods({ simulate: Event.simulate });
})();

/*! echo.js v1.7.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,a={},u=function(){},d=function(t){return null===t.offsetParent},i=function(t,e){if(d(t))return!1;var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},l=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){a.render(),n=null},o))};return a.init=function(n){n=n||{};var d=n.offset||0,i=n.offsetVertical||d,f=n.offsetHorizontal||d,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,i),b:s(n.offsetBottom,i),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,u=n.callback||u,a.render(),document.addEventListener?(t.addEventListener("scroll",l,!1),t.addEventListener("load",l,!1)):(t.attachEvent("onscroll",l),t.attachEvent("onload",l))},a.render=function(){for(var n,o,r=document.querySelectorAll("img[data-echo], [data-echo-background]"),d=r.length,l={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},f=0;d>f;f++)o=r[f],i(o,l)?(c&&o.setAttribute("data-echo-placeholder",o.src),null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+o.getAttribute("data-echo-background")+")":o.src=o.getAttribute("data-echo"),c||(o.removeAttribute("data-echo"),o.removeAttribute("data-echo-background")),u(o,"load")):c&&(n=o.getAttribute("data-echo-placeholder"))&&(null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+n+")":o.src=n,o.removeAttribute("data-echo-placeholder"),u(o,"unload"));d||a.detach()},a.detach=function(){document.removeEventListener?t.removeEventListener("scroll",l):t.detachEvent("onscroll",l),clearTimeout(n)},a});

/*!
 * imagesLoaded PACKAGED v3.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("eventEmitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(this,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function c(e){this.img=e}function f(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},s.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),c.prototype=new t,c.prototype.check=function(){var e=v[this.img.src]||new f(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},c.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return f.prototype=new t,f.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},f.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},f.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},f.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},f.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},f.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});

// Pointer abstraction
/**
 * This class provides an easy and abstracted mechanism to determine the
 * best pointer behavior to use -- that is, is the user currently interacting
 * with their device in a touch manner, or using a mouse.
 *
 * Since devices may use either touch or mouse or both, there is no way to
 * know the user's preferred pointer type until they interact with the site.
 *
 * To accommodate this, this class provides a method and two events
 * to determine the user's preferred pointer type.
 *
 * - getPointer() returns the last used pointer type, or, if the user has
 *   not yet interacted with the site, falls back to a Modernizr test.
 *
 * - The mouse-detected event is triggered on the window object when the user
 *   is using a mouse pointer input, or has switched from touch to mouse input.
 *   It can be observed in this manner: $j(window).on('mouse-detected', function(event) { // custom code });
 *
 * - The touch-detected event is triggered on the window object when the user
 *   is using touch pointer input, or has switched from mouse to touch input.
 *   It can be observed in this manner: $j(window).on('touch-detected', function(event) { // custom code });
 */
var PointerManager = {
    MOUSE_POINTER_TYPE: 'mouse',
    TOUCH_POINTER_TYPE: 'touch',
    POINTER_EVENT_TIMEOUT_MS: 500,
    standardTouch: false,
    touchDetectionEvent: null,
    lastTouchType: null,
    pointerTimeout: null,
    pointerEventLock: false,

    getPointerEventsSupported: function() {
        return this.standardTouch;
    },

    getPointerEventsInputTypes: function() {
        if (window.navigator.pointerEnabled) { //IE 11+
            //return string values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
            return {
                MOUSE: 'mouse',
                TOUCH: 'touch',
                PEN: 'pen'
            };
        } else if (window.navigator.msPointerEnabled) { //IE 10
            //return numeric values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
            return {
                MOUSE:  0x00000004,
                TOUCH:  0x00000002,
                PEN:    0x00000003
            };
        } else { //other browsers don't support pointer events
            return {}; //return empty object
        }
    },

    /**
     * If called before init(), get best guess of input pointer type
     * using Modernizr test.
     * If called after init(), get current pointer in use.
     */
    getPointer: function() {
        // On iOS devices, always default to touch, as this.lastTouchType will intermittently return 'mouse' if
        // multiple touches are triggered in rapid succession in Safari on iOS
        if(Modernizr.ios) {
            return this.TOUCH_POINTER_TYPE;
        }

        if(this.lastTouchType) {
            return this.lastTouchType;
        }

        return Modernizr.touch ? this.TOUCH_POINTER_TYPE : this.MOUSE_POINTER_TYPE;
    },

    setPointerEventLock: function() {
        this.pointerEventLock = true;
    },
    clearPointerEventLock: function() {
        this.pointerEventLock = false;
    },
    setPointerEventLockTimeout: function() {
        var that = this;

        if(this.pointerTimeout) {
            clearTimeout(this.pointerTimeout);
        }

        this.setPointerEventLock();
        this.pointerTimeout = setTimeout(function() { that.clearPointerEventLock(); }, this.POINTER_EVENT_TIMEOUT_MS);
    },

    triggerMouseEvent: function(originalEvent) {
        if(this.lastTouchType == this.MOUSE_POINTER_TYPE) {
            return; //prevent duplicate events
        }

        this.lastTouchType = this.MOUSE_POINTER_TYPE;
        $j(window).trigger('mouse-detected', originalEvent);
    },
    triggerTouchEvent: function(originalEvent) {
        if(this.lastTouchType == this.TOUCH_POINTER_TYPE) {
            return; //prevent duplicate events
        }

        this.lastTouchType = this.TOUCH_POINTER_TYPE;
        $j(window).trigger('touch-detected', originalEvent);
    },

    initEnv: function() {
        if (window.navigator.pointerEnabled) {
            this.standardTouch = true;
            this.touchDetectionEvent = 'pointermove';
        } else if (window.navigator.msPointerEnabled) {
            this.standardTouch = true;
            this.touchDetectionEvent = 'MSPointerMove';
        } else {
            this.touchDetectionEvent = 'touchstart';
        }
    },

    wirePointerDetection: function() {
        var that = this;

        if(this.standardTouch) { //standard-based touch events. Wire only one event.
            //detect pointer event
            $j(window).on(this.touchDetectionEvent, function(e) {
                switch(e.originalEvent.pointerType) {
                    case that.getPointerEventsInputTypes().MOUSE:
                        that.triggerMouseEvent(e);
                        break;
                    case that.getPointerEventsInputTypes().TOUCH:
                    case that.getPointerEventsInputTypes().PEN:
                        // intentionally group pen and touch together
                        that.triggerTouchEvent(e);
                        break;
                }
            });
        } else { //non-standard touch events. Wire touch and mouse competing events.
            //detect first touch
            $j(window).on(this.touchDetectionEvent, function(e) {
                if(that.pointerEventLock) {
                    return;
                }

                that.setPointerEventLockTimeout();
                that.triggerTouchEvent(e);
            });

            //detect mouse usage
            $j(document).on('mouseover', function(e) {
                if(that.pointerEventLock) {
                    return;
                }

                that.setPointerEventLockTimeout();
                that.triggerMouseEvent(e);
            });
        }
    },

    init: function() {
        this.initEnv();
        this.wirePointerDetection();
    }
};

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);