export interface IEdium {
  id: number;
  title: string;
  kind: string;
  creation_date: string;
}

export interface IEdiumPost {
  title: string;
  kind?: string;
}
