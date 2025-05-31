
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

let bird, cursors, obstacles, obstacleTimer, scoreText, bubble, bubbleText;
let score = 0;
let speechTimer;
let frameToggle = true;
let birdfred1, birdfred2;
const fredLines = [
    "This bird needs a license!",
    "You’re doing it! …don’t ruin it.",
    "A puzzle?! I didn’t study!",
    "Watch the cloud! THE CLOUD!",
    "I'm not emotionally prepared for this!"
];

const game = new Phaser.Game(config);

function preload () {
    this.load.image('birdfred1', 'assets/images/birdfred.png');
    this.load.image('birdfred2', 'assets/images/birdfred2.png');
    this.load.image('obstacle', 'assets/images/obstacle.png');
}

function create () {
    bird = this.physics.add.sprite(100, 300, 'birdfred1').setScale(0.5);
    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();
    obstacleTimer = this.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(bird, obstacles, hitObstacle, null, this);

    scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px',
        fill: '#000'
    });

    bubble = this.add.rectangle(bird.x + 100, bird.y - 60, 200, 50, 0xffffff, 0.8)
                     .setStrokeStyle(2, 0x000000)
                     .setVisible(false);
    bubbleText = this.add.text(bird.x + 60, bird.y - 80, '', {
        fontSize: '14px',
        fill: '#000',
        wordWrap: { width: 180 }
    }).setVisible(false);

    speechTimer = this.time.addEvent({
        delay: 4000,
        callback: fredTalks,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 300,
        callback: animateBird,
        callbackScope: this,
        loop: true
    });
}

function animateBird() {
    frameToggle = !frameToggle;
    bird.setTexture(frameToggle ? 'birdfred1' : 'birdfred2');
}

function spawnObstacle () {
    const y = Phaser.Math.Between(100, 540);
    const obstacle = obstacles.create(500, y, 'obstacle');
    obstacle.setVelocityX(-200);
    obstacle.setImmovable(true);
    obstacle.setScale(0.5);
}

function hitObstacle () {
    this.physics.pause();
    bird.setTint(0xff0000);
    bubble.setVisible(false);
    bubbleText.setVisible(false);
    scoreText.setText('Game Over!');
}

function fredTalks() {
    const line = Phaser.Utils.Array.GetRandom(fredLines);
    bubble.setVisible(true);
    bubbleText.setVisible(true);
    bubbleText.setText(line);
    this.time.delayedCall(2500, () => {
        bubble.setVisible(false);
        bubbleText.setVisible(false);
    });
}

function update () {
    if (cursors.space.isDown) {
        bird.setVelocityY(-250);
    }

    bubble.x = bird.x + 100;
    bubble.y = bird.y - 60;
    bubbleText.x = bird.x + 60;
    bubbleText.y = bird.y - 80;

    score += 1;
    scoreText.setText('Score: ' + Math.floor(score / 60));
}
