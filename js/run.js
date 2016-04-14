window.onload = function(){
  document.getElementById("runner").addEventListener("click", run);
};
var API;
function run(){
  var swaggerOptions = {
    "serverInfo":{
      "basePath": 'https://beta.calendar42.com/api'
    },
    "authentication":{
      "token" : "f24fd7b3f9e8461a7f36a2628880dbb560d43ae4"
    },
    "operations":{
      "Calendar_Api_get_calendars":"getCalendars",
      "Event_Subscription_Api_post_event_subscription" : "postEventSubscription",
      "Event_Subscription_Api_get_event_subscriptions" : "getEventSubscription",
      "Event_Api_post_event" : "postEvent",
      "Event_Api_get_events" : "getEvents",
      "Location_Api_get_locations" : "getLocations",
      "Position_Api_post_position" : "postPosition",
      "Search_Event_Api_search_events" : "searchEvents",
      "Service_Api_get_service_by_id" : "getServiceById",
      "User_Attendance_Api_get_attendances" : "getAttendances"
    },
    "forceParams": true,
    onReady: function(){
      console.log("The API is loaded");
      API.events.getEvents({
        params:{
          include_removed_events: false
        }
      });
    }
  };
  API = new swaggerAPI(swaggerOptions);
}
run();
