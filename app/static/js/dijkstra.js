"use strict";
// Анимация релаксации ребра
export function drawRelax(progress, par) {
    ctx.lineWidth = 5;
    let x1 = par.node.x, y1 = par.node.y,
        x2 = par.edge.neighbour.x, y2 = par.edge.neighbour.y;
    //console.log('y '+ y2);
    let k = (y2 - y1) / (x2 - x1);
    let b = (x2 * y1 - x1 * y2) / (x2 - x1);
    let x = progress * Math.abs(x2 - x1) + Math.min(x1, x2), y = k * x + b;
    line(x1, y1, x, y, "#ff8a3d");

    ctx.lineWidth = 2;
}
// Анимация выбора минимального узла
function selectMin(progress, par) {

    par.node.color = "#fff"; //зеленый
    if (progress == 1){
        // Конец анимации
        // вернуть дефолтный
    }
}

// Возпроизведение анимации
export function animate(options) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        // console.log(time + '  time');
        let timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = options.timing(timeFraction);
        options.draw(progress, options.par);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
        else {
            //Конец анимации
            options.par.edge.color = "#ff8a3d";
        }
    });
}

function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

function min(obj) {
    let min = Infinity;
    let minKey = "";
    for (let key in obj) {
        if (obj[key] <= min) {
            min = obj[key];
            minKey = key;
        }
    }
    return minKey
}

export function dijkstra(node, s) {
    let animation_seq = []; // Последовательность анимирующих функций
    console.log('node');
    console.log(node);
    let unvisited = {};
    let visited = {};
    let prev = {};
    let current = null;
    node.forEach(function (el, idx) {
        unvisited[idx] = Infinity;
    });
    unvisited[s] = 0;

    while (!isEmpty(unvisited)) {
        current = min(unvisited);
        //Добавдение кадра анимации
        animation_seq.push({"fun": selectMin, "arg": node[current]});
        if (node[current].edges.length > 0) {
            node[current].edges.forEach(function (edge) {
                let idx = edge.neighbour.num - 1;
                // Добавление кадра анимаци
                let frame = {"fun": NaN, "args": NaN};
                animation_seq.push(frame);
                // Релаксация ребра
                if (unvisited[idx] > unvisited[current] + edge.distance) {
                    unvisited[idx] = unvisited[current] + edge.distance;
                    prev[idx] = current;
                }
            });
        }

        visited[current] = unvisited[current];
        delete unvisited[current];

    }
    console.log(visited, prev);
    return {visited, prev, animation_seq}
}

