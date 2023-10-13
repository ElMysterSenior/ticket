import { Role } from "./role";

export interface User {
    id: number;
    user: string;
    role: Role;
}
