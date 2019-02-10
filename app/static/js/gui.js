import {dijkstra} from "./gijkstra.js";
//Global parametrs
let btnRun = document.getElementById("btn_run");
let btnStop = document.getElementById("btn_stop");
let tab = document.getElementsByClassName("tab");
let tabContent = document.getElementsByClassName("tabContent");

const clearPaths = function(){
    node.forEach(function(node){
        node.edges.forEach(function(edge){
            edge.color = "black";
        });
    });
}
btnStop.onclick = clearPaths;

btnRun.onclick = function(){
    console.log(node);
    clearPaths();
    let start_node = 0;
    let end_node = 3;
    let res = dijkstra(node, start_node);
    console.log(res);
    //Отображение кратчайшего пути
    while(end_node != start_node){

        node[res.prev[end_node]].edges.forEach(function(edge){
            let idx = edge.neighbour.num - 1;
            if (idx == end_node){
                edge.color = "#e8534f";
            }
        });
        end_node = res.prev[end_node];
    }
}

window.onload = function(){
    for (let i = 1; i < tabContent.length; i++){
        tabContent[i].classList.add("hide");
    }
}

document.getElementById("tabs").onclick = function(e){
    let target = e.target;
    //console.log(e);
    if (target.className == "tab"){
        for (let i = 0; i<tab.length; i++){
            if (tab[i] == target){
                tab[i].classList.add("whiteborder");
                tabContent[i].classList.remove("hide");
            }
            else{
                tab[i].classList.remove("whiteborder");
                tabContent[i].classList.add("hide");
            }
        }
    }
    
}