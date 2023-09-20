import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  // Declared in environment.prod.ts
  url : string = "";

  constructor(private http: HttpClient) {
    this.url = environment.functionUrls.url;
   }

  getPagram(){
    return  this.http.get( `${this.url}/api/Pangrams`);
  }

  getRequestPagram(input : string){
    return  this.http.get(`${this.url}/api/Pangrams/request/${input}`);
  }

  postWord(word : string) {
    // this.http.post('http://localhost:5141/api/Words/check', word).subscribe(res => {
    //   console.log(res);
    // });
  }

  getWords(input : string){
    return  this.http.get(`${this.url}/api/Words/getWords/${input}`);
  }

  getWordInfo(input : string){
    return  this.http.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
  }

}
