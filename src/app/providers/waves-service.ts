import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { timeout, retryWhen, delay, map, filter } from 'rxjs/operators';
import {
    transfer as createTransfer,
    data as createData,
  } from '@waves/waves-transactions';
declare const WavesKeeper: any;  

@Injectable()
export class WavesService {

  private readonly URL_BASE: string = 'https://www.googleapis.com/youtube/v3/search';
  private readonly API_KEY: string = 'AIzaSyDxuxEANLFVy5q4sG1NrAUJNhoX6nW4VQ4';

  constructor(private http: HttpClient) {
  }

  login(): any {
    const authData = { data: "Auth on my site" };
        if (WavesKeeper) {
            WavesKeeper.auth( authData )
            .then(auth => {
                console.log( auth ); //displaying the result on the console
                /*...processing data */
            }).catch(error => {
                console.error( error ); // displaying the result on the console
                /*...processing errors */
            })
        } else {
            alert("To Auth WavesKeeper should be installed.");
        }
  }

  makeBet(bet: number) {
    const txData = {
      type: 4,
      data: {
          amount: {
             assetId: "WAVES",
             tokens: bet.toString()
          },
          fee: {
              assetId: "WAVES",
              tokens: "0.005"
          },
          recipient: "3N3uTGTJwrAHNZzKx1nAnLESByvVcnURNAL"
      }
  };
  console.log('txData :', txData);
  WavesKeeper.signAndPublishTransaction(txData).then((data) => {
    console.log('data :', data);
      //data - a line ready for sending to Waves network's node (server)
  }).catch((error) => { 
      //processing errors
  });
  }


}
