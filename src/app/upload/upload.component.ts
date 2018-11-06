import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
  private cropper: any;
  isshow = false;
  constructor() { }
  ngOnInit() {
    const image = <HTMLImageElement>document.getElementById('image');
    this.cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      movable: true,
      zoomable: true,
      crop: function(e) {
        console.log(e.detail.x);
        console.log(e.detail.y);
        console.log(e.detail.width);
        console.log(e.detail.height);
        console.log(e.detail.rotate);
        console.log(e.detail.scaleX);
        console.log(e.detail.scaleY);
      }
    });
  }
  getImgUrl($event) {
    this.cropper.replace(window.URL.createObjectURL($event.path[0].files[0])) ;
    this.isshow = true;
    console.log($event);
  }
}
