class Controller {
    constructor() {
        // Domain datastructures
        let nils = new User('nils', 'Nils');
        let gunnar = new User('gunnar','Gunnar');
        let eva = new User('eva','Eva');
        let petra = new User('petra','Petra');
        this.contacts = new Set([nils,gunnar,eva,petra]);

        this.users = [];
        this.ads = [];
        this.currentUser = null;
        this.imageInput = document.getElementById("uploadImages");
        imageInput.addEventListener("change", function (e) {
          console.log(input.files)
          const reader = new FileReader();
            reader.onload = function(){
              let img = new Image();
              img.src = reader.result;
              console.log(reader.result);
              console.log("heey");
              document.getElementById("uploadImages").appendChild(img);
            }
          }, false);

        /*
        *  Toggles between content views
        *  @param currentView, nextView
        */
        function toggleView(currentView, nextView){
          document.getElementById(currentView).style.display = "none";
          document.getElementById(nextView).style.display = "block";
        }

        // retrieves the input of create user page and creates a user object
        // Then stores this user in an array and toggles to the ads view
        function createUser(){
          // retrieve inputs
          let firstname = document.getElementById("createUserFirstname").value;
          let lastname = document.getElementById("createUserLastname").value;
          let streetAdress = document.getElementById("createUserStreetAdress").value;
          let city = document.getElementById("createUserCity").value;
          let postalCode = document.getElementById("createUserPostalCode").value;
          let emailAdress = document.getElementById("createUserEmailAdress").value;
          let username = document.getElementById("createUserUsername").value;
          let password = document.getElementById("createUserPassword").value;

          // creates and appends the user to an array
          users.push( new User(firstname, lastname, streetAdress, city, postalCode, emailAdress, username, password));

          // toggles to the ads view
          toggleView("createUser", "ads");
        }

        // afunction to handle add creation
        function createAd(){
          // retrieves inputs
          let title = document.getElementById("createTitle").value;
          let price = document.getElementById("createPrice").value;
          let description = document.getElementById("createDescription").value;

          // will handle the image inputs
          let images = document.getElementById("uploadImages").value;

          // pushes the ad to an array storing ads
          ads.push(new Ad(title, price, description, images));

            // to do, then load created add
        }



        // function to handle login
        function login(){
          // retrieves inputs
          let username = document.getElementById("usernameLogin").value;
          let password = document.getElementById("passwordLogin").value;

          // gets the current user from a database if it exists
          // returns null if else
          currentUser = getUser(username, password);

          // toggles between login screen and ads screen
          toggleView("login", "ads");

          // updates header with username
          updateHeader();
        }

        /*
        *  function to get the user from the user db
        *  @param username, password
        */
        function getUser(username, password){
          for(let i = 0; i < users.length; i++){
            if(username === users[i].username){
              if(password === users[i].password){
                return users[i]
              }
            }
          }
        }

        // function to update the header with username
        function updateHeader(){
          document.getElementById("me").innerHTML = currentUser.username;
        }

        // user class
        class User {
          constructor(firstname, lastname, streetAdress, city, postalCode, emailAdress, username, password) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.streetAdress = streetAdress;
            this.city = city;
            this.postalCode = postalCode;
            this.emailAdress = emailAdress;
            this.username = username;
            this.password = password;
          }
        }

        // ad class
        class Ad {
          constructor(title, price, description, images) {
            this.title = title;
            this.price = price;
            this.description = description;
            this.images = images;
          }
        }

        // initialises a user
        users.push(new User("theodor", "urtegård", "nedre strandgate 9d", "ålesund", "6004", "theo_u@hotmail.com", "theodor","theodor"));


    }
}



/***
 * Setup application
 */
ctrl = null;
document.addEventListener('DOMContentLoaded', function() {
    this.ctrl = new Controller();
}, false);
