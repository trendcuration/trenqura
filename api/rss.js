const { sendRss } = require('./_seo');

module.exports = async (req, res) => {
  try {
    await sendRss(res);
  } catch (error) {
    res.status(500).type('text/plain').send('RSS generation failed.');
  }
};
