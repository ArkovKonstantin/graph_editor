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
    if (progress == 1) { par.edge.color = "#ff8a3d" }
    ctx.lineWidth = 2;
}
// Анимация выбора узла
// par = {node, rules:[{attr, startColor, finishColor}, {...}]}
export function fade(progress, par) {
    par.rules.forEach(function (rule) {
        let curColor = 'rgb(';
        for (let i = 0; i < rule.startColor.length; i++) {
            let delta = Math.floor((rule.finishColor[i] - rule.startColor[i]) * progress);
            delta = rule.startColor[i] + delta;
            curColor += delta;
            curColor += (i != rule.startColor.length - 1) ? ',' : ')';
        }
        par.node[rule.attr] = curColor;
    })
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
    // console.log('node');
    // console.log(node);
    let unvisited = {};
    let dist = {};
    let visited = {};
    let prev = {};
    let current = null;
    node.forEach(function (el, idx) {
        unvisited[idx] = Infinity;
        dist[idx] = "Inf";

    });
    unvisited[s] = 0;
    dist[s] = "0";
    // Анимация инициализации
    animation_seq.push([{
        "fun": fade,
        "duration": 200,
        "par": {
            node: node[s],
            rules: [
                { attr: 'borderColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] },
                { attr: 'textColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] }
            ]
        },
        "dist": dist
    }]);
    dist = {};
    while (!isEmpty(unvisited)) {
        current = min(unvisited);
        // Выбор минимальной вершины
        animation_seq.push([{
            "fun": fade,
            "duration": 600,
            "par": {
                node: node[current],
                rules: [
                    { attr: 'color', startColor: [240, 240, 240], finishColor: [81, 186, 108] },
                    { attr: 'borderColor', startColor: [231, 144, 72], finishColor: [81, 186, 108] },
                    { attr: 'textColor', startColor: [231, 144, 72], finishColor: [250, 250, 250] }
                ]
            }
        }]);
        if (node[current].edges.length > 0) {
            node[current].edges.forEach(function (edge) {
                let idx = edge.neighbour.num - 1;

                // Релаксация ребра
                if (unvisited[idx] > unvisited[current] + edge.distance) {
                    unvisited[idx] = unvisited[current] + edge.distance;
                    prev[idx] = current;
                }
                // Анимация релаксации
                if (unvisited[idx]) { dist[idx] = unvisited[idx] };
                animation_seq.push([{
                    "fun": drawRelax,
                    "duration": 1000,
                    "par": { edge: edge, node: node[current] },
                    "dist": dist
                }, {
                    "fun": fade,
                    "duration": 1000,
                    "par": {
                        node: edge.neighbour,
                        rules: [
                            { attr: 'borderColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] },
                            { attr: 'textColor', startColor: [0, 0, 0], finishColor: [231, 144, 72] }]
                    }
                }])
                dist = {};

            });
        }

        visited[current] = unvisited[current];
        delete unvisited[current];
        animation_seq.push([{
            "fun": fade,
            "duration": 600,
            "par": {
                node: node[current],
                rules: [
                    { attr: 'color', startColor: [81, 186, 108], finishColor: [231, 144, 72] },
                    { attr: 'borderColor', startColor: [81, 186, 108], finishColor: [231, 144, 72] }
                ]
            }
        }]);

    }
    // console.log(visited, prev);
    return { visited, prev, animation_seq }
}

