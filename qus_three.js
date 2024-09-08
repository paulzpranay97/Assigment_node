const MongoClient = require('mongodb').MongoClient;


const mongoURI = 'mongodb+srv://pranay:pranay@cluster0.thtbvws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'assigment_node';
const ordersCollectionName = 'order_three';
const usersCollectionName = 'user_three';

async function getLastOrdersForUsers() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const ordersCollection = db.collection(ordersCollectionName);

  const results = await ordersCollection.aggregate([
    { $sort: { user: 1, createdAt: -1 } },
    {
      $group: {
        _id: "$user", 
        lastOrderId: { $first: "$_id" },
        amount: { $first: "$amount" },
        createdAt: { $first: "$createdAt" }
      }
    },
    {
      $lookup: {
        from: usersCollectionName,
        localField: "_id", 
        foreignField: "_id", 
        as: "userInfo"
      }
    },

    { $unwind: "$userInfo" },
    {
      $project: {
        _id: "$lastOrderId", 
        amount: 1,
        createdAt: 1,
        name: "$userInfo.name",  
        email: "$userInfo.email"
      }
    }
  ]).toArray();
  await client.close();
  return results;
}

getLastOrdersForUsers()
  .then(results => {
    console.log("Last orders for each user:", results);
  })
  .catch(error => {
    console.error("Error retrieving data:", error);
  });
