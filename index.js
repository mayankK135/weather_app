const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const granAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchFrom]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


//initial variables

let oldTab=userTab;
const API_KEY="1f359f0f735d02a192cf28c52bd837e4";
oldTab.classList.add("current-tab");
//const URL_for_ref=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

//getfromSessionStorage();



//handling tab change

function swithTab(clickedTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            granAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //going from search tab to your weather
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    swithTab(userTab);
})

searchTab.addEventListener("click",()=>{
    swithTab(searchTab);
})

//check if user coordinate in local storage
function getfromSessionStorage(){
    const localCoordinate=sessionStorage.getItem("user-coordinates");
    if(!localCoordinate){
        //user info in not storage then get location acees
        granAccessContainer.classList.add("active");
    }
    else{
        const coordinate=JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinate);
    }
}

async function fetchUserWeatherInfo(coordinate){
    const {lat,lon}=coordinate;

    granAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try{
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        console.log(data);
        renderWeatherInfo(data);
    }
    catch(err){
        alert(`error 404! data not found`);
        loadingScreen.classList.remove("active");
        granAccessContainer.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //first fetch required element from dom
    const cityName=document.querySelector("[data-cityName]")
    const countryIcon=document.querySelector("[data-countryIcon]")
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");

    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch value from weather info and insert in ui

    cityName.inerText=weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=weatherInfo?.main?.temp;
    windSpeed.innerText=weatherInfo?.wind?.speed;
    humidity.innerText=weatherInfo?.main?.humidity;
    cloudiness.innerText=weatherInfo?.clouds?.all;
}

//applying listner on grant access button

function getLocaion(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("can not get your location");
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocaion);


//serach weather for a particular place

let serchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=serchInput.value;
    if(cityName==="")return;
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    granAccessContainer.classList.remove("active");
    
    try{
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        console.log(data);
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        alert("Error 404! data not found");
    }
}