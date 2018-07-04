import { User } from "./user.model";

export class Team {
    id: number;
    TeamName: string;
    TeamLead: User;
    CreatedBy: User;
    CreatedDate: Date;
}