BasicGame.Level = function (game) {
  this.background = null;
  this.initVehicles = [];
  this.initLevel = 0;

  this.vehicles = [];
  this.enemies = [];
  this.crosshairs = [];
  this.oil = null;
  this.game;

  this.map = [];
  this.maps = [
    [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 0, 1, 2, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 1, 3, 0],
      [0, 0, 0, 2, 0, 1, 1, 0],
      [0, 0, 0, 0, 2, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 2, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 3, 0]
    ],
    [
      [0, 0, 0, 0, 0, 1, 1, 1],
      [0, 0, 2, 0, 3, 1, 4, 1],
      [0, 0, 0, 0, 0, 1, 0, 3],
      [0, 0, 0, 2, 0, 1, 0, 3],
      [0, 0, 0, 0, 3, 1, 4, 1],
      [0, 0, 0, 0, 0, 1, 1, 1]
    ]
  ];

  this.mouseButton = false;
};

BasicGame.Level.prototype = {
  init: function(vehicles, level) {
    this.initVehicles = vehicles;
    this.initLevel = level;
  },

  create: function () {
    this.enemies = [];
    this.vehicles = [];
    this.map = [];
    this.oil = null;
    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //	Here all we're doing is playing some music and adding a picture and button
    //	Naturally I expect you to do something significantly better :)
    this.background = this.add.sprite(0, 0, 'levelScreen');
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    this.background.smoothed = false;

    this.endTurnButton = this.add.button(464, 12, 'endTurnButton', this.endTurn, this, 1, 1, 1);
    this.endTurnButton.smoothed = false;
    this.endTurnButton.scale.setTo(4, 4);
    this.map = this.maps[this.initLevel];

    this.tileMap = new TileMap(this.map, this.game, this);
    this.oil = new Oil(134, 10, this.game);
    this.oil.updateOil(window.player.oil);

    for (var i = 0; i < this.initVehicles.length; i++) {
      switch (this.initVehicles[i]) {
        case 0:
          // Car vehicles
          this.vehicles.push(new PlayerVehicle([0, i], 0, 5, 2, 'carUnit', 2, 2, this.game, this));
          break;
        case 1:
          // Truck vehicles
          this.vehicles.push(new PlayerVehicle([0, i], 1, 20, 1, 'truckUnit', 1, 1, this.game, this));
          break;
        case 2:
          // Bike vehicle
          this.vehicles.push(new PlayerVehicle([0, i], 2, 3, 1, 'bikeUnit', 3, 0, this.game, this));
          break;
      }
    }

    for (var i = 0; i < this.map.length; i++) {
      for (var j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] != 0) {
          switch(this.map[i][j]) {
            case 1:
              this.enemies.push(new EnemyUnit([j, i], 0, 1, 1, 'barbwireEnemy', 0, 0, this.game));
              break;
            case 2:
              this.enemies.push(new EnemyUnit([j, i], 1, 2, 1, 'raiderEnemy', 1, 0, this.game));
              break;
            case 3:
              this.enemies.push(new EnemyUnit([j, i], 2, 4, 1, 'watchtowerEnemy', 0, 3, this.game));
              break;
            case 4:
              this.enemies.push(new EnemyUnit([j, i], 3, 6, 1, 'bunkerEnemy', 0, 2, this.game));
              break;
          }
        }
      }
    }
  },

  update: function () {
    /*if (this.game.input.pointer.isDown) {
      console.log('Input is down!?');
    }*/
  },

  endTurn: function() {
    var inGoal = true;

    for (var i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].position[0] != 7) {
        inGoal = false;
      }
    }

    if (inGoal) {
      if (this.initLevel === this.maps.length - 1) {
        this.state.start('Victory', true, false, this.vehicles);
      } else {
        window.player.level++;
        window.player.oil += 4;
        //this.game.state.start('Success', true, false, this.vehicles);
        this.state.start('PreLevel', true, false);
      }
    } else {
      // Do enemy attack thingamajig
      for (var i = 0; i < this.enemies.length; i++) {
        var centerX = 96 + this.enemies[i].position[0] * 64;
        var centerY = 92 + this.enemies[i].position[1] * 64;

        switch(this.enemies[i].type) {
          case 1:
            var inRange = false;
            var collision = new Phaser.Circle(centerX, centerY, 256);
            for (var j = 0; j < this.vehicles.length; j++) {
              if (collision.contains(this.vehicles[j].vehicle.centerX, this.vehicles[j].vehicle.centerY)) {
                this.vehicles[j].doDamage(this.enemies[i].damage);

                if (this.vehicles[j].hp === 0) {
                  this.vehicles.splice(j, 1);
                }
                inRange = true;
                break;
              }
            }

            if (!inRange) {
              var rand = Math.random() * 10;

              if (this.enemies[i].position[1] === 5) {
                this.enemies[i].position[1]--;
              } else if (this.enemies[i].position[1] === 0) {
                this.enemies[i].position[1]++;
              } else {
                if (rand > 5) {
                  this.enemies[i].position[1]--;
                } else {
                  this.enemies[i].position[1]++;
                }
              }
              this.enemies[i].moveUnit();
            }
            break;
          case 2:
            var collision = new Phaser.Circle(centerX, centerY, 420);
            for (var j = 0; j < this.vehicles.length; j++) {
              if (collision.contains(this.vehicles[j].vehicle.centerX, this.vehicles[j].vehicle.centerY)) {
                this.vehicles[j].doDamage(this.enemies[i].damage);

                if (this.vehicles[j].hp === 0) {
                  this.vehicles.splice(j, 1);
                }
              }
            }
            break;
          case 3:
            var collision = new Phaser.Circle(centerX, centerY, 256);
            for (var j = 0; j < this.vehicles.length; j++) {
              if (collision.contains(this.vehicles[j].vehicle.centerX, this.vehicles[j].vehicle.centerY)) {
                this.vehicles[j].doDamage(this.enemies[i].damage);

                if (this.vehicles[j].hp === 0) {
                  this.vehicles.splice(j, 1);
                }
              }
            }
            break;
        }
      }

      for (var i = 0; i < this.vehicles.length; i++) {
        this.vehicles[i].reset();
      }

      if (this.vehicles.length === 0) {
        this.game.state.start('GameOver');
      }
      this.endTurnButton.setFrames(1, 1, 1, 1);
    }
  },

  selectVehicle: function(vehicle, event) {
    if (!vehicle.haveMoved) {
      this.selectedVehicle = vehicle;
      this.clearCrosshairs();
      this.tileMap.generateMovementTiles(this.selectedVehicle.position[0], this.selectedVehicle.position[1], this.selectedVehicle.movement, this.selectedVehicle.range, this.vehicles, this.enemies);
    }
  },

  selectTile: function(tile, event) {
    if (this.selectedVehicle && event.frame === 1) {
      this.selectedVehicle.moveUnit(event.tileX, event.tileY);
      this.tileMap.clearTiles();
      this.clearCrosshairs();
    }

    this.checkUnitActions();
  },

  clearCrosshairs: function() {
    for (var i = 0; i < this.crosshairs.length; i++) {
      this.crosshairs[i].destroy();
    }

    this.crosshairs = [];
  },

  attackEnemy: function(event) {
    var enemy = this.getEnemyAt(event.tileX, event.tileY);
    var index = this.enemies.indexOf(enemy);

    if (enemy.type === 0 && this.selectedVehicle.type === 2) {
      this.selectedVehicle.doDamage(1);
      enemy.doDamage(1);
    } else {
      enemy.doDamage(this.selectedVehicle.damage);
    }

    if (enemy.hp === 0) {
      switch(enemy.type) {
        case 1:
          window.player.oil += 1;
          this.oil.updateOil(window.player.oil);
          break;
        case 2:
          window.player.oil += 2;
          this.oil.updateOil(window.player.oil);
        break;
        case 3:
          window.player.oil += 3;
          this.oil.updateOil(window.player.oil);
        break;
      }

      this.enemies.splice(index, 1);
      if (this.selectedVehicle === 2 || this.selectedVehicle === 1) {
        this.selectedVehicle.moveUnit(event.tileX, event.tileY);
      }

    }

    if (this.selectedVehicle.hp === 0) {
      var i = this.vehicles.indexOf(this.selectedVehicle);
      this.vehicles.splice(i, 1);
    }

    this.selectedVehicle.action();
    this.tileMap.clearTiles();
    this.clearCrosshairs();
    this.checkUnitActions();
  },

  checkUnitActions: function() {
    var actionsLeft = false;

    for (var i = 0; i < this.vehicles.length; i++) {
      if (!this.vehicles[i].haveMoved) {
        actionsLeft = true;
      }
    }
    if (!actionsLeft) {
      this.endTurnButton.setFrames(0, 0, 0, 0);
    }
  },

  getEnemyAt: function(x, y) {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].position[0] === x && this.enemies[i].position[1] === y) {
        return this.enemies[i];
      }
    }
  }
};

