import {Injectable, ViewChild} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserConfigService {
  /**
   * 头部声明
   */
  headoptions = {
    headers: new HttpHeaders({
      'os': localStorage.getItem('os'),
      'osVersion': localStorage.getItem('osVersion'),
      'channel': localStorage.getItem('channel'),
      'language': localStorage.getItem('language'),
      'Content-Type': 'application/json',
    })
  };
  headoptionsPost = {
    headers: new HttpHeaders({
      'os': localStorage.getItem('os'),
      'osVersion': localStorage.getItem('osVersion'),
      'channel': localStorage.getItem('channel'),
      'language': localStorage.getItem('language'),
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'multipart/form-data',
      // 'Accept': 'application/json'
    })
  };
  /**
   * 公共地址
   */
  // configUrl = 'http://mp.needai.com';
  configUrl = 'http://47.105.65.44:9000';

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // 出现客户端或网络错误.
      console.log(error.error.message);
      // console.error('An error occurred:', error.error.message);
    } else {
      // 后端返回一个不成功的响应代码.
      // 反应体可能包含错误的线索,
      const text = 'code:' + error.error.status + ',' + error.error.error;
      console.log(text);
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      '接口' + error.error['path'] + '发生了不好的事情，请稍后再试。');
  }
  constructor(private http: HttpClient) {
  }
  /**
   * 获取用户信息
   */
  baseMember(): Observable<any> {
    return this.http.get(this.configUrl + '/base/member', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 首页数据
   */
  indexView(): Observable<any> {
    return this.http.get(this.configUrl + '/indexView?longitude=116.37333&latitude=39.91474', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 详情页数据
   */
  getGoodsInfo(goodsId: any, storeId: any): Observable<any> {
    return this.http.get(this.configUrl + '/getGoodsInfo?goodsId=' + goodsId + '&storeId=' + storeId, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 特卖商品页数据
   */
  getOnSalesGoods(): Observable<any> {
    return this.http.get(this.configUrl + '/getOnSalesGoods', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 加入购物车
   */
  cartAdd(memberId: any, skuId: any, storeId: any, number: any): Observable<any> {
    const params = '?memberId=' + memberId + '&skuId=' + skuId + '&storeId=' + storeId + '&number=' + number;
    return this.http.get(this.configUrl + '/cart/add' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
    // return this.http.post(this.configUrl + '/cart/add',   JSON.stringify({ params: params} ), this.headoptions)
    //   .pipe(
    //     retry(1),
    //     catchError(this.handleError)
    //   );

    // const body =  'FormData1=' + 'onetap' + '&FormData2=' + '123456';
    // return this.http.post(this.configUrl + '/cart/add', body, this.headoptionsPost)
    //   .pipe(
    //     retry(1),
    //     catchError(this.handleError)
    //   );
  }
  /**
   * 获取购物车数量
   */
  cartGetCartDetailNumber(memberId: any, storeId: any): Observable<any> {
    const params = '?memberId=' + memberId + '&storeId=' + storeId ;
    return this.http.get(this.configUrl + '/cart/getCartDetailNumber' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 获取购物车列表
   */
  cartGetCart(memberId: any, storeId: any): Observable<any> {
    const params = '?memberId=' + memberId + '&storeId=' + storeId ;
    return this.http.get(this.configUrl + '/cart/getCart' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 购物车数量加减
   */
  cartChangeGoodsNumber(memberId: any, skuId: any, number: any): Observable<any> {
    const params = '?memberId=' + memberId + '&skuId=' + skuId + '&number=' + number ;
    return this.http.get(this.configUrl + '/cart/changeGoodsNumber' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 购物车删除
   */
  cartDelCartGoods(memberId: any, skuId: any): Observable<any> {
    const params = '?memberId=' + memberId + '&skuId=' + skuId ;
    return this.http.get(this.configUrl + '/cart/delCartGoods' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 购物车结算跳转支付确认
   */
  checkoutInfo(memberId: any, storeId: any, skuId: any): Observable<any> {
    const params = '?memberId=' + memberId + '&storeId=' + storeId + '&sku=' + skuId ;
    return this.http.get(this.configUrl + '/checkout/info' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 商品订单结算下单
   */
  checkoutAdd(sku: any, type: any, order: any, bean: any): Observable<any> {
    const params = 'sku=' + sku + '&type=' + type + '&order.memberId=' + order.memberId +
      '&order.storeId=' + order.storeId + '&order.orderRemark=' + order.orderRemark +
      '&order.subscribePhone=' + order.subscribePhone + '&order.linkman=' + order.linkman +
      '&order.discountPriceAmout=' + order.discountPriceAmout + '&bean.id=' + bean.id + '&bean.authCode=' + bean.authCode;
    return this.http.post(this.configUrl + '/checkout/add', params, this.headoptionsPost)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 上传
   */
  uploadit(param: any): Observable<any> {
    return this.http.post(this.configUrl + '/checkout/info', param)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 会员主页信息
   */
  getMemberIndexInfo(memberId: any): Observable<any> {
    const params = '?memberId=' + memberId ;
    return this.http.get(this.configUrl + '/getMemberIndexInfo' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 会员影响力列表接口
   */
  getMemberInfluenceList(memberId: any, startLimit: any, pageNumber: any): Observable<any> {
    const params = '?memberId=' + memberId + '&startLimit=' + startLimit + '&pageNumber=' + pageNumber ;
    return this.http.get(this.configUrl + '/getMemberInfluenceList' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 会员幸运指数列表接口
   */
  getMemberActivityRecordList(memberId: any, startLimit: any, pageNumber: any): Observable<any> {
    const params = '?memberId=' + memberId + '&startLimit=' + startLimit + '&pageNumber=' + pageNumber ;
    return this.http.get(this.configUrl + '/getMemberActivityRecordList' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

}

