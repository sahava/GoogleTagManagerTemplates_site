const categories = {
  'analytics': 'Analytics',
  'experimentation': 'Experimentation',
  'pixel': 'Marketing / Advertising Pixel'
};

const permissions = {
  acscess_globals: 'Accesses Global Variables',
  get_cookies: 'Reads cookie value(s)',
  get_referrer: 'Reads Referrer URL',
  get_url: 'Reads URL',
  inject_hidden_iframe: 'Injects Hidden Iframes',
  inject_script: 'Injects Scripts',    
  logging: 'Logs to Console',
  read_data_layer: 'Reads Data Layer', 
  read_character_set: 'Reads Document Character Set',
  read_title: 'Reads Document Title',
  send_pixel: 'Sends Pixels',
  set_cookies: 'Sets a cookie'
};

module.exports = {
  categories,
  permissions
};
