import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { UsoService } from 'src/app/services/uso.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TituloService } from 'src/app/services/titulo.service';
import { ManualService } from 'src/app/services/manual.service';

@Component({
  selector: 'app-uso-edit-modal',
  template: `
  <form>
  <div class="modal-header">
    <h4 class="modal-title">Editar condição de uso</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
    <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <div class="form-group col-md-12">
      <textarea class="form-control" [(ngModel)]="pergunta" [ngModelOptions]="{standalone: true}"></textarea>
    </div>
    <div class="form-group col-md-12">
      <input type="text" class="form-control" [(ngModel)]="nickname" [ngModelOptions]="{standalone: true}">
    </div>
    <div class="form-group col-md-12">
      <input type="text" class="form-control" [(ngModel)]="opcao" [ngModelOptions]="{standalone: true}">
    </div>
    <div class="form-group col-md-12">
      <select id="inputCondicao" class="form-control condicao" [(ngModel)]="condicao" [ngModelOptions]="{standalone: true}">
        <option value="Ideal">Ideal</option>
        <option value="Misto">Misto</option>
        <option value="Severo">Severo</option>
      </select>
    </div>
    <div class="form-group col-md-12" *ngIf="condicao === 'Severo'">
      <p>Itens <button type="button" class="btn btn-primary btn-sm" (click)="add()">+</button></p>
      <div class="form-group col-sm-12" *ngIf="showItem">
        <select id="inputTitulo" class="form-control" [(ngModel)]="selectedTitulo"
          [ngModelOptions]="{standalone: true}" (change)="onChangeTitulo()">
          <option selected value="0">Selecione o título</option>
          <option *ngFor="let titulo of titulos" [value]="titulo.id">{{titulo.titulo}}</option>
        </select>
      </div>
      <div class="form-group col-sm-12" *ngFor="let item of options">
        <div class="form-check inline-block">
          <input type="checkbox" class="form-check-input" name="itens[{{item.id}}]" id="check_{{item.id}}" [value]="item.id"
          (change)="setItens($event.target.getAttribute('value'), $event.target.checked)">
          <label class="form-check-label" for="check_{{item.id}}">{{ item.item }}</label>
        </div>
      </div>
      <p *ngIf="options.length">Itens já cadastrados:</p>
      <ul>
        <li *ngFor="let item of items">
          {{ item.item }}
          <a (click)="remove(item.id_opcao_item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
    <button type="button" (click)="edit(pergunta, id, nickname, opcao, condicao)" class="btn btn-danger" ngbAutofocus>Editar</button>
  </div>
</form>

  `
})
export class ModalUsoEditComponent {
  @Input() pergunta;
  @Input() id;
  @Input() nickname;
  @Input() opcao;
  @Input() condicao;
  @Input() id_condicao_uso;
  @Input() items;
  itensRemovidos: any = [];
  itensAdicionados: any = [];
  options: any = [];
  showItem = false;
  selectedTitulo = 0;

  constructor(public activeModal: NgbActiveModal, private Manual: ManualService, private notify: SnotifyService) {}

  edit(pergunta, id, nickname, opcao, condicao) {
    const data = {
      id: id,
      pergunta: pergunta,
      nickname: nickname,
      opcao: opcao,
      condicao: condicao,
      id_condicao_uso: this.id_condicao_uso,
      itensRemovidos: this.itensRemovidos,
      itensAdicionados: this.itensAdicionados
    };
    this.activeModal.close(data);
  }

  add() {
    this.showItem = true;
  }

