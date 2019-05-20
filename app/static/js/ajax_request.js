"use strict";
function save_graph() {

    let graph = { "nodes": [], "edges": {} }
    for (let n = 0; n < node.length; n++){
        let obj = Object.assign({}, node[n]);
        obj.edges = null;
        graph["nodes"].push(obj);
        let arr = [];
        for (let j = 0; j < node[n].edges.length; j++){
            arr.push([node[n].edges[j].neighbour.idx, node[n].edges[j].distance])
        }
        graph["edges"][node[n].idx] = arr;

    }
    // console.log(graph);
    graph = JSON.stringify(graph);
    let graph_title = prompt("Enter the title of the graph")

    $.ajax({
        type: "POST",
        url: "/save",
        data: { "graph": graph, "graph_title": graph_title },
        type: 'POST',
        success: function (response) {

        },
        error: function (error) {
            console.log(error);
        }
    });
}
function upload(e) {
    let g_title = document.getElementById(e.target.id).bind_title;
    let g_body = window.g_lst[g_title]

    let res = JSON.parse(g_body);
    // console.log(res);
    let u_nodes = res["nodes"];
    let u_edges = res["edges"];
    node = []
    // restore vertexs
    for (let i = 0; i < u_nodes.length; i++) {
        node.push(new Node(u_nodes[i].x, u_nodes[i].y, u_nodes[i].radius, u_nodes[i].name, u_nodes[i].idx));
    }
    // restore edges
    for (let i in u_edges) {
        //node[i]
        for (let j = 0; j < u_edges[i].length; j++) {
            let n_idx = u_edges[i][j][0];
            let dist = u_edges[i][j][1];
            node[i].edges.push(new Edge(node[n_idx], dist))
        }
    }
    document.getElementById("redactor").style.display = "block";
    document.getElementById("graph_list").style.display = "none";

}

function del(e) {
    let g_title = document.getElementById(e.target.id).bind_title;
    document.getElementById("li" + g_title).remove();

    $.ajax({
        type: "POST",
        url: "/del",
        data: { "graph_title": g_title },
        type: 'POST',
        success: function (response) {

        },
        error: function (error) {
            console.log(error);
        }
    });

}

function open_graph_list() {
    document.getElementById("redactor").style.display = "none";
    document.getElementById("graph_list").style.display = "block";

    $.ajax({
        type: "POST",
        url: "/get_graph_lst",
        data: {},
        type: 'POST',
        success: function (response) {
            let res = JSON.parse(response)
            // console.log(res);
            window.g_lst = res // сохраняю глобально
            // console.log(res)
            let g_lst = document.getElementById("g_lst");
            g_lst.innerHTML = "";
            for (let key in res) {

                let newLi = document.createElement('li');
                newLi.id = "li" + key;
                let u_id = "u" + key, d_id = "d" + key;
                newLi.innerHTML = key + ' <a id = ' + u_id + ' href="#">Upload</a> <a id=' + d_id + ' href="#">Delete</a>';


                g_lst.appendChild(newLi);

                document.getElementById(u_id).onclick = upload;
                document.getElementById(u_id).bind_title = key;
                document.getElementById(d_id).onclick = del;
                document.getElementById(d_id).bind_title = key;

            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

document.getElementById("open").onclick = open_graph_list;
document.getElementById("save").onclick = save_graph;
