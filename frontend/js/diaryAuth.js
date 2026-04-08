const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

//jos löytyy token niin voi login