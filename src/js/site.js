// CUSTOM PAGE JS
(function($) {
    var pathParts = location.pathname.split('/');
    if (window.dataLayer[0].page.type === "custom template page" && pathParts.length === 3) {
        pathParts.push(window.dataLayer[0].template.slug);
        window.history.replaceState({}, document.title, pathParts.join('/'));
    }
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
    // Results Sorting
    $('[data-sort-by]').on('click', function() {
        $('#filtersList button.btn-sortby').remove();
        // Build Query Reload Page Listing
        $('#filtersList').append('<button class="btn btn-brand btn-info btn-sm btn-sortby" type="button"><span>Sort by: ' + $(this).data('sortBy') + '</span><i class="fa fa-window-close"></i></button>');
    });
}
)(window.jQuery);
