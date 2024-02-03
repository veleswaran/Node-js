import { ObjectId } from 'mongodb';
import UserModel from '../model/UserModel.mjs';

export async function addUser(data) {
    try {
        const collection = await UserModel();
        await collection.insertOne(data);
        console.log("Data added successfully");
    } catch (err) {
        throw err;
    }
}

export async function getUser() {
    try {
        const collection = await UserModel();
        const result = await collection.find().toArray(); 
        console.log("Data fetched successfully");
        return result;
    } catch (err) {
        throw err;
    }
}

export async function update(id) {
    try {
        const collection = await UserModel();
        let userid = new ObjectId(id);
        let result = await collection.findOne({_id:userid});
        return result;
    } catch (err) {
        throw err;
    }
}

export async function updateUser(data, id) {
    try {
        const collection = await UserModel();
        let userid = new ObjectId(id);
        const existingUser = await collection.findOne({ _id: userid });

        if (!existingUser) {
            throw new Error('User not found');  
        }
        await collection.updateOne({_id:userid}, { $set: data });
        console.log("Data updated successfully");
    } catch (err) {
        throw err;
    }
}

export async function deleteUser(id) {
    try {
        let userId = new ObjectId(id);
        const collection = await UserModel();   
        await collection.deleteOne({_id:userId});
        console.log("Data deleted successfully");
    } catch (err) {
        throw err;
    }
}

export async function addimage(data) {
    try {
        const collection = await UserModel();
        await collection.insertOne(data);
        console.log("Data added successfully");
    } catch (err) {
        throw err;
    }
}