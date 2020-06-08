"use strict"

function drawForm() {
    var wrapper = document.getElementById("comment_form_wrapper");
    var headerPar = document.createElement("p");
    headerPar.innerHTML = "Leave a comment: ";
    wrapper.appendChild(headerPar);
    
    var cancelLink = document.createElement("a");
    cancelLink.setAttribute("id", "reply_cancel");
    cancelLink.setAttribute("href", "");
    wrapper.appendChild(cancelLink);

    var form = document.createElement("form");
    form.setAttribute("id", "form"); 
    wrapper.appendChild(form);
    
    var textarea = document.createElement("textarea");
    textarea.setAttribute("name", "comment");
    textarea.setAttribute("id", "comment");
    textarea.setAttribute("rows", "10");
    textarea.setAttribute("cols", "50");
    
    form.appendChild(textarea); 
    var br = document.createElement("br");
    form.appendChild(br); 
    
    var label = document.createElement("label");
    label.setAttribute("for", "name");
    label.innerHTML = "Name:";
    form.appendChild(label);  

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "name");
    input.setAttribute("name", "name");
    input.innerHTML = "Name:";
    form.appendChild(input); 

    var br1 = document.createElement("br");
    form.appendChild(br1); 

    var input1 = document.createElement("input");
    input1.setAttribute("type", "submit");
    input1.setAttribute("value", "Submit");
    form.appendChild(input1); 
}
