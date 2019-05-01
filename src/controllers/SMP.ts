/**
 * @interface SMP
 * @description Base class for all social media platforms.
 * This will be used for achieving runtime polymorphism and combining the end result
 * @export SMP
 */
  interface Params {
    query ? : string
  }


interface SMP {
  searchByKeyword(query: any, resolve, reject);
  normalizeResult(data: any): JSON[];
  searchByTrends(query: any, resolve, reject);
  
}

export default SMP;
