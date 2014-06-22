
define(["thirdparty/jquery", 
        "services/TemplateService", 
        "donext/util/UICleaner",
        "donext/util/EventHub",
        "donext/data/DataLoader", 
        "donext/todo/TodoItem"], function( jQuery, tpl, UICleaner, EventHub, DataLoader, TodoItem ) {

        var TodoList = function()
        {
        	this.m_nHeaderSize = 35;
        	this.m_oUICleaner = new UICleaner();
        	this.m_eElement = tpl.getTemplate(".todo_list");
        	
        	this.m_eActive = this.m_eElement.find(".todo_active");
        	this.m_eInactive = this.m_eElement.find(".todo_inactive");
        	
        	this.m_pActiveItems = [];
        	this.m_pInactiveItems = [];
        	
        	this.m_sCallbackId = "TodoList";
        	
        	EventHub.registerEvent("onCategoryLoaded", this.m_sCallbackId, this );
        	EventHub.registerEvent("onCategoryUnloaded", this.m_sCallbackId, this );
        	EventHub.registerEvent("onAddItem", this.m_sCallbackId, this );
        	EventHub.registerEvent("onRefresh", this.m_sCallbackId, this );
        	
        	this.m_mLoadedCategories = {};
        }
        
        TodoList.prototype.getElement = function()
        {
        	return this.m_eElement;
        }
        
        TodoList.prototype.postProcess = function()
        {
        	var nHeight = $(window).height();
        	this.m_eElement.css("height", nHeight-this.m_nHeaderSize);
        }
        
        TodoList.prototype.onEvent = function( sEventName, mCallbackData )
        {
        	if(sEventName == "onCategoryLoaded")
        	{
        		this.onCategoryLoaded(mCallbackData);
        	}
        	else if(sEventName == "onCategoryUnloaded")
        	{
        		this.onCategoryUnloaded(mCallbackData);
        	}
        	else if(sEventName == "onAddItem")
        	{
        		this.addSingleItem(mCallbackData.item);
        	}
        	else if(sEventName == "onRefresh")
        	{
        		this.refresh();
        	}
        }
        
        TodoList.prototype.isOnlyOneLoaded = function()
        {
        	var nLoaded=0;
        	var result;
        	for(var key in this.m_mLoadedCategories)
        	{
        		if(this.m_mLoadedCategories[key])
        		{
        			nLoaded++;
        			result = {id:key, color:this.m_mLoadedCategories[key]};
        		}
        	}
        	
        	if(nLoaded==1){
        		return result;
        	}else{
        		return false
        	};
        	
        }
        
        TodoList.prototype.onCategoryUnloaded = function( mCallbackData )
        {
        	var sCategoryId = mCallbackData.id;
        	this.m_mLoadedCategories[sCategoryId]=false;
        	
        	this.m_pActiveItems = this.removeElementsWithId(mCallbackData, this.m_pActiveItems);
        	this.m_pInactiveItems = this.removeElementsWithId(mCallbackData, this.m_pInactiveItems);
        	
        	this.refresh();
        }
        
        TodoList.prototype.removeElementsWithId = function( mCallbackData, pItems )
        {
        	var sCategoryId = mCallbackData.id;
        	var pNewActiveItems = [];
        	
        	for(var key in pItems)
        	{
        		var oTodoItem = pItems[key];
        		
        		if(oTodoItem.getCategoryId() == sCategoryId || oTodoItem.isAdder())
        		{
        			oTodoItem.getElement().remove();
        		}
        		else
        		{
        			pNewActiveItems.push(oTodoItem);
        		}
        	}
        	
        	return pNewActiveItems;
        }
        
        TodoList.prototype.onCategoryLoaded = function( mCallbackData )
        {
        	var sCategoryId = mCallbackData.id;
        	var sColor = mCallbackData.color;
        	
        	if(!this.m_mLoadedCategories[sCategoryId]) {
        		this.m_mLoadedCategories[sCategoryId]=sColor; // dodgy stuffz, using the color as true, so i can use the color later
        	}else{
        		return;
        	}
        	
        	var mData = DataLoader.loadToDos(mCallbackData.id);
        	
        	for(var id in mData)
        	{
        		var data = mData[id];
        		
        		var oTodoItem = new TodoItem( sCategoryId, id, data.description, data.started, data.priority, data.state, data.percentage, sColor );
        		if(data.state == "active")
        		{
        			this.m_pActiveItems.push(oTodoItem);
        		}
        		else
        		{
        			this.m_pInactiveItems.push(oTodoItem);
        		}
        	}
        	
        	this.refresh();
        }
        
        TodoList.prototype.addSingleItem = function( oTodoItem )
        {
        	this.m_pInactiveItems.push(oTodoItem);
        	this.refresh();
        }
        
        TodoList.prototype.addItemsToLists = function( pItems )
        {
        	for(var key in pItems)
        	{
        		var oTodoItem = pItems[key];
        		
        		if(oTodoItem.isAdder())
        		{
        			// lose it
        			oTodoItem.getElement().remove();
        		}
        		else if(oTodoItem.getState() == "active")
        		{
        			this.m_pActiveItems.push(oTodoItem);
        		}
        		else
        		{
        			this.m_pInactiveItems.push(oTodoItem);
        		}
        	}
        	
        	this.m_pActiveItems.sort(this.sort);
        	this.m_oUICleaner.removeElements( pItems );
        	this.m_oUICleaner.addElements(this.m_eActive, this.m_pActiveItems );
        	
        	this.m_pInactiveItems.sort(this.sort);
        	
        	var mProps = this.isOnlyOneLoaded();
        	
        	if(mProps)
        	{
        		console.log("does this ever get called? - good idea to add one")
        		var oTodoAdder = new TodoItem(mProps.id, -1, "", "no", "whenever", "inactive", 0, mProps.color);
        		oTodoAdder.convertToNew();
        		this.m_pInactiveItems.push(oTodoAdder);
        	}
        	
        	this.m_oUICleaner.removeElements( this.m_pInactiveItems );
        	this.m_oUICleaner.addElements(this.m_eInactive, this.m_pInactiveItems );
        }
        
        TodoList.prototype.refresh = function()
        {
        	var pItems = [];
        	
        	for(var key in this.m_pActiveItems)
        	{
        		if(!this.m_pActiveItems[key].isDone())
    			{
        			pItems.push( this.m_pActiveItems[key] );
    			}
        		else
        		{
        			console.log("its done")
        			this.m_pActiveItems[key].getElement().remove();
        		}
        	}
        	
        	for(var key in this.m_pInactiveItems)
        	{
        		if(!this.m_pInactiveItems[key].isAdder())
        		{
        			pItems.push( this.m_pInactiveItems[key] );
        		}
        		else
        		{
        			this.m_pInactiveItems[key].getElement().remove();
        		}
        	}
        	
        	this.m_pActiveItems = [];
        	this.m_pInactiveItems = [];
        	this.addItemsToLists(pItems);
        }
        
        TodoList.prototype.sort = function( oTodoItemA, oTodoItemB)
        {
        	if(  oTodoItemA.getPriority() < oTodoItemB.getPriority() )
        	{
        		return -1;
        	}
        	else if(  oTodoItemA.getPriority() > oTodoItemB.getPriority() )
        	{
        		return 1;
        	}
        	else
        	{
        		var n = -( oTodoItemA.getPercentage() - oTodoItemB.getPercentage() );
        		return n;
        	}
        }
        
        return TodoList;
});