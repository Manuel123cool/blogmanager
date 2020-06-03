"use strict"

var holdData = {
    article:  [],
    header: [],
    currentTarget: -1
};

function drawSmallAddButton(e, before = false, referenceNode) {
    var wrapper = document.getElementById("sites_wrapper");
    var smallAddButton = document.createElement("button");
    smallAddButton.innerHTML =  "add article";    
    smallAddButton.setAttribute("class", "smallAddButton");
    
    if (before) {
        wrapper.insertBefore(smallAddButton, referenceNode);
    } else {
        wrapper.appendChild(smallAddButton);
    }

    addId();
    smallAddButton.addEventListener("click", createEditArticle);
}

function addSaveButton() {
    var wrapper = document.getElementById("sites_wrapper");
    var saveButton = document.createElement("button");
    saveButton.innerHTML =  "save";    
    saveButton.setAttribute("class", "saveButton");
    wrapper.appendChild(saveButton);

    saveButton.addEventListener("click", saveButtonEvent);
}

function drawBackButton() {
    var wrapper = document.getElementById("sites_wrapper");
    var backButton = document.createElement("button");
    backButton.innerHTML =  "go back";    
    backButton.setAttribute("class", "backButton");
    wrapper.appendChild(backButton);

    backButton.addEventListener("click", backButtonEvent);
}

function backButtonEvent(e) {
    var id = holdData.currentTarget;
    holdData.article[id] = document.getElementById("article_textarea").value;
    e.currentTarget.remove();
    document.getElementById("article_textarea").remove();
    addSaveButton();  
    drawSmallAddButton(); 
    drawArticlesWidthGivenData();
}

function drawArticlesWidthGivenData() {
    holdData.header.forEach( elem => {
        createEditArticle(false, elem, true);
    });
}

function drawArticles(e) {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var json = JSON.parse(xmlhttp0.responseText);
            console.log(json);
            json.forEach( (elem) => {
                createEditArticle(false, elem, true);        
            }); 
            addId();
        }
    });
    xmlhttp0.open("GET", "php/save_article.php?getArticle=true");
    xmlhttp0.send(); 
}

document.addEventListener("DOMContentLoaded", drawArticles);
document.addEventListener("DOMContentLoaded", addSaveButton);
document.addEventListener("DOMContentLoaded", drawSmallAddButton);

function addId() {
    var allEditArticles = document.querySelectorAll(".edit_article");
    var countId = 0;
    allEditArticles.forEach( (elem) => {
        elem.setAttribute("id", "editArticle" + countId);
        countId++;
    });
}

function deleteButtonEvent(e) {
    var parentNode = e.currentTarget.parentNode;
    var nextSiblingNode = parentNode.nextSibling;
    
    parentNode.remove();
    nextSiblingNode.remove();
}

function editArticleEvent(e) {
    var parentNodeId = e.currentTarget.parentNode.id;
    var id = "";
    var counter = 11;
    var isNumber = true;
    while (isNumber) {
        if (parentNodeId.charAt(counter)) {
            isNumber = true; 
            id += parentNodeId.charAt(counter);
        } else {
            isNumber = false;
        }
        counter++;
    }
    holdData.currentTarget = id;

    var wrapper = document.getElementById("sites_wrapper");

    var allEditArticles = document.querySelectorAll(".edit_article");
    var count = 0;
    allEditArticles.forEach( (elem) => {
        var textarea = document.querySelector("#" + elem.id + " textarea");
        holdData.header[count] = textarea.value;        
        count++;
    });

    wrapper.textContent = "";    
    drawBackButton();

    var textArea = document.createElement("textarea");
    textArea.setAttribute("id", "article_textarea");
    if (holdData.article[id]) {
        textArea.value = holdData.article[id];
    } 
    wrapper.appendChild(textArea); 
}

function createEditArticle(e, header = "", append = false) {
    var article = document.createElement("article"); 
    article.setAttribute("class", "edit_article");
    var wrapper = document.getElementById("sites_wrapper");
    if (!append) {
        var referenceNode = e.currentTarget;
        wrapper.insertBefore(article, referenceNode);
    } else {
        wrapper.appendChild(article);
    }

    var editButton = document.createElement("button");
    editButton.setAttribute("class", "editButton");
    editButton.innerHTML = "edit article"; 
    article.appendChild(editButton);

    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "headerTextarea");
    textArea.value = header;
    article.appendChild(textArea); 
    
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.innerHTML = "delete"; 
    article.appendChild(deleteButton);

    editButton.addEventListener("click", editArticleEvent);
    deleteButton.addEventListener("click", deleteButtonEvent);

    addId();
    if (!append) {
        drawSmallAddButton(false, true, article);
    } else {
        drawSmallAddButton();
    }
}

function sendData(array) {
    array.forEach( elem => {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/save_article.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp0.send("header=" + elem);
    });
}

function saveButtonEvent(e) {
    var dataArray = [];

    var count = 0;
    var allEditArticles = document.querySelectorAll(".edit_article");
    allEditArticles.forEach( (elem) => {
        var id = elem.id;
        dataArray[count] = document.querySelector("#" + id + " textarea").value; 
        count++;
    });

    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
            sendData(dataArray);
        }
    });
    xmlhttp0.open('GET', "php/save_article.php?reset=true", true);
    xmlhttp0.send();  
}      
