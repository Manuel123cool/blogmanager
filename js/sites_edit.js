"use strict"

function addHeaderEvent(e) {
    var deleteElem = document.getElementById("article1"); 
    deleteElem.textContent = '';
    
    var editButton = document.createElement("button");
    editButton.setAttribute("class", "editButton");
    editButton.innerHTML = "edit article"; 
    deleteElem.appendChild(editButton);
    
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "headerTextarea");
    deleteElem.appendChild(textArea); 
    
    var saveButton = document.createElement("button");
    saveButton.setAttribute("class", "saveButton");
    saveButton.innerHTML = "save"; 
    deleteElem.appendChild(saveButton);
    
    saveButton.addEventListener("click", saveArticle); 
}

function saveArticle() {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
        }
    });
    xmlhttp0.open('POST', "php/save_article.php", true);
    xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp0.send();    
}
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
}

document.addEventListener('DOMContentLoaded', addOneEditBlock);
