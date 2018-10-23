import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CrawlerService } from 'src/app/services/crawler.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.css']
})
export class CrawlerComponent implements OnInit {

  crawlerForm = new FormGroup({
    crawler: new FormControl('')
  });
  loading = false;

  constructor(private Crawler: CrawlerService, private notify: SnotifyService) { }

  ngOnInit() {
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
