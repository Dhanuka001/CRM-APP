const ping = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

module.exports = { ping };
