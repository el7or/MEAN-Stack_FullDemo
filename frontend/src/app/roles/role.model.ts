export interface Role {
  _id?: string;
  name: string;
  description: string;
}

export interface HttpResponse {
  message: string;
  result: any;
  totalItems?: number;
}
