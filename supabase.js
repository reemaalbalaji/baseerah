import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://weutbnuwwznlcnpwfbxl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldXRibnV3d3pubGNucHdmYnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5OTczMTYsImV4cCI6MjEwMjU3MzMxNn0.iEnCMO1sqEtbyPqcczXnU2aXeeL8BQzo4bYC8l3ZQSk";

export const supabase = createClient(supabaseUrl, supabaseKey);