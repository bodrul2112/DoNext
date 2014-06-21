
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
        	
        	EventHub.registerEvent("onCategoryClicked", this.m_sCallbackId, this );
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
        	var mData = DataLoader.loadToDos(mCallbackData.id);
        	var sColor = mCallbackData.color;
        	
        	for(var id in mData)
        	{
        		var data = mData[id];
        		
        		var oTodoItem = new TodoItem( data.description, data.started, data.priority, data.state, data.percentage, sColor );
        		if(data.state == "active")
        		{
        			this.m_pActiveItems.push(oTodoItem);
        		}
        		else
        		{
        			this.m_pInactiveItems.push(oTodoItem);
        		}
        	}
        	
        	this.m_oUICleaner.addElements(this.m_eInactive, this.m_pInactiveItems );
        	
        }
        
        return TodoList;
});