import Map from "./map.js";
import Collision from "./collision.js"; 
import Player from "./player.js";
import Battlezone from "./battlezone.js";

//! song

const mapsong = new Audio("../music/map.mp3");
const battleSong = new Audio("../music/Boss_Intro.wav");

// ! variables globales pour sette la position de debut du joueur et l'offset des collisions
window.backgroundX = -205;
window.backgroundY = -200;

const canvas = document.querySelector('canvas');    // Get the canvas element  from html 


// ! ensemble des variables qui seront utilisées pour le jeu
// on cree unjeu 2D du coup le contexte sera en 2d si vous travaillez avec 3d met 3D
const context = canvas.getContext('2d');       

// on definit la taille du canvas
canvas.width = window.innerWidth - 15;        
// canvas.height = 576
canvas.height = window.innerHeight - 15;


const backgroundMap = new Image();
backgroundMap.src ='../image/GameMapbackground.png'

const playerDown = new Image();
playerDown.src ='../image/playerDown.png'

const playerUp = new Image();
playerUp.src ='../image/playerUp.png'

const playerRight = new Image();
playerRight.src ='../image/playerRight.png'

const playerLeft = new Image();
playerLeft.src ='../image/playerLeft.png'

const foregroundMaps = new Image();
foregroundMaps.src ='../image/GameMapforeground.png'

const battleMaps = new Image();
battleMaps.src = '../image/battleBackground.png'

const ennemy1 = new Image();
ennemy1.src = ' ../image/draggleSprite.png'

const ennemy2 = new Image();
ennemy2.src = ' ../image/embySprite.png'

const keys = {
    ArrowLeft: false, 
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false
}

//! variable fin ------------------------------------------------------------------







const background = new Map({position:{x: window.backgroundX ,y: window.backgroundY},image:backgroundMap})
const foreground = new Map({position:{x: window.backgroundX ,y: window.backgroundY},image:foregroundMaps})
const player1 = new Player({image:playerDown, position:{x: 250 ,y: 330}, frame:{val:0, slowness:0}})
const ennemy1_Battle = new Player({image:ennemy1, position:{x: canvas.width - 270 ,y: canvas.height-563}, frame:{val:0, slowness:0}})
const ennemy2_battle = new Player({image:ennemy2, position:{x: 270 ,y: 390}, frame:{val:0, slowness:0}})
// const combatter = new Map({position:{x: 0 ,y: 0},image:battleMaps})
// const testboundary = new Collision({position:{x: 400 ,y: 400}})

const collisionDetected = Collision.collisionDetection();
const BattleDetected = Battlezone.BattleDetection();

function battle_Initialisation(){
    document.querySelector('#information_display').style.display = 'block';
    document.querySelector('#combat').style.color = 'black';
    document.querySelector('#gifle').style.width = '90%';
    ennemy1_Battle.draw(context);
    ennemy1_Battle.playermoving = true;
}


//* ici on cree un tableau pour deplacer tous les elemnts necessaires en meme temps
//* check comment on a recuperer tous les elements de collisiondetected
//*check qu'on loop et repasse dans tous les elements de la fonction animation àl'infini
const moving = [background, ...collisionDetected, foreground, ...BattleDetected]
console.log(moving)

