// Játéktér

// --------------------------------------------------------------------------------------------------------------------------------------------
// Változók
// --------------------------------------------------------------------------------------------------------------------------------------------
const BOARD_SIZE = 7 // A tábla mérete

// Alap selectorok
const startDiv = document.querySelector("#start")
const startBtn = document.querySelector("#startBtn")
const canvas = document.querySelector("#board")
const ctx = canvas.getContext("2d")
const game = document.querySelector("#game")
const gridSize = 60
const leftover = document.querySelector("#leftover")
const lctx = leftover.getContext("2d")
const phaseText = document.querySelector("#phaseText")
const newGameButton = document.querySelector("#new_game")

const tileType = { // A csempék típusai
    STRAIGHT : 0,
    TURN : 1,
    FORK : 2
}

const player = { // A játékosok színei
    BLUE : 0,
    RED : 1,
    GREEN : 2,
    YELLOW : 3
}

const phaseType = { // Játék állapota
    BLUE_PUSH : 10,
    BLUE_STEP : 11,
    RED_PUSH : 20,
    RED_STEP : 21,
    GREEN_PUSH : 30,
    GREEN_STEP : 31,
    YELLOW_PUSH: 40,
    YELLOW_STEP: 41
}

// Játékos bábuinak betöltése
const playerImages = [
    document.querySelector("#blue_player"),
    document.querySelector("#red_player"),
    document.querySelector("#green_player"),
    document.querySelector("#yellow_player"),
]

// Játékosok kincseinek betöltése
const resources = document.querySelector("#resources")
const treasureImages = []
for (let i=1;i<=24;i++){
    const element = document.createElement("img")
    resources.appendChild(element)
    element.src = `images/treasures/treasure${i}.svg`
    element.id = `treasure${i}`
    element.hidden = true
    treasureImages.push(element)
}

// Játékszabályok változói
let playerCount = parseInt(playerCounter.value)
let treasureCount = parseInt(cardCounter.value)
let left_type = -1  // A maradék típusa
let left_rotation = 0 // A maradék elforgatása
let left_object = -1
let phase = phaseType.BLUE_PUSH
let bannedChange = ""
let characterChange = {x:-1,y:-1,p:-1}

// Tömb, ami megmutatja, hogy mennyi van még az egyes tile-okból
let left = [13,15,6]

// Vektorképek változói
const straight = document.querySelector("#straight")
const fork = document.querySelector("#fork")
const turn = document.querySelector("#turn")
const upper_arrow = document.querySelector("#upper_arrow")
const side_arrow = document.querySelector("#side_arrow")

// Táblamátrix létrehozása és feltöltése
let board = []

// Forgatási mártix létrehozása és feltöltése
let rotation = []

// Kincsek mátrixának létrehozása és törlése
let treasures = []

// Játékosok elhelyezkedésének mátrixa
let players = []

// A vászon méretének beállítása
canvas.width = 480
canvas.height = 480
leftover.width = 60
leftover.height = 60

// Játék újrakezdése
newGameButton.addEventListener("click",newGame)
function newGame(){
    game.style.visibility = "hidden"
    startDiv.hidden = false
    startDiv.style.display = ""
}

