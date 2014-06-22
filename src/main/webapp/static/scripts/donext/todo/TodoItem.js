
define(["thirdparty/jquery", "services/TemplateService", "donext/util/EventHub"], function( jQuery, tpl, EventHub) {

        var TodoItem = function( sCategoryId, sId, sDescription, sStarted, sPriority, sState, nPercentage, sColor)
        {
        	this.m_eElement = tpl.getTemplate(".todo_item");
        	this.m_ePercentage = this.m_eElement.find(".percentage");
        	this.m_ePercentageBar = this.m_eElement.find(".percentage .bar");
        	
        	this.m_sCategoryId = sCategoryId;
        	this.m_sId = sId;
        	this.m_nPercentage = nPercentage;
        	
        	this.m_sDescription = sDescription;
        	this.m_bStarted = (sStarted != "no");
        	
        	this.m_dStartDate = null;
        	if(this.m_bStarted)
        	{
        		this.m_dStartDate = new Date(sStarted);
        	}
        	
        	this.m_sPriority = sPriority;
        	this.m_sState = sState;
        	
        	this.m_sColor = sColor;
        	
        	this.m_eElement.find(".description").text( this.m_sDescription );
        	this.m_eElement.find(".description").css("color", sColor);
        	
        	this.m_eElement.find(".percentage").css("background-color", sColor);
        	this.m_eElement.find(".activate").css("background-color", sColor);
        	this.m_eElement.find(".deactivate").css("background-color", sColor);
        	
        	this.m_eElement.find(".percentage .bar").css("width", nPercentage+"%");
        	
        	this.setPriority(sPriority);
        	this.setState(sState);
        	
        	this.m_bIsAdder = false;
        	
        	this.m_bDone = false;
        }
        
        TodoItem.prototype.isAdder = function()
        {
        	return this.m_bIsAdder;
        }
        
        TodoItem.prototype.isDone = function()
        {
        	return this.m_bDone;
        }
        
        TodoItem.prototype.convertToNew = function()
        {
        	this.m_bIsAdder=true;
        	
        	this.m_eElement.find(".description").text("");
        	this.m_eElement.find(".description").append(tpl.getTemplate(".todo_name"));
        	
        	this.m_eElement.find(".percentage").remove();
        	this.m_eElement.find(".activate").remove();
        	this.m_eElement.find(".deactivate").remove();
        	
        	this.m_eElement.find(".add").removeClass("no_state");
        	this.m_eElement.find(".add").addClass("selected");
    		this.m_eElement.find(".add").css("background-color", this.m_sColor);
        }
        
        TodoItem.prototype.postProcess = function()
        {
        	this.m_eElement.find(".immediate").on("click", function() {
        		this.setPriority("immediate");
        		if(!this.m_bIsAdder){
        			EventHub.triggerEvent("onRefresh", {});
        		}
        	}.bind(this));
        	
        	this.m_eElement.find(".whenever").on("click", function() {
        		this.setPriority("whenever");
        		if(!this.m_bIsAdder){
        			EventHub.triggerEvent("onRefresh", {});
        		}
        	}.bind(this));
        	
        	this.m_eElement.find(".activate").on("click", function() {
        		this.activate();
        		EventHub.triggerEvent("onRefresh", {});
        	}.bind(this));
        	
        	this.m_eElement.find(".deactivate").on("click", function() {
        		this.deactivate();
        		EventHub.triggerEvent("onRefresh", {});
        	}.bind(this));
        	
        	this.m_eElement.find(".add").on("click", function() {
        		// do something
        		
        		var sDesc = this.m_eElement.find(".todo_name").val();
        		var oDate = new Date();
        		var id = "item_"+oDate.getTime();
        		
        		var mData = {
        				item: new TodoItem(this.m_sCategoryId, id, sDesc, "no", this.m_sPriority, this.m_sState, 0, this.m_sColor)
        		}
        		
        		EventHub.triggerEvent("onAddItem", mData);
        		
        	}.bind(this));
        	
        	this.m_eElement.find(".todo_done").on("click", function() {
        		
        		this.m_bDone = true;
        		EventHub.triggerEvent("onRefresh", {});
        		
        	}.bind(this));
        	
        	this.m_eElement.find(".percentage").on("click", function(e) {
        		this.setPercentageFromBar(e);
        	}.bind(this));
        }
        
        TodoItem.prototype.setPercentageFromBar = function(e)
        {
			var parentLeft = this.m_ePercentage.position().left;
			var width = this.m_ePercentage.width();
			
			var relX = e.pageX - parentLeft;
			this.m_nPercentage = Math.floor((relX/width)*100);

			this.m_ePercentageBar.css("width", this.m_nPercentage+"%");
			EventHub.triggerEvent("onRefresh", {});
        }
        
        TodoItem.prototype.getElement = function()
        {
        	return this.m_eElement;
        }
        
        TodoItem.prototype.activate = function()
        {
        	this.setState("active");
        	
        	if(!this.m_dStartDate)
        	{
        		this.m_dStartDate = new Date();
        	}
        }
        
        TodoItem.prototype.deactivate = function()
        {
        	this.setState("inactive");
        }
        
        TodoItem.prototype.asJson = function()
        {
        	var mJsonMap = {
				description: this.m_sDescription,
				started: this.m_dStartDate.getTime(),
				priority: this.m_sPriority,
				state: this.m_sState
        	}
        	
        	return mJsonMap;
        }
        
        TodoItem.prototype.getCategoryId = function()
        {
        	return this.m_sCategoryId;
        }
        
        TodoItem.prototype.isStarted = function()
        {
        	return this.m_bStarted;
        }
        
        TodoItem.prototype.getStartDate = function()
        {
        	return this.m_dStartDate;
        }
        
        TodoItem.prototype.getPriority = function()
        {
        	return this.m_sPriority;
        }
        
        TodoItem.prototype.getPercentage = function()
        {
        	return this.m_nPercentage;
        }
        
        TodoItem.prototype.setPriority = function( sPriority )
        {
        	this.m_sPriority = sPriority;
        	this.switcheroo(this.m_sPriority, "immediate", ".immediate", ".whenever", "selected", this.m_sColor);
        }
        
        TodoItem.prototype.getState = function()
        {
        	return this.m_sState;
        }
        
        TodoItem.prototype.setState = function( sState )
        {
        	this.m_sState = sState;
        	this.switcheroo(this.m_sState, "inactive", ".activate", ".deactivate", "selected", "white");
        	this.switcheroo(this.m_sState, "inactive", ".deactivate", ".activate", "no_state", "white");
        }
        
        // i do this a lot...
        TodoItem.prototype.switcheroo = function( sString, sPivot, sAdd, sRemove, sClass, sColor)
        {
        	if(sString == sPivot)
        	{
        		this.m_eElement.find( sAdd ).css("color", sColor );
        		this.m_eElement.find( sRemove ).css("color", "white" );
        		
        		this.m_eElement.find( sAdd ).addClass( sClass );
        		this.m_eElement.find( sRemove ).removeClass( sClass );
        	}
        	else
        	{
        		this.m_eElement.find( sRemove ).css("color", sColor );
        		this.m_eElement.find( sAdd ).css("color", "white" );
        		
        		this.m_eElement.find( sRemove ).addClass( sClass );
        		this.m_eElement.find( sAdd ).removeClass( sClass );
        	}
        }
        
        return TodoItem;
});