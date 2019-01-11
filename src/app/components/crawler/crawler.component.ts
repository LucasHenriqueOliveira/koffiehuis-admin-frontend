import { Component, OnInit } from '@angular/core';
import { CrawlerService } from 'src/app/services/crawler.service';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from 'src/app/services/veiculo.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.css']
})
export class CrawlerComponent implements OnInit {

  loading = false;
  arrMarcas: any;
  arrModelos: any;
  arrAnos: any;
  arrVersoes: any;
  crawlerForm: any;

  constructor(private Crawler: CrawlerService, private notify: SnotifyService, private Veiculo: VeiculoService) {
    this.getForm();
  }

  getForm() {
    this.crawlerForm = new FormGroup({
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0),
      selectedAno: new FormControl(0),
      selectedVersao: new FormControl(0)
    });
  }

  ngOnInit() {
    this.loading = true;
    this.Veiculo.marcas().subscribe(
      result => {
        this.arrMarcas = result;
        this.loading = false;
      },
      error => {
        this.notify.error('Erro ao retornar as marcas dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeMarca() {
    this.loading = true;
    this.Veiculo.modelos(this.crawlerForm.value.selectedMarca).subscribe(
      result => {
        this.loading = false;
        this.arrModelos = result;
        this.crawlerForm.value.selectedAno = 0;
        this.crawlerForm.value.selectedVersao = 0;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeModelo() {
    this.loading = true;
    this.Veiculo.anos(this.crawlerForm.value.selectedModelo).subscribe(
      result => {
        this.loading = false;
        this.arrAnos = result;
        this.crawlerForm.value.selectedVersao = 0;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os anos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeAno() {
    this.loading = true;
    this.Veiculo.versoes(this.crawlerForm.value.selectedAno).subscribe(
      result => {
        this.loading = false;
        this.arrVersoes = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar as versões dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onSubmit() {
    switch (this.crawlerForm.value.crawler) {
      case 'marcas':
        this.loading = true;
        this.Crawler.marcas().subscribe(
          data => {
            const values = {type: 'marcas', data: data };
            this.Crawler.save(values).subscribe(
              result => {
                this.loading = false;
                this.crawlerForm.reset();
                this.notify.success(result['data'], {timeout: 2000, showProgressBar: false });
              },
              error => {
                this.loading = false;
                this.crawlerForm.reset();
                this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
              }
            );
          },
          error => {
            this.loading = false;
            this.crawlerForm.reset();
            this.notify.error('Erro na URL de operação da Tabela Fipe.');
          }
        );
        break;
      case 'modelos':
        this.Crawler.save({type: 'modelos'}).subscribe(
          result => {
            this.loading = false;
            this.crawlerForm.reset();
            this.notify.success(result['data'], {timeout: 2000, showProgressBar: false });
          },
          error => {
            this.loading = false;
            this.crawlerForm.reset();
            this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
          }
        );
        break;
    }
  }

}
