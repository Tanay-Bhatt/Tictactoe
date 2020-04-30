window.onload = ()=> {
	setTimeout(function() {
		lt.style.display = 'block';
		loader.addEventListener('click', function() {
			document.body.removeChild(this);
		})
	}, 2000);


	var ailevel = 0;
	var token1 = '';
	var token2 = '';
	var boardvals = ['', '', '', '', '', '', '', '', ''];

	var ctheme = 'dark';
	var volume = true;

	

	theme.addEventListener('click',function() {
		
		if (ctheme === 'dark') {
			document.body.style.setProperty('--pcolor' , '#eee');
			document.body.style.setProperty('--scolor' , '#444');
			document.body.style.setProperty('--acolor' , '#aaa');
			this.querySelector('.fa').classList.replace('fa-sun-o', 'fa-moon-o');
		}
		else {
			document.body.style.setProperty('--pcolor' , '#222');
			document.body.style.setProperty('--scolor' , '#eee');
			document.body.style.setProperty('--acolor' , '#444');
			this.querySelector('.fa').classList.replace('fa-moon-o', 'fa-sun-o');
		}
		ctheme = ctheme === 'dark' ? 'light' : 'dark';
	});

	sound.addEventListener('click', function() {
		
		if (volume) {
			this.querySelector('.fa').classList.replace('fa-volume-up', 'fa-volume-off');
		}
		else{
			this.querySelector('.fa').classList.replace('fa-volume-off', 'fa-volume-up');
		}

		
		var audios = document.querySelectorAll('audio');
		for(var i = 0; i<audios.length; i++) {
			audios[i].muted = volume;
		}
		volume = volume === true ? false : true;
	});

	times = document.querySelectorAll('.times');
	for (var i = 0; i < times.length; i++) {
		times[i].addEventListener('click', function() {
			if(this.parentNode === game){
				clearboard();
			}
			this.parentNode.style.display = 'none';
		});
	}

	function clearboard() {
		checks = document.querySelectorAll('.check');
		for (var i = 0; i < boardvals.length; i++) {
			board.removeChild(checks[i]);
		}
		reset.style.display = 'none';
	};

	function boardp(){
		checks = document.querySelectorAll('.check');
		for (var i = 0; i < checks.length; i++) {
			boardvals[i] = checks[i].value;
		}
	}

	function isgameended() {
		for(var i = 0; i<9; i+=3){
			if(boardvals[i] != '' && boardvals[i+1] === boardvals[i] && boardvals[i+2] === boardvals[i]){
				return (boardvals[i] === token1) ? -1 : 1;
			}
		}
		for(var i = 0; i<3; i++){
			if(boardvals[i] != '' && boardvals[i+3] === boardvals[i] && boardvals[i+6] === boardvals[i]){
				return (boardvals[i] === token1) ? -1 : 1;
			}
		}
		if(boardvals[2] != '' && boardvals[4] === boardvals[2] && boardvals[6] == boardvals[2]){
			return (boardvals[2] === token1) ? -1 : 1;
		}
		if(boardvals[0] != '' && boardvals[4] === boardvals[0] && boardvals[8] == boardvals[0]){
			return (boardvals[0] === token1) ? -1 : 1;
		}

		for (var i = 0; i < boardvals.length; i++) {
			if(boardvals[i] === ''){
				return false;
			}
		}

		return 'tie';
	}

	function aimove() {
    	var value = -1000;
		var index;
		for(var i = 0; i<boardvals.length; i++){
			if (boardvals[i] != '') continue;
        	boardvals[i] = token2;
        	var newvalue = minimax(0, token1);
        	boardvals[i] = '';
        	if (newvalue > value) {
        		value = newvalue;
        		index = i;
        	}
    	}
  	return index;
	}


	function minimax(depth, player) {
  		var score = isgameended(board);
  		if (score !== false) {
    		return score;
  		}
  		else if (score === 'tie') {
  			return 0;
  		}

  		if (player === token2) {
    	var value = -1000;
    	for (var i = 0; i < boardvals.length; i++) {
        	if (boardvals[i] == '') {
        		boardvals[i] =token2;
        		var newvalue = minimax(depth + 1, token1);
        		boardvals[i] = '';
         		value = (newvalue > value) ? newvalue : value;
        		if(depth == ailevel){
          			return value;
        		}
        	}      
   		}
   		return value;
  		} 
  		else {
    	var value = 1000;
    	for (var i = 0; i < boardvals.length; i++) {
        	if (boardvals[i] == '') {
        		boardvals[i] =token1;
        		var newvalue = minimax(depth + 1, token2);
        		boardvals[i] = '';
         		value = (newvalue < value) ? newvalue : value;
        		if(depth == ailevel){
          			return value;
        		}
        	}      
   		}
    	return value;
  		}
	}

	function startgame(isAI) {
		reset.style.display = 'block';
		boardvals = ['', '', '', '', '', '', '', '', ''];
		game.style.display = 'block';
		for (var i = 0; i < boardvals.length; i++) {
			let check = document.createElement('BUTTON');
			check.className = 'check';
			check.value = boardvals[i];
			check.innerText = check.value;
			board.appendChild(check);
		}

		
		if(isAI) {
			var checks = document.querySelectorAll('.check');
			for (var i = 0; i < checks.length; i++) {
				gamet.innerText = 'Vs Computer';
				checks[i].addEventListener('click', function() {
				this.value = token1;
				this.innerText = token1;
				this.disabled = true;
				boardp();
				var resultval = isgameended(boardvals);
				if (resultval) {
					var message;
					if (resultval == 1) {
						message = 'Computer Player won!';
					}
					else if (resultval == -1) {
						message = 'You Won !';
					}
					else {
						message = 'It\'s a Tie !';
					}
					rtext.innerText = message;
					setTimeout(function() {
						alerta.play();
						result.style.display = 'block';
						clearboard();
						reset.style.display = 'block';
						startgame(true);
					}, 700);
					

				}
				else{
					var move = aimove();
					checks[move].value = token2;
					checks[move].innerText = token2;
					checks[move].disabled = true;
					boardp();

				}

				var resultval = isgameended(boardvals);
				if (resultval) {
					var message;
					if (resultval == 1) {
						message = 'Computer Player won!';
					}
					else if (resultval == -1) {
						message = 'You Won !';
					}
					else {
						message = 'It\'s a Tie !';
					}
					rtext.innerText = message;
					setTimeout(function() {
						alerta.play();
						result.style.display = 'block';
						clearboard();
						reset.style.display = 'block';
						startgame(true);
					}, 700);

				}
		});
	}
		} 
		else {
			var checks = document.querySelectorAll('.check');
			var current_player = token1;
			gamet.innerText = token1 + '\'s Turn';
			for (var i = 0; i < checks.length; i++) {
				checks[i].addEventListener('click', function() {
					
					this.value = current_player;
					this.innerText = current_player;
					this.disabled = true;
					boardp(); 
					gamet.innerText = (current_player == token1) ? token2 + '\'s Turn' : token1 + '\'s Turn';
					var resultval = isgameended();
					if (resultval) {
						var message;
						if (resultval == 1) {
							message = 'Player 1 won !';
						}
						else if (resultval == -1) {
							message = 'Player 2 won !';
						}
						else {
							message = 'It\'s a Tie !'
						}
						rtext.innerText = message;
						setTimeout(function() {
							alerta.play();
							result.style.display = 'block';
							clearboard();
							reset.style.display = 'block';
							startgame(false);
						}, 700);
					}
					current_player = (current_player == token1) ? token2 : token1;
				});
			}
		}
	}

	vs_player.addEventListener('click', function() {
		
		tokenselect.style.display = 'block';
		xtoken.addEventListener('click', function() {
			token1 = 'X';
			token2 = 'O';
			startgame(false);
		});
		otoken.addEventListener('click', function() {
			token2 = 'X';
			token1 = 'O';
			startgame(false);
		});


	});

	reset.addEventListener('click', function() {
		if (gamet.innerText === 'Vs Computer') {
			clearboard();
			this.style.display = 'block';
			startgame(true);
		}
		else{
			clearboard();
			this.style.display = 'block';
			startgame(false);
		}
	});

	novice.addEventListener('click', function() {
		ailevel = 0;
		novicea.play();
		startgame(true);
	});

	master.addEventListener('click', function() {
		ailevel = 2;
		mastera.play();
		startgame(true);
	});

	grandmaster.addEventListener('click', function() {
		ailevel = -1;
		beasta.play();
		startgame(true);
	});

	vs_ai.addEventListener('click', function() {
		tokenselectai.style.display = 'block';
		axtoken.addEventListener('click', function() {			
			// tokenselect.style.display = 'none';
			token1 = 'X';
			token2 = 'O';
			levels.style.display = 'block';
		});
		aotoken.addEventListener('click', function() {
			// tokenselect.style.display = 'none';
			token2 = 'X';
			token1 = 'O';
			levels.style.display = 'block';
		});



		
	});


	window.addEventListener('click', function(ev) {
		var drop = document.createElement('DIV');
		drop.className = 'drop';
		drop.style.top = ev.clientY +'px';
		drop.style.left = ev.clientX + 'px';
		document.body.appendChild(drop);
		click.play();
		setTimeout(function() {
			click.currentTime = 0;
			click.pause();
		}, 200);
		setTimeout(function() {
			document.body.removeChild(drop);
		},600)
	});

	cont.addEventListener('click', function() {
		this.parentNode.style.display = 'none';
	});

}
