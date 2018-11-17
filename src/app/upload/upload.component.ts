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
  lookImgUrl = '';
  memberCase = {
    'advisorId': localStorage.getItem('memberId'),
    'memberAge': '',
    'serviceType': '',
    'serviceProject': '',
    'describedResults': '',
  };
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
    this.cropperArr[index].obj.replace(window.URL.createObjectURL($event.srcElement['files'][0])) ;
    console.log(window.URL.createObjectURL($event.srcElement['files'][0]));
  }
  delImg(item, index) {
    item.returnData.real = '';
    item.returnData.big = '';
    item.returnData.small = '';
    $('.upppinput' + index).val('');
  }
  showLook(item) {
    this.lookImgUrl = item.returnData.real;
  }
  sureImg() {
    // 大图
    const casbig = this.cropperArr[this.indexNow].obj.getCroppedCanvas();
    const base64big = casbig.toDataURL('image/jpeg'); // 转换为base64
    const databig = encodeURIComponent(base64big);
    // 缩略图
    const cassmall = this.cropperArr[this.indexNow].obj.getCroppedCanvas({width: 88, height: 150});
    const base64small = cassmall.toDataURL('image/jpeg'); // 转换为base64
    const datasamll = encodeURIComponent(base64small);
    console.log(111, base64big);
    console.log(222, base64small);
    this.cropperArr[this.indexNow].returnData.big = databig;
    this.cropperArr[this.indexNow].returnData.small = datasamll;
    this.cropperArr[this.indexNow].returnData.real = base64big;
    this.indexNow = -1;
    this.isshow = false;

  }
  crearImg(imageDom, previewDom) {
    return new Cropper(imageDom, {
      aspectRatio: 88 / 150,
      movable: true,
      zoomable: true,
      viewMode: 2,
      cropBoxResizable: false,
      // preview: previewDom,
      crop: function(e) {
      }
    });
  }
  creatArr() {
    for (let i = 0; i < 6; i++) {
      this.cropperArr.push(
        {obj: this.crearImg(document.getElementById('image' + i),
          '.psbox' + i), returnData: {'big': '', 'small': '' , 'real': ''}}
      );
    }
  }
  save() {
    const panduanJson = [];
    let imgsUrl = '';
    for (let i = 0; i < this.cropperArr.length; i++) {
      panduanJson.push({img : this.cropperArr[i].returnData.big});
      if (this.cropperArr[i].returnData.big !== '' && this.cropperArr[i].returnData.small !== '') {
        imgsUrl = imgsUrl + '&caseBean.img[' + i + '].big=' + this.cropperArr[i].returnData.big
          + '&caseBean.img[' + i + '].small=' + this.cropperArr[i].returnData.small;
      }
    }
    if (!imgsUrl) {
      this.alertBox.error('您还未上传图片~');
      return;
    }
    if ((panduanJson[0].img !== '' && panduanJson[1].img === '') || (panduanJson[0].img === '' && panduanJson[1].img !== '')) {
      this.alertBox.error('您少传一张图片~');
      return;
    }
    if ((panduanJson[2].img !== '' && panduanJson[3].img === '') || (panduanJson[2].img === '' && panduanJson[3].img !== '')) {
      this.alertBox.error('您少传一张图片~');
      return;
    }
    if ((panduanJson[4].img !== '' && panduanJson[5].img === '') || (panduanJson[4].img === '' && panduanJson[5].img !== '')) {
      this.alertBox.error('您少传一张图片~');
      return;
    }
    const memberCase = 'caseBean.memberCase.advisorId=' + this.memberCase.advisorId + '&caseBean.memberCase.memberAge=' +
      this.memberCase.memberAge + '&caseBean.memberCase.serviceType=' + this.memberCase.serviceType +
      '&caseBean.memberCase.serviceProject=' + this.memberCase.serviceProject +
      '&caseBean.memberCase.describedResults=' + this.memberCase.describedResults;
    console.log(imgsUrl);
    console.log(memberCase);
    this.userConfigService.uploadit(memberCase + imgsUrl)
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

  choseType(type) {
    this.memberCase.serviceType = type;
  }
}
