const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
         return res.status(400).json('Invalid credentials');
      }

  db.select('email', 'hash').from('login')
    .where({ email })
    .then(data => { 
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (!isValid) {
         res.status(400).json('Invalid email or password.');
      }
      
       db.select('*').from('users').where({ email })
        .then(user => {
          if (user.length) {
            res.json(user[0]);  // Send user data as response
          } else {
            res.status(400).json('User not found.');
          }
        });
    })
    .catch(err => {
      console.error('Error during signin:', err);
      res.status(400).json('Error signing in.');
    });
};

module.exports = { handleSignin };
