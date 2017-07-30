BasicGame.GameOver = function (game) {
  this.background = null;
  this.game = game;
};

BasicGame.GameOver.prototype = {
  create: function () {
    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //	Here all we're doing is playing some music and adding a picture and button
    //	Naturally I expect you to do something significantly better :)
    this.background = this.add.sprite(0, 0, 'gameOver');
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    this.background.smoothed = false;
    this.background.inputEnabled = true;

    this.background.events.onInputDown.add(this.startGame, this);
  },

  update: function () {

  },

  startGame: function () {
    //	And start the actual game
    window.player.oil = 2;
    window.player.level = 0;
    this.game.state.start('Menu');
  },

  helpMenu: function (pointer) {
    //this.state.start('HelpMenu');
  },
};
