import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { CrawlerComponent } from './components/crawler/crawler.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CrawlerService } from './services/crawler.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManualComponent } from './manual/manual.component';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    RequestResetComponent,
    ResponseResetComponent,
    CrawlerComponent,
    DashboardComponent,
    ManualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SnotifyModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    TokenService,
    AuthService,
    BeforeLoginService,
    AfterLoginService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    CrawlerService,
    { provide: LOCALE_ID, useValue: 'pt-PT' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
