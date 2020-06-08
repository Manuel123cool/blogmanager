"use strict";

var siteIndex2 = -1;

let urlPar = {
    checkPar: function (rePageChar = false) {
        let url = window.location.href;
        let indexPage = url.search("page=");
        let indexIndex = url.search("index=");
        let firstPageChar = 'h';
        
        if (indexPage != -1) {
            firstPageChar = url.charAt(indexPage + 5); 
        } 

        let index = 0;
        if (indexIndex != -1) {
            var counter = indexIndex ;
            var isNumber = true;
            while (isNumber) {
                if (url.charAt(counter + 6)) {
                    isNumber = true; 
                    index += url.charAt(counter + 6);
                } else {
                    isNumber = false;
                }
                counter++;
            }
            siteIndex2 = index;
        }
 
        switch (firstPageChar) {
            case 'h':
                drawArticles();   
                return true;
            case 'a':
                drawArticleUponIndex(index); 
                return true;
            default:
                drawArticles();
                return true;
        }
    },
    insertParam: function(value, siteIndex = false)
    {
        value = encodeURIComponent(value);
        let key = 'page';
        let oldPar = '';
        if (siteIndex) {
            oldPar = 'page=article&';
            key = 'index';
        }
        let url = 'index.html?' + oldPar + key + '=' + value;
        window.history.pushState(null, null, url);
        this.checkPar();
    }
}

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
            urlPar.checkPar();
        }
    });
    xmlhttp0.open("GET", "php/save_article.php?getArticle=true");
    xmlhttp0.send(); 
}

document.addEventListener("DOMContentLoaded", getSitesData);

function delCommentWrapper() {
    var indexWrapper = document.getElementById("index_wrapper");
    var commentWrapper = document.getElementById("comment_wrapper");
    var comment_form_wrapper = document.getElementById("comment_form_wrapper");
   
    indexWrapper.textContent = "";
    commentWrapper.textContent = "";
    comment_form_wrapper.textContent = "";
}

function drawArticles() {
    var wrapper = document.getElementById("site_wrapper");
    wrapper.textContent = "";
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
    delCommentWrapper(); 
}

function allCommentFunc() {
    drawForm(); 
    insertCommentAndLength(Number(siteIndex2)); 
    getLength(Number(siteIndex2)); 
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
    urlPar.insertParam(Number(id), true);
}

function drawArticleUponIndex(index) {
    var wrapper = document.getElementById("site_wrapper");
    wrapper.textContent = "";  
    wrapper.insertAdjacentHTML("beforeend", holdData.article[Number(index)]);
    allCommentFunc();
}

window.onpopstate = function(event) {
    urlPar.checkPar();
}
