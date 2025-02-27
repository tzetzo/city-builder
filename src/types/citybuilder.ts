export interface House {
  readonly id: string;
  floors: { id: number; color: string }[];
  color: string;
  name: string;
  height: number;
  status: "added" | "removed" | "default";
}
