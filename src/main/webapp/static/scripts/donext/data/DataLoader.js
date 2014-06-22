
define(["thirdparty/jquery", "donext/util/EventHub"], function(jQuery, EventHub) {

        var DataLoader = function( )
        {
        	this.m_mCategories = { 
        			
        			"work_1" : {
        				
        				name: "Work",
        				color: "rgb(160, 0, 167)",
        				position: "1"
        			},
        			
        			"books_1" : {
        				
        				name: "Books",
        				color: "rgb(26, 173, 255)",
        				position: "2"
        			},
        			
        			"books_2" : {
        				
        				name: "Fiction",
        				color: "rgb(0, 124, 194)",
        				position: "2"
        			},
        			
        			"games_1" : {
        				
        				name: "Games",
        				color: "rgb(255, 26, 62)",
        				position: "3"
        			},
        			
        			"anime_1" : {
        				
        				name: "Anime",
        				color: "rgb(255, 132, 167)",
        				position: "4"
        			},
        			
        			"projects_1" : {
        				
        				name: "Projects",
        				color: "rgb(255, 167, 98)",
        				position: "5"
        			}
        	}
        	
        	this.m_mToDos = { 
        			
        			"books_1" : {
        				
        				"item1" : {
        					
            				description: "Read 1",
            				started: 1403368999731,
            				priority: "immediate",
            				state: "active",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item2" : {
        					
            				description: "Read 2",
            				started: "no",
            				priority: "immediate",
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
        				},
        				
        				"item5" : {
        					
            				description: "Read 5",
            				started: 1403368763767,
            				priority: "whenever",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item6" : {
        					
            				description: "Read 6",
            				started: 1403368763767,
            				priority: "immediate",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item7" : {
        					
            				description: "Read 7",
            				started: 1403368763767,
            				priority: "whenever",
            				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
        				}

        			},
        			
        			"games_1" : {
        				
        				"item100" : {
        					
        					description: "Play 1",
        					started: 1403368763767,
        					priority: "whenever",
        					state: "active",
        					percentage: Math.floor(Math.random()*100)
        				},
        				
        				"item101" : {
        					
        					description: "Play 2",
        					started: "no",
        					priority: "whenever",
        					state: "inactive",
        					percentage: Math.floor(Math.random()*100)
        				}
        			},
        			
        			"work_1" : {
        				
        				"item200" : {
        					
            				description: "DO 1",
            				started: 1403368763767,
            				priority: "whenever",
            				state: "active",
            				percentage: Math.floor(Math.random()*100)
        				},
        			
	    				"item201" : {
	    					
	        				description: "DO 2",
	        				started: "no",
	        				priority: "whenever",
	        				state: "inactive",
            				percentage: Math.floor(Math.random()*100)
	    				}
        			}
        			
        	}
        }
        
        DataLoader.prototype.loadCategories = function( )
        {
        	//return this.m_mCategories;
        	
        	$.getJSON("http://localhost:7788/donext/categories", function( mData ) {
   		     
        		EventHub.triggerEvent("onCategoriesLoaded", JSON.parse(mData.result));
        	});
        }
        
        DataLoader.prototype.loadToDos = function( sCategoryId )
        {
        	//return this.m_mToDos[sCategoryId];
        	
        	$.getJSON("http://localhost:7788/donext/todos/?categoryId="+sCategoryId, function( mData ) {
      		     
        		for(var key in mData)
        		{
        			mData[key] = JSON.parse(mData[key]);
        		}
        		
        		EventHub.triggerEvent("onTodosLoaded", mData);
        	});
        }
        
        DataLoader.prototype.save = function( postData )
        {
        	$.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/donext/savetodo",
                data: JSON.stringify(postData),
                dataType: "text"
            }).done(function(data) {
            	console.log("saved")
            	//window.EVENT_HUB.triggerEvent("saveTextView", JSON.parse(data));
            }.bind(this))
            .fail(function(xhr, textStatus, thrownError) { alert("error " + textStatus); console.log(xhr, textStatus, thrownError);})
        	
        }
        
        if(!window.DATA_LOADER){
        	window.DATA_LOADER = new DataLoader();
        }
        
        return DATA_LOADER;
});