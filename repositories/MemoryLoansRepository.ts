import {ILoansRepository} from "./ILoansRepository.ts";
import {MemoryRepository} from "./MemoryRepository.ts";
import {Loan} from "../entities/Loan.ts";

export class MemoryLoansRepository extends MemoryRepository<Loan> implements ILoansRepository{}
