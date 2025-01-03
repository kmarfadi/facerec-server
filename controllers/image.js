const handleImage = (db) => (req, res) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]); // Send the updated entries count
    })
    .catch(err => {
      console.error(err);
      res.status(400).json('unable to get entries');
    });
};

module.exports = { handleImage };
