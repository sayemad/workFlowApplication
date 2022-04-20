# workFlowApplication
Workflow 
Specifications
Generate and insert the three action buttons (Hide Low Priority, etc.).
 You will have 3 event listeners after that refactoring.
Store the settings for those three action buttons, using either localStorage or cookies. If you use cookies, set a two week (14 day) expiration period.
When the page is loading read those stored settings and restore them, so the user's experience is persistent over time.
The data table needs to become sortable, so that clicking on any table header sorts first in ascending, then toggles to descending if clicked again. This toggling can be done as much as possible.
Implement event delegation for that click listener. That will be your fourth and final event listener. Be sure to prevent the href value from changing the URL.
When the user has toggled the sort order, store that selection using either localStorage or cookies (with a 14 day expiration).
If there is no stored setting for sort order, default to ID ascending.
Keep in mind that you can examine (and delete) cookies and localStorage values via the Developer Tools in the browser.
When implementing the sorting, use the array object's sort() and reverse() methods. Sorting the ID column will require a custom sort function, which is:
arrayToSort.sort(function (num1,num2) {  
  return num1 - num2;
});
If that is not used, the sorting of the numbers will not be accurate (to test this out, bump an ID number above 100 and see if the sorting for that column is still accurate). If this is not set up properly, the 100+ value will sort as lower than all the others because it begins with a 1.
Since we are now linking up the table headers, wrap their text in anchors and use the following CSS, or something similar to it:
th a {color: #fff; display: block; text-decoration: none;}
th a:visited {color: #fff;}
.upArrow a {padding-left: 20px; background: url(../i/up-arrow.png) bottom left no-repeat;}
.downArrow a {padding-left: 20px; background: url(../i/down-arrow.png) bottom left no-repeat;}
Note that the background images are being applied to the anchors.
As you reload the page and your stored sort column/order is applied, you may see some of the rows shift in their placement. This is fine. Rows are re-ordering as you go through various sorting scenarios, and the original source code order of the rows may differ. Your sorting is working, but because the rows began in a different sequence they could move when you reload the page.
The table sorting should not have any conflicts with the functionality from Project 1. For example, hidden rows should still be sorted properly.
Call the JSON file that was provided and generate the 'Recent Changes' sidebar list, so that it matches what was in Project 1's hard-coded HTML. Provide a noscript tag above that content indicating 'Recent changes data could not be retrieved.'; we have that in the event that JavaScript is not working.
The findTarget() function and the function that makes the XHR call are best thought of as "utility" functions, which really belong in their own utility class. Create a separate class for them. This is a case where static methods make sense, as the functions will get called from various other classes. In practice, we would put this in its own separate JS file and load it on every page, but for our purposes keep everything in a single JS file. We will also not be wrapping our code in an anonymous function.
