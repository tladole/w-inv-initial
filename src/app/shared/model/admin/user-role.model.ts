import { User } from "./user.model";

export class UserRole {
    id: number;
    RoleName: string;
    CreatedBy: User;
    CreatedDate: Date;
}