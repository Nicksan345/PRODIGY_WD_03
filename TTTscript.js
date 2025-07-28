const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const combos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board, turn, mode, gameOver;

function init() {
  board = Array(9).fill(null);
  turn = 'X';
  gameOver = false;
  mode = document.querySelector('input[name="mode"]:checked').value;
  statusEl.textContent = `${turn}'s move`;
  boardEl.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.i = i;
    cell.addEventListener('click', play, { once: true });
    boardEl.appendChild(cell);
  }
}

function play(e) {
  if (gameOver) return;
  const i = +e.target.dataset.i;
  board[i] = turn;
  e.target.textContent = turn;
  e.target.style.color = turn === 'X' ? 'var(--x)' : 'var(--o)';

  const winLine = combos.find(c => c.every(k => board[k] === turn));
  if (winLine) {
    winLine.forEach(k => boardEl.children[k].classList.add('win'));
    statusEl.textContent = `${turn} wins!`;
    gameOver = true;
  } else if (board.every(Boolean)) {
    statusEl.textContent = 'Draw!';
    gameOver = true;
  } else {
    turn = turn === 'X' ? 'O' : 'X';
    statusEl.textContent = `${turn}'s move`;
    if (mode === 'ai' && turn === 'O') aiMove();
  }
}

function aiMove() {
  const { index } = minimax([...board], 'O');
  setTimeout(() => boardEl.children[index].click(), 200);
}

function minimax(b, p) {
  const avail = b.map((v, i) => v ? null : i).filter(v => v !== null);
  if (combos.some(c => c.every(k => b[k] === 'X'))) return { score: -10 };
  if (combos.some(c => c.every(k => b[k] === 'O'))) return { score: 10 };
  if (avail.length === 0) return { score: 0 };

  const moves = [];
  for (const i of avail) {
    b[i] = p;
    const result = minimax(b, p === 'O' ? 'X' : 'O');
    moves.push({ index: i, score: result.score });
    b[i] = null;
  }

  return p === 'O'
    ? moves.reduce((best, m) => m.score > best.score ? m : best, { score: -Infinity })
    : moves.reduce((best, m) => m.score < best.score ? m : best, { score: Infinity });
}

restartBtn.addEventListener('click', init);
document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', init));

init();
