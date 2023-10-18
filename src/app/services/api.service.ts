import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  token: string = '';

  constructor(private http: HttpClient) {}

  async get(
    endpoint: string,
    parameters?: any,
    serializeParams: boolean = false
  ): Promise<any> {
    let urlParams = '';
    if (serializeParams && parameters) {
      urlParams = '?' + new URLSearchParams(parameters);
    }

    const headers = new HttpHeaders({ Authorization: this.token });

    const response = await this.http
      .get(`${this.apiUrl}${endpoint}${urlParams}`, { headers })
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        throw err;
      });

    return response;
  }

  async insecurePost(endpoint: string, parameters?: Object): Promise<any> {
    const response = await this.http
      .post(`${this.apiUrl}${endpoint}`, parameters)
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        throw err;
      });

    return response;
  }

  async post(endpoint: string, parameters?: Object): Promise<any> {
    const response = await this.http
      .post(`${this.apiUrl}${endpoint}`, parameters, {
        headers: new HttpHeaders({ Authorization: this.token }),
      })
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        throw err;
      });

    return response;
  }

  async patch(endpoint: string, parameters?: Object): Promise<any> {
    const response = await this.http
      .patch(`${this.apiUrl}${endpoint}`, parameters, {
        headers: new HttpHeaders({ Authorization: this.token }),
      })
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        throw err;
      });

    return response;
  }

  private get apiUrl(): string {
    return 'http://localhost:3000/v1/';
  }
}
