

define(["thirdparty/jquery", "services/TemplateService", "donext/util/EventHub" ], function( jQuery, tpl, EventHub ) {

        var Category = function( sId, sName, sColor, nPosition )
        {
        	this.m_sId = sId;
        	this.m_sName = sName;
        	this.m_sColor = sColor;
        	this.m_nPosition = nPosition;
        	
        	this.m_eElement = tpl.getTemplate(".category");
        	
        	this.m_eElement.text( this.m_sName );
        	
        	this.m_bLoaded = false;
        }
        
        Category.prototype.getElement = function()
        {
        	return this.m_eElement;
        }
        
        Category.prototype.getId = function()
        {
        	return this.m_sId;
        }
        
        Category.prototype.postProcess = function()
        {
        	this.m_eElement.on("click", function() {

        		if(!this.m_bLoaded)
        		{
        			this.m_bLoaded = true;
            		this.m_eElement.css("background-color", this.m_sColor);
            		
            		var mData = {
            			id:this.m_sId,
            			color:this.m_sColor
            		};
            		
            		EventHub.triggerEvent("onCategoryLoaded", mData);
        		}
        		else
        		{
        			this.m_eElement.css("background-color", "");
        			var mData = {
                			id:this.m_sId
                		};
                		
                	EventHub.triggerEvent("onCategoryUnloaded", mData);
                	this.m_bLoaded = false;
        		}
        		
        	}.bind(this));
        	
        }
        
        return Category;
});