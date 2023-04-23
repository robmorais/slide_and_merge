const gridSize = 4;
const moveLimit = 10;
const objective = 'A row with 3 consecutive numbers (e.g. 2, 4, 8)';
let gameOver = false;
let remainingMoves = moveLimit;
let grid = [];

// Basic interface
function updateGameInstruction(instructions) {
  // JavaScript code to change the text of the paragraph element
  const gameInstructions = document.querySelector('.game-instructions');
  gameInstructions.innerHTML = "";


  const textNode = document.createTextNode(instructions);
  gameInstructions.appendChild(textNode);
  if (gameOver) {
    const button = document.createElement('button');
    button.textContent = 'New Game!';
    button.addEventListener('click', initializeLevel);
    gameInstructions.appendChild(button);
  }
}

// Game functions
function createEmptyGrid() {
    return new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(null));
}

function initializeLevel() {
    grid = createEmptyGrid();
    spawnNewTile();
    spawnNewTile();
    remainingMoves = moveLimit;
    gameOver = false;

    updateObjectiveDisplay();
    updateRemainingMovesDisplay();
    updateGameInstruction("Use arrow keys or W, A, S, D to slide and merge the tiles. Your goal is to create a row with three consecutive numbers (e.g., 2, 4, 8) within the given move limit.");
    updateGridDisplay();
}

function slide(direction, row) {
  const newRow = row.slice();
  console.log("slide");
  console.log(newRow);
  console.log(direction);
  if (direction === 'left' || direction === 'up') {
    for (let i = 0; i < gridSize - 1; i++) {
      console.log(".");
        if (newRow[i] === null && newRow[i + 1] !== null) {
          console.log("x");
            newRow[i] = newRow[i + 1];
            newRow[i + 1] = null;
            // break;
        }
    }
  } else {
    for (let i = gridSize - 1; i > 0; i--) {
      console.log(".");
        if (newRow[i] === null && newRow[i - 1] !== null) {
          console.log("x");
            newRow[i] = newRow[i - 1];
            newRow[i - 1] = null;
            // break;
        }
    }
  }
  console.log(newRow);
  console.log("slide end");
  return newRow;
}



function merge(direction, row) {
    const increment = direction === 'left' || direction === 'up' ? 1 : -1;
    let startIndex = direction === 'left' || direction === 'up' ? 0 : gridSize - 1;
    console.log("merge");
    console.log(row)
    for (let i = 0; i < gridSize - 1; i++) {
        if (row[startIndex] === null) break;
        if (row[startIndex] === row[startIndex + increment]) {
            row[startIndex] *= 2;
            row[startIndex + increment] = null;
            // remainingMoves++;
        }
        startIndex += increment;
    }
    console.log(row)
    console.log("merge end");
    return row;
}

function slideAndMerge(direction, grid) {
    const newGrid = [];
    for (let row = 0; row < gridSize; row++) {
      console.log("row:" + row);
      // console.log(grid[row]);
      // newGrid.push(slide(direction, merge(direction, slide(direction, grid[row]))));
      newGrid.push(slide(direction, merge(direction, grid[row])));
      console.log("new grid: ");
      console.log(newGrid.slice());
      // break;
    }
    return newGrid;
}

function spawnNewTile2(direction) {
  console.log("spawn")
  if (direction === 'left' || direction === 'right') {
    grid = transpose(grid);
    console.log(grid);
    if (direction === 'right') {
      addTile(grid[0]);
    } else {
      addTile(grid[3]);
    }
    grid = transpose(grid);
  } else {
    if (direction === 'up') { 
      addTile(grid[3]);
    } else {
      addTile(grid[0]);
    }
  }
}

function addTile(row) {
  posAvailable = [0,1,2,3];
    
  for (let i = 0; i < 4; i++) {
    randomIndex = Math.floor(Math.random() * posAvailable.length);
    pos = posAvailable.splice(randomIndex, 1);
    if (row[pos] == null) {
      row[pos] = Math.random() < 0.7 ? 2 : 4;  
      break;
    }
  }
}

function spawnNewTile() {
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomNumber = Math.random() < 0.9 ? 2 : 4;
    grid[randomCell.row][randomCell.col] = randomNumber;
}

function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function flip(matrix) {
  return matrix.map(row => row.slice().reverse());
}

function move(direction) {
  if (!gameOver) {
    const prevGrid = grid.map(row => row.slice());

    if (direction === 'left' || direction === 'right') {
        grid = slideAndMerge(direction, grid);
    } else {
        grid = transpose(grid);
        grid = slideAndMerge(direction, grid);
        grid = transpose(grid);
    }

    if (JSON.stringify(prevGrid) !== JSON.stringify(grid)) {
        //TODO  confirm
        spawnNewTile2(direction);
        remainingMoves--;
    }

    updateGridDisplay();
    updateRemainingMovesDisplay();
  }

  if (checkObjectiveCompleted()) {
    // alert('Congratulations, you completed the objective!');
    console.log('Congratulations, you completed the objective!');
    gameOver = true;
    updateGameInstruction('Congratulations, you completed the objective!');
    // initializeLevel();
  } else if (remainingMoves === 0) {
      // alert('Game Over! You ran out of moves.');
      console.log('Game Over! You ran out of moves.');
      gameOver = true;
      updateGameInstruction('Game Over! You ran out of moves.');
      // updateGameInstruction(textNode);
      // initializeLevel();
  } 
}

// Keyboard input control
function handleInput(event) {
  switch (event.key) {
      case 'ArrowUp':
      case 'w':
          move('up');
          break;
      case 'ArrowDown':
      case 's':
          move('down');
          break;
      case 'ArrowLeft':
      case 'a':
          move('left');
          break;
      case 'ArrowRight':
      case 'd':
          move('right');
          break;
      default:
          return; // Ignore other keys
  }

  event.preventDefault();
}

document.addEventListener('keydown', handleInput);

// Touch input control
function handleTouchStart(event) {
  event.preventDefault();
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  event.preventDefault();
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
          move('right');
      } else {
          move('left');
      }
  } else {
      if (diffY > 0) {
          move('down');
      } else {
          move('up');
      }
  }
}

const gridContainer = document.getElementById('grid-container');
gridContainer.addEventListener('touchstart', handleTouchStart);
gridContainer.addEventListener('touchmove', handleTouchMove);
gridContainer.addEventListener('touchend', handleTouchEnd);

function updateObjectiveDisplay() {
  document.getElementById('objective').textContent = objective;
}

function updateRemainingMovesDisplay() {
  document.getElementById('remaining-moves').textContent = remainingMoves;
}

function updateGridDisplay() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';

  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';

          if (grid[row][col] !== null) {
              const cellContent = document.createElement('div');
              cellContent.className = 'grid-cell-content';
              cellContent.textContent = grid[row][col];
              cell.setAttribute('data-value', grid[row][col]);
              cell.appendChild(cellContent);
          }

          gridContainer.appendChild(cell);
      }
  }
}

function checkObjectiveCompleted() {
  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize - 2; col++) {
          if (grid[row][col] && grid[row][col] === grid[row][col + 1] / 2 && grid[row][col] === grid[row][col + 2] / 4) {
              return true;
          }
      }
  }

  return false;
}

initializeLevel();