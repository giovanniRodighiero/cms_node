module.exports = {
  attributes: {
    // base model fields
  
    
      name: {
        
          type:"string",
        
          required:true,
        
      },
    
  
    // custom fields
    
    
    
      users: {
        collection: "user",
        via: "website"
      },
    
      metadatas: {
        collection: "metadata",
        via: "website"
      },
    
    
  }
};
