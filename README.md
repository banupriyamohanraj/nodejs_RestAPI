# RESTful API for managing machines in the cloud

<b><strong></strong></b>

The Tech Stack used for this repo is **Node.js and Mongo Database**
These below API enpoints allows user to create clusters,machines and add tags to them.And also delete the clusters and machines and perform operation based on the tags.
Basically APIs does everything required to manage the clusters and machines and it has been tested in _**Postman**_ application


Deployed at : https://nodejs-restapi-backend.herokuapp.com/

**API ENDPOINTS**

<b>To get all the data about clusters</b>

_DESCRIPTION :_ This GET request fetches the data about all clusters and machines information that is available in the Database

GET : localhost:9000 (or) https://nodejs-restapi-backend.herokuapp.com/


<b>To add new clusters</b>

_DESCRIPTION :_ This POST request allows the user to create a new cluster with zero machines initially.

POST : localhost:9000/add (or) https://nodejs-restapi-backend.herokuapp.com/add

<b>To Delete the cluster</b>

_DESCRIPTION :_ This DELETE request allows the user to delete the cluster based on the user requirement. The cluster name is fetched from the API params which allows the system to identify the clsuter and delete it

DELETE : localhost:9000/delete/:clusterName (or) https://nodejs-restapi-backend.herokuapp.com/delete/:clustername

<b>To add machines to cluster</b>

_DESCRIPTION:_  This PUT request allows the user to add machines to the existing cluster based on the cluster name.Only new machines can be added to cluster.Existing machines can not be added to different cluster.

PUT : localhost:9000/machines/:clusterName (or) https://nodejs-restapi-backend.herokuapp.com/machines/:clusterName

<b>_To update tags on machine_</b>

_DESCRIPTION:_  This PUT request allows the user to update tag in machines based on the user requirement of clustername and machine name.

PUT : localhost:9000/machines/tags/:clusterName/:machinename (or) https://nodejs-restapi-backend.herokuapp.com/machines/tags/:clusterName/:machinename

<b>_To delete machines from cluster_</b>

_DESCRIPTION:_ This DELETE request allows user to delete machine from the cluster of user's choice.

DELETE : localhost:9000/machines/delete/:clusterName/:machinename (or) https://nodejs-restapi-backend.herokuapp.com/machines/delete/:clusterName/:machinename

<b>_To get data based on tags_</b>

_DESCRIPTION:_ This GET request is to find out the clusters and machines which have tags as start,stop and reboot operations. For Example, If the user needs only machines that has the tags as Reboot, Then the system fetches only the reeboot machines. This request helps user to classify the tags and fetch them accordingly.

GET : localhost:9000/machines/tags/:tags (or) https://nodejs-restapi-backend.herokuapp.com/machines/tags/:tags

sample tags can be start/stop/reboot

<b>_To update multiple machines based on tags_</b>

_DESCRIPTION:_ This PUT request allows user to update the tags on multiple machines at the same time. For Example, it helps the user to stop all the machines which are rebooting and start them through same api endpoint

PUT : localhost:9000/machines/tags/:tags (or) https://nodejs-restapi-backend.herokuapp.com/machines/tags/:tags




