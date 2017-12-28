var HumanPlayer = function(game, cli_input, cli_output, map, is_player_one) {
    
    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }

    cli_output = $(cli_output);
    cli_input = $(cli_input);
    map = $(map);
    
    var eventLogHandler = function(e) {
	var cli_msg = $('<div class="cli_msg"></div>');
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (e.who == SBConstants.PLAYER_ONE) {
		    if ($('#p1').hasClass('yourTurn')) {
		    	$('#p1').toggleClass('yourTurn');
		    	$('#p2').toggleClass('yourTurn');
			}
	    } else {
		    if ($('#p2').hasClass('yourTurn')) {
		    	$('#p1').toggleClass('yourTurn');
		    	$('#p2').toggleClass('yourTurn');
			}
	    }
	    break;
	case SBConstants.MISS_EVENT:
	    if($('#p2').hasClass('yourTurn')) {
	    	cli_msg.text("You missed at (" + e.x + ", " + e.y + ")");
	    }
	    else {
	    	cli_msg.text("DumbAI missed at (" + e.x + ", " + e.y + ")");
	    }
	    if(!$('#miss').hasClass('eventFlash')) {
	    	$('#miss').toggleClass('eventFlash');
	    }
	    if($('#hit').hasClass('eventFlash')) {
	    	$('#hit').toggleClass('eventFlash');	
	    }
	    if($('#ship_sunk').hasClass('eventFlash')) {
	    	$('#ship_sunk').toggleClass('eventFlash');	
	    }
	    break;
	case SBConstants.HIT_EVENT:
	    if($('#p2').hasClass('yourTurn')) {
	    	cli_msg.text("You hit at (" + e.x + ", " + e.y + ")");
	    }
	    else {
	    	cli_msg.text("DumbAI hit at (" + e.x + ", " + e.y + ")... somehow");
	    }
	    if(!$('#hit').hasClass('eventFlash')) {
	    	$('#hit').toggleClass('eventFlash');
	    }
	    if($('#miss').hasClass('eventFlash')) {
	    	$('#miss').toggleClass('eventFlash');	
	    }
	    if($('#ship_sunk').hasClass('eventFlash')) {
	    	$('#ship_sunk').toggleClass('eventFlash');	
	    }
	    break;
	case SBConstants.SHIP_SUNK_EVENT:
		if(!$('#ship_sunk').hasClass('eventFlash')) {
	    	$('#ship_sunk').toggleClass('eventFlash');
	    }
		if($('#hit').hasClass('eventFlash')) {
	    	$('#hit').toggleClass('eventFlash');	
	    }
	    if($('#miss').hasClass('eventFlash')) {
	    	$('#miss').toggleClass('eventFlash');	
	    }
	    var ship = e.ship;
	    if (ship.isMine(key)) {
		var pos = ship.getPosition(key);
		cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    } else {
		var pos = ship.getPosition(null); // This works because ship is dead.
		cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    }
	    break;
	case SBConstants.GAME_OVER_EVENT:
	    if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
		cli_msg.text("Game over. You win!");
	    } else {
		cli_msg.text("Game over. You lose!");
	    }
	    break;
	}
	cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
			      eventLogHandler);

    var mapDrawHandler = function(e) {
	map.empty();


	
	//var map_str = "";

	
	/*
			*******CREATE BOARD HERE*******
	*/
	var map_grid = $("<table></table>");
		var row = $("<tr></tr>");
		var numCell = $("<td></td>");
		numCell.html('X');
		row.append(numCell);
		for (var z = 0; z < game.getBoardSize(); z++) {
			var numCell= $("<td></td>")
						if (z >= 10) {
				numCell.html(z);
				numCell.addClass('number');
			}
			else {
				numCell.html("0" + z);
				numCell.addClass('number');
			}
			row.append(numCell);
		}
		map_grid.append(row);
		for (var x = 0; x < game.getBoardSize(); x++) {
			var row = $("<tr></tr>");
			var numCell= $("<td></td>")
			if (x >= 10) {
				numCell.html(x);
				numCell.addClass('number');
			}
			else {
				numCell.html("0" + x);
				numCell.addClass('number');
			}
			row.append(numCell);

			for (var y = 0; y < game.getBoardSize(); y++) {
				var cell = $("<td></td>");
				var sqr = game.queryLocation(key, x, y);
				switch (sqr.type) {
				case "miss":
					cell.html("M");
					cell.addClass("miss");
					break;
				case "p1":
					cell.html("1");
					cell.addClass("p1");
					break;
				case "p2":
					cell.html("2");
					cell.addClass("p2");
					break;
				case "empty":
					cell.html(" ");
					cell.addClass("empty");
					break;
				case "invisible":
					cell.html(" ");
					cell.addClass("invis");
					break;
				}
				cell.attr("id", "p" + x + "," + y);
				row.append(cell);
			}
			map_grid.append(row);
		}
	map.append(map_grid);

	$('#curr_turn').text("Turn: " + game.getTurnCount());
};

	// map_str += "   ";
	// for (var x=0; x<game.getBoardSize(); x++) {
	//     map_str += Math.floor(x/10);
	// }
	// map_str += "\n";
	// map_str += "   ";
	// for (var x=0; x<game.getBoardSize(); x++) {
	//     map_str += x%10;
	// }
	// map_str += "\n";
	// for (var x=-3; x<game.getBoardSize()+1; x++) {
	//     map_str += "-";
	// }
	// map_str += "\n";
	
	// for (var y=0; y<game.getBoardSize(); y++) {
	//     map_str += Math.floor(y/10);
	//     map_str += y%10;
	//     map_str += "|";
	//     for (var x=0; x<game.getBoardSize(); x++) {
	// 	var sqr = game.queryLocation(key, x, y);
	// 	switch (sqr.type) {
	// 	case "miss":
	// 	    map_str += "M";
	// 	    break;
	// 	case "p1":
	// 	    if (sqr.state == SBConstants.OK) {
	// 		map_str += "1";
	// 	    } else {
	// 		map_str += "X";
	// 	    }
	// 	    break;
	// 	case "p2":
	// 	    if (sqr.state == SBConstants.OK) {
	// 		map_str += "2";
	// 	    } else {
	// 		map_str += "X";
	// 	    }
	// 	    break;
	// 	case "empty":
	// 	    map_str += ".";
	// 	    break;
	// 	case "invisible":
	// 	    map_str += "?";
	// 	    break;
	// 	}
	//     }
	//     map_str += "|";
	//     map_str += "\n";
	// }
	// for (var x=-3; x<game.getBoardSize()+1; x++) {
	//     map_str += "-";
	// }
	// map_str += "\n";

	// map.append($('<pre></pre>').text(map_str));
 //    };



    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      mapDrawHandler);

    var gameOverHandler = function(e) {
    	if (e.winner == SBConstants.PLAYER_ONE) {
    	alert("Game Over! You win!")
    	}
    	else if (e.winner == SBConstants.PLAYER_TWO) {
    		alert("Game Over! Your opponent wins!")
    	}
    	else {
    		alert("Game Over! Turn Limit Reached");
    	}
    }

    game.registerEventHandler(SBConstants.GAME_OVER_EVENT, gameOverHandler);

    $('#shoot_button').on('mousedown', function(e) {
    	$(this).toggleClass('buttonClicked');
    	if( $('#move_forward_button').hasClass('buttonClicked')) {
    		$('#move_forward_button').toggleClass('buttonClicked');
    	}
    	if( $('#move_backward_button').hasClass('buttonClicked')) {
    		$('#move_backward_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CW_button').hasClass('buttonClicked')) {
    		$('#rotate_CW_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CCW_button').hasClass('buttonClicked')) {
    		$('#rotate_CCW_button').toggleClass('buttonClicked');
    	}

    });

    $('#move_forward_button').on('mousedown', function(e) {
    	$(this).toggleClass('buttonClicked');
    	if( $('#shoot_button').hasClass('buttonClicked')) {
    		$('#shoot_button').toggleClass('buttonClicked');
    	}
    	if( $('#move_backward_button').hasClass('buttonClicked')) {
    		$('#move_backward_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CW_button').hasClass('buttonClicked')) {
    		$('#rotate_CW_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CCW_button').hasClass('buttonClicked')) {
    		$('#rotate_CCW_button').toggleClass('buttonClicked');
    	}
    });

    $('#move_backward_button').on('mousedown', function(e) {
    	$(this).toggleClass('buttonClicked');
    	if( $('#move_forward_button').hasClass('buttonClicked')) {
    		$('#move_forward_button').toggleClass('buttonClicked');
    	}
    	if( $('#shoot_button').hasClass('buttonClicked')) {
    		$('#shoot_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CW_button').hasClass('buttonClicked')) {
    		$('#rotate_CW_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CCW_button').hasClass('buttonClicked')) {
    		$('#rotate_CCW_button').toggleClass('buttonClicked');
    	}
    });

    $('#rotate_CW_button').on('mousedown', function(e) {
    	$(this).toggleClass('buttonClicked');
    	if( $('#move_forward_button').hasClass('buttonClicked')) {
    		$('#move_forward_button').toggleClass('buttonClicked');
    	}
    	if( $('#move_backward_button').hasClass('buttonClicked')) {
    		$('#move_backward_button').toggleClass('buttonClicked');
    	}
    	if( $('#shoot_button').hasClass('buttonClicked')) {
    		$('#shoot_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CCW_button').hasClass('buttonClicked')) {
    		$('#rotate_CCW_button').toggleClass('buttonClicked');
    	}
    });

    $('#rotate_CCW_button').on('mousedown', function(e) {
    	$(this).toggleClass('buttonClicked');
    	if( $('#move_forward_button').hasClass('buttonClicked')) {
    		$('#move_forward_button').toggleClass('buttonClicked');
    	}
    	if( $('#move_backward_button').hasClass('buttonClicked')) {
    		$('#move_backward_button').toggleClass('buttonClicked');
    	}
    	if( $('#rotate_CW_button').hasClass('buttonClicked')) {
    		$('#rotate_CW_button').toggleClass('buttonClicked');
    	}
    	if( $('#shoot_button').hasClass('buttonClicked')) {
    		$('#shoot_button').toggleClass('buttonClicked');
    	}
    });

    map.on('mousedown', 'td', function(e) {
    	var idStr = $(this).attr('id');
		var cind = idStr.indexOf(',');
		var xind = idStr.substring(1, cind);
		var yind = idStr.substring(cind + 1, idStr.length);
		if ($('#shoot_button').hasClass('buttonClicked')) {
			game.shootAt(key, xind, yind);
		}
		else if ($('#move_forward_button').hasClass('buttonClicked')){
			var info = game.queryLocation(key, xind, yind);
			if (info.type == 'p1') {
				var shipToMove = info.ship;
				var seg_idx = info.seg_idx;
				var seg_state = info.seg_state;
				game.moveShipForward(key, shipToMove);
			}
			else {
				alert('Your ship is not located at that space and cannot be moved');
			}
		}
		else if ($('#move_backward_button').hasClass('buttonClicked')){
			var info = game.queryLocation(key, xind, yind);
			if (info.type == 'p1') {
				var shipToMove = info.ship;
				var seg_idx = info.seg_idx;
				var seg_state = info.seg_state;
				game.moveShipBackward(key, shipToMove);
			}
			else {
				alert('Your ship is not located at that space and cannot be moved');
			}
		}
		else if ($('#rotate_CW_button').hasClass('buttonClicked')){
			var info = game.queryLocation(key, xind, yind);
			if (info.type == 'p1') {
				var shipToMove = info.ship;
				var seg_idx = info.seg_idx;
				var seg_state = info.seg_state;
				game.rotateShipCW(key, shipToMove);
			}
			else {
				alert('Your ship is not located at that space and cannot be rotated');
			}
		}
		else if ($('#rotate_CCW_button').hasClass('buttonClicked')){
			var info = game.queryLocation(key, xind, yind);
			if (info.type == 'p1') {
				var shipToMove = info.ship;
				var seg_idx = info.seg_idx;
				var seg_state = info.seg_state;
				game.rotateShipCCW(key, shipToMove);
			}
			else {
				alert('Your ship is not located at that space and cannot be rotated');
			}
		}
		else {
			alert('You must press the "Shoot", "Move", or "Rotate" button before making a move');
		}
    });

    cli_input.on('keypress', function (e) {
	if (e.keyCode == 13) {
	    var cmd_str = $(this).val();
//	    $(this).val('');
	    var cmd_array = cmd_str.split(' ');
	    if (cmd_array[0] == "shootAt") {
		var x = parseInt(cmd_array[1]);
		var y = parseInt(cmd_array[2]);
		game.shootAt(key, x, y);
	    } else if (cmd_array[0] == "fleetInfo") {
		var fleet = game.getFleetByKey(key);
		var fleet_ul = $('<ul></ul>');
		fleet.forEach(function (s) { //HERE
		    var ship_str = "<li>" + s.getName();
		    var ship_pos = s.getPosition(key);
		    ship_str += "<ul>";
		    ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
		    ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
		    ship_str += "<li>Size: " + s.getSize() + "</li>";
		    if (s.getStatus() == SBConstants.ALIVE) {
			ship_str += "<li>Status: ALIVE</li>";
		    } else {
			ship_str += "<li>Status: DEAD</li>";
		    }
		    ship_str += "</ul></li>";
		    fleet_ul.append(ship_str);
		})
		cli_output.prepend($('<div class="cli_msg"></div>').append(fleet_ul));
	    } else if (cmd_array[0] == "moveForward") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipForward(key, ship);
		}
	    } else if (cmd_array[0] == "moveBackward") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipBackward(key, ship);
		}
	    } else if (cmd_array[0] == "rotateCW") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.rotateShipCW(key, ship);
		}
	    } else if (cmd_array[0] == "rotateCCW") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.rotateShipCCW(key, ship);
		}
	    }
	}
    });
};