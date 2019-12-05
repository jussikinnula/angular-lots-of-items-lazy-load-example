import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import pLimit from 'p-limit';

interface Content {
  [key: string]: string;
}

interface ChuckNorrisResponse {
  id: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChuckNorrisService {
  private content: Content = {};
  private contentSubject: BehaviorSubject<Content>;
  private contentObservable: Observable<Content>;
  private limit = pLimit(3);

  constructor(private http: HttpClient) {
    this.contentSubject = new BehaviorSubject(this.content);
    this.contentObservable = this.contentSubject.asObservable();
  }

  getContent(id: number): Observable<string> {
    return this.contentObservable
      .pipe(
        map(content => content[id]),
        distinctUntilChanged()
      );
  }

  async loadContent(id: number): Promise<string> {
    const res = await this.limit(() => this.apiRequest().toPromise());
    this.content[id] = res.body.value;
    this.contentSubject.next(this.content);
    return this.content[id];
  }

  private apiRequest(): Observable<HttpResponse<ChuckNorrisResponse>> {
    return this.http.get<ChuckNorrisResponse>('https://api.chucknorris.io/jokes/random', { observe: 'response' });
  }
}
