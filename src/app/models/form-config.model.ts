export interface FormConfig {
    fields: Field[]
}

export interface Field {
    type: string
    label: string
    name: string
    value?: string
    options?: Option[]
    validators?: Validators
    dependsOn?: DependsOn
}

export interface Option {
    label: string
    value: string
}

export interface Validators {
    required?: any
    min?: number
    max?: number
}

export interface DependsOn {
    field: string
    mappings: { [key: string]: any }
}


