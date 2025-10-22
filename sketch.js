// Erik Fredericks
// ECS tutorial for GVSU Computing Club, 2025

const sprite_scale = 4;
const SPRITE_SIZE = 8;
const sprite_bg = "#222323";
let SPRITE_SCALED;
let spritesheet;

let sprite_dict = {
  player: { r: 0, c: 4 },
  npc: { r: 0, c: 5 },
  beholder: { r: 0, c: 13 },
  snake: { r: 1, c: 4 },
};

let player;
let entities = [];

// runs once, prior to drawing
async function setup() {
  createCanvas(800, 600);
  drawingContext.imageSmoothingEnabled = false;
  spritesheet = await loadImage("assets/colored_tilemap_packed.png");

  // actual drawing size
  SPRITE_SCALED = sprite_scale * SPRITE_SIZE;

  // create player 
  player = new Player(80, 80, SPRITE_SCALED, SPRITE_SCALED);
  player.addComponent(new FighterComponent(10, 1, 1));
  entities.push(player);

  // create other entities
  choices = ["npc", "snake", "beholder"];
  for (let _ = 0; _ < 10; _++) {
    let e = new Enemy(
      random(choices),
      random(0, width - SPRITE_SCALED),
      random(0, height - SPRITE_SCALED),
      SPRITE_SCALED,
      SPRITE_SCALED,
      random(1.0, 5.0)
    );
    e.addComponent(new FighterComponent(10, 1, 1));
    e.addComponent(new AIComponent('random', e));

    // console.log(e)
    entities.push(e);
  }

  let d = new Enemy("beholder", width / 2, height / 2, SPRITE_SCALED, SPRITE_SCALED, 2.0);
  d.addComponent(new FighterComponent(10, 1, 1));
  d.addComponent(new AIComponent('DVD', d, 1, 1));
  entities.push(d);

  let f = new Enemy("snake", 40, 40, SPRITE_SCALED, SPRITE_SCALED, 2.0);
  f.addComponent(new FighterComponent(10, 1, 1));
  f.addComponent(new AIComponent('follow', f, 1, 1, player));
  entities.push(f);
  
  // console.log(entities)
}

// forever loop
function draw() {
  background(sprite_bg);

  for (let i = entities.length - 1; i >= 0; i--) {
    entities[i].update();
    entities[i].draw();
  }

  // enable continuous movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown("a")) {
    player.move("left");
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown("d")) {
    player.move("right");
  }
  if (keyIsDown(UP_ARROW) || keyIsDown("w")) {
    player.move("up");
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown("s")) {
    player.move("down");
  }
}

// utility function for drawing a single sprite from the spritesheet - assumes using the 'packed' version (no spaces/gutters)
function drawSprite(sprite_id, x, y) {
  image(
    spritesheet,
    x,
    y,
    SPRITE_SCALED,
    SPRITE_SCALED,
    sprite_dict[sprite_id].c * SPRITE_SIZE,
    sprite_dict[sprite_id].r * SPRITE_SIZE,
    SPRITE_SIZE,
    SPRITE_SIZE
  );
}

function keyPressed() {
  if (key == '1') player.takeDamage(1);
  if (key == '2') player.takeDamage(-1);
}