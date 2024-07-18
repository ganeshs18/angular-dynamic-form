export interface FormConfig {
    fields: Field[]
}

export interface Field {
    type: string
    label: string
    name: string
    value: string
    options: Option[]
    validators: Validators
    dependsOn: DependsOn
}

export interface Option {
    label: string
    value: string
}

export interface Validators {
    required: boolean
}

export interface DependsOn {
    field: string
    mappings: { [key: string]: any }
}

export interface Mappings {
    "0-2"?: string[]
    "3-12"?: string[]
    "13-19"?: string[]
    "20-39"?: string[]
    "40-59"?: string[]
    "60+"?: string[]
    infant?: string[]
    child?: string[]
    teenager?: string[]
    "young-adult"?: string[]
    adult?: string[]
    senior?: string[]
}
