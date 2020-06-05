"use strict";

var holdData = {
    article: [],
    header: []
};

function getSitesData(e) {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var json = JSON.parse(xmlhttp0.responseText);
            console.log(json);
            for (var i = 0; i < json.length; i++) {
                holdData.article[i] = json[i][1];
                holdData.header[i] = json[i][0];
            }
            drawArticles();
        }
    });
    xmlhttp0.open("GET", "php/save_article.php?getArticle=true");
    xmlhttp0.send(); 
}

document.addEventListener("DOMContentLoaded", getSitesData);

function drawArticles() {
    var wrapper = document.getElementById("site_wrapper");
    for (var i = 0; i < holdData.header.length; ++i) {
        var headerElem = document.createElement("h3");
        var linkHeader = document.createElement("a");
        linkHeader.setAttribute("id", "linkHeader:" + i);  
        linkHeader.innerHTML = holdData.header[i];
        linkHeader.setAttribute("href", "");
        linkHeader.addEventListener("click", seeArticle);

        headerElem.appendChild(linkHeader); 
        wrapper.appendChild(headerElem);
    }
}

function seeArticle(e) {
    e.preventDefault();
    var id = 0;
    var counter = 11;
    var isNumber = true;
    while (isNumber) {
        if (e.currentTarget.id.charAt(counter)) {
            isNumber = true; 
            id += e.currentTarget.id.charAt(counter);
        } else {
            isNumber = false;
        }
        counter++;
    }
    var wrapper = document.getElementById("site_wrapper");
    wrapper.textContent = "";  
    wrapper.insertAdjacentHTML("beforeend", holdData.article[Number(id)]);
}

