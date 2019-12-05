import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import pLimit from 'p-limit';

interface Content {
  [key: string]: string;
}

interface QueueState {
  [key: string]: boolean;
}

interface LoadingState {
  [key: string]: boolean;
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
  private queueState: QueueState = {};
  private queueStateSubject: BehaviorSubject<QueueState>;
  private queueStateObservable: Observable<QueueState>;
  private loadingState: LoadingState = {};
  private loadingStateSubject: BehaviorSubject<LoadingState>;
  private loadingStateObservable: Observable<LoadingState>;
  private limit = pLimit(3);

  constructor(private http: HttpClient) {
    this.contentSubject = new BehaviorSubject(this.content);
    this.contentObservable = this.contentSubject.asObservable();
    this.queueStateSubject = new BehaviorSubject(this.queueState);
    this.queueStateObservable = this.queueStateSubject.asObservable();
    this.loadingStateSubject = new BehaviorSubject(this.loadingState);
    this.loadingStateObservable = this.loadingStateSubject.asObservable();
  }

  getContent(id: number): Observable<string> {
    return this.contentObservable
      .pipe(
        map(content => content[id]),
        distinctUntilChanged()
      );
  }

  getQueueState(id: number): Observable<boolean> {
    return this.queueStateObservable
      .pipe(
        map(queueState => queueState[id] || false),
        distinctUntilChanged()
      );
  }

  getLoadingState(id: number): Observable<boolean> {
    return this.loadingStateObservable
      .pipe(
        map(loadingState => loadingState[id] || false),
        distinctUntilChanged()
      );
  }

  async loadContent(id: number): Promise<void> {
    // In the beginning mark the card being queued, and unset previous content
    this.setQueueState(id, true);
    this.setLoadingState(id, false);
    this.setContent(id, undefined);

    // This delay is to see "loading queued" text in UI
    await this.delay();

    const res = await this.limit(() => {
      // When request will be actually started, set loading state and unset queued state
      this.setQueueState(id, false);
      this.setLoadingState(id, true);
      return this.apiRequest().toPromise();
    });

    // This delay is to see "loading started" text in UI
    await this.delay();

    // After loading is finished reset both states and set content
    this.setQueueState(id, false);
    this.setLoadingState(id, false);
    this.setContent(id, res.body.value);
  }

  private setContent(id: number, value: string) {
    this.content[id] = value;
    this.contentSubject.next(this.content);
  }

  private setQueueState(id: number, value: boolean) {
    this.queueState[id] = value;
    this.queueStateSubject.next(this.queueState);
  }

  private setLoadingState(id: number, value: boolean) {
    this.loadingState[id] = value;
    this.loadingStateSubject.next(this.loadingState);
  }

  private apiRequest(): Observable<HttpResponse<ChuckNorrisResponse>> {
    return this.http.get<ChuckNorrisResponse>('https://api.chucknorris.io/jokes/random', { observe: 'response' });
  }

  private delay(timeout: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), timeout));
  }
}
