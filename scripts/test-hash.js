import bcrypt from 'bcryptjs';

// The hash from seed file
const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

console.log('Testing bcrypt hash:', hash);
console.log('---');
console.log('admin123:', bcrypt.compareSync('admin123', hash));
console.log('manager123:', bcrypt.compareSync('manager123', hash));
console.log('staff123:', bcrypt.compareSync('staff123', hash));
console.log('password:', bcrypt.compareSync('password', hash));
console.log('test:', bcrypt.compareSync('test', hash));

// Generate proper hashes for each password
console.log('\n--- Generating proper hashes ---');
console.log('admin123 hash:', bcrypt.hashSync('admin123', 10));
console.log('manager123 hash:', bcrypt.hashSync('manager123', 10));
console.log('staff123 hash:', bcrypt.hashSync('staff123', 10));
