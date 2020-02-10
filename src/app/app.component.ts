import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { WavesService } from './providers/waves-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private wavesService: WavesService) {
    
  }

  ngOnInit() {
    this.wavesService.login()
  }
}
