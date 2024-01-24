export default class Map{
    constructor({position,image}){
        this.position = position;
        this.image = image;
    }

    draw(contexte){
        contexte.drawImage(this.image, this.position.x, this.position.y);
    }

}

