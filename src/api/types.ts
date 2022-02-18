export type ValueType = "none" | "bool" | "int" | "float" | "str" | "datetime";

export interface IVersion {
  id: number;
  element_id: number;
  creation_date: string;
  last: boolean;
  value_type: ValueType;
  value_json: null | boolean | number | string;
}

export interface IElement {
  id: number;
  edium_id: number;
  name: string;
  creation_date: string;
  todo: boolean;
  versions: IVersion[];
}

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
