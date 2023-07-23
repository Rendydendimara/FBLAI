const fs = require("fs");
const { parse } = require("csv-parse");
const axios = require('axios');
require('dotenv').config()
const { stringify } = require("csv-stringify");
const AdmZip = require("adm-zip");
var xlsx = require('node-xlsx').default;

const googleApiKey = process.env.GOOGLE_API_KEY;

// if (!googleApiKey) {
//   console.log('Invalid API Key')
//   process.exit(1)
// }

const FOLDER_RESULT = "results"
const filename = "ISO NON LAI FINAL (1) baru .xlsx - ENSIKLOPEDI.csv"
const CALL_NUMBER = 11;
const COLUMNS_CSV = [
  "title",
  "gmdId",
  "edition",
  "isbnIssn",
  "penerbit",
  "tahunTerbit",
  "collation",
  "seriesTitle",
  "callnumber",
  "language",
  "publish_place_id",
  "classification",
  "description",
  "image",
  "NO DATA",
  "authors",
  "subject",
];

const readFile = (path) => new Promise((resolve, reject) => {
  const dataReader = [];
  fs.createReadStream(path)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
      if (row[3] !== 'Judul Buku' && row[3] !== '') {
        // console.log('row', row)
        const isbn = getFixISBN(row[1]);
        dataReader.push({
          isbn: isbn,
          judulBuku: row[3],
          defaultIsbn: row[1],
          defaultData: row
        })
      }
    })
    .on("end", function () {
      resolve(dataReader);
    })
    .on("error", function (error) {
      reject(error);
    });
});

const prepare = (folderName) => {
  // create folder
  if (!fs.existsSync(`${FOLDER_RESULT}/${folderName}`)) {
    fs.mkdirSync(`${FOLDER_RESULT}/${folderName}`, { recursive: true });
  }
}


async function main() {
  const workSheetsFromFile = xlsx.parse(`./ISO NON LAI FINAL (1) baru  (2).xlsx`);
  const dataEnsiklopedi = workSheetsFromFile.filter((dt) => dt.name === "ENSIKLOPEDI")[0]
  dataEnsiklopedi.data.forEach((dt) => {
    console.log(dt)
  })
  // console.time('running fetch');
  // prepare(filename);
  // const resultReadCVS = await readFile(`./${filename}`);
  // console.log(`total result read data in ${filename}: `, resultReadCVS.length)
  // const resultFetchBooks = await fetchBooks(resultReadCVS.slice(2, 10), filename)
  // await createCSVImport(resultFetchBooks.resultDataSuccess, filename, "found", CALL_NUMBER)
  // await createCSVImport(resultFetchBooks.resultDataError, filename, "notFound", CALL_NUMBER)
  // await createZipArchive(`./${FOLDER_RESULT}/${filename}/${filename}.zip`, `./${FOLDER_RESULT}/${filename}`)
  // console.timeEnd('running fetch');
}

main()

const getFixISBN = (isbn) => {
  let fixIsbn = isbn ? isbn : '';
  if (typeof (fixIsbn) !== 'string') {
    fixIsbn = ''
  }
  // remove spesial characters
  fixIsbn = fixIsbn.replace(/[^a-zA-Z0-9 ]/g, "");
  // remove WORD contain: ISSN
  fixIsbn = fixIsbn.replace(/ISSN/g, "");
  // remove space, tabs
  fixIsbn = fixIsbn.replace(/ /g, "");

  return fixIsbn;
}

