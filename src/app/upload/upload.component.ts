import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
import * as lrz from 'lrz/dist/lrz.all.bundle.js';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TongxinService} from '../shared/tongxin.service';
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
    'advisorId': '',
    'memberAge': '',
    'serviceType': '',
    'serviceProject': '',
    'describedResults': '',
  };
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }
  ngOnInit() {
    window.URL = window.URL || window['webkitURL'];
    this.titleService.setTitle('案例上传');
    this.routerInfo.params.subscribe((params) =>
      this.memberCase.advisorId = params['advisorId']
    );
    this.creatArr();
  }
  getImgUrl($event, index) {
    // alert(window.URL);
    // alert(window['webkitURL']);
    // alert(window.URL.createObjectURL($event.srcElement['files'][0]));
    // alert($event.srcElement['files'][0]);
    let yaImg = '';
    const t = this;
    this.alertBox.load();
    // 压缩图片
    lrz($event.srcElement['files'][0])
      .then(function (rst) {
        // 处理成功会执行
        // console.log(rst);
        // alert('压缩成功')
        yaImg = rst.base64;
        t.indexNow = index;
        t.isshow = true;
        t.cropperArr[index].obj.replace(yaImg) ;
        t.alertBox.close();
      })
      .catch(function (err) {
        // 处理失败会执行
      })
      .always(function () {
        // 不管是成功失败，都会执行
      });
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
    // console.log(111, base64big);
    // console.log(222, base64small);
    this.cropperArr[this.indexNow].returnData.big = databig;
    this.cropperArr[this.indexNow].returnData.small = datasamll;
    this.cropperArr[this.indexNow].returnData.real = base64big;
    const objs = this.cropperArr[this.indexNow].obj;
    objs.destroy();
    $('#image' + this.indexNow).attr('src', '');
    $('#image' + this.indexNow).parent().find('.cropper-container').remove();
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
    if (this.memberCase.memberAge === '') {
      this.alertBox.error('您还未填写客户年龄~');
      return;
    }
    if (this.memberCase.serviceType === '') {
      this.alertBox.error('您还未选择服务系列~');
      return;
    }
    if (this.memberCase.serviceProject === '') {
      this.alertBox.error('您还未填写服务项目~');
      return;
    }
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
    if (this.memberCase.describedResults === '') {
      this.alertBox.error('您还未填写效果描述~');
      return;
    }
    const memberCase = 'caseBean.memberCase.advisorId=' + this.memberCase.advisorId + '&caseBean.memberCase.memberAge=' +
      this.memberCase.memberAge + '&caseBean.memberCase.serviceType=' + this.memberCase.serviceType +
      '&caseBean.memberCase.serviceProject=' + this.memberCase.serviceProject +
      '&caseBean.memberCase.describedResults=' + this.memberCase.describedResults;
    this.alertBox.load();
    this.userConfigService.uploadit(memberCase + imgsUrl)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.alertBox.success('上传成功！');
          setTimeout(function () {
            history.go(-1);
          }, 2000);
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
