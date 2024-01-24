import collisionData from "../data/collisionData.js";

export default class Collision{
    static width = 43.56;
    static height= 43.56;
    constructor({position}){

        this.position = position;

        // dans tileMap, collision = 12px x 12px à 100% so à 365% zoom on aura collision = 
        this.width = 43.56;
        this.height= 43.56;
    }

    draw(contexte){
        contexte.fillStyle = "rgba(255, 0, 0, 0)";
        contexte.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    //transforemr collision array  en tableau 2D
    // 70 car cela correspond à la largeur de notre tile map
    static collisionDetection() {
        const collisionMap = [];
        for (let i = 0; i < collisionData.length; i += 70) {
            collisionMap.push(collisionData.slice(i, 70 + i))
        }
    
    
        const collisionDetected = [];
    
        collisionMap.forEach((ligne, indexligne) => {
            ligne.forEach((colonne, indexColonne) => {
                if (colonne === 2097) {
                    collisionDetected.push(new Collision({
                            // on multiplie par la largeur et hauteur de la collision pour avoir la position exacte sur le canvas
                            // genre si la collision es à la ligne (y) = 1 et colonne (x) = 1 alors sur le canvas tu seras 
                            // à la position (x) = 43.56px et (y) = 43.56px
                            // sur le canvas, nous ne sommes pas aux coordonnées (0,0) du coup il faut appliquer un ofset
                            // qui est la position du background sur chaque colision
                        position: {
                            x:( indexColonne * Collision.width ) + window.backgroundX,
                            y:( indexligne * Collision.height )  + window.backgroundY  
                        }
                    }));
                }
            });
        });
    
        return collisionDetected;
    }

    static collisionWithPlayer(player,collision){
        return((player.position.x + player.width) >= collision.position.x 
        && player.position.x  <= (collision.position.x + collision.width)
        && (player.position.y + player.height) >= collision.position.y
        && player.position.y <= (collision.position.y + collision.height))
    }
    
}
