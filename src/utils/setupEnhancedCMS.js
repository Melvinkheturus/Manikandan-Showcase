import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your .env file.');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Create a Supabase client with the service key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

/**
 * Apply the enhanced CMS database schema to Supabase
 */
async function setupEnhancedCMS() {
  try {
    console.log('Starting Enhanced CMS setup...');
    
    // Read the SQL schema file
    const schemaPath = path.resolve(process.cwd(), 'enhanced-supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '') // Remove comments
      .split(';')
      .filter(statement => statement.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) throw error;
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement:', statement);
        
        // Ask if we should continue despite the error
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          readline.question('Continue anyway? (y/n): ', resolve);
        });
        
        readline.close();
        
        if (answer.toLowerCase() !== 'y') {
          console.log('Setup aborted.');
          process.exit(1);
        }
      }
    }
    
    console.log('Enhanced CMS setup complete!');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Navigate to /admin to access the new CMS');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run the setup function
setupEnhancedCMS(); 