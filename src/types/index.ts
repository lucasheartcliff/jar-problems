export interface Jar {
  id: number;
  name: string;
  currentSize: number;
  maxSize: number;
}
export interface JarMap {
  [key: number]: Jar;
}

export interface SimplifiedJar {
  name: string;
  currentSize: number;
}

export interface Step {
  type: "drain" | "transfer" | "fill";
  origin?: SimplifiedJar;
  destiny: SimplifiedJar;
}

export type History = any