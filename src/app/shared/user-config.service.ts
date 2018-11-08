import {Injectable} from '@angular/core';
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
    })
  };
  /**
   * 公共地址
   */
  // configUrl = 'http://mp.needai.com';
  configUrl = 'http://47.105.65.44:9000';

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  constructor(private http: HttpClient) {
  }
  /**
   * 获取用户信息
   */
  baseMember() {
    return this.http.get(this.configUrl + '/base/member', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  /**
   * 首页数据
   */
  indexView() {
    return this.http.get(this.configUrl + '/indexView?longitude=116.37333&latitude=39.91474', this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 详情页数据
   */
  getGoodsInfo(goodsId: any, storeId: any) {
    return this.http.get(this.configUrl + '/getGoodsInfo?goodsId=' + goodsId + '&storeId=' + storeId, this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 加入购物车
   */
  cartAdd(memberId: any, skuId: any, storeId: any, num: any) {

    const params = {
      'memberId': memberId,
      'skuId': skuId,
      'storeId': storeId,
      'num': num,
    };
    return this.http.post(this.configUrl + '/cart/add',   JSON.stringify({ params: params} ), this.headoptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );

    // const body =  'FormData1=' + 'onetap' + '&FormData2=' + '123456';
    // return this.http.post(this.configUrl + '/cart/add', body, this.headoptionsPost)
    //   .pipe(
    //     retry(1),
    //     catchError(this.handleError)
    //   );
  }
}

