import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  manualForm = new FormGroup({
    item: new FormControl(''),
    km: new FormControl(''),
    meses: new FormControl('')
  });
  loading = false;

  constructor() { }

  ngOnInit() {
  }

  checkButton() {
    return this.manualForm.value.item && this.manualForm.value.km && this.manualForm.value.meses;
  }

}
