document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const highscorecDisplay = document.getElementById("highscorec");
    const coinsDisplay = document.getElementById("coins");
    const width = 8;
    const squares = [];

    let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;
    let highscorec = localStorage.getItem("highscorec") ? parseInt(localStorage.getItem("highscorec")) : 0;
    let score = 0;

    coinsDisplay.innerHTML = coins;
    highscorecDisplay.innerHTML = highscorec;
    scoreDisplay.innerHTML = score;

    const candyColors = [
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)",
    ];

    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();


    // Dragging the Candy
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
        square.addEventListener("drageleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        // this.style.backgroundImage = ''
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[
            squareIdBeingDragged
        ].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        //Defining, What is a valid move?
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[
                squareIdBeingReplaced
            ].style.backgroundImage = colorBeingReplaced;
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
        } else
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
    }

    function moveIntoSquareBelow() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
    
        // Controleer en vul de bovenste rij met nieuwe candy's
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }
    

    ///-> Checking for Matches <-///

    //For Row of Four
    function checkRowForFour() {
        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                coins += 4; // Bijvoorbeeld, 2 coins per match van 4
                scoreDisplay.innerHTML = score;
                coinsDisplay.innerHTML = coins;
                localStorage.setItem("coins", coins);
                    // Update de weergave van coins in de HTML
                document.getElementById("coins").textContent = coins;
                rowOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                if (score > highscorec) {
                    highscorec = score;
                    localStorage.setItem("highscorec", highscorec);
                    highscorecDisplay.innerHTML = highscorec;
                    document.getElementById("highscorec").textContent = highscorec;
                }
            }
        }
    }
    checkRowForFour();

    //For Column of Four
    function checkColumnForFour() {
        for (i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                coins += 4;
                scoreDisplay.innerHTML = score;
                coinsDisplay.innerHTML = coins;
                localStorage.setItem("coins", coins);
                    // Update de weergave van coins in de HTML
                document.getElementById("coins").textContent = coins;
                columnOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                    if (score > highscorec) {
                        highscorec = score;
                        localStorage.setItem("highscorec", highscorec);
                        highscorecDisplay.innerHTML = highscorec;
                        document.getElementById("highscorec").textContent = highscorec;
                    }
            }
        }
    }
    checkColumnForFour();

    //For Row of Three
    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6,
                7,
                14,
                15,
                22,
                23,
                30,
                31,
                38,
                39,
                46,
                47,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                coins += 3; // Bijvoorbeeld, 1 coin per match van 3
                scoreDisplay.innerHTML = score;
                coinsDisplay.innerHTML = coins;
                localStorage.setItem("coins", coins);
                    // Update de weergave van coins in de HTML
                document.getElementById("coins").textContent = coins;
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                if (score > highscorec) {
                    highscorec = score;
                    localStorage.setItem("highscorec", highscorec);
                    highscorecDisplay.innerHTML = highscorec;
                    document.getElementById("highscorec").textContent = highscorec;
                }
            }
        }
    }
    checkRowForThree();

    //For Column of Three
    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                coins += 3; // Bijvoorbeeld, 1 coin per match van 3
                scoreDisplay.innerHTML = score;
                coinsDisplay.innerHTML = coins;
                localStorage.setItem("coins", coins);
                    // Update de weergave van coins in de HTML
                document.getElementById("coins").textContent = coins;
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                if (score > highscorec) {
                    highscorec = score;
                    localStorage.setItem("highscorec", highscorec);
                    highscorecDisplay.innerHTML = highscorec;
                    document.getElementById("highscorec").textContent = highscorec;
                }
            }
        }
    }
    checkColumnForThree();


    window.setInterval(function () {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}