// CUSTOM PAGE JS
(function($) {
    window._gtm_templates = window._gtm_templates || {tools: {}};
    window._gtm_templates.tools.buildQuery = function(data){
      // https://gomakethings.com/how-to-build-a-query-string-from-an-object-with-vanilla-js/
      // If the data is already a string, return it as-is
      if (typeof (data) === 'string')
        return data;

      // Create a query array to hold the key/value pairs
      var query = [];

      // Loop through the data object
      for (var key in data) {
        if (data.hasOwnProperty(key)) {

          // Encode each key and value, concatenate them into a string, and push them to the array
          query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
      }
      // Join each item in the array with a `&` and return the resulting string
      return query.join('&');
    };
    $('.filter').on('click', function() {
      var tag_types = $('[data-filter-tag-type]:checked').map(function() {
        return $(this).data('filterTagType');
      }).get();

      var tag_categories = $('[data-filter-tag-category]:checked').map(function() {
        return $(this).data('filterTagCategory');
      }).get();

      if (tag_categories.length > 0 || tag_types.length > 0) {
        $('.card[data-product-type]').each(function() {
          var ttype = $(this).data('productType').toLowerCase();
          var tcat = $(this).data('productCategory');

          if (tag_categories.indexOf(tcat) > -1 && tag_types.indexOf(ttype) > -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      } else {
        $('.card[data-product-type]').show();
      }
      $('.results-count').text($('div.card[data-eec-action]:visible').length)
    });

    // Sorting
    $('#sortFilter').on('changed.bs.select', function() {
      var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
      var filterValue = $('option:selected', this).data('filterSort');
      params.sort = filterValue || 'all';
      location.href = '/?' + window._gtm_templates.tools.buildQuery(params);
    });

    $('#categoryFilter').on('changed.bs.select', function() {
      var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
      var filterValue = $('#categoryFilter option:selected').map(function(){ return $(this).data('filterCategory'); }).get().join(',');
      if(params.categories.indexOf('all') > -1) params.categories.splice(params.categories.indexOf('all'));
      params.categories= filterValue || 'all';
      location.href = '/?' + window._gtm_templates.tools.buildQuery(params);
    });

    $('#tagTypeFilter').on('changed.bs.select', function() {
      var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
      if(params.tagTypes.indexOf('all') > -1) params.tagTypes.splice(params.tagTypes.indexOf('all'));
      var filterValue = $('#tagTypeFilter option:selected').map(function(){ return $(this).data('filterTagType'); }).get().join(',');
      params.tagTypes= filterValue || 'all';
      location.href = '/?' + window._gtm_templates.tools.buildQuery(params);
    });
  }
)(window.jQuery);
