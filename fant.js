let users = [];
let ads = [];
let currentUser = null;
let adsPrinted = 0;
// let imageInput = document.getElementById("uploadImages")
// imageInput.addEventListener("change", function (e) {
//   console.log(imageInput.files)
//   const reader = new FileReader();
//   const img = new Image();
//   img.src = reader.result;
//   document.getElementById("uploadImages").appendChild(img);
//   }, false)

/*
*  Toggles between content views
*  @param currentView, nextView
*/
function toggleView(currentView, nextView){
  document.getElementById(currentView).style.display = "none";
  document.getElementById(nextView).style.display = "block";

  if(nextView === "ads"){
      adsLoader();
    }
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

// creates elements for ads
function adsLoader(){

  // gets the ads wrapper
  let wrapper = document.getElementById("ads");

  // chekcs if another ad has been added
  if (adsPrinted != ads.length){

    // only loops through unprinted ads
    for(let i = ads.length-1; i >= adsPrinted-1; i--){

      // initialises an ads "box"
      let box = document.createElement("div");
      box.id = i.toString();
      box.className = "box";

      // initialise an ads content
      let img = document.createElement("img");
      img.src = ads[i].images[0];
      box.appendChild(img);

      let title = document.createElement("h1");
      title.innerHTML = ads[i].title;
      box.appendChild(title);

      let price = document.createElement("p");
      price.innerHTML = ads[i].price + ",-";
      box.appendChild(price);

      let description = document.createElement("p");
      description.innerHTML = ads[i].description;
      box.appendChild(description);

      // inserts the ads on top (we want newest ads first)
      wrapper.insertBefore(box, wrapper.childNodes[0]);
    }
  }

}

function updateAds(){

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
ads.push(new Ad("Logik tv", "500", "Selger ein brukt logik TV, er blitt nokre år gammal. 29 tommer HD LED TV. Kjøper betaler frakt. Ny eller brukt:	Brukt", ["pictures/fant1.jpg"]));
ads.push(new Ad("Siemens Platetopp 50%", "7 900", "Selger induksjonsplatetopp som har stått utstillt i vår butikk på Lade. 80cm. Veil pris: 15 799,- INGEN reservasjon, 100% forskuddsbetaling. MÅ hentes på Kvik lade i uke 49/50. 2 års garanti fra kjøpsdato. Ingen returrett. Spesifikasjoner: https://www.siemens-home.bsh-group.com/no/produktliste/ED877FSF1X Med forbehold om feil i annonsetekst.", ["pictures/fant2.jpg"]));
ads.push(new Ad("PC-veske", "250", "Selger en meget fin og praktisk skulderveske til bærbar PC. Den er av merket LONDON FOG (Sterling Edition) Som det kan sees av bildet, har den mange oppbevaringslommer. selges til kr 250,- eller høystbydende", ["pictures/fant3.jpg"]));
