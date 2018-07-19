//inject game ui into the empty div
document.getElementById("hangman-game").innerHTML = '<div class="wrapper">\
<h1>Welcome to Hangman: <span id="space-edition">Space Edition</span></h1>\
<div id="stats">\
	<h2 class="first-row" id="guesses-left-title" >Guesses Left: <span id="guesses-left">0</span></h2>\
	<h2 class="first-row" id="wins">Wins: <span id="wins-counter">0</span></h2>\
	<h2 class="first-row" id="losses">Losses: <span id="losses-counter">0</span></h2>\
	<div id="volume-container"><img id="volume" src="./assets/images/unmuted.png"/></div>\
	</div>\
<div class="game-space">\
	<img id="rocketpic" src="assets/images/space-ship.jpg" alt="Rocket Pic"/>\
	<div class="guessed-word-container">\
		<span id="target-word">Press Any Key to Start</span>\
		<span id="status"></span>\
	</div>\
</div>\
<div class="letter-history">\
	<div class="last-guess-container">\
		<p class="help-text">Last Guess</p>\
		<span id="last-letter"></span>\
	</div>\
	<div class="guessed-letters-container">\
		<p class="help-text">Guessed Letters:</p>\
		<span id="guessed-letters"></span>\
	</div>\
</div>\
</div>\
<audio class="sfx" id="bgloop" src="assets/music/straight.mp3" loop="loop"></audio>\
<audio class="sfx" id="correct" src="assets/music/correct.mp3"></audio>\
<audio class="sfx" id="you-win" src="assets/music/you_win.mp3"></audio>\
<audio class="sfx" id="you-lose" src="assets/music/you_lose.mp3" loop="loop"></audio>\
<audio class="sfx" id="error" src="assets/music/error.mp3"></audio>\
<audio class="sfx" id="start-game" src="assets/music/start_game.mp3"></audio>\
<audio class="sfx" id="glass-break" src="assets/music/glass_break.mp3"></audio>';

