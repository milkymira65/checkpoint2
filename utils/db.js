
import * as pg from "pg"; 


const { Pool } = pg.default; 
const pool = new Pool({ user: "postgres", host: "localhost", database: "checkpoint2", password: "****", port: 5432, }); 

export { pool }; 