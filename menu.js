// Leírás
const description = document.querySelector("#description")
const desBtn  = document.querySelector("#desBtn")
desBtn.addEventListener("click", showDescription)

function showDescription(){
    if(description.style.visibility === "visible"){
        description.style.visibility = "hidden"
    } else {
        description.style.visibility = "visible"
    }
}

// Kártya bemenet maximum számának változtatása
const cardCounter = document.querySelector("#cardCounter")
const playerCounter = document.querySelector("#playerCounter")
playerCounter.addEventListener("input",changeCardMax)
cardCounter.addEventListener("input",changeToValid)
changeCardMax()
changeToValid()

function changeCardMax(){
    const playerCount = document.querySelector("#playerCounter").value
    const new_max = 24 / playerCount
    cardCounter.max = new_max
    if (cardCounter.value > new_max){
        cardCounter.value = new_max
    }
    changeToValid()
}

function changeToValid(){
    const new_max = 24 / playerCounter.value
    if (cardCounter.value > new_max){
        cardCounter.value = new_max
    }
    if (playerCounter.value > playerCounter.max){
        playerCounter.value = playerCounter.max
    }
}