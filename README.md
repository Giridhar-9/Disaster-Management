# Disaster-Management
Presentation: [Presesentation](https://drive.google.com/file/d/17oz7y9aKi-klmkmNW3E9AQWbH3qL6Jd_/view?usp=sharing)<br />
Pitch: [pitch](https://drive.google.com/file/d/1loqcL9kq7z1y_xVDudjQOv6KYuAC6URx/view?usp=sharing)
## Description
1. A Victim who is affected by the disaster firstly presses the "Rescue!" button which redirects to the sign up page.
2. The Sign up page asks the user to enter his/her Mobile Number, the sign up process is done VIA OTP(One time Password) and later the location of the victim is tracked.
3. The location of the victim is verified whether it is located within the affected range, if located within, information is sent to the nearest disaster management rescue team and the victim would be rescued, else the rescue all would be ignored.
4. This application can help the authorities by locating the victims and the victims by notifying their location, ultimately rescuing the victims to safety.
5. The location of the victim is stored online in firebase online database, and the authorities can check the location and send help.
## Working
* The application provides facilities like Live News Updates, Precautions, Live Map.
* The Live News webpage provides news updates on the disasters occuring currently along with general news articles using the News API.
* The search bar helps the user to get the required news.
* The Precautions webpage provides basic precautions that the victims can follow when disaster strikes.
* Live Map feature allows users to find out disaster struck areas and their effect radius, alerting the residents living within the radius ultimately saving the residents, the map is accessed by Cesium API, and the affected regions are detected by Open Weather API.
* The GPS button when pressed automatically redirects the map to the user's coordinates given that he/she gave access of their location.
* The Rescue button allows the users to request for help and their location is stored in the firebase online database.
* The user can send the request only if the OTP based authentication done by firebase is a success, else the request would be discarded.
* The live map also provides live disaster rendering which provides the details of the disaster and its extent making the residents aware.
## Instruction
* The user must enter his/her mobile number and make sure that it is correct.
* The user should make sure that he/she gives the access of his/her location to make sure that their corresponding location is successfully sent to the database.
