"use strict"

var commentObj = {
    lengthVar: 0,
    replyMode: false,
    reply_reply: false,
    reply_replyLength: 0,
    replyId: null,
    replyReplied: [],
    arrayOfReplyId: []
};

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
    commentObj.replyReplied.push(index - 1);

    var refElem = document.getElementById(String("id" + index));            
    var main = document.getElementById("comment_wrapper");

    var article = document.createElement('article');        
    article.setAttribute('id', 'reply' + Number(commentObj.reply_replyLength));
    article.setAttribute('class', 'reply1');
    commentObj.reply_replyLength++;
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
    commentObj.replyReplied.push(index - 1);

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

    if (commentObj.replyMode && !commentObj.reply_reply) {
        var replyIdEqual = false;
        commentObj.arrayOfReplyId.forEach( (elem) => {
            if (elem == commentObj.replyId) {
                replyIdEqual = true;
            }
        });
        if (replyIdEqual) {
            addReply_reply(name, comment, date, commentObj.replyId);
            reply_num = commentObj.replyId;
            commentObj.reply_reply = true;
        } else {
            addReply(name, comment, date, commentObj.replyId);
            reply_num = commentObj.replyId;
            commentObj.arrayOfReplyId.push(reply_num);
        }
    } else if (commentObj.replyMode && commentObj.reply_reply) {
        addReply_reply(name, comment, date, commentObj.replyId);
        reply_num = commentObj.replyId;
    } else {
        addArticle(name, comment, date, commentObj.lengthVar);    
        commentObj.lengthVar++;
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
    var add_div = '&into_div=' + commentObj.reply_reply;
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
        commentObj.lengthVar = this.array.length;
    }
}

document.addEventListener('DOMContentLoaded', insertComments);

function insertComments() {
    var form = document.getElementById("form");
    form.addEventListener("submit", sendData);

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
    commentObj.replyReplied.forEach( (elem) => {
        if (elem == e.currentTarget.id) {
            elemEqualIndex = true;
        }
    });

    if (!elemEqualIndex) { 
        var elemReplyId = e.currentTarget.id;
        commentObj.replyMode = true;
        commentObj.replyId = Number(elemReplyId) + 1;
        commentObj.reply_reply = false;
    } else {
        commentObj.replyMode = true;
        commentObj.reply_reply = true;
        commentObj.replyId = Number(e.currentTarget.id) + 1;
    } 

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);
}

function reply1(e) {
    e.preventDefault();
    commentObj.replyMode = true;
    commentObj.reply_reply = true;
    var elemReplyId = e.currentTarget.id;

    commentObj.replyId = elemReplyId.charAt(5);
    var counter = 6;
    var isNumber = true;
    while (isNumber) {
        if (elemReplyId.charAt(counter)) {
            isNumber = true; 
            commentObj.replyId += elemReplyId.charAt(counter);
        } else {
            isNumber = false;
        }
        counter++;
    }
    commentObj.replyMode = true;

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);
}

function reply_replyEvent(e) {
    e.preventDefault();
    commentObj.replyMode = true;
    commentObj.reply_reply = true;
    var elemReplyId = e.currentTarget.id;

    commentObj.replyId = elemReplyId.charAt(11);
    var counter = 12;
    var isNumber = true;
    while (isNumber) {
        if (elemReplyId.charAt(counter)) {
            isNumber = true; 
            commentObj.replyId += elemReplyId.charAt(counter);
        } else {
            isNumber = false;
        }
        counter++;
    }
 
    commentObj.replyMode = true;

    var reply_cancel = document.getElementById('reply_cancel'); 
    reply_cancel.innerHTML = 'cancel reply';
    reply_cancel.addEventListener("click", replyCancel);

}

function replyCancel(e) {
    e.preventDefault();
    commentObj.replyMode = false;
    commentObj.replyId = null;
    commentObj.reply_reply = false;
    e.currentTarget.innerHTML = "";
}
