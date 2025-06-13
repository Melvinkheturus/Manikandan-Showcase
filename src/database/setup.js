// Database setup script
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config();

// Validate environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- REACT_APP_SUPABASE_URL or VITE_SUPABASE_URL');
  if (!supabaseAnonKey) console.error('- REACT_APP_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
  if (!serviceRoleKey) console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key (required for SQL execution)
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Function to execute SQL files
async function executeSqlFile(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    
    console.log(`Executing SQL from ${filePath}...`);
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Error executing ${filePath}:`, error);
      return false;
    }
    
    console.log(`Successfully executed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Create schema
  const schemaSuccess = await executeSqlFile('./schema.sql');
  if (!schemaSuccess) {
    console.error('Failed to create schema. Aborting.');
    process.exit(1);
  }
  
  // Seed data
  const seedSuccess = await executeSqlFile('./seed_data.sql');
  if (!seedSuccess) {
    console.error('Failed to seed data. Database setup incomplete.');
    process.exit(1);
  }
  
  console.log('Database setup completed successfully!');
}

// Run setup
setupDatabase()
  .catch(error => {
    console.error('Unhandled error during database setup:', error);
    process.exit(1);
  });
