export class WareHouse {
    id: number;
    Name: string;
    Location: string;
    constructor(id?: number, Name?: string, Location?: string) {
        this.id = id;
        this.Name = Name;
        this.Location = Location;
    }
}