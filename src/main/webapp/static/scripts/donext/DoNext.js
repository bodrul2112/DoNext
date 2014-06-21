
define(["thirdparty/jquery", 
        "donext/util/UICleaner", 
        "donext/category/Categories",
        "donext/todo/TodoList"], function( jQuery, UICleaner, Categories, TodoList ) {

        var DoNext = function()
        {
        	this.m_oCategories = new Categories()
        	this.m_oUICleaner = new UICleaner();
        	this.m_oTodoList = new TodoList();
        	
        	this.m_eWrapper = $('.main_wrapper');
        	
        	this.m_oUICleaner.addSingleElement( this.m_eWrapper, this.m_oCategories);
        	this.m_oUICleaner.addSingleElement( this.m_eWrapper, this.m_oTodoList);
        	
        	this.m_oCategories.loadData();
        	
        }
        
        return DoNext;
});