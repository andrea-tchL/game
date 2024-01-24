//frame, c'est juste pour dire à l'animation de se faire à partir de la frame 0

export default class Player{
    constructor({image,position,frame}){
        this.image = image;
        this.position = position;
        //parce que le constructeur est appelé à l'exterieur de functionanimation
        // du coup tu dois unload l'image afin de recuperer la largeur et la hauteur
        this.frame = frame;
        this.image.onload = () => {
        this.width = this.image.width/4;
        this.height = this.image.height;
        this.playermoving = false;
        this.opacity =1;
        }
        
    }

    // on divise par 4 car c'est le nombre maximal de frame dans notre image
    // c'est à dire le nombre maximum de mouvement different que peut realiser notre joueur

    draw(context){
        context.save();
        context.globalAlpha = this.opacity;
        context.drawImage(this.image,    // image
        this.frame.val *  this.width,                       // position x de l'image (debut du crop)
        0,                       // position y de l'image (debut du crop)
        this.image.width/4,          // largeur de l'image
        this.image.height,           // hauteur de l'image  //ces 4 parametres ci-dessus sont utilisés pour crop l'image
        this.position.x,                     // position x sur le canvas
        this.position.y,                     // position y sur le canvas
        this.image.width/4,          // largeur de l'image sur le canvas
        this.image.height)           // hauteur de l'image sur le canvas
        
        context.restore();
        if(this.playermoving){

        if(this.frame.val>= 0){
            this.frame.slowness ++
        }

        if(this.frame.slowness % 5 === 0){
            if(this.frame.val < 3){
                this.frame.val++;
            }
            else{
                this.frame.val = 0;
            }
        }
    }
    }

    attack  (attack, adversaire)  {

        var gifleElement = document.getElementById("gifle");
        var currentWidth = parseFloat(gifleElement.style.width);
        var newWidth;





        if(attack === "gifle celeste"){

            newWidth = currentWidth  - 40;
            console.log(newWidth)
            gifleElement.style.width = newWidth + "%";
            if(newWidth <= 10){ 
                gifleElement.style.width = 0 + "%";
                return "fin combat";
            }
        }
        if(attack === "prout ancestrale"){
            
            newWidth = currentWidth - 20;
            console.log(newWidth)
            gifleElement.style.width = newWidth + "%";
            if( Math.abs(newWidth) <= 10){ 
                gifleElement.style.width = 0 + "%";
                return "fin combat";
            }
        }


        
        const t = gsap.timeline();
        t.to(this.position, { x: this.position.x - 20 })
            .to(this.position, {
                x: this.position.x + 40,
                duration: 0.01,
                onComplete() {
                    gsap.fromTo(adversaire.position,
                        {
                            x: adversaire.position.x + 40,
                            duration: 0.01,
                        },
                        { x: adversaire.position.x - 40 }
                    );
    
                    gsap.fromTo(adversaire, 
                        {
                            opacity: 0,
                            duration: 0.03
                        },
                        { opacity: 1 }
                    );
                }
            })
            .to(this.position, { x: this.position.x - 20 });

    }
    





}