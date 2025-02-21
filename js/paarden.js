/*
Assignment: Javascript Assignment
Filename: game.js
@author: KITSANTAS FOTIOS (17421808)
Date: 30/04/17
*/

/*Create a Javascript Object for a horse with 3 parameters: HTML ID, position x and y*/
function Horse(id, x, y){
	this.element = document.getElementById(id);/*HTML element of the horse*/
	this.speed = Math.random()*10 + 10; /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is between 10 and 20*/
	this.originX = x;/*Original X position*/
	this.originY = y;/*Original Y position*/
	this.x = x; /*Current X*/
	this.y = y; /*Current Y*/
	this.number = parseInt(id.replace(/[\D]/g, '')); /*Number of horse, number will be 1 or 2 or 3 or 4*/
	this.lap = 0; //Current lap of the horse

	this.moveRight = function(){
		var horse = this;/*Assign horse to this object*/

		/*Use setTimeout to have the delay in moving the horse*/
		setTimeout(function(){
			//Move the horse to right 1vw
			horse.x ++;
			horse.element.style.left = horse.x +'vw';

			//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (horse.lap == num_lap && horse.x > horse.originX + 6){
				horse.arrive();
			}else{
				//Make decision to move Down or not
				//The width of the Down Road is 10wh, then the distance of each horse is 2.5vw (4 horses). The right position of the road is 82.5vw
				//Continue to move right if not reach the point to turn
				if (horse.x < 82.5 - horse.number*2.5){
					horse.moveRight();
				}else{
					//Change HTML class of horse to runDown
					horse.element.className = 'horse runDown';
					//Change the speed, will be random value from 10 to 20
					horse.speed = Math.random()*10 + 10;
					horse.moveDown();
				}
			}

		}, 1000/this.speed);
		/* 1000/this.speed is timeout time*/
	}

	/*Do the same for moveDown, moveLeft, moveUp*/
	this.moveDown = function(){
		var horse = this;
		setTimeout(function(){
			horse.y ++;
			horse.element.style.top = horse.y +'vh';
			if (horse.y < horse.originY + 65){
				horse.moveDown();
			}else{
				horse.element.className = 'horse runLeft';
				horse.speed = Math.random()*10 + 10;
				horse.moveLeft();
			}
		}, 1000/this.speed)
	}
	this.moveLeft = function(){
		var horse = this;
		setTimeout(function(){
			horse.x --;
			horse.element.style.left = horse.x +'vw';
			if (horse.x > 12.5 - horse.number*2.5){
				horse.moveLeft();
			}else{
				horse.element.className = 'horse runUp';
				horse.speed = Math.random()*10 + 10;
				horse.moveUp();
			}
		}, 1000/this.speed)
	}
	this.moveUp = function(){
		var horse = this;
		setTimeout(function(){
			horse.y --;
			horse.element.style.top = horse.y +'vh';
			if (horse.y > horse.originY){
				horse.speed = Math.random()*10 + 10;
				horse.moveUp();
			}else{
				horse.element.className = 'horse runRight';
				//Nearly finish the lap
				horse.lap ++;
				horse.moveRight();
			}
		}, 1000/this.speed)
	}

	/*Trigger the horse by run*/
	this.run = function(){
		this.element.className = 'horse runRight';
		this.moveRight();
	}
	this.arrive = function(){
		//Stop the horse run by change class to standRight
		this.element.className = 'horse standRight';
		this.lap = 0;//Reset the lap

		/*Show the result*/
		var tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
		//results.length is the current arrive position
		tds[results.length].className = 'result horse'+this.number;//The class of result look like: result horse1...

		//Push the horse number to results array, according the the results array, we know the order of race results
		results.push(this.number);
	}
}

var num_lap = 1, results = [], coins = parseInt(localStorage.getItem('coins')) || 0, bethorse, amount;

// Update de weergave van coins bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('coins').innerText = coins; // Laat de juiste waarde zien
});

// Pas de coins aan en sla op in localStorage
function updateCoins(newAmount) {
    coins = newAmount;
    localStorage.setItem('coins', coins); // Opslaan in localStorage
    document.getElementById('coins').innerText = coins; // UI bijwerken
}

document.getElementById('start').onclick = function() {
    amount = parseInt(document.getElementById('amount').value);

    if (amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid positive bet amount.');
        return;
    }

    num_lap = parseInt(document.getElementById('num_lap').value);
    bethorse = parseInt(document.getElementById('bethorse').value);

    if (coins < amount) {
        alert('Not enough coins.');
    } else if (num_lap <= 0) {
        alert('Number of laps must be greater than 0.');
    } else {
        this.disabled = true;
        var tds = document.querySelectorAll('#results .result');
        for (var i = 0; i < tds.length; i++) {
            tds[i].className = 'result';
        }

        results = [];

        // Start de paardenrace
        horse1.run();
        horse2.run();
        horse3.run();
        horse4.run();
    }
};

// Pas updateCoins toe in arrive()
Horse.prototype.arrive = function() {
    this.element.className = 'horse standRight';
    this.lap = 0;

    var tds = document.querySelectorAll('#results .result');
    tds[results.length].className = 'result horse' + this.number;
    results.push(this.number);

    if (results.length == 1) {
        if (this.number == bethorse) {
            updateCoins(coins + amount * 4);
        } else {
            updateCoins(coins - amount);
        }
    } else if (results.length == 4) {
        document.getElementById('start').disabled = false;
    }
};