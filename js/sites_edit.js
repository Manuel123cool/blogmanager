"use strict"

function addId() {
    var allEditArticles = document.querySelectorAll(".edit_article");
    var countId = 0;
    allEditArticles.forEach( (elem) => {
        elem.setAttribute("id", "editArticle" + countId);
        countId++;
    });
}

function drawArticle(header) {
    var article = document.createElement("article"); 
    article.setAttribute("class", "edit_article");
    var wrapper = document.getElementById("sites_wrapper");
    wrapper.appendChild(article);

    var editButton = document.createElement("button");
    editButton.setAttribute("class", "editButton");
    editButton.innerHTML = "edit article"; 
    article.appendChild(editButton);

    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "headerTextarea");
    textArea.setAttribute("id", "headerTextareaSave");
    textArea.innerHTML = header;
    article.appendChild(textArea); 
    
    var saveButton = document.createElement("button");
    saveButton.setAttribute("class", "saveButton");
    saveButton.innerHTML = "save"; 
    article.appendChild(saveButton);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.innerHTML = "delete"; 
    article.appendChild(deleteButton);
    deleteButton.addEventListener("click", deleteArticle);
    saveButton.addEventListener("click", saveArticle); 
}

function deleteArticle(e) {
    var parentNode = e.currentTarget.parentNode; 
    var parentId = parentNode.id;
    
    var counter = 11;
    var isNumber = true;
    var numberId = "";
    while (isNumber) {
        if (parentId.charAt(counter)) {
            isNumber = true; 
            numberId += parentId.charAt(counter); 
        } else {
            isNumber = false;
        }
        counter++;
    }

    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
        }
    });
    xmlhttp0.open('GET', "php/save_article.php?delete=true&index=" + numberId, true);
    xmlhttp0.send();    

    parentNode.remove();
    addId();
}

function addHeaderEvent(e) {
    var header = document.getElementById("headerTextarea").value;
    drawArticle(header);
    addId();
}

function saveArticle(e) {
    var parentId = e.currentTarget.parentNode.id; 
    var header = document.querySelector("#" + parentId + " textarea").value; 
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
        }
    });
    xmlhttp0.open('POST', "php/save_article.php", true);
    xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp0.send("header=" + header);    
}

function addAddButton(article) {
    var addButton = document.createElement("button");
    addButton.setAttribute("class", "addbutton");
    addButton.innerHTML = "add article"; 
    article.appendChild(addButton);
    
    addButton.addEventListener("click", addHeaderEvent);
}

function addHeaderTextarea(article) {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "headerTextarea");
    textArea.setAttribute("id", "headerTextarea");
    article.appendChild(textArea); 
}

function makeEditArticle() {
    var wrapper = document.getElementById("sites_wrapper");
    var editArticle = document.createElement("article");
    editArticle.setAttribute("id", "article1");
    wrapper.appendChild(editArticle);
    return editArticle;
}

function addOneEditBlock() {
    var editArticle = makeEditArticle();
    addAddButton(editArticle); 
    addHeaderTextarea(editArticle);

    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var json = JSON.parse(xmlhttp0.responseText);
            console.log(json);
            json.forEach( (elem) => {
                drawArticle(elem);
            }); 
            addId();
        }
    });
    xmlhttp0.open("GET", "php/save_article.php?getArticle=true");
    xmlhttp0.send(); 
}

document.addEventListener('DOMContentLoaded', addOneEditBlock);