function animation() {
    document.querySelector('#combat').style.color = 'black';
    document.querySelector('#information_display').style.display = 'none';
    mapsong.play();
    mapsong.loop = true;
    var ismoving = true;
    var initiated = false;
    const Animation = window.requestAnimationFrame(animation);

    background.draw(context);
    player1.draw(context);
    foreground.draw(context);
    collisionDetected.forEach(collision => { collision.draw(context) });
    BattleDetected.forEach(battle => { battle.draw(context)});
    player1.playermoving = false;
    
    //* zone pour initier un combat
    if(keys.ArrowLeft || keys.ArrowUp || keys.ArrowRight ||keys.ArrowDown){

        for(let i =0; i<BattleDetected.length; i++){
            if(Battlezone.BattleWithPlayer(player1,BattleDetected[i])){
                console.log('battle')
                initiated = true;
                window.cancelAnimationFrame(Animation);
                
                gsap.fromTo(
                    "#combat", 
                    { 
                        opacity: 1,
                        },
                        { 
                        duration: 1,
                        opacity: 0,
                        repeat: 2,
                        onComplete: function(){
                                mapsong.pause();
                                gsap.fromTo("#combat", {opacity: 1}, 
                                {opacity:0, yoyo:true, onComplete: function(){battle_Initialisation(); battle_animation()}})

                            // Code à exécuter une fois l'animation terminée, si nécessaire
                        
                        }}
                    );
                break;
            }
        }
    }
    // quand une battle est initié, on n'executera pas le reste du code
    if(initiated){
        console.log('battle initiated')
        return;
    }

    if (keys.ArrowLeft) {
        player1.playermoving = true;
        player1.image = playerLeft;
        for (let i = 0; i < collisionDetected.length; i++) {
            // const collisionIsdetected = collisionDetected[i]
            // on cree une copie virtuelle de la collison pour anticiper si on se bloque ou pas
            // car si on touche la collision réelle, on aura un soft lock car la detection se fait en continue 
            if (Collision.collisionWithPlayer(player1, {...collisionDetected[i], position: {x: collisionDetected[i].position.x + 5, y: collisionDetected[i].position.y}})) {
                ismoving = false;
                break;
            }
        }
        if (ismoving) {
            moving.forEach(element => { element.position.x += 5 });
        }
    }

    else if (keys.ArrowRight) {
        player1.playermoving = true;
        player1.image = playerRight;
        for (let i = 0; i < collisionDetected.length; i++) {
            if (Collision.collisionWithPlayer(player1, {...collisionDetected[i], position: {x: collisionDetected[i].position.x - 5, y: collisionDetected[i].position.y}})) {
                ismoving = false;
                break;
            }
        }
        if (ismoving) {
            moving.forEach(element => { element.position.x -= 5 });
        }
    }

    else if (keys.ArrowUp) {
        player1.playermoving = true;
        player1.image = playerUp;
        for (let i = 0; i < collisionDetected.length; i++) {
            if (Collision.collisionWithPlayer(player1, {...collisionDetected[i], position: {x: collisionDetected[i].position.x , y: collisionDetected[i].position.y + 5}})) {
                ismoving = false;
                break;
            }
        }
        if (ismoving) {
            moving.forEach(element => { element.position.y += 5 });
        }
        
    }

    else if (keys.ArrowDown) {
        player1.playermoving = true;
        player1.image = playerDown;
        for (let i = 0; i < collisionDetected.length; i++) {
            if (Collision.collisionWithPlayer(player1, {...collisionDetected[i], position: {x: collisionDetected[i].position.x, y: collisionDetected[i].position.y - 5}})){
                ismoving = false;
                break;
            }
        }
        if (ismoving) {
            moving.forEach(element => { element.position.y -= 5 });
        }
    }
}


animation()
let BattleAnimationID;
let playerafterbattleX ;
let playerafterbattleY ;

function battle_animation() {
    battleSong.play();
    battleSong.loop = true;
    playerafterbattleX = player1.position.x ;
    playerafterbattleY = player1.position.y;
    BattleAnimationID= window.requestAnimationFrame(battle_animation);
    console.log('battle animation')
    context.drawImage(battleMaps, 0, 0, canvas.width, canvas.height);
    ennemy1_Battle.draw(context);
    ennemy1_Battle.playermoving = true;
    ennemy2_battle.draw(context);
    ennemy2_battle.playermoving = true;
}



const move = (e) =>{
    
    switch(e.key){
        case 'ArrowLeft':
            keys.ArrowLeft =  true
            console.log('left')
            break;
        case 'ArrowUp':
            keys.ArrowUp =  true
            console.log('up')
            break;
        case 'ArrowDown':
            keys.ArrowDown =  true
            console.log('Down')
            break;
        case 'ArrowRight':
            keys.ArrowRight =  true
            console.log('Right')
            break;
    }
}


document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.innerHTML;
        console.log(choice);
        const end = ennemy2_battle.attack(choice, ennemy1_Battle)
        console.log(end)
        if(end === "fin combat"){
            gsap.fromTo( "#combat", { opacity: 0,}, { opacity: 1, color: "white", onComplete:() => {
                cancelAnimationFrame(BattleAnimationID);
                gsap.to("#combat",{opacity: 0})
                document.querySelector('#information_display').style.display = 'none';
                player1.position.x  = playerafterbattleX - 5;
                player1.position.y  = playerafterbattleY - 5;
                battleSong.pause();
                animation()}})
            
        }
        
    });
});

const down = (e) =>{
    
    switch(e.key){
        case 'ArrowLeft':
            keys.ArrowLeft = false
            console.log('left')
            break;
        case 'ArrowUp':
            keys.ArrowUp = false
            console.log('up')
            break;
        case 'ArrowDown':
            keys.ArrowDown = false
            console.log('Down')
            break;
        case 'ArrowRight':
            keys.ArrowRight = false
            console.log('Right')
            break;
    }
}
window.addEventListener('keydown', move)

window.addEventListener('keyup', down)

