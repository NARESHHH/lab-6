const express = require('express');
const router = express.Router();
const data = require('../data');
const bandsData = data.bands;


router.get('/', async (req, res) => {
  try {
    const Data = await bandsData.getAll();
    result = [];
    for(let ele of Data){
      obj = {};
      obj["_id"] = ele._id.toString();
      obj["band_name"] = ele.name;
      result.push(obj);
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message});
  }
});


router.post('/', async (req, res) => {
    
    const bandRequest = req.body;
  
    if(Object.keys(req.body).length > 7 || Object.keys(req.body).length < 7){
        res.status(400).json({ error: 'current object does not match with given schema '});
        return;
    }
  
    if (!bandRequest) {
      res.status(400).json({ error: 'You must provide data to create a band' });
      return;
    }
  
    if(Object.keys(bandRequest).length === 0){
      res.status(400).json({ error: 'You must provide data to create a band'});
      return;
    }



    let err = checkParms(bandRequest.name, bandRequest.genre, bandRequest.website, bandRequest.recordLabel, bandRequest.bandMembers, bandRequest.yearFormed);

    if(err !== undefined){
      res.status(400).json({ error: err});
      return;
    }

    let err1 = checkStrings(bandRequest.name,bandRequest.website,bandRequest.recordLabel);

    if(err1 !== undefined){
      res.status(400).json({ error: err1});
      return;
    }

  let err2 = checkIsNull(bandRequest.name,bandRequest.website,bandRequest.recordLabel);

  if(err2 !== undefined){
    res.status(400).json({ error: err2});
    return;
  }

  
  if(!(bandRequest.website.startsWith("http://www"))){
        res.status(400).json({ error: 'ERROR: URL need to start with https://www'});
        return; 
    
  }

  if(!(bandRequest.website.endsWith(".com"))){
        res.status(400).json({ error: 'Error: URL needs to end with .com'});
        return;
  }

  if(!(website.match("^(http:\/\/www.)([A-Za-z]{5,})(.com)$"))){
    res.status(400).json({ error: 'Error: URL is not valid'});
    return;
  }



  if(!(Array.isArray(bandRequest.bandMembers)) && !(Array.isArray(bandRequest.genre))){
    res.status(400).json({ error: "ERROR: It is not an array"}); 
    return;  
  }else if (bandRequest.bandMembers.length === 0 || bandRequest.genre.length === 0) {
    res.status(400).json({ error: "ERROR: Array is empty"}); 
    return;  
    
  }else{
    for (let i = 0; i < bandRequest.bandMembers.length; i += 1) {
        if (!(typeof bandRequest.bandMembers[i] == 'string')) {
          res.status(400).json({ error: "BandMember Parameter is not string type"}); 
          return; 
        }
        if (bandRequest.bandMembers == null || bandRequest.bandMembers[i].trim() === ''){
          res.status(400).json({ error: "bandMembers Parameter is empty"}); 
          return; 
            
        }
    }
    for (let i = 0; i < bandRequest.genre.length; i += 1) {
      if (!(typeof bandRequest.genre[i] == 'string')) {
        res.status(400).json({ error: "genre Parameter is not string type"}); 
        return; 
      }
      if (bandRequest.genre == null || bandRequest.genre[i].trim() === ''){
        res.status(400).json({ error: "genre Parameter is empty"}); 
        return; 
      }
  }
}
if(isNaN(yearFormed)){
  res.status(400).json({ error: "ERROR: yearFormed needs to be a number"}); 
  return; 
}

if(yearFormed < 1900 || yearFormed > (new Date().getFullYear)){
  res.status(400).json({ error: "ERROR: yearFormed date is invalid"}); 
  return; 
  
}
    try {
      const { name, genre, website, recordLabel, bandMembers, yearFormed } = bandRequest;
      const newband = await bandsData.create( name, genre, website, recordLabel, bandMembers, yearFormed );
      res.status(200).json(newband);
      return; 
    } catch (e) {
      res.status(400).json({ error: e.message });
      return; 
    }

});


