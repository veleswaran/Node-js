import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://veleswaran:Vels344@cluster0.u1fy5bo.mongodb.net/vel?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
});

export default client;