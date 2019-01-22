import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SudokuService } from '../services/sudoku.service';


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
  activePosition: number = undefined;



  constructor(
    private http: HttpClient,
    private service: SudokuService,
  ) {}

  ngOnInit() {
    this.getBoard();
    console.log(this.starters);

  }

  changePieceValue(num: number): void {
    if (this.validateRow(this.activePosition, num)
        && this.validateNinth(this.activePosition, num)
        && this.validateCol(num)
        && !this.checkIfStarter(this.activePosition)) {
          this.board[this.activePosition] = num;
        }
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
      console.log(this.board);
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
    console.log(this.currentValues);
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
      if (parseInt(this.board[i], 10) === value) {
        return false;
      }
    }
    return true;
  }


  validateNinth(position: number, value: number): boolean {
    // check if current ninth has passed in value
    for (const i of this.currentNinth) {
      if (parseInt(this.board[i], 10) === value) {
        return false;
      }
    }
    return true;
  }

  validateCol(inputNum: number): boolean {
    for (const i of this.currentCol) {
      if (parseInt(this.board[i], 10) === inputNum) {
        return false;
      }
    }
    return true;
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

}


