import {Injectable, ViewChild} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import wx from 'weixin-js-sdk';
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
    })
  };
  /**
   * 公共地址
   */
  configUrl = 'http://mp.needai.com';
  // configUrl = 'http://47.105.65.44:9000';
  /**
   * 判断no auth进行地址跳转
   */
  private canGoHref(data: any) {
    if (data.result.message === 'no auth') {
      window.location.href = data.result.data;
    }
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // 出现客户端或网络错误.
      console.log(error.error.message);
      // console.error('An error occurred:', error.error.message);
    } else {
      // 后端返回一个不成功的响应代码.
      // 反应体可能包含错误的线索,
      const text = 'code:' + error.error.status + ',' + error.error.error;
      console.log(text);
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 首页数据
   */
  indexView(latitude: any, longitude: any): Observable<any> {
    return this.http.get(this.configUrl + '/indexView?longitude=' + longitude + '&latitude=' + latitude, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }

  /**
   * 详情页数据
   */
  getGoodsInfo(goodsId: any, storeId: any): Observable<any> {
    return this.http.get(this.configUrl + '/getGoodsInfo?goodsId=' + goodsId + '&storeId=' + storeId, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }

  /**
   * 特卖商品页数据
   */
  getOnSalesGoods(): Observable<any> {
    return this.http.get(this.configUrl + '/getOnSalesGoods', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 获取购物车数量
   */
  cartGetCartDetailNumber(memberId: any, storeId: any): Observable<any> {
    const params = '?memberId=' + memberId + '&storeId=' + storeId ;
    return this.http.get(this.configUrl + '/cart/getCartDetailNumber' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 立即购买
   */
  checkoutOutrightPurchase(memberId: any, storeId: any, type: any, skuId: any): Observable<any> {
    const params = 'memberId=' + memberId + '&storeId=' + storeId + '&type=' + type + '&id=' + skuId ;
    return this.http.post(this.configUrl + '/checkout/outrightPurchase', params, this.headoptionsPost)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 金额付款订单结算下单
   */
  checkoutAddCashOrder(order: any, discounts: any): Observable<any> {
    let params = 'order.memberId=' + order.memberId + '&order.storeId=' + order.storeId +
      '&order.orderPriceAmount=' + order.orderPriceAmount + '&order.discountPriceAmout=' + order.discountPriceAmout;
    if (discounts.id !== '') {
      params = params + '&discounts.id=' + discounts.id + '&discounts.authCode=' + discounts.authCode;
    }
    return this.http.post(this.configUrl + '/checkout/addCashOrder', params, this.headoptionsPost)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 扫二维码获取订单优惠
   */
  checkoutGetSettleAccountsDiscounts(allMoney: any, discounts: any): Observable<any> {
    const params = '?discounts.id=' + discounts.id + '&discounts.authCode=' + discounts.authCode +
      '&discounts.priceAmount=' + allMoney;
    return this.http.post(this.configUrl + '/checkout/getSettleAccountsDiscounts' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 商品订单结算下单
   */
  checkoutAdd(sku: any, type: any, order: any, discounts: any): Observable<any> {
    let params = 'sku=' + sku + '&type=' + type + '&order.memberId=' + order.memberId +
      '&order.storeId=' + order.storeId + '&order.orderRemark=' + order.orderRemark +
      '&order.subscribePhone=' + order.subscribePhone + '&order.linkman=' + order.linkman +
      '&order.discountPriceAmout=' + order.discountPriceAmout;
    if (discounts.id !== '') {
      params = params + '&discounts.id=' + discounts.id + '&discounts.authCode=' + discounts.authCode;
    }
    return this.http.post(this.configUrl + '/checkout/add', params, this.headoptionsPost)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 发起微信支付请求
   */
  paymentWechatPrepay(orderId: string): Observable<any> {
    return this.http.get(this.configUrl + '/payment/wechat/prepay?orderId=' + orderId, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 获取导师信息
   */
  advisorGetAdvisorByMember(memberId: string): Observable<any> {
    return this.http.get(this.configUrl + '/advisor/getAdvisorByMember?memberId=' + memberId, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 获取导师优惠二维码
   */
  advisorGetAdvisorDiscounts(discounts: any): Observable<any> {
    const params = '?discounts.advisorId=' + discounts.advisorId + '&discounts.discountsType=' + discounts.discountsType +
      '&discounts.discounts=' + discounts.discounts;
    return this.http.get(this.configUrl + '/advisor/getAdvisorDiscounts' + params , this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 导师扫码销单获取详情
   */
  advisorGetOrderCheckoffDetail(id: any, code: any): Observable<any> {
    const params = '?id=' + id + '&code=' + code ;
    return this.http.get(this.configUrl + '/advisor/getOrderCheckoffDetail' + params , this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 导师确认核销订单
   */
  advisorCheckoffOrderDetail(detailId: any , orderId: any , advisorId: any): Observable<any> {
    const params = '?detailId=' + detailId + '&orderId=' + orderId + '&advisorId=' + advisorId;
    return this.http.get(this.configUrl + '/advisor/checkoffOrderDetail' + params , this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }

  /**
   * 上传
   */
  uploadit(param: any): Observable<any> {
    return this.http.post(this.configUrl + '/advisor/saveMemberCase', param, this.headoptionsPost)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
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
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 会员订单列表
   */
  orderGetMemberOrderList(memberId: any, orderStatus: any, startLimit: any, pageNumber: any): Observable<any> {
    const params = '?memberId=' + memberId + '&orderStatus=' + orderStatus + '&startLimit=' + startLimit + '&pageNumber=' + pageNumber ;
    return this.http.get(this.configUrl + '/order/getMemberOrderList' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 订单详细信息
   */
  orderGetOrderInfo(orderId: any): Observable<any> {
    const params = '?orderId=' + orderId;
    return this.http.get(this.configUrl + '/order/getOrderInfo' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 取消订单
   */
  cancelOrder(orderId: any): Observable<any> {
    const params = '?orderId=' + orderId;
    return this.http.get(this.configUrl + '/order/cancelOrder' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
  /**
   * 获取定位最近店铺信息
   */
  getNextStoreInfo(latitude: any, longitude: any): Observable<any> {
    const params = '?latitude=' + latitude + '&longitude=' + longitude;
    return this.http.get(this.configUrl + '/getNextStoreInfo' + params, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
        tap(data => this.canGoHref(data))
      );
  }
}

