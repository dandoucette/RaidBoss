import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BossAbility } from '../models/boss-ability.model';

@Injectable({
  providedIn: 'root'
})
export class BossService {

  constructor(private http: HttpClient) { }

  getBossAbilities(filename: string): Observable<BossAbility[]> {
    return this.http.get<BossAbility[]>('../assets/' + filename + '.json');
  }
}