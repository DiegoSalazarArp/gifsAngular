import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = '6Uz8iC0I37GwghflZshUW4wLjIFT6FyK';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  // tslint:disable-next-line: variable-name
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }
  constructor(private http: HttpClient) {
    // tslint:disable-next-line: no-non-null-assertion
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    // if (localStorage.getItem('historial')) {
    //   // tslint:disable-next-line: no-non-null-assertion
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  // tslint:disable-next-line: typedef

  buscarGifs(query: string = ''): void {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.servicioURL}/search`, { params })
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });

    console.log(this._historial);
  }
}
