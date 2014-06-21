define(["thirdparty/jquery"],

    function(jQuery) 
    {
        var EventHub = function()
        {
        	this.m_mListeners = {};
        }
        
        EventHub.prototype.registerEvent = function( sEventName, sCallbackId, oCallback ) 
        {
        	this.ensureCapacityForEvent( sEventName );
        	
        	this.m_mListeners[sEventName][sCallbackId] = oCallback;
        }
        
        EventHub.prototype.unregisterEvent = function( sEventName, sCallbackId ) 
        {
        	delete this.m_mListeners[sEventName][sCallbackId];
        }
        
        EventHub.prototype.triggerEvent = function( sEventName, mData )
        {
        	var mCallbacks = this.m_mListeners[sEventName];
        	
        	for(var sCallbackId in mCallbacks)
        	{
        		mCallbacks[sCallbackId].onEvent(sEventName, mData);
        	}
        }
        
        EventHub.prototype.ensureCapacityForEvent = function( sEventName ) 
        {
        	if(!this.m_mListeners[sEventName])
        	{
        		this.m_mListeners[sEventName] = {};
        	}
        }
        
        if(!window.EVENT_HUB){
        	window.EVENT_HUB = new EventHub();
        }
        
        return window.EVENT_HUB;
});