// Adatok alaphelyzetbe állítása
function clearData(){
    playerCount = parseInt(playerCounter.value)
    treasureCount = parseInt(cardCounter.value)
    left_type = -1 
    left_rotation = 0
    left_object = -1
    phase = phaseType.BLUE_PUSH
    bannedChange = ""
    left = [13,15,6]
    players = [
        {x : -1, y : -1, cards : [], startX : 0, startY : 0},
        {x : -1, y : -1, cards : [], startX : 6, startY : 0},
        {x : -1, y : -1, cards : [], startX : 0, startY : 6},
        {x : -1, y : -1, cards : [], startX : 6, startY : 6}
    ]
    board = []
    rotation = []
    treasures = []
    for (let i=0;i<BOARD_SIZE;i++){
        treasures.push([])
        rotation.push([])
        board.push([])
        for (let j=0;j<BOARD_SIZE;j++){
            treasures[i].push(-1)
            rotation[i].push(0)
            board[i].push(-1)
        }
    }
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// Játék kezdése a start gomra kattintás következtében
// --------------------------------------------------------------------------------------------------------------------------------------------
startBtn.addEventListener("click",startGame)
function startGame(){
    startDiv.hidden = "hidden"
    startDiv.style.display = "none"
    description.style.display = "none"
    game.style.visibility = "visible"
    game.style.display = "block"

    // Adatok alaphelyzetbe állítása
    clearData()

    // Játékszabályok beállítása
    playerCount = parseInt(playerCounter.value)
    treasureCount = parseInt(cardCounter.value)

    // Játékosok kártyáinak kisorsolása
    let cards_left = []
    for (let i=0;i<24;i++) cards_left[i] = -1
    for (let i=0;i<24;i++){
        let r = Math.floor(Math.random() * 24)
        while (cards_left[r] != -1) r = Math.floor(Math.random() * 24)
        cards_left[r] = i
    }

    // Játékosadatok előkészítése
    {
        let c = 0
        for (let i=0;i<playerCount;i++){
            for (let j=0;j<(treasureCount);j++){
                players[i].cards.push(cards_left[c++])
            }
            const selected = document.querySelector(`#player${i+1}`)
            selected.hidden = false
            const theirTreasure = selected.querySelector("p")
            theirTreasure.innerHTML = `Hátralévő kincsek: ${players[i].cards.length}`
        }
    }


    // A tábla előkészítése
    for (let i=0;i<BOARD_SIZE;i++){
        for (let j=0;j<BOARD_SIZE;j++){
            if (i==0 && j==0 || i==0 && j==6 || i==6 && j==0 || i==6 && j==6){
                board[i][j] = tileType.TURN
            } else if (i%2==0 && j%2==0){
                board[i][j] = tileType.FORK
            } else {
                let r_tile = Math.floor(Math.random() * 3);
                const r_rotation = Math.floor(Math.random() * 4) * 90
                while (left[r_tile] <= 0){
                    r_tile = Math.floor(Math.random() * 3)
                }
                board[i][j] = r_tile
                left[r_tile]--
                rotation[i][j] = r_rotation
            }
        }
    }

    // Kimaradt
    let i=0;
    while (left[i]!=1){
        i++
    }
    left_type = i

    // A játékosok előkészítése
    switch (playerCount){
        case 2:
            players[0].x = 0
            players[0].y = 0
            players[1].x = 6
            players[1].y = 0
            break;
        case 3:
            players[0].x = 0
            players[0].y = 0
            players[1].x = 6
            players[1].y = 0
            players[2].x = 0
            players[2].y = 6
            break;
        case 4:
            players[0].x = 0
            players[0].y = 0
            players[1].x = 6
            players[1].y = 0
            players[2].x = 0
            players[2].y = 6
            players[3].x = 6
            players[3].y = 6
            break;
    }

    // Kincsek elhelyezése
    for (let i=0;i<playerCount;i++){
        for (let j=0;j<treasureCount;j++){
            let c = players[i].cards[j]
            let x = Math.floor(Math.random()*7)
            let y = Math.floor(Math.random()*7)
            while ((x==0 && y==0 || x==0 && y==6 || x==6 && y==0 || x==6 && y==6) || treasures[y][x] != -1){
                x = Math.floor(Math.random()*7)
                y = Math.floor(Math.random()*7)
            }
            treasures[y][x] = c
        }
    }

    // Az alap forgatások
    rotation[0][6] = 90
    rotation[2][0] = 270
    rotation[2][2] = 270
    rotation[2][6] = 90
    rotation[4][0] = 270
    rotation[4][2] = 180
    rotation[4][4] = 90
    rotation[4][6] = 90
    rotation[6][0] = 270
    rotation[6][2] = 180
    rotation[6][4] = 180
    rotation[6][6] = 180

    drawGame()
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// Pálya kirajzolása a mátrixok szerint
// --------------------------------------------------------------------------------------------------------------------------------------------
function drawGame(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    let x = 0
    let y = 0

    // A keret kirajzolása
    drawFrame()

    // Játékosadatok frissítése
    for (let i=0;i<playerCount;i++){
        const selected = document.querySelector(`#player${i+1}`)
        const theirTreasure = selected.querySelector("p")
        theirTreasure.innerHTML = `Hátralévő kincsek: ${players[i].cards.length}`
        const theirCanvas = selected.querySelector("canvas")
        tctx = theirCanvas.getContext("2d")
        tctx.clearRect(0,0,theirCanvas.width,theirCanvas.height)
        if (players[i].cards.length > 0) tctx.drawImage(treasureImages[players[i].cards[0]],0,0)

    }

    // Tábla kirajzolása
    x += 30;
    y += 30;
    for (let i=0;i<BOARD_SIZE;i++){
        x = 30
        for (let j=0;j<BOARD_SIZE;j++){
            ctx.save()
            ctx.translate(x + gridSize / 2, y + gridSize / 2);
            ctx.rotate(rotation[i][j] * Math.PI / 180);
            if (board[i][j] == tileType.TURN){
                ctx.drawImage(turn, -gridSize/2, -gridSize/2)
            } else if (board[i][j] == tileType.FORK){
                ctx.drawImage(fork, -gridSize/2 , -gridSize/2)
            } else if (board[i][j] == tileType.STRAIGHT){
                ctx.drawImage(straight, -gridSize/2, -gridSize/2)
            }
            ctx.restore()
            x += gridSize
        }
        y += gridSize
    }

    // Kincsek kirajzolása
    for (let i=0;i<BOARD_SIZE;i++){
        for (let j=0;j<BOARD_SIZE;j++){
            if (treasures[i][j] != -1) ctx.drawImage(treasureImages[treasures[i][j]],30 + j*gridSize + 22, 30 + i*gridSize + 20)
        }
    }

    // Játékosok kirajzolása
    for (let i=0;i<playerCount;i++){
        x = 30 + players[i].x*gridSize + 22
        y = 30 + players[i].y*gridSize + 25
        ctx.drawImage(playerImages[i],x,y)
    }

    // Nyilak kirajzolása
    drawArrows()
    // Kimaradt kirajzolása
    updateLeftover()
    // Státusszöveg frissítése
    updatePhaseText()
}

// Keret kirajzolása
function drawFrame(){
    ctx.fillStyle = "#0c49ab"
    ctx.fillRect(0,0,canvas.width,30)
    ctx.fillRect(0,0,30,canvas.height)
    ctx.fillRect(canvas.width-30,0,30,canvas.height)
    ctx.fillRect(0,canvas.height-30,canvas.width,30)
}

function drawArrows(){
    // Nyilak kirajzolása
    ctx.drawImage(upper_arrow,90,0)
    ctx.drawImage(upper_arrow,210,0)
    ctx.drawImage(upper_arrow,330,0)
    ctx.drawImage(side_arrow,450,90)
    ctx.drawImage(side_arrow,450,210)
    ctx.drawImage(side_arrow,450,330)
    ctx.save()
    ctx.translate(canvas.width/2,canvas.width/2)
    ctx.rotate(Math.PI)
    ctx.translate(-canvas.width/2,-canvas.width/2)
    ctx.drawImage(upper_arrow,90,0)
    ctx.drawImage(upper_arrow,210,0)
    ctx.drawImage(upper_arrow,330,0)
    ctx.drawImage(side_arrow,450,90)
    ctx.drawImage(side_arrow,450,210)
    ctx.drawImage(side_arrow,450,330)
    ctx.restore()
}

// A kimaradt elem kirajzolása
function updateLeftover(){
    lctx.clearRect(0,0,60,60)
    lctx.save()
    lctx.translate(gridSize / 2, gridSize / 2);
    lctx.rotate(left_rotation * Math.PI / 180);
    lctx.translate(-gridSize / 2, -gridSize / 2);
    switch (left_type){
        case 0:
            lctx.drawImage(straight,0,0)
            break
        case 1:
            lctx.drawImage(turn,0,0)
            break
        case 2:
            lctx.drawImage(fork,0,0)
            break
    }
    lctx.restore()
    if (left_object != -1)
         lctx.drawImage(treasureImages[left_object],22,20)
}

// A játék fázisszövegének frissítése
function updatePhaseText(){
    switch(phase){
        case phaseType.BLUE_PUSH:
            phaseText.innerHTML = "Kék játékos tol"
            phaseText.style.color = "blue"
            break
        case phaseType.BLUE_STEP:
            phaseText.innerHTML = "Kék játékos lép"
            phaseText.style.color = "blue"
            break
        case phaseType.RED_PUSH:
            phaseText.innerHTML = "Piros játékos tol"
            phaseText.style.color = "red"
            break
        case phaseType.RED_STEP:
            phaseText.innerHTML = "Piros játékos lép"
            phaseText.style.color = "red"
            break
        case phaseType.GREEN_PUSH:
            phaseText.innerHTML = "Zöld játékos tol"
            phaseText.style.color = "green"
            break
        case phaseType.GREEN_STEP:
            phaseText.innerHTML = "Zöld játékos lép"
            phaseText.style.color = "green"
            break
        case phaseType.YELLOW_PUSH:
            phaseText.innerHTML = "Sárga játékos tol"
            phaseText.style.color = "orange"
            break
        case phaseType.YELLOW_STEP:
            phaseText.innerHTML = "Sárga játékos lép"
            phaseText.style.color = "orange"
            break
    }
}

// Kimaradt elem forgatása
leftover.addEventListener("click",rotateLeftover)
function rotateLeftover(){
    if (phase % 10 == 0){
        left_rotation = left_rotation + 90
        if (left_rotation == 360) left_rotation = 0 
        updateLeftover()
    }
}

// A táblán való kattintás
let p
canvas.addEventListener("mousedown",clickOnBoard)
async function clickOnBoard(event){
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (phase % 10 == 0){
        push(x,y)
        if (valid){
        p = animateSwap(Math.floor((x-30)/60),Math.floor((y-30)/60))
        p.then( (message) => {
            if (phase % 10 == 1) {
                possibleMoves = []
                calculatePossible(players[(phase-1)/10-1].x,players[(phase-1)/10-1].y)
                drawGame()
                highlight()
            }
        }).catch( (message) => {} )
        }
    } else {
        const a = Math.floor((x-30)/60)
        const b = Math.floor((y-30)/60)
        if (a != -1 && b != -1){
            switch(Math.floor(phase/10)){
                case 1:
                    if (possibleMoves.filter(e => e[0] == a && e[1] == b).length > 0){
                        step(player.BLUE,a,b)
                        nextPhase()
                        drawGame()
                    }
                    break
                case 2:
                    if (possibleMoves.filter(e => e[0] == a && e[1] == b).length > 0){
                        step(player.RED,a,b)
                        nextPhase()
                        drawGame()
                    }
                    break
                case 3:
                    if (possibleMoves.filter(e => e[0] == a && e[1] == b).length > 0){
                        step(player.GREEN,a,b)
                        nextPhase()
                        drawGame()
                    }
                    break
                case 4:
                    if (possibleMoves.filter(e => e[0] == a && e[1] == b).length > 0){
                        step(player.YELLOW,a,b)
                        nextPhase()
                        drawGame()
                    }
                    break
            }
        }
    }
    
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// Kimaradt elem betolása
// --------------------------------------------------------------------------------------------------------------------------------------------
let valid = false
function push(x,y){
    let newChange = ""
    valid = false
    
    if (y>=0 && y<=30){ // TOP
        newChange += "Top"
        if (x>=90 && x<=150){ // FIRST
            newChange += "First"
            valid = true
        } else if (x>=210 && x<=270){ // SECOND
            newChange += "Second"
            valid = true
        } else if (x>=330 && x<=390){ // THIRD
            newChange += "Third"
            valid = true
        }
    } else if (y<=480 && y>=450){ // BOTTOM
        newChange += "Bottom"
        if (x>=90 && x<=150){ // FIRST
            newChange += "First"
            valid = true
        } else if (x>=210 && x<=270){ // SECOND
            newChange += "Second"
            valid = true
        } else if (x>=330 && x<=390){ // THIRD
            newChange += "Third"
            valid = true
        }
    } else if (x>=0 && x<=30){ // LEFT
        newChange += "Left"
        if (y>=90 && y<=150){ // FIRST
            newChange += "First"
            valid = true
        } else if (y>=210 && y<=270){ // SECOND
            newChange += "Second"
            valid = true
        } else if (y>=330 && y<=390){ // THIRD
            newChange += "Third"
            valid = true
        }
    } else if (x<=480 && x>=450){ // RIGHT
        newChange += "Right"
        if (y>=90 && y<=150){ // FIRST
            newChange += "First"
            valid = true
        } else if (y>=210 && y<=270){ // SECOND
            newChange += "Second"
            valid = true
        } else if (y>=330 && y<=390){ // THIRD
            newChange += "Third"
            valid = true
        }
    }
    
    if (newChange != bannedChange){
        let i
        let j
        switch (newChange){
            case "TopFirst":
                j = 1
                for (i=0;i<7;i++) swapTiles(i,j,)
                bannedChange = "BottomFirst"
                nextPhase()
                break
            case "TopSecond":
                j = 3
                for (i=0;i<7;i++) swapTiles(i,j)
                bannedChange = "BottomSecond"
                nextPhase()
                break
            case "TopThird":
                j = 5
                for (i=0;i<7;i++) swapTiles(i,j)
                bannedChange = "BottomThird"
                nextPhase()
                break
            case "BottomFirst":
                j = 1
                for (i=6;i>=0;i--) swapTiles(i,j)
                bannedChange = "TopFirst"
                nextPhase()
                break
            case "BottomSecond":
                j = 3
                for (i=6;i>=0;i--) swapTiles(i,j)
                bannedChange = "TopSecond"
                nextPhase()
                break
            case "BottomThird":
                j = 5
                for (i=6;i>=0;i--) swapTiles(i,j)
                bannedChange = "TopThird"
                nextPhase()
                break
            case "LeftFirst":
                i = 1
                for (j=0;j<7;j++) swapTiles(i,j)
                bannedChange = "RightFirst"
                nextPhase()
                break
            case "LeftSecond":
                i = 3
                for (j=0;j<7;j++) swapTiles(i,j)
                bannedChange = "RightSecond"
                nextPhase()
                break
            case "LeftThird":
                i = 5
                for (j=0;j<7;j++) swapTiles(i,j)
                bannedChange = "RightThird"
                nextPhase()
                break
            case "RightFirst":
                i = 1
                for (j=6;j>=0;j--) swapTiles(i,j)
                bannedChange = "LeftFirst"
                nextPhase()
                break
            case "RightSecond":
                i = 3
                for (j=6;j>=0;j--) swapTiles(i,j)
                bannedChange = "LeftSecond"
                nextPhase()
                break
            case "RightThird":
                i = 5
                for (j=6;j>=0;j--) swapTiles(i,j)
                bannedChange = "LeftThird"
                nextPhase()
                break
        }
        if (characterChange.x != -1 && characterChange.y != -1){
            if (characterChange.x == 0 ) players[characterChange.p].x = 6
            if (characterChange.x == 6 ) players[characterChange.p].x = 0
            if (characterChange.y == 0 ) players[characterChange.p].y = 6
            if (characterChange.y == 6 ) players[characterChange.p].y = 0 
            characterChange.x = -1
            characterChange.y = -1
            characterChange.p = -1
        }
    } else {
        valid = false
    }
}

// Kicseréli a tileokat a tologatáshoz
function swapTiles(i,j){
    let tempType = board[i][j]
    let tempRotation = rotation[i][j]
    let tempObject = treasures[i][j]

    if (characterChange.x != -1 && characterChange.y != -1){
        players[characterChange.p].x = j
        players[characterChange.p].y = i
        characterChange.x = -1
        characterChange.y = -1
        characterChange.p = -1
    } else {
        for (let z=0;z<playerCount;z++){
            if (players[z].x == j && players[z].y == i){
                characterChange.x = j
                characterChange.y = i
                characterChange.p = z
            }
        }
    }
    
    board[i][j] = left_type
    treasures[i][j] = left_object
    rotation[i][j] = left_rotation
    left_object = tempObject
    left_type = tempType
    left_rotation = tempRotation
}

// Cserék animációja
function animateSwap(x,y){
    let l = false
    let id = null
    let pos = 0
    let a = 0
    let b = 0
    let f = 0
    const promise = new Promise((resolve,reject) => {
        id = setInterval(animate,8)
        function animate(){
            if (y == -1){
                if (a == 0 && b == 0) {a = x; b = 6+y;}
                ctx.clearRect(30+a*60,30+6*60+pos,60,60)
                ctx.save()
                ctx.translate(30+a*60 + gridSize / 2, 30+6*60+pos + gridSize / 2);
                ctx.rotate(left_rotation * Math.PI / 180);
                ctx.translate(-1*(30+a*60+gridSize/2),-1*(30+60*60+pos+gridSize/2));
                if (left_type == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+a*60,30+6*60+pos)
                } else if (left_type == tileType.TURN){
                    ctx.drawImage(turn,30+a*60,30+6*60+pos)
                } else if (left_type == tileType.FORK){
                    ctx.drawImage(fork,30+a*60,30+6*60+pos)
                }
                ctx.restore()

                ctx.clearRect(30+a*60,30+b*60+pos,60,60)
                ctx.save()
                ctx.translate(30+a*60 + gridSize / 2, 30+b*60+pos + gridSize / 2);
                ctx.rotate(rotation[b+1][a] * Math.PI / 180);
                ctx.translate(-1*(30+a*60+gridSize/2),-1*(30+b*60+pos+gridSize/2));
                if (board[b+1][a] == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+a*60,30+b*60+pos)
                    b--
                } else if (board[b+1][a] == tileType.TURN){
                    ctx.drawImage(turn,30+a*60,30+b*60+pos)
                    b--
                } else if (board[b+1][a] == tileType.FORK){
                    ctx.drawImage(fork,30+a*60,30+b*60+pos)
                    b--
                }
                if (b<=-2){pos += 10; b=6+y;}
                
                if (pos >= 70) {clearInterval(id); resolve();}
                ctx.restore()
                
                drawFrame()
                drawArrows()
            } else if (y == 7){
                if (a == 0 && b == 0) {a = x; b = 5; pos = 0;}
                ctx.clearRect(30+a*60,30+pos,60,60)
                ctx.save()
                ctx.translate(30+a*60 + gridSize / 2, 30 + pos + gridSize / 2);
                ctx.rotate(left_rotation * Math.PI / 180);
                ctx.translate(-1*(30+a*60+gridSize/2),-1*(30+pos+gridSize/2));
                if (left_type == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+a*60,30+pos)
                } else if (left_type == tileType.TURN){
                    ctx.drawImage(turn,30+a*60,30+pos)
                } else if (left_type == tileType.FORK){
                    ctx.drawImage(fork,30+a*60,30+pos)
                }
                ctx.restore()

                ctx.clearRect(30+a*60,390-b*60+pos,60,60)
                ctx.save()
                ctx.translate(30+a*60 + gridSize / 2, 390-b*60+pos + gridSize / 2);
                ctx.rotate(rotation[5-b][a] * Math.PI / 180);
                ctx.translate(-1*(30+a*60+gridSize/2),-1*(390-b*60+pos+gridSize/2));
                if (board[5-b][a] == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+a*60,390-b*60+pos)
                    b--
                } else if (board[5-b][a] == tileType.TURN){
                    ctx.drawImage(turn,30+a*60,390-b*60+pos)
                    b--
                } else if (board[5-b][a] == tileType.FORK){
                    ctx.drawImage(fork,30+a*60,390-b*60+pos)
                    b--
                }

                if (b<=-2){pos -= 10; b=5;}
                if (pos <= -70) {clearInterval(id); resolve();}
                ctx.restore()
                
                drawFrame()
                drawArrows()
            } else if (x == -1){
                if (a == 0 && b == 0) {a = 5; b = y; pos = 0;}
                ctx.clearRect(30+6*60+pos,30+b*60,60,60)
                ctx.save()
                ctx.translate(30+6*60+pos + gridSize / 2,30+b*60 + gridSize / 2);
                ctx.rotate(left_rotation * Math.PI / 180);
                ctx.translate(-1*(30+60*60+pos+gridSize/2),-1*(30+b*60+gridSize/2));
                if (left_type == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+6*60+pos,30+b*60)
                } else if (left_type == tileType.TURN){
                    ctx.drawImage(turn,30+6*60+pos,30+b*60)
                } else if (left_type == tileType.FORK){
                    ctx.drawImage(fork,30+6*60+pos,30+b*60)
                }
                ctx.restore()

                ctx.clearRect(30+a*60+pos,30+b*60,60,60)
                ctx.save()
                ctx.translate(30+a*60+pos + gridSize / 2,30+b*60 + gridSize / 2);
                ctx.rotate(rotation[b][a+1] * Math.PI / 180);
                ctx.translate(-1*(30+a*60+pos+gridSize/2),-1*(30+b*60+gridSize/2));
                if (board[b][a+1] == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+a*60+pos,30+b*60)
                    a--
                } else if (board[b][a+1] == tileType.TURN){
                    ctx.drawImage(turn,30+a*60+pos,30+b*60)
                    a--
                } else if (board[b][a+1] == tileType.FORK){
                    ctx.drawImage(fork,30+a*60+pos,30+b*60)
                    a--
                }
                if (a<=-2){pos += 10; a=5}
                
                if (pos >= 70) {clearInterval(id); resolve();}
                ctx.restore()
                
                drawFrame()
                drawArrows()
            } else if (x == 7){
                if (a == 0 && b == 0) {a = 5; b = y; pos = 0;}
                ctx.clearRect(30+pos,30+b*60,60,60)
                ctx.save()
                ctx.translate(30 + pos + gridSize / 2, 30+b*60 + gridSize / 2);
                ctx.rotate(left_rotation * Math.PI / 180);
                ctx.translate(-1*(30+pos+gridSize/2),-1*(30+b*60+gridSize/2));
                if (left_type == tileType.STRAIGHT){
                    ctx.drawImage(straight,30+pos,30+b*60)
                } else if (left_type == tileType.TURN){
                    ctx.drawImage(turn,30+pos,30+b*60)
                } else if (left_type == tileType.FORK){
                    ctx.drawImage(fork,30+pos,30+b*60)
                }
                ctx.restore()

                ctx.clearRect(390-a*60+pos,30+b*60,60,60)
                ctx.save()
                ctx.translate(390-a*60+pos + gridSize / 2, 30+b*60 + gridSize / 2);
                ctx.rotate(rotation[b][5-a] * Math.PI / 180);
                ctx.translate(-1*(390-a*60+pos+gridSize/2),-1*(30+b*60+gridSize/2),);
                if (board[b][5-a] == tileType.STRAIGHT){
                    ctx.drawImage(straight,390-a*60+pos,30+b*60)
                    a--
                } else if (board[b][5-a] == tileType.TURN){
                    ctx.drawImage(turn,390-a*60+pos,30+b*60)
                    a--
                } else if (board[b][5-a] == tileType.FORK){
                    ctx.drawImage(fork,390-a*60+pos,30+b*60)
                    a--
                }

                if (a<=-2){pos -= 10; a=5;}
                if (pos <= -70) {clearInterval(id); resolve();}
                ctx.restore()
                
                drawFrame()
                drawArrows()
            } else reject()
        }  
    })
    return promise
}

