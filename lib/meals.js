import sql from 'better-sqlite3'
import fs from 'node:fs'
import slugify from 'slugify'
import xss from 'xss'
const db = sql('meals.db')
export async function getMeals() {
  await new Promise(resolve => setTimeout(resolve, 10000)) // 2 seconds delay to simulate slow network
  // throw new Error('Failed to fetch meals')
  return db.prepare('SELECT * FROM meals').all()
}

export function getMeal(slug){
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug)
}

export async function storeMeal(meal){
  meal.slug = slugify(meal.title, {lower: true});
  meal.instructions= xss(meal.instructions)
  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const buffer = await meal.image.arrayBuffer();
  stream.write(Buffer.from(buffer),(error)=>{
    if(error){
      throw new Error('Failed to save image')
    }
  });
  meal.image = `/images/${fileName}`;
  const stmt = db.prepare('INSERT INTO meals (creator, creator_email, title, summary, instructions, image, slug) VALUES (?, ?, ?, ?, ?, ?, ?)')
  stmt.run(meal.creator, meal.creator_email, meal.title, meal.summary, meal.instructions, meal.image, meal.slug)
}