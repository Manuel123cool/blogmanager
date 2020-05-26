"use strict"
function getLength() {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            drawIndexes(responseText);
        }
    });
    xmlhttp0.open('GET', 'php/comment.php?wantLength=true');
    xmlhttp0.send();    
}

function drawIndexes(arIndexLength) {
    var index_wrapper = document.getElementById('index_wrapper');
    for (var i = 0; i < arIndexLength; ++i) {
        var indexLink = document.createElement('a');
        indexLink.innerHTML = i + 1;     
        indexLink.setAttribute('href', '');
        index_wrapper.appendChild(indexLink);

        indexLink.addEventListener('click', indexLinkEvent);  
    }
}

document.addEventListener('DOMContentLoaded', getLength);

function deleteAllComments() {

}

function indexLinkEvent(e) {
    e.preventDefault();
    var index = e.currentTarget.innerHTML - 1;
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var wrapper = document.getElementById("comment_wrapper");
            wrapper.textContent = '';
            insert.array = JSON.parse(xmlhttp0.responseText);      
            insert.insertAllComments();

            var allLinks = document.querySelectorAll('.replyNorm');
            allLinks.forEach( (elem) => {
                elem.addEventListener("click", reply);
            });

            var allLinks = document.querySelectorAll('.reply');
            allLinks.forEach( (elem) => {
                elem.addEventListener("click", reply1);
            });

            var allLinks = document.querySelectorAll('.reply_reply');
            allLinks.forEach( (elem) => {
                elem.addEventListener("click", reply_replyEvent);
            });
        }
    });
    xmlhttp0.open('GET', 'php/comment.php?wantData=true&index=' + index);
    xmlhttp0.send();    
}
