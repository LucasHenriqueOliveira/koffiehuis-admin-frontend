import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from '../../services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TituloService } from 'src/app/services/titulo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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
  arrTitulos: any = [];
  arrInfo: any = [];
  arrFluidos: any = [];
  options: any = [];
  marca: any;
  modelo: any;
  versao: any;
  observacao: any;
  id: any;
  selectedTitulo: any;
  itemForm: any;
  km_ideal: any;
  meses_ideal: any;
  observacao_ideal: any;
  km_severo: any;
  meses_severo: any;
  observacao_severo: any;
  cabine: any;
  carga: any;
  parte: any;
  roda_raio: any;
  pneu_medida: any;
  calibragem_psi: any;
  observacao_info: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal,
    private Titulo: TituloService) {

      this.getForm();
  }

  getForm() {
    this.itemForm = new FormGroup({
      selectedTitulo: new FormControl(0),
      selectedItem: new FormControl(0)
    });
  }

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
          this.carroInfo(result['manual_info'], result['manual_fluido']);
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

  carroInfo(info, fluidos) {
    this.cabine = info['cabine'];
    this.carga = info['carga'];
    this.parte = info['parte'];
    this.roda_raio = info['roda_raio'];
    this.pneu_medida = info['pneu_medida'];
    this.calibragem_psi = info['calibragem_psi'];
    this.observacao_info = info['observacao_geral'];
    this.arrFluidos = fluidos;
  }

  backbutton() {
    window.history.back();
  }

  edit() {

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
      itens: arr
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

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  removeItem() {
    this.loading = true;
    this.Manual.removeItemManualCarro(this.id, this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data']['manual'];
        this.arrItemsFixo = result['data']['manual_fixo'];
        this.observacao = result['data']['observacao'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openItem(content) {
    this.modalService.open(content, { size: 'lg'});
    this.Titulo.titulo().subscribe(
      result => {
        this.arrTitulos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeTitulo() {
    this.Manual.itensManualTitulo(this.itemForm.value.selectedTitulo).subscribe(
      result => {
        this.options = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  addItem(km_ideal, meses_ideal, observacao_ideal, km_severo, meses_severo, observacao_severo) {
    const data = {
      km_ideal: km_ideal,
      meses_ideal: meses_ideal,
      observacao_ideal: observacao_ideal,
      km_severo: km_severo,
      meses_severo: meses_severo,
      observacao_severo: observacao_severo,
      marca: this.id_marca,
      modelo: this.id_modelo,
      ano: this.ano,
      versao: this.id_versao,
      item: this.itemForm.value.selectedItem
    };

    this.Manual.saveItemManualTitulo(data).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data']['manual'];
        this.arrItemsFixo = result['data']['manual_fixo'];
        this.observacao = result['data']['observacao'];
        this.getForm();
        this.km_ideal = '';
        this.meses_ideal = '';
        this.observacao_ideal = '';
        this.km_severo = '';
        this.meses_severo = '';
        this.observacao_severo = '';
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
