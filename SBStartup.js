$(document).ready(function () {

    var game = new SuperBattleship();
    var player_one = new HumanPlayer(game, $('#p1_cli_input'),
				       $('#p1_cli_output'), $('#p1_view'), true);
    var ai_player_two = new DumbAI(game, false);
    game.startGame();
});