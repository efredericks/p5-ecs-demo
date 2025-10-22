// entity base class
class Entity {
  constructor(sprite, x, y, w, h) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.bar_h = this.h * 0.2;

    this.components = {};
  }

  update() {
    if ("AI" in this.components) {
      this.components.AI.update();
    }
  }

  addComponent(c) {
    this.components[c.key] = c;
  }

  draw() {
    drawImage(this.sprite, this.x, this.y);

    // draw HP bar
    if ("fighter" in this.components) {
      let perc = this.components.fighter.getPerc();
      let x = this.x;
      let y = this.y - this.bar_h * 2;

      noStroke();
      fill("rgba(224,72,72,0.6)");
      rect(x, y, this.w, this.bar_h);

      let w = map(perc, 0.0, 1.0, 0, this.w - 2);
      fill("rgba(0,255,0, 0.6)");
      rect(x + 1, y + 1, w, this.bar_h - 2);
    }
  }

  takeDamage(dmg) {
    if ("fighter" in this.components) {
      this.components.fighter.takeDamage(dmg);
    }
  }
}

// an entity that can move around
class MoveableEntity extends Entity {
  constructor(sprite, x, y, w, h, speed = 1.0) {
    super(sprite, x, y, w, h);
    this.speed = speed;
  }

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

// an enemy - the intention would be there is more
// delineation here between a moveable and this
class Enemy extends MoveableEntity {
  constructor(sprite, x, y, w, h, speed) {
    super(sprite, x, y, w, h, speed);
  }
}

// the player class
class Player extends MoveableEntity {
  constructor(x, y, w, h) {
    super("player", x, y, w, h, 12.0);
  }

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