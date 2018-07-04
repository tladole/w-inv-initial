import { Team } from "./team.model";
import { UserRole } from "./user-role.model";

export class User {
    id: number;
    UserName: string;
    Active: boolean;
    LastLoggedIn:Date;
    Team: Team[];
    Roles: UserRole[];
    CreatedBy: User;
    CreatedDate: Date;
}