  remove(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['id_opcao_item'] === id) {
        this.items.splice(i, 1);
      }
    }
    if (this.itensRemovidos.indexOf(id) === -1) {
      this.itensRemovidos.push(id);
    }
  }

  setOptions(options) {
    this.options = options;
  }

  onChangeTitulo() {
    this.Manual.itensManualTituloSevero(this.selectedTitulo).subscribe(
      result => {
        this.setOptions(result);
      },
      error => {
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  setItens(id, checked) {
    if (checked) {
      if (this.itensAdicionados.indexOf(id) === -1) {
        this.itensAdicionados.push(id);
      }
    } else {
      for (let i = 0; i < this.itensAdicionados.length; i++) {
        if (this.itensAdicionados[i] === id) {
          this.itensAdicionados.splice(i, 1);
        }
      }
    }
  }
}

@Component({
  selector: 'app-uso',
  templateUrl: './uso.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./uso.component.css']
})
export class UsoComponent implements OnInit {

  usoForm = new FormGroup({
    pergunta: new FormControl(''),
    nickname: new FormControl('')
  });
  usoEditForm: any;
  opcao: any;
  condicao: any = '';
  loading = false;
  arrItems: any;
  arrOpcoes: any = [];
  id: any;
  arrTitulos: any = [];
  options: any;
  arrSelectedItems: any = [];
  selectedTitulo: any = 0;
  arrayItems: any = [];
  txtTitulo: any;

  constructor(private notify: SnotifyService,
    private Uso: UsoService,
    private modalService: NgbModal,
    private Titulo: TituloService,
    private Manual: ManualService) { }

  ngOnInit() {
    this.loading = true;
    this.Uso.get().subscribe(
      result => {
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar as perguntas de condições de uso', {timeout: 3000, showProgressBar: false });
      }
    );

    this.Titulo.titulo().subscribe(
      result => {
        this.loading = false;
        this.arrTitulos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openOpcao(content) {
    this.modalService.open(content);
  }

  setOptions(options) {
    this.options = options;
    this.checkItems(options);
  }

  checkItems(options) {
    for (let t = 0; t < options.length; t++) {
      for (let i = 0; i < this.arrayItems.length; i++) {
        if (Number(this.arrayItems[i]) === options[t]['id']) {
          setTimeout(function() {
            (document.getElementById('check_' + options[t]['id']) as HTMLInputElement).checked = true;
          }, 50);
        }
      }
    }
  }

  getItems(items) {
    let text = '';
    for (let i = 0; i < items.length; i++) {
      text += items[i]['item'] + '<br />';
    }
    return text;
  }

  onChangeTitulo(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtTitulo = selectElementText;
    this.Manual.itensManualTituloSevero(this.selectedTitulo).subscribe(
      result => {
        this.setOptions(result);
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  setItens(id, checked, text) {
    const titulo = parseInt(this.selectedTitulo, 10);
    if (titulo === 0) {
      alert('Selecione o título.');
      (document.getElementById('check_' + id) as HTMLInputElement).checked = false;
      return false;
    }
    if (checked) {
      this.arrayItems.push({ id: id, item: text });
    } else {
      for (let i = 0; i < this.arrayItems.length; i++) {
        if (this.arrayItems[i]['id'] === id) {
          this.arrayItems.splice(i, 1);
        }
      }
    }
  }

  closeItem() {
    this.selectedTitulo = 0;
    for (let i = 0; i < this.arrayItems.length; i++) {
      (document.getElementById('check_' + this.arrayItems[i]) as HTMLInputElement).checked = false;
    }
    this.arrayItems = [];
    this.options = '';
    this.opcao = '';
    this.condicao = '';
    this.modalService.dismissAll();
  }

  addOpcao() {
    this.arrOpcoes.push({
      opcao: this.opcao,
      condicao: this.condicao,
      txtTitulo: this.txtTitulo,
      titulo: this.selectedTitulo,
      items: this.arrayItems});

    this.arrayItems = [];
    this.options = '';
    this.opcao = '';
    this.condicao = '';
    this.selectedTitulo = 0;
    this.modalService.dismissAll();
  }

  removeOpcao(opcao) {
    this.arrOpcoes.splice(this.arrOpcoes.indexOf(opcao), 1);
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  openEdit(id, pergunta, nickname, opcao, condicao, id_condicao_uso, items) {
    const modalRef = this.modalService.open(ModalUsoEditComponent, { size: 'lg'});
    modalRef.componentInstance.pergunta = pergunta;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.nickname = nickname;
    modalRef.componentInstance.opcao = opcao;
    modalRef.componentInstance.condicao = condicao;
    modalRef.componentInstance.id_condicao_uso = id_condicao_uso;
    modalRef.componentInstance.items = items;
    modalRef.componentInstance.titulos = this.arrTitulos;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  onSubmit() {
    this.loading = true;
    const data = {
      pergunta: this.usoForm.value.pergunta,
      nickname: this.usoForm.value.nickname,
      opcoes: this.arrOpcoes,
    };

    this.Uso.save(data).subscribe(
      result => {
        this.loading = false;
        this.usoForm.reset();
        this.arrOpcoes = [];
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.usoForm.reset();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  remove() {
    this.Uso.remove(this.id).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data'];
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

  edit(data) {
    this.Uso.edit(data).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data'];
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
