import pug from 'pug';
import fs from 'fs';

let pugFiles = [
    "layout/layout_template",
];

let pugSourceFolder = './src/pug';
let pugOutputFolder = './sketches';

for (let file of pugFiles){
    var htmlOutput = pug.render(fs.readFileSync(
        `${pugSourceFolder}/${file}.pug`, "utf-8"), {
            filename: `${pugSourceFolder}/${file}.pug`,
            pretty: true
        }
    )
    
    fs.writeFileSync(`${pugOutputFolder}/${file}.html`, htmlOutput, "utf-8");
}
