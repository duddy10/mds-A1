let users = [];
let ads = [];
let currentUser = null;
let currentView = "login";
let currentImageViewed;
let currentAdViewed = null;
let adsPrinted = 0;
let images = [];
let selectedImages = [];
let exampleImage1 = new Image();
exampleImage1.src = "pictures/fant1.jpg";
let exampleImage2 = new Image();
exampleImage2.src = "pictures/fant2.jpg";
let exampleImage3 = new Image();
exampleImage3.src = "pictures/fant3.jpg";
let token = null;

// handles the image input and displays it
function handleImage(){
  let imageFile = document.getElementById("uploadImages").files[0];
  let img = document.createElement("img");
  img.src = window.URL.createObjectURL(imageFile);
  img.style.height = "250px";
  img.style.width = "250px";
  img.id = img.src;
  img.style.opacity = 1;
  img.onclick = () => selectImage(img);
  images.push(img);

  document.getElementById("imageUploadView").appendChild(img);
}

/*
* function to visualise selected image
* @param img
*/
function selectImage(img){
  if(img.style.opacity === 1){
    img.style.opacity = 0.5;
    selectedImages.push([img.id]);
  } else {
    img.style.opacity = 1;
    selectedImages.splice(selectedImages.indexOf(img),1);
  }

}

// removes the selected image from view and array
function removeSelectedImage(){
  for(let i = 0; i < selectedImages.length; i++){
    let element = document.getElementById(selectedImages[i]);
    element.parentNode.removeChild(element);
    images.splice(images.indexOf(selectedImages[i],1));
  }
  selectedImages = [];
}

/*
*  Toggles between content views
*  @param currentView, nextView
*/
function toggleView(nextView){
  document.getElementById(currentView).style.display = "none";
  currentView = nextView;
  document.getElementById(nextView).style.display = "block";

  if(nextView === "ads"){
      adsLoader();
    }
}

// afunction to handle add creation
function createAd(){
  // retrieves inputs
  let title = document.getElementById("createTitle").value;
  let price = document.getElementById("createPrice").value;
  let description = document.getElementById("createDescription").value;

  // will handle the image inputs
  let uploadedImages = images;

  // removing onclick and opacity attributes
  for(let i = 0; i < uploadedImages.length; i++){
    uploadedImages[i].style.opacity = 1;
    uploadedImages[i].onclick = "";
  }

  // resets the image holder
  images = [];

  // pushes the ad to an array storing ads
  ads.push(new Ad(title, price, description, uploadedImages, currentUser));

  toggleView("ads");
}

async function addSellable() {
    const data = new FormData();
    data.append('title',document.getElementById("createTitle").value);
    data.append('description',document.getElementById("createDescription").value);
    data.append('price',document.getElementById("createPrice").value);
    let imagesUploaded = document.getElementById("uploadImages").files;
    for(let file of imagesUploaded) {
        data.append('files', file);
    }

    const response = await fetch('api/fant/create', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: data
    });
    const sellable = await response.json();
    console.log(sellable);
}

// function to handle login with backend communication
async function login() {
    const uid = document.getElementById('usernameLogin').value;
    const pwd = document.getElementById('passwordLogin').value;

    const response = await fetch('api/auth/login?uid=' + uid + '&pwd=' +pwd);
    token = await response.text();
    toggleView("ads");

}

// function to log logout
function logout(){
  currentUser = null;
  updateHeader();
  toggleView("login");
}

// function to handle cancelation of ad creating
function cancel(){
  toggleView("ads");
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
  if(currentUser){
    document.getElementById("me").innerHTML = currentUser.username;
  } else {
    document.getElementById("me").innerHTML = "LOGIN";
  }
}

