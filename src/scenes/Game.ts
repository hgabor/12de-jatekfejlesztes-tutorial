import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('sky', 'sky.png');
        this.load.image('platform', 'platform.png');
        this.load.image('star', 'star.png');
        this.load.image('bomb', 'bomb.png');
        this.load.spritesheet('dude', 'dude.png', {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        let platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');

        let player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);


        /*
        for (let i = -4; i < 5; i++) {
            this.add.image(400 + (i * 30) , 300, 'star');
        }
            */
    }

    update(): void {
        
    }
}
