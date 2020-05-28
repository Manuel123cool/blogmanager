"use strict"
var form = document.getElementById("form");
form.addEventListener("submit", sendData);
var lengthVar = 0;
var replyMode = false;
var reply_reply = false;
var reply_replyLength = 0;
var replyId = null;
var replyReplied = [];

function elemComment(article, comment) {
    var elemComment = document.createElement('p');
    elemComment.innerHTML = comment;
    elemComment.setAttribute('class', 'comment');
    article.appendChild(elemComment);
}

function addElements(article, date, name) {
    var elemName = document.createElement('p');
    elemName.innerHTML = name;
    elemName.setAttribute('class', 'name');
    article.appendChild(elemName);

    var elemDate = document.createElement('p');
    elemDate.innerHTML = date;
    elemDate.setAttribute('class', 'date');
    article.appendChild(elemDate);
}


function addArticle(name, comment, date, index, plusIndex = 0) {
    var wrapper = document.getElementById("comment_wrapper");  
    var article = document.createElement('article');        
    article.setAttribute("class", "normal");
    article.setAttribute("id", "id" + Number(index + plusIndex));
    wrapper.appendChild(article); 

    addElements(article, date, name); 

    var elemReply = document.createElement('a');
    elemReply.innerHTML = "reply";
    elemReply.setAttribute('href', '');
    elemReply.setAttribute('class', 'replyNorm');
    elemReply.setAttribute('id', Number(index + plusIndex));
    article.appendChild(elemReply);

    elemComment(article, comment);
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addReply(name, comment, date, index) {
    replyReplied.push(index - 1);

    var refElem = document.getElementById(String("id" + index));            
    var main = document.getElementById("comment_wrapper");

    var article = document.createElement('article');        
    article.setAttribute('id', 'reply' + Number(reply_replyLength));
    article.setAttribute('class', 'reply1');
    reply_replyLength++;
    main.insertBefore(article ,refElem); 

    var div = document.createElement('div');
    div.setAttribute('id', 'id_div' + index);
    insertAfter(article, div);    

    addElements(article, date, name); 

    var elemReply = document.createElement('a');
    elemReply.innerHTML = "reply";
    elemReply.setAttribute('class', 'reply');
    elemReply.setAttribute('id', 'reply' + index);
    elemReply.setAttribute('href', '');
    article.appendChild(elemReply);

    elemComment(article, comment);
}

function addReply_reply(name, comment, date, index) {
    replyReplied.push(index - 1);

    var article = document.createElement('article');        
    article.setAttribute('class', 'reply2');
    
    var div = document.getElementById('id_div' + index);
    div.appendChild(article);

    addElements(article, date, name); 

    var elemReply = document.createElement('a');
    elemReply.innerHTML = "reply";
    elemReply.setAttribute('class', 'reply_reply');
    elemReply.setAttribute('id', 'reply_reply' + index);
    elemReply.setAttribute('href', '');
    article.appendChild(elemReply);

    elemComment(article, comment);
}

function sendData(e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    var dateObj = new Date();
    var date = dateObj.toDateString(); 
    var reply_num = 0;

    if (replyMode && !reply_reply) {
        addReply(name, comment, date, replyId);
        reply_num = replyId;
    } else if (replyMode && reply_reply) {
        addReply_reply(name, comment, date, replyId);
        reply_num = replyId;
    } else {
        addArticle(name, comment, date, lengthVar);    
        lengthVar++;
    }

    var allLinks = document.querySelectorAll('.reply');
    allLinks.forEach( (elem) => {
        elem.addEventListener("click", reply1);
    });

    var allLinks = document.querySelectorAll('.replyNorm');
    allLinks.forEach( (elem) => {
        elem.addEventListener("click", reply);
    });
 
    var allLinks = document.querySelectorAll('.reply_reply');
    allLinks.forEach( (elem) => {
        elem.addEventListener("click", reply_replyEvent);
    });


    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
        }
    });
    var add_div = '&into_div=' + reply_reply;
    xmlhttp0.open('POST', "php/comment.php", true);
    xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp0.send('name=' + name + '&comment=' + comment +
                        '&date=' + date + '&reply_num=' + reply_num +
                            add_div);    
}

var insert = {
    array: null,
    insertOneComment: function(index, plusIndex) {
       addArticle(this.array[index][0], this.array[index][1], 
                    this.array[index][2], index, plusIndex); 
    },
    insertAllComments: function(plusIndex = 0) {
        var count = 0;
        for (var i = 0; i < this.array.length; ++i) {
            if (this.array[i][3] != 0 && this.array[i][4] == "false") {
                addReply(this.array[i][0], this.array[i][1], 
                    this.array[i][2], Number(this.array[i][3]));
            } else if (this.array[i][4] == 'true') {
                addReply_reply(this.array[i][0], this.array[i][1], 
                    this.array[i][2], Number(this.array[i][3]));
            } else {
                this.insertOneComment(count, plusIndex);
                count++;
            }
        }          
        lengthVar = this.array.length;
    }
}

document.addEventListener('DOMContentLoaded', insertComments);

function insertComments() {
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
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
    xmlhttp0.open('GET', 'php/comment.php?wantData=true&index=0');
    xmlhttp0.send();    
}

function reply(e) {
    e.preventDefault();

    var elemEqualIndex = false;
    replyReplied.forEach( (elem) => {
        if (elem == e.currentTarget.id) {
            elemEqualIndex = true;
        }
    });

    if (!elemEqualIndex) { 
        var elemReplyId = e.currentTarget.id;
        replyMode = true;
        replyId = Number(elemReplyId) + 1;
        reply_reply = false;
    } else {
        replyMode = true;
        reply_reply = true;
        replyId = Number(e.currentTarget.id) + 1;
    } 

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);
}

function reply1(e) {
    e.preventDefault();
    replyMode = true;
    reply_reply = true;
    var elemReplyId = e.currentTarget.id;

    replyId = elemReplyId.charAt(5);
    replyMode = true;

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);
}

function reply_replyEvent(e) {
    e.preventDefault();
    replyMode = true;
    reply_reply = true;
    var elemReplyId = e.currentTarget.id;

    replyId = elemReplyId.charAt(11);
    replyMode = true;

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);

}

function replyCancel(e) {
    e.preventDefault();
    replyMode = false;
    replyId = null;
    reply_reply = false;
    e.currentTarget.innerHTML = "";
}
