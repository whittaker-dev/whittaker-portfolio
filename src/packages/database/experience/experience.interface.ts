export interface IExperience {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  achievements: string[];
  techSkills: string[];
  isCurrentJob?: boolean;
  logo: string;
}
