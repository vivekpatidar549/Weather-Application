const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContianer=document.querySelector('.grant-location-container');
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container');
const grantaccessbutton=document.querySelector('[data-grantAccess ]');
const notfound=document.querySelector("[not-found-404]");
// initail variables
let currentTab=userTab;
const API_KEY='0825a79a6a20072a0abd37d897619f4f';
currentTab.classList.add("current-tab");

// ??
getfromSessionStorage();


function renderweatherinfo(data){
    // firstly we have to fetch the elements
    console.log(data);
    const cityname=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]"); 

    
    cityname.innerText=data?.name;
    // countryIcon.src=`https://flagcdn.com/16x12/${data?.sys?.country.tolowerCase()}.png`;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText=data?.weather?.[0].description;
    weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temp.innerText=`${data?.main?.temp} °C`;
    windspeed.innerText=`${data?.wind?.speed}m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    cloudiness.innerText=`${data?.clouds?.all}%`;
}

async function fetchUserWeatherinfo(coordinates){
    const{lat,log}=coordinates;
    // make grantaccess container invisible
    grantAccessContianer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");
    // API CALL
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        // user info container visible
        userInfoContainer.classList.add("active");
        // adding values to ui
        renderweatherinfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
    }

}
// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinate");
    if(!localcoordinates){
        // if local coordinates nhi mile 
        grantAccessContianer.classList.add("active"); 
    }
    else{
        notfound.classList.remove("active");
        const parcoordinates= JSON.parse(localcoordinates);
        console.log("i am here at local coordinates");
        console.log(parcoordinates);
        fetchUserWeatherinfo(parcoordinates);
    }
}

function switchtab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab"); 
        
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContianer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pahle search pe tha ab your weather pe hu
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //display weather so lets check local storage first for coordinates
            getfromSessionStorage();
        }
    }
    
}
// handling the click
userTab.addEventListener('click',()=>{
    // pass clicked tab as input para
    switchtab(userTab);
});
searchTab.addEventListener('click',()=>{
    // pass clicked tab as input para
    switchtab(searchTab);
});


function showposition(position){
    const usercoordinate={
        lat:position.coords.latitude,
        log:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinate",JSON.stringify(usercoordinate));
    fetchUserWeatherinfo(usercoordinate)
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("NO Geolocation Support available")
    }
}

grantaccessbutton.addEventListener('click',getlocation);


const searchinput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchinput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherinfo(cityName);
    }

})

async function fetchSearchWeatherinfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    notfound.classList.remove("active");
    grantAccessContianer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if(data.cod==404){
            // loadingScreen.classList.remove("active");
            throw new Error("City Not Found");
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");

        notfound.classList.add("active");
    }
}