const fetchBooks = (data, folderName) => new Promise(async (resolve, reject) => {
  const resultDataSuccess = []
  const resultDataError = []
  for (i = 0; i < data.length; i++) {
    if (data[i].isbn) {
      console.log(`find isbn: ${data[i].isbn}`)
      try {
        const res = await axios(`https://www.googleapis.com/books/v1/volumes?q=isbn:${data[i].isbn}`);
        if (res.status === 200 && res.data.totalItems > 0) {
          resultDataSuccess.push({ isbn: data[i].isbn, defaultIsbn: data[i].defaultIsbn, dataFetch: res.data, defaultData: data[i].defaultData });
          if (res.data.totalItems > 0 && res.data.items[0].volumeInfo.imageLinks) {
            const imageUrl = res.data.items[0].volumeInfo.imageLinks.smallThumbnail || res.data.items[0].volumeInfo.imageLinks.thumbnail || undefined;
            if (imageUrl) {
              await downloadImage(imageUrl, `${FOLDER_RESULT}/${folderName}/${data[i].defaultIsbn}.jpeg`);
            }
          }
        } else {
          resultDataError.push({ isbn: data[i].isbn, defaultIsbn: data[i].defaultIsbn, dataFetch: null, defaultData: data[i].defaultData });
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  resolve({
    resultDataSuccess,
    resultDataError
  });
});

const downloadImage = (url, filename) => new Promise(async (resolve, reject) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFile(filename, response.data, (err) => {
    if (err) throw resolve(err);
    resolve(true)
  });
})

const createCSVImport = (data, filename, type, callNumber) => new Promise(async (resolve, reject) => {
  if (type === "notFound") {
    const filenameResult = `./${FOLDER_RESULT}/${filename}/${filename}-result-not-found.csv`;
    const writableStream = fs.createWriteStream(filenameResult);
    const stringifier = stringify({ header: true, columns: COLUMNS_CSV });
    for (let j = 0; j < data.length; j++) {
      const result = [
        data[j].defaultData[3].trim(), //title
        "Text", //gmdId
        null, // edition
        data[j].isbn, // isbnIssn
        data[j].defaultData[11].trim(), // publisherName
        data[j].defaultData[14], // publishYear
        "-", // collation
        null, // seriesTitle
        callNumber, // callNumber
        data[j].defaultData[8], // languageId
        data[j].defaultData[6], // publishPlaceId
        data[j].defaultData[2].trim(), // classification
        "nof-found.png", // image
        "", // NO DATA
        [data[j].defaultData[12].trim()], // authors
        [data[j].defaultData[5].trim()], // subjects
        "-", //notes
      ];
      // arrayDataToDump.push(data)
      stringifier.write(result);
    }
    await stringifier.pipe(writableStream);
    resolve(true)
  } else {
    const filenameResult = `./${FOLDER_RESULT}/${filename}/${filename}-result-found.csv`;
    const writableStream = fs.createWriteStream(filenameResult);
    const stringifier = stringify({ header: true, columns: COLUMNS_CSV });
    for (let j = 0; j < data.length; j++) {
      const fetchData = data[j].dataFetch.items[0]
      const originalData = data[j].defaultData
      const result = [
        fetchData.volumeInfo.title, // title
        "Text", // gmdId
        null, // edition
        data[j].isbn, // isbnIssn
        fetchData.volumeInfo.publisher, // publisherName
        fetchData.volumeInfo.publishedDate, // publishYear
        `${data[j].defaultData[2].trim()} - ${data[j].defaultData[15]}`, // collation
        null, // seriesTitle
        callNumber, // callNumber
        data[j].defaultData[8], // languageId
        data[j].defaultData[6], // publishPlaceId
        data[j].defaultData[2].trim(), // classification
        `${data[j].defaultIsbn}.jpeg`, // image
        "", // NO DATA
        fetchData.volumeInfo.authors ? fetchData.volumeInfo.authors : [data[j].defaultData[12].trim()], // authors
        [data[j].defaultData[5].trim()], // subjects
        //notes
        fetchData.volumeInfo.description
      ]
      stringifier.write(result);
    }
    await stringifier.pipe(writableStream);
    resolve(true)
  }
});

const createZipArchive = (filename, folderSource) => new Promise(async (resolve, reject) => {
  try {
    const zip = new AdmZip();
    zip.addLocalFolder(folderSource);
    zip.writeZip(filename);
    resolve(true)
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
    reject(e)
  }
});