var PlayerVehicle = function PlayerVehicle(pos, type, hp, damage, sprite, movement, range, game, level) {
  var _this = this;
  this.position = pos ||[0, 0];
  this.type = type ||0;
  this.hp = hp || 1;
  this.maxHp = hp || 1;
  this.damage = damage || 1;
  this.sprite = sprite || 'carUnit';
  this.movement = movement || 2;
  this.range = range || 2;
  this.game = game;
  this.level = level;
  this.haveMoved = false;
  this.canAttack = true;

  this.vehicle = this.game.add.sprite(64 + this.position[0] * 64, 60 + this.position[1] * 64, sprite);
  this.vehicle.smoothed = false;
  this.vehicle.scale.setTo(4, 4);
  this.vehicle.inputEnabled = true;

  this.healthBar = this.game.add.sprite(64 + this.position[0] * 64, 60 + this.position[1] * 64, 'healthBar');
  this.healthBar.smoothed = false;
  this.healthBar.scale.setTo(4, 4);

  this.health = this.game.add.sprite(68 + this.position[0] * 64, 60 + this.position[1] * 64, 'health');
  this.health.smoothed = false;
  this.health.width = 64;
  this.health.height = 64;

  this.vehicle.events.onInputDown.add(function(event) { _this.level.selectVehicle(_this, event) }, this.level);
};

