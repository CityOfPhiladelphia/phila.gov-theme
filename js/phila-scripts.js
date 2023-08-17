(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/*! skinny.js v0.1.0 | Copyright 2013 Vistaprint | vistaprint.github.io/SkinnyJS/LICENSE
http://vistaprint.github.io/SkinnyJS/download-builder.html?modules=jquery.delimitedString,jquery.queryString*/

module.exports = function ($) {

    // Takes a plain javascript object (key value pairs), and encodes it as a string
    // using the specified delimiters and encoders
    $.encodeDelimitedString = function (data, itemDelimiter, pairDelimiter, keyEncoder, valueEncoder) {
        if (!data) {
            return "";
        }

        keyEncoder = keyEncoder || function (s) {
            return s;
        };
        valueEncoder = valueEncoder || keyEncoder;

        var sb = [];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                sb.push(keyEncoder(key) + pairDelimiter + valueEncoder(data[key]));
            }
        }

        return sb.join(itemDelimiter);
    };

    // Takes an encoded string, and parses it into a plain javascript object (key value pairs)
    // using the specified delimiters and decoders
    $.parseDelimitedString = function (delimitedString, itemDelimiter, pairDelimiter, keyDecoder, valueDecoder) {
        keyDecoder = keyDecoder || function (s) {
            return s;
        };
        valueDecoder = valueDecoder || keyDecoder;

        var ret = {};

        if (delimitedString) {
            var pairs = delimitedString.split(itemDelimiter);
            var len = pairs.length;
            for (var i = 0; i < len; i++) {
                var pair = pairs[i];

                if (pair.length > 0) {
                    var delimIndex = pair.indexOf(pairDelimiter);
                    var key, value;

                    if (delimIndex > 0 && delimIndex <= pair.length - 1) {
                        key = pair.substring(0, delimIndex);
                        value = pair.substring(delimIndex + 1);
                    } else {
                        key = pair;
                    }

                    ret[keyDecoder(key)] = valueDecoder(value);
                }
            }
        }

        return ret;
    };
}(jQuery);
; /// <reference path="jquery.delimitedString.js" />

(function ($) {
    var PLUS_RE = /\+/gi;

    var urlDecode = function urlDecode(s) {
        // Specifically treat null/undefined as empty string
        if (s == null) {
            return "";
        }

        // Replace plus with space- jQuery.param() explicitly encodes them,
        // and decodeURIComponent explicitly does not.
        return decodeURIComponent(s.replace(PLUS_RE, " "));
    };

    // Given a querystring (as a string), deserializes it to a javascript object.
    $.deparam = function (queryString) {
        if (typeof queryString != "string") {
            throw new Error("$.deparam() expects a string for 'queryString' argument.");
        }

        // Remove "?", which starts querystrings
        if (queryString && queryString.charAt(0) == "?") {
            queryString = queryString.substring(1, queryString.length);
        }

        return $.parseDelimitedString(queryString, "&", "=", urlDecode);
    };

    // Alias
    $.parseQueryString = $.deparam;

    // Gets the querystring from the current document.location as a javascript object.
    $.currentQueryString = function () {
        return $.deparam(window.location.search);
    };

    // Given a url (pathname) and an object representing a querystring, constructs a full URL
    $.appendQueryString = function (url, parsedQueryString) {
        var qs = $.param(parsedQueryString);
        if (qs.length > 0) {
            qs = "?" + qs;
        }

        return url + qs;
    };
})(jQuery);

},{}],2:[function(require,module,exports){
"use strict";

(function ($) {
  var queryParser = function queryParser(a) {
    var i,
        p,
        b = {};
    if (a === "") {
      return {};
    }
    for (i = 0; i < a.length; i += 1) {
      p = a[i].split('=');
      if (p.length === 2) {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  };
  $.queryParams = function () {
    return queryParser(window.location.search.substr(1).split('&'));
  };
  $.hashParams = function () {
    return queryParser(window.location.hash.substr(1).split('&'));
  };

  var ident = 0;

  window.Swiftype = window.Swiftype || {};
  Swiftype.root_url = Swiftype.root_url || 'https://api.swiftype.com';
  Swiftype.pingUrl = function (endpoint, callback) {
    var to = setTimeout(callback, 350);
    var img = new Image();
    img.onload = img.onerror = function () {
      clearTimeout(to);
      callback();
    };
    img.src = endpoint;
    return false;
  };
  Swiftype.pingAutoSelection = function (engineKey, docId, value, callback) {
    var params = {
      t: new Date().getTime(),
      engine_key: engineKey,
      doc_id: docId,
      prefix: value
    };
    var url = Swiftype.root_url + '/api/v1/public/analytics/pas?' + $.param(params);
    Swiftype.pingUrl(url, callback);
  };
  Swiftype.findSelectedSection = function () {
    var sectionText = $.hashParams().sts;
    if (!sectionText) {
      return;
    }

    function normalizeText(str) {
      var out = str.replace(/\s+/g, '');
      out = out.toLowerCase();
      return out;
    }

    sectionText = normalizeText(sectionText);

    $('h1, h2, h3, h4, h5, h6').each(function (idx) {
      $this = $(this);
      if (normalizeText($this.text()).indexOf(sectionText) >= 0) {
        this.scrollIntoView(true);
        return false;
      }
    });
  };

  Swiftype.htmlEscape = Swiftype.htmlEscape || function htmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  $.fn.swiftype = function (options) {
    Swiftype.findSelectedSection();
    var options = $.extend({}, $.fn.swiftype.defaults, options);

    return this.each(function () {
      var $this = $(this);
      var config = $.meta ? $.extend({}, options, $this.data()) : options;
      $this.attr('autocomplete', 'off');
      $this.data('swiftype-config-autocomplete', config);
      $this.submitted = false;
      $this.cache = new LRUCache(10);
      $this.emptyQueries = [];

      $this.isEmpty = function (query) {
        return $.inArray(normalize(query), this.emptyQueries) >= 0;
      };

      $this.addEmpty = function (query) {
        $this.emptyQueries.unshift(normalize(query));
      };

      var styles = config.dropdownStylesFunction($this);
      var $swiftypeWidget = $('<div class="swiftype-widget" />');
      var $listContainer = $('<div />').addClass(config.suggestionListClass).appendTo($swiftypeWidget).css(styles).hide();
      $swiftypeWidget.appendTo(config.autocompleteContainingElement);
      var $list = $('<' + config.suggestionListType + ' />').appendTo($listContainer);

      $this.data('swiftype-list', $list);

      $this.abortCurrent = function () {
        if ($this.currentRequest) {
          $this.currentRequest.abort();
        }
      };

      $this.showList = function () {
        if (handleFunctionParam(config.disableAutocomplete) === false) {
          $listContainer.show();
        }
      };

      $this.hideList = function (sync) {
        if (sync) {
          $listContainer.hide();
        } else {
          setTimeout(function () {
            $listContainer.hide();
          }, 10);
        }
      };

      $this.focused = function () {
        return $this.is(':focus');
      };

      $this.submitting = function () {
        $this.submitted = true;
      };

      $this.listResults = function () {
        return $(config.resultListSelector, $list);
      };

      $this.activeResult = function () {
        return $this.listResults().filter('.' + config.activeItemClass).first();
      };

      $this.prevResult = function () {
        var list = $this.listResults(),
            currentIdx = list.index($this.activeResult()),
            nextIdx = currentIdx - 1,
            next = list.eq(nextIdx);
        $this.listResults().removeClass(config.activeItemClass);
        if (nextIdx >= 0) {
          next.addClass(config.activeItemClass);
        }
      };

      $this.nextResult = function () {
        var list = $this.listResults(),
            currentIdx = list.index($this.activeResult()),
            nextIdx = currentIdx + 1,
            next = list.eq(nextIdx);
        $this.listResults().removeClass(config.activeItemClass);
        if (nextIdx >= 0) {
          next.addClass(config.activeItemClass);
        }
      };

      $this.selectedCallback = function (data) {
        return function () {
          var value = $this.val(),
              callback = function callback() {
            config.onComplete(data, value);
          };
          Swiftype.pingAutoSelection(config.engineKey, data['id'], value, callback);
        };
      };

      $this.registerResult = function ($element, data) {
        $element.data('swiftype-item', data);
        $element.click($this.selectedCallback(data)).mouseover(function () {
          $this.listResults().removeClass(config.activeItemClass);
          $element.addClass(config.activeItemClass);
        });
      };

      $this.getContext = function () {
        return {
          config: config,
          list: $list,
          registerResult: $this.registerResult
        };
      };

      var typingDelayPointer;
      var suppressKey = false;
      $this.lastValue = '';
      $this.keyup(function (event) {
        if (suppressKey) {
          suppressKey = false;
          return;
        }

        // ignore arrow keys, shift
        if (event.which > 36 && event.which < 41 || event.which == 16) return;

        if (config.typingDelay > 0) {
          clearTimeout(typingDelayPointer);
          typingDelayPointer = setTimeout(function () {
            processInput($this);
          }, config.typingDelay);
        } else {
          processInput($this);
        }
      });

      $this.styleDropdown = function () {
        $listContainer.css(config.dropdownStylesFunction($this));
      };

      $this.keydown(function (event) {
        $this.styleDropdown();
        // enter = 13; up = 38; down = 40; esc = 27
        var $active = $this.activeResult();
        switch (event.which) {
          case 13:
            if ($active.length !== 0 && $list.is(':visible')) {
              event.preventDefault();
              $this.selectedCallback($active.data('swiftype-item'))();
            } else if ($this.currentRequest) {
              $this.submitting();
            }
            $this.hideList();
            suppressKey = true;
            break;
          case 38:
            event.preventDefault();
            if ($active.length === 0) {
              $this.listResults().last().addClass(config.activeItemClass);
            } else {
              $this.prevResult();
            }
            break;
          case 40:
            event.preventDefault();
            if ($active.length === 0) {
              $this.listResults().first().addClass(config.activeItemClass);
            } else if ($active != $this.listResults().last()) {
              $this.nextResult();
            }
            break;
          case 27:
            $this.hideList();
            suppressKey = true;
            break;
          default:
            $this.submitted = false;
            break;
        }
      });

      // opera wants keypress rather than keydown to prevent the form submit
      $this.keypress(function (event) {
        if (event.which == 13 && $this.activeResult().length > 0) {
          event.preventDefault();
        }
      });

      // stupid hack to get around loss of focus on mousedown
      var mouseDown = false;
      var blurWait = false;
      $(document).bind('mousedown.swiftype' + ++ident, function () {
        mouseDown = true;
      });
      $(document).bind('mouseup.swiftype' + ident, function () {
        mouseDown = false;
        if (blurWait) {
          blurWait = false;
          $this.hideList();
        }
      });
      $this.blur(function () {
        if (mouseDown) {
          blurWait = true;
        } else {
          $this.hideList();
        }
      });
      $this.focus(function () {
        setTimeout(function () {
          $this.select();
        }, 10);
        if ($this.listResults().filter(':not(.' + config.noResultsClass + ')').length > 0) {
          $this.showList();
        }
      });
    });
  };

  var normalize = function normalize(str) {
    return $.trim(str).toLowerCase();
  };

  var callRemote = function callRemote($this, term) {
    $this.abortCurrent();

    var params = {},
        config = $this.data('swiftype-config-autocomplete');

    params['q'] = term;
    params['engine_key'] = config.engineKey;
    params['search_fields'] = handleFunctionParam(config.searchFields);
    params['fetch_fields'] = handleFunctionParam(config.fetchFields);
    params['filters'] = handleFunctionParam(config.filters);
    params['document_types'] = handleFunctionParam(config.documentTypes);
    params['functional_boosts'] = handleFunctionParam(config.functionalBoosts);
    params['sort_field'] = handleFunctionParam(config.sortField);
    params['sort_direction'] = handleFunctionParam(config.sortDirection);
    params['per_page'] = config.resultLimit;

    var endpoint = Swiftype.root_url + '/api/v1/public/engines/suggest.json';
    if (params['q'].length >= 4) {
      // only autocompletes when there are 4+ characters in the query to prevent sending too many requests to swiftype
      $this.currentRequest = $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: endpoint,
        data: params,
        success: function success(data) {

          var norm = normalize(term);
          if (data.record_count > 0) {
            $this.cache.put(norm, data.records);
          } else {
            $this.addEmpty(norm);
            $this.data('swiftype-list').empty();
            $this.hideList();
            return;
          }
          processData($this, data.records, term);
        }
      });
    }
  };
  var getResults = function getResults($this, term) {
    var norm = normalize(term);
    if ($this.isEmpty(norm)) {
      $this.data('swiftype-list').empty();
      $this.hideList();
      return;
    }
    var cached = $this.cache.get(norm);
    if (cached) {
      processData($this, cached, term);
    } else {
      callRemote($this, term);
    }
  };

  // private helpers
  var processInput = function processInput($this) {
    var term = $this.val();
    if (term === $this.lastValue) {
      return;
    }
    $this.lastValue = term;
    if ($.trim(term) === '') {
      $this.data('swiftype-list').empty();
      $this.hideList();
      return;
    }
    if (typeof $this.data('swiftype-config-autocomplete').engineKey !== 'undefined') {
      getResults($this, term);
    }
  };

  var processData = function processData($this, data, term) {
    var $list = $this.data('swiftype-list'),
        config = $this.data('swiftype-config-autocomplete');

    $list.empty();
    $this.hideList(true);

    config.resultRenderFunction($this.getContext(), data);

    var totalItems = $this.listResults().length;
    if (totalItems > 0 && $this.focused() || config.noResultsMessage !== undefined) {
      if ($this.submitted) {
        $this.submitted = false;
      } else {
        $this.showList();
      }
    }
  };

  var defaultResultRenderFunction = function defaultResultRenderFunction(ctx, results) {
    var $list = ctx.list,
        config = ctx.config;

    $.each(results, function (document_type, items) {
      $.each(items, function (idx, item) {
        ctx.registerResult($('<li>' + config.renderFunction(document_type, item) + '</li>').appendTo($list), item);
      });
    });
  };

  var defaultRenderFunction = function defaultRenderFunction(document_type, item) {
    return '<p class="title">' + Swiftype.htmlEscape(item['title']) + '</p>';
  };

  var defaultOnComplete = function defaultOnComplete(item, prefix) {
    window.location = item['url'];
  };

  var defaultDropdownStylesFunction = function defaultDropdownStylesFunction($this) {
    var config = $this.data('swiftype-config-autocomplete');
    var $attachEl = config.attachTo ? $(config.attachTo) : $this;
    var offset = $attachEl.offset();
    var styles = {
      'position': 'absolute',
      'z-index': 9999,
      'top': offset.top + $attachEl.outerHeight() + 1,
      'left': offset.left
    };
    if (config.setWidth) {
      styles['width'] = $attachEl.outerWidth() - 2;
    }
    return styles;
  };

  var handleFunctionParam = function handleFunctionParam(field) {
    if (field !== undefined) {
      var evald = field;
      if (typeof evald === 'function') {
        evald = evald.call();
      }
      return evald;
    }
    return undefined;
  };

  // simple client-side LRU Cache, based on https://github.com/rsms/js-lru

  function LRUCache(limit) {
    this.size = 0;
    this.limit = limit;
    this._keymap = {};
  }

  LRUCache.prototype.put = function (key, value) {
    var entry = {
      key: key,
      value: value
    };
    this._keymap[key] = entry;
    if (this.tail) {
      this.tail.newer = entry;
      entry.older = this.tail;
    } else {
      this.head = entry;
    }
    this.tail = entry;
    if (this.size === this.limit) {
      return this.shift();
    } else {
      this.size++;
    }
  };

  LRUCache.prototype.shift = function () {
    var entry = this.head;
    if (entry) {
      if (this.head.newer) {
        this.head = this.head.newer;
        this.head.older = undefined;
      } else {
        this.head = undefined;
      }
      entry.newer = entry.older = undefined;
      delete this._keymap[entry.key];
    }
    return entry;
  };

  LRUCache.prototype.get = function (key, returnEntry) {
    var entry = this._keymap[key];
    if (entry === undefined) return;
    if (entry === this.tail) {
      return entry.value;
    }
    if (entry.newer) {
      if (entry === this.head) this.head = entry.newer;
      entry.newer.older = entry.older;
    }
    if (entry.older) entry.older.newer = entry.newer;
    entry.newer = undefined;
    entry.older = this.tail;
    if (this.tail) this.tail.newer = entry;
    this.tail = entry;
    return returnEntry ? entry : entry.value;
  };

  LRUCache.prototype.remove = function (key) {
    var entry = this._keymap[key];
    if (!entry) return;
    delete this._keymap[entry.key];
    if (entry.newer && entry.older) {
      entry.older.newer = entry.newer;
      entry.newer.older = entry.older;
    } else if (entry.newer) {
      entry.newer.older = undefined;
      this.head = entry.newer;
    } else if (entry.older) {
      entry.older.newer = undefined;
      this.tail = entry.older;
    } else {
      this.head = this.tail = undefined;
    }

    this.size--;
    return entry.value;
  };

  LRUCache.prototype.clear = function () {
    this.head = this.tail = undefined;
    this.size = 0;
    this._keymap = {};
  };

  if (typeof Object.keys === 'function') {
    LRUCache.prototype.keys = function () {
      return Object.keys(this._keymap);
    };
  } else {
    LRUCache.prototype.keys = function () {
      var keys = [];
      for (var k in this._keymap) {
        keys.push(k);
      }return keys;
    };
  }

  $.fn.swiftype.defaults = {
    activeItemClass: 'active',
    attachTo: undefined,
    documentTypes: undefined,
    filters: undefined,
    engineKey: undefined,
    searchFields: undefined,
    functionalBoosts: undefined,
    sortField: undefined,
    sortDirection: undefined,
    fetchFields: undefined,
    noResultsClass: 'noResults',
    noResultsMessage: undefined,
    onComplete: defaultOnComplete,
    resultRenderFunction: defaultResultRenderFunction,
    renderFunction: defaultRenderFunction,
    dropdownStylesFunction: defaultDropdownStylesFunction,
    resultLimit: undefined,
    suggestionListType: 'ul',
    suggestionListClass: 'autocomplete',
    resultListSelector: 'li',
    setWidth: true,
    typingDelay: 80,
    disableAutocomplete: false,
    autocompleteContainingElement: 'body'
  };
})(jQuery);

},{}],3:[function(require,module,exports){
"use strict";

module.exports = $(function () {
  var queryParser = function queryParser(a) {
    var i,
        p,
        b = {};
    if (a === "") {
      return {};
    }
    for (i = 0; i < a.length; i += 1) {
      p = a[i].split('=');
      if (p.length === 2) {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  };
  $.queryParams = function () {
    return queryParser(window.location.search.substr(1).split('&'));
  };
  $.hashParams = function () {
    return queryParser(window.location.hash.substr(1).split('&'));
  };

  window.Swiftype = window.Swiftype || {};
  Swiftype.root_url = Swiftype.root_url || 'https://api.swiftype.com';
  Swiftype.pingUrl = function (endpoint, callback) {
    var to = setTimeout(callback, 350);
    var img = new Image();
    img.onload = img.onerror = function () {
      clearTimeout(to);
      callback();
    };
    img.src = endpoint;
    return false;
  };
  Swiftype.pingSearchResultClick = function (engineKey, docId, callback) {
    var params = {
      t: new Date().getTime(),
      engine_key: engineKey,
      doc_id: docId,
      q: Swiftype.currentQuery
    };
    var url = Swiftype.root_url + '/api/v1/public/analytics/pc?' + $.param(params);
    Swiftype.pingUrl(url, callback);
  };

  $.fn.swiftypeSearch = function (options) {
    var options = $.extend({}, $.fn.swiftypeSearch.defaults, options);

    return this.each(function () {
      var $this = $(this);
      var config = $.meta ? $.extend({}, options, $this.data()) : options;
      $this.data('swiftype-config-search', config);

      $this.selectedCallback = function (data) {
        return function (e) {
          var $el = $(this);
          e.preventDefault();
          Swiftype.pingSearchResultClick(config.engineKey, data['id'], function () {
            config.onComplete($el);
          });
        };
      };

      $this.registerResult = function ($element, data) {
        $element.data('swiftype-item', data);
        $('a', $element).click($this.selectedCallback(data));
      };

      $this.getContentCache = function () {
        return $('#' + contentCacheId);
      };

      var $resultContainer = $(config.resultContainingElement),
          initialContentOfResultContainer = $resultContainer.html(),
          contentCacheId = 'st-content-cache',
          $contentCache = $this.getContentCache();

      var setSearchHash = function setSearchHash(query, page) {
        location.hash = "stq=" + encodeURIComponent(query) + "&stp=" + page;
      };

      var submitSearch = function submitSearch(query, options) {
        options = $.extend({
          page: 1
        }, options);
        var params = {};

        if (!$contentCache.length) {
          $resultContainer.after("<div id='" + contentCacheId + "' style='display: none;'></div>");
          $contentCache.html(initialContentOfResultContainer).hide();
        }
        config.loadingFunction(query, $resultContainer);

        Swiftype.currentQuery = query;
        params['q'] = query;
        params['engine_key'] = config.engineKey;
        params['page'] = options.page;

        function handleFunctionParam(field) {
          if (field !== undefined) {
            var evald = field;
            if (typeof evald === 'function') {
              evald = evald.call();
            }
            return evald;
          }
          return undefined;
        }

        params['per_page'] = handleFunctionParam(config.perPage);
        params['search_fields'] = handleFunctionParam(config.searchFields);
        params['fetch_fields'] = handleFunctionParam(config.fetchFields);
        params['facets'] = handleFunctionParam(config.facets);
        params['filters'] = handleFunctionParam(config.filters);
        params['document_types'] = handleFunctionParam(config.documentTypes);
        params['functional_boosts'] = handleFunctionParam(config.functionalBoosts);
        params['sort_field'] = handleFunctionParam(config.sortField);
        params['sort_direction'] = handleFunctionParam(config.sortDirection);
        params['spelling'] = handleFunctionParam(config.spelling);

        $.ajax({
          dataType: "json",
          url: Swiftype.root_url + "/api/v1/public/engines/search.json?callback=?",
          data: params,
          xhrFields: { withCredentials: true },
          success: renderSearchResults
        });
      };

      var $containingForm = $this.parents('form');
      if ($containingForm) {
        $containingForm.bind('submit', function (e) {
          e.preventDefault();
          var searchQuery = $this.val();
          setSearchHash(searchQuery, 1);
        });
      }

      $(document).on('click', '[data-hash][data-page]', function (e) {
        e.preventDefault();
        var $this = $(this);
        setSearchHash($.hashParams().stq, $this.data('page'));
      });

      $(document).on('click', '[data-hash][data-spelling-suggestion]', function (e) {
        e.preventDefault();
        var $this = $(this);
        setSearchHash($this.data('spelling-suggestion'), 1);
      });

      var renderSearchResults = function renderSearchResults(data) {
        if (typeof config.preRenderFunction === 'function') {
          config.preRenderFunction.call($this, data);
        }

        config.renderResultsFunction($this.getContext(), data);

        if (typeof config.postRenderFunction === 'function') {
          config.postRenderFunction.call($this, data);
        }
      };

      $this.getContext = function () {
        return {
          config: config,
          resultContainer: $resultContainer,
          registerResult: $this.registerResult
        };
      };
      // Modified by KD, the hashchange library was no longer working and had not been updated in years. This replaces the need for it.
      $(window).on('hashchange', function (e) {
        var params = $.hashParams();
        if (params.stq) {
          submitSearch(params.stq, {
            page: params.stp
          });
        } else {
          var $contentCache = $this.getContentCache();
          if ($contentCache.length) {
            $resultContainer.html($contentCache.html());
            $contentCache.remove();
          }
        }
      }).trigger('hashchange');;
    });
  };

  var renderPagination = function renderPagination(ctx, resultInfo) {
    var maxPagesType,
        maxPages = -1,
        config = ctx.config;
    $.each(resultInfo, function (documentType, typeInfo) {
      if (typeInfo.num_pages > maxPages) {
        maxPagesType = documentType;
        maxPages = typeInfo.num_pages;
      }
    });
    var currentPage = resultInfo[maxPagesType].current_page,
        totalPages = resultInfo[maxPagesType].num_pages;

    $(config.renderPaginationForType(maxPagesType, currentPage, totalPages)).appendTo(ctx.resultContainer);
  };

  var normalize = function normalize(str) {
    return $.trim(str).toLowerCase();
  };

  function htmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var defaultRenderResultsFunction = function defaultRenderResultsFunction(ctx, data) {
    var $resultContainer = ctx.resultContainer,
        config = ctx.config;

    $resultContainer.html('');

    $.each(data.records, function (documentType, items) {
      $.each(items, function (idx, item) {
        ctx.registerResult($(config.renderFunction(documentType, item)).appendTo($resultContainer), item);
      });
    });

    renderPagination(ctx, data.info);
  };

  var defaultRenderFunction = function defaultRenderFunction(document_type, item) {
    return '<div class="st-result"><h3 class="title"><a href="' + item['url'] + '" class="st-search-result-link">' + htmlEscape(item['title']) + '</a></h3></div>';
  };

  var defaultLoadingFunction = function defaultLoadingFunction(query, $resultContainer) {
    $resultContainer.html('<p class="st-loading-message">loading...</p>');
  };

  var defaultOnComplete = function defaultOnComplete(elem) {
    window.location = elem.attr('href');
  };

  var defaultPostRenderFunction = function defaultPostRenderFunction(data) {
    var totalResultCount = 0;
    var $resultContainer = this.getContext().resultContainer;
    var spellingSuggestion = null;

    if (data['info']) {
      $.each(data['info'], function (index, value) {
        totalResultCount += value['total_result_count'];
        if (value['spelling_suggestion']) {
          spellingSuggestion = value['spelling_suggestion']['text'];
        }
      });
    }

    if (totalResultCount === 0) {
      $resultContainer.html("<div id='st-no-results' class='st-no-results'>No results found.</div>");
    }

    if (spellingSuggestion !== null) {
      $resultContainer.append('<div class="st-spelling-suggestion">Did you mean <a href="#" data-hash="true" data-spelling-suggestion="' + spellingSuggestion + '">' + spellingSuggestion + '</a>?</div>');
    }
  };

  var defaultRenderPaginationForType = function defaultRenderPaginationForType(type, currentPage, totalPages) {
    var pages = '<div class="st-page">',
        previousPage,
        nextPage;
    if (currentPage != 1) {
      previousPage = currentPage - 1;
      pages = pages + '<a href="#" class="st-prev" data-hash="true" data-page="' + previousPage + '">&laquo; previous</a>';
    }
    if (currentPage < totalPages) {
      nextPage = currentPage + 1;
      pages = pages + '<a href="#" class="st-next" data-hash="true" data-page="' + nextPage + '">next &raquo;</a>';
    }
    pages += '</div>';
    return pages;
  };

  $.fn.swiftypeSearch.defaults = {
    attachTo: undefined,
    documentTypes: undefined,
    facets: undefined,
    filters: undefined,
    engineKey: undefined,
    searchFields: undefined,
    functionalBoosts: undefined,
    sortField: undefined,
    sortDirection: undefined,
    fetchFields: undefined,
    preRenderFunction: undefined,
    postRenderFunction: defaultPostRenderFunction,
    loadingFunction: defaultLoadingFunction,
    renderResultsFunction: defaultRenderResultsFunction,
    renderFunction: defaultRenderFunction,
    renderPaginationForType: defaultRenderPaginationForType,
    onComplete: defaultOnComplete,
    perPage: 10,
    spelling: 'strict'
  };
});

},{}],4:[function(require,module,exports){
'use strict';

module.exports = $(function () {

  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName = void 0,
        i = void 0;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  $(document).ready(function () {
    if ($('.action-guide-v2').length !== 0) {
      var activeTabNumber = getUrlParameter('tab');
      if (activeTabNumber) {
        tabNavigation(activeTabNumber);
      } else {
        tabNavigation(1);
      }
    }
  });

  function tabNavigation(destinationTabNumber) {
    var steps = $(".tab-label").length;

    var _loop = function _loop(i) {
      var stepId = '#step-' + i + '-label';
      var tabId = '#tab-' + i + '-content';
      if (i == destinationTabNumber) {
        if (!$(stepId).hasClass('active')) {
          $(tabId).addClass('active');
          $(stepId).addClass('active');
          history.pushState({}, null, window.location.origin + window.location.pathname + '?tab=' + i);
          $(".translation-link").each(function () {
            var href = $(this).attr('href');
            if (href) {
              $(this).attr('href', href.split("?")[0] + '?tab=' + i);
            }
          });
        }
      } else {
        $(stepId).removeClass('active');
        $(tabId).removeClass('active');
      }
    };

    for (var i = 1; i <= steps; i++) {
      _loop(i);
    }
  }

  $('.next-tab').click(function () {
    var activeTabNumber = getUrlParameter('tab') || 1;
    var nextTabNumber = parseInt(activeTabNumber) + 1;
    tabNavigation(nextTabNumber);
  });

  $('.prev-tab').click(function () {
    var activeTabNumber = getUrlParameter('tab');
    var prevTabNumber = parseInt(activeTabNumber) - 1;
    tabNavigation(prevTabNumber);
  });

  $('.tab-label').click(function () {
    var tab_id = $(this).attr('id');
    var numberPattern = /\d+/g;
    var tabNumber = tab_id.match(numberPattern)[0];
    tabNavigation(tabNumber);
  });
});

},{}],5:[function(require,module,exports){
'use strict';

module.exports = $(function () {

  var size = Foundation.MediaQuery.is('large up');

  if (size) {
    $('.stage-container').hover(function (e) {

      $('.stage-tracker .chevron').each(function () {
        $(this).removeClass('open');
      });
      $(this).closest(".chevron").toggleClass('open');
    });
    $('.stage-tracker .chevron .description').hover(function (e) {
      e.stopPropagation();
    });
  }
});

},{}],6:[function(require,module,exports){
'use strict';

var List = require('list.js');
module.exports = $(function () {

  //Any page with a search bar directory filter list
  var filterList = new List('filter-list', {
    valueNames: ['item', 'item-desc']
  });

  //prevent enter from refreshing the page and stopping filter search
  $('#filter-list input').keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });

  $('.search-field').on('keyup', function () {
    if ($('.list').children().length === 0) {
      $('.not-found').css('display', 'block');
    } else {
      $('.not-found').css('display', 'none');
    }
  });
});

},{"list.js":30}],7:[function(require,module,exports){
'use strict';

module.exports = $(function () {
  // Any div summary expand
  $('[data-toggle="expandable"]').click(function (e) {
    e.preventDefault();
    $(this).siblings().toggleClass('expandable');
    $(this).prev().attr('aria-expanded', 'true');

    if ($(this).html() === ' More + ') {
      $(this).html(' Less - ');
      $(this).prev().attr('aria-expanded', 'true');
    } else {
      $(this).html(' More + ');
      $(this).prev().attr('aria-expanded', 'false');
    }
  });

  $('[data-toggle="icon-expand"]').click(function (e) {
    e.preventDefault();
    $(this).next().attr('aria-expanded', 'true');
    $(this).next().toggleClass('visible');

    if ($(this).html() === ' More + ') {
      $(this).html(' Less - ');
      $(this).next().attr('aria-expanded', 'true');
    } else {
      $(this).html(' More + ');
      $(this).next().attr('aria-expanded', 'false');
    }
  });

  $('[data-toggle="expandable-all"]').click(function (e) {
    e.preventDefault();

    if ($(this).html() === ' Expand All + ') {
      $(this).html(' Collapse All - ');
      $('.icon-expand-content').each(function () {
        $(this).attr('aria-expanded', 'true');
        if (!$(this).hasClass("visible")) {
          $(this).addClass('visible');
        }
      });
      $('.icon-expand-link').each(function () {
        if ($(this).html() === ' More + ') {
          $(this).html(' Less - ');
          $(this).prev().attr('aria-expanded', 'true');
        }
      });
    } else {
      $(this).html(' Expand All + ');
      $('.icon-expand-content').each(function () {
        $(this).attr('aria-expanded', 'false');
        if ($(this).hasClass("visible")) {
          $(this).removeClass('visible');
        }
      });
      $('.icon-expand-link').each(function () {
        if ($(this).html() === ' Less - ') {
          $(this).html(' More + ');
          $(this).prev().attr('aria-expanded', 'false');
        }
      });
    }
  });
});

},{}],8:[function(require,module,exports){
'use strict';

jQuery(document).ready(function ($) {
  //TODO: Abstract for use on other data-types
  var hiddenLetter = {};
  var parents = $('.a-z-group');
  var $input = $('#a-z-filter-list .search-field');

  $('.a-z-group .search-field').prop('disabled', false);

  //Hide/show sets of letter groups
  $('.a-z-group .result').on('update', function () {

    parents.each(function (index, item) {

      var $item = $(item);
      var childElements = $item.find('.result.is-hidden');

      var total = $item.find('.result');

      if (childElements.length === total.length) {
        $item.hide();
        hiddenLetter[$item.data('alphabet')] = $item.data('alphabet');
      } else {
        $item.show();
        delete hiddenLetter[$item.data('alphabet')];
      }
    });
  });

  $('#a-z-filter-list').submit(function (e) {
    e.preventDefault();
  });

  $input.keyup(function (event) {
    searchFilter(event);
    var key = event.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
      $('.a-z-group .result').trigger('update');
      return false;
    }
  });

  function searchFilter(event) {
    function regexEscape(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function reg(input) {
      var flags;
      flags = 'gmi';
      input = regexEscape(input);
      return new RegExp(input, flags);
    }

    var value = $input.val();

    $(".list .result").not('is-hidden').each(function (i, v) {
      if ($(this).text().search(reg(value)) < 0) {
        $(this).hide().addClass('is-hidden');
      }
    });

    //check if value is empty
    if (!value) {
      parents.show();
      $('.result').show().removeClass('is-hidden');
    }

    if ($(".a-z-group:visible").length === 0) {
      $('.not-found').show();
    } else {
      $('.not-found').hide();
    }
    $('.a-z-group .result').trigger('update');
  }
});

},{}],9:[function(require,module,exports){
'use strict';

module.exports = jQuery(document).ready(function ($) {
  var currentPath = window.location.pathname;

  $($('.global-nav a')).each(function () {
    if (currentPath === $(this).attr('href') || currentPath === $(this).data('link')) {

      $(this).addClass('js-is-current');
    } else if (currentPath.indexOf('/services/') === 0 || currentPath.indexOf('/services/') === 1) {
      $('.serviceså-menu-link a').addClass('js-is-current');
    } else if (currentPath.indexOf('/programs/') === 0 || currentPath.indexOf('/programs/') === 1) {
      $('.programs-menu-link a').addClass('js-is-current');
    } else if (currentPath.indexOf('/departments/') === 0 || currentPath.indexOf('/departments/') === 1) {
      $('.departments-menu-link a').addClass('js-is-current');
    } else if (currentPath.indexOf('/the-latest/') === 0 || currentPath.indexOf('/the-latest/') === 1) {
      $('.news-menu-link a').addClass('js-is-current');
    } else if (currentPath.indexOf('/tools/') === 0 || currentPath.indexOf('/tools/') === 1) {
      $('.tools-menu-link a').addClass('js-is-current');
    } else if (currentPath.indexOf('/documents/') === 0 || currentPath.indexOf('/documents/') === 1) {
      $('.publications-menu-link a').addClass('js-is-current');
    }
  });
});

},{}],10:[function(require,module,exports){
'use strict';

module.exports = $(function () {
  window.dataLayer = window.dataLayer || [];

  $('.connect-box .website').click(function () {
    var name = $(this);
    window.dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': 'Contact us',
      'eventAction': 'Website',
      'eventLabel': name.html().trim()
    });
  });

  $('.connect-box .phone-link').click(function () {
    var name = $(this);

    window.dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': 'Contact us',
      'eventAction': 'Phone',
      'eventLabel': name.html().trim()
    });
  });
  $('.connect-box .u-email').click(function () {
    var name = $(this);

    window.dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': 'Contact us',
      'eventAction': 'Email',
      'eventLabel': name.html().trim()
    });
  });
});

},{}],11:[function(require,module,exports){
'use strict';

module.exports = $(function () {

    $('.print-entire-guide').click(function () {
        $('.guides-print-all-content').addClass('make-visible');
        //reset print view so if user tries to print normally, they just get the page content
        setTimeout(function () {
            return $('.guides-print-all-content').removeClass('make-visible');
        }, 200);
    });

    if (Foundation.MediaQuery.is('small only')) {

        $("#page-title-button, #nav-menu-caret, .nav-subheader").click(function () {
            $(".nav-container").toggle();
            $("#guides-nav").toggle();
            $(".guides .sticky-container").height("100%");
            $('body').toggleClass('no-scroll');
            $('#wpadminbar').toggle();
        });

        var hash = window.location.hash;
        if (hash == '' || hash == '#' || hash == undefined) return false;
        var target = $(hash);
        var headerHeight = $('.page-title-button').height() + 20;
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html,body').stop().animate({
                scrollTop: target.offset().top - headerHeight //offsets for fixed header
            }, 'linear');
        }

        var headerHeight = $('.page-title-button').height() + 20;

        $('a[href*="#"]:not([href="#"])').click(function () {
            var target = $(this.hash);
            $('html,body').stop().animate({
                scrollTop: target.offset().top - headerHeight
            }, 'linear');
        });
    }
});

},{}],12:[function(require,module,exports){
'use strict';

function anchorOffset() {
  /* Account for sticky header when anchor links are present */
  var $anchor = $(':target');
  var fixedElementHeight = $('.sticky').outerHeight();
  if ($anchor.length > 0) window.scrollTo(0, $anchor.offset().top - fixedElementHeight);
}
$(window).on('hashchange load', anchorOffset);
$('body').on('click', "a[href^='#']", function (ev) {
  if (window.location.hash === $(this).attr('href')) {
    ev.preventDefault();
    anchorOffset();
  }
});

if (window.location.hash) {
  $(window).trigger('hashchange');
}

},{}],13:[function(require,module,exports){
'use strict';

// Smooth Sticky Header
$(function () {
    var stickyHeaderOffset = $('#global-sticky-nav').offset().top;
    var stickyBar = $('#global-sticky-nav .phila-sticky');
    var isLoggedIn = $('#wpadminbar').length || false;
    if (isLoggedIn) {
        stickyHeaderOffset -= $('#wpadminbar').outerHeight();
    }

    function validateSticky() {
        if (isLoggedIn) {
            stickyBar.data('margin-top', $('#wpadminbar').outerHeight());
        }
        var curScrollPos = $(window).scrollTop();
        if (curScrollPos >= stickyHeaderOffset) {
            stickyBar.addClass('sticky');
        } else {
            stickyBar.removeClass('sticky');
        }
    }
    $(window).on('scroll', validateSticky);
    validateSticky();

    $(".trusted-site-toggle, #trusted-site-close").click(function (event) {
        event.preventDefault();
        $("#trusted-site").toggle();
        $(".trusted-site-toggle").toggleClass("open");
    });
});

},{}],14:[function(require,module,exports){
'use strict';

$('table.js-hide-empty').each(function (i, obj) {

  var table = this;

  $("th", this).each(function (i) {

    var remove = 0;
    var tds = $(this).parents('table').find('tr td:nth-child(' + (i + 1) + ')');

    tds.each(function (j) {
      if (this.innerHTML == '') remove++;
      if (this.innerHTML == ' ') remove++;
      if (this.innerHTML == '<b><span class="responsive-label">Description: </span></b> ') remove++;
    });

    if (remove == $('tr', table).length - 1) {
      $(this).hide();
      tds.hide();
    };
  });
});

},{}],15:[function(require,module,exports){
'use strict';

module.exports = $(function () {

    function setWithExpiry(key, value, ttl) {
        var now = new Date();
        var item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    function getWithExpiry(key) {
        var itemStr = localStorage.getItem(key);
        if (!itemStr) {
            return null;
        }
        var item = JSON.parse(itemStr);
        var now = new Date();
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
    // opens disclaimer-modal if exists for department & program pages
    function openDisclaimerModal() {
        var modalSlug = window.location.pathname.split('/');
        if ((modalSlug[1] == 'departments' || modalSlug[1] == 'programs') && modalSlug[2]) {
            modalSlug = modalSlug.slice(1, 3).join('-');
        }
        openModalWithExpiry('#disclaimer-modal', modalSlug);
    }

    function philaLocaleCodeToEnglish(loc) {
        if (typeof loc !== 'string') {
            loc = loc[0];
        }
        var parts = loc.split('-');
        switch (parts[0]) {
            case 'enm':
            case 'eng':
            case 'en':
                return {
                    english: 'English',
                    native: 'English'
                };
            case 'es':
            case 'spa':
                return {
                    english: 'Spanish',
                    native: 'Español'
                };
            case 'zh':
            case 'zho':
            case 'chi':
                return {
                    english: 'Chinese',
                    native: '中文'
                };
            default:
                return {
                    english: 'English',
                    native: 'English'
                };
        }
    }

    function openModalWithExpiry(modalId, modalSlug) {
        if (getWithExpiry('phila-modal-' + modalSlug) == null && $(modalId).length) {
            $(modalId).foundation('open');

            if ($('.reveal--announcement')[0]) {

                $('.reveal--announcement').on('closed.zf.reveal', function () {
                    $(modalId).foundation('open');
                });
            }
        }
        $(modalId + ' .button-text').click(function () {
            // two week expiry
            setWithExpiry('phila-modal-' + modalSlug, 'seen', 1209600000);
        });
    }

    function openTranslationsModalWithExpiry(modalId, lang) {
        if (getWithExpiry('phila-active-language') == null && $(modalId).length) {
            $(modalId).foundation('open');

            if ($('.reveal--announcement')[0]) {

                $('.reveal--announcement').on('closed.zf.reveal', function () {
                    $(modalId).foundation('open');
                });
            }
        } else if (getWithExpiry('phila-active-language') && lang != getWithExpiry('phila-active-language')) {
            $('#translate-' + lang.toLowerCase())[0].click();
        }
        if (lang.length) {
            $(modalId + ' #translate-page').click(function () {
                // one month expiry
                setWithExpiry('phila-active-language', lang, 2629800000);
            });
        }
    }

    // opens translations-modal if English isn't the detected local language
    function openTranslationsModal() {
        if (navigator.language) {
            var lang = philaLocaleCodeToEnglish(navigator.language);
            var localLang = getWithExpiry('phila-active-language');
            var currentUrl = window.location.pathname.split('/');
            var pathItem = currentUrl[1];
            var currentPageLang = philaLocaleCodeToEnglish(pathItem);
            if (localLang === null) {

                $('#translations-modal-lang').html(lang.english);
                $('#translate-page').click(function () {
                    $('#translate-' + lang.english.toLowerCase())[0].click();
                });
                if (currentPageLang && lang.english != currentPageLang.english) {
                    openTranslationsModalWithExpiry('#translations-modal', lang.english);
                }
            } else if (localLang && currentPageLang && localLang != currentPageLang.english) {
                $('#translate-' + localLang.toLowerCase())[0].click();
            }
        }
    }

    function setLangWithExpiry() {
        $(".translations-nav a").click(function () {
            var urlPath = $(this)[0].href.split('/');
            var pathItem = urlPath[3];
            var lang = philaLocaleCodeToEnglish(pathItem);
            if (lang) {
                setWithExpiry('phila-active-language', lang.english, 2629800000);
            }
        });
    }

    $(document).ready(function () {
        openDisclaimerModal();
        openTranslationsModal();
        setLangWithExpiry();
    });
});

},{}],16:[function(require,module,exports){
'use strict';

/* Hijack mailchimp signup forms to use ajax handler */

/*NOTE: this method requires that the form action URL from mailchimp uses subscribe/post-json */
module.export = jQuery(document).ready(function ($) {

  ajaxMailChimpForm($('#mc-embedded-subscribe-form'), $('#mc_embed_signup'));
  // Turn the given MailChimp form into an ajax version of it.
  // If resultElement is given, the subscribe result is set as html to
  // that element.
  function ajaxMailChimpForm($form, $resultElement) {
    // Hijack the submission. We'll submit the form manually.
    $form.submit(function (e) {
      e.preventDefault();
      if (!isValidEmail($form)) {
        var error = 'A valid email address must be provided.';
        $resultElement.append(error);
        $resultElement.css('color', '#f99300');
      } else {
        $resultElement.css('color', 'black');
        $resultElement.append('Subscribing...');
        submitSubscribeForm($form, $resultElement);
      }
    });
  }
  // Validate the email address in the form
  function isValidEmail($form) {
    var email = $form.find('input[type="email"]').val();
    if (!email || !email.length) {
      return false;
    } else if (email.indexOf('@') == -1) {
      return false;
    }
    return true;
  }
  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
    $.ajax({
      type: 'GET',
      url: $form.attr('action'),
      data: $form.serialize(),
      cache: false,
      dataType: 'jsonp',
      jsonp: 'c', // trigger MailChimp to return a JSONP response
      contentType: 'application/json; charset=utf-8',
      error: function error(_error) {
        // According to jquery docs, this is never called for cross-domain JSONP requests
      },
      success: function success(data) {
        if (data.result != 'success') {
          var message = data.msg || 'Sorry. Unable to subscribe. Please try again later.';
          $resultElement.css('color', '#f99300');
          if (data.msg && data.msg.indexOf('already subscribed') >= 0) {
            message = 'You\'re already subscribed. Thank you.';
            $resultElement.css('color', 'black');
          } else if (data.msg && data.msg.indexOf('zip code') >= 0) {
            message = 'Please enter a valid zip code.';
            $resultElement.css('color', 'f99300');
          }
          $resultElement.append(message);
        } else {
          $resultElement.css('color', '#58c04d');
          $resultElement.html('Thank you!<br>You must confirm the subscription in your inbox.');
        }
      }
    });
  }
});

},{}],17:[function(require,module,exports){
'use strict';

require('jquery');

require('phila-standards');

require('./phila-gov');
require('./action-guide-v2');
require('./chevrons');
require('./city-directory-list');
require('./collapsible-div');
require('./filter');
require('./global-is-active');
require('./hashchange-check');
require('./hide-empty-table');
require('./local-storage');
require('./mailchimp');
require('./posts');
require('./search');
require('./search-sort-tables');
require('./skip-link-focus-fix');
require('./header-sticky');
require('./parks-and-recreation');
require('./gtm');
require('./guides');
require('./translations');

},{"./action-guide-v2":4,"./chevrons":5,"./city-directory-list":6,"./collapsible-div":7,"./filter":8,"./global-is-active":9,"./gtm":10,"./guides":11,"./hashchange-check":12,"./header-sticky":13,"./hide-empty-table":14,"./local-storage":15,"./mailchimp":16,"./parks-and-recreation":18,"./phila-gov":19,"./posts":20,"./search":22,"./search-sort-tables":21,"./skip-link-focus-fix":23,"./translations":24,"jquery":25,"phila-standards":48}],18:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

jQuery(document).ready(function ($) {
    var featActivitiesQueryURL = 'https://phl.carto.com/api/v2/sql?q=SELECT *, ppr_programs.id as id, program_description_short as desc, facility->>0 as facility, gender->>0 as gender FROM ppr_programs INNER JOIN ppr_facilities ON ppr_facilities.id = ppr_programs.facility->>0 AND ppr_programs.program_is_featured AND ppr_programs.program_is_public AND ppr_programs.program_is_approved AND ppr_programs.program_is_active  LIMIT 3';
    var $activityCards = $('.ppr-feat-activity');
    var featLocationTypesQueryURL = "https://phl.carto.com/api/v2/sql?q=WITH+facility_location_types_tmp+AS+(SELECT+jsonb_array_elements_text(location_type)+as+exploded_location_type+FROM+ppr_facilities+WHERE+(facility_is_published+%3D+true))+SELECT+count(*)+AS+count,+location_type_id+AS+id,+location_type_name+AS+name,+location_type_description+AS+description,+location_type_photo+AS+photo_id,+regexp_replace(regexp_replace(lower(trim(location_type_name)),+%27[%5Ea-zA-Z0-9]%27,+%27-%27,+%27g%27),+%27%5C-%5C-%2B%27,+%27-%27,+%27g%27)+AS+slug+FROM+facility_location_types_tmp+LEFT+JOIN+ppr_location_types+ON+(facility_location_types_tmp.exploded_location_type+%3D+ppr_location_types.id)+WHERE+(location_type_is_published+%3D+true)+GROUP+BY+location_type_id,+location_type_name,+location_type_description,+location_type_photo+ORDER+BY+count+DESC";
    // var featLocationTypesQueryURL = "https://phl.carto.com/api/v2/sql?q=SELECT count(*) AS count, regexp_replace(lower(ppr_location_types.location_type_name), ' ', '-', 'g') as slug, ppr_location_types.location_type_name, ppr_location_types.location_type_description, ppr_location_types.location_type_photo, ppr_location_types.id , ppr_location_types.location_type_is_published, ppr_location_types.location_type_is_featured FROM ppr_location_types AS ppr_location_types  INNER JOIN ppr_facilities ON (ppr_facilities.location_type->>1 = ppr_location_types.id)  INNER JOIN ppr_website_locatorpoints ON (ppr_facilities.website_locator_points_link_id = ppr_website_locatorpoints.linkid)  WHERE ppr_location_types.location_type_is_published AND ppr_location_types.location_type_is_featured GROUP BY ppr_location_types.location_type_name, ppr_location_types.location_type_description, ppr_location_types.location_type_photo,  ppr_location_types.id, ppr_location_types.location_type_is_published, ppr_location_types.location_type_is_featured LIMIT 6";
    var $locationTypeCards = $('.ppr-feat-locationType');

    /**
     * Render a single PPR Card with its loaded data
     * This finds elements with data attributes named for
     * the properites that will be hydrating them with data
     */
    var renderCard = function renderCard(card, data) {
        for (var prop in data) {
            // go go gadget recursion
            // Walk through a data object to find our values
            if (_typeof(data[prop]) == 'object') {
                renderCard(card, data[prop]);
            }
            // find our html
            var template = $(card).find('[data-' + prop + ']');

            if (template.length) {
                $(card).find('.ppr-loader').remove();
                $(card).addClass('loaded');
                // if we are not recursing through a data object
                // replace the innner html of our template with data
                if (_typeof(data[prop]) != 'object') {
                    // check if it's an image field
                    var imageRegex = /(photo)|(image)|(img)/;
                    if (imageRegex.test(prop)) {
                        if (data[prop] == '' || data[prop] == null) {
                            template.remove();
                            return;
                        }
                        template.attr('src', data[prop]);
                    } else if (template.attr('href')) {
                        var link = template.attr('href') + data[prop];
                        template.attr('href', link);
                    } else {
                        template.html(data[prop]);
                    }
                }
            }
        }
    };

    // get image sizes from the PPR Flickr account
    function getFlickrPhoto(photoID) {
        var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=d725fbb674d097510cba546d70aa0244&photo_id=' + photoID + '&format=json&nojsoncallback=1';
        return $.get(flickrAPI);
    }

    // convenience function to render all cards with data
    function renderCards($cards, data) {
        $cards.each(function (idx, card) {
            if (data[idx]) {
                renderCard(card, data[idx]);
            } else {
                // if no data fade out card
                $(card).find('.ppr-loader').html('<i class="fas fa-exclamation-circle" aria-hidden="true"></i>');
                $(card).addClass('error');
                $(card).animate({ opacity: 0 }, 250);
            }
        });
    }

    // get our card data from the CartoAPI
    function loadCardData(queryURL, $cards, shouldRender) {
        return $.get(queryURL, function (results) {
            var data = results.rows;
            if (shouldRender) {
                renderCards($cards, data);
            }
        });
    }

    /* =======================================================================
      Load Things to do cards
    ========================================================================== */
    if ($activityCards.length) {
        loadCardData(featActivitiesQueryURL, $activityCards, true);
    }

    /* =======================================================================
      Load Our Locations cards
    ========================================================================== */
    if ($locationTypeCards.length) {
        // 1. grab location types from CartoAPI
        loadCardData(featLocationTypesQueryURL, $locationTypeCards, false).then(function (data) {
            var locationTypes = data.rows;
            // 2. get Flickr image sizes for each location type
            var photos = locationTypes.map(function (lType) {
                return getFlickrPhoto(lType.photo_id);
            });

            Promise.all(photos).then(function (locationPhotos) {
                var small_320_photos = locationPhotos.map(function (photosData) {
                    return photosData.sizes.size[4].source;
                });
                // 3. once we have all the location types photos map the medium 320 x 214 photo
                //    back into the locationTypes data
                locationTypes = locationTypes.map(function (type, idx) {
                    type.location_type_photo = small_320_photos[idx];
                    return type;
                });
                // 4. render all of our cards w/ photos at the same time
                renderCards($locationTypeCards, locationTypes);
            });
        });
    }
});

},{}],19:[function(require,module,exports){
'use strict';

module.exports = $(function () {
  //  window.dataLayer = window.dataLayer || [];

  /*Globals */
  var navHeight = $('.global-nav').height();
  var windowWidth = $(window).width();

  //Generic class for links that should prevent clickthrough
  $('.no-link').click(function (e) {
    e.preventDefault();
  });

  if ($('#mobile-nav-drilldown').length) {

    var drilldownOptions = {
      autoHeight: false,
      scrollTop: true,
      parentLink: true,
      scrollTopElement: 'body'
    };

    var mobileMenu = new Foundation.Drilldown($('#mobile-nav-drilldown'), drilldownOptions);
  } else {
    console.warn('Standards JS: Add the #mobile-nav-drilldown markup.');
  }

  /* Drilldown menu */
  $(document).on('toggled.zf.responsiveToggle', '[data-responsive-toggle]', function () {
    extendMenuToggle();
  });

  //opened submenu
  $(document).on('open.zf.drilldown', '[data-drilldown]', function () {
    /* Ensure no events get through on titles */
    $('.is-submenu-parent-item').each(function () {
      $(this).click(function (e) {
        return false;
      });
    });
  });

  $('#services-mega-menu').hover(function () {
    $('.site-search i').addClass('fa-search').removeClass('fa-times');
  }, function () {
    $('body').removeClass('no-scroll');
    $('.site-search i').addClass('fa-search').removeClass('fa-times');
  });

  function extendMenuToggle() {
    $('.menu-icon i').toggleClass('fa-bars').toggleClass('fa-xmark');
    $('.global-nav .menu-icon').toggleClass('active');
    $('#vue-mobile-menu').toggleClass('hide');
    $('html').toggleClass('is-reveal-open');
  }

  function checkBrowserHeight() {
    if ($('body').hasClass('logged-in')) {
      return;
    }

    var wh = window.innerHeight;

    var sh = $('#services-mega-menu').innerHeight();

    sh = sh + navHeight;

    if ($('.sticky').hasClass('is-stuck')) {
      navHeight = $('.sticky-container').height();
    }

    if (wh <= sh) {
      $('.mega-menu-dropdown').css({
        'position': 'absolute',
        'top': '0'
      });

      $('body').removeClass('no-scroll');
      $('#page').addClass('hide');
      $('footer').addClass('hide');
    } else {

      $('body').addClass('no-scroll');
      showBodyContent();
    }
  }

  /* Mega menu Dropdown */
  $('#services-mega-menu').on('show.zf.dropdown', function () {
    $('#back-to-top').css('display', 'none');
    checkBrowserHeight();
    Foundation.reInit('equalizer');
  });

  //click and hover handler for desktop service menu link
  $('.services-menu-link').on('click mouseover', function () {
    $('.site-search i').addClass('fa-search').removeClass('fa-times');
  });

  /* All dropdowns */
  $(document).on('hide.zf.dropdown', '[data-dropdown]', function () {
    $('body').removeClass('no-scroll');
    if (!$('.is-drilldown').is(':visible')) {
      $('#page').removeClass('hide');
      $('footer').removeClass('hide');
    }
    $('.site-search i').removeClass('fa-times').addClass('fa-search');
    $('.site-search span').text('Search');
  });

  /* Site search dropdown */
  $('.site-search-dropdown').on('show.zf.dropdown', function () {
    //menu toggle close when menu is already open
    if (Foundation.MediaQuery.current === 'small' && $('.is-drilldown').is(':visible')) {
      $('.title-bar').foundation('toggleMenu');
    }
    $('.site-search i').addClass('fa-times').removeClass('fa-search');

    $('.site-search span').text($('.site-search span').text() === 'Search' ? 'Close' : 'Search');

    $('body').addClass('no-scroll');

    if ($('.sticky').hasClass('is-stuck')) {
      navHeight = $('.sticky-container').height();
    } else {
      navHeight = $('.global-nav').height();
    }

    $(this).css('top', navHeight);
  });

  function showBodyContent() {
    $('#page').removeClass('hide');
    $('footer').removeClass('hide');
  }

  $(window).resize(function () {
    //check window width for mobile devices to prevent window resize on scroll.
    if ($(window).width() !== windowWidth) {
      windowWidth = $(window).width();

      if (Foundation.MediaQuery.atLeast('medium')) {
        showBodyContent();
      }
    }
    //orientation doesn't matter, always remove the no-scroll class
    $('body').removeClass('no-scroll');
  });

  /* prevent search dropdown from becoming dissconnected from header when keyboard is closed on iOS devices */
  $('.search-field').focusout(function () {
    if (Foundation.MediaQuery.current === 'small') {
      window.scrollTo(0, 0);
    }
  });

  $('.clickable-row').click(function () {
    var name = $(this).children().children().children()[1];
    window.dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': 'Content Download',
      'eventAction': phila_js_vars.postTitle,
      'eventLabel': $(name)[0].innerText
    });
  });

  $('.clickable-row .document').click(function (e) {
    var name = $(this).children()[0];
    window.dataLayer.push({
      'event': 'GAEvent',
      'eventCategory': 'Content Download',
      'eventAction': phila_js_vars.postTitle,
      'eventLabel': name.innerText
    });
  });

  //foundation equalizer rows
  //doesn't work with nested Equalizers, because a unique ID is required.
  if ($('.equal').length > 0) {

    //equalizeByRow: true to force each instance of equalizer to work individually
    var equalizerOptions = {
      equalizeOnStack: true,
      equalizeByRow: true,
      equalizeOn: 'small'
    };

    $('.equal-height').each(function () {
      $(this).find('.equal').attr('data-equalizer-watch', '');
    });

    var equalHeight = new Foundation.Equalizer($('.equal-height'), equalizerOptions);
  }

  //foundation tooltips
  if ($('.has-tip').length > 0) {

    var tooltip = new Foundation.Tooltip($('.has-tip'));
  }
  var mainContent = $('.guide-content').eq(0);
});

},{}],20:[function(require,module,exports){
'use strict';

var $thumb = $('.js-thumbnail-image').detach();
$('.post-content > div').prepend($thumb);

Foundation.Reveal.defaults.vOffset = 20;
var closeButton = "<button class=\"close-button\" data-close aria-label=\"Close modal\" type=\"button\"><span aria-hidden=\"true\">&times;</span></button>";

if (typeof phila_js_vars !== 'undefined') {

  var postRestBase = phila_js_vars.postRestBase;
  var postID = phila_js_vars.postID;

  $(document).on('open.zf.reveal', '#phila-lightbox-feature', function (e) {
    var $modal = $(this);
    var ajaxURL = 'https://flbjdoa008.execute-api.us-east-1.amazonaws.com/' + postID;
    $modal.html('Loading...');
    $.ajax(ajaxURL).done(function (response) {
      var fullSizeImg = response._embedded["wp:featuredmedia"]["0"].media_details.sizes.full.source_url;
      var featuredCaption = response._embedded["wp:featuredmedia"]["0"].caption.rendered;
      $modal.html('<div class="lightbox-content"><img src="' + fullSizeImg + '" alt=""></div>');

      if (response._embedded["wp:featuredmedia"]["0"].meta_box.phila_media_credit.length) {
        var featuredCredit = document.createElement("p");
        featuredCredit.innerHTML = '<strong>Photo by: ' + response._embedded["wp:featuredmedia"]["0"].meta_box.phila_media_credit + '</strong>';
        $modal.append(featuredCredit);
      }

      $modal.append(featuredCaption);
      $modal.append(closeButton);
    }).fail(function () {
      $modal.html('Image cannot be loaded.');
    });
  });
}

if (typeof phila_language_list !== 'undefined') {
  var phila_language_list_count = phila_language_list.length;
  var show_dropdown = false;
  var i = 0;

  var _loop = function _loop(item) {
    var li = document.createElement("li");
    if ($('.single-post').length) {
      var a_tag = document.createElement("a");
      a_tag.className += " phm";
      a_tag.className += " translation-link";
      a_tag.className += " phs";
      a_tag.className += " " + phila_language_list[item].language + '-translation';
      if (phila_language_list[item].value == window.location.href.split(/[?#]/)[0]) {
        a_tag.className += " active";
      }
      a_tag.href = phila_language_list[item].value;
      a_tag.innerHTML = phila_language_list[item].key;
      a_tag.addEventListener("click", function () {
        window.dataLayer.push({
          'event': 'GAEvent',
          'eventCategory': 'Translation Services',
          'eventAction': phila_language_list[item].language,
          'eventLabel': window.location.pathname
        });
      });

      li.appendChild(a_tag);
    } else {
      // programs - translated content template
      var urlParams = new URLSearchParams(window.location.search);
      var activeLang = urlParams.get('lang');
      if (!activeLang) {
        activeLang = 'english';
      }
      var _a_tag = document.createElement("a");
      if (phila_language_list[item].value == activeLang) {
        _a_tag.className += " active";
      }
      _a_tag.className += " phm";
      _a_tag.className += " translation-link";
      _a_tag.className += " phs";
      _a_tag.className += " " + phila_language_list[item].language + '-translation';
      _a_tag.href += "?lang=" + phila_language_list[item].value;
      _a_tag.innerHTML = phila_language_list[item].key;
      _a_tag.addEventListener("click", function (event) {
        event.preventDefault();
        if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?lang=" + phila_language_list[item].value;
          window.history.pushState({ path: newurl }, '', newurl);
        }
        updateActiveLanguage(phila_language_list[item].value);
        window.dataLayer.push({
          'event': 'GAEvent',
          'eventCategory': 'Translation Services',
          'eventAction': phila_language_list[item].language,
          'eventLabel': window.location.pathname
        });
      });

      li.appendChild(_a_tag);
      $('#' + activeLang + '-form').show();
    }

    if (window.matchMedia('(max-width: 660px)').matches && i >= 2 && phila_language_list_count >= 3) {
      document.getElementById("dropdown-translation-bar").appendChild(li);
      show_dropdown = true;
    } else if (window.matchMedia('(max-width: 980px)').matches && i >= 4 && phila_language_list_count >= 5) {
      document.getElementById("dropdown-translation-bar").appendChild(li);
      show_dropdown = true;
    } else if (i >= 6 && phila_language_list_count >= 7) {
      document.getElementById("dropdown-translation-bar").appendChild(li);
      show_dropdown = true;
    } else {
      document.getElementById("main-translation-bar").appendChild(li);
    }
    i++;
  };

  for (var item in phila_language_list) {
    _loop(item);
  }
  if (show_dropdown == false) {
    $('.dropdown-container').hide();
    $('.translations-container .inline-list').addClass("no-dropdown");
  }
}

$('.column-content p:empty').remove();

$(function () {
  //modal for any image that's been added to the page and linked to.
  var $modal = $('#phila-lightbox');
  function loadContent(url) {
    $modal.html('<div class="lightbox-content"><img src="' + url + '" alt=""></div>').foundation('open');
    $modal.append(closeButton);
  };

  $('.lightbox-all').on('click', dealWithIt);

  function dealWithIt(e) {
    if (Foundation.MediaQuery.current !== 'small') {
      var href = e.currentTarget.dataset.imgUrl;
      var $this = $(this);
      loadContent(href);
    }
  }
  $('.lightbox-all').each(function () {
    $(this).removeAttr('tabindex');
  });

  $(document).on('closed.zf.reveal', '#phila-lightbox', function (e) {
    $('.lightbox-all').removeAttr('tabindex');
  });
});

//disable lightboxes on mobile
$(function () {
  if (Foundation.MediaQuery.current === 'small') {
    if ($('.lightbox-link')) {
      $('#phila-lightbox').foundation('_destroy');
      $('#phila-lightbox-feature').foundation('_destroy');
      $('.lightbox-link').blur();
    }
  }
});

function updateActiveLanguage(activeLang) {
  $('.embedded-translated-form').hide();
  $(".translation-link.active").removeClass("active");
  $('.translation-link').each(function () {
    if ($(this).hasClass(activeLang + "-translation")) {
      $(this).addClass("active");
      $('#' + activeLang + '-form').show();
    }
  });
}

},{}],21:[function(require,module,exports){
'use strict';

var List = require('list.js');
var moment = require('moment');

module.exports = $(function () {

  $('.date').each(function (j) {
    var text = $(this).clone().find('span').remove().end().text();
    var date = text.split(" ").filter(function (v) {
      return v !== '';
    });
    var jsDate = new Date(date[1] + " " + date[2] + " " + date[3]);
    if (!isNaN(jsDate)) {
      $(this).attr('data-unix', moment(jsDate).unix());
    }
  });

  $('.search-sort-single-table').each(function (j) {
    var table = new List('sortable-table-' + j, {
      searchClass: 'table-search',
      listClass: 'search-sortable',
      sortClass: 'table-sort',
      valueNames: ['name', 'title', 'category', { name: 'date', attr: 'data-unix' }, 'author', 'description']
    });
  });

  $('.search-sort-table').each(function (j) {

    var pageNum = $('#sortable-table-' + j + ' table').hasClass("staff-directory") ? 20 : 6;
    var pagination = $('#sortable-table-' + j + ' table').hasClass("no-paginate") ? false : true;

    if (pagination) {
      var options = {
        searchClass: 'table-search',
        listClass: 'search-sortable',
        sortClass: 'table-sort',
        valueNames: ['name', 'title', 'category', { name: 'date', attr: 'data-unix' }, 'author', 'description'],
        pagination: true,
        page: pageNum,
        paginationClass: 'paginate-links'
      };
    } else {
      var options = {
        searchClass: 'table-search',
        listClass: 'search-sortable',
        sortClass: 'table-sort',
        valueNames: ['name', 'title', 'category', { name: 'date', attr: 'data-unix' }, 'author', 'description']
      };
    }

    var table = new List('sortable-table-' + j, options);
    table.on('updated', function (list) {

      if (list.matchingItems.length > 0) {
        $('#sortable-table-' + j + ' .no-results').hide();
      } else {
        $('#sortable-table-' + j + '.no-results').show();
      }
      if (pagination) {
        checkNavButtons();
      }

      var loggedIn;

      if ($('#wpadminbar').length) {
        loggedIn = $('#wpadminbar').outerHeight();
      } else {
        loggedIn = 0;
      }
      //subtract 50 incase there's a title on the div
      $('html, body').animate({
        scrollTop: $('#sortable-table-' + j).offset().top - $('.primary-menu').outerHeight() - loggedIn - 50
      }, 400);
    });

    function checkNavButtons() {

      if (table.i === 1 && table.page === pageNum && table.visibleItems.length === pageNum) {
        $('.prev-' + j).addClass('disabled');
      } else {
        //Handle searches
        if (table.searched == true && table.visibleItems.length < pageNum) {
          $('.prev-' + j).addClass('disabled');
        } else {
          $('.prev-' + j).removeClass('disabled');
        }
      }

      if (table.visibleItems.length < pageNum) {
        $('.next-' + j).addClass('disabled');
      } else {
        //Handle last page
        if (table.matchingItems.length % table.items.length == 0 && table.matchingItems.length - table.i >= pageNum) {
          $('.next-' + j).removeClass('disabled');
        } else {
          $('.next-' + j).addClass('disabled');
        }
      }
    }
    if (pagination) {

      $('.next-' + j).on('click', function (e) {
        table.show(table.i + pageNum, pageNum);
        e.preventDefault();
      });

      $('.prev-' + j).on('click', function (e) {
        table.show(table.i - pageNum, pageNum);
        e.preventDefault();
      });
      checkNavButtons();
    }
  });
});

},{"list.js":30,"moment":46}],22:[function(require,module,exports){
'use strict';

var deparam = require('../dependencies/jquery-deparam.js');
require('../dependencies/jquery.swiftype.autocomplete.js');
require('../dependencies/jquery.swiftype.search.js');
require('js-cookie');
var Mustache = require('mustache');

module.exports = jQuery(document).ready(function ($) {

  if (window.location.href.indexOf("%3E") > -1 || window.location.href.indexOf("%3C") > -1) {
    return;
  }

  var resultTemplate = '<div data-type="{{&contentType}}"><article><header class="search-entry-header"><h3>';

  resultTemplate += '<a href="{{&url}}" rel="bookmark">{{title}}</a></h3></header>';

  resultTemplate += '<div class="mbm"><i class="{{&icon}}" aria-hidden="true"></i> <i>{{&contentType}}</i></div>';

  resultTemplate += '<p class="entry-summary">{{&summary}}</p></article><hr class="mhn">';

  var legacyTemplate = '<article><header class="search-entry-header"><h3 class="entry-title">';

  legacyTemplate += '<a href="{{&url}}" rel="bookmark">{{title}}</a></h3></header>';

  legacyTemplate += '<p class="entry-summary">{{&summary}}</p></article><hr class="mhn">';

  var SWIFTYPE_ENGINE = 'ALSW3neJArH_ozFvSDse';

  var $stSearchInput = $("#st-search-input");

  var searchConfig = {
    facets: {},
    filters: {
      content_type: undefined
    }
  };

  var readFilters = function readFilters() {
    return {
      page: {
        content_type: searchConfig.filters.content_type
      }
    };
  };

  var customRenderer = function customRenderer(documentType, item) {

    var view = {
      url: encodeURI(item.url),
      title: item.title,
      summary: item.highlight.body || (item.body.length > 250 ? item.body.substring(0, 250) + '...' : item.body),
      content_type: item.content_type,
      icon: ''
    };

    if (item.tags === 'wordpress' || item.tags === 'app') {
      if (item.content_type === 'programs') {
        view.contentType = 'Program and initiative';
        view.icon = 'fas fa-info-circle';
      } else if (item.content_type === 'post' || item.content_type === 'press_release' || item.content_type === 'news' || item.content_type === 'phila_post' || item.content_type === 'news_post') {
        view.contentType = 'News & events';
        view.icon = 'fas fa-microphone';
      } else if (item.content_type === 'department_page') {
        view.contentType = 'Department';
        view.icon = 'fas fa-sitemap';
      } else if (item.content_type === 'service_page') {
        view.contentType = 'Service';
        view.icon = 'fas -falist';
      } else if (item.content_type === 'document') {
        view.contentType = 'Document';
        view.icon = 'fas fa-file-alt';
      }
      return Mustache.render(resultTemplate, view);
    } else {
      return Mustache.render(legacyTemplate, view);
    }
  };

  var $resultCount = $('#result-count');

  var customPostRenderFunction = function customPostRenderFunction(data) {
    var totalResultCount = 0;
    var $resultContainer = this.getContext().resultContainer;
    var spellingSuggestion = null;

    if (data['info']) {
      $.each(data['info'], function (index, value) {
        totalResultCount += value['total_result_count'];
        if (value['spelling_suggestion']) {
          spellingSuggestion = value['spelling_suggestion']['text'];
        }
      });
    }

    if (totalResultCount === 0) {
      $resultCount.html("No results found for <i>" + data['info']['page']['query'] + "</i>. <div class='info panel mtm row'><div class='medium-3 columns hide-for-small-only'><i class='far fa-frown fa-4x'></i></div> <div class='text small-24 medium-21 columns'><p class='h3 mbm'>We're sorry, we didn't find any results that match your search terms.</h3> Suggestions: <ul><li>Check your spelling. </li><li>Try different search terms.</li></ul></div></div>");
    } else {
      $resultCount.html("Found <b><span>" + totalResultCount + "</span></b> results for \"<i>" + data['info']['page']['query'] + "\"</i>");
    }

    if (spellingSuggestion !== null) {
      $('.info.panel .text').append('<span class="st-spelling-suggestion">Did you mean <a href="#" data-hash="true" data-spelling-suggestion="' + spellingSuggestion + '">' + spellingSuggestion + '</a>?</span>');
    }
  };

  function scrollTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  }

  function customRenderPaginationForType(type, currentPage, totalPages) {
    var pages = '<nav><ul class="no-bullet paginate-links">',
        previousPage,
        nextPage;
    if (currentPage != 1) {
      previousPage = currentPage - 1;
      pages = pages + '<li><a href="#" onClick="' + scrollTop() + '" class="prev" data-hash="true" data-page="' + previousPage + '"><i class="fas fa-arrow-left" aria-hidden="true"></i> Previous</a></li>';
    }
    if (currentPage < totalPages) {
      nextPage = currentPage + 1;
      pages = pages + '<li><a href="#" onClick="' + scrollTop() + '" class="next" data-hash="true" data-page="' + nextPage + '">Next <i class="fas fa-arrow-right" aria-hidden="true"></i></a></li>';
    }
    pages += '</ul></nav>';

    return pages;
  }

  $('.content-type').on('click', function (e) {
    var current = $(this).data('type');

    searchConfig.filters.content_type = current;

    if (current === 'post') {
      searchConfig.filters.content_type = ['post', 'phila_post', 'news', 'press_release'];
    }

    //reset pagination to 1
    window.location.href = escapeHtml(window.location.href).replace(/stp=\d{0,3}/, 'stp=1');
    $stSearchInput.swiftypeSearch();

    reloadResults();
  });

  $('#content-types').on('click', 'a.clear-all', function (e) {
    e.preventDefault();

    $('.content-type').prop('checked', false);

    searchConfig.filters.content_type = [];

    //reset pagination to 1
    window.location.href = escapeHtml(window.location.href).replace(/stp=\d{0,3}/, 'stp=1');

    $stSearchInput.swiftypeSearch();

    reloadResults();
  });

  $stSearchInput.swiftypeSearch({
    engineKey: SWIFTYPE_ENGINE,
    resultContainingElement: '#st-results-container',
    renderFunction: customRenderer,
    postRenderFunction: customPostRenderFunction,
    renderPaginationForType: customRenderPaginationForType,
    filters: readFilters,
    facets: { page: ['content_type'] }
  });

  //handles searches from the global menu
  $("#search-form").submit(function (e) {
    e.preventDefault();
    var userString = $(this).find(".search-field").val();
    window.location.href = '/search/#stq=' + Swiftype.htmlEscape(userString);
  });

  $("#st-search-form").submit(function (e) {
    e.preventDefault();
    var userString = $(this).find(".search-field").val();
    window.location.href = '/search/#stq=' + Swiftype.htmlEscape(userString);
  });

  var addressRe = /\d+ \w+/;
  var $propertyLink = $('#property-link');

  function addressSearch() {
    $propertyLink.css('display', 'none');

    // Also check OPA API for results if it looks like an address
    var params = $.deparam(location.hash.substr(1));
    var query = Swiftype.htmlEscape(params.stq);
    var queryEncoded = encodeURIComponent(query);

    if (addressRe.test(params.stq)) {
      $.ajax('https://api.phila.gov/ais/v1/addresses/' + queryEncoded, {
        dataType: $.support.cors ? 'json' : 'jsonp',
        data: { gatekeeperKey: 'ad0050d3c6e40064546a18af371f7826' }
      }).done(function (data) {
        if (data.total_size) {
          $propertyLink.prop('href', '/property/?a=' + queryEncoded + '&u=');
          $propertyLink.css('display', 'block');
        }
      });
    }
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/</g, "").replace(/>/g, "").replace(/"/g, "").replace(/'/g, "");
  }

  function getPath(url) {
    // Use this to only get the path on the URL
    // Handy for this working across environments
    var a = document.createElement('a');
    a.href = url;
    return a.pathname;
  }

  function customAutocompleteRender(document_type, item) {
    return '<a class="autocomplete-link" href="' + getPath(item.url) + '">' + Swiftype.htmlEscape(item.title) + '</a>';
  }

  var reloadResults = function reloadResults() {
    $(window).trigger('hashchange');
  };

  $(window).on('hashchange', function (e) {
    addressSearch();
  }).trigger('hashchange');

  // Autocomplete
  $('.swiftype').swiftype({
    engineKey: SWIFTYPE_ENGINE,
    renderFunction: customAutocompleteRender,
    resultLimit: 5
  });
});

},{"../dependencies/jquery-deparam.js":1,"../dependencies/jquery.swiftype.autocomplete.js":2,"../dependencies/jquery.swiftype.search.js":3,"js-cookie":26,"mustache":47}],23:[function(require,module,exports){
'use strict';

(function () {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
	    is_opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
	    is_ie = navigator.userAgent.toLowerCase().indexOf('msie') > -1;

	if ((is_webkit || is_opera || is_ie) && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var element = document.getElementById(location.hash.substring(1));

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) element.tabIndex = -1;

				element.focus();
			}
		}, false);
	}
})();

},{}],24:[function(require,module,exports){
"use strict";

module.exports = $(function () {
  //BEGIN Translation Bar

  $(document).ready(function () {
    $("#google_translate_element").bind("DOMNodeInserted", function () {
      if ($("#google_translate_element").length) {
        var $firstOption = $(".goog-te-combo option:first");

        if ($firstOption.length && $firstOption.text() === "Select Language") {
          $firstOption.text("More Languages");
        }

        $("i.fa-plus").on("click", function (e) {
          $("select.goog-te-combo").trigger("click");
        });

        $(".goog-te-gadget").contents().filter(function () {
          return this.nodeType === 3 && !$(this).parent().hasClass("goog-te-combo");
        }).remove();

        if ($(".goog-te-gadget span:first").length) {
          $(".goog-te-gadget span:first").remove();
        }

        var targetDiv = $("#\\:0\\.targetLanguage");
        if (!targetDiv.has(".fa.fa-plus").length) {
          var icon = $("<i>").addClass("fa fa-plus");
          targetDiv.prepend(icon);
        }

        var targetDiv = $(".goog-te-gadget");
        var select = $("select.goog-te-combo");
        select.on("focus", function () {
          targetDiv.focus();
        });
      }
    });
    // "hard code" english translations label DD
    $("#translate-english").text("English");
    $("#translate-english-dropdown").text("English");
    $("#translate-spanish").text("Español");
    $("#translate-spanish-dropdown").text("Español");
    $("#translate-chinese").text("中文");
    $("#translate-chinese-dropdown").text("中文");
    $("#translate-arabic-dropdown").text("عربي");

    function setOverflowHidden() {
      $("html, body").css({
        overflow: "hidden",
        height: "100%"
      });
    }

    function setOverflowAuto() {
      $("html, body").css({
        overflow: "auto",
        height: "auto"
      });
    }

    function updateBodyState() {
      if ($(window).width() <= 779) {
        if ($("#lang-dropdown").hasClass("is-open") === true) {
          setOverflowHidden();
        }
      } else {
        setOverflowAuto();
      }
    }

    $(window).resize(function () {
      updateBodyState();
    });

    $("#lang-dropdown").on({
      click: function click(e) {
        updateBodyState();
      },
      "show.zf.dropdown": function showZfDropdown(e) {
        // setOverflowHidden();
        toggleMenuOpen(true);
        updateBodyState();
        $("#mobile-lang-button").focus();
        $("#desktop-lang-button").focus();
      },
      "hide.zf.dropdown": function hideZfDropdown(e) {
        setOverflowAuto();
        toggleMenuOpen(false);
        updateBodyState();
        $("#mobile-lang-button").focus();
        $("#desktop-lang-button").focus();
      }
    });

    var hoverTimeout;

    $("button#desktop-lang-button").hover(function () {
      clearTimeout(hoverTimeout);
      if (!$("#lang-dropdown").hasClass("is-open")) {
        hoverTimeout = setTimeout(function () {
          $("#lang-dropdown").foundation("open");
        }, 500);
      }
    });

    function toggleMenuOpen(isOpen) {
      var $langDropdown = $("#lang-dropdown");
      var $caretIcon = $(".translations-nav i.translate-caret");
      var action = isOpen ? "addClass" : "removeClass";
      $langDropdown.toggleClass("js-dropdown-active", isOpen);
      $langDropdown.toggleClass("is-open", isOpen);
      $caretIcon[action]("rotated");
    }

    function setActiveLanguage(urlLanguage) {
      $(".translations-nav li").find("a").each(function () {
        if (urlLanguage === $.trim($(this).text())) {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
      });
    }
    function getUrlLanguage() {
      var windowPath = $(location)[0];
      if (windowPath) {
        var langPath = windowPath.pathname.split("/")[1];
        var urlLanguage = "";

        switch (langPath) {
          case "ar":
            urlLanguage = "عربي";
            break;
          case "zh":
            urlLanguage = "中文";
            break;
          case "es":
            urlLanguage = "Español";
            break;
          default:
            urlLanguage = "English";
        }
        setActiveLanguage(urlLanguage);
      }
    }
    getUrlLanguage();
  });

  //END Translation Bar
});

},{}],25:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.6.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2022-08-26T17:52Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );

var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		// trim whitespace for custom property (issue gh-4926)
		if ( isCustomProp ) {

			// rtrim treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" );
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],26:[function(require,module,exports){
/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (function () {
    var current = global.Cookies;
    var exports = global.Cookies = factory();
    exports.noConflict = function () { global.Cookies = current; return exports; };
  }()));
}(this, (function () { 'use strict';

  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

})));

},{}],27:[function(require,module,exports){
module.exports = function (list) {
  var addAsync = function (values, callback, items) {
    var valuesToAdd = values.splice(0, 50)
    items = items || []
    items = items.concat(list.add(valuesToAdd))
    if (values.length > 0) {
      setTimeout(function () {
        addAsync(values, callback, items)
      }, 1)
    } else {
      list.update()
      callback(items)
    }
  }
  return addAsync
}

},{}],28:[function(require,module,exports){
module.exports = function (list) {
  // Add handlers
  list.handlers.filterStart = list.handlers.filterStart || []
  list.handlers.filterComplete = list.handlers.filterComplete || []

  return function (filterFunction) {
    list.trigger('filterStart')
    list.i = 1 // Reset paging
    list.reset.filter()
    if (filterFunction === undefined) {
      list.filtered = false
    } else {
      list.filtered = true
      var is = list.items
      for (var i = 0, il = is.length; i < il; i++) {
        var item = is[i]
        if (filterFunction(item)) {
          item.filtered = true
        } else {
          item.filtered = false
        }
      }
    }
    list.update()
    list.trigger('filterComplete')
    return list.visibleItems
  }
}

},{}],29:[function(require,module,exports){
var classes = require('./utils/classes'),
  events = require('./utils/events'),
  extend = require('./utils/extend'),
  toString = require('./utils/to-string'),
  getByClass = require('./utils/get-by-class'),
  fuzzy = require('./utils/fuzzy')

module.exports = function (list, options) {
  options = options || {}

  options = extend(
    {
      location: 0,
      distance: 100,
      threshold: 0.4,
      multiSearch: true,
      searchClass: 'fuzzy-search',
    },
    options
  )

  var fuzzySearch = {
    search: function (searchString, columns) {
      // Substract arguments from the searchString or put searchString as only argument
      var searchArguments = options.multiSearch ? searchString.replace(/ +$/, '').split(/ +/) : [searchString]

      for (var k = 0, kl = list.items.length; k < kl; k++) {
        fuzzySearch.item(list.items[k], columns, searchArguments)
      }
    },
    item: function (item, columns, searchArguments) {
      var found = true
      for (var i = 0; i < searchArguments.length; i++) {
        var foundArgument = false
        for (var j = 0, jl = columns.length; j < jl; j++) {
          if (fuzzySearch.values(item.values(), columns[j], searchArguments[i])) {
            foundArgument = true
          }
        }
        if (!foundArgument) {
          found = false
        }
      }
      item.found = found
    },
    values: function (values, value, searchArgument) {
      if (values.hasOwnProperty(value)) {
        var text = toString(values[value]).toLowerCase()

        if (fuzzy(text, searchArgument, options)) {
          return true
        }
      }
      return false
    },
  }

  events.bind(
    getByClass(list.listContainer, options.searchClass),
    'keyup',
    list.utils.events.debounce(function (e) {
      var target = e.target || e.srcElement // IE have srcElement
      list.search(target.value, fuzzySearch.search)
    }, list.searchDelay)
  )

  return function (str, columns) {
    list.search(str, columns, fuzzySearch.search)
  }
}

},{"./utils/classes":37,"./utils/events":38,"./utils/extend":39,"./utils/fuzzy":40,"./utils/get-by-class":42,"./utils/to-string":45}],30:[function(require,module,exports){
var naturalSort = require('string-natural-compare'),
  getByClass = require('./utils/get-by-class'),
  extend = require('./utils/extend'),
  indexOf = require('./utils/index-of'),
  events = require('./utils/events'),
  toString = require('./utils/to-string'),
  classes = require('./utils/classes'),
  getAttribute = require('./utils/get-attribute'),
  toArray = require('./utils/to-array')

module.exports = function (id, options, values) {
  var self = this,
    init,
    Item = require('./item')(self),
    addAsync = require('./add-async')(self),
    initPagination = require('./pagination')(self)

  init = {
    start: function () {
      self.listClass = 'list'
      self.searchClass = 'search'
      self.sortClass = 'sort'
      self.page = 10000
      self.i = 1
      self.items = []
      self.visibleItems = []
      self.matchingItems = []
      self.searched = false
      self.filtered = false
      self.searchColumns = undefined
      self.searchDelay = 0
      self.handlers = { updated: [] }
      self.valueNames = []
      self.utils = {
        getByClass: getByClass,
        extend: extend,
        indexOf: indexOf,
        events: events,
        toString: toString,
        naturalSort: naturalSort,
        classes: classes,
        getAttribute: getAttribute,
        toArray: toArray,
      }

      self.utils.extend(self, options)

      self.listContainer = typeof id === 'string' ? document.getElementById(id) : id
      if (!self.listContainer) {
        return
      }
      self.list = getByClass(self.listContainer, self.listClass, true)

      self.parse = require('./parse')(self)
      self.templater = require('./templater')(self)
      self.search = require('./search')(self)
      self.filter = require('./filter')(self)
      self.sort = require('./sort')(self)
      self.fuzzySearch = require('./fuzzy-search')(self, options.fuzzySearch)

      this.handlers()
      this.items()
      this.pagination()

      self.update()
    },
    handlers: function () {
      for (var handler in self.handlers) {
        if (self[handler] && self.handlers.hasOwnProperty(handler)) {
          self.on(handler, self[handler])
        }
      }
    },
    items: function () {
      self.parse(self.list)
      if (values !== undefined) {
        self.add(values)
      }
    },
    pagination: function () {
      if (options.pagination !== undefined) {
        if (options.pagination === true) {
          options.pagination = [{}]
        }
        if (options.pagination[0] === undefined) {
          options.pagination = [options.pagination]
        }
        for (var i = 0, il = options.pagination.length; i < il; i++) {
          initPagination(options.pagination[i])
        }
      }
    },
  }

  /*
   * Re-parse the List, use if html have changed
   */
  this.reIndex = function () {
    self.items = []
    self.visibleItems = []
    self.matchingItems = []
    self.searched = false
    self.filtered = false
    self.parse(self.list)
  }

  this.toJSON = function () {
    var json = []
    for (var i = 0, il = self.items.length; i < il; i++) {
      json.push(self.items[i].values())
    }
    return json
  }

  /*
   * Add object to list
   */
  this.add = function (values, callback) {
    if (values.length === 0) {
      return
    }
    if (callback) {
      addAsync(values.slice(0), callback)
      return
    }
    var added = [],
      notCreate = false
    if (values[0] === undefined) {
      values = [values]
    }
    for (var i = 0, il = values.length; i < il; i++) {
      var item = null
      notCreate = self.items.length > self.page ? true : false
      item = new Item(values[i], undefined, notCreate)
      self.items.push(item)
      added.push(item)
    }
    self.update()
    return added
  }

  this.show = function (i, page) {
    this.i = i
    this.page = page
    self.update()
    return self
  }

  /* Removes object from list.
   * Loops through the list and removes objects where
   * property "valuename" === value
   */
  this.remove = function (valueName, value, options) {
    var found = 0
    for (var i = 0, il = self.items.length; i < il; i++) {
      if (self.items[i].values()[valueName] == value) {
        self.templater.remove(self.items[i], options)
        self.items.splice(i, 1)
        il--
        i--
        found++
      }
    }
    self.update()
    return found
  }

  /* Gets the objects in the list which
   * property "valueName" === value
   */
  this.get = function (valueName, value) {
    var matchedItems = []
    for (var i = 0, il = self.items.length; i < il; i++) {
      var item = self.items[i]
      if (item.values()[valueName] == value) {
        matchedItems.push(item)
      }
    }
    return matchedItems
  }

  /*
   * Get size of the list
   */
  this.size = function () {
    return self.items.length
  }

  /*
   * Removes all items from the list
   */
  this.clear = function () {
    self.templater.clear()
    self.items = []
    return self
  }

  this.on = function (event, callback) {
    self.handlers[event].push(callback)
    return self
  }

  this.off = function (event, callback) {
    var e = self.handlers[event]
    var index = indexOf(e, callback)
    if (index > -1) {
      e.splice(index, 1)
    }
    return self
  }

  this.trigger = function (event) {
    var i = self.handlers[event].length
    while (i--) {
      self.handlers[event][i](self)
    }
    return self
  }

  this.reset = {
    filter: function () {
      var is = self.items,
        il = is.length
      while (il--) {
        is[il].filtered = false
      }
      return self
    },
    search: function () {
      var is = self.items,
        il = is.length
      while (il--) {
        is[il].found = false
      }
      return self
    },
  }

  this.update = function () {
    var is = self.items,
      il = is.length

    self.visibleItems = []
    self.matchingItems = []
    self.templater.clear()
    for (var i = 0; i < il; i++) {
      if (is[i].matching() && self.matchingItems.length + 1 >= self.i && self.visibleItems.length < self.page) {
        is[i].show()
        self.visibleItems.push(is[i])
        self.matchingItems.push(is[i])
      } else if (is[i].matching()) {
        self.matchingItems.push(is[i])
        is[i].hide()
      } else {
        is[i].hide()
      }
    }
    self.trigger('updated')
    return self
  }

  init.start()
}

},{"./add-async":27,"./filter":28,"./fuzzy-search":29,"./item":31,"./pagination":32,"./parse":33,"./search":34,"./sort":35,"./templater":36,"./utils/classes":37,"./utils/events":38,"./utils/extend":39,"./utils/get-attribute":41,"./utils/get-by-class":42,"./utils/index-of":43,"./utils/to-array":44,"./utils/to-string":45,"string-natural-compare":49}],31:[function(require,module,exports){
module.exports = function (list) {
  return function (initValues, element, notCreate) {
    var item = this

    this._values = {}

    this.found = false // Show if list.searched == true and this.found == true
    this.filtered = false // Show if list.filtered == true and this.filtered == true

    var init = function (initValues, element, notCreate) {
      if (element === undefined) {
        if (notCreate) {
          item.values(initValues, notCreate)
        } else {
          item.values(initValues)
        }
      } else {
        item.elm = element
        var values = list.templater.get(item, initValues)
        item.values(values)
      }
    }

    this.values = function (newValues, notCreate) {
      if (newValues !== undefined) {
        for (var name in newValues) {
          item._values[name] = newValues[name]
        }
        if (notCreate !== true) {
          list.templater.set(item, item.values())
        }
      } else {
        return item._values
      }
    }

    this.show = function () {
      list.templater.show(item)
    }

    this.hide = function () {
      list.templater.hide(item)
    }

    this.matching = function () {
      return (
        (list.filtered && list.searched && item.found && item.filtered) ||
        (list.filtered && !list.searched && item.filtered) ||
        (!list.filtered && list.searched && item.found) ||
        (!list.filtered && !list.searched)
      )
    }

    this.visible = function () {
      return item.elm && item.elm.parentNode == list.list ? true : false
    }

    init(initValues, element, notCreate)
  }
}

},{}],32:[function(require,module,exports){
var classes = require('./utils/classes'),
  events = require('./utils/events'),
  List = require('./index')

module.exports = function (list) {
  var isHidden = false

  var refresh = function (pagingList, options) {
    if (list.page < 1) {
      list.listContainer.style.display = 'none'
      isHidden = true
      return
    } else if (isHidden) {
      list.listContainer.style.display = 'block'
    }

    var item,
      l = list.matchingItems.length,
      index = list.i,
      page = list.page,
      pages = Math.ceil(l / page),
      currentPage = Math.ceil(index / page),
      innerWindow = options.innerWindow || 2,
      left = options.left || options.outerWindow || 0,
      right = options.right || options.outerWindow || 0

    right = pages - right
    pagingList.clear()
    for (var i = 1; i <= pages; i++) {
      var className = currentPage === i ? 'active' : ''

      //console.log(i, left, right, currentPage, (currentPage - innerWindow), (currentPage + innerWindow), className);

      if (is.number(i, left, right, currentPage, innerWindow)) {
        item = pagingList.add({
          page: i,
          dotted: false,
        })[0]
        if (className) {
          classes(item.elm).add(className)
        }
        item.elm.firstChild.setAttribute('data-i', i)
        item.elm.firstChild.setAttribute('data-page', page)
      } else if (is.dotted(pagingList, i, left, right, currentPage, innerWindow, pagingList.size())) {
        item = pagingList.add({
          page: '...',
          dotted: true,
        })[0]
        classes(item.elm).add('disabled')
      }
    }
  }

  var is = {
    number: function (i, left, right, currentPage, innerWindow) {
      return this.left(i, left) || this.right(i, right) || this.innerWindow(i, currentPage, innerWindow)
    },
    left: function (i, left) {
      return i <= left
    },
    right: function (i, right) {
      return i > right
    },
    innerWindow: function (i, currentPage, innerWindow) {
      return i >= currentPage - innerWindow && i <= currentPage + innerWindow
    },
    dotted: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      return (
        this.dottedLeft(pagingList, i, left, right, currentPage, innerWindow) ||
        this.dottedRight(pagingList, i, left, right, currentPage, innerWindow, currentPageItem)
      )
    },
    dottedLeft: function (pagingList, i, left, right, currentPage, innerWindow) {
      return i == left + 1 && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right)
    },
    dottedRight: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      if (pagingList.items[currentPageItem - 1].values().dotted) {
        return false
      } else {
        return i == right && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right)
      }
    },
  }

  return function (options) {
    var pagingList = new List(list.listContainer.id, {
      listClass: options.paginationClass || 'pagination',
      item: options.item || "<li><a class='page' href='#'></a></li>",
      valueNames: ['page', 'dotted'],
      searchClass: 'pagination-search-that-is-not-supposed-to-exist',
      sortClass: 'pagination-sort-that-is-not-supposed-to-exist',
    })

    events.bind(pagingList.listContainer, 'click', function (e) {
      var target = e.target || e.srcElement,
        page = list.utils.getAttribute(target, 'data-page'),
        i = list.utils.getAttribute(target, 'data-i')
      if (i) {
        list.show((i - 1) * page + 1, page)
      }
    })

    list.on('updated', function () {
      refresh(pagingList, options)
    })
    refresh(pagingList, options)
  }
}

},{"./index":30,"./utils/classes":37,"./utils/events":38}],33:[function(require,module,exports){
module.exports = function (list) {
  var Item = require('./item')(list)

  var getChildren = function (parent) {
    var nodes = parent.childNodes,
      items = []
    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        items.push(nodes[i])
      }
    }
    return items
  }

  var parse = function (itemElements, valueNames) {
    for (var i = 0, il = itemElements.length; i < il; i++) {
      list.items.push(new Item(valueNames, itemElements[i]))
    }
  }
  var parseAsync = function (itemElements, valueNames) {
    var itemsToIndex = itemElements.splice(0, 50) // TODO: If < 100 items, what happens in IE etc?
    parse(itemsToIndex, valueNames)
    if (itemElements.length > 0) {
      setTimeout(function () {
        parseAsync(itemElements, valueNames)
      }, 1)
    } else {
      list.update()
      list.trigger('parseComplete')
    }
  }

  list.handlers.parseComplete = list.handlers.parseComplete || []

  return function () {
    var itemsToIndex = getChildren(list.list),
      valueNames = list.valueNames

    if (list.indexAsync) {
      parseAsync(itemsToIndex, valueNames)
    } else {
      parse(itemsToIndex, valueNames)
    }
  }
}

},{"./item":31}],34:[function(require,module,exports){
module.exports = function (list) {
  var item, text, columns, searchString, customSearch

  var prepare = {
    resetList: function () {
      list.i = 1
      list.templater.clear()
      customSearch = undefined
    },
    setOptions: function (args) {
      if (args.length == 2 && args[1] instanceof Array) {
        columns = args[1]
      } else if (args.length == 2 && typeof args[1] == 'function') {
        columns = undefined
        customSearch = args[1]
      } else if (args.length == 3) {
        columns = args[1]
        customSearch = args[2]
      } else {
        columns = undefined
      }
    },
    setColumns: function () {
      if (list.items.length === 0) return
      if (columns === undefined) {
        columns = list.searchColumns === undefined ? prepare.toArray(list.items[0].values()) : list.searchColumns
      }
    },
    setSearchString: function (s) {
      s = list.utils.toString(s).toLowerCase()
      s = s.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') // Escape regular expression characters
      searchString = s
    },
    toArray: function (values) {
      var tmpColumn = []
      for (var name in values) {
        tmpColumn.push(name)
      }
      return tmpColumn
    },
  }
  var search = {
    list: function () {
      // Extract quoted phrases "word1 word2" from original searchString
      // searchString is converted to lowercase by List.js
      var words = [],
        phrase,
        ss = searchString
      while ((phrase = ss.match(/"([^"]+)"/)) !== null) {
        words.push(phrase[1])
        ss = ss.substring(0, phrase.index) + ss.substring(phrase.index + phrase[0].length)
      }
      // Get remaining space-separated words (if any)
      ss = ss.trim()
      if (ss.length) words = words.concat(ss.split(/\s+/))
      for (var k = 0, kl = list.items.length; k < kl; k++) {
        var item = list.items[k]
        item.found = false
        if (!words.length) continue
        for (var i = 0, il = words.length; i < il; i++) {
          var word_found = false
          for (var j = 0, jl = columns.length; j < jl; j++) {
            var values = item.values(),
              column = columns[j]
            if (values.hasOwnProperty(column) && values[column] !== undefined && values[column] !== null) {
              var text = typeof values[column] !== 'string' ? values[column].toString() : values[column]
              if (text.toLowerCase().indexOf(words[i]) !== -1) {
                // word found, so no need to check it against any other columns
                word_found = true
                break
              }
            }
          }
          // this word not found? no need to check any other words, the item cannot match
          if (!word_found) break
        }
        item.found = word_found
      }
    },
    // Removed search.item() and search.values()
    reset: function () {
      list.reset.search()
      list.searched = false
    },
  }

  var searchMethod = function (str) {
    list.trigger('searchStart')

    prepare.resetList()
    prepare.setSearchString(str)
    prepare.setOptions(arguments) // str, cols|searchFunction, searchFunction
    prepare.setColumns()

    if (searchString === '') {
      search.reset()
    } else {
      list.searched = true
      if (customSearch) {
        customSearch(searchString, columns)
      } else {
        search.list()
      }
    }

    list.update()
    list.trigger('searchComplete')
    return list.visibleItems
  }

  list.handlers.searchStart = list.handlers.searchStart || []
  list.handlers.searchComplete = list.handlers.searchComplete || []

  list.utils.events.bind(
    list.utils.getByClass(list.listContainer, list.searchClass),
    'keyup',
    list.utils.events.debounce(function (e) {
      var target = e.target || e.srcElement, // IE have srcElement
        alreadyCleared = target.value === '' && !list.searched
      if (!alreadyCleared) {
        // If oninput already have resetted the list, do nothing
        searchMethod(target.value)
      }
    }, list.searchDelay)
  )

  // Used to detect click on HTML5 clear button
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'input', function (e) {
    var target = e.target || e.srcElement
    if (target.value === '') {
      searchMethod('')
    }
  })

  return searchMethod
}

},{}],35:[function(require,module,exports){
module.exports = function (list) {
  var buttons = {
    els: undefined,
    clear: function () {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        list.utils.classes(buttons.els[i]).remove('asc')
        list.utils.classes(buttons.els[i]).remove('desc')
      }
    },
    getOrder: function (btn) {
      var predefinedOrder = list.utils.getAttribute(btn, 'data-order')
      if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
        return predefinedOrder
      } else if (list.utils.classes(btn).has('desc')) {
        return 'asc'
      } else if (list.utils.classes(btn).has('asc')) {
        return 'desc'
      } else {
        return 'asc'
      }
    },
    getInSensitive: function (btn, options) {
      var insensitive = list.utils.getAttribute(btn, 'data-insensitive')
      if (insensitive === 'false') {
        options.insensitive = false
      } else {
        options.insensitive = true
      }
    },
    setOrder: function (options) {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        var btn = buttons.els[i]
        if (list.utils.getAttribute(btn, 'data-sort') !== options.valueName) {
          continue
        }
        var predefinedOrder = list.utils.getAttribute(btn, 'data-order')
        if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
          if (predefinedOrder == options.order) {
            list.utils.classes(btn).add(options.order)
          }
        } else {
          list.utils.classes(btn).add(options.order)
        }
      }
    },
  }

  var sort = function () {
    list.trigger('sortStart')
    var options = {}

    var target = arguments[0].currentTarget || arguments[0].srcElement || undefined

    if (target) {
      options.valueName = list.utils.getAttribute(target, 'data-sort')
      buttons.getInSensitive(target, options)
      options.order = buttons.getOrder(target)
    } else {
      options = arguments[1] || options
      options.valueName = arguments[0]
      options.order = options.order || 'asc'
      options.insensitive = typeof options.insensitive == 'undefined' ? true : options.insensitive
    }

    buttons.clear()
    buttons.setOrder(options)

    // caseInsensitive
    // alphabet
    var customSortFunction = options.sortFunction || list.sortFunction || null,
      multi = options.order === 'desc' ? -1 : 1,
      sortFunction

    if (customSortFunction) {
      sortFunction = function (itemA, itemB) {
        return customSortFunction(itemA, itemB, options) * multi
      }
    } else {
      sortFunction = function (itemA, itemB) {
        var sort = list.utils.naturalSort
        sort.alphabet = list.alphabet || options.alphabet || undefined
        if (!sort.alphabet && options.insensitive) {
          sort = list.utils.naturalSort.caseInsensitive
        }
        return sort(itemA.values()[options.valueName], itemB.values()[options.valueName]) * multi
      }
    }

    list.items.sort(sortFunction)
    list.update()
    list.trigger('sortComplete')
  }

  // Add handlers
  list.handlers.sortStart = list.handlers.sortStart || []
  list.handlers.sortComplete = list.handlers.sortComplete || []

  buttons.els = list.utils.getByClass(list.listContainer, list.sortClass)
  list.utils.events.bind(buttons.els, 'click', sort)
  list.on('searchStart', buttons.clear)
  list.on('filterStart', buttons.clear)

  return sort
}

},{}],36:[function(require,module,exports){
var Templater = function (list) {
  var createItem,
    templater = this

  var init = function () {
    var itemSource

    if (typeof list.item === 'function') {
      createItem = function (values) {
        var item = list.item(values)
        return getItemSource(item)
      }
      return
    }

    if (typeof list.item === 'string') {
      if (list.item.indexOf('<') === -1) {
        itemSource = document.getElementById(list.item)
      } else {
        itemSource = getItemSource(list.item)
      }
    } else {
      /* If item source does not exists, use the first item in list as
      source for new items */
      itemSource = getFirstListItem()
    }

    if (!itemSource) {
      throw new Error("The list needs to have at least one item on init otherwise you'll have to add a template.")
    }

    itemSource = createCleanTemplateItem(itemSource, list.valueNames)

    createItem = function () {
      return itemSource.cloneNode(true)
    }
  }

  var createCleanTemplateItem = function (templateNode, valueNames) {
    var el = templateNode.cloneNode(true)
    el.removeAttribute('id')

    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i]
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          el.setAttribute('data-' + valueName.data[j], '')
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(el, valueName.name, true)
        if (elm) {
          elm.setAttribute(valueName.attr, '')
        }
      } else {
        elm = list.utils.getByClass(el, valueName, true)
        if (elm) {
          elm.innerHTML = ''
        }
      }
    }
    return el
  }

  var getFirstListItem = function () {
    var nodes = list.list.childNodes

    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        return nodes[i].cloneNode(true)
      }
    }
    return undefined
  }

  var getItemSource = function (itemHTML) {
    if (typeof itemHTML !== 'string') return undefined
    if (/<tr[\s>]/g.exec(itemHTML)) {
      var tbody = document.createElement('tbody')
      tbody.innerHTML = itemHTML
      return tbody.firstElementChild
    } else if (itemHTML.indexOf('<') !== -1) {
      var div = document.createElement('div')
      div.innerHTML = itemHTML
      return div.firstElementChild
    }
    return undefined
  }

  var getValueName = function (name) {
    for (var i = 0, il = list.valueNames.length; i < il; i++) {
      var valueName = list.valueNames[i]
      if (valueName.data) {
        var data = valueName.data
        for (var j = 0, jl = data.length; j < jl; j++) {
          if (data[j] === name) {
            return { data: name }
          }
        }
      } else if (valueName.attr && valueName.name && valueName.name == name) {
        return valueName
      } else if (valueName === name) {
        return name
      }
    }
  }

  var setValue = function (item, name, value) {
    var elm = undefined,
      valueName = getValueName(name)
    if (!valueName) return
    if (valueName.data) {
      item.elm.setAttribute('data-' + valueName.data, value)
    } else if (valueName.attr && valueName.name) {
      elm = list.utils.getByClass(item.elm, valueName.name, true)
      if (elm) {
        elm.setAttribute(valueName.attr, value)
      }
    } else {
      elm = list.utils.getByClass(item.elm, valueName, true)
      if (elm) {
        elm.innerHTML = value
      }
    }
  }

  this.get = function (item, valueNames) {
    templater.create(item)
    var values = {}
    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i]
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          values[valueName.data[j]] = list.utils.getAttribute(item.elm, 'data-' + valueName.data[j])
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(item.elm, valueName.name, true)
        values[valueName.name] = elm ? list.utils.getAttribute(elm, valueName.attr) : ''
      } else {
        elm = list.utils.getByClass(item.elm, valueName, true)
        values[valueName] = elm ? elm.innerHTML : ''
      }
    }
    return values
  }

  this.set = function (item, values) {
    if (!templater.create(item)) {
      for (var v in values) {
        if (values.hasOwnProperty(v)) {
          setValue(item, v, values[v])
        }
      }
    }
  }

  this.create = function (item) {
    if (item.elm !== undefined) {
      return false
    }
    item.elm = createItem(item.values())
    templater.set(item, item.values())
    return true
  }
  this.remove = function (item) {
    if (item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm)
    }
  }
  this.show = function (item) {
    templater.create(item)
    list.list.appendChild(item.elm)
  }
  this.hide = function (item) {
    if (item.elm !== undefined && item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm)
    }
  }
  this.clear = function () {
    /* .innerHTML = ''; fucks up IE */
    if (list.list.hasChildNodes()) {
      while (list.list.childNodes.length >= 1) {
        list.list.removeChild(list.list.firstChild)
      }
    }
  }

  init()
}

module.exports = function (list) {
  return new Templater(list)
}

},{}],37:[function(require,module,exports){
/**
 * Module dependencies.
 */

var index = require('./index-of')

/**
 * Whitespace regexp.
 */

var re = /\s+/

/**
 * toString reference.
 */

var toString = Object.prototype.toString

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function (el) {
  return new ClassList(el)
}

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required')
  }
  this.el = el
  this.list = el.classList
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name)
    return this
  }

  // fallback
  var arr = this.array()
  var i = index(arr, name)
  if (!~i) arr.push(name)
  this.el.className = arr.join(' ')
  return this
}

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function (name) {
  // classList
  if (this.list) {
    this.list.remove(name)
    return this
  }

  // fallback
  var arr = this.array()
  var i = index(arr, name)
  if (~i) arr.splice(i, 1)
  this.el.className = arr.join(' ')
  return this
}

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function (name, force) {
  // classList
  if (this.list) {
    if ('undefined' !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name) // toggle again to correct
      }
    } else {
      this.list.toggle(name)
    }
    return this
  }

  // fallback
  if ('undefined' !== typeof force) {
    if (!force) {
      this.remove(name)
    } else {
      this.add(name)
    }
  } else {
    if (this.has(name)) {
      this.remove(name)
    } else {
      this.add(name)
    }
  }

  return this
}

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function () {
  var className = this.el.getAttribute('class') || ''
  var str = className.replace(/^\s+|\s+$/g, '')
  var arr = str.split(re)
  if ('' === arr[0]) arr.shift()
  return arr
}

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = ClassList.prototype.contains = function (name) {
  return this.list ? this.list.contains(name) : !!~index(this.array(), name)
}

},{"./index-of":43}],38:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
  prefix = bind !== 'addEventListener' ? 'on' : '',
  toArray = require('./to-array')

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function (el, type, fn, capture) {
  el = toArray(el)
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][bind](prefix + type, fn, capture || false)
  }
}

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function (el, type, fn, capture) {
  el = toArray(el)
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][unbind](prefix + type, fn, capture || false)
  }
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `wait` milliseconds. If `immediate` is true, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} fn
 * @param {Integer} wait
 * @param {Boolean} immediate
 * @api public
 */

exports.debounce = function (fn, wait, immediate) {
  var timeout
  return wait
    ? function () {
        var context = this,
          args = arguments
        var later = function () {
          timeout = null
          if (!immediate) fn.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) fn.apply(context, args)
      }
    : fn
}

},{"./to-array":44}],39:[function(require,module,exports){
/*
 * Source: https://github.com/segmentio/extend
 */

module.exports = function extend(object) {
  // Takes an unlimited number of extenders.
  var args = Array.prototype.slice.call(arguments, 1)

  // For each extender, copy their properties on our object.
  for (var i = 0, source; (source = args[i]); i++) {
    if (!source) continue
    for (var property in source) {
      object[property] = source[property]
    }
  }

  return object
}

},{}],40:[function(require,module,exports){
module.exports = function (text, pattern, options) {
  // Aproximately where in the text is the pattern expected to be found?
  var Match_Location = options.location || 0

  //Determines how close the match must be to the fuzzy location (specified above). An exact letter match which is 'distance' characters away from the fuzzy location would score as a complete mismatch. A distance of '0' requires the match be at the exact location specified, a threshold of '1000' would require a perfect match to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  var Match_Distance = options.distance || 100

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match (of both letters and location), a threshold of '1.0' would match anything.
  var Match_Threshold = options.threshold || 0.4

  if (pattern === text) return true // Exact match
  if (pattern.length > 32) return false // This algorithm cannot be used

  // Set starting location at beginning text and initialise the alphabet.
  var loc = Match_Location,
    s = (function () {
      var q = {},
        i

      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] = 0
      }

      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] |= 1 << (pattern.length - i - 1)
      }

      return q
    })()

  // Compute and return the score for a match with e errors and x location.
  // Accesses loc and pattern through being a closure.

  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length,
      proximity = Math.abs(loc - x)

    if (!Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + proximity / Match_Distance
  }

  var score_threshold = Match_Threshold, // Highest score beyond which we give up.
    best_loc = text.indexOf(pattern, loc) // Is there a nearby exact match? (speedup)

  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold)
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length)

    if (best_loc != -1) {
      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold)
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1)
  best_loc = -1

  var bin_min, bin_mid
  var bin_max = pattern.length + text.length
  var last_rd
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0
    bin_mid = bin_max
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid
      } else {
        bin_max = bin_mid
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min)
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid
    var start = Math.max(1, loc - bin_mid + 1)
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length

    var rd = Array(finish + 2)
    rd[finish + 1] = (1 << d) - 1
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)]
      if (d === 0) {
        // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch
      } else {
        // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) | (((last_rd[j + 1] | last_rd[j]) << 1) | 1) | last_rd[j + 1]
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1)
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score
          best_loc = j - 1
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc)
          } else {
            // Already passed loc, downhill from here on in.
            break
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break
    }
    last_rd = rd
  }

  return best_loc < 0 ? false : true
}

},{}],41:[function(require,module,exports){
/**
 * A cross-browser implementation of getAttribute.
 * Source found here: http://stackoverflow.com/a/3755343/361337 written by Vivin Paliath
 *
 * Return the value for `attr` at `element`.
 *
 * @param {Element} el
 * @param {String} attr
 * @api public
 */

module.exports = function (el, attr) {
  var result = (el.getAttribute && el.getAttribute(attr)) || null
  if (!result) {
    var attrs = el.attributes
    var length = attrs.length
    for (var i = 0; i < length; i++) {
      if (attrs[i] !== undefined) {
        if (attrs[i].nodeName === attr) {
          result = attrs[i].nodeValue
        }
      }
    }
  }
  return result
}

},{}],42:[function(require,module,exports){
/**
 * A cross-browser implementation of getElementsByClass.
 * Heavily based on Dustin Diaz's function: http://dustindiaz.com/getelementsbyclass.
 *
 * Find all elements with class `className` inside `container`.
 * Use `single = true` to increase performance in older browsers
 * when only one element is needed.
 *
 * @param {String} className
 * @param {Element} container
 * @param {Boolean} single
 * @api public
 */

var getElementsByClassName = function (container, className, single) {
  if (single) {
    return container.getElementsByClassName(className)[0]
  } else {
    return container.getElementsByClassName(className)
  }
}

var querySelector = function (container, className, single) {
  className = '.' + className
  if (single) {
    return container.querySelector(className)
  } else {
    return container.querySelectorAll(className)
  }
}

var polyfill = function (container, className, single) {
  var classElements = [],
    tag = '*'

  var els = container.getElementsByTagName(tag)
  var elsLen = els.length
  var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)')
  for (var i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      if (single) {
        return els[i]
      } else {
        classElements[j] = els[i]
        j++
      }
    }
  }
  return classElements
}

module.exports = (function () {
  return function (container, className, single, options) {
    options = options || {}
    if ((options.test && options.getElementsByClassName) || (!options.test && document.getElementsByClassName)) {
      return getElementsByClassName(container, className, single)
    } else if ((options.test && options.querySelector) || (!options.test && document.querySelector)) {
      return querySelector(container, className, single)
    } else {
      return polyfill(container, className, single)
    }
  }
})()

},{}],43:[function(require,module,exports){
var indexOf = [].indexOf

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0, il = arr.length; i < il; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1
}

},{}],44:[function(require,module,exports){
/**
 * Source: https://github.com/timoxley/to-array
 *
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api public
 */

module.exports = function toArray(collection) {
  if (typeof collection === 'undefined') return []
  if (collection === null) return [null]
  if (collection === window) return [window]
  if (typeof collection === 'string') return [collection]
  if (isArray(collection)) return collection
  if (typeof collection.length != 'number') return [collection]
  if (typeof collection === 'function' && collection instanceof Function) return [collection]

  var arr = [];
  for (var i = 0, il = collection.length; i < il; i++) {
    if (Object.prototype.hasOwnProperty.call(collection, i) || i in collection) {
      arr.push(collection[i])
    }
  }
  if (!arr.length) return []
  return arr
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

},{}],45:[function(require,module,exports){
module.exports = function (s) {
  s = s === undefined ? '' : s
  s = s === null ? '' : s
  s = s.toString()
  return s
}

},{}],46:[function(require,module,exports){
//! moment.js
//! version : 2.29.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i,
            arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i,
            prop,
            val,
            momentPropertiesLen = momentProperties.length;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentPropertiesLen > 0) {
            for (i = 0; i < momentPropertiesLen; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key,
                    argLen = arguments.length;
                for (i = 0; i < argLen; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens =
            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i,
                prioritizedLen = prioritized.length;
            for (i = 0; i < prioritizedLen; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord =
            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(
                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                    function (matched, p1, p2, p3, p4) {
                        return p1 || p2 || p3 || p4;
                    }
                )
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback,
            tokenLen;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        tokenLen = token.length;
        for (i = 0; i < tokenLen; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths =
            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                '_'
            ),
        defaultLocaleMonthsShort =
            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(
        ['w', 'ww', 'W', 'WW'],
        function (input, week, config, token) {
            week[token.substr(0, 1)] = toInt(input);
        }
    );

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays =
            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function isLocaleNameSane(name) {
        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
        return name.match('^[^/\\\\]*$') != null;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports &&
            isLocaleNameSane(name)
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 =
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat,
            isoDatesLen = isoDates.length,
            isoTimesLen = isoTimes.length;

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDatesLen; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimesLen; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^()]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era,
            tokenLen;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens.length;
        for (i = 0; i < tokenLen; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false,
            configfLen = config._f.length;

        if (configfLen === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < configfLen; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i,
            orderLen = ordering.length;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < orderLen; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex =
            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property,
            propertyLen = properties.length;

        for (i = 0; i < propertyLen; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(
        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
        function (input, array, config, token) {
            var era = config._locale.erasParse(input, token, config._strict);
            if (era) {
                getParsingFlags(config).era = era;
            } else {
                getParsingFlags(config).invalidEra = input;
            }
        }
    );

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(
        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
        function (input, week, config, token) {
            week[token.substr(0, 2)] = toInt(input);
        }
    );

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.4';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],47:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.2';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));

},{}],48:[function(require,module,exports){
(function (global){(function (){
!function r(s,a,l){function u(e,t){if(!a[e]){if(!s[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(c)return c(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var o=a[e]={exports:{}};s[e][0].call(o.exports,function(t){return u(s[e][1][t]||t)},o,o.exports,r,s,a,l)}return a[e].exports}for(var c="function"==typeof require&&require,t=0;t<l.length;t++)u(l[t]);return u}({1:[function(o,r,s){"use strict";function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(t,e){if("object"===(void 0===s?"undefined":y(s))&&"object"===(void 0===r?"undefined":y(r)))r.exports=e(o("jquery"));else if("function"==typeof define&&define.amd)define(["jquery"],e);else{var n,i="object"===(void 0===s?"undefined":y(s))?e(o("jquery")):e(t.jQuery);for(n in i)("object"===(void 0===s?"undefined":y(s))?s:t)[n]=i[n]}}(window,function(e){return i={},o.m=n={"./js/entries/foundation.js":function(t,e,n){n.r(e);var i=n("jquery"),o=n.n(i),r=n("./js/foundation.core.js");n.d(e,"Foundation",function(){return r.Foundation});var s=n("./js/foundation.core.utils.js");n.d(e,"CoreUtils",function(){return s});var a=n("./js/foundation.util.box.js");n.d(e,"Box",function(){return a.Box});var l=n("./js/foundation.util.imageLoader.js");n.d(e,"onImagesLoaded",function(){return l.onImagesLoaded});var u=n("./js/foundation.util.keyboard.js");n.d(e,"Keyboard",function(){return u.Keyboard});var c=n("./js/foundation.util.mediaQuery.js");n.d(e,"MediaQuery",function(){return c.MediaQuery});var f=n("./js/foundation.util.motion.js");n.d(e,"Motion",function(){return f.Motion});var d=n("./js/foundation.util.nest.js");n.d(e,"Nest",function(){return d.Nest});var h=n("./js/foundation.util.timer.js");n.d(e,"Timer",function(){return h.Timer});var p=n("./js/foundation.util.touch.js");n.d(e,"Touch",function(){return p.Touch});var g=n("./js/foundation.util.triggers.js");n.d(e,"Triggers",function(){return g.Triggers});var m=n("./js/foundation.abide.js");n.d(e,"Abide",function(){return m.Abide});var v=n("./js/foundation.accordion.js");n.d(e,"Accordion",function(){return v.Accordion});var y=n("./js/foundation.accordionMenu.js");n.d(e,"AccordionMenu",function(){return y.AccordionMenu});var b=n("./js/foundation.drilldown.js");n.d(e,"Drilldown",function(){return b.Drilldown});var w=n("./js/foundation.dropdown.js");n.d(e,"Dropdown",function(){return w.Dropdown});var k=n("./js/foundation.dropdownMenu.js");n.d(e,"DropdownMenu",function(){return k.DropdownMenu});var _=n("./js/foundation.equalizer.js");n.d(e,"Equalizer",function(){return _.Equalizer});var $=n("./js/foundation.interchange.js");n.d(e,"Interchange",function(){return $.Interchange});var j=n("./js/foundation.magellan.js");n.d(e,"Magellan",function(){return j.Magellan});var C=n("./js/foundation.offcanvas.js");n.d(e,"OffCanvas",function(){return C.OffCanvas});var x=n("./js/foundation.orbit.js");n.d(e,"Orbit",function(){return x.Orbit});var T=n("./js/foundation.responsiveMenu.js");n.d(e,"ResponsiveMenu",function(){return T.ResponsiveMenu});var O=n("./js/foundation.responsiveToggle.js");n.d(e,"ResponsiveToggle",function(){return O.ResponsiveToggle});var S=n("./js/foundation.reveal.js");n.d(e,"Reveal",function(){return S.Reveal});var z=n("./js/foundation.slider.js");n.d(e,"Slider",function(){return z.Slider});var E=n("./js/foundation.smoothScroll.js");n.d(e,"SmoothScroll",function(){return E.SmoothScroll});var A=n("./js/foundation.sticky.js");n.d(e,"Sticky",function(){return A.Sticky});var P=n("./js/foundation.tabs.js");n.d(e,"Tabs",function(){return P.Tabs});var L=n("./js/foundation.toggler.js");n.d(e,"Toggler",function(){return L.Toggler});var D=n("./js/foundation.tooltip.js");n.d(e,"Tooltip",function(){return D.Tooltip});var M=n("./js/foundation.responsiveAccordionTabs.js");n.d(e,"ResponsiveAccordionTabs",function(){return M.ResponsiveAccordionTabs}),r.Foundation.addToJquery(o.a),r.Foundation.rtl=s.rtl,r.Foundation.GetYoDigits=s.GetYoDigits,r.Foundation.transitionend=s.transitionend,r.Foundation.RegExpEscape=s.RegExpEscape,r.Foundation.onLoad=s.onLoad,r.Foundation.Box=a.Box,r.Foundation.onImagesLoaded=l.onImagesLoaded,r.Foundation.Keyboard=u.Keyboard,r.Foundation.MediaQuery=c.MediaQuery,r.Foundation.Motion=f.Motion,r.Foundation.Move=f.Move,r.Foundation.Nest=d.Nest,r.Foundation.Timer=h.Timer,p.Touch.init(o.a),g.Triggers.init(o.a,r.Foundation),c.MediaQuery._init(),r.Foundation.plugin(m.Abide,"Abide"),r.Foundation.plugin(v.Accordion,"Accordion"),r.Foundation.plugin(y.AccordionMenu,"AccordionMenu"),r.Foundation.plugin(b.Drilldown,"Drilldown"),r.Foundation.plugin(w.Dropdown,"Dropdown"),r.Foundation.plugin(k.DropdownMenu,"DropdownMenu"),r.Foundation.plugin(_.Equalizer,"Equalizer"),r.Foundation.plugin($.Interchange,"Interchange"),r.Foundation.plugin(j.Magellan,"Magellan"),r.Foundation.plugin(C.OffCanvas,"OffCanvas"),r.Foundation.plugin(x.Orbit,"Orbit"),r.Foundation.plugin(T.ResponsiveMenu,"ResponsiveMenu"),r.Foundation.plugin(O.ResponsiveToggle,"ResponsiveToggle"),r.Foundation.plugin(S.Reveal,"Reveal"),r.Foundation.plugin(z.Slider,"Slider"),r.Foundation.plugin(E.SmoothScroll,"SmoothScroll"),r.Foundation.plugin(A.Sticky,"Sticky"),r.Foundation.plugin(P.Tabs,"Tabs"),r.Foundation.plugin(L.Toggler,"Toggler"),r.Foundation.plugin(D.Tooltip,"Tooltip"),r.Foundation.plugin(M.ResponsiveAccordionTabs,"ResponsiveAccordionTabs"),e.default=r.Foundation},"./js/foundation.abide.js":function(t,e,n){n.r(e),n.d(e,"Abide",function(){return d});var i=n("jquery"),f=n.n(i),o=n("./js/foundation.core.plugin.js"),s=n("./js/foundation.core.utils.js");function r(t){return(r="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function a(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function l(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var d=function(){function i(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),l(this,u(i).apply(this,arguments))}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(i,o["Plugin"]),t=i,(e=[{key:"_setup",value:function(t,e){var n=1<arguments.length&&void 0!==e?e:{};this.$element=t,this.options=f.a.extend(!0,{},i.defaults,this.$element.data(),n),this.isEnabled=!0,this.formnovalidate=null,this.className="Abide",this._init()}},{key:"_init",value:function(){var n=this;this.$inputs=f.a.merge(this.$element.find("input").not('[type="submit"]'),this.$element.find("textarea, select")),this.$submits=this.$element.find('[type="submit"]');var t=this.$element.find("[data-abide-error]");this.options.a11yAttributes&&(this.$inputs.each(function(t,e){return n.addA11yAttributes(f()(e))}),t.each(function(t,e){return n.addGlobalErrorA11yAttributes(f()(e))})),this._events()}},{key:"_events",value:function(){var e=this;this.$element.off(".abide").on("reset.zf.abide",function(){e.resetForm()}).on("submit.zf.abide",function(){return e.validateForm()}),this.$submits.off("click.zf.abide keydown.zf.abide").on("click.zf.abide keydown.zf.abide",function(t){t.key&&" "!==t.key&&"Enter"!==t.key||(t.preventDefault(),e.formnovalidate=null!==t.target.getAttribute("formnovalidate"),e.$element.submit())}),"fieldChange"===this.options.validateOn&&this.$inputs.off("change.zf.abide").on("change.zf.abide",function(t){e.validateInput(f()(t.target))}),this.options.liveValidate&&this.$inputs.off("input.zf.abide").on("input.zf.abide",function(t){e.validateInput(f()(t.target))}),this.options.validateOnBlur&&this.$inputs.off("blur.zf.abide").on("blur.zf.abide",function(t){e.validateInput(f()(t.target))})}},{key:"_reflow",value:function(){this._init()}},{key:"_validationIsDisabled",value:function(){return!1===this.isEnabled||("boolean"==typeof this.formnovalidate?this.formnovalidate:!!this.$submits.length&&null!==this.$submits[0].getAttribute("formnovalidate"))}},{key:"enableValidation",value:function(){this.isEnabled=!0}},{key:"disableValidation",value:function(){this.isEnabled=!1}},{key:"requiredCheck",value:function(t){if(!t.attr("required"))return!0;var e=!0;switch(t[0].type){case"checkbox":e=t[0].checked;break;case"select":case"select-one":case"select-multiple":var n=t.find("option:selected");n.length&&n.val()||(e=!1);break;default:t.val()&&t.val().length||(e=!1)}return e}},{key:"findFormError",value:function(e,t){var n=this,i=e.length?e[0].id:"",o=e.siblings(this.options.formErrorSelector);return o.length||(o=e.parent().find(this.options.formErrorSelector)),i&&(o=o.add(this.$element.find('[data-form-error-for="'.concat(i,'"]')))),t&&(o=o.not("[data-form-error-on]"),t.forEach(function(t){o=(o=o.add(e.siblings('[data-form-error-on="'.concat(t,'"]')))).add(n.$element.find('[data-form-error-for="'.concat(i,'"][data-form-error-on="').concat(t,'"]')))})),o}},{key:"findLabel",value:function(t){var e=t[0].id,n=this.$element.find('label[for="'.concat(e,'"]'));return n.length?n:t.closest("label")}},{key:"findRadioLabels",value:function(t){var o=this,e=t.map(function(t,e){var n=e.id,i=o.$element.find('label[for="'.concat(n,'"]'));return i.length||(i=f()(e).closest("label")),i[0]});return f()(e)}},{key:"findCheckboxLabels",value:function(t){var o=this,e=t.map(function(t,e){var n=e.id,i=o.$element.find('label[for="'.concat(n,'"]'));return i.length||(i=f()(e).closest("label")),i[0]});return f()(e)}},{key:"addErrorClasses",value:function(t,e){var n=this.findLabel(t),i=this.findFormError(t,e);n.length&&n.addClass(this.options.labelErrorClass),i.length&&i.addClass(this.options.formErrorClass),t.addClass(this.options.inputErrorClass).attr({"data-invalid":"","aria-invalid":!0})}},{key:"addA11yAttributes",value:function(t){var e,i,n=this.findFormError(t),o=n.filter("label"),r=n.first();n.length&&(void 0===t.attr("aria-describedby")&&(void 0===(e=r.attr("id"))&&(e=Object(s.GetYoDigits)(6,"abide-error"),r.attr("id",e)),t.attr("aria-describedby",e)),o.filter("[for]").length<o.length&&(void 0===(i=t.attr("id"))&&(i=Object(s.GetYoDigits)(6,"abide-input"),t.attr("id",i)),o.each(function(t,e){var n=f()(e);void 0===n.attr("for")&&n.attr("for",i)})),n.each(function(t,e){var n=f()(e);void 0===n.attr("role")&&n.attr("role","alert")}).end())}},{key:"addGlobalErrorA11yAttributes",value:function(t){void 0===t.attr("aria-live")&&t.attr("aria-live",this.options.a11yErrorLevel)}},{key:"removeRadioErrorClasses",value:function(t){var e=this.$element.find(':radio[name="'.concat(t,'"]')),n=this.findRadioLabels(e),i=this.findFormError(e);n.length&&n.removeClass(this.options.labelErrorClass),i.length&&i.removeClass(this.options.formErrorClass),e.removeClass(this.options.inputErrorClass).attr({"data-invalid":null,"aria-invalid":null})}},{key:"removeCheckboxErrorClasses",value:function(t){var e=this.$element.find(':checkbox[name="'.concat(t,'"]')),n=this.findCheckboxLabels(e),i=this.findFormError(e);n.length&&n.removeClass(this.options.labelErrorClass),i.length&&i.removeClass(this.options.formErrorClass),e.removeClass(this.options.inputErrorClass).attr({"data-invalid":null,"aria-invalid":null})}},{key:"removeErrorClasses",value:function(t){if("radio"==t[0].type)return this.removeRadioErrorClasses(t.attr("name"));if("checkbox"==t[0].type)return this.removeCheckboxErrorClasses(t.attr("name"));var e=this.findLabel(t),n=this.findFormError(t);e.length&&e.removeClass(this.options.labelErrorClass),n.length&&n.removeClass(this.options.formErrorClass),t.removeClass(this.options.inputErrorClass).attr({"data-invalid":null,"aria-invalid":null})}},{key:"validateInput",value:function(e){var n,i=this,t=this.requiredCheck(e),o=e.attr("data-validator"),r=[],s=!0;if(this._validationIsDisabled())return!0;if(e.is("[data-abide-ignore]")||e.is('[type="hidden"]')||e.is("[disabled]"))return!0;switch(e[0].type){case"radio":this.validateRadio(e.attr("name"))||r.push("required");break;case"checkbox":this.validateCheckbox(e.attr("name"))||r.push("required"),s=!1;break;case"select":case"select-one":case"select-multiple":t||r.push("required");break;default:t||r.push("required"),this.validateText(e)||r.push("pattern")}o&&(n=!!e.attr("required"),o.split(" ").forEach(function(t){i.options.validators[t](e,n,e.parent())||r.push(t)})),e.attr("data-equalto")&&(this.options.validators.equalTo(e)||r.push("equalTo"));var a,l,u=0===r.length,c=(u?"valid":"invalid")+".zf.abide";return!u||(a=this.$element.find('[data-equalto="'.concat(e.attr("id"),'"]'))).length&&(l=this,a.each(function(){f()(this).val()&&l.validateInput(f()(this))})),s&&(this.removeErrorClasses(e),u||this.addErrorClasses(e,r)),e.trigger(c,[e]),u}},{key:"validateForm",value:function(){var t,i=this,e=[],n=this;if(this.initialized||(this.initialized=!0),this._validationIsDisabled())return!(this.formnovalidate=null);this.$inputs.each(function(){if("checkbox"===f()(this)[0].type){if(f()(this).attr("name")===t)return!0;t=f()(this).attr("name")}e.push(n.validateInput(f()(this)))});var o=-1===e.indexOf(!1);return this.$element.find("[data-abide-error]").each(function(t,e){var n=f()(e);i.options.a11yAttributes&&i.addGlobalErrorA11yAttributes(n),n.css("display",o?"none":"block")}),this.$element.trigger((o?"formvalid":"forminvalid")+".zf.abide",[this.$element]),o}},{key:"validateText",value:function(t,e){e=e||t.attr("data-pattern")||t.attr("pattern")||t.attr("type");var n=t.val(),i=!0;return n.length&&(this.options.patterns.hasOwnProperty(e)?i=this.options.patterns[e].test(n):e!==t.attr("type")&&(i=new RegExp(e).test(n))),i}},{key:"validateRadio",value:function(t){var e=this.$element.find(':radio[name="'.concat(t,'"]')),n=!1,i=!1;return e.each(function(t,e){f()(e).attr("required")&&(i=!0)}),i||(n=!0),n||e.each(function(t,e){f()(e).prop("checked")&&(n=!0)}),n}},{key:"validateCheckbox",value:function(t){var n=this,e=this.$element.find(':checkbox[name="'.concat(t,'"]')),i=!1,o=!1,r=1,s=0;return e.each(function(t,e){f()(e).attr("required")&&(o=!0)}),o||(i=!0),i||(e.each(function(t,e){f()(e).prop("checked")&&s++,void 0!==f()(e).attr("data-min-required")&&(r=parseInt(f()(e).attr("data-min-required")))}),r<=s&&(i=!0)),!0!==this.initialized&&1<r||(e.each(function(t,e){i?n.removeErrorClasses(f()(e)):n.addErrorClasses(f()(e),["required"])}),i)}},{key:"matchValidation",value:function(e,t,n){var i=this;return n=!!n,-1===t.split(" ").map(function(t){return i.options.validators[t](e,n,e.parent())}).indexOf(!1)}},{key:"resetForm",value:function(){var t=this.$element,e=this.options;f()(".".concat(e.labelErrorClass),t).not("small").removeClass(e.labelErrorClass),f()(".".concat(e.inputErrorClass),t).not("small").removeClass(e.inputErrorClass),f()("".concat(e.formErrorSelector,".").concat(e.formErrorClass)).removeClass(e.formErrorClass),t.find("[data-abide-error]").css("display","none"),f()(":input",t).not(":button, :submit, :reset, :hidden, :radio, :checkbox, [data-abide-ignore]").val("").attr({"data-invalid":null,"aria-invalid":null}),f()(":input:radio",t).not("[data-abide-ignore]").prop("checked",!1).attr({"data-invalid":null,"aria-invalid":null}),f()(":input:checkbox",t).not("[data-abide-ignore]").prop("checked",!1).attr({"data-invalid":null,"aria-invalid":null}),t.trigger("formreset.zf.abide",[t])}},{key:"_destroy",value:function(){var t=this;this.$element.off(".abide").find("[data-abide-error]").css("display","none"),this.$inputs.off(".abide").each(function(){t.removeErrorClasses(f()(this))}),this.$submits.off(".abide")}}])&&a(t.prototype,e),n&&a(t,n),i}();d.defaults={validateOn:"fieldChange",labelErrorClass:"is-invalid-label",inputErrorClass:"is-invalid-input",formErrorSelector:".form-error",formErrorClass:"is-visible",a11yAttributes:!0,a11yErrorLevel:"assertive",liveValidate:!1,validateOnBlur:!1,patterns:{alpha:/^[a-zA-Z]+$/,alpha_numeric:/^[a-zA-Z0-9]+$/,integer:/^[-+]?\d+$/,number:/^[-+]?\d*(?:[\.\,]\d+)?$/,card:/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(?:222[1-9]|2[3-6][0-9]{2}|27[0-1][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,cvv:/^([0-9]){3,4}$/,email:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,url:/^((?:(https?|ftps?|file|ssh|sftp):\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))$/,domain:/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,datetime:/^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,date:/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,time:/^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,dateISO:/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,month_day_year:/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,day_month_year:/^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,color:/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,website:{test:function(t){return d.defaults.patterns.domain.test(t)||d.defaults.patterns.url.test(t)}}},validators:{equalTo:function(t){return f()("#".concat(t.attr("data-equalto"))).val()===t.val()}}}},"./js/foundation.accordion.js":function(t,e,n){n.r(e),n.d(e,"Accordion",function(){return h});var i=n("jquery"),s=n.n(i),o=n("./js/foundation.core.plugin.js"),a=n("./js/foundation.core.utils.js"),r=n("./js/foundation.util.keyboard.js");function l(t){return(l="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var h=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),c(this,f(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=s.a.extend({},n.defaults,this.$element.data(),e),this.className="Accordion",this._init(),r.Keyboard.register("Accordion",{ENTER:"toggle",SPACE:"toggle",ARROW_DOWN:"next",ARROW_UP:"previous"})}},{key:"_init",value:function(){var i=this;this._isInitializing=!0,this.$element.attr("role","tablist"),this.$tabs=this.$element.children("[data-accordion-item]"),this.$tabs.attr({role:"presentation"}),this.$tabs.each(function(t,e){var n=s()(e),i=n.children("[data-tab-content]"),o=i[0].id||Object(a.GetYoDigits)(6,"accordion"),r=e.id?"".concat(e.id,"-label"):"".concat(o,"-label");n.find("a:first").attr({"aria-controls":o,role:"tab",id:r,"aria-expanded":!1,"aria-selected":!1}),i.attr({role:"tabpanel","aria-labelledby":r,"aria-hidden":!0,id:o})});var t=this.$element.find(".is-active").children("[data-tab-content]");t.length&&(this._initialAnchor=t.prev("a").attr("href"),this._openSingleTab(t)),this._checkDeepLink=function(){var t=window.location.hash;if(!t.length){if(i._isInitializing)return;i._initialAnchor&&(t=i._initialAnchor)}var e=t&&s()(t),n=t&&i.$element.find('[href$="'.concat(t,'"]'));!e.length||!n.length||(e&&n&&n.length?n.parent("[data-accordion-item]").hasClass("is-active")||i._openSingleTab(e):i._closeAllTabs(),i.options.deepLinkSmudge&&Object(a.onLoad)(s()(window),function(){var t=i.$element.offset();s()("html, body").animate({scrollTop:t.top-i.options.deepLinkSmudgeOffset},i.options.deepLinkSmudgeDelay)}),i.$element.trigger("deeplink.zf.accordion",[n,e]))},this.options.deepLink&&this._checkDeepLink(),this._events(),this._isInitializing=!1}},{key:"_events",value:function(){var i=this;this.$tabs.each(function(){var e=s()(this),n=e.children("[data-tab-content]");n.length&&e.children("a").off("click.zf.accordion keydown.zf.accordion").on("click.zf.accordion",function(t){t.preventDefault(),i.toggle(n)}).on("keydown.zf.accordion",function(t){r.Keyboard.handleKey(t,"Accordion",{toggle:function(){i.toggle(n)},next:function(){var t=e.next().find("a").focus();i.options.multiExpand||t.trigger("click.zf.accordion")},previous:function(){var t=e.prev().find("a").focus();i.options.multiExpand||t.trigger("click.zf.accordion")},handled:function(){t.preventDefault()}})})}),this.options.deepLink&&s()(window).on("hashchange",this._checkDeepLink)}},{key:"toggle",value:function(t){var e;t.closest("[data-accordion]").is("[disabled]")?console.info("Cannot toggle an accordion that is disabled."):(t.parent().hasClass("is-active")?this.up(t):this.down(t),this.options.deepLink&&(e=t.prev("a").attr("href"),this.options.updateHistory?history.pushState({},"",e):history.replaceState({},"",e)))}},{key:"down",value:function(t){t.closest("[data-accordion]").is("[disabled]")?console.info("Cannot call down on an accordion that is disabled."):this.options.multiExpand?this._openTab(t):this._openSingleTab(t)}},{key:"up",value:function(t){var e,n;this.$element.is("[disabled]")?console.info("Cannot call up on an accordion that is disabled."):(e=t.parent()).hasClass("is-active")&&(n=e.siblings(),(this.options.allowAllClosed||n.hasClass("is-active"))&&this._closeTab(t))}},{key:"_openSingleTab",value:function(t){var e=this.$element.children(".is-active").children("[data-tab-content]");e.length&&this._closeTab(e.not(t)),this._openTab(t)}},{key:"_openTab",value:function(t){var e=this,n=t.parent(),i=t.attr("aria-labelledby");t.attr("aria-hidden",!1),n.addClass("is-active"),s()("#".concat(i)).attr({"aria-expanded":!0,"aria-selected":!0}),t.finish().slideDown(this.options.slideSpeed,function(){e.$element.trigger("down.zf.accordion",[t])})}},{key:"_closeTab",value:function(t){var e=this,n=t.parent(),i=t.attr("aria-labelledby");t.attr("aria-hidden",!0),n.removeClass("is-active"),s()("#".concat(i)).attr({"aria-expanded":!1,"aria-selected":!1}),t.finish().slideUp(this.options.slideSpeed,function(){e.$element.trigger("up.zf.accordion",[t])})}},{key:"_closeAllTabs",value:function(){var t=this.$element.children(".is-active").children("[data-tab-content]");t.length&&this._closeTab(t)}},{key:"_destroy",value:function(){this.$element.find("[data-tab-content]").stop(!0).slideUp(0).css("display",""),this.$element.find("a").off(".zf.accordion"),this.options.deepLink&&s()(window).off("hashchange",this._checkDeepLink)}}])&&u(t.prototype,e),i&&u(t,i),n}();h.defaults={slideSpeed:250,multiExpand:!1,allowAllClosed:!1,deepLink:!1,deepLinkSmudge:!1,deepLinkSmudgeDelay:300,deepLinkSmudgeOffset:0,updateHistory:!1}},"./js/foundation.accordionMenu.js":function(t,e,n){n.r(e),n.d(e,"AccordionMenu",function(){return p});var i=n("jquery"),a=n.n(i),l=n("./js/foundation.util.keyboard.js"),o=n("./js/foundation.util.nest.js"),s=n("./js/foundation.core.utils.js"),r=n("./js/foundation.core.plugin.js");function u(t){return(u="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,r["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=a.a.extend({},n.defaults,this.$element.data(),e),this.className="AccordionMenu",this._init(),l.Keyboard.register("AccordionMenu",{ENTER:"toggle",SPACE:"toggle",ARROW_RIGHT:"open",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"close",ESCAPE:"closeAll"})}},{key:"_init",value:function(){o.Nest.Feather(this.$element,"accordion");var r=this;this.$element.find("[data-submenu]").not(".is-active").slideUp(0),this.$element.attr({role:"tree","aria-multiselectable":this.options.multiOpen}),this.$menuLinks=this.$element.find(".is-accordion-submenu-parent"),this.$menuLinks.each(function(){var t=this.id||Object(s.GetYoDigits)(6,"acc-menu-link"),e=a()(this),n=e.children("[data-submenu]"),i=n[0].id||Object(s.GetYoDigits)(6,"acc-menu"),o=n.hasClass("is-active");r.options.parentLink&&e.children("a").clone().prependTo(n).wrap('<li data-is-parent-link class="is-submenu-parent-item is-submenu-item is-accordion-submenu-item"></li>'),r.options.submenuToggle?(e.addClass("has-submenu-toggle"),e.children("a").after('<button id="'+t+'" class="submenu-toggle" aria-controls="'+i+'" aria-expanded="'+o+'" title="'+r.options.submenuToggleText+'"><span class="submenu-toggle-text">'+r.options.submenuToggleText+"</span></button>")):e.attr({"aria-controls":i,"aria-expanded":o,id:t}),n.attr({"aria-labelledby":t,"aria-hidden":!o,role:"group",id:i})}),this.$element.find("li").attr({role:"treeitem"});var t=this.$element.find(".is-active");t.length&&t.each(function(){r.down(a()(this))}),this._events()}},{key:"_events",value:function(){var s=this;this.$element.find("li").each(function(){var e=a()(this).children("[data-submenu]");e.length&&(s.options.submenuToggle?a()(this).children(".submenu-toggle").off("click.zf.accordionMenu").on("click.zf.accordionMenu",function(t){s.toggle(e)}):a()(this).children("a").off("click.zf.accordionMenu").on("click.zf.accordionMenu",function(t){t.preventDefault(),s.toggle(e)}))}).on("keydown.zf.accordionMenu",function(e){var n,i,o=a()(this),r=o.parent("ul").children("li"),t=o.children("[data-submenu]");r.each(function(t){if(a()(this).is(o))return n=r.eq(Math.max(0,t-1)).find("a").first(),i=r.eq(Math.min(t+1,r.length-1)).find("a").first(),a()(this).children("[data-submenu]:visible").length&&(i=o.find("li:first-child").find("a").first()),a()(this).is(":first-child")?n=o.parents("li").first().find("a").first():n.parents("li").first().children("[data-submenu]:visible").length&&(n=n.parents("li").find("li:last-child").find("a").first()),void(a()(this).is(":last-child")&&(i=o.parents("li").first().next("li").find("a").first()))}),l.Keyboard.handleKey(e,"AccordionMenu",{open:function(){t.is(":hidden")&&(s.down(t),t.find("li").first().find("a").first().focus())},close:function(){t.length&&!t.is(":hidden")?s.up(t):o.parent("[data-submenu]").length&&(s.up(o.parent("[data-submenu]")),o.parents("li").first().find("a").first().focus())},up:function(){return n.focus(),!0},down:function(){return i.focus(),!0},toggle:function(){return!s.options.submenuToggle&&(o.children("[data-submenu]").length?(s.toggle(o.children("[data-submenu]")),!0):void 0)},closeAll:function(){s.hideAll()},handled:function(t){t&&e.preventDefault()}})})}},{key:"hideAll",value:function(){this.up(this.$element.find("[data-submenu]"))}},{key:"showAll",value:function(){this.down(this.$element.find("[data-submenu]"))}},{key:"toggle",value:function(t){t.is(":animated")||(t.is(":hidden")?this.down(t):this.up(t))}},{key:"down",value:function(t){var e,n,i=this;this.options.multiOpen||(e=t.parentsUntil(this.$element).add(t).add(t.find(".is-active")),n=this.$element.find(".is-active").not(e),this.up(n)),t.addClass("is-active").attr({"aria-hidden":!1}),this.options.submenuToggle?t.prev(".submenu-toggle").attr({"aria-expanded":!0}):t.parent(".is-accordion-submenu-parent").attr({"aria-expanded":!0}),t.slideDown(this.options.slideSpeed,function(){i.$element.trigger("down.zf.accordionMenu",[t])})}},{key:"up",value:function(t){var e=this,n=t.find("[data-submenu]"),i=t.add(n);n.slideUp(0),i.removeClass("is-active").attr("aria-hidden",!0),this.options.submenuToggle?i.prev(".submenu-toggle").attr("aria-expanded",!1):i.parent(".is-accordion-submenu-parent").attr("aria-expanded",!1),t.slideUp(this.options.slideSpeed,function(){e.$element.trigger("up.zf.accordionMenu",[t])})}},{key:"_destroy",value:function(){this.$element.find("[data-submenu]").slideDown(0).css("display",""),this.$element.find("a").off("click.zf.accordionMenu"),this.$element.find("[data-is-parent-link]").detach(),this.options.submenuToggle&&(this.$element.find(".has-submenu-toggle").removeClass("has-submenu-toggle"),this.$element.find(".submenu-toggle").remove()),o.Nest.Burn(this.$element,"accordion")}}])&&c(t.prototype,e),i&&c(t,i),n}();p.defaults={parentLink:!1,slideSpeed:250,submenuToggle:!1,submenuToggleText:"Toggle menu",multiOpen:!0}},"./js/foundation.core.js":function(t,e,n){n.r(e),n.d(e,"Foundation",function(){return l});var i=n("jquery"),r=n.n(i),o=n("./js/foundation.core.utils.js"),s=n("./js/foundation.util.mediaQuery.js");function a(t){return(a="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}var l={version:"6.6.3",_plugins:{},_uuids:[],plugin:function(t,e){var n=e||u(t),i=c(n);this._plugins[i]=this[n]=t},registerPlugin:function(t,e){var n=e?c(e):u(t.constructor).toLowerCase();t.uuid=Object(o.GetYoDigits)(6,n),t.$element.attr("data-".concat(n))||t.$element.attr("data-".concat(n),t.uuid),t.$element.data("zfPlugin")||t.$element.data("zfPlugin",t),t.$element.trigger("init.zf.".concat(n)),this._uuids.push(t.uuid)},unregisterPlugin:function(t){var e,n=c(u(t.$element.data("zfPlugin").constructor));for(e in this._uuids.splice(this._uuids.indexOf(t.uuid),1),t.$element.removeAttr("data-".concat(n)).removeData("zfPlugin").trigger("destroyed.zf.".concat(n)),t)t[e]=null},reInit:function(t){var e,n,i=t instanceof r.a;try{i?t.each(function(){r()(this).data("zfPlugin")._init()}):(e=a(t),n=this,{object:function(t){t.forEach(function(t){t=c(t),r()("[data-"+t+"]").foundation("_init")})},string:function(){t=c(t),r()("[data-"+t+"]").foundation("_init")},undefined:function(){this.object(Object.keys(n._plugins))}}[e](t))}catch(t){console.error(t)}finally{return t}},reflow:function(i,t){void 0===t?t=Object.keys(this._plugins):"string"==typeof t&&(t=[t]);var o=this;r.a.each(t,function(t,e){var n=o._plugins[e];r()(i).find("[data-"+e+"]").addBack("[data-"+e+"]").filter(function(){return void 0===r()(this).data("zfPlugin")}).each(function(){var t=r()(this),i={reflow:!0};t.attr("data-options")&&t.attr("data-options").split(";").forEach(function(t,e){var n=t.split(":").map(function(t){return t.trim()});n[0]&&(i[n[0]]=function(t){{if("true"===t)return!0;if("false"===t)return!1;if(!isNaN(+t))return parseFloat(t)}return t}(n[1]))});try{t.data("zfPlugin",new n(r()(this),i))}catch(t){console.error(t)}finally{return}})})},getFnName:u,addToJquery:function(r){return r.fn.foundation=function(n){var t=a(n),e=r(".no-js");if(e.length&&e.removeClass("no-js"),"undefined"===t)s.MediaQuery._init(),l.reflow(this);else{if("string"!==t)throw new TypeError("We're sorry, ".concat(t," is not a valid parameter. You must use a string representing the method you wish to invoke."));var i=Array.prototype.slice.call(arguments,1),o=this.data("zfPlugin");if(void 0===o||void 0===o[n])throw new ReferenceError("We're sorry, '"+n+"' is not an available method for "+(o?u(o):"this element")+".");1===this.length?o[n].apply(o,i):this.each(function(t,e){o[n].apply(r(e).data("zfPlugin"),i)})}return this},r}};function u(t){if(void 0!==Function.prototype.name)return void 0===t.prototype?t.constructor.name:t.prototype.constructor.name;var e=/function\s([^(]{1,})\(/.exec(t.toString());return e&&1<e.length?e[1].trim():""}function c(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}l.util={throttle:function(n,i){var o=null;return function(){var t=this,e=arguments;null===o&&(o=setTimeout(function(){n.apply(t,e),o=null},i))}}},window.Foundation=l,function(){Date.now&&window.Date.now||(window.Date.now=Date.now=function(){return(new Date).getTime()});for(var i,t=["webkit","moz"],e=0;e<t.length&&!window.requestAnimationFrame;++e){var n=t[e];window.requestAnimationFrame=window[n+"RequestAnimationFrame"],window.cancelAnimationFrame=window[n+"CancelAnimationFrame"]||window[n+"CancelRequestAnimationFrame"]}!/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)&&window.requestAnimationFrame&&window.cancelAnimationFrame||(i=0,window.requestAnimationFrame=function(t){var e=Date.now(),n=Math.max(i+16,e);return setTimeout(function(){t(i=n)},n-e)},window.cancelAnimationFrame=clearTimeout),window.performance&&window.performance.now||(window.performance={start:Date.now(),now:function(){return Date.now()-this.start}})}(),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");function e(){}function n(){return o.apply(this instanceof e?this:t,i.concat(Array.prototype.slice.call(arguments)))}var i=Array.prototype.slice.call(arguments,1),o=this;return this.prototype&&(e.prototype=this.prototype),n.prototype=new e,n})},"./js/foundation.core.plugin.js":function(t,e,n){n.r(e),n.d(e,"Plugin",function(){return i});n("jquery");var o=n("./js/foundation.core.utils.js");function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var i=function(){function i(t,e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),this._setup(t,e);var n=s(this);this.uuid=Object(o.GetYoDigits)(6,n),this.$element.attr("data-".concat(n))||this.$element.attr("data-".concat(n),this.uuid),this.$element.data("zfPlugin")||this.$element.data("zfPlugin",this),this.$element.trigger("init.zf.".concat(n))}var t,e,n;return t=i,(e=[{key:"destroy",value:function(){this._destroy();var t,e=s(this);for(t in this.$element.removeAttr("data-".concat(e)).removeData("zfPlugin").trigger("destroyed.zf.".concat(e)),this)this[t]=null}}])&&r(t.prototype,e),n&&r(t,n),i}();function s(t){return t.className.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}},"./js/foundation.core.utils.js":function(t,e,n){n.r(e),n.d(e,"rtl",function(){return o}),n.d(e,"GetYoDigits",function(){return r}),n.d(e,"RegExpEscape",function(){return s}),n.d(e,"transitionend",function(){return a}),n.d(e,"onLoad",function(){return u}),n.d(e,"ignoreMousedisappear",function(){return c});var i=n("jquery"),l=n.n(i);function o(){return"rtl"===l()("html").attr("dir")}function r(){for(var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:6,e=1<arguments.length?arguments[1]:void 0,n="",i="0123456789abcdefghijklmnopqrstuvwxyz",o=i.length,r=0;r<t;r++)n+=i[Math.floor(Math.random()*o)];return e?"".concat(n,"-").concat(e):n}function s(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}function a(t){var e,n,i={transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend"},o=document.createElement("div");for(n in i)void 0!==o.style[n]&&(e=i[n]);return e||(setTimeout(function(){t.triggerHandler("transitionend",[t])},1),"transitionend")}function u(t,e){function n(){return t.triggerHandler(o)}var i="complete"===document.readyState,o=(i?"_didLoad":"load")+".zf.util.onLoad";return t&&(e&&t.one(o,e),i?setTimeout(n):l()(window).one("load",n)),o}function c(r){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},e=t.ignoreLeaveWindow,s=void 0!==e&&e,n=t.ignoreReappear,a=void 0!==n&&n;return function(e){for(var t=arguments.length,n=new Array(1<t?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];var o=r.bind.apply(r,[this,e].concat(n));if(null!==e.relatedTarget)return o();setTimeout(function(){return s||!document.hasFocus||document.hasFocus()?void(a||l()(document).one("mouseenter",function(t){l()(e.currentTarget).has(t.target).length||(e.relatedTarget=t.target,o())})):o()},0)}}},"./js/foundation.drilldown.js":function(t,e,n){n.r(e),n.d(e,"Drilldown",function(){return g});var i=n("jquery"),s=n.n(i),a=n("./js/foundation.util.keyboard.js"),o=n("./js/foundation.util.nest.js"),l=n("./js/foundation.core.utils.js"),r=n("./js/foundation.util.box.js"),u=n("./js/foundation.core.plugin.js");function c(t){return(c="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function f(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function d(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),d(this,h(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(n,u["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=s.a.extend({},n.defaults,this.$element.data(),e),this.className="Drilldown",this._init(),a.Keyboard.register("Drilldown",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"previous",ESCAPE:"close",TAB:"down",SHIFT_TAB:"up"})}},{key:"_init",value:function(){o.Nest.Feather(this.$element,"drilldown"),this.options.autoApplyClass&&this.$element.addClass("drilldown"),this.$element.attr({role:"tree","aria-multiselectable":!1}),this.$submenuAnchors=this.$element.find("li.is-drilldown-submenu-parent").children("a"),this.$submenus=this.$submenuAnchors.parent("li").children("[data-submenu]").attr("role","group"),this.$menuItems=this.$element.find("li").not(".js-drilldown-back").attr("role","treeitem").find("a"),this.$currentMenu=this.$element,this.$element.attr("data-mutate",this.$element.attr("data-drilldown")||Object(l.GetYoDigits)(6,"drilldown")),this._prepareMenu(),this._registerEvents(),this._keyboardEvents()}},{key:"_prepareMenu",value:function(){var n=this;this.$submenuAnchors.each(function(){var t=s()(this),e=t.parent();n.options.parentLink&&t.clone().prependTo(e.children("[data-submenu]")).wrap('<li data-is-parent-link class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="none"></li>'),t.data("savedHref",t.attr("href")).removeAttr("href").attr("tabindex",0),t.children("[data-submenu]").attr({"aria-hidden":!0,tabindex:0,role:"group"}),n._events(t)}),this.$submenus.each(function(){var t=s()(this);if(!t.find(".js-drilldown-back").length)switch(n.options.backButtonPosition){case"bottom":t.append(n.options.backButton);break;case"top":t.prepend(n.options.backButton);break;default:console.error("Unsupported backButtonPosition value '"+n.options.backButtonPosition+"'")}n._back(t)}),this.$submenus.addClass("invisible"),this.options.autoHeight||this.$submenus.addClass("drilldown-submenu-cover-previous"),this.$element.parent().hasClass("is-drilldown")||(this.$wrapper=s()(this.options.wrapper).addClass("is-drilldown"),this.options.animateHeight&&this.$wrapper.addClass("animate-height"),this.$element.wrap(this.$wrapper)),this.$wrapper=this.$element.parent(),this.$wrapper.css(this._getMaxDims())}},{key:"_resize",value:function(){this.$wrapper.css({"max-width":"none","min-height":"none"}),this.$wrapper.css(this._getMaxDims())}},{key:"_events",value:function(n){var i=this;n.off("click.zf.drilldown").on("click.zf.drilldown",function(t){var e;s()(t.target).parentsUntil("ul","li").hasClass("is-drilldown-submenu-parent")&&t.preventDefault(),i._show(n.parent("li")),i.options.closeOnClick&&(e=s()("body")).off(".zf.drilldown").on("click.zf.drilldown",function(t){t.target===i.$element[0]||s.a.contains(i.$element[0],t.target)||(t.preventDefault(),i._hideAll(),e.off(".zf.drilldown"))})})}},{key:"_registerEvents",value:function(){this.options.scrollTop&&(this._bindHandler=this._scrollTop.bind(this),this.$element.on("open.zf.drilldown hide.zf.drilldown close.zf.drilldown closed.zf.drilldown",this._bindHandler)),this.$element.on("mutateme.zf.trigger",this._resize.bind(this))}},{key:"_scrollTop",value:function(){var t=this,e=""!=t.options.scrollTopElement?s()(t.options.scrollTopElement):t.$element,n=parseInt(e.offset().top+t.options.scrollTopOffset,10);s()("html, body").stop(!0).animate({scrollTop:n},t.options.animationDuration,t.options.animationEasing,function(){this===s()("html")[0]&&t.$element.trigger("scrollme.zf.drilldown")})}},{key:"_keyboardEvents",value:function(){var t=this;this.$menuItems.add(this.$element.find(".js-drilldown-back > a, .is-submenu-parent-item > a")).on("keydown.zf.drilldown",function(e){var n,i,o=s()(this),r=o.parent("li").parent("ul").children("li").children("a");r.each(function(t){if(s()(this).is(o))return n=r.eq(Math.max(0,t-1)),void(i=r.eq(Math.min(t+1,r.length-1)))}),a.Keyboard.handleKey(e,"Drilldown",{next:function(){if(o.is(t.$submenuAnchors))return t._show(o.parent("li")),o.parent("li").one(Object(l.transitionend)(o),function(){o.parent("li").find("ul li a").not(".js-drilldown-back a").first().focus()}),!0},previous:function(){return t._hide(o.parent("li").parent("ul")),o.parent("li").parent("ul").one(Object(l.transitionend)(o),function(){setTimeout(function(){o.parent("li").parent("ul").parent("li").children("a").first().focus()},1)}),!0},up:function(){return n.focus(),!o.is(t.$element.find("> li:first-child > a"))},down:function(){return i.focus(),!o.is(t.$element.find("> li:last-child > a"))},close:function(){o.is(t.$element.find("> li > a"))||(t._hide(o.parent().parent()),o.parent().parent().siblings("a").focus())},open:function(){return(!t.options.parentLink||!o.attr("href"))&&(o.is(t.$menuItems)?o.is(t.$submenuAnchors)?(t._show(o.parent("li")),o.parent("li").one(Object(l.transitionend)(o),function(){o.parent("li").find("ul li a").not(".js-drilldown-back a").first().focus()}),!0):void 0:(t._hide(o.parent("li").parent("ul")),o.parent("li").parent("ul").one(Object(l.transitionend)(o),function(){setTimeout(function(){o.parent("li").parent("ul").parent("li").children("a").first().focus()},1)}),!0))},handled:function(t){t&&e.preventDefault()}})})}},{key:"_hideAll",value:function(){var t,e=this,n=this.$element.find(".is-drilldown-submenu.is-active");n.addClass("is-closing"),this.options.autoHeight&&(t=n.parent().closest("ul").data("calcHeight"),this.$wrapper.css({height:t})),this.$element.trigger("close.zf.drilldown"),n.one(Object(l.transitionend)(n),function(){n.removeClass("is-active is-closing"),e.$element.trigger("closed.zf.drilldown")})}},{key:"_back",value:function(n){var i=this;n.off("click.zf.drilldown"),n.children(".js-drilldown-back").on("click.zf.drilldown",function(t){i._hide(n);var e=n.parent("li").parent("ul").parent("li");e.length&&i._show(e)})}},{key:"_menuLinkEvents",value:function(){var e=this;this.$menuItems.not(".is-drilldown-submenu-parent").off("click.zf.drilldown").on("click.zf.drilldown",function(t){setTimeout(function(){e._hideAll()},0)})}},{key:"_setShowSubMenuClasses",value:function(t,e){t.addClass("is-active").removeClass("invisible").attr("aria-hidden",!1),t.parent("li").attr("aria-expanded",!0),!0===e&&this.$element.trigger("open.zf.drilldown",[t])}},{key:"_setHideSubMenuClasses",value:function(t,e){t.removeClass("is-active").addClass("invisible").attr("aria-hidden",!0),t.parent("li").attr("aria-expanded",!1),!0===e&&t.trigger("hide.zf.drilldown",[t])}},{key:"_showMenu",value:function(n,i){var o=this;if(this.$element.find('li[aria-expanded="true"] > ul[data-submenu]').each(function(t){o._setHideSubMenuClasses(s()(this))}),(this.$currentMenu=n).is("[data-drilldown]"))return!0===i&&n.find('li[role="treeitem"] > a').first().focus(),void(this.options.autoHeight&&this.$wrapper.css("height",n.data("calcHeight")));var r=n.children().first().parentsUntil("[data-drilldown]","[data-submenu]");r.each(function(t){0===t&&o.options.autoHeight&&o.$wrapper.css("height",s()(this).data("calcHeight"));var e=t==r.length-1;!0==e&&s()(this).one(Object(l.transitionend)(s()(this)),function(){!0===i&&n.find('li[role="treeitem"] > a').first().focus()}),o._setShowSubMenuClasses(s()(this),e)})}},{key:"_show",value:function(t){var e=t.children("[data-submenu]");t.attr("aria-expanded",!0),(this.$currentMenu=e).addClass("is-active").removeClass("invisible").attr("aria-hidden",!1),this.options.autoHeight&&this.$wrapper.css({height:e.data("calcHeight")}),this.$element.trigger("open.zf.drilldown",[t])}},{key:"_hide",value:function(t){this.options.autoHeight&&this.$wrapper.css({height:t.parent().closest("ul").data("calcHeight")});t.parent("li").attr("aria-expanded",!1),t.attr("aria-hidden",!0),t.addClass("is-closing").one(Object(l.transitionend)(t),function(){t.removeClass("is-active is-closing"),t.blur().addClass("invisible")}),t.trigger("hide.zf.drilldown",[t])}},{key:"_getMaxDims",value:function(){var e=0,t={},n=this;return this.$submenus.add(this.$element).each(function(){s()(this).children("li").length;var t=r.Box.GetDimensions(this).height;e=e<t?t:e,n.options.autoHeight&&s()(this).data("calcHeight",t)}),this.options.autoHeight?t.height=this.$currentMenu.data("calcHeight"):t["min-height"]="".concat(e,"px"),t["max-width"]="".concat(this.$element[0].getBoundingClientRect().width,"px"),t}},{key:"_destroy",value:function(){this.options.scrollTop&&this.$element.off(".zf.drilldown",this._bindHandler),this._hideAll(),this.$element.off("mutateme.zf.trigger"),o.Nest.Burn(this.$element,"drilldown"),this.$element.unwrap().find(".js-drilldown-back, .is-submenu-parent-item").remove().end().find(".is-active, .is-closing, .is-drilldown-submenu").removeClass("is-active is-closing is-drilldown-submenu").end().find("[data-submenu]").removeAttr("aria-hidden tabindex role"),this.$submenuAnchors.each(function(){s()(this).off(".zf.drilldown")}),this.$element.find("[data-is-parent-link]").detach(),this.$submenus.removeClass("drilldown-submenu-cover-previous invisible"),this.$element.find("a").each(function(){var t=s()(this);t.removeAttr("tabindex"),t.data("savedHref")&&t.attr("href",t.data("savedHref")).removeData("savedHref")})}}])&&f(t.prototype,e),i&&f(t,i),n}();g.defaults={autoApplyClass:!0,backButton:'<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',backButtonPosition:"top",wrapper:"<div></div>",parentLink:!1,closeOnClick:!1,autoHeight:!1,animateHeight:!1,scrollTop:!1,scrollTopElement:"",scrollTopOffset:0,animationDuration:500,animationEasing:"swing"}},"./js/foundation.dropdown.js":function(t,e,n){n.r(e),n.d(e,"Dropdown",function(){return m});var i=n("jquery"),o=n.n(i),r=n("./js/foundation.util.keyboard.js"),s=n("./js/foundation.core.utils.js"),a=n("./js/foundation.positionable.js"),l=n("./js/foundation.util.triggers.js"),u=n("./js/foundation.util.touch.js");function c(t){return(c="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function f(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function d(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t,e,n){return(h="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var i=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=p(t)););return t}(t,e);if(i){var o=Object.getOwnPropertyDescriptor(i,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function g(t,e){return(g=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var m=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),d(this,p(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&g(t,e)}(n,a["Positionable"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=o.a.extend({},n.defaults,this.$element.data(),e),this.className="Dropdown",u.Touch.init(o.a),l.Triggers.init(o.a),this._init(),r.Keyboard.register("Dropdown",{ENTER:"toggle",SPACE:"toggle",ESCAPE:"close"})}},{key:"_init",value:function(){var t=this.$element.attr("id");this.$anchors=o()('[data-toggle="'.concat(t,'"]')).length?o()('[data-toggle="'.concat(t,'"]')):o()('[data-open="'.concat(t,'"]')),this.$anchors.attr({"aria-controls":t,"data-is-focus":!1,"data-yeti-box":t,"aria-haspopup":!0,"aria-expanded":!1}),this._setCurrentAnchor(this.$anchors.first()),this.options.parentClass?this.$parent=this.$element.parents("."+this.options.parentClass):this.$parent=null,void 0===this.$element.attr("aria-labelledby")&&(void 0===this.$currentAnchor.attr("id")&&this.$currentAnchor.attr("id",Object(s.GetYoDigits)(6,"dd-anchor")),this.$element.attr("aria-labelledby",this.$currentAnchor.attr("id"))),this.$element.attr({"aria-hidden":"true","data-yeti-box":t,"data-resize":t}),h(p(n.prototype),"_init",this).call(this),this._events()}},{key:"_getDefaultPosition",value:function(){var t=this.$element[0].className.match(/(top|left|right|bottom)/g);return t?t[0]:"bottom"}},{key:"_getDefaultAlignment",value:function(){var t=/float-(\S+)/.exec(this.$currentAnchor.attr("class"));return t?t[1]:h(p(n.prototype),"_getDefaultAlignment",this).call(this)}},{key:"_setPosition",value:function(){this.$element.removeClass("has-position-".concat(this.position," has-alignment-").concat(this.alignment)),h(p(n.prototype),"_setPosition",this).call(this,this.$currentAnchor,this.$element,this.$parent),this.$element.addClass("has-position-".concat(this.position," has-alignment-").concat(this.alignment))}},{key:"_setCurrentAnchor",value:function(t){this.$currentAnchor=o()(t)}},{key:"_events",value:function(){var n=this,e="ontouchstart"in window||void 0!==window.ontouchstart;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":this._setPosition.bind(this)}),this.$anchors.off("click.zf.trigger").on("click.zf.trigger",function(t){n._setCurrentAnchor(this),(!1===n.options.forceFollow||e&&n.options.hover&&!1===n.$element.hasClass("is-open"))&&t.preventDefault()}),this.options.hover&&(this.$anchors.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){n._setCurrentAnchor(this);var t=o()("body").data();void 0!==t.whatinput&&"mouse"!==t.whatinput||(clearTimeout(n.timeout),n.timeout=setTimeout(function(){n.open(),n.$anchors.data("hover",!0)},n.options.hoverDelay))}).on("mouseleave.zf.dropdown",Object(s.ignoreMousedisappear)(function(){clearTimeout(n.timeout),n.timeout=setTimeout(function(){n.close(),n.$anchors.data("hover",!1)},n.options.hoverDelay)})),this.options.hoverPane&&this.$element.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){clearTimeout(n.timeout)}).on("mouseleave.zf.dropdown",Object(s.ignoreMousedisappear)(function(){clearTimeout(n.timeout),n.timeout=setTimeout(function(){n.close(),n.$anchors.data("hover",!1)},n.options.hoverDelay)}))),this.$anchors.add(this.$element).on("keydown.zf.dropdown",function(t){var e=o()(this);r.Keyboard.findFocusable(n.$element);r.Keyboard.handleKey(t,"Dropdown",{open:function(){e.is(n.$anchors)&&!e.is("input, textarea")&&(n.open(),n.$element.attr("tabindex",-1).focus(),t.preventDefault())},close:function(){n.close(),n.$anchors.focus()}})})}},{key:"_addBodyHandler",value:function(){var e=o()(document.body).not(this.$element),n=this;e.off("click.zf.dropdown tap.zf.dropdown").on("click.zf.dropdown tap.zf.dropdown",function(t){n.$anchors.is(t.target)||n.$anchors.find(t.target).length||n.$element.is(t.target)||n.$element.find(t.target).length||(n.close(),e.off("click.zf.dropdown tap.zf.dropdown"))})}},{key:"open",value:function(){var t;this.$element.trigger("closeme.zf.dropdown",this.$element.attr("id")),this.$anchors.addClass("hover").attr({"aria-expanded":!0}),this.$element.addClass("is-opening"),this._setPosition(),this.$element.removeClass("is-opening").addClass("is-open").attr({"aria-hidden":!1}),!this.options.autoFocus||(t=r.Keyboard.findFocusable(this.$element)).length&&t.eq(0).focus(),this.options.closeOnClick&&this._addBodyHandler(),this.options.trapFocus&&r.Keyboard.trapFocus(this.$element),this.$element.trigger("show.zf.dropdown",[this.$element])}},{key:"close",value:function(){if(!this.$element.hasClass("is-open"))return!1;this.$element.removeClass("is-open").attr({"aria-hidden":!0}),this.$anchors.removeClass("hover").attr("aria-expanded",!1),this.$element.trigger("hide.zf.dropdown",[this.$element]),this.options.trapFocus&&r.Keyboard.releaseFocus(this.$element)}},{key:"toggle",value:function(){if(this.$element.hasClass("is-open")){if(this.$anchors.data("hover"))return;this.close()}else this.open()}},{key:"_destroy",value:function(){this.$element.off(".zf.trigger").hide(),this.$anchors.off(".zf.dropdown"),o()(document.body).off("click.zf.dropdown tap.zf.dropdown")}}])&&f(t.prototype,e),i&&f(t,i),n}();m.defaults={parentClass:null,hoverDelay:250,hover:!1,hoverPane:!1,vOffset:0,hOffset:0,position:"auto",alignment:"auto",allowOverlap:!1,allowBottomOverlap:!0,trapFocus:!1,autoFocus:!1,closeOnClick:!1,forceFollow:!0}},"./js/foundation.dropdownMenu.js":function(t,e,n){n.r(e),n.d(e,"DropdownMenu",function(){return m});var i=n("jquery"),d=n.n(i),o=n("./js/foundation.core.plugin.js"),a=n("./js/foundation.core.utils.js"),h=n("./js/foundation.util.keyboard.js"),r=n("./js/foundation.util.nest.js"),s=n("./js/foundation.util.box.js"),l=n("./js/foundation.util.touch.js");function u(t){return(u="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function g(t,e){return(g=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var m=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,p(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&g(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=d.a.extend({},n.defaults,this.$element.data(),e),this.className="DropdownMenu",l.Touch.init(d.a),this._init(),h.Keyboard.register("DropdownMenu",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"previous",ESCAPE:"close"})}},{key:"_init",value:function(){r.Nest.Feather(this.$element,"dropdown");var t=this.$element.find("li.is-dropdown-submenu-parent");this.$element.children(".is-dropdown-submenu-parent").children(".is-dropdown-submenu").addClass("first-sub"),this.$menuItems=this.$element.find('li[role="none"]'),this.$tabs=this.$element.children('li[role="none"]'),this.$tabs.find("ul.is-dropdown-submenu").addClass(this.options.verticalClass),"auto"===this.options.alignment?this.$element.hasClass(this.options.rightClass)||Object(a.rtl)()||this.$element.parents(".top-bar-right").is("*")?(this.options.alignment="right",t.addClass("opens-left")):(this.options.alignment="left",t.addClass("opens-right")):"right"===this.options.alignment?t.addClass("opens-left"):t.addClass("opens-right"),this.changed=!1,this._events()}},{key:"_isVertical",value:function(){return"block"===this.$tabs.css("display")||"column"===this.$element.css("flex-direction")}},{key:"_isRtl",value:function(){return this.$element.hasClass("align-right")||Object(a.rtl)()&&!this.$element.hasClass("align-left")}},{key:"_events",value:function(){var f=this,r="ontouchstart"in window||void 0!==window.ontouchstart,s="is-dropdown-submenu-parent";(this.options.clickOpen||r)&&this.$menuItems.on("click.zf.dropdownMenu touchstart.zf.dropdownMenu",function(t){var e=d()(t.target).parentsUntil("ul",".".concat(s)),n=e.hasClass(s),i="true"===e.attr("data-is-click"),o=e.children(".is-dropdown-submenu");if(n)if(i){if(!f.options.closeOnClick||!f.options.clickOpen&&!r||f.options.forceFollow&&r)return;t.stopImmediatePropagation(),t.preventDefault(),f._hide(e)}else t.stopImmediatePropagation(),t.preventDefault(),f._show(o),e.add(e.parentsUntil(f.$element,".".concat(s))).attr("data-is-click",!0)}),f.options.closeOnClickInside&&this.$menuItems.on("click.zf.dropdownMenu",function(t){d()(this).hasClass(s)||f._hide()}),this.options.disableHover||this.$menuItems.on("mouseenter.zf.dropdownMenu",function(t){var e=d()(this);e.hasClass(s)&&(clearTimeout(e.data("_delay")),e.data("_delay",setTimeout(function(){f._show(e.children(".is-dropdown-submenu"))},f.options.hoverDelay)))}).on("mouseleave.zf.dropdownMenu",Object(a.ignoreMousedisappear)(function(t){var e=d()(this);if(e.hasClass(s)&&f.options.autoclose){if("true"===e.attr("data-is-click")&&f.options.clickOpen)return!1;clearTimeout(e.data("_delay")),e.data("_delay",setTimeout(function(){f._hide(e)},f.options.closingTime))}})),this.$menuItems.on("keydown.zf.dropdownMenu",function(e){var n,i,o=d()(e.target).parentsUntil("ul",'[role="none"]'),t=-1<f.$tabs.index(o),r=t?f.$tabs:o.siblings("li").add(o);r.each(function(t){if(d()(this).is(o))return n=r.eq(t-1),void(i=r.eq(t+1))});function s(){i.children("a:first").focus(),e.preventDefault()}function a(){n.children("a:first").focus(),e.preventDefault()}function l(){var t=o.children("ul.is-dropdown-submenu");t.length&&(f._show(t),o.find("li > a:first").focus(),e.preventDefault())}function u(){var t=o.parent("ul").parent("li");t.children("a:first").focus(),f._hide(t),e.preventDefault()}var c={open:l,close:function(){f._hide(f.$element),f.$menuItems.eq(0).children("a").focus(),e.preventDefault()}};t?f._isVertical()?f._isRtl()?d.a.extend(c,{down:s,up:a,next:u,previous:l}):d.a.extend(c,{down:s,up:a,next:l,previous:u}):f._isRtl()?d.a.extend(c,{next:a,previous:s,down:l,up:u}):d.a.extend(c,{next:s,previous:a,down:l,up:u}):f._isRtl()?d.a.extend(c,{next:u,previous:l,down:s,up:a}):d.a.extend(c,{next:l,previous:u,down:s,up:a}),h.Keyboard.handleKey(e,"DropdownMenu",c)})}},{key:"_addBodyHandler",value:function(){var e=this,t=d()(document.body);this._removeBodyHandler(),t.on("click.zf.dropdownMenu tap.zf.dropdownMenu",function(t){!d()(t.target).closest(e.$element).length&&(e._hide(),e._removeBodyHandler())})}},{key:"_removeBodyHandler",value:function(){d()(document.body).off("click.zf.dropdownMenu tap.zf.dropdownMenu")}},{key:"_show",value:function(n){var t=this.$tabs.index(this.$tabs.filter(function(t,e){return 0<d()(e).find(n).length})),e=n.parent("li.is-dropdown-submenu-parent").siblings("li.is-dropdown-submenu-parent");this._hide(e,t),n.css("visibility","hidden").addClass("js-dropdown-active").parent("li.is-dropdown-submenu-parent").addClass("is-active");var i,o,r=s.Box.ImNotTouchingYou(n,null,!0);r||(i="left"===this.options.alignment?"-right":"-left",(o=n.parent(".is-dropdown-submenu-parent")).removeClass("opens".concat(i)).addClass("opens-".concat(this.options.alignment)),s.Box.ImNotTouchingYou(n,null,!0)||o.removeClass("opens-".concat(this.options.alignment)).addClass("opens-inner"),this.changed=!0),n.css("visibility",""),this.options.closeOnClick&&this._addBodyHandler(),this.$element.trigger("show.zf.dropdownMenu",[n])}},{key:"_hide",value:function(t,n){var e,i,o=t&&t.length?t:void 0!==n?this.$tabs.not(function(t,e){return t===n}):this.$element;(o.hasClass("is-active")||0<o.find(".is-active").length)&&((e=o.find("li.is-active")).add(o).attr({"data-is-click":!1}).removeClass("is-active"),o.find("ul.js-dropdown-active").removeClass("js-dropdown-active"),(this.changed||o.find("opens-inner").length)&&(i="left"===this.options.alignment?"right":"left",o.find("li.is-dropdown-submenu-parent").add(o).removeClass("opens-inner opens-".concat(this.options.alignment)).addClass("opens-".concat(i)),this.changed=!1),clearTimeout(e.data("_delay")),this._removeBodyHandler(),this.$element.trigger("hide.zf.dropdownMenu",[o]))}},{key:"_destroy",value:function(){this.$menuItems.off(".zf.dropdownMenu").removeAttr("data-is-click").removeClass("is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner"),d()(document.body).off(".zf.dropdownMenu"),r.Nest.Burn(this.$element,"dropdown")}}])&&c(t.prototype,e),i&&c(t,i),n}();m.defaults={disableHover:!1,autoclose:!0,hoverDelay:50,clickOpen:!1,closingTime:500,alignment:"auto",closeOnClick:!0,closeOnClickInside:!0,verticalClass:"vertical",rightClass:"align-right",forceFollow:!0}},"./js/foundation.equalizer.js":function(t,e,n){n.r(e),n.d(e,"Equalizer",function(){return p});var i=n("jquery"),f=n.n(i),o=n("./js/foundation.util.mediaQuery.js"),r=n("./js/foundation.util.imageLoader.js"),s=n("./js/foundation.core.utils.js"),a=n("./js/foundation.core.plugin.js");function l(t){return(l="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),c(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,a["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=f.a.extend({},n.defaults,this.$element.data(),e),this.className="Equalizer",this._init()}},{key:"_init",value:function(){var t=this.$element.attr("data-equalizer")||"",e=this.$element.find('[data-equalizer-watch="'.concat(t,'"]'));o.MediaQuery._init(),this.$watched=e.length?e:this.$element.find("[data-equalizer-watch]"),this.$element.attr("data-resize",t||Object(s.GetYoDigits)(6,"eq")),this.$element.attr("data-mutate",t||Object(s.GetYoDigits)(6,"eq")),this.hasNested=0<this.$element.find("[data-equalizer]").length,this.isNested=0<this.$element.parentsUntil(document.body,"[data-equalizer]").length,this.isOn=!1,this._bindHandler={onResizeMeBound:this._onResizeMe.bind(this),onPostEqualizedBound:this._onPostEqualized.bind(this)};var n,i=this.$element.find("img");this.options.equalizeOn?(n=this._checkMQ(),f()(window).on("changed.zf.mediaquery",this._checkMQ.bind(this))):this._events(),(void 0!==n&&!1===n||void 0===n)&&(i.length?Object(r.onImagesLoaded)(i,this._reflow.bind(this)):this._reflow())}},{key:"_pauseEvents",value:function(){this.isOn=!1,this.$element.off({".zf.equalizer":this._bindHandler.onPostEqualizedBound,"resizeme.zf.trigger":this._bindHandler.onResizeMeBound,"mutateme.zf.trigger":this._bindHandler.onResizeMeBound})}},{key:"_onResizeMe",value:function(){this._reflow()}},{key:"_onPostEqualized",value:function(t){t.target!==this.$element[0]&&this._reflow()}},{key:"_events",value:function(){this._pauseEvents(),this.hasNested?this.$element.on("postequalized.zf.equalizer",this._bindHandler.onPostEqualizedBound):(this.$element.on("resizeme.zf.trigger",this._bindHandler.onResizeMeBound),this.$element.on("mutateme.zf.trigger",this._bindHandler.onResizeMeBound)),this.isOn=!0}},{key:"_checkMQ",value:function(){var t=!o.MediaQuery.is(this.options.equalizeOn);return t?this.isOn&&(this._pauseEvents(),this.$watched.css("height","auto")):this.isOn||this._events(),t}},{key:"_killswitch",value:function(){}},{key:"_reflow",value:function(){if(!this.options.equalizeOnStack&&this._isStacked())return this.$watched.css("height","auto"),!1;this.options.equalizeByRow?this.getHeightsByRow(this.applyHeightByRow.bind(this)):this.getHeights(this.applyHeight.bind(this))}},{key:"_isStacked",value:function(){return!this.$watched[0]||!this.$watched[1]||this.$watched[0].getBoundingClientRect().top!==this.$watched[1].getBoundingClientRect().top}},{key:"getHeights",value:function(t){for(var e=[],n=0,i=this.$watched.length;n<i;n++)this.$watched[n].style.height="auto",e.push(this.$watched[n].offsetHeight);t(e)}},{key:"getHeightsByRow",value:function(t){var e=this.$watched.length?this.$watched.first().offset().top:0,n=[],i=0;n[i]=[];for(var o=0,r=this.$watched.length;o<r;o++){this.$watched[o].style.height="auto";var s=f()(this.$watched[o]).offset().top;s!=e&&(n[++i]=[],e=s),n[i].push([this.$watched[o],this.$watched[o].offsetHeight])}for(var a=0,l=n.length;a<l;a++){var u=f()(n[a]).map(function(){return this[1]}).get(),c=Math.max.apply(null,u);n[a].push(c)}t(n)}},{key:"applyHeight",value:function(t){var e=Math.max.apply(null,t);this.$element.trigger("preequalized.zf.equalizer"),this.$watched.css("height",e),this.$element.trigger("postequalized.zf.equalizer")}},{key:"applyHeightByRow",value:function(t){this.$element.trigger("preequalized.zf.equalizer");for(var e=0,n=t.length;e<n;e++){var i=t[e].length,o=t[e][i-1];if(i<=2)f()(t[e][0][0]).css({height:"auto"});else{this.$element.trigger("preequalizedrow.zf.equalizer");for(var r=0,s=i-1;r<s;r++)f()(t[e][r][0]).css({height:o});this.$element.trigger("postequalizedrow.zf.equalizer")}}this.$element.trigger("postequalized.zf.equalizer")}},{key:"_destroy",value:function(){this._pauseEvents(),this.$watched.css("height","auto")}}])&&u(t.prototype,e),i&&u(t,i),n}();p.defaults={equalizeOnStack:!1,equalizeByRow:!1,equalizeOn:""}},"./js/foundation.interchange.js":function(t,e,n){n.r(e),n.d(e,"Interchange",function(){return p});var i=n("jquery"),o=n.n(i),r=n("./js/foundation.util.mediaQuery.js"),a=n("./js/foundation.core.plugin.js"),l=n("./js/foundation.core.utils.js"),u=n("./js/foundation.util.triggers.js");function s(t){return(s="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==s(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function s(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,s),f(this,d(s).apply(this,arguments))}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(s,a["Plugin"]),t=s,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=o.a.extend({},s.defaults,this.$element.data(),e),this.rules=[],this.currentPath="",this.className="Interchange",u.Triggers.init(o.a),this._init(),this._events()}},{key:"_init",value:function(){r.MediaQuery._init();var t=this.$element[0].id||Object(l.GetYoDigits)(6,"interchange");this.$element.attr({"data-resize":t,id:t}),this._parseOptions(),this._addBreakpoints(),this._generateRules(),this._reflow()}},{key:"_events",value:function(){var t=this;this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger",function(){return t._reflow()})}},{key:"_reflow",value:function(){var t,e,n;for(e in this.rules){this.rules.hasOwnProperty(e)&&(n=this.rules[e],window.matchMedia(n.query).matches&&(t=n))}t&&this.replace(t.path)}},{key:"_parseOptions",value:function(){void 0===this.options.type?this.options.type="auto":-1===["auto","src","background","html"].indexOf(this.options.type)&&(console.log('Warning: invalid value "'.concat(this.options.type,'" for Interchange option "type"')),this.options.type="auto")}},{key:"_addBreakpoints",value:function(){for(var t in r.MediaQuery.queries){var e;r.MediaQuery.queries.hasOwnProperty(t)&&(e=r.MediaQuery.queries[t],s.SPECIAL_QUERIES[e.name]=e.value)}}},{key:"_generateRules",value:function(){var t,e,n,i,o=[],r=this.options.rules?this.options.rules:this.$element.data("interchange");for(t in r="string"==typeof r?r.match(/\[.*?, .*?\]/g):r){r.hasOwnProperty(t)&&(n=(e=r[t].slice(1,-1).split(", ")).slice(0,-1).join(""),i=e[e.length-1],s.SPECIAL_QUERIES[i]&&(i=s.SPECIAL_QUERIES[i]),o.push({path:n,query:i}))}this.rules=o}},{key:"replace",value:function(e){var n,t,i=this;this.currentPath!==e&&(n="replaced.zf.interchange","auto"===(t=this.options.type)&&(t="IMG"===this.$element[0].nodeName?"src":e.match(/\.(gif|jpe?g|png|svg|tiff)([?#].*)?/i)?"background":"html"),"src"===t?this.$element.attr("src",e).on("load",function(){i.currentPath=e}).trigger(n):"background"===t?(e=e.replace(/\(/g,"%28").replace(/\)/g,"%29"),this.$element.css({"background-image":"url("+e+")"}).trigger(n)):"html"===t&&o.a.get(e,function(t){i.$element.html(t).trigger(n),o()(t).foundation(),i.currentPath=e}))}},{key:"_destroy",value:function(){this.$element.off("resizeme.zf.trigger")}}])&&c(t.prototype,e),n&&c(t,n),s}();p.defaults={rules:null,type:"auto"},p.SPECIAL_QUERIES={landscape:"screen and (orientation: landscape)",portrait:"screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"}},"./js/foundation.magellan.js":function(t,e,n){n.r(e),n.d(e,"Magellan",function(){return p});var i=n("jquery"),c=n.n(i),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.core.utils.js"),s=n("./js/foundation.smoothScroll.js"),a=n("./js/foundation.util.triggers.js");function l(t){return(l="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=c.a.extend({},n.defaults,this.$element.data(),e),this.className="Magellan",a.Triggers.init(c.a),this._init(),this.calcPoints()}},{key:"_init",value:function(){var t=this.$element[0].id||Object(r.GetYoDigits)(6,"magellan");this.$targets=c()("[data-magellan-target]"),this.$links=this.$element.find("a"),this.$element.attr({"data-resize":t,"data-scroll":t,id:t}),this.$active=c()(),this.scrollPos=parseInt(window.pageYOffset,10),this._events()}},{key:"calcPoints",value:function(){var n=this,t=document.body,e=document.documentElement;this.points=[],this.winHeight=Math.round(Math.max(window.innerHeight,e.clientHeight)),this.docHeight=Math.round(Math.max(t.scrollHeight,t.offsetHeight,e.clientHeight,e.scrollHeight,e.offsetHeight)),this.$targets.each(function(){var t=c()(this),e=Math.round(t.offset().top-n.options.threshold);t.targetPoint=e,n.points.push(e)})}},{key:"_events",value:function(){var n=this;c()(window).one("load",function(){n.options.deepLinking&&location.hash&&n.scrollToLoc(location.hash),n.calcPoints(),n._updateActive()}),n.onLoadListener=Object(r.onLoad)(c()(window),function(){n.$element.on({"resizeme.zf.trigger":n.reflow.bind(n),"scrollme.zf.trigger":n._updateActive.bind(n)}).on("click.zf.magellan",'a[href^="#"]',function(t){t.preventDefault();var e=this.getAttribute("href");n.scrollToLoc(e)})}),this._deepLinkScroll=function(t){n.options.deepLinking&&n.scrollToLoc(window.location.hash)},c()(window).on("hashchange",this._deepLinkScroll)}},{key:"scrollToLoc",value:function(t){this._inTransition=!0;var e=this,n={animationEasing:this.options.animationEasing,animationDuration:this.options.animationDuration,threshold:this.options.threshold,offset:this.options.offset};s.SmoothScroll.scrollToLoc(t,n,function(){e._inTransition=!1})}},{key:"reflow",value:function(){this.calcPoints(),this._updateActive()}},{key:"_updateActive",value:function(){var n,i,t,e,o,r,s,a,l,u=this;this._inTransition||(n=parseInt(window.pageYOffset,10),i=this.scrollPos>n,(this.scrollPos=n)<this.points[0]||(e=n+this.winHeight===this.docHeight?this.points.length-1:(t=this.points.filter(function(t,e){return t-u.options.offset-(i?u.options.threshold:0)<=n})).length?t.length-1:0),o=this.$active,r="",void 0!==e?(this.$active=this.$links.filter('[href="#'+this.$targets.eq(e).data("magellan-target")+'"]'),this.$active.length&&(r=this.$active[0].getAttribute("href"))):this.$active=c()(),s=!(!this.$active.length&&!o.length||this.$active.is(o)),a=r!==window.location.hash,s&&(o.removeClass(this.options.activeClass),this.$active.addClass(this.options.activeClass)),this.options.deepLinking&&a&&(window.history.pushState?(l=r||window.location.pathname+window.location.search,this.options.updateHistory?window.history.pushState({},"",l):window.history.replaceState({},"",l)):window.location.hash=r),s&&this.$element.trigger("update.zf.magellan",[this.$active]))}},{key:"_destroy",value:function(){var t;this.$element.off(".zf.trigger .zf.magellan").find(".".concat(this.options.activeClass)).removeClass(this.options.activeClass),this.options.deepLinking&&(t=this.$active[0].getAttribute("href"),window.location.hash.replace(t,"")),c()(window).off("hashchange",this._deepLinkScroll),this.onLoadListener&&c()(window).off(this.onLoadListener)}}])&&u(t.prototype,e),i&&u(t,i),n}();p.defaults={animationDuration:500,animationEasing:"linear",threshold:50,activeClass:"is-active",deepLinking:!1,updateHistory:!1,offset:0}},"./js/foundation.offcanvas.js":function(t,e,n){n.r(e),n.d(e,"OffCanvas",function(){return g});var i=n("jquery"),r=n.n(i),o=n("./js/foundation.core.plugin.js"),s=n("./js/foundation.core.utils.js"),a=n("./js/foundation.util.keyboard.js"),l=n("./js/foundation.util.mediaQuery.js"),u=n("./js/foundation.util.triggers.js");function c(t){return(c="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function f(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function d(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(){function i(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),d(this,h(i).apply(this,arguments))}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(i,o["Plugin"]),t=i,(e=[{key:"_setup",value:function(t,e){var n=this;this.className="OffCanvas",this.$element=t,this.options=r.a.extend({},i.defaults,this.$element.data(),e),this.contentClasses={base:[],reveal:[]},this.$lastTrigger=r()(),this.$triggers=r()(),this.position="left",this.$content=r()(),this.nested=!!this.options.nested,this.$sticky=r()(),this.isInCanvas=!1,r()(["push","overlap"]).each(function(t,e){n.contentClasses.base.push("has-transition-"+e)}),r()(["left","right","top","bottom"]).each(function(t,e){n.contentClasses.base.push("has-position-"+e),n.contentClasses.reveal.push("has-reveal-"+e)}),u.Triggers.init(r.a),l.MediaQuery._init(),this._init(),this._events(),a.Keyboard.register("OffCanvas",{ESCAPE:"close"})}},{key:"_init",value:function(){var t,e,n=this.$element.attr("id");this.$element.attr("aria-hidden","true"),this.options.contentId?this.$content=r()("#"+this.options.contentId):this.$element.siblings("[data-off-canvas-content]").length?this.$content=this.$element.siblings("[data-off-canvas-content]").first():this.$content=this.$element.closest("[data-off-canvas-content]").first(),this.options.contentId?this.options.contentId&&null===this.options.nested&&console.warn("Remember to use the nested option if using the content ID option!"):this.nested=0===this.$element.siblings("[data-off-canvas-content]").length,!0===this.nested&&(this.options.transition="overlap",this.$element.removeClass("is-transition-push")),this.$element.addClass("is-transition-".concat(this.options.transition," is-closed")),this.$triggers=r()(document).find('[data-open="'+n+'"], [data-close="'+n+'"], [data-toggle="'+n+'"]').attr("aria-expanded","false").attr("aria-controls",n),this.position=this.$element.is(".position-left, .position-top, .position-right, .position-bottom")?this.$element.attr("class").match(/position\-(left|top|right|bottom)/)[1]:this.position,!0===this.options.contentOverlay&&(t=document.createElement("div"),e="fixed"===r()(this.$element).css("position")?"is-overlay-fixed":"is-overlay-absolute",t.setAttribute("class","js-off-canvas-overlay "+e),this.$overlay=r()(t),"is-overlay-fixed"==e?r()(this.$overlay).insertAfter(this.$element):this.$content.append(this.$overlay));var i=new RegExp(Object(s.RegExpEscape)(this.options.revealClass)+"([^\\s]+)","g").exec(this.$element[0].className);i&&(this.options.isRevealed=!0,this.options.revealOn=this.options.revealOn||i[1]),!0===this.options.isRevealed&&this.options.revealOn&&(this.$element.first().addClass("".concat(this.options.revealClass).concat(this.options.revealOn)),this._setMQChecker()),this.options.transitionTime&&this.$element.css("transition-duration",this.options.transitionTime),this.$sticky=this.$content.find("[data-off-canvas-sticky]"),0<this.$sticky.length&&"push"===this.options.transition&&(this.options.contentScroll=!1);var o=this.$element.attr("class").match(/\bin-canvas-for-(\w+)/);o&&2===o.length?this.options.inCanvasOn=o[1]:this.options.inCanvasOn&&this.$element.addClass("in-canvas-for-".concat(this.options.inCanvasOn)),this.options.inCanvasOn&&this._checkInCanvas(),this._removeContentClasses()}},{key:"_events",value:function(){var t=this;this.$element.off(".zf.trigger .zf.offCanvas").on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"keydown.zf.offCanvas":this._handleKeyboard.bind(this)}),!0===this.options.closeOnClick&&(this.options.contentOverlay?this.$overlay:this.$content).on({"click.zf.offCanvas":this.close.bind(this)}),this.options.inCanvasOn&&r()(window).on("changed.zf.mediaquery",function(){t._checkInCanvas()})}},{key:"_setMQChecker",value:function(){var t=this;this.onLoadListener=Object(s.onLoad)(r()(window),function(){l.MediaQuery.atLeast(t.options.revealOn)&&t.reveal(!0)}),r()(window).on("changed.zf.mediaquery",function(){l.MediaQuery.atLeast(t.options.revealOn)?t.reveal(!0):t.reveal(!1)})}},{key:"_checkInCanvas",value:function(){this.isInCanvas=l.MediaQuery.atLeast(this.options.inCanvasOn),!0===this.isInCanvas&&this.close()}},{key:"_removeContentClasses",value:function(t){"boolean"!=typeof t?this.$content.removeClass(this.contentClasses.base.join(" ")):!1===t&&this.$content.removeClass("has-reveal-".concat(this.position))}},{key:"_addContentClasses",value:function(t){this._removeContentClasses(t),"boolean"!=typeof t?this.$content.addClass("has-transition-".concat(this.options.transition," has-position-").concat(this.position)):!0===t&&this.$content.addClass("has-reveal-".concat(this.position))}},{key:"_fixStickyElements",value:function(){this.$sticky.each(function(t,e){var n,i,o=r()(e);"fixed"===o.css("position")&&(n=parseInt(o.css("top"),10),o.data("offCanvasSticky",{top:n}),i=r()(document).scrollTop()+n,o.css({top:"".concat(i,"px"),width:"100%",transition:"none"}))})}},{key:"_unfixStickyElements",value:function(){this.$sticky.each(function(t,e){var n=r()(e),i=n.data("offCanvasSticky");"object"===c(i)&&(n.css({top:"".concat(i.top,"px"),width:"",transition:""}),n.data("offCanvasSticky",""))})}},{key:"reveal",value:function(t){t?(this.close(),this.isRevealed=!0,this.$element.attr("aria-hidden","false"),this.$element.off("open.zf.trigger toggle.zf.trigger"),this.$element.removeClass("is-closed")):(this.isRevealed=!1,this.$element.attr("aria-hidden","true"),this.$element.off("open.zf.trigger toggle.zf.trigger").on({"open.zf.trigger":this.open.bind(this),"toggle.zf.trigger":this.toggle.bind(this)}),this.$element.addClass("is-closed")),this._addContentClasses(t)}},{key:"_stopScrolling",value:function(){return!1}},{key:"_recordScrollable",value:function(t){var e=this;e.scrollHeight!==e.clientHeight&&(0===e.scrollTop&&(e.scrollTop=1),e.scrollTop===e.scrollHeight-e.clientHeight&&(e.scrollTop=e.scrollHeight-e.clientHeight-1)),e.allowUp=0<e.scrollTop,e.allowDown=e.scrollTop<e.scrollHeight-e.clientHeight,e.lastY=t.originalEvent.pageY}},{key:"_stopScrollPropagation",value:function(t){var e,n=this,i=t.pageY<n.lastY,o=!i;n.lastY=t.pageY,i&&n.allowUp||o&&n.allowDown?(t.stopPropagation(),n.hasAttribute("data-off-canvas-scrollbox")&&(e=n.closest("[data-off-canvas], [data-off-canvas-scrollbox-outer]"),n.scrollTop<=1&&0<e.scrollTop?e.scrollTop--:n.scrollTop>=n.scrollHeight-n.clientHeight-1&&e.scrollTop<e.scrollHeight-e.clientHeight&&e.scrollTop++)):t.preventDefault()}},{key:"open",value:function(t,e){var n,i=this;this.$element.hasClass("is-open")||this.isRevealed||this.isInCanvas||(n=this,e&&(this.$lastTrigger=e),"top"===this.options.forceTo?window.scrollTo(0,0):"bottom"===this.options.forceTo&&window.scrollTo(0,document.body.scrollHeight),this.options.transitionTime&&"overlap"!==this.options.transition?this.$element.siblings("[data-off-canvas-content]").css("transition-duration",this.options.transitionTime):this.$element.siblings("[data-off-canvas-content]").css("transition-duration",""),this.$element.addClass("is-open").removeClass("is-closed"),this.$triggers.attr("aria-expanded","true"),this.$element.attr("aria-hidden","false"),this.$content.addClass("is-open-"+this.position),!1===this.options.contentScroll&&(r()("body").addClass("is-off-canvas-open").on("touchmove",this._stopScrolling),this.$element.on("touchstart",this._recordScrollable),this.$element.on("touchmove",this._stopScrollPropagation),this.$element.on("touchstart","[data-off-canvas-scrollbox]",this._recordScrollable),this.$element.on("touchmove","[data-off-canvas-scrollbox]",this._stopScrollPropagation)),!0===this.options.contentOverlay&&this.$overlay.addClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.addClass("is-closable"),!0===this.options.autoFocus&&this.$element.one(Object(s.transitionend)(this.$element),function(){var t;n.$element.hasClass("is-open")&&((t=n.$element.find("[data-autofocus]")).length?t.eq(0).focus():n.$element.find("a, button").eq(0).focus())}),!0===this.options.trapFocus&&(this.$content.attr("tabindex","-1"),a.Keyboard.trapFocus(this.$element)),"push"===this.options.transition&&this._fixStickyElements(),this._addContentClasses(),this.$element.trigger("opened.zf.offCanvas"),this.$element.one(Object(s.transitionend)(this.$element),function(){i.$element.trigger("openedEnd.zf.offCanvas")}))}},{key:"close",value:function(){var e=this;this.$element.hasClass("is-open")&&!this.isRevealed&&(this.$element.trigger("close.zf.offCanvas"),this.$element.removeClass("is-open"),this.$element.attr("aria-hidden","true"),this.$content.removeClass("is-open-left is-open-top is-open-right is-open-bottom"),!0===this.options.contentOverlay&&this.$overlay.removeClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.removeClass("is-closable"),this.$triggers.attr("aria-expanded","false"),this.$element.one(Object(s.transitionend)(this.$element),function(t){e.$element.addClass("is-closed"),e._removeContentClasses(),"push"===e.options.transition&&e._unfixStickyElements(),!1===e.options.contentScroll&&(r()("body").removeClass("is-off-canvas-open").off("touchmove",e._stopScrolling),e.$element.off("touchstart",e._recordScrollable),e.$element.off("touchmove",e._stopScrollPropagation),e.$element.off("touchstart","[data-off-canvas-scrollbox]",e._recordScrollable),e.$element.off("touchmove","[data-off-canvas-scrollbox]",e._stopScrollPropagation)),!0===e.options.trapFocus&&(e.$content.removeAttr("tabindex"),a.Keyboard.releaseFocus(e.$element)),e.$element.trigger("closed.zf.offCanvas")}))}},{key:"toggle",value:function(t,e){this.$element.hasClass("is-open")?this.close(t,e):this.open(t,e)}},{key:"_handleKeyboard",value:function(t){var e=this;a.Keyboard.handleKey(t,"OffCanvas",{close:function(){return e.close(),e.$lastTrigger.focus(),!0},handled:function(){t.preventDefault()}})}},{key:"_destroy",value:function(){this.close(),this.$element.off(".zf.trigger .zf.offCanvas"),this.$overlay.off(".zf.offCanvas"),this.onLoadListener&&r()(window).off(this.onLoadListener)}}])&&f(t.prototype,e),n&&f(t,n),i}();g.defaults={closeOnClick:!0,contentOverlay:!0,contentId:null,nested:null,contentScroll:!0,transitionTime:null,transition:"push",forceTo:null,isRevealed:!1,revealOn:null,inCanvasOn:null,autoFocus:!0,revealClass:"reveal-for-",trapFocus:!1}},"./js/foundation.orbit.js":function(t,e,n){n.r(e),n.d(e,"Orbit",function(){return v});var i=n("jquery"),s=n.n(i),o=n("./js/foundation.util.keyboard.js"),c=n("./js/foundation.util.motion.js"),r=n("./js/foundation.util.timer.js"),a=n("./js/foundation.util.imageLoader.js"),l=n("./js/foundation.core.utils.js"),u=n("./js/foundation.core.plugin.js"),f=n("./js/foundation.util.touch.js");function d(t){return(d="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function p(t,e){return!e||"object"!==d(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var v=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),p(this,g(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}(n,u["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=s.a.extend({},n.defaults,this.$element.data(),e),this.className="Orbit",f.Touch.init(s.a),this._init(),o.Keyboard.register("Orbit",{ltr:{ARROW_RIGHT:"next",ARROW_LEFT:"previous"},rtl:{ARROW_LEFT:"next",ARROW_RIGHT:"previous"}})}},{key:"_init",value:function(){this._reset(),this.$wrapper=this.$element.find(".".concat(this.options.containerClass)),this.$slides=this.$element.find(".".concat(this.options.slideClass));var t=this.$element.find("img"),e=this.$slides.filter(".is-active"),n=this.$element[0].id||Object(l.GetYoDigits)(6,"orbit");this.$element.attr({"data-resize":n,id:n}),e.length||this.$slides.eq(0).addClass("is-active"),this.options.useMUI||this.$slides.addClass("no-motionui"),t.length?Object(a.onImagesLoaded)(t,this._prepareForOrbit.bind(this)):this._prepareForOrbit(),this.options.bullets&&this._loadBullets(),this._events(),this.options.autoPlay&&1<this.$slides.length&&this.geoSync(),this.options.accessible&&this.$wrapper.attr("tabindex",0)}},{key:"_loadBullets",value:function(){this.$bullets=this.$element.find(".".concat(this.options.boxOfBullets)).find("button")}},{key:"geoSync",value:function(){var t=this;this.timer=new r.Timer(this.$element,{duration:this.options.timerDelay,infinite:!1},function(){t.changeSlide(!0)}),this.timer.start()}},{key:"_prepareForOrbit",value:function(){this._setWrapperHeight()}},{key:"_setWrapperHeight",value:function(t){var e,n=0,i=0,o=this;this.$slides.each(function(){e=this.getBoundingClientRect().height,s()(this).attr("data-slide",i),/mui/g.test(s()(this)[0].className)||o.$slides.filter(".is-active")[0]===o.$slides.eq(i)[0]||s()(this).css({display:"none"}),n=n<e?e:n,i++}),i===this.$slides.length&&(this.$wrapper.css({height:n}),t&&t(n))}},{key:"_setSlideHeight",value:function(t){this.$slides.each(function(){s()(this).css("max-height",t)})}},{key:"_events",value:function(){var i=this;this.$element.off(".resizeme.zf.trigger").on({"resizeme.zf.trigger":this._prepareForOrbit.bind(this)}),1<this.$slides.length&&(this.options.swipe&&this.$slides.off("swipeleft.zf.orbit swiperight.zf.orbit").on("swipeleft.zf.orbit",function(t){t.preventDefault(),i.changeSlide(!0)}).on("swiperight.zf.orbit",function(t){t.preventDefault(),i.changeSlide(!1)}),this.options.autoPlay&&(this.$slides.on("click.zf.orbit",function(){i.$element.data("clickedOn",!i.$element.data("clickedOn")),i.timer[i.$element.data("clickedOn")?"pause":"start"]()}),this.options.pauseOnHover&&this.$element.on("mouseenter.zf.orbit",function(){i.timer.pause()}).on("mouseleave.zf.orbit",function(){i.$element.data("clickedOn")||i.timer.start()})),this.options.navButtons&&this.$element.find(".".concat(this.options.nextClass,", .").concat(this.options.prevClass)).attr("tabindex",0).on("click.zf.orbit touchend.zf.orbit",function(t){t.preventDefault(),i.changeSlide(s()(this).hasClass(i.options.nextClass))}),this.options.bullets&&this.$bullets.on("click.zf.orbit touchend.zf.orbit",function(){if(/is-active/g.test(this.className))return!1;var t=s()(this).data("slide"),e=t>i.$slides.filter(".is-active").data("slide"),n=i.$slides.eq(t);i.changeSlide(e,n,t)}),this.options.accessible&&this.$wrapper.add(this.$bullets).on("keydown.zf.orbit",function(t){o.Keyboard.handleKey(t,"Orbit",{next:function(){i.changeSlide(!0)},previous:function(){i.changeSlide(!1)},handled:function(){s()(t.target).is(i.$bullets)&&i.$bullets.filter(".is-active").focus()}})}))}},{key:"_reset",value:function(){void 0!==this.$slides&&1<this.$slides.length&&(this.$element.off(".zf.orbit").find("*").off(".zf.orbit"),this.options.autoPlay&&this.timer.restart(),this.$slides.each(function(t){s()(t).removeClass("is-active is-active is-in").removeAttr("aria-live").hide()}),this.$slides.first().addClass("is-active").show(),this.$element.trigger("slidechange.zf.orbit",[this.$slides.first()]),this.options.bullets&&this._updateBullets(0))}},{key:"changeSlide",value:function(t,e,n){if(this.$slides){var i=this.$slides.filter(".is-active").eq(0);if(/mui/g.test(i[0].className))return!1;var o=this.$slides.first(),r=this.$slides.last(),s=t?"Right":"Left",a=t?"Left":"Right",l=this,u=e||(t?!this.options.infiniteWrap||i.next(".".concat(this.options.slideClass)).length?i.next(".".concat(this.options.slideClass)):o:!this.options.infiniteWrap||i.prev(".".concat(this.options.slideClass)).length?i.prev(".".concat(this.options.slideClass)):r);u.length&&(this.$element.trigger("beforeslidechange.zf.orbit",[i,u]),this.options.bullets&&(n=n||this.$slides.index(u),this._updateBullets(n)),this.options.useMUI&&!this.$element.is(":hidden")?(c.Motion.animateIn(u.addClass("is-active"),this.options["animInFrom".concat(s)],function(){u.css({display:"block"}).attr("aria-live","polite")}),c.Motion.animateOut(i.removeClass("is-active"),this.options["animOutTo".concat(a)],function(){i.removeAttr("aria-live"),l.options.autoPlay&&!l.timer.isPaused&&l.timer.restart()})):(i.removeClass("is-active is-in").removeAttr("aria-live").hide(),u.addClass("is-active is-in").attr("aria-live","polite").show(),this.options.autoPlay&&!this.timer.isPaused&&this.timer.restart()),this.$element.trigger("slidechange.zf.orbit",[u]))}}},{key:"_updateBullets",value:function(t){var e=this.$bullets.filter(".is-active"),n=this.$bullets.not(".is-active"),i=this.$bullets.eq(t);e.removeClass("is-active").blur(),i.addClass("is-active");var o,r=e.children("[data-slide-active-label]").last();r.length||(o=e.children("span"),n.toArray().map(function(t){return s()(t).children("span").length}).every(function(t){return t<o.length})&&(r=o.last()).attr("data-slide-active-label","")),r.length&&(r.detach(),i.append(r))}},{key:"_destroy",value:function(){this.$element.off(".zf.orbit").find("*").off(".zf.orbit").end().hide()}}])&&h(t.prototype,e),i&&h(t,i),n}();v.defaults={bullets:!0,navButtons:!0,animInFromRight:"slide-in-right",animOutToRight:"slide-out-right",animInFromLeft:"slide-in-left",animOutToLeft:"slide-out-left",autoPlay:!0,timerDelay:5e3,infiniteWrap:!0,swipe:!0,pauseOnHover:!0,accessible:!0,containerClass:"orbit-container",slideClass:"orbit-slide",boxOfBullets:"orbit-bullets",nextClass:"orbit-next",prevClass:"orbit-previous",useMUI:!0}},"./js/foundation.positionable.js":function(t,e,n){n.r(e),n.d(e,"Positionable",function(){return m});var s=n("./js/foundation.util.box.js"),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.core.utils.js");function i(t){return(i="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function a(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function l(t,e){return!e||"object"!==i(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var f=["left","right","top","bottom"],d=["top","bottom","center"],h=["left","right","center"],p={left:d,right:d,top:h,bottom:h};function g(t,e){var n=e.indexOf(t);return n===e.length-1?e[0]:e[n+1]}var m=function(){function t(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),l(this,u(t).apply(this,arguments))}var e,n,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(t,o["Plugin"]),e=t,(n=[{key:"_init",value:function(){this.triedPositions={},this.position="auto"===this.options.position?this._getDefaultPosition():this.options.position,this.alignment="auto"===this.options.alignment?this._getDefaultAlignment():this.options.alignment,this.originalPosition=this.position,this.originalAlignment=this.alignment}},{key:"_getDefaultPosition",value:function(){return"bottom"}},{key:"_getDefaultAlignment",value:function(){switch(this.position){case"bottom":case"top":return Object(r.rtl)()?"right":"left";case"left":case"right":return"bottom"}}},{key:"_reposition",value:function(){this._alignmentsExhausted(this.position)?(this.position=g(this.position,f),this.alignment=p[this.position][0]):this._realign()}},{key:"_realign",value:function(){this._addTriedPosition(this.position,this.alignment),this.alignment=g(this.alignment,p[this.position])}},{key:"_addTriedPosition",value:function(t,e){this.triedPositions[t]=this.triedPositions[t]||[],this.triedPositions[t].push(e)}},{key:"_positionsExhausted",value:function(){for(var t=!0,e=0;e<f.length;e++)t=t&&this._alignmentsExhausted(f[e]);return t}},{key:"_alignmentsExhausted",value:function(t){return this.triedPositions[t]&&this.triedPositions[t].length==p[t].length}},{key:"_getVOffset",value:function(){return this.options.vOffset}},{key:"_getHOffset",value:function(){return this.options.hOffset}},{key:"_setPosition",value:function(t,e,n){if("false"===t.attr("aria-expanded"))return!1;if(this.options.allowOverlap||(this.position=this.originalPosition,this.alignment=this.originalAlignment),e.offset(s.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset())),!this.options.allowOverlap){for(var i=1e8,o={position:this.position,alignment:this.alignment};!this._positionsExhausted();){var r=s.Box.OverlapArea(e,n,!1,!1,this.options.allowBottomOverlap);if(0===r)return;r<i&&(i=r,o={position:this.position,alignment:this.alignment}),this._reposition(),e.offset(s.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset()))}this.position=o.position,this.alignment=o.alignment,e.offset(s.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset()))}}}])&&a(e.prototype,n),i&&a(e,i),t}();m.defaults={position:"auto",alignment:"auto",allowOverlap:!1,allowBottomOverlap:!0,vOffset:0,hOffset:0}},"./js/foundation.responsiveAccordionTabs.js":function(t,e,n){n.r(e),n.d(e,"ResponsiveAccordionTabs",function(){return m});var i=n("jquery"),c=n.n(i),s=n("./js/foundation.util.mediaQuery.js"),f=n("./js/foundation.core.utils.js"),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.accordion.js");function a(t){return(a="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function l(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function u(t,e){return!e||"object"!==a(e)&&"function"!=typeof e?h(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g={tabs:{cssClass:"tabs",plugin:n("./js/foundation.tabs.js").Tabs,open:function(t,e){return t.selectTab(e)},close:null,toggle:null},accordion:{cssClass:"accordion",plugin:r.Accordion,open:function(t,e){return t.down(c()(e))},close:function(t,e){return t.up(c()(e))},toggle:function(t,e){return t.toggle(c()(e))}}},m=function(){function i(t,e){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),n=u(this,d(i).call(this,t,e)),u(n,n.options.reflow&&n.storezfData||h(n))}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(i,o["Plugin"]),t=i,(e=[{key:"_setup",value:function(t,e){this.$element=c()(t),this.$element.data("zfPluginBase",this),this.options=c.a.extend({},i.defaults,this.$element.data(),e),this.rules=this.$element.data("responsive-accordion-tabs"),this.currentMq=null,this.currentRule=null,this.currentPlugin=null,this.className="ResponsiveAccordionTabs",this.$element.attr("id")||this.$element.attr("id",Object(f.GetYoDigits)(6,"responsiveaccordiontabs")),this._init(),this._events()}},{key:"_init",value:function(){if(s.MediaQuery._init(),"string"==typeof this.rules){for(var t={},e=this.rules.split(" "),n=0;n<e.length;n++){var i=e[n].split("-"),o=1<i.length?i[0]:"small",r=1<i.length?i[1]:i[0];null!==g[r]&&(t[o]=g[r])}this.rules=t}this._getAllOptions(),c.a.isEmptyObject(this.rules)||this._checkMediaQueries()}},{key:"_getAllOptions",value:function(){for(var t in this.allOptions={},g)if(g.hasOwnProperty(t)){var e=g[t];try{var n,i,o=c()("<ul></ul>"),r=new e.plugin(o,this.options);for(n in r.options){r.options.hasOwnProperty(n)&&"zfPlugin"!==n&&(i=r.options[n],this.allOptions[n]=i)}r.destroy()}catch(t){}}}},{key:"_events",value:function(){this._changedZfMediaQueryHandler=this._checkMediaQueries.bind(this),c()(window).on("changed.zf.mediaquery",this._changedZfMediaQueryHandler)}},{key:"_checkMediaQueries",value:function(){var e,n=this;c.a.each(this.rules,function(t){s.MediaQuery.atLeast(t)&&(e=t)}),e&&(this.currentPlugin instanceof this.rules[e].plugin||(c.a.each(g,function(t,e){n.$element.removeClass(e.cssClass)}),this.$element.addClass(this.rules[e].cssClass),this.currentPlugin&&(!this.currentPlugin.$element.data("zfPlugin")&&this.storezfData&&this.currentPlugin.$element.data("zfPlugin",this.storezfData),this.currentPlugin.destroy()),this._handleMarkup(this.rules[e].cssClass),this.currentRule=this.rules[e],this.currentPlugin=new this.currentRule.plugin(this.$element,this.options),this.storezfData=this.currentPlugin.$element.data("zfPlugin")))}},{key:"_handleMarkup",value:function(t){var e,r,s,a,l,n,i=this,o="accordion",u=c()("[data-tabs-content="+this.$element.attr("id")+"]");u.length&&(o="tabs"),o!==t&&(e=i.allOptions.linkClass?i.allOptions.linkClass:"tabs-title",r=i.allOptions.panelClass?i.allOptions.panelClass:"tabs-panel",this.$element.removeAttr("role"),s=this.$element.children("."+e+",[data-accordion-item]").removeClass(e).removeClass("accordion-item").removeAttr("data-accordion-item"),a=s.children("a").removeClass("accordion-title"),"tabs"===o?(u=u.children("."+r).removeClass(r).removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby")).children("a").removeAttr("role").removeAttr("aria-controls").removeAttr("aria-selected"):u=s.children("[data-tab-content]").removeClass("accordion-content"),u.css({display:"",visibility:""}),s.css({display:"",visibility:""}),"accordion"===t?u.each(function(t,e){c()(e).appendTo(s.get(t)).addClass("accordion-content").attr("data-tab-content","").removeClass("is-active").css({height:""}),c()("[data-tabs-content="+i.$element.attr("id")+"]").after('<div id="tabs-placeholder-'+i.$element.attr("id")+'"></div>').detach(),s.addClass("accordion-item").attr("data-accordion-item",""),a.addClass("accordion-title")}):"tabs"===t&&(l=c()("[data-tabs-content="+i.$element.attr("id")+"]"),(n=c()("#tabs-placeholder-"+i.$element.attr("id"))).length?(l=c()('<div class="tabs-content"></div>').insertAfter(n).attr("data-tabs-content",i.$element.attr("id")),n.remove()):l=c()('<div class="tabs-content"></div>').insertAfter(i.$element).attr("data-tabs-content",i.$element.attr("id")),u.each(function(t,e){var n=c()(e).appendTo(l).addClass(r),i=a.get(t).hash.slice(1),o=c()(e).attr("id")||Object(f.GetYoDigits)(6,"accordion");i!==o&&(""!==i?c()(e).attr("id",i):(i=o,c()(e).attr("id",i),c()(a.get(t)).attr("href",c()(a.get(t)).attr("href").replace("#","")+"#"+i))),c()(s.get(t)).hasClass("is-active")&&n.addClass("is-active")}),s.addClass(e)))}},{key:"open",value:function(t){var e;if(this.currentRule&&"function"==typeof this.currentRule.open)return(e=this.currentRule).open.apply(e,[this.currentPlugin].concat(Array.prototype.slice.call(arguments)))}},{key:"close",value:function(t){var e;if(this.currentRule&&"function"==typeof this.currentRule.close)return(e=this.currentRule).close.apply(e,[this.currentPlugin].concat(Array.prototype.slice.call(arguments)))}},{key:"toggle",value:function(t){var e;if(this.currentRule&&"function"==typeof this.currentRule.toggle)return(e=this.currentRule).toggle.apply(e,[this.currentPlugin].concat(Array.prototype.slice.call(arguments)))}},{key:"_destroy",value:function(){this.currentPlugin&&this.currentPlugin.destroy(),c()(window).off("changed.zf.mediaquery",this._changedZfMediaQueryHandler)}}])&&l(t.prototype,e),n&&l(t,n),i}();m.defaults={}},"./js/foundation.responsiveMenu.js":function(t,e,n){n.r(e),n.d(e,"ResponsiveMenu",function(){return v});var i=n("jquery"),s=n.n(i),a=n("./js/foundation.util.mediaQuery.js"),l=n("./js/foundation.core.utils.js"),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.dropdownMenu.js"),u=n("./js/foundation.drilldown.js"),c=n("./js/foundation.accordionMenu.js");function f(t){return(f="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function d(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function h(t,e){return!e||"object"!==f(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function g(t,e){return(g=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var m={dropdown:{cssClass:"dropdown",plugin:r.DropdownMenu},drilldown:{cssClass:"drilldown",plugin:u.Drilldown},accordion:{cssClass:"accordion-menu",plugin:c.AccordionMenu}},v=function(){function t(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),h(this,p(t).apply(this,arguments))}var e,n,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&g(t,e)}(t,o["Plugin"]),e=t,(n=[{key:"_setup",value:function(t){this.$element=s()(t),this.rules=this.$element.data("responsive-menu"),this.currentMq=null,this.currentPlugin=null,this.className="ResponsiveMenu",this._init(),this._events()}},{key:"_init",value:function(){if(a.MediaQuery._init(),"string"==typeof this.rules){for(var t={},e=this.rules.split(" "),n=0;n<e.length;n++){var i=e[n].split("-"),o=1<i.length?i[0]:"small",r=1<i.length?i[1]:i[0];null!==m[r]&&(t[o]=m[r])}this.rules=t}s.a.isEmptyObject(this.rules)||this._checkMediaQueries(),this.$element.attr("data-mutate",this.$element.attr("data-mutate")||Object(l.GetYoDigits)(6,"responsive-menu"))}},{key:"_events",value:function(){var t=this;s()(window).on("changed.zf.mediaquery",function(){t._checkMediaQueries()})}},{key:"_checkMediaQueries",value:function(){var e,n=this;s.a.each(this.rules,function(t){a.MediaQuery.atLeast(t)&&(e=t)}),e&&(this.currentPlugin instanceof this.rules[e].plugin||(s.a.each(m,function(t,e){n.$element.removeClass(e.cssClass)}),this.$element.addClass(this.rules[e].cssClass),this.currentPlugin&&this.currentPlugin.destroy(),this.currentPlugin=new this.rules[e].plugin(this.$element,{})))}},{key:"_destroy",value:function(){this.currentPlugin.destroy(),s()(window).off(".zf.ResponsiveMenu")}}])&&d(e.prototype,n),i&&d(e,i),t}();v.defaults={}},"./js/foundation.responsiveToggle.js":function(t,e,n){n.r(e),n.d(e,"ResponsiveToggle",function(){return h});var i=n("jquery"),o=n.n(i),r=n("./js/foundation.util.mediaQuery.js"),s=n("./js/foundation.util.motion.js"),a=n("./js/foundation.core.plugin.js");function l(t){return(l="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var h=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),c(this,f(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(n,a["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=o()(t),this.options=o.a.extend({},n.defaults,this.$element.data(),e),this.className="ResponsiveToggle",this._init(),this._events()}},{key:"_init",value:function(){r.MediaQuery._init();var t,e=this.$element.data("responsive-toggle");e||console.error("Your tab bar needs an ID of a Menu as the value of data-tab-bar."),this.$targetMenu=o()("#".concat(e)),this.$toggler=this.$element.find("[data-toggle]").filter(function(){var t=o()(this).data("toggle");return t===e||""===t}),this.options=o.a.extend({},this.options,this.$targetMenu.data()),this.options.animate&&(t=this.options.animate.split(" "),this.animationIn=t[0],this.animationOut=t[1]||null),this._update()}},{key:"_events",value:function(){this._updateMqHandler=this._update.bind(this),o()(window).on("changed.zf.mediaquery",this._updateMqHandler),this.$toggler.on("click.zf.responsiveToggle",this.toggleMenu.bind(this))}},{key:"_update",value:function(){r.MediaQuery.atLeast(this.options.hideFor)?(this.$element.hide(),this.$targetMenu.show()):(this.$element.show(),this.$targetMenu.hide())}},{key:"toggleMenu",value:function(){var t=this;r.MediaQuery.atLeast(this.options.hideFor)||(this.options.animate?this.$targetMenu.is(":hidden")?s.Motion.animateIn(this.$targetMenu,this.animationIn,function(){t.$element.trigger("toggled.zf.responsiveToggle"),t.$targetMenu.find("[data-mutate]").triggerHandler("mutateme.zf.trigger")}):s.Motion.animateOut(this.$targetMenu,this.animationOut,function(){t.$element.trigger("toggled.zf.responsiveToggle")}):(this.$targetMenu.toggle(0),this.$targetMenu.find("[data-mutate]").trigger("mutateme.zf.trigger"),this.$element.trigger("toggled.zf.responsiveToggle")))}},{key:"_destroy",value:function(){this.$element.off(".zf.responsiveToggle"),this.$toggler.off(".zf.responsiveToggle"),o()(window).off("changed.zf.mediaquery",this._updateMqHandler)}}])&&u(t.prototype,e),i&&u(t,i),n}();h.defaults={hideFor:"medium",animate:!1}},"./js/foundation.reveal.js":function(t,e,n){n.r(e),n.d(e,"Reveal",function(){return v});var i=n("jquery"),s=n.n(i),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.core.utils.js"),a=n("./js/foundation.util.keyboard.js"),l=n("./js/foundation.util.mediaQuery.js"),u=n("./js/foundation.util.motion.js"),c=n("./js/foundation.util.triggers.js"),f=n("./js/foundation.util.touch.js");function d(t){return(d="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function p(t,e){return!e||"object"!==d(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var v=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),p(this,g(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=s.a.extend({},n.defaults,this.$element.data(),e),this.className="Reveal",this._init(),f.Touch.init(s.a),c.Triggers.init(s.a),a.Keyboard.register("Reveal",{ESCAPE:"close"})}},{key:"_init",value:function(){var t=this;l.MediaQuery._init(),this.id=this.$element.attr("id"),this.isActive=!1,this.cached={mq:l.MediaQuery.current},this.$anchor=s()('[data-open="'.concat(this.id,'"]')).length?s()('[data-open="'.concat(this.id,'"]')):s()('[data-toggle="'.concat(this.id,'"]')),this.$anchor.attr({"aria-controls":this.id,"aria-haspopup":!0,tabindex:0}),(this.options.fullScreen||this.$element.hasClass("full"))&&(this.options.fullScreen=!0,this.options.overlay=!1),this.options.overlay&&!this.$overlay&&(this.$overlay=this._makeOverlay(this.id)),this.$element.attr({role:"dialog","aria-hidden":!0,"data-yeti-box":this.id,"data-resize":this.id}),this.$overlay?this.$element.detach().appendTo(this.$overlay):(this.$element.detach().appendTo(s()(this.options.appendTo)),this.$element.addClass("without-overlay")),this._events(),this.options.deepLink&&window.location.hash==="#".concat(this.id)&&(this.onLoadListener=Object(r.onLoad)(s()(window),function(){return t.open()}))}},{key:"_makeOverlay",value:function(){var t="";return this.options.additionalOverlayClasses&&(t=" "+this.options.additionalOverlayClasses),s()("<div></div>").addClass("reveal-overlay"+t).appendTo(this.options.appendTo)}},{key:"_updatePosition",value:function(){var t=this.$element.outerWidth(),e=s()(window).width(),n=this.$element.outerHeight(),i=s()(window).height(),o=null,r="auto"===this.options.hOffset?parseInt((e-t)/2,10):parseInt(this.options.hOffset,10);"auto"===this.options.vOffset?o=i<n?parseInt(Math.min(100,i/10),10):parseInt((i-n)/4,10):null!==this.options.vOffset&&(o=parseInt(this.options.vOffset,10)),null!==o&&this.$element.css({top:o+"px"}),this.$overlay&&"auto"===this.options.hOffset||(this.$element.css({left:r+"px"}),this.$element.css({margin:"0px"}))}},{key:"_events",value:function(){var n=this,i=this;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":function(t,e){if(t.target===i.$element[0]||s()(t.target).parents("[data-closable]")[0]===e)return n.close.apply(n)},"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":function(){i._updatePosition()}}),this.options.closeOnClick&&this.options.overlay&&this.$overlay.off(".zf.reveal").on("click.zf.dropdown tap.zf.dropdown",function(t){t.target!==i.$element[0]&&!s.a.contains(i.$element[0],t.target)&&s.a.contains(document,t.target)&&i.close()}),this.options.deepLink&&s()(window).on("hashchange.zf.reveal:".concat(this.id),this._handleState.bind(this))}},{key:"_handleState",value:function(){window.location.hash!=="#"+this.id||this.isActive?this.close():this.open()}},{key:"_disableScroll",value:function(t){t=t||s()(window).scrollTop(),s()(document).height()>s()(window).height()&&s()("html").css("top",-t)}},{key:"_enableScroll",value:function(t){t=t||parseInt(s()("html").css("top")),s()(document).height()>s()(window).height()&&(s()("html").css("top",""),s()(window).scrollTop(-t))}},{key:"open",value:function(){var t=this,e="#".concat(this.id);this.options.deepLink&&window.location.hash!==e&&(window.history.pushState?this.options.updateHistory?window.history.pushState({},"",e):window.history.replaceState({},"",e):window.location.hash=e),this.$activeAnchor=s()(document.activeElement).is(this.$anchor)?s()(document.activeElement):this.$anchor,this.isActive=!0,this.$element.css({visibility:"hidden"}).show().scrollTop(0),this.options.overlay&&this.$overlay.css({visibility:"hidden"}).show(),this._updatePosition(),this.$element.hide().css({visibility:""}),this.$overlay&&(this.$overlay.css({visibility:""}).hide(),this.$element.hasClass("fast")?this.$overlay.addClass("fast"):this.$element.hasClass("slow")&&this.$overlay.addClass("slow")),this.options.multipleOpened||this.$element.trigger("closeme.zf.reveal",this.id),0===s()(".reveal:visible").length&&this._disableScroll();var n=this;this.options.animationIn?(this.options.overlay&&u.Motion.animateIn(this.$overlay,"fade-in"),u.Motion.animateIn(this.$element,this.options.animationIn,function(){t.$element&&(t.focusableElements=a.Keyboard.findFocusable(t.$element),n.$element.attr({"aria-hidden":!1,tabindex:-1}).focus(),n._addGlobalClasses(),a.Keyboard.trapFocus(n.$element))})):(this.options.overlay&&this.$overlay.show(0),this.$element.show(this.options.showDelay)),this.$element.attr({"aria-hidden":!1,tabindex:-1}).focus(),a.Keyboard.trapFocus(this.$element),this._addGlobalClasses(),this._addGlobalListeners(),this.$element.trigger("open.zf.reveal")}},{key:"_addGlobalClasses",value:function(){function t(){s()("html").toggleClass("zf-has-scroll",!!(s()(document).height()>s()(window).height()))}this.$element.on("resizeme.zf.trigger.revealScrollbarListener",t),t(),s()("html").addClass("is-reveal-open")}},{key:"_removeGlobalClasses",value:function(){this.$element.off("resizeme.zf.trigger.revealScrollbarListener"),s()("html").removeClass("is-reveal-open"),s()("html").removeClass("zf-has-scroll")}},{key:"_addGlobalListeners",value:function(){var e=this;this.$element&&(this.focusableElements=a.Keyboard.findFocusable(this.$element),this.options.overlay||!this.options.closeOnClick||this.options.fullScreen||s()("body").on("click.zf.dropdown tap.zf.dropdown",function(t){t.target!==e.$element[0]&&!s.a.contains(e.$element[0],t.target)&&s.a.contains(document,t.target)&&e.close()}),this.options.closeOnEsc&&s()(window).on("keydown.zf.reveal",function(t){a.Keyboard.handleKey(t,"Reveal",{close:function(){e.options.closeOnEsc&&e.close()}})}))}},{key:"close",value:function(){if(!this.isActive||!this.$element.is(":visible"))return!1;var t,e=this;function n(){var t=parseInt(s()("html").css("top"));0===s()(".reveal:visible").length&&e._removeGlobalClasses(),a.Keyboard.releaseFocus(e.$element),e.$element.attr("aria-hidden",!0),0===s()(".reveal:visible").length&&e._enableScroll(t),e.$element.trigger("closed.zf.reveal")}this.options.animationOut?(this.options.overlay&&u.Motion.animateOut(this.$overlay,"fade-out"),u.Motion.animateOut(this.$element,this.options.animationOut,n)):(this.$element.hide(this.options.hideDelay),this.options.overlay?this.$overlay.hide(0,n):n()),this.options.closeOnEsc&&s()(window).off("keydown.zf.reveal"),!this.options.overlay&&this.options.closeOnClick&&s()("body").off("click.zf.dropdown tap.zf.dropdown"),this.$element.off("keydown.zf.reveal"),this.options.resetOnClose&&this.$element.html(this.$element.html()),this.isActive=!1,e.options.deepLink&&window.location.hash==="#".concat(this.id)&&(window.history.replaceState?(t=window.location.pathname+window.location.search,this.options.updateHistory?window.history.pushState({},"",t):window.history.replaceState("",document.title,t)):window.location.hash=""),this.$activeAnchor.focus()}},{key:"toggle",value:function(){this.isActive?this.close():this.open()}},{key:"_destroy",value:function(){this.options.overlay&&(this.$element.appendTo(s()(this.options.appendTo)),this.$overlay.hide().off().remove()),this.$element.hide().off(),this.$anchor.off(".zf"),s()(window).off(".zf.reveal:".concat(this.id)),this.onLoadListener&&s()(window).off(this.onLoadListener),0===s()(".reveal:visible").length&&this._removeGlobalClasses()}}])&&h(t.prototype,e),i&&h(t,i),n}();v.defaults={animationIn:"",animationOut:"",showDelay:0,hideDelay:0,closeOnClick:!0,closeOnEsc:!0,multipleOpened:!1,vOffset:"auto",hOffset:"auto",fullScreen:!1,overlay:!0,resetOnClose:!1,deepLink:!1,updateHistory:!1,appendTo:"body",additionalOverlayClasses:""}},"./js/foundation.slider.js":function(t,e,n){n.r(e),n.d(e,"Slider",function(){return h});var i=n("jquery"),p=n.n(i),s=n("./js/foundation.util.keyboard.js"),b=n("./js/foundation.util.motion.js"),g=n("./js/foundation.core.utils.js"),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.util.touch.js"),a=n("./js/foundation.util.triggers.js");function l(t){return(l="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var h=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),c(this,f(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=p.a.extend({},n.defaults,this.$element.data(),e),this.className="Slider",r.Touch.init(p.a),a.Triggers.init(p.a),this._init(),s.Keyboard.register("Slider",{ltr:{ARROW_RIGHT:"increase",ARROW_UP:"increase",ARROW_DOWN:"decrease",ARROW_LEFT:"decrease",SHIFT_ARROW_RIGHT:"increase_fast",SHIFT_ARROW_UP:"increase_fast",SHIFT_ARROW_DOWN:"decrease_fast",SHIFT_ARROW_LEFT:"decrease_fast",HOME:"min",END:"max"},rtl:{ARROW_LEFT:"increase",ARROW_RIGHT:"decrease",SHIFT_ARROW_LEFT:"increase_fast",SHIFT_ARROW_RIGHT:"decrease_fast"}})}},{key:"_init",value:function(){this.inputs=this.$element.find("input"),this.handles=this.$element.find("[data-slider-handle]"),this.$handle=this.handles.eq(0),this.$input=this.inputs.length?this.inputs.eq(0):p()("#".concat(this.$handle.attr("aria-controls"))),this.$fill=this.$element.find("[data-slider-fill]").css(this.options.vertical?"height":"width",0);(this.options.disabled||this.$element.hasClass(this.options.disabledClass))&&(this.options.disabled=!0,this.$element.addClass(this.options.disabledClass)),this.inputs.length||(this.inputs=p()().add(this.$input),this.options.binding=!0),this._setInitAttr(0),this.handles[1]&&(this.options.doubleSided=!0,this.$handle2=this.handles.eq(1),this.$input2=1<this.inputs.length?this.inputs.eq(1):p()("#".concat(this.$handle2.attr("aria-controls"))),this.inputs[1]||(this.inputs=this.inputs.add(this.$input2)),this._setInitAttr(1)),this.setHandles(),this._events()}},{key:"setHandles",value:function(){var t=this;this.handles[1]?this._setHandlePos(this.$handle,this.inputs.eq(0).val(),function(){t._setHandlePos(t.$handle2,t.inputs.eq(1).val())}):this._setHandlePos(this.$handle,this.inputs.eq(0).val())}},{key:"_reflow",value:function(){this.setHandles()}},{key:"_pctOfBar",value:function(t){var e=m(t-this.options.start,this.options.end-this.options.start);switch(this.options.positionValueFunction){case"pow":e=this._logTransform(e);break;case"log":e=this._powTransform(e)}return e.toFixed(2)}},{key:"_value",value:function(t){switch(this.options.positionValueFunction){case"pow":t=this._powTransform(t);break;case"log":t=this._logTransform(t)}var e=this.options.vertical?parseFloat(this.options.end)+t*(this.options.start-this.options.end):(this.options.end-this.options.start)*t+parseFloat(this.options.start);return e}},{key:"_logTransform",value:function(t){return e=this.options.nonLinearBase,n=t*(this.options.nonLinearBase-1)+1,Math.log(n)/Math.log(e);var e,n}},{key:"_powTransform",value:function(t){return(Math.pow(this.options.nonLinearBase,t)-1)/(this.options.nonLinearBase-1)}},{key:"_setHandlePos",value:function(t,e,n){var i,o,r,s,a,l,u,c,f,d,h,p,g,m,v,y;this.$element.hasClass(this.options.disabledClass)||((e=parseFloat(e))<this.options.start?e=this.options.start:e>this.options.end&&(e=this.options.end),(i=this.options.doubleSided)&&(e=0===this.handles.index(t)?(o=parseFloat(this.$handle2.attr("aria-valuenow")))<=e?o-this.options.step:e:e<=(r=parseFloat(this.$handle.attr("aria-valuenow")))?r+this.options.step:e),a=(s=this).options.vertical,l=a?"height":"width",u=a?"top":"left",c=t[0].getBoundingClientRect()[l],f=this.$element[0].getBoundingClientRect()[l],d=this._pctOfBar(e),h=((f-c)*d/f*100).toFixed(this.options.decimal),e=parseFloat(e.toFixed(this.options.decimal)),p={},this._setValues(t,e),i&&(g=~~(c/f*100),0===this.handles.index(t)?(p[u]="".concat(h,"%"),v=parseFloat(this.$handle2[0].style[u])-h+g,n&&"function"==typeof n&&n()):(m=parseFloat(this.$handle[0].style[u]),v=h-(isNaN(m)?(this.options.initialStart-this.options.start)/((this.options.end-this.options.start)/100):m)+g),p["min-".concat(l)]="".concat(v,"%")),this.$element.one("finished.zf.animate",function(){s.$element.trigger("moved.zf.slider",[t])}),y=this.$element.data("dragging")?1e3/60:this.options.moveTime,Object(b.Move)(y,t,function(){isNaN(h)?t.css(u,"".concat(100*d,"%")):t.css(u,"".concat(h,"%")),s.options.doubleSided?s.$fill.css(p):s.$fill.css(l,"".concat(100*d,"%"))}),clearTimeout(s.timeout),s.timeout=setTimeout(function(){s.$element.trigger("changed.zf.slider",[t])},s.options.changedDelay))}},{key:"_setInitAttr",value:function(t){var e=0===t?this.options.initialStart:this.options.initialEnd,n=this.inputs.eq(t).attr("id")||Object(g.GetYoDigits)(6,"slider");this.inputs.eq(t).attr({id:n,max:this.options.end,min:this.options.start,step:this.options.step}),this.inputs.eq(t).val(e),this.handles.eq(t).attr({role:"slider","aria-controls":n,"aria-valuemax":this.options.end,"aria-valuemin":this.options.start,"aria-valuenow":e,"aria-orientation":this.options.vertical?"vertical":"horizontal",tabindex:0})}},{key:"_setValues",value:function(t,e){var n=this.options.doubleSided?this.handles.index(t):0;this.inputs.eq(n).val(e),t.attr("aria-valuenow",e)}},{key:"_handleEvent",value:function(t,e,n){var i,o,r,s,a,l,u,c,f,d,h;n?h=this._adjustValue(null,n):(t.preventDefault(),o=(i=this.options.vertical)?"height":"width",r=i?"top":"left",s=i?t.pageY:t.pageX,a=this.$element[0].getBoundingClientRect()[o],l=i?p()(window).scrollTop():p()(window).scrollLeft(),u=this.$element.offset()[r],t.clientY===t.pageY&&(s+=l),d=(f=(c=s-u)<0?0:a<c?a:c)/a,h=this._value(d),Object(g.rtl)()&&!this.options.vertical&&(h=this.options.end-h),h=this._adjustValue(null,h),e=e||(v(this.$handle,r,f,o)<=v(this.$handle2,r,f,o)?this.$handle:this.$handle2)),this._setHandlePos(e,h)}},{key:"_adjustValue",value:function(t,e){var n=this.options.step,i=parseFloat(n/2),o=t?parseFloat(t.attr("aria-valuenow")):e,r=0<=o?o%n:n+o%n,s=o-r;return 0===r?o:o=s+i<=o?s+n:s}},{key:"_events",value:function(){this._eventsForHandle(this.$handle),this.handles[1]&&this._eventsForHandle(this.$handle2)}},{key:"_eventsForHandle",value:function(e){function n(t){var e=r.inputs.index(p()(this));r._handleEvent(t,r.handles.eq(e),p()(this).val())}var i,o,r=this;this.inputs.off("keyup.zf.slider").on("keyup.zf.slider",function(t){13==t.keyCode&&n.call(this,t)}),this.inputs.off("change.zf.slider").on("change.zf.slider",n),this.options.clickSelect&&this.$element.off("click.zf.slider").on("click.zf.slider",function(t){return!r.$element.data("dragging")&&void(p()(t.target).is("[data-slider-handle]")||(r.options.doubleSided?r._handleEvent(t):r._handleEvent(t,r.$handle)))}),this.options.draggable&&(this.handles.addTouch(),o=p()("body"),e.off("mousedown.zf.slider").on("mousedown.zf.slider",function(t){e.addClass("is-dragging"),r.$fill.addClass("is-dragging"),r.$element.data("dragging",!0),i=p()(t.currentTarget),o.on("mousemove.zf.slider",function(t){t.preventDefault(),r._handleEvent(t,i)}).on("mouseup.zf.slider",function(t){r._handleEvent(t,i),e.removeClass("is-dragging"),r.$fill.removeClass("is-dragging"),r.$element.data("dragging",!1),o.off("mousemove.zf.slider mouseup.zf.slider")})}).on("selectstart.zf.slider touchmove.zf.slider",function(t){t.preventDefault()})),e.off("keydown.zf.slider").on("keydown.zf.slider",function(t){var e,n=p()(this),i=r.options.doubleSided?r.handles.index(n):0,o=parseFloat(r.inputs.eq(i).val());s.Keyboard.handleKey(t,"Slider",{decrease:function(){e=o-r.options.step},increase:function(){e=o+r.options.step},decrease_fast:function(){e=o-10*r.options.step},increase_fast:function(){e=o+10*r.options.step},min:function(){e=r.options.start},max:function(){e=r.options.end},handled:function(){t.preventDefault(),r._setHandlePos(n,e)}})})}},{key:"_destroy",value:function(){this.handles.off(".zf.slider"),this.inputs.off(".zf.slider"),this.$element.off(".zf.slider"),clearTimeout(this.timeout)}}])&&u(t.prototype,e),i&&u(t,i),n}();function m(t,e){return t/e}function v(t,e,n,i){return Math.abs(t.position()[e]+t[i]()/2-n)}h.defaults={start:0,end:100,step:1,initialStart:0,initialEnd:100,binding:!1,clickSelect:!0,vertical:!1,draggable:!0,disabled:!1,doubleSided:!1,decimal:2,moveTime:200,disabledClass:"disabled",invertVertical:!1,changedDelay:500,nonLinearBase:5,positionValueFunction:"linear"}},"./js/foundation.smoothScroll.js":function(t,e,n){n.r(e),n.d(e,"SmoothScroll",function(){return a});var i=n("jquery"),l=n.n(i),o=n("./js/foundation.core.utils.js"),r=n("./js/foundation.core.plugin.js");function s(t){return(s="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function u(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e){return!e||"object"!==s(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=function(){function a(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),c(this,f(a).apply(this,arguments))}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(a,r["Plugin"]),t=a,n=[{key:"scrollToLoc",value:function(t,e,n){var i=1<arguments.length&&void 0!==e?e:a.defaults,o=2<arguments.length?n:void 0,r=l()(t);if(!r.length)return!1;var s=Math.round(r.offset().top-i.threshold/2-i.offset);l()("html, body").stop(!0).animate({scrollTop:s},i.animationDuration,i.animationEasing,function(){"function"==typeof o&&o()})}}],(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=l.a.extend({},a.defaults,this.$element.data(),e),this.className="SmoothScroll",this._init()}},{key:"_init",value:function(){var t=this.$element[0].id||Object(o.GetYoDigits)(6,"smooth-scroll");this.$element.attr({id:t}),this._events()}},{key:"_events",value:function(){this._linkClickListener=this._handleLinkClick.bind(this),this.$element.on("click.zf.smoothScroll",this._linkClickListener),this.$element.on("click.zf.smoothScroll",'a[href^="#"]',this._linkClickListener)}},{key:"_handleLinkClick",value:function(t){var e,n=this;l()(t.currentTarget).is('a[href^="#"]')&&(e=t.currentTarget.getAttribute("href"),this._inTransition=!0,a.scrollToLoc(e,this.options,function(){n._inTransition=!1}),t.preventDefault())}},{key:"_destroy",value:function(){this.$element.off("click.zf.smoothScroll",this._linkClickListener),this.$element.off("click.zf.smoothScroll",'a[href^="#"]',this._linkClickListener)}}])&&u(t.prototype,e),n&&u(t,n),a}();a.defaults={animationDuration:500,animationEasing:"linear",threshold:50,offset:0}},"./js/foundation.sticky.js":function(t,e,n){n.r(e),n.d(e,"Sticky",function(){return p});var i=n("jquery"),a=n.n(i),o=n("./js/foundation.core.plugin.js"),r=n("./js/foundation.core.utils.js"),l=n("./js/foundation.util.mediaQuery.js"),s=n("./js/foundation.util.triggers.js");function u(t){return(u="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=a.a.extend({},n.defaults,this.$element.data(),e),this.className="Sticky",s.Triggers.init(a.a),this._init()}},{key:"_init",value:function(){l.MediaQuery._init();var t=this.$element.parent("[data-sticky-container]"),e=this.$element[0].id||Object(r.GetYoDigits)(6,"sticky"),n=this;t.length?this.$container=t:(this.wasWrapped=!0,this.$element.wrap(this.options.container),this.$container=this.$element.parent()),this.$container.addClass(this.options.containerClass),this.$element.addClass(this.options.stickyClass).attr({"data-resize":e,"data-mutate":e}),""!==this.options.anchor&&a()("#"+n.options.anchor).attr({"data-mutate":e}),this.scrollCount=this.options.checkEvery,this.isStuck=!1,this.onLoadListener=Object(r.onLoad)(a()(window),function(){n.containerHeight="none"==n.$element.css("display")?0:n.$element[0].getBoundingClientRect().height,n.$container.css("height",n.containerHeight),n.elemHeight=n.containerHeight,""!==n.options.anchor?n.$anchor=a()("#"+n.options.anchor):n._parsePoints(),n._setSizes(function(){var t=window.pageYOffset;n._calc(!1,t),n.isStuck||n._removeSticky(!(t>=n.topPoint))}),n._events(e.split("-").reverse().join("-"))})}},{key:"_parsePoints",value:function(){for(var t,e,n,i=[""==this.options.topAnchor?1:this.options.topAnchor,""==this.options.btmAnchor?document.documentElement.scrollHeight:this.options.btmAnchor],o={},r=0,s=i.length;r<s&&i[r];r++){"number"==typeof i[r]?n=i[r]:(t=i[r].split(":"),n=(e=a()("#".concat(t[0]))).offset().top,t[1]&&"bottom"===t[1].toLowerCase()&&(n+=e[0].getBoundingClientRect().height)),o[r]=n}this.points=o}},{key:"_events",value:function(n){var i=this,t=this.scrollListener="scroll.zf.".concat(n);this.isOn||(this.canStick&&(this.isOn=!0,a()(window).off(t).on(t,function(t){0===i.scrollCount?(i.scrollCount=i.options.checkEvery,i._setSizes(function(){i._calc(!1,window.pageYOffset)})):(i.scrollCount--,i._calc(!1,window.pageYOffset))})),this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger",function(t,e){i._eventsHandler(n)}),this.$element.on("mutateme.zf.trigger",function(t,e){i._eventsHandler(n)}),this.$anchor&&this.$anchor.on("mutateme.zf.trigger",function(t,e){i._eventsHandler(n)}))}},{key:"_eventsHandler",value:function(t){var e=this,n=this.scrollListener="scroll.zf.".concat(t);e._setSizes(function(){e._calc(!1),e.canStick?e.isOn||e._events(t):e.isOn&&e._pauseListeners(n)})}},{key:"_pauseListeners",value:function(t){this.isOn=!1,a()(window).off(t),this.$element.trigger("pause.zf.sticky")}},{key:"_calc",value:function(t,e){if(t&&this._setSizes(),!this.canStick)return this.isStuck&&this._removeSticky(!0),!1;(e=e||window.pageYOffset)>=this.topPoint?e<=this.bottomPoint?this.isStuck||this._setSticky():this.isStuck&&this._removeSticky(!1):this.isStuck&&this._removeSticky(!0)}},{key:"_setSticky",value:function(){var t=this,e=this.options.stickTo,n="top"===e?"marginTop":"marginBottom",i="top"===e?"bottom":"top",o={};o[n]="".concat(this.options[n],"em"),o[e]=0,o[i]="auto",this.isStuck=!0,this.$element.removeClass("is-anchored is-at-".concat(i)).addClass("is-stuck is-at-".concat(e)).css(o).trigger("sticky.zf.stuckto:".concat(e)),this.$element.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",function(){t._setSizes()})}},{key:"_removeSticky",value:function(t){var e=this.options.stickTo,n="top"===e,i={},o=(this.points?this.points[1]-this.points[0]:this.anchorHeight)-this.elemHeight,r=t?"top":"bottom";i[n?"marginTop":"marginBottom"]=0,i.bottom="auto",i.top=t?0:o,this.isStuck=!1,this.$element.removeClass("is-stuck is-at-".concat(e)).addClass("is-anchored is-at-".concat(r)).css(i).trigger("sticky.zf.unstuckfrom:".concat(r))}},{key:"_setSizes",value:function(t){this.canStick=l.MediaQuery.is(this.options.stickyOn),this.canStick||t&&"function"==typeof t&&t();var e,n,i=this.$container[0].getBoundingClientRect().width,o=window.getComputedStyle(this.$container[0]),r=parseInt(o["padding-left"],10),s=parseInt(o["padding-right"],10);this.$anchor&&this.$anchor.length?this.anchorHeight=this.$anchor[0].getBoundingClientRect().height:this._parsePoints(),this.$element.css({"max-width":"".concat(i-r-s,"px")}),!this.options.dynamicHeight&&this.containerHeight||(e=this.$element[0].getBoundingClientRect().height||this.containerHeight,e="none"==this.$element.css("display")?0:e,this.$container.css("height",e),this.containerHeight=e),this.elemHeight=this.containerHeight,this.isStuck||this.$element.hasClass("is-at-bottom")&&(n=(this.points?this.points[1]-this.$container.offset().top:this.anchorHeight)-this.elemHeight,this.$element.css("top",n)),this._setBreakPoints(this.containerHeight,function(){t&&"function"==typeof t&&t()})}},{key:"_setBreakPoints",value:function(t,e){if(!this.canStick){if(!e||"function"!=typeof e)return!1;e()}var n=g(this.options.marginTop),i=g(this.options.marginBottom),o=this.points?this.points[0]:this.$anchor.offset().top,r=this.points?this.points[1]:o+this.anchorHeight,s=window.innerHeight;"top"===this.options.stickTo?(o-=n,r-=t+n):"bottom"===this.options.stickTo&&(o-=s-(t+i),r-=s-i),this.topPoint=o,this.bottomPoint=r,e&&"function"==typeof e&&e()}},{key:"_destroy",value:function(){this._removeSticky(!0),this.$element.removeClass("".concat(this.options.stickyClass," is-anchored is-at-top")).css({height:"",top:"",bottom:"","max-width":""}).off("resizeme.zf.trigger").off("mutateme.zf.trigger"),this.$anchor&&this.$anchor.length&&this.$anchor.off("change.zf.sticky"),this.scrollListener&&a()(window).off(this.scrollListener),this.onLoadListener&&a()(window).off(this.onLoadListener),this.wasWrapped?this.$element.unwrap():this.$container.removeClass(this.options.containerClass).css({height:""})}}])&&c(t.prototype,e),i&&c(t,i),n}();function g(t){return parseInt(window.getComputedStyle(document.body,null).fontSize,10)*t}p.defaults={container:"<div data-sticky-container></div>",stickTo:"top",anchor:"",topAnchor:"",btmAnchor:"",marginTop:1,marginBottom:1,stickyOn:"medium",stickyClass:"sticky",containerClass:"sticky-container",dynamicHeight:!0,checkEvery:-1}},"./js/foundation.tabs.js":function(t,e,n){n.r(e),n.d(e,"Tabs",function(){return p});var i=n("jquery"),a=n.n(i),o=n("./js/foundation.core.plugin.js"),l=n("./js/foundation.core.utils.js"),s=n("./js/foundation.util.keyboard.js"),u=n("./js/foundation.util.imageLoader.js");function r(t){return(r="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,o["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=a.a.extend({},n.defaults,this.$element.data(),e),this.className="Tabs",this._init(),s.Keyboard.register("Tabs",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"previous",ARROW_DOWN:"next",ARROW_LEFT:"previous"})}},{key:"_init",value:function(){var t,r=this,s=this;this._isInitializing=!0,this.$element.attr({role:"tablist"}),this.$tabTitles=this.$element.find(".".concat(this.options.linkClass)),this.$tabContent=a()('[data-tabs-content="'.concat(this.$element[0].id,'"]')),this.$tabTitles.each(function(){var t=a()(this),e=t.find("a"),n=t.hasClass("".concat(s.options.linkActiveClass)),i=e.attr("data-tabs-target")||e[0].hash.slice(1),o=e[0].id?e[0].id:"".concat(i,"-label"),r=a()("#".concat(i));t.attr({role:"presentation"}),e.attr({role:"tab","aria-controls":i,"aria-selected":n,id:o,tabindex:n?"0":"-1"}),r.attr({role:"tabpanel","aria-labelledby":o}),n&&(s._initialAnchor="#".concat(i)),n||r.attr("aria-hidden","true"),n&&s.options.autoFocus&&(s.onLoadListener=Object(l.onLoad)(a()(window),function(){a()("html, body").animate({scrollTop:t.offset().top},s.options.deepLinkSmudgeDelay,function(){e.focus()})}))}),this.options.matchHeight&&((t=this.$tabContent.find("img")).length?Object(u.onImagesLoaded)(t,this._setHeight.bind(this)):this._setHeight()),this._checkDeepLink=function(){var t=window.location.hash;if(!t.length){if(r._isInitializing)return;r._initialAnchor&&(t=r._initialAnchor)}var e,n=0<=t.indexOf("#")?t.slice(1):t,i=n&&a()("#".concat(n)),o=t&&r.$element.find('[href$="'.concat(t,'"],[data-tabs-target="').concat(n,'"]')).first();!i.length||!o.length||(i&&i.length&&o&&o.length?r.selectTab(i,!0):r._collapse(),r.options.deepLinkSmudge&&(e=r.$element.offset(),a()("html, body").animate({scrollTop:e.top},r.options.deepLinkSmudgeDelay)),r.$element.trigger("deeplink.zf.tabs",[o,i]))},this.options.deepLink&&this._checkDeepLink(),this._events(),this._isInitializing=!1}},{key:"_events",value:function(){this._addKeyHandler(),this._addClickHandler(),this._setHeightMqHandler=null,this.options.matchHeight&&(this._setHeightMqHandler=this._setHeight.bind(this),a()(window).on("changed.zf.mediaquery",this._setHeightMqHandler)),this.options.deepLink&&a()(window).on("hashchange",this._checkDeepLink)}},{key:"_addClickHandler",value:function(){var e=this;this.$element.off("click.zf.tabs").on("click.zf.tabs",".".concat(this.options.linkClass),function(t){t.preventDefault(),e._handleTabChange(a()(this))})}},{key:"_addKeyHandler",value:function(){var r=this;this.$tabTitles.off("keydown.zf.tabs").on("keydown.zf.tabs",function(t){var e,n,i,o;9!==t.which&&(e=a()(this),(n=e.parent("ul").children("li")).each(function(t){a()(this).is(e)&&(o=r.options.wrapOnKeys?(i=0===t?n.last():n.eq(t-1),t===n.length-1?n.first():n.eq(t+1)):(i=n.eq(Math.max(0,t-1)),n.eq(Math.min(t+1,n.length-1))))}),s.Keyboard.handleKey(t,"Tabs",{open:function(){e.find('[role="tab"]').focus(),r._handleTabChange(e)},previous:function(){i.find('[role="tab"]').focus(),r._handleTabChange(i)},next:function(){o.find('[role="tab"]').focus(),r._handleTabChange(o)},handled:function(){t.preventDefault()}}))})}},{key:"_handleTabChange",value:function(t,e){var n,i,o,r,s;t.hasClass("".concat(this.options.linkActiveClass))?this.options.activeCollapse&&this._collapse():(n=this.$element.find(".".concat(this.options.linkClass,".").concat(this.options.linkActiveClass)),r=(o=(i=t.find('[role="tab"]')).attr("data-tabs-target"))&&o.length?"#".concat(o):i[0].hash,s=this.$tabContent.find(r),this._collapseTab(n),this._openTab(t),this.options.deepLink&&!e&&(this.options.updateHistory?history.pushState({},"",r):history.replaceState({},"",r)),this.$element.trigger("change.zf.tabs",[t,s]),s.find("[data-mutate]").trigger("mutateme.zf.trigger"))}},{key:"_openTab",value:function(t){var e=t.find('[role="tab"]'),n=e.attr("data-tabs-target")||e[0].hash.slice(1),i=this.$tabContent.find("#".concat(n));t.addClass("".concat(this.options.linkActiveClass)),e.attr({"aria-selected":"true",tabindex:"0"}),i.addClass("".concat(this.options.panelActiveClass)).removeAttr("aria-hidden")}},{key:"_collapseTab",value:function(t){var e=t.removeClass("".concat(this.options.linkActiveClass)).find('[role="tab"]').attr({"aria-selected":"false",tabindex:-1});a()("#".concat(e.attr("aria-controls"))).removeClass("".concat(this.options.panelActiveClass)).attr({"aria-hidden":"true"})}},{key:"_collapse",value:function(){var t=this.$element.find(".".concat(this.options.linkClass,".").concat(this.options.linkActiveClass));t.length&&(this._collapseTab(t),this.$element.trigger("collapse.zf.tabs",[t]))}},{key:"selectTab",value:function(t,e){var n,i="object"===r(t)?t[0].id:t;i.indexOf("#")<0?n="#".concat(i):i=(n=i).slice(1);var o=this.$tabTitles.has('[href$="'.concat(n,'"],[data-tabs-target="').concat(i,'"]')).first();this._handleTabChange(o,e)}},{key:"_setHeight",value:function(){var i=0,o=this;this.$tabContent.find(".".concat(this.options.panelClass)).css("height","").each(function(){var t=a()(this),e=t.hasClass("".concat(o.options.panelActiveClass));e||t.css({visibility:"hidden",display:"block"});var n=this.getBoundingClientRect().height;e||t.css({visibility:"",display:""}),i=i<n?n:i}).css("height","".concat(i,"px"))}},{key:"_destroy",value:function(){this.$element.find(".".concat(this.options.linkClass)).off(".zf.tabs").hide().end().find(".".concat(this.options.panelClass)).hide(),this.options.matchHeight&&null!=this._setHeightMqHandler&&a()(window).off("changed.zf.mediaquery",this._setHeightMqHandler),this.options.deepLink&&a()(window).off("hashchange",this._checkDeepLink),this.onLoadListener&&a()(window).off(this.onLoadListener)}}])&&c(t.prototype,e),i&&c(t,i),n}();p.defaults={deepLink:!1,deepLinkSmudge:!1,deepLinkSmudgeDelay:300,updateHistory:!1,autoFocus:!1,wrapOnKeys:!0,matchHeight:!1,activeCollapse:!1,linkClass:"tabs-title",linkActiveClass:"is-active",panelClass:"tabs-panel",panelActiveClass:"is-active"}},"./js/foundation.toggler.js":function(t,e,n){n.r(e),n.d(e,"Toggler",function(){return p});var i=n("jquery"),r=n.n(i),o=n("./js/foundation.util.motion.js"),s=n("./js/foundation.core.plugin.js"),a=n("./js/foundation.core.utils.js"),l=n("./js/foundation.util.triggers.js");function u(t){return(u="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,d(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(n,s["Plugin"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=r.a.extend({},n.defaults,t.data(),e),this.className="",this.className="Toggler",l.Triggers.init(r.a),this._init(),this._events()}},{key:"_init",value:function(){var t,o=this.$element[0].id,e=r()('[data-open~="'.concat(o,'"], [data-close~="').concat(o,'"], [data-toggle~="').concat(o,'"]'));if(this.options.animate)t=this.options.animate.split(" "),this.animationIn=t[0],this.animationOut=t[1]||null,e.attr("aria-expanded",!this.$element.is(":hidden"));else{if("string"!=typeof(t=this.options.toggler)||!t.length)throw new Error("The 'toogler' option containing the target class is required, got \"".concat(t,'"'));this.className="."===t[0]?t.slice(1):t,e.attr("aria-expanded",this.$element.hasClass(this.className))}e.each(function(t,e){var n=r()(e),i=n.attr("aria-controls")||"";new RegExp("\\b".concat(Object(a.RegExpEscape)(o),"\\b")).test(i)||n.attr("aria-controls",i?"".concat(i," ").concat(o):o)})}},{key:"_events",value:function(){this.$element.off("toggle.zf.trigger").on("toggle.zf.trigger",this.toggle.bind(this))}},{key:"toggle",value:function(){this[this.options.animate?"_toggleAnimate":"_toggleClass"]()}},{key:"_toggleClass",value:function(){this.$element.toggleClass(this.className);var t=this.$element.hasClass(this.className);t?this.$element.trigger("on.zf.toggler"):this.$element.trigger("off.zf.toggler"),this._updateARIA(t),this.$element.find("[data-mutate]").trigger("mutateme.zf.trigger")}},{key:"_toggleAnimate",value:function(){var t=this;this.$element.is(":hidden")?o.Motion.animateIn(this.$element,this.animationIn,function(){t._updateARIA(!0),this.trigger("on.zf.toggler"),this.find("[data-mutate]").trigger("mutateme.zf.trigger")}):o.Motion.animateOut(this.$element,this.animationOut,function(){t._updateARIA(!1),this.trigger("off.zf.toggler"),this.find("[data-mutate]").trigger("mutateme.zf.trigger")})}},{key:"_updateARIA",value:function(t){var e=this.$element[0].id;r()('[data-open="'.concat(e,'"], [data-close="').concat(e,'"], [data-toggle="').concat(e,'"]')).attr({"aria-expanded":!!t})}},{key:"_destroy",value:function(){this.$element.off(".zf.toggler")}}])&&c(t.prototype,e),i&&c(t,i),n}();p.defaults={toggler:void 0,animate:!1}},"./js/foundation.tooltip.js":function(t,e,n){n.r(e),n.d(e,"Tooltip",function(){return g});var i=n("jquery"),o=n.n(i),r=n("./js/foundation.core.utils.js"),s=n("./js/foundation.util.mediaQuery.js"),a=n("./js/foundation.util.triggers.js"),l=n("./js/foundation.positionable.js");function u(t){return(u="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function c(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t,e,n){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var i=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=h(t)););return t}(t,e);if(i){var o=Object.getOwnPropertyDescriptor(i,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(){function n(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,h(n).apply(this,arguments))}var t,e,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(n,l["Positionable"]),t=n,(e=[{key:"_setup",value:function(t,e){this.$element=t,this.options=o.a.extend({},n.defaults,this.$element.data(),e),this.className="Tooltip",this.isActive=!1,this.isClick=!1,a.Triggers.init(o.a),this._init()}},{key:"_init",value:function(){s.MediaQuery._init();var t=this.$element.attr("aria-describedby")||Object(r.GetYoDigits)(6,"tooltip");this.options.tipText=this.options.tipText||this.$element.attr("title"),this.template=this.options.template?o()(this.options.template):this._buildTemplate(t),this.options.allowHtml?this.template.appendTo(document.body).html(this.options.tipText).hide():this.template.appendTo(document.body).text(this.options.tipText).hide(),this.$element.attr({title:"","aria-describedby":t,"data-yeti-box":t,"data-toggle":t,"data-resize":t}).addClass(this.options.triggerClass),d(h(n.prototype),"_init",this).call(this),this._events()}},{key:"_getDefaultPosition",value:function(){var t=this.$element[0].className;this.$element[0]instanceof SVGElement&&(t=t.baseVal);var e=t.match(/\b(top|left|right|bottom)\b/g);return e?e[0]:"top"}},{key:"_getDefaultAlignment",value:function(){return"center"}},{key:"_getHOffset",value:function(){return"left"===this.position||"right"===this.position?this.options.hOffset+this.options.tooltipWidth:this.options.hOffset}},{key:"_getVOffset",value:function(){return"top"===this.position||"bottom"===this.position?this.options.vOffset+this.options.tooltipHeight:this.options.vOffset}},{key:"_buildTemplate",value:function(t){var e="".concat(this.options.tooltipClass," ").concat(this.options.templateClasses).trim();return o()("<div></div>").addClass(e).attr({role:"tooltip","aria-hidden":!0,"data-is-active":!1,"data-is-focus":!1,id:t})}},{key:"_setPosition",value:function(){d(h(n.prototype),"_setPosition",this).call(this,this.$element,this.template)}},{key:"show",value:function(){if("all"!==this.options.showOn&&!s.MediaQuery.is(this.options.showOn))return!1;this.template.css("visibility","hidden").show(),this._setPosition(),this.template.removeClass("top bottom left right").addClass(this.position),this.template.removeClass("align-top align-bottom align-left align-right align-center").addClass("align-"+this.alignment),this.$element.trigger("closeme.zf.tooltip",this.template.attr("id")),this.template.attr({"data-is-active":!0,"aria-hidden":!1}),this.isActive=!0,this.template.stop().hide().css("visibility","").fadeIn(this.options.fadeInDuration,function(){}),this.$element.trigger("show.zf.tooltip")}},{key:"hide",value:function(){var t=this;this.template.stop().attr({"aria-hidden":!0,"data-is-active":!1}).fadeOut(this.options.fadeOutDuration,function(){t.isActive=!1,t.isClick=!1}),this.$element.trigger("hide.zf.tooltip")}},{key:"_events",value:function(){var e=this,t="ontouchstart"in window||void 0!==window.ontouchstart,n=(this.template,!1);t&&this.options.disableForTouch||(this.options.disableHover||this.$element.on("mouseenter.zf.tooltip",function(t){e.isActive||(e.timeout=setTimeout(function(){e.show()},e.options.hoverDelay))}).on("mouseleave.zf.tooltip",Object(r.ignoreMousedisappear)(function(t){clearTimeout(e.timeout),n&&(!e.isClick||e.options.clickOpen)||e.hide()})),t&&this.$element.on("tap.zf.tooltip touchend.zf.tooltip",function(t){e.isActive?e.hide():e.show()}),this.options.clickOpen?this.$element.on("mousedown.zf.tooltip",function(t){e.isClick||(e.isClick=!0,!e.options.disableHover&&e.$element.attr("tabindex")||e.isActive||e.show())}):this.$element.on("mousedown.zf.tooltip",function(t){e.isClick=!0}),this.$element.on({"close.zf.trigger":this.hide.bind(this)}),this.$element.on("focus.zf.tooltip",function(t){return n=!0,e.isClick?(e.options.clickOpen||(n=!1),!1):void e.show()}).on("focusout.zf.tooltip",function(t){n=!1,e.isClick=!1,e.hide()}).on("resizeme.zf.trigger",function(){e.isActive&&e._setPosition()}))}},{key:"toggle",value:function(){this.isActive?this.hide():this.show()}},{key:"_destroy",value:function(){this.$element.attr("title",this.template.text()).off(".zf.trigger .zf.tooltip").removeClass(this.options.triggerClass).removeClass("top right left bottom").removeAttr("aria-describedby data-disable-hover data-resize data-toggle data-tooltip data-yeti-box"),this.template.remove()}}])&&c(t.prototype,e),i&&c(t,i),n}();g.defaults={hoverDelay:200,fadeInDuration:150,fadeOutDuration:150,disableHover:!1,disableForTouch:!1,templateClasses:"",tooltipClass:"tooltip",triggerClass:"has-tip",showOn:"small",template:"",tipText:"",touchCloseText:"Tap to close.",clickOpen:!0,position:"auto",alignment:"auto",allowOverlap:!1,allowBottomOverlap:!1,vOffset:0,hOffset:0,tooltipHeight:14,tooltipWidth:12,allowHtml:!1}},"./js/foundation.util.box.js":function(t,e,n){n.r(e),n.d(e,"Box",function(){return i});var i={ImNotTouchingYou:function(t,e,n,i,o){return 0===r(t,e,n,i,o)},OverlapArea:r,GetDimensions:f,GetExplicitOffsets:function(t,e,n,i,o,r,s){var a,l,u=f(t),c=e?f(e):null;if(null!==c){switch(n){case"top":a=c.offset.top-(u.height+o);break;case"bottom":a=c.offset.top+c.height+o;break;case"left":l=c.offset.left-(u.width+r);break;case"right":l=c.offset.left+c.width+r}switch(n){case"top":case"bottom":switch(i){case"left":l=c.offset.left+r;break;case"right":l=c.offset.left-u.width+c.width-r;break;case"center":l=s?r:c.offset.left+c.width/2-u.width/2+r}break;case"right":case"left":switch(i){case"bottom":a=c.offset.top-o+c.height-u.height;break;case"top":a=c.offset.top+o;break;case"center":a=c.offset.top+o+c.height/2-u.height/2}}}return{top:a,left:l}}};function r(t,e,n,i,o){var r,s,a,l,u,c=f(t);return u=e?(s=(r=f(e)).height+r.offset.top-(c.offset.top+c.height),a=c.offset.top-r.offset.top,l=c.offset.left-r.offset.left,r.width+r.offset.left-(c.offset.left+c.width)):(s=c.windowDims.height+c.windowDims.offset.top-(c.offset.top+c.height),a=c.offset.top-c.windowDims.offset.top,l=c.offset.left-c.windowDims.offset.left,c.windowDims.width-(c.offset.left+c.width)),s=o?0:Math.min(s,0),a=Math.min(a,0),l=Math.min(l,0),u=Math.min(u,0),n?l+u:i?a+s:Math.sqrt(a*a+s*s+l*l+u*u)}function f(t){if((t=t.length?t[0]:t)===window||t===document)throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");var e=t.getBoundingClientRect(),n=t.parentNode.getBoundingClientRect(),i=document.body.getBoundingClientRect(),o=window.pageYOffset,r=window.pageXOffset;return{width:e.width,height:e.height,offset:{top:e.top+o,left:e.left+r},parentDims:{width:n.width,height:n.height,offset:{top:n.top+o,left:n.left+r}},windowDims:{width:i.width,height:i.height,offset:{top:o,left:r}}}}},"./js/foundation.util.imageLoader.js":function(t,e,n){n.r(e),n.d(e,"onImagesLoaded",function(){return r});var i=n("jquery"),o=n.n(i);function r(t,e){var n=t.length;function i(){0===--n&&e()}0===n&&e(),t.each(function(){var t,n;this.complete&&void 0!==this.naturalWidth?i():(t=new Image,n="load.zf.images error.zf.images",o()(t).one(n,function t(e){o()(this).off(n,t),i()}),t.src=o()(this).attr("src"))})}},"./js/foundation.util.keyboard.js":function(t,e,n){n.r(e),n.d(e,"Keyboard",function(){return c});var i=n("jquery"),a=n.n(i),l=n("./js/foundation.core.utils.js"),o={9:"TAB",13:"ENTER",27:"ESCAPE",32:"SPACE",35:"END",36:"HOME",37:"ARROW_LEFT",38:"ARROW_UP",39:"ARROW_RIGHT",40:"ARROW_DOWN"},u={};function r(t){return!!t&&t.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function(){return!(!a()(this).is(":visible")||a()(this).attr("tabindex")<0)})}function s(t){var e=(e=o[t.which||t.keyCode]||String.fromCharCode(t.which).toUpperCase()).replace(/\W+/,"");return t.shiftKey&&(e="SHIFT_".concat(e)),t.ctrlKey&&(e="CTRL_".concat(e)),t.altKey&&(e="ALT_".concat(e)),e=e.replace(/_$/,"")}var c={keys:function(t){var e,n={};for(e in t)n[t[e]]=t[e];return n}(o),parseKey:s,handleKey:function(t,e,n){var i,o,r=u[e],s=this.parseKey(t);if(!r)return console.warn("Component not defined!");!0!==t.zfIsKeyHandled&&((o=n[(void 0===r.ltr?r:Object(l.rtl)()?a.a.extend({},r.ltr,r.rtl):a.a.extend({},r.rtl,r.ltr))[s]])&&"function"==typeof o?(i=o.apply(),t.zfIsKeyHandled=!0,!n.handled&&"function"!=typeof n.handled||n.handled(i)):!n.unhandled&&"function"!=typeof n.unhandled||n.unhandled())},findFocusable:r,register:function(t,e){u[t]=e},trapFocus:function(t){var e=r(t),n=e.eq(0),i=e.eq(-1);t.on("keydown.zf.trapfocus",function(t){t.target===i[0]&&"TAB"===s(t)?(t.preventDefault(),n.focus()):t.target===n[0]&&"SHIFT_TAB"===s(t)&&(t.preventDefault(),i.focus())})},releaseFocus:function(t){t.off("keydown.zf.trapfocus")}}},"./js/foundation.util.mediaQuery.js":function(t,e,n){n.r(e),n.d(e,"MediaQuery",function(){return f});var i=n("jquery"),r=n.n(i);function o(t){return(o="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){o=!0,r=t}finally{try{i||null==a.return||a.return()}finally{if(o)throw r}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var a,l,u,c;window.matchMedia||(window.matchMedia=((c=window.styleMedia||window.media)||(a=document.createElement("style"),l=document.getElementsByTagName("script")[0],u=null,a.type="text/css",a.id="matchmediajs-test",l?l.parentNode.insertBefore(a,l):document.head.appendChild(a),u="getComputedStyle"in window&&window.getComputedStyle(a,null)||a.currentStyle,c={matchMedium:function(t){var e="@media "+t+"{ #matchmediajs-test { width: 1px; } }";return a.styleSheet?a.styleSheet.cssText=e:a.textContent=e,"1px"===u.width}}),function(t){return{matches:c.matchMedium(t||"all"),media:t||"all"}}));var f={queries:[],current:"",_init:function(){if(!0!==this.isInitialized){this.isInitialized=!0;r()("meta.foundation-mq").length||r()('<meta class="foundation-mq">').appendTo(document.head);var t,e,n,i,o=r()(".foundation-mq").css("font-family");for(i in n={},t="string"==typeof(e=o)&&(e=e.trim().slice(1,-1))?n=e.split("&").reduce(function(t,e){var n=e.replace(/\+/g," ").split("="),i=n[0],o=n[1],i=decodeURIComponent(i),o=void 0===o?null:decodeURIComponent(o);return t.hasOwnProperty(i)?Array.isArray(t[i])?t[i].push(o):t[i]=[t[i],o]:t[i]=o,t},{}):n,this.queries=[],t)t.hasOwnProperty(i)&&this.queries.push({name:i,value:"only screen and (min-width: ".concat(t[i],")")});this.current=this._getCurrentSize(),this._watcher()}},_reInit:function(){this.isInitialized=!1,this._init()},atLeast:function(t){var e=this.get(t);return!!e&&window.matchMedia(e).matches},only:function(t){return t===this._getCurrentSize()},upTo:function(t){var e=this.next(t);return!e||!this.atLeast(e)},is:function(t){var e=s(t.trim().split(" ").filter(function(t){return!!t.length}),2),n=e[0],i=e[1],o=void 0===i?"":i;if("only"===o)return this.only(n);if(!o||"up"===o)return this.atLeast(n);if("down"===o)return this.upTo(n);throw new Error('\n      Invalid breakpoint passed to MediaQuery.is().\n      Expected a breakpoint name formatted like "<size> <modifier>", got "'.concat(t,'".\n    '))},get:function(t){for(var e in this.queries)if(this.queries.hasOwnProperty(e)){var n=this.queries[e];if(t===n.name)return n.value}return null},next:function(e){var n=this,t=this.queries.findIndex(function(t){return n._getQueryName(t)===e});if(-1===t)throw new Error('\n        Unknown breakpoint "'.concat(e,'" passed to MediaQuery.next().\n        Ensure it is present in your Sass "$breakpoints" setting.\n      '));var i=this.queries[t+1];return i?i.name:null},_getQueryName:function(t){if("string"==typeof t)return t;if("object"===o(t))return t.name;throw new TypeError('\n      Invalid value passed to MediaQuery._getQueryName().\n      Expected a breakpoint name (String) or a breakpoint query (Object), got "'.concat(t,'" (').concat(o(t),")\n    "))},_getCurrentSize:function(){for(var t,e=0;e<this.queries.length;e++){var n=this.queries[e];window.matchMedia(n.value).matches&&(t=n)}return t&&this._getQueryName(t)},_watcher:function(){var n=this;r()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery",function(){var t=n._getCurrentSize(),e=n.current;t!==e&&(n.current=t,r()(window).trigger("changed.zf.mediaquery",[t,e]))})}}},"./js/foundation.util.motion.js":function(t,e,n){n.r(e),n.d(e,"Move",function(){return r}),n.d(e,"Motion",function(){return o});var i=n("jquery"),a=n.n(i),l=n("./js/foundation.core.utils.js"),u=["mui-enter","mui-leave"],c=["mui-enter-active","mui-leave-active"],o={animateIn:function(t,e,n){s(!0,t,e,n)},animateOut:function(t,e,n){s(!1,t,e,n)}};function r(n,i,o){var r,s,a=null;if(0===n)return o.apply(i),void i.trigger("finished.zf.animate",[i]).triggerHandler("finished.zf.animate",[i]);r=window.requestAnimationFrame(function t(e){s=e-(a=a||e),o.apply(i),s<n?r=window.requestAnimationFrame(t,i):(window.cancelAnimationFrame(r),i.trigger("finished.zf.animate",[i]).triggerHandler("finished.zf.animate",[i]))})}function s(t,e,n,i){var o,r;function s(){e[0].style.transitionDuration=0,e.removeClass("".concat(o," ").concat(r," ").concat(n))}(e=a()(e).eq(0)).length&&(o=t?u[0]:u[1],r=t?c[0]:c[1],s(),e.addClass(n).css("transition","none"),requestAnimationFrame(function(){e.addClass(o),t&&e.show()}),requestAnimationFrame(function(){e[0].offsetWidth,e.css("transition","").addClass(r)}),e.one(Object(l.transitionend)(e),function(){t||e.hide();s(),i&&i.apply(e)}))}},"./js/foundation.util.nest.js":function(t,e,n){n.r(e),n.d(e,"Nest",function(){return o});var i=n("jquery"),l=n.n(i),o={Feather:function(t,e){var n=1<arguments.length&&void 0!==e?e:"zf";t.attr("role","menubar"),t.find("a").attr({role:"menuitem"});var i=t.find("li").attr({role:"none"}),o="is-".concat(n,"-submenu"),r="".concat(o,"-item"),s="is-".concat(n,"-submenu-parent"),a="accordion"!==n;i.each(function(){var t=l()(this),e=t.children("ul");e.length&&(t.addClass(s),a&&(t.attr({"aria-haspopup":!0,"aria-label":t.children("a:first").text()}),"drilldown"===n&&t.attr({"aria-expanded":!1})),e.addClass("submenu ".concat(o)).attr({"data-submenu":"",role:"menubar"}),"drilldown"===n&&e.attr({"aria-hidden":!0})),t.parent("[data-submenu]").length&&t.addClass("is-submenu-item ".concat(r))})},Burn:function(t,e){var n="is-".concat(e,"-submenu"),i="".concat(n,"-item"),o="is-".concat(e,"-submenu-parent");t.find(">li, > li > ul, .menu, .menu > li, [data-submenu] > li").removeClass("".concat(n," ").concat(i," ").concat(o," is-submenu-item submenu is-active")).removeAttr("data-submenu").css("display","")}}},"./js/foundation.util.timer.js":function(t,e,n){n.r(e),n.d(e,"Timer",function(){return i});n("jquery");function i(e,t,n){var i,o,r=this,s=t.duration,a=Object.keys(e.data())[0]||"timer",l=-1;this.isPaused=!1,this.restart=function(){l=-1,clearTimeout(o),this.start()},this.start=function(){this.isPaused=!1,clearTimeout(o),l=l<=0?s:l,e.data("paused",!1),i=Date.now(),o=setTimeout(function(){t.infinite&&r.restart(),n&&"function"==typeof n&&n()},l),e.trigger("timerstart.zf.".concat(a))},this.pause=function(){this.isPaused=!0,clearTimeout(o),e.data("paused",!0);var t=Date.now();l-=t-i,e.trigger("timerpaused.zf.".concat(a))}}},"./js/foundation.util.touch.js":function(t,e,n){n.r(e),n.d(e,"Touch",function(){return c});var i=n("jquery"),o=n.n(i);function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var s,a,l,u,c={},f=!1,d=!1;function h(t){var e;this.removeEventListener("touchmove",p),this.removeEventListener("touchend",h),d||(e=o.a.Event("tap",u||t),o()(this).trigger(e)),u=null,d=f=!1}function p(t){var e,n,i;o.a.spotSwipe.preventDefault&&t.preventDefault(),f&&(e=t.touches[0].pageX,t.touches[0].pageY,n=s-e,d=!0,l=(new Date).getTime()-a,Math.abs(n)>=o.a.spotSwipe.moveThreshold&&l<=o.a.spotSwipe.timeThreshold&&(i=0<n?"left":"right"),i&&(t.preventDefault(),h.apply(this,arguments),o()(this).trigger(o.a.Event("swipe",Object.assign({},t)),i).trigger(o.a.Event("swipe".concat(i),Object.assign({},t)))))}function g(t){1==t.touches.length&&(s=t.touches[0].pageX,t.touches[0].pageY,u=t,d=!(f=!0),a=(new Date).getTime(),this.addEventListener("touchmove",p,!1),this.addEventListener("touchend",h,!1))}function m(){this.addEventListener&&this.addEventListener("touchstart",g,!1)}var v=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.version="1.0.0",this.enabled="ontouchstart"in document.documentElement,this.preventDefault=!1,this.moveThreshold=75,this.timeThreshold=200,this.$=t,this._init()}var t,n,i;return t=e,(n=[{key:"_init",value:function(){var t=this.$;t.event.special.swipe={setup:m},t.event.special.tap={setup:m},t.each(["left","up","down","right"],function(){t.event.special["swipe".concat(this)]={setup:function(){t(this).on("swipe",t.noop)}}})}}])&&r(t.prototype,n),i&&r(t,i),e}();c.setupSpotSwipe=function(t){t.spotSwipe=new v(t)},c.setupTouchHandler=function(i){i.fn.addTouch=function(){this.each(function(t,e){i(e).bind("touchstart touchmove touchend touchcancel",function(t){n(t)})});var n=function(t){var e,n=t.changedTouches[0],i={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup"}[t.type];"MouseEvent"in window&&"function"==typeof window.MouseEvent?e=new window.MouseEvent(i,{bubbles:!0,cancelable:!0,screenX:n.screenX,screenY:n.screenY,clientX:n.clientX,clientY:n.clientY}):(e=document.createEvent("MouseEvent")).initMouseEvent(i,!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(e)}}},c.init=function(t){void 0===t.spotSwipe&&(c.setupSpotSwipe(t),c.setupTouchHandler(t))}},"./js/foundation.util.triggers.js":function(t,e,n){n.r(e),n.d(e,"Triggers",function(){return c});var i=n("jquery"),r=n.n(i),o=n("./js/foundation.core.utils.js"),s=n("./js/foundation.util.motion.js");function a(t){return(a="function"==typeof Symbol&&"symbol"===y(Symbol.iterator)?function(t){return y(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":y(t)})(t)}function l(e,n){e.data(n).split(" ").forEach(function(t){r()("#".concat(t))["close"===n?"trigger":"triggerHandler"]("".concat(n,".zf.trigger"),[e])})}var u=function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if("".concat(t[e],"MutationObserver")in window)return window["".concat(t[e],"MutationObserver")];return!1}(),c={Listeners:{Basic:{},Global:{}},Initializers:{}};function f(e,t,n){var i,o=Array.prototype.slice.call(arguments,3);r()(window).off(t).on(t,function(t){i&&clearTimeout(i),i=setTimeout(function(){n.apply(null,o)},e||10)})}c.Listeners.Basic={openListener:function(){l(r()(this),"open")},closeListener:function(){r()(this).data("close")?l(r()(this),"close"):r()(this).trigger("close.zf.trigger")},toggleListener:function(){r()(this).data("toggle")?l(r()(this),"toggle"):r()(this).trigger("toggle.zf.trigger")},closeableListener:function(t){var e=r()(this).data("closable");t.stopPropagation(),""!==e?s.Motion.animateOut(r()(this),e,function(){r()(this).trigger("closed.zf")}):r()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var t=r()(this).data("toggle-focus");r()("#".concat(t)).triggerHandler("toggle.zf.trigger",[r()(this)])}},c.Initializers.addOpenListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.openListener),t.on("click.zf.trigger","[data-open]",c.Listeners.Basic.openListener)},c.Initializers.addCloseListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.closeListener),t.on("click.zf.trigger","[data-close]",c.Listeners.Basic.closeListener)},c.Initializers.addToggleListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.toggleListener),t.on("click.zf.trigger","[data-toggle]",c.Listeners.Basic.toggleListener)},c.Initializers.addCloseableListener=function(t){t.off("close.zf.trigger",c.Listeners.Basic.closeableListener),t.on("close.zf.trigger","[data-closeable], [data-closable]",c.Listeners.Basic.closeableListener)},c.Initializers.addToggleFocusListener=function(t){t.off("focus.zf.trigger blur.zf.trigger",c.Listeners.Basic.toggleFocusListener),t.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",c.Listeners.Basic.toggleFocusListener)},c.Listeners.Global={resizeListener:function(t){u||t.each(function(){r()(this).triggerHandler("resizeme.zf.trigger")}),t.attr("data-events","resize")},scrollListener:function(t){u||t.each(function(){r()(this).triggerHandler("scrollme.zf.trigger")}),t.attr("data-events","scroll")},closeMeListener:function(t,e){var n=t.namespace.split(".")[0];r()("[data-".concat(n,"]")).not('[data-yeti-box="'.concat(e,'"]')).each(function(){var t=r()(this);t.triggerHandler("close.zf.trigger",[t])})}},c.Initializers.addClosemeListener=function(t){var e,n=r()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];t&&("string"==typeof t?i.push(t):"object"===a(t)&&"string"==typeof t[0]?i=i.concat(t):console.error("Plugin names must be strings")),n.length&&(e=i.map(function(t){return"closeme.zf.".concat(t)}).join(" "),r()(window).off(e).on(e,c.Listeners.Global.closeMeListener))},c.Initializers.addResizeListener=function(t){var e=r()("[data-resize]");e.length&&f(t,"resize.zf.trigger",c.Listeners.Global.resizeListener,e)},c.Initializers.addScrollListener=function(t){var e=r()("[data-scroll]");e.length&&f(t,"scroll.zf.trigger",c.Listeners.Global.scrollListener,e)},c.Initializers.addMutationEventsListener=function(t){if(!u)return!1;function e(t){var e=r()(t[0].target);switch(t[0].type){case"attributes":"scroll"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("scrollme.zf.trigger",[e,window.pageYOffset]),"resize"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("resizeme.zf.trigger",[e]),"style"===t[0].attributeName&&(e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]));break;case"childList":e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]);break;default:return!1}}var n=t.find("[data-resize], [data-scroll], [data-mutate]");if(n.length)for(var i=0;i<=n.length-1;i++){new u(e).observe(n[i],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},c.Initializers.addSimpleListeners=function(){var t=r()(document);c.Initializers.addOpenListener(t),c.Initializers.addCloseListener(t),c.Initializers.addToggleListener(t),c.Initializers.addCloseableListener(t),c.Initializers.addToggleFocusListener(t)},c.Initializers.addGlobalListeners=function(){var t=r()(document);c.Initializers.addMutationEventsListener(t),c.Initializers.addResizeListener(),c.Initializers.addScrollListener(),c.Initializers.addClosemeListener()},c.init=function(t,e){Object(o.onLoad)(t(window),function(){!0!==t.triggersInitialized&&(c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners(),t.triggersInitialized=!0)}),e&&(e.Triggers=c,e.IHearYou=c.Initializers.addGlobalListeners)}},0:function(t,e,n){t.exports=n("./js/entries/foundation.js")},jquery:function(t){t.exports=e}},o.c=i,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===y(e)&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0);function o(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}var n,i})},{jquery:2}],2:[function(t,e,n){(function(t){(function(n,t,e,sn,i){!function(t,e){"use strict";"object"==typeof n&&"object"==typeof n.exports?n.exports=t.document?e(t,!0):function(t){if(!t.document)throw new Error("jQuery requires a window with a document");return e(t)}:e(t)}("undefined"!=typeof window?window:this,function($,t){"use strict";function g(t){return null!=t&&t===t.window}var e=[],i=Object.getPrototypeOf,a=e.slice,m=e.flat?function(t){return e.flat.call(t)}:function(t){return e.concat.apply([],t)},l=e.push,o=e.indexOf,n={},r=n.toString,v=n.hasOwnProperty,s=v.toString,u=s.call(Object),y={},b=function(t){return"function"==typeof t&&"number"!=typeof t.nodeType},j=$.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function w(t,e,n){var i,o,r=(n=n||j).createElement("script");if(r.text=t,e)for(i in c)(o=e[i]||e.getAttribute&&e.getAttribute(i))&&r.setAttribute(i,o);n.head.appendChild(r).parentNode.removeChild(r)}function k(t){return null==t?t+"":"object"==typeof t||"function"==typeof t?n[r.call(t)]||"object":typeof t}var C=function(t,e){return new C.fn.init(t,e)};function f(t){var e=!!t&&"length"in t&&t.length,n=k(t);return!b(t)&&!g(t)&&("array"===n||0===e||"number"==typeof e&&0<e&&e-1 in t)}C.fn=C.prototype={jquery:"3.5.1",constructor:C,length:0,toArray:function(){return a.call(this)},get:function(t){return null==t?a.call(this):t<0?this[t+this.length]:this[t]},pushStack:function(t){var e=C.merge(this.constructor(),t);return e.prevObject=this,e},each:function(t){return C.each(this,t)},map:function(n){return this.pushStack(C.map(this,function(t,e){return n.call(t,e,t)}))},slice:function(){return this.pushStack(a.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(C.grep(this,function(t,e){return(e+1)%2}))},odd:function(){return this.pushStack(C.grep(this,function(t,e){return e%2}))},eq:function(t){var e=this.length,n=+t+(t<0?e:0);return this.pushStack(0<=n&&n<e?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:l,sort:e.sort,splice:e.splice},C.extend=C.fn.extend=function(){var t,e,n,i,o,r,s=arguments[0]||{},a=1,l=arguments.length,u=!1;for("boolean"==typeof s&&(u=s,s=arguments[a]||{},a++),"object"==typeof s||b(s)||(s={}),a===l&&(s=this,a--);a<l;a++)if(null!=(t=arguments[a]))for(e in t)i=t[e],"__proto__"!==e&&s!==i&&(u&&i&&(C.isPlainObject(i)||(o=Array.isArray(i)))?(n=s[e],r=o&&!Array.isArray(n)?[]:o||C.isPlainObject(n)?n:{},o=!1,s[e]=C.extend(u,r,i)):void 0!==i&&(s[e]=i));return s},C.extend({expando:"jQuery"+("3.5.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(t){throw new Error(t)},noop:function(){},isPlainObject:function(t){var e,n;return!(!t||"[object Object]"!==r.call(t))&&(!(e=i(t))||"function"==typeof(n=v.call(e,"constructor")&&e.constructor)&&s.call(n)===u)},isEmptyObject:function(t){for(var e in t)return!1;return!0},globalEval:function(t,e,n){w(t,{nonce:e&&e.nonce},n)},each:function(t,e){var n,i=0;if(f(t))for(n=t.length;i<n&&!1!==e.call(t[i],i,t[i]);i++);else for(i in t)if(!1===e.call(t[i],i,t[i]))break;return t},makeArray:function(t,e){var n=e||[];return null!=t&&(f(Object(t))?C.merge(n,"string"==typeof t?[t]:t):l.call(n,t)),n},inArray:function(t,e,n){return null==e?-1:o.call(e,t,n)},merge:function(t,e){for(var n=+e.length,i=0,o=t.length;i<n;i++)t[o++]=e[i];return t.length=o,t},grep:function(t,e,n){for(var i=[],o=0,r=t.length,s=!n;o<r;o++)!e(t[o],o)!=s&&i.push(t[o]);return i},map:function(t,e,n){var i,o,r=0,s=[];if(f(t))for(i=t.length;r<i;r++)null!=(o=e(t[r],r,n))&&s.push(o);else for(r in t)null!=(o=e(t[r],r,n))&&s.push(o);return m(s)},guid:1,support:y}),"function"==typeof Symbol&&(C.fn[Symbol.iterator]=e[Symbol.iterator]),C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(t,e){n["[object "+e+"]"]=e.toLowerCase()});var d=function(n){function f(t,e){var n="0x"+t.slice(1)-65536;return e||(n<0?String.fromCharCode(65536+n):String.fromCharCode(n>>10|55296,1023&n|56320))}function o(){_()}var t,h,w,r,s,p,d,g,k,l,u,_,$,a,j,m,c,v,y,C="sizzle"+ +new Date,b=n.document,x=0,i=0,T=lt(),O=lt(),S=lt(),z=lt(),E=function(t,e){return t===e&&(u=!0),0},A={}.hasOwnProperty,e=[],P=e.pop,L=e.push,D=e.push,M=e.slice,R=function(t,e){for(var n=0,i=t.length;n<i;n++)if(t[n]===e)return n;return-1},q="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",H="[\\x20\\t\\r\\n\\f]",N="(?:\\\\[\\da-fA-F]{1,6}"+H+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",I="\\["+H+"*("+N+")(?:"+H+"*([*^$|!~]?=)"+H+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+H+"*\\]",F=":("+N+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",B=new RegExp(H+"+","g"),W=new RegExp("^"+H+"+|((?:^|[^\\\\])(?:\\\\.)*)"+H+"+$","g"),Q=new RegExp("^"+H+"*,"+H+"*"),G=new RegExp("^"+H+"*([>+~]|"+H+")"+H+"*"),U=new RegExp(H+"|>"),K=new RegExp(F),Y=new RegExp("^"+N+"$"),V={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+H+"*(even|odd|(([+-]|)(\\d*)n|)"+H+"*(?:([+-]|)"+H+"*(\\d+)|))"+H+"*\\)|)","i"),bool:new RegExp("^(?:"+q+")$","i"),needsContext:new RegExp("^"+H+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+H+"*((?:-\\d)?\\d*)"+H+"*\\)|)(?=[^-]|$)","i")},X=/HTML$/i,Z=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,tt=/^[^{]+\{\s*\[native \w/,et=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,nt=/[+~]/,it=new RegExp("\\\\[\\da-fA-F]{1,6}"+H+"?|\\\\([^\\r\\n\\f])","g"),ot=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,rt=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t},st=yt(function(t){return!0===t.disabled&&"fieldset"===t.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{D.apply(e=M.call(b.childNodes),b.childNodes),e[b.childNodes.length].nodeType}catch(t){D={apply:e.length?function(t,e){L.apply(t,M.call(e))}:function(t,e){for(var n=t.length,i=0;t[n++]=e[i++];);t.length=n-1}}}function at(e,t,n,i){var o,r,s,a,l,u,c,f=t&&t.ownerDocument,d=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==d&&9!==d&&11!==d)return n;if(!i&&(_(t),t=t||$,j)){if(11!==d&&(l=et.exec(e)))if(o=l[1]){if(9===d){if(!(s=t.getElementById(o)))return n;if(s.id===o)return n.push(s),n}else if(f&&(s=f.getElementById(o))&&y(t,s)&&s.id===o)return n.push(s),n}else{if(l[2])return D.apply(n,t.getElementsByTagName(e)),n;if((o=l[3])&&h.getElementsByClassName&&t.getElementsByClassName)return D.apply(n,t.getElementsByClassName(o)),n}if(h.qsa&&!z[e+" "]&&(!m||!m.test(e))&&(1!==d||"object"!==t.nodeName.toLowerCase())){if(c=e,f=t,1===d&&(U.test(e)||G.test(e))){for((f=nt.test(e)&&gt(t.parentNode)||t)===t&&h.scope||((a=t.getAttribute("id"))?a=a.replace(ot,rt):t.setAttribute("id",a=C)),r=(u=p(e)).length;r--;)u[r]=(a?"#"+a:":scope")+" "+vt(u[r]);c=u.join(",")}try{return D.apply(n,f.querySelectorAll(c)),n}catch(t){z(e,!0)}finally{a===C&&t.removeAttribute("id")}}}return g(e.replace(W,"$1"),t,n,i)}function lt(){var n=[];function i(t,e){return n.push(t+" ")>w.cacheLength&&delete i[n.shift()],i[t+" "]=e}return i}function ut(t){return t[C]=!0,t}function ct(t){var e=$.createElement("fieldset");try{return!!t(e)}catch(t){return!1}finally{e.parentNode&&e.parentNode.removeChild(e),e=null}}function ft(t,e){for(var n=t.split("|"),i=n.length;i--;)w.attrHandle[n[i]]=e}function dt(t,e){var n=e&&t,i=n&&1===t.nodeType&&1===e.nodeType&&t.sourceIndex-e.sourceIndex;if(i)return i;if(n)for(;n=n.nextSibling;)if(n===e)return-1;return t?1:-1}function ht(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&st(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function pt(s){return ut(function(r){return r=+r,ut(function(t,e){for(var n,i=s([],t.length,r),o=i.length;o--;)t[n=i[o]]&&(t[n]=!(e[n]=t[n]))})})}function gt(t){return t&&void 0!==t.getElementsByTagName&&t}for(t in h=at.support={},s=at.isXML=function(t){var e=t.namespaceURI,n=(t.ownerDocument||t).documentElement;return!X.test(e||n&&n.nodeName||"HTML")},_=at.setDocument=function(t){var e,n,i=t?t.ownerDocument||t:b;return i!=$&&9===i.nodeType&&i.documentElement&&(a=($=i).documentElement,j=!s($),b!=$&&(n=$.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",o,!1):n.attachEvent&&n.attachEvent("onunload",o)),h.scope=ct(function(t){return a.appendChild(t).appendChild($.createElement("div")),void 0!==t.querySelectorAll&&!t.querySelectorAll(":scope fieldset div").length}),h.attributes=ct(function(t){return t.className="i",!t.getAttribute("className")}),h.getElementsByTagName=ct(function(t){return t.appendChild($.createComment("")),!t.getElementsByTagName("*").length}),h.getElementsByClassName=tt.test($.getElementsByClassName),h.getById=ct(function(t){return a.appendChild(t).id=C,!$.getElementsByName||!$.getElementsByName(C).length}),h.getById?(w.filter.ID=function(t){var e=t.replace(it,f);return function(t){return t.getAttribute("id")===e}},w.find.ID=function(t,e){if(void 0!==e.getElementById&&j){var n=e.getElementById(t);return n?[n]:[]}}):(w.filter.ID=function(t){var n=t.replace(it,f);return function(t){var e=void 0!==t.getAttributeNode&&t.getAttributeNode("id");return e&&e.value===n}},w.find.ID=function(t,e){if(void 0!==e.getElementById&&j){var n,i,o,r=e.getElementById(t);if(r){if((n=r.getAttributeNode("id"))&&n.value===t)return[r];for(o=e.getElementsByName(t),i=0;r=o[i++];)if((n=r.getAttributeNode("id"))&&n.value===t)return[r]}return[]}}),w.find.TAG=h.getElementsByTagName?function(t,e){return void 0!==e.getElementsByTagName?e.getElementsByTagName(t):h.qsa?e.querySelectorAll(t):void 0}:function(t,e){var n,i=[],o=0,r=e.getElementsByTagName(t);if("*"!==t)return r;for(;n=r[o++];)1===n.nodeType&&i.push(n);return i},w.find.CLASS=h.getElementsByClassName&&function(t,e){if(void 0!==e.getElementsByClassName&&j)return e.getElementsByClassName(t)},c=[],m=[],(h.qsa=tt.test($.querySelectorAll))&&(ct(function(t){var e;a.appendChild(t).innerHTML="<a id='"+C+"'></a><select id='"+C+"-\r\\' msallowcapture=''><option selected=''></option></select>",t.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+H+"*(?:''|\"\")"),t.querySelectorAll("[selected]").length||m.push("\\["+H+"*(?:value|"+q+")"),t.querySelectorAll("[id~="+C+"-]").length||m.push("~="),(e=$.createElement("input")).setAttribute("name",""),t.appendChild(e),t.querySelectorAll("[name='']").length||m.push("\\["+H+"*name"+H+"*="+H+"*(?:''|\"\")"),t.querySelectorAll(":checked").length||m.push(":checked"),t.querySelectorAll("a#"+C+"+*").length||m.push(".#.+[+~]"),t.querySelectorAll("\\\f"),m.push("[\\r\\n\\f]")}),ct(function(t){t.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var e=$.createElement("input");e.setAttribute("type","hidden"),t.appendChild(e).setAttribute("name","D"),t.querySelectorAll("[name=d]").length&&m.push("name"+H+"*[*^$|!~]?="),2!==t.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),a.appendChild(t).disabled=!0,2!==t.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),t.querySelectorAll("*,:x"),m.push(",.*:")})),(h.matchesSelector=tt.test(v=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ct(function(t){h.disconnectedMatch=v.call(t,"*"),v.call(t,"[s!='']:x"),c.push("!=",F)}),m=m.length&&new RegExp(m.join("|")),c=c.length&&new RegExp(c.join("|")),e=tt.test(a.compareDocumentPosition),y=e||tt.test(a.contains)?function(t,e){var n=9===t.nodeType?t.documentElement:t,i=e&&e.parentNode;return t===i||!(!i||1!==i.nodeType||!(n.contains?n.contains(i):t.compareDocumentPosition&&16&t.compareDocumentPosition(i)))}:function(t,e){if(e)for(;e=e.parentNode;)if(e===t)return!0;return!1},E=e?function(t,e){if(t===e)return u=!0,0;var n=!t.compareDocumentPosition-!e.compareDocumentPosition;return n||(1&(n=(t.ownerDocument||t)==(e.ownerDocument||e)?t.compareDocumentPosition(e):1)||!h.sortDetached&&e.compareDocumentPosition(t)===n?t==$||t.ownerDocument==b&&y(b,t)?-1:e==$||e.ownerDocument==b&&y(b,e)?1:l?R(l,t)-R(l,e):0:4&n?-1:1)}:function(t,e){if(t===e)return u=!0,0;var n,i=0,o=t.parentNode,r=e.parentNode,s=[t],a=[e];if(!o||!r)return t==$?-1:e==$?1:o?-1:r?1:l?R(l,t)-R(l,e):0;if(o===r)return dt(t,e);for(n=t;n=n.parentNode;)s.unshift(n);for(n=e;n=n.parentNode;)a.unshift(n);for(;s[i]===a[i];)i++;return i?dt(s[i],a[i]):s[i]==b?-1:a[i]==b?1:0}),$},at.matches=function(t,e){return at(t,null,null,e)},at.matchesSelector=function(t,e){if(_(t),h.matchesSelector&&j&&!z[e+" "]&&(!c||!c.test(e))&&(!m||!m.test(e)))try{var n=v.call(t,e);if(n||h.disconnectedMatch||t.document&&11!==t.document.nodeType)return n}catch(t){z(e,!0)}return 0<at(e,$,null,[t]).length},at.contains=function(t,e){return(t.ownerDocument||t)!=$&&_(t),y(t,e)},at.attr=function(t,e){(t.ownerDocument||t)!=$&&_(t);var n=w.attrHandle[e.toLowerCase()],i=n&&A.call(w.attrHandle,e.toLowerCase())?n(t,e,!j):void 0;return void 0!==i?i:h.attributes||!j?t.getAttribute(e):(i=t.getAttributeNode(e))&&i.specified?i.value:null},at.escape=function(t){return(t+"").replace(ot,rt)},at.error=function(t){throw new Error("Syntax error, unrecognized expression: "+t)},at.uniqueSort=function(t){var e,n=[],i=0,o=0;if(u=!h.detectDuplicates,l=!h.sortStable&&t.slice(0),t.sort(E),u){for(;e=t[o++];)e===t[o]&&(i=n.push(o));for(;i--;)t.splice(n[i],1)}return l=null,t},r=at.getText=function(t){var e,n="",i=0,o=t.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)n+=r(t)}else if(3===o||4===o)return t.nodeValue}else for(;e=t[i++];)n+=r(e);return n},(w=at.selectors={cacheLength:50,createPseudo:ut,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(t){return t[1]=t[1].replace(it,f),t[3]=(t[3]||t[4]||t[5]||"").replace(it,f),"~="===t[2]&&(t[3]=" "+t[3]+" "),t.slice(0,4)},CHILD:function(t){return t[1]=t[1].toLowerCase(),"nth"===t[1].slice(0,3)?(t[3]||at.error(t[0]),t[4]=+(t[4]?t[5]+(t[6]||1):2*("even"===t[3]||"odd"===t[3])),t[5]=+(t[7]+t[8]||"odd"===t[3])):t[3]&&at.error(t[0]),t},PSEUDO:function(t){var e,n=!t[6]&&t[2];return V.CHILD.test(t[0])?null:(t[3]?t[2]=t[4]||t[5]||"":n&&K.test(n)&&(e=p(n,!0))&&(e=n.indexOf(")",n.length-e)-n.length)&&(t[0]=t[0].slice(0,e),t[2]=n.slice(0,e)),t.slice(0,3))}},filter:{TAG:function(t){var e=t.replace(it,f).toLowerCase();return"*"===t?function(){return!0}:function(t){return t.nodeName&&t.nodeName.toLowerCase()===e}},CLASS:function(t){var e=T[t+" "];return e||(e=new RegExp("(^|"+H+")"+t+"("+H+"|$)"))&&T(t,function(t){return e.test("string"==typeof t.className&&t.className||void 0!==t.getAttribute&&t.getAttribute("class")||"")})},ATTR:function(n,i,o){return function(t){var e=at.attr(t,n);return null==e?"!="===i:!i||(e+="","="===i?e===o:"!="===i?e!==o:"^="===i?o&&0===e.indexOf(o):"*="===i?o&&-1<e.indexOf(o):"$="===i?o&&e.slice(-o.length)===o:"~="===i?-1<(" "+e.replace(B," ")+" ").indexOf(o):"|="===i&&(e===o||e.slice(0,o.length+1)===o+"-"))}},CHILD:function(p,t,e,g,m){var v="nth"!==p.slice(0,3),y="last"!==p.slice(-4),b="of-type"===t;return 1===g&&0===m?function(t){return!!t.parentNode}:function(t,e,n){var i,o,r,s,a,l,u=v!=y?"nextSibling":"previousSibling",c=t.parentNode,f=b&&t.nodeName.toLowerCase(),d=!n&&!b,h=!1;if(c){if(v){for(;u;){for(s=t;s=s[u];)if(b?s.nodeName.toLowerCase()===f:1===s.nodeType)return!1;l=u="only"===p&&!l&&"nextSibling"}return!0}if(l=[y?c.firstChild:c.lastChild],y&&d){for(h=(a=(i=(o=(r=(s=c)[C]||(s[C]={}))[s.uniqueID]||(r[s.uniqueID]={}))[p]||[])[0]===x&&i[1])&&i[2],s=a&&c.childNodes[a];s=++a&&s&&s[u]||(h=a=0)||l.pop();)if(1===s.nodeType&&++h&&s===t){o[p]=[x,a,h];break}}else if(d&&(h=a=(i=(o=(r=(s=t)[C]||(s[C]={}))[s.uniqueID]||(r[s.uniqueID]={}))[p]||[])[0]===x&&i[1]),!1===h)for(;(s=++a&&s&&s[u]||(h=a=0)||l.pop())&&((b?s.nodeName.toLowerCase()!==f:1!==s.nodeType)||!++h||(d&&((o=(r=s[C]||(s[C]={}))[s.uniqueID]||(r[s.uniqueID]={}))[p]=[x,h]),s!==t)););return(h-=m)===g||h%g==0&&0<=h/g}}},PSEUDO:function(t,r){var e,s=w.pseudos[t]||w.setFilters[t.toLowerCase()]||at.error("unsupported pseudo: "+t);return s[C]?s(r):1<s.length?(e=[t,t,"",r],w.setFilters.hasOwnProperty(t.toLowerCase())?ut(function(t,e){for(var n,i=s(t,r),o=i.length;o--;)t[n=R(t,i[o])]=!(e[n]=i[o])}):function(t){return s(t,0,e)}):s}},pseudos:{not:ut(function(t){var i=[],o=[],a=d(t.replace(W,"$1"));return a[C]?ut(function(t,e,n,i){for(var o,r=a(t,null,i,[]),s=t.length;s--;)(o=r[s])&&(t[s]=!(e[s]=o))}):function(t,e,n){return i[0]=t,a(i,null,n,o),i[0]=null,!o.pop()}}),has:ut(function(e){return function(t){return 0<at(e,t).length}}),contains:ut(function(e){return e=e.replace(it,f),function(t){return-1<(t.textContent||r(t)).indexOf(e)}}),lang:ut(function(n){return Y.test(n||"")||at.error("unsupported lang: "+n),n=n.replace(it,f).toLowerCase(),function(t){var e;do{if(e=j?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(e=e.toLowerCase())===n||0===e.indexOf(n+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var e=n.location&&n.location.hash;return e&&e.slice(1)===t.id},root:function(t){return t===a},focus:function(t){return t===$.activeElement&&(!$.hasFocus||$.hasFocus())&&!!(t.type||t.href||~t.tabIndex)},enabled:ht(!1),disabled:ht(!0),checked:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&!!t.checked||"option"===e&&!!t.selected},selected:function(t){return t.parentNode&&t.parentNode.selectedIndex,!0===t.selected},empty:function(t){for(t=t.firstChild;t;t=t.nextSibling)if(t.nodeType<6)return!1;return!0},parent:function(t){return!w.pseudos.empty(t)},header:function(t){return J.test(t.nodeName)},input:function(t){return Z.test(t.nodeName)},button:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&"button"===t.type||"button"===e},text:function(t){var e;return"input"===t.nodeName.toLowerCase()&&"text"===t.type&&(null==(e=t.getAttribute("type"))||"text"===e.toLowerCase())},first:pt(function(){return[0]}),last:pt(function(t,e){return[e-1]}),eq:pt(function(t,e,n){return[n<0?n+e:n]}),even:pt(function(t,e){for(var n=0;n<e;n+=2)t.push(n);return t}),odd:pt(function(t,e){for(var n=1;n<e;n+=2)t.push(n);return t}),lt:pt(function(t,e,n){for(var i=n<0?n+e:e<n?e:n;0<=--i;)t.push(i);return t}),gt:pt(function(t,e,n){for(var i=n<0?n+e:n;++i<e;)t.push(i);return t})}}).pseudos.nth=w.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[t]=function(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}(t);for(t in{submit:!0,reset:!0})w.pseudos[t]=function(n){return function(t){var e=t.nodeName.toLowerCase();return("input"===e||"button"===e)&&t.type===n}}(t);function mt(){}function vt(t){for(var e=0,n=t.length,i="";e<n;e++)i+=t[e].value;return i}function yt(a,t,e){var l=t.dir,u=t.next,c=u||l,f=e&&"parentNode"===c,d=i++;return t.first?function(t,e,n){for(;t=t[l];)if(1===t.nodeType||f)return a(t,e,n);return!1}:function(t,e,n){var i,o,r,s=[x,d];if(n){for(;t=t[l];)if((1===t.nodeType||f)&&a(t,e,n))return!0}else for(;t=t[l];)if(1===t.nodeType||f)if(o=(r=t[C]||(t[C]={}))[t.uniqueID]||(r[t.uniqueID]={}),u&&u===t.nodeName.toLowerCase())t=t[l]||t;else{if((i=o[c])&&i[0]===x&&i[1]===d)return s[2]=i[2];if((o[c]=s)[2]=a(t,e,n))return!0}return!1}}function bt(o){return 1<o.length?function(t,e,n){for(var i=o.length;i--;)if(!o[i](t,e,n))return!1;return!0}:o[0]}function wt(t,e,n,i,o){for(var r,s=[],a=0,l=t.length,u=null!=e;a<l;a++)(r=t[a])&&(n&&!n(r,i,o)||(s.push(r),u&&e.push(a)));return s}function kt(h,p,g,m,v,t){return m&&!m[C]&&(m=kt(m)),v&&!v[C]&&(v=kt(v,t)),ut(function(t,e,n,i){var o,r,s,a=[],l=[],u=e.length,c=t||function(t,e,n){for(var i=0,o=e.length;i<o;i++)at(t,e[i],n);return n}(p||"*",n.nodeType?[n]:n,[]),f=!h||!t&&p?c:wt(c,a,h,n,i),d=g?v||(t?h:u||m)?[]:e:f;if(g&&g(f,d,n,i),m)for(o=wt(d,l),m(o,[],n,i),r=o.length;r--;)(s=o[r])&&(d[l[r]]=!(f[l[r]]=s));if(t){if(v||h){if(v){for(o=[],r=d.length;r--;)(s=d[r])&&o.push(f[r]=s);v(null,d=[],o,i)}for(r=d.length;r--;)(s=d[r])&&-1<(o=v?R(t,s):a[r])&&(t[o]=!(e[o]=s))}}else d=wt(d===e?d.splice(u,d.length):d),v?v(null,e,d,i):D.apply(e,d)})}function _t(m,v){function t(t,e,n,i,o){var r,s,a,l=0,u="0",c=t&&[],f=[],d=k,h=t||b&&w.find.TAG("*",o),p=x+=null==d?1:Math.random()||.1,g=h.length;for(o&&(k=e==$||e||o);u!==g&&null!=(r=h[u]);u++){if(b&&r){for(s=0,e||r.ownerDocument==$||(_(r),n=!j);a=m[s++];)if(a(r,e||$,n)){i.push(r);break}o&&(x=p)}y&&((r=!a&&r)&&l--,t&&c.push(r))}if(l+=u,y&&u!==l){for(s=0;a=v[s++];)a(c,f,e,n);if(t){if(0<l)for(;u--;)c[u]||f[u]||(f[u]=P.call(i));f=wt(f)}D.apply(i,f),o&&!t&&0<f.length&&1<l+v.length&&at.uniqueSort(i)}return o&&(x=p,k=d),c}var y=0<v.length,b=0<m.length;return y?ut(t):t}return mt.prototype=w.filters=w.pseudos,w.setFilters=new mt,p=at.tokenize=function(t,e){var n,i,o,r,s,a,l,u=O[t+" "];if(u)return e?0:u.slice(0);for(s=t,a=[],l=w.preFilter;s;){for(r in n&&!(i=Q.exec(s))||(i&&(s=s.slice(i[0].length)||s),a.push(o=[])),n=!1,(i=G.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(W," ")}),s=s.slice(n.length)),w.filter)!(i=V[r].exec(s))||l[r]&&!(i=l[r](i))||(n=i.shift(),o.push({value:n,type:r,matches:i}),s=s.slice(n.length));if(!n)break}return e?s.length:s?at.error(t):O(t,a).slice(0)},d=at.compile=function(t,e){var n,i=[],o=[],r=S[t+" "];if(!r){for(n=(e=e||p(t)).length;n--;)(r=function t(e){for(var o,n,i,r=e.length,s=w.relative[e[0].type],a=s||w.relative[" "],l=s?1:0,u=yt(function(t){return t===o},a,!0),c=yt(function(t){return-1<R(o,t)},a,!0),f=[function(t,e,n){var i=!s&&(n||e!==k)||((o=e).nodeType?u:c)(t,e,n);return o=null,i}];l<r;l++)if(n=w.relative[e[l].type])f=[yt(bt(f),n)];else{if((n=w.filter[e[l].type].apply(null,e[l].matches))[C]){for(i=++l;i<r&&!w.relative[e[i].type];i++);return kt(1<l&&bt(f),1<l&&vt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(W,"$1"),n,l<i&&t(e.slice(l,i)),i<r&&t(e=e.slice(i)),i<r&&vt(e))}f.push(n)}return bt(f)}(e[n]))[C]?i.push(r):o.push(r);(r=S(t,_t(o,i))).selector=t}return r},g=at.select=function(t,e,n,i){var o,r,s,a,l,u="function"==typeof t&&t,c=!i&&p(t=u.selector||t);if(n=n||[],1===c.length){if(2<(r=c[0]=c[0].slice(0)).length&&"ID"===(s=r[0]).type&&9===e.nodeType&&j&&w.relative[r[1].type]){if(!(e=(w.find.ID(s.matches[0].replace(it,f),e)||[])[0]))return n;u&&(e=e.parentNode),t=t.slice(r.shift().value.length)}for(o=V.needsContext.test(t)?0:r.length;o--&&(s=r[o],!w.relative[a=s.type]);)if((l=w.find[a])&&(i=l(s.matches[0].replace(it,f),nt.test(r[0].type)&&gt(e.parentNode)||e))){if(r.splice(o,1),!(t=i.length&&vt(r)))return D.apply(n,i),n;break}}return(u||d(t,c))(i,e,!j,n,!e||nt.test(t)&&gt(e.parentNode)||e),n},h.sortStable=C.split("").sort(E).join("")===C,h.detectDuplicates=!!u,_(),h.sortDetached=ct(function(t){return 1&t.compareDocumentPosition($.createElement("fieldset"))}),ct(function(t){return t.innerHTML="<a href='#'></a>","#"===t.firstChild.getAttribute("href")})||ft("type|href|height|width",function(t,e,n){if(!n)return t.getAttribute(e,"type"===e.toLowerCase()?1:2)}),h.attributes&&ct(function(t){return t.innerHTML="<input/>",t.firstChild.setAttribute("value",""),""===t.firstChild.getAttribute("value")})||ft("value",function(t,e,n){if(!n&&"input"===t.nodeName.toLowerCase())return t.defaultValue}),ct(function(t){return null==t.getAttribute("disabled")})||ft(q,function(t,e,n){var i;if(!n)return!0===t[e]?e.toLowerCase():(i=t.getAttributeNode(e))&&i.specified?i.value:null}),at}($);C.find=d,C.expr=d.selectors,C.expr[":"]=C.expr.pseudos,C.uniqueSort=C.unique=d.uniqueSort,C.text=d.getText,C.isXMLDoc=d.isXML,C.contains=d.contains,C.escapeSelector=d.escape;function h(t,e,n){for(var i=[],o=void 0!==n;(t=t[e])&&9!==t.nodeType;)if(1===t.nodeType){if(o&&C(t).is(n))break;i.push(t)}return i}function p(t,e){for(var n=[];t;t=t.nextSibling)1===t.nodeType&&t!==e&&n.push(t);return n}var _=C.expr.match.needsContext;function x(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}var T=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function O(t,n,i){return b(n)?C.grep(t,function(t,e){return!!n.call(t,e,t)!==i}):n.nodeType?C.grep(t,function(t){return t===n!==i}):"string"!=typeof n?C.grep(t,function(t){return-1<o.call(n,t)!==i}):C.filter(n,t,i)}C.filter=function(t,e,n){var i=e[0];return n&&(t=":not("+t+")"),1===e.length&&1===i.nodeType?C.find.matchesSelector(i,t)?[i]:[]:C.find.matches(t,C.grep(e,function(t){return 1===t.nodeType}))},C.fn.extend({find:function(t){var e,n,i=this.length,o=this;if("string"!=typeof t)return this.pushStack(C(t).filter(function(){for(e=0;e<i;e++)if(C.contains(o[e],this))return!0}));for(n=this.pushStack([]),e=0;e<i;e++)C.find(t,o[e],n);return 1<i?C.uniqueSort(n):n},filter:function(t){return this.pushStack(O(this,t||[],!1))},not:function(t){return this.pushStack(O(this,t||[],!0))},is:function(t){return!!O(this,"string"==typeof t&&_.test(t)?C(t):t||[],!1).length}});var S,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(C.fn.init=function(t,e,n){var i,o;if(!t)return this;if(n=n||S,"string"!=typeof t)return t.nodeType?(this[0]=t,this.length=1,this):b(t)?void 0!==n.ready?n.ready(t):t(C):C.makeArray(t,this);if(!(i="<"===t[0]&&">"===t[t.length-1]&&3<=t.length?[null,t,null]:z.exec(t))||!i[1]&&e)return!e||e.jquery?(e||n).find(t):this.constructor(e).find(t);if(i[1]){if(e=e instanceof C?e[0]:e,C.merge(this,C.parseHTML(i[1],e&&e.nodeType?e.ownerDocument||e:j,!0)),T.test(i[1])&&C.isPlainObject(e))for(i in e)b(this[i])?this[i](e[i]):this.attr(i,e[i]);return this}return(o=j.getElementById(i[2]))&&(this[0]=o,this.length=1),this}).prototype=C.fn,S=C(j);var E=/^(?:parents|prev(?:Until|All))/,A={children:!0,contents:!0,next:!0,prev:!0};function P(t,e){for(;(t=t[e])&&1!==t.nodeType;);return t}C.fn.extend({has:function(t){var e=C(t,this),n=e.length;return this.filter(function(){for(var t=0;t<n;t++)if(C.contains(this,e[t]))return!0})},closest:function(t,e){var n,i=0,o=this.length,r=[],s="string"!=typeof t&&C(t);if(!_.test(t))for(;i<o;i++)for(n=this[i];n&&n!==e;n=n.parentNode)if(n.nodeType<11&&(s?-1<s.index(n):1===n.nodeType&&C.find.matchesSelector(n,t))){r.push(n);break}return this.pushStack(1<r.length?C.uniqueSort(r):r)},index:function(t){return t?"string"==typeof t?o.call(C(t),this[0]):o.call(this,t.jquery?t[0]:t):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(t,e){return this.pushStack(C.uniqueSort(C.merge(this.get(),C(t,e))))},addBack:function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}}),C.each({parent:function(t){var e=t.parentNode;return e&&11!==e.nodeType?e:null},parents:function(t){return h(t,"parentNode")},parentsUntil:function(t,e,n){return h(t,"parentNode",n)},next:function(t){return P(t,"nextSibling")},prev:function(t){return P(t,"previousSibling")},nextAll:function(t){return h(t,"nextSibling")},prevAll:function(t){return h(t,"previousSibling")},nextUntil:function(t,e,n){return h(t,"nextSibling",n)},prevUntil:function(t,e,n){return h(t,"previousSibling",n)},siblings:function(t){return p((t.parentNode||{}).firstChild,t)},children:function(t){return p(t.firstChild)},contents:function(t){return null!=t.contentDocument&&i(t.contentDocument)?t.contentDocument:(x(t,"template")&&(t=t.content||t),C.merge([],t.childNodes))}},function(i,o){C.fn[i]=function(t,e){var n=C.map(this,o,t);return"Until"!==i.slice(-5)&&(e=t),e&&"string"==typeof e&&(n=C.filter(e,n)),1<this.length&&(A[i]||C.uniqueSort(n),E.test(i)&&n.reverse()),this.pushStack(n)}});var L=/[^\x20\t\r\n\f]+/g;function D(t){return t}function M(t){throw t}function R(t,e,n,i){var o;try{t&&b(o=t.promise)?o.call(t).done(e).fail(n):t&&b(o=t.then)?o.call(t,e,n):e.apply(void 0,[t].slice(i))}catch(t){n.apply(void 0,[t])}}C.Callbacks=function(i){var t,n;i="string"==typeof i?(t=i,n={},C.each(t.match(L)||[],function(t,e){n[e]=!0}),n):C.extend({},i);function o(){for(a=a||i.once,s=r=!0;u.length;c=-1)for(e=u.shift();++c<l.length;)!1===l[c].apply(e[0],e[1])&&i.stopOnFalse&&(c=l.length,e=!1);i.memory||(e=!1),r=!1,a&&(l=e?[]:"")}var r,e,s,a,l=[],u=[],c=-1,f={add:function(){return l&&(e&&!r&&(c=l.length-1,u.push(e)),function n(t){C.each(t,function(t,e){b(e)?i.unique&&f.has(e)||l.push(e):e&&e.length&&"string"!==k(e)&&n(e)})}(arguments),e&&!r&&o()),this},remove:function(){return C.each(arguments,function(t,e){for(var n;-1<(n=C.inArray(e,l,n));)l.splice(n,1),n<=c&&c--}),this},has:function(t){return t?-1<C.inArray(t,l):0<l.length},empty:function(){return l=l&&[],this},disable:function(){return a=u=[],l=e="",this},disabled:function(){return!l},lock:function(){return a=u=[],e||r||(l=e=""),this},locked:function(){return!!a},fireWith:function(t,e){return a||(e=[t,(e=e||[]).slice?e.slice():e],u.push(e),r||o()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!s}};return f},C.extend({Deferred:function(t){var r=[["notify","progress",C.Callbacks("memory"),C.Callbacks("memory"),2],["resolve","done",C.Callbacks("once memory"),C.Callbacks("once memory"),0,"resolved"],["reject","fail",C.Callbacks("once memory"),C.Callbacks("once memory"),1,"rejected"]],o="pending",s={state:function(){return o},always:function(){return a.done(arguments).fail(arguments),this},catch:function(t){return s.then(null,t)},pipe:function(){var o=arguments;return C.Deferred(function(i){C.each(r,function(t,e){var n=b(o[e[4]])&&o[e[4]];a[e[1]](function(){var t=n&&n.apply(this,arguments);t&&b(t.promise)?t.promise().progress(i.notify).done(i.resolve).fail(i.reject):i[e[0]+"With"](this,n?[t]:arguments)})}),o=null}).promise()},then:function(e,n,i){var l=0;function u(o,r,s,a){return function(){function t(){var t,e;if(!(o<l)){if((t=s.apply(n,i))===r.promise())throw new TypeError("Thenable self-resolution");e=t&&("object"==typeof t||"function"==typeof t)&&t.then,b(e)?a?e.call(t,u(l,r,D,a),u(l,r,M,a)):(l++,e.call(t,u(l,r,D,a),u(l,r,M,a),u(l,r,D,r.notifyWith))):(s!==D&&(n=void 0,i=[t]),(a||r.resolveWith)(n,i))}}var n=this,i=arguments,e=a?t:function(){try{t()}catch(t){C.Deferred.exceptionHook&&C.Deferred.exceptionHook(t,e.stackTrace),l<=o+1&&(s!==M&&(n=void 0,i=[t]),r.rejectWith(n,i))}};o?e():(C.Deferred.getStackHook&&(e.stackTrace=C.Deferred.getStackHook()),$.setTimeout(e))}}return C.Deferred(function(t){r[0][3].add(u(0,t,b(i)?i:D,t.notifyWith)),r[1][3].add(u(0,t,b(e)?e:D)),r[2][3].add(u(0,t,b(n)?n:M))}).promise()},promise:function(t){return null!=t?C.extend(t,s):s}},a={};return C.each(r,function(t,e){var n=e[2],i=e[5];s[e[1]]=n.add,i&&n.add(function(){o=i},r[3-t][2].disable,r[3-t][3].disable,r[0][2].lock,r[0][3].lock),n.add(e[3].fire),a[e[0]]=function(){return a[e[0]+"With"](this===a?void 0:this,arguments),this},a[e[0]+"With"]=n.fireWith}),s.promise(a),t&&t.call(a,a),a},when:function(t){function e(e){return function(t){o[e]=this,r[e]=1<arguments.length?a.call(arguments):t,--n||s.resolveWith(o,r)}}var n=arguments.length,i=n,o=Array(i),r=a.call(arguments),s=C.Deferred();if(n<=1&&(R(t,s.done(e(i)).resolve,s.reject,!n),"pending"===s.state()||b(r[i]&&r[i].then)))return s.then();for(;i--;)R(r[i],e(i),s.reject);return s.promise()}});var q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;C.Deferred.exceptionHook=function(t,e){$.console&&$.console.warn&&t&&q.test(t.name)&&$.console.warn("jQuery.Deferred exception: "+t.message,t.stack,e)},C.readyException=function(t){$.setTimeout(function(){throw t})};var H=C.Deferred();function N(){j.removeEventListener("DOMContentLoaded",N),$.removeEventListener("load",N),C.ready()}C.fn.ready=function(t){return H.then(t).catch(function(t){C.readyException(t)}),this},C.extend({isReady:!1,readyWait:1,ready:function(t){(!0===t?--C.readyWait:C.isReady)||(C.isReady=!0)!==t&&0<--C.readyWait||H.resolveWith(j,[C])}}),C.ready.then=H.then,"complete"===j.readyState||"loading"!==j.readyState&&!j.documentElement.doScroll?$.setTimeout(C.ready):(j.addEventListener("DOMContentLoaded",N),$.addEventListener("load",N));var I=function(t,e,n,i,o,r,s){var a=0,l=t.length,u=null==n;if("object"===k(n))for(a in o=!0,n)I(t,e,a,n[a],!0,r,s);else if(void 0!==i&&(o=!0,b(i)||(s=!0),u&&(e=s?(e.call(t,i),null):(u=e,function(t,e,n){return u.call(C(t),n)})),e))for(;a<l;a++)e(t[a],n,s?i:i.call(t[a],a,e(t[a],n)));return o?t:u?e.call(t):l?e(t[0],n):r},F=/^-ms-/,B=/-([a-z])/g;function W(t,e){return e.toUpperCase()}function Q(t){return t.replace(F,"ms-").replace(B,W)}function G(t){return 1===t.nodeType||9===t.nodeType||!+t.nodeType}function U(){this.expando=C.expando+U.uid++}U.uid=1,U.prototype={cache:function(t){var e=t[this.expando];return e||(e={},G(t)&&(t.nodeType?t[this.expando]=e:Object.defineProperty(t,this.expando,{value:e,configurable:!0}))),e},set:function(t,e,n){var i,o=this.cache(t);if("string"==typeof e)o[Q(e)]=n;else for(i in e)o[Q(i)]=e[i];return o},get:function(t,e){return void 0===e?this.cache(t):t[this.expando]&&t[this.expando][Q(e)]},access:function(t,e,n){return void 0===e||e&&"string"==typeof e&&void 0===n?this.get(t,e):(this.set(t,e,n),void 0!==n?n:e)},remove:function(t,e){var n,i=t[this.expando];if(void 0!==i){if(void 0!==e){n=(e=Array.isArray(e)?e.map(Q):(e=Q(e))in i?[e]:e.match(L)||[]).length;for(;n--;)delete i[e[n]]}void 0!==e&&!C.isEmptyObject(i)||(t.nodeType?t[this.expando]=void 0:delete t[this.expando])}},hasData:function(t){var e=t[this.expando];return void 0!==e&&!C.isEmptyObject(e)}};var K=new U,Y=new U,V=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,X=/[A-Z]/g;function Z(t,e,n){var i,o;if(void 0===n&&1===t.nodeType)if(i="data-"+e.replace(X,"-$&").toLowerCase(),"string"==typeof(n=t.getAttribute(i))){try{n="true"===(o=n)||"false"!==o&&("null"===o?null:o===+o+""?+o:V.test(o)?JSON.parse(o):o)}catch(t){}Y.set(t,e,n)}else n=void 0;return n}C.extend({hasData:function(t){return Y.hasData(t)||K.hasData(t)},data:function(t,e,n){return Y.access(t,e,n)},removeData:function(t,e){Y.remove(t,e)},_data:function(t,e,n){return K.access(t,e,n)},_removeData:function(t,e){K.remove(t,e)}}),C.fn.extend({data:function(n,t){var e,i,o,r=this[0],s=r&&r.attributes;if(void 0!==n)return"object"==typeof n?this.each(function(){Y.set(this,n)}):I(this,function(t){var e;return r&&void 0===t?void 0!==(e=Y.get(r,n))||void 0!==(e=Z(r,n))?e:void 0:void this.each(function(){Y.set(this,n,t)})},null,t,1<arguments.length,null,!0);if(this.length&&(o=Y.get(r),1===r.nodeType&&!K.get(r,"hasDataAttrs"))){for(e=s.length;e--;)s[e]&&0===(i=s[e].name).indexOf("data-")&&(i=Q(i.slice(5)),Z(r,i,o[i]));K.set(r,"hasDataAttrs",!0)}return o},removeData:function(t){return this.each(function(){Y.remove(this,t)})}}),C.extend({queue:function(t,e,n){var i;if(t)return e=(e||"fx")+"queue",i=K.get(t,e),n&&(!i||Array.isArray(n)?i=K.access(t,e,C.makeArray(n)):i.push(n)),i||[]},dequeue:function(t,e){e=e||"fx";var n=C.queue(t,e),i=n.length,o=n.shift(),r=C._queueHooks(t,e);"inprogress"===o&&(o=n.shift(),i--),o&&("fx"===e&&n.unshift("inprogress"),delete r.stop,o.call(t,function(){C.dequeue(t,e)},r)),!i&&r&&r.empty.fire()},_queueHooks:function(t,e){var n=e+"queueHooks";return K.get(t,n)||K.access(t,n,{empty:C.Callbacks("once memory").add(function(){K.remove(t,[e+"queue",n])})})}}),C.fn.extend({queue:function(e,n){var t=2;return"string"!=typeof e&&(n=e,e="fx",t--),arguments.length<t?C.queue(this[0],e):void 0===n?this:this.each(function(){var t=C.queue(this,e,n);C._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&C.dequeue(this,e)})},dequeue:function(t){return this.each(function(){C.dequeue(this,t)})},clearQueue:function(t){return this.queue(t||"fx",[])},promise:function(t,e){function n(){--o||r.resolveWith(s,[s])}var i,o=1,r=C.Deferred(),s=this,a=this.length;for("string"!=typeof t&&(e=t,t=void 0),t=t||"fx";a--;)(i=K.get(s[a],t+"queueHooks"))&&i.empty&&(o++,i.empty.add(n));return n(),r.promise(e)}});var J=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,tt=new RegExp("^(?:([+-])=|)("+J+")([a-z%]*)$","i"),et=["Top","Right","Bottom","Left"],nt=j.documentElement,it=function(t){return C.contains(t.ownerDocument,t)},ot={composed:!0};nt.getRootNode&&(it=function(t){return C.contains(t.ownerDocument,t)||t.getRootNode(ot)===t.ownerDocument});var rt=function(t,e){return"none"===(t=e||t).style.display||""===t.style.display&&it(t)&&"none"===C.css(t,"display")};function st(t,e,n,i){var o,r,s=20,a=i?function(){return i.cur()}:function(){return C.css(t,e,"")},l=a(),u=n&&n[3]||(C.cssNumber[e]?"":"px"),c=t.nodeType&&(C.cssNumber[e]||"px"!==u&&+l)&&tt.exec(C.css(t,e));if(c&&c[3]!==u){for(l/=2,u=u||c[3],c=+l||1;s--;)C.style(t,e,c+u),(1-r)*(1-(r=a()/l||.5))<=0&&(s=0),c/=r;c*=2,C.style(t,e,c+u),n=n||[]}return n&&(c=+c||+l||0,o=n[1]?c+(n[1]+1)*n[2]:+n[2],i&&(i.unit=u,i.start=c,i.end=o)),o}var at={};function lt(t,e){for(var n,i,o,r,s,a,l,u=[],c=0,f=t.length;c<f;c++)(i=t[c]).style&&(n=i.style.display,e?("none"===n&&(u[c]=K.get(i,"display")||null,u[c]||(i.style.display="")),""===i.style.display&&rt(i)&&(u[c]=(l=a=s=r=void 0,s=(o=i).ownerDocument,a=o.nodeName,(l=at[a])||(r=s.body.appendChild(s.createElement(a)),l=C.css(r,"display"),r.parentNode.removeChild(r),"none"===l&&(l="block"),at[a]=l)))):"none"!==n&&(u[c]="none",K.set(i,"display",n)));for(c=0;c<f;c++)null!=u[c]&&(t[c].style.display=u[c]);return t}C.fn.extend({show:function(){return lt(this,!0)},hide:function(){return lt(this)},toggle:function(t){return"boolean"==typeof t?t?this.show():this.hide():this.each(function(){rt(this)?C(this).show():C(this).hide()})}});var ut,ct,ft=/^(?:checkbox|radio)$/i,dt=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,ht=/^$|^module$|\/(?:java|ecma)script/i;ut=j.createDocumentFragment().appendChild(j.createElement("div")),(ct=j.createElement("input")).setAttribute("type","radio"),ct.setAttribute("checked","checked"),ct.setAttribute("name","t"),ut.appendChild(ct),y.checkClone=ut.cloneNode(!0).cloneNode(!0).lastChild.checked,ut.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ut.cloneNode(!0).lastChild.defaultValue,ut.innerHTML="<option></option>",y.option=!!ut.lastChild;var pt={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function gt(t,e){var n=void 0!==t.getElementsByTagName?t.getElementsByTagName(e||"*"):void 0!==t.querySelectorAll?t.querySelectorAll(e||"*"):[];return void 0===e||e&&x(t,e)?C.merge([t],n):n}function mt(t,e){for(var n=0,i=t.length;n<i;n++)K.set(t[n],"globalEval",!e||K.get(e[n],"globalEval"))}pt.tbody=pt.tfoot=pt.colgroup=pt.caption=pt.thead,pt.th=pt.td,y.option||(pt.optgroup=pt.option=[1,"<select multiple='multiple'>","</select>"]);var vt=/<|&#?\w+;/;function yt(t,e,n,i,o){for(var r,s,a,l,u,c,f=e.createDocumentFragment(),d=[],h=0,p=t.length;h<p;h++)if((r=t[h])||0===r)if("object"===k(r))C.merge(d,r.nodeType?[r]:r);else if(vt.test(r)){for(s=s||f.appendChild(e.createElement("div")),a=(dt.exec(r)||["",""])[1].toLowerCase(),l=pt[a]||pt._default,s.innerHTML=l[1]+C.htmlPrefilter(r)+l[2],c=l[0];c--;)s=s.lastChild;C.merge(d,s.childNodes),(s=f.firstChild).textContent=""}else d.push(e.createTextNode(r));for(f.textContent="",h=0;r=d[h++];)if(i&&-1<C.inArray(r,i))o&&o.push(r);else if(u=it(r),s=gt(f.appendChild(r),"script"),u&&mt(s),n)for(c=0;r=s[c++];)ht.test(r.type||"")&&n.push(r);return f}var bt=/^key/,wt=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,kt=/^([^.]*)(?:\.(.+)|)/;function _t(){return!0}function $t(){return!1}function jt(t,e){return t===function(){try{return j.activeElement}catch(t){}}()==("focus"===e)}function Ct(t,e,n,i,o,r){var s,a;if("object"==typeof e){for(a in"string"!=typeof n&&(i=i||n,n=void 0),e)Ct(t,a,n,i,e[a],r);return t}if(null==i&&null==o?(o=n,i=n=void 0):null==o&&("string"==typeof n?(o=i,i=void 0):(o=i,i=n,n=void 0)),!1===o)o=$t;else if(!o)return t;return 1===r&&(s=o,(o=function(t){return C().off(t),s.apply(this,arguments)}).guid=s.guid||(s.guid=C.guid++)),t.each(function(){C.event.add(this,e,o,i,n)})}function xt(t,o,r){r?(K.set(t,o,!1),C.event.add(t,o,{namespace:!1,handler:function(t){var e,n,i=K.get(this,o);if(1&t.isTrigger&&this[o]){if(i.length)(C.event.special[o]||{}).delegateType&&t.stopPropagation();else if(i=a.call(arguments),K.set(this,o,i),e=r(this,o),this[o](),i!==(n=K.get(this,o))||e?K.set(this,o,!1):n={},i!==n)return t.stopImmediatePropagation(),t.preventDefault(),n.value}else i.length&&(K.set(this,o,{value:C.event.trigger(C.extend(i[0],C.Event.prototype),i.slice(1),this)}),t.stopImmediatePropagation())}})):void 0===K.get(t,o)&&C.event.add(t,o,_t)}C.event={global:{},add:function(e,t,n,i,o){var r,s,a,l,u,c,f,d,h,p,g,m=K.get(e);if(G(e))for(n.handler&&(n=(r=n).handler,o=r.selector),o&&C.find.matchesSelector(nt,o),n.guid||(n.guid=C.guid++),(l=m.events)||(l=m.events=Object.create(null)),(s=m.handle)||(s=m.handle=function(t){return void 0!==C&&C.event.triggered!==t.type?C.event.dispatch.apply(e,arguments):void 0}),u=(t=(t||"").match(L)||[""]).length;u--;)h=g=(a=kt.exec(t[u])||[])[1],p=(a[2]||"").split(".").sort(),h&&(f=C.event.special[h]||{},h=(o?f.delegateType:f.bindType)||h,f=C.event.special[h]||{},c=C.extend({type:h,origType:g,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&C.expr.match.needsContext.test(o),namespace:p.join(".")},r),(d=l[h])||((d=l[h]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,i,p,s)||e.addEventListener&&e.addEventListener(h,s)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),o?d.splice(d.delegateCount++,0,c):d.push(c),C.event.global[h]=!0)},remove:function(t,e,n,i,o){var r,s,a,l,u,c,f,d,h,p,g,m=K.hasData(t)&&K.get(t);if(m&&(l=m.events)){for(u=(e=(e||"").match(L)||[""]).length;u--;)if(h=g=(a=kt.exec(e[u])||[])[1],p=(a[2]||"").split(".").sort(),h){for(f=C.event.special[h]||{},d=l[h=(i?f.delegateType:f.bindType)||h]||[],a=a[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=r=d.length;r--;)c=d[r],!o&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||i&&i!==c.selector&&("**"!==i||!c.selector)||(d.splice(r,1),c.selector&&d.delegateCount--,f.remove&&f.remove.call(t,c));s&&!d.length&&(f.teardown&&!1!==f.teardown.call(t,p,m.handle)||C.removeEvent(t,h,m.handle),delete l[h])}else for(h in l)C.event.remove(t,h+e[u],n,i,!0);C.isEmptyObject(l)&&K.remove(t,"handle events")}},dispatch:function(t){var e,n,i,o,r,s,a=new Array(arguments.length),l=C.event.fix(t),u=(K.get(this,"events")||Object.create(null))[l.type]||[],c=C.event.special[l.type]||{};for(a[0]=l,e=1;e<arguments.length;e++)a[e]=arguments[e];if(l.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,l)){for(s=C.event.handlers.call(this,l,u),e=0;(o=s[e++])&&!l.isPropagationStopped();)for(l.currentTarget=o.elem,n=0;(r=o.handlers[n++])&&!l.isImmediatePropagationStopped();)l.rnamespace&&!1!==r.namespace&&!l.rnamespace.test(r.namespace)||(l.handleObj=r,l.data=r.data,void 0!==(i=((C.event.special[r.origType]||{}).handle||r.handler).apply(o.elem,a))&&!1===(l.result=i)&&(l.preventDefault(),l.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,l),l.result}},handlers:function(t,e){var n,i,o,r,s,a=[],l=e.delegateCount,u=t.target;if(l&&u.nodeType&&!("click"===t.type&&1<=t.button))for(;u!==this;u=u.parentNode||this)if(1===u.nodeType&&("click"!==t.type||!0!==u.disabled)){for(r=[],s={},n=0;n<l;n++)void 0===s[o=(i=e[n]).selector+" "]&&(s[o]=i.needsContext?-1<C(o,this).index(u):C.find(o,this,null,[u]).length),s[o]&&r.push(i);r.length&&a.push({elem:u,handlers:r})}return u=this,l<e.length&&a.push({elem:u,handlers:e.slice(l)}),a},addProp:function(e,t){Object.defineProperty(C.Event.prototype,e,{enumerable:!0,configurable:!0,get:b(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(t){return t[C.expando]?t:new C.Event(t)},special:{load:{noBubble:!0},click:{setup:function(t){var e=this||t;return ft.test(e.type)&&e.click&&x(e,"input")&&xt(e,"click",_t),!1},trigger:function(t){var e=this||t;return ft.test(e.type)&&e.click&&x(e,"input")&&xt(e,"click"),!0},_default:function(t){var e=t.target;return ft.test(e.type)&&e.click&&x(e,"input")&&K.get(e,"click")||x(e,"a")}},beforeunload:{postDispatch:function(t){void 0!==t.result&&t.originalEvent&&(t.originalEvent.returnValue=t.result)}}}},C.removeEvent=function(t,e,n){t.removeEventListener&&t.removeEventListener(e,n)},C.Event=function(t,e){if(!(this instanceof C.Event))return new C.Event(t,e);t&&t.type?(this.originalEvent=t,this.type=t.type,this.isDefaultPrevented=t.defaultPrevented||void 0===t.defaultPrevented&&!1===t.returnValue?_t:$t,this.target=t.target&&3===t.target.nodeType?t.target.parentNode:t.target,this.currentTarget=t.currentTarget,this.relatedTarget=t.relatedTarget):this.type=t,e&&C.extend(this,e),this.timeStamp=t&&t.timeStamp||Date.now(),this[C.expando]=!0},C.Event.prototype={constructor:C.Event,isDefaultPrevented:$t,isPropagationStopped:$t,isImmediatePropagationStopped:$t,isSimulated:!1,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=_t,t&&!this.isSimulated&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=_t,t&&!this.isSimulated&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=_t,t&&!this.isSimulated&&t.stopImmediatePropagation(),this.stopPropagation()}},C.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(t){var e=t.button;return null==t.which&&bt.test(t.type)?null!=t.charCode?t.charCode:t.keyCode:!t.which&&void 0!==e&&wt.test(t.type)?1&e?1:2&e?3:4&e?2:0:t.which}},C.event.addProp),C.each({focus:"focusin",blur:"focusout"},function(t,e){C.event.special[t]={setup:function(){return xt(this,t,jt),!1},trigger:function(){return xt(this,t),!0},delegateType:e}}),C.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(t,o){C.event.special[t]={delegateType:o,bindType:o,handle:function(t){var e,n=t.relatedTarget,i=t.handleObj;return n&&(n===this||C.contains(this,n))||(t.type=i.origType,e=i.handler.apply(this,arguments),t.type=o),e}}}),C.fn.extend({on:function(t,e,n,i){return Ct(this,t,e,n,i)},one:function(t,e,n,i){return Ct(this,t,e,n,i,1)},off:function(t,e,n){var i,o;if(t&&t.preventDefault&&t.handleObj)return i=t.handleObj,C(t.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"!=typeof t)return!1!==e&&"function"!=typeof e||(n=e,e=void 0),!1===n&&(n=$t),this.each(function(){C.event.remove(this,t,n,e)});for(o in t)this.off(o,e,t[o]);return this}});var Tt=/<script|<style|<link/i,Ot=/checked\s*(?:[^=]|=\s*.checked.)/i,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function zt(t,e){return x(t,"table")&&x(11!==e.nodeType?e:e.firstChild,"tr")&&C(t).children("tbody")[0]||t}function Et(t){return t.type=(null!==t.getAttribute("type"))+"/"+t.type,t}function At(t){return"true/"===(t.type||"").slice(0,5)?t.type=t.type.slice(5):t.removeAttribute("type"),t}function Pt(t,e){var n,i,o,r,s,a;if(1===e.nodeType){if(K.hasData(t)&&(a=K.get(t).events))for(o in K.remove(e,"handle events"),a)for(n=0,i=a[o].length;n<i;n++)C.event.add(e,o,a[o][n]);Y.hasData(t)&&(r=Y.access(t),s=C.extend({},r),Y.set(e,s))}}function Lt(n,i,o,r){i=m(i);var t,e,s,a,l,u,c=0,f=n.length,d=f-1,h=i[0],p=b(h);if(p||1<f&&"string"==typeof h&&!y.checkClone&&Ot.test(h))return n.each(function(t){var e=n.eq(t);p&&(i[0]=h.call(this,t,e.html())),Lt(e,i,o,r)});if(f&&(e=(t=yt(i,n[0].ownerDocument,!1,n,r)).firstChild,1===t.childNodes.length&&(t=e),e||r)){for(a=(s=C.map(gt(t,"script"),Et)).length;c<f;c++)l=t,c!==d&&(l=C.clone(l,!0,!0),a&&C.merge(s,gt(l,"script"))),o.call(n[c],l,c);if(a)for(u=s[s.length-1].ownerDocument,C.map(s,At),c=0;c<a;c++)l=s[c],ht.test(l.type||"")&&!K.access(l,"globalEval")&&C.contains(u,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?C._evalUrl&&!l.noModule&&C._evalUrl(l.src,{nonce:l.nonce||l.getAttribute("nonce")},u):w(l.textContent.replace(St,""),l,u))}return n}function Dt(t,e,n){for(var i,o=e?C.filter(e,t):t,r=0;null!=(i=o[r]);r++)n||1!==i.nodeType||C.cleanData(gt(i)),i.parentNode&&(n&&it(i)&&mt(gt(i,"script")),i.parentNode.removeChild(i));return t}C.extend({htmlPrefilter:function(t){return t},clone:function(t,e,n){var i,o,r,s,a,l,u,c=t.cloneNode(!0),f=it(t);if(!(y.noCloneChecked||1!==t.nodeType&&11!==t.nodeType||C.isXMLDoc(t)))for(s=gt(c),i=0,o=(r=gt(t)).length;i<o;i++)a=r[i],l=s[i],u=void 0,"input"===(u=l.nodeName.toLowerCase())&&ft.test(a.type)?l.checked=a.checked:"input"!==u&&"textarea"!==u||(l.defaultValue=a.defaultValue);if(e)if(n)for(r=r||gt(t),s=s||gt(c),i=0,o=r.length;i<o;i++)Pt(r[i],s[i]);else Pt(t,c);return 0<(s=gt(c,"script")).length&&mt(s,!f&&gt(t,"script")),c},cleanData:function(t){for(var e,n,i,o=C.event.special,r=0;void 0!==(n=t[r]);r++)if(G(n)){if(e=n[K.expando]){if(e.events)for(i in e.events)o[i]?C.event.remove(n,i):C.removeEvent(n,i,e.handle);n[K.expando]=void 0}n[Y.expando]&&(n[Y.expando]=void 0)}}}),C.fn.extend({detach:function(t){return Dt(this,t,!0)},remove:function(t){return Dt(this,t)},text:function(t){return I(this,function(t){return void 0===t?C.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=t)})},null,t,arguments.length)},append:function(){return Lt(this,arguments,function(t){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||zt(this,t).appendChild(t)})},prepend:function(){return Lt(this,arguments,function(t){var e;1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(e=zt(this,t)).insertBefore(t,e.firstChild)})},before:function(){return Lt(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this)})},after:function(){return Lt(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this.nextSibling)})},empty:function(){for(var t,e=0;null!=(t=this[e]);e++)1===t.nodeType&&(C.cleanData(gt(t,!1)),t.textContent="");return this},clone:function(t,e){return t=null!=t&&t,e=null==e?t:e,this.map(function(){return C.clone(this,t,e)})},html:function(t){return I(this,function(t){var e=this[0]||{},n=0,i=this.length;if(void 0===t&&1===e.nodeType)return e.innerHTML;if("string"==typeof t&&!Tt.test(t)&&!pt[(dt.exec(t)||["",""])[1].toLowerCase()]){t=C.htmlPrefilter(t);try{for(;n<i;n++)1===(e=this[n]||{}).nodeType&&(C.cleanData(gt(e,!1)),e.innerHTML=t);e=0}catch(t){}}e&&this.empty().append(t)},null,t,arguments.length)},replaceWith:function(){var n=[];return Lt(this,arguments,function(t){var e=this.parentNode;C.inArray(this,n)<0&&(C.cleanData(gt(this)),e&&e.replaceChild(t,this))},n)}}),C.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,s){C.fn[t]=function(t){for(var e,n=[],i=C(t),o=i.length-1,r=0;r<=o;r++)e=r===o?this:this.clone(!0),C(i[r])[s](e),l.apply(n,e.get());return this.pushStack(n)}});function Mt(t,e,n){var i,o,r={};for(o in e)r[o]=t.style[o],t.style[o]=e[o];for(o in i=n.call(t),e)t.style[o]=r[o];return i}var Rt,qt,Ht,Nt,It,Ft,Bt,Wt,Qt=new RegExp("^("+J+")(?!px)[a-z%]+$","i"),Gt=function(t){var e=t.ownerDocument.defaultView;return e&&e.opener||(e=$),e.getComputedStyle(t)},Ut=new RegExp(et.join("|"),"i");function Kt(){var t;Wt&&(Bt.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",Wt.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",nt.appendChild(Bt).appendChild(Wt),t=$.getComputedStyle(Wt),Rt="1%"!==t.top,Ft=12===Yt(t.marginLeft),Wt.style.right="60%",Nt=36===Yt(t.right),qt=36===Yt(t.width),Wt.style.position="absolute",Ht=12===Yt(Wt.offsetWidth/3),nt.removeChild(Bt),Wt=null)}function Yt(t){return Math.round(parseFloat(t))}function Vt(t,e,n){var i,o,r,s,a=t.style;return(n=n||Gt(t))&&(""!==(s=n.getPropertyValue(e)||n[e])||it(t)||(s=C.style(t,e)),!y.pixelBoxStyles()&&Qt.test(s)&&Ut.test(e)&&(i=a.width,o=a.minWidth,r=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=i,a.minWidth=o,a.maxWidth=r)),void 0!==s?s+"":s}function Xt(t,e){return{get:function(){if(!t())return(this.get=e).apply(this,arguments);delete this.get}}}Bt=j.createElement("div"),(Wt=j.createElement("div")).style&&(Wt.style.backgroundClip="content-box",Wt.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===Wt.style.backgroundClip,C.extend(y,{boxSizingReliable:function(){return Kt(),qt},pixelBoxStyles:function(){return Kt(),Nt},pixelPosition:function(){return Kt(),Rt},reliableMarginLeft:function(){return Kt(),Ft},scrollboxSize:function(){return Kt(),Ht},reliableTrDimensions:function(){var t,e,n,i;return null==It&&(t=j.createElement("table"),e=j.createElement("tr"),n=j.createElement("div"),t.style.cssText="position:absolute;left:-11111px",e.style.height="1px",n.style.height="9px",nt.appendChild(t).appendChild(e).appendChild(n),i=$.getComputedStyle(e),It=3<parseInt(i.height),nt.removeChild(t)),It}}));var Zt=["Webkit","Moz","ms"],Jt=j.createElement("div").style,te={};function ee(t){var e=C.cssProps[t]||te[t];return e||(t in Jt?t:te[t]=function(t){for(var e=t[0].toUpperCase()+t.slice(1),n=Zt.length;n--;)if((t=Zt[n]+e)in Jt)return t}(t)||t)}var ne=/^(none|table(?!-c[ea]).+)/,ie=/^--/,oe={position:"absolute",visibility:"hidden",display:"block"},re={letterSpacing:"0",fontWeight:"400"};function se(t,e,n){var i=tt.exec(e);return i?Math.max(0,i[2]-(n||0))+(i[3]||"px"):e}function ae(t,e,n,i,o,r){var s="width"===e?1:0,a=0,l=0;if(n===(i?"border":"content"))return 0;for(;s<4;s+=2)"margin"===n&&(l+=C.css(t,n+et[s],!0,o)),i?("content"===n&&(l-=C.css(t,"padding"+et[s],!0,o)),"margin"!==n&&(l-=C.css(t,"border"+et[s]+"Width",!0,o))):(l+=C.css(t,"padding"+et[s],!0,o),"padding"!==n?l+=C.css(t,"border"+et[s]+"Width",!0,o):a+=C.css(t,"border"+et[s]+"Width",!0,o));return!i&&0<=r&&(l+=Math.max(0,Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-r-l-a-.5))||0),l}function le(t,e,n){var i=Gt(t),o=(!y.boxSizingReliable()||n)&&"border-box"===C.css(t,"boxSizing",!1,i),r=o,s=Vt(t,e,i),a="offset"+e[0].toUpperCase()+e.slice(1);if(Qt.test(s)){if(!n)return s;s="auto"}return(!y.boxSizingReliable()&&o||!y.reliableTrDimensions()&&x(t,"tr")||"auto"===s||!parseFloat(s)&&"inline"===C.css(t,"display",!1,i))&&t.getClientRects().length&&(o="border-box"===C.css(t,"boxSizing",!1,i),(r=a in t)&&(s=t[a])),(s=parseFloat(s)||0)+ae(t,e,n||(o?"border":"content"),r,i,s)+"px"}function ue(t,e,n,i,o){return new ue.prototype.init(t,e,n,i,o)}C.extend({cssHooks:{opacity:{get:function(t,e){if(e){var n=Vt(t,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(t,e,n,i){if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){var o,r,s,a=Q(e),l=ie.test(e),u=t.style;if(l||(e=ee(a)),s=C.cssHooks[e]||C.cssHooks[a],void 0===n)return s&&"get"in s&&void 0!==(o=s.get(t,!1,i))?o:u[e];"string"===(r=typeof n)&&(o=tt.exec(n))&&o[1]&&(n=st(t,e,o),r="number"),null!=n&&n==n&&("number"!==r||l||(n+=o&&o[3]||(C.cssNumber[a]?"":"px")),y.clearCloneStyle||""!==n||0!==e.indexOf("background")||(u[e]="inherit"),s&&"set"in s&&void 0===(n=s.set(t,n,i))||(l?u.setProperty(e,n):u[e]=n))}},css:function(t,e,n,i){var o,r,s,a=Q(e);return ie.test(e)||(e=ee(a)),(s=C.cssHooks[e]||C.cssHooks[a])&&"get"in s&&(o=s.get(t,!0,n)),void 0===o&&(o=Vt(t,e,i)),"normal"===o&&e in re&&(o=re[e]),""===n||n?(r=parseFloat(o),!0===n||isFinite(r)?r||0:o):o}}),C.each(["height","width"],function(t,l){C.cssHooks[l]={get:function(t,e,n){if(e)return!ne.test(C.css(t,"display"))||t.getClientRects().length&&t.getBoundingClientRect().width?le(t,l,n):Mt(t,oe,function(){return le(t,l,n)})},set:function(t,e,n){var i,o=Gt(t),r=!y.scrollboxSize()&&"absolute"===o.position,s=(r||n)&&"border-box"===C.css(t,"boxSizing",!1,o),a=n?ae(t,l,n,s,o):0;return s&&r&&(a-=Math.ceil(t["offset"+l[0].toUpperCase()+l.slice(1)]-parseFloat(o[l])-ae(t,l,"border",!1,o)-.5)),a&&(i=tt.exec(e))&&"px"!==(i[3]||"px")&&(t.style[l]=e,e=C.css(t,l)),se(0,e,a)}}}),C.cssHooks.marginLeft=Xt(y.reliableMarginLeft,function(t,e){if(e)return(parseFloat(Vt(t,"marginLeft"))||t.getBoundingClientRect().left-Mt(t,{marginLeft:0},function(){return t.getBoundingClientRect().left}))+"px"}),C.each({margin:"",padding:"",border:"Width"},function(o,r){C.cssHooks[o+r]={expand:function(t){for(var e=0,n={},i="string"==typeof t?t.split(" "):[t];e<4;e++)n[o+et[e]+r]=i[e]||i[e-2]||i[0];return n}},"margin"!==o&&(C.cssHooks[o+r].set=se)}),C.fn.extend({css:function(t,e){return I(this,function(t,e,n){var i,o,r={},s=0;if(Array.isArray(e)){for(i=Gt(t),o=e.length;s<o;s++)r[e[s]]=C.css(t,e[s],!1,i);return r}return void 0!==n?C.style(t,e,n):C.css(t,e)},t,e,1<arguments.length)}}),(C.Tween=ue).prototype={constructor:ue,init:function(t,e,n,i,o,r){this.elem=t,this.prop=n,this.easing=o||C.easing._default,this.options=e,this.start=this.now=this.cur(),this.end=i,this.unit=r||(C.cssNumber[n]?"":"px")},cur:function(){var t=ue.propHooks[this.prop];return t&&t.get?t.get(this):ue.propHooks._default.get(this)},run:function(t){var e,n=ue.propHooks[this.prop];return this.options.duration?this.pos=e=C.easing[this.easing](t,this.options.duration*t,0,1,this.options.duration):this.pos=e=t,this.now=(this.end-this.start)*e+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):ue.propHooks._default.set(this),this}},ue.prototype.init.prototype=ue.prototype,ue.propHooks={_default:{get:function(t){var e;return 1!==t.elem.nodeType||null!=t.elem[t.prop]&&null==t.elem.style[t.prop]?t.elem[t.prop]:(e=C.css(t.elem,t.prop,""))&&"auto"!==e?e:0},set:function(t){C.fx.step[t.prop]?C.fx.step[t.prop](t):1!==t.elem.nodeType||!C.cssHooks[t.prop]&&null==t.elem.style[ee(t.prop)]?t.elem[t.prop]=t.now:C.style(t.elem,t.prop,t.now+t.unit)}}},ue.propHooks.scrollTop=ue.propHooks.scrollLeft={set:function(t){t.elem.nodeType&&t.elem.parentNode&&(t.elem[t.prop]=t.now)}},C.easing={linear:function(t){return t},swing:function(t){return.5-Math.cos(t*Math.PI)/2},_default:"swing"},C.fx=ue.prototype.init,C.fx.step={};var ce,fe,de,he,pe=/^(?:toggle|show|hide)$/,ge=/queueHooks$/;function me(){fe&&(!1===j.hidden&&$.requestAnimationFrame?$.requestAnimationFrame(me):$.setTimeout(me,C.fx.interval),C.fx.tick())}function ve(){return $.setTimeout(function(){ce=void 0}),ce=Date.now()}function ye(t,e){var n,i=0,o={height:t};for(e=e?1:0;i<4;i+=2-e)o["margin"+(n=et[i])]=o["padding"+n]=t;return e&&(o.opacity=o.width=t),o}function be(t,e,n){for(var i,o=(we.tweeners[e]||[]).concat(we.tweeners["*"]),r=0,s=o.length;r<s;r++)if(i=o[r].call(n,e,t))return i}function we(r,t,e){var n,s,i=0,o=we.prefilters.length,a=C.Deferred().always(function(){delete l.elem}),l=function(){if(s)return!1;for(var t=ce||ve(),e=Math.max(0,u.startTime+u.duration-t),n=1-(e/u.duration||0),i=0,o=u.tweens.length;i<o;i++)u.tweens[i].run(n);return a.notifyWith(r,[u,n,e]),n<1&&o?e:(o||a.notifyWith(r,[u,1,0]),a.resolveWith(r,[u]),!1)},u=a.promise({elem:r,props:C.extend({},t),opts:C.extend(!0,{specialEasing:{},easing:C.easing._default},e),originalProperties:t,originalOptions:e,startTime:ce||ve(),duration:e.duration,tweens:[],createTween:function(t,e){var n=C.Tween(r,u.opts,t,e,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(n),n},stop:function(t){var e=0,n=t?u.tweens.length:0;if(s)return this;for(s=!0;e<n;e++)u.tweens[e].run(1);return t?(a.notifyWith(r,[u,1,0]),a.resolveWith(r,[u,t])):a.rejectWith(r,[u,t]),this}}),c=u.props;for(!function(t,e){var n,i,o,r,s;for(n in t)if(o=e[i=Q(n)],r=t[n],Array.isArray(r)&&(o=r[1],r=t[n]=r[0]),n!==i&&(t[i]=r,delete t[n]),(s=C.cssHooks[i])&&"expand"in s)for(n in r=s.expand(r),delete t[i],r)n in t||(t[n]=r[n],e[n]=o);else e[i]=o}(c,u.opts.specialEasing);i<o;i++)if(n=we.prefilters[i].call(u,r,c,u.opts))return b(n.stop)&&(C._queueHooks(u.elem,u.opts.queue).stop=n.stop.bind(n)),n;return C.map(c,be,u),b(u.opts.start)&&u.opts.start.call(r,u),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always),C.fx.timer(C.extend(l,{elem:r,anim:u,queue:u.opts.queue})),u}C.Animation=C.extend(we,{tweeners:{"*":[function(t,e){var n=this.createTween(t,e);return st(n.elem,t,tt.exec(e),n),n}]},tweener:function(t,e){for(var n,i=0,o=(t=b(t)?(e=t,["*"]):t.match(L)).length;i<o;i++)n=t[i],we.tweeners[n]=we.tweeners[n]||[],we.tweeners[n].unshift(e)},prefilters:[function(t,e,n){var i,o,r,s,a,l,u,c,f="width"in e||"height"in e,d=this,h={},p=t.style,g=t.nodeType&&rt(t),m=K.get(t,"fxshow");for(i in n.queue||(null==(s=C._queueHooks(t,"fx")).unqueued&&(s.unqueued=0,a=s.empty.fire,s.empty.fire=function(){s.unqueued||a()}),s.unqueued++,d.always(function(){d.always(function(){s.unqueued--,C.queue(t,"fx").length||s.empty.fire()})})),e)if(o=e[i],pe.test(o)){if(delete e[i],r=r||"toggle"===o,o===(g?"hide":"show")){if("show"!==o||!m||void 0===m[i])continue;g=!0}h[i]=m&&m[i]||C.style(t,i)}if((l=!C.isEmptyObject(e))||!C.isEmptyObject(h))for(i in f&&1===t.nodeType&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],null==(u=m&&m.display)&&(u=K.get(t,"display")),"none"===(c=C.css(t,"display"))&&(u?c=u:(lt([t],!0),u=t.style.display||u,c=C.css(t,"display"),lt([t]))),("inline"===c||"inline-block"===c&&null!=u)&&"none"===C.css(t,"float")&&(l||(d.done(function(){p.display=u}),null==u&&(c=p.display,u="none"===c?"":c)),p.display="inline-block")),n.overflow&&(p.overflow="hidden",d.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]})),l=!1,h)l||(m?"hidden"in m&&(g=m.hidden):m=K.access(t,"fxshow",{display:u}),r&&(m.hidden=!g),g&&lt([t],!0),d.done(function(){for(i in g||lt([t]),K.remove(t,"fxshow"),h)C.style(t,i,h[i])})),l=be(g?m[i]:0,i,d),i in m||(m[i]=l.start,g&&(l.end=l.start,l.start=0))}],prefilter:function(t,e){e?we.prefilters.unshift(t):we.prefilters.push(t)}}),C.speed=function(t,e,n){var i=t&&"object"==typeof t?C.extend({},t):{complete:n||!n&&e||b(t)&&t,duration:t,easing:n&&e||e&&!b(e)&&e};return C.fx.off?i.duration=0:"number"!=typeof i.duration&&(i.duration in C.fx.speeds?i.duration=C.fx.speeds[i.duration]:i.duration=C.fx.speeds._default),null!=i.queue&&!0!==i.queue||(i.queue="fx"),i.old=i.complete,i.complete=function(){b(i.old)&&i.old.call(this),i.queue&&C.dequeue(this,i.queue)},i},C.fn.extend({fadeTo:function(t,e,n,i){return this.filter(rt).css("opacity",0).show().end().animate({opacity:e},t,n,i)},animate:function(e,t,n,i){function o(){var t=we(this,C.extend({},e),s);(r||K.get(this,"finish"))&&t.stop(!0)}var r=C.isEmptyObject(e),s=C.speed(t,n,i);return o.finish=o,r||!1===s.queue?this.each(o):this.queue(s.queue,o)},stop:function(o,t,r){function s(t){var e=t.stop;delete t.stop,e(r)}return"string"!=typeof o&&(r=t,t=o,o=void 0),t&&this.queue(o||"fx",[]),this.each(function(){var t=!0,e=null!=o&&o+"queueHooks",n=C.timers,i=K.get(this);if(e)i[e]&&i[e].stop&&s(i[e]);else for(e in i)i[e]&&i[e].stop&&ge.test(e)&&s(i[e]);for(e=n.length;e--;)n[e].elem!==this||null!=o&&n[e].queue!==o||(n[e].anim.stop(r),t=!1,n.splice(e,1));!t&&r||C.dequeue(this,o)})},finish:function(s){return!1!==s&&(s=s||"fx"),this.each(function(){var t,e=K.get(this),n=e[s+"queue"],i=e[s+"queueHooks"],o=C.timers,r=n?n.length:0;for(e.finish=!0,C.queue(this,s,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===s&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<r;t++)n[t]&&n[t].finish&&n[t].finish.call(this);delete e.finish})}}),C.each(["toggle","show","hide"],function(t,i){var o=C.fn[i];C.fn[i]=function(t,e,n){return null==t||"boolean"==typeof t?o.apply(this,arguments):this.animate(ye(i,!0),t,e,n)}}),C.each({slideDown:ye("show"),slideUp:ye("hide"),slideToggle:ye("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(t,i){C.fn[t]=function(t,e,n){return this.animate(i,t,e,n)}}),C.timers=[],C.fx.tick=function(){var t,e=0,n=C.timers;for(ce=Date.now();e<n.length;e++)(t=n[e])()||n[e]!==t||n.splice(e--,1);n.length||C.fx.stop(),ce=void 0},C.fx.timer=function(t){C.timers.push(t),C.fx.start()},C.fx.interval=13,C.fx.start=function(){fe||(fe=!0,me())},C.fx.stop=function(){fe=null},C.fx.speeds={slow:600,fast:200,_default:400},C.fn.delay=function(i,t){return i=C.fx&&C.fx.speeds[i]||i,t=t||"fx",this.queue(t,function(t,e){var n=$.setTimeout(t,i);e.stop=function(){$.clearTimeout(n)}})},de=j.createElement("input"),he=j.createElement("select").appendChild(j.createElement("option")),de.type="checkbox",y.checkOn=""!==de.value,y.optSelected=he.selected,(de=j.createElement("input")).value="t",de.type="radio",y.radioValue="t"===de.value;var ke,_e=C.expr.attrHandle;C.fn.extend({attr:function(t,e){return I(this,C.attr,t,e,1<arguments.length)},removeAttr:function(t){return this.each(function(){C.removeAttr(this,t)})}}),C.extend({attr:function(t,e,n){var i,o,r=t.nodeType;if(3!==r&&8!==r&&2!==r)return void 0===t.getAttribute?C.prop(t,e,n):(1===r&&C.isXMLDoc(t)||(o=C.attrHooks[e.toLowerCase()]||(C.expr.match.bool.test(e)?ke:void 0)),void 0!==n?null===n?void C.removeAttr(t,e):o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:(t.setAttribute(e,n+""),n):!(o&&"get"in o&&null!==(i=o.get(t,e)))&&null==(i=C.find.attr(t,e))?void 0:i)},attrHooks:{type:{set:function(t,e){if(!y.radioValue&&"radio"===e&&x(t,"input")){var n=t.value;return t.setAttribute("type",e),n&&(t.value=n),e}}}},removeAttr:function(t,e){var n,i=0,o=e&&e.match(L);if(o&&1===t.nodeType)for(;n=o[i++];)t.removeAttribute(n)}}),ke={set:function(t,e,n){return!1===e?C.removeAttr(t,n):t.setAttribute(n,n),n}},C.each(C.expr.match.bool.source.match(/\w+/g),function(t,e){var s=_e[e]||C.find.attr;_e[e]=function(t,e,n){var i,o,r=e.toLowerCase();return n||(o=_e[r],_e[r]=i,i=null!=s(t,e,n)?r:null,_e[r]=o),i}});var $e=/^(?:input|select|textarea|button)$/i,je=/^(?:a|area)$/i;function Ce(t){return(t.match(L)||[]).join(" ")}function xe(t){return t.getAttribute&&t.getAttribute("class")||""}function Te(t){return Array.isArray(t)?t:"string"==typeof t&&t.match(L)||[]}C.fn.extend({prop:function(t,e){return I(this,C.prop,t,e,1<arguments.length)},removeProp:function(t){return this.each(function(){delete this[C.propFix[t]||t]})}}),C.extend({prop:function(t,e,n){var i,o,r=t.nodeType;if(3!==r&&8!==r&&2!==r)return 1===r&&C.isXMLDoc(t)||(e=C.propFix[e]||e,o=C.propHooks[e]),void 0!==n?o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:t[e]=n:o&&"get"in o&&null!==(i=o.get(t,e))?i:t[e]},propHooks:{tabIndex:{get:function(t){var e=C.find.attr(t,"tabindex");return e?parseInt(e,10):$e.test(t.nodeName)||je.test(t.nodeName)&&t.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),y.optSelected||(C.propHooks.selected={get:function(t){var e=t.parentNode;return e&&e.parentNode&&e.parentNode.selectedIndex,null},set:function(t){var e=t.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}}),C.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){C.propFix[this.toLowerCase()]=this}),C.fn.extend({addClass:function(e){var t,n,i,o,r,s,a,l=0;if(b(e))return this.each(function(t){C(this).addClass(e.call(this,t,xe(this)))});if((t=Te(e)).length)for(;n=this[l++];)if(o=xe(n),i=1===n.nodeType&&" "+Ce(o)+" "){for(s=0;r=t[s++];)i.indexOf(" "+r+" ")<0&&(i+=r+" ");o!==(a=Ce(i))&&n.setAttribute("class",a)}return this},removeClass:function(e){var t,n,i,o,r,s,a,l=0;if(b(e))return this.each(function(t){C(this).removeClass(e.call(this,t,xe(this)))});if(!arguments.length)return this.attr("class","");if((t=Te(e)).length)for(;n=this[l++];)if(o=xe(n),i=1===n.nodeType&&" "+Ce(o)+" "){for(s=0;r=t[s++];)for(;-1<i.indexOf(" "+r+" ");)i=i.replace(" "+r+" "," ");o!==(a=Ce(i))&&n.setAttribute("class",a)}return this},toggleClass:function(o,e){var r=typeof o,s="string"==r||Array.isArray(o);return"boolean"==typeof e&&s?e?this.addClass(o):this.removeClass(o):b(o)?this.each(function(t){C(this).toggleClass(o.call(this,t,xe(this),e),e)}):this.each(function(){var t,e,n,i;if(s)for(e=0,n=C(this),i=Te(o);t=i[e++];)n.hasClass(t)?n.removeClass(t):n.addClass(t);else void 0!==o&&"boolean"!=r||((t=xe(this))&&K.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",!t&&!1!==o&&K.get(this,"__className__")||""))})},hasClass:function(t){for(var e,n=0,i=" "+t+" ";e=this[n++];)if(1===e.nodeType&&-1<(" "+Ce(xe(e))+" ").indexOf(i))return!0;return!1}});var Oe=/\r/g;C.fn.extend({val:function(n){var i,t,o,e=this[0];return arguments.length?(o=b(n),this.each(function(t){var e;1===this.nodeType&&(null==(e=o?n.call(this,t,C(this).val()):n)?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=C.map(e,function(t){return null==t?"":t+""})),(i=C.valHooks[this.type]||C.valHooks[this.nodeName.toLowerCase()])&&"set"in i&&void 0!==i.set(this,e,"value")||(this.value=e))})):e?(i=C.valHooks[e.type]||C.valHooks[e.nodeName.toLowerCase()])&&"get"in i&&void 0!==(t=i.get(e,"value"))?t:"string"==typeof(t=e.value)?t.replace(Oe,""):null==t?"":t:void 0}}),C.extend({valHooks:{option:{get:function(t){var e=C.find.attr(t,"value");return null!=e?e:Ce(C.text(t))}},select:{get:function(t){for(var e,n,i=t.options,o=t.selectedIndex,r="select-one"===t.type,s=r?null:[],a=r?o+1:i.length,l=o<0?a:r?o:0;l<a;l++)if(((n=i[l]).selected||l===o)&&!n.disabled&&(!n.parentNode.disabled||!x(n.parentNode,"optgroup"))){if(e=C(n).val(),r)return e;s.push(e)}return s},set:function(t,e){for(var n,i,o=t.options,r=C.makeArray(e),s=o.length;s--;)((i=o[s]).selected=-1<C.inArray(C.valHooks.option.get(i),r))&&(n=!0);return n||(t.selectedIndex=-1),r}}}}),C.each(["radio","checkbox"],function(){C.valHooks[this]={set:function(t,e){if(Array.isArray(e))return t.checked=-1<C.inArray(C(t).val(),e)}},y.checkOn||(C.valHooks[this].get=function(t){return null===t.getAttribute("value")?"on":t.value})}),y.focusin="onfocusin"in $;function Se(t){t.stopPropagation()}var ze=/^(?:focusinfocus|focusoutblur)$/;C.extend(C.event,{trigger:function(t,e,n,i){var o,r,s,a,l,u,c,f=[n||j],d=v.call(t,"type")?t.type:t,h=v.call(t,"namespace")?t.namespace.split("."):[],p=c=r=n=n||j;if(3!==n.nodeType&&8!==n.nodeType&&!ze.test(d+C.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),a=d.indexOf(":")<0&&"on"+d,(t=t[C.expando]?t:new C.Event(d,"object"==typeof t&&t)).isTrigger=i?2:3,t.namespace=h.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=n),e=null==e?[t]:C.makeArray(e,[t]),u=C.event.special[d]||{},i||!u.trigger||!1!==u.trigger.apply(n,e))){if(!i&&!u.noBubble&&!g(n)){for(s=u.delegateType||d,ze.test(s+d)||(p=p.parentNode);p;p=p.parentNode)f.push(p),r=p;r===(n.ownerDocument||j)&&f.push(r.defaultView||r.parentWindow||$)}for(o=0;(p=f[o++])&&!t.isPropagationStopped();)c=p,t.type=1<o?s:u.bindType||d,(l=(K.get(p,"events")||Object.create(null))[t.type]&&K.get(p,"handle"))&&l.apply(p,e),(l=a&&p[a])&&l.apply&&G(p)&&(t.result=l.apply(p,e),!1===t.result&&t.preventDefault());return t.type=d,i||t.isDefaultPrevented()||u._default&&!1!==u._default.apply(f.pop(),e)||!G(n)||a&&b(n[d])&&!g(n)&&((r=n[a])&&(n[a]=null),C.event.triggered=d,t.isPropagationStopped()&&c.addEventListener(d,Se),n[d](),t.isPropagationStopped()&&c.removeEventListener(d,Se),C.event.triggered=void 0,r&&(n[a]=r)),t.result}},simulate:function(t,e,n){var i=C.extend(new C.Event,n,{type:t,isSimulated:!0});C.event.trigger(i,null,e)}}),C.fn.extend({trigger:function(t,e){return this.each(function(){C.event.trigger(t,e,this)})},triggerHandler:function(t,e){var n=this[0];if(n)return C.event.trigger(t,e,n,!0)}}),y.focusin||C.each({focus:"focusin",blur:"focusout"},function(n,i){function o(t){C.event.simulate(i,t.target,C.event.fix(t))}C.event.special[i]={setup:function(){var t=this.ownerDocument||this.document||this,e=K.access(t,i);e||t.addEventListener(n,o,!0),K.access(t,i,(e||0)+1)},teardown:function(){var t=this.ownerDocument||this.document||this,e=K.access(t,i)-1;e?K.access(t,i,e):(t.removeEventListener(n,o,!0),K.remove(t,i))}}});var Ee=$.location,Ae={guid:Date.now()},Pe=/\?/;C.parseXML=function(t){var e;if(!t||"string"!=typeof t)return null;try{e=(new $.DOMParser).parseFromString(t,"text/xml")}catch(t){e=void 0}return e&&!e.getElementsByTagName("parsererror").length||C.error("Invalid XML: "+t),e};var Le=/\[\]$/,De=/\r?\n/g,Me=/^(?:submit|button|image|reset|file)$/i,Re=/^(?:input|select|textarea|keygen)/i;C.param=function(t,e){function n(t,e){var n=b(e)?e():e;o[o.length]=encodeURIComponent(t)+"="+encodeURIComponent(null==n?"":n)}var i,o=[];if(null==t)return"";if(Array.isArray(t)||t.jquery&&!C.isPlainObject(t))C.each(t,function(){n(this.name,this.value)});else for(i in t)!function n(i,t,o,r){if(Array.isArray(t))C.each(t,function(t,e){o||Le.test(i)?r(i,e):n(i+"["+("object"==typeof e&&null!=e?t:"")+"]",e,o,r)});else if(o||"object"!==k(t))r(i,t);else for(var e in t)n(i+"["+e+"]",t[e],o,r)}(i,t[i],e,n);return o.join("&")},C.fn.extend({serialize:function(){return C.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var t=C.prop(this,"elements");return t?C.makeArray(t):this}).filter(function(){var t=this.type;return this.name&&!C(this).is(":disabled")&&Re.test(this.nodeName)&&!Me.test(t)&&(this.checked||!ft.test(t))}).map(function(t,e){var n=C(this).val();return null==n?null:Array.isArray(n)?C.map(n,function(t){return{name:e.name,value:t.replace(De,"\r\n")}}):{name:e.name,value:n.replace(De,"\r\n")}}).get()}});var qe=/%20/g,He=/#.*$/,Ne=/([?&])_=[^&]*/,Ie=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fe=/^(?:GET|HEAD)$/,Be=/^\/\//,We={},Qe={},Ge="*/".concat("*"),Ue=j.createElement("a");function Ke(r){return function(t,e){"string"!=typeof t&&(e=t,t="*");var n,i=0,o=t.toLowerCase().match(L)||[];if(b(e))for(;n=o[i++];)"+"===n[0]?(n=n.slice(1)||"*",(r[n]=r[n]||[]).unshift(e)):(r[n]=r[n]||[]).push(e)}}function Ye(e,o,r,s){var a={},l=e===Qe;function u(t){var i;return a[t]=!0,C.each(e[t]||[],function(t,e){var n=e(o,r,s);return"string"!=typeof n||l||a[n]?l?!(i=n):void 0:(o.dataTypes.unshift(n),u(n),!1)}),i}return u(o.dataTypes[0])||!a["*"]&&u("*")}function Ve(t,e){var n,i,o=C.ajaxSettings.flatOptions||{};for(n in e)void 0!==e[n]&&((o[n]?t:i=i||{})[n]=e[n]);return i&&C.extend(!0,t,i),t}Ue.href=Ee.href,C.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ee.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Ee.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Ge,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":C.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(t,e){return e?Ve(Ve(t,C.ajaxSettings),e):Ve(C.ajaxSettings,t)},ajaxPrefilter:Ke(We),ajaxTransport:Ke(Qe),ajax:function(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{};var c,f,d,n,h,i,p,g,o,r,m=C.ajaxSetup({},e),v=m.context||m,y=m.context&&(v.nodeType||v.jquery)?C(v):C.event,b=C.Deferred(),w=C.Callbacks("once memory"),k=m.statusCode||{},s={},a={},l="canceled",_={readyState:0,getResponseHeader:function(t){var e;if(p){if(!n)for(n={};e=Ie.exec(d);)n[e[1].toLowerCase()+" "]=(n[e[1].toLowerCase()+" "]||[]).concat(e[2]);e=n[t.toLowerCase()+" "]}return null==e?null:e.join(", ")},getAllResponseHeaders:function(){return p?d:null},setRequestHeader:function(t,e){return null==p&&(t=a[t.toLowerCase()]=a[t.toLowerCase()]||t,s[t]=e),this},overrideMimeType:function(t){return null==p&&(m.mimeType=t),this},statusCode:function(t){if(t)if(p)_.always(t[_.status]);else for(var e in t)k[e]=[k[e],t[e]];return this},abort:function(t){var e=t||l;return c&&c.abort(e),u(0,e),this}};if(b.promise(_),m.url=((t||m.url||Ee.href)+"").replace(Be,Ee.protocol+"//"),m.type=e.method||e.type||m.method||m.type,m.dataTypes=(m.dataType||"*").toLowerCase().match(L)||[""],null==m.crossDomain){i=j.createElement("a");try{i.href=m.url,i.href=i.href,m.crossDomain=Ue.protocol+"//"+Ue.host!=i.protocol+"//"+i.host}catch(t){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=C.param(m.data,m.traditional)),Ye(We,m,e,_),p)return _;for(o in(g=C.event&&m.global)&&0==C.active++&&C.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!Fe.test(m.type),f=m.url.replace(He,""),m.hasContent?m.data&&m.processData&&0===(m.contentType||"").indexOf("application/x-www-form-urlencoded")&&(m.data=m.data.replace(qe,"+")):(r=m.url.slice(f.length),m.data&&(m.processData||"string"==typeof m.data)&&(f+=(Pe.test(f)?"&":"?")+m.data,delete m.data),!1===m.cache&&(f=f.replace(Ne,"$1"),r=(Pe.test(f)?"&":"?")+"_="+Ae.guid+++r),m.url=f+r),m.ifModified&&(C.lastModified[f]&&_.setRequestHeader("If-Modified-Since",C.lastModified[f]),C.etag[f]&&_.setRequestHeader("If-None-Match",C.etag[f])),(m.data&&m.hasContent&&!1!==m.contentType||e.contentType)&&_.setRequestHeader("Content-Type",m.contentType),_.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+Ge+"; q=0.01":""):m.accepts["*"]),m.headers)_.setRequestHeader(o,m.headers[o]);if(m.beforeSend&&(!1===m.beforeSend.call(v,_,m)||p))return _.abort();if(l="abort",w.add(m.complete),_.done(m.success),_.fail(m.error),c=Ye(Qe,m,e,_)){if(_.readyState=1,g&&y.trigger("ajaxSend",[_,m]),p)return _;m.async&&0<m.timeout&&(h=$.setTimeout(function(){_.abort("timeout")},m.timeout));try{p=!1,c.send(s,u)}catch(t){if(p)throw t;u(-1,t)}}else u(-1,"No Transport");function u(t,e,n,i){var o,r,s,a,l,u=e;p||(p=!0,h&&$.clearTimeout(h),c=void 0,d=i||"",_.readyState=0<t?4:0,o=200<=t&&t<300||304===t,n&&(a=function(t,e,n){for(var i,o,r,s,a=t.contents,l=t.dataTypes;"*"===l[0];)l.shift(),void 0===i&&(i=t.mimeType||e.getResponseHeader("Content-Type"));if(i)for(o in a)if(a[o]&&a[o].test(i)){l.unshift(o);break}if(l[0]in n)r=l[0];else{for(o in n){if(!l[0]||t.converters[o+" "+l[0]]){r=o;break}s=s||o}r=r||s}if(r)return r!==l[0]&&l.unshift(r),n[r]}(m,_,n)),!o&&-1<C.inArray("script",m.dataTypes)&&(m.converters["text script"]=function(){}),a=function(t,e,n,i){var o,r,s,a,l,u={},c=t.dataTypes.slice();if(c[1])for(s in t.converters)u[s.toLowerCase()]=t.converters[s];for(r=c.shift();r;)if(t.responseFields[r]&&(n[t.responseFields[r]]=e),!l&&i&&t.dataFilter&&(e=t.dataFilter(e,t.dataType)),l=r,r=c.shift())if("*"===r)r=l;else if("*"!==l&&l!==r){if(!(s=u[l+" "+r]||u["* "+r]))for(o in u)if((a=o.split(" "))[1]===r&&(s=u[l+" "+a[0]]||u["* "+a[0]])){!0===s?s=u[o]:!0!==u[o]&&(r=a[0],c.unshift(a[1]));break}if(!0!==s)if(s&&t.throws)e=s(e);else try{e=s(e)}catch(t){return{state:"parsererror",error:s?t:"No conversion from "+l+" to "+r}}}return{state:"success",data:e}}(m,a,_,o),o?(m.ifModified&&((l=_.getResponseHeader("Last-Modified"))&&(C.lastModified[f]=l),(l=_.getResponseHeader("etag"))&&(C.etag[f]=l)),204===t||"HEAD"===m.type?u="nocontent":304===t?u="notmodified":(u=a.state,r=a.data,o=!(s=a.error))):(s=u,!t&&u||(u="error",t<0&&(t=0))),_.status=t,_.statusText=(e||u)+"",o?b.resolveWith(v,[r,u,_]):b.rejectWith(v,[_,u,s]),_.statusCode(k),k=void 0,g&&y.trigger(o?"ajaxSuccess":"ajaxError",[_,m,o?r:s]),w.fireWith(v,[_,u]),g&&(y.trigger("ajaxComplete",[_,m]),--C.active||C.event.trigger("ajaxStop")))}return _},getJSON:function(t,e,n){return C.get(t,e,n,"json")},getScript:function(t,e){return C.get(t,void 0,e,"script")}}),C.each(["get","post"],function(t,o){C[o]=function(t,e,n,i){return b(e)&&(i=i||n,n=e,e=void 0),C.ajax(C.extend({url:t,type:o,dataType:i,data:e,success:n},C.isPlainObject(t)&&t))}}),C.ajaxPrefilter(function(t){for(var e in t.headers)"content-type"===e.toLowerCase()&&(t.contentType=t.headers[e]||"")}),C._evalUrl=function(t,e,n){return C.ajax({url:t,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(t){C.globalEval(t,e,n)}})},C.fn.extend({wrapAll:function(t){var e;return this[0]&&(b(t)&&(t=t.call(this[0])),e=C(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map(function(){for(var t=this;t.firstElementChild;)t=t.firstElementChild;return t}).append(this)),this},wrapInner:function(n){return b(n)?this.each(function(t){C(this).wrapInner(n.call(this,t))}):this.each(function(){var t=C(this),e=t.contents();e.length?e.wrapAll(n):t.append(n)})},wrap:function(e){var n=b(e);return this.each(function(t){C(this).wrapAll(n?e.call(this,t):e)})},unwrap:function(t){return this.parent(t).not("body").each(function(){C(this).replaceWith(this.childNodes)}),this}}),C.expr.pseudos.hidden=function(t){return!C.expr.pseudos.visible(t)},C.expr.pseudos.visible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},C.ajaxSettings.xhr=function(){try{return new $.XMLHttpRequest}catch(t){}};var Xe={0:200,1223:204},Ze=C.ajaxSettings.xhr();y.cors=!!Ze&&"withCredentials"in Ze,y.ajax=Ze=!!Ze,C.ajaxTransport(function(o){var r,s;if(y.cors||Ze&&!o.crossDomain)return{send:function(t,e){var n,i=o.xhr();if(i.open(o.type,o.url,o.async,o.username,o.password),o.xhrFields)for(n in o.xhrFields)i[n]=o.xhrFields[n];for(n in o.mimeType&&i.overrideMimeType&&i.overrideMimeType(o.mimeType),o.crossDomain||t["X-Requested-With"]||(t["X-Requested-With"]="XMLHttpRequest"),t)i.setRequestHeader(n,t[n]);r=function(t){return function(){r&&(r=s=i.onload=i.onerror=i.onabort=i.ontimeout=i.onreadystatechange=null,"abort"===t?i.abort():"error"===t?"number"!=typeof i.status?e(0,"error"):e(i.status,i.statusText):e(Xe[i.status]||i.status,i.statusText,"text"!==(i.responseType||"text")||"string"!=typeof i.responseText?{binary:i.response}:{text:i.responseText},i.getAllResponseHeaders()))}},i.onload=r(),s=i.onerror=i.ontimeout=r("error"),void 0!==i.onabort?i.onabort=s:i.onreadystatechange=function(){4===i.readyState&&$.setTimeout(function(){r&&s()})},r=r("abort");try{i.send(o.hasContent&&o.data||null)}catch(t){if(r)throw t}},abort:function(){r&&r()}}}),C.ajaxPrefilter(function(t){t.crossDomain&&(t.contents.script=!1)}),C.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(t){return C.globalEval(t),t}}}),C.ajaxPrefilter("script",function(t){void 0===t.cache&&(t.cache=!1),t.crossDomain&&(t.type="GET")}),C.ajaxTransport("script",function(n){var i,o;if(n.crossDomain||n.scriptAttrs)return{send:function(t,e){i=C("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",o=function(t){i.remove(),o=null,t&&e("error"===t.type?404:200,t.type)}),j.head.appendChild(i[0])},abort:function(){o&&o()}}});var Je,tn=[],en=/(=)\?(?=&|$)|\?\?/;C.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var t=tn.pop()||C.expando+"_"+Ae.guid++;return this[t]=!0,t}}),C.ajaxPrefilter("json jsonp",function(t,e,n){var i,o,r,s=!1!==t.jsonp&&(en.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&en.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=b(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(en,"$1"+i):!1!==t.jsonp&&(t.url+=(Pe.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return r||C.error(i+" was not called"),r[0]},t.dataTypes[0]="json",o=$[i],$[i]=function(){r=arguments},n.always(function(){void 0===o?C($).removeProp(i):$[i]=o,t[i]&&(t.jsonpCallback=e.jsonpCallback,tn.push(i)),r&&b(o)&&o(r[0]),r=o=void 0}),"script"}),y.createHTMLDocument=((Je=j.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Je.childNodes.length),C.parseHTML=function(t,e,n){return"string"!=typeof t?[]:("boolean"==typeof e&&(n=e,e=!1),e||(y.createHTMLDocument?((i=(e=j.implementation.createHTMLDocument("")).createElement("base")).href=j.location.href,e.head.appendChild(i)):e=j),r=!n&&[],(o=T.exec(t))?[e.createElement(o[1])]:(o=yt([t],e,r),r&&r.length&&C(r).remove(),C.merge([],o.childNodes)));var i,o,r},C.fn.load=function(t,e,n){var i,o,r,s=this,a=t.indexOf(" ");return-1<a&&(i=Ce(t.slice(a)),t=t.slice(0,a)),b(e)?(n=e,e=void 0):e&&"object"==typeof e&&(o="POST"),0<s.length&&C.ajax({url:t,type:o||"GET",dataType:"html",data:e}).done(function(t){r=arguments,s.html(i?C("<div>").append(C.parseHTML(t)).find(i):t)}).always(n&&function(t,e){s.each(function(){n.apply(this,r||[t.responseText,e,t])})}),this},C.expr.pseudos.animated=function(e){return C.grep(C.timers,function(t){return e===t.elem}).length},C.offset={setOffset:function(t,e,n){var i,o,r,s,a,l,u=C.css(t,"position"),c=C(t),f={};"static"===u&&(t.style.position="relative"),a=c.offset(),r=C.css(t,"top"),l=C.css(t,"left"),o=("absolute"===u||"fixed"===u)&&-1<(r+l).indexOf("auto")?(s=(i=c.position()).top,i.left):(s=parseFloat(r)||0,parseFloat(l)||0),b(e)&&(e=e.call(t,n,C.extend({},a))),null!=e.top&&(f.top=e.top-a.top+s),null!=e.left&&(f.left=e.left-a.left+o),"using"in e?e.using.call(t,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f))}},C.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){C.offset.setOffset(this,e,t)});var t,n,i=this[0];return i?i.getClientRects().length?(t=i.getBoundingClientRect(),n=i.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var t,e,n,i=this[0],o={top:0,left:0};if("fixed"===C.css(i,"position"))e=i.getBoundingClientRect();else{for(e=this.offset(),n=i.ownerDocument,t=i.offsetParent||n.documentElement;t&&(t===n.body||t===n.documentElement)&&"static"===C.css(t,"position");)t=t.parentNode;t&&t!==i&&1===t.nodeType&&((o=C(t).offset()).top+=C.css(t,"borderTopWidth",!0),o.left+=C.css(t,"borderLeftWidth",!0))}return{top:e.top-o.top-C.css(i,"marginTop",!0),left:e.left-o.left-C.css(i,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent;t&&"static"===C.css(t,"position");)t=t.offsetParent;return t||nt})}}),C.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,o){var r="pageYOffset"===o;C.fn[e]=function(t){return I(this,function(t,e,n){var i;return g(t)?i=t:9===t.nodeType&&(i=t.defaultView),void 0===n?i?i[o]:t[e]:void(i?i.scrollTo(r?i.pageXOffset:n,r?n:i.pageYOffset):t[e]=n)},e,t,arguments.length)}}),C.each(["top","left"],function(t,n){C.cssHooks[n]=Xt(y.pixelPosition,function(t,e){if(e)return e=Vt(t,n),Qt.test(e)?C(t).position()[n]+"px":e})}),C.each({Height:"height",Width:"width"},function(s,a){C.each({padding:"inner"+s,content:a,"":"outer"+s},function(i,r){C.fn[r]=function(t,e){var n=arguments.length&&(i||"boolean"!=typeof t),o=i||(!0===t||!0===e?"margin":"border");return I(this,function(t,e,n){var i;return g(t)?0===r.indexOf("outer")?t["inner"+s]:t.document.documentElement["client"+s]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+s],i["scroll"+s],t.body["offset"+s],i["offset"+s],i["client"+s])):void 0===n?C.css(t,e,o):C.style(t,e,n,o)},a,n?t:void 0,n)}})}),C.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(t,e){C.fn[e]=function(t){return this.on(e,t)}}),C.fn.extend({bind:function(t,e,n){return this.on(t,null,e,n)},unbind:function(t,e){return this.off(t,null,e)},delegate:function(t,e,n,i){return this.on(e,t,n,i)},undelegate:function(t,e,n){return 1===arguments.length?this.off(t,"**"):this.off(e,t||"**",n)},hover:function(t,e){return this.mouseenter(t).mouseleave(e||t)}}),C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(t,n){C.fn[n]=function(t,e){return 0<arguments.length?this.on(n,null,t,e):this.trigger(n)}});var nn=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;C.proxy=function(t,e){var n,i,o;if("string"==typeof e&&(n=t[e],e=t,t=n),b(t))return i=a.call(arguments,2),(o=function(){return t.apply(e||this,i.concat(a.call(arguments)))}).guid=t.guid=t.guid||C.guid++,o},C.holdReady=function(t){t?C.readyWait++:C.ready(!0)},C.isArray=Array.isArray,C.parseJSON=JSON.parse,C.nodeName=x,C.isFunction=b,C.isWindow=g,C.camelCase=Q,C.type=k,C.now=Date.now,C.isNumeric=function(t){var e=C.type(t);return("number"===e||"string"===e)&&!isNaN(t-parseFloat(t))},C.trim=function(t){return null==t?"":(t+"").replace(nn,"")},"function"==typeof sn&&sn.amd&&sn("jquery",[],function(){return C});var on=$.jQuery,rn=$.$;return C.noConflict=function(t){return $.$===C&&($.$=rn),t&&$.jQuery===C&&($.jQuery=on),C},void 0===t&&($.jQuery=$.$=C),C}),i("undefined"!=typeof $?$:window.$)}).call(t,void 0,void 0,void 0,void 0,function(t){e.exports=t})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(t,e,n){var i,o;i=this,o=function(){return o={},n.m=i=[function(t,e,n){"use strict";var i,o=n(1),r=(i=o)&&i.__esModule?i:{default:i};t.exports=r.default},function(t,e,n){"use strict";e.__esModule=!0;var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n,i=arguments[e];for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t};e.default=p;var i,o=n(2),l=(i=o)&&i.__esModule?i:{default:i},r=function(t){{if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}}(n(4));function u(){}var s={afterAsync:u,afterDequeue:u,afterStreamStart:u,afterWrite:u,autoFix:!0,beforeEnqueue:u,beforeWriteToken:function(t){return t},beforeWrite:function(t){return t},done:u,error:function(t){throw new Error(t.msg)},releaseAsync:!1},c=0,f=[],d=null;function h(){var t,e=f.shift();e&&((t=r.last(e)).afterDequeue(),e.stream=function(t,e,i){(d=new l.default(t,i)).id=c++,d.name=i.name||d.id,p.streams[d.name]=d;var n=t.ownerDocument,o={close:n.close,open:n.open,write:n.write,writeln:n.writeln};function r(t){t=i.beforeWrite(t),d.write(t),i.afterWrite(t)}a(n,{close:u,open:u,write:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return r(e.join(""))},writeln:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return r(e.join("")+"\n")}});var s=d.win.onerror||u;return d.win.onerror=function(t,e,n){i.error({msg:t+" - "+e+": "+n}),s.apply(d.win,[t,e,n])},d.write(e,function(){a(n,o),d.win.onerror=s,i.done(),d=null,h()}),d}.apply(void 0,e),t.afterStreamStart())}function p(t,e,n){if(r.isFunction(n))n={done:n};else if("clear"===n)return f=[],d=null,void(c=0);n=r.defaults(n,s);var i=[t=/^#/.test(t)?window.document.getElementById(t.substr(1)):t.jquery?t[0]:t,e,n];return t.postscribe={cancel:function(){i.stream?i.stream.abort():i[1]=u}},n.beforeEnqueue(i),f.push(i),d||h(),t.postscribe}a(p,{streams:{},queue:f,WriteStream:l.default})},function(t,e,n){"use strict";e.__esModule=!0;var i,a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n,i=arguments[e];for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t},o=n(3),r=(i=o)&&i.__esModule?i:{default:i},s=function(t){{if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}}(n(4));var c="data-ps-";function l(t,e){var n=c+e,i=t.getAttribute(n);return s.existy(i)?String(i):i}function u(t,e,n){var i=2<arguments.length&&void 0!==n?n:null,o=c+e;s.existy(i)&&""!==i?t.setAttribute(o,i):t.removeAttribute(o)}var f=(d.prototype.write=function(){var t;for((t=this.writeQueue).push.apply(t,arguments);!this.deferredRemote&&this.writeQueue.length;){var e=this.writeQueue.shift();s.isFunction(e)?this._callFunction(e):this._writeImpl(e)}},d.prototype._callFunction=function(t){var e={type:"function",value:t.name||t.toString()};this._onScriptStart(e),t.call(this.win,this.doc),this._onScriptDone(e)},d.prototype._writeImpl=function(t){this.parser.append(t);for(var e=void 0,n=void 0,i=void 0,o=[];(e=this.parser.readToken())&&!(n=s.isScript(e))&&!(i=s.isStyle(e));)(e=this.options.beforeWriteToken(e))&&o.push(e);0<o.length&&this._writeStaticTokens(o),n&&this._handleScriptToken(e),i&&this._handleStyleToken(e)},d.prototype._writeStaticTokens=function(t){var e=this._buildChunk(t);return e.actual?(e.html=this.proxyHistory+e.actual,this.proxyHistory+=e.proxy,this.proxyRoot.innerHTML=e.html,this._walkChunk(),e):null},d.prototype._buildChunk=function(t){for(var e=this.actuals.length,n=[],i=[],o=[],r=t.length,s=0;s<r;s++){var a,l=t[s],u=l.toString();n.push(u),l.attrs?/^noscript$/i.test(l.tagName)||(a=e++,i.push(u.replace(/(\/?>)/," "+c+"id="+a+" $1")),"ps-script"!==l.attrs.id&&"ps-style"!==l.attrs.id&&o.push("atomicTag"===l.type?"":"<"+l.tagName+" "+c+"proxyof="+a+(l.unary?" />":">"))):(i.push(u),o.push("endTag"===l.type?u:""))}return{tokens:t,raw:n.join(""),actual:i.join(""),proxy:o.join("")}},d.prototype._walkChunk=function(){for(var t,e=[this.proxyRoot];s.existy(t=e.shift());){var n,i=1===t.nodeType;i&&l(t,"proxyof")||(i&&u(this.actuals[l(t,"id")]=t,"id"),(n=t.parentNode&&l(t.parentNode,"proxyof"))&&this.actuals[n].appendChild(t)),e.unshift.apply(e,s.toArray(t.childNodes))}},d.prototype._handleScriptToken=function(t){var e=this,n=this.parser.clear();n&&this.writeQueue.unshift(n),t.src=t.attrs.src||t.attrs.SRC,(t=this.options.beforeWriteToken(t))&&(t.src&&this.scriptStack.length?this.deferredRemote=t:this._onScriptStart(t),this._writeScriptToken(t,function(){e._onScriptDone(t)}))},d.prototype._handleStyleToken=function(t){var e=this.parser.clear();e&&this.writeQueue.unshift(e),t.type=t.attrs.type||t.attrs.TYPE||"text/css",(t=this.options.beforeWriteToken(t))&&this._writeStyleToken(t),e&&this.write()},d.prototype._writeStyleToken=function(t){var e=this._buildStyle(t);this._insertCursor(e,"ps-style"),t.content&&(e.styleSheet&&!e.sheet?e.styleSheet.cssText=t.content:e.appendChild(this.doc.createTextNode(t.content)))},d.prototype._buildStyle=function(t){var n=this.doc.createElement(t.tagName);return n.setAttribute("type",t.type),s.eachKey(t.attrs,function(t,e){n.setAttribute(t,e)}),n},d.prototype._insertCursor=function(t,e){this._writeImpl('<span id="'+e+'"/>');var n=this.doc.getElementById(e);n&&n.parentNode.replaceChild(t,n)},d.prototype._onScriptStart=function(t){t.outerWrites=this.writeQueue,this.writeQueue=[],this.scriptStack.unshift(t)},d.prototype._onScriptDone=function(t){t===this.scriptStack[0]?(this.scriptStack.shift(),this.write.apply(this,t.outerWrites),!this.scriptStack.length&&this.deferredRemote&&(this._onScriptStart(this.deferredRemote),this.deferredRemote=null)):this.options.error({msg:"Bad script nesting or script finished twice"})},d.prototype._writeScriptToken=function(t,e){var n=this._buildScript(t),i=this._shouldRelease(n),o=this.options.afterAsync;t.src&&(n.src=t.src,this._scriptLoadHandler(n,i?o:function(){e(),o()}));try{this._insertCursor(n,"ps-script"),n.src&&!i||e()}catch(t){this.options.error(t),e()}},d.prototype._buildScript=function(t){var n=this.doc.createElement(t.tagName);return s.eachKey(t.attrs,function(t,e){n.setAttribute(t,e)}),t.content&&(n.text=t.content),n},d.prototype._scriptLoadHandler=function(e,n){function i(){e=e.onload=e.onreadystatechange=e.onerror=null}var o=this.options.error;function t(){i(),null!=n&&n(),n=null}function r(t){i(),o(t),null!=n&&n(),n=null}function s(t,e){var n=t["on"+e];null!=n&&(t["_on"+e]=n)}s(e,"load"),s(e,"error"),a(e,{onload:function(){if(e._onload)try{e._onload.apply(this,Array.prototype.slice.call(arguments,0))}catch(t){r({msg:"onload handler failed "+t+" @ "+e.src})}t()},onerror:function(){if(e._onerror)try{e._onerror.apply(this,Array.prototype.slice.call(arguments,0))}catch(t){return void r({msg:"onerror handler failed "+t+" @ "+e.src})}r({msg:"remote script failed "+e.src})},onreadystatechange:function(){/^(loaded|complete)$/.test(e.readyState)&&t()}})},d.prototype._shouldRelease=function(t){return!/^script$/i.test(t.nodeName)||!!(this.options.releaseAsync&&t.src&&t.hasAttribute("async"))},d);function d(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,d),this.root=t,this.options=e,this.doc=t.ownerDocument,this.win=this.doc.defaultView||this.doc.parentWindow,this.parser=new r.default("",{autoFix:e.autoFix}),this.actuals=[t],this.proxyHistory="",this.proxyRoot=this.doc.createElement(t.nodeName),this.scriptStack=[],this.writeQueue=[],u(this.proxyRoot,"proxyof",0)}e.default=f},function(t,e,n){var i;i=function(){return o={},n.m=i=[function(t,e,n){"use strict";var i,o=n(1),r=(i=o)&&i.__esModule?i:{default:i};t.exports=r.default},function(t,e,n){"use strict";e.__esModule=!0;var i,s=u(n(2)),o=u(n(3)),r=n(6),a=(i=r)&&i.__esModule?i:{default:i},l=n(5);function u(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}var c,f={comment:/^<!--/,endTag:/^<\//,atomicTag:/^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,startTag:/^</,chars:/^[^<]/},d=(h.prototype.append=function(t){this.stream+=t},h.prototype.prepend=function(t){this.stream=t+this.stream},h.prototype._readTokenImpl=function(){var t=this._peekTokenImpl();if(t)return this.stream=this.stream.slice(t.length),t},h.prototype._peekTokenImpl=function(){for(var t in f)if(f.hasOwnProperty(t)&&f[t].test(this.stream)){var e=o[t](this.stream);if(e)return"startTag"===e.type&&/script|style/i.test(e.tagName)?null:(e.text=this.stream.substr(0,e.length),e)}},h.prototype.peekToken=function(){return this._peekToken()},h.prototype.readToken=function(){return this._readToken()},h.prototype.readTokens=function(t){for(var e;e=this.readToken();)if(t[e.type]&&!1===t[e.type](e))return},h.prototype.clear=function(){var t=this.stream;return this.stream="",t},h.prototype.rest=function(){return this.stream},h);function h(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"",n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,h),this.stream=e;var i,o=!1,r={};for(i in s)s.hasOwnProperty(i)&&(n.autoFix&&(r[i+"Fix"]=!0),o=o||r[i+"Fix"]);o?(this._readToken=(0,a.default)(this,r,function(){return t._readTokenImpl()}),this._peekToken=(0,a.default)(this,r,function(){return t._peekTokenImpl()})):(this._readToken=this._readTokenImpl,this._peekToken=this._peekTokenImpl)}for(c in(e.default=d).tokenToString=function(t){return t.toString()},d.escapeAttributes=function(t){var e,n={};for(e in t)t.hasOwnProperty(e)&&(n[e]=(0,l.escapeQuotes)(t[e],null));return n},d.supports=s)s.hasOwnProperty(c)&&(d.browserHasFlaw=d.browserHasFlaw||!s[c]&&c)},function(t,e){"use strict";var n=!(e.__esModule=!0),i=!1,o=window.document.createElement("div");try{var r="<P><I></P></I>";o.innerHTML=r,e.tagSoup=n=o.innerHTML!==r}catch(t){e.tagSoup=n=!1}try{o.innerHTML="<P><i><P></P></i></P>",e.selfClose=i=2===o.childNodes.length}catch(t){e.selfClose=i=!1}o=null,e.tagSoup=n,e.selfClose=i},function(t,e,n){"use strict";e.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.comment=function(t){var e=t.indexOf("--\x3e");if(0<=e)return new a.CommentToken(t.substr(4,e-1),e+3)},e.chars=function(t){var e=t.indexOf("<");return new a.CharsToken(0<=e?e:t.length)},e.startTag=o,e.atomicTag=function(t){var e=o(t);if(e){var n=t.slice(e.length);if(n.match(new RegExp("</\\s*"+e.tagName+"\\s*>","i"))){var i=n.match(new RegExp("([\\s\\S]*?)</\\s*"+e.tagName+"\\s*>","i"));if(i)return new a.AtomicTagToken(e.tagName,i[0].length+e.length,e.attrs,e.booleanAttrs,i[1])}}},e.endTag=function(t){var e=t.match(l.endTag);if(e)return new a.EndTagToken(e[1],e[0].length)};var a=n(4),l={startTag:/^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,endTag:/^<\/([\-A-Za-z0-9_]+)[^>]*>/,attr:/(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,fillAttr:/^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i};function o(t){var n,i,o;if(-1!==t.indexOf(">")){var e=t.match(l.startTag);if(e){var r=(n={},i={},o=e[2],e[2].replace(l.attr,function(t,e){arguments[2]||arguments[3]||arguments[4]||arguments[5]?arguments[5]?(n[arguments[5]]="",i[arguments[5]]=!0):n[e]=arguments[2]||arguments[3]||arguments[4]||l.fillAttr.test(e)&&e||"":n[e]="",o=o.replace(t,"")}),{v:new a.StartTagToken(e[1],e[0].length,n,i,!!e[3],o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""))});if("object"===(void 0===r?"undefined":s(r)))return r.v}}}},function(t,e,n){"use strict";e.__esModule=!0,e.EndTagToken=e.AtomicTagToken=e.StartTagToken=e.TagToken=e.CharsToken=e.CommentToken=e.Token=void 0;var s=n(5);function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}e.Token=function t(e,n){a(this,t),this.type=e,this.length=n,this.text=""},e.CommentToken=(i.prototype.toString=function(){return"\x3c!--"+this.content},i);function i(t,e){a(this,i),this.type="comment",this.length=e||(t?t.length:0),this.text="",this.content=t}e.CharsToken=(o.prototype.toString=function(){return this.text},o);function o(t){a(this,o),this.type="chars",this.length=t,this.text=""}var r=e.TagToken=(l.formatTag=function(t,e){var n,i,o=1<arguments.length&&void 0!==e?e:null,r="<"+t.tagName;for(n in t.attrs){t.attrs.hasOwnProperty(n)&&(r+=" "+n,i=t.attrs[n],void 0!==t.booleanAttrs&&void 0!==t.booleanAttrs[n]||(r+='="'+(0,s.escapeQuotes)(i)+'"'))}return t.rest&&(r+=" "+t.rest),t.unary&&!t.html5Unary?r+="/>":r+=">",null!=o&&(r+=o+"</"+t.tagName+">"),r},l);function l(t,e,n,i,o){a(this,l),this.type=t,this.length=n,this.text="",this.tagName=e,this.attrs=i,this.booleanAttrs=o,this.unary=!1,this.html5Unary=!1}e.StartTagToken=(u.prototype.toString=function(){return r.formatTag(this)},u);function u(t,e,n,i,o,r){a(this,u),this.type="startTag",this.length=e,this.text="",this.tagName=t,this.attrs=n,this.booleanAttrs=i,this.html5Unary=!1,this.unary=o,this.rest=r}e.AtomicTagToken=(c.prototype.toString=function(){return r.formatTag(this,this.content)},c);function c(t,e,n,i,o){a(this,c),this.type="atomicTag",this.length=e,this.text="",this.tagName=t,this.attrs=n,this.booleanAttrs=i,this.unary=!1,this.html5Unary=!1,this.content=o}e.EndTagToken=(f.prototype.toString=function(){return"</"+this.tagName+">"},f);function f(t,e){a(this,f),this.type="endTag",this.length=e,this.text="",this.tagName=t}},function(t,e){"use strict";e.__esModule=!0,e.escapeQuotes=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"";return t?t.replace(/([^"]*)"/g,function(t,e){return/\\/.test(e)?e+'"':e+'\\"'}):e}},function(t,e){"use strict";e.__esModule=!0,e.default=function(r,n,s){var i=function(){var t=[];return t.last=function(){return this[this.length-1]},t.lastTagNameEq=function(t){var e=this.last();return e&&e.tagName&&e.tagName.toUpperCase()===t.toUpperCase()},t.containsTagName=function(t){for(var e,n=0;e=this[n];n++)if(e.tagName===t)return!0;return!1},t}(),a={startTag:function(t){var e=t.tagName;"TR"===e.toUpperCase()&&i.lastTagNameEq("TABLE")?(r.prepend("<TBODY>"),o()):n.selfCloseFix&&l.test(e)&&i.containsTagName(e)?i.lastTagNameEq(e)?c(r,i):(r.prepend("</"+t.tagName+">"),o()):t.unary||i.push(t)},endTag:function(t){i.last()?n.tagSoupFix&&!i.lastTagNameEq(t.tagName)?c(r,i):i.pop():n.tagSoupFix&&(s(),o())}};function o(){var t,e,n,i,o=(e=s,n=(t=r).stream,i=u(e()),t.stream=n,i);o&&a[o.type]&&a[o.type](o)}return function(){return o(),u(s())}};var n=/^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i,l=/^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i;function u(t){return t&&"startTag"===t.type&&(t.unary=n.test(t.tagName)||t.unary,t.html5Unary=!/\/>$/.test(t.text)),t}function c(t,e){var n=e.pop();t.prepend("</"+n.tagName+">")}}],n.c=o,n.p="",n(0);function n(t){if(o[t])return o[t].exports;var e=o[t]={exports:{},id:t,loaded:!1};return i[t].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}var i,o},t.exports=i()},function(t,e){"use strict";e.__esModule=!0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function o(t){return null!=t}function r(t,e,n){for(var i=void 0,o=t&&t.length||0,i=0;i<o;i++)e.call(n,t[i],i)}function s(t,e,n){for(var i in t)t.hasOwnProperty(i)&&e.call(n,i,t[i])}function n(t,e){return!(!t||"startTag"!==t.type&&"atomicTag"!==t.type||!("tagName"in t))&&!!~t.tagName.toLowerCase().indexOf(e)}e.existy=o,e.isFunction=function(t){return"function"==typeof t},e.each=r,e.eachKey=s,e.defaults=function(n,t){return n=n||{},s(t,function(t,e){o(n[t])||(n[t]=e)}),n},e.toArray=function(n){try{return Array.prototype.slice.call(n)}catch(t){var e=function(){var e=[];return r(n,function(t){e.push(t)}),{v:e}}();if("object"===(void 0===e?"undefined":i(e)))return e.v}},e.last=function(t){return t[t.length-1]},e.isTag=n,e.isScript=function(t){return n(t,"script")},e.isStyle=function(t){return n(t,"style")}}],n.c=o,n.p="",n(0);function n(t){if(o[t])return o[t].exports;var e=o[t]={exports:{},id:t,loaded:!1};return i[t].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}var i,o},"object"==typeof n&&"object"==typeof e?e.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof n?n.postscribe=o():i.postscribe=o()},{}],4:[function(t,e,n){e.exports=$(function(){var t;Foundation.MediaQuery.atLeast("medium")&&$("#back-to-top").length&&((t=function(){100<$(window).scrollTop()?$("#back-to-top").addClass("show"):$("#back-to-top").removeClass("show")})(),$(window).on("scroll",function(){t(),$("#full-footer-start").offset().top<$(this).height()+$(this).scrollTop()&&$("#back-to-top").removeClass("show")}),$("#back-to-top").on("click",function(t){t.preventDefault(),$("html,body").animate({scrollTop:0},700)}))})},{}],5:[function(t,e,n){e.exports=$(function(){$('[data-toggle="feedback"]').click(function(){$('[data-type="feedback-form"] iframe').css("height","");var t,e=$('[data-toggle="feedback"]').offset(),n=$(".sticky-container").outerHeight();t=$("#wpadminbar").length?$("#wpadminbar").outerHeight():0;var i=e.top-(n+t);$('[data-type="feedback-form"] iframe').attr("onload","window.parent.scrollTo(0,"+i+")"),$('[data-type="feedback-indicator"]').hasClass("up")?$('[data-type="feedback-form"]').slideToggle(function(){$('[data-type="feedback-indicator"]').removeClass("up"),$('[data-type="feedback-footer"]').toggle()}):($('[data-type="feedback-form"]').slideToggle(),$('[data-type="feedback-indicator"]').addClass("up"),$('[data-type="feedback-footer"]').toggle())})})},{}],6:[function(t,e,n){var i=t("postscribe");e.exports=$(function(){$.fn.feedbackify=function(t){return i("#form-container",'<script  type="text/javascript" src="'+t+'"><\/script>'),$("html,body").animate({scrollTop:$(".feedback").position().top-$("header .is-stuck").height()},700),!1},$("footer .feedback").on("click",function(){$(this).feedbackify("https://form.jotform.com/jsform/62765090493967")})})},{postscribe:3}],7:[function(t,e,n){e.exports=$(function(){setTimeout(function(){$("#google_translate_element a").prepend('<i class="fas fa-globe"></i>')},1e3)})},{}],8:[function(t,e,n){e.exports=t("jquery"),e.exports=t("foundation-sites");t("./back-to-top"),t("./feedback-toggle"),t("./feedback"),t("./header"),t("./responsive-tables"),t("./svg-fallback")},{"./back-to-top":4,"./feedback":6,"./feedback-toggle":5,"./header":7,"./responsive-tables":9,"./svg-fallback":10,"foundation-sites":1,jquery:2}],9:[function(t,e,n){e.export=$(function(){var t=$("table.responsive");if(0<t.length){tableCount=t.length;for(var e=0;e<tableCount;e++){table=$(t[e]),trs=table.find("> thead > tr, > tbody > tr, > tr"),ths=trs.find("> th"),trCount=trs.length;for(var n=0;n<trCount;n++){tds=$(trs[n]).find("> td"),tdCount=tds.length;for(var i=0;i<tdCount;i++)th=ths[i],tableCell=$(tds[i]),text=th.textContent||th.innerText||"",td=tableCell.prepend("<b><span class='responsive-label'>"+text+": </span></b>")}}}})},{}],10:[function(t,e,n){e.exports=function(){if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")){var t=document.getElementsByTagName("img");t.length||(t=document.getElementsByTagName("IMG"));for(var e=0,n=t.length;e<n;e++){var i=t[e];i.getAttribute("src").match(/svgz?$/)&&i.setAttribute("src",i.getAttribute("data-fallback"))}}}},{}]},{},[8]);

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
'use strict';

var alphabet;
var alphabetIndexMap;
var alphabetIndexMapLength = 0;

function isNumberCode(code) {
  return code >= 48 && code <= 57;
}

function naturalCompare(a, b) {
  var lengthA = (a += '').length;
  var lengthB = (b += '').length;
  var aIndex = 0;
  var bIndex = 0;

  while (aIndex < lengthA && bIndex < lengthB) {
    var charCodeA = a.charCodeAt(aIndex);
    var charCodeB = b.charCodeAt(bIndex);

    if (isNumberCode(charCodeA)) {
      if (!isNumberCode(charCodeB)) {
        return charCodeA - charCodeB;
      }

      var numStartA = aIndex;
      var numStartB = bIndex;

      while (charCodeA === 48 && ++numStartA < lengthA) {
        charCodeA = a.charCodeAt(numStartA);
      }
      while (charCodeB === 48 && ++numStartB < lengthB) {
        charCodeB = b.charCodeAt(numStartB);
      }

      var numEndA = numStartA;
      var numEndB = numStartB;

      while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
        ++numEndA;
      }
      while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
        ++numEndB;
      }

      var difference = numEndA - numStartA - numEndB + numStartB; // numA length - numB length
      if (difference) {
        return difference;
      }

      while (numStartA < numEndA) {
        difference = a.charCodeAt(numStartA++) - b.charCodeAt(numStartB++);
        if (difference) {
          return difference;
        }
      }

      aIndex = numEndA;
      bIndex = numEndB;
      continue;
    }

    if (charCodeA !== charCodeB) {
      if (
        charCodeA < alphabetIndexMapLength &&
        charCodeB < alphabetIndexMapLength &&
        alphabetIndexMap[charCodeA] !== -1 &&
        alphabetIndexMap[charCodeB] !== -1
      ) {
        return alphabetIndexMap[charCodeA] - alphabetIndexMap[charCodeB];
      }

      return charCodeA - charCodeB;
    }

    ++aIndex;
    ++bIndex;
  }

  if (aIndex >= lengthA && bIndex < lengthB && lengthA >= lengthB) {
    return -1;
  }

  if (bIndex >= lengthB && aIndex < lengthA && lengthB >= lengthA) {
    return 1;
  }

  return lengthA - lengthB;
}

naturalCompare.caseInsensitive = naturalCompare.i = function(a, b) {
  return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase());
};

Object.defineProperties(naturalCompare, {
  alphabet: {
    get: function() {
      return alphabet;
    },

    set: function(value) {
      alphabet = value;
      alphabetIndexMap = [];

      var i = 0;

      if (alphabet) {
        for (; i < alphabet.length; i++) {
          alphabetIndexMap[alphabet.charCodeAt(i)] = i;
        }
      }

      alphabetIndexMapLength = alphabetIndexMap.length;

      for (i = 0; i < alphabetIndexMapLength; i++) {
        if (alphabetIndexMap[i] === undefined) {
          alphabetIndexMap[i] = -1;
        }
      }
    },
  },
});

module.exports = naturalCompare;

},{}]},{},[17]);
