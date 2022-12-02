import fs from 'fs';

export const readfile = (filePath) => {
  console.log(fs)
  let result = fs.readFileSync(filePath); //ex) assets/format.csv
  console.log(result)
  return  result;
}

// export const hello = (text) => {
//   return console.log(text);
// }