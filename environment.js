const environment = {
  // ======================   API    ==========================
    apiUrl: 'http://localhost:3000',
    // apiUrl: 'https://testtmg-df6d5.web.app',

  // ====================== DATABASE ==========================
    // ========= {myLocalhost} ==========
    // myDataBase: {
    //   user: 'postgres',
    //   host: 'localhost',
    //   database: 'TMS',
    //   password: 'root1',
    //   port: 5432,
    // },
    // ========= {ElephentSQL} ==========
    // myDataBase: {
    //   user: 'scxozgxj',
    //   host: 'tiny.db.elephantsql.com',
    //   database: 'scxozgxj',
    //   password: 'nH49g0mfdHwQQW8teYZIH7k-fVJLDiFr',
    //   port: 5432,
    // },
    // =========  {Supabase}   =========
    myDataBase:{
      user: 'postgres',
      host: 'db.eesdzcqbqjxrxibmeeyk.supabase.co',
      database: 'postgres',
      password: 'ttmgP@ass0rd',
      port: 5432,
    }
    
  };
module.exports = {environment}
  