import {MemoryRepository, ILoansRepository} from "./ILoansRepository.ts";
import {Loan} from "../entities/Loan.ts";

export class MemoryLoansRepository extends MemoryRepository<Loan> implements ILoansRepository{}