// creates elements for ads
function adsLoader(){
    
  if (token !== ''){
    document.getElementById("newAd").style.display = "block";
    console.log("display: block");
  } else {
      document.getElementById("newAd").style.display = "none";
      console.log("display: none");
  }
  
  // gets the ads wrapper
  let wrapper = document.getElementById("ads");

  // chekcs if another ad has been added
  if (adsPrinted != ads.length){

    // only loops through unprinted ads
    for(let i = ads.length-1; i >= adsPrinted; i--){
      // initialises an ads "box"
      let box = document.createElement("div");
      box.id = i.toString();
      box.className = "box";
      box.onclick = () => adLoader(ads[i]);

      // initialise an ads content
      let img = ads[i].images[0];
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

    adsPrinted = ads.length;
  }

}

/*
* function to handle loading an ad
* @param currentAd
*/
function adLoader(currentAd){
  clearNode("ad");
  toggleView("ad");
  currentAdViewed = currentAd;

  // gets the ad view
  let wrapper = document.getElementById("ad");

  // creates the image view for the ad
  let imageSrc = currentAd.images[0].src;
  let img = new Image();
  img.src = imageSrc;
  img.id = "00195364"
  wrapper.appendChild(img);
  currentImageViewed = 0;

  // creates buttons to see other images in an add
  let backButton = document.createElement("button");
  let forwardButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.innerHTML = "<";
  forwardButton.id = "forwardButton";
  forwardButton.innerHTML = ">";
  backButton.onclick = () => slideImage(-1);
  forwardButton.onclick = () => slideImage(1);
  wrapper.appendChild(backButton);
  wrapper.appendChild(forwardButton);

  // creates the title for the ad
  let title = document.createElement("h1");
  title.innerHTML = currentAd.title;
  wrapper.appendChild(title);

  // creates the price for the ad
  let price = document.createElement("p");
  price.innerHTML = currentAd.price + ",-";
  wrapper.appendChild(price);

  // creates the description for the ad
  let description = document.createElement("p");
  description.innerHTML = currentAd.description;
  wrapper.appendChild(description);

  // creates the buy button for the ad
  let buyButton = document.createElement("button");
  buyButton.innerHTML = "BUY";
  buyButton.onclick = () => console.log("buy");
  wrapper.appendChild(buyButton);

  // creates the seller information on the ad
  let seller = document.createElement("p");
  seller.innerHTML =
  "Seller: " + currentAd.user.firstname + " " + currentAd.user.lastname + " <br/> " +
  "Adress: " + currentAd.user.streetAdress + ", " + currentAd.user.postalCode + " " + currentAd.user.city + "<br/>" +
  "Contact: " + currentAd.user.emailAdress;
  wrapper.appendChild(seller);
}

/*
* function to clear all elements of a node
* @param id
*/
function clearNode(id){
  let nodeToClear = document.getElementById(id);
  while(nodeToClear.firstChild){
    nodeToClear.removeChild(nodeToClear.firstChild);
  }
}

/*
* displays the next or previous image based on input
* @param dir
*/
function slideImage(dir){
  if((dir > 0) && (currentImageViewed < currentAdViewed.images.length - 1)){
     currentImageViewed++;
     document.getElementById("00195364").src = currentAdViewed.images[currentImageViewed].src;
   } else if ( (dir < 0) && (currentImageViewed > 0)){
     currentImageViewed--;
     document.getElementById("00195364").src = currentAdViewed.images[currentImageViewed].src;
   }
}

// function to load my page elements
function loadMyPage(){
  if (currentUser){
    clearNode("myPage");
    toggleView("myPage");

    let firstname = document.createElement("p");
    firstname.innerHTML = "firstname: " + currentUser.firstname + "<b/>";
    document.getElementById("myPage").appendChild(firstname);

    let lastname = document.createElement("p");
    lastname.innerHTML = "lastname: " + currentUser.lastname + "<b/>";
    document.getElementById("myPage").appendChild(lastname);

    let streetAdress = document.createElement("p");
    streetAdress.innerHTML = "street adress: " + currentUser.streetAdress + "<b/>";
    document.getElementById("myPage").appendChild(streetAdress);

    let city = document.createElement("p");
    city.innerHTML = "city: " + currentUser.city + "<b/>";
    document.getElementById("myPage").appendChild(city);

    let postalCode = document.createElement("p");
    postalCode.innerHTML = "postal code: " + currentUser.postalCode + "<b/>";
    document.getElementById("myPage").appendChild(postalCode);

    let emailAdress = document.createElement("p");
    emailAdress.innerHTML = "emailAdress: " + currentUser.emailAdress + "<b/>";
    document.getElementById("myPage").appendChild(emailAdress);

    let username = document.createElement("p");
    username.innerHTML = "username: " + currentUser.username + "<b/>";
    document.getElementById("myPage").appendChild(username);

    let password = document.createElement("p");
    password.innerHTML = "password: " + currentUser.password + "<b/>";
    document.getElementById("myPage").appendChild(password);

    let logoutButton = document.createElement("button");
    logoutButton.innerHTML = "LOGOUT";
    logoutButton.onclick = () => logout();
    document.getElementById("myPage").appendChild(logoutButton);

  } else {
    toggleView("login");
  }

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
  constructor(title, price, description, images, user) {
    this.uid = title + user.name + price;
    this.title = title;
    this.price = price;
    this.description = description;
    this.images = images;
    this.user = user;
  }
}

// initialises a user
users.push(new User("theodor", "urtegård", "nedre strandgate 9d", "ålesund", "6004", "theo_u@hotmail.com", "theodor","theodor"));
users.push(new User("theodor", "urtegård", "nedre strandgate 9d", "ålesund", "6004", "theo_u@hotmail.com", "",""));
ads.push(new Ad("Logik tv", "500", "Selger ein brukt logik TV, er blitt nokre år gammal. 29 tommer HD LED TV. Kjøper betaler frakt. Ny eller brukt:	Brukt", [exampleImage1, exampleImage2, exampleImage3], users[0]));
ads.push(new Ad("Siemens Platetopp 50%", "7 900", "Selger induksjonsplatetopp som har stått utstillt i vår butikk på Lade. 80cm. Veil pris: 15 799,- INGEN reservasjon, 100% forskuddsbetaling. MÅ hentes på Kvik lade i uke 49/50. 2 års garanti fra kjøpsdato. Ingen returrett. Spesifikasjoner: https://www.siemens-home.bsh-group.com/no/produktliste/ED877FSF1X Med forbehold om feil i annonsetekst.", [exampleImage2], users[0]));
ads.push(new Ad("PC-veske", "250", "Selger en meget fin og praktisk skulderveske til bærbar PC. Den er av merket LONDON FOG (Sterling Edition) Som det kan sees av bildet, har den mange oppbevaringslommer. selges til kr 250,- eller høystbydende", [exampleImage3], users[0]));
