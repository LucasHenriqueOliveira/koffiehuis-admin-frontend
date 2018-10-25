import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../services/veiculo.service';
import { ManualService } from '../services/manual.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  loading = false;
  arrMarcas: any;
  arrModelos: any;
  arrItems: any;
  manualForm: any;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService) {
      this.getForm();
  }

  getForm() {
    this.manualForm = new FormGroup({
      item: new FormControl(''),
      km: new FormControl(''),
      meses: new FormControl(''),
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0)
    });
  }

  ngOnInit() {
    this.loading = true;
    this.Veiculo.marcas().subscribe(
      result => {
        this.arrMarcas = result;
      },
      error => {
        this.notify.error('Erro ao retornar as marcas dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );

    this.Manual.items().subscribe(
      result => {
        this.loading = false;
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar as marcas dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChange() {
    this.loading = true;
    this.Veiculo.modelos(this.manualForm.value.selectedMarca).subscribe(
      result => {
        this.loading = false;
        this.arrModelos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.manualForm.value.item && this.manualForm.value.km && this.manualForm.value.meses
    && !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  onSubmit() {
    this.loading = true;
    this.Manual.save(this.manualForm.value).subscribe(
      result => {
        this.loading = false;
        this.getForm();
        this.notify.success(result['data'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.getForm();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