//make the entire hangman game an object
var hangmanGame = {
	//initialize variables
	playmusic: true,
	sfx: document.getElementsByClassName("sfx"),
	guessesLeft: null,  //Number of guesses that the player has left to correctly display the word
	wordBank: ["asteroid","astronaut","big bang theory","alien","aurora borealis","black hole","comet","cosmology","dwarf planet","eclipse","extraterrestrial","horizon","galaxy","gravity","jupiter","lunar","mars","meteor","milky way","moon", "nasa","nebula","nova","orbit","penumbra","planet","pulsar","quasar","rocket","satellite","shuttle","sun","supernova","solar system","terraform","uranus","venus","mercury","earth","neptune","saturn","cosmos","radiation","space station","universe","the big dipper","star","constellation","umbra","zenith","aphelion","apogee","caldera","cosmic ray","crater","dark matter","gamma ray","heliosphere","parallax","red giant","solar flare","solstice","white dwarf"], //an array of words that are used to play the game
	guessedLetters: null, //an array of previously guessed letters
	targetWord: null, //the word the player is trying to guess
	targetWordArray: null, //the target word in an array
	chosenLetter: null, //the letter the player guessed
	wins: 0, //number of wins
	losses: 0, //number of loses
	blankSpaces: null, // the number of blank spaces to show
	blankArray: null, //the array shown to player, initialized with dashes
	gameState: false, //true means an active game is being played. false means a game has just ended
	spaceshipOpacity: null, //lower the opacity of the spaceship image every time the player guesses wrong
	spaceshipGrayscale: null, //when the player loses change change the spaceship image to black and white

	onKeyPress: function (event){
		if (this.gameState){
			this.chosenLetter = event.key;
			if (/^[a-z]$/.test(this.chosenLetter)){  //check if the input is a valid key (lower case letter and not a symbol)
				if (this.guessedLetters.indexOf(this.chosenLetter) === -1){ //if the chosen letter has not been guessed yet
					this.guessedLetters.push(this.chosenLetter);// add guessed letter to guessed letter array
					if (this.targetWord.includes(this.chosenLetter)){ //if guessed letter is in the target word
						this.replaceBlanks(this.chosenLetter); //replace blanks with correctly guessed letter i.e. guessing "u" in "zulu" would show "_u_u" 
						this.updateGFXSFXCorrect();  //update graphics and play sfx
					}
					else{  
						this.guessesLeft--; //subtract one guess
						this.updateGFXSFXIncorrect(); //update graphics and play sfx	
					};
	
					//check win/loss conditions
					if (this.blankSpaces === 0){// player wins
						this.wins++;  //increment the win counter
						this.gameState = false;
						this.updateGFXSFXWin();
					}
					else if (this.guessesLeft <= 0){ //player loses
						this.losses++;  //increment the loss counter
						this.gameState = false;
						this.updateGFXSFXLose();
					}
					else{}; //continue playing the game
				}
				else{  //if the chosen letter has already been guessed
					this.playSFX("error");
				};
			}
			else{ //invalid letter chosen
				this.playSFX("error");
			};
		}
		else{ //start a new game
			this.initializeGame();
		};
	},//end onKeyPressFunction

	initializeGame: function (){
		//reset variables when the game starts
		this.guessesLeft = 6;
		this.guessedLetters = [];
		this.blankSpaces = 0;

		//select a new target word
		this.ran_num = Math.floor(Math.random() * this.wordBank.length); //select a random number from 0 to wordBank.length-1
		this.targetWord = this.wordBank[this.ran_num];	//assign a letter from the wordBank to the target word
		this.targetWordArray = this.targetWord.split(""); //split the target word by letter
		this.blankArray = this.targetWordArray.slice(); //create a new array with the same contents
		for (var i=0; i<this.targetWordArray.length ;i++){ //fill in the blank array with dashes i.e. ["i"," ","a","m"] becomes ["-"," ","-","-"]
			if (this.targetWordArray[i] !== " "){
				this.blankArray[i]="-";
				this.blankSpaces++;
			}
		};
		this.gameState = true; //change game state to play game

		//update graphics
		this.spaceshipOpacity = 1;
		this.spaceshipGrayscale = 100;
		document.getElementById("guesses-left").innerHTML = this.guessesLeft;
		document.getElementById("target-word").innerHTML = this.blankArray.join("");
		document.getElementById("status").innerHTML = "";	
		document.getElementById("last-letter").innerHTML = "";
		document.getElementById("guessed-letters").innerHTML = "";
		document.getElementById("rocketpic").style.opacity = "1";
		document.getElementById("rocketpic").style.filter = "grayscale(0%)";
		//handle sfx
		document.getElementById("you-lose").pause();
		document.getElementById("you-lose").currentTime = 0;
		this.playSFX("start-game");		
	},// end initializeGame function

	//function to play sound effect
	playSFX: function(elementId){
		document.getElementById(elementId).pause();
		document.getElementById(elementId).currentTime = 0;
		document.getElementById(elementId).play();	
	},

	//function to replace dashes with correctly chosen letter
	replaceBlanks: function(letter){
		for (var i=0; i<this.targetWordArray.length ;i++){
			if (this.targetWordArray[i] === letter){
				this.blankArray[i] = letter;
				this.blankSpaces--;
			};
		};		
	},

	updateGFXSFXCorrect: function(){
		document.getElementById("target-word").innerHTML = this.blankArray.join("");
		document.getElementById("last-letter").innerHTML = this.chosenLetter;
		document.getElementById("guessed-letters").innerHTML = this.guessedLetters;	
		this.playSFX("correct")
	},

	updateGFXSFXIncorrect: function(){
		if (this.guessesLeft > 0){
			this.spaceshipOpacity -= .12;	//lower the spaceship's opacity
		};
		document.getElementById("rocketpic").style.opacity = this.spaceshipOpacity;
		document.getElementById("guesses-left").innerHTML = this.guessesLeft;
		document.getElementById("last-letter").innerHTML = this.chosenLetter;
		document.getElementById("guessed-letters").innerHTML = this.guessedLetters;		
		this.playSFX("glass-break");
	},

	updateGFXSFXWin: function(){
		document.getElementById("wins-counter").innerHTML = this.wins;
		document.getElementById("status").innerHTML = "You Win! Press any key to play again.";
		this.playSFX("you-win");
	},

	updateGFXSFXLose: function(){
		document.getElementById("rocketpic").style.filter = "grayscale(100%)";
		document.getElementById("losses-counter").innerHTML = this.losses;
		document.getElementById("status").innerHTML = 'You Lose! The word was "' + this.targetWord + '". Press any key to play again.';
		this.playSFX("you-lose");
	},


}; //hangmanGame object end


//cycle game logic on an onkeydown event
document.onkeydown = function(event){
	hangmanGame.onKeyPress(event);
}


//toggle mute button
document.getElementById("volume").onclick = function() {

	if (hangmanGame.playmusic === true){  //change image based on mute or unmute
		document.getElementById("volume").src="./assets/images/muted.png";
	}
	else{
		document.getElementById("volume").src="./assets/images/unmuted.png"	;
	}
	hangmanGame.playmusic = !hangmanGame.playmusic
	for (var i=0; i < hangmanGame.sfx.length ; i++){
		hangmanGame.sfx[i].muted = !hangmanGame.sfx[i].muted;  //toggle mute
	}
};


//play background music on load
window.onload = function() {
	document.getElementById("bgloop").play();   
};