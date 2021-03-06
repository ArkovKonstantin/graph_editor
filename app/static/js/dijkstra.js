"use strict";

function division(coord1, coord2, k) {
    let x = (coord1.x + k * coord2.x) / (1 + k);
    let y = (coord1.y + k * coord2.y) / (1 + k);
    return { x, y }
}
// Анимация релаксации ребра
export function drawRelax(progress, par) {
    ctx.lineWidth = 5;
    let coord1 = {x: par.node.x, y: par.node.y};
    let coord2 = {x: par.edge.neighbour.x, y: par.edge.neighbour.y};

    let l = Math.sqrt((coord2.x - coord1.x) ** 2 + (coord2.y - coord1.y) ** 2);
    let m = (l - par.node.radius) / par.node.radius;
    let v2 = division(coord1, coord2, m);
    let v1 = division(coord2, coord1, m);
    let k = (coord2.y - coord1.y) / (coord2.x - coord1.x);
    let b = (coord2.x * coord1.y - coord1.x * coord2.y) / (coord2.x - coord1.x);

    let x = progress * (v2.x - v1.x) + v1.x, y = k * x + b;
    line(v1.x, v1.y, x, y, "#ff8a3d");
    if (progress == 1) {
        par.edge.color = "#ff8a3d"
    }
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
        "block": 1,
        "fun": fade,
        "duration": 200,
        "par": {
            node: node[s],
            rules: [
                {attr: 'borderColor', startColor: [0, 0, 0], finishColor: [231, 144, 72]},
                {attr: 'textColor', startColor: [0, 0, 0], finishColor: [231, 144, 72]}
            ]
        },
        "dist": dist
    }]);
    dist = {};
    while (!isEmpty(unvisited)) {
        current = min(unvisited);
        // Выбор минимальной вершины
        animation_seq.push([{
            "block": 2,
            "fun": fade,
            "duration": 600,
            "par": {
                node: node[current],
                rules: [
                    {attr: 'color', startColor: [240, 240, 240], finishColor: [81, 186, 108]},
                    {attr: 'borderColor', startColor: [231, 144, 72], finishColor: [81, 186, 108]},
                    {attr: 'textColor', startColor: [231, 144, 72], finishColor: [250, 250, 250]}
                ]
            }
        }]);
        if (node[current].edges.length > 0) {
            node[current].edges.forEach(function (edge) {
                let idx = edge.neighbour.idx;

                // Релаксация ребра
                if (unvisited[idx] > unvisited[current] + edge.distance) {
                    unvisited[idx] = unvisited[current] + edge.distance;
                    prev[idx] = current;
                }
                // Анимация релаксации
                if (unvisited[idx]) {
                    dist[idx] = unvisited[idx];
                    animation_seq.push([{
                        "block": 3,
                        "fun": drawRelax,
                        "duration": 1000,
                        "par": {edge: edge, node: node[current]},
                        "dist": dist
                    }, {
                        "block": 3,
                        "fun": fade,
                        "duration": 1000,
                        "par": {
                            node: edge.neighbour,
                            rules: [
                                {attr: 'borderColor', startColor: [0, 0, 0], finishColor: [231, 144, 72]},
                                {attr: 'textColor', startColor: [0, 0, 0], finishColor: [231, 144, 72]}]
                        }
                    }]);
                }
                dist = {};

            });
        }

        visited[current] = unvisited[current];
        delete unvisited[current];
        animation_seq.push([{
            "block": 4,
            "fun": fade,
            "duration": 600,
            "par": {
                node: node[current],
                rules: [
                    {attr: 'color', startColor: [81, 186, 108], finishColor: [231, 144, 72]},
                    {attr: 'borderColor', startColor: [81, 186, 108], finishColor: [231, 144, 72]}
                ]
            }
        }]);

    }
    return {visited, prev, animation_seq}
}

