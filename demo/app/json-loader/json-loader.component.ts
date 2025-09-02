import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type JSONLoaderChanges={
  srcType:'URL'|'FILE'
  url?:string
  jsonData:any
}


@Component({
  selector: 'app-json-loader',
  templateUrl: './json-loader.component.html',
  styleUrls: ['./json-loader.component.scss'],
  standalone:false
})
export class JsonLoaderComponent implements OnInit{

  //switch for ang vers<17
  @Output() jsonDataChange = new EventEmitter<JSONLoaderChanges>();  // Emit changes to the parent
  //readonly jsonDataChange = output<JSONLoaderChanges>()
  jsonData: any = null;
  errorMessage: string = '';
  //urlInput = model<string>('');
  //switch for ang vers<17
  @Input() urlInput:string 

  getUrlInputValue(){
     //switch for ang vers<17
    return this.urlInput;
    //return this.urlInput();
  }

  ngOnInit(): void {
    let url=this.getUrlInputValue();
    if(url){
      this.loadJsonFromUrl();
    }
  }


  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.jsonData = JSON.parse(reader.result as string);
          this.errorMessage = '';
          this.jsonDataChange.emit({
            srcType:'FILE',
            jsonData:this.jsonData
          })
        } catch (e) {
          this.errorMessage = 'Error parsing JSON file';
          this.jsonData = null;
          this.jsonDataChange.emit({
            srcType:'FILE',
            jsonData:this.jsonData
          })
        }
      };
      reader.readAsText(file);
    }
  }
  clearUrlInput(): void {
    this.urlInput="";
    this.jsonDataChange.emit({
      srcType:'URL',
      url:this.getUrlInputValue(),
      jsonData:this.jsonData
    })
    
  }
  loadJsonFromUrl() {
    if (!this.getUrlInputValue()) return;

    this.errorMessage = '';
    fetch(this.getUrlInputValue())
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        this.jsonData = data;
        this.jsonDataChange.emit({
          srcType:'URL',
          url:this.getUrlInputValue(),
          jsonData:this.jsonData
        })
      })
      .catch(() => {
        this.errorMessage = 'Error fetching JSON from URL';
        this.jsonData = null;
        this.jsonDataChange.emit({
          srcType:'URL',
          url:this.getUrlInputValue(),
          jsonData:this.jsonData
        })
      });
  }
}
