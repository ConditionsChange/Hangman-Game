window.onload = function() {
	//play background music on load
    document.getElementById("loop").play();       
};


//initialize variables
var guesses_left;  //Number of guesses that the player has left to correctly display the word
var word_bank =["asteroid","astronaut","big bang theory","alien","aurora borealis","black hole","comet","cosmology","dwarf planet","eclipse","extraterrestrial","horizon","galaxy","gravity","jupiter","lunar","mars","meteor","milky way","moon", "nasa","nebula","nova","orbit","penumbra","planet","pulsar","quasar","rocket","satellite","shuttle","sun","supernova","solar system","terraform","uranus","venus","mercury","earth","neptune","saturn","cosmos","radiation","space station","universe","the big dipper","star","constellation","umbra","zenith","aphelion","apogee","caldera","cosmic ray","crater","dark matter","gamma ray","heliosphere","parallax","red giant","solar flare","solstice","white dwarf"]; //an array of words that are used to play the game
var guessed_letters; //an array of previously guessed letters
var target_word; //the word the player is trying to guess
var target_word_array; //the target word in an array
var chosen_letter; //the letter the player guessed
var wins = 0;
var losses = 0;
var blank_spaces; // the number of blank spaces to show
var blank_array; //the array shown to player, initialized with dashes
var gamestate = "page load"; //3 states: page load, play game, results screen
var spaceship_opacity; //lower the opacity of the spaceship image every time the player guesses wrong
var spaceship_grayscale; //when the player loses change change the spaceship image to black and white
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];



function initialize_game(){
//reset variables when the game starts
guesses_left =6;
guessed_letters = [];
blank_spaces =0;
spaceship_opacity = 1;
spaceship_grayscale=100;
//select a new target word
ran_num = Math.floor(Math.random() * word_bank.length); //select a random number from 0 to word_bank.length-1
target_word = word_bank[ran_num];	//assign a letter from the word_bank to the target word
target_word_array = target_word.split(""); //split the target word by letter
blank_array = target_word_array.slice(); //create a new array with the same contents
for (var i=0;i<target_word_array.length;i++){ //fill in the blank array with dashes
	if (target_word_array[i] === " "){
	blank_array[i]=" ";	
	}
	else{
	blank_array[i]="-";
	blank_spaces++;
	};
};
gamestate = "play game"; //change game state to play game

//update graphics
document.getElementById("guesses_left").innerHTML = guesses_left;//change guesses left to 6
document.getElementById("target_word").innerHTML = blank_array.join(""); //change the target words to blanks
document.getElementById("status").innerHTML = "";	
document.getElementById("last-letter").innerHTML = "";
document.getElementById("guessed_letters").innerHTML = "";//change guesses left to 6
document.getElementById("rocketpic").style.opacity = "1";
document.getElementById("rocketpic").style.filter = "grayscale(0%)";
//stop all music
document.getElementById("you_lose").pause();
document.getElementById("you_lose").currentTime = 0;
//then play sfx
document.getElementById("start_game").play();
}


//after every key pressed run code based on what the game state is
document.onkeyup = function keyPress(event){


	console.log("A key was just pressed");
	
	if (gamestate === "page load"){
		initialize_game();
	}
	
	else if (gamestate === "play game"){
		chosen_letter = event.key;	//get user keystroke

		if ((guessed_letters.indexOf(chosen_letter)) === -1 && (alphabet.indexOf(chosen_letter)>-1 )){ //if the chosen letter is not in the guessed letter pool and is a valid key
					if (target_word.includes(chosen_letter)){ //if guessed letter is in the target word
						console.log("correct letter guess");
						guessed_letters.push(chosen_letter);// add guessed letter to guessed letter array
						//replace blanks with correctly guessed letter
						var indices = [];
						for (var i=0;i<target_word_array.length;i++){
							if (target_word_array[i] === chosen_letter){
								blank_array[i] = chosen_letter;
								blank_spaces--;
							};
						};
						//update graphics
						document.getElementById("target_word").innerHTML = blank_array.join("");
						document.getElementById("last_letter").innerHTML = event.key;
						document.getElementById("guessed_letters").innerHTML = guessed_letters;	
						//play sfx
						document.getElementById("correct").pause();
						document.getElementById("correct").currentTime = 0;
    					document.getElementById("correct").play();
					}
					else{ ///if the guessed letter is not in the target word
						console.log("incorrect letter guess");
						guessed_letters.push(chosen_letter); // add guessed letter to guessed letter array
						guesses_left--;//subtract one guess chance
						if (guesses_left > 0){
							spaceship_opacity -= .12;//lower spaceship opacity
						};
						//update graphics
						document.getElementById("rocketpic").style.opacity = spaceship_opacity;
						document.getElementById("guesses_left").innerHTML = guesses_left;
						document.getElementById("last-letter").innerHTML = event.key;
						document.getElementById("guessed_letters").innerHTML = guessed_letters;		
						//play sfx
						document.getElementById("glass_break").pause();
						document.getElementById("glass_break").currentTime = 0;
    					document.getElementById("glass_break").play();					
					};

					//check win-loss conditions
					if (blank_spaces === 0){//you win
						console.log("player wins");
						wins++;//increment the win counter
						gamestate = "results screen";
						//update graphics
						document.getElementById("wins-counter").innerHTML = wins;
						document.getElementById("status").innerHTML = "You Win! Press any key to play again.";
						// play sfx
    					document.getElementById("you_win").play();								
					}
					else if (guesses_left <= 0){ //you lose
						console.log("player loses");
						losses++;//increment the loss counter
						gamestate = "results screen";
						//update graphics
						document.getElementById("rocketpic").style.filter = "grayscale(100%)";
						document.getElementById("losses-counter").innerHTML = losses;
						document.getElementById("status").innerHTML = 'You Lose! The word was "' + target_word + '". Press any key to play again.';
						//play sfx
						document.getElementById("you_lose").play();
					}
					else{
					};
		}
		else{
			console.log("letter already previously chosen or key pressed was not a letter");
			//play sfx
			document.getElementById("error").pause();
			document.getElementById("error").currentTime = 0;
    		document.getElementById("error").play();
		};
		
	}
	else if (gamestate === "results screen")
	{
			initialize_game();	
	}
	else{	
	};

	console.log("gamestate =  " + gamestate)//console log gamestate after every key press
};