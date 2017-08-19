const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv');
const csv = require('csvtojson')

const csvFilePath = 'forbes-billionaire-list.csv'

csv()
    .fromFile(csvFilePath)
    .on('json', (p) => {
        request(p.uri, function (err, res, body) {
            console.log(p.name);

            var $ = cheerio.load(body)

            var education = $('li.education div.value').text()

            var isSelfMade = $('div.stats ul li:nth-of-type(3) div.name').text().trim() == "Self-Made Score"
            var selfMadeScore = ""
            if (isSelfMade) {
                selfMadeScore = $('div.stats ul li:nth-of-type(3) div.value').text()
            }

            var profileData = {
                rank: p.rank,
                name: p.name,
                uri: p.uri,
                education: education,
                selfMadeScore: selfMadeScore
            }

            var csvData = json2csv(
                {
                    data: profileData,
                    hasCSVColumnTitle: false
                }
            );

            fs.appendFileSync(
                'scraped-forbes-profile.csv',
                csvData,
                function (err) {
                    if (err) throw err;
                    console.log('file is saved.');
                }
            );

            fs.appendFileSync(
                'scraped-forbes-profile.csv',
                '\n',
                function (err) {
                    if (err) throw err;
                    console.log('file is saved.');
                }
            );
        });
    })
    .on('done', (error) => {
        if (error != null) {
            console.log('ERROR')
            console.log(error)
        }
    })