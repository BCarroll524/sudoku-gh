import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  endpoints = [
    'https://sugoku.herokuapp.com/board?difficulty=easy',
    'https://sugoku.herokuapp.com/board?difficulty=medium',
    'https://sugoku.herokuapp.com/board?difficulty=hard',
    'https://sugoku.herokuapp.com/solve'
  ];

  constructor(
    private http: HttpClient
  ) { }


  // GET easy board
  getEasyBoard(): Observable<any> {
    return this.http.get(this.endpoints[0]);
  }

  // GET medium board
  getMediumBoard(): Observable<any> {
    return this.http.get(this.endpoints[1]);
  }

  // GET hard board
  getHardBoard(): Observable<any> {
    return this.http.get(this.endpoints[2]);
  }

  // POST solve board
  solveBoard(board: Array<number>) {
    return this.http.post(this.endpoints[3], board);
  }

}
