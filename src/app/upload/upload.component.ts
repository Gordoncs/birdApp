import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  private cropperArr = [];
  private isshow = false;
  private indexNow = 0;
  private previewDomNow: any;
  constructor() { }
  ngOnInit() {
    this.creatArr();
  }
  getImgUrl($event, index) {
    this.indexNow = index;
    this.isshow = true;
    this.previewDomNow = '.psbox' + index;
    this.cropperArr[index].obj.replace(window.URL.createObjectURL($event.path[0].files[0])) ;
    console.log(window.URL.createObjectURL($event.path[0].files[0]));
    $('.photoLookBox').find('input').val('');
  }
  sureImg() {
    // @ts-ignore
    const cas = this.cropperArr[this.indexNow].obj.getCroppedCanvas();
    const base64 = cas.toDataURL('image/jpeg'); // 转换为base64
    const data = encodeURIComponent(base64);
    this.cropperArr[this.indexNow].returnData = data;
    console.log(data);
    this.indexNow = -1;
    this.isshow = false;
  }
  crearImg(imageDom, previewDom) {
    return new Cropper(imageDom, {
      aspectRatio: 1 / 1,
      movable: true,
      zoomable: true,
      viewMode: 2,
      preview: previewDom,
      crop: function(e) {}
    });
  }
  creatArr() {
    for (let i = 0; i < 2; i++) {
      this.cropperArr.push({obj: this.crearImg(<HTMLImageElement>document.getElementById('image' + i),
          '.psbox' + i), returnData: ''});
    }
  }
  save() {
    console.log(this.cropperArr);
  }
}
