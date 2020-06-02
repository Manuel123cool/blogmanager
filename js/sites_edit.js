"use strict"

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

    saveButton.addEventListener("click", saveButton);
}

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

function createEditArticle(e) {
    var article = document.createElement("article"); 
    article.setAttribute("class", "edit_article");
    var wrapper = document.getElementById("sites_wrapper");
    var referenceNode = e.currentTarget;
    wrapper.insertBefore(article, referenceNode);

    var editButton = document.createElement("button");
    editButton.setAttribute("class", "editButton");
    editButton.innerHTML = "edit article"; 
    article.appendChild(editButton);

    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "headerTextarea");
    textArea.setAttribute("id", "headerTextareaSave");
    article.appendChild(textArea); 
    
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.innerHTML = "delete"; 
    article.appendChild(deleteButton);

    deleteButton.addEventListener("click", deleteButton);
    addId();
    drawSmallAddButton(false, true, article);
}

