const { sendSitemap } = require('./_seo');

module.exports = async (req, res) => {
  try {
    await sendSitemap(res);
  } catch (error) {
    res.status(500).type('text/plain').send('Sitemap generation failed.');
  }
};
