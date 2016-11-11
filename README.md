# Serverless App with AWS Lambda 

#### Intro
This project will require that you have an Amazon AWS account created. If you do not have one you can go here https://aws.amazon.com/console/
and sign up for a new account. The account is free, but you will need a credit card to create your account.

##### What is Serverless, and what is Lambda?
Serverless is a new cloud computing trend that changes the way you think about writing and maintaining applications

##### FaaS - (Lambda) Function as a Service
Lambda is a Function-as-a-Service (FaaS) platform provided by Amazon Web Services (AWS). 
Lambda is tightly integrated into the AWS ecosystem and allows developers to build microservices that easily interact with other AWS services. 
Combining Lambda with the API Gateway, we can build microservices that can be accessed from outside the AWS ecosystem.

Function-as-a-Service or serverless platforms are gaining traction because they allow developers to 
build applications without focusing on infrastructure.


##### AWS Ecosystem
Since this project is serverless, it will not just run 'out of the box'. It will depend on your own API Keys in your AWS Account that
have the services that you will define. This is a functioning project that you can use as a template to test your AWS Services once
everything is deployed.
We'll use Node.js to write our Lambda microservices, and API Gateway will allow us to expose the Lambda functions we write to the Web. 
DynamoDB will be our database of choice for storing the information that our Lamba function will access.

##### The following direction is taken from the auth0 Servless App with Lamba tutorial - very good read for setting up AWS.
##### 1. Setup Database
The first thing we'll do is create our database. DynamoDB is a NoSQL database offered by AWS that works nicely with Lambda.
Head over to the DynamoDB homepage and click on the Create table button. This example will use a table called 'Users'.
Select the Use default settings checkbox as the defaults should be more than enough for our simple use case. 
Finally, click the Create table button and you should be good to go.
Don't forget to add some data to your table so you have some data to work with.

##### 2. Creating the AWS Lambda Functions
You export a function that accepts multiple parameters that help set the context of the request. 
Within the function, you write your implementation. To complete the operation, you call the callback function 
and pass into it data you would like to respond with.

Let's implement our first function. Navigate to the Lambda homepage in the AWS dashboard and create a new Lambda function. 
Click the next button to create an empty Lambda function. We will be creating "getUsers" and "createUser" functions here.
We'll have to configure a few more settings before we're ready to write code. Here, set the name the Lambda function, 
for the runtime select Node 4.3, and the rest of the settings can be left to their default state. Before moving on, 
set the role to "Choose Existing Role" and from here you should have the option to select "server-role/admin". 
This will give the Lambda function the ability to call and execute code from various AWS services such as DynamoDB. 
Not setting the role properly will cause your errors in your Lambda function. The permission we granted here are very liberal. 
In a real application, you would want to set narrower permissions to ensure that the code has access to only the parts of your 
infrastructure that it needs.
We will make use of the AWS SDK which will allow us to easily interact with other AWS services within our code.
Don't forget to Test your function before continuing to make sure it is setup correctly.

##### 3. Expose AWS Lambda Functions with API Gateway
We have our Lambda functions created, but at the moment they are of little use to our serverless app. 
We cannot access them outside the AWS ecosystem, so let's change that by exposing our functions via the AWS API Gateway service. 
API Gateway allows us to expose our Lambda functions and access them over HTTP like any other RESTful API.

To create a new API, navigate to the API Gateway dashboard in the AWS dashboard. 
From here, click the New API button and fill in the form. This will create our API. 
##### POST Method endpoint
Now, we'll add our POST method. 
Under the Resources tab, click the Actions button and select the Create Resource option. 
Name the resource "user" and press the save button. Next, add a POST method to this resource by clicking
the Actions button again and selecting Create Method. From the dropdown, select POST.
You will be given an option on the type of integration you want. Here we'll select Lambda Function and choose our 
"createUser" function. Clicking the Save button will create our endpoint. The final thing we'll need to do is create 
a body mapping template so that we can pass the data we receive in the body of the request to our Lambda function. 
To do this, click on the Integration Request of our POST method, then click the Add Mapping Template.
We'll create an application/json template and in the provided textarea paste the following:
{
  "body" : $input.json('$')
}
Hit Save and you're done.

##### GET Method endpoint
The users endpoint will follow much of the same process. Create the /users endpoint and this time add a GET method. 
We won't need to add a mapping template, but we will require the user to be authenticated before they can access the 
Lambda function associated with the endpoint. Once you've created the endpoint and added the GET method, click on the 
Method Request box. Here, select "AWS_IAM" from the dropdown. This will ensure that only authenticated users can call 
this method and get the data, all others will see an error message.

##### CORS
Since we'll be accessing these API's from a different domain than the API endpoint, 
we'll need to enable Cross-Origin Resource Sharing (CORS). This can be accomplished by selecting a route in the API Gateway, 
clicking the Actions button, and selecting Enable CORS. Do this for both of the routes.
With our API Gateway implementation complete, let's export our API so that we can use it in our application. 
Click on the Actions button and select Deploy API. The default stage name will be "prod". Within a few seconds your 
API will be available. Any time you make a change to your API, you will need to redeploy it following this process. 
Now click on the SDK Generation tab and select "JavaScript" from the dropdown. 

##### 4. SDK Generation
Click the Generate SDK button and a zip file will download with your SDK. Save this file for now, we'll be using it 
later when implementing the API into our app.

##### 5. Adding Serverless to our app
We are finally ready to start implementing our Lambda functions in our serverless app. 
There are many JavaScript libraries that will be required for our app to work with the AWS services 
so I strongly recommend you pull down the code from the GitHub repo.

##### Go into your project
Unzip the file that we downloaded earlier (apiGateway-js-sdk.zip) containing our JavaScript SDK. 
The unzipped folder will contain many of the libraries you'll need. 
You will see that the apigClient.js contains code specific to your API Gateway API. 
Look at the public/README file in the unzipped directory to see what was generated from the API Gateway SDK generation.
I used parts of that file to create the serverless.html file you see that will use all of the generated JS libraries
in the /lib directory. Then I added the necessary HTML to view our results of using the "/users" and /"user" API from
our Node application.
This was a very quick and easy way to use our generated JS API calls from AWS inside a simple application that
relies completely on the serverless functionality that we built with Lambda, AWS Dynamo, and the API Gateway.
You now have a serverless application with very minimal upkeep and coding that mostly resides in AWS.

I also added a local 'lambda' directory to keep our AWS Lamba Functions in so we can locally modify and update as needed.