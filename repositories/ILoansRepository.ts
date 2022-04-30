export interface ILoansRepository {
  findByEmail(email: string): Promise<User>;
  save(user: User): Promise<void>;
}
