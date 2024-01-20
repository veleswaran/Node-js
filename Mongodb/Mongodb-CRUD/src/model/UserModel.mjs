import client from "../config.mjs";

export default async function UserModel() {
 
        await client.connect();
        const database = client.db("product");
        const collection = database.collection("users");
        return  collection;
    
  }