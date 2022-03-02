const mongoCollection = require('../config/mongoCollection')

const bands = mongoCollection.bands;

const { ObjectId } = require('mongodb');



const create = async (name,genre,website,recordLabel,bandMembers,yearFormed) =>{
  let err = checkParms(name, genre, website, recordLabel, bandMembers, yearFormed);

  if(err !== undefined){
    throw err;
  }

  let err1 = checkStrings(name,website,recordLabel);

  if(err1 !== undefined){
    throw err1;
  }

  let err2 = checkIsNull(name,website,recordLabel);

  if(err2 !== undefined){
    throw err2;
  }

  if(!(website.startsWith("http://www"))){
        throw new Error("ERROR: URL need to start with https://www");
  }

  if(!(website.endsWith(".com"))){
        throw new Error("ERROR: URL need to end with .com");
  }

  if(!(website.match("^(http:\/\/www.)([A-Za-z]{5,})(.com)$"))){
    throw new Error("ERROR: Url is not valid");
  }



  if(!(Array.isArray(bandMembers)) && !(Array.isArray(genre))){
    throw new Error("ERROR: It is not an array");
  }else if (bandMembers.length === 0 || genre.length === 0) {
    throw new Error("ERROR: Array is empty"); 
  }else{
    for (let i = 0; i < bandMembers.length; i += 1) {
        if (!(typeof bandMembers[i] == 'string')) {
            throw new Error("bandMember Parameter is not string type");
        }
        if (bandMembers == null || bandMembers[i].trim() === ''){
            throw new Error("bandMembers Parameter is empty");
        }
    }
    for (let i = 0; i < genre.length; i += 1) {
      if (!(typeof genre[i] == 'string')) {
          throw new Error("genre Parameter is not string type");
      }
      if (genre == null || genre[i].trim() === ''){
          throw new Error("genre Parameter is empty");
      }
  }
}
if(isNaN(yearFormed)){
  throw new Error('ERROR: yearFormed needs to be a number');
}

if(yearFormed < 1900 || yearFormed > (new Date().getFullYear)){
  throw new Error('Error: yearFormed paeameter is wrong')
}


const band = {
  name : name,
  genre: genre,
  website : website,
  recordLabel: recordLabel,
  bandMembers: bandMembers,
  yearFormed: yearFormed,
  albums: [],
  overallRating: 0,

}

const bandsCollection = await bands();
const insertInfo = await bandsCollection.insertOne(band);
if (insertInfo.insertedCount === 0) {
  throw new Error("Could not add new band");
}

const newId = insertInfo.insertedId.toString();
return await get(newId);

}

const get = async (id) => {
  if(!id){
    throw new Error("Error: Id parameter is required");
  }
  if(id === undefined || id === null){
    throw new Error("ERROR: Id is null or undefined");
  }
  if (!(typeof id == 'string')) {
    throw new Error("ERROR: Id Parameter is not string type");
  }  
  if (id == null || id.trim() === ''){
    throw new Error("parameter is empty");
  }
  else{
    
    id = ObjectId(id);
  }
  let originalId = id;
  if(!(id instanceof ObjectId)) {
      throw new Error("Invalid argument type : id");
  }
  const bandsCollection = await bands();

  const band = await bandsCollection.findOne({_id : id})
  if (band === null) {
    throw new Error("No Band with id is present");
}
  band['_id'] = originalId.toString();
  return band;
  
}

const getAll = async () => {
  const bandsCollection = await bands();

  const res = await bandsCollection.find({}).toArray();

  for(const key of res){
    let result = key;
    result['_id'] = result._id.toString();
  }
  return res;
}

const remove = async (id) => {
  if(!(id)){
    throw new Error("ERROR: Id parameter required !!!!!");
  }
  if(typeof id !== 'string'){
    throw new Error("ERROR: id parameter need to be type of string");
  }
  
  if (id == null || id.trim() === ''|| id === undefined ){
    throw new Error("parameter is empty");
  }

  if (typeof id === "string") {
      id = ObjectId(id);
  } else if (!(id instanceof ObjectId)) {
      throw new Error("ERROR: Id parameter needs to be object type");
  }

  const bandsCollection = await bands();

  const band = await bandsCollection.findOne({_id: id});

  if (band === null) {
      throw new Error("No band with id present");
  }

  let res = await bandsCollection.deleteOne({_id: id});

  if (res.deletedCount === 0) {
    throw new Error("No band with id present");
  }  
  return band.name + " has been successfully deleted!";

}

