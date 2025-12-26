const fs = require('fs');
const path = './feature_list.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.forEach(item => {
    if (item.id.startsWith('AUTH-06') || item.id.startsWith('AUTH-07') || item.id.startsWith('AUTH-08')) {
        item.passes = true;
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated feature_list.json');
