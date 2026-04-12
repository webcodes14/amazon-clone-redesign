export interface UserBase {
    id: string;
    email: string;
    role: 'admin' | 'user';
}