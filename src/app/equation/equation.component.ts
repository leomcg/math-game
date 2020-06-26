import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MathValidators } from '../math-validators';
import { delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {

  secondsPerSolution = 0;

  mathForm = new FormGroup(
    {
      a: new FormControl(this.generateRandomInteger(10)),
      b: new FormControl(this.generateRandomInteger(10)),
      answer: new FormControl(''),
      operation: new FormControl('+'),
      numbers: new FormControl('10')
    },
    [
      MathValidators.addition('answer', 'a', 'b')
    ]
  );

  constructor() { }

  // Gets operation sign string to print on UI
  getOperationSign() {
    const sign = this.mathForm.controls.operation.value;
    switch (sign) {
      case '+':
        return '+';
      case '-':
        return '-';
      case '*':
        return 'x';
      case '/':
        return '÷';
    }
  }

  // Getters to use as reference on template
  get a() {
    return this.mathForm.value.a;
  }

  get b() {
    return this.mathForm.value.b;
  }

  get operation() {
    return this.mathForm.value.operation;
  }

  ngOnInit() {
    // Average solving time logic
    const startTime = new Date();
    let numberSolved = 0;

    // Correct answer observer
    this.mathForm.statusChanges.pipe(
      filter(value => value === 'VALID'),
      delay(100)
    ).subscribe(() => {
      // Average solving time update
      numberSolved++;
      this.secondsPerSolution = (
        (new Date().getTime() - startTime.getTime()) / numberSolved / 1000
      );

      // Reset form
      const numbers = this.mathForm.controls.numbers.value;
      this.mathForm.patchValue({
        a: this.generateRandomInteger(numbers),
        b: this.generateRandomInteger(numbers),
        answer: ''
      });
    });

    // Chooses correct MathControl based on selected operation
    this.mathForm.controls.operation.valueChanges.subscribe(operation => {
      switch (operation) {
        case '+':
          this.mathForm.setValidators(MathValidators.addition('answer', 'a', 'b'));
          break;
        case '-':
          this.mathForm.setValidators(MathValidators.subtraction('answer', 'a', 'b'));
          break;
        case '*':
          this.mathForm.setValidators(MathValidators.multiplication('answer', 'a', 'b'));
          break;
        case '/':
          this.mathForm.setValidators(MathValidators.division('answer', 'a', 'b'));
          alert('Hmm.. vejo que você gosta de desafios...');
          break;
      }
    });

    // Changes random numbers range
    this.mathForm.controls.numbers.valueChanges.subscribe(nums => {
      switch (nums) {
        case '10':
          this.mathForm.patchValue({
            a: this.generateRandomInteger(10),
            b: this.generateRandomInteger(10),
            answer: ''
          });
          break;
        case '100':
          this.mathForm.patchValue({
            a: this.generateRandomInteger(100),
            b: this.generateRandomInteger(100),
            answer: ''
          });
          break;
        case '1000':
          this.mathForm.patchValue({
            a: this.generateRandomInteger(1000),
            b: this.generateRandomInteger(1000),
            answer: ''
          });
          alert('Hmm.. vejo que você gosta de desafios...');
          break;
      }
    });
  }

  // Helper method to generate random numbers from 0 - num
  generateRandomInteger(num) {
    return Math.floor(Math.random() * num);
  }

}
