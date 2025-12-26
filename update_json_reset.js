const fs = require('fs');
const path = './feature_list.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.forEach(item => {
    if (item.id.startsWith('AUTH-09') || item.id.startsWith('AUTH-10') || item.id.startsWith('AUTH-11')) {
        item.passes = true;
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated feature_list.json for Password Reset');
