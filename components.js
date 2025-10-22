class Component {
  constructor(key) {
    this.key = key;
  }
}

class FighterComponent extends Component {
  constructor(hp, def, str) {
    super('fighter');
    this.hp = hp;
    this.maxHP = hp;
    this.def = def;
    this.maxDef = def;
    this.str = str;
  }

  // returns the percentage of health remaining
  getPerc() {
    return this.hp / this.maxHP;
  }

  // damage the entity 
  takeDamage(dmg) {
    this.hp -= dmg;

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  // handle death - can delegate to the entity or handle here
  die() {
    console.log("oof");
  }
}

class AIComponent extends Component {
  constructor(type, entity, vx = 0, vy = 0, target = null) {
    super("AI");
    this.entity = entity; // reference to parent
    this.type = type;

    this.vx = vx; // follower and DVD logo
    this.vy = vy;

    this.target = target; // for the follower
  }

  update() {
    // random mover
    if (this.type == "random") {
      if (random() > 0.8) {
        let next_move = {
          x: this.entity.x + random([-1, 0, 1]) * this.entity.speed,
          y: this.entity.y + random([-1, 0, 1]) * this.entity.speed,
        };
        if (this.entity.tryMove(next_move)) {
          this.entity.x = next_move.x;
          this.entity.y = next_move.y;
        }
      }

      // bouncing dvd logo
    } else if (this.type == "DVD") {
      let next_move = {
        x: this.entity.x + this.entity.speed * this.vx,
        y: this.entity.y + this.entity.speed * this.vy,
      };
      this.entity.x = next_move.x;
      this.entity.y = next_move.y;

      if (this.entity.x > width - this.entity.w || this.entity.x < 0)
        this.vx *= -1;

      if (this.entity.y > height - this.entity.h || this.entity.y < 0)
        this.vy *= -1;

      // follow a target
    } else if (this.type == "follow") {
      if (this.target != null) {
        let my_v = createVector(this.entity.x, this.entity.y);
        let t_v = createVector(this.target.x, this.target.y);

        let direction = p5.Vector.sub(t_v, my_v);
        direction.normalize();
        direction.mult(this.entity.speed);
        my_v.add(direction);

        this.entity.x = my_v.x;
        this.entity.y = my_v.y;
      }

      if (this.entity.x > width - this.entity.w || this.entity.x < 0)
        this.vx *= -1;

      if (this.entity.y > height - this.entity.h || this.entity.y < 0)
        this.vy *= -1;
    }
    // else do nothing

    // stay in bounds
    this.entity.x = constrain(this.entity.x, 0, width - this.entity.w);
    this.entity.y = constrain(this.entity.y, 0, height - this.entity.h);
  }
}