// Léphető cellák megjelölése
function highlight(){
    for (i in possibleMoves){
        ctx.fillStyle = "white"
        ctx.globalAlpha = 0.2;
        ctx.fillRect(30+possibleMoves[i][0]*60,30+possibleMoves[i][1]*60,60,60)
        ctx.globalAlpha = 1;
    }
}

// A játék következő fázisára lépés
function nextPhase(){
    phase++
    if (phase % 10 == 2) phase = phase + 10 - 2
    if (phase / 10 >= playerCount+1) phase = phaseType.BLUE_PUSH
}

// Lépés egy játékossal egy másik mezőre
function step(player,x,y){
    if (player < playerCount){
        players[player].x = x
        players[player].y = y
    }
    checkTreasure(player)
}

// Megnézi, hogy a mezőn, amire a játékos lépett megtalálható-e a keresett kincs
function checkTreasure(player){
    if (players[player].cards.length > 0){
        if (treasures[players[player].y][players[player].x] == players[player].cards[0]){
            players[player].cards.shift()
            treasures[players[player].y][players[player].x] = -1
            drawGame()
        }
    } else {
        checkWinner(player)
    }
}

// Megnézi, hogy nyert-e a játékos
function checkWinner(player){
    if (players[player].x == players[player].startX && players[player].y == players[player].startY){
        alert((player+1) + ". játékos NYERT!!!!")
        newGame()
    }
}

