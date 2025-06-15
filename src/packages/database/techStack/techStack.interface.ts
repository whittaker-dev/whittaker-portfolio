export interface ITechStackCategory {
  id: string;
  name: string;
  techStacks: ITechStack[];
}

export interface ITechStack {
  id: string;
  name: string;
  icon: string;
  experience: number;
  category?: ITechStackCategory;
}
