export interface House {
  id: string;
  floors: { id: number; color: string }[];
  color: string;
  name: string;
  height: number;
}