// Megadja, hogy egy tile milyen irányokból közelíthető meg
function allowedDirections(type,rotation){
    allowed = []
    if (rotation == 0){
        switch (type){
            case 0:
                allowed = ["Up","Down"]
                break
            case 1:
                allowed = ["Right","Down"]
                break
            case 2:
                allowed = ["Left","Right","Down"]
        }
    } else if (rotation == 90){
        switch (type){
            case 0:
                allowed = ["Left","Right"]
                break
            case 1:
                allowed = ["Left","Down"]
                break
            case 2:
                allowed = ["Left","Down","Up"]
        }
    } else if (rotation == 180){
        switch (type){
            case 0:
                allowed = ["Up","Down"]
                break
            case 1:
                allowed = ["Up","Left"]
                break
            case 2:
                allowed = ["Up","Right","Left"]
        }
    } else if (rotation == 270){
        switch (type){
            case 0:
                allowed = ["Left","Right"]
                break
            case 1:
                allowed = ["Up","Right"]
                break
            case 2:
                allowed = ["Up","Right","Down"]
        }
    }
    return allowed
}

// Megadja, hogy adott irányból megközelíthető-e a tile
function canStep(direction,allowed){
    let l = false
    for (let i=0;i<allowed.length;i++){
        if (allowed[i] == direction) l = true
    }
    return l
}

