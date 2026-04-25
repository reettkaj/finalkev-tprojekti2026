const token = localStorage.getItem("token");

if(!token){
    window.location.href = "index.html";
}

//jos löytyy token niin voi login