import * as mysql from "mysql2/promise";
import dbConfig from "../config/database";

export default mysql.createPool(dbConfig);
