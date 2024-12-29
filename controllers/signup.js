const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;

  // Input validation
  if (!email || !name || !password) {

    return res.status(400).json('All fields are required');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email,
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .catch(err => res.status(400).json('Unable to register',  err));
};

module.exports = {
  handleRegister: handleRegister,
};
