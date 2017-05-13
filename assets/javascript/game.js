//initialize variables
var guesses_left;  //Number of guesses that the player has left to correctly display the word
var word_bank =["asteroid","astronaut","astronomer","astronomy","big bang theory"]; //an array of words that are used to play the game
var guessed_letters; //an array of previously guessed letters
var target_word
var target_word_array
var chosen_letter
var wins = 0;
var losses = 0;
var blank_spaces // the number of blank spaces to show
var blank_array
var gamestate = "page load";
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];



function initialize_game(){
//reset variables
guesses_left =6;
guessed_letters = [];
blank_spaces =0;
//select a new target word
ran_num = Math.floor(Math.random() * (word_bank.length)) + 0
target_word = word_bank[ran_num]	//assign a letter from the word_bank to the target word
target_word_array = target_word.split("") //split the target word by letter
blank_array = target_word_array.slice(); //blank_array is not the same array as target_word_array
for (var i=0;i<target_word_array.length;i++){ //fill in the blank array with dashes
	if (target_word_array[i] === " "){
	blank_array[i]=" "		
	}
	else{
	blank_array[i]="-"
	blank_spaces++
	}
}
gamestate = "play game"; //change game state to play game

//update graphics
document.getElementById("guesses_left").innerHTML = guesses_left;//change guesses left to 6
document.getElementById("target_word").innerHTML = blank_array.join(""); //change the target words to blanks
document.getElementById("status").innerHTML = "";	
document.getElementById("last_letter").innerHTML = "";
document.getElementById("guessed_letters").innerHTML = "";//change guesses left to 6
}



document.onkeyup = function keyPress(event){
	
	if (gamestate === "page load"){
		initialize_game();
	}
	
	else if (gamestate === "play game"){
		chosen_letter = event.key;	//get user keystroke

		if ((guessed_letters.indexOf(chosen_letter)) === -1 && (alphabet.indexOf(chosen_letter)>-1 )){ //if the chosen letter is not in the guessed letter pool and is a valid key
					if (target_word.includes(chosen_letter)){ //if guessed letter in target words
						console.log("new guessed letter")
						// if it is, show the letter on the webpage
						guessed_letters.push(chosen_letter);// add guessed letter to guessed letter array
						
						//replace blanks with correctly guessed letter
						var indices = [];
						for (var i=0;i<target_word_array.length;i++){
							if (target_word_array[i] === chosen_letter){
								blank_array[i] = chosen_letter;
								blank_spaces--
							}
						}
						//update graphics
						document.getElementById("target_word").innerHTML = blank_array.join("");
						document.getElementById("last_letter").innerHTML = event.key;
						document.getElementById("guessed_letters").innerHTML = guessed_letters;	
					}
					else{ ///if the guessed letter is not in the target word
						guessed_letters.push(chosen_letter);
						guesses_left--
						//update graphics
						document.getElementById("guesses_left").innerHTML = guesses_left;
						document.getElementById("last_letter").innerHTML = event.key;
						document.getElementById("guessed_letters").innerHTML = guessed_letters;							
					}

					//check win-loss conditions
					if (guesses_left <= 0){
						losses++;
						gamestate = "results screen";
						//update graphics
						document.getElementById("losses").innerHTML = losses;
						document.getElementById("status").innerHTML = 'You Lose! The word was "' + target_word + '". Press any key to play again';
					}
					else if (blank_spaces === 0){
						wins++;
						gamestate = "results screen";
						//update graphics
						document.getElementById("wins").innerHTML = wins;
						document.getElementById("status").innerHTML = "You Win! The word was " +target_word+ "Press any key to play again";				
						//show you win in status bar press anything to play again			
					}
					else{
					}
		}
		else{
			console.log("Letter already previously chosen or key pressed was not a letter")
		}
		
	}
	else if (gamestate === "results screen")
	{
			initialize_game();	
	}
	else{	
	}
//after every keypress print to the console the key variables in the game
console.log("A key was just pressed")
console.log("gamestate =  " + gamestate)
}

