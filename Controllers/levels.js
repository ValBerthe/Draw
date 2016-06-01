
// Levels for the game
levels = [];

levels[0] = {
    num: 1,
    blocks: [
        {color: "yellow", x:50, y:70, height:5, width:30},
        {color: "yellow", x:50, y:50, height:5, width:30},
    ],
    start: {color:"green", shape: "circle", sensor: true, x:10, y:90, radius:1, vy: -1450, vx: 600},
    finish: {color:"red", shape: "circle", sensor: true, x:90, y:90, radius:1},
    solution: [
        {color: "purple", x:85, y:95, height:3, width:20},
        {color: "purple", x:97, y:85, height:20, width:2},
    ]
};
levels[1] = {
    num: 2,
    blocks: [
        {color: "yellow", sensor: true, x:70, y:35, height: 60, width: 5},
        {color: "yellow", sensor: true, x:50, y:50, height: 10, width: 30}
    ],
    start: {color:"green", shape: "circle", sensor: true, x:8, y:8, radius: 1, vx: 1400},
    finish: {color:"red", shape: "circle", sensor: true, x:92, y:92, radius: 1},
    solution: [
        {color: "purple", x:25, y:50, height:20, width:2},
        {color: "purple", x:35, y:70, height:3, width:20},
        {color: "purple", x:60, y:80, height:3, width:20},
        {color: "purple", x:85, y:97, height:3, width:20},
        {color: "purple", x:97, y:85, height:20, width:2},
    ]
};
levels[2] = {
    num: 3,
    blocks: [
        {color: "yellow", sensor: true, x:25, y:60, height: 50, width: 3},
        {color: "yellow", sensor: true, x:60, y:20, height: 5, width: 30},
        {color: "yellow", sensor: true, x:74, y:10, height: 18, width: 2},
        {color: "yellow", sensor: true, x:42, y:65, height: 50, width: 3},
        {color: "yellow", sensor: true, x:33, y:86.49, height: 7, width: 19},
        {color: "yellow", sensor: true, x:75, y:55, height: 4, width: 35},
    ],
    start: {color:"green", shape: "circle", sensor: true, x:10, y:90, radius: 1, vx: 1600, vy: -2500},
    finish: {color:"red", shape: "circle", sensor: true, x:92, y:92, radius: 1},
    solution: [
        {color: "purple", x:25, y:50, height:20, width:2},
        {color: "purple", x:35, y:70, height:3, width:20},
        {color: "purple", x:60, y:80, height:3, width:20},
        {color: "purple", x:85, y:97, height:3, width:20},
        {color: "purple", x:97, y:85, height:20, width:2},
    ]
};