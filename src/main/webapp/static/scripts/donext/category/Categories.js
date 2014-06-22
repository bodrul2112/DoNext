

define(["thirdparty/jquery", 
        "services/TemplateService", 
        "donext/util/UICleaner",
        "donext/data/DataLoader",
        "donext/category/Category",
        "donext/util/EventHub"], function( jQuery, tpl, UICleaner, DataLoader, Category, EventHub ) {

        var Categories = function( )
        {
        	this.m_eElement = tpl.getTemplate(".categories");
        	
        	this.m_oUICleaner = new UICleaner();
        	
        	this.m_pCategories = [];
        	
        	this.m_sCallbackId = "CATEG_1234"
        	
        	EventHub.registerEvent("onCategoriesLoaded", this.m_sCallbackId, this );
        	
        }
        
        Categories.prototype.getElement = function()
        {
        	return this.m_eElement;
        }
        
        Categories.prototype.loadData = function()
        {
        	DataLoader.loadCategories();
        }
        
        Categories.prototype.onEvent = function( sEventName, mData )
        {
        	for(var id in mData)
        	{
        		var oData = mData[id];
        		var oCategory = new Category( id, oData.name, oData.color, oData.position );
        		this.m_pCategories.push(oCategory);
        	}
        	
        	this.m_oUICleaner.addElements(this.m_eElement, this.m_pCategories );
        }
        
        Categories.prototype.postProcess = function( )
        {
        	this.m_eElement.on("click", function() {

        		// load the item
        		//console.log("clicked categories");
        		
        	}.bind(this));
        	
        }
        
        
        return Categories;
});