// Megnézi, hogy a possibleMoves tartalmazza-e az adott x,y kombinációt
function isContains(x,y){
    l = false
    if (possibleMoves.filter( e => e[0] == x && e[1] == y).length > 0) l = true
    return l
}

// Lehetséges lépések számítása
let possibleMoves = []
function calculatePossible(x,y){
    const checkDirections = allowedDirections(board[y][x],rotation[y][x])
    if (!isContains(x,y)) possibleMoves.push([x,y])

    for (i in checkDirections){
        switch (checkDirections[i]){
            case "Up":
                if (y-1>=0 && !isContains(x,y-1)){
                    if (canStep("Down",allowedDirections(board[y-1][x],rotation[y-1][x]))){
                        possibleMoves.push([x,y-1])
                        calculatePossible(x,y-1)
                    }
                }
                break
            case "Right":
                if (x+1<=6  && !isContains(x+1,y)){
                    if (canStep("Left",allowedDirections(board[y][x+1],rotation[y][x+1]))){
                        possibleMoves.push([x+1,y])
                        calculatePossible(x+1,y)
                    }
                }
                break
            case "Down":
                if (y+1<=6  && !isContains(x,y+1)){
                    if (canStep("Up",allowedDirections(board[y+1][x],rotation[y+1][x]))){
                        possibleMoves.push([x,y+1])
                        calculatePossible(x,y+1)
                    }
                }
                break
            case "Left":
                if (x-1>=0  && !isContains(x-1,y)){
                    if (canStep("Right",allowedDirections(board[y][x-1],rotation[y][x-1]))){
                        possibleMoves.push([x-1,y])
                        calculatePossible(x-1,y)
                    }
                }
                break
        }
    }
}