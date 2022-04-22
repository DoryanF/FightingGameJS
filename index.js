const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 700,
        y: 346
    },
    imageSrc: './img/shop.png',
    scale: 1.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/MartialHero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 154
    },
    sprites : {
        idle: {
            imageSrc: './img/MartialHero/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/MartialHero/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/MartialHero/Sprites/Jump.png',
            framesMax: 2
        }
    }
})



const enemy = new Fighter({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    // imageSrc: './img/Martial Hero 2/Sprites/Idle.png',
    // framesMax: 4,
    // scale: 2.5,
    // offset: {
    //     x: 215,
    //     y: 168
    // }
})

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    // enemy.update()
    
    // player mouvements
    // player.image = player.sprites.idle.image
    // console.log(player.image)
    player.velocity.x = 0
    if(keys.q.pressed && player.lastKey === 'q'){
        player.velocity.x = -5
        // player.image = player.sprites.run.image
        console.log(player.image)
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    // console.log(player.sprites.jump.image)
    if (player.velocity.y < 0) {
        player.image = player.sprites.jump.image
        player.framesMax = player.sprites.jump.framesMax
    }

    //enemy mouvements
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //detect colision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking) {
            player.isAttacking = false
            enemy.health -= 20
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking) {
            enemy.isAttacking = false
            player.health -= 20
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // Fin du jeu par la vie

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true  
            player.lastKey = 'd'      
            break;
        case 'q':
            keys.q.pressed = true
            player.lastKey = 'q'       
            break;
        case 'z':
            player.velocity.y = -20        
            break;
        case ' ':
            player.attack()
            break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = true  
            enemy.lastKey = 'ArrowRight'      
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'       
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20        
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false        
            break;
        case 'q':
            keys.q.pressed = false  
            break;
    }

    //Enemy Keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false        
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false  
            break;
    }
})