
define(["thirdparty/jquery"], function(jQuery) {

        var DataLoader = function( )
        {
        	this.m_mCategories = { 
        			
        			"id_1" : {
        				
        				name: "Books",
        				color: "rgb(26, 173, 255)",
        				position: "1"
        			},
        			
        			"id_2" : {
        				
        				name: "Games",
        				color: "rgb(255, 26, 62)",
        				position: "2"
        			}
        			
        	}
        	
        	this.m_mToDos = { 
        			
        			"id_1" : {
        				
        				"item1" : {
        					
            				description: "Read 1",
            				started: 1403368999731,
            				priority: "asap",
            				state: "active",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item2" : {
        					
            				description: "Read 2",
            				started: "no",
            				priority: "asap",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item3" : {
        					
            				description: "Read 3",
            				started: "no",
            				priority: "whenever",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item4" : {
        					
            				description: "Read 4",
            				started: 1403368763767,
            				priority: "whenever",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				}

        			},
        			
        			"id_2" : {
        				
        				"item100" : {
        					
            				description: "Play 1",
            				started: 1403368763767,
            				priority: "asap",
            				state: "active",
            				percentage: Math.floor(Math.random()*100)
        				},
        			
	    				"item101" : {
	    					
	        				description: "Play 2",
	        				started: "no",
	        				priority: "asap",
	        				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
	    				}
        			}
        			
        	}
        }
        
        DataLoader.prototype.loadCategories = function( )
        {
        	return this.m_mCategories;
        }
        
        DataLoader.prototype.loadToDos = function( sCategoryId )
        {
        	return this.m_mToDos[sCategoryId];
        }
        
        if(!window.DATA_LOADER){
        	window.DATA_LOADER = new DataLoader();
        }
        
        return DATA_LOADER;
});