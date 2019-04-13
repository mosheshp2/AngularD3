
const request = require('request');
const fs = require('fs');

var counter = 0;

function executeMigrations(accountList, url, responseFilePath, finishedAll){
    if(accountList.length == 0) {
        return finishedAll && finishedAll(counter);
    }

    var accountId = accountList.shift();

    if(+accountId == 0) {
        return executeMigrations(accountList, url, responseFilePath, finishedAll);
    }
    
    console.log(`requesting: ${accountId}`);
    counter++;

    request.post({ 
            url: url,
            form: {
                accountId,
                password: '1!daneyalnirmaketutorial1!'
            }
        }, (err, res, body) => { 
            if(err){
                console.log(err);
            }

            fs.writeFile(`${responseFilePath}-${accountId}.txt`, body, (err) => {
                if(err){
                    return console.log(err);
                }

                console.log(`wrote file ${accountId}.txt`);
            });

            executeMigrations(accountList, url, responseFilePath, finishedAll);
        });
}

module.exports = {
    executeMigrations,
    clearCounter: () => { counter = 0; }
};