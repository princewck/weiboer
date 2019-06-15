const path = require('path');
const { PC_AGENTS } = require('./libs/userAgents');

module.exports = {
  'cookies_cache_path': path.resolve(__dirname, '.cookies'),
  'default_ua': PC_AGENTS.SAFRI_MAC,
  'launch_options': {
    'headless': false,
  },
  'viewport_options': {
    'width': 1366,
    'height': 768,
    'deviceScaleFactor': 1,
  }
}