
const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    backgroundColor: '#ccf2ff',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let bird, fred, cursors;

const game = new Phaser.Game(config);

function preload () {
    this.load.image('bird', 'assets/images/bird.png');
    this.load.image('fred', 'assets/images/fred.png');
    this.load.image('obstacle', 'assets/images/obstacle.png');
}

function create () {
    bird = this.physics.add.sprite(100, 300, 'bird').setScale(0.5);
    fred = this.add.image(bird.x + 10, bird.y + 10, 'fred').setScale(0.3);
    cursors = this.input.keyboard.createCursorKeys();
}

function update () {
    if (cursors.space.isDown) {
        bird.setVelocityY(-250);
    }
    fred.x = bird.x + 10;
    fred.y = bird.y + 10;
}
