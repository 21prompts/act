Current and forecasts weather data

To get access to current weather, minute forecast for 1 hour, hourly forecast for 48 hours, daily forecast for 8 days and government weather alerts, please use this section of the documentation.

If you are interested in other functionality on One Call API 3.0, please check Product concept to follow the right section.
How to make an API call

API call
https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
Parameters
lat 	required 	Latitude, decimal (-90; 90). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
lon 	required 	Longitude, decimal (-180; 180). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
appid 	required 	Your unique API key (you can always find it on your account page under the "API key" tab)
exclude 	optional 	By using this parameter you can exclude some parts of the weather data from the API response. It should be a comma-delimited list (without spaces).

Available values:

    current
    minutely
    hourly
    daily
    alerts

units 	optional 	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
lang 	optional 	You can use the lang parameter to get the output in your language. Learn more

Example of API call

Before making an API call, please note, that One Call 3.0 is included in the "One Call by Call" subscription only. Learn more

If you you want to exclude some parts of the weather data from the API response please add exclude parameter to the API call like in the example below:
https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}

If you do not need to exclude any of the weather data from the API response please use API call like in the example below:
https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid={API key}

Example of API response
Example of API response

                
{
   "lat":33.44,
   "lon":-94.04,
   "timezone":"America/Chicago",
   "timezone_offset":-18000,
   "current":{
      "dt":1684929490,
      "sunrise":1684926645,
      "sunset":1684977332,
      "temp":292.55,
      "feels_like":292.87,
      "pressure":1014,
      "humidity":89,
      "dew_point":290.69,
      "uvi":0.16,
      "clouds":53,
      "visibility":10000,
      "wind_speed":3.13,
      "wind_deg":93,
      "wind_gust":6.71,
      "weather":[
         {
            "id":803,
            "main":"Clouds",
            "description":"broken clouds",
            "icon":"04d"
         }
      ]
   },
   "minutely":[
      {
         "dt":1684929540,
         "precipitation":0
      },
      ...
   ],
   "hourly":[
      {
         "dt":1684926000,
         "temp":292.01,
         "feels_like":292.33,
         "pressure":1014,
         "humidity":91,
         "dew_point":290.51,
         "uvi":0,
         "clouds":54,
         "visibility":10000,
         "wind_speed":2.58,
         "wind_deg":86,
         "wind_gust":5.88,
         "weather":[
            {
               "id":803,
               "main":"Clouds",
               "description":"broken clouds",
               "icon":"04n"
            }
         ],
         "pop":0.15
      },
      ...
   ],
   "daily":[
      {
         "dt":1684951200,
         "sunrise":1684926645,
         "sunset":1684977332,
         "moonrise":1684941060,
         "moonset":1684905480,
         "moon_phase":0.16,
         "summary":"Expect a day of partly cloudy with rain",
         "temp":{
            "day":299.03,
            "min":290.69,
            "max":300.35,
            "night":291.45,
            "eve":297.51,
            "morn":292.55
         },
         "feels_like":{
            "day":299.21,
            "night":291.37,
            "eve":297.86,
            "morn":292.87
         },
         "pressure":1016,
         "humidity":59,
         "dew_point":290.48,
         "wind_speed":3.98,
         "wind_deg":76,
         "wind_gust":8.92,
         "weather":[
            {
               "id":500,
               "main":"Rain",
               "description":"light rain",
               "icon":"10d"
            }
         ],
         "clouds":92,
         "pop":0.47,
         "rain":0.15,
         "uvi":9.23
      },
      ...
   ],
    "alerts": [
    {
      "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
      "event": "Small Craft Advisory",
      "start": 1684952747,
      "end": 1684988747,
      "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
      "tags": [

      ]
    },
    ...
  ]
                
              

Fields in API response
If you do not see some of the parameters in your API response it means that these weather phenomena are just not happened for the time of measurement for the city or location chosen. Only really measured or calculated data is displayed in API response.

    lat Latitude of the location, decimal (−90; 90)
    lon Longitude of the location, decimal (-180; 180)
    timezone Timezone name for the requested location
    timezone_offset Shift in seconds from UTC
    current Current weather data API response
        current.dt Current time, Unix, UTC
        current.sunrise Sunrise time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        current.sunset Sunset time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        current.temp Temperature. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        current.feels_like Temperature. This temperature parameter accounts for the human perception of weather. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        current.pressure Atmospheric pressure on the sea level, hPa
        current.humidity Humidity, %
        current.dew_point Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit
        current.clouds Cloudiness, %
        current.uvi Current UV index.
        current.visibility Average visibility, metres. The maximum value of the visibility is 10 km
        current.wind_speed Wind speed. Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        current.wind_gust (where available) Wind gust. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        current.wind_deg Wind direction, degrees (meteorological)
        current.rain
            current.rain.1h (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
        current.snow
            current.snow.1h (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
        current.weather
            current.weather.id Weather condition id
            current.weather.main Group of weather parameters (Rain, Snow etc.)
            current.weather.description Weather condition within the group (full list of weather conditions). Get the output in your language
            current.weather.icon Weather icon id. How to get icons
    minutely Minute forecast weather data API response
        minutely.dt Time of the forecasted data, unix, UTC
        minutely.precipitation Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
    hourly Hourly forecast weather data API response
        hourly.dt Time of the forecasted data, Unix, UTC
        hourly.temp Temperature. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        hourly.feels_like Temperature. This accounts for the human perception of weather. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        hourly.pressure Atmospheric pressure on the sea level, hPa
        hourly.humidity Humidity, %
        hourly.dew_point Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        hourly.uvi UV index
        hourly.clouds Cloudiness, %
        hourly.visibility Average visibility, metres. The maximum value of the visibility is 10 km
        hourly.wind_speed Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour.How to change units used
        hourly.wind_gust (where available) Wind gust. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        hourly.wind_deg Wind direction, degrees (meteorological)
        hourly.pop Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
        hourly.rain
            hourly.rain.1h (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
        hourly.snow
            hourly.snow.1h (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
        hourly.weather
            hourly.weather.id Weather condition id
            hourly.weather.main Group of weather parameters (Rain, Snow etc.)
            hourly.weather.description Weather condition within the group (full list of weather conditions). Get the output in your language
            hourly.weather.icon Weather icon id. How to get icons
    daily Daily forecast weather data API response
        daily.dt Time of the forecasted data, Unix, UTC
        daily.sunrise Sunrise time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        daily.sunset Sunset time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        daily.moonrise The time of when the moon rises for this day, Unix, UTC
        daily.moonset The time of when the moon sets for this day, Unix, UTC
        daily.moon_phase Moon phase. 0 and 1 are 'new moon', 0.25 is 'first quarter moon', 0.5 is 'full moon' and 0.75 is 'last quarter moon'. The periods in between are called 'waxing crescent', 'waxing gibbous', 'waning gibbous', and 'waning crescent', respectively. Moon phase calculation algorithm: if the moon phase values between the start of the day and the end of the day have a round value (0, 0.25, 0.5, 0.75, 1.0), then this round value is taken, otherwise the average of moon phases for the start of the day and the end of the day is taken
        summaryHuman-readable description of the weather conditions for the day
        daily.temp Units – default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
            daily.temp.morn Morning temperature.
            daily.temp.day Day temperature.
            daily.temp.eve Evening temperature.
            daily.temp.night Night temperature.
            daily.temp.min Min daily temperature.
            daily.temp.max Max daily temperature.
        daily.feels_like This accounts for the human perception of weather. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
            daily.feels_like.morn Morning temperature.
            daily.feels_like.day Day temperature.
            daily.feels_like.eve Evening temperature.
            daily.feels_like.night Night temperature.
        daily.pressure Atmospheric pressure on the sea level, hPa
        daily.humidity Humidity, %
        daily.dew_point Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        daily.wind_speed Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        daily.wind_gust (where available) Wind gust. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        daily.wind_deg Wind direction, degrees (meteorological)
        daily.clouds Cloudiness, %
        daily.uvi The maximum value of UV index for the day
        daily.pop Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
        daily.rain (where available) Precipitation volume, mm. Please note that only mm as units of measurement are available for this parameter
        daily.snow (where available) Snow volume, mm. Please note that only mm as units of measurement are available for this parameter
        daily.weather
            daily.weather.id Weather condition id
            daily.weather.main Group of weather parameters (Rain, Snow etc.)
            daily.weather.description Weather condition within the group (full list of weather conditions). Get the output in your language
            daily.weather.icon Weather icon id. How to get icons
    alerts National weather alerts data from major national weather warning systems
        alerts.sender_name Name of the alert source. Please read here the full list of alert sources
        alerts.event Alert event name
        alerts.start Date and time of the start of the alert, Unix, UTC
        alerts.end Date and time of the end of the alert, Unix, UTC
        alerts.description Description of the alert
        alerts.tags Type of severe weather

National weather alerts are provided in English by default.
Please note that some agencies provide the alert’s description only in a local language.
Weather data for timestamp

To learn about how get access to weather data for any timestamp from 1st January 1979 till 4 days ahead forecast, please use this section of the documentation.

If you are interested in other functionality on One Call API 3.0, please check Product concept to follow the right section.
How to make an API call

API call
https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
Parameters
lat 	required 	Latitude, decimal (-90; 90). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
lon 	required 	Longitude, decimal (-180; 180). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
dt 	required 	Timestamp (Unix time, UTC time zone), e.g. dt=1586468027. Data is available from January 1st, 1979 till 4 days ahead
appid 	required 	Your unique API key (you can always find it on your account page under the "API key" tab)
units 	optional 	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
lang 	optional 	You can use the lang parameter to get the output in your language. Learn more
Please note that the one API response contains weather data for only one specified timestamp.

Example of API call

Before making an API call, please note, that One Call 3.0 is included in the "One Call by Call" subscription only. Learn more
https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=39.099724&lon=-94.578331&dt=1643803200&appid={API key}

Example of API response
Example of API response

                   
  {
  "lat": 52.2297,
  "lon": 21.0122,
  "timezone": "Europe/Warsaw",
  "timezone_offset": 3600,
  "data": [
    {
      "dt": 1645888976,
      "sunrise": 1645853361,
      "sunset": 1645891727,
      "temp": 279.13,
      "feels_like": 276.44,
      "pressure": 1029,
      "humidity": 64,
      "dew_point": 272.88,
      "uvi": 0.06,
      "clouds": 0,
      "visibility": 10000,
      "wind_speed": 3.6,
      "wind_deg": 340,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ]
    }
  ]
}
                   
                 

Fields in API response
If you do not see some of the parameters in your API response it means that these weather phenomena are just not happened for the time of measurement for the city or location chosen. Only really measured or calculated data is displayed in API response.

    lat Latitude of the location, decimal (−90; 90)
    lon Longitude of the location, decimal (-180; 180)
    timezone Timezone name for the requested location
    timezone_offset Shift in seconds from UTC
    data
        data.dt Requested time, Unix, UTC
        data.sunrise Sunrise time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        data.sunset Sunset time, Unix, UTC. For polar areas in midnight sun and polar night periods this parameter is not returned in the response
        data.temp Temperature. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        data.feels_like Temperature. This accounts for the human perception of weather. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        data.pressure Atmospheric pressure on the sea level, hPa
        data.humidity Humidity, %
        data.dew_point Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit.
        data.clouds Cloudiness, %
        data.uvi UV index. Please pay attention that historical UV index data available only for 5 days back. If you would like to get historical UVI index data starting from 20th September 2020 please contact us
        data.visibility Average visibility, metres. The maximum value of the visibility is 10 km
        data.wind_speed Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        data.wind_gust (where available) Wind gust. Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
        data.wind_deg Wind direction, degrees (meteorological)
        data.weather
            data.weather.id Weather condition id
            data.weather.main Group of weather parameters (Rain, Snow etc.)
            data.weather.description Weather condition within the group (full list of weather conditions). Get the output in your language
            data.weather.icon Weather icon id. How to get icons
        data.rain (where available)
            1h Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
        data.snow(where available)
            1h Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter

Daily Aggregation

To learn about how get access to aggregated weather data for a particular date from 2nd January 1979 till long-term forecast for 1,5 years ahead, please use this section of the documentation.

If you are interested in other functionality on One Call API 3.0, please check Product concept to follow the right section.
How to make an API call

API call
https://api.openweathermap.org/data/3.0/onecall/day_summary?lat={lat}&lon={lon}&date={date}&appid={API key}
Parameters
lat 	required 	Latitude, decimal (-90; 90)
lon 	required 	Longitude, decimal (-180; 180)
date 	required 	Date in the `YYYY-MM-DD` format for which data is requested. Date is available for 46+ years archive (starting from 1979-01-02) up to the 1,5 years ahead forecast to the current date
appid 	required 	Your unique API key (you can always find it on your account page under the "API key" tab)
units 	optional 	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
lang 	optional 	You can use the lang parameter to get the output in your language. Learn more
If the service detected timezone for your location incorrectly you can specify correct timezone manually by adding tz parameter in the ±XX:XX format to API call.

API call
https://api.openweathermap.org/data/3.0/onecall/day_summary?lat={lat}&lon={lon}&date={date}&tz={tz}&appid={API key}

Example of API call
https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=60.45&lon=-38.67&date=2023-03-30&tz=+03:00&appid={API key}
Please pay attention that in case timezone is specified time of afternoon, night, evening, morning temperatures, pressure, humidity will be returned in accordance with this specified timezone.

Example of API call

Before making an API call, please note, that One Call 3.0 is included in the "One Call by Call" subscription only. Learn more
https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=39.099724&lon=-94.578331&date=2020-03-04&appid={API key}

Example of API response
Example of API response

                   
  {
   "lat":33,
   "lon":35,
   "tz":"+02:00",
   "date":"2020-03-04",
   "units":"standard",
   "cloud_cover":{
      "afternoon":0
   },
   "humidity":{
      "afternoon":33
   },
   "precipitation":{
      "total":0
   },
   "temperature":{
      "min":286.48,
      "max":299.24,
      "afternoon":296.15,
      "night":289.56,
      "evening":295.93,
      "morning":287.59
   },
   "pressure":{
      "afternoon":1015
   },
   "wind":{
      "max":{
         "speed":8.7,
         "direction":120
      }
   }
}                
                 

Fields in API response

    lat Latitude of the location, decimal (−90; 90)
    lon Longitude of the location, decimal (-180; 180)
    tz Timezone in the ±XX:XX format
    date Date specified in the API request in the `YYYY-MM-DD` format (from 1979-01-02 up to the 1,5 years ahead forecast)
    units Units of measurement specified in the request. Learn more
    cloud_cover Cloud related information
        afternoon Cloud cover at 12:00 for the date specified in the request, %
    humidity Humidity related information
        afternoon Relative humidity at 12:00 for the date specified in the request, %
    precipitation Precipitation related information
        total Total amount of liquid water equivalent of precipitation for the date specified in the request, mm
    pressure Atmospheric pressure related information
        afternoon Atmospheric pressure at 12:00 for the date specified in the request, hPa
    temperature Temperature related information
        min Minimum temperature for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        max Maximum temperature for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        afternoon Temperature at 12:00 for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        night Temperature at 00:00 for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        evening Temperature at 18:00 for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
        morning Temperature at 06:00 for the date specified in the request. Units - default: kelvin, metric: Celsius, imperial: Fahrenheit. How to change units used
    wind Wind speed related information
        max Maximum wind speed related information
            speed Maximum wind speed for the date specified in the request. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour. How to change units used
            direction Wind cardinal direction relevant to the maximum wind speed, degrees (meteorological)

Weather overview

This section describes how to get weather overview with a human-readable weather summary for today and tomorrow's forecast, utilizing OpenWeather AI technologies.

If you are interested in other functionality on One Call API 3.0, please check Product concept to follow the right section.
How to make an API call

API call
https://api.openweathermap.org/data/3.0/onecall/overview?lat={lat}&lon={lon}&appid={API key}
Parameters
lat 	required 	Latitude, decimal (-90; 90)
lon 	required 	Longitude, decimal (-180; 180)
appid 	required 	Your unique API key (you can always find it on your account page under the "API key" tab)
date 	optional 	The date the user wants to get a weather summary in the YYYY-MM-DD format. Data is available for today and tomorrow. If not specified, the current date will be used by default. Please note that the date is determined by the timezone relevant to the coordinates specified in the API request
units 	optional 	Units of measurement. Standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more

Example of API call
https://api.openweathermap.org/data/3.0/onecall/overview?lon=-11.8092&lat=51.509865&appid={API key}
Example of API response

                   
{
   "lat": 51.509865,
   "lon": -0.118092,
   "tz": "+01:00",
   "date": "2024-05-13",
   "units": "metric",
   "weather_overview": "The current weather is overcast with a 
temperature of 16°C and a feels-like temperature of 16°C. 
The wind speed is 4 meter/sec with gusts up to 6 meter/sec 
coming from the west-southwest direction. 
The air pressure is at 1007 hPa with a humidity level of 79%. 
The dew point is at 12°C and the visibility is 10000 meters. 
The UV index is at 4, indicating moderate risk from the 
sun's UV rays. 
The sky is covered with overcast clouds, and there is 
no precipitation expected at the moment. 
Overall, it is a moderately cool and cloudy day 
with light to moderate winds from the west-southwest."
}          
                                       
                 

Fields in API response

    lat Latitude of the location, decimal (−90; 90)
    lon Longitude of the location, decimal (-180; 180)
    tzTimezone in the ±XX:XX format
    date Date for which summary is generated in the format YYYY-MM-DD
    units Units of measurement specified in the request
    weather_overviewAI generated weather overview for the requested date

Other features
List of weather condition codes

List of weather condition codes with icons (range of thunderstorm, drizzle, rain, snow, clouds, atmosphere etc.)
Units of measurement

standard, metric and imperial units are available.
List of all API parameters with available units.

API call
https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&units={units}
Parameters
units 	optional 	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default.
Temperature is available in Fahrenheit, Celsius and Kelvin units.

Wind speed is available in miles/hour and meter/sec.

    For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
    For temperature in Celsius and wind speed in meter/sec, use units=metric
    Temperature in Kelvin and wind speed in meter/sec is used by default, so there is no need to use the units parameter in the API call if you want this

