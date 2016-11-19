'use strict';

const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const app     = express();
const port    = 3000;

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};
fetch(pcUrl)
    .then(res => {
        return res.json();
    }).then(json => {
        pc = json;
    })
    .catch(err => {
        console.log('Чтото пошло не так:', err);
    });

app.use(cors());

app.get('/', (req, res) => {
    res.json(pc);
});

app.get('/volumes', (req, res) => {
    let volumes = {};
    for(let v of pc.hdd){
        if(volumes[v.volume]){
            volumes[v.volume] = parseInt(volumes[v.volume]) + v.size + 'B';
        }else{
            volumes[v.volume] = v.size+'B';
        }
    }
    res.json(volumes);
});

app.get('/*', (req, res) => {

    let path = req.path
        .match(/(\/[^\/]*)/gi)
        .map(p => p.replace('/',''))
        .filter(p => !!p);
    console.log('path');
    console.log(path);
    let value = getValue(path, pc);
    console.log(value);

    if(value === undefined){
        res.status(404).send('Not Found');
    }else{
        res.json(value);
    }

});

const server = app.listen(port);
console.log('Server is listening on port ' + port);

function getValue(path, pc){
    let value = pc;
    for(let p of path){
        if(!value.propertyIsEnumerable(p)){
            value = undefined;
            break;
        }else{
            value = value[p];
        }
    }
    return value;
}
