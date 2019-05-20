"use strict";
import { dijkstra, animate, drawRelax, fade } from "./dijkstra.js";
//Global parametrs
// node - массив вершин из редактора
let btnRun = document.getElementById("btn_run");
let btnStop = document.getElementById("btn_stop");
let tab = document.getElementsByClassName("tab");
let tabContent = document.getElementsByClassName("tabContent");
let testBtn = document.getElementById("testBtn");
let backBtn = document.getElementById("back");
let startNode = document.getElementById("startNode"); startNode.value = 1;
let endNode = document.getElementById("endNode");
let animation_seq = []; // Последовательность шагов визуализации
let blocks = []; // Массив блоков псевдокода
for (let i = 1; i < 5; i++) { blocks[i] = (document.getElementById("block-" + i)) }
testBtn.count = 0;

const clearPaths = function () {
    for (let i = 1; i < 5; i++) {
        blocks[i].style.background = "rgba(214, 88, 117, 0.0)";
    }
    node.forEach(function (node) {
        node.color = "#f0f0f0";
        node.textColor = "#000000";
        node.borderColor = "#000000";
        node.dist = "";
        node.edges.forEach(function (edge) {
            edge.color = "black";
        });
    });
};
backBtn.onclick = function () {
    document.getElementById("redactor").style.display = "block";
    document.getElementById("graph_list").style.display = "none";
}

btnStop.onclick = clearPaths;
function fun(c, d) {
    console.log(c + " " + d);
    if (c == d) {
        return
    }
    setTimeout(fun, 2000, ++c, d);
}
testBtn.onclick = function () {
    for (let i = 1; i < 5; i++) {
        blocks[i].style.background = "rgba(214, 88, 117, 0.0)";
    }
    let animationStep = animation_seq.shift();
    if (animationStep) {
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
            blocks[frame.block].style.background = "rgba(214, 88, 117, 0.4)";
        })
    }
    else {
        // рисуем путь он начальной до конечной вершины
        console.log(window.prev);
        // let end_node = 
        let start_node = Number.parseInt(startNode.value);
        let end_node = Number.parseInt(endNode.value);
        if(!isNaN(end_node) && !isNaN(start_node)) {
            start_node--;
            end_node--;
            while (end_node != start_node) {

                node[window.prev[end_node]].edges.forEach(function (edge) {
                    let idx = edge.neighbour.idx;
                    if (idx == end_node) {
                        edge.color = "red";
                    }
                });
                end_node = window.prev[end_node];
            }
        }
    }
};

btnRun.onclick = function () {
    clearPaths();
    let log = [];
    let start_node = Number.parseInt(startNode.value);
    if (!isNaN(start_node)) {
        start_node--;
        let res = dijkstra(node, start_node);
        window.prev = res.prev;
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
            blocks[frame.block].style.background = "rgba(214, 88, 117, 0.4)";
        })
    }
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
