// ==UserScript==
// @name         Chrome Music Lab - Music Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Algorithm to create amazing beats on chrome music lab.
// @author       GSRHackZ
// @license      MIT
// @match        https://musiclab.chromeexperiments.com/Song-Maker/*
// @icon         https://www.google.com/s2/favicons?domain=chromeexperiments.com
// @grant        none
// ==/UserScript==



//------------- Control panel start ----------------|

// ONLY USE THE FEATURES THAT HAVEN'T BEEN COMMENTED Out. COMMENTED OUT FEATURES ARE STILL NOT FUNCTIONABLE.

// These are arrays that show you what your picking based on index. This feature is still not functioning but will be added soon.

//let scaleArr = ["Major","Pentatonic","Chromatic"];
//let startArr1 = ["Low","Middle","High"];
//let startArr2 = ["C","C♯ / D♭","D","D♯ / E♭","E","F","F♯ / G♭","G","G♯ / A♭","A","A♯ / B♭","B","C♯ / D♭"];
//let scale = 0 // pick index out of this scaleArr - still not made
//let start1 = 1; // pick index from startArr1 - still not made
//let start2 = 0; // pick index from startArr2 - still not made

//-----------------------------------

// ONLY CHANGE THESE

let length = 6;
let bpb = 3;
let split = 2;
let range = 5;

//------------- Control panel finish ---------------|

// change nothing below here ---

let add;
if(range==1){
    add = 3;
}
else{
    add = 2;
}

let insturments = document.getElementById("instrument-canvas");
let percussions = document.getElementById("percussion-canvas");
let play = document.getElementById("play-button");
let undo = document.getElementById("undo-button");
let cleaned = false;

function start(){
    if(document.getElementById("grid-container")!==undefined){
        pluginSettings();
        let left = document.getElementById("gamepad-left-button");
        let right = document.getElementById("gamepad-right-button");
        let up = document.getElementById("gamepad-up-button");
        let down = document.getElementById("gamepad-down-button");
        let enter = document.getElementById("gamepad-return-button");
        let uw = length*bpb*split;
        let y = range*7+add;
        cleanSlate(0,left,up,y,uw)
        let wait = setInterval(()=>{
            if(cleaned){
                cleaned = false;
                let cords = batchNewPos(100,uw,y);
                console.log(cords);
                let moves = defineMoves(cords);
                select(moves,left,right,up,down,enter)
                clearInterval(wait);
            }
        },1000)
        return true;
    }
}

smartExec(start,1000);

function batchNewPos(max,uw,y){
    let cords = [];
    for(let i=0;i<max;i++){
        let randType = randNumb(1,2)
        cords.push(newPos(randType,uw,y))
    }
    return cords;
}

function newPos(type,uw,y){
    let yMax,yMin,randY,randX;
    if(type==1){
        yMin = 1;
        yMax = y-2;
    }
    else if(type==2){
        yMin = y-1;
        yMax = y;
    }
    randY = randNumb(yMin,yMax);
    randX = randNumb(0,uw);
    let result = [randX,randY];
    return result;
}


function select(moves,left,right,up,down,enter){
    // moves are in [left,right,up,down] fomrat;
    console.log(moves)
    for(let i=0;i<moves.length;i++){
        manyClicks(left,moves[i][0]);
        manyClicks(right,moves[i][1]);
        manyClicks(up,moves[i][2]);
        manyClicks(down,moves[i][3]);
        setTimeout(()=>{
            enter.click();
        },1000)
    }
}

function manyClicks(btn,max){
    for(let i=0;i<max;i++){
        setTimeout(()=>{
            btn.click();
        },1000)
    }
}

function defineMoves(cords){
    //result is returned in [left,right,up,down] format;
    let moves = [];
    let temp = [0,0,0,0];
    let last = [0,0];
    for(let i=0;i<cords.length;i++){
        let lastX = last[0];
        let lastY = last[1];
        let cordX = cords[i][0];
        let cordY = cords[i][1];
        last = cords[i];
        if(cordX > lastX){ // right;
            let drift = cordX - lastX;
            temp[1]=drift;
        }
        else if(lastX > cordX){ // left
            let drift = lastX - cordX;
            temp[0]=drift;
        }
        if(cordY > lastY){ // down
            let drift = cordY - lastY;
            temp[3]=drift;
        }
        else if(cordY < lastY){ // up
            let drift = lastY - cordY;
            temp[2]=drift;
        }
        moves.push(temp);
        temp=[0,0,0,0];
    }
    return moves;
}


function cleanSlate(type,left,up,y,uw){
    for(let i=0;i<y;i++){
        setTimeout(()=>{
            up.click();
        },100)
    }
    if(type==1){
        for(let i=0;i<uw;i++){
            setTimeout(()=>{
                left.click();
            },100)
        }
    }
    cleaned = true;
    return true;
}

function pluginSettings(){
    let button = document.getElementById("settings-button");
    if(document.getElementsByClassName("expandable modal-content")[0]==undefined){
        button.click();
    }
    let wait = setInterval(()=>{
        if(document.getElementsByClassName("expandable modal-content")[0]!==undefined){
            let length_ = document.getElementById("bars");
            let beats_ = document.getElementById("beats");
            let split_ = document.getElementById("subdivision");
            let range_ = document.getElementById("octaves");
            let submit = document.getElementById("submit");
            length_.value = length;
            beats_.value = bpb;
            split_.value = split;
            range_.value = range;
            console.log("Values have been set.");
            submit.click();
            clearInterval(wait);
        }
    },100)
    }

function smartExec(func,wait){
    let exec = setInterval(()=>{
        if(func()){
            clearInterval(exec)
        }
    },wait)}


function randNumb(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
