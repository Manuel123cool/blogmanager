"use strict"

var currentSite2 = -1;

function insertCommentAndLength(siteIndex) {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var length = xmlhttp0.responseText;
            insertComments(siteIndex, length);
        }
    });
    xmlhttp0.open('GET', 'php/comment.php?wantLength=true&site_index=' + (siteIndex + 1));
    xmlhttp0.send();    
}
 
function getLength(site_index) {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            drawIndexes(responseText);
        }
    });
    xmlhttp0.open('GET', 'php/comment.php?wantLength=true&site_index=' + (site_index + 1));
    xmlhttp0.send();    
    currentSite2 = site_index;
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

function indexLinkEvent(e) {
    e.preventDefault();
    var index = e.currentTarget.innerHTML - 1;
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var array = JSON.parse(xmlhttp0.responseText);      
            getPlusIndex(array, index);
        }
    });
    xmlhttp0.open('GET', 'php/comment.php?wantData=true&index=' + index + "&site_index=" +
       (currentSite2 + 1));
    xmlhttp0.send();    
}

function getPlusIndex(array, index) {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var plusIndex = xmlhttp0.responseText;
            var wrapper = document.getElementById("comment_wrapper");
            wrapper.textContent = '';
            insert.array = array;      
            insert.insertAllComments(Number(plusIndex));

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
    xmlhttp0.open('GET', 'php/comment.php?wantIndexPlus=true&indexForPlus=' + 
           index + "&site_index" + (currentSite2 + 1));
    xmlhttp0.send();    
}   

