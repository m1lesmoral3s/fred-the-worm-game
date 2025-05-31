
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

let bird, cursors, obstacles, scoreText, bubble, bubbleText;
let score = 0;
let frameToggle = true;
const fredLines = [
    "This bird needs a license!",
    "I'm not emotionally prepared for this!",
    "AHH! A balloon!",
    "You better be good at this!",
    "Don't drop me!"
];

const game = new Phaser.Game(config);

function preload () {
    this.load.image('birdfred1', 'birdfred.png');
    this.load.image('birdfred2', 'birdfred2.png');
    this.load.image('obstacle', 'obstacle.png');
}

function create () {
    bird = this.physics.add.sprite(100, 300, 'birdfred1').setScale(0.5);
    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        callback: () => {
            const y = Phaser.Math.Between(100, 540);
            const obstacle = obstacles.create(500, y, 'obstacle');
            obstacle.setVelocityX(-200);
            obstacle.setImmovable(true);
            obstacle.setScale(0.6);
        },
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(bird, obstacles, () => {
        this.physics.pause();
        bird.setTint(0xff0000);
        bubble.setVisible(false);
        bubbleText.setVisible(false);
        scoreText.setText('Game Over!');
    }, null, this);

    scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px',
        fill: '#000'
    });

    bubble = this.add.graphics();
    bubble.fillStyle(0xffffff, 0.9);
    bubble.fillRoundedRect(0, 0, 200, 50, 10);
    bubble.setScrollFactor(0);
    bubble.setVisible(false);

    bubbleText = this.add.text(0, 0, '', {
        fontSize: '14px',
        fill: '#000',
        wordWrap: { width: 180 }
    }).setVisible(false);

    this.time.addEvent({
        delay: 4000,
        callback: () => {
            const line = Phaser.Utils.Array.GetRandom(fredLines);
            bubble.setVisible(true);
            bubble.x = bird.x + 60;
            bubble.y = bird.y - 60;
            bubbleText.setText(line);
            bubbleText.setVisible(true);
            bubbleText.x = bird.x + 70;
            bubbleText.y = bird.y - 55;
            this.time.delayedCall(2500, () => {
                bubble.setVisible(false);
                bubbleText.setVisible(false);
            });
        },
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 250,
        callback: () => {
            frameToggle = !frameToggle;
            bird.setTexture(frameToggle ? 'birdfred1' : 'birdfred2');
        },
        loop: true
    });
}

function update () {
    if (cursors.space.isDown) {
        bird.setVelocityY(-250);
    }

    score += 1;
    scoreText.setText('Score: ' + Math.floor(score / 60));
}
