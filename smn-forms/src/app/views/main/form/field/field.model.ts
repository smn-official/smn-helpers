export interface ParamsField {
    name: string;
    type: 'text' | 'number' | 'email';
    required: boolean;
    label: string;
    maxLength: number;
}
