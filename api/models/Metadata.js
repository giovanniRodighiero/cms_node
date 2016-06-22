module.exports = {
  attributes: {
    // base model fields
  
    
      path: {
        
          type:"string",
        
          required:true,
        
      },
    
      meta_title: {
        
          type:"string",
        
      },
    
      meta_descr: {
        
          type:"string",
        
      },
    
      published: {
        
          type:"boolean",
        
      },
    
      locale: {
        
          type:"string",
        
      },
    
  
    // custom fields
    
    
    
    
      website: {
        model: "website"
      },
    
  }
};
