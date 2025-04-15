const { expect } = require('@playwright/test');
const sql = require('mssql');
const { Pool } = require('pg');



const C360config = {
  user: 'c360qasqladmin',
  password: process.env.C360password,
  server: 'sql-loyalty-qa-ncus-001.database.windows.net',
  database: 'sqldb-c360-qa-ncus',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to false for production
  }
};


const IRAconfig = {
  user: 'c360qasqladmin',
  password: process.env.IRApassword,
  server: 'sql-loyalty-qa-ncus-001.database.windows.net',
  database: 'sqldb-imagerendering-qa-ncus',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to false for production
  }
};


const MCBconfig = new Pool({
  user: 'mcbqasqladmin@psql-loyalty-qa-ncus-003',
  host: 'psql-loyalty-qa-ncus-003.postgres.database.azure.com',
  database: 'psql-mcb-qa-ncus',
  password: process.env.MCBpassword,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});


async function connectToDatabase360() {
  try {
    let pool = await sql.connect(C360config);
    return pool;
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

async function connectToDatabaseIRA() {
  try {
    let pool = await sql.connect(IRAconfig);
    return pool;
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

async function connectToDatabaseMCB() {
  try {
    let pool = await MCBconfig.connect();
    console.log('Connected to PostgreSQL database');
    return pool;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err
  }
}

async function validateDatabaseEntry(connectFunction, query, validationField, expectedValue) {
  let pool;
  try {
    pool = await connectFunction();
    
    if (!expectedValue) {
      throw new Error(`Expected value for ${validationField} is not defined`);
    }

    console.log(`Executing query: ${query}`);
    const result = await pool.query(query);
    const rows = result.rows || result.recordset;
    console.log(`Data retrieved: ${JSON.stringify(rows)}`);

    if (rows.length > 0) {
      const actualValue = rows[0][validationField];
      console.log(`Retrieved ${validationField} from DB: ${actualValue}`);
      expect(actualValue).toEqual(expectedValue);
    } else {
      console.log(`No matching record found in the database.`);
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (pool) {
      pool.end ? pool.end() : pool.close();
    }
  }
}

function handleError(error) {
  console.error('An error occurred during the database test:', error);
  throw error;
}

async function fetchwmrIDwithNoEmailFromMCB(connectFunction, query, validationField, expectedValue) {
  let pool;
  try {
    pool = await connectFunction();
    
    if (!expectedValue) {
      throw new Error(`Expected value for ${validationField} is not defined`);
    }

    console.log(`Executing query: ${query}`);
    const result = await pool.query(query);
    const rows = result.rows || result.recordset;
    console.log(`Data retrieved: ${JSON.stringify(rows)}`);

    if (rows.length > 0) {
      const actualValue = rows[0][validationField];
      console.log(`Retrieved ${validationField} from DB: ${actualValue}`);
      console.log('returned actual value-', actualValue);
      return actualValue;
    } else {
      console.log(`No matching record found in the database.`);
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (pool) {
      pool.end ? pool.end() : pool.close();
    }
  }
}



module.exports = { connectToDatabase360, connectToDatabaseIRA, connectToDatabaseMCB,validateDatabaseEntry, fetchwmrIDwithNoEmailFromMCB, handleError };
