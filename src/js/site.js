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
    var searchSectionPath = window.dataLayer[0].page.type==="home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    var filterValue = $('option:selected', this).data('filterSort');
    params.sort = filterValue || 'views';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  $('#categoryFilter').on('changed.bs.select', function() {
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    var filterValue = $('#categoryFilter option:selected').map(function(){ return $(this).data('filterCategory'); }).get().join(',');

    if(window.dataLayer[0].page.type==='templates listing page'){
        location.href = ['','categories',filterValue,''].join('/');
        return;
    }
    var searchSectionPath = window.dataLayer[0].page.type==="home page" ? "/?" : "/search?";
    if(params.categories.indexOf('all') > -1) params.categories.splice(params.categories.indexOf('all'));
    params.categories= filterValue || 'all';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  $('#tagTypeFilter').on('changed.bs.select', function() {
    var searchSectionPath = window.dataLayer[0].page.type==="home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    if(params.templateTypes.indexOf('all') > -1) params.templateTypes.splice(params.templateTypes.indexOf('all'));
    var filterValue = $('#tagTypeFilter option:selected').map(function(){ return $(this).data('filterTagType'); }).get().join(',');
    params.templateTypes= filterValue || 'all';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });
  $('#searchGo').on('mousedown', function() {
    var searchSectionPath = window.dataLayer[0].page.type==="home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    if(params.templateTypes.indexOf('all') > -1) params.templateTypes.splice(params.templateTypes.indexOf('all'));
    var filterValue = $('#tagTypeFilter option:selected').map(function(){ return $(this).data('filterTagType'); }).get().join(',');
    params.templateTypes= filterValue || 'all';
    params.query = [$('#query').val()];
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  // Sign in
  var signIn = document.querySelector('#signIn');

  // From https://bit.ly/2yo2U9C
  var windowObjectReference = null;
  var previousUrl = null;

  var receiveMessage = function(event) {
    if (event.origin !== 'https://www.gtmtemplates.com' && event.origin !== 'http://localhost:8080' || event.source.name !== 'google-auth-popup') {
      return;
    }
    var req = new XMLHttpRequest();
    var endpoint = '/api/session/login/' + event.data;
    req.open('GET', endpoint, true);
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        if (JSON.parse(req.response).status === 'success') {
          window.location.reload();
        }
      }
    };
    req.send();
  };

  var openSignInWindow = function(url, name) {
    window.removeEventListener('message', receiveMessage);
    var strWindowFeatures = 'toolbar=no,menubar=no,width=600,height=700,top=100,left=100';
    if (windowObjectReference === null || windowObjectReference.closed) {
      windowObjectReference = window.open(url, name, strWindowFeatures);
    } else if (previousUrl !== null) {
      windowObjectReference = window.open(url, name, strWindowFeatures);
      windowObjectReference.focus();
    } else {
      windowObjectReference.focus();
    }
    window.addEventListener('message', receiveMessage, false);
    previousUrl = url;
  };

  if (signIn) {
    signIn.addEventListener('click', function() {
      openSignInWindow(window.__google_auth_url, 'google-auth-popup');
    });
  }

  $('#install-template').on('click', function() {
    $('.modal .modal-title').text('Select a container');
    $('.modal .modal-body').empty();
    $('.modal .modal-body').html('<img width="450px" src="https://miro.medium.com/max/700/1*CsJ05WEGfunYMLGfsT2sXA.gif" / >');
      $.getJSON("/api/gtm/getAccounts", function(data) {
        $('.modal .modal-body').empty();
        var items = [];
        items.push("<tr><td>ID</td><td>Name</td></tr>");
        $.each(data, function(key, val) {
          items.push("<tr><td>" + val.accountId + "</td><td>" + val.name + "</td></tr>");
        });
        $('#smartwizard').smartWizard({
          selected: 0,
          theme: 'arrows',
          transitionEffect: 'fade',
          autoAdjustHeight: true,
          backButtonSupport: false,
          toolbarSettings: {
            toolbarPosition: 'bottom',
            toolbarExtraButtons: [],
            showPreviousButton: false
          },
          anchorSettings: {
            anchorClickable: false, // Enable/Disable anchor navigation
            enableAllAnchors: false, // Activates all anchors clickable all times
            markDoneStep: true, // add done css
            enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
          },
          backButtonSupport: false,
          contentCache: true,
          disabledSteps: []
        });
      });
  
    $(document).on("leaveStep", "#smartwizard", function(e, anchorObject, stepNumber, stepDirection) {
      // stepDirection === 'forward' :- this condition allows to do the form validation
      // only on forward navigation, that makes easy navigation on backwards still do the validation when going next
      if (stepDirection === 'forward' && stepNumber === 0) {
        if ($('[name="accountId"]:checked').length === 0) {
          alert("You need to select an account");
          return false;
        }
      }
      if (stepDirection === 'forward' && stepNumber === 1) {
        if ($('[name="containerId"]:checked').length === 0) {
          alert("You need to select a container");
          return false;
        }
      }
      return true;
    });
  
    $("<table/>", {
      "class": "table",
      html: items.join("")
    }).appendTo('.modal .modal-body');
  });
  $(document).on("showStep", "#smartwizard", function(e, anchorObject, stepNumber, stepDirection) {
    if (stepNumber === 3) {
      $('#review-account-name').text($('[name="accountId"]:checked').data('accountName'));
      $('#review-container-name').html($('[name="containerId"]:checked').data('containerName') + '<span class="label label-default">' + $('[name="containerId"]:checked').data('containerPublicId') + '</span>');
      $('.sw-btn-next').text("INSTALL");
    }
    if (stepNumber === 4) {
      $('.sw-btn-next').hide();
    }
  });
  
  $(document).on('change', '[name="accountId"]', function() {
    var accountId = $('[name="accountId"]:checked').val().toString();
    $('[href="#step-2"]').data("content-url", '/api/gtm/getContainers/' + accountId);
    $('[href="#step-2"]').attr("data-content-url", '/api/gtm/getContainers/' + accountId);
  });
  
  $(document).on('change', '[name="containerId"]', function() {
    var accountId = $('[name="accountId"]:checked').val().toString();
    var containerId = $('[name="containerId"]:checked').val().toString();
    $('[href="#step-3"]').data("content-url", '/api/gtm/getWorkspaces/' + accountId + '/' + containerId);
    $('[href="#step-3"]').attr("data-content-url", '/api/gtm/getWorkspaces/' + accountId + '/' + containerId);
  });
  
  $("#exampleModal").on("hidden.bs.modal", function() {
    $('#smartwizard').smartWizard("reset");
    if (document.location.hash && document.location.hash.indexOf("#step") > -1) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  });

})(window.jQuery);
