import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from '../../services/manual.service';

@Component({
  selector: 'app-manual-carro',
  templateUrl: './manual-carro.component.html',
  styleUrls: ['./manual-carro.component.css']
})
export class ManualCarroComponent implements OnInit {

  id_marca: any;
  id_modelo: any;
  ano: any;
  id_versao: any;
  loading = false;
  arrItems: any = [];
  arrItemsFixo: any = [];
  marca: any;
  modelo: any;
  versao: any;
  observacao: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private notify: SnotifyService,
    private Manual: ManualService) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.id_marca = params['id_marca'];
        this.id_modelo = params['id_modelo'];
        this.ano = params['ano'];
        this.id_versao = params['id_versao'];
      });

      this.loading = true;
      this.Manual.manualCarro(this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
        result => {
          this.arrItems = result['manual'];
          this.arrItemsFixo = result['manual_fixo'];
          this.observacao = result['observacao'];
          this.loading = false;
        },
        error => {
          this.notify.error('Erro ao retornar o manual do veículo', {timeout: 3000, showProgressBar: false });
        }
      );

      const arr = this.Manual.getLocal();
      this.marca = arr['marca'];
      this.modelo = arr['modelo'];
      this.ano = arr['ano'];
      this.versao = arr['versao'];
  }

  backbutton() {
    window.history.back();
  }

  edit() {
    const arrFixo = [];
    for (let i = 0; i < this.arrItemsFixo.length; i++) {
      arrFixo.push({id: this.arrItemsFixo[i].id,
        km_ideal: (document.getElementById('fixo_km_ideal_' + this.arrItemsFixo[i].id) as HTMLInputElement).value,
        meses_ideal: (document.getElementById('fixo_meses_ideal_' + this.arrItemsFixo[i].id) as HTMLInputElement).value,
        observacao_ideal: (document.getElementById('fixo_observacao_ideal_' + this.arrItemsFixo[i].id) as HTMLInputElement).value,
        km_severo: (document.getElementById('fixo_km_severo_' + this.arrItemsFixo[i].id) as HTMLInputElement).value,
        meses_severo: (document.getElementById('fixo_meses_severo_' + this.arrItemsFixo[i].id) as HTMLInputElement).value,
        observacao_severo: (document.getElementById('fixo_observacao_severo_' + this.arrItemsFixo[i].id) as HTMLInputElement).value});
    }

    const arr = [];
    for (let i = 0; i < this.arrItems.length; i++) {
      for (let m = 0; m < this.arrItems[i]['items'].length; m++) {
        arr.push({id: this.arrItems[i]['items'][m]['id'],
        km_ideal: (document.getElementById('km_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        meses_ideal: (document.getElementById('meses_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        observacao_ideal: (document.getElementById('observacao_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        km_severo: (document.getElementById('km_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        meses_severo: (document.getElementById('meses_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        observacao_severo: (document.getElementById('observacao_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value});
      }
    }

    const data = {
      marca: this.id_marca,
      modelo: this.id_modelo,
      ano: this.ano,
      versao: this.id_versao,
      observacao: (document.getElementById('observacao') as HTMLInputElement).value,
      itens: arr,
      itensFixo: arrFixo
    };

    this.loading = true;
    this.Manual.editManualCarro(data).subscribe(
      result => {
        this.loading = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
