//Full array of possible cards
var cards;

function getCards(){
	cards = [
		{ 
			"suit": "clubs",
			"name": "2",
			"src": "images/blackjack/clubs/Clubs-2.png",
			"value": 2
		},
		{ 
			"suit": "clubs",
			"name": "3",
			"src": "images/blackjack/clubs/Clubs-3.png",
			"value": 3
		},
		{ 
			"suit": "clubs",
			"name": "4",
			"src": "images/blackjack/clubs/Clubs-4.png",
			"value": 4
		},
		{ 
			"suit": "clubs",
			"name": "5",
			"src": "images/blackjack/clubs/Clubs-5.png",
			"value": 5
		},
		{ 
			"suit": "clubs",
			"name": "6",
			"src": "images/blackjack/clubs/Clubs-6.png",
			"value": 6
		},
		{ 
			"suit": "clubs",
			"name": "7",
			"src": "images/blackjack/clubs/Clubs-7.png",
			"value": 7
		},
		{ 
			"suit": "clubs",
			"name": "8",
			"src": "images/blackjack/clubs/Clubs-8.png",
			"value": 8
		},
		{ 
			"suit": "clubs",
			"name": "9",
			"src": "images/blackjack/clubs/Clubs-9.png",
			"value": 9
		},
		{ 
			"suit": "clubs",
			"name": "10",
			"src": "images/blackjack/clubs/Clubs-10.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "ace",
			"src": "images/blackjack/clubs/Clubs-Ace.png",
			"value": 11
		},
		{ 
			"suit": "clubs",
			"name": "jack",
			"src": "images/blackjack/clubs/Clubs-Jack.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "king",
			"src": "images/blackjack/clubs/Clubs-King.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "queen",
			"src": "images/blackjack/clubs/Clubs-Queen.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "2",
			"src": "images/blackjack/diamond/Diamond-2.png",
			"value": 2
		},
		{ 
			"suit": "diamonds",
			"name": "3",
			"src": "images/blackjack/diamond/Diamond-3.png",
			"value": 3
		},
		{ 
			"suit": "diamonds",
			"name": "4",
			"src": "images/blackjack/diamond/Diamond-4.png",
			"value": 4
		},
		{ 
			"suit": "diamonds",
			"name": "5",
			"src": "images/blackjack/diamond/Diamond-5.png",
			"value": 5
		},
		{ 
			"suit": "diamonds",
			"name": "6",
			"src": "images/blackjack/diamond/Diamond-6.png",
			"value": 6
		},
		{ 
			"suit": "diamonds",
			"name": "7",
			"src": "images/blackjack/diamond/Diamond-7.png",
			"value": 7
		},
		{ 
			"suit": "diamonds",
			"name": "8",
			"src": "images/blackjack/diamond/Diamond-8.png",
			"value": 8
		},
		{ 
			"suit": "diamonds",
			"name": "9",
			"src": "images/blackjack/diamond/Diamond-9.png",
			"value": 9
		},
		{ 
			"suit": "diamonds",
			"name": "10",
			"src": "images/blackjack/diamond/Diamond-10.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "ace",
			"src": "images/blackjack/diamond/Diamond-Ace.png",
			"value": 11
		},
		{ 
			"suit": "diamonds",
			"name": "jack",
			"src": "images/blackjack/diamond/Diamond-Jack.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "king",
			"src": "images/blackjack/diamond/Diamond-King.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "queen",
			"src": "images/blackjack/diamond/Diamond-Queen.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "2",
			"src": "images/blackjack/hearts/Hearts-2.png",
			"value": 2
		},
		{ 
			"suit": "hearts",
			"name": "3",
			"src": "images/blackjack/hearts/Hearts-3.png",
			"value": 3
		},
		{ 
			"suit": "hearts",
			"name": "4",
			"src": "images/blackjack/hearts/Hearts-4.png",
			"value": 4
		},
		{ 
			"suit": "hearts",
			"name": "5",
			"src": "images/blackjack/hearts/Hearts-5.png",
			"value": 5
		},
		{ 
			"suit": "hearts",
			"name": "6",
			"src": "images/blackjack/hearts/Hearts-6.png",
			"value": 6
		},
		{ 
			"suit": "hearts",
			"name": "7",
			"src": "images/blackjack/hearts/Hearts-7.png",
			"value": 7
		},
		{ 
			"suit": "hearts",
			"name": "8",
			"src": "images/blackjack/hearts/Hearts-8.png",
			"value": 8
		},
		{ 
			"suit": "hearts",
			"name": "9",
			"src": "images/blackjack/hearts/Hearts-9.png",
			"value": 9
		},
		{ 
			"suit": "hearts",
			"name": "10",
			"src": "images/blackjack/hearts/Hearts-10.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "ace",
			"src": "images/blackjack/hearts/Hearts-Ace.png",
			"value": 11
		},
		{ 
			"suit": "hearts",
			"name": "jack",
			"src": "images/blackjack/hearts/Hearts-Jack.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "king",
			"src": "images/blackjack/hearts/Hearts-King.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "queen",
			"src": "images/blackjack/hearts/Hearts-Queen.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "2",
			"src": "images/blackjack/spades/Spades-2.png",
			"value": 2
		},
		{ 
			"suit": "spades",
			"name": "3",
			"src": "images/blackjack/spades/Spades-3.png",
			"value": 3
		},
		{ 
			"suit": "spades",
			"name": "4",
			"src": "images/blackjack/spades/Spades-4.png",
			"value": 4
		},
		{ 
			"suit": "spades",
			"name": "5",
			"src": "images/blackjack/spades/Spades-5.png",
			"value": 5
		},
		{ 
			"suit": "spades",
			"name": "6",
			"src": "images/blackjack/spades/Spades-6.png",
			"value": 6
		},
		{ 
			"suit": "spades",
			"name": "7",
			"src": "images/blackjack/spades/Spades-7.png",
			"value": 7
		},
		{ 
			"suit": "spades",
			"name": "8",
			"src": "images/blackjack/spades/Spades-8.png",
			"value": 8
		},
		{ 
			"suit": "spades",
			"name": "9",
			"src": "images/blackjack/spades/Spades-9.png",
			"value": 9
		},
		{ 
			"suit": "spades",
			"name": "10",
			"src": "images/blackjack/spades/Spades-10.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "ace",
			"src": "images/blackjack/spades/Spades-Ace.png",
			"value": 11
		},
		{ 
			"suit": "spades",
			"name": "jack",
			"src": "images/blackjack/spades/Spades-Jack.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "king",
			"src": "images/blackjack/spades/Spades-King.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "queen",
			"src": "images/blackjack/spades/Spades-Queen.png",
			"value": 10
		}
	]
}