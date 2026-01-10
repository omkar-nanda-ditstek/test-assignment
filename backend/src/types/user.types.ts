export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  create(userData: CreateUserDto): User;
}