PlayerVehicle.prototype.reset = function() {
  this.haveMoved = false;
  this.vehicle.alpha = 1;
}

PlayerVehicle.prototype.action = function() {
  this.haveMoved = true;
  this.vehicle.alpha = 0.5;
}

PlayerVehicle.prototype.moveUnit = function(x, y) {
  this.position = [x, y];
  this.vehicle.x = 64 + this.position[0] * 64;
  this.vehicle.y = 60 + this.position[1] * 64;

  this.healthBar.x = 64 + this.position[0] * 64;
  this.health.x = 68 + this.position[0] * 64;

  this.healthBar.y = 60 + this.position[1] * 64;
  this.health.y = 60 + this.position[1] * 64;

  this.action();
};

PlayerVehicle.prototype.doDamage = function(damage) {
  this.hp -= damage;

  if (this.hp <= 0) {
    this.hp = 0;
    this.health.width = 0;
    this.vehicle.destroy();
    this.healthBar.destroy();
    this.health.destroy();
  } else {
    this.health.width = Math.floor(64 * (this.hp / this.maxHp));
  }
}

var EnemyUnit = function EnemyUnit(pos, type, hp, damage, sprite, movement, range, game) {
  this.position = pos || [7, 0];
  this.type = type || 0;
  this.maxHp = hp || 1;
  this.hp = hp || 1;
  this.damage = damage || 1;
  this.sprite = 'watchtowerEnemy' || sprite;
  this.movement = movement || 2;
  this.range = range || 1;
  this.game = game;

  this.enemy = this.game.add.sprite(64 + this.position[0] * 64, 60 + this.position[1] * 64, sprite);
  this.enemy.smoothed = false;
  this.enemy.scale.setTo(4, 4);

  this.healthBar = this.game.add.sprite(64 + this.position[0] * 64, 60 + this.position[1] * 64, 'healthBar');
  this.healthBar.smoothed = false;
  this.healthBar.scale.setTo(4, 4);

  this.health = this.game.add.sprite(68 + this.position[0] * 64, 60 + this.position[1] * 64, 'health');
  this.health.smoothed = false;
  this.health.width = 64;
  this.health.height = 64;
};

EnemyUnit.prototype.doDamage = function(damage) {
  this.hp -= damage;

  if (this.hp <= 0) {
    this.hp = 0;
    this.health.width = 0;
    this.enemy.destroy();
    this.healthBar.destroy();
    this.health.destroy();
  } else {
    this.health.width = Math.floor(64 * (this.hp / this.maxHp));
  }
}

EnemyUnit.prototype.moveUnit = function() {
  this.enemy.x = 64 + this.position[0] * 64;
  this.enemy.y = 60 + this.position[1] * 64;

  this.healthBar.x = 64 + this.position[0] * 64;
  this.health.x = 68 + this.position[0] * 64;

  this.healthBar.y = 60 + this.position[1] * 64;
  this.health.y = 60 + this.position[1] * 64;
};