const rename = async (id,newName) => {
  if(!(id)){
    throw new Error("ERROR: Id parameter required !!!!!");
  }
  if(typeof id !== 'string'){
    throw new Error("ERROR: id parameter need to be type of string");
  }
  
  if (id == null || id.trim() === ''|| id === undefined ){
    throw new Error("parameter is empty");
  }

  if (typeof id === "string") {
      id = ObjectId(id);
  } else if (!(id instanceof ObjectId)) {
      throw new Error("ERROR: Id parameter needs to be object type");
  }
  
  id = ObjectId(id);

  const bandCollection = await bands();

  const band = await bandCollection.findOne({_id: id});

  if (band === null) {
    throw new Error("No band found with the provided");
  }

//if the newWebsite is the same as the current value stored in the database, the method should throw. 
if(band.name === newName){
    throw new Error("ERROR : Old name and New name can not be same");
 }

 return await bandCollection.updateOne({_id: id}, {$set: {name: newName}})
        .then(async function (updateInfo) {
            if (updateInfo.nModified === 0) {
                throw new Error("Could not update band name successfully");
            }
            return await get(id.toString());
        });

}


const update = async (id, name, genre, website, recordLabel, bandMembers, yearFormed) =>{


  if(!id){
    throw new Error("Argument id is not provided");
}

//If the id provided is not a string
if (!(typeof id == 'string')) {
    throw new Error("rename Parameter is not string type");
}

//Check String paramter not contains empty spaces
if (id == null || id.trim() === '' || id === undefined){
throw new Error("parameter is empty");
}      

//If the id provided is not a valid ObjectId, the method should throw.
if (typeof id === "string") {
    id = ObjectId(id);
} else if (!(id instanceof ObjectId)) {
    throw new Error("Invalid argument type : id");
}

  let err = checkParms(name, genre, website, recordLabel, bandMembers, yearFormed);

  if(err !== undefined){
    throw err;
  }

  let err1 = checkStrings(name,website,recordLabel);

  if(err1 !== undefined){
    throw err1;
  }

  let err2 = checkIsNull(name,website,recordLabel);

  if(err2 !== undefined){
    throw err2;
  }

  if(!(website.startsWith("http://www"))){
        throw new Error("ERROR: URL need to start with https://www");
  }

  if(!(website.endsWith(".com"))){
        throw new Error("ERROR: URL need to end with .com");
  }

  if(!(website.match("^(http:\/\/www.)([A-Za-z]{5,})(.com)$"))){
    throw new Error("ERROR: Url is not valid");
  }



  if(!(Array.isArray(bandMembers)) && !(Array.isArray(genre))){
    throw new Error("ERROR: It is not an array");
  }else if (bandMembers.length === 0 || genre.length === 0) {
    throw new Error("ERROR: Array is empty"); 
  }else{
    for (let i = 0; i < bandMembers.length; i += 1) {
        if (!(typeof bandMembers[i] == 'string')) {
            throw new Error("bandMember Parameter is not string type");
        }
        if (bandMembers == null || bandMembers[i].trim() === ''){
            throw new Error("bandMembers Parameter is empty");
        }
    }
    for (let i = 0; i < genre.length; i += 1) {
      if (!(typeof genre[i] == 'string')) {
          throw new Error("genre Parameter is not string type");
      }
      if (genre == null || genre[i].trim() === ''){
          throw new Error("genre Parameter is empty");
      }
  }
}
if(isNaN(yearFormed)){
  throw new Error('ERROR: yearFormed needs to be a number');
}

if(yearFormed < 1900 || yearFormed > (new Date().getFullYear)){
  throw new Error('Error: yearFormed paeameter is wrong')
}

let bandUpdateInfo = {
  name : name,
  genre : genre,
  website : website,
  recordLabel : recordLabel,
  bandMembers : bandMembers,
  yearFormed : yearFormed

};

id = ObjectId(id);

}


function checkStrings(name, website, recordLabel){
  if (!(typeof name == 'string')) {
    throw new Error("Parameter is not string type");
  }
  if (!(typeof website == 'string')) {
    throw new Error("Parameter is not string type");
  } 
  if (!(typeof recordLabel == 'string')) {
    throw new Error("Parameter is not string type");
  }



}

function checkParms(name,genre,website,recordLabel,bandMembers,yearFormed){
  if(!name){
      throw new Error("Name parameter is not provided");
  } 
  if(!genre){
      throw new Error("Genre parameter is not provided");
  }
  if(!website){
      throw new Error("Website parameter is not provided");
  }
  if(!recordLabel){
      throw new Error("recordLabel parameter is not provided");
  }
  if(!bandMembers){
      throw new Error("bandMenbers Range parameter is not provided");
  }
  if(!yearFormed){
      throw new Error("yearFormed parameter is not provided");
  }
  
}

function checkIsNull(name, website, recordLabel){
  if (name == null || name.trim() === ''){
    throw new Error(" name parameter is empty");
  }

  if (website == null || website.trim() === ''){
     throw new Error("website parameter is empty");
  }

  if (recordLabel == null || recordLabel.trim() === ''){
    throw new Error(" recordLabel parameter is empty");
  }
}


module.exports = {
  create,
  get,
  getAll,
  remove,
  rename

};