# Enterprise Ranking Application


## Features
 This application allows people to review and rank companies.
 For now, all users can create, update and delete companies, but in the production version only specific 
 (administrators) users will be able to manage the companies.

The companies are public, so all the users can view all the companies.

The reviews also are public, but each user can edit or delete only its own reviews.

A user can add, edit or delete a review for each company. 
A user cannot add more tan one reviews for the same company.

The changes in the votes are reflected in company votes count and mean score.

## Run the application
You can test the implemented features with provided  frontend code.
Navigate to the `frontend` folder and tun the commands

```
npm install
npm start
``` 

Navigate to http://localhost:9000/company in your browser and proceed with the authentication

### Create a company
Click on the `Create a new Company` button, enter the required values and click on `Save`
The new item might not appear in the list immediately, due to the delay in synchronization with elastic search. 
Click on the `Refresh list` button.

### Edit a company
Click on the `Edit` button in the appropriate row in the table, edit the required values and click on `Save`

### Add images to a company
Click on the `View` button in the appropriate row in the table, then click on "Choose a File" button to open the file chooser. Once the file is selected, click on the "Upload File" button to upload it. 
The new image should appear in the images' carousel (you can click on the left or right of current image to slide). The images will also appear when the company page is reloaded.

### Delete a company
Click on the `Delete` button in the appropriate row in the table, and then click `Delete` in the confirmation popup. You might need to refresh the list to see the effect.

### View company reviews
Click on the `View` button in the appropriate row in the table, then click on "Reviews" button. The reviews page should appear with all the riews added for the selected company.

### Create or edit a review
In the Reviews page, click on the `My Review` button. The `My Review` page will display a form containing a comment and score if you already reviewed the slected company, or empty fields. Edit the comment, add a score between 1 and 5 and click on save.

### Delete your review
In the Reviews page, click on the `My Review` button. If you have an existing review for the selected company, the `Delete` button should appear. 
