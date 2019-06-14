const firebase = require('firebase');

const app = firebase.initializeApp({
  apiKey: "AIzaSyDRgej0H6RrmLXYRpGzwuB1lWTXjQFYCV0",
  authDomain: "gtm-templates-com.firebaseapp.com",
  databaseURL: "https://gtm-templates-com.firebaseio.com",
  projectId: "gtm-templates-com",
  storageBucket: "gtm-templates-com.appspot.com",
  messagingSenderId: "874469196632",
  appId: "1:874469196632:web:c3b9f79df26d65ed"
});

const isAuthenticated = (req, res, next) => {
  const user = app.auth().currentUser;
  if (user !== null) {
    req.user = user;
    next();
  } else {
    res.redirect('/', 301);
  }
};

module.exports = {
  isAuthenticated
};
