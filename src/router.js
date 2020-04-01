const express = require('express');
const {
  readTranslations,
  writeTranslations,
  updateConfigLocations,
  deleteConfigLocation,
} = require('./io-methods');

const { config } = require('./config');


const router = express.Router();

const healthCheck = (req, resp) => resp.json({ msg: 'everything is grand' });

router.get('/', healthCheck);
router.get('/health', healthCheck);

router.get('/languages', (req, resp) => resp.json(Object.keys(config.locations)));

router.get('/:location', async (req, resp) => {
  try {
    const data = await readTranslations(req.params.language);
    return resp.json(data);
  } catch (e) {
    resp.status(500).json(e);
  }
});

router.post('/update/:location', async (req, resp) => {
  const { translations } = req.body;
  if (!translations) {
    resp.status(400).send('you must supply translations to write')
  } else {
    try {
      const data = await writeTranslations(req.params.language, translations);
      return resp.json(data);
    } catch (e) {
      console.error(e);
    }
  }
});

router.put('/update-config-location', (req, resp) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return resp.status(400).send('bad request location is not provided');
  }
  const returnable = JSON.parse(updateConfigLocations(key, value));
  resp.status(200).json({
    returnable
  });
});

router.delete('/remove-config-location/:key', (req, resp) => {
  const { key } = req.params;
  if (!key) {
    return resp.status(400).send('bad request key is not provided');
  }
  const returnable = deleteConfigLocation(key);
  resp.status(200).json(returnable);
});


module.exports = router;
