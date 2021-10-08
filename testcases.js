// TestCase : 1 -->  GET : localhost:9000/


pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("clusterName");
    pm.expect(pm.response.text()).to.include("clusterRegion");
    pm.expect(pm.response.text()).to.include("machines");
    pm.expect(pm.response.text()).to.include("name");
     pm.expect(pm.response.text()).to.include("ipaddress");
      pm.expect(pm.response.text()).to.include("instance-type");
       pm.expect(pm.response.text()).to.include("tags");  
});

// TestCase : 2 -->  POST : localhost:9000/

req.body = {
    "clusterName":"C5",
    "clusterRegion":"asia-west1",
    "machines":[]
}

pm.test("Successful POST request", function () {
    pm.expect(pm.response.code).to.be.oneOf([201, 202]);

});
pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include('{"message":"data created"}');
});

// TestCase : 3 -->  DELETE : localhost:9000/delete/:clusterName

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include('{"message":"item deleted"}');
});

// TestCase : 4 -->  PUT : localhost:9000/machines

req.body = {
    "clusterName":"C2",
    "machines":{
        "name":"M2",
        "ipaddress":"191.01.07.1",
        "instance-type":"EC2",
        "tags":"start"
        
    }

}

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include('{"message":"DATA UPDATED"}');
});

// TestCase : 5 -->  PUT : localhost:9000/machines/tags/:clusterName/:machinename


req.body ={
    "tags":"stop"
} 


pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include('{"message":"tag updated"}');
});

// TestCase : 6 -->  DELETE : localhost:9000/machines/delete/:clusterName/:machinename

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include('{"message":"item deleted"}');
});


// TestCase : 7 -->  GET : localhost:9000/machines/tags/:tags

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("data");
     pm.expect(pm.response.text()).to.include("clusterName");
      pm.expect(pm.response.text()).to.include("clusterRegion");
       pm.expect(pm.response.text()).to.include("machines");
        pm.expect(pm.response.text()).to.include("name");
         pm.expect(pm.response.text()).to.include("ipaddress");
          pm.expect(pm.response.text()).to.include("instance");
           pm.expect(pm.response.text()).to.include("tags");
});