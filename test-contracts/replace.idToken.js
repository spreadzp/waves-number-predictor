const replace = require('replace-in-file');
module.exports = async function setNewIdToken (options) {

  try {
    const results = await replace(options)
    console.log('Replacement results:', results);
    return results[0].hasChanged;
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
