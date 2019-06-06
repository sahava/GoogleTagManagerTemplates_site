const moment = require('moment');
// Helper to Parse GTM TPL Files
// David Vallejo @thyng

const parseTemplate = tpl => {
  const data = tpl.json.split(/___(.+)___/).slice(1);
  tpl.info = JSON.parse(data[1]);
  tpl.parameters = JSON.parse(data[3]);
  tpl.permissions = JSON.parse(data[5]);
  tpl.notes = data[9].trim();
  tpl.logo = tpl.info.brand.thumbnail;
  tpl.contexts = tpl.info.containerContexts.join(', ');
  tpl.displayName = tpl.info.displayName;
  tpl.description = tpl.info.description;
  tpl.type = tpl.info.type;
  tpl.added_date = moment(tpl.added_date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD MMM YYYY');
  tpl.updated_date = moment(tpl.updated_date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD MMM YYYY');
  return tpl;
};

module.exports = {
  parseTemplate
};
