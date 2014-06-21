
define(["thirdparty/jquery", "services/TemplateService"], function( jQuery, tpl) {

        var TodoItem = function( sDescription, sStarted, sPriority, sState, sColor)
        {
        	this.m_eElement = tpl.getTemplate(".todo_item");
        	
        	this.m_sDescription = sDescription;
        	this.m_bStarted = (sStarted != "no");
        	
        	this.m_dStartDate = null;
        	if(this.m_bStarted)
        	{
        		this.m_dStartDate = new Date(sStarted);
        	}
        	
        	this.m_sPriority = sPriority;
        	this.m_sState = sState;
        	
        	this.m_eElement.find(".description").text( this.m_sDescription );
        	this.m_eElement.css("background-color", sColor);
        	
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
        	this.m_sState = "active";
        	
        	if(!this.m_dStartDate)
        	{
        		this.m_dStartDate = new Date();
        	}
        }
        
        TodoItem.prototype.deactivate = function()
        {
        	this.m_sState = "inactive";
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
        
        TodoItem.prototype.setPriority = function( sPriority )
        {
        	this.m_sPriority = sPriority;
        	this.switcheroo(this.m_sPriority, "immediate", ".immediate", ".whenever", "selected");
        }
        
        TodoItem.prototype.setState = function( sState )
        {
        	this.m_sState = sState;
        	this.switcheroo(this.m_sState, "inactive", ".activate", ".deactivate", "selected");
        	this.switcheroo(this.m_sState, "inactive", ".deactivate", ".activate", "no_state");
        }
        
        // i do this a lot...
        TodoItem.prototype.switcheroo = function( sString, sPivot, sAdd, sRemove, sClass )
        {
        	if(sString == sPivot)
        	{
        		this.m_eElement.find( sAdd ).addClass( sClass );
        		this.m_eElement.find( sRemove ).removeClass( sClass );
        	}
        	else
        	{
        		this.m_eElement.find( sRemove ).addClass( sClass );
        		this.m_eElement.find( sAdd ).removeClass( sClass );
        	}
        }
        
        return TodoItem;
});