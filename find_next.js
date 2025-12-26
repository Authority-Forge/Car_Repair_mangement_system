const fs = require('fs');
const path = './feature_list.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const firstFalse = data.find(item => item.passes === false);
if (firstFalse) {
    console.log(JSON.stringify(firstFalse, null, 2));
} else {
    console.log('No false items found!');
}
