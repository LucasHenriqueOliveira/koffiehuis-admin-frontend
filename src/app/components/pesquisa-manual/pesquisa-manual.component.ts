import { Component, OnInit, Input } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisa-manual',
  templateUrl: './pesquisa-manual.component.html',
  styleUrls: ['./pesquisa-manual.component.css']
})
export class PesquisaManualComponent implements OnInit {

  loading = false;
  pesquisa = false;
  arrMarcas: any;
  arrModelos: any;
  arrItens: any = [];
  id_marca: any;
  id_modelo: any;
  ano: any;
  id_versao: any;
  manualForm = new FormGroup({
    selectedMarca: new FormControl(0),
    selectedModelo: new FormControl(0)
  });

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal,
    private router: Router) {
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

    this.lastManual();
  }

  lastManual() {
    this.Manual.lastManual().subscribe(
      result => {
        this.arrItens = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
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
    return !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  onSubmit() {
    this.loading = true;
    this.Manual.listManual(this.manualForm.value.selectedModelo).subscribe(
      result => {
        this.arrItens = result;
        this.loading = false;
        this.pesquisa = true;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id_marca, id_modelo, ano, id_versao) {
    this.id_marca = id_marca;
    this.id_modelo = id_modelo;
    this.ano = ano;
    this.id_versao = id_versao;
    this.modalService.open(content);
  }

  remove() {
    this.Manual.removeManualCarro(this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
      result => {
        this.loading = false;
        this.arrItens = result['data'];
        if (!this.arrItens.length) {
          this.lastManual();
        }
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openEdit(id_marca, marca, id_modelo, modelo, ano, id_versao, versao) {
    this.Manual.setLocal(marca, modelo, ano, versao);
    this.router.navigate(['/manual-carro'],  { queryParams: { id_marca: id_marca,
      id_modelo: id_modelo, ano: ano, id_versao: id_versao} });
  }

  edit(data) {
    this.Manual.editManualCarro(data).subscribe(
      result => {
        this.loading = false;
        this.arrItens = result['data'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
