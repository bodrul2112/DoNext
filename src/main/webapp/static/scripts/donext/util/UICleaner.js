define(["thirdparty/jquery"],

    function( jQuery ) {

		//TODO: find a better name for this
        var UICleaner = function()
        {
        }
        
        UICleaner.prototype.removeElements = function( pObjectsWithGetElements )
        {
        	for(var key in pObjectsWithGetElements)
        	{
        		var oObject = pObjectsWithGetElements[key];
        		
        		this.removeSingleElement(oObject);
        	}
        }
        
        UICleaner.prototype.removeSingleElement = function( oObjectWithGetElement )
        {
        	if(oObjectWithGetElement.getElement)
    		{
    			var eElement = oObjectWithGetElement.getElement();
    			eElement.remove();
    		}
        }        
        
        UICleaner.prototype.addElements = function( eContainer, pObjectsWithGetElements )
        {
        	for(var key in pObjectsWithGetElements)
        	{
        		var oObject = pObjectsWithGetElements[key];
        		this.addSingleElement(eContainer, oObject);
        	}
        }
        
        UICleaner.prototype.addSingleElement = function( eContainer, objectWithGetElements )
        {
        	if(objectWithGetElements.getElement)
    		{
    			var eElement = objectWithGetElements.getElement();
    			eContainer.append(eElement);
    			
    			if(objectWithGetElements.postProcess)
    			{
    				objectWithGetElements.postProcess();
    			}
    		}
        }
        
        return UICleaner;
});