BasicGame.PreLevel = function (game) {
  this.background = null;
  this.carnageButton = null;

  this.selectedUnits = [0,0,0,0,0,0];

  this.unitButtons = [null, null, null, null, null, null];

  this.oilBank = 0;
  this.oilSpend = 0;
};

BasicGame.PreLevel.prototype = {
  create: function () {
    this.oilBank = 0;
    this.oilSpend = 0;
    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //	Here all we're doing is playing some music and adding a picture and button
    //	Naturally I expect you to do something significantly better :)
    this.background = this.add.sprite(0, 0, 'preLevelScreen');
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    this.background.smoothed = false;

    this.carnageButton = this.add.button(30, 410, 'carnageButton', this.startLevel, this, 1, 0, 1);
    this.carnageButton.smoothed = false;
    this.carnageButton.scale.setTo(4, 4);

    this.unitButtons[0] = this.add.button(44, 176, 'carButtons', function() { this.toggleUnit(0) }, this, 1, 0, 1);
    this.unitButtons[0].smoothed = false;
    this.unitButtons[0].scale.setTo(4, 4);

    this.unitButtons[1] = this.add.button(44, 296, 'carButtons', function() { this.toggleUnit(1) }, this, 1, 0, 1);
    this.unitButtons[1].smoothed = false;
    this.unitButtons[1].scale.setTo(4, 4);

    this.unitButtons[2] = this.add.button(272, 176, 'carButtons', function() { this.toggleUnit(2) }, this, 1, 0, 1);
    this.unitButtons[2].smoothed = false;
    this.unitButtons[2].scale.setTo(4, 4);

    this.unitButtons[3] = this.add.button(264, 264, 'truckButtons', function() { this.toggleUnit(3) }, this, 1, 0, 1);
    this.unitButtons[3].smoothed = false;
    this.unitButtons[3].scale.setTo(4, 4);

    this.unitButtons[4] = this.add.button(504, 176, 'bikeButtons', function() { this.toggleUnit(4) }, this, 1, 0, 1);
    this.unitButtons[4].smoothed = false;
    this.unitButtons[4].scale.setTo(4, 4);

    this.unitButtons[5] = this.add.button(504, 296, 'bikeButtons', function() { this.toggleUnit(5) }, this, 1, 0, 1);
    this.unitButtons[5].smoothed = false;
    this.unitButtons[5].scale.setTo(4, 4);

    this.bank = new Oil(120, 44, this.game);
    this.spent = new Oil(520, 44, this.game);

    this.parsePlayerData();

    this.bank.updateOil(this.oilBank);
  },

  update: function () {

  },

  parsePlayerData: function() {
    var player = window.player;

    for (var i = 0; i < player.vehicles.length; ++i) {
      if (player.vehicles[i] === 2) {
        this.selectedUnits[i] = 2;
      } else {
        this.selectedUnits[i] = 0;
      }
    }

    this.oilBank = player.oil;
  },

  toggleUnit: function(unit) {
    var oilValue = 0;

    switch (unit) {
      case 0:
      case 1:
      case 2:
        oilValue = 2;
        break;
      case 3:
        oilValue = 4;
        break;
      case 4:
      case 5:
        oilValue = 1;
        break;
      default:
        oilValue = 1;
    }

    if (this.selectedUnits[unit] === 2) {
      return;
    } else if (this.selectedUnits[unit] === 0) {
      if (oilValue > this.oilBank) {
        return;
      }

      this.oilSpend += oilValue;
      this.oilBank -= oilValue;
      this.spent.updateOil(this.oilSpend);
      this.bank.updateOil(this.oilBank);

      this.selectedUnits[unit] = 1;
      this.unitButtons[unit].setFrames(1, 1, 1, 1);
    } else {
      this.oilSpend -= oilValue;
      this.oilBank += oilValue;
      this.spent.updateOil(this.oilSpend);
      this.bank.updateOil(this.oilBank);

      this.selectedUnits[unit] = 0;
      this.unitButtons[unit].setFrames(0, 0, 0, 0);
    }
  },

  startLevel: function () {
    //	And start the actual
    // We need to populate the global player state with some data that we carry
    // with us to the level state.
    window.player.oil = this.oilBank;
    var vehicles = [];

    for (var i = 0; i < this.selectedUnits.length; i++) {
      if (this.selectedUnits[i] !== 0) {
        if (i < 3) {
          vehicles.push(0);
        } else if (i === 3) {
          vehicles.push(1);
        } else {
          vehicles.push(2);
        }
      }
    }

    this.state.start('Level', true, false, vehicles, window.player.level);
  }
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
