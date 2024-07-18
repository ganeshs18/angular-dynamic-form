import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormConfig } from '../models/form-config.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }


  getFormConfig() {
    return this.http.get<FormConfig>("/assets/json/formconfig.json")
  }
}
