// Erik Fredericks
// ECS tutorial for GVSU Computing Club, 2025
// Part 1 (First steps)

let spritesheet;
let player;
let entities = [];

const sprite_bg = "#222323";

const SPRITE_SIZE = 8; // size of sprite in spritesheet
const SPRITE_SCALE = 4; // amount to scale base sprite
let SPRITE_SCALED = 1; // calculated scale value

let sprite_dict = {
  player: { r: 0, c: 4 },
  npc: { r: 0, c: 5 },
  beholder: { r: 0, c: 13 },
  snake: { r: 1, c: 4 },
};

async function setup() {
  // load in sprite sheet - change the filename to match your file
  spritesheet = await loadImage("assets/colored_tilemap_packed.png");
  createCanvas(400, 400);
  drawingContext.imageSmoothingEnabled = false;

  SPRITE_SCALED = SPRITE_SCALE * SPRITE_SIZE;

  player = new Player(80, 80, SPRITE_SCALED, SPRITE_SCALED);
  entities.push(player); // player is always our 0-th entity

  // create a few monsters
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
    entities.push(e);
  }

  let d = new DVD("beholder", width / 2, height / 2, SPRITE_SCALED, SPRITE_SCALED, 2.0);
  entities.push(d);

  let f = new Follower("snake", 20, 20, SPRITE_SCALED, SPRITE_SCALED, 1.0, player);
  entities.push(f);
}

function draw() {
  background(sprite_bg);
  // image(spritesheet, 0, 0);

  for (let e of entities) {
    e.update();
    e.draw();
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

// utility function for drawing a single sprite from the spritesheet 
// note: assumes using the 'packed' version (no spaces/gutters)
function drawSprite(sprite_id, x, y) {
  image(
    spritesheet,   // spritesheet object
    x,             // x location to draw on screen
    y,             // y location to draw on screen
    SPRITE_SCALED, // the **new** width of the sprite
    SPRITE_SCALED, // the **new** height of the sprite
    sprite_dict[sprite_id].c * SPRITE_SIZE, // its x location in the spritesheet
    sprite_dict[sprite_id].r * SPRITE_SIZE, // its y location in the spritesheet
    SPRITE_SIZE,   // the **original** width of the sprite
    SPRITE_SIZE    // the **original** height of the sprite
  );
}
