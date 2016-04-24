window.onload = function(){
  document.getElementById("runner").addEventListener("click", run);
};
var API;
function run(){
  var swaggerOptions = {
    "serverInfo":{
      "basePath": 'https://dev02.calendar42.com/api'
    },
    "Authorization":{
      "token" : local_settings.API_token
    },
    "operations":{
      "Calendar_Api_get_calendars":"getCalendars",
      "Calendar_Api_post_calendars":"postCalendar",
      "Event_Subscription_Api_post_event_subscription" : "postEventSubscription",
      "Event_Subscription_Api_get_event_subscriptions" : "getEventSubscription",
      "Event_Api_post_event" : "postEvent",
      "Event_Api_get_events" : "getEvents",
      "Event_Api_patch_event" : "patchEvent",
      "Location_Api_get_locations" : "getLocations",
      "Position_Api_post_position" : "postPosition",
      "Search_Event_Api_search_events" : "searchEvents",
      "Service_Api_get_service_by_id" : "getServiceById",
      "User_Attendance_Api_get_attendances" : "getAttendances"
    },
    "forceParams": true,
    onReady: function(){
      // To run whatever is required only when the API is loaded should be done here
      console.log("The API is loaded");
      API.events.getEvents({
        params:{
          include_removed_events: false
        }
      });
      API.events.patchEvent({
        params:{
          // In the case the url contains "in_url" params is important to add it to the params. If not it will be left as the "key"
          id: "event_id"
        }
      });
    }
  };
  API = new openAPIJS(swaggerOptions);
}
run();
