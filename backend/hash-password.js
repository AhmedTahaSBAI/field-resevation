const bcrypt = require('bcrypt');
const password = '1234'; // replace with the password you want to hash

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Hashing error:', err);
    return;
  }
  console.log('Hashed password:', hash);
});
