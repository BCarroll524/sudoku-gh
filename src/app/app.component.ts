import { Component, OnInit } from '@angular/core';
import { Move } from './models/moves';

import { SudokuService } from '../services/sudoku.service';
import { Type } from '@angular/compiler';


@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  board = [];
  starters = [];
  currentRow = [];
  currentCol = [];
  currentNinth = [];
  currentValues = [];
  conflictingPieces = [];
  activePosition: number = undefined;
  moves: Array<Move> = [];



  constructor(
    private service: SudokuService,
  ) {}

  ngOnInit() {
    this.getBoard();
    console.log(this.starters);

  }

  changePieceValue(num: number): void {
    if (!this.checkIfStarter(this.activePosition)
        && this.validate(this.activePosition, num)) {
          this.removeConflictingPieces(this.activePosition);
          this.board[this.activePosition] = num.toString();
          this.getSameValues(this.activePosition);
    } else {
      this.board[this.activePosition] = num.toString();
      this.currentValues = [];
    }
    this.addToMoves(this.activePosition, num);
  }

  addToMoves(pos: number, value: number): void {
    const move = {position: -1, value: -1};
    move.position = pos;
    move.value = value;
    this.moves.push(move);
    console.log(this.moves);
  }

  selectPiece(num: number): void {
    this.activePosition = num;
    this.getRow(num);
    this.getCol(num);
    this.getNinth(num);
    this.getSameValues(num);
  }

  getBoard(): void {
    this.service.getEasyBoard().subscribe(data => {
      let counter = 0;
      for (const row of data.board) {
        for (const num of row) {
          if (num === 0) {
            this.board.push(num.toString());
          } else {
            this.board.push(num.toString());
            this.starters.push(counter);
          }
          counter++;
        }
      }
    });
  }


  checkIfStarter(num: number): boolean {
    const position = num;
    if (this.starters.indexOf(position) === -1) {
      return false;
    }
    return true;
  }

  checkIfEmpty(num: number): boolean {
    const position = num;
    if (this.board[position] === '0') {
      return true;
    }
    return false;
  }

  getNinth(position: number): void {
    this.currentNinth = [];
    const ninth = Math.floor(position / 9);
    const column = ninth % 3;
    const ninthIndex = position % 3;
    const indexs = [0, 1, 2];
    for (const i of indexs) {
      const currPosition = position + ((i - column) * 9);
      this.getRowInNinth(currPosition, ninthIndex);
    }
  }

  getRowInNinth(position: number, index: number): void {
    const rowStart = position - index;
    const indexs = [0, 1, 2];
    for (const i of indexs) {
      this.currentNinth.push(rowStart + i);
    }
  }


  getRow(position: number): void {
    this.currentRow = [];
    const rowStart = Math.floor(position / 9) * 9;
    for (let i = 0; i < 9; i++) {
      this.currentRow.push(rowStart + i);
    }
  }

  getCol(position: number): void {
    this.currentCol = [];
    const colStart = position % 9;
    for (let i = 0; i <= 72; i += 9) {
      this.currentCol.push(colStart + i);
    }
  }

  getSameValues(position: number): void {
    this.currentValues = [];
    const value = this.board[position];
    if (value === '0') {
      return;
    }
    // loop through board to find same values
    this.board.forEach((data, index) => {
      if (data === value && index !== position) {
        this.currentValues.push(index);
      }
    });
  }

  // finds pieces in same ninth, row, and column
  isActivePiece(num: number): boolean {
    const pos = num;
    if (this.currentNinth.indexOf(pos) !== -1) {
      return true;
    } else if (this.currentRow.indexOf(pos) !== -1) {
      return true;
    } else if (this.currentCol.indexOf(pos) !== -1) {
      return true;
    }
    return false;
  }

  validateRow(position: number, value: number): boolean {
    // check if current row has passed in value
    for (const i of this.currentRow) {
      if (parseInt(this.board[i], 10) === value
            && this.conflictingPieces.indexOf(i) === -1) {
        this.conflictingPieces.push(i);
        return false;
      }
    }
    return true;
  }


  validateNinth(position: number, value: number): boolean {
    // check if current ninth has passed in value
    for (const i of this.currentNinth) {
      if (parseInt(this.board[i], 10) === value
            && this.conflictingPieces.indexOf(i) === -1) {
        this.conflictingPieces.push(i);
        return false;
      }
    }
    return true;
  }

  validateCol(position: number, value: number): boolean {
    for (const i of this.currentCol) {
      if (parseInt(this.board[i], 10) === value
            && this.conflictingPieces.indexOf(i) === -1) {
        this.conflictingPieces.push(i);
        return false;
      }
    }
    return true;
  }

  validate(pos: number, val: number): boolean {
    const col = this.validateCol(pos, val);
    const row = this.validateRow(pos, val);
    const ninth = this.validateNinth(pos, val);
    if (col && row && ninth) {
      return true;
    }

    this.conflictingPieces.push(pos);
    return false;
  }

  isActivePosition(position: number): boolean {
    if (position === this.activePosition) {
      return true;
    }
    return false;
  }

  isSameValue(position: number): boolean {
    if (this.currentValues.indexOf(position) !== -1) {
      return true;
    }
    return false;
  }

  isConflict(position: number): boolean {
    if (this.conflictingPieces.indexOf(position) !== -1) {
      return true;
    }
    return false;
  }

  wiggle(pos: number): boolean {
    if (this.activePosition === pos && this.conflictingPieces.indexOf(pos) !== -1) {
      return true;
    }
    return false;
  }

  removeConflictingPieces(pos: number): void {
    const array = [];
    for (const i of this.conflictingPieces) {
      if (this.board[i] === this.board[pos]) {
        array.push(i);
      }
    }
    for (const i of array) {
      const index = this.conflictingPieces.indexOf(i);
      this.conflictingPieces.splice(index, 1);
    }
  }

  onKeydown(event) {
    if (event.keyCode >= 49 && event.keyCode <= 57) {
      this.changePieceValue(parseInt(event.key, 10));
    }
  }

  newGame(): void {
    // restart game with new board
    // clear board and all numbers
    this.board = [];
    this.starters = [];
    this.currentCol = [];
    this.currentNinth = [];
    this.currentRow = [];
    this.currentValues = [];
    this.conflictingPieces = [];
    this.activePosition = undefined;
    this.getBoard();
  }

  undoMove(): void {
    const move: Move = this.moves.pop();
    const pos = move.position;
    let index = -1;
    this.moves.forEach((m, i) => {
      if (m.position === pos) {
        index = i;
      }
    });
    this.removeConflictingPieces(pos);
    if (index > 0) {
      this.board[pos] = this.moves[index].value.toString();
    } else {
      this.board[pos] = '0';
      const i = this.currentValues.indexOf(pos);
      if (i >= 0) {
        this.currentValues.splice(i, 1);
      }
    }
    console.log(this.currentValues);
  }

}


