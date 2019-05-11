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
        }
    })    
};

btnRun.onclick = function () {
    clearPaths();
    let log = [];
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
}

window.onload = function () {
    for (let i = 1; i < tabContent.length; i++) {
        tabContent[i].classList.add("hide");
    }
}

document.getElementById("tabs").onclick = function (e) {
    let target = e.target;
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
