//play background music on load
window.onload = function() {
	document.getElementById("bgloop").play();   
};

//initialize variables
var keyFired = false;
var keyDownArray = [];
var playmusic = true;
var sfx = document.getElementsByClassName("sfx")  //get the array of sound effects
var guessesLeft;  //Number of guesses that the player has left to correctly display the word
var wordBank =["asteroid","astronaut","big bang theory","alien","aurora borealis","black hole","comet","cosmology","dwarf planet","eclipse","extraterrestrial","horizon","galaxy","gravity","jupiter","lunar","mars","meteor","milky way","moon", "nasa","nebula","nova","orbit","penumbra","planet","pulsar","quasar","rocket","satellite","shuttle","sun","supernova","solar system","terraform","uranus","venus","mercury","earth","neptune","saturn","cosmos","radiation","space station","universe","the big dipper","star","constellation","umbra","zenith","aphelion","apogee","caldera","cosmic ray","crater","dark matter","gamma ray","heliosphere","parallax","red giant","solar flare","solstice","white dwarf"]; //an array of words that are used to play the game
var guessedLetters; //an array of previously guessed letters
var targetWord; //the word the player is trying to guess
var targetWordArray; //the target word in an array
var chosenLetter; //the letter the player guessed
var wins = 0; //number of wins
var losses = 0; //number of loses
var blankSpaces; // the number of blank spaces to show
var blankArray; //the array shown to player, initialized with dashes
var gameState = false; //true means an active game is being played. false means a game has just ended
var spaceshipOpacity; //lower the opacity of the spaceship image every time the player guesses wrong
var spaceshipGrayscale; //when the player loses change change the spaceship image to black and white


//cycle game logic on an onkeydown event
document.onkeydown = function keyPress(event){

	if (gameState){
		chosenLetter = event.key;
		if (/[a-z]/.test(chosenLetter)){  //check if the input is a valid key (lower case letter and not a symbol)
			if (guessedLetters.indexOf(chosenLetter) === -1){ //if the chosen letter has not been guessed yet
				guessedLetters.push(chosenLetter);// add guessed letter to guessed letter array
				if (targetWord.includes(chosenLetter)){ //if guessed letter is in the target word
					replaceBlanks(chosenLetter) //replace blanks with correctly guessed letter i.e. guessing "u" in "zulu" would show "_u_u" 
					updateGFXSFXCorrect()  //update graphics and play sfx
				}
				else{  
					guessesLeft--; //subtract one guess
					updateGFXSFXIncorrect() //update graphics and play sfx	
				}

				//check win/loss conditions
				if (blankSpaces === 0){// player wins
					wins++;  //increment the win counter
					gameState = false;
					updateGFXSFXWin();
				}
				else if (guessesLeft <= 0){ //player loses
					losses++;  //increment the loss counter
					gameState = false;
					updateGFXSFXLose();
				}
				else{} //continue playing the game
			}
			else{  //if the chosen letter has already been guessed
				playSFX("error")
			}
		}
		else{ //invalid letter chosen
			playSFX("error")
		}
	}
	else{ //start a new game
		initializeGame()
	}
}

// document.onkeyup = function keyPress(event){
// 	if (event.key === chosenLetter){
// 		keyFired = false;		
// 	}
// }

//----------------Functions-------------------//


function initializeGame(){
	//reset variables when the game starts
	guessesLeft = 6;
	guessedLetters = [];
	blankSpaces = 0;

	//select a new target word
	ran_num = Math.floor(Math.random() * wordBank.length); //select a random number from 0 to wordBank.length-1
	targetWord = wordBank[ran_num];	//assign a letter from the wordBank to the target word
	targetWordArray = targetWord.split(""); //split the target word by letter
	blankArray = targetWordArray.slice(); //create a new array with the same contents
	for (var i=0; i<targetWordArray.length ;i++){ //fill in the blank array with dashes i.e. ["i"," ","a","m"] becomes ["-"," ","-","-"]
		if (targetWordArray[i] !== " "){
			blankArray[i]="-";
			blankSpaces++;
		}
	};
	gameState = true; //change game state to play game
	
	//update graphics
	spaceshipOpacity = 1;
	spaceshipGrayscale = 100;
	document.getElementById("guesses-left").innerHTML = guessesLeft;
	document.getElementById("target-word").innerHTML = blankArray.join("");
	document.getElementById("status").innerHTML = "";	
	document.getElementById("last-letter").innerHTML = "";
	document.getElementById("guessed-letters").innerHTML = "";
	document.getElementById("rocketpic").style.opacity = "1";
	document.getElementById("rocketpic").style.filter = "grayscale(0%)";
	//handle sfx
	document.getElementById("you-lose").pause();
	document.getElementById("you-lose").currentTime = 0;
	playSFX("start-game")
	//start accepting keypresses
	keyFired = false
}


//function to play sound effext
function playSFX(elementId){
	document.getElementById(elementId).pause();
	document.getElementById(elementId).currentTime = 0;
	document.getElementById(elementId).play();
}

//function to replace dashes with correctly chosen letter
function replaceBlanks(letter){
	for (var i=0; i<targetWordArray.length ;i++){
		if (targetWordArray[i] === letter){
			blankArray[i] = letter;
			blankSpaces--;
		};
	};
}


function updateGFXSFXCorrect(){ 
	document.getElementById("target-word").innerHTML = blankArray.join("");
	document.getElementById("last-letter").innerHTML = chosenLetter;
	document.getElementById("guessed-letters").innerHTML = guessedLetters;	
	playSFX("correct")
}

function updateGFXSFXIncorrect(){
	if (guessesLeft > 0){
		spaceshipOpacity -= .12;	//lower the spaceship's opacity
	};
	document.getElementById("rocketpic").style.opacity = spaceshipOpacity;
	document.getElementById("guesses-left").innerHTML = guessesLeft;
	document.getElementById("last-letter").innerHTML = chosenLetter;
	document.getElementById("guessed-letters").innerHTML = guessedLetters;		
	playSFX("glass-break")
}

function updateGFXSFXWin(){
	document.getElementById("wins-counter").innerHTML = wins;
	document.getElementById("status").innerHTML = "You Win! Press any key to play again.";
	playSFX("you-win")
}

function updateGFXSFXLose(){
	document.getElementById("rocketpic").style.filter = "grayscale(100%)";
	document.getElementById("losses-counter").innerHTML = losses;
	document.getElementById("status").innerHTML = 'You Lose! The word was "' + targetWord + '". Press any key to play again.';
	playSFX("you-lose")
}

//toggle mute button
document.getElementById("volume").onclick = function() {

	if (playmusic === true){  //change image based on mute or unmute
		document.getElementById("volume").src="./assets/images/muted.png"
	}
	else{
		document.getElementById("volume").src="./assets/images/unmuted.png"	
	}
	playmusic = !playmusic
	for (var i=0; i < sfx.length ; i++){
		sfx[i].muted = !sfx[i].muted  //toggle mute
	}
};