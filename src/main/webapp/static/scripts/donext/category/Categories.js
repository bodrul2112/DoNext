

define(["thirdparty/jquery", 
        "services/TemplateService", 
        "donext/util/UICleaner",
        "donext/data/DataLoader",
        "donext/category/Category"], function( jQuery, tpl, UICleaner, DataLoader, Category ) {

        var Categories = function( )
        {
        	this.m_eElement = tpl.getTemplate(".categories");
        	
        	this.m_oUICleaner = new UICleaner();
        	
        	this.m_pCategories = [];
        }
        
        Categories.prototype.getElement = function()
        {
        	return this.m_eElement;
        }
        
        Categories.prototype.loadData = function()
        {
        	var mData = DataLoader.loadCategories();
        	
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