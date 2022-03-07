
const { ObjectId } = require('mongodb');
const collections = require('../config/mongoCollection');
const bands = collections.bands;
const band = require('./bands');

const create = async (bandId, title, releaseDate, tracks, rating) => {

    let error = checkParms(bandId,title,releaseDate,tracks,rating);
    if(error !== undefined){
        throw error;
    }

    let error1 = checkStrings(bandId,title,releaseDate);
    if(error1 !== undefined){
        throw error1;
    }
    let error2 = checkIsNull(bandId,title,releaseDate);
     if(error2 !== undefined)
     {
         throw error2;
     }

     if(typeof bandId === 'string'){
       bandId = ObjectId(bandId);
     }
     else if (!(bandId instanceof ObjectId)){
       throw new Error("Invalid bandId parameter passed");
     }

     const bandCollection = await bands();

     const banddata = await bandCollection.findOne({_id: bandId });

     
     if(banddata == null){
       throw new Error("No band with id is present");
     }

     if(typeof rating === "string"){
       throw new Error("Rating cannot be of string type");
     }
     if(rating < 1 || rating > 5){
       throw new Error("Rating should be between 1 to 5.")
     }

     let date = new Date(releaseDate);
     
    if (Object.prototype.toString.call(date) === "[object Date]") {
      if (isNaN(date.getTime())) {
        throw new Error('Review Date should be a valid date format.');
        
      } 
    }    

     let dd = String(date.getDate()).padStart(2,'0');
     let mm = String(date.getMonth() + 1).padStart(2,'0');
     let yyyy = date.getFullYear();

     d = mm + '/' + dd + '/' + yyyy;

     let current = new Date();
     let dd1 = String(current.getDate()).padStart(2,'0');
     let mm1 = String(current.getMonth() + 1).padStart(2,'0');
     let yyyy1 = current.getFullYear();

     current = mm1 + '/' + dd1 + '/' + yyyy1;

     if(Number(yyyy) < 1900 || Number(yyyy) > (Number(yyyy1) + 1) ){
       throw new Error("Error in the date "); 
     }

     if(dd < 0 || mm < 0 || yyyy < 0  ){
      throw new Error("Error: date cannot cannot be negative");
      
     }
     
     if( mm > 12){
      throw new Error("Error: month greater than 12");
      
     }

     if(Array.isArray(tracks)){
       if(tracks.length < 3){
         throw new Error('Error: tracks length needs to be greater than 3');
       }
       else{
         for(var i=0 ; i<tracks.length;i++){
           if(typeof tracks[i] !== 'string'){
             throw new Error('Tracks member needs to be a valid string');
           }
         }
        }
      }
      else{
        throw new Error('Error: tracks need to be an Array');
      }

      let AlbumId = ObjectId();

      const newAlbum = {
        _id: AlbumId,
        title : title,
        releaseDate : releaseDate,
        tracks : tracks,
        rating:rating,

      }

      
     // const bandsCollection = await bands();

      let totalRating = 0;
      let c = 0;

      let albums = banddata.albums;

      
      if(albums.length !== 0){
        for(let a of albums){
          totalRating = totalRating + a.rating;
          c++;
        }
      }

      albums.push(newAlbum);

      let overallRatingAverage = (totalRating) / (c+1);
      overallRatingAverage = Math.round((overallRatingAverage + Number.EPSILON)*100)/100;

      const bandUpdateInfo = {
        
          name : banddata.name,
          genre: banddata.genre,
          website : banddata.website,
          recordLabel: banddata.recordLabel,
          bandMembers: banddata.bandMembers,
          yearFormed: banddata.yearFormed,
          albums: albums,
          overallRating: overallRatingAverage,
      }

      const updatedInfo = await bandCollection.updateOne(
        {_id:bandId},{$set : bandUpdateInfo}
      );

      if(updatedInfo.modifiedCount === 0){
        throw "Could not update bands successfully";
      }


      const bandData = await band.get(bandId.toString());

      for(let ele of bandData.albums){
        ele._id = ele._id.toString();
      }

      if(updatedInfo.modifiedCount > 0){
        bandData._id = bandData._id.toString();
        return bandData;
      }
};

function checkStrings(bandId, title, releaseDate){
    if (!(typeof bandId == 'string')) {
      throw new Error("Parameter is not string type");
    }
    if (!(typeof title == 'string')) {
      throw new Error("Parameter is not string type");
    } 
    if (!(typeof releaseDate == 'string')) {
      throw new Error("Parameter is not string type");
    }
  }
  
  function checkParms(bandId,title,releaseDate,tracks,rating)
  {
    if(!bandId){
        throw new Error("BandId parameter is not provided");
    } 
    if(!title){
        throw new Error("title parameter is not provided");
    }
    if(!releaseDate){
        throw new Error("ReleaseDate parameter is not provided");
    }
    if(!tracks){
        throw new Error("tracks parameter is not provided");
    }
    if(!rating){
        throw new Error("rating Range parameter is not provided");
    }
    
  }
  
  function checkIsNull(bandId, title, releaseDate){
    if (bandId == null || bandId.trim() === ''){
      throw new Error(" name parameter is empty");
    }
  
    if (title == null || title.trim() === ''){
       throw new Error("website parameter is empty");
    }
  
    if (releaseDate == null || releaseDate.trim() === ''){
      throw new Error(" recordLabel parameter is empty");
    }
  }



