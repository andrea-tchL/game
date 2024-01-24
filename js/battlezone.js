import BattleData from "../data/BattleData.js";

export default class Battlezone{

    constructor({position}){

        this.position = position;

        // dans tileMap, collision = 12px x 12px à 100% so à 365% zoom on aura collision = 
        this.width = 43.56;
        this.height= 43.56;
    }

    // methode dynamique
    draw(contexte){
        contexte.fillStyle = "rgba(255, 0, 0, 0)";
        contexte.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    //transforemr collision array  en tableau 2D
    // 70 car cela correspond à la largeur de notre tile map
    //methode static
    static BattleDetection() {
        const BattleDataMap = [];
        for (let i = 0; i < BattleData.length; i += 70) {
            BattleDataMap.push(BattleData.slice(i, 70 + i))
        }
    
        console.log(BattleDataMap);
    
        const zonedetected = [];
    
        BattleDataMap.forEach((ligne, indexligne) => {
            ligne.forEach((colonne, indexColonne) => {
                if (colonne === 2097) {
                    zonedetected.push(new Battlezone({
                            // on multiplie par la largeur et hauteur de la collision pour avoir la position exacte sur le canvas
                            // genre si la collision es à la ligne (y) = 1 et colonne (x) = 1 alors sur le canvas tu seras 
                            // à la position (x) = 43.56px et (y) = 43.56px
                            // sur le canvas, nous ne sommes pas aux coordonnées (0,0) du coup il faut appliquer un ofset
                            // qui est la position du background sur chaque colision
                        position: {
                            x:( indexColonne * 43.56) + window.backgroundX,
                            y:( indexligne * 43.56 )  + window.backgroundY  
                        }
                    }));
                }
            });
        });
    
        return zonedetected;
    }

    static BattleWithPlayer(player,battle){
        return((player.position.x + player.width) >= battle.position.x 
        && player.position.x  <= (battle.position.x + battle.width)
        && (player.position.y + player.height) >= battle.position.y
        && player.position.y <= (battle.position.y + battle.height))
    }

}