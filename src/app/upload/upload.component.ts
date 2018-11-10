import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';

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
  constructor( private titleService: Title) { }
  ngOnInit() {
    this.titleService.setTitle('案例上传');
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
    console.log(cas);
    const base64 = cas.toDataURL('image/jpeg'); // 转换为base64
    console.log(this.tobeFile(base64));
    const data = encodeURIComponent(base64);
    console.log(this.tobeFile(data));
    this.cropperArr[this.indexNow].returnData = data;
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
    for (let i = 0; i < 6; i++) {
      this.cropperArr.push(
        {obj: this.crearImg(<HTMLImageElement>document.getElementById('image' + i),
          '.psbox' + i), returnData: ''}
      );
    }
  }
  save() {
    console.log(this.cropperArr);
  }
  convertBase64UrlToBlob(urlData) {
    const bytes = window.atob(urlData.split(',')[1]);        // 去掉url的头，并转换为byte

    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);

    const ia = new Uint8Array(ab);

    for (let i = 0; i < bytes.length; i++) {          ia[i] = bytes.charCodeAt(i);      }
    console.log(1111, new Blob( [ab] , {type : 'image/png'}));
    return new Blob( [ab] , {type : 'image/png'});

  }
  tobeFile(base64Codes) {
    const t = this;
    const formData = new FormData();
    // convertBase64UrlToBlob函数是将base64编码转换为Blob
    formData.append('imageName', t.convertBase64UrlToBlob(base64Codes), 'aaaa');  // append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同
    console.log(22222, formData);
  }
}
