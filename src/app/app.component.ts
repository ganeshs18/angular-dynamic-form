import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormConfig } from './models/form-config.model';
import { FormService } from './service/form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-dynamic-form';
  dynamicForm!: FormGroup;
  formConfig!: FormConfig

  constructor(private formService: FormService, private fb: FormBuilder) {

  }


  ngOnInit(): void {
    this.formService.getFormConfig().subscribe(config => {
      this.formConfig = config;
      this.buildForm();
    })
  }

  buildForm() {
    this.dynamicForm = this.fb.group(
      this.formConfig.fields.reduce((acc, cur) => {
        const control = new FormControl(cur.value || '');


        return Object.assign(acc, { [cur.name]: control })
      }, {})
    )
  }

  onSubmit() {

  }
}
