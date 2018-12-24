"use strict";
//console.log(document);
//alert(document)
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");

cnv.height = 500;
cnv.width = 500;
//cnv.style.backgroundColor = "#b4b4b4";
cnv.style.backgroundImage = "url(setka.png)";
cnv.style.border = "1px solid black";
//cnv.style.margin = "30px";


ctx.strokeStyle = "red";
ctx.lineWidth = 4;
ctx.font = "16px Comic Sans MS";
ctx.textBaseline="middle";
ctx.textAlign = "center";


const fillArc = function (x, y, r) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.fill();
    ctx.closePath();
}

const strokeArc = function (x, y, r) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.stroke();
    ctx.closePath();
}


let selectedNode = null;

const Node = function (x, y, radius, num){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.num = num;
    this.selected = false;
}

Node.prototype = {
    draw : function(){
        fillArc(this.x, this.y, this.radius);
        ctx.fillStyle = "white";
        ctx.fillText(this.num, this.x, this.y);
    },
    stroke : function(){
        strokeArc(this.x, this.y, this.radius);
    },
    // select : function(){
    //     this.selected = !this.selected;
    // }
}

const isCursorInNode = function(x, y, node){
    if (((x-node.x)**2 + (y-node.y)**2) <= node.radius**2){
        return true;
    }
}

let node = [];


for (let i = 0; i < 5; i++){
    node.push(new Node(50 + (i*60), 50, 20, i+1));
}

//ctx.arc(50, 50, 30, 0, 2*Math.PI, false);
//ctx.fill();

setInterval(function(){
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    for (let i = 0; i < node.length; i++){
        node[i].draw();
        if (node[i].selected){
            node[i].stroke();
        };
    }
}, 30)

window.onmousemove = function(e){
    if (selectedNode){
        selectedNode.x = e.pageX;
        selectedNode.y = e.pageY;
    }
}
window.onmousedown = function(e){
    let x = e.pageX, y = e.pageY;
    for (let i = 0; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){
            node[i].selected = true;
            selectedNode = node[i]
        }
    }
}
window.onmouseup = function(e){
    if (selectedNode){
        selectedNode.selected = false;
        selectedNode = null;
    }
    
}

cnv.onclick = function(e){
    let i = 0;
    let x = e.pageX, y = e.pageY;
    for (; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){
            break;
        }
    }
    if (i == node.length){
        node.push(new Node(x, y, 20, node.length + 1));
    }

}