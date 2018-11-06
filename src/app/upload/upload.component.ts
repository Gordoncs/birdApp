import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
  private image: any;
  cropper1: any;
  cropper2: any;
  cropper3: any;
  cropper4: any;
  isshow = false;
  constructor() { }
  ngOnInit() {
    this.image = <HTMLImageElement>document.getElementById('image');
  }
  getImgUrl($event) {
    this.cropper1.replace(window.URL.createObjectURL($event.path[0].files[0])) ;
    this.isshow = true;
    console.log(window.URL.createObjectURL($event.path[0].files[0]));
    $('.photoLookBox').find('input').val('');
  }
  sureImg() {
    // @ts-ignore
    const cas = this.cropper.getCroppedCanvas();
    const base64 = cas.toDataURL('image/jpeg'); // 转换为base64
    const data = encodeURIComponent(base64);
    console.log(data);
    this.isshow = false;
  }
  crearImg(index: any, previewDom) {
    if (index === 0) {
      this.cropper1 = new Cropper(this.image, {
        aspectRatio: 1 / 1,
        movable: true,
        zoomable: true,
        viewMode: 2,
        preview: previewDom,
        crop: function(e) {}
      });
    }
  }
}
