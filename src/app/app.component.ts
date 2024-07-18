import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Field, FormConfig } from './models/form-config.model';
import { FormService } from './service/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-dynamic-form';
  dynamicForm!: FormGroup;
  formConfig!: FormConfig;
  valuChangesSubs: Subscription[] = [];

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

       if(cur.validators) Object.keys(cur.validators as any).forEach(validator=>{
          switch (validator) {
            case 'required':
              control.addValidators(Validators.required);
              break;
              case 'min':
               if(cur.validators?.['min']) control.addValidators(Validators.min(cur.validators?.['min']));
              break;
              case 'max':
                if(cur.validators?.['max']) control.addValidators(Validators.min(cur.validators?.['max']));
              break;
          
            default:
              break;
          }
        })
       


        return Object.assign(acc, { [cur.name]: control })
      }, {})
    );

    this.formConfig.fields.filter(el => !!el.dependsOn).forEach(field => this.handleFieldDependency(field));
    this.calculateDaysInBetweenOrEndDate();
  }



  handleFieldDependency(field: Field) {
    const dependencyField = this.dynamicForm.get(field?.dependsOn?.field || '');
    if (dependencyField) {
      const sub = dependencyField.valueChanges.subscribe(selectedValue => {
        const mappedValue = field?.dependsOn?.mappings[selectedValue];
        if (mappedValue) {
          this.dynamicForm.get(field.name)?.setValue(mappedValue, { emitEvent: false });
        }
      });

      this.valuChangesSubs.push(sub);
    }
  }

  onSubmit() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
     
      return
      
    }
    alert("Form Submitted Successfully")
  }

  getErrorList(fieldName: string): any[] {
    return Object.keys(this.dynamicForm.get(fieldName)?.errors || {});
  }

  ngOnDestroy(): void {
    if (this.valuChangesSubs.length) {
      this.valuChangesSubs.forEach(sub => sub.unsubscribe());
    }
  }

  calculateDaysInBetweenOrEndDate() {
    const startDateControl = this.dynamicForm.get('startDate');
    const endDateControl = this.dynamicForm.get('endDate');
    const durationControl = this.dynamicForm.get('duration');

    if (startDateControl && endDateControl && durationControl) {

      endDateControl.valueChanges.subscribe((endDate: Date) => {

        if (startDateControl.value) {
          const days = Math.round((endDate.getTime() - (startDateControl.value as Date).getTime()) / (1000 * 60 * 60 * 24));
          durationControl.setValue(days < 0 ? 0 : days, { emitEvent: false })
        }

      })
      durationControl.valueChanges.subscribe((duration: number) => {
        if (startDateControl.value) {


          const result = new Date(startDateControl.value);
          result.setDate(result.getDate() + duration);
          endDateControl.setValue(result, { emitEvent: false })
        }
      })
    }

  }
}
