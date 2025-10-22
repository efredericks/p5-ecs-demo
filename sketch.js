// Erik Fredericks
// ECS tutorial for GVSU Computing Club, 2025
// Part 1 (First steps)

let spritesheet;
let player;
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
  player = { x: 20, y: 20 };
}

function draw() {
  background(sprite_bg);
  // image(spritesheet, 0, 0);

  drawSprite('player', player.x, player.y);

  // enable continuous movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown("a")) {
    player.x--;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown("d")) {
    player.x++;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown("w")) {
    player.y--;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown("s")) {
    player.y++;
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
