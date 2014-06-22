
define(["thirdparty/jquery", "services/TemplateService", "donext/util/EventHub"], function( jQuery, tpl, EventHub) {

        var TodoItem = function( sCategoryId, sDescription, sStarted, sPriority, sState, nPercentage, sColor)
        {
        	this.m_eElement = tpl.getTemplate(".todo_item");
        	
        	this.m_sCategoryId = sCategoryId;
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
        }
        
        TodoItem.prototype.postProcess = function()
        {
        	this.m_eElement.find(".immediate").on("click", function() {
        		this.setPriority("immediate");
        	}.bind(this));
        	
        	this.m_eElement.find(".whenever").on("click", function() {
        		this.setPriority("whenever");
        	}.bind(this));
        	
        	this.m_eElement.find(".activate").on("click", function() {
        		this.activate();
        		// also move this one up
        	}.bind(this));
        	
        	this.m_eElement.find(".deactivate").on("click", function() {
        		this.deactivate();
        		// also move this one down
        	}.bind(this));
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
        	EventHub.triggerEvent("onRefresh", {});
        }
        
        TodoItem.prototype.deactivate = function()
        {
        	this.setState("inactive");
        	EventHub.triggerEvent("onRefresh", {});
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
        	EventHub.triggerEvent("onRefresh", {});
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