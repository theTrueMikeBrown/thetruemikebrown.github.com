import Player from './player.js'
import Boss from './boss.js'
import Bullet from './bullet.js'
import Enemy from './enemy.js'
import PowerUp from './powerup.js'
import Explosion from './explosion.js'
import Missile from './missile.js'
import Songs from './songs.js'
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');
const shootSound = document.getElementById('shootSound');
const explosionSound = document.getElementById('explosionSound');
const bgImage = document.getElementById('bgImage');

function start() {
  let scale = 1;
  function resizeCanvas() {
    const baseWidth = 1000;
    const baseHeight = 480;
    scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function playSong(groupName, index) {
    let group = Songs[groupName]
    bgMusic.src = `sounds/${group[index % group.length]}`;
    bgMusic.play();
  }
  playSong("Screens", 0)

  canvas.style.imageRendering = 'pixelated';

  shootSound.volume = 0.4;
  explosionSound.volume = 0.4;
  
  let gameState = 'title';
  let bgX = 0;
  
  const player = new Player(50, canvas.height / scale / 2 - 5);
  const bullets = [];
  const missiles = [];
  const enemies = [];
  const powerUps = [];
  const explosions = [];
  let boss = null;
  let bossSpawned = false;
  let level = 1;
  let keys = {};
  let frame = 0;
  let score = 0;
  
  function clearLevel() {
    player.reset();
    bossSpawned = false;
    boss = null;
    bullets.length = 0;
    enemies.length = 0;
    missiles.length = 0;
    powerUps.length = 0;
    explosions.length = 0;
  }

  function lose() {
    gameState = 'gameOver'
    playSong('Screens', 2);
  }

  function spawnEnemy() {
    const y = Math.random() * (canvas.height / scale - 20);
    enemies.push(new Enemy(canvas.width / scale, y));
  }
  
  function spawnPowerUp() {
    const y = Math.random() * (canvas.height / scale - 20);
    const type = Math.random() < 0.5 ? 'powerUpShot' : 'health';
    powerUps.push(new PowerUp(canvas.width / scale, y, type));
  }
  
  function drawUI() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Health: ' + player.health, 10, 30);
    ctx.fillText('Lives: ' + player.lives, 10, 55);
    ctx.fillText('Score: ' + score, 10, 80);
    ctx.fillText('Level: ' + level, 10, 105);
    ctx.fillText('Shot Power: ' + player.shotPower, 10, 130);
  }

  let bgWidth = bgImage.width
  let bgHeight = bgImage.height
  if (bgWidth < canvas.width / scale) {
    bgHeight = (canvas.width / scale / bgWidth) * bgHeight
    bgWidth = canvas.width / scale
  }
  if (bgHeight < canvas.height / scale) {
    bgWidth = (canvas.height / scale / bgHeight) * bgWidth
    bgHeight = canvas.height / scale
  }

  function drawBackground() {
    bgX -= 1;
    if (bgX <= -bgWidth) bgX = 0;

    ctx.drawImage(bgImage, bgX, 0, bgWidth, bgHeight);
    ctx.drawImage(bgImage, bgX + bgWidth, 0, bgWidth, bgHeight);
  }
  
  function drawTitleScreen() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Space', canvas.width / 2 / scale - 50, canvas.height / 2 / scale - 20);
    ctx.fillStyle = 'green';
    ctx.fillText('Blast', canvas.width / 2 / scale + 50, canvas.height / 2 / scale - 20);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to Start', canvas.width / 2 / scale, canvas.height / 2 / scale + 20);
  }

  function drawLevelCompleteScreen() {
    ctx.fillStyle = 'lime';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level} Complete!`, canvas.width / 2 / scale, canvas.height / 2 / scale - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to Continue', canvas.width / 2 / scale, canvas.height / 2 / scale + 20);
  }

  function drawGameOverScreen() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2 / scale, canvas.height / 2 / scale - 20);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press SPACE to Restart', canvas.width / 2 / scale, canvas.height / 2 / scale + 20);
  }

  function handleInput() {
    player.dy = 0;
    player.dx = 0;
    player.action = "";    
    if (keys[' ']) {
      if (player.shotCooldown <= 0) {
        player.action = "shoot"      
        player.shotCooldown += player.shotBaseCooldown;

        if (player.shotPower >= 1) {
          bullets.push(new Bullet(player.x + player.width - 6, player.y + player.height / 2 - 2, 7, 0));
        }
        if (player.shotPower >= 2) {
          bullets.push(new Bullet(player.x + player.width - 6, player.y + player.height / 2 - 2, 7, -3));
        }
        if (player.shotPower >= 3) {
          bullets.push(new Bullet(player.x + player.width - 6, player.y + player.height / 2 - 2, 7, 3));
        }
        if (player.shotPower >= 4) {
          bullets.push(new Bullet(player.x + player.width, player.y + player.height / 2 - 2, 7, 0));
        }
        if (player.shotPower >= 5) {
          bullets.push(new Bullet(player.x + player.width - 3, player.y + player.height / 2 - 2, 5, -5));
        }
        if (player.shotPower >= 6) {
          bullets.push(new Bullet(player.x + player.width - 3, player.y + player.height / 2 - 2, 5, 5));
        }
        if (player.shotPower >= 7) {
          bullets.push(new Bullet(player.x + player.width + 6, player.y + player.height / 2 - 2, -7, 0));
        }
        if (player.shotPower >= 8) {~
          bullets.push(new Bullet(player.x + player.width / 2, player.y, 0, 7));
        }
        if (player.shotPower >= 9) {
          bullets.push(new Bullet(player.x + player.width / 2, player.y, 0, -7));
        }
        if (player.shotPower >= 10) {
          bullets.push(new Bullet(player.x + player.width - 12, player.y + player.height / 2 - 2, 7, 0));
        }

        shootSound.currentTime = 0;
        shootSound.play();
      }
    }
    if (keys['ArrowUp']) player.dy = -player.speed;
    if (keys['ArrowDown']) player.dy = player.speed;
    if (keys['ArrowLeft']) player.dx = -player.speed;
    if (keys['ArrowRight']) {      
      player.action += "move";
      player.dx = player.speed;
    }
  }
  
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    ctx.imageSmoothingEnabled = false

    if (gameState === 'title') {
      drawBackground();
      drawTitleScreen();
      return;
    }

    if (gameState === 'levelComplete') {
      drawBackground();
      drawLevelCompleteScreen();
      return;
    }

    if (gameState === 'gameOver') {
      drawBackground();
      drawGameOverScreen();
      return;
    }

    drawBackground();

    handleInput();
  
    player.update(canvas, ctx);

    for (let i = explosions.length - 1; i >= 0; i--) {
      explosions[i].draw(ctx);
      if (explosions[i].finished) explosions.splice(i, 1);
    }

    drawUI();
  
    bullets.forEach((bullet, index) => {
      bullet.update(ctx);
      if (bullet.x > canvas.width / scale || bullet.y > canvas.height / scale || bullet.y < 0) bullets.splice(index, 1);
    });
  
    missiles.forEach((missile, index) => {
      missile.update(ctx, player);
      if (missile.juice <= 0) {
        explosions.push(new Explosion(missile.x + missile.width / 2, missile.y + missile.height / 2))
        missiles.splice(index, 1);
      }
      if (
        missile.x < player.x + player.width &&
        missile.x + missile.width > player.x &&
        missile.y < player.y + player.height &&
        missile.y + missile.height > player.y
      ) {
        missiles.splice(index, 1);
        explosions.push(new Explosion(missile.x + missile.width / 2, missile.y + missile.height / 2))
        
        player.health -= 3;
        
        if (player.health <= 0) {
          player.lives--;
          if (player.lives <= 0) {
            lose()
          } else {
            player.die()
          }
        }
      }
    });
  
    enemies.forEach((enemy, enemyIndex) => {
      enemy.update(canvas, ctx);
      if (enemy.x + enemy.width < 0) enemies.splice(enemyIndex, 1);
  
      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullets.splice(bulletIndex, 1);
          enemy.health--;
          if (enemy.health <= 0) {
            enemies.splice(enemyIndex, 1);
            explosionSound.currentTime = 0;
            explosionSound.play();
            score += 10;
            explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2))
          }
        }
      });
  
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        enemies.splice(enemyIndex, 1);
        player.health--;
        explosionSound.currentTime = 0;
        explosionSound.play();
        if (player.health <= 0) {
          player.lives--;
          if (player.lives <= 0) {
            lose()
          } else {
            player.die()
          }
        }
      }
    });
  
    if (boss && boss.active) {
      boss.update(canvas, ctx);

      if (boss.x <= canvas.width / 2 / scale) {
        boss.dx = 0;
      }

      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < boss.x + boss.width &&
          bullet.x + bullet.width > boss.x &&
          bullet.y < boss.y + boss.height &&
          bullet.y + bullet.height > boss.y
        ) {
          bullets.splice(bulletIndex, 1);
          boss.health--;

          if (boss.health % 5 === 0) {            
            missiles.push(new Missile(boss.x, boss.y + boss.height / 2, -5, 0));        
          }

          explosionSound.currentTime = 0;
          explosionSound.play();
          if (boss.health <= 0) {
            boss.active = false;
            score += 200;
            gameState = "levelComplete"
            playSong("Screens", 1)
            for(var i = 0; i < 6; i++) {              
              let xD = Math.random() * boss.width
              let yD = Math.random() * boss.height
              explosions.push(new Explosion(boss.x + xD, boss.y + yD))
            }
          }
        }
      });
        
      if (
        player.x < boss.x + boss.width &&
        player.x + player.width > boss.x &&
        player.y < boss.y + boss.height &&
        player.y + player.height > boss.y
      ) {
        player.health -= 3;
        explosionSound.currentTime = 0;
        explosionSound.play();
        if (player.health <= 0) {
          player.lives--;
          if (player.lives <= 0) {
            lose()
          } else {
            player.die()
          }
        }
      }
    }
  
    powerUps.forEach((powerUp, powerUpIndex) => {
      powerUp.update(ctx);
      if (
        player.x < powerUp.x + powerUp.width &&
        player.x + player.width > powerUp.x &&
        player.y < powerUp.y + powerUp.height &&
        player.y + player.height > powerUp.y
      ) {
        powerUps.splice(powerUpIndex, 1);
        if (powerUp.type === 'powerUpShot') {
          player.shotPower++
        } else if (powerUp.type === 'health') {
          if (player.health < 3) player.health++;
          else player.lives++;
        }
      }
      if (powerUp.x < 0) {
        powerUps.splice(powerUpIndex, 1);        
      }
    });
  
    if (!bossSpawned && score >= level * 300) {
      boss = new Boss(canvas.width / scale, canvas.height / scale / 2 - 40);
      bossSpawned = true;
    } else {
      if (frame % Math.max(100 - level * 10, 10) === 0) spawnEnemy();
    }
  
    if (frame % 300 === 0) spawnPowerUp();
    frame++;
  }
  
  animate();
  
  window.addEventListener('keydown', (e) => {
    if (gameState === 'title' && e.key === ' ') {
      gameState = 'playing';
      clearLevel()
      score = 0;
      level = 1;
      playSong("Levels", level - 1)
      return;
    }

    if (gameState === 'gameOver' && e.key === ' ') {
      gameState = 'title';
      playSong("Screens", 0)
      return;
    }

    keys[e.key] = true;
    if (gameState === 'levelComplete' && e.key === ' ') {
      gameState = 'playing';
      level++;
      clearLevel();
      playSong("Levels", level - 1)
      return;
    }
  });
  
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
}

export default { Start: start }