### Web Development Python Django Framework Search Management System 

Author: Zihan Guo
Last Modified Date: 12/12/2016 

#### Technology used: 
1. Django
2. Ajax
3. JQuery
4. SQLite3

#### Services
1. Initialize/Load entries from DB. 
2. Add entry. 
3. Update entry.
4. Delete entry. 
5. Search an item in the database.

#### About Search 
To search an item, a user may enter keywords in the following format. 
"""
attributeValue1,attributeName1:attributeValue2,attributeName2:[valueLowerBo
undary-valueUpperBoundary]
"""

For example, a user type in the following keywords in the search box: <br>
“Porter Hall,DrawingID:Port_001,ConstructedYear:[1990-2000]”

***There are several rules for keywords***

1. Attributes are separated by ","
2. Each attribute and its name is seprated by ":"
3. An attribute can be entered by itself or with a value. 
4. An attribute can have a range of values. e.g. "ConstructedYear:[1990-2000]"
