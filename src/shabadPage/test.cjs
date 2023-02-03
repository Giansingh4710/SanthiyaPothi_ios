/* const {ALLSHABADS} = require('../../assets/allShabads.js'); */
const ALLSHABADS = {
  "gg":[ 'hello ', 'bob', 'my name is gifjsjaldjsld sdlcd' ],
  "bb":[ 'ddyd ddwd gian', 'dqw', '1212 f323' ],
  "cc":[ 'vaheguru', 'ji ka khalsa' ]
}

/* console.log(ALLSHABADS); */
const searchText = 'hel';
const res = Object.entries(ALLSHABADS).filter(([ID, shabadLst]) => {
  let matchedLine;
  const textInSbd = shabadLst.some(line => {
    matchedLine = line;
    return line.toLowerCase().includes(searchText.toLowerCase());
  });
  if (textInSbd) {
    return [];//no mater what I return, it will always return what the paremeters were
  }
});
console.log(res);
console.log(res.length);
