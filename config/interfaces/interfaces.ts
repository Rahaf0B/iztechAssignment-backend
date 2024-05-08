export interface IUser {
  uid?: number;
  user_name: string;
  email: string;
  password?: string;
  url_image?: string;
  opt_code?:string;
}

export interface ITodo {
  id?: number;
  title?: string;
  description?: string;
  status?: boolean;
  uid?: number;
}
