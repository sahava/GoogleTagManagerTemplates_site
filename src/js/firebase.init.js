(function() {
  var signInButton = document.querySelector('#signIn');
  var signOutButton = document.querySelector('#signOut');
  var userMenu = document.querySelector('#user');
  var userName = document.querySelector('#userName');
  var userEmail = document.querySelector('#userEmail');
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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(function() {
    if (firebase.auth().currentUser !== null) {
      signInButton.setAttribute('hidden', 'true');
      userName.textContent = firebase.auth().currentUser.displayName;
      userEmail.textContent = firebase.auth().currentUser.email;
      userMenu.removeAttribute('hidden');
    } else {
      userName.textContent = '';
      userEmail.textContent = '';
      userMenu.setAttribute('hidden', 'true');
      signInButton.removeAttribute('hidden');
    }
  });

  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });

  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
})();