const getAll = async (bandId) => {
  if(!bandId){
    throw new Error("ERROR: BandId parameter required");
  }
  
  if(typeof bandId !== 'string'){
    throw new Error("ERROR: BandID needs to be a String")
  }
  if (bandId == null || bandId.trim() === ''|| bandId === undefined ){
    throw new Error("ERROR: bandId parameter is empty");
  }
  if (typeof bandId === "string") {
    bandId = ObjectId(bandId);
  } else if (!(bandId instanceof ObjectId)) {
    throw new Error("ERROR: Id parameter needs to be object type");
  }

  const bandCollection = await bands();
  const banddata = await bandCollection.findOne({_id : bandId})

  if(banddata == null ){
    throw new error("No bands with the bandId present");
  }

  let albums = banddata.albums;

  for(let element of albums){
    element._id = element._id.toString();
  }
  return albums;

}
const get = async (albumId)=>{

  if(!albumId){
    throw new Error("Error: Album Id required");
  }
  if(albumId.length !== 24){
    throw new Error("Error : Invalid Album Id");
  }
  if(typeof albumId !== 'string'){
    throw new Error("ERROR: id parameter need to be type of string");
  }
  
  if (albumId == null || albumId.trim() === ''|| albumId === undefined ){
    throw new Error("parameter is empty");
  }

  if (typeof albumId === "string") {
      albumId = ObjectId(albumId);
  } else if (!(albumId instanceof ObjectId)) {
      throw new Error("ERROR: Id parameter needs to be object type");
  }
  
  const bandCollection = await bands();

  const banddata = await bandCollection.findOne({'albums._id' : albumId});

  if (banddata === null)  {
    throw new Error(`No album with id ${albumId}`);
  }

  if (banddata.albums.length === 0) {
    return banddata.albums;
  }
 
for (let album of banddata.albums) {
    if (album._id.toString() === albumId.toString()) {
      album._id = album._id.toString();
      return album;
    }
}

  
}

const remove = async (albumId)=>{
  if(!albumId){
    throw new Error("Error: Album Id required");
  }
  if(albumId.length !== 24){
    throw new Error("Error : Invalid Album Id");
  }
  if(typeof albumId !== 'string'){
    throw new Error("ERROR: id parameter need to be type of string");
  }
  
  if (albumId == null || albumId.trim() === ''|| albumId === undefined ){
    throw new Error("parameter is empty");
  }

  if (typeof albumId === "string") {
      albumId = ObjectId(albumId);
  } else if (!(albumId instanceof ObjectId)) {
      throw new Error("ERROR: Id parameter needs to be object type");
  }

  var rating = 0;

  const bandCollection = await bands();

  const banddata = await bandCollection.findOne({'albums._id': albumId});

    if(banddata === null ){
    throw new Error(`No album with id ${albumId}`);
  }else{
    for(let album of banddata.albums){
      if(album._id.toString() === albumId.toString()){
        rating  = album.rating;
      }
    }
  }

  let totalRating = 0;
  let c = 0;

  let albums = banddata.albums;

  if(albums.length !== 0){
    for(let a of albums){
      totalRating = totalRating + a.rating;
      c=c+1;
    }
  }

  let overallRatingAverage = (totalRating-rating) / (c - 1);
  overallRatingAverage = Math.round((overallRatingAverage + Number.EPSILON) * 100) / 100;

  let bandUpdateInfo = {
    overallRating: overallRatingAverage
  }


const updatedInfo = await bandCollection.updateOne(
    { _id: banddata._id },
    { $pull: { albums: { _id: albumId }}});


if (updatedInfo.modifiedCount === 0) {
      throw new Error('could not remove album');
}
else {
  //update modifief overallRating
  const bandData = await bandCollection.findOne({_id: banddata._id});
  if (bandData !== null) {
      if(bandData.albums.length === 0){
          bandUpdateInfo = {
          overallRating: 0
      }
      }
  }else{
      throw new Error('Band with Id not found');
  }
      
  const updatedInfo1 = await bandCollection.updateOne(
          { _id: bandData._id },{ $set: bandUpdateInfo}
 );        
  
      if (updatedInfo1.modifiedCount === 0) {
          throw new Error('Could not update band successfully');
      }
      return {"AlbumId": albumId.toString(), "deleted": true};
  }


}

module.exports={
  get,
  getAll,
  create,
  remove
}
