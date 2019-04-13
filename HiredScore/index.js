const request = require('request');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/home.html')));

app.get('/data', (req, res) => {
    request('https://hs-resume-data.herokuapp.com/', {json: true }, (error, response, body) => {
        
        const cleanData = body.map((candid) => ({
            candidate_name: candid.contact_info && candid.contact_info.name && candid.contact_info.name.formatted_name,
            image: candid.contact_info.image_url,
            experience: candid.experience.map((exp => ({
                job_title: exp.title,
                start_date: exp.start_date,
                end_date: exp.end_date,
                currnet_job: exp.currnet_job
            })))
        }));

        res.json(cleanData);

    });

});
app.listen(port, () => console.log(`HiredScore app listening on port ${port}!`));