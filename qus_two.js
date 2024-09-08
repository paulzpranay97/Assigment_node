
// the abc.jpg is saved in db without that all unused jpg will delete



const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const mongoURI = 'mongodb+srv://pranay:pranay@cluster0.thtbvws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'assigment_node';
const collectionName = 'user';


const profileFolder = path.join(__dirname, 'profile'); 

async function getUsedImageUrls() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  
  const users = await collection.find({}, { projection: { imageUrl: 1 } }).toArray();
  
  const usedImages = users.map(user => {
    const parts = user.imageUrl.split('/');
    return parts[parts.length - 1]; 
  });
  
  await client.close();
  return usedImages;
}

function getAllLocalImages() {
  const allImages = fs.readdirSync(profileFolder).filter(file => {
    return file.endsWith('.jpg') || file.endsWith('.png'); 
  });

  return allImages;
}

function deleteImages(obsoleteImages) {
  obsoleteImages.forEach(image => {
    const imagePath = path.join(profileFolder, image);
    fs.unlinkSync(imagePath); 
    console.log(`Deleted obsolete image: ${image}`);
  });
}

async function main() {
  try {
    const usedImages = await getUsedImageUrls();
    const allImages = getAllLocalImages();

    const obsoleteImages = allImages.filter(image => !usedImages.includes(image));

    console.log('Obsolete images:', obsoleteImages);

    deleteImages(obsoleteImages);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
