const express = require('express');
const router = express.Router();
const data = require('../data');
const albums = data.albums;
const collections = require('../config/mongoCollection');
const bands1 = collections.bands;
const { ObjectId } = require('mongodb');

router.get('/:id', async (req,res) => {
    try{
        if(!req.params.id){
            res.status(400).json({error: " ERROR: Band Id required"});
            return;
        }
        
        let data = await albums.getAll(req.params.id);

        if(data.length === 0){
            res.status(404).json({error:data});
            return;
        }
        res.status(200).json(data);
    }
    catch(e){
        res.status(404).json({error : e.message});
    }
});

router.post('/:id', async (req,res) =>{
    const data = req.body;
    if(!data){
        res.status(400).json({error: "You must provide a data to create a album"});
        return;
    }
    if(Object.keys(data).length === 0){
        res.status(400).json({ error: 'You must provide data to create a album'});
        return;
      }
    
      if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an band ID to add album' });
        return;
      }
    
      if(req.params.id.length !== 24){
        res.status(400).json({ error: 'Invalid band id'});
        return;
      }
    
      if(Object.keys(req.body).length > 4 || Object.keys(req.body).length < 4){
        res.status(400).json({ error: 'Current object does not match with given schema '});
        return;
      } 

    let error = checkParms(req.params.id,data.title,data.releaseDate,data.tracks,data.rating);
    if(error !== undefined){
        res.status(400).json({ error: error});
        return;
    }

    let error1 = checkStrings(req.params.id,data.title,data.releaseDate);
    if(error1 !== undefined){
        res.status(400).json({ error: error1});
        return;
    }
    let error2 = checkIsNull(req.params.id,data.title,data.releaseDate);
     if(error2 !== undefined)
     {
        res.status(400).json({ error: error2});
        return;
         
     }

     if (typeof req.params.id === "string") {
        req.params.id = ObjectId(req.params.id);
      } else if (!(req.params.id instanceof ObjectId)) {
        res.status(400).json({ error: 'Invalid argument type : id'});
        return;
      }

     

    const bandsCollection = await bands1();

     const band = await bandsCollection.findOne({_id: req.params.id });

     if(band == null){
        res.status(400).json({ error: 'No bands with id is present'});
      return;
     }

     if(typeof data.rating === "string"){
        res.status(400).json({ error: 'Rating cannot be string type.'});
        return;
     }
     if(data.rating < 1 || data.rating > 5){
        res.status(400).json({ error: 'Rating should be between 1 to 5'});
        return;
     }

     let date = new Date(data.releaseDate);
     if(!isValidDate(date)){
       res.status(400).json({message:'Release date should be in valid data format.'});
       return;
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
       res.status(400).json({ error:"Error in the date "}) 
     }

     if(Number(dd) < 0 || Number(mm) < 0 || Number(yyyy) < 0  ){
      res.status(400).json({ error:"Error: date cannot cannot be negative"});
      return;
     }
     if( Number(mm) > 12){
      res.status(400).json({ error:"Error: month greater than 12"});
      return;
     }

     if(Array.isArray(data.tracks)){
       if(data.tracks.length < 3){
        res.status(400).json({ error:"ERROR: Tracks length need to be greater than 3"});
        return;
       }
       else{
         for(var i=0 ; i<data.tracks.length;i++){
           if(typeof data.tracks[i] !== 'string'){
            res.status(400).json({ error:"ERROR: Tracks element need to be a string"});
            return;  
           }
         }
        }
      }
      else{
        res.status(400).json({error : "Error tracks need to be an Array"});
      }


      req.params.id,data.title,data.releaseDate,data.tracks,data.rating
      try {
        const { title, releaseDate, tracks, rating } = data;
        const newAlbum = await albums.create(req.params.id.toString(), title, releaseDate, tracks, rating);
        res.status(200).json(newAlbum);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get('/album/:id', async (req,res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an album ID to get album' });
        return;
    }
    if(req.params.id.length !== 24){
      res.status(400).json({ error: 'Invalid album id'});
      return;
    }
    try {
      const data = await albums.get(req.params.id);
      res.status(200).json(data);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
});

router.delete('/:id', async (req,res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an ID to delete' });
        return;
      }
    
      if(req.params.id.length !== 24){
        res.status(400).json({ error: 'Invalid Album id'});
        return;
      }
      
      try {
        const data = await albums.get(req.params.id);
      } catch (e) {
          res.status(404).json({ error: e.message});
          return;
      }
    
      try {
        const data1 = await albums.remove(req.params.id);
        res.status(200).json(data1);
      } catch (e) {
        res.status(400).json({ error: e.message});
      }
});

function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
  }
  
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

    module.exports = router;