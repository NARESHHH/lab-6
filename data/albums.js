const {ObjectId} = require('mongodb');
const collections = require("../config/mongoCollection");
const bands = collections.bands;
const band = require('./bands');

const create = async (bandId, title, releaseDate, tracks, rating) => {

    let error = checkParms(bandId,title,releaseDate,tracks,rating);
    if(error !== undefined){
        throw error;
    }

    let error1 = checkArgumentIsString(bandId,title,releaseDate);
    if(error1 !== undefined){
        throw error1;
    }
    let error2 = checkIsNull(bandId,title,releaseDate);
     if(error2 !== undefined)
     {
         throw error2;
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