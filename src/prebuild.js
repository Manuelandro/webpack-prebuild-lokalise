const axios = require('axios')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')

const projectId = <YOUR_PROJECT_ID>
const token = <YOUR_TOKEN>
const destFolder = <DESTIONATION_FILES_FOLDER>

const download = async () => {
    try {
        const lokaliseResponse = await axios({
            method: 'POST',
            url: `https://api.lokalise.co/api2/projects/${projectId}/files/download`,
            data: { format: 'json', original_filenames: true },
            headers: {
                'x-api-token': token,
                'content-type': 'application/json',
            },
        })

        const zipUrl = lokaliseResponse.data.bundle_url
        const dest = path.resolve(__dirname, 'temp_lang.zip')

        const s3response = await axios({
            method: 'GET',
            url: zipUrl,
            responseType: 'stream',
        })

        s3response.data.pipe(fs.createWriteStream(dest))

        return new Promise((resolve, reject) => {
            s3response.data.on('end', () => {
                resolve(dest)
            })

            s3response.data.on('error', () => {
                reject(error)
            })
        })
    } catch (err) {
        console.log(err)
    }
}




download()
    .then((data) => {
        const zip = new AdmZip(data)
        zip.extractAllToAsync(destFolder, true, (err) => {
            if (err) throw err

            fs.unlink(path.resolve(__dirname, 'temp_lang.zip'), (err2) => {
                if (err2) throw err2
                console.log('lang.zip deleted')
            })
        })
    })
    .catch(err => console.log(err))

