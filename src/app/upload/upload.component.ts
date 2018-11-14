import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  cropperArr = [];
  isshow = false;
  indexNow = 0;
  previewDomNow: any;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor( private titleService: Title, private userConfigService: UserConfigService) { }
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
    const cas = this.cropperArr[this.indexNow].obj.getCroppedCanvas();
    const base64 = cas.toDataURL('image/jpeg'); // 转换为base64
    // const data = encodeURIComponent(base64);
    const data = this.dataURLtoFile(base64, 'bbq')
    console.log(111, base64)
    console.log(222, data)
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
    const arr = 'fistimg=' + JSON.stringify(this.cropperArr[0].returnData);
    const formData = new FormData();
    formData.append('uploadFile', this.cropperArr[0].returnData);
    formData.append('uploadFile1', this.cropperArr[1].returnData);
    formData.append('uploadFile2', this.cropperArr[2].returnData);
    formData.append('uploadFile3', this.cropperArr[3].returnData);
    console.log(this.cropperArr);
    this.userConfigService.uploadit(formData)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

  dataURLtoFile(dataurl, filename) {// 将base64转换为文件
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const  u8arr = new Uint8Array(n);
    while ( n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }


}
