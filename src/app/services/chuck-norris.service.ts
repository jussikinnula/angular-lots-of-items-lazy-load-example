import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {
    this.contentSubject = new BehaviorSubject(this.content);
    this.contentObservable = this.contentSubject.asObservable();
    console.log('init', this.contentSubject, this.contentObservable);
  }

  getContent(id: number): Observable<string> {
    return this.contentObservable
      .pipe(
        map(content => content[id]),
        distinctUntilChanged()
      );
  }

  loadContent(id: number): void {
    this.apiRequest().subscribe(res => {
      this.content[id] = res.body.value;
      this.contentSubject.next(this.content);
    });

  }

  private apiRequest(): Observable<HttpResponse<ChuckNorrisResponse>> {
    return this.http.get<ChuckNorrisResponse>('https://api.chucknorris.io/jokes/random', { observe: 'response' });
  }
}
