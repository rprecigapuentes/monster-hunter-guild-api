export interface IExistenceChecker {
    exists(id:string): Promise<Boolean>
}