var MOVEMENT = [
  [
    [0, -1],
    [-1, 0], [1, 0],
    [0, 1]
  ],
  [
    [0, -2],
    [-1, -1], [0, -1], [1, -1],
    [-2, 0], [-1, 0], [1, 0], [2, 0],
    [-1, 1], [0, 1], [1, 1],
    [0, 2]
  ],
  [
    [0, -3],
    [-1, -2], [0, -2], [1, -2],
    [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
    [-3, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [3, 0],
    [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
    [-1, 2], [0, 2], [1, 2],
    [0, 3]
  ]
];

var TileMap = function TileMap(map, game, level) {
  var _this = this;
  this.x = 64;
  this.y = 64;
  this.map = map;
  this.game = game;
  this.level = level;
  this.tiles = [];

  for (var i = 0; i < this.map.length; i++) {
    for (var j = 0; j < this.map[i].length; j++) {
      var sprite = this.game.add.sprite(this.x + j * 64, this.y + i * 64, 'tiles', 0);
      sprite.smoothed = false;
      sprite.scale.setTo(4, 4);
      sprite.inputEnabled = true;
      sprite.tileX = j;
      sprite.tileY = i;

      sprite.events.onInputDown.add(function(event) { _this.level.selectTile(_this, event) }, this.level);

      this.tiles.push(sprite);
    }
  }
};

TileMap.prototype.clearTiles = function() {
  for (var i = 0; i < this.tiles.length; i++) {
    this.tiles[i].frame = 0;
  }
}

TileMap.prototype.generateMovementTiles = function(x, y, mov, rng, vehicles, enemies) {
  var _this = this;
  this.clearTiles();
  var movement = MOVEMENT[mov - 1];
  var range = MOVEMENT[rng - 1];

  for (var i = 0; i < movement.length; i++) {
    var tileX = x + movement[i][0];
    var tileY = y + movement[i][1];

    // Is it out of bounds?
    if (tileX < 0 || tileX > 7 || tileY < 0 || tileY > 5) {
      // It's out of bounds
      continue;
    }
    // Generate crosshairs
    if (this.checkPosition(tileX, tileY, enemies)) {
      continue;
    } else if (this.checkPosition(tileX, tileY, vehicles)) {
      this.setFrameForPosition(tileX, tileY, 2);
    } else {
      this.setFrameForPosition(tileX, tileY, 1);
    }
  }

  for (var i = 0; i < range.length; i++) {
    var tileX = x + range[i][0];
    var tileY = y + range[i][1];

    // Is it out of bounds?
    if (tileX < 0 || tileX > 7 || tileY < 0 || tileY > 5) {
      // It's out of bounds
      continue;
    }
    // Generate crosshairs
    if (this.checkPosition(tileX, tileY, enemies)) {
      var crosshair = this.game.add.sprite(64 + tileX * 64, 60 + tileY * 64, 'crosshair');

      crosshair.smoothed = false;
      crosshair.scale.setTo(4, 4);
      crosshair.tileX = tileX;
      crosshair.tileY = tileY;
      crosshair.inputEnabled = true;

      crosshair.events.onInputDown.add(function(event) { _this.level.attackEnemy(event) }, this.level);
      this.level.crosshairs.push(crosshair);
    }
  }
};

TileMap.prototype.checkPosition = function(x, y, entities) {
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].position[0] === x && entities[i].position[1] === y) {
      return true;
    }
  }

  return false;
};

TileMap.prototype.setFrameForPosition = function(x, y, frame) {
  this.tiles[y * 8 + x].frame = frame;
};

var Oil = function Oil(x, y, game) {
    this.game = game;
    this.oil = 0;

    this.oilSprites = [];

    for(i = 0; i < 2; ++i) {
        var sprite = this.game.add.sprite(x - (i * 24), y, 'bloodNumbers');
        sprite.smoothed = false;
        sprite.scale.setTo(4, 4);
        sprite.frame = 0;
        this.oilSprites.push(sprite);
    }
};

Oil.prototype.updateOil = function(newOil) {
    var oilString = newOil.toString().split("").reverse();

    if (oilString.length === 1) {
      oilString += "0";
    }

    for(i = 0; i < oilString.length; ++i) {
        this.oilSprites[i].frame = parseInt(oilString[i]);
    }
};

Oil.prototype.visible = function(visible) {
    for (i = 0; i < this.oilSprites.length; i++) {
        this.oilSprites[i].visible = visible;
        this.game.world.bringToTop(this.oilSprites[i]);
    }
};
