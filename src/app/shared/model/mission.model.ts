import { User } from "./admin/user.model";

export class Mission {
    id: number;
    name: string;
    location: string;
    modifiedBy: number;
    modifiedDate: Date;
    active: boolean;
    constructor(id?: number, name?: string, location?: string, modifiedBy?: number, modifiedDate?: Date) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.modifiedBy = modifiedBy;
        this.modifiedDate = modifiedDate;
    }

}

export class MissionView {
    id: number;
    name: string;
    location: string;
    modifiedBy: User;
    modifiedDate: Date;
    active: boolean;
    constructor(id?: number, name?: string, location?: string, modifiedBy?: User, modifiedDate?: Date) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.modifiedBy = modifiedBy;
        this.modifiedDate = modifiedDate;
    }

}
