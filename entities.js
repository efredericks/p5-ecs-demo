class Entity {
  constructor(sprite, x, y, w, h) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() { }

  draw() {
    drawSprite(this.sprite, this.x, this.y);
  }
}

// an entity that can move
class MoveableEntity extends Entity {
  constructor(sprite, x, y, w, h, speed = 1.0) {
    super(sprite, x, y, w, h);
    this.speed = speed;
  }

  // make sure the move is valid before doing it!
  tryMove(move) {
    if (
      this.x + move.x < 0 ||
      this.x + this.w > width ||
      this.y + move.y < 0 ||
      this.y + this.h > height
    )
      return false;
    return true;
  }
}

// Our player class - this is a bit special as we'll do some one-off
// coding in here.  
class Player extends MoveableEntity {
  constructor(x, y, w, h) {
    // fyi, this magic number should be defined in a lookup table!
    super("player", x, y, w, h, 12.0);
  }

  // handle player movement
  move(dir) {
    let next_move = { x: this.x, y: this.y };
    if (dir == "up") next_move.y -= this.speed;
    else if (dir == "down") next_move.y += this.speed;
    else if (dir == "left") next_move.x -= this.speed;
    else if (dir == "right") next_move.x += this.speed;
    else console.log("Movement not supported");

    if (this.tryMove(next_move)) {
      this.x = next_move.x;
      this.y = next_move.y;
    }

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
  }
}

// temporary entities - we'll modify/delete them later!
class Enemy extends MoveableEntity {
  constructor(sprite, x, y, w, h, speed) {
    super(sprite, x, y, w, h, speed);
  }

  // enemy AI
  update() {
    if (random() > 0.8) {
      let next_move = {
        x: this.x + random([-1, 0, 1]) * this.speed,
        y: this.y + random([-1, 0, 1]) * this.speed,
      };
      if (this.tryMove(next_move)) {
        this.x = next_move.x;
        this.y = next_move.y;
        this.x = constrain(this.x, 0, width - this.w);
        this.y = constrain(this.y, 0, height - this.h);
      }
    }
  }
}

// a bouncy friend
class DVD extends MoveableEntity {
  constructor(sprite, x, y, w, h, speed) {
    super(sprite, x, y, w, h, speed);
    this.vx = 1;
    this.vy = 1;
  }
  update() {
    let next_move = {
      x: this.x + this.speed * this.vx,
      y: this.y + this.speed * this.vy,
    };

    this.x = next_move.x;
    this.y = next_move.y;

    if (this.x > width - this.w || this.x < 0) this.vx *= -1;

    if (this.y > height - this.h || this.y < 0) this.vy *= -1;

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
  }
}

// a followey friend
class Follower extends MoveableEntity {
  constructor(sprite, x, y, w, h, speed, target) {
    super(sprite, x, y, w, h, speed);
    this.vx = 1;
    this.vy = 1;
    this.target = target;
  }
  update() {
    if (this.target == null) super.update();
    else {
      // calculate the distance to the player (our target),
      // normalize that vector, and then calculate our
      // new path by incorporating the speed and direction
      let my_v = createVector(this.x, this.y);
      let t_v = createVector(this.target.x, this.target.y);

      let direction = p5.Vector.sub(t_v, my_v);
      direction.normalize();
      direction.mult(this.speed);
      my_v.add(direction);

      this.x = my_v.x;
      this.y = my_v.y;
    }

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
  }
}