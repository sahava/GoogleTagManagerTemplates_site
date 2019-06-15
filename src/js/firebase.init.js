(function() {
  var firebase = window.firebase;
  var signInButton = document.querySelector('#signIn');

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDRgej0H6RrmLXYRpGzwuB1lWTXjQFYCV0",
    authDomain: "gtm-templates-com.firebaseapp.com",
    databaseURL: "https://gtm-templates-com.firebaseio.com",
    projectId: "gtm-templates-com",
    storageBucket: "gtm-templates-com.appspot.com",
    messagingSenderId: "874469196632",
    appId: "1:874469196632:web:c3b9f79df26d65ed"
  };

  var postIdTokenToSessionLogin = function(idToken) {
    var req = new XMLHttpRequest();
    var endpoint = '/api/session/login/';
    var data = JSON.stringify({idToken: idToken});
    req.open('POST', endpoint, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        if (JSON.parse(req.response).status === 'success') {
          firebase.auth().signOut().then(function() {
            window.location.reload();
          });
        }
      }
    };
    req.send(data);
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Do not persist state in client-side
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  firebase.auth().onAuthStateChanged(function() {
    var user = firebase.auth().currentUser;
    if (user !== null) {
      user.getIdToken(true).then(function (idToken) {
        return postIdTokenToSessionLogin(idToken);
      });
    }
  });

  if (signInButton) {
    signInButton.addEventListener('click', function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      firebase.auth().signInWithPopup(provider);
    })
  }
})();
