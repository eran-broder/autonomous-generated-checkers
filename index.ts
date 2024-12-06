
const handleCellClick = (event: MouseEvent) => {
  const cell = event.currentTarget as HTMLDivElement;
  const row = parseInt(cell.dataset.row!);
  const col = parseInt(cell.dataset.col!);
  // ... rest of the function
};

const updateBoard = () => {
  const cell = document.querySelector('.cell') as HTMLDivElement;
  const row = parseInt((cell as HTMLDivElement).dataset.row!);
  const col = parseInt((cell as HTMLDivElement).dataset.col!);
  // ... rest of the function
};
