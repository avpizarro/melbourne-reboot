// Create variable to store each place details
var placeId = [];
var apiResults = [];
var openingHours = [];
var length = 10;

// var requestMode = 
//     {
//         mode: 'no-cors',
//         headers: {
//           'Access-Control-Allow-Origin':'*'
//         }
//       }


// Disable Enter key for input
window.addEventListener('keydown', function (e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter') {
        if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            e.preventDefault(); return false;
        }
    }
}, true);

// Select homepage submit button
var submitBtn = document.querySelector("button");
var firstRow = document.querySelector(".results-row1");
var secondRow = document.querySelector(".results-row2");

// Add click to homepage submit button
submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".progress").classList.remove("hide");
    apiResults = [];
    placeId = [];
    firstRow.innerHTML = "";
    secondRow.innerHTML = "";

    // submitBtn.textContent = "New Search";
    // submitBtn.className = "reset";
    //Get the suburb, radius selected by the user and the available activity types
    var suburb = document.getElementById("suburb").value;
    var radius = document.getElementById("test5").value * 1000;
    var types = document.querySelectorAll('input[type="checkbox"]');

    //Get the types checked by the user into an array
    var checkedTypes = [];
    var i;
    for (i = 0; i < types.length; i++) {
        if (types[i].checked) {
            checkedTypes.push(types[i].value);
        }
    }

    //Stringify the array of the checked types
    checkedTypes = checkedTypes.map(function (e) {
        return JSON.stringify(e);
    });

    //Edit the stringified array to be used in the query URL
    var typesForURL = checkedTypes.join("+").replace(/(['"])/g, "");

    //Narrow the user choices to Australia
    var location = suburb + "+Victoria";
    
    // Define the function to run the Google Place Search API query and get the places_ID
    async function fetchId() {
        var response = await fetch(
            `api/googleplace/${typesForURL}/${location}/${radius}`,
            // queryURL, 
            // requestMode
            )
        if (!response.ok) {
            throw Error("ERROR: " + "Can't get any results form the Google Maps API.");
        }
        response = await response.json()
        // in case the length or the response.results is smaller from the "length= 10 "
        if(length >response.results.length){
            length = response.results.length;
        }
        console.log("length: " , length)
        for (var i = 0; i < length; i++)
            placeId.push(response.results[i].place_id);
        fetchData();

    }

    fetchId();
   
    // Define a function to call the Google Place Detail API for each result 
    async function fetchData() {
        for (var i = 0; i < length; i++) {
        
            var response = await fetch(`api/placedetail/${placeId[i]}`, 
            // requestMode 
            )
            if (!response.ok) {
                throw Error("ERROR: " + "Can't get each place detail with placeId.");
            }

            response = await response.json()

            let photoRef = "ATtYBwLIMpWiZiOwfDYy1XGHZ1c-EhzV8hZG2GhB5JhZ90qnvMpfLT5oCDqV7So6Fpt9X6oCnuQGijeC6CjETpLxGiH3LhOg6zKAETrszrt2yWzWxdUxAX2jhz5cTeDTakip448RserT1iN_ukOPp2X3LhHvJeYOym4WiJ27pO5LlsHhzCh9"
        
            if (response.result.photos) {
                photoRef = response.result.photos[0].photo_reference
            }

          
            // Call the Google Photo API

            var photo = await fetch(`api/placephotos/${photoRef}`
                            // requestMode
            )
            if (!photo.ok) {
                throw Error("ERROR: " + "Can't get the place photos.");
            }
            // Handle the pomise
            photoUrl = await photo.json()

            console.log('photo:', photoUrl)

            //Store the results 
            apiResults.push({
                results: response.result,
                photoUrl: photoUrl.url,
            })
        }

        //var openingHours = [];

        for (var i = 0; i < length; i++) {
            var hours = "not available";
            if (apiResults[i].results.opening_hours) {
                var hours = apiResults[i].results.opening_hours.weekday_text
            }
            openingHours.push(hours);

            // in case there is not rating at this time user visit the website
            if (apiResults[i].results.rating == null) {
                apiResults[i].results.rating = "-";
            }

            informationContainer(
                apiResults[i].photoUrl,
                apiResults[i].results.name,
                openingHours[i],
                apiResults[i].results.formatted_address.replace(/VIC|, Australia|/g, ""),
                apiResults[i].results.rating,
                apiResults[i].results.url,
                i);

        }
        checkIfUserLoggedIn();
    }
});

function checkIfUserLoggedIn() {
    var loginStatus = localStorage.getItem("login");
    if(!loginStatus)
    showForm();
}
// create Array data to store the favorites choices from the user

var data = new Array(6);

for (var i = 0; i < data.length; i++) {
    data[i] = [];
}

// Check if there is any data in the localstorage from previous use

var textQ = localStorage.getItem("saveMyPlaces");
if (textQ != null) {
    data = JSON.parse(textQ);
}

function informationContainer(imageLink, title, operating, address, rate, link, id) {
    document.querySelector(".progress").classList.add("hide");
    var today = moment().format('dddd') + ":";
    var tempArray = "";

    var hours = "";

    /* run the array with the opening hours and split each line to arrayline to find the today 
    schedule for the place and to store to variable hours */

    for (var j = 0; j < operating.length; j++) {
        if (operating[j]) {
            var tempArray = operating[j].split(" ");
            if (today == tempArray[0]) {
                for (var i = 1; i < tempArray.length; i++)
                    hours = hours + " " + tempArray[i];
            }
        }
    }

    // store all the class name to array and with the "for loop to insert to <i>"
    var ArrayOfClassName = ["fas fa-clock", "fas fa-map-marker-alt", "fas fa-heart", "fas fa-directions", "fa fa-star fa-star-o"];

    // store all the information about the place/restaurant/cafe to array and with the "for loop to insert to <span>"
    var arrayInfo = [];
    arrayInfo.push(hours);
    arrayInfo.push(address);
    arrayInfo.push(rate);
    arrayInfo.push(link);

    /* after the title there is four catgories follow in the card "opening hours" , "address" , " rating" because there is Loop to add 
    this categories to card some of them the don't have any text, only a space and the rating only the title */
    categories = ['', ' ', ' Rating : ',];

    // create the div will include the card

    var cardContainer = document.createElement("div");
    cardContainer.className = "col s6 m4 l3 xl2";
    firstRow.appendChild(cardContainer)
    if (firstRow.children.length === 6 && window.innerWidth > 1200) {
        secondRow.appendChild(cardContainer);
    }

    var cardDiv = document.createElement("div");
    cardDiv.className = "card large";
    cardContainer.appendChild(cardDiv);

    var cardImgDiv = document.createElement("div");
    cardImgDiv.className = "card-image";
    cardDiv.appendChild(cardImgDiv);

    // Create the <img> tag will include the image 

    var image = document.createElement("img");
    image.setAttribute("src", imageLink);
    image.setAttribute("onerror", "this.onerror=null;this.src='./assets/images/Melbourne Reboot Logo/melbourne reboot logo_resized.png'");
    cardImgDiv.appendChild(image);

    var cardContentDiv = document.createElement("div");
    cardContentDiv.className = "card-content black-text";
    cardDiv.appendChild(cardContentDiv);

    // Create the star will save in the local storage and will display to favorate-page

    var favorite = document.createElement("i");
    favorite.setAttribute("onclick", "toggleStar(event)");
    favorite.setAttribute("data-id", id);
    favorite.setAttribute("data-save", "not-saved");
    favorite.className = ArrayOfClassName[4];
    cardContentDiv.appendChild(favorite);

    // Create <h6> tag the title will be here

    var cardTitle = document.createElement("h6");
    cardTitle.className = "card-title black-text";
    cardTitle.appendChild(document.createTextNode(title));
    cardContentDiv.appendChild(cardTitle);


    // Here is the Loop for create the "openning hours" , "address" , " rating" 
    // Add place details and icons to card 

    for (var i = 0; i < categories.length; i++) {
        var cardInfo = document.createElement("div");
        cardInfo.className = "placeDetails";
        var info = document.createElement("span");
        var cardItag = document.createElement("i");
        cardItag.className = ArrayOfClassName[i];
        info.appendChild(document.createTextNode(categories[i] + arrayInfo[i]));
        cardContentDiv.appendChild(cardInfo);
        cardInfo.appendChild(info);
        cardInfo.prepend(cardItag);
    }


    // Display Google Maps link
    var linkDiv = document.createElement("div");
    linkDiv.className = "card-action";
    var mapsLink = document.createElement("a");
    var mapsIcon = document.createElement("i")
    mapsIcon.className = ArrayOfClassName[3];
    mapsLink.appendChild(document.createTextNode("  directions"));
    mapsLink.setAttribute("href", arrayInfo[3]);
    mapsLink.setAttribute("target", "_blank");

    cardContentDiv.appendChild(linkDiv);
    linkDiv.appendChild(mapsLink);
    mapsLink.prepend(mapsIcon);
}
// This function change the status of the star and save the information to local storage

function toggleStar(event) {

    var saveInfo = event.target.getAttribute("data-save");
    var id = event.target.dataset.id;
    event.target.classList.toggle("fa-star-o");

    if (saveInfo == "not-saved") {

        /* change the status to "saved" to be able from the javascript in case the user unfavourite to delete from the localstorage
         when the card saved as favourite from user then the "data-id" change from the spot get in to array in case the user unfavourite
        before change page*/

        event.target.setAttribute("data-save", "saved");
        event.target.setAttribute("data-id", data[0].length);

        data[0].push(apiResults[id].photoUrl);
        data[1].push(apiResults[id].results.name);
        data[2].push(openingHours[id]);
        data[3].push(apiResults[id].results.formatted_address);
      data[4].push(apiResults[id].results.rating);
        data[5].push(apiResults[id].results.url)
        localStorage.setItem("saveMyPlaces", JSON.stringify(data));

    } else {

        event.target.setAttribute("data-save", "not-saved");
        for (var i = 0; i < 6; i++) {
            data[i].splice(id, 1);
        }
        localStorage.setItem("saveMyPlaces", JSON.stringify(data));
    }

}

function showForm() {
    document.getElementById("showRow").classList.remove("hide");
    document.getElementById("showBtn").classList.remove("hide");
};


function showPreloader() {
    document.querySelector(".progress").classList.remove("hide");
    
    if (firstRow.innerHTML != "" && secondRow.innerHTML != "") {

        document.querySelector(".progress").classList.add("hide");
    }
  
}



