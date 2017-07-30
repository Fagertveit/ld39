BasicGame.Menu = function (game) {
  this.background = null;
  this.killButton = null;
};

BasicGame.Menu.prototype = {
  create: function () {
    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //	Here all we're doing is playing some music and adding a picture and button
    //	Naturally I expect you to do something significantly better :)
    this.background = this.add.sprite(0, 0, 'menuScreen');
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    this.background.smoothed = false;

    this.killButton = this.add.button(50, 240, 'killButton', this.startGame, this, 1, 0, 1);
    this.killButton.smoothed = false;
    this.killButton.scale.setTo(4, 4);
  },

  update: function () {

  },

  startGame: function (pointer) {
    //	And start the actual game
    this.state.start('PreLevel');
  },

  helpMenu: function (pointer) {
    //this.state.start('HelpMenu');
  },
};
