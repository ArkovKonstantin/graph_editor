"use strict";
import { dijkstra, animate, drawRelax, fade } from "./dijkstra.js";
//Global parametrs
// node - массив вершин из редактора
let btnRun = document.getElementById("btn_run");
let btnStop = document.getElementById("btn_stop");
let tab = document.getElementsByClassName("tab");
let tabContent = document.getElementsByClassName("tabContent");
let testBtn = document.getElementById("testBtn");
let startNode = document.getElementById("startNode");
let animation_seq = []; // Последовательность шагов визуализации
testBtn.count = 0;

const clearPaths = function () {
    node.forEach(function (node) {
        node.color = "#f0f0f0";
        node.edges.forEach(function (edge) {
            edge.color = "black";
        });
    });
};

btnStop.onclick = clearPaths;
function fun(c, d) {
    console.log(c + " " + d);
    if (c == d) {
        return
    }
    setTimeout(fun, 2000, ++c, d);
}
testBtn.onclick = function () {
    let animationStep = animation_seq.shift();
    animationStep.forEach(function (frame) {
        // console.log("frame");
        // console.log(frame);
        animate({
            duration: frame.duration,
            timing: function (timeFraction) { // скорость анимации
                return timeFraction;
            },
            draw: frame.fun, // функция, визуализации определенного шага алгоритма
            par: frame.par
        });
        // console.log(frame);
        if (frame.dist) {
            console.log(frame.dist)
            for (let idx in frame.dist) {
                node[idx].dist = frame.dist[idx];
            }
        }
    })


    // let par  = {
    //     node: node[0],
    //     rules: [
    //         { attr: 'borderColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] },
    //         { attr: 'textColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] }
    //     ]
    // };
    // animate({
    //     duration: 100,
    //     timing: function(timeFraction){ // скорость анимации
    //         return timeFraction;
    //     },
    //     draw: fade, // функция, визуализации определенного шага алгоритма
    //     par: par
    // });
    // let par = {edge: node[0].edges[0], node: node[0]}; // параметры для этой функции
    // animate({
    //     duration: 800,
    //     timing: function(timeFraction){ // скорость анимации
    //         return timeFraction;
    //     },
    //     draw: drawRelax, // функция, визуализации определенного шага алгоритма
    //     par: par
    // });    
};

btnRun.onclick = function () {
    //console.log(node);
    clearPaths();
    let log = [];
    // let start_node = Number.parseInt(startNode.value) - 1;
    let start_node = 0;
    let end_node = 3;
    let res = dijkstra(node, start_node);
    animation_seq = res.animation_seq;
    let animationStep = animation_seq.shift();
    animationStep.forEach(function (frame) {
        animate({
            duration: frame.duration,
            timing: function (timeFraction) { // скорость анимации
                return timeFraction;
            },
            draw: frame.fun, // функция, визуализации определенного шага алгоритма
            par: frame.par
        });
        if (frame.dist) {
            for (let idx in frame.dist) {
                node[idx].dist = frame.dist[idx];
            }
        };
    })
    // console.log('res');
    // console.log(res);
    //window.res = res;
    //Отображение кратчайшего пути
    // while(end_node != start_node){

    //     node[res.prev[end_node]].edges.forEach(function(edge){ // {2: 1, 3: 2}
    //         let idx = edge.neighbour.num - 1;
    //         if (idx == end_node){
    //             edge.color = "#e8534f";
    //             log.push(edge.neighbour);
    //         }
    //     });
    //     end_node = res.prev[end_node];
    // }

    // log.push(node[start_node]);
    // window.log = log;
    // window.count = log.length - 1;

}

window.onload = function () {
    for (let i = 1; i < tabContent.length; i++) {
        tabContent[i].classList.add("hide");
    }
}

document.getElementById("tabs").onclick = function (e) {
    let target = e.target;
    //console.log(e);
    if (target.className == "tab") {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i] == target) {
                tab[i].classList.add("whiteborder");
                tabContent[i].classList.remove("hide");
            }
            else {
                tab[i].classList.remove("whiteborder");
                tabContent[i].classList.add("hide");
            }
        }
    }

};
