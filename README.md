# Disaster-Management
Presentation: [Presesentation]()<br />
Pitch: [pitch]
## Description
1. A Victim who is affected by the disaster firstly presses the "Rescue!" button which redirects to the sign up page.
2. The Sign up page asks the user to enter his/her Mobile Number, the sign up process is done VIA OTP(One time Password) and later the location of the victim is tracked.
3. The location of the victim is verified whether it is located within the affected range, if located within, information is sent to the nearest disaster management rescue team and the victim would be rescued, else the rescue all would be ignored.
4. This application can help the authorities by locating the victims and the victims by notifying their location, ultimately rescuing the victims to safety.
## Working
* The application provides facilities like Live News Updates, Precautions, Live Map.
* The Live News webpage provides news updates on the disasters occuring currently along with general news articles using the News API.
* The Precautions webpage provides basic precautions that the victims can follow when disaster strikes.
* Live Map feature allows users to find out disaster struck areas and their effect radius, alerting the residents living within the radius ultimately saving the residents, the map is accessed by Cesium API, and the affected regions are detected by Open Weather API.