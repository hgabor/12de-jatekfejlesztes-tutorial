import { Scene } from 'phaser';

export class Game extends Scene
{
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    stars: Phaser.Physics.Arcade.Group;
    gamepad: Phaser.Input.Gamepad.Gamepad | undefined;

    gameOver = false;

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

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'turn',
            frames: [
                { key: 'dude', frame: 4 }
            ],
            frameRate: 20
        })

        this.cursors = this.input.keyboard?.createCursorKeys()!;
        this.gamepad = this.input.gamepad?.getPad(0);

        let score = 0;
        let scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px', color: '#000'
        })

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        this.stars.children.iterate((star: any) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return true;
        })

        this.physics.add.collider(this.stars, platforms);
        
        let collectStar = (player, star) => {
            star.disableBody(true, true);
            score++;

            scoreText.setText(`score: ${score}00`);

            if (this.stars.countActive(true) === 0) {
                this.stars.children.iterate((star1: any) => {
                    star1.enableBody(true, star1.x, 0, true, true);
                    return true;
                })

                let x = (player.x < 400) ?
                    Phaser.Math.Between(400, 800) :
                    Phaser.Math.Between(0, 400);
                
                let bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }

        let hitBomb = (play, bomb) => {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');

            this.gameOver = true;
        }

        this.physics.add.overlap(this.player, this.stars, collectStar);


        let bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(this.player, bombs, hitBomb);
    }

    update(): void {
        if (this.gameOver) return;

        let left = this.cursors.left.isDown || this.gamepad?.left;
        let right = this.cursors.right.isDown || this.gamepad?.right;
        let jump = this.cursors.up.isDown || this.gamepad?.A;

        if (left) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (right) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}
