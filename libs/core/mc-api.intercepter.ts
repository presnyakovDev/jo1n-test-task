/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

import { McElasticLogApiService } from './mc-services/elastic-log-api.service';

@Injectable()
export class McApiIntercepter implements HttpInterceptor {
  constructor(private elasticLogService: McElasticLogApiService) {}

  private registerComplaint(error: HttpErrorResponse) {
    this.elasticLogService.register(null, '409ERROR-AFTER-5-RETRIES', {
      errorCode: 'ERR409AFTER5RETRIES',
      errorURL: error.url,
    });
  }

  private retryStrategy(attemps: Observable<HttpErrorResponse>): Observable<any> {
    return attemps.pipe(
      mergeMap((error: HttpErrorResponse, i: number) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(error);
        }

        const iteration = i + 1;

        if (error.status === 409) {
          if (iteration <= 4) {
            const randomTime = Math.floor(Math.random() * 2000 + 3000);
            return of(iteration).pipe(delay(randomTime));
          }
          this.registerComplaint(error);
          return throwError(error);
        }

        return throwError(error);
      })
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(
        retryWhen<HttpEvent<HttpErrorResponse>>((errors: Observable<HttpErrorResponse>) => this.retryStrategy(errors))
      );
  }
}
