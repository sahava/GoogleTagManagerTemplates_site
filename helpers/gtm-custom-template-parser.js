// Helper to Parse GTM TPL Files
// David Vallejo @thyng

const parseTemplate = (tpl) => {
  const data = tpl.split(/___(.+)___/).slice(1);
  return {
    info: JSON.parse(data[1]),
    parameters: JSON.parse(data[3]),
    permissions: JSON.parse(data[5]),
    //code: JSON.parse(data[7]),
    notes:  data[9].trim()
  };
};

module.exports = {
  parseTemplate
};
