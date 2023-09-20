import { Component, OnInit } from '@angular/core';

import { Pangram } from './page.pangram';
import { PageService } from './page.service';
import { IWord } from './page.word';



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  panelOpenState = false;
  easyMode  = false;
  c1 : string = 'a';
  c2 : string = 'b';
  c3 : string = 'c';
  c4 : string = 'd';
  c5 : string = 'e';
  c6 : string = 'f';
  c7 : string = 'g';

  pangram : Pangram = new Pangram;
  request_pangram! : string;
  gameWords! : IWord[];
  word : string = "";
  words : string[] = [];
  founds : string[] = [];
  numWordFound : number = 0;
  points : number = 0;
  difficulty = 6;

  infoWord: string = "";
  infoWordDefinition: string[] =[];
  result = "";
  wordExist = true;

  constructor(private service: PageService) { }

  ngOnInit(): void {
    this.service.getPagram().subscribe( res =>{
      this.pangram = res;
      var charArray =  Array.from(this.pangram.input!);
      this.c1 = charArray[0];
      this.c2 = charArray[1];
      this.c3 = charArray[2];
      this.c4 = charArray[3];
      this.c5 = charArray[4];
      this.c6 = charArray[5];
      this.c7 = charArray[6];

      this.service.getWords(this.pangram.input!).subscribe(ans => {
        this.gameWords = ans as IWord[];
        this.gameWords.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        var hexagons = document.getElementsByClassName("hexagon");
        for (var i = 0; i < hexagons.length; i++) {
          (<any>hexagons.item(i)!).style.animationIterationCount = 0;
        }
      });
    });
  }

  shuffle(){
    var charArray =  Array.from(this.pangram.input?.slice(1)!);
    charArray.sort(() => Math.random() - 0.5);
    this.c2 = charArray[0];
    this.c3 = charArray[1];
    this.c4 = charArray[2];
    this.c5 = charArray[3];
    this.c6 = charArray[4];
    this.c7 = charArray[5];
  }

  post(char : string){
    console.log(char + " was pressed");
    this.word += char;
  }

  submit(){
    console.log(this.word + " was submitted");
    this.result = "";
    this.wordExist = false;
    this.word = this.word.toLowerCase();
    if(this.word.length<4){
        this.result = "Word is too short";
    } else if(this.founds.includes(this.word)){
      this.result = this.word + " : Word was already found";
    }
    else{
        this.gameWords!.forEach(element => {
            	if(element.name === this.word){

               if( new Set( this.word.split('')).size == 7){
                    this.pangram.pangramCount! -= 1;
               }

                this.numWordFound++;
                this.points += element.point;
                this.founds.push(this.word);
                this.words.push(element.name + " : " + element.point);
                this.result = this.word + " : " + element.point;
                this.wordExist = true;
                 if(this.getWordsRemaining() == 0){
                  var bee = document.getElementById("completed_id");
                  bee!.style.visibility = 'visible';
                  var hexagon = document.getElementById("main_hexagon");
                  hexagon!.style.visibility = 'hidden';
               }
              }
        });
        if(this.result === ""){
           this.result = this.word + " : Word was not found";
        }
    }
    var elem = document.getElementById("result");
    elem!.style.visibility = 'visible';
    setTimeout(function() { elem!.style.visibility = 'hidden';}, 1000);
    this.word = "";
  }

  correct(){
    if(this.word.length > 0){
      this.word = this.word.slice(0,-1);
    }
    console.log(this.word + " was corrected");
  }

  wordWasFound(str : string){
      return this.founds.includes(str);
  }

  requestPangram(){
      this.service.getRequestPagram(this.request_pangram).subscribe( res =>{
        this.pangram = res;
        console.log("INPUT - " + this.pangram.input);
        var charArray =  Array.from(this.pangram.input!);
        this.c1 = charArray[0];
        this.c2 = charArray[1];
        this.c3 = charArray[2];
        this.c4 = charArray[3];
        this.c5 = charArray[4];
        this.c6 = charArray[5];
        this.c7 = charArray[6];

        this.service.getWords(this.pangram.input!).subscribe(ans => {
          this.gameWords = ans as IWord[];
          this.gameWords.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });

          this.words = [];
          this.founds = [];
          this.points = 0;
          this.numWordFound = 0;

          var bee = document.getElementById("completed_id");
          bee!.style.visibility = 'hidden';
          var hexagon = document.getElementById("main_hexagon");
          hexagon!.style.visibility = 'visible';
        });
      });
  }

  existsButNotFound(){
    if(this.word.length<1){
      return false;
    }
    let notYetFounds = this.gameWords.filter(w => !this.founds.includes(w.name) );
    return notYetFounds.filter(w => w.name.startsWith(this.word)).length > 0;
  }

  getGameWords() : any[]{
    if(this.gameWords === undefined){
      return [];
    }

    this.easyMode = this.difficulty<6;
    if(this.easyMode){
        return this.gameWords;
    }else{
       return this.gameWords.filter(w => this.founds.includes(w.name) );;
    }
  }

  characterCanBeAppendedToMakeWord(tmp : string){
    let slice =  this.pangram.input?.slice(0,6-this.difficulty);
    if(slice?.includes(tmp)  ){
      let notYetFounds = this.gameWords.filter(w => !this.founds.includes(w.name) );
      return notYetFounds.filter(w => w.name.startsWith(this.word + tmp)).length > 0;
    }

    return false;
  }

  getInfo(item : string){
      this.infoWord = item.split(" ")[0];
      this.infoWordDefinition = [];
      this.service.getWordInfo(this.infoWord).subscribe(res => {
        var data = JSON.stringify(res);
        var definitionObj = JSON.parse(data);
        console.log(definitionObj);
        var tempresult = "";
        for(var i=0; i < definitionObj.length; i++){
          for(var m=0; m < definitionObj[i].meanings.length; m++){
            for(var d=0; d < definitionObj[i].meanings[m].definitions.length; d++){
              this.infoWordDefinition.push((definitionObj[i].meanings[m].definitions[d].definition ));
            }
          }
        }
        var elem = document.getElementById("info");
        elem!.style.visibility = 'visible';
      });
  }

  closeInfo(){
    var elem = document.getElementById("info");
    elem!.style.visibility = 'hidden';
  }

  getWordsRemaining(){
    return this.pangram.wordsCount! - this.numWordFound;
  }

  getPointsRemaining(){
    return this.pangram.maxPoint!-this.points;
  }

  hasPangram(){
    return this.pangram.pangramCount! > 0;
  }
}
