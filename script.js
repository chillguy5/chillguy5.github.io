var character = document.getElementById("character");
var block = document.getElementById("block");
function jump(){
    if (character.classList != "animate") {
        character.classList.add("animate"); 
    }
    setTimeout(function(){
        character.classList.remove("animate");
    },500);
}

var checkDead = setinterval(function(){
    var characterTop =
    parseInt(window.getComputedStyle(character).getPropertyvalue("top"));
    var blockLeft =
    parseInt(window.getComputedStyle(block).getPropertyvalue("left"));
    if (blockLeft<20 && blockLeft>0 &&characterTop>=130) {
        block.style.animation = "none";
        block.style.display = "none";
        alert("U lose")
    }
},10)