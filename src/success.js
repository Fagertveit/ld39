BasicGame.Success = function (game) {
  this.background = null;
  this.nextLevel = null;
};

BasicGame.Success.prototype = {
  init: function(vehicles) {
  },

  create: function () {
    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //	Here all we're doing is playing some music and adding a picture and button
    //	Naturally I expect you to do something significantly better :)
    this.background = this.add.sprite(0, 0, 'success');
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    this.background.smoothed = false;

    this.nextLevel = this.add.button(300, 350, 'nextLevel', this.nextLevel, this, 1, 0, 1);
    this.nextLevel.smoothed = false;
    this.nextLevel.scale.setTo(4, 4);
    this.state.start('PreLevel');
  },

  update: function () {

  },

  nextLevel: function (pointer) {
    //	And start the actual game

  },

  helpMenu: function (pointer) {
    //this.state.start('HelpMenu');
  },
};