router.get('/:id', async (req, res) => {
  try {

    if(req.params.id.length !== 24){
      res.status(400).json({ error: 'Invalid id length'});
      return;
    }

    const Data = await bandsData.get(req.params.id);
    res.status(200).json(Data);
    } catch (e) {
      res.status(404).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {

  const bandRequest = req.body;
  if (!restaurant) {
    res.status(400).json({ error: 'You must provide data to create a review' });
    return;
  }

  if(Object.keys(restaurant).length === 0){
    res.status(400).json({ error: 'You must provide data to create a restaurant'});
    return;
  }

  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply an ID to delete' });
    return;
  }
  
  if(req.params.id.length !== 24){
    res.status(400).json({ error: 'Invalid id length'});
    return;
  }


  let err = checkParms(bandRequest.name, bandRequest.genre, bandRequest.website, bandRequest.recordLabel, bandRequest.bandMembers, bandRequest.yearFormed);

  if(err !== undefined){
    res.status(400).json({ error: err});
    return;
  }

  let err1 = checkStrings(bandRequest.name,bandRequest.website,bandRequest.recordLabel);

  if(err1 !== undefined){
    res.status(400).json({ error: err1});
    return;
  }

let err2 = checkIsNull(bandRequest.name,bandRequest.website,bandRequest.recordLabel);

if(err2 !== undefined){
  res.status(400).json({ error: err2});
  return;
}


if(!(bandRequest.website.startsWith("http://www"))){
      res.status(400).json({ error: 'ERROR: URL need to start with https://www'});
      return; 
  
}

if(!(bandRequest.website.endsWith(".com"))){
      res.status(400).json({ error: 'Error: URL needs to end with .com'});
      return;
}

if(!(website.match("^(http:\/\/www.)([A-Za-z]{5,})(.com)$"))){
  res.status(400).json({ error: 'Error: URL is not valid'});
  return;
}



if(!(Array.isArray(bandRequest.bandMembers)) && !(Array.isArray(bandRequest.genre))){
  res.status(400).json({ error: "ERROR: It is not an array"}); 
  return;  
}else if (bandRequest.bandMembers.length === 0 || bandRequest.genre.length === 0) {
  res.status(400).json({ error: "ERROR: Array is empty"}); 
  return;  
  
}else{
  for (let i = 0; i < bandRequest.bandMembers.length; i += 1) {
      if (!(typeof bandRequest.bandMembers[i] == 'string')) {
        res.status(400).json({ error: "BandMember Parameter is not string type"}); 
        return; 
      }
      if (bandRequest.bandMembers == null || bandRequest.bandMembers[i].trim() === ''){
        res.status(400).json({ error: "bandMembers Parameter is empty"}); 
        return; 
          
      }
  }
  for (let i = 0; i < bandRequest.genre.length; i += 1) {
    if (!(typeof bandRequest.genre[i] == 'string')) {
      res.status(400).json({ error: "genre Parameter is not string type"}); 
      return; 
    }
    if (bandRequest.genre == null || bandRequest.genre[i].trim() === ''){
      res.status(400).json({ error: "genre Parameter is empty"}); 
      return; 
    }
}
}
if(isNaN(yearFormed)){
res.status(400).json({ error: "ERROR: yearFormed needs to be a number"}); 
return; 
}

if(yearFormed < 1900 || yearFormed > (new Date().getFullYear)){
res.status(400).json({ error: "ERROR: yearFormed date is invalid"}); 
return; 

}


try {
  await bandsData.get(req.params.id);  
} catch (e) {
  res.status(404).json({ message: e.message  });
  return;
}

try {
const rest = await bandsData.update(req.params.id,bandRequest.name, bandRequest.genre, bandRequest.website, bandRequest.recordLabel, bandRequest.bandMembers, bandRequest.yearFormed);
res.status(200).json(rest);
} catch (e) {
res.status(400).json({ error: e.message });
}
});

router.delete('/:id', async (req, res) => {

  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply an ID to delete' });
    return;
  }

  try {
      await bandsData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e.message });
    return;
  }

  try {
    const data = await bandsData.remove(req.params.id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


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

module.exports = router;

  
  