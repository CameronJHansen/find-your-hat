const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '$';
const path = '*';

class Field {
  constructor(field) {
    this._field = field; //map array
    this.locationRow = 0; //i index
    this.locationColumn = 0; //j index
    this.isGameOver = false;
  }

  get field() {
    return this._field;
  }
  set field(arr) {
    for (let i = 0; i < arr.length; i++) {
      let row = arr[i];
      for (let j = 0; j < row.length; j++) {
        if (arr[i][j] === pathCharacter) {
          this.locationRow = i;
          this.locationColumn = j;
        }
      }
    }  
  }
  get gameOver() {
    return this.isGameOver;
  }
  set gameOver (value) {
    if (value === undefined) {
      this.isGameOver = true;
      console.log('Out of bounds instruction!')
    }
    else if (value === 'O') {
      this.isGameOver = true;
      console.log('Sorry, you fell in a hole!');
    }
    else if (value === '^') {
      this.isGameOver = true;
      console.log('Congrats, you found your hat!');
    }
    else {
      this.isGameOver = false;
    }  
  }

  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(''));
    }
  }

  ask () {
    while (this.isGameOver === false) {
      let direction = prompt('Which way? (enter a, d, w, s) ');
      let testChar = fieldCharacter; //character to be passed to isGameOver 

      if (direction === 'd') {
        testChar = this.field[this.locationRow][this.locationColumn + 1];
        this.field[this.locationRow][this.locationColumn] = path;
        this.locationColumn++;
        this.field[this.locationRow][this.locationColumn] = pathCharacter;
        this.print();
      }
      else if (direction === 'a') {
        testChar = this.field[this.locationRow][this.locationColumn - 1];
        this.field[this.locationRow][this.locationColumn] = path;
        this.locationColumn--;
        this.field[this.locationRow][this.locationColumn] = pathCharacter;
        this.print();
      }
      //next two blocks have slightly different implementation to accomodate "Type Error"
      else if (direction === 's') {
        try {
          testChar = this.field[this.locationRow + 1][this.locationColumn];
          this.field[this.locationRow][this.locationColumn] = path;
        this.locationRow++;
        this.field[this.locationRow][this.locationColumn] = pathCharacter;
        this.print();
        } catch (e) {
          this.gameOver = undefined;
          break;
        }
      }
      else if (direction === 'w') {
        try {
          testChar = this.field[this.locationRow - 1][this.locationColumn];
        this.field[this.locationRow][this.locationColumn] = path;
        this.locationRow--;
        this.field[this.locationRow][this.locationColumn] = pathCharacter;
        this.print();
        } catch(e) {
          this.gameOver = undefined;
          break;
        }
      }
      else {
        console.log('Invalid direction.');
      }

      this.gameOver = testChar;
    }
  }

  static generateField(rows, columns) {
    let arr = Array(rows);
    for (let i = 0; i < rows; i++) {
	    arr[i] = Array(columns).fill(fieldCharacter);
    } //creates 2d array filled with '░'
    let randomNumber1 = Math.floor(Math.random() * 4) + (rows - 4); 
    let randomNumber2 = Math.floor(Math.random() * columns);

    arr[0][0] = pathCharacter; //ensures '$' starts at top left of map
    arr[randomNumber1][randomNumber2] = hat; //ensures '^' is slotted towards bottom of map

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        let randomNumber3 = Math.floor(Math.random() * 7);
        if (
          arr[i][j] != pathCharacter &&
          arr[i][j] != hat &&
          randomNumber3 === 5
	) {
            arr[i][j] = hole; //1 in 7 chance each array element of '░' substituted with 'O'
          }
      }
    }

    return arr;
  }
}

let fieldArr = Field.generateField(10, 10);
const myField = new Field(fieldArr);

myField.print();

myField.ask();
