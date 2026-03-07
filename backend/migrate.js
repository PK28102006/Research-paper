const bcrypt = require('bcryptjs');
const { readDb, writeDb } = require('./utils/jsonDb');

async function migratePasswords() {
  console.log('🔄 Starting password migration...');
  
  const db = readDb();
  
  if (!db.users || db.users.length === 0) {
    console.log('⚠️  No users found in database');
    return;
  }

  let migratedCount = 0;

  for (let user of db.users) {
    // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
    if (!user.password) {
      console.log(`⚠️  User ${user.email} has no password, skipping...`);
      continue;
    }

    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      console.log(`✓ User ${user.email} password already hashed`);
      continue;
    }

    // Hash the plain text password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    migratedCount++;
    console.log(`✓ Migrated password for ${user.email}`);
  }

  if (migratedCount > 0) {
    writeDb(db);
    console.log(`\n✅ Migration complete! ${migratedCount} passwords hashed.`);
  } else {
    console.log('\n✅ No passwords needed migration.');
  }
}

// Run migration
migratePasswords().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
