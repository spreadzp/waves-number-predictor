import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicErrorHandler } from 'ionic-angular';

// NGXS
import { MovieState } from '../app/store/state/movies.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { MoviesService } from './providers/movies-service';
import { YoutubeApiService } from './providers/youtube-api-service';
import { SearchImageService } from './providers/search-image-service';
import { WavesService } from './providers/waves-service';
import { GamesService } from './providers/games-service';
import { GameState } from './store/state/games.state';
import { PagesModule } from './pages/pages.module';
// import { CommentModule } from './modals/comment-modal/comment.module';
import { SoundsService } from './providers/sounds.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentModalComponent } from './modals/comment-modal/comment.modal';
import { YoutubeModalComponent } from './modals/youtube-modal/youtube.modal';
import { GameModalComponent } from './modals/game-modal/game.modal';


@NgModule({
  declarations: [
    AppComponent,
    YoutubeModalComponent,
    GameModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    NgxsModule.forRoot([ MovieState, GameState]),
    NgxsStoragePluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    PagesModule,
    BrowserAnimationsModule,
  ],
  providers: [MoviesService, YoutubeApiService, SearchImageService, WavesService, GamesService,
     SoundsService, NativeAudio, // New provider, don't forget to add comma
     {provide: ErrorHandler, useClass: ErrorHandler}],
  bootstrap: [AppComponent]
})
export class AppModule {}
