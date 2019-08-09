// CUSTOM PAGE JS
(function ($) {
  window._gtm_templates = window._gtm_templates || { tools: {} };
  window._gtm_templates.tools.buildQuery = function (data) {
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
  $('.filter').on('click', function () {
    var tag_types = $('[data-filter-tag-type]:checked').map(function () {
      return $(this).data('filterTagType');
    }).get();

    var tag_categories = $('[data-filter-tag-category]:checked').map(function () {
      return $(this).data('filterTagCategory');
    }).get();

    if (tag_categories.length > 0 || tag_types.length > 0) {
      $('.card[data-product-type]').each(function () {
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
  $('#sortFilter').on('changed.bs.select', function () {
    var searchSectionPath = window.dataLayer[0].page.type === "home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    var filterValue = $('option:selected', this).data('filterSort');
    params.sort = filterValue || 'views';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  $('#categoryFilter').on('changed.bs.select', function () {
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    var filterValue = $('#categoryFilter option:selected').map(function () { return $(this).data('filterCategory'); }).get().join(',');

    if (window.dataLayer[0].page.type === 'templates listing page') {
      location.href = ['', 'categories', filterValue, ''].join('/');
      return;
    }
    var searchSectionPath = window.dataLayer[0].page.type === "home page" ? "/?" : "/search?";
    if (params.categories.indexOf('all') > -1) params.categories.splice(params.categories.indexOf('all'));
    params.categories = filterValue || 'all';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  $('#tagTypeFilter').on('changed.bs.select', function () {
    var searchSectionPath = window.dataLayer[0].page.type === "home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    if (params.templateTypes.indexOf('all') > -1) params.templateTypes.splice(params.templateTypes.indexOf('all'));
    var filterValue = $('#tagTypeFilter option:selected').map(function () { return $(this).data('filterTagType'); }).get().join(',');
    params.templateTypes = filterValue || 'all';
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });
  $('#searchGo').on('mousedown', function () {
    var searchSectionPath = window.dataLayer[0].page.type === "home page" ? "/?" : "/search?";
    var params = JSON.parse(JSON.stringify(window.dataLayer[0].page.filters));
    if (params.templateTypes.indexOf('all') > -1) params.templateTypes.splice(params.templateTypes.indexOf('all'));
    var filterValue = $('#tagTypeFilter option:selected').map(function () { return $(this).data('filterTagType'); }).get().join(',');
    params.templateTypes = filterValue || 'all';
    params.query = [$('#query').val()];
    location.href = searchSectionPath + window._gtm_templates.tools.buildQuery(params);
  });

  $('#install-template').on('click', function () {
    window._sw_step_1_query = true;
    $('.modal .modal-title').text('Custom Template Installation Process');
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
      contentCache: false,
      disabledSteps: []
    });

    $(document).on("leaveStep", "#smartwizard", function (e, anchorObject, stepNumber, stepDirection) {
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
      if (stepDirection === 'forward' && stepNumber === 2) {
        if ($('[name="workspaceId"]:checked').length === 0) {
          alert("You need to select a workspace");
          return false;
        }
      }      
      return true;
    });
  });
  $(document).on("showStep", "#smartwizard", function (e, anchorObject, stepNumber, stepDirection) {
    var cacheBuster = [new Date() * 1, Math.random().toString(36).substring(7)].join('');
    if (stepNumber === 0 && window._sw_step_1_query === true) {
      $('#step-1').html('<img src="https://loading.io/spinners/bricks/index.block-rotate-loading-gif.svg"></img>');
      $.getJSON("/api/gtm/getAccounts?cb=" + cacheBuster, function (data) {
        var accounts = [];
        data.results.forEach(function (e) {
          accounts.push('<div class="radio radio-info "><input data-account-id="' + e.accountId + '" data-account-name="' + e.name + '" class="form-check-input" type="radio" name="accountId" id="accountId_' + e.accountId + '" value="' + e.accountId + '">                <label class="form-check-label" for="accountId_' + e.accountId + '">' + e.name + ' <small>( ' + e.accountId + ' )</small></label></div>');
        });
        $('#step-1').html(accounts.join(''));
      }).fail(function (jqXHR) {
        $('#step-1').html("Something went wrong. Try again");
      });
    }

    if (stepNumber === 1 && stepDirection === 'forward' && $('[name="accountId"]:checked').val()) {
      var accountId = $('[name="accountId"]:checked').val().toString();
      $('#step-2').html('<img src="https://loading.io/spinners/bricks/index.block-rotate-loading-gif.svg"></img>');
      $.getJSON("/api/gtm/getContainers/" + accountId + "?cb=" + cacheBuster, function (data) {
        var containers = [];
        data.results.forEach(function (e) {
          containers.push('<div class="radio radio-info"><input data-container-id="' + e.containerId + '" data-container-name="' + e.name + '" data-container-public-id="' + e.publicId + '" class="form-check-input" type="radio" name="containerId" id="containerId_' + e.containerId + '" value="' + e.containerId + '">          <label class="form-check-label" for="containerId_' + e.containerId + '">' + e.name + ' <small>( ' + e.publicId + ' )</small></label></div>');
        });
        $('#step-2').html(containers.join(''));
      }).fail(function (jqXHR) {
        $('#step-2').html(jqXHR.responseJSON.message);
      });
    }

    if (stepNumber === 2 && stepDirection === 'forward' && $('[name="accountId"]:checked').val() && $('[name="containerId"]:checked').val()) {
      var accountId = $('[name="accountId"]:checked').val().toString();
      var containerId = $('[name="containerId"]:checked').val().toString();

      $('#step-3').html('<img src="https://loading.io/spinners/bricks/index.block-rotate-loading-gif.svg"></img>');
      $.getJSON("/api/gtm/getWorkSpaces/" + accountId + "/" + containerId + "?cb=" + cacheBuster, function (data) {
        var workspaces = [];
        data.results.forEach(function (e) {
          workspaces.push('<div class="radio radio-info"><input data-workspace-id="' + e.workspaceId + '" data-workspace-name="' + e.name + '"  class="form-check-input" type="radio" name="workspaceId" id="workspaceId_' + e.workspaceId + '" value="' + e.workspaceId + '"><label class="form-check-label" for="workspaceId_${e.workspaceId}">' + e.name + '</label></div>');
        });
        $('#step-3').html(workspaces.join(''));
      }).fail(function (jqXHR) {
        $('#step-3').html(jqXHR.responseJSON.message);
      });
    }

    if (stepNumber === 3) {
      $('#review-account-name').text($('[name="accountId"]:checked').data('accountName'));
      $('#review-container-name').html($('[name="containerId"]:checked').data('containerName') + '<span class="label label-default">' + $('[name="containerId"]:checked').data('containerPublicId') + '</span>');
      $('#review-workspace-name').text($('[name="workspaceId"]:checked').data('workspaceName'))
      $('.sw-btn-next').text("INSTALL");
    }

    if (stepNumber === 4 && stepDirection === 'forward') {   
      var templateId = dataLayer[0].template.id;      
      var accountId = $('[name="accountId"]:checked').data('accountId');
      var containerId = $('[name="containerId"]:checked').data('containerId');
      var workspaceId = $('[name="workspaceId"]:checked').data('workspaceId');
      
      $('.sw-btn-next').hide();      
      $('#step-5').html('<img src="https://loading.io/spinners/bricks/index.block-rotate-loading-gif.svg"></img>');
      if(!accountId || !containerId || !workspaceId) {
        $('#step-5').html("Something went wrong. Try again");         
      }      
      $.getJSON("/api/gtm/installTemplate/" + templateId + "/" + accountId + "/" + containerId + "/" + workspaceId + "/?cb=" + cacheBuster, function (data) {
        $('#step-5').html("Template "+ data.results[0].name +" successfully imported");
      }).fail(function (jqXHR) {
        $('#step-5').html(jqXHR.responseJSON.message);
      });      
    }
  });

  $("#exampleModal").on("hidden.bs.modal", function () {
    // ON reset default step is loaded, making the tool to do a query to API, prevent this.
    window._sw_step_1_query = false;
    $('#smartwizard').smartWizard('reset');  
    if (document.location.hash && document.location.hash.indexOf("#step") > -1) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  });

  // Sign in
  var signIn = document.querySelector('#signIn');

  // From https://bit.ly/2yo2U9C
  var windowObjectReference = null;
  var previousUrl = null;

  var receiveMessage = function (event) {
    if (event.origin !== 'https://www.gtmtemplates.com' && event.origin !== 'http://localhost:8080' || event.source.name !== 'google-auth-popup') {
      return;
    }
    var req = new XMLHttpRequest();
    var endpoint = '/api/session/login/' + event.data;
    req.open('GET', endpoint, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        if (JSON.parse(req.response).status === 'success') {
          window.location.reload();
        }
      }
    };
    req.send();
  };

  var openSignInWindow = function (url, name) {
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
    signIn.addEventListener('click', function () {
      openSignInWindow(window.__google_auth_url, 'google-auth-popup');
    });
  }

})(window.jQuery);
