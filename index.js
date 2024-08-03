
const { after } = require("node:test");
const { chromium } = require("playwright");

async function getAges(page){
  await page.waitForSelector('.subline')
  const sublines = await page.$$('.subline')
  const dateList = []
  for(let subline of sublines){
    let age = await subline.$('.age')
    if(age)
    {
      const date = await age.getAttribute('title')
      console.log(`<- ${date}`)
      dateList.push(date)
    }
  }
  return dateList
}

function checkDates(dateList){
  for(let i = 1; i < dateList.length;i++){
    date1 = new Date(dateList[i-1])
    date2 = new Date(dateList[i])
    if (date1 < date2){
      return false;
    }
  }
  return true;
}

function report(dateList){
  console.log('\n ---------------------- \n')
  console.log(`Final List Number of Values: ${dateList.length}`)
  console.log('\n ---------------------- \n')
  console.log("Dates of Posts: ")
  console.log(dateList)
  console.log('\n --------VERIFYING ORDER---------- \n')
  if(checkDates(dateList)){
    console.log("Verified: The posts are in order.")
  }
  else{
    console.log("Unverified: The posts are not in order.")
  }

  console.log('\n -------------------------------- \n')
}

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  
    dateList = []
  let i = 1;
  while(dateList.length < 100)
  {
    console.log(`\n------Page ${i}------- \n`)
    console.log(`-----Getting Post Dates-----\n`)
    let toAdd = []
    toAdd = await getAges(page)
    for(let date of toAdd)
    {
      dateList.push(date)
      if(dateList.length > 99)
      {
        break;
      }
    }

    const nextPage = await page.$('a.morelink')
    await page.waitForLoadState('networkidle')
    await nextPage.click()
    i++;
  }
  await browser.close()
  report(dateList)
}

(async () => {
  await sortHackerNewsArticles();
})();





console.log("